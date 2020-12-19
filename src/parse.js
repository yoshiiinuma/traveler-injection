
import fs from 'fs';
import createCsvReader from 'csv-parse';
import Converter from './convert.js';
import Validator from './validate.js';
import Random from './random.js';

const isHeader = (row) => {
  return row[0] === 'RequestorEmail' &&
    row[1] === 'RequestorFirstName' &&
    row[2] === 'RequestorLastName';
};

const compareRequests = (a, b) => {
  if (!a || !b) return false;
  if (a.RequestorEmail !== b.RequestorEmail) return false;
  if (a.RequestorFirstName !== b.RequestorFirstName) return false;
  if (a.RequestorLastName !== b.RequestorLastName) return false;
  if (a.RequestorCompany !== b.RequestorCompany) return false;
  if (a.ApplicationDate !== b.ApplicationDate) return false;
  if (a.CloseDate !== b.CloseDate) return false;
  if (a.Status !== b.Status) return false;
  if (a.TravelType !== b.TravelType) return false;
  if (a.ExemptionCategory !== b.ExemptionCategory) return false;
  if (a.Purpose !== b.Purpose) return false;
  if (a.CISASubCategory !== b.CISASubCategory) return false;
  if (a.Details !== b.Details) return false;
  return true;
}

const injectId = (request) => {
  const reqId = Random.generateInjectionId();
  const owner = 'INJECTED@' + reqId;

  request.RequestId = reqId;
  request.Owner = owner;
  for (let traveler of request.travelers) {
    traveler.RequestId = reqId;
    traveler.TravelerId = Random.generateInjectionId();
    traveler.Owner = owner;
  }

  return request;
}

const parse = (file, parseLine) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(file)) {
      return reject(new Error('File Not Exists: ' + file));
    }
    const csv = createCsvReader({ delimiter: ',' });
    const data = [];
    let error = false;
    let curReq;
    let header = true;

    const push = (request) => {
      data.push(Parser.injectId(request));
    };

    csv.on('error', (e) => reject(e));
    csv.on('end', () => {
      if (curReq) {
        if (!Validator.validate(curReq)) error = true;
        push(curReq);
      }
      if (data.length == 0) {
        return reject(new Error('No Data Provided'));
      }
      return resolve({ data, error });
    });
    csv.on('data', (row) => {
      if (header) {
        header = false;
        return;
      }
      const { request, traveler } = Converter.convert(row);

      if (!request) {
        if (!curReq) {
          let msg = row.join(', ');
          return reject(new Error('Traveler must belong to a Request >>> ' + msg));
        }
        curReq.travelers.push(traveler);
        return;
      } else {
        if (request !== curReq) {
          if (curReq) {
            if (!Validator.validate(curReq)) error = true;
            push(curReq);
          }
          curReq = request;
          curReq.travelers = [traveler];
        }
      }
    });

    fs.createReadStream(file).pipe(csv);
  });
};

const Parser = {
  injectId,
  parse
};

export default Parser;

