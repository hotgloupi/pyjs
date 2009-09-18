/**
 * @fileOverview Dom namespace defined here
 * @author <a href="mailto:raphael.londeix@gmail.com">Raphaël Londeix</a>
 * @version 0.1
*/

/**
 * Dom utilities
 * @namespace py.dom
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
    }
});
py.importModule('py.core.dom-query');

