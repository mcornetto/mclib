const { makeId, makeGUID, makeNumber } = require("../src/generate");

describe('generate makeId', function() {

  it('id length is 5', function() {
    expect(makeId()).toHaveLength(5);
  }); 
  it('id length is 8', function() {
      expect(makeId(8)).toHaveLength(8);
  });   
  it('id is string', function() {
    expect(typeof makeId()).toBe('string');
  });   
  it('id is unique 100 times', function () {
    let unique = true, resultold = '', resultnew = makeId();
    for (var i = 0; i < 100 || !unique; i++) {
      if (resultnew !== resultold) {
        resultold = resultnew;
        resultnew = makeId();
      } else {
        unique = false;
      }
    }
    expect(unique).toBe(true);
  }); 
});

describe('generate makeGUID', function() {

  it('GUID length is 36', function() {
    expect(makeGUID()).toHaveLength(36);
  }); 
  it('GUID is string', function() {
    expect(typeof makeId()).toBe('string');
  });   
  it('GUID is unique 100 times', function () {
    let unique = true, resultold = '', resultnew = makeGUID();
    for (var i = 0; i < 100 || !unique; i++) {
      if (resultnew !== resultold) {
        resultold = resultnew;
        resultnew = makeGUID();
      } else {
        unique = false;
      }
    }
    expect(unique).toBe(true);
  }); 
});

describe('generate makeNumber', function() {

  it('Number length 6', function() {
    let result = makeNumber();
    expect(result.toString()).toHaveLength(6);
  }); 
  it('Number <- 999999', function() {
    let result = makeNumber();
    expect(result).toBeLessThanOrEqual(999999);
  }); 

  it('Number length 8', function() {
    let result = makeNumber(8);
    expect(result.toString()).toHaveLength(8);
  }); 
  it('Number <- 99999999', function() {
    let result = makeNumber(8);
    expect(result).toBeLessThanOrEqual(99999999);
  }); 

  it('Number is unique 100 times', function () {
    let unique = true, resultold = -1, resultnew = makeNumber();
    for (var i = 0; i < 100 || !unique; i++) {
      if (resultnew !== resultold) {
        resultold = resultnew;
        resultnew = makeNumber();
      } else {
        unique = false;
      }
    }
    expect(unique).toBe(true);
  }); 
});