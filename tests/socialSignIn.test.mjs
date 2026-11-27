import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {generateKeyPair,SignJWT} from 'jose';
import {availableSocialProviders,socialConfig,safeAccountNext} from '../lib/socialConfig.mjs';
import {authorizationUrl,verifiedOidcSubject,verifiedFacebookSubject} from '../lib/socialOAuth.mjs';
process.env.CUSTOMER_DB_PATH=join(mkdtempSync(join(tmpdir(),'stv-social-')),'test.sqlite');
const store=await import('../lib/socialStore.mjs');
const customers=await import('../lib/customerStore.mjs');
const env={SOCIAL_LOGIN_ENABLED:'1',CUSTOMER_STORAGE_READY:'1',APP_ORIGIN:'https://stvcentral.com',GOOGLE_CLIENT_ID:'test-client',GOOGLE_CLIENT_SECRET:'test-secret',FACEBOOK_CLIENT_ID:'fb-client',FACEBOOK_CLIENT_SECRET:'fb-secret',FACEBOOK_GRAPH_VERSION:'v27.0',APPLE_CLIENT_ID:'apple-client',APPLE_TEAM_ID:'team',APPLE_KEY_ID:'key',APPLE_PRIVATE_KEY:'test-key'};
test('social login is hidden until explicitly configured with persistent storage and HTTPS',()=>{
 assert.equal(availableSocialProviders({}).length,0);
 assert.equal(availableSocialProviders({...env,CUSTOMER_STORAGE_READY:'0'}).length,0);
 assert.equal(availableSocialProviders({...env,APP_ORIGIN:'http://stvcentral.com'}).length,0);
 assert.equal(availableSocialProviders({...env,GOOGLE_CLIENT_SECRET:''}).length,2);
 assert.equal(availableSocialProviders(env).length,3);
 for(const next of ['//evil.test','https://evil.test','/song/../owner','/playlist?next=//evil','/\\evil'])assert.equal(safeAccountNext(next),'/collection');
 assert.equal(safeAccountNext('/playlist'),'/playlist');
});
test('authorization requests bind nonce, state, exact callback and PKCE without requesting email',()=>{
 const attempt={state:'state',nonce:'nonce',verifier:'secret-verifier'};
 const url=authorizationUrl('google',attempt,env);
 assert.equal(url.origin,'https://accounts.google.com');assert.equal(url.searchParams.get('scope'),'openid');
 assert.equal(url.searchParams.get('redirect_uri'),'https://stvcentral.com/api/social/google/callback');
 assert.equal(url.searchParams.get('nonce'),'nonce');assert.equal(url.searchParams.get('state'),'state');
 assert.equal(url.searchParams.get('code_challenge_method'),'S256');assert.notEqual(url.searchParams.get('code_challenge'),attempt.verifier);
 assert.equal(authorizationUrl('apple',attempt,env).searchParams.get('response_mode'),'form_post');
});
test('OIDC rejects wrong audience, nonce, issuer, expired or tampered tokens',async()=>{
 const {privateKey,publicKey}=await generateKeyPair('RS256');
 const sign=(claims={})=>new SignJWT({sub:'identity',nonce:'expected',...claims}).setProtectedHeader({alg:'RS256'}).setIssuer('https://accounts.google.com').setAudience('test-client').setIssuedAt().setExpirationTime('5m').sign(privateKey);
 const good=await sign();const config=socialConfig('google',env);
 assert.equal(await verifiedOidcSubject('google',good,config,'expected',publicKey),'identity');
 await assert.rejects(verifiedOidcSubject('google',good,config,'wrong',publicKey));
 await assert.rejects(verifiedOidcSubject('google',good,{id:'other'},'expected',publicKey));
 await assert.rejects(verifiedOidcSubject('apple',good,config,'expected',publicKey));
 await assert.rejects(verifiedOidcSubject('google',await sign({azp:'attacker'}),config,'expected',publicKey));
 await assert.rejects(verifiedOidcSubject('google',good.slice(0,-20)+'invalid',config,'expected',publicKey));
 const expired=await new SignJWT({sub:'identity',nonce:'expected'}).setProtectedHeader({alg:'RS256'}).setIssuer('https://accounts.google.com').setAudience('test-client').setIssuedAt(1).setExpirationTime(2).sign(privateKey);
 await assert.rejects(verifiedOidcSubject('google',expired,config,'expected',publicKey));
});
test('Facebook identity must belong to our app and have a valid unexpired user token',()=>{
 const config=socialConfig('facebook',env),data={is_valid:true,app_id:config.id,type:'USER',user_id:'id',expires_at:Date.now()/1000+60};
 assert.equal(verifiedFacebookSubject(data,config),'id');
 for(const change of [{app_id:'other'},{is_valid:false},{expires_at:1},{type:'APP'},{user_id:null}])assert.throws(()=>verifiedFacebookSubject({...data,...change},config));
});
test('attempts are provider/browser bound, expiring, and consumed once',()=>{
 const a=store.createSocialAttempt('google','/playlist');
 assert.throws(()=>store.consumeSocialAttempt('facebook',a.state,a.browser));
 assert.throws(()=>store.consumeSocialAttempt('google',a.state,customers.token()));
 assert.equal(store.consumeSocialAttempt('google',a.state,a.browser).next,'/playlist');
 assert.throws(()=>store.consumeSocialAttempt('google',a.state,a.browser));
 const b=store.createSocialAttempt('google','/collection');customers.db().prepare('UPDATE social_attempts SET expires=0').run();
 assert.throws(()=>store.consumeSocialAttempt('google',b.state,b.browser));
});
test('stable social identities preserve collections; linking cannot take over another account',async()=>{
 const user=store.socialCustomer('google','subject-one',{},null);
 assert.equal(store.socialCustomer('google','subject-one',{},null).id,user.id);
 assert.notEqual(store.socialCustomer('apple','subject-one',{},null).id,user.id);
 await assert.rejects(customers.login(user.username,'anything'),/incorrect/);
 const session=customers.newSession(user),attempt={session:customers.digest(session)};
 const code=customers.createClaims({kind:'deck',label:'Social test',count:1})[0];customers.redeem(user,code.code);
 assert.equal(store.socialCustomer('facebook','fb-one',attempt,session).id,user.id);
 assert.equal(customers.collection(store.socialCustomer('facebook','fb-one',{},null)).length,54);
 const other=await customers.register('existing_collector','long-password-example');const otherSession=customers.newSession(other.user);
 assert.throws(()=>store.socialCustomer('google','subject-one',{session:customers.digest(otherSession)},otherSession),/another collection/);
 assert.throws(()=>store.socialCustomer('google','new-subject',attempt,otherSession),/Sign in again/);
 assert.throws(()=>store.socialCustomer('google','new-subject',{},session),/session changed/);
 customers.logout(session);assert.throws(()=>store.socialCustomer('google','new-subject',attempt,session),/Sign in again/);
});
test('Apple completion is single use and bound to the browser and original session',()=>{
 const a=store.createSocialAttempt('apple','/playlist');const attempt=store.consumeSocialAttempt('apple',a.state,a.browser);
 const ticket=store.stageAppleCompletion('apple-subject',attempt);
 assert.throws(()=>store.consumeAppleCompletion(ticket,customers.token()));
 assert.equal(store.consumeAppleCompletion(ticket,a.browser).subject,'apple-subject');
 assert.throws(()=>store.consumeAppleCompletion(ticket,a.browser));
});
