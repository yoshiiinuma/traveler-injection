
import ENUM from './enum.js';

/**
 * Validation Rule
 *   propertites: { required, type, options }
 *
 *   blank test: check if it is blank when 'required' is true
 *   type test:
 *     - bool:  check if it is 1 or 0
 *     - enum:  check if it is included by the 'options'
 *     - date:  check if it is formated as 'YYYY-MM-DD'
 *     - phone: check if it is phone number
 *
 */

const RequestValidationRule = {
  RequestorEmail: { required: true, type: 'string' },
  RequestorFirstName: { required: true, type: 'string' },
  RequestorLastName: { required: true, type: 'string' },
  RequestorCompany: { required: false, type: 'string' },
  ApplicationDate: { required: true, type: 'date' },
  CloseDate: { required: true, type: 'date' },
  Status: { required: true, type: 'enum', options: ENUM.Status },
  TravelType: { required: false, type: 'enum', options: ENUM.TravelType },
  ExemptionCategory: { required: true, type: 'enum', options: ENUM.ExemptionCategory },
  Purpose: { required: false, type: 'enum', options: ENUM.Purpose },
  CISASubCategory: { required: false, type: 'enum', options: ENUM.CISASubCategory },
  Details: { required: true, type: 'string'},
};

const TravelerValidationRule = {
  TravelerFirstName: { required: true, type: 'string' },
  TravelerMiddleName: { required: false, type: 'string' },
  TravelerLastName: { required: true, type: 'string' },
  OriginCountry: { required: false, type: 'enum', options: ENUM.OriginCountry },
  OriginState: { required: false, type: 'enum', options: ENUM.OriginState },
  DestinationIsland: { required: false, type: 'string' },
  ArrivalDate: { required: false, type: 'date' },
  ArrivalFlightNumber: { required: false, type: 'string' },
  DepartureDate: { required: false, type: 'date' },
  DepartureFlightNumber: { required: false, type: 'string' },
  Phone: { required: false, type: 'phone' },
  QuarantineLocationType: { required: false, type: 'enum', options: ENUM.QuarantineLocationType },
  QuarantineLocationAddress: { required: false, type: 'string' },
  Travel14DaysBeforeArrival: { required: false, type: 'bool' },
  RecentTravels: { required: false, type: 'string' },
};

const validate = (req) => {
  let r = true;

  if (!validateRequest(req)) r = false;
  for (let t of req.travelers) {
    if (!validateTraveler(t)) r = false;
  }

  return r;
};

export const validateRequest = (obj) => {
  return checkValidationRule(RequestValidationRule, obj);
};

export const validateTraveler = (obj) => {
  return checkValidationRule(TravelerValidationRule, obj);
};

export const checkValidationRule = (rules, obj) => {
  const errors = []

  for (let key in rules) {
    let rule = rules[key]
    checkBlank(rule, obj, key, errors);
    checkEnum(rule, obj, key, errors);
    checkBool(rule, obj, key, errors);
    checkDate(rule, obj, key, errors);
    checkPhone(rule, obj, key, errors);
  }
  if (errors.length > 0) {
    obj.errors = errors;
    return false;
  }
  return true;
};

const checkBlank = (rule, obj, key, err) => {
  if (!rule.required) return;
  if (obj[key]) return;
  if (rule.type === 'bool' && obj[key] === 0) return;
  err.push(key + ' must not be blank');
};

const checkEnum = (rule, obj, key, err) => {
  if (rule.type !== 'enum') return;
  if (obj[key] && !rule.options.includes(obj[key])) {
    err.push(key + ' must be selected from the list: ' + obj[key]);
  }
};

const checkBool = (rule, obj, key, err) => {
  if (rule.type !== 'bool') return;
  if (obj[key] !== 0 && obj[key] !== 1) {
    err.push(key + ' must be boolean: ' + obj[key]);
  }
}

const rgxDate = /^20\d{2}-[01][0-9]-[0123][0-9]$/;

const checkDate = (rule, obj, key, err) => {
  if (rule.type !== 'date') return;
  if (obj[key] && !rgxDate.test(obj[key])) {
    err.push(key + ' must be valid date (YYYY-MM-DD): ' + obj[key]);
  }
}

const rgxPhone = /^(\+\d{1,3}[\s\.\-]?)?\(?\d+\)?[\s\.\-]?\d+[\s\.\-]?\d+$/;

const checkPhone = (rule, obj, key, err) => {
  if (rule.type !== 'phone') return;
  if (obj[key] && !rgxPhone.test(obj[key])) {
    err.push(key + ' must be valid phone number: ' + obj[key]);
  }
}

const Validator = {
  validate,
  validateRequest,
  validateTraveler,
  checkValidationRule,
  checkBlank,
  checkEnum,
  checkBool,
  checkDate,
  checkPhone,
  rgxPhone,
};

export default Validator;

