//HEAD 
(function(app) {
try { app = angular.module("partials"); }
catch(err) { app = angular.module("partials", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("partials/helloWorld.html","<p>Hello World! Did you know that 5+4 = <span ng-bind=\"5+4\"></span> ?</p>")
}]);
})();