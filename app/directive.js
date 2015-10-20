angular.module('app.directive',[])
	.directive('helloWorld',[function(){
		return {
			restrict: 'E',
			templateUrl: 'partials/hello-world.html',
			controller: ['$scope',function($scope){
				$scope.name = 'World';
			}],
			controllerAs: 'helloWorldCtrl'
		}
	}])
	;