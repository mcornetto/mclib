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

    return {
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
        merge: function (objdest, objsrc) {

            if (!objdest) {
                objdest = {};
            }

            if (!objsrc) {
                objsrc = this;
            }

            for (var item in objsrc) {
                if (typeof (objdest[item]) === "undefined") {
                    objdest[item] = objsrc[item];
                }
            }

            return objdest;
        },
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
        forceMerge: function (objdest, objsrc) {

            if (!objdest) {
                objdest = {};
            }

            if (!objsrc) {
                objsrc = this;
            }

            for (var item in objsrc) {
                objdest[item] = objsrc[item];
            }

            return objdest;
        },
        /**
            Returns an array of the name of properties in an item.

            @method getMemberListWithoutFunctions
            @namespace mclib.object
            @param {object} obj The object whose properties interest you.  
            @example 
                var obj1 = {a:1, b:2, c:3, merge: function...},
                    list = mclib.object.getMemberListWithoutFunctions(obj1);

                Results: list = ["a","b","c"]

        **/
        getMemberListWithoutFunctions: function (obj) {

            var returnArray = [];

            for (var item in obj) {

                if (typeof (obj[item]) !== "function") {
                    returnArray.push(item);
                }
            }

            return returnArray;
        },
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
        getMemberList: function (obj) {

            var returnArray = [];

            for (var item in obj) {

                returnArray.push(item);
            }

            return returnArray;
        },
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
        compare: function (objA, objB) {

            if (objA !== objB) {

                var listA = mclib.object.getMemberList(objA),
                    listB = mclib.object.getMemberList(objB);

                if (listA.length != listB.length) {
                    return false;
                }

                for (var i = 0, l = listA.length; i < l ; i++) {

                    var member = listA[i];

                    if (!objB[member]) {
                        return false;
                    }

                    if (objB[member] !== objA[member]) {
                        return false;
                    }
                }
            }

            return true;
        }
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

    var _handlers = [];

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
            for (var i = 0, l = _handlers.length; i < l ; i++) {
                _handlers[i](argsObj);
            }
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

    var _pouches = {},
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

                        this.destroying = true;
                        this.beforeDestroy.trigger({ pouch: this, verbs: verbs });

                        if (verbs) {
                            //parse out the verbs and perform the functions. 
                            for (var verb in verbs) {
                                var list = [];

                                if (verbs[verb] === "*") {
                                    list = mclib.object.getMemberListWithoutFunctions(this);
                                }
                                else {
                                    list = verbs[verb].split(",");
                                }

                                for (var i = 0, l = list.length; i < l; i++) {
                                    
                                    if (this[list[i]]) {

                                        if (typeof (this[list[i]][verb]) === "function") {
                                            this[list[i]][verb]();
                                        }
                                    }
                                }
                            }
                        }

                        //remove the pouch
                        delete _pouches[this.id];

                        //then delete it's contents
                        for (var item in this) {

                            delete this[item];
                        }
                    }
                };

           })();
 
        }

    };

})();
/**
    Creates a list of processes that will be executed asynchronously but in order.   

    @class ProcessList
    @constructor
    @namespace mclib
**/
mclib.ProcessList = function (timeout) {
    "use strict";

    var _list = [],
        _emptyArgs = "!*@&#^$",
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
                _listEmpty.trigger();
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
                setTimeout(_execute, timeout);

            }

        }
    };
};