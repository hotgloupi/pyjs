String.prototype.__class__ = 'String';

String.prototype.__str__ = function() {
    return this.toString();
}

String.prototype.__repr__ = function() {
    return '"' + this.replace('\\', '\\\\', 'g').replace('"', '\\"', 'g') +  '"';
};

String.prototype.equals = function(s) {
    return s !== null &&
           s.__class__ === 'String' &&
           this.toString() === s.toString();
};

String.prototype.join = function(/*Array*/ a) {
    return a.join(this);
};
