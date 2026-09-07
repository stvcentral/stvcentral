import {DatabaseSync,backup} from 'node:sqlite';
import {resolve} from 'node:path';
const destination=process.argv[2];
if(!destination)throw Error('Provide a backup destination outside the live database file.');
const source=resolve(process.env.CUSTOMER_DB_PATH||'runtime/customers.sqlite');
if(source===resolve(destination))throw Error('Backup must use a different file.');
const db=new DatabaseSync(source);await backup(db,destination);db.close();console.log('Customer database backup completed.');
