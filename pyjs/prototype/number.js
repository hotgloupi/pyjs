

Number.prototype.__class__ = 'Number';

Number.prototype.equals = function(n) {
    return n !== null &&  n.__class__ == 'Number' && (this+0 === n+0);
};

Number.prototype.__repr__ = function() {
    if (this.isIn([NaN, Infinity, -Infinity])) {
        return null;
    }
    return this;
};
