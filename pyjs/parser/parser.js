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

py.declare('py.parser.Handler', null, {
    match: function match(element, elements) {
        return false;
    },

    onMatch: function onMatch(element, elements) {

    },
});


py.declare('py.parser.Parser', null, {
    _handlers: null,

    __init__: function() {
        this._handlers = [];
    },

    addHandler: function addHandler(hdlr) {
        this._handlers.append(hdlr);
    },

    /**
     * Return next element to parse, must be overrided
     * return null when parsing is done
     */
    getNext: function(element, elements, idx) {},

    /**
     * Entry point, should not be overrided
     */
    parse: function(elements) {
        var element = null,
            i = 0;
        if (py.len(this._handlers) === 0)
            throw Error("Cannot parse anything no handlers are defined");
        element = this.getNext(null, elements, 0);
        while (py.notNone(element)) {
            this._handlers.iter(function(hdlr) {
                if (hdlr.match(element, elements))
                    hdlr.onMatch(element, elements);
            });
            i += 1;
            element = this.getNext(element, elements, i);
        }
    }
});
