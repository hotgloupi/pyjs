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
        }/*<warn*/ else {
            warn('Cannot find suitable getElementById function !');
        }/*warn>*/
    }

    py.addOnLoad(function(){
        var div = document.createElement('div');
        div.id = 'test_getelementsbyname';
        div.style.display = "none";
        div.innerHTML = '<input type="text" name="test_byname" />'+
                        '<input type="text" id="test_byname" name="test_byname_foobar" />'+
                        '<div id="test_byname">&nbsp;</div>'+
                        '<p name="test_byname">&nbsp;</p>'+
                        '<img src="pif.gif" name="test_byname" />';

        py.doc.body.appendChild(div);
        var nodes = py.doc.getElementsByName('test_byname'),
            bad = false,
            node,
            tag_name,
            i = nodes.length - 1,
            found = 0;

        while (i >= 0) {
            node = nodes[i];
            i -= 1;
            if (!node.parentNode || node.parentNode.id != 'test_getelementsbyname') {
                return;
            }
            found += 1;
            tag_name = node.nodeName.toLowerCase();
            if (tag_name === 'div') {
                bad = true;
            }
            if (tag_name === 'input' && node.name === "test_byname_foobar") {
                bad = true;
            }
        }
        if (found != 3) { bad = true;}

        if (bad) {
            py.extendNamespace('py.dom', {
                /** @lends py.dom */

                /**
                 * Returns elements by name (fixed version)
                 * @param {String} name Node name
                 * @returns {Element[]} Array of nodes
                 */
                byName: function byName(name) {
                    return py.dom.query('[name="'+name+'"]');
                }
            });
        } else {
            var slicer = Array.prototype.slice;
            py.extendNamespace('py.dom', {
                byName: function byName(name) {
                    // Native function returns strange list
                    return slicer.call(document.getElementsByName(name), 0);
                }
            });
        }
//        py.doc.body.removeChild(div);
    });
})();
