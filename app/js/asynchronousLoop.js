(function(window){
	'use strict';
	var angular = window.angular;
	angular.module('app')
		.factory('AsynchronousLoop',['$log','$timeout',function($log,$timeout){
			function isInteger(x) {
        		return (typeof x === 'number') && (x % 1 === 0);
    		}
    		function isBoolean(x){
    			return typeof x === 'boolean';
    		}
			function AsynchronousLoop(fnInit,fnCondition,fnUpdate,fnRun,fnDone){
				if(typeof fnInit !== 'function') throw Error('A function is expected for fnInit param');
				else if(typeof fnCondition !== 'function') throw new Error('A function is expected for fnCondition param');
				else if(typeof fnUpdate !== 'function') throw new Error('A function is expected for fnUpdate param');
				else if(typeof fnRun !== 'function') throw new Error('A function is expected for fnRun param');
				else if(!(typeof fnDone === 'function' || typeof fnDone === 'undefined')) throw new Error('A function is expected for fnDone param');
				else ;
				var index = fnInit();
				if(!isInteger(index)) throw new Error('fnInit has to return an Integer value');
				else if(!isBoolean(fnCondition(index))) throw new Error('fnCondition has to return a Boolean value');
				else if(!isInteger(fnUpdate(index))) throw new Error('fnUpdate has to return an Integer value');
				else ;
				function body(){
					function next(){
						index = fnUpdate(index);
						body();
					}
					if(fnCondition(index)){
						$timeout(function(){fnRun(index,next);},0);
					}
					else{
						if(typeof fnDone === 'function') fnDone();
					}
				}
				body();
			}
			return AsynchronousLoop;
		}]);
})(this.window);