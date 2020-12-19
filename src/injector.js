
import Parser from './parse.js';
import DB from './mysql-client.js';
import Generator from './sample-generator.js';

const requestToString = (r) => {
  let str = `${r.RequestorEmail} ${r.RequestorFirstName} ${r.RequestorLastName}`;
  if (r.RequestorCompany) str += ' ' + r.RequestorCompany;
  str += ` ${r.ApplicationDate} ${r.CloseDate}`;
  str += ` ${r.ExemptionCategory}`;
  return str;
};

const travelerToString = (r) => {
  let str = (r.TravelerMiddleName) ?
    `${r.TravelerFirstName} ${r.TravelerMiddleName} ${r.TravelerLastName}` :
    `${r.TravelerFirstName} ${r.TravelerLastName}`;
  let origin = '';
  if (r.OriginCountry) {
    if (r.OriginState) {
      origin = `${r.OriginCountry} ${r.OriginState}`;
    } else {
      origin = r.OriginCountry;
    }
  }
  if (origin) str += ' ' + origin;
  return str;
};

const printErrors = (errors) => {
  if (errors) {
    for (let e of errors) {
      console.log('  + ' + e);
    }
  }
}

const printRequestErrors = (r) => {
  if (r.errors) {
    console.log('=== ' + requestToString(r));
    for (let e of r.errors) {
      console.log('  + ' + e);
    }
  }
}

const printTravelerErrors = (r) => {
  if (r.errors) {
    console.log(' -- ' + travelerToString(r));
    for (let e of r.errors) {
      console.log('  + ' + e);
    }
  }
}

const showParseErrors = (obj) => {
  if (obj.errors) {
    for (let e of obj.errors) {
      console.log('---------------------------');
      console.log(e);
    }
  }
}

const reportParseErrors = (data) => {
  for (let r of data) {
    if (r.errors || r.travelers.some(t => t.errors)) {
      console.log('=== ' + requestToString(r));
    }
    if (r.errors) {
      printErrors(r.errors);
    }
    for (let t of r.travelers) {
      if (t.errors) {
        console.log(' -- ' + travelerToString(t));
        printErrors(t.errors);
      }
    }
  }
}

const list = async (csv) => {
  try {
    const parsed = await Parser.parse(csv);
    for (let r of parsed.data) {
      console.log(r);
    }
  }
  catch (e) {
    console.log(e);
  }
}

const validate = async (csv) => {
  try {
    const parsed = await Parser.parse(csv);
    if (parsed.error) {
      reportParseErrors(parsed.data);
    } else {
      console.log('!!! VALID DATA !!! ' + csv);
    }
  }
  catch (e) {
    console.log(e);
  }
}

const inject = async (csv, env) => {
  const db = DB.createMySqlClient(env);
  const parsed = await Parser.parse(csv);
  if (parsed.error) {
    console.log('Parse Error');
    reportParseErrors(parsed.data);
  } else {
    const r = await db.inject(parsed.data);
    if (r.error) {
      console.log('DB Error');
      if (typeof r.error === 'Array') {
        db.showErrors();
      } else {
        console.log(r.error);
      }
    } else {
      console.log(r.results);
      console.log('!!! Injection Completed !!!');
    }
  }
  return;
};

const seedTbp = async (env) => {
  const db = DB.createMySqlClient(env);
  const seedData = Generator.generateTbpSamples(3);
  const r = await db.injectTbp(seedData);
  if (r.error) {
    console.log('DB Error');
    if (typeof r.error === 'Array') {
      db.showErrors();
    } else {
      console.log(r.error);
    }
  } else {
    console.log(r.results);
    console.log('!!! Seeding TBP Completed !!!');
  }
  return;
};

const Injector = {
  list,
  inject,
  validate,
  seedTbp
};

export default Injector;
