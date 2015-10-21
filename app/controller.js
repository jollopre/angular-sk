angular.module('app.controller', [])
	.controller('HelloWorldCtrl',['$scope',function($scope){
		$scope.name = 'World';
	}])
;