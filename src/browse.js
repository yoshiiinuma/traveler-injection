/**
 *
 * Check the validatity of the CSV file
 *
 * USAGE: node dist/browse.js <CSV>
 *
 *   CSV:     path to csv file
 *
 */

const usage = () => {
  console.log();
  console.log('USAGE: node dist/browse.js <CSV>');
  console.log();
  console.log('  CSV:  path to csv file');
  console.log();
};

const args = process.argv.slice(2);

if (args.length != 1) {
  usage();
  process.exit();
}

const csv = args[0];

import Injector from './injector.js';
Injector.list(csv);

