#!/bin/sh
rm -Rf reference
java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js  -t=jsdoc-toolkit/templates/jsdoc -d=reference pyjs -e=utf8 -r -p
