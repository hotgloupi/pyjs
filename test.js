if(typeof console !== "undefined") {
    log = function(){console.log.apply(console, arguments);};
} else {
    log = function(){};
}
nothing = function(){};

declareClass('UserError', Error, {
    message: 'High level error',
    __init__: function(msg) {
        this.message += ' : ' + str(msg);
    }
});
declareClass('StopIteration', RangeError, {__init__: nothing});
declareClass('AttributeError', ReferenceError, {message: 'Attribute not found'});
declareClass('KeyError', UserError, {message: 'Key not found'});
declareClass('ValueError', ReferenceError, {message: 'Value not allowed'});



A = declare('A', null, {pif: function(){log('pif de A');}});
B = declare('B', null, {paf: function(){log('paf de B');}});
C = declare('C', [A,B], {paf: function(){log('paf de C');}, pif: function(){this.inherited();log('pif de C');}});
AC = declare('AC', [A, C], {pif: function(){this.inherited(); log('pif de AC');}});
c = new C();

