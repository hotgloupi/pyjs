

Error.prototype.__class__ = 'Error';

Error.prototype.__init__ = function() {
    console.error(this.__class__+':', this.message);
};


