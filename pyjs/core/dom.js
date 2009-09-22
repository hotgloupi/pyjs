/**
 * @fileOverview Dom namespace defined here
 * @author <a href="mailto:raphael.londeix@gmail.com">Raphaël Londeix</a>
 * @version 0.1
*/

/**
 * Dom utilities
 * @namespace
 * @name py.dom
 */

py.extendNamespace('py.dom', {
    /** @lends py.dom */

    /**
     * Create an Element
     * @param {String} tag Tag name
     * @param {Object} [obj] attributes of the node
     * @returns {Element} created element
     */
    create: function create(tag, attrs) {
        /*<debug*/
        py.raiseNone(tag);
        if (!py.isinstance(tag, String)) {
            throw TypeError("tag must be a string");
        }
        /*debug>*/
        var el = document.createElement(tag);
        if (attrs) {
            //<debug
            if (!py.isinstance(attrs, Object)) {
                throw TypeError("attributes must be given in an Object");
            }
            //debug>
            attrs.iteritems(el.attr.bind(el));
        }
        return el;
    },

    /**
     * Set or get attribute(s) of an elements
     * @param {String|Element} el the node or node id
     * @param {Object|Array|String} attr If it's an object, it will set all pairs to
     *                              the node. If it's an array, it will return an
     *                              object of attributes values. if it's a string,
     *                              it will return the value or set the new one if
     *                              last param val is specified
     * @param [val] used when set one attribute
     */
    attr: function attr(el, _attr, val) {
        //<debug
        py.raiseNone(el);
        py.raiseNone(_attr);
        //debug>

        var node = py.isinstance(el, String) ? document.getElementById(el) : el;
        //<debug
        if (py.isinstance(el, String) && py.isNone(node)) {
            throw ValueError('The ID '+el+' is not found');
        } else if (!py.isinstance(el, Element, String) ) {
            throw ValueError('el must be a string or an Element');
        }
        //debug>

        if (py.isinstance(_attr, String)) {
            if (py.isNone(val)) { // get simple attribute
                return node.__getitem__(_attr);
            } else {
                return node.__setitem__(_attr, val);
            }
        } else if (py.isinstance(_attr, Array)) { // get multiple attributes
            var res = {};
            _attr.iter(function(k) {
                res[k] = node.__getitem__(k);
            });
            return res;
        } else if (py.isinstance(_attr, Object)) { // set multiple attributes
            _attr.iteritems(function(k,v) {
                node.__setitem__(k, v);
            });
        } else {
            throw TypeError('_attr must a String, an Array or an Object');
        }
    },


    /**
     * Set or get style(s) from an element
     * @param {String|Element} el The node
     * @param {Object|Array|String} if it's an object, it will set all pairs to
     *                              the node style. If it's an array, it will return an
     *                              object of styles values. if it's a string,
     *                              it will return the value or set the new one if
     *                              last param val is specified
     * @param [val] used when set one style
     */
    style: function style(el, _style, val) {
        //<debug
        py.raiseNone(el);
        py.raiseNone(_style);
        //debug>

        var node = py.isinstance(el, String) ? document.getElementById(el) : el;

        //<debug
        if (py.isinstance(el, String) && py.isNone(node)) {
            throw ValueError('The ID '+el+' is not found');
        } else if (!py.isinstance(el, Element, String) ) {
            throw ValueError('el must be a string or an Element');
        }
        //debug>

        if (py.isinstance(_style, String)) {
            if (py.isNone(val)) { // get simple attribute
                return node.getStyle(_style);
            } else {
                return node.setStyle(_style, val);
            }
        } else if (py.isinstance(_style, Array)) { // get multiple attributes
            return node.getStyles(_style);
        } else if (py.isinstance(_style, Object)) { // set multiple attributes
            return node.setStyles(_style);
        } else {
            throw TypeError('_style must a String, an Array or an Object');
        }
    }
});
py.importModule('py.core.dom-query');

