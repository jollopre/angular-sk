(function(window){
	'use strict';
	describe('helloWorld directive test suite',function(){
		var angular = window.angular;
		var $compile;
		var $log;
		var $scope;
		beforeEach(module('app'));
		beforeEach(module('partials/helloWorld.html'));
		beforeEach(inject(function(_$compile_,_$log_,_$rootScope_){
			$compile = _$compile_;
			$log = _$log_;
			$scope = _$rootScope_.$new();
		}));
		afterEach(function(){  
	  		console.log($log.debug.logs);
		});
		it('it shows the html content of the directive',function(){
			var elem = $compile('<hello-world></hello-world>')($scope);
			$scope.$digest();
			var p = angular.element(elem).find('p')[0];
			var span = angular.element(elem).find('span')[0];
			expect(angular.element(p).html()).toContain('Hello World! Did you know that 5+4');
			expect(angular.element(span).html()).toEqual('9');
		});
	});
})(this.window);