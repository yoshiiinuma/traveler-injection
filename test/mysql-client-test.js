
import { expect } from 'chai';
import sinon from 'sinon';

import DB from '../src/mysql-client.js';
import Random from '../src/random.js';
import { getRequests, getRequest, getTraveler, TestRequestData } from './helper.js';
import Generator from '../src/sample-generator.js';

const RequestData = [
  ['randomid', null, 'INJECTED@randomid', 'randomid', 'SYSTEMUSER', null, 'AG',
   'IMPORTED', 'AAAA1 BBBB1, CCCC1', 'AAAA1 BBBB1', 'aaaa@gmail.com',
   '2020-09-01', '2020-09-01', 'Approved', 'Mainland',
   'CISA Federal Critical Infrastructure Sector', null, null, 'XXXXXXXXX',
   0, 0, 0, 0, 0, 0, 0, 0, 0],
  ['randomid', null, 'INJECTED@randomid', 'randomid', 'SYSTEMUSER', null, 'AG',
   'IMPORTED', 'AAAA2 BBBB2, CCCC2', 'AAAA2 BBBB2', 'aaaa@gmail.com',
   '2020-09-02', '2020-09-02', 'Approved', 'Mainland',
   'CISA Federal Critical Infrastructure Sector', null, null, 'XXXXXXXXX',
   0, 0, 0, 0, 0, 0, 0, 0, 0],
  ['randomid', null, 'INJECTED@randomid', 'randomid', 'SYSTEMUSER', null, 'AG',
   'IMPORTED', 'AAAA3 BBBB3, CCCC3', 'AAAA3 BBBB3', 'aaaa@gmail.com',
   '2020-09-03', '2020-09-03', 'Approved', 'Mainland',
   'CISA Federal Critical Infrastructure Sector', null, null, 'XXXXXXXXX',
   0, 0, 0, 0, 0, 0, 0, 0, 0]
];
const TravelerData = [
  ['randomid', 'randomid', 'INJECTED@randomid', 'CISA Federal Critical Infrastructure Sector', 'SYSTEMUSER',
  'PPPP1', null, 'QQQQ1', 'United States', 'Arizona', 'Oʻahu', '2020-10-01',
  null, null, null, '8089991111',
  'Hotel / Motel', '1111 Aaaa St, Honolulu, HI', 1, 'China'],
  ['randomid', 'randomid', 'INJECTED@randomid', 'CISA Federal Critical Infrastructure Sector', 'SYSTEMUSER',
  'PPPP2', null, 'QQQQ2', 'United States', 'Arizona', 'Oʻahu', '2020-10-02',
  null, null, null, '8089992222',
  'Hotel / Motel', '2222 Aaaa St, Honolulu, HI', 0, null],
  ['randomid', 'randomid', 'INJECTED@randomid', 'CISA Federal Critical Infrastructure Sector', 'SYSTEMUSER',
  'PPPP3', null, 'QQQQ3', 'United States', 'Arizona', 'Oʻahu', '2020-10-03',
  null, null, null, '8089993333',
  'Hotel / Motel', '3333 Aaaa St, Honolulu, HI', 0, null],
];

describe('DB.injectTbpData', () => {
  const TestTbpData = Generator.generateTbpSamples(3);
  let stubBeginTransaction, stubCommit, stubRollback, stubQuery;
  const db = { beginTransaction: () => {}, commit: () => {},
    rollback: () => {}, query: () => {}};

  context('if something happens in db.beginTransaction', () => {
    const err = new Error('Something happened in db.beginTransaction')

    beforeEach(async () => {
      stubBeginTransaction = sinon.stub(db, 'beginTransaction').yields(err);
      stubCommit = sinon.stub(db, 'commit').yields(null);
      stubRollback = sinon.stub(db, 'rollback').yields(null);
      stubQuery = sinon.stub(db, 'query').yields(null, 'RSLTS', 'FIELDS');
    });

    afterEach(async () => {
      stubBeginTransaction.restore();
      stubCommit.restore();
      stubRollback.restore();
      stubQuery.restore();
    });

    it('returns error', async () => {
      try {
        let r = await DB.injectTbpData(db, TestTbpData);
        throw e;
      }
      catch(e) {
        expect(e.toString()).to.be.equal('Error: Something happened in db.beginTransaction');
        expect(stubBeginTransaction.called).to.be.true;
        expect(stubQuery.notCalled).to.be.true;
        expect(stubCommit.notCalled).to.be.true;
        expect(stubRollback.called).to.be.true;
      }
    });
  })

  context('if something happens in db.query', () => {
    const err = new Error('Something happened in db.query')

    beforeEach(async () => {
      stubBeginTransaction = sinon.stub(db, 'beginTransaction').yields(null);
      stubCommit = sinon.stub(db, 'commit').yields(null);
      stubRollback = sinon.stub(db, 'rollback').yields(null);
      stubQuery = sinon.stub(db, 'query').yields(err, null, null);
    });

    afterEach(async () => {
      stubBeginTransaction.restore();
      stubCommit.restore();
      stubRollback.restore();
      stubQuery.restore();
    });

    it('returns error', async () => {
      try {
        let r = await DB.injectTbpData(db, TestTbpData);
        throw e;
      }
      catch(e) {
        expect(e.toString()).to.be.equal('Error: Something happened in db.query');
        expect(stubBeginTransaction.called).to.be.true;
        expect(stubQuery.called).to.be.true;
        expect(stubCommit.notCalled).to.be.true;
        expect(stubRollback.called).to.be.true;
      }
    });
  })

  context('if something happens in db.commit', () => {
    const err = new Error('Something happened in db.commit')

    beforeEach(async () => {
      stubBeginTransaction = sinon.stub(db, 'beginTransaction').yields(null);
      stubCommit = sinon.stub(db, 'commit').yields(err);
      stubRollback = sinon.stub(db, 'rollback').yields(null);
      stubQuery = sinon.stub(db, 'query').yields(null, 'RSLTS', 'FIELDS');
    });

    afterEach(async () => {
      stubBeginTransaction.restore();
      stubCommit.restore();
      stubRollback.restore();
      stubQuery.restore();
    });

    it('returns error', async () => {
      try {
        let r = await DB.injectTbpData(db, TestTbpData);
        throw e;
      }
      catch(e) {
        expect(e.toString()).to.be.equal('Error: Something happened in db.commit');
        expect(stubBeginTransaction.called).to.be.true;
        expect(stubQuery.called).to.be.true;
        expect(stubCommit.called).to.be.true;
        expect(stubRollback.called).to.be.true;
      }
    });
  })

  context('given valid data', () => {
    beforeEach(async () => {
      stubBeginTransaction = sinon.stub(db, 'beginTransaction').yields(null);
      stubCommit = sinon.stub(db, 'commit').yields(null);
      stubRollback = sinon.stub(db, 'rollback').yields(null);
      stubQuery = sinon.stub(db, 'query').yields(null, 'RSLTS', 'FIELDS');
    });

    afterEach(async () => {
      stubBeginTransaction.restore();
      stubCommit.restore();
      stubRollback.restore();
      stubQuery.restore();
    });

    it('returns injection results for both requests and travelers', async () => {
      try {
        let r = await DB.injectTbpData(db, TestTbpData);
        expect(r).to.be.eql({
          organization: { results: 'RSLTS', fields: 'FIELDS' },
          member: { results: 'RSLTS', fields: 'FIELDS' }
        });
        expect(stubBeginTransaction.called).to.be.true;
        expect(stubCommit.called).to.be.true;
        expect(stubRollback.notCalled).to.be.true;
        expect(stubQuery.calledTwice).to.be.true;
      }
      catch(e) {
        throw e;
      }
    });
  })
})

describe('DB.injectOrganizations', () => {
  const OrgData = [DB.convOrganizationData(Generator.generateSampleOrganization())];

  context('given no data', () => {
    it('returns error', async () => {
      try {
        await DB.injectOrganizations({}, null);
        throw new Error('Should not be here');
      }
      catch(e) {
        expect(e.toString()).to.be.equal('Error: No Data Provided');
      }
    });
  })

  context('given empty data', () => {
    it('returns error', async () => {
      try {
        await DB.injectOrganizations({}, []);
        throw new Error('Should not be here');
      }
      catch(e) {
        expect(e.toString()).to.be.equal('Error: No Data Provided');
      }
    });
  })

  context('when db raises an exception', () => {
    let stub;
    const db = { query: () => {} };

    beforeEach(async () => {
      const err = new Error('Something happened');
      stub = sinon.stub(db, 'query');
      stub.yields(err, 'RESULTS', 'FIELDS');
    });

    afterEach(async () => {
      stub.restore();
    });

    it('returns error', async () => {
      try {
        await DB.injectOrganizations(db, OrgData);
        throw new Error('Should not be here');
      }
      catch(e) {
        expect(e.toString()).to.be.equal('Error: Something happened');
      }
      expect(stub.calledWith(
        DB.InsertOrganizationSQL,
        [...DB.ORGANIZATION_COLUMNS, OrgData])
      ).to.be.true
    });
  })

  context('given data', () => {
    let stub;
    const db = { query: () => {} };

    beforeEach(async () => {
      stub = sinon.stub(db, 'query');
      stub.yields(null, 'RESULTS', 'FIELDS');
    });

    afterEach(async () => {
      stub.restore();
    });

    it('pupulates the database', async () => {
      try {
        const r = await DB.injectOrganizations(db, OrgData);
        expect(r).to.eql({
          results: 'RESULTS',
          fields: 'FIELDS'
        });
      }
      catch (e) {
        throw e;
      }
    });
  })

  /* This tests the actual db insertion
  context('given data', () => {
    const [_, conf] = DB.getConfig('test');

    it('pupulates the database', async () => {
      const db = await DB.createConnection(conf);
      try {
        const rawData = await DB.injectOrganizations(db, OrgData);
        const r = JSON.parse(JSON.stringify(rawData));

        expect(r.results).to.eql({
            fieldCount: 0,
            affectedRows: 1,
            insertId: 0,
            serverStatus: 2,
            warningCount: 0,
            message: '',
            protocol41: true,
            changedRows: 0
        });
      }
      catch (e) {
        console.log(e);
        throw e;
      }
    });
  })
  */
})

describe('DB.injectMembers', () => {
  const MemberData = [DB.convMemberData(Generator.generateSampleMember())];

  context('given no data', () => {
    it('returns error', async () => {
      try {
        await DB.injectMembers({}, null);
        throw new Error('Should not be here');
      }
      catch(e) {
        expect(e.toString()).to.be.equal('Error: No Data Provided');
      }
    });
  })

  context('given empty data', () => {
    it('returns error', async () => {
      try {
        await DB.injectMembers({}, []);
        throw new Error('Should not be here');
      }
      catch(e) {
        expect(e.toString()).to.be.equal('Error: No Data Provided');
      }
    });
  })

  context('when db raises an exception', () => {
    let stub;
    const db = { query: () => {} };

    beforeEach(async () => {
      const err = new Error('Something happened');
      stub = sinon.stub(db, 'query');
      stub.yields(err, 'RESULTS', 'FIELDS');
    });

    afterEach(async () => {
      stub.restore();
    });

    it('returns error', async () => {
      try {
        await DB.injectMembers(db, MemberData);
        throw new Error('Should not be here');
      }
      catch(e) {
        expect(e.toString()).to.be.equal('Error: Something happened');
      }
      expect(stub.calledWith(
        DB.InsertMemberSQL,
        [...DB.MEMBER_COLUMNS, MemberData])
      ).to.be.true
    });
  })

  context('given data', () => {
    let stub;
    const db = { query: () => {} };

    beforeEach(async () => {
      stub = sinon.stub(db, 'query');
      stub.yields(null, 'RESULTS', 'FIELDS');
    });

    afterEach(async () => {
      stub.restore();
    });

    it('pupulates the database', async () => {
      try {
        const r = await DB.injectMembers(db, MemberData);
        expect(r).to.eql({
          results: 'RESULTS',
          fields: 'FIELDS'
        });
      }
      catch (e) {
        throw e;
      }
    });
  })

  /* This tests the actual db insertion
  context('given data', () => {
    const [_, conf] = DB.getConfig('test');

    it('pupulates the database', async () => {
      const db = await DB.createConnection(conf);
      try {
        const rawData = await DB.injectMembers(db, MemberData);
        const r = JSON.parse(JSON.stringify(rawData));

        expect(r.results).to.eql({
            fieldCount: 0,
            affectedRows: 1,
            insertId: 0,
            serverStatus: 2,
            warningCount: 0,
            message: '',
            protocol41: true,
            changedRows: 0
        });
      }
      catch (e) {
        console.log(e);
        throw e;
      }
    });
  })
  */
})

describe('DB.createMySqlClient#inject', () => {
  context('given wrong environment', () => {
    it('returns error', async () => {
      const db = DB.createMySqlClient('xxx');
      const r = await db.inject(TestRequestData);

      expect(r.error).to.be.eql(['Config File Not Found: ./config/xxx.json']);
      expect(r.results).to.be.null;
    });
  })

  context('with configuration errors', () => {
    it('returns error', async () => {
      const db = DB.createMySqlClient('sample');
      const r = await db.inject(TestRequestData);

      expect(r.error).to.be.eql([
        'SSL CA Not Found: ./path/to/ca.pem',
        'SSL Key Not Found: ./path/to/client-key.pem',
        'SSL Cert Not Found: ./path/to/client-cert.pem'
      ]);
      expect(r.results).to.be.null;
    });
  })

  context('When DB.createConnection fails', () => {
    const err = new Error('Something happened in createConnection')
    let stubConnect, stubInject, stubClose;

    beforeEach(() => {
      stubConnect = sinon.stub(DB, 'createConnection').rejects(err);
      stubInject = sinon.stub(DB, 'injectData');
      stubClose = sinon.stub(DB, 'closeConnection');
    });

    afterEach(() => {
      stubConnect.restore();
      stubInject.restore();
      stubClose.restore();
    });

    it('returns error', async () => {
      const db = DB.createMySqlClient('test');
      try {
        const r = await db.inject(TestRequestData);
        expect(r.results).to.be.null;
        expect(r.error).to.be.eql(['Error: Something happened in createConnection']);
        expect(stubConnect.called).to.be.true;
        expect(stubInject.notCalled).to.be.true;
        expect(stubClose.notCalled).to.be.true;
      }
      catch(e) {
        throw e;
      }
    });
  })

  context('When DB.injectData fails', () => {
    const err = new Error('Something happened in injectData')
    let stubConnect, stubInject, stubClose;

    beforeEach(() => {
      stubConnect = sinon.stub(DB, 'createConnection');
      stubInject = sinon.stub(DB, 'injectData').rejects(err);
      stubClose = sinon.stub(DB, 'closeConnection');
    });

    afterEach(() => {
      stubConnect.restore();
      stubInject.restore();
      stubClose.restore();
    });

    it('returns error', async () => {
      const db = DB.createMySqlClient('test');
      try {
        const r = await db.inject(TestRequestData);
        expect(r.error).to.be.eql(['Error: Something happened in injectData']);
        expect(r.results).to.be.null;
        expect(stubConnect.called).to.be.true;
        expect(stubInject.called).to.be.true;
        expect(stubClose.notCalled).to.be.true;
      }
      catch(e) {
        throw e;
      }
    });
  })

  context('When DB.closeConnection fails', () => {
    const err = new Error('Something happened in closeConnection')
    const fakeConn = {};
    let stubConnect, stubInject, stubClose;

    beforeEach(() => {
      stubConnect = sinon.stub(DB, 'createConnection').returns(fakeConn);
      stubInject = sinon.stub(DB, 'injectData');
      stubClose = sinon.stub(DB, 'closeConnection').rejects(err);
    });

    afterEach(() => {
      stubConnect.restore();
      stubInject.restore();
      stubClose.restore();
    });

    it('returns error', async () => {
      const db = DB.createMySqlClient('test');
      try {
        const r = await db.inject(TestRequestData);
        expect(r.error).to.be.eql(['Error: Something happened in closeConnection']);
        expect(r.results).to.be.null;
        expect(stubConnect.called).to.be.true;
        expect(stubInject.calledWith(fakeConn, TestRequestData)).to.be.true;
        expect(stubClose.called).to.be.true;
      }
      catch(e) {
        throw e;
      }
    });
  })

  context('When everything works fine', () => {
    let stubConnect, stubInject, stubClose;
    const fakeConn = {};

    beforeEach(() => {
      stubConnect = sinon.stub(DB, 'createConnection').returns(fakeConn);
      stubInject = sinon.stub(DB, 'injectData').resolves({ results: 'RESULTS' });
      stubClose = sinon.stub(DB, 'closeConnection');
    });

    afterEach(() => {
      stubConnect.restore();
      stubInject.restore();
      stubClose.restore();
    });

    it('returns injection results', async () => {
      const db = DB.createMySqlClient('test');
      try {
        const r = await db.inject(TestRequestData);
        expect(r.results).to.be.eql({ results: 'RESULTS' });
        expect(stubConnect.called).to.be.true;
        expect(stubInject.calledWith(fakeConn, TestRequestData)).to.be.true;
        expect(stubClose.called).to.be.true;
      }
      catch(e) {
        throw e;
      }
    });
  })

})

describe('DB.injectData', () => {
  let stubBeginTransaction, stubCommit, stubRollback, stubQuery;
  const { expReqs, expTrvls } = DB.sortOut(TestRequestData);
  const db = { beginTransaction: () => {}, commit: () => {},
    rollback: () => {}, query: () => {}};

  context('if something happens in db.beginTransaction', () => {
    const err = new Error('Something happened in db.beginTransaction')

    beforeEach(async () => {
      stubBeginTransaction = sinon.stub(db, 'beginTransaction').yields(err);
      stubCommit = sinon.stub(db, 'commit').yields(null);
      stubRollback = sinon.stub(db, 'rollback').yields(null);
      stubQuery = sinon.stub(db, 'query').yields(null, 'RSLTS', 'FIELDS');
    });

    afterEach(async () => {
      stubBeginTransaction.restore();
      stubCommit.restore();
      stubRollback.restore();
      stubQuery.restore();
    });

    it('returns error', async () => {
      try {
        let r = await DB.injectData(db, TestRequestData);
        throw e;
      }
      catch(e) {
        expect(e.toString()).to.be.equal('Error: Something happened in db.beginTransaction');
        expect(stubBeginTransaction.called).to.be.true;
        expect(stubQuery.notCalled).to.be.true;
        expect(stubCommit.notCalled).to.be.true;
        expect(stubRollback.called).to.be.true;
      }
    });
  })

  context('if something happens in db.query', () => {
    const err = new Error('Something happened in db.query')

    beforeEach(async () => {
      stubBeginTransaction = sinon.stub(db, 'beginTransaction').yields(null);
      stubCommit = sinon.stub(db, 'commit').yields(null);
      stubRollback = sinon.stub(db, 'rollback').yields(null);
      stubQuery = sinon.stub(db, 'query').yields(err, null, null);
    });

    afterEach(async () => {
      stubBeginTransaction.restore();
      stubCommit.restore();
      stubRollback.restore();
      stubQuery.restore();
    });

    it('returns error', async () => {
      try {
        let r = await DB.injectData(db, TestRequestData);
        throw e;
      }
      catch(e) {
        expect(e.toString()).to.be.equal('Error: Something happened in db.query');
        expect(stubBeginTransaction.called).to.be.true;
        expect(stubQuery.called).to.be.true;
        expect(stubCommit.notCalled).to.be.true;
        expect(stubRollback.called).to.be.true;
      }
    });
  })

  context('if something happens in db.commit', () => {
    const err = new Error('Something happened in db.commit')

    beforeEach(async () => {
      stubBeginTransaction = sinon.stub(db, 'beginTransaction').yields(null);
      stubCommit = sinon.stub(db, 'commit').yields(err);
      stubRollback = sinon.stub(db, 'rollback').yields(null);
      stubQuery = sinon.stub(db, 'query').yields(null, 'RSLTS', 'FIELDS');
    });

    afterEach(async () => {
      stubBeginTransaction.restore();
      stubCommit.restore();
      stubRollback.restore();
      stubQuery.restore();
    });

    it('returns error', async () => {
      try {
        let r = await DB.injectData(db, TestRequestData);
        throw e;
      }
      catch(e) {
        expect(e.toString()).to.be.equal('Error: Something happened in db.commit');
        expect(stubBeginTransaction.called).to.be.true;
        expect(stubQuery.called).to.be.true;
        expect(stubCommit.called).to.be.true;
        expect(stubRollback.called).to.be.true;
      }
    });
  })

  context('given valid data', () => {
    beforeEach(async () => {
      stubBeginTransaction = sinon.stub(db, 'beginTransaction').yields(null);
      stubCommit = sinon.stub(db, 'commit').yields(null);
      stubRollback = sinon.stub(db, 'rollback').yields(null);
      stubQuery = sinon.stub(db, 'query').yields(null, 'RSLTS', 'FIELDS');
    });

    afterEach(async () => {
      stubBeginTransaction.restore();
      stubCommit.restore();
      stubRollback.restore();
      stubQuery.restore();
    });

    it('returns injection results for both requests and travelers', async () => {
      try {
        let r = await DB.injectData(db, TestRequestData);
        expect(r).to.be.eql({
          request: { results: 'RSLTS', fields: 'FIELDS' },
          traveler: { results: 'RSLTS', fields: 'FIELDS' }
        });
        expect(stubBeginTransaction.called).to.be.true;
        expect(stubCommit.called).to.be.true;
        expect(stubRollback.notCalled).to.be.true;
        expect(stubQuery.calledTwice).to.be.true;
      }
      catch(e) {
        throw e;
      }
    });
  })
})

describe('DB.injectRequests', () => {
  context('given no data', () => {
    it('returns error', async () => {
      try {
        await DB.injectRequests({}, null);
        throw new Error('Should not be here');
      }
      catch(e) {
        expect(e.toString()).to.be.equal('Error: No Data Provided');
      }
    });
  })

  context('given empty data', () => {
    it('returns error', async () => {
      try {
        await DB.injectRequests({}, []);
        throw new Error('Should not be here');
      }
      catch(e) {
        expect(e.toString()).to.be.equal('Error: No Data Provided');
      }
    });
  })

  context('when db raises an exception', () => {
    let stub;
    const db = { query: () => {} };

    beforeEach(async () => {
      const err = new Error('Something happened');
      stub = sinon.stub(db, 'query');
      stub.yields(err, 'RESULTS', 'FIELDS');
    });

    afterEach(async () => {
      stub.restore();
    });

    it('returns error', async () => {
      try {
        await DB.injectRequests(db, RequestData);
        throw new Error('Should not be here');
      }
      catch(e) {
        expect(e.toString()).to.be.equal('Error: Something happened');
      }
      expect(stub.calledWith(
        DB.InsertRequestSQL,
        [...DB.REQUEST_COLUMNS, RequestData])
      ).to.be.true
    });
  })

  context('given data', () => {
    let stub;
    const db = { query: () => {} };

    beforeEach(async () => {
      stub = sinon.stub(db, 'query');
      stub.yields(null, 'RESULTS', 'FIELDS');
    });

    afterEach(async () => {
      stub.restore();
    });

    it('pupulates the database', async () => {
      try {
        const r = await DB.injectRequests(db, RequestData);
        expect(r).to.eql({
          results: 'RESULTS',
          fields: 'FIELDS'
        });
      }
      catch (e) {
        throw e;
      }
    });
  })

  /* This tests the actual db insertion
  context('given data', () => {
    const [_, conf] = DB.getConfig('test');

    it('pupulates the database', async () => {
      const db = await DB.createConnection(conf);
      try {
        const r = await DB.injectRequests(db, RequestData);

        expect(r).to.eql({
          results:
             OkPacket {
                  fieldCount: 0,
                  affectedRows: 3,
                  insertId: 0,
                  serverStatus: 2,
                  warningCount: 0,
                  message: '',
                  protocol41: true,
                  changedRows: 0 },
            fields: undefined
        });
      }
      catch (e) {
        console.log(e);
        throw e;
      }
    });
  })
  */
})

describe('DB.injectTravelers', () => {
  context('given no data', () => {
    it('returns error', async () => {
      try {
        await DB.injectTravelers({}, null);
        throw new Error('Should not be here');
      }
      catch(e) {
        expect(e.toString()).to.be.equal('Error: No Data Provided');
      }
    });
  })

  context('given empty data', () => {
    it('returns error', async () => {
      try {
        await DB.injectTravelers({}, []);
        throw new Error('Should not be here');
      }
      catch(e) {
        expect(e.toString()).to.be.equal('Error: No Data Provided');
      }
    });
  })

  context('when db raises an exception', () => {
    let stub;
    const db = { query: () => {} };

    beforeEach(async () => {
      const err = new Error('Something happened');
      stub = sinon.stub(db, 'query');
      stub.yields(err, { results: 'RESULTS' }, { fields: 'FIELDS' });
    });

    afterEach(async () => {
      stub.restore();
    });

    it('returns error', async () => {
      try {
        await DB.injectTravelers(db, TravelerData);
        throw new Error('Should not be here');
      }
      catch(e) {
        expect(e.toString()).to.be.equal('Error: Something happened');
      }
      expect(stub.calledWith(
        DB.InsertTravelerSQL,
        [...DB.TRAVELER_COLUMNS, TravelerData])
      ).to.be.true
    });
  })

  context('given data', () => {
    let stub;
    const db = { query: () => {} };

    beforeEach(async () => {
      stub = sinon.stub(db, 'query');
      stub.yields(null, 'RESULTS', 'FIELDS');
    });

    afterEach(async () => {
      stub.restore();
    });

    it('pupulates the database', async () => {
      try {
        const r = await DB.injectTravelers(db, TravelerData);
        expect(r).to.eql({
          results: 'RESULTS',
          fields: 'FIELDS'
        });
      }
      catch (e) {
        throw e;
      }
    });
  })

  /* This tests the actual db insertion
  context('given data', () => {
    const [_, conf] = DB.getConfig('test');

    it('pupulates the database', async () => {
      const db = await DB.createConnection(conf);
      try {
        const r = await DB.injectTravelers(db, TravelerData);

        expect(r).to.eql({
          results:
             OkPacket {
                  fieldCount: 0,
                  affectedRows: 3,
                  insertId: 0,
                  serverStatus: 2,
                  warningCount: 0,
                  message: '',
                  protocol41: true,
                  changedRows: 0 },
            fields: undefined
        });
      }
      catch (e) {
        console.log(e);
        throw e;
      }
    });
  })
  */
})

describe('DB.sortOut', () => {
  context('given no data', () => {
    it('returns empty arrays', () => {
      const { requests, travelers } = DB.sortOut([]);
      expect(requests).to.is.a('array').empty;
      expect(travelers).to.is.a('array').empty;
    });
  })

  context('given data', () => {
    const data = getRequests(3, true);

    it('separates requests and travelers', () => {
      const { requests, travelers } = DB.sortOut(data);
      expect(requests).to.be.eql(RequestData);
      expect(travelers.slice(0, 3)).to.be.eql(TravelerData);
      expect(travelers.slice(3, 6)).to.be.eql(TravelerData);
      expect(travelers.slice(6)).to.be.eql(TravelerData);
    });
  })
})

describe('DB.convRequestData', () => {
  const data = getRequest(1, true);

  it('pupulates the database', () => {
    const r = DB.convRequestData(data);
    expect(r).to.eql([
      'randomid', null, 'INJECTED@randomid', 'randomid', 'SYSTEMUSER', null, 'AG',
      'IMPORTED', 'AAAA1 BBBB1, CCCC1', 'AAAA1 BBBB1', 'aaaa@gmail.com',
      '2020-09-01', '2020-09-01', 'Approved', 'Mainland',
      'CISA Federal Critical Infrastructure Sector', null, null, 'XXXXXXXXX',
      0, 0, 0, 0, 0, 0, 0, 0, 0
    ]);
  });
})

describe('DB.convTravelerData', () => {
  const data = getTraveler(1, true);

  it('pupulates the database', () => {
    const r = DB.convTravelerData(data, 'ExemptionCategory');
    expect(r).to.eql([
      'randomid', 'randomid', 'INJECTED@randomid', 'ExemptionCategory', 'SYSTEMUSER',
      'PPPP1', null, 'QQQQ1', 'United States', 'Arizona', 'Oʻahu', '2020-10-01',
      null, null, null, '8089991111',
      'Hotel / Motel', '1111 Aaaa St, Honolulu, HI', 1, 'China'
    ]);
  });
})

describe('DB.convOrganizaionData', () => {
  const email = 'bkpznc.qbnn@sample.com'
  const data = {
    organizationId: 'yShbpuGz',
    organizationName: 'ORGNAME',
    status: 'Approved',
    agreement: 'yShbpuGz_agreement.pdf',
    agreementStartDate: '2020-12-22',
    agreementEndDate: '2021-03-28',
    phone: '3000068931',
    address: '1985 Xsjymo St., Beizmv, Alaska 95957',
    contactName: 'Bkpznc Qbnn',
    email: email,
    contactEmail: email,
    owner: email,
    createdBy: email,
    updatedBy: email
  }

  it('converts organization object into array', () => {
    const r = DB.convOrganizationData(data);
    expect(r).to.eql([
      'yShbpuGz', 'ORGNAME', 'Approved',
      'yShbpuGz_agreement.pdf', '2020-12-22', '2021-03-28',
      '3000068931', '1985 Xsjymo St., Beizmv, Alaska 95957',
      'Bkpznc Qbnn', email, email,
      email, email, email]);
  });
})

describe('DB.convMemberData', () => {
  const email = 'bkpznc.qbnn@sample.com'
  const data = {
    organizationId: 'yShbpuGz',
    memberId: 'OtUXscAj',
    approvalId: 'C#002rCECY',
    status: 'Active',
    firstName: 'Bkpznc',
    middleName: '',
    lastName: 'Qbnn',
    email: email,
    owner: email,
    createdBy: email,
    updatedBy: email
  }

  it('converts organization object into array', () => {
    const r = DB.convMemberData(data);
    expect(r).to.eql([
      'yShbpuGz', 'OtUXscAj', 'C#002rCECY', 'Active',
      'Bkpznc', '', 'Qbnn', email, email, email, email]);
  });
})

describe('DB.createConnection', () => {
  context('given bad config', () => {
    const [_, conf] = DB.getConfig('sample');
    const msg = 'Error: connect ECONNREFUSED 127.0.0.1:3306';

    it('returns error', (done) => {
      DB.createConnection(conf).catch((e) => {
        expect(e.toString()).to.equal(msg);
        done();
      });
    });
  })

  /* This tests the actual connection
  context('given valid config', () => {
    const [_, conf] = DB.getConfig('test');

    it('connects to the database', (done) => {
      DB.createConnection(conf)
        .then((db) => {
          expect(db.state).to.be.equal('authenticated');
          expect(db._connectCalled).to.be.true;
          done();
        })
        .catch((e) => {
          throw e;
          done();
        });
    });
  });
  */
});

describe('DB.checkConfig', () => {
  context('given empty conf', () => {
    it('returns error', () => {
      const err = DB.checkConfig({});
      expect(err).to.eql([
        'DB Host Not Provided',
        'DB Port Not Provided',
        'DB User Not Provided',
        'DB Password Not Provided',
        'Database Not Provided',
      ]);
    });
  });

  context('given non existing cert files', () => {
    const conf = {
      host: 'localhost',
      port: '3306',
      user: 'user',
      password: 'password',
      database: 'database',
      ssl: {
        ca: './path/to/ca.pem',
        key: './path/to/client-key.pem',
        cert: './path/to/client-cert.pem'
      }
    };

    it('returns error', () => {
      const err = DB.checkConfig(conf);
      expect(err).to.eql([
        'SSL CA Not Found: ./path/to/ca.pem',
        'SSL Key Not Found: ./path/to/client-key.pem',
        'SSL Cert Not Found: ./path/to/client-cert.pem',
      ]);
    });
  });
})

describe('DB.getConfig', () => {
  context('when config file does not exist', () => {
    it('returns error', () => {
      const [err, conf] = DB.getConfig('xxxx');
      expect(err).to.eql([
        'Config File Not Found: ./config/xxxx.json'
      ]);
      expect(conf).to.be.null;
    });
  });

  context('when config has invalid params', () => {
    it('returns error', () => {
      const [err, conf] = DB.getConfig('sample');
      expect(err).to.eql([
        'SSL CA Not Found: ./path/to/ca.pem',
        'SSL Key Not Found: ./path/to/client-key.pem',
        'SSL Cert Not Found: ./path/to/client-cert.pem',
      ]);
      expect(conf).to.be.eql({
        host: 'localhost',
        port: '3306',
        user: 'user',
        password: 'password',
        database: 'database',
        ssl: {
          ca: './path/to/ca.pem',
          key: './path/to/client-key.pem',
          cert: './path/to/client-cert.pem'
      }});
    });
  });

  context('given valid config file', () => {
    it('returns configuration', () => {
      const [err, conf] = DB.getConfig('test');
      expect(err).to.be.empty;
      const params = ['host', 'port', 'user', 'password', 'database'];
      for (let param of params) {
        expect(conf[param]).to.not.empty;
      }
    });
  });
});
