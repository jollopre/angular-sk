(function(window){
	'use strict';
	var angular = window.angular;
	angular.module('app')
		.directive('canvasImage',['$log','imageService','$timeout',function($log,imageService,$timeout){
			function CanvasHandler(canvas,imageUrl){
				var self = this;
				this.canvas = canvas;
				this.img = {HTMLImageElement:undefined,width:0,height:0};
				this.dragging = false;
				this.canvasX = 0;
				this.canvasY = 0;
				this.distanceX = 0;
				this.distanceY = 0;
				this.zoom = 0;
				this.MAX_ZOOM = 5;
				this.init = function(){
					imageService.get(
						imageUrl,
						function(data){
							self.img.HTMLImageElement = data;
							var dimensions = self.scaleImage(self.img.HTMLImageElement.width,self.img.HTMLImageElement.height,self.canvas.width);
							self.img.width = dimensions.width; self.img.height = dimensions.height;
							self.distanceX = canvas.width/2-self.img.width/2;
							self.distanceY = canvas.height/2-self.img.height/2;
							self.clear();
							self.getContext().drawImage(self.img.HTMLImageElement,self.distanceX,self.distanceY,self.img.width,self.img.height);
						},
						function(error){
							$log.debug(error);
						}
					);
				};
				this.isDragging = function(){
					return self.dragging;
				};
				this.setDragging = function(value){
					if(typeof value === 'boolean')
						$timeout(function(){self.dragging = value;},0);
				};
				this.getContext = function(){
					return this.canvas.getContext('2d');
				};
				this.scaleImage = function(imgWidth,imgHeight,width){
					if(imgWidth > width){
						return {width:width,height: imgHeight/imgWidth*width};
					}
					else{
						return {width:imgWidth,height:imgHeight};
					}
				};
				this.mouseDown = function(e){
					self.setDragging(true);
					var offset = self.canvas.getBoundingClientRect();
					self.canvasX = e.clientX-offset.left-self.distanceX;
					self.canvasY = e.clientY-offset.top-self.distanceY;
					$log.debug('canvasX at: %o; canvasY at: %o',self.canvasX,self.canvasY);
				};
				this.mouseMove = function(e){
					if(self.dragging){
						var offset = self.canvas.getBoundingClientRect();
						self.distanceX = e.clientX-offset.left-self.canvasX;
						self.distanceY = e.clientY-offset.top-self.canvasY;
						$log.debug('distanceX at: %o; distanceY at: %o',self.distanceX,self.distanceY);
						self.clear();
						self.getContext().drawImage(self.img.HTMLImageElement,self.distanceX,self.distanceY,self.img.width,self.img.height);
					}
				};
				this.mouseUp = function(e){
					self.setDragging(false);
					$log.debug('mouseUp: %o',e);
				};
				this.mouseOut = function(e){
					self.setDragging(false);
					$log.debug('mouseOut: %o',e);
				};
				this.wheel = function(e){
					$log.debug('wheel.deltaX: %o; wheel.deltaY: %o; wheel.deltaZ: %o',e.deltaX,e.deltaY,e.deltaZ);
				};
				this.zoomIn = function(){
					if(self.zoom < self.MAX_ZOOM){
						self.zoom = self.zoom+1;
						$log.debug('zoomIn: %o',self.zoom);
						self.img.width = self.img.width*2;
						self.img.height = self.img.height*2;
						self.distanceX = canvas.width/2-self.img.width/2;
						self.distanceY = canvas.height/2-self.img.height/2;
						self.clear();
						self.getContext().drawImage(self.img.HTMLImageElement,self.distanceX,self.distanceY,self.img.width,self.img.height);
					}
					else
						$log.debug('zoomIn: %o',self.zoom);
				};
				this.zoomOut = function(){
					if(self.zoom > 0){
						self.zoom = self.zoom-1;
						$log.debug('zoomOut: %o',self.zoom);
						self.img.width = self.img.width/2;
						self.img.height = self.img.height/2;
						self.distanceX = canvas.width/2-self.img.width/2;
						self.distanceY = canvas.height/2-self.img.height/2;
						self.clear();
						self.getContext().drawImage(self.img.HTMLImageElement,self.distanceX,self.distanceY,self.img.width,self.img.height);
					}
					else
						$log.debug('zoomOut: %o',self.zoom);
				};
				this.clear = function(){
					this.getContext().clearRect(0,0,canvas.width,canvas.height);
				};
				this.canvas.addEventListener('mousedown',this.mouseDown,false);
				this.canvas.addEventListener('mousemove',this.mouseMove,false);
				this.canvas.addEventListener('mouseup',this.mouseUp,false);
				this.canvas.addEventListener('mouseout',this.mouseOut,false);
				this.canvas.addEventListener('wheel',this.wheel,false);
			}
			return {
				restrict: 'E',
				templateUrl: 'partials/canvasImage.html',
				bindToController: true,
				scope:{src:'<src'},
				controller: [function(){
					var self = this;
					this.id = Date.now();
					this.$onInit = function(){
						$log.debug(self);
					};
				}],
				controllerAs: 'canvasImageCtrl',
				link: function(scope,elem){
					var canvasHandler = new CanvasHandler(angular.element(elem).find('canvas')[0],scope.canvasImageCtrl.src);
					canvasHandler.init();
					scope.canvasImageCtrl.zoomIn = canvasHandler.zoomIn;
					scope.canvasImageCtrl.zoomOut = canvasHandler.zoomOut;
					scope.canvasImageCtrl.isDragging = canvasHandler.isDragging;
				}
			};
		}]); 
})(this.window);

(function(){
	'use strict';
	var angular = window.angular;
	angular.module('app')
		.service('imageService',['$log','$timeout',function($log,$timeout){
			this.get = function(url,successCb,errorCb){
				if(typeof url !== 'string') throw new Error('url string param is expected');
				if(typeof successCb !== 'function') throw new Error('successCb function param is expected');
			    if(typeof errorCb !== 'function') throw new Error('errorCb function param is expected');
				var image = new Image();
				image.onload = function(){
					$log.debug('Image: '+url+' successfully loaded.');
					$timeout(successCb(image),0);
				};
				image.onerror = function(){
					var error = 'Error trying to load th image from: '+url;
					$log.debug(error);
					$timeout(function(){errorCb(error);},0);
				};
				image.src = url;
			};
		}]);
})(this.window);