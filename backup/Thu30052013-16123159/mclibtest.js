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

    var func1 = function (arg) {
        arg.obj.writeNormal("function 1 called arg.value = " + arg.value); count++
    };
    var func2 = function (arg) {
        arg.obj.writeNormal("function 2 called arg.value = " + arg.value); count++
    };

    var event = new mclib.Event();

    event.addHandler(func1);
    event.addHandler(func2);

    event.trigger({ value: 1, obj: this });
    event.triggerAsynch({ value: 2, obj: this });

    event.removeHandler(func2);
    event.addHandler(function (arg) {
        if (count === 5) {
            arg.obj.testSucceeded();
        }
        else {
            arg.obj.testFailed();
        }
    });

    event.triggerAsynch({ value: 3, obj: this });
 

});

mclib.test.add("testPouch", "Test Pouch", function () {

    this.beginTest(this.caption);

    var count = 0,
        limit = 4,
        journal = this,
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
            if (count === limit) {
                journal.testSucceeded();
            }
            else {
                journal.testFailed();
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

    //if (count === limit) {
    //    this.testSucceeded();
    //}
    //else {
    //    this.testFailed();
    //}
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
mclib.test.add("testInjectScripts", "Test injectScripts", function () {

    this.beginTest(this.caption);

    var journal = this;

    var injector = new mclib.inject.Scripts();

    injector.add("jquery", 'http://code.jquery.com/jquery-1.10.0.min.js', function () {
        return (typeof (jQuery) !== "undefined");
    });

    injector.add("injectCSS", 'http://forum.writerarena.com/custom/sdks/jquery.injectCSS.js', function () {
        return ((typeof ($) !== "undefined") && ($.injectCSS));
    });

    injector.injectEnd.addHandler(function () {
        journal.writeNormal("All scripts were added");

        if ((typeof (jQuery) !== "undefined") && ($.injectCSS)) {
            journal.testSucceeded();
        }
        else {
            journal.testFailed();
        }
    });

    injector.inject();

});

mclib.test.add("testInjectStyles", "Test injectStyles", function () {

    this.beginTest(this.caption);

    var journal = this;

    var injector = new mclib.inject.Styles();

    injector.add("social", 'http://forum.writerarena.com/Themes/default/css/social/social.css');

    injector.add("injectCSS", 'http://forum.writerarena.com/Themes/default/css/portal.css');

    injector.injectEnd.addHandler(function () {
        journal.writeNormal("All styles were added");
        journal.testSucceeded();
    });

    injector.inject();

});

mclib.test.add("testHooker", "Test Hooker", function () {

    this.beginTest(this.caption);

    var journal = this;
    var count = 0;

    var hook1 = {
        init: function (config) { count++; return true; },
        section: {
            execute: function (parameters) { count++; return "testing 1 "; },
            execute2: function (parameters) { count++; return parameters.passedvalue; }
        }
    },
    hook2 = {
        init: function (config) { count++; return false; },
        section: {
            execute: function (parameters) { count++; return "testing 2 "; }
        }
    },
    hook3 = {
        init: function (config) { count++; return config.passedvalue; },
        section: {
            execute: function (parameters) { count++; return "testing 3 "; }
        }
    },
    hook4 = {
        init: function (config) { count++; return true; },
        section2: {
            execute: function (parameters) { count++; return "testing 4 "; }
        }
    };


    var namespace = { hook1: hook1, hook2: hook2, hook3: hook3, hook4: hook4 };

    var hookfree = mclib.hooker.create("hookfree", { passedvalue: true });
    if (hookfree.unregister) count++;
    if (hookfree.register) {
        if (hookfree.register(hook1)) count++;
        if (hookfree.register(hook2)) count++;
        if (hookfree.register(hook3)) count++;
        if (hookfree.register(hook4)) count++;
    }

    var hooknamespace = mclib.hooker.create("hooknamespace", { passedvalue: false, preregister: true });
    if (!hooknamespace.unregister) count++;
    if (!hooknamespace.register) count++;
    if (mclib.hooker.registerNamespace("hooknamespace",namespace) === 2) count++;

    var executed1 = mclib.hooker.execute("hookfree", "section");
    var executed2 = mclib.hooker.execute("hookfree", "section", { passedvalue: "testing 1a " }, "execute2");
    var executed3 = mclib.hooker.execute("hooknamespace", "section");

    if (executed1.length === 2) count++;
    if (executed2.length === 1) count++;
    if (executed3.length === 1) count++;

    journal.writeNormal("1. " + executed1.join());
    journal.writeNormal("2. " + executed2.join());
    journal.writeNormal("3. " + executed3.join());

    if (hookfree.unregister(hook3)) count++;
    var executed4 = mclib.hooker.execute("hookfree", "section");
    if (executed4.length === 1) count++;

    if (count === 25) {
        this.testSucceeded();
    }
    else {
        this.testFailed();
    }

});