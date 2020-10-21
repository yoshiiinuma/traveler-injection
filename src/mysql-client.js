
import fs from 'fs';
import mysql from 'mysql';

const checkConfig = (conf) => {
  const errors = [];

  if (!conf.host) errors.push('DB Host Not Provided');
  if (!conf.port) errors.push('DB Port Not Provided');
  if (!conf.user) errors.push('DB User Not Provided');
  if (!conf.password) errors.push('DB Password Not Provided');
  if (!conf.database) errors.push('Database Not Provided');
  if (conf.ssl) {
    if (conf.ssl.ca) {
      if (!fs.existsSync(conf.ssl.ca)) {
        errors.push('SSL CA Not Found: ' + conf.ssl.ca)
      }
    }
    if (conf.ssl.key) {
      if (!fs.existsSync(conf.ssl.key)) {
        errors.push('SSL Key Not Found: ' + conf.ssl.key)
      }
    }
    if (conf.ssl.cert) {
      if (!fs.existsSync(conf.ssl.cert)) {
        errors.push('SSL Cert Not Found: ' + conf.ssl.cert)
      }
    }
  }

  return errors;
}

const setCerts = (conf) => {
  conf.ssl.ca = fs.readFileSync(conf.ssl.ca);
  conf.ssl.key = fs.readFileSync(conf.ssl.key);
  conf.ssl.cert = fs.readFileSync(conf.ssl.cert);
}

const getConfig = (env) => {
  const file = './config/' + env + '.json';
  if (!fs.existsSync(file)) {
    const errmsg = 'Config File Not Found: ' + file;
    return [[errmsg], null];
  }
  const conf = JSON.parse(fs.readFileSync(file));

  const errors = checkConfig(conf);

  if (errors.length === 0) {
    setCerts(conf);
  }
  return [errors, conf];
}

const createConnection = (conf) => {
  const db = mysql.createConnection(conf);
  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        return reject(err);
      }
      return resolve(db);
    });
  });
};

const systemUser = 'SYSTEMUSER';

const convRequestData = (r) => {
  const fullName = r.RequestorFirstName + ' ' + r.RequestorLastName;
  const requestor = (r.RequestorCompany) ? fullName + ', ' + r.RequestorCompany : fullName;
  let rslt = [r.RequestId, null, r.Owner, r.RequestId, systemUser,
    null, 'AG', 'IMPORTED',
    requestor, fullName, r.RequestorEmail,
    r.ApplicationDate, r.CloseDate, r.Status, r.TravelType,
    r.ExemptionCategory, r.Purpose, r.CISASubCategory, r.Details,
    0, 0, 0, 0, 0, 0, 0, 0, 0
  ];

  rslt = rslt.map((k) => (typeof k === 'undefined') ? null : k);
  return rslt;
};

const convTravelerData = (r, exemptionCategory) => {
  let rslt = [r.RequestId, r.TravelerId, r.Owner, exemptionCategory, systemUser,
    r.TravelerFirstName, r.TravelerMiddleName, r.TravelerLastName, r.OriginCountry, r.OriginState,
    r.DestinationIsland, r.ArrivalDate, r.ArrivalFlightNumber,
    r.DepartureDate, r.DepartureFlightNumber, r.Phone,
    r.QuarantineLocationType, r.QuarantineLocationAddress,
    r.Travel14DaysBeforeArrival, r.RecentTravels
  ];
  rslt = rslt.map((k) => (typeof k === 'undefined') ? null : k);
  return rslt;
};

const sortOut = (data) => {
  const requests = [];
  const travelers = [];

  for (let r of data) {
    requests.push(convRequestData(r));
    for (let t of r.travelers) {
      travelers.push(convTravelerData(t, r.ExemptionCategory));
    }
  }
  return { requests, travelers };
};

const REQUEST_COLUMNS = [
  'RequestId', 'UserId', 'Owner', 'Application Confirmation ID', 'UpdatedBy', 
  'Approval ID', 'Assigned', 'Assignees',
  'Requestor', 'Requestor Name', 'Requestor Email',
  'Request Date', 'Approval Date', 'Status', 'Travel Type',
  'Exemption Category', 'Purpose', 'CISA Sub Category', 'Details',
  'Immediate', 'Project Document 1 Reviewed?', 'Project Document 2 Reviewed?',
  'Proof of Port of Embarkation Reviewed?', 'PCS Orders Reviewed?',
  'Generating Base Email?', 'Sending Received?', 'Sending Updates?', 'Sending Processing?'
];

const TRAVELER_COLUMNS = [
  'RequestId', 'TravelerId', 'Owner', 'Exemption Category', 'UpdatedBy',
  'First Name', 'Middle Name', 'Last Name', 'Origin Country', 'Origin State',
  'Destination Island', 'Arrival Date', 'Arrival Flight Number',
  'Departure Date', 'Departure Flight Number', 'Phone',
  'Quarantine Location Type', 'Quarantine Location Address',
  'Travel 14Days Before Arrival', 'Recent Travels'
];

const InsertRequestSQL = `INSERT INTO Requests (??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES ?`;
const InsertTravelerSQL = `INSERT INTO Travelers (??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES ?`;

const injectRequests = (db, values) => {
  return new Promise((resolve, reject) => {
    if (!values || values.length === 0) {
      return reject(new Error('No Data Provided'));
    }
    db.query(InsertRequestSQL, [...REQUEST_COLUMNS, values], (err, results, fields) => {
      if (err) {
        return reject(err);
      }
      return resolve({results, fields});
    });
  });
};

const injectTravelers = (db, values) => {
  return new Promise((resolve, reject) => {
    if (!values || values.length === 0) {
      return reject(new Error('No Data Provided'));
    }
    db.query(InsertTravelerSQL, [...TRAVELER_COLUMNS, values], (err, results, fields) => {
      if (err) {
        return reject(err);
      }
      return resolve({results, fields});
    });
  });
};

const injectData = (db, data) => {
  const { requests, travelers } = sortOut(data);

  return new Promise((resolve, reject) => {
    db.beginTransaction(async (err) => {
      try {
        if (err) throw err;

        const resultRequest = await injectRequests(db, requests);
        const resultTraveler = await injectTravelers(db, travelers);

        db.commit((err) => {
          if (err) throw err;
          return resolve({ request: resultRequest, traveler: resultTraveler });
        });
      }
      catch (err) {
        db.rollback(() => {
          reject(err); 
        });
      }
    });
  });
};

const closeConnection = (db) => {
  return new Promise((resolve, reject) => {
    db.end((err) => {
      if (err) {
        return reject(err);
      }
      return resolve(true);
    });
  });
};

const createMySqlClient = (env) => {
  const [confErrors, conf] = DB.getConfig(env);
  const dbErrors = [];
  let db = null;

  const getErrors = () => {
    return [...confErrors, ...dbErrors];
  };

  const hasError = () => {
    return confErrors.length > 0 || dbErrors.length > 0;
  };

  const showErrors = () => {
    console.log("\n--- Configuration Error ----------------------");
    for (let e of confErrors) {
      console.log('+ ' + e);
    }
    console.log("\n--- Database Error ---------------------------");
    for (let e of dbErrors) {
      console.log('+ ' + e);
    }
    console.log("----------------------------------------------\n");
  };

  const connect = async () => {
    if (hasError()) {
      return false;
    }
    try {
      db = await DB.createConnection(conf);
      return true;
    }
    catch (error) {
      throw error;
    }
  };

  const close = async () => {
    if (hasError()) {
      return false;
    }
    if (!db) {
      throw new Error('Connection must be established before close');
    }
    try {
      const closed = await DB.closeConnection(db);
      if (closed) db = null;
      return closed;
    }
    catch (error) {
      throw error;
    }
  };

  const inject = async (data) => {
    if (hasError()) {
      return { error: getErrors(), results: null };
    }
    try {
      if (!db) {
        await connect();
      }
      const results = await DB.injectData(db, data); 
      await close();

      return { results };
    } 
    catch (error) {
      dbErrors.push(error.toString());
      return { error: getErrors(), results: null };
    }
  };

  return {
    hasError,
    getErrors,
    showErrors,
    connect,
    close,
    inject
  };
};

const DB = {
  createMySqlClient,
  checkConfig,
  getConfig,
  sortOut,
  REQUEST_COLUMNS,
  TRAVELER_COLUMNS,
  InsertRequestSQL,
  InsertTravelerSQL,
  convRequestData,
  convTravelerData,
  createConnection,
  closeConnection,
  injectRequests,
  injectTravelers,
  injectData,
};

export default DB;

