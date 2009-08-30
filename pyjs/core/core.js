(function(){

if (console) {
    log = function(){console.log.apply(console, arguments);};
} else {
    log = function(){};
}

py = {

	// Contains directories path for each namespaces
	_modules_path: {},

	// Alias to document and others
	doc: null,
	body: null,

	__init__: function() {
		this._findGlobals();
		this._initPyModulesPath();
	},

	_findGlobals: function() {
		//TODO complete for browser compatibility
		py.doc = window.document;
		py.body = py.doc.body;
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

	// Create node with given tag and apply attributes given
	create: function(/*String*/ tag, /*Object?*/ attrs) {
		// TODO complete to use args
		var node = py.doc.createElement(tag);
		return node;
	},


	_loadJsWithTag: function(/*String*/ url) {
		var head = py.doc.getElementsByTagName('head')[0],
			loader = py.create('script');
		loader.src = url;
		head.appendChild(loader);
	},


    // Load and eval JavaScript from url
    // TODO figure out best loading method
    loadJs: function(/*String*/ url) {
        var xhr = this.xhrObj();
        xhr.open('GET', url, false);
        xhr.send(null);
        if (!this.isXhrOk(xhr)) {
            throw "Cannot load URI " + url;
        } else {
            this.globalEval(xhr.responseText);
        }
    },

	'import': function(/*String*/ name) {
		var parts = name.split('.'), folder, filname;
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
        log('import module: ',name);
		this.loadJs(folder+filename);
	},

    // returns an XmlHTTPRequest Object
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

    // returns true is XHR has no error
    // from Dojo
    isXhrOk: function(xhr) {
        var stat = xhr.status || 0;
        return (stat >= 200 && stat < 300) || 	// Boolean
				stat == 304 || 						// allow any 2XX response code
				stat == 1223 || 						// get it out of the cache
				(!stat && (location.protocol=="file:" || location.protocol=="chrome:") );
    },

    // Eval in global scope, returns nothing
    globalEval: function(text) {
        if (py.global.execScript) {
            py.global.execScript(text, "javascript");
        } else if (py.global.eval) {
            py.global.eval(text);
        } else {
            eval(text);
        }
    }
};

// window alias
py.global = this;

py.__init__();
py.import('py.prototype.layer');
py.import('py.core.class');
py.import('py.core.error');

})();
