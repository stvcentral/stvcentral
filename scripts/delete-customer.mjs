import {DatabaseSync} from 'node:sqlite';
import {randomBytes} from 'node:crypto';
const [username,confirmation]=process.argv.slice(2);
if(!username||confirmation!=='--confirmed-owner-request')throw Error('After verifying the customer request: node scripts/delete-customer.mjs USERNAME --confirmed-owner-request');
const db=new DatabaseSync(process.env.CUSTOMER_DB_PATH||'runtime/customers.sqlite');
db.exec('PRAGMA foreign_keys=ON; BEGIN IMMEDIATE');
try{
 const user=db.prepare('SELECT id FROM customers WHERE username=?').get(username.toLowerCase());
 if(!user)throw Error('Account not found.');
 // Keep a tombstone so previously redeemed codes cannot be used again.
 db.prepare('DELETE FROM sessions WHERE customer=?').run(user.id);
 db.prepare('DELETE FROM collection WHERE customer=?').run(user.id);
 db.prepare('UPDATE customers SET username=?,password=?,recovery=? WHERE id=?').run('deleted_'+randomBytes(16).toString('hex'),'deleted','deleted',user.id);
 db.exec('COMMIT');console.log('Account anonymized and access removed. Previously claimed codes remain consumed.');
}catch(e){db.exec('ROLLBACK');throw e;}finally{db.close();}
