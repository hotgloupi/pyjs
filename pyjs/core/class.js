
(function(){

var _reserved_names = [
    '__class__',
    '__parents__'
];

declareFromBuiltin = function(name, _parent, obj) {
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



declare = function(name, parents, obj) {

    var _class = function() {
        _class.prototype.__init__.apply(this, arguments);
    };
    _class.prototype = new GenericClass();
    _class.prototype.__class__ = name;
    var _parents = parents || [];
    if (!isinstance(_parents, Array)) {
        _parents = [parents];
    }
    _class.prototype.__parents__ = _parents;

    // WARNING: thread conflict
    var wrap_function = function(fname, f) {
        return function() {
            var old_inherit = this.inherited;
            this.inherited = function() {
                var sup = _super(_class, this, fname);
                return sup.apply(this, arguments);
            };
            var ret = f.apply(this, arguments);
            this.inherited = old_inherit;
            return ret;
        };
    };

    _parents.iter(function(pclass) {
        pclass.prototype.iteritems(function(key, val) {
            if (key.isIn(_reserved_names)) {return;}
            if (py.isinstance(val, Function)) {
                _class.prototype[key] = wrap_function(key, val);
            } else {
                _class.prototype[key] = val;
            }
        });
    });
    obj.iteritems(function(key, val) {
        if (key.isIn(_reserved_names)) {return;}
        if (key === 'constructor') {return;}
        if (py.isinstance(val, Function)) {
            _class.prototype[key] = wrap_function(key, val);
        } else {
            _class.prototype[key] = val;
        }
    });
    window[name] = _class;
    return _class;
};

function _super(_class, obj, f) {
    var _parents = _class.prototype.__parents__.reverse(),
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
            if (isinstance(err, StopIteration)) {
                throw new AttributeError(obj.__class__ + ' hasn\'t parent with member '+f);
            } else {
                throw err;
            }
        }
    }
};
})();

