/**
 * @fileOverview This is String prototype augmentation
 * @author <a href="mailto:raphael.londeix@gmail.com">Raphaël Londeix</a>
 * @version 0.1
 */


/**
 * The String prototype
 * @name String
 * @class
 */


/**
 * @property {String} __class__ The object class
 * @private
 */
String.prototype.__class__ = 'String';

/**
 * Returns string representation of the object
 * @private
 * @returns {String}
 */
String.prototype.__str__ = function() {
    return this.toString();
};

/**
 * Returns Json representaion of the object
 * @private
 * @returns {String}
 */
String.prototype.__repr__ = function() {
    return '"' + this.replace('\\', '\\\\', 'g').replace('"', '\\"', 'g') +  '"';
};


/**
 * Specific implementation for strings
 * @param {String} s String to compare with
 * @returns {Boolean}
 */
String.prototype.equals = function(s) {
    return s !== null &&
           s.__class__ === 'String' &&
           this.toString() === s.toString();
};

/**
 * Join a array
 * @param {Array} a Array to join
 * @returns {String}
 */
String.prototype.join = function(a) {
    /*<debug*/py.raiseNone(a);/*debug>*/
    return a.join(this);
};

/**
 * Returns the number of contained objects
 * @private
 * @returns {Number}
 */
String.prototype.__len__ = function() {
    return this.length;
};

/**
 * Specific implementation for String. It returns an `Iterable` Object
 * @private
 * @returns {Array}
 * @see <a href="http://docs.python.org/library/stdtypes.html#iterator-types">Python Iterators</a>
 */
String.prototype.__iter__ = function() {
    this._index = 0;
    this._len = this.__len__();
    return this;
};

/**
 * Return the next character or raise StopIteration
 * @returns {String} the next char
 * @private
 * @see <a href="http://docs.python.org/library/stdtypes.html#iterator-types">Python Iterators</a>
 */
String.prototype.next = function() {
    if (this._index < this._len) {
        var val = this.charAt(this._index);
        this._index += 1;
        return val;
    }
    throw new StopIteration();
};

/**
 * Strip whitespace around a string
 * @returns {String} striped string
 * @function
 * @see <a href="http://blog.stevenlevithan.com/archives/faster-trim-javascript"> Faster Javascript Trim</a>
 */
if (!String.prototype.trim) {
    String.prototype.trim = function trim() {
        var str = this.replace(/^\s+/, '');
        for (var i = str.length - 1; i >= 0; i--) {
            if (/\S/.test(str.charAt(i))) {
                str = str.substring(0, i + 1);
                break;
            }
        }
        return str;
    };
}

/**
 * Strip whitespace (default) or chars around a string
 * @param {String} [chars] characters to be striped
 * @returns {String} striped string
 * @function
 * @see <a href="http://blog.stevenlevithan.com/archives/faster-trim-javascript"> Faster Javascript Trim</a>
 */
String.prototype.strip =  function strip(chars) {
    if (isNone(chars)) {
        return this.trim();
    }
    var re_begin = new RegExp('^['+chars+']+'),
        re_char = new RegExp('[^'+chars+']'),
        str = this.replace(re_begin, '');
    for (var i = str.length - 1; i >= 0; i--) {
        if (re_char.test(str.charAt(i))) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return str;
};

/**
 * Strip leading whitespaces (default) or chars
 * @param {String} [chars] characters to strip out
 * @returns {String}
 */
String.prototype.lstrip = function lstrip(chars) {
    var re = py.notNone(chars) ? new RegExp('^['+chars+']+') : /^\s+/;
    return this.replace(re, '');
};

/**
 * Strip trailing whitespaces (default) or chars
 * @param {String} [chars] characters to strip out
 * @returns {String}
 */
String.prototype.rstrip = function rstrip(chars) {
    var str = this,
        re = py.notNone(chars) ? new RegExp('[^'+chars+']') : /\S/;
    for (var i = str.length - 1; i >= 0; i--) {
        if (re.test(str.charAt(i))) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return str;
};

