/**
 * @fileOverview Parser functionnality
 * @author <a href="mailto:raphael.londeix@gmail.com>Raphaël Londeix</a>
 * @version 0.1
 */

/**
 * Parser namespace
 * @name py.parser
 * @namespace
 */

py.declare('py.parser.Handler', {
    match: function match(element, elements) {
        return false;
    },

    onMatch: function onMatch(element, elements) {

    },
});


py.declare('py.parser.Parser', {
    _handlers: null,

    __init__: function() {
        this._handlers = [];
    },

    addHandler: function addHandler(hdlr) {
        this._handlers.append(hdlr);
    },

    parse: function() {

    }

});
