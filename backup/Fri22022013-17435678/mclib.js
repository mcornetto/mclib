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
    function _forEach(obj, procedure) {
        for (var member in obj) {
            procedure(obj[member], member);
        }
    }
    function _forEachWithoutFunctions(obj, procedure) {
        for (var member in obj) {
            if (!_isFunction(obj[member])) {
                procedure(obj[member], member);
            }
        }
    }
    function _forArray(list, procedure) {
        for (var i = 0, l = list.length; i < l; i++) {
            procedure(list[i], i);
        }
    }
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
    function _getMemberList(obj) {

        var returnArray = [];

        _forEach(obj, function (value, member) {

            returnArray.push(member);
        });

        return returnArray;
    }
    function _getMemberListWithoutFunctions(obj) {

        var returnArray = [];

        _forEachWithoutFunctions(obj, function (value, member) {

            returnArray.push(member);
        });

        return returnArray;
    }
    function _getValueListWithoutFunctions(obj) {

        var returnArray = [];

        _forEachWithoutFunctions(obj, function (value, member) {

            returnArray.push(value);
        });

        return returnArray;
    }
    function _getMemberValueListWithoutFunctions(obj) {

        var returnArray = [];

        _forEachWithoutFunctions(obj, function (value, member) {

            returnArray.push([member, value]);
        });

        return returnArray;
    }
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
    function _matchingFromList(list, condition) {

        var returnList = [];

        _forArray(list, function (value, index) {
            if (condition(list[index], index)) {
                returnList.push(list[index]);
            }
        });

        return returnList;
    }
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
        forEach: _forEach,
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
        forEachWithoutFunctions: _forEachWithoutFunctions,
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
        forArray: _forArray,
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
        merge: _merge,
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
        forceMerge: _forceMerge,
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
        getMemberListWithoutFunctions: _getMemberListWithoutFunctions,
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
        getValueListWithoutFunctions: _getValueListWithoutFunctions,
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
        getMemberValueListWithoutFunctions: _getMemberValueListWithoutFunctions,
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
        getMemberList: _getMemberList,
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
        compare: _compare,
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
        compareList: _compareList,
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
        matchingFromList: _matchingFromList,
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
            Run all listening event handlers. 

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
                        pouch.beforeDestroy.trigger({ pouch: pouch, verbs: verbs });

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
                _progress.trigger({ processed: _processed, process: process });

            }
            else {
                _invalid.trigger({ process: process });
            }

            if (_list.length === 0) {
                _started = false;
                _listEmpty.trigger();
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