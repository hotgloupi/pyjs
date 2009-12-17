
function range(len) {
    var res = [];
    for (var i=0; i <len; i++) {
        res[i] = i;
    }
    return res;
}
var a, b, c;
function setUp() {
    a = range(1000);
    b = [];
    c = ['pif', 'pouf'];
}


function instance() {
    assert(py.isinstance(a, Array));
    assert(py.isinstance(b, Array));
    assert(py.isinstance(c, Array));
}

function len() {
    assert(py.len(a) === 1000);
    assert(py.len(b) === 0);
    assert(py.len(c) === 2);
}

function repr() {
    assert(py.repr(b) === "[]");
    assert(py.repr(c) === '["pif", "pouf"]');
}

function append() {
    b.append('pif');
    assert(b[0] === 'pif');
    assert(b.append('paf') === 2);
    b.append('pif', 'paf', 'pouf');
    assert(b.length === 5);
    b = [];
}

function first() {
    assert(a[0] === a.first());
    assert(c[0] === c.first());
}

function last() {
    assert(a[999] === a.last());
    assert(c[1] === c.last());
}

function extend() {
    b.extend([1,2,3,4,5,6]);
    assert(b.length === 6);
    assert(b.equals([1,2,3,4,5,6]));
    b = [];
}

function all() {
    assert(a.all(function(i) {return true;}));
    assert(a.all(function(i){return i<1000;}));
    assertFalse(a.all(function(i) {return i<999;}));
}

function any() {
    assert(a.any(function(i) {return i===999;}));
    assert(a.any(function(i) {return i===0;}));
    assertFalse(a.any(function(i) {return i === 'foo';}));
}

function map() {
    var cbis = c.map(function(i){return i;}),
        only1 = a.map(function(i) {return i>0?i/i: 1;});
    assert(cbis.equals(c));
    assert(cbis.map(function(i) {return '_'+i+'_';})[0] === '_pif_' );
    assert(only1.all(function(i){return i===1;}))
}

function filter() {
    var a1 = a.filter(function(i) {return i===999;}),
        a1000 = a.filter(function(i) {return i<1000;}),
        a500 = a.filter(function(i) {return i<500;});
    assert( a1.length === 1 );
    assert( a1000.equals(a) );
    assert( a500.length===500 );
}

function tearDown() {
    a=b=c=null;
}
