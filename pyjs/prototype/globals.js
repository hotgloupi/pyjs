

function isinstance(obj, _class) {
    return obj.__class__ === _class.prototype.__class__;
}

var isObject = function(o) {
    return (typeof o !== "undefined" && o !== null);
};

function equal(a, b) {
    if (isObject(a) && isObject(b)) {
        return a.equals(b);
    } else if (!isObject(a) && !isObject(b)) {
        return a === b;
    } else {return false;}
}

function len(obj) {return obj.__len__();}
function iter(obj) {return obj.__iter__();}
function str(obj) {return isObject(obj)?obj.__str__():obj;}
function repr(obj) {
    if (!isObject(obj)){return null;}
    return obj.__repr__();
}
function nothing(){}

