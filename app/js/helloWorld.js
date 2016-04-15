(function(window){
	'use strict';
	var angular = window.angular;
	angular.module('app')
	 	.directive('helloWorld',[function(){
	 		return{
	 			restrict: 'E',
	 			templateUrl: 'partials/helloWorld.html',
	 			bindToController: true,
	 			scope: {},
	 			controller: [function(){

	 			}],
	 			controllerAs: 'helloWorldCtrl'
	 		};
	 	}]);
})(this.window);