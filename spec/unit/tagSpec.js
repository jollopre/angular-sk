(function(window){
	'use strict';
	describe('tag directive test suite',function(){
		var angular = window.angular;
		var $compile;
		var $log;
		var $scope;
		beforeEach(module('app'));
		beforeEach(module('partials/tag.html'));

		beforeEach(inject(function(_$compile_,_$log_,_$rootScope_){
			$compile = _$compile_;
			$log = _$log_;
			$scope = _$rootScope_.$new();
		}));
		afterEach(function(){  
	  		console.log($log.debug.logs);
		});
		it('throw error for a non-array tags property',function(){
			expect(function() {
      			$compile(angular.element('<tag></tag>'))($scope);
      			$scope.$digest();
    		}).toThrowError(Error,'An array was expected for tags property');
		});
		it('throw error for a non-array selectedTags property',function(){
			$scope.tags = ['a','b'];
			expect(function() {
      			$compile(angular.element('<tag tags="tags"></tag>'))($scope);
      			$scope.$digest();
    		}).toThrowError(Error,'An array was expected for selectedTags property');
		});
	});
})(this.window);