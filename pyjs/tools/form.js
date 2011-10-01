
py.extendNamespace('py.tools.form', {
    serialize: function serialize(form) {
        if (py.isinstance(form, String)) {
            form = $(form);
        }
        //<debug
        py.raiseNone(form);
        //debug>
        var i, l, res = {};
        for (i = 0, l = form.elements.length; i < l; i++) {
            var e = form.elements[i];
            if (e.type.lower() === 'checkbox') {
                if (e.checked) {
                    res[e.name] = 'checked';
                }
            } else {
                res[e.name] = e.value;
            }
        }
        return res;
    },
});
