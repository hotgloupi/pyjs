
Array.prototype.__class__ = 'Array';

Array.prototype.__len__ = function() {
    return this.length;
};

Array.prototype.__repr__ = function() {
    return '[' + (', ').join(this.map(function(k){return repr(k);})) + ']';
};


Array.prototype.append = Array.prototype.push;

Array.prototype.__iter__ = function() {
    this._index = 0;
    this._len = this.__len__();
    return this;
};

Array.prototype.next = function() {
    if (this._index < this._len) {
        var val = this[this._index];
        this._index += 1;
        return val;
    }
    throw new StopIteration();
};

Array.prototype.equals = function(/*Array*/ a) {
    if (a === null || a.__class__ !== 'Array' || this.__len__() !== a.__len__()) {
        return false;
    }
    var same = true;
    this.iter(function(i, idx) {
        same = equal(i, a[idx]);
        if (!same) {
            throw new StopIteration();
        }
    });
    return same;
};


Array.prototype.extend = function(/*Array*/ a) {
    a.iter(function(i) {this.append(i);}, this);
};
