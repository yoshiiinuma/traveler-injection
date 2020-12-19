
import Random from './random.js';

const generateEmail = (firstName, lastName) => {
  return firstName.toLowerCase() + '.' +
    lastName.toLowerCase() + '@sample.com';
}

const generatePerson = () => {
  const firstName = Random.generateName();
  const lastName = Random.generateName();
  const middleName = '';
  const email = generateEmail(firstName, lastName);
  const phone = Random.generatePhone();
  const address = Random.generateAddress();

  return { firstName, middleName, lastName, email, phone, address };
};

/*
  OrganizationId
  OrganizationName
  Address
  Phone
  Email
  ContactEmail
  ContactName
  Agreement
  AgreementStartDate
  AgreementEndDate
  Status
  Owner
  CreatedBy
  UpdatedBy
*/
const generateSampleOrganization = () => {
  const r = generatePerson(); 
  const orgId = Random.generateId();
  const orgName = Random.generateName().toUpperCase();
  const startDate = Random.randomDate();
  const endDate = Random.randomDate(100);

  return {
    organizationId: orgId,
    organizationName: orgName,
    status: Random.randomBool(0.7) ? 'Approved' : 'Denied',
    agreement: orgId + '_agreement.pdf',
    agreementStartDate: startDate,
    agreementEndDate: endDate,
    phone: r.phone,
    address: r.address,
    contactName: r.firstName + ' ' + r.lastName,
    email: r.email,
    contactEmail: r.email,
    owner: r.email,
    createdBy: r.email,
    updatedBy: r.email,
  };
};

/*
  OrganizationId
  MemberId
  ApprovalId
  Status
  FirstName
  MiddleName
  LastName
  Email
  Owner
  CreatedBy
  UpdatedBy
*/
const generateSampleMember = (orgId = '') => {
  const { firstName, middleName, lastName, email } = generatePerson(); 
  const organizationId = (orgId) ? orgId : Random.generateId();
  const memberId = Random.generateId();
  const approvalId = Random.generateTbpExemptionId();

  return {
    organizationId,
    memberId,
    approvalId,
    status: Random.randomBool(0.7) ? 'Active' : 'Inactive',
    firstName,
    middleName,
    lastName,
    email,
    owner: email,
    createdBy: email,
    updatedBy: email,
  };
};

const generateTbpSamples = (numOfSamples = 3) => {
  const organizations = [];
  const members = [];
  let org, member;

  for (let i = 0; i < numOfSamples; i++) {
    org = generateSampleOrganization();
    let numOfMembers = Random.randomInt(4) + 1;
    organizations.push(org);
    for (let j = 0; j < numOfMembers; j++) {
      members.push(generateSampleMember(org.organizationId));
    }
  }

  return { organizations, members };
};

const Generator = {
  generateSampleOrganization,
  generateSampleMember,
  generateTbpSamples,
}

export default Generator;

