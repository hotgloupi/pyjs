(function(){

// This script help for detection
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
    name: BrowserDetect.browser,
    version: BrowserDetect.version,
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
        'classname': 'class',
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

py.browser.update({
    getViewportWidth: function() {
        var width = 0;
        if( document.documentElement && document.documentElement.clientWidth ) {
            width = document.documentElement.clientWidth;
        }
        else if( document.body && document.body.clientWidth ) {
            width = document.body.clientWidth;
        }
        else if( window.innerWidth ) {
            width = window.innerWidth - 18;
        }
        return width;
    },

    getViewportHeight: function() {
        var height = 0;
        if (document.documentElement && document.documentElement.clientHeight) {
            height = document.documentElement.clientHeight;
        }
        else if( document.body && document.body.clientHeight ) {
            height = document.body.clientHeight;
        }
        else if( window.innerHeight ) {
            height = window.innerHeight - 18;
        }
        return height;
    },

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

    getViewport: function() {
        return {
            t: this.getViewportScrollY(),
            l: this.getViewportScrollX(),
            w: this.getViewportWidth(),
            h: this.getViewportHeight()
        };
    },

    getAttributesMap: function() {
        var _map = {};

        if (attributes_maps.base) {
            _map.update(attributes_maps.base);
        }
        var ref = attributes_maps[this.name];
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
    }
});

})();
