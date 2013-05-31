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
            mclib.object.merge(test, new mclib.test.Helper());

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

