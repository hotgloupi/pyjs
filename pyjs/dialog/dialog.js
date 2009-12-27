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

    _titlebar_node: null,
    _title_node: null,
    _close_button: null,

    //iframe bg
    _iframe_node: null,

    _content_loaded: false,

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

    template: '<div class="pyDialogTitleBar">'+
                '<span class="pyDialogTitle"></span>'+
                '<span class="pyDialogCloseButton">X</span>'+
              '</div>'+
              '<div class="pyDialogContent" style="overflow: auto"></div>',

    /**
     * Base dialog class
     * @param {Object} args Constructs arguments
     * @param {String} [args.title] Popup title
     * @param {String} args.content Popup content
     * @param {Function} [args.onCancel] function to call when close popup
     * @constructs
     */
    __init__: function __init__(args) {
        this._node = $c('div', {"class": "pyDialog pyDialogContainer"});
        py.body.appendChild(this._node);
        this._node.innerHTML = this.template;
        this._content_node = this._node.query('div.pyDialogContent')[0];
        this._titlebar_node = this._node.query('div.pyDialogTitleBar')[0];
        this._title_node = this._node.query('span.pyDialogTitle')[0];
        this._close_button = this._node.query('span.pyDialogCloseButton')[0];
        this._args = args || {};
        this._initNode();
        this._createIframe();
        this._resize_hdlr = py.subscribe('py/window/resize', this, this._refresh);
        this._scroll_hdlr = py.subscribe('py/window/scroll', this, this._refresh);
        this._close_hdlr = this._close_button.connect('click', this._onCancel.bind(this));
    },

    _setContent: function _setContent() {
        if (py.notNone(this._args.content)) {
            this._content_node.attr('content', this._args.content);
        }
        this._content_loaded = true;
        this._refresh();
    },

    _initNode: function _initNode() {
        this._node.setStyles({
            'z-index': '100',
            'position': 'absolute',
            'top': '-9999px',
            'left': '-9999px',
            'width': '0px',
            'height': '0px',
            'border': '1px solid black',
            'overflow': 'auto',
            'background-color': 'white'
        });
        this._setContent();
        if (py.notNone(this._args.title)) {
            this._title_node.attr('content', this._args.title);
        }
    },

    _createIframe: function() {
        this._iframe_node = $c('iframe');
        this._iframe_node.setStyles({
            'display': 'none',
            border: 'none',
            position: 'absolute',
            'z-index': '99',
            width: '100%',
            height: '100%',
            'top': '0px',
            'left': '0px',
            'background-color': 'black',
            'opacity': '0.5'
        });
        py.body.appendChild(this._iframe_node);
    },

    _refresh: function _refresh() {
        if (this._is_shown == false) {
            return ;
        }

        this._node.setStyles({
            'top': '-9999px',
            'left': '-9999px',
            'width': '',
            'height': ''
        });
        var vp = py.browser.getViewport(),
            max_width = vp.w * this._max_width,
            max_height = vp.h * this._max_height;
        if (this._node.offsetHeight > max_height) {
            this._node.setStyle('height', max_height + 'px');
            max_width += 18;
            this._node.setStyle('width', this._node.offsetWidth + 18 + 'px')
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

    _onCancel: function _onCancel() {
        this.hide();
        if (py.notNone(this._args.onClose)) {
            this._args.onClose.call(this);
        }
    },

    /**
     * show the popup
     */
    show: function show() {
        if (this._is_shown === true) {
            return ;
        }
        this._is_shown = true;
        this._iframe_node.setStyle('display', '');
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
        this._iframe_node.setStyle('display', 'none');
    },

    /**
     * destroy the popup
     */
    destroy: function destroy() {
        this.hide();
        py.unsubscribe(this._resize_hdlr);
        py.unsubscribe(this._scroll_hdlr);
        log('>');
        this._close_button.disconnect(this._close_hdlr);
        log('<');
        py.dom.destroyElement(this._node);
        py.dom.destroyElement(this._iframe_node);
    }

});

