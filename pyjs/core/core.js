/**
 * @fileOverview Core PyJS file, the first to be loaded
 * @author <a href="mailto:raphael.londeix@gmail.com">Raphaël Londeix</a>
 * @version 0.1
*/

if (typeof console != "undefined") {
    log = function(){console.log.apply(console, arguments);};
    warn = function(){console.warn.apply(console, arguments);};
} else {
    log = warn = function(){};
}


/**
 * Global PyJS namespace
 * @namespace
 */
py = {

    config: {
        extremist: false,
        withGlobals: true,
        preventCache: true
    },

	// Contains directories path for each namespaces
    _modules_path: {},

    // Contains loaded modules
    _loaded_modules:  {
        'py.core.core': true // this is the name of this module !
    },

    /** alias of document */
    doc: null,

    /** alias of body */
	body: null,

	__init__: function() {
		this._findGlobals();
		this._initPyModulesPath();
	},

	_findGlobals: function() {
		//TODO complete for browser compatibility
		py.doc = window.document;
        py.body = py.doc.body;
        if (typeof pyConfig !== "undefined") { // config from user
            for (var c in pyConfig) {
                if (pyConfig.hasOwnProperty(c)) {
                    this.config[c] = pyConfig[c];
                }
            }
        }
	},

	_initPyModulesPath: function() {
		var scripts = document.getElementsByTagName('script'),
			py_src = null, src;
		for (var i=scripts.length-1; i>-1; i--) {
			src = scripts[i].getAttribute('src');
			if (scripts[i].src.indexOf('pyjs/core/core.js') != -1) {
				py_src = src;
				break;
			}
		}
		if (!py_src) {
			//TODO: pyjs not found !
		} else {
			//TODO: external load
			py._modules_path.py = py_src.replace('core/core.js', '');
		}
    },

    registerModulePath: function(prefix, path) {
        /*<debug*/
        py.raiseNone(prefix);
        py.raiseNone(path);
        if (!py.isinstance(prefix, String) || !py.isinstance(path, String)) {
            throw TypeError('prefix and path arguments must be String');
        }
        if (prefix.length === 0) {
            throw new ValueError('prefix must be a non empty String');
        }
        if (prefix.contains('.')) {
            throw new ValueError('prefix cannot contains the "." character');
        }
        if (path.length === 0) {
            throw new ValueError('path must be a non empty String');
        }
        if (prefix.isIn(this._modules_path)) {
            throw new Error("The prefix "+ prefix +" was already registered");
        }
        /*debug>*/
        path = path.rstrip('/') + '/';
        this._modules_path[prefix] = path;
    },

	loadJsFromOtherDomain: function(/*String*/ url) {
		var head = py.doc.getElementsByTagName('head')[0],
			loader = py.dom.create('script');
		loader.src = url;
		head.appendChild(loader);
	},


    /** Load JavaScript from url
     * @param {String} url url to load
     * @returns {String} source code
     */
    loadJs: function(/*String*/ url) {
        if (this.config.preventCache) {
            var d = new Date();
            if (url.indexOf('?') === -1) {url += '?';}
            else {url += '&';}
            url += 'preventCache='+d.getTime()+'.'+d.getMilliseconds();
        }
        var xhr = this.xhrObj();
        xhr.open('GET', url, false);
        xhr.send(null);
        if (!this.isXhrOk(xhr)) {
            throw "Cannot load URI " + url;
        } else {
            return xhr.responseText;
        }
    },

    /**
     * Get the URL of a Module name
     * @param {String} name dotted module name
     * @returns {String} Url of the module
     */
    getModuleUrl: function(name) {
        var parts = name.split('.'), folder, filename;
		if (parts.length == 1) {
			folder = py._modules_path.py.replace('pyjs/', '');
			filename = name+'.js';
		} else {
			if (this._modules_path[parts[0]]) {
				folder = this._modules_path[parts[0]];
				parts.shift();
			} else {
				folder = py._modules_path.py.replace('pyjs/', '');
			}
			for (var i=0, l=parts.length; i<l-1; i++) {
				folder += parts[i] + '/';
			}
			filename = parts.pop() + '.js';
        }
        return folder+filename;
    },

    /**
     * Import module from dotted name
     * @param {String} name the module name
     */
    importModule: function(/*String*/ name) {
        if (this._loaded_modules[name]) {return;}

        log('import module: ',name);
        var src = this.loadJs(py.getModuleUrl(name));
        try {
            this.globalEval(src);
        } catch (err) {
            // TODO better error report
            throw "Error while loading module " + name + ' : ' + err;
        }
        this._loaded_modules[name] = true;
	},

    /**
     * Cross browser XMLHttpRequest
     * @returns {XMLHttpRequest} XmlHTTPRequest Object
     */
    xhrObj: function() {
        var methods = {
                f1: function() {
                    return new ActiveXObject('Msxml2.XMLHTTP');
                },
                f2: function() {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                },
                f3: function() {
                    return new ActiveXObject('Msxml2.XMLHTTP.4.0');
                },
                f4: function() {
                    return new XMLHttpRequest();
                }
            },
            self = this,
            xhr_obj = null,
            working_method;
        // According to Dojo, we try ActiveXObject before others
        // beceause in IE7, when local loading, XmlHttpRequest() fails
        for (var i=1; i<5; i++) {
            try {
                working_method = methods['f'+i];
                xhr_obj = working_method();
            } catch (e) {
                xhr_obj = null;
            }
            if (xhr_obj !== null) {
                setTimeout(function(){self.xhrObj = working_method;},0);
                return xhr_obj;
            }
        }
        throw "XmlHttpRequest is not available";
    },

    /**
     * Verify if an XHR status is OK
     * @params {XMLHttpRequest} xhr
     * @returns {Boolean} true if XHR has no error
     */
    isXhrOk: function(xhr) {    // From Dojo
        var stat = xhr.status || 0;
        return (
            stat >= 200 && stat < 300) || 			// allow any 2XX response code
            stat == 304 ||
            stat == 1223 || 						// get it out of the cache
            (!stat && (location.protocol=="file:" || location.protocol=="chrome:")
        );
    },

    /**
     * Eval anything in the global scope
     * @param {String} text Source code to eval
     */
    globalEval: function(text) {
        if (py.global.execScript) {
            py.global.execScript(text, "javascript");
        } else if (py.global.eval) {
            py.global.eval(text);
        } else {
            eval(text);
        }
    },


    _onload_fired: false,
    _onload_callbacks: [],

    /**
     * Add a function to be fired when dom is ready
     * @param {Function} f function to fire
     */
    addOnLoad: function addOnLoad(f) {
        // It is py.browser._onLoad that use _onload_callbacks
        // and set _onload_fired to true
        /*<debug*/
        if (typeof f != "function") {
            throw TypeError('f must be a function');
        }
        /*debug>*/
        if (this._onload_fired) {
            f();
        } else {
            this._onload_callbacks.push(f);
        }
    }

};
py.global = this;

py.__init__();
py.importModule('py.prototype.__init__');
py.importModule('py.core.class');
py.importModule('py.core.error');

py.importModule('py.core.utils');
py.importModule('py.core.browser');
py.importModule('py.core.dom');

if (py.config.withGlobals === true) {
    py.importModule('py.core.globals');
}
