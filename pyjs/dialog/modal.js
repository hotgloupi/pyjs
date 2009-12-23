/**
 * @fileOverview base class for dialogs
 * @author <a href="mailto:raphael.londeix@gmail.com"> Raphaël Londeix </a>
 * @version 0.1
 */


py.importModule('py.dialog.dialog');

/** @class */
py.declare('py.dialog.Modal', [py.dialog.Dialog], {
    /** @lends py.dialog.Modal.prototype */

    _cancel_str: "Cancel",
    _validate_str: "OK",

    _toolbar_node: null,
    _validate_button: null,
    _cancel_button: null,

    /** @constructs */
    __init__: function __init__(args) {
        //<debug
        py.raiseNone(args);
        if (py.isNone(args.onValidate) || !py.isinstance(args.onValidate, Function)) {
            throw TypeError("you must give a function onValidate");
        }
        //debug>
        this.onValidate = args.onValidate;
        this._content_node = $c('div', {"class": "pyDialogContent"});
        this.$super(arguments);
        this._node.appendChild(this._content_node);
        this._node.removeClass("pyDialogContent");
        this._toolbar_node = $c('div', {"class": "pyDialogToolbar"});
        this._cancel_button = $c('button', {
            'class': 'pyDialogButton pyDialogCancelButton',
            'content': this._cancel_str
        });
        this._validate_button = $c('button', {
            'class': 'pyDialogButton pyDialogValidateButton',
            'content': this._validate_str
        });
        this._toolbar_node.appendChild(this._cancel_button);
        this._toolbar_node.appendChild(this._validate_button);
        this._node.appendChild(this._toolbar_node);
        this._cancel_button.connect('onclick', this._onCancel.bind(this));
        this._validate_button.connect('onclick', this._onValidate.bind(this));
    },

    _onValidate: function() {
        this.hide();
        this.onValidate();
    },

    onValidate: function () {
        warn('onValidate should be overrided');
    },

    _onCancel: function () {
        this.hide();
        this.onCancel();
    },

    onCancel: function () {},

    _setContent: function _setContent() {
        if (py.notNone(this._args.content)) {
            this._content_node.attr('content', this._args.content);
        }

    }
});
