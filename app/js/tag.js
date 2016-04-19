(function(window){
	'use strict';
	var angular = window.angular;
	angular.module('app')
	 	.directive('tag',['$log','AsynchronousLoop',function($log,AsynchronousLoop){
	 		return{
	 			restrict: 'E',
	 			templateUrl: 'partials/tag.html',
	 			bindToController: true,
	 			scope: {tags: '=tags',selectedTags:'=selectedTags'},
	 			controller: [function(){
	 				var self = this;
	 				this.selected = undefined;
	 				$log.debug('tagCtrl: %o',self);
	 				this.insertTag = function(tag){
	 					this.selectedTags.push(tag);
	 					$log.debug('insertTag: %o',tag);
	 				};
	 				this.deleteTag = function(id){
	 					$log.debug('deleteTag with id: %o',id);
	 					var found;
	 					AsynchronousLoop(
	 						function(){ return 0;},
	 						function(i){ return i<self.selectedTags.length && found === undefined;},
	 						function(i){ return i+1;},
	 						function(i,next){
	 							if(self.selectedTags[i].id === id){found = i;}
	 							next();
	 						},
	 						function(){
	 							$log.debug('id: %o, found at: %o',id,found);
	 							if(found !== undefined) 
	 								self.selectedTags.splice(found,1);
	 						}
	 					);
	 				};
	 				this.addSuggestion = function(suggestion){

	 				};
	 				this.onSelect = function($item){	//$item,$model,$label,$event
	 					this.insertTag({id:Date.now(),text:$item});
	 					this.selected = undefined;
	 				};
	 			}],
	 			controllerAs: 'tagCtrl'
	 		};
	 	}]);
})(this.window);

(function(window){
	'use strict';
	var angular = window.angular;
	angular.module('app')
		.controller('tagParentCtrl',[function(){
			this.tags = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
							  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
							  'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
							  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
							  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
							  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
							  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
							  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
							  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
			];
			this.selectedTags = [{id:1,text:'hello World'},{id:2,text:'bye World'}];
		}]);
})(this.window);