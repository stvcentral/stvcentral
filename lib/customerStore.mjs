import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { randomBytes, createHash, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { songs } from '../data/songs.js';

let connection;
const derive = promisify(scrypt);
export const digest = value => createHash('sha256').update(value).digest('hex');
export const token = () => randomBytes(24).toString('hex');
export function db() {
  if (connection) return connection;
  const file = resolve(/* turbopackIgnore: true */ process.env.CUSTOMER_DB_PATH || 'runtime/customers.sqlite');
  mkdirSync(dirname(file), { recursive:true });
  connection = new DatabaseSync(file);
  connection.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS customers(id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, recovery TEXT NOT NULL, created INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions(hash TEXT PRIMARY KEY, customer TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE, expires INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS sessions_customer ON sessions(customer);
    CREATE TABLE IF NOT EXISTS claim_codes(hash TEXT PRIMARY KEY, label TEXT NOT NULL, kind TEXT NOT NULL, slugs TEXT NOT NULL, created INTEGER NOT NULL, claimed_by TEXT REFERENCES customers(id), claimed_at INTEGER, revoked INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS collection(customer TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE, slug TEXT NOT NULL, acquired INTEGER NOT NULL, revealed INTEGER, PRIMARY KEY(customer,slug));
    CREATE TABLE IF NOT EXISTS limits(key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset INTEGER NOT NULL);
    PRAGMA user_version=1;`);
  return connection;
}
export class CustomerError extends Error { constructor(message,status=400){super(message);this.status=status;} }
export function limit(key, max=12, windowMs=15*60*1000) {
  const now=Date.now(), database=db();
  database.prepare('DELETE FROM limits WHERE reset < ?').run(now);
  database.prepare('INSERT INTO limits(key,count,reset) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1').run(key,now+windowMs);
  if(database.prepare('SELECT count FROM limits WHERE key=?').get(key).count>max) throw new CustomerError('Too many attempts. Please try again in 15 minutes.',429);
}
function username(value){const name=String(value||'').trim().toLowerCase();if(!/^[a-z0-9_]{3,32}$/.test(name))throw new CustomerError('Choose a username of 3–32 letters, numbers, or underscores.');return name;}
function password(value){if(typeof value!=='string'||value.length<12||value.length>128)throw new CustomerError('Use a password between 12 and 128 characters.');return value;}
async function hashPassword(value){const salt=randomBytes(16).toString('hex');return salt+':'+(await derive(value,salt,64)).toString('hex');}
async function verifyPassword(value,stored){const [salt,hex]=stored.split(':');const result=await derive(value,salt,64);return timingSafeEqual(result,Buffer.from(hex,'hex'));}
export async function register(name,pass){
  name=username(name);pass=password(pass);
  const hash=await hashPassword(pass), recovery=token(), id=token();
  try{db().prepare('INSERT INTO customers VALUES(?,?,?,?,?)').run(id,name,hash,digest(recovery),Date.now());}
  catch(error){if(String(error.message).includes('UNIQUE'))throw new CustomerError('This username is unavailable. Choose another.');throw error;}
  return {user:{id,username:name},recovery};
}
export async function login(name,pass){
  name=username(name);if(typeof pass!=='string'||pass.length>128)throw new CustomerError('Username or password is incorrect.',401);
  limit('login:'+name,15);
  const row=db().prepare('SELECT * FROM customers WHERE username=?').get(name);
  const fallback='00000000000000000000000000000000:'+ '00'.repeat(64);
  const valid=await verifyPassword(pass,row?.password||fallback);
  if(!row||!valid)throw new CustomerError('Username or password is incorrect.',401);
  return {id:row.id,username:row.username};
}
export async function recover(name,key,pass){
  name=username(name);password(pass);limit('recover:'+name,8);
  const row=db().prepare('SELECT * FROM customers WHERE username=?').get(name);
  if(!row||typeof key!=='string'||key.length>100||!timingSafeEqual(Buffer.from(row.recovery,'hex'),Buffer.from(digest(key.trim()),'hex')))throw new CustomerError('Username or recovery code is incorrect.',401);
  const next=token(), hash=await hashPassword(pass), database=db();
  database.exec('BEGIN IMMEDIATE');
  try{const changed=database.prepare('UPDATE customers SET password=?,recovery=? WHERE id=? AND recovery=?').run(hash,digest(next),row.id,row.recovery);if(!changed.changes)throw new CustomerError('This recovery code has already been used.',409);database.prepare('DELETE FROM sessions WHERE customer=?').run(row.id);database.exec('COMMIT');}catch(e){database.exec('ROLLBACK');throw e;}
  return {user:{id:row.id,username:row.username},recovery:next};
}
export function newSession(user){const raw=token(), now=Date.now();db().prepare('DELETE FROM sessions WHERE expires<?').run(now);db().prepare('INSERT INTO sessions VALUES(?,?,?)').run(digest(raw),user.id,now+30*86400000);return raw;}
export function sessionUser(raw){if(!raw)return null;return db().prepare('SELECT customers.id,customers.username FROM sessions JOIN customers ON customers.id=sessions.customer WHERE sessions.hash=? AND sessions.expires>?').get(digest(raw),Date.now())||null;}
export function logout(raw){if(raw)db().prepare('DELETE FROM sessions WHERE hash=?').run(digest(raw));}
export function collection(user){return db().prepare('SELECT slug, acquired, revealed FROM collection WHERE customer=? ORDER BY acquired,slug').all(user.id);}
export function owns(user,slug){return Boolean(user&&db().prepare('SELECT 1 FROM collection WHERE customer=? AND slug=?').get(user.id,slug));}
export function reveal(user,slug){if(!owns(user,slug))throw new CustomerError('Claim this card before revealing it in your collection.',403);db().prepare('UPDATE collection SET revealed=COALESCE(revealed,?) WHERE customer=? AND slug=?').run(Date.now(),user.id,slug);}
export function createClaims({kind,label,slugs,count}){
  if(!['deck','booster','single'].includes(kind))throw new CustomerError('Choose a deck, booster, or single card.');
  if(typeof label!=='string'||!label.trim()||label.length>100)throw new CustomerError('Give this batch a name (up to 100 characters).');
  if(!Number.isInteger(count)||count<1||count>100)throw new CustomerError('Create 1–100 codes at a time.');
  if(kind==='deck')slugs=songs.map(s=>s.slug);
  if(!Array.isArray(slugs)||!slugs.length||slugs.length>54||new Set(slugs).size!==slugs.length||slugs.some(s=>!songs.find(x=>x.slug===s)))throw new CustomerError('Select valid, distinct cards for this product.');
  if(kind==='single'&&slugs.length!==1)throw new CustomerError('Select exactly one card.');
  const database=db(), results=[];database.exec('BEGIN IMMEDIATE');
  try{for(let i=0;i<count;i++){const code='RC-'+randomBytes(16).toString('hex').toUpperCase().match(/.{1,8}/g).join('-');database.prepare('INSERT INTO claim_codes(hash,label,kind,slugs,created) VALUES(?,?,?,?,?)').run(digest(code.replace(/[^A-Z0-9]/g,'')),label.trim(),kind,JSON.stringify(slugs),Date.now());results.push({code,label:label.trim(),kind,slugs});}database.exec('COMMIT');}catch(e){database.exec('ROLLBACK');throw e;}
  return results;
}
export function redeem(user,raw){
  limit('claim:'+user.id,20);
  if(typeof raw!=='string'||raw.length>100)throw new CustomerError('Enter the claim code from your purchase.');
  const hash=digest(raw.toUpperCase().replace(/[^A-Z0-9]/g,'')), database=db();database.exec('BEGIN IMMEDIATE');
  try{
    const code=database.prepare('SELECT * FROM claim_codes WHERE hash=?').get(hash);
    if(!code||code.revoked)throw new CustomerError('This claim code is invalid or has been cancelled.');
    if(code.claimed_by&&code.claimed_by!==user.id)throw new CustomerError('This code has already been claimed by another account.',409);
    const slugs=JSON.parse(code.slugs);let added=0;
    for(const slug of slugs)added+=Number(database.prepare('INSERT OR IGNORE INTO collection(customer,slug,acquired) VALUES(?,?,?)').run(user.id,slug,Date.now()).changes);
    database.prepare('UPDATE claim_codes SET claimed_by=?,claimed_at=COALESCE(claimed_at,?) WHERE hash=?').run(user.id,Date.now(),hash);
    database.exec('COMMIT');return {added,total:slugs.length,label:code.label,slugs};
  }catch(e){database.exec('ROLLBACK');throw e;}
}
export function claimInventory(){return db().prepare('SELECT hash,label,kind,slugs,created,claimed_at,revoked FROM claim_codes ORDER BY created DESC LIMIT 500').all().map(row=>({...row,slugs:JSON.parse(row.slugs)}));}
export function revokeClaim(hash){const r=db().prepare('UPDATE claim_codes SET revoked=1 WHERE hash=? AND claimed_by IS NULL').run(hash);if(!r.changes)throw new CustomerError('Only an unused code can be cancelled.');}
