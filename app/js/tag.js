(function(window){
	'use strict';
	var angular = window.angular;
	angular.module('app')
	 	.directive('tag',['$log','AsynchronousLoop',function($log,AsynchronousLoop){
	 		return{
	 			restrict: 'E',
	 			templateUrl: 'partials/tag.html',
	 			bindToController: true,
	 			scope: {tags: '<tags',selectedTags:'<selectedTags',onAdd: '&onAdd'},
	 			controller: [function(){
	 				var self = this;
	 				this.MIN_CHARACTER = 1;
	 				this.MAX_CHARACTER = 20;
	 				this.selected = undefined;
	 				this.insertTag = function(tag){
	 					this.selectedTags.push(tag);
	 					$log.debug('insertTag: %o',tag);
	 					if(this.onAdd !== undefined) this.onAdd({tag:tag});
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
	 				this.onKeyUp = function($event){
	 					if($event.key === 'Enter'){
	 						if(this.selected !== undefined && this.selected.length >= this.MIN_CHARACTER && this.selected.length <= this.MAX_CHARACTER){
	 							$log.debug('onKeyUp: %o',this.selected);
	 							this.insertTag({id:Date.now(),text:this.selected});
	 							this.selected = undefined;
	 						}
	 					}
	 				};
	 				this.onSelect = function($item,$model,$label,$event){	//$item,$model,$label,$event
	 					if($event.type === 'click'){
	 						if(this.selected !== undefined && this.selected.length >= this.MIN_CHARACTER && this.selected.length <= this.MAX_CHARACTER){
	 							$log.debug('onSelect: %o',$item);
	 							this.insertTag({id:Date.now(),text:$item});
	 							this.selected = undefined;
	 						}
	 					}
	 				};
	 				this.$onInit = function(){
	 					$log.debug('tagCtrl: %o',self);
	 					if(!Array.isArray(this.tags))
	 						throw new Error('An array was expected for tags property');
	 					if(!Array.isArray(this.selectedTags))
	 						throw new Error('An array was expected for selectedTags property');
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
		.controller('tagParentCtrl',['$log',function($log){
			this.tags = ['A','B','C'];
			this.selectedTags = [];
			this.onAdd = function(tag){
				$log.debug('onAdd event fired with %o',tag);
			};
		}]);
})(this.window);