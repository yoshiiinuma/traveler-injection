
import { expect } from 'chai';

import Generator from '../src/sample-generator.js'

describe('Generagor.generateSampleOrganization', () => {
  const r = Generator.generateSampleOrganization();
  const email = r.contactName.toLowerCase().replace(' ', '.') + '@sample.com';

  it('generates sample organization data', () => {
    expect(r.organizationId).to.match(/^[A-Za-z0-9]{8}$/);
    expect(r.organizationName).to.match(/^[A-Z]+$/);
    expect(r.phone).to.match(/^[0-9]{9,10}$/);
    expect(r.address).to.match(/^[A-Za-z0-9\., ]+$/);
    expect(r.agreement).to.eql(r.organizationId + '_agreement.pdf');
    expect(r.agreementStartDate).to.match(/^202[0-9]-[0-9]{1,2}-[0-9]{1,2}$/);
    expect(r.agreementEndDate).to.match(/^202[0-9]-[0-9]{1,2}-[0-9]{1,2}$/);
    expect(r.status).to.match(/Approved|Denied/)
    expect(r.contactName).to.match(/^[A-Z][a-z]+ [A-Z][a-z]+$/);
    expect(r.email).to.eql(email)
    expect(r.contactEmail).to.eql(email)
    expect(r.owner).to.eql(email)
    expect(r.createdBy).to.eql(email)
    expect(r.updatedBy).to.eql(email)
  })
});

describe('Generagor.generateSampleMember', () => {
  const r = Generator.generateSampleMember();
  const email = r.firstName.toLowerCase() + '.' + r.lastName.toLowerCase() + '@sample.com';

  it('generates sample member data', () => {
    expect(r.organizationId).to.match(/^[A-Za-z0-9]{8}$/);
    expect(r.memberId).to.match(/^[A-Za-z0-9]{8}$/);
    expect(r.approvalId).to.match(/^C#[A-Za-z0-9]{8}$/);
    expect(r.firstName).to.match(/^[A-Z][a-z]+$/);
    expect(r.lastName).to.match(/^[A-Z][a-z]+$/);
    expect(r.status).to.match(/Active|Inactive/)
    expect(r.email).to.eql(email)
    expect(r.owner).to.eql(email)
    expect(r.createdBy).to.eql(email)
    expect(r.updatedBy).to.eql(email)
  })
});

describe('Generagor.generateTbpSamples', () => {
  const r = Generator.generateTbpSamples(3);
  const orgIds = r.organizations.map(e => e.organizationId);
  const cnt = orgIds.reduce((map, id) => {
    map[id] = 0;
    return map
  }, {});

  it('generates the given number of sample data', () => {
    r.members.forEach((m) => {
      cnt[m.organizationId]++;
    })   
    expect(r.organizations).to.have.lengthOf(3);
    for (let id in cnt) {
      expect(cnt[id]).to.be.above(0);
    }
  })
});
