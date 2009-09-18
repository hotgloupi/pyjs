/**
 * @fileOverview Separate query function for modularity. Use of Dean Edwards css query
 */

/**
 * Querying dom for nodes with CSS2 selectors.
 * Originaly written by Dean Edwards, rewritten with PyJS syntax.
 * @param {String} selectors (separated by comma)
 * @param {Element|Element[]|String|String[]} [ref] reference(s) node(s)
 * @returns {Array} arrays of selected nodes (possibly empty)
 * @see <a href="http://dean.edwards.name/my/cssQuery">Dean Edwards cssQuery</a>
 * @version 2.0.3
 * @methodOf py.dom
 */
py.dom.query = function() {

var version = "2.0.3";

// set this flag if you want to assume that HTML id's are unique
cssQuery.uniqueIds = true;
// set this flag if you want to cache results. If you modify the DOM
//  you should reset the cache by calling cssQuery.clearCache()
cssQuery.caching = false;

// -----------------------------------------------------------------------
// main query function
// -----------------------------------------------------------------------

var $COMMA = /\s*,\s*/;
function cssQuery($selector, $$from) {
try {
    var $base;
    if (py.isNone($$from)) {
        $base = [document];
    } else if (py.isinstance($$from, Element)) {
        $base = [$$from];
    } else if (py.isinstance($$from, String)) {
        $base = [document.getElementById($$from)];
    } else if (py.isinstance($$from, Array)) {
        $base = $$from.map(function(item) {
            return py.isinstance(item, String) ? document.getElementById(item) : item;
        });
    }
	var $match = [];
	var $useCache = cssQuery.caching && !$$from;
	// process comma separated selectors
	var $$selectors = parseSelector($selector).split($COMMA), i;
	for (i = 0; i < $$selectors.length; i++) {
		// convert the selector to a stream
		$selector = _toStream($$selectors[i]);
		$$from = $base;
		// faster chop if it starts with "#" (getElementById)
		if ($selector.slice(0, 3).join("") == " *#") {
			var id = $selector[3];
			if (cssQuery.uniqueIds && $base.length == 1 && $base[0].getElementById) {
				$$from = [$base[0].getElementById(id)];
				$selector = $selector.slice(4);
			} else if (isMSIE) {
				$$from = _msie_selectById([], $base, id);
				$selector = $selector.slice(4);
			}
		}
		// process the stream
		var j = 0, $token, $filter, $arguments, $cacheSelector = "";
		while (j < $selector.length) {
			$token = $selector[j++];
			$filter = $selector[j++];
			$cacheSelector += $token + $filter;
			// some pseudo-classes allow arguments to be passed
			//  e.g. nth-child(even)
			$arguments = "";
			if ($selector[j] == "(") {
				while ($selector[j++] != ")" && j < $selector.length) {
					$arguments += $selector[j];
				}
				$arguments = $arguments.slice(0, -1);
				$cacheSelector += "(" + $arguments + ")";
			}
			// process a token/filter pair use cached results if possible
			$$from = ($useCache && cache[$cacheSelector]) ?
				cache[$cacheSelector] : select($$from, $token, $filter, $arguments);
			if ($useCache) cache[$cacheSelector] = $$from;
		}
		$match = $match.concat($$from);
	}
	delete cssQuery.error;
	return $match;
} catch ($error) {
	cssQuery.error = $error;
	return [];
}};

// -----------------------------------------------------------------------
// public interface
// -----------------------------------------------------------------------

cssQuery.toString = function() {
	return "function cssQuery() {\n  [version " + version + "]\n}";
};

// caching
var cache = {};
cssQuery.clearCache = function($selector) {
	if ($selector) {
		$selector = _toStream($selector).join("");
		delete cache[$selector];
	} else cache = {};
};

// allow extensions
var modules = {};
var loaded = false;
cssQuery.addModule = function($name, $script) {
	if (loaded) eval("$script=" + String($script));
	modules[$name] = new $script();;
};

// hackery
cssQuery.valueOf = function($code) {
	return $code ? eval($code) : this;
};

// -----------------------------------------------------------------------
// declarations
// -----------------------------------------------------------------------

var selectors = {};
var pseudoClasses = {};
// a safari bug means that these have to be declared here
var AttributeSelector = {match: /\[([\w-]+(\|[\w-]+)?)\s*(\W?=)?\s*([^\]]*)\]/};
var attributeSelectors = [];

// -----------------------------------------------------------------------
// selectors
// -----------------------------------------------------------------------

// descendant selector
selectors[" "] = function($results, $from, $tagName, $namespace) {
	// loop through current selection
	var $element, i, j;
	for (i = 0; i < $from.length; i++) {
		// get descendants
		var $subset = getElementsByTagName($from[i], $tagName, $namespace);
		// loop through descendants and add to results selection
		for (j = 0; ($element = $subset[j]); j++) {
			if (thisElement($element) && compareNamespace($element, $namespace))
				$results.append($element);
		}
	}
};

// ID selector
selectors["#"] = function($results, $from, $id) {
	// loop through current selection and check ID
	var $element, j;
	for (j = 0; ($element = $from[j]); j++)
		if ($element.id == $id) $results.append($element);
};

// class selector
selectors["."] = function($results, $from, $className) {
	// create a RegExp version of the class
	$className = new RegExp("(^|\\s)" + $className + "(\\s|$)");
	// loop through current selection and check class
	var $element, i;
	for (i = 0; ($element = $from[i]); i++)
		if ($className.test($element.className)) $results.append($element);
};

// pseudo-class selector
selectors[":"] = function($results, $from, $pseudoClass, $arguments) {
	// retrieve the cssQuery pseudo-class function
	var $test = pseudoClasses[$pseudoClass], $element, i;
	// loop through current selection and apply pseudo-class filter
	if ($test) for (i = 0; ($element = $from[i]); i++)
		// if the cssQuery pseudo-class function returns "true" add the element
		if ($test($element, $arguments)) $results.append($element);
};

// -----------------------------------------------------------------------
// pseudo-classes
// -----------------------------------------------------------------------

pseudoClasses["link"] = function($element) {
	var $links = getDocument($element).links;
	if ($links) for (var i = 0; i < $links.length; i++) {
		if ($links[i] == $element) return true;
	}
};

pseudoClasses["visited"] = function($element) {
	// can't do this without jiggery-pokery
};

// -----------------------------------------------------------------------
// DOM traversal
// -----------------------------------------------------------------------

// IE5/6 includes comments (LOL) in it's elements collections.
// so we have to check for this. the test is tagName != "!". LOL (again).
var thisElement = function($element) {
	return ($element && $element.nodeType == 1 && $element.tagName != "!") ? $element : null;
};

// return the previous element to the supplied element
//  previousSibling is not good enough as it might return a text or comment node
var previousElementSibling = function($element) {
	while ($element && ($element = $element.previousSibling) && !thisElement($element)) continue;
	return $element;
};

// return the next element to the supplied element
var nextElementSibling = function($element) {
	while ($element && ($element = $element.nextSibling) && !thisElement($element)) continue;
	return $element;
};

// return the first child ELEMENT of an element
//  NOT the first child node (though they may be the same thing)
var firstElementChild = function($element) {
	return thisElement($element.firstChild) || nextElementSibling($element.firstChild);
};

var lastElementChild = function($element) {
	return thisElement($element.lastChild) || previousElementSibling($element.lastChild);
};

// return child elements of an element (not child nodes)
var childElements = function($element) {
	var $childElements = [];
	$element = firstElementChild($element);
	while ($element) {
		$childElements.append($element);
		$element = nextElementSibling($element);
	}
	return $childElements;
};

// -----------------------------------------------------------------------
// browser compatibility
// -----------------------------------------------------------------------

// all of the functions in this section can be overwritten. the default
//  configuration is for IE. The functions below reflect this. standard
//  methods are included in a separate module. It would probably be better
//  the other way round of course but this makes it easier to keep IE7 trim.

var isMSIE = true;

var isXML = function($element) {
	return !getDocument($element).write;
};

// return the element's containing document
var getDocument = function($node) {
	return $node.ownerDocument || $node.document || $node;
};

var getElementsByTagName = function($node, $tagName, $namespace) {
	if (isXML($node) && $namespace) $tagName = $namespace + ":" + $tagName;
	return ($tagName == "*" && $node.all) ? $node.all : $node.getElementsByTagName($tagName);
};

var compareTagName = function($element, $tagName, $namespace) {
	if ($tagName == "*") return thisElement($element);
	if (!compareNamespace($element, $namespace)) return false;
	if (!isXML($element)) $tagName = $tagName.toUpperCase();
	return $element.tagName == $tagName;
};

var compareNamespace = function($element, $namespace) {
	if (isXML($element)) return true;
	return !$namespace || ($namespace == "*") || ($element.scopeName == $namespace);
};

var getTextContent = function($element) {
	return $element.innerText;
};

function _msie_selectById($results, $from, id) {
	var $match, i, j;
	for (i = 0; i < $from.length; i++) {
		if ($match = $from[i].all.item(id)) {
			if ($match.id == id) $results.append($match);
			else if ($match.length != null) {
				for (j = 0; j < $match.length; j++) {
					if ($match[j].id == id) $results.append($match[j]);
				}
			}
		}
	}
	return $results;
};


// -----------------------------------------------------------------------
// query support
// -----------------------------------------------------------------------

// select a set of matching elements.
// "from" is an array of elements.
// "token" is a character representing the type of filter
//  e.g. ">" means child selector
// "filter" represents the tag name, id or class name that is being selected
// the function returns an array of matching elements
var $NAMESPACE = /\|/;
function select($$from, $token, $filter, $arguments) {
	if ($NAMESPACE.test($filter)) {
		$filter = $filter.split($NAMESPACE);
		$arguments = $filter[0];
		$filter = $filter[1];
	}
	var $results = [];
	if (selectors[$token]) {
		selectors[$token]($results, $$from, $filter, $arguments);
	}
	return $results;
};

// -----------------------------------------------------------------------
// parsing
// -----------------------------------------------------------------------

// convert css selectors to a stream of tokens and filters
//  it's not a real stream. it's just an array of strings.
var STANDARD_SELECT = /^[^\s>+~]/;
var STREAM = /[\s#.:>+~()@]|[^\s#.:>+~()@]+/g;
function _toStream($selector) {
	if (STANDARD_SELECT.test($selector)) $selector = " " + $selector;
	return $selector.match(STREAM) || [];
};

var WHITESPACE = /\s*([\s>+~(),]|^|$)\s*/g;
var IMPLIED_ALL = /([\s>+~,]|[^(]\+|^)([#.:@])/g;
var parseSelector = function($selector) {
	return $selector
	// trim whitespace
	.replace(WHITESPACE, "$1")
	// e.g. ".class1" --> "*.class1"
	.replace(IMPLIED_ALL, "$1*$2");
};

var Quote = {
	toString: function() {return "'"},
	match: /^('[^']*')|("[^"]*")$/,
	test: function($string) {
		return this.match.test($string);
	},
	add: function($string) {
		return this.test($string) ? $string : this + $string + this;
	},
	remove: function($string) {
		return this.test($string) ? $string.slice(1, -1) : $string;
	}
};

var getText = function($text) {
	return Quote.remove($text);
};

var $ESCAPE = /([\/()[\]?{}|*+-])/g;
function regEscape($string) {
	return $string.replace($ESCAPE, "\\$1");
};

// -----------------------------------------------------------------------
// modules
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// selectors
// -----------------------------------------------------------------------

// child selector
selectors[">"] = function($results, $from, $tagName, $namespace) {
	var $element, i, j;
	for (i = 0; i < $from.length; i++) {
		var $subset = childElements($from[i]);
		for (j = 0; ($element = $subset[j]); j++)
			if (compareTagName($element, $tagName, $namespace))
				$results.push($element);
	}
};

// sibling selector
selectors["+"] = function($results, $from, $tagName, $namespace) {
	for (var i = 0; i < $from.length; i++) {
		var $element = nextElementSibling($from[i]);
		if ($element && compareTagName($element, $tagName, $namespace))
			$results.push($element);
	}
};

// attribute selector
selectors["@"] = function($results, $from, $attributeSelectorID) {
	var $test = attributeSelectors[$attributeSelectorID].test;
	var $element, i;
	for (i = 0; ($element = $from[i]); i++)
		if ($test($element)) $results.push($element);
};

// -----------------------------------------------------------------------
// pseudo-classes
// -----------------------------------------------------------------------

pseudoClasses["first-child"] = function($element) {
	return !previousElementSibling($element);
};

pseudoClasses["lang"] = function($element, $code) {
	$code = new RegExp("^" + $code, "i");
	while ($element && !$element.getAttribute("lang")) $element = $element.parentNode;
	return $element && $code.test($element.getAttribute("lang"));
};

// -----------------------------------------------------------------------
//  attribute selectors
// -----------------------------------------------------------------------

// constants
AttributeSelector.NS_IE = /\\:/g;
AttributeSelector.PREFIX = "@";
// properties
AttributeSelector.tests = {};
// methods
AttributeSelector.replace = function($match, $attribute, $namespace, $compare, $value) {
	var $key = this.PREFIX + $match;
	if (!attributeSelectors[$key]) {
		$attribute = this.create($attribute, $compare || "", $value || "");
		// store the selector
		attributeSelectors[$key] = $attribute;
		attributeSelectors.push($attribute);
	}
	return attributeSelectors[$key].id;
};
AttributeSelector.parse = function($selector) {
	$selector = $selector.replace(this.NS_IE, "|");
	var $match;
	while ($match = $selector.match(this.match)) {
		var $replace = this.replace($match[0], $match[1], $match[2], $match[3], $match[4]);
		$selector = $selector.replace(this.match, $replace);
	}
	return $selector;
};
AttributeSelector.create = function($propertyName, $test, $value) {
	var $attributeSelector = {};
	$attributeSelector.id = this.PREFIX + attributeSelectors.length;
	$attributeSelector.name = $propertyName;
	$test = this.tests[$test];
	$test = $test ? $test(this.getAttribute($propertyName), getText($value)) : false;
	$attributeSelector.test = new Function("e", "return " + $test);
	return $attributeSelector;
};
AttributeSelector.getAttribute = function($name) {
	switch ($name.toLowerCase()) {
		case "id":
			return "e.id";
		case "class":
			return "e.className";
		case "for":
			return "e.htmlFor";
		case "href":
			// http://www.glennjones.net/Post/809/getAttributehrefbug.htm
			return "e.getAttribute('href',2)";
	}
	return "e.getAttribute('" + $name.replace($NAMESPACE, ":") + "')";
};

// -----------------------------------------------------------------------
//  attribute selector tests
// -----------------------------------------------------------------------

AttributeSelector.tests[""] = function($attribute) {
	return $attribute;
};

AttributeSelector.tests["="] = function($attribute, $value) {
	return $attribute + "==" + Quote.add($value);
};

AttributeSelector.tests["~="] = function($attribute, $value) {
	return "/(^| )" + regEscape($value) + "( |$)/.test(" + $attribute + ")";
};

AttributeSelector.tests["|="] = function($attribute, $value) {
	return "/^" + regEscape($value) + "(-|$)/.test(" + $attribute + ")";
};

// -----------------------------------------------------------------------
//  parsing
// -----------------------------------------------------------------------

// override parseSelector to parse out attribute selectors
var _parseSelector = parseSelector;
parseSelector = function($selector) {
	return _parseSelector(AttributeSelector.parse($selector));
};

// -------- >>      insert modules here for packaging       << -------- \\

loaded = true;

// -----------------------------------------------------------------------
// implement the W3C's Selectors API
// -----------------------------------------------------------------------

var $document = (typeof Document == "function") ? Document.prototype : document;

$document.matchAll = function(selectors) {
	return cssQuery(selectors, [this]);
};

$document.match = function(selectors) {
	return this.matchAll(selectors)[0];
};

// -----------------------------------------------------------------------
// return the query function
// -----------------------------------------------------------------------

return cssQuery;

}(); // cssQuery
