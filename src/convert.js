
import Random from './random.js';

const REQUEST_COLUMNS = [
  'RequestorEmail',
  'RequestorFirstName',
  'RequestorLastName',
  'RequestorCompany',
  'ApplicationDate',
  'CloseDate',
  'Status',
  'TravelType',
  'ExemptionCategory',
  'Purpose',
  'CISASubCategory',
  'Details',
];

const TRAVELER_COLUMNS = [
  'TravelerFirstName',
  'TravelerMiddleName',
  'TravelerLastName',
  'OriginCountry',
  'OriginState',
  'DestinationIsland',
  'ArrivalDate',
  'ArrivalFlightNumber',
  'DepartureDate',
  'DepartureFlightNumber',
  'Phone',
  'QuarantineLocationType',
  'QuarantineLocationAddress',
  'Travel14DaysBeforeArrival',
  'RecentTravels'
];

const COLUMN_SIZE = REQUEST_COLUMNS.length + TRAVELER_COLUMNS.length;

/**
 * Converts array data into { request, traveler } object
 *
 *   If FirstName, LastName and Email of Request are blank,
 *   request object becomes null
 *
 */
const convert = (data) => {
  if (data.length !== COLUMN_SIZE) {
    throw new Error('Column Size must be ' + COLUMN_SIZE);
  }

  const requestData = data.slice(0, REQUEST_COLUMNS.length).map(r => (r)? r.trim() : r);
  const travelerData = data.slice(REQUEST_COLUMNS.length).map(r => (r)? r.trim() : r);
  const request = convertRequest(requestData);
  const traveler = convertTraveler(travelerData);

  return { request, traveler };
};

/**
 * Returns
 *   null if FirstName, LastName and Email are blank
 *   Request object otherwise
 */
const convertRequest = (data) => {
  const r = arrayToObject(REQUEST_COLUMNS, data);
  if (!r.RequestorEmail && !r.RequestorFirstName && !r.RequestorLastName) {
    return null;
  }
  return fixRequest(r);
};

/**
 * Returns Traveler object otherwise
 */
const convertTraveler = (data) => {
  const r = arrayToObject(TRAVELER_COLUMNS, data);
  return fixTraveler(r);
};

const arrayToObject = (cols, array) => {
  return cols.reduce((obj, key, i) => {
    if (array[i]) {
      obj[key] = array[i];
    }
    return obj;
  }, {});
};

const fixRequest = (r) => {
  return r;
};

const fixTraveler = (r) => {
  if (!r.Travel14DaysBeforeArrival) {
    r.Travel14DaysBeforeArrival = 0;
  } else if (r.Travel14DaysBeforeArrival.toLowerCase() == 'true' ) {
    r.Travel14DaysBeforeArrival = 1;
  } else {
    r.Travel14DaysBeforeArrival = 0;
  }
  return r;
};

const Converter = {
  convert,
  convertRequest,
  convertTraveler,
  fixTraveler,
};

export default Converter;

