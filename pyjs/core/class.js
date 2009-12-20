
(function(){

var _reserved_names = [
    '__name__',
    '__class__',
    '__bases__'
];

py.declareFromBuiltin = function(name, _parent, obj) {
    var _class = function() {
        this.__init__.apply(this, arguments);
    };
    if (_parent) {
        _class.prototype = new _parent();
    } else {
        _class.prototype = new Object();
        _parent = Object;
    }
    _class.prototype.constructor = _class;
    _class.prototype.__name__ = name;
    _class.prototype.__class__ = _class;
    _class.prototype.__bases__ = [_parent.prototype];


    for (var k in obj) {
        if (obj.hasOwnProperty(k) && k !== "constructor") {
            _class.prototype[k] = obj[k];
        }
    }
    window[name] = _class;
    return _class;
};

var class_super = function(_class) {
    return function(/*arguments|String*/ args, /*Array?*/ real_args) {
        /*<debug*/py.raiseNone(args);/*debug>*/
        var fname;
        if (py.isinstance(args, String)) {
            fname = args;
            real_args = real_args || [];
        } else {
            /*<debug*/try {/*debug>*/
                 fname = args.callee.__name__;
            /*<debug*/ } catch (err) {
                 throw new TypeError("$super first argument must be the JavaScript vari"+
                             "able 'arguments' or a String:"+ err);
             }/*debug>*/
        }
        var f = py.$super(_class, this, fname);
        if (py.notNone(real_args)) {
            return f.apply(null, real_args);
        } else {
            return f.apply(null, args);
        }
    };
};


/**
 * Declare a new class
 * @param {String} name The class name, possibly a dotted namespace
 * @param {Array|Class} [parents] Bases class
 * @param {Object} obj The Class methods and members
 */
py.declare = function declare(name, parents, obj) {
    var _class = function() {
        _class.prototype.__init__.apply(this, arguments);
    };
    _class.prototype.__name__ = name;
    _class.prototype.__class__ = _class;
    _class.prototype.__repr__ = function() {
        return '<Class '+this.__name__+'>';
    };
    _class.prototype.toString = function() {
        return py.repr(this);
    };

    var _parents = parents || [];
    if (!py.isinstance(_parents, Array)) {
        _parents = [parents];
    }
    _class.prototype.__bases__ = _parents;

    _parents.iter(function(pclass) {
        pclass.prototype.iteritems(function(key, val) {
            if (key.isIn(_reserved_names)) {return;}
            _class.prototype[key] = val;
            if (py.notNone(val) && py.isinstance(val, Function)) {
                _class.prototype[key].__name__ = key;
            }
        });
    });

    obj.iteritems(function(key, val) {
        if (key.isIn(_reserved_names)) {return;}
        if (key === 'constructor') {return;}
        _class.prototype[key] = val;
        if (py.notNone(val) && py.isinstance(val, Function)) {
            _class.prototype[key].__name__ = key;
        }
    });
    _class.prototype.$super = class_super(_class);
    var parts = name.split('.');
    if (parts.length > 1) {
        name = parts.pop();
        var obj = {};
        obj[name] = _class;
        py.extendNamespace('.'.join(parts), obj);
    } else {
        window[name] = _class;
    }

    return _class;
};
})();

(function(){

    var superMixin = function(_class, obj) {

    };

    var superFunction = function(_class, obj, f) {
        var _parents = _class.prototype.__bases__.slice().reverse(),
            it = _parents.__iter__(),
            self = this;
        while (true) {
            try {
                var p = it.next();
                if (p.prototype[f] && py.isinstance(p.prototype[f], Function)) {
                    return function() {
                        p.prototype[f].apply(self, arguments);
                    };
                }
            } catch (err) {
                if (py.isinstance(err, StopIteration)) {
                    throw new AttributeError(obj.__name__ + ' hasn\'t parent with member '+f);
                } else {
                    throw err;
                }
            }
        }
    }

    /**
     * Returns neither parent function of an object, or
     * an appropriate mixin of parents methods
     * @param {Class} _class The class from which search of parents
     * @param {Object} obj The instance
     * @param {String} [f] The function name to get from bases class. If not
     *                     specified, function returns a mixin object
     * @returns {Object|Function} A mixin object or the base function
     */
    py.$super = function $super(_class, obj, f) {
        //<debug
        py.raiseNone(_class);
        py.raiseNone(obj);
        //debug>
        if (py.notNone(f)) {
            return superFunction(_class, obj, f);
        } else {
            return superMixin(_class, obj);
        }
    };


})();


