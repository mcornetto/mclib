const { TaskList } = require("../src/TaskList");

describe('test TaskList', () => {

  it('all tasks', (done) => {
    const pl = new TaskList();
    expect.assertions(12);
    function task1(arg) {
      expect(arg).toEqual(1);

    }
    function task2(arg) {
      expect(arg).toEqual("hello");
    }
    function task3(arg) {
      expect(arg.x ===1 && arg.y ==="hello").toBeTruthy();

    }
    function task4(arg) {
        expect(arg).toBeUndefined();
  
    }
    let task5  = "task5";  
    function task6(arg) {
        expect(arg).toEqual(1);
  
    }


    pl.invalid.act(function(arg) {
        expect(arg).not.toBeNull();
    });
    pl.progress.act(function(arg) {
        expect(arg).not.toBeNull();
    });
    let a = pl.listEmpty.act(function(arg) {
        pl.listEmpty.cancel(a);
        pl.listEmpty.act(function(arg){
            done();
        });
        expect(arg).toBeUndefined();

        pl.queue(task6,1);
    });

    pl.queue(task1,1);
    pl.queue(task2,"hello");
    pl.queue(task3,{x:1,y:"hello"});
    pl.queue(task4);
    pl.queue(task5,1);
 
  }); 

});
