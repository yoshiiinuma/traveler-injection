
const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const CHARS = possibleChars.split('');

const random = (len = 10) => {
  let r = "";

  for (let i=0; i < len; i++ ) {  
    r += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return r;
}

const generateId = () => {
  return '@' + random(9); 
};

const Random = {
  random,
  generateId,
}

export default Random;
