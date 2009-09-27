/**
 * @fileOverview XMLHTTPRequest manipulation
 * @author <a href="mailto:raphael.londeix@gmail.com">Raphaël Londeix</a>
 * @version 0.1
 */

py.importModule('py.defer.Deferred');

py.declare('py.defer.XmlHttpRequest', null, {

    __init__: function __init__(args) {
        this.$super('__init__')();
        //<debug
        if (py.isNone(args) || !py.isinstance(args, Object)) {
            throw new ValueError("Argument must be an Object");
        }
        if (py.isNone(args.url)) {
            throw new ValueError("URL must be specified");
        }
        //debug>
        this.options = {
            method: 'GET',
            content: null
        };
        this.options.update(args);
    },

    onLoad: function (res) {

    },

    onError: function(err) {

    }

});
