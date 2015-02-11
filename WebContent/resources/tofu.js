(function() {
    var utils = (function() {
        function assert(condition, message) {
            if (!condition) {
                console.error(message);
            }
        }

        function assertType(object, type, message) {
            if ( typeof object !== type) {
                console.error(message);
            }
        }

        function assertFunction(object) {
            if ( typeof object !== "function") {
                console.error(object + " is not a Function");
            }
        }

        function assertString(object, message) {
            if ( typeof object !== "string") {
                console.error(object + " is not a String");
            }
        }

        function assertArray(object, message) {
            if (object && typeof object === "object" && object instanceof Array) {
            } else {
                console.error(object + " is not an Array");
            }
        }

        return {
            assert : assert,
            assertType : assertType
        };
    })();

    var ns = (function() {
        var TYPE_OF_CONST = {
            STRING : "string",
            OBJECT : "object",
            NUMBER : "number",
            FUNCTION : "function"
        },
            INVALID_PACKAGE = -1,
            VALID_CLASS = 0,
            VALID_PACKAGE = 1;
        var COMMA_SPLIT = ",",
            SLASH = "/",
            FIND_DOT_REG = /\./gi,
            PACKAGE_SPLIT = ".",
            PATH_SPLIT = "/";
        var DOT_REG = /\./gi,
            ns = function() {
        };

        var code_a = 97,
            code_z = 122,
            code_A = 65,
            code_Z = 90,
            notEmptyArray = function(arr) {
            if ( typeof arr === TYPE_OF_CONST.OBJECT && arr && arr.length > 0) {
                return true;
            }
            return false;
        };

        function checkValidPackageOrClassPath(path) {
            if (hasSlash(path)) {
                console.error(path + " is not a valid package or class name");
                return false;
            }
            var fragments = path.split(PACKAGE_SPLIT),
                firstChar;
            if (fragments <= 0) {
                console.error(path + " is not a valid package or class name");
            } else {
                for (var i = 0,
                    total = fragments.length; i < total; i++) {
                    firstChar = fragments[i].charCodeAt(0);
                    if (i !== total - 1) {
                        utils.assert(checkIfLowerCase(firstChar), "package name should be start with lower case", Error);
                    }
                }
            }
            return true;
        }

        function translateClassPackageToFilePath(classPackage) {
            return classPackage.replace(DOT_REG, SLASH);
        }

        function hasSlash(path) {
            if (path && typeof path === TYPE_OF_CONST.STRING && path.search(PATH_SPLIT) >= 0) {
                return true;
            }
            return false;
        }

        function checkIsUpperCase(char) {
            return checkCharCodeInRange(code_a, code_z);
        }

        function checkIfLowerCase() {
            return checkCharCodeInRange(code_A, code_Z);
        }

        function checkCharCodeInRange(char, withMin, withMax) {
            var code = -1;
            for (var i = 0; i < char.length; i++) {
                code = char.charCodeAt(i);
                if (code < withMin || code > withMax) {
                    return false;
                }
            }
            return true;
        }

        function initPackage(packagePathOrFragments) {
            var fragments = [];
            if (notEmptyArray(packagePathOrFragments)) {
                fragments = packagePathOrFragments;
            } else {
                fragments = packagePathOrFragments.split(PACKAGE_SPLIT);
            }
            var current = ns;
            while (fragments.length > 0) {
                var prop = fragments.shift();
                if (!current.has(prop)) {
                    current[prop] = {};
                }
                current = current[prop];
            }
            return current;
        }

        function init(classOrPackagePath) {
            var fragments = classOrPackagePath.split(PACKAGE_SPLIT),
                className = null,
                namingObj = {
                pkg : null,
                className : null
            };

            checkValidPackageOrClassPath(classOrPackagePath);

            var lastFragment = fragments[fragments.length - 1];
            var firstChar = lastFragment.charCodeAt(0);

            className = checkIsUpperCase(firstChar) ? fragments.pop() : null;
            pkg = fragments.length > 0 ? initPackage(fragments) : ns;

            namingObj.pkg = pkg;
            namingObj.className = className;

            return namingObj;
        }

        function defineClass(classOrPackagePath, classDefinition) {
            var namingObj = init(classOrPackagePath);

            if (namingObj.className && namingObj.pkg) {
                namingObj.pkg[namingObj.className] = classDefinition;
                return true;
            }
            return false;
        }


        ns.init = init;
        ns.defineClass = defineClass;
        ns.initPackage = initPackage;
        ns.translateClassPackageToFilePath = translateClassPackageToFilePath;
        ns.checkValidPackageOrClassPath = checkValidPackageOrClassPath;
        return ns;
    })();

    var Class = (function() {
        /*
        * Simple JavaScript Inheritance By John Resig http://ejohn.org/ MIT Licensed.
        */
        // Inspired by base2 and Prototype
        // Modified by Jackie Wei(i305498)
        // adding package manager, class definition
        var initializing = false,
            fnTest = /xyz/.test(function() { xyz;
        }) ? /\b_super\b/ : /.*/;

        // The base Class implementation (does nothing)
        this.Class = function() {
        };

        // Create a new Class that inherits from this class
        Class.extends = function(classNamingSpace, prop) {
            var _super = this.prototype;

            // Instantiate a base class (but only create the instance,
            // don't run the init constructor)
            initializing = true;
            var prototype = new this();
            initializing = false;

            // Copy the properties over onto the new prototype
            for (var name in prop) {
                // Check if we're overwriting an existing function
                prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" ? (function(name, fn) {
                    return function propDefinition() {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super;
                        this._ns = ns;
                        this._className = classNamingSpace;

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) : prop[name];
            }

            // The dummy class constructor
            function Class() {
                // All construction is actually done in the init method
                if (!initializing && this.init)
                    this.init.apply(this, arguments);
            }

            // Populate our constructed prototype object
            Class.prototype = prototype;

            // Enforce the constructor to be what we expect
            Class.prototype.constructor = Class;

            // And make this class extendable
            Class.extends = arguments.callee;

            ns.defineClass(classNamingSpace, Class);
        };
        return Class;
    })();
    
    var Repo = (function() {
        
    })();
    
    var Loader = (function() {
        function Loader(urls) {
            this._dfd = $.Deferred();
            this._urls = urls;
            this._status = 0;
            this._count = 0;
            return this._dfd.promise();
        }

        Loader.prototype._load = function(urls) {
            urls.forEach($.proxy(function(url) {
                $.ajax(url, {
                    dataType : "text",
                    success : this._onLoaded
                });
            }, this));
        };

        Loader.prototype._onLoaded = function(data) {
            this._count++;
            if (this._count >= this._urls.length) {
                this._dfd.resolve();
            }
        };

        return Loader;
    })();

    var Declare = (function() {
        var STATUS_NO = 0,
            STATUS_LOADING = 1,
            STATUS_HAS = 2;

        function Declare(currentClass, parentClass, dependencies, functionBody) {

            utils.assertString(currentClass);
            utils.assertString(parentClass);
            utils.assertArray(dependencies);
            utils.assertFunction(functionBody);

            ns.init(currentClass);

            if (ns[currentClass]) {
                return true;
            }

            this._stack = this._depenciesStack = [];
            this._currentClass = currentClass;
            this._parentClass = parentClass;

            if (dependencies.search(parentClass) < 0) {
                dependencies.unshift(parentClass);
            }

            resolveDependency(dependencies);
        }

        /**
         * Parameter: dependencies must be an Array, even if empty.
         */
        Declare.prototype.resolveDependency = function(dependencies) {
            if (dependencies.length <= 0) {
                this.defineClass();
            } else {
                (dependencies, arguments.callee, this);
            }
        };

        Declare.prototype.defineClass = function() {

        };

        return Declare;
    })();
})();

/**
 * //source map Class.extends("sap.sbo.ng.Person", { _name : "Normal Person", init : function(message) {
 * console.log(message); }, say : function(message) { console.log(this._name + " say: " + message); } });
 *
 * sap.sbo.ng.Person.extends("sap.sbo.ng.Student", { _name : "Student", init : function(message) {
 * this._super.init(message); console.log("Something New"); }, say : function(message) { this._super.say.apply(this,
 * arguments); console.log(this._name); console.log("First I'm student!"); } });
 *
 * var p = new sap.sbo.ng.Person("Person: Adam"); var s = new sap.sbo.ng.Student("Student: Lily");
 *
 * p.say(" --- "); s.say(" --- ");
 */

