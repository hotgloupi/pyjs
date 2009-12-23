/**
 * @fileOverview Browser specific properties and methods. Detection
 *               obtained with <a href="http://www.quirksmode.org/js/detect.html">Paul-Peter Koch</a>
 *               script.
 * @author <a href="mailto:raphael.londeix@gmail.com"> Raphaël Londeix </a>
 * @version 0.1
 */

/**
 * Browser specifics properties and methods
 * @namespace
 * @name py.browser
 */


(function(){

// This script help for detection (actually, it Do the detection)
// http://www.quirksmode.org/js/detect.html
var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent)
            || this.searchVersion(navigator.appVersion)
            || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data) {
        for (var i=0;i<data.length;i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
            else if (dataProp)
                return data[i].identity;
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },
    dataBrowser: [
        {
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        },
        {   string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        },
        {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        },
        {
            prop: window.opera,
            identity: "Opera"
        },
        {
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        },
        {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        },
        {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        },
        {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        },
        {       // for newer Netscapes (6+)
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        },
        {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        },
        {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        },
        {       // for older Netscapes (4-)
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }
    ],
    dataOS : [
        {
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        },
        {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        },
        {
               string: navigator.userAgent,
               subString: "iPhone",
               identity: "iPhone/iPod"
        },
        {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        },
        {
            string: navigator.platform,
            subString: "FreeBSD",
            identity: "FreeBSD"
        }
    ]

};
BrowserDetect.init();

py.browser = {
    /** @lends py.browser */

    /** Name of the browser */
    name: BrowserDetect.browser,

    /** Version of the browser */
    version: BrowserDetect.version,

    /** Operating system detected */
    OS: BrowserDetect.OS
};


BrowserDetect = null;
function useSetGetAttribute(attr) {
    return function(v) {
        if (py.notNone(v)) {this.setAttribute(attr, v);}
        return this.getAttribute(attr);
    };
}

// Assume all attr are lower cased
var attributes_maps = {
    base: {
        'content': 'innerHTML',
        'htmlfor': 'for',
        'class': 'className',
        'style': useSetGetAttribute('style')
    },

    'Explorer': {
        base: {
            'style': useSetGetAttribute('cssText'),
            'name': 'NAME',
            'type': function(v) {
                if (py.isNone(v)) {
                    return this.type;
                }
                //<debug
                if (this.isIn(py.doc.body)) {
                    throw "Cannot set type attribute if the node is in the document";
                }
                //debug>
                /*<debug*/try {/*debug>*/
                    this.type = v;
                /*<debug*/} catch (err) {
                    // in IE, you can set type one time !
                    throw "Cannot change type attribute to "+type;
                }/*debug>*/
            },
            'class': 'className',
            'classname': 'className',
            'for': 'htmlFor',
            'htmlfor': 'htmlFor',
            'readonly': 'readOnly',
            'tabindex': 'tabIndex'
        },

        8: {
            'for': 'for',
            'htmlfor': 'for'
        }
    }
};

// assume all styles are camelCased
var styles_maps = {

};

py.browser.update({

    /** @lends py.browser */

    /**
     * @returns {Number} The viewport width
     */
    getViewportWidth: function() {
        var width = 0;
        if (window.innerWidth) {
            width = window.innerWidth - 18;
        }
        else if (document.documentElement && document.documentElement.clientWidth) {
            width = document.documentElement.clientWidth;
        }
        else if(document.body && document.body.clientWidth) {
            width = document.body.clientWidth;
        }
        return width;
    },

    /**
     * @returns {Number} The viewport height
     */
    getViewportHeight: function() {
        var height = 0;
        if (window.innerHeight) {
            height = window.innerHeight - 18;
        }
        else if (document.documentElement && document.documentElement.clientHeight) {
            height = document.documentElement.clientHeight;
        }
        else if( document.body && document.body.clientHeight ) {
            height = document.body.clientHeight;
        }
        return height;
    },

    /**
     * @returns {Number} The viewport horizontal offset
     */
    getViewportScrollX: function() {
        var scrollX = 0;
        if( document.documentElement && document.documentElement.scrollLeft ) {
            scrollX = document.documentElement.scrollLeft;
        }
        else if( document.body && document.body.scrollLeft ) {
            scrollX = document.body.scrollLeft;
        }
        else if( window.pageXOffset ) {
            scrollX = window.pageXOffset;
        }
        else if( window.scrollX ) {
            scrollX = window.scrollX;
        }
        return scrollX;
    },

    /**
     * @returns {Number} The viewport vertical offset
     */
    getViewportScrollY: function() {
        var scrollY = 0;
        if( document.documentElement && document.documentElement.scrollTop ) {
            scrollY = document.documentElement.scrollTop;
        }
        else if( document.body && document.body.scrollTop ) {
            scrollY = document.body.scrollTop;
        }
        else if( window.pageYOffset ) {
            scrollY = window.pageYOffset;
        }
        else if( window.scrollY ) {
            scrollY = window.scrollY;
        }
        return scrollY;
    },

    /**
     * @returns {Object} The viewport size and offset (properties t, l, w and h)
     */
    getViewport: function() {
        return {
            t: this.getViewportScrollY(),
            l: this.getViewportScrollX(),
            w: this.getViewportWidth(),
            h: this.getViewportHeight()
        };
    },

    getBrowserMapping: function(maps) {
        var _map = {};

        if (maps.base) {
            _map.update(maps.base);
        }
        var ref = maps[this.name];
        if (ref) {
            if (ref.base) {
                _map.update(ref.base);
            }
            ref = ref[this.version];
            if (ref) {
                _map.update(ref);
            }
        }
        return _map;
    },

    /**
     * @returns {Object} Node attributes mapping computed after browser detection
     */
    getAttributesMap: function () {
        return py.browser.getBrowserMapping(attributes_maps);
    },

    /**
     * @returns {Object} Styles properties mapping computed after browser detection
     */
    getStylesMap: function () {
        return py.browser.getBrowserMapping(styles_maps);
    },

    _onload_timer: null,
    _onload_ie_script: null,

    _onLoad: function() {
        if (py._onload_fired) {return;}
        py._onload_fired = true;

        if (this._onload_timer) {
            clearInterval(this._onload_timer);
        }

        if (this._onload_ie_script){
            this._onload_ie_script.onreadystatechange = '';
            this._onload_ie_script = null;
            var cleanup = setInterval(function() {
                try { // Strangly fail ...
                    py.dom.destroyElement("__ie_onload");
                    clearInterval(cleanup);
                } catch(e){}
            }, 400);
        }
        while (f = py._onload_callbacks.shift()) {
            try {
                f();
            } catch (err) {
                warn('Error with callback ' + f.toString() + ' : ', err);
            }
        }
    },

    /*
     * (c)2006 Jesse Skinner/Dean Edwards/Matthias Miller/John Resig
     * Special thanks to Dan Webb's domready.js Prototype extension
     * and Simon Willison's addLoadEvent
     *
     * For more info, see:
     * http://www.thefutureoftheweb.com/blog/adddomloadevent
     * http://dean.edwards.name/weblog/2006/06/again/
     * http://www.vivabit.com/bollocks/2006/06/21/a-dom-ready-extension-for-prototype
     * http://simon.incutio.com/archive/2004/05/26/addLoadEvent
     */
    _prepareOnLoadEvent: function() {
        var init = this._onLoad.bind(this);

        /* for mozilla*/
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", init, false);
        }

        /* for Internet Explorer */
        /*@cc_on @*/
        /*@if (@_win32)
         log("special DOMContentLoaded for IE");
         var scrpt = document.createElement("<script id=\"__ie_onload\" defer src=\"\/javascript:void(0);\"><\/script>");
         log("spy created");
          py.getHeader().appendChild(scrpt);
         log("spy inserted");
          this._onload_ie_script = document.getElementById("__ie_onload");
          this._onload_ie_script.onreadystatechange = function() {
              if (this.readyState == "complete") {
                  init(); // call the onload handler
              }
          };
        /*@end @*/

        /* for Safari */
        if (/WebKit/i.test(navigator.userAgent)) { // sniff
          this._onload_timer = setInterval(function() {
            if (/loaded|complete/.test(document.readyState)) {
              init(); // call the onload handler
            }
          }, 50);
        }

        /* for other browsers */
        window.onload = init;
    }
});

py.browser._prepareOnLoadEvent();

})();
