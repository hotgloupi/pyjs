declareFromBuiltin('UserError', Error, {
    message: 'High level error',
    __init__: function(msg) {
        this.message += ' : ' + py.str(msg);
    }
});
declareFromBuiltin('StopIteration', RangeError, {__init__: py.nothing});
declareFromBuiltin('AttributeError', ReferenceError, {message: 'Attribute not found'});
declareFromBuiltin('KeyError', UserError, {message: 'Key not found'});
declareFromBuiltin('ValueError', ReferenceError, {message: 'Value not allowed'});
