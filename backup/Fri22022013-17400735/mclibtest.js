mclib.test = (function () {
    "use strict";

    var tests = {};

    return {
        add: function (id, caption, func) {
            var test = {
                id: id,
                caption: caption,
                run: func
            };
            mclib.object.merge(test);
            test.merge(test, new mclib.test.Helper());

            tests[id]=test;
        },
        runAll: function () {
            for (var item in tests) {
                if (tests[item].run) {
                    tests[item].run();
                }
            }
        },
        runOne: function (id) {
            if (tests[id].run) {
                tests[id].run();
            }
        }
    }
})();

mclib.test.Helper = function () {
    "use strict";

    var testDiv;

    return {
        beginTest: function (name) {
            document.write("<div id='" + name + "'><p class='testHeader'>" + name + "</p></div>");
            testDiv = document.getElementById(name);
        },
        writeTest: function (information, type) {

            if (!type) {
                type = "";
            }

            testDiv.innerHTML = testDiv.innerHTML + "<p class='testDetail" + type + "'>" + information + "</p>";
        },
        writeNormal: function (information) {
            this.writeTest(information);
        },
        writeError: function (information) {
            this.writeTest(information, "Error");
        },        
        testSucceeded: function () {
            this.writeTest("Test succeeded");
        },
        testFailed: function () {
            this.writeError("Test failed");
        },
        dumpObject: function (obj) {
            for (var member in obj) {
                this.writeTest(member + ":" + obj[member]);
            }
        }
    }
}

mclib.test.add("testObjectMerge", "Test object.Merge", function () {

    this.beginTest(this.caption);

    var obj1 = { a: 1, b: 2 };
    var obj2 = { b: 3, c: 4 };

    this.merge(obj1, obj2);

    if (this.compare(obj1, { a: 1, b: 2, c: 4 })) {
        this.testSucceeded();
    }
    else {
        this.testFailed();
    }
});

mclib.test.add("testObjectForceMerge", "Test object.forceMerge", function () {

    this.beginTest(this.caption);

    var obj1 = { a: 1, b: 2 };
    var obj2 = { b: 3, c: 4 };

    this.forceMerge(obj1, obj2);

    if (this.compare(obj1, { a: 1, b: 3, c: 4 })) {
        this.testSucceeded();
    }
    else {
        this.testFailed();
    }
});

mclib.test.add("testObjectLists", "Test object.(getMemberList, getMemberListWithoutFunctions, getValueListWithoutFunctions, getMemberValueListWithoutFunctions)", function () {
    this.beginTest(this.caption);

    var failed = true,
        obj1 = { a: 1, b: 2, c: function (a) { var b = a; } };

    if (this.compareList(this.getMemberList(obj1), ["a", "b", "c"]) ){
        if (this.compareList(this.getMemberListWithoutFunctions(obj1), ["a", "b"])) {
            if (this.compareList(this.getValueListWithoutFunctions(obj1), [1, 2])) {
                var listA = this.getMemberValueListWithoutFunctions(obj1);
                var listB = [["a", 1], ["b", 2]];
                var here = this;

                this.forArray(listA, function (value, index) {
                    if (here.compareList(value,listB[index])) {
                        failed = false;
                    }
                });
            }
        }
    }

    if (failed) {
        this.testFailed();
    }
    else {
        this.testSucceeded();
    }
});

mclib.test.add("testMatching", "Test object.(matchingFromList, filterClass)", function () {
    this.beginTest(this.caption);

    var failed = true,
        obj1 = { a: 1, b: 2, c: 3 },
        list1 = [1, 2, 3],
        matchListCondition = function (value, index) {
            if (value===1 || index===2) {
                return true;
            }
                
            return false;
        },
        filterClassCondition = function (value, member) {
            if (value===1 || member==="b") {
                return true;
            }
                
            return false;
        };

        if (this.compareList(this.matchingFromList(list1, matchListCondition), [1, 2])) {
            if (this.compare(this.filterClass(obj1, filterClassCondition), {a:1,b:2})) {
                failed = false;
            }
        }
    
     if (failed) {
        this.testFailed();
    }
    else {
        this.testSucceeded();
    }
});

mclib.test.add("testEvent", "Test Event", function () {

    this.beginTest(this.caption);

    var count = 0;

    var func1 = function (arg) { arg.obj.writeNormal("function 1 called arg.value = " + arg.value); count++ };
    var func2 = function (arg) { arg.obj.writeNormal("function 2 called arg.value = " + arg.value); count++ };

    var event = new mclib.Event();

    event.addHandler(func1);
    event.addHandler(func2);

    event.trigger({ value: 1, obj: this });

    event.removeHandler(func2);

    event.trigger({ value: 2, obj: this });

    if (count === 3) {
        this.testSucceeded();
    }
    else {
        this.testFailed();
    }
});

mclib.test.add("testPouch", "Test Pouch", function () {

    this.beginTest(this.caption);

    var count = 0,
        limit = 4,
        testtext = "test",
        verbs = { "close": "object1,object2" },
        testobj = {
            "close": function () {
                count++;
            }
        },
        eventfunc = function (argsObj) {
            if ((argsObj.pouch === pouch) && (argsObj.verbs === verbs)) {
                count++;
            }
        },
        pouch = mclib.pouch.get();

    pouch.test = testtext;
    pouch.object1 = testobj;
    pouch.object2 = testobj;

    pouch.beforeDestroy.addHandler(eventfunc);

    if (pouch.test === testtext) {
        count++;
    }

    pouch.destroy(verbs);

    if (count === limit) {
        this.testSucceeded();
    }
    else {
        this.testFailed();
    }
});
mclib.test.add("testProcessList", "Test ProcessList", function () {

    this.beginTest(this.caption);

    var count = 0,
        limit = 7,
        journal = this,
        args = { count: 0, processed: 0 },
        starttime = (new Date()).getTime(),
        testproc1 = function (argsObj) {
            argsObj.count++;
            argsObj.processed++;
            journal.writeNormal("Milliseconds since start " + ((new Date()).getTime() - starttime) );
            count++;
        },
        testprocinv = 10,
        invalidfunc = function (argsObj) {
            if (argsObj.process) {
                journal.writeError("Process invalid " + argsObj.process[0]);
                count++;
            }
        },
        progfunc = function (argsObj) {
            if ((argsObj.processed) && (argsObj.process)) {
                if (argsObj.processed === argsObj.process[1].processed) {
                    journal.writeNormal("Progress " + argsObj.processed);
                    count++;
                }
            }
        },
        lastfunc = function (argsObj) {
            if (!argsObj) {
                if (count === limit) {
                    journal.testSucceeded();
                }
                else {
                    journal.testFailed();
                }
            }
            else {
                journal.testFailed();
            }
        },
        list = new mclib.ProcessList(1000);
        
    list.invalid.addHandler(invalidfunc);
    list.progress.addHandler(progfunc);
    list.listEmpty.addHandler(lastfunc);
        
    list.add(testproc1, args);
    list.add(testproc1, args);
    list.add(testprocinv, args);
    list.add(testproc1, args);

});
