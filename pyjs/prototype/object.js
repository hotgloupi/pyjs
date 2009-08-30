(function(){

Object.prototype.__class__ = 'Object';

Object.prototype.__str__ = function() {
    return '<Class ' + this.__class__+'>';
};

//Json object is returned from this method
Object.prototype.__repr__ = function() {
    var pairs = [];
    this.iteritems(function(k, v, idx) {
        pairs[idx] = repr(k) + ': ' + repr(v);
    });
    return "{" + (', ').join(pairs) + "}";
};

Object.prototype.__init__ = function() {};

Object.prototype.__iter__ = function() {
    var keys = [];
    for (var k in this) {
        if (this.hasOwnProperty(k)) {
            keys.append(k);
        }
    }
    return keys.__iter__();
};

Object.prototype.__len__ = function() {
    return this.__iter__().__len__();
};

Object.prototype.__getitem__ = function(k) {
    var v = this[k];
    if (v === undefined) {
        throw new KeyError(k);
    }
    return v;
};

Object.prototype.__setitem__ = function(k, v) {
    if (k === undefined) {
        throw new KeyError("key is undefined");
    }
    if (v === undefined) {
        throw new ValueError("value is undefined, use delete instead");
    }
    this[k] = v;
};

Object.prototype.iter = function(f, scope) {
    if (!isinstance(f, Function))
      throw new TypeError();

    var it = this.__iter__(),
        idx = 0;
    while (true) {
        try {
            f.call(scope, it.next(), idx);
            idx += 1;
        } catch (err) {
            if (isinstance(err, StopIteration)) {
                break;
            }
            throw err;
        }
    }
};

Object.prototype.iteritems = function(f, scope) {
    this.iter(function(k, idx) {
        f.call(scope, k, this[k], idx);
    }, this);
};


Object.prototype.itervalues = function(f, scope) {
    this.iter(function(k, idx) {
        f.call(scope, this[k], idx);
    }, this);
};

Object.prototype.keys = function() {
    var keys = [];
    this.iter(function(k, idx) {
        keys[idx]=k;
    });
    return keys;
};

Object.prototype.values = function() {
    var values = [];
    this.iter(function(k, idx) {
        values[idx] = this.__getitem__(k);
    }, this);
    return values;
};

Object.prototype.items = function() {
    var items = [];
    this.iteritems(function(k, v, idx) {
        items[idx] = [k, v];
    });
    return items;
};

Object.prototype.equals = function( obj) {
    if (obj === null || obj.__class__ !== 'Object') {
        return false;
    }
    var same = true;
    this.iteritems(function(k, v) {
        if (typeof obj[k] === "undefined") {
            same = false;
        } else {
            same = v.equals(obj[k]);
        }
        if (same === false) {
            throw new StopIteration();
        }
    });
    return same;
};

Object.prototype.isIn = function(obj) {
    var found = false;
    obj.iter(function(el) {
        if (this.equals(el)) {
            found = true;
            throw new StopIteration();
        }
    }, this);
    return found;
};

Object.prototype.contains = function(obj) {
    var found = false;
    this.iter(function(el) {
        found = equal(el, obj);
        if (found) {
            throw new StopIteration();
        }
    }, this);
    return found;
};

Object.prototype.any = function(fn, scope) {
    var res = false;
    this.iter(function(el, idx) {
        res = !!fn.call(scope, el, idx);
        if (res === true) {
            throw new StopIteration();
        }
    });
    return res;
};

Object.prototype.all = function(fn, scope) {
    var res = true;
    this.iter(function(el, idx) {
        res = !!fn.call(scope, el, idx);
        if (res === false) {
            throw new StopIteration();
        }
    });
    return res;
};

Object.prototype.update = function(/*Object*/ obj) {
    obj.iteritems(function(k, v) {
        this[k] = v;
    }, this);
};


})();


