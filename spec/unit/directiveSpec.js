describe('hello-world directive', function(){
	var $compile, $scope;
	beforeEach(module('app.directive'));	//Loads app.directive module containing hello-world directive
	beforeEach(module('partials/hello-world.html'));

	beforeEach(inject(function(_$compile_,$rootScope){	//Injects $compile and $rootScope into the local variables $compile and $rootScope respectively
		$compile = _$compile_;
		$scope = $rootScope.$new();
	}));

	it('Should replace $scope.name with World', function(){
		var element = $compile('<hello-world></hello-world>')($scope);	//Compiles the directive
		$scope.$digest();	//Fires all the watches
		expect(element.html()).toContain('Hello World!');
	});
});