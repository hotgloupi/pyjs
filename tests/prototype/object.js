
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

function iteritems() {
    var s;
    a.iteritems(function(k,v) {s = v});
    assert(s === 'normal');
}

function itervalues() {
    var s;
    a.itervalues(function(v) { s  = v});
    assert(s === 'normal');
}

function keys() {
    var v = a.keys();
    assert(v.length === 1);
    assert(v[0] === 'member');
}

function values() {
    var v = a.values();
    assert(v.length === 1);
    assert(v[0] === 'normal');
}

function items() {
    var v = a.items();
    assert(v.length === 1);
    assert(v[0][0] === 'member');
    assert(v[0][1] === 'normal');
}

function equals() {
    var b = {
        member: 'normal'
    };
    assertTrue(a.equals(b));
    assertFalse(a.equals(null));
    assertFalse(a.equals({}));
    assertFalse(a.equals([]));
    assertFalse(a.equals(""));
}

function isIn() {
    assertTrue(('member').isIn(a));
    assertTrue('member'.isIn(a));
    assertTrue('member'.isIn(a.keys()));
    assertTrue('normal'.isIn(a.values()));
}

function contains() {
    assertTrue(a.contains('member'));
    assertFalse(a.contains('pif'));
}

function any() {
    var b = {
        key1: 1,
        key2: 2,
        foo: 'bar'
    };
    assertTrue(b.any(function(k) {
        return k === 'foo';
    }));

    assertTrue(b.any(function(k) {
        return k.length === 3;
    }));
    assertTrue(b.any(function(k) {
        return k.length === 4;
    }));

    assertFalse(b.any(function(k) {
        return k.length === 5;
    }));
    assertFalse(b.any(function(k) {
        return k === 'pif';
    }));
}

function all() {
    var b = {
        key1: 1,
        key2: 2,
        foo: 'bar'
    };
    assertTrue(b.all(function(k) {
        return k.length < 5;
    }));

    assertFalse(b.all(function(k) {
        return k.length === 4;
    }));
}

function update() {
    var b = {};
    b.update(a);
    assert(typeof b.member !== "undefined");
    assert(b.member === 'normal');
    assert(b.keys().length === 1);
    assert(a.keys().length === 1);
    assert(a.equals(b));
    assert(b.equals(a));
}

function tearDown() {
    a = null;
}
