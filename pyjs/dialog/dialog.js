/**
 * @fileOverview base class for dialogs
 * @author <a href="mailto:raphael.londeix@gmail.com"> Raphaël Londeix </a>
 * @version 0.1
 */

/**
 * Dialog classes namespaces
 * @namespace
 * @name py.dialog
 */


/** @class */
py.declare('py.dialog.Dialog', null, {
    /** @lends py.dialog.Dialog.prototype */

    // container node
    _node: null,

    // inside node
    _content_node: null,

    /**
     * max width ratio
     * @private
     */
    _max_width: 0.95,

    /**
     * max height ratio
     * @private
     */
    _max_height: 0.85,

    _is_shown: false,

    _args: null,

    // handlers
    _resize_hdlr: null,
    _scroll_hdlr: null,

    /**
     * Base dialog class
     * @constructs
     */
    __init__: function __init__(args) {
        this._node = $c('div', {"class": "pyDialog pyDialogContainer pyDialogContent"});
        py.body.appendChild(this._node);
        this._args = args || {};
        this._initNode();
        this._resize_hdlr = py.subscribe('py/window/resize', this, this._refresh);
        this._scroll_hdlr = py.subscribe('py/window/scroll', this, this._refresh);
    },

    _setContent: function _setContent() {
        if (py.notNone(this._args.content)) {
            this._node.attr('content', this._args.content);
        }
    },

    _initNode: function _initNode() {
        this._node.setStyles({
            'z-index': '100',
            'position': 'absolute',
            'top': '-9999px',
            'left': '-9999px',
            'border': '1px solid black',
            'overflow': 'auto'
        });
        this._setContent();
    },

    _refresh: function _refresh() {
        if (!this._is_shown) {
            return ;
        }

        this._node.setStyles({
            'top': '-9999px',
            'left': '-99990px',
            'width': '',
            'height': ''
        });

        var vp = py.browser.getViewport(),
            max_width = vp.w * this._max_width,
            max_height = vp.h * this._max_height;

        if (this._node.offsetHeight > max_height) {
            this._node.setStyle('height', max_height + 'px');
        }

        if (this._node.offsetWidth > max_width) {
            this._node.setStyle('width', max_width + 'px');
        }

        var l = vp.w / 2 - this._node.offsetWidth / 2,
            t = vp.h / 2 - this._node.offsetHeight / 2;
        this._node.setStyles({
            'top': vp.t + t + 'px',
            'left': vp.l + l + 'px'
        });
    },

    /**
     * show the popup
     */
    show: function show() {
        if (this._is_shown === true) {
            return ;
        }
        this._is_shown = true;
        this._refresh();
    },

    /**
     * hide the popup
     */
    hide: function hide() {
        if (this._is_shown === false) {
            return ;
        }
        this._is_shown = false;
        this._node.setStyles({
            'top': '-9999px',
            'left': '-99990px'
        });
    },

    /**
     * destroy the popup
     */
    destroy: function destroy() {
        this.hide();
        py.unsubscribe(this._resize_hdlr);
        py.unsubscribe(this._scroll_hdlr);
        py.dom.destroyElement(this._node);
    }

});
