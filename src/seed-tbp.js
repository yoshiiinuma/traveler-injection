/**
 *
 * Inject Request and Traveler data
 *
 * USAGE: NODE_ENV=<ENV> node dist/seed-tbp.js
 *
 *   ENV:     {production|development|test|staging}
 *
 */

const SUPPORTED_ENV = ['production', 'development', 'test', 'staging'];

const usage = () => {
  console.log();
  console.log('USAGE: NODE_ENV=<ENV> node dist/seed-tbp.js');
  console.log();
};

const args = process.argv.slice(2);

if (args.length != 0) {
  usage();
  process.exit();
}

const env = process.env.NODE_ENV;

if (!env) {
  console.log();
  console.log('NODE_ENV must be specified');
  usage();
  process.exit();
}

if (!SUPPORTED_ENV.includes(env)) {
  console.log();
  console.log('NODE_ENV must be {production|development|test|staging} but ' + env);
  usage();
  process.exit();
}

console.log('ENV: ' + env);

import Injector from './injector.js';

try {
  Injector.seedTbp(env);
}
catch(e) {
  console.log(e);
}
