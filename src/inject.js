/**
 *
 * Inject Request and Traveler data
 *
 * USAGE: NODE_ENV=<ENV> node dist/inject.js <CSV>
 *
 *   ENV:     {production|development|test}
 *   CSV:     path to csv file
 *
 */

const SUPPORTED_ENV = ['production', 'development', 'test'];

const usage = () => {
  console.log();
  console.log('USAGE: NODE_ENV=<ENV> node dist/inject.js <CSV>');
  console.log();
  console.log('  CSV:  path to csv file');
  console.log();
};

const env = process.env.NODE_ENV;

if (!env) {
  console.log();
  console.log('NODE_ENV must be specified');
  usage();
  process.exit();
}

if (!SUPPORTED_ENV.includes(env)) {
  console.log();
  console.log('NODE_ENV must be {production|development|test} but ' + env);
  usage();
  process.exit();
}

const args = process.argv.slice(2);

if (args.length != 1) {
  usage();
  process.exit();
}

const csv = args[0];

console.log('ENV: ' + env + ', CSV: ' + csv);

import Injector from './injector.js';

try {
  Injector.inject(csv, env);
}
catch(e) {
  console.log(e);
}
