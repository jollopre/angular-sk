describe('myCtrl function', function(){
	describe('myCtrl', function(){
		var $scope;
		beforeEach(module('app.controller'));

		beforeEach(inject(function($rootScope, $controller){
			$scope = $rootScope.$new();
			$controller('myCtrl',{$scope: $scope});
		}));

		it('should set the default value of name', function(){
			expect($scope.name).toBe('World');
		});
	});
});