
(function(){

var _reserved_names = [
    '__class__',
    '__parents__'
];

py.declareFromBuiltin = function(name, _parent, obj) {
    var _class = function() {
        _class.prototype.__init__.apply(this, arguments);
    };
    if (_parent) {
        _class.prototype = new _parent();
    } else {
        _class.prototype = new Object();
        _parent = Object;
    }
    _class.prototype.constructor = _class;
    _class.prototype.__class__ = name;
    _class.prototype.__parents__ = [_parent.prototype];


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
                 throw Error("$super first argument must be the JavaScript vari"+
                             "able 'arguments':"+ err);
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

py.declare = function declare(name, parents, obj) {

    var _class = function() {
        _class.prototype.__init__.apply(this, arguments);
    };
    _class.prototype.__class__ = name;
    var _parents = parents || [];
    if (!py.isinstance(_parents, Array)) {
        _parents = [parents];
    }
    _class.prototype.__parents__ = _parents;

    _parents.iter(function(pclass) {
        pclass.prototype.iteritems(function(key, val) {
            if (key.isIn(_reserved_names)) {return;}
            _class.prototype[key] = val;
            if (py.isinstance(val, Function)) {
                _class.prototype[key].__name__ = key;
            }
        });
    });
    obj.iteritems(function(key, val) {
        if (key.isIn(_reserved_names)) {return;}
        if (key === 'constructor') {return;}
        _class.prototype[key] = val;
        if (py.isinstance(val, Function)) {
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

py.$super = function $super(_class, obj, f) {
    var _parents = _class.prototype.__parents__.slice().reverse(),
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
                throw new AttributeError(obj.__class__ + ' hasn\'t parent with member '+f);
            } else {
                throw err;
            }
        }
    }
};


