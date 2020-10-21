
import { expect } from 'chai';
import sinon from 'sinon';
import Parser from '../src/parse.js';
import Random from '../src/random.js';
import { TestRequestData } from './helper.js';

describe('Parser.parse', () => {
 context('with a valid CSV file', () => {
    let stub;

    beforeEach(() => {
      stub = sinon.stub(Random, 'generateId');
      stub.returns('randomid');
    });

    afterEach(() => {
      stub.restore();
    });

   it('converts the csv to Object array', async () => {
     const r = await Parser.parse('./test/test.csv')
   
     expect(r.error).to.be.false;
     expect(r.data).to.be.eql(TestRequestData);
   })
 })

 context('with an invalid CSV file with some invalid data', () => {
   it('returns error', async () => {
     const r = await Parser.parse('./test/error1.csv')
     expect(r.error).to.be.true;
     expect(r.data[0].errors).to.be.undefined;
     for (let t of r.data[0].travelers) {
       expect(t.errors).to.be.undefined;
     }
     expect(r.data[2].errors).to.be.undefined;
     expect(r.data[1].errors).to.be.eql([
       'Status must be selected from the list: XXXX'
     ]);
     for (let t of r.data[1].travelers) {
       expect(t.errors).to.be.undefined;
     }
     expect(r.data[2].travelers[0].errors).to.be.undefined;
     expect(r.data[2].travelers[1].errors).to.be.eql([
       'QuarantineLocationType must be selected from the list: XXXX'
     ]);
   })
 })

 context('with an invalid CSV file with only traveler data', () => {
   it('throws an error', async () => {
     const msg = 'Error: Traveler must belong to a Request >>> ' +
       ', , , , , , , , , , , , PPPP1, , QQQQ1, United States, Arizona, ' +
       'Oʻahu, 2020-10-01, , , , 8089991111, Hotel / Motel, 1111 Aaaa St, Honolulu, HI, , ';

     await Parser.parse('./test/error2.csv')
       .catch((e) => {
         expect(e.toString()).to.be.equal(msg);
       })
   })
 })

 context('with a CSV file with no data', () => {
   it('throws an error', async () => {
     const msg = 'Error: No Data Provided';
     await Parser.parse('./test/error3.csv')
       .catch((e) => {
         expect(e.toString()).to.equal(msg)
       })
   })
 })

 context('with non-existent file', () => {
   it('throws an error', async () => {
     const msg = 'Error: File Not Exists: ./test/not-exist.csv'
     await Parser.parse('./test/not-exist.csv')
       .catch((e) => {
         expect(e.toString()).to.equal(msg)
       })
   })
 })
})
