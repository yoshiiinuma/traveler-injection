
import { expect } from 'chai';
import sinon from 'sinon';
import Converter from '../src/convert.js';
import Random from '../src/random.js';

const input1 = [
  'aaaa@gmail.com',
  'AAAA1',
  'BBBB1',
  'CCCC1',
  '2020-09-01',
  '2020-09-02',
  'Approved',
  'Mainland',
  'CISA Federal Critical Infrastructure Sector',
  'CISA Federal Critical Infrastructure Sector',
  'Healthcare / Public Health',
  'XXXXXXXXX',
  'PPPP1',
  'M1',
  'QQQQ1',
  'United States',
  'Arizona',
  'Oʻahu',
  '2020-10-01',
  'A0001',
  '2020-10-02',
  'B0001',
  '8089991111',
  'Hotel / Motel',
  '1111 Aaaa St, Honolulu, HI',
  'TRUE',
  'China'
];

const input2 = [
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  'PPPP1',
  'M1',
  'QQQQ1',
  'United States',
  'Arizona',
  'Oʻahu',
  '2020-10-01',
  'A0001',
  '2020-10-02',
  'B0001',
  '8089991111',
  'Hotel / Motel',
  '1111 Aaaa St, Honolulu, HI',
  'TRUE',
  'China'
];

const expectedRequest = {
  RequestorEmail: 'aaaa@gmail.com',
  RequestorFirstName: 'AAAA1',
  RequestorLastName: 'BBBB1',
  RequestorCompany: 'CCCC1',
  ApplicationDate: '2020-09-01',
  CloseDate: '2020-09-02',
  Status: 'Approved',
  TravelType: 'Mainland',
  ExemptionCategory: 'CISA Federal Critical Infrastructure Sector',
  Purpose: 'CISA Federal Critical Infrastructure Sector',
  CISASubCategory: 'Healthcare / Public Health',
  Details: 'XXXXXXXXX',
};

const expectedTraveler = {
  TravelerFirstName: 'PPPP1',
  TravelerMiddleName: 'M1',
  TravelerLastName: 'QQQQ1',
  OriginCountry: 'United States',
  OriginState: 'Arizona',
  DestinationIsland: 'Oʻahu',
  ArrivalDate: '2020-10-01',
  ArrivalFlightNumber: 'A0001',
  DepartureDate: '2020-10-02',
  DepartureFlightNumber: 'B0001',
  Phone: '8089991111',
  QuarantineLocationType: 'Hotel / Motel',
  QuarantineLocationAddress: '1111 Aaaa St, Honolulu, HI',
  Travel14DaysBeforeArrival: 1,
  RecentTravels: 'China'
};

describe('Converter.convert', () => {
  let stub;

  beforeEach(() => {
    stub = sinon.stub(Random, 'generateInjectionId');
    stub.returns('randomid');
  });

  afterEach(() => {
    stub.restore();
  });

  context('given request and travler info', () => {
    it('converts array into object', () => {
      expect(Converter.convert(input1)).to.eql({
        request: expectedRequest,
        traveler: expectedTraveler
      })
    });
  });

  context('given only travler info', () => {
    it('converts array into object', () => {
      expect(Converter.convert(input2)).to.eql({
        request: null,
        traveler: expectedTraveler
      })
    });
  });
});

describe('Converter.convertRequest', () => {
  const data = input1.slice(0, 12);

  it('converts array into object', () => {
    expect(Converter.convertRequest(data)).to.eql(expectedRequest);
  })
});

describe('Converter.convertRequest', () => {
  const data = input1.slice(12);

  it('converts array into object', () => {
    expect(Converter.convertTraveler(data)).to.eql(expectedTraveler);
  })
});

describe('Converter.fixTraveler', () => {
  context('when Travel14DaysBeforeArrival is "TRUE"', () => {
    const data = { Travel14DaysBeforeArrival: 'TRUE' }

    it('changes the value to 1', () => {
      expect(Converter.fixTraveler(data)).to.eql({
        Travel14DaysBeforeArrival: 1
      })
    })
  })

  context('when Travel14DaysBeforeArrival is not "TRUE"', () => {
    const expected = { Travel14DaysBeforeArrival: 0 };
    const data1 = { Travel14DaysBeforeArrival: 'FALSE' }
    const data2 = { Travel14DaysBeforeArrival: null }
    const data3 = { Travel14DaysBeforeArrival: '' }
    const data4 = { Travel14DaysBeforeArrival: 0 }

    it('sets 0', () => {
      expect(Converter.fixTraveler(data1)).to.eql(expected)
      expect(Converter.fixTraveler(data2)).to.eql(expected)
      expect(Converter.fixTraveler(data3)).to.eql(expected)
      expect(Converter.fixTraveler(data4)).to.eql(expected)
    })
  })
});

