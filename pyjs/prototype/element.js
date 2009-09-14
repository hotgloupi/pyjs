/**
 * @fileOverview This is String prototype augmentation
 * @author <a href="mailto:raphael.londeix@gmail.com">Raphaël Londeix</a>
 * @version 0.1
 */

/**
 * The Element prototype
 * @name Element
 * @class
 */


// For IE
if (typeof Element === "undefined") {
    Element = function(){};
    py.importModule('py.prototype.browsers.ie');
}

/**
 * @property {String} __class__ The object class
 * @private
 */
Element.prototype.__class__ = "Element";

/**
 * Check in an element is child of another node
 * @param {Element|String} n a node or id
 * @returns {Boolean}
 */
Element.prototype.isIn = function(/*Node|String*/ n) {
    /*<debug*/py.raiseNone(n);/*debug>*/
    if (py.isinstance(n, String)) {
        n = document.getElementById(n);
    }
    if (n === null) {return false;}
    var child = this;
    while (child) {
        if (child === n) {return true;}
        child = child.parentNode;
    }
    return false;
};

/**
 * Check if an element is parent of another node
 * @param {Element|String} n node or id
 * @returns {Boolean}
 */
Element.prototype.contains = function(/*Node|String*/ n) {
    if (py.isinstance(n, String)) {
        n = document.getElementById(n);
    }
    if (n === null) {return false;}
    return n.isIn(this);
};

/**
 * Get node attribute
 * @param {String} k attribute name
 * @returns attribute value
 * @private
 */
Element.prototype.__getitem__ = function(k) {
    var attr_map = py.browser.getAttributesMap(),
        getter = function(k) {
            //<debug
            if (py.isNone(k) || !py.isinstance(k, String)) {
                throw TypeError('Node attribute must be a string');
            }
            //debug>
            k = attr_map[k] || k;
            if (py.isinstance(k, Function)) {
                return k.call(this);
            }
            return py.notNone(this[k]) ? this[k] : this.getAttribute(k);
    };
    setTimeout(function(){
        Element.prototype.__getitem__ = getter;
    }, 0);
    return getter.call(this, k);
};

/**
 * Set node attribute
 * @param {String} k attribute name
 * @param v attribute value
 * @private
 */
Element.prototype.__setitem__ = function(k, v) {
    var attr_map = py.browser.getAttributesMap(),
        setter = function(k, v) {
            //<debug
            if (py.isNone(k) || !py.isinstance(k, String)) {
                throw TypeError('Node attribute must be a string');
            }
            //debug>
            k = attr_map[k.toLowerCase()] || k;
            if (py.isinstance(k, Function)) {
                return k.call(this, v);
            }
            this[k] = v;
        };
    setTimeout(function(){
        Element.prototype.__setitem__ = setter;
    }, 0);
    return setter.call(this, k, v);
};

/**
 * Get or set node attribute
 * @param {String} attribute attribute name
 * @param [value] attribute value
 * @returns attribute value or undefined
 */
Element.prototype.attr = function(/*String*/ attribute, /*String?*/ value) {
    if (!value) {return this.__getitem__(attribute);}
    else {this.__setitem__(attribute, value);}
};

/**
 * Select an array of nodes with CSS2 selector inside the element
 * @param {String} selectors CSS2 selectors (separated by comma)
 * @returns {Element[]} Array of nodes (possibly empty)
 */
Element.prototype.query = function query(selectors) {
    return py.dom.query(selectors, this);
};

