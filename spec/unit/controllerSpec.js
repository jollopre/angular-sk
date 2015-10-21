describe('HelloWorldCtrl function', function(){
	describe('HelloWorldCtrl', function(){
		var $scope;
		beforeEach(module('app.controller'));

		beforeEach(inject(function($rootScope, $controller){
			$scope = $rootScope.$new();
			$controller('HelloWorldCtrl',{$scope: $scope});
		}));

		it('should set the default value of name', function(){
			expect($scope.name).toBe('World');
		});
	});
});