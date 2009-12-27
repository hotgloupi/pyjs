

var ns;

function setUp() {
  ns = {};
}

function simple() {
  py.declare('ns.A', null, {});
  var a = new ns.A();
  assert(py.isinstance(a, ns.A));
  ns.A = null;
}

function init() {
  py.declare('ns.A', null, {
    m: false,
    __init__: function() {
      this.m = true;
    }
  });
  var a = new ns.A();
  assert(ns.A.prototype.m === false);
  assert(a.m === true);
  ns.A = null;
}


function initParam() {
  py.declare('ns.A', null, {
    m: null,
    __init__: function(val) {
      this.m = val;
    }
  });
  var a = new ns.A(42);
  assert(ns.A.prototype.m === null);
  assert(a.m === 42);
  ns.A = null;
}

function override() {
  py.declare('ns.A', null, {
    m: 0,
    __init__: function() {
      this.m = 1;
    }
  });
  py.declare('ns.B', null, {
    __init__: function() {
      this.m = 2;
    }
  });
  var b = new ns.B();
  assert(b.m === 2);
  ns.A = null;
  ns.B = null;
}

function inherit() {
  py.declare('ns.A', null, {
    m: 0,
    add: function() {
      this.m += 1;
    }
  });
  py.declare('ns.B', [ns.A], {
    sub: function() {
      this.m -= 1;
    }
  });
  var b = new ns.B();
  assert(b.m === 0);
  b.add();
  assert(b.m === 1);
  b.sub();
  assert(b.m === 0);
  ns.A = null;
  ns.B = null;
}

function simpleInheritance1() {
  py.declare('ns.A', null, {
    m: 0,
    add: function() {
      this.m += 1;
    }
  });
  py.declare('ns.B', [ns.A], {
    add: function() {
      this.$super(arguments);
    }
  });
  var b = new ns.B();
  assert(b.m === 0);
  b.add();
  assert(b.m === 1);
  ns.A = null;
  ns.B = null;
}

function simpleInheritance2() {
  py.declare('ns.A', null, {
    m: 0,
    add: function() {
      this.m += 1;
    }
  });
  py.declare('ns.B', [ns.A], {
    add: function() {
      this.$super("add");
    }
  });
  var b = new ns.B();
  assert(b.m === 0);
  b.add();
  assert(b.m === 1);
  ns.A = null;
  ns.B = null;
}

function simpleInheritance3() {
  py.declare('ns.A', null, {
    m: 0,
    add: function(r) {
      this.m += r;
    }
  });
  py.declare('ns.B', [ns.A], {
    add: function(r) {
      this.$super(arguments);
    }
  });
  var b = new ns.B();
  assert(b.m === 0);
  b.add(1);
  assert(b.m === 1);
  ns.A = null;
  ns.B = null;
}

function simpleInheritance4() {
  py.declare('ns.A', null, {
    m: 0,
    add: function(r) {
      this.m += r;
    }
  });
  py.declare('ns.B', [ns.A], {
    add: function(r) {
      this.$super(arguments, [r]);
    }
  });
  var b = new ns.B();
  assert(b.m === 0);
  b.add(1);
  assert(b.m === 1);
  ns.A = null;
  ns.B = null;
}

function simpleInheritance5() {
  py.declare('ns.A', null, {
    m: 0,
    add: function(r) {
      this.m += r;
    }
  });
  py.declare('ns.B', [ns.A], {
    add: function(r) {
      this.$super("add", [r]);
    }
  });
  var b = new ns.B();
  assert(b.m === 0);
  b.add(1);
  assert(b.m === 1);
  ns.A = null;
  ns.B = null;
}


function simpleChainInheritance() {
  py.declare('ns.A', null, {
    m: 0,
    add: function(r) {
      this.m += r;
    }
  });
  py.declare('ns.B', [ns.A], {
    add: function() {
      this.$super(arguments);
    }
  });
  py.declare('ns.C', [ns.B], {
    add: function() {
      this.$super(arguments);
    }
  });
  py.declare('ns.D', [ns.C], {
    add: function() {
      this.$super(arguments);
    }
  });
  py.declare('ns.E', [ns.D], {
    add: function() {
      this.$super(arguments);
    }
  });
  py.declare('ns.F', [ns.E], {
    add: function() {
      this.$super(arguments);
    }
  });
  var f = new ns.F();
  assert(f.m === 0);
  f.add(42);
  assert(f.m === 42);
  f.add(12)
  assert(f.m === 54);
  ns.A = ns.B = ns.C = ns.D = ns.E = ns.F = null;
}


function simpleMultiInheritance() {
  py.declare('ns.A', null, {
    m: 0,
    add: function(r) {
      this.m += r;
    }
  });
  py.declare('ns.B', null, {
    idx: 0,
    count: function() {
      this.idx += 1;
    }
  });
  py.declare('ns.AB', [A, B], {
    add: function(r) {
      this.count();
      this.$super('add', r);
    }
  });
  var ab = new ns.AB();
  ab.add(1);
  ab.add(2);
  ad.add(3);
  assert(ab.m === 6);
  assert(ab.count === 3);
  ns.A = ns.B = ns.AB = null;
}
