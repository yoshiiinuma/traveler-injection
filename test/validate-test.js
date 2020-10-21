
import { expect } from 'chai';
import Validator from '../src/validate.js';

const requestData = {
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

const travelerData = {
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
  Phone: '(808)999-1111',
  QuarantineLocationType: 'Hotel / Motel',
  QuarantineLocationAddress: '1111 Aaaa St, Honolulu, HI',
  Travel14DaysBeforeArrival: 1,
  RecentTravels: 'China'
};

describe('Validator.validate', () => {
  context('given valid data', () => {
    const data = {
      ...requestData,
      travelers: [{...travelerData}, {...travelerData}, {...travelerData}]
    };

    it('returns true', () => {
      const r = Validator.validate(data);
      expect(r).to.be.true;
      expect(data.errors).to.be.undefined;
      for (let t in data.travlers) {
        exect(t.errors).to.be.undefined;
      }
    })
  });

  context('given invalid request data', () => {
    const data = {
      ...requestData,
      ApplicationDate: 'XXXX',
      travelers: [{...travelerData}, {...travelerData}, {...travelerData}]
    };

    it('returns false', () => {
      const r = Validator.validate(data);
      expect(r).to.be.false;
      expect(data.errors).to.be.eql([
        'ApplicationDate must be valid date (YYYY-MM-DD): XXXX'
      ]);
      for (let t in data.travlers) {
        exect(t.errors).to.be.undefined;
      }
    })
  });

  context('given invalid traveler data', () => {
    const data = {
      ...requestData,
      travelers: [
        {...travelerData},
        {...travelerData, OriginCountry: 'XXXX'},
        {...travelerData}]
    };

    it('returns false', () => {
      const r = Validator.validate(data);
      expect(r).to.be.false;
      expect(data.errors).to.be.undefined;
      expect(data.travelers[0].errors).to.be.undefined;
      expect(data.travelers[2].errors).to.be.undefined;
      expect(data.travelers[1].errors).to.be.eql([
        'OriginCountry must be selected from the list: XXXX'
      ]);
    });
  });
});

describe('Validator.validateRequest', () => {
  context('given valid request', () => {
    const r = { ...requestData };

    it('does not change anything', () => {
      const e = Validator.validateRequest(r);
      expect(e).to.be.true;
      expect(r).to.eql(requestData);
    })
  });

  context('given invalid request', () => {
    const r1 = {};
    const r2 = { ...requestData, 
      ApplicationDate: '9999-99-99',
      CloseDate: 'xxxx-xx-xx',
      Status: 'XXXX',
      TravelType: 'XXXX',
      ExemptionCategory: 'XXXX',
      Purpose: 'XXXX',
      CISASubCategory: 'XXXX',
    };
    const exp1 = [
      'RequestorEmail must not be blank',
      'RequestorFirstName must not be blank',
      'RequestorLastName must not be blank',
      'ApplicationDate must not be blank',
      'CloseDate must not be blank',
      'Status must not be blank',
      'ExemptionCategory must not be blank',
      'Details must not be blank'
    ]
    const exp2 = [
      'ApplicationDate must be valid date (YYYY-MM-DD): 9999-99-99',
      'CloseDate must be valid date (YYYY-MM-DD): xxxx-xx-xx',
      'Status must be selected from the list: XXXX',
      'TravelType must be selected from the list: XXXX',
      'ExemptionCategory must be selected from the list: XXXX',
      'Purpose must be selected from the list: XXXX',
      'CISASubCategory must be selected from the list: XXXX'
    ]

    it('returns error', () => {
      let e = Validator.validateRequest(r1);
      expect(e).to.be.false;
      expect(r1.errors).to.be.eql(exp1);

      e = Validator.validateRequest(r2);
      expect(e).to.be.false;
      expect(r2.errors).to.be.eql(exp2);
    })
  });
});

describe('Validator.validateTraveler', () => {
  const r = { ...travelerData };

  context('given valid traveler ', () => {
    it('does not change anything', () => {
      const e = Validator.validateTraveler(r);
      expect(e).to.be.true;
      expect(r).to.eql(travelerData);
    })
  });

  context('given invalid traveler', () => {
    const r1 = {};
    const r2 = {
      ...travelerData,
      OriginCountry: 'XXXX',
      OriginState: 'XXXX',
      DestinationIsland: 'XXXX',
      ArrivalDate: '9999-99-99',
      DepartureDate: 'xxxx-xx-xx',
      Phone: 'XXXX',
      QuarantineLocationType: 'XXXX',
      Travel14DaysBeforeArrival: 'XXXX',
    };
    const exp1 = [
      'TravelerFirstName must not be blank',
      'TravelerLastName must not be blank',
      'Travel14DaysBeforeArrival must be boolean: undefined'
    ];
    const exp2 = [
      'OriginCountry must be selected from the list: XXXX',
      'OriginState must be selected from the list: XXXX',
      'ArrivalDate must be valid date (YYYY-MM-DD): 9999-99-99',
      'DepartureDate must be valid date (YYYY-MM-DD): xxxx-xx-xx',
      'Phone must be valid phone number: XXXX',
      'QuarantineLocationType must be selected from the list: XXXX',
      'Travel14DaysBeforeArrival must be boolean: XXXX'
    ];

    it('returns error', () => {
      let e = Validator.validateTraveler(r1);
      expect(e).to.be.false;
      expect(r1.errors).to.be.eql(exp1);

      e = Validator.validateTraveler(r2);
      expect(e).to.be.false;
      expect(r2.errors).to.be.eql(exp2);
    })
  });
});

describe('Validator.checkBlank', () => {
  context('when the value is required but not provied', () => {
    const rule = { required: true, type: 'string' }
    const r1 = { A: '' }
    const r2 = { A: null }
    const k = 'A' 
    const e1 = []
    const e2 = []

    it('returns error', () => {
      Validator.checkBlank(rule, r1, k, e1);
      expect(e1).to.be.eql(['A must not be blank']);

      Validator.checkBlank(rule, r2, k, e2);
      expect(e2).to.be.eql(['A must not be blank']);
    });
  });

  context('when the bool type value is required', () => {
    context('and provided', () => {
      const rule = { required: true, type: 'bool' }
      const r1 = { A: 0 }
      const r2 = { A: 1 }
      const k = 'A' 
      const e1 = []
      const e2 = []

      it('does not change anything', () => {
        Validator.checkBlank(rule, r1, k, e1);
        expect(e1).to.be.eql([]);
        expect(r1).to.be.eql({ A: 0 });

        Validator.checkBlank(rule, r2, k, e2);
        expect(e2).to.be.eql([]);
        expect(r2).to.be.eql({ A: 1 });
      });
    });

    context('but not provided', () => {
      const rule = { required: true, type: 'bool' }
      const r1 = { A: null }
      const k = 'A' 
      const e1 = []

      it('returns error', () => {
        Validator.checkBlank(rule, r1, k, e1);
        expect(e1).to.be.eql(['A must not be blank']);
      });
    });
  });

  context('when the value is not required', () => {
    const rule = { required: false, type: 'string' }
    const r = { A: '' }
    const k = 'A' 
    const e = []

    it('does not change anything', () => {
      Validator.checkBlank(rule, r, k, e);
      expect(e).to.be.eql([]);
      expect(r).to.be.eql({ A: '' });
    });
  });
});

describe('Validator.checkEnum', () => {
  context('when options do not include the value', () => {
    const rule = { required: false, type: 'enum', options: ['aaa', 'bbb'] }
    const r = { A: 'ccc' }
    const k = 'A' 
    const e = []

    it('returns error', () => {
      Validator.checkEnum(rule, r, k, e);
      expect(e).to.be.eql(['A must be selected from the list: ' + 'ccc']);
    });
  });

  context('when options include the value', () => {
    const rule = { required: false, type: 'enum', options: ['aaa', 'bbb'] }
    const r = { A: 'bbb' }
    const k = 'A' 
    const e = []

    it('does not change anything', () => {
      Validator.checkEnum(rule, r, k, e);
      expect(e).to.be.eql([]);
      expect(r).to.be.eql({ A: 'bbb' });
    });
  });

  context('when type is not enum', () => {
    const rule = { required: false, type: 'string'}
    const r = { A: 'bbb' }
    const k = 'A' 
    const e = []

    it('does not change anything', () => {
      Validator.checkEnum(rule, r, k, e);
      expect(e).to.be.eql([]);
      expect(r).to.be.eql({ A: 'bbb' });
    });
  });
});

describe('Validator.checkBool', () => {
  context('when type is bool', () => {
    context('and the value is 0 or 1', () => {
      const rule = { required: false, type: 'bool'}
      const r1 = { A: 0 }
      const r2 = { A: 1 }
      const k = 'A' 
      const e = []

      it('does not change anything', () => {
        Validator.checkBool(rule, r1, k, e);
        expect(e).to.be.eql([]);
        expect(r1).to.be.eql({ A: 0 });

        Validator.checkBool(rule, r2, k, e);
        expect(e).to.be.eql([]);
        expect(r2).to.be.eql({ A: 1 });
      });
    });

    context('and the value is neither 0 nor 1', () => {
      const rule = { required: false, type: 'bool'}
      const r = { A: 'bbb' }
      const k = 'A' 
      const e = []

      it('returns error', () => {
        Validator.checkBool(rule, r, k, e);
        expect(e).to.be.eql(['A must be boolean: bbb']);
      });
    });
  });

  context('when type is not bool', () => {
    const rule = { required: false, type: 'string'}
    const r = { A: 'bbb' }
    const k = 'A' 
    const e = []

    it('does not change anything', () => {
      Validator.checkBool(rule, r, k, e);
      expect(e).to.be.eql([]);
      expect(r).to.be.eql({ A: 'bbb' });
    });
  });
});

describe('Validator.checkDate', () => {
  context('when type is date', () => {
    context('and value is not formatted', () => {
      const rule = { required: false, type: 'date'};
      const r1 = { A: '20201013' };
      const r2 = { A: '9999-99-99' };
      const k = 'A';
      const e1 = [];
      const e2 = [];

      it('returns error', () => {
        Validator.checkDate(rule, r1, k, e1);
        expect(e1).to.be.eql(['A must be valid date (YYYY-MM-DD): 20201013']);

        Validator.checkDate(rule, r2, k, e2);
        expect(e2).to.be.eql(['A must be valid date (YYYY-MM-DD): 9999-99-99']);
      });
    });

    context('and value is formatted', () => {
      const rule = { required: false, type: 'date'};
      const r = { A: '2020-10-13' };
      const k = 'A';
      const e = [];

      it('does not change anything', () => {
        Validator.checkDate(rule, r, k, e);
        expect(e).to.be.eql([]);
        expect(r).to.be.eql({ A: '2020-10-13' });
      });
    });
  });

  context('when type is not date', () => {
    const rule = { required: false, type: 'string'}
    const r = { A: 'bbb' }
    const k = 'A' 
    const e = []

    it('does not change anything', () => {
      Validator.checkDate(rule, r, k, e);
      expect(e).to.be.eql([]);
      expect(r).to.be.eql({ A: 'bbb' });
    });
  });
});

describe('Validator.rgxPhone', () => {
  const rgxPhone = Validator.rgxPhone;

  it('validates phone number', () => {
    expect(rgxPhone.test('1234567890')).to.be.true;
    expect(rgxPhone.test('+1 1234567890')).to.be.true;
    expect(rgxPhone.test('123 456 7890')).to.be.true;
    expect(rgxPhone.test('(123) 456 7890')).to.be.true;
    expect(rgxPhone.test('(123) 456-7890')).to.be.true;
    expect(rgxPhone.test('+1(123)4567890')).to.be.true;
    expect(rgxPhone.test('+1(123) 456 7890')).to.be.true;
    expect(rgxPhone.test('+1 (123) 456 7890')).to.be.true;
    expect(rgxPhone.test('+1-123-456-7890')).to.be.true;
    expect(rgxPhone.test('+81 123 456 7890')).to.be.true;
    expect(rgxPhone.test('+81.123.456.7890')).to.be.true;
  });
});

describe('Validator.checkPhone', () => {
  context('when type is phone', () => {
    context('and the value is valid phone number', () => {
      const rule = { required: false, type: 'phone'};
      const r1 = { A: '1234567890' };
      const r2 = { A: '(123) 456-7890' };
      const r3 = { A: '+1(123) 456 7890' };
      const r4 = { A: '+1-123-456-7890' };
      const r5 = { A: '+81 123 456 7890' };
      const k = 'A';
      const e = [];

      it('does not change anything', () => {
        Validator.checkDate(rule, r1, k, e);
        expect(e).to.be.eql([]);
        expect(r1).to.be.eql({ A: '1234567890' });

        Validator.checkDate(rule, r2, k, e);
        expect(e).to.be.eql([]);
        expect(r2).to.be.eql({ A: '(123) 456-7890' });

        Validator.checkDate(rule, r3, k, e);
        expect(e).to.be.eql([]);
        expect(r3).to.be.eql({ A: '+1(123) 456 7890' });

        Validator.checkDate(rule, r4, k, e);
        expect(e).to.be.eql([]);
        expect(r4).to.be.eql({ A: '+1-123-456-7890' });

        Validator.checkDate(rule, r5, k, e);
        expect(e).to.be.eql([]);
        expect(r5).to.be.eql({ A: '+81 123 456 7890' });
      });
    });

    context('ant the value is not valid phone number', () => {
      const rule = { required: false, type: 'phone'};
      const r = { A: '12X456X890' };
      const k = 'A';
      const e = [];

      it('returs error', () => {
        Validator.checkPhone(rule, r, k, e);
        expect(e).to.be.eql(['A must be valid phone number: 12X456X890']);
      });
    });
  });

  context('when type is not phone', () => {
    const rule = { required: false, type: 'string'};
    const r = { A: 'bbb' };
    const k = 'A';
    const e = [];

    it('does not change anything', () => {
      Validator.checkPhone(rule, r, k, e);
      expect(e).to.be.eql([]);
      expect(r).to.be.eql({ A: 'bbb' });
    });
  });
});
