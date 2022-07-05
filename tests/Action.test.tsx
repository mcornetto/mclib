const { Action } = require("../src/Action");

describe('test Action not asynch', function() {

  it('simple Action', function() {
    expect.assertions(1);
    function callback1( obj) {
      expect(obj).toEqual(1);
    }

    let action = new Action();

    action.act(callback1);
    action.perform(1);
  }); 

  it('double Action', function() {
    let x=0;
    expect.assertions(2);
    function callback1() {
      x++;
      expect(x).toEqual(1);

    }
    function callback2() {
      x++;
      expect(x).toEqual(2);

    }
    let action = new Action();

    action.act(callback1);
    action.act(callback2);
    action.perform();
  }); 

  it('cancel Action', function() {
    let x=0;
    expect.assertions(3);
    function callback1() {
      x++;
      expect(x).toEqual(1);

    }
    function callback2() {
      x++;
      expect(x).toEqual(2);
    }
    function callback3() {
      x++;
      expect(x).toEqual(2);

    }
    let action = new Action();

    let a1 = action.act(callback1);
    let a2 = action.act(callback2);
    let a3 = action.act(callback3);
    expect(a1!==a2 && a2!==a3 && a1!==a3).toBeTruthy();
    action.cancel(a2);
    action.perform();
  }); 

  it('react Action', function() {
    let x=0;
    expect.assertions(2);
    function callback1() {
      x++;
      expect(x).toEqual(1);

    }
    function callback2() {
      x++;
      expect(x).toEqual(2);
    }
    function callback3() {
      x++;
      expect(x).toEqual(2);

    }
    let action = new Action();

    action.act(callback1);
    
    action.perform();
    action.act(callback2);
    action.react(callback3);
    
  });
});

describe('test Action asynch', function() {

  it('simple Action', function() {
    expect.assertions(1);
    function callback1( obj) {
      expect(obj).toEqual(1);
    }

    let action = new Action(5);

    action.act(callback1);
    action.perform(1);
  }); 

  it('double Action', function() {
    let x=0;
    expect.assertions(2);
    function callback1() {
      x++;
      expect(x).toEqual(1);

    }
    function callback2() {
      x++;
      expect(x).toEqual(2);

    }
    let action = new Action(5);

    action.act(callback1);
    action.act(callback2);
    action.perform();
  }); 

});