/**
 * @fileOverview HTML Parser
 * @author <a href="mailto:raphael.londeix@gmail.com>Raphaël Londeix</a>
 * @version 0.1
 */

py.importModule('py.parser.parser');

py.declare('py.parser.HTMLElementHandler', [py.parser.Handler], {
    /**
     * Initialise an html handler
     * @param {Object} args Define matching properties
     * @param {String} args.tag Array of tag name to match
     * @param {String[]} args.classes Array of class name to match
     * @param {Function} args.onMatch function to call when match an object
     */
    __init__: function(args) {
        this.args = args;
        if (args.contains('onMatch'))
            this.onMatch = args.onMatch;
    },

    match: function(element, elements) {
        if (py.notNone(this.args.tag) && py.notNone(element.tagName) &&
            (this.args.tag.toUpperCase() != element.tagName.toUpperCase()))
            return ;
        if (py.notNone(this.args.classes)) {
          if (!this.args.classes.all(function(class_name) {
                return (py.notNone(element.hasClass) && element.hasClass(class_name));
              }))
            return ;
        }
        this.onMatch(element, elements);
    }

});


py.declare('py.parser.HTMLParser', [py.parser.Parser], {

    __init__: function() {
        this.$super(arguments);
    },

    getNext: function(element, elements, idx) {
        if (py.isNone(element)) {
            return (elements);
        }
        if (py.notNone(element.firstChild)) {
            return (element.firstChild);
        }
        if (py.notNone(element.nextSibling)) {
            return (element.nextSibling);
        }
        do {
          element = element.parentNode;
        } while (py.isNone(element.nextSibling) && element.isIn(elements));
        if (element.nextSibling)
          return (element.nextSibling);
        return (null);
      }
  });

