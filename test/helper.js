
import Random from '../src/random.js';

export const getRequest = (seq = 1, needId = false, requestId = null) => {
  let r = {
    RequestorEmail: 'aaaa@gmail.com',
    RequestorFirstName: `AAAA${seq}`,
    RequestorLastName: `BBBB${seq}`,
    RequestorCompany: `CCCC${seq}`,
    ApplicationDate: `2020-09-0${seq}`,
    CloseDate: `2020-09-0${seq}`,
    Status: 'Approved',
    TravelType: 'Mainland',
    ExemptionCategory: 'CISA Federal Critical Infrastructure Sector',
    Details: 'XXXXXXXXX',
  };
  if (needId) {
    r = { ...r, RequestId: 'randomid', Owner: 'INJECTED@randomid' };
    if (requestId) {
      r.RequestId = requestId;
      r.Owner = 'INJECTED@' + requestId;
    }
  }
  return r;
};

export const getTraveler = (seq = 1, needId = false, requestId = null) => {
  const seq4 = `${seq}${seq}${seq}${seq}`;
  let r = {
    TravelerFirstName: `PPPP${seq}`,
    TravelerLastName: `QQQQ${seq}`,
    OriginCountry: 'United States',
    OriginState: 'Arizona',
    DestinationIsland: 'Oʻahu',
    ArrivalDate: `2020-10-0${seq}`,
    Phone: `808999${seq4}`,
    QuarantineLocationType: 'Hotel / Motel',
    QuarantineLocationAddress: `${seq4} Aaaa St, Honolulu, HI`,
    Travel14DaysBeforeArrival: 0,
  };

  if (seq === 1) {
    r.Travel14DaysBeforeArrival = 1;
    r.RecentTravels = 'China';
  }
  if (needId) {
    r = { ...r, RequestId: 'randomid', TravelerId: 'randomid', Owner: 'INJECTED@randomid' };
    if (requestId) {
      r.RequestId = requestId;
      r.TravelerId = Random.generateId();
      r.Owner = 'INJECTED@' + requestId;
    }
  }
  return r;
};

export const getRequestWithTravelers = (numOfTravelers = 3, seq = 1, needId = false, realId = false) => {
  const reqId = (realId) ? Random.generateId() : null
  const r = getRequest(seq, needId, reqId);
  r.travelers = [];
  for (let i = 1; i <= numOfTravelers; i++) {
    r.travelers.push(getTraveler(i, needId, reqId));
  }
  return r;
};

export const getRequests = (numOfRequests, needId = false, realId = false) => {
  const r = [];
  for (let i = 1; i <= numOfRequests; i++) {
    r.push(getRequestWithTravelers(3, i, needId, realId));
  }
  return r;
};

export const TestRequestData = [
  ...getRequests(3, true)
];

export const TestRequestDataWithRealId = [
  ...getRequests(3, true, true)
];

/*
export const expectedDataOld = [
  { RequestId: 'randomid',
    Owner: 'INJECTED@randomid',
    RequestorEmail: 'aaaa@gmail.com',
    RequestorFirstName: 'AAAA1',
    RequestorLastName: 'BBBB1',
    RequestorCompany: 'CCCC1',
    ApplicationDate: '2020-09-01',
    CloseDate: '2020-09-02',
    Status: 'Approved',
    TravelType: 'Mainland',
    ExemptionCategory: 'CISA Federal Critical Infrastructure Sector',
    Details: 'XXXXXXXXX',
    travelers:
     [ { RequestId: 'randomid',
         Owner: 'INJECTED@randomid',
         TravelerId: 'randomid',
         TravelerFirstName: 'PPPP1',
         TravelerLastName: 'QQQQ1',
         OriginCountry: 'United States',
         OriginState: 'Arizona',
         DestinationIsland: 'Oʻahu',
         ArrivalDate: '2020-10-01',
         Phone: '8089991111',
         QuarantineLocationType: 'Hotel / Motel',
         QuarantineLocationAddress: '1111 Aaaa St, Honolulu, HI',
         Travel14DaysBeforeArrival: 1,
         RecentTravels: 'China' },
       { RequestId: 'randomid',
         Owner: 'INJECTED@randomid',
         TravelerId: 'randomid',
         TravelerFirstName: 'PPPP2',
         TravelerLastName: 'QQQQ2',
         OriginCountry: 'United States',
         OriginState: 'Arizona',
         DestinationIsland: 'Oʻahu',
         ArrivalDate: '2020-10-02',
         Phone: '8089992222',
         QuarantineLocationType: 'Hotel / Motel',
         QuarantineLocationAddress: '2222 Bbbb St, Honolulu, HI',
         Travel14DaysBeforeArrival: 0 },
       { RequestId: 'randomid',
         Owner: 'INJECTED@randomid',
         TravelerId: 'randomid',
         TravelerFirstName: 'PPPP3',
         TravelerLastName: 'QQQQ3',
         OriginCountry: 'United States',
         OriginState: 'Arizona',
         DestinationIsland: 'Oʻahu',
         ArrivalDate: '2020-10-03',
         Phone: '8089993333',
         QuarantineLocationType: 'Hotel / Motel',
         QuarantineLocationAddress: '3333 Cccc St, Honolulu, HI',
         Travel14DaysBeforeArrival: 0 } ]
  },
  { RequestId: 'randomid',
    Owner: 'INJECTED@randomid',
    RequestorEmail: 'aaaa@gmail.com',
    RequestorFirstName: 'AAAA2',
    RequestorLastName: 'BBBB2',
    RequestorCompany: 'CCCC2',
    ApplicationDate: '2020-09-02',
    CloseDate: '2020-09-02',
    Status: 'Denied',
    TravelType: 'Interisland',
    ExemptionCategory: 'Recreational Boat Arrival',
    Details: 'XXXXXXXXX',
    travelers:
     [ { RequestId: 'randomid',
         Owner: 'INJECTED@randomid',
         TravelerId: 'randomid',
         TravelerFirstName: 'PPPP1',
         TravelerLastName: 'QQQQ1',
         OriginCountry: 'United States',
         OriginState: 'Arizona',
         DestinationIsland: 'Oʻahu',
         ArrivalDate: '2020-10-01',
         Phone: '8089991111',
         QuarantineLocationType: 'Hotel / Motel',
         QuarantineLocationAddress: '1111 Aaaa St, Honolulu, HI',
         Travel14DaysBeforeArrival: 1,
         RecentTravels: 'China' },
       { RequestId: 'randomid',
         Owner: 'INJECTED@randomid',
         TravelerId: 'randomid',
         TravelerFirstName: 'PPPP2',
         TravelerLastName: 'QQQQ2',
         OriginCountry: 'United States',
         OriginState: 'Arizona',
         DestinationIsland: 'Oʻahu',
         ArrivalDate: '2020-10-02',
         Phone: '8089992222',
         QuarantineLocationType: 'Hotel / Motel',
         QuarantineLocationAddress: '2222 Bbbb St, Honolulu, HI',
         Travel14DaysBeforeArrival: 0 },
       { RequestId: 'randomid',
         Owner: 'INJECTED@randomid',
         TravelerId: 'randomid',
         TravelerFirstName: 'PPPP3',
         TravelerLastName: 'QQQQ3',
         OriginCountry: 'United States',
         OriginState: 'Arizona',
         DestinationIsland: 'Oʻahu',
         ArrivalDate: '2020-10-03',
         Phone: '8089993333',
         QuarantineLocationType: 'Hotel / Motel',
         QuarantineLocationAddress: '3333 Cccc St, Honolulu, HI',
         Travel14DaysBeforeArrival: 0 } ]
  },
  { RequestId: 'randomid',
    Owner: 'INJECTED@randomid',
    RequestorEmail: 'aaaa@gmail.com',
    RequestorFirstName: 'AAAA3',
    RequestorLastName: 'BBBB3',
    RequestorCompany: 'CCCC3',
    ApplicationDate: '2020-09-03',
    CloseDate: '2020-09-03',
    Status: 'Approved',
    TravelType: 'Mainland',
    ExemptionCategory: 'Other',
    Details: 'XXXXXXXXX',
    travelers:
     [ { RequestId: 'randomid',
         Owner: 'INJECTED@randomid',
         TravelerId: 'randomid',
         TravelerFirstName: 'PPPP1',
         TravelerLastName: 'QQQQ1',
         OriginCountry: 'United States',
         OriginState: 'Arizona',
         DestinationIsland: 'Oʻahu',
         ArrivalDate: '2020-10-01',
         Phone: '8089991111',
         QuarantineLocationType: 'Hotel / Motel',
         QuarantineLocationAddress: '1111 Aaaa St, Honolulu, HI',
         Travel14DaysBeforeArrival: 1,
         RecentTravels: 'China' },
       { RequestId: 'randomid',
         Owner: 'INJECTED@randomid',
         TravelerId: 'randomid',
         TravelerFirstName: 'PPPP2',
         TravelerLastName: 'QQQQ2',
         OriginCountry: 'United States',
         OriginState: 'Arizona',
         DestinationIsland: 'Oʻahu',
         ArrivalDate: '2020-10-02',
         Phone: '8089992222',
         QuarantineLocationType: 'Hotel / Motel',
         QuarantineLocationAddress: '2222 Bbbb St, Honolulu, HI',
         Travel14DaysBeforeArrival: 0 },
       { RequestId: 'randomid',
         Owner: 'INJECTED@randomid',
         TravelerId: 'randomid',
         TravelerFirstName: 'PPPP3',
         TravelerLastName: 'QQQQ3',
         OriginCountry: 'United States',
         OriginState: 'Arizona',
         DestinationIsland: 'Oʻahu',
         ArrivalDate: '2020-10-03',
         Phone: '8089993333',
         QuarantineLocationType: 'Hotel / Motel',
         QuarantineLocationAddress: '3333 Cccc St, Honolulu, HI',
         Travel14DaysBeforeArrival: 0 } ] }
];
*/
