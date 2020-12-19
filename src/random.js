import ENUM from './enum.js';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const ALPHANUMERIC = ALPHABET.toUpperCase() + ALPHABET + '0123456789';
const ALPHA_CHARS = ALPHABET.split('');
const ALPHANUMERIC_CHARS = ALPHANUMERIC.split('');

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const randomAlphabet = () => {
  return ALPHA_CHARS[Math.floor(Math.random() * ALPHA_CHARS.length)];
}

const randomAlphanumeric = () => {
  return ALPHANUMERIC_CHARS[Math.floor(Math.random() * ALPHANUMERIC_CHARS.length)];
}

const randomString = (len = 10) => {
  let r = "";

  for (let i=0; i < len; i++ ) {
    r += randomAlphanumeric();
  }
  return r;
}

const randomInt = (max = 10) => {
  return Math.floor(Math.random() * max);
}

const randomNumber = (len = 4) => {
  return Math.floor(Math.random() * Math.pow(10, len));
}

const randomBool = (trueRate = 0.5) => {
  return Math.random() < trueRate;
}

/**
 * Returns a randomly selected date from 5 days
 * before and after today.
 * shitedDays will shift the result datel
 */
const randomDate = (shiftedDays = 0) => {
  const now = new Date()
  let diff = Math.floor(Math.random() * 10) - 5 + shiftedDays;
  const date =  new Date(now.getTime() + diff * 86400 * 1000);
  return date.toISOString().slice(0, 10);
}

const generateId = () => {
  return randomString(8);
};

const generateInjectionId = () => {
  return '@' + randomString(9);
};

const generateTbpExemptionId = () => {
  return 'C#' + randomString(8);
};

const generateName = () => {
  const len = Math.floor(Math.random() * 7) + 3;

  let r = randomAlphabet().toUpperCase();
  for (let i = 1; i < len; i++ ) {
    r += randomAlphabet();
  }
  return r;
}

const generatePhone = () => {
  return randomNumber(10).toString();
}

const generateAddress = () => {
  let r = randomNumber(4).toString() + ' ';

  r += generateName() + ' St., ' + generateName() + ', ';
  r += ENUM.OriginState[Math.floor(Math.random() * 50)];
  r += ' ' + randomNumber(5).toString();
  return r;
}

const Random = {
  randomString,
  randomNumber,
  randomInt,
  randomBool,
  randomDate,
  generateId,
  generateInjectionId,
  generateTbpExemptionId,
  generateName,
  generatePhone,
  generateAddress,
  capitalize,
}

export default Random;
