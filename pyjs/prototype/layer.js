
(function(){

	var modules = [
		'object',
		'array',
		'string',
		'number',
		'error',
		'function',
        'globals'
	]

	for (var i=0, l=modules.length; i<l; i++) {
		py.import('py.prototype.'+modules[i]);
	}

})();
