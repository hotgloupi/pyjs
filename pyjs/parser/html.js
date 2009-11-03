/**
 * @fileOverview HTML Parser
 * @author <a href="mailto:raphael.londeix@gmail.com>Raphaël Londeix</a>
 * @version 0.1
 */

py.importModule('py.parser.parser');

py.declare('py.parser.HTMLElementHandler', {
    __init__: function(match_infos) {
        this.match_infos = match_infos;
    }
});

py.declare('py.parser.HTMLParser', {


});
