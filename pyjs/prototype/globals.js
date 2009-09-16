/**
 * @fileOverview Global functions
 * @author <a href="mailto:raphael.londeix@gmail.com">Raphaël Londeix</a>
 * @version 0.1
 */

(function() {

var methods = {
    /** @lends py*/

    /**
     * Check if an obj is Not Undefined And Not Null
     * @param obj anything
     * @returns {Boolean}
     */
    notNone: function notNone(o) {
        return (typeof o !== "undefined" && o !== null);
    },

    /**
     * Check if an obj is Undefined Or Null
     * @param obj anything
     * @returns {Boolean}
     */
    isNone: function isNone(o) {
        return (typeof o === "undefined" || o === null);
    },

    /**
     * raise a TypeError is an object is undefined or null
     * @param anything
     */
    raiseNone: function raiseNone(o) {
        if (py.isNone(o)) {
            throw TypeError("Object is Undefined Or Null");
        }
    },

    /**
     * Check is an object is an instance of a class
     * @params {Object} obj object to check
     * @params {Object} _class a class
     * @returns {Boolean}
     */
    isinstance: function isinstance(obj, _class) {
        /*<debug*/
        py.raiseNone(obj);
        py.raiseNone(_class);
        /*debug>*/
        return obj.__class__ === _class.prototype.__class__;
    },

    /**
     * Check if two object are equal
     * @param a
     * @param b
     * @returns {Boolean}
     */
    equal: function equal(a, b) {
        if (py.notNone(a) && py.notNone(b)) {
            return a.equals(b);
        } else if (!isNUANN(a) && !isNUANN(b)) {
            return a === b;
        } else {return false;}
    },

    /**
     * Returns length of an Iterable object
     * @param {Object} obj
     * @returns {Number} length
     */
    len: function len(obj) {
        /*<debug*/py.raiseNone(obj);/*debug>*/
        return obj.__len__();
    },

    /**
     * Returns an object iterator
     * @param {Object} obj
     * @returns {Object} Iterator
     */
    iter: function iter(obj) {
        /*<debug*/py.raiseNone(obj);/*debug>*/
        return obj.__iter__();
    },

    /**
     * Returns the string representation of anything
     * @param obj
     * @returns {String}
     */
    str: function str(obj) {return py.notNone(obj) ? obj.__str__() : obj+'';},

    /**
     * Returns the Json representation of an Object
     * @param {Object} obj
     * @returns {String|null}
     */
    repr: function repr(obj) {
        if (py.isNone(obj)){return null;}
        return obj.__repr__();
    },

    /**
     * This function do nothing
     */
    nothing: function nothing(){}
};

//WARNING cannot use update method here, isinstance is used ...
for (var m in methods) {
    if (methods.hasOwnProperty(m)) {
        py[m] = methods[m];
    }
}


})();

if (py.config.withGlobals === true) {
    notNone = py.notNone;
    isNone = py.isNone;
    raiseNone = py.raiseNone;
    isinstance = py.isinstance;
    equal = py.equal;
    len = py.len;
    iter = py.iter;
    str = py.str;
    repr = py.repr;
} else {
    iter = undefined;
    window.iter = null;
}


