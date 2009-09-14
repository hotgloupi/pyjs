
var a = null;

function setUp() {
    a = {
        member: 'normal'
    };
}

function base() {
    assert('__class__' in a);
    assertFalse(a.hasOwnProperty('__class__'));
    assert(a.__class__ === 'Object');
    assert(py.isinstance(a, Object));
}

function repr() {
    var r = '{"member": "normal"}',
        s = '<Class Object ('+r+')>';
    assert('__repr__', r === a.__repr__());
    assert('py.repr', r === py.repr(a));
    assert('__str__',  s === a.__str__());
    assert('py.str', s === py.str(a));
}

function iter() {
    var r = a.__iter__();
    assert('__iter__', typeof r !== "undefined");
    assert('len', r.length === 1);
    assert('key', r[0] === 'member');
    var pass = false;
    a.iter(function() {pass = true;});
    assert('iter()', pass);
    a.iter(function(k) {pass = k;});
    assert('iter() key', pass === 'member');
    a.iter(function(k, idx) {pass = idx;});
    assert('iter() idx', pass === 0);
    pass = {};
    a.iter(function(k, idx) {this.passed = k}, pass);
    assert('iter() scope', pass.passed === 'member');
}

function tearDown() {
    a = null;
}
