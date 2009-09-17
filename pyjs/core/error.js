py.declareFromBuiltin('UserError', Error, {
    message: 'High level error',
    __init__: function(msg) {
        this.message += ' : ' + py.str(msg);
    }
});
py.declareFromBuiltin('StopIteration', RangeError, {__init__: py.nothing});
py.declareFromBuiltin('AttributeError', ReferenceError, {message: 'Attribute not found'});
py.declareFromBuiltin('KeyError', UserError, {message: 'Key not found'});
py.declareFromBuiltin('ValueError', ReferenceError, {message: 'Value not allowed'});
