/**
 * @fileOverview Fix document problems
 * @author <a href="mailto:raphael.londeix@gmail.com">Raphaël Londeix</a>
 * @version 0.1
 */
(function(){

if (!document.getElementById) {
    if (document.all) {
        document.getElementById = function getElementById(id) {
            return document.all[id] || null;
        };
    } else if (document.layers) {
        document.getElementById = function getElementById(id) {
            return document.layers[id] || null;
        };
    } else /*<warn*/{
        warn('Cannot find suitable getElementById function !');
    }/*warn>*/
}

})();
