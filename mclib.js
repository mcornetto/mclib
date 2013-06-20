/*

This file is part of mclib

Copyright (c) 2013 Michael Cornetto

Contact:  mcornetto@hotmail.com

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

*/
/**
    Container for the library

    @module  mclib
**/
var mclib = {};
/**
    Class or Namespace containing object related functions

    @class object
    @static
    @namespace mclib
**/
mclib.object = (function () {
    "use strict";

    function _isFunction(item) {
        if (typeof (item) === "function") {
            return true;
        }
        return false;
    }
    /**
        Run a procedure for every member in an object.

        @method forEach
        @namespace mclib.object
        @param {object} obj The object to traverse 
        @param {function} procedure Function to run for each member passing (value, member)  
        @example 
            var obj1 = {a:1, b:2, c: function(a) { var b = a;}},
                obj2 = {},
                obj3 = mclib.object.forEach(obj1, function (value, member) {
                    obj2[member] = value;
                });

            Results: obj2 = {a:1, b:2, c: function(a) { var b = a;}}
    **/
    function _forEach(obj, procedure) {
        for (var member in obj) {
            procedure(obj[member], member);
        }
    }
    /**
        Run a procedure for every member in an object.  Don't invoke for functions.

        @method forEachWithoutFunctions
        @namespace mclib.object
        @param {object} obj The object to traverse 
        @param {function} procedure Function to run for each member passing (value, member)  
        @example 
            var obj1 = {a:1, b:2, c: function(a) { var b = a;}},
                obj2 = {},
                obj3 = mclib.object.forEachWithoutFunctions(obj1, function (value, member) {
                    obj2[member] = value;
                });

            Results: obj2 = {a:1, b:2}
    **/
    function _forEachWithoutFunctions(obj, procedure) {
        for (var member in obj) {
            if (!_isFunction(obj[member])) {
                procedure(obj[member], member);
            }
        }
    }
    /**
        Run a procedure for every item in an array. 

        @method forArray
        @namespace mclib.object
        @param {array} list The array to traverse 
        @param {function} procedure Function to run for each item passing (value, index)  
        @example 
            var array1 = [1, 2, 3],
                array2 = [],
                array3 = mclib.object.forArray(list1, function (value, index) {
                    array2.push(value);
                });

            Results: array2 = [1, 2, 3]
    **/
    function _forArray(list, procedure) {
        for (var i = 0, l = list.length; i < l; i++) {
            procedure(list[i], i);
        }
    }
    /**
        Merge an object into an existing object without overwriting anything
        in the original object.
    
        @method merge
        @namespace mclib.object
        @param {object} objdest The destination object for the merge.  If null, 
            undefined  or empty this operation will be treated as a shallow clone. 
        @param {object} objsrc The source object for the merge.  If null or undefined
            this operation will copy this object namespace into the destination object. 
        @example 
            var obj1 = {a:1, b:2},
                obj2 = {b:3, c:4},
                obj3 = mclib.object.merge(obj1, obj2);

            Results: obj1 = {a:1,b:2,c:4), obj2 = {b:3, c:4}, obj3 = {a:1,b:2,c:4}

                mclib.object.merge(obj1);

            Results: obj1 = {a:1,b:2,c:4,merge:function...,forceMerge:function...,...}

                obj3 = mclib.object.merge({},obj2);

            Results: obj3 = {b:3,c:4}

    **/
    function _merge(objdest, objsrc) {

        if (!objdest) {
            objdest = {};
        }

        if (!objsrc) {
            objsrc = this;
        }

        _forEach(objsrc, function (value, member) {
            if (typeof (objdest[member]) === "undefined") {
                objdest[member] = value;
            }
        });

        return objdest;
    }
    /**
        Merge an object into an existing object overwriting existing properties
        and methods in the original object.

        @method forceMerge
        @namespace mclib.object
        @param {object} objdest The destination object for the merge.  If null, 
            undefined  or empty this operation will be treated as a shallow clone. 
        @param {object} objsrc The source object for the merge.  If null or undefined
            this operation will copy this object namespace into the destination object. 
        @example 
            var obj1 = {a:1, b:2, merge:10},
                obj2 = {b:3, c:4},
                obj3 = mclib.object.merge(obj1, obj2);

            Results: obj1 = {a:1,b:3,c:4,merge:10), obj2 = {b:3, c:4}, obj3 = {a:1,b:3,c:4,merge:10}

                mclib.object.merge(obj1);

            Results: obj1 = {a:1,b:3,c:4,merge:function...,forceMerge:function...,...}

                obj3 = mclib.object.merge({},obj2);

            Results: obj3 = {b:3,c:4}

    **/
    function _forceMerge(objdest, objsrc) {

        if (!objdest) {
            objdest = {};
        }

        if (!objsrc) {
            objsrc = this;
        }

        _forEach(objsrc, function (value, member) {
            objdest[member] = value;
        });

        return objdest;
    }
    /**
        Clones an object which is the equivalent of a deep copy.  Nested objects
        and arrays are cloned so references are different.  

        @method clone
        @namespace mclib.object
        @param {object} obj The object to be cloned. 
        @example 
            var obj1 = {a:1, b:2},
                obj2 = {c:3, obj: obj1},
                obj3 = mclib.object.clone(obj2);

                obj3.obj.a += 1;

            Results: obj1 = {a:1,b:2}, obj2 = {c:3, obj; {a:1,b:2}}, obj3 = {c:3, obj: {a:2,b:2}}

    **/
    function _clone(obj) {
        //TODO: This needs a depth specified to avoid endless loops of objects that reference themselves
        var objdest = {};
        _forEach(obj, function (value, member) {
            if (typeof (value) !== "object") {

                objdest[member] = value;
            }
            else {

                if (value instanceof Array) {
                    objdest[member] = _cloneArray(value);
                }
                else {
                    objdest[member] = _clone(value);
                }
            }
        });
        return objdest;
    }
    /**
        Clones an array which is the equivalent of a deep copy.  Nested objects
        and arrays are cloned so references are different.  

        @method cloneArray
        @namespace mclib.object
        @param {array} list The array to be cloned. 
        @example 
            var list1 = [1, 2],
                list2 = [3, list1],
                list3 = mclib.object.cloneArray(list2);

                list3[1][0] += 1;

            Results: list1 = [1, 2], list2 = [3, [1, 2]], list3 = [3, [2, 2]]

    **/
    function _cloneArray(list) {
        //TODO: This needs a depth specified to avoid endless loops of arrays that reference themselves
        var listdest = [];
        _forArray(list, function (item, index) {
            if (typeof (item) !== "object") {
                listdest.push(item);
            }
            else {
                if (item instanceof Array) {
                    listdest.push(_cloneArray(item));
                }
                else {
                    listdest.push(_clone(item));
                }
            }
        });
        return listdest;
    }
    /**
        Returns an array of the name of members in an item.

        @method getMemberList
        @namespace mclib.object
        @param {object} obj The object whose memberss interest you.  
        @example 
            var obj1 = {a:1, b:2, c:3, merge: function...},
                list = mclib.object.getMemberList(obj1);

            Results: list = ["a","b","c","merge"]

    **/
    function _getMemberList(obj) {

        var returnArray = [];

        _forEach(obj, function (value, member) {

            returnArray.push(member);
        });

        return returnArray;
    }
    /**
        Returns an array of the name of properties from an object.

        @method getMemberListWithoutFunctions
        @namespace mclib.object
        @param {object} obj The object whose properties interest you.  
        @example 
            var obj1 = {a:1, b:2, c:3, merge: function...},
                list = mclib.object.getMemberListWithoutFunctions(obj1);

            Results: list = ["a","b","c"]

    **/
    function _getMemberListWithoutFunctions(obj) {

        var returnArray = [];

        _forEachWithoutFunctions(obj, function (value, member) {

            returnArray.push(member);
        });

        return returnArray;
    }
    /**
        Returns an array of the values from an object.

        @method getValueListWithoutFunctions
        @namespace mclib.object
        @param {object} obj The object whose properties interest you.  
        @example 
            var obj1 = {a:1, b:2, c:3, merge: function...},
                list = mclib.object.getValueListWithoutFunctions(obj1);

            Results: list = [1,2,3]

    **/
    function _getValueListWithoutFunctions(obj) {

        var returnArray = [];

        _forEachWithoutFunctions(obj, function (value, member) {

            returnArray.push(value);
        });

        return returnArray;
    }
    /**
        Returns an array of the membernames/values from an object.

        @method getMemberValueListWithoutFunctions
        @namespace mclib.object
        @param {object} obj The object whose properties interest you.  
        @example 
            var obj1 = {a:1, b:2, c:3, merge: function...},
                list = mclib.object.getMemberValueListWithoutFunctions(obj1);

            Results: list = [["a",1],["b",2],["c",3]]

    **/
    function _getMemberValueListWithoutFunctions(obj) {

        var returnArray = [];

        _forEachWithoutFunctions(obj, function (value, member) {

            returnArray.push([member, value]);
        });

        return returnArray;
    }
    /**
        Performs a shallow compare of two objects to determine their equality.

        @method compare
        @namespace mclib.object
        @param {object} objA An object to be compared.  
        @param {object} objB An object to be compared.  
        @example 
            var obj1 = {a:1, b:2, c:3},

            if (mclib.object.compare(obj1, {a:1, b:2, c:3})) {
                // they're equal. 
            }
    **/
    function _compare(objA, objB) {

        if (objA !== objB) {

            var listA = _getMemberList(objA),
                listB = _getMemberList(objB);

            if (listA.length != listB.length) {
                return false;
            }

            _forArray(listA, function (value, index) {

                if (!objB[value]) {
                    return false;
                }

                if (objB[value] !== objA[value]) {
                    return false;
                }
            });
        }

        return true;
    }
    /**
        Performs a shallow compare of two arrays to determine their equality.

        @method compareList
        @namespace mclib.object
        @param {array} listA A list to be compared.  
        @param {array} listB A list to be compared.  
        @example 
            var list1 = [1, 2, 3],

            if (mclib.object.compareList(list1, [1, 2, 3])) {
                // they're equal. 
            }
    **/
    function _compareList(listA, listB) {

        if (listA !== listB) {

            if (listA.length != listB.length) {
                return false;
            }

            _forArray(listA, function (value, index) {

                if (!listB[index]) {
                    return false;
                }

                if (listB[index] !== value) {
                    return false;
                }
            });
        }

        return true;
    }
    /**
        Performs a condition function against each item in a list and return an array of matches.

        @method matchingFromList
        @namespace mclib.object
        @param {object} list A list to traverse.  
        @param {object} condition A function to perform against each (value, index).   
        @example 
            var list1 = [1,2,3],

            var x = mclib.object.matchingFromList(list1, function(value, index) {
                    if (value === 1 || index === 2) {
                        return true;
                    }
                    else {
                        return false;
                    }
            })

            x will equal [1,2]
    **/
    function _matchingFromList(list, condition) {

        var returnList = [];

        _forArray(list, function (value, index) {
            if (condition(list[index], index)) {
                returnList.push(list[index]);
            }
        });

        return returnList;
    }
    /**
        Performs a condition function against each member of an object and return an object of matches.

        @method filterClass
        @namespace mclib.object
        @param {object} obj An object to traverse.  
        @param {object} condition A function to perform against each (value, member).   
        @example 
            var obj1 = {a:1, b:2, c:3},

            var x = mclib.object.filterClass(obj1, function(value, member) {
                    if (value === 1 || member === "b") {
                        return true;
                    }
                    else {
                        return false;
                    }
            })

            x will equal {a:1,b:2}
    **/
    function _filterClass(obj, condition) {

        var returnClass = {};

        _forEach(obj, function (value, member) {
            if (condition(value, member)) {
                returnClass[member] = value;
            }
        });

        return returnClass;
    }

    return {

        forEach: _forEach,
        forEachWithoutFunctions: _forEachWithoutFunctions,
        forArray: _forArray,
        merge: _merge,
        forceMerge: _forceMerge,
        clone: _clone,
        cloneArray: _cloneArray,
        getMemberListWithoutFunctions: _getMemberListWithoutFunctions,
        getValueListWithoutFunctions: _getValueListWithoutFunctions,
        getMemberValueListWithoutFunctions: _getMemberValueListWithoutFunctions,
        getMemberList: _getMemberList,
        compare: _compare,
        compareList: _compareList,
        matchingFromList: _matchingFromList,
        filterClass: _filterClass
    };

})();
/**
    Simple generic events class.  Create an event using this class. 

    @class Event
    @constructor
    @namespace mclib
**/
mclib.Event = function () {
    "use strict";

    var _obj = mclib.object,
        _handlers = [];


    return {
        /**
           Add event handler to listen for an event. 

           @method addHandler
           @namespace mclib.Event
           @param {function} handler A function that will be called when event is triggered.   
           @example
               var loading = new mclib.Event(),
                   handler = function (params) {
                               alert("I've been handled");
                             };

               loading.addHandler(handler);
       **/
        addHandler: function (handler) {
            if (_handlers.indexOf(handler) === -1) {
                _handlers.push(handler);
            }
        },
        /**
            Remove existing event handler. 

            @method removeHandler
            @namespace mclib.Event
            @param {function} handler A function that will be called when event is triggered.   
            @example
                var loading = new mclib.Event(),
                    handler = function (params) {
                                alert("I've been handled");
                              };

                loading.removeHandler(handler);
        **/
        removeHandler: function (handler) {
            var index = _handlers.indexOf(handler);
            if (index > -1) {
                _handlers.splice(index, 1);
            }
        },
        /**
            Run all listening event handlers immediately. 

            @method trigger
            @namespace mclib.Event
            @param {object} argsObj An object that contains the parameters that will be passed 
                                    to the handlers. 
            @example
                var loading = new mclib.Event(),
                    handler = function (params) {
                                alert("I've been handled " + params.value );
                              };

                loading.addHandler(handler);
                loading.trigger({value: "whilst loading"});
        **/
        trigger: function (argsObj) {
            _obj.forArray(_handlers, function (value, index) {
                value(argsObj);
            });
        },
        /**
            Run all listening event handlers asynchronously. 

            @method triggerAsync
            @namespace mclib.Event
            @param {object} argsObj An object that contains the parameters that will be passed 
                                    to the handlers. 
            @example
                var loading = new mclib.Event(),
                    handler = function (params) {
                                alert("I've been handled " + params.value );
                              };

                loading.addHandler(handler);
                loading.trigger({value: "whilst loading"});
        **/
        triggerAsync: function (argsObj) {
            var list = new mclib.ProcessList();
            _obj.forArray(_handlers, function (value, index) {
                list.add(value, argsObj);
            });
        }

    };
};
/**
    Class or Namespace that handles pouches.  Pouches are small destroyable objects that can easily be 
    passed between method calls and then destroyed once used.  

    @class pouch
    @static
    @namespace mclib
**/
mclib.pouch = (function () {
    "use strict";

    var _obj = mclib.object,
        _pouches = {},
        _seed = 0,
        _defaultPrefix = "pch";

    return {
        /**
            Get a pouch. 

            @method get
            @namespace mclib.pouch
            @param {string} prefix An optional prefix for the pouch. Used for id.  
            @example
                var pouch = mclib.pouch.get();
                pouch.additional = "I've been added to the pouch";

                anotherFunction(pouch);  //passed to another function
        **/
        get: function (prefix) {
            var _id = ((prefix) ? prefix : _defaultPrefix) + _seed;

            _seed++;

            return _pouches[_id] = (function () {

                return {
                    /**
                       Unique id of pouch. 
           
                       @property id {string}
                       @namespace mclib.pouch
                   **/
                    id: _id,
                    /**
                       Full Name of pouch.  Useful if accessing via HTML.  
           
                       @property fullName {string}
                       @namespace mclib.pouch
                       @example
                            var html = "<a href='http://techn0place.blogspot.com' onclick='" + pouch.fullName + ".linked = true;'">Blog</a>";
                   **/
                    fullName: "mclib.pouch." + _id,
                    /**
                       Indicates if the pouch is in the process of being destroyed. 
           
                       @property destroying {boolean}
                       @namespace mclib.pouch
                    **/
                    destroying: false,
                    /**
                       Event that is triggered before pouch is actually destroyed. 
           
                       @event beforeDestroy
                       @namespace mclib.pouch
                       @example 
                            var pouch = mclib.pouch.get(),
                                handler = function (params) {
                                        //passed "store" and "verbs" in object
                                        if (params.pouch.value === 1) {
                                            alert("I haven't changed");
                                        }
                                        params.pouch.value = 2;
                                        // pouch contents or verbs can be changed here.
                                      };
                            
                            pouch.value = 1;

                            pouch.beforeDestroy.addHandler(handler);
                    **/
                    beforeDestroy: new mclib.Event(),
                    /**
                        Destroy a pouch. 
            
                        @method destroy
                        @namespace mclib.pouch
                        @param {object} verbs An object containing verb to perform and a comma seperated list
                                              of members to perform them on.   
                        @example
                            var pouch = mclib.pouch.get();
                            pouch.additional = "I've been added to the pouch";
                            pouch.window1 = window.open("http://techn0place.blogspot.com");
                            pouch.window2 = window.open("http://techn0place.blogspot.com");
            
                            anotherFunction(pouch);  //passed to another function

                            pouch.destroy({close: "window1,window2"});
                    **/
                    destroy: function (verbs) {

                        var pouch = this;

                        pouch.destroying = true;
                        pouch.beforeDestroy.triggerAsync({ pouch: pouch, verbs: verbs });

                        if (verbs) {
                            //parse out the verbs and perform the functions. 

                            _obj.forEachWithoutFunctions(verbs, function (value, member) {
                                var list = [];

                                if (value === "*") {
                                    list = _obj.getMemberListWithoutFunctions(pouch);
                                }
                                else {
                                    list = value.split(",");
                                }

                                _obj.forArray(list, function (item, index) {

                                    if (pouch[item]) {

                                        if (typeof (pouch[item][member]) === "function") {
                                            pouch[item][member]();
                                        }
                                    }
                                });
                            });
                        }

                        //remove the pouch
                        delete _pouches[pouch.id];

                        //then delete it's contents
                        _obj.forEach(pouch, function (value, member) {

                            delete pouch[member];
                        });
                    }
                };

            })();

        }

    };

})();
/**
    Creates a list of processes that will be executed asynchronously but in order.   

    @class ProcessList
    @param {float} timeout Amount of time between processing.
    @constructor
    @namespace mclib
**/
mclib.ProcessList = function (timeout) {
    "use strict";

    var _list = [],
        _emptyArgs = "!*@&#^$",
        _started = false,
        _processed = 0,
        _progress = new mclib.Event(),
        _invalid = new mclib.Event(),
        _listEmpty = new mclib.Event();

    if (!timeout) {
        timeout = 1;
    }

    /**
        Execute the next process in the list.  

        @method _execute
        @private
        @namespace mclib.ProcessList
    **/
    function _execute() {

        if (_list.length > 0) {

            var process = _list.shift();

            if (typeof (process[0]) === "function") {
                if (process[1] === _emptyArgs) {
                    process[0]();
                }
                else {
                    process[0](process[1]);
                }

                _processed++;
                _progress.triggerAsync({ processed: _processed, process: process });

            }
            else {
                _invalid.triggerAsync({ process: process });
            }

            if (_list.length === 0) {
                _started = false;
                _listEmpty.triggerAsync();
            }
            else {
                setTimeout(_execute, timeout);
            }
        }

    }

    return {
        /**
           Event that is triggered when the ProcessList has emptied. 

           @event listEmpty
           @namespace mclib.ProcessList
           @example 
                var list = new mclib.ProcessList();
                list.add(function1, argsObj);

                var handler = function () {
                            //nothing is passed
                            alert("Finished processing");
                          };

               list.listEmpty.addHandler(handler);
        **/
        listEmpty: _listEmpty,
        /**
           Event that is triggered at the end of each execution.  

           @event progress
           @namespace mclib.ProcessList
           @example 
                var list = new mclib.ProcessList();
                list.add(function1,argsObj);

                var handler = function (argsObj) {
                            //nothing is passed
                            alert("Processed this many " + argsObj.processed );
                          };

               list.progress.addHandler(handler);
        **/
        progress: _progress,
        /**
           Event that is triggered when a process is invalid. 

           @event invalid
           @namespace mclib.ProcessList
           @example 
                var list = new mclib.ProcessList();
                list.add(function1,argsObj);

                var handler = function (argsObj) {
                            //nothing is passed
                            alert("Invalid process encounterd " + argsObj.process );
                          };

               list.invalid.addHandler(handler);
        **/
        invalid: _invalid,
        /**
            Add a process to the process list. 
    
            @method add
            @namespace mclib.ProcessList
            @param {function} process A function that will be called asynchronously.
            @param {object} argsObj An object containing the parameters that will be passed that function.
            @example
                var list = new mclib.ProcessList();
                list.add(function1,argsObj);

                var function1 = function (argsObj) {
                            alert(argsObj.title + " " + argsObj.name);
                          };

               list.add(function1, {title: "Mr", name: "Michael Cornetto");
        **/
        add: function (process, argsObj) {

            if (process) {
                if (!argsObj) {
                    argsObj = _emptyArgs;
                }

                _list.push([process, argsObj]);
                if (!_started) {
                    _started = true;
                    setTimeout(_execute, timeout);
                }

            }

        }
    };
};
/**
    Class or Namespace that handles hooks.  Hooks are like plugins.  They are an architecture that allows predescribed external pieces of   
    code to be executed from your code.  In other words, you need to document the hooks in order for them to be used.   This is extremely useful
    if you using something like ExtJS and have a form where you want to allow a external developer using your application to create buttons 
    and process button clicks from the form. 
    
    Hooks in their most basic form look like:
    - namespace
      - init() returns true or false
      - section - there can be more than one section
        - execute() that returns a value - there can be more than one execute function. 

    @class hooker
    @static
    @namespace mclib
    @example
          var external.hook = {
                init: function(config) {
                    if (config.defined_by_caller) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                section_defined_by_caller: { 
                     execute_or_defined_by_caller: function (parameters) {
                        if (parameters.defined_by_caller) {
                            return output_defined_by_caller;
                        }
                        else {
                            return something_else_defined_by_caller_or_possibly_null_to_ignore;
                        }
                     }
                }
          }
**/
mclib.hooker = (function () {
    "use strict";
    var _mcobj = mclib.object,
        _this = null;

    /**
        Register a hook to the hooker. 

        @method register
        @namespace mclib.hooker
        @param {string} setkey The key indicating the set of hooks we are referencing (there can be more than one set).
        @param {object} hook A reference to the hook itself.
        @example
            var hooks = mclib.hooker.create("hookskeyname",{preregister: true });
            
            if (mclib.hooker.register("hookskeyname",external.hook)) {
                // it registered
            }

    **/
    function _register(setkey, hook) {
        if (_this) {
            if (_this[setkey]) {
                if (_this[setkey].activehooks.indexOf(hook) === -1) {
                    if (hook.init) {
                        if (hook.init(_this[setkey].config)) {
                            _this[setkey].activehooks.push(hook);
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    /**
        Unregister a hook from the hooker. 

        @method unregister
        @namespace mclib.hooker
        @param {string} setkey The key indicating the set of hooks we are referencing (there can be more than one set).
        @param {object} hook A reference to the hook itself.
        @example

            if (mclib.hooker.unregister("hookskeyname",external.hook)) {
                // it unregistered
            }

    **/
    function _unregister(setkey, hook) {
        if (_this) {
            if (_this[setkey]) {
                var _loc = _this[setkey].activehooks.indexOf(hook);
                if (_loc > -1) {
                    _this[setkey].activehooks.splice(_loc, 1);
                    return true;
                }
            }
        }
        return false;
    }
    /**
        Register a namespace containing hooks to the hooker. 

        @method registerNamespace
        @namespace mclib.hooker
        @param {string} setkey The key indicating the set of hooks we are referencing (there can be more than one set).
        @param {object} hook A reference to the hook itself.
        @example
            var hooks = mclib.hooker.create("hookskeyname",{preregister: false });
            
            var countregistered = mclib.hooker.registerNamespace("hookskeyname",external);

    **/
    function _registerNamespace(setkey, namespace) {
        var cnt = 0;

        _mcobj.forEach(namespace, function (value, member) {
            if (_register(setkey, value)) {
                cnt++;
            }
        });

        return cnt;
    }
    /**
        Execute a set of hooks then returns an array of non-empty results.

        @method execute
        @namespace mclib.hooker
        @param {string} setkey The key indicating the set of hooks we are referencing (there can be more than one set).
        @param {string} sectionname The name of the section where the hook function is located.
        @param {object} parameters Optional object containing caller defined parameters for the hook function. Defaults to empty object.
        @param {string} functionname Optional string containing the hook function name to call. Defaults to execute.
        @example
            var resultsArray = mclib.hooker.execute("hookskeyname","hookssection",{caller: "xxx", defined: "yyy", parameters: "zzz"},"hooksfunction");
            
            mclib.object.forArray(resultsArray, function (value, index) {
                //do something with the results.
                //And you may want to test them for validity
                //because they are provided externally. 
            });
    **/
    function _execute(setkey, sectionname, parameters, functionname) {

        if (!functionname) functionname = "execute";
        if (!parameters) parameters = {};

        var _results = [];

        if (_this) {
            _mcobj.forArray(_this[setkey].activehooks, function (value, index) {
                if (value) {
                    if (value[sectionname]) {
                        if (value[sectionname][functionname]) {
                            var _result = value[sectionname][functionname](parameters);
                            if (_result) {
                                _results.push(_result);
                            }
                        }
                    }
                }
            });
        }

        return _results;
    }
    /**
        Create a hook set (there can be more than one). It will create a namespace based on the setkey. 

        @method create
        @namespace mclib.hooker
        @param {string} setkey The unique key indicating the set of hooks we are referencing (there can be more than one set).
        @param {object} initconfig Optional object containing caller defined initialisation parameters for the hook. Defaults to empty object. 
                        
                        Passing a config parameter named "preregister" will allow you to turn off on the fly registration
                        for the hook maker.  If preregister = true, you will define a namespace the user can place their hooks then register that 
                        namespace onload.  If preregister = false, special functions will be supplied that allow the user to register their hook
                        at any time they like.
        @example
            var hooks = mclib.hooker.create("hookskeyname",{preregister: false, caller: "xxx", defined: "yyy", parameters: "zzz" });
            mclib.hooker.hookskeyname.register(...);// is valid

            var hookspreregister = mclib.hooker.create("hookskeyname",{preregister: true, caller: "xxx", defined: "yyy", parameters: "zzz" });
            mclib.hooker.hookskeyname.register(...);// is not valid

    **/
    function _create(setkey, initconfig) {

        if (!initconfig) initconfig = {};
        if (!initconfig.preregister) initconfig.preregister = false;

        if (!_this) {
            _this = mclib.hooker;
        }

        _this[setkey] = (function () {

            var _retobj = {
                /**
                       Initial config passed to create.  
           
                       @property config {string}
                       @namespace mclib.hooker[setkey]

                **/
                config: initconfig,
                /**
                       Array of hooks considered active.  
           
                       @property activehooks {array}
                       @namespace mclib.hooker[setkey]

                **/
                activehooks: []
            };


            if (!initconfig.preregister) {
                _mcobj.merge(_retobj, {
                    /**
                        Register a hook to the hooker.  Only available if set was created with preregister=false. 

                        @method register
                        @namespace mclib.hooker[setkey]
                        @param {object} hook A reference to the hook itself.
                        @example
        
                            if (mclib.hooker.hookskeyname.register(my.external.hook)) {
                                // it registered
                            }

                    **/
                    register: function (hook) {
                        return _register(setkey, hook);
                    },
                    /**
                        Unregister a hook to the hooker.  Only available if set was created with preregister=false. 

                        @method unregister
                        @namespace mclib.hooker[setkey]
                        @param {object} hook A reference to the hook itself.
                        @example
        
                            if (mclib.hooker.hookskeyname.unregister(my.external.hook)) {
                                // it unregistered
                            }

                    **/
                    unregister: function (hook) {
                        return _unregister(setkey, hook);
                    }
                });
            }

            return _retobj;
        })();

        return _this[setkey];
    }

    return {
        create: _create,
        execute: _execute,
        registerNamespace: _registerNamespace
    };

})();

/**
    Class or Namespace containing injection related functions

    @class inject
    @static
    @namespace mclib
**/
mclib.inject = (function () {

    function _addEvent(element, evnt, funct) {
        if (element.attachEvent)
            return element.attachEvent('on' + evnt, funct);
        else
            return element.addEventListener(evnt, funct, false);
    }

    return {
        /**
            Inject a list of script tags into the document header waiting for each to load in order.   

            @class Scripts
            @constructor
            @namespace mclib.inject
        **/
        Scripts: function () {
            "use strict";
            var _scriptholder = {},
                /**
                  Event that is triggered when injection is complete. 
       
                  @event injectEnd
                  @namespace mclib.inject.Scripts
                  @example 
                       injection.inject();
       
                       var handler = function () {
                                   //nothing is passed
                                   alert("Finished injecting");
                                 };
       
                      injection.injectEnd.addHandler(handler);
               **/
                _injectEnd = new mclib.Event();

            /**
                Add script to the list of scripts that will be injected. 

                @method add
                @namespace mclib.inject.Scripts
                @param {string} name An arbitrary keyname to identify the script tag.
                @param {object} url The url of the script file.
                @param {function} condition A boolean function that indicates if script is already loaded.
                @example
                    var injection = new mclib.inject.Scripts();
                    injection.add("somescript", "http://www.mydomain.com/myscript.js", function () {
                                if (!myscriptvar) return false;
                                return true;
                    });
            **/
            function _add(name, url, async, condition) {
                if (_scriptholder[name]) {
                    throw (name + ' already exists. Use a different name.');
                }

                _scriptholder[name] = { url: url, async: async, injected: condition() };
            }
            /**
                Inject each script in the list in order, waiting for each to be loaded. 

                @method inject
                @namespace mclib.inject.Scripts
                @example
                    injection.inject()
            **/
            function _inject() {
                var list = mclib.object.getMemberList(_scriptholder),
                    injected = false;

                for (var i = 0, l = list.length; i < l; i++) {

                    var _script = _scriptholder[list[i]];

                    if (!_script.injected) {
                        var tag = document.createElement('script');
                        tag.type = 'text/javascript';
                        tag.async = _script.async;
                        tag.src = _script.url;

                        var parent = document.getElementsByTagName('head').item(0) || document.documentElement;

                        parent.appendChild(tag);

                        _script.injected = injected = true;
                        //tag.onload = _inject();
                        _addEvent(tag, "load", _inject);
                        break;
                    }
                }

                if (!injected) {
                    _injectEnd.triggerAsync();
                }
            }

            return {
                add: _add,
                inject: _inject,
                injectEnd: _injectEnd
            };

        },
        /**
            Inject a list of style link tags into the document header in order.   

            @class Styles
            @constructor
            @namespace mclib.inject
        **/
        Styles: function () {
            "use strict";
            var _styleholder = {},
                /**
                  Event that is triggered when injection is complete. 
       
                  @event injectEnd
                  @namespace mclib.inject.Styles
                  @example 
                       injection.inject();
       
                       var handler = function () {
                                   //nothing is passed
                                   alert("Finished injecting");
                                 };
       
                      injection.injectEnd.addHandler(handler);
               **/
                _injectEnd = new mclib.Event();

            /**
                Add style link to the list of style links that will be injected. 

                @method add
                @namespace mclib.inject.Styles
                @param {string} name An arbitrary keyname to identify the style link tag.
                @param {object} url The url of the style file.
                @example
                    var injection = new mclib.inject.Styles();
                    injection.add("somestyle", "http://www.mydomain.com/mystyle.css");
            **/
            function _add(name, url) {
                if (_styleholder[name]) {
                    throw (name + ' already exists. Use a different name.');
                }

                _styleholder[name] = { url: url, injected: false };
            }
            /**
                Inject each style link in the list in order.

                @method inject
                @namespace mclib.inject.Styles
                @example
                    injection.inject()
            **/
            function _inject() {
                var list = mclib.object.getMemberList(_styleholder),
                    injected = false;

                for (var i = 0, l = list.length; i < l; i++) {

                    var _style = _styleholder[list[i]];

                    if (!_style.injected) {
                        var tag = document.createElement('link');
                        tag.rel = "stylesheet";
                        tag.type = 'text/css';
                        //tag.async = true;
                        tag.href = _style.url;

                        var parent = document.getElementsByTagName('head').item(0) || document.documentElement;
                        parent.appendChild(tag);

                        _style.injected = injected = true;

                    }
                }

                _injectEnd.triggerAsync();
            }

            return {
                add: _add,
                inject: _inject,
                injectEnd: _injectEnd
            };

        }
    };
})();


