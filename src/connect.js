/**
 *
 * Test the connection to the DB
 *
 * USAGE: node dist/connect.js <ENV>
 *
 *   ENV:   {production|development|test|staging}
 *
 */

import MYSQL from './mysql-client.js';

const SUPPORTED_ENV = ['production', 'development', 'test', 'staging'];

const usage = () => {
  console.log();
  console.log('USAGE: node dist/connect.js <ENV>');
  console.log();
  console.log('  ENV:  {production|development|test|staging}');
  console.log();
};

const args = process.argv.slice(2);

if (args.length != 1) {
  usage();
  process.exit();
}

const env = args[0];

if (!env) {
  console.log();
  console.log('NODE_ENV must be specified');
  usage();
  process.exit();
}

if (!SUPPORTED_ENV.includes(env)) {
  console.log();
  console.log('ENV must be {production|development|test|staging} but ' + env);
  usage();
  process.exit();
}

const testConnection = async (env) => {
  const client = MYSQL.createMySqlClient(env);
  let r;

  try {
    r = await client.connect(); 
    if (r) {
      console.log('Connection Established for ' + env);
      r = await client.close();
      if (r) {
        console.log('Connection Closed');
      } else {
        client.showError();
      }
    } else {
      client.showError();
    }
  }
  catch (e) {
    console.log(e);
  }
};

testConnection(env);

