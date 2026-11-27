import {db,token,digest,CustomerError,sessionUser} from './customerStore.mjs';
import {SOCIAL_PROVIDERS,safeAccountNext} from './socialConfig.mjs';

function database() {
  const sql=db();
  sql.exec(`CREATE TABLE IF NOT EXISTS social_identities(
    provider TEXT NOT NULL, subject TEXT NOT NULL, customer TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    created INTEGER NOT NULL, PRIMARY KEY(provider,subject));
    CREATE TABLE IF NOT EXISTS social_attempts(
    state TEXT PRIMARY KEY, provider TEXT NOT NULL, browser TEXT NOT NULL, nonce TEXT NOT NULL,
    verifier TEXT NOT NULL, next TEXT NOT NULL, session TEXT, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS social_completions(ticket TEXT PRIMARY KEY, browser TEXT NOT NULL, subject TEXT NOT NULL,
    next TEXT NOT NULL, session TEXT, expires INTEGER NOT NULL);`);
  return sql;
}
export function createSocialAttempt(provider, next, session) {
  if(!SOCIAL_PROVIDERS.includes(provider))throw new CustomerError('Unknown provider.');
  const state=token(),browser=token(),nonce=token(),verifier=token()+token(),sql=database();
  sql.prepare('DELETE FROM social_attempts WHERE expires<?').run(Date.now());
  sql.prepare('INSERT INTO social_attempts VALUES(?,?,?,?,?,?,?,?)').run(digest(state),provider,digest(browser),nonce,verifier,safeAccountNext(next),session?digest(session):null,Date.now()+600000);
  return {state,browser,nonce,verifier};
}
export function consumeSocialAttempt(provider,state,browser) {
  if(typeof state!=='string'||!/^[a-f0-9]{48}$/.test(state)||typeof browser!=='string'||!/^[a-f0-9]{48}$/.test(browser))throw new CustomerError('Sign-in expired. Please try again.',400);
  const row=database().prepare('DELETE FROM social_attempts WHERE state=? AND provider=? AND browser=? AND expires>? RETURNING *').get(digest(state),provider,digest(browser),Date.now());
  if(!row)throw new CustomerError('Sign-in expired. Please try again.',400);
  return row;
}
export function stageAppleCompletion(subject,attempt) {
  const sql=database(),ticket=token();
  sql.prepare('DELETE FROM social_completions WHERE expires<?').run(Date.now());
  sql.prepare('INSERT INTO social_completions VALUES(?,?,?,?,?,?)').run(digest(ticket),attempt.browser,subject,attempt.next,attempt.session,Date.now()+60000);
  return ticket;
}
export function consumeAppleCompletion(ticket,browser) {
  if(typeof ticket!=='string'||!/^[a-f0-9]{48}$/.test(ticket)||typeof browser!=='string'||!/^[a-f0-9]{48}$/.test(browser))throw new CustomerError('Sign-in expired.');
  const row=database().prepare('DELETE FROM social_completions WHERE ticket=? AND browser=? AND expires>? RETURNING *').get(digest(ticket),digest(browser),Date.now());
  if(!row)throw new CustomerError('Sign-in expired.');return row;
}
// Only call after the provider has verified this subject. Never link by email or display name.
export function socialCustomer(provider,subject,attempt,currentSession) {
  if(!SOCIAL_PROVIDERS.includes(provider)||typeof subject!=='string'||!subject.length||subject.length>255)throw new CustomerError('Invalid identity.');
  let current=null;
  if(attempt.session) {
    if(!currentSession||digest(currentSession)!==attempt.session||!(current=sessionUser(currentSession)))throw new CustomerError('Sign in again before linking an account.',401);
  } else if(currentSession&&sessionUser(currentSession))throw new CustomerError('Your session changed. Start again.',409);
  const sql=database();sql.exec('BEGIN IMMEDIATE');
  try {
    const existing=sql.prepare('SELECT customers.id,customers.username FROM social_identities JOIN customers ON customers.id=social_identities.customer WHERE provider=? AND subject=?').get(provider,subject);
    if(existing) {
      if(current&&current.id!==existing.id)throw new CustomerError('This login already belongs to another collection.',409);
      sql.exec('COMMIT');return existing;
    }
    let user=current;
    if(!user) {
      const id=token();user={id,username:'collector_'+token().slice(0,20)};
      // Unknown random credentials keep password/recovery login impossible for social-only accounts.
      sql.prepare('INSERT INTO customers VALUES(?,?,?,?,?)').run(id,user.username,token()+':'+token()+token()+token().slice(0,32),digest(token()),Date.now());
    }
    sql.prepare('INSERT INTO social_identities VALUES(?,?,?,?)').run(provider,subject,user.id,Date.now());
    sql.exec('COMMIT');return user;
  } catch(error) {sql.exec('ROLLBACK');throw error;}
}
