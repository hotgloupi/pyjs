
$ = function $(id) {return document.getElementById(id);};
$$ = function $$(selectors, ref) {return py.dom.query(selectors, ref);};
$c = function $c(tag){return document.createElement(tag);};
$t = function $t(){return document.createTextNode(arguments);};

