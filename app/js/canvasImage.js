(function(window){
	'use strict';
	var angular = window.angular;
	angular.module('app')
		.directive('canvasImage',['$log','imageService','$timeout',function($log,imageService,$timeout){
			function CanvasHandler(canvas,cWidth,cHeight){		
				var self = this;
				this.setRatio = function(){ //http://jsbin.com/funewofu/1/edit?js,output
					var hRatio = (typeof this.canvas.width === 'number') && (typeof this.htmlImageElement.width === 'number') ? this.canvas.width/this.htmlImageElement.width : 0.0;
					var vRatio = (typeof this.canvas.height === 'number') && (typeof this.htmlImageElement.height === 'number') ? this.canvas.height/this.htmlImageElement.height : 0.0;
					self.ratio = Math.min(hRatio,vRatio); 
				};
				this.setHtmlImageElement = function(value){
					self.htmlImageElement = value;
				};
				this.setCanvasSize = function(width,height){
					self.canvas.width = (typeof width === 'number') ? width : self.canvas.width;
					self.canvas.height = (typeof height === 'number') ? height: self.canvas.height;
				};
				this.isDragging = function(){
					return self.dragging;
				};
				this.setDragging = function(value){
					if(typeof value === 'boolean')
						$timeout(function(){self.dragging = value;},0);
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
						var dx = e.clientX-offset.left-self.canvasX;
						var dy  = e.clientY-offset.top-self.canvasY;
						$log.debug('distanceX at: %o; distanceY at: %o',dx,dy);
						self.drawImage(dx,dy);
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
				this.resize = function(width,height){	//Event triggered whenever the window is resized
					if(canvas.width !== width || canvas.height !== height){
						$log.debug('resizeCanvas to width: %o, height: %o',width,height);
						self.setCanvasSize(width,height);
						self.setRatio();
						self.setZoom(self.zoom);
					}
				};
				this.wheel = function(e){
					$log.debug('wheel.deltaX: %o; wheel.deltaY: %o; wheel.deltaZ: %o',e.deltaX,e.deltaY,e.deltaZ);
				};
				this.zoomIn = function(){
					self.setZoom(self.zoom+1);
				};
				this.zoomOut = function(){
					self.setZoom(self.zoom-1);
				};
				this.getContext = function(){
					return this.canvas.getContext('2d');
				};
				this.setZoom = function(zoom){
					if(zoom >= 0 && zoom < self.MAX_ZOOM){
						self.zoom = zoom;
						var multiplier = Math.pow(2,self.zoom);
						if(self.htmlImageElement !== undefined){
							self.drawImage(undefined,undefined,self.htmlImageElement.width*multiplier,self.htmlImageElement.height*multiplier);
						}
					}
					else
						$log.debug('setZoom to %o has not changed the zoom level because it is not in boundaries',zoom);
				};
				this.paint = function(){
					self.canvasX = 0;
					self.canvasY = 0;
					self.distanceX = 0;
					self.distanceY = 0;
					self.zoom = 0;
					self.setRatio();
					self.drawImage(undefined,undefined,self.htmlImageElement.width,self.htmlImageElement.height);
				};
				this.drawImage = function(dx,dy,dWidth,dHeight){
					$log.debug('drawImage dx: %o, dy: %o, dWidth: %o, dHeight: %o',dx,dy,dWidth,dHeight);
					self.dWidth = (typeof dWidth === 'number') ? dWidth : self.dWidth;
					self.dHeight = (typeof dHeight === 'number') ? dHeight : self.dHeight;
					self.distanceX = (typeof dx === 'number') ? dx : (self.canvas.width-self.dWidth*self.ratio)/2;
					self.distanceY = (typeof dy === 'number') ? dy : (self.canvas.height-self.dHeight*self.ratio)/2;
					self.clear();
					self.getContext().drawImage(self.htmlImageElement,
						self.distanceX,self.distanceY,self.dWidth*self.ratio,self.dHeight*self.ratio);	
				};
				this.clear = function(){
					this.getContext().clearRect(0,0,canvas.width,canvas.height);
				};
				this.init = function(canvas,cWidth,cHeight){	//CanvasHandler Constructor
					this.canvas = canvas;
					this.ratio = 0.0;
					this.htmlImageElement = undefined;
					this.dragging = false;
					this.canvasX = 0;
					this.canvasY = 0;
					this.distanceX = 0;
					this.distanceY = 0;
					this.zoom = 0;
					this.MAX_ZOOM = 5;
					this.setCanvasSize(cWidth,cHeight);
					this.canvas.addEventListener('mousedown',this.mouseDown,false);
					this.canvas.addEventListener('mousemove',this.mouseMove,false);
					this.canvas.addEventListener('mouseup',this.mouseUp,false);
					this.canvas.addEventListener('mouseout',this.mouseOut,false);
					//this.canvas.addEventListener('wheel',this.wheel,false);
				};
				this.init(canvas,cWidth,cHeight);	//Call to the constructor
			}
			return {
				restrict: 'E',
				templateUrl: 'partials/canvasImage.html',
				bindToController: true,
				scope:{src:'<src',height:'<height'},
				controller: [function(){
					var self = this;
					this.id = Date.now();
					this.canvasHandler = undefined;
					this.$onInit = function(){
						$log.debug(self);
						if(typeof this.src !== 'string')
							throw new Error('canvas-image expects a string for src');
						else if(typeof this.height !== 'number')
							throw new Error('canvas-image expects a number for height');
						else
							;
					};
					this.newCanvasHandler = function(canvas,cWidth,cHeight){
						if(canvas !== undefined){
							var canvasHandler = new CanvasHandler(canvas,cWidth,cHeight);
							this.zoomIn = canvasHandler.zoomIn;
							this.zoomOut = canvasHandler.zoomOut;
							this.isDragging = canvasHandler.isDragging;
							return canvasHandler;
						}
						return undefined;
					};
				}],
				controllerAs: 'canvasImageCtrl',
				link: function(scope,elem){
					var self = scope.canvasImageCtrl;
					var canvas = angular.element(elem).find('canvas')[0];
					var canvasWrapper = elem[0].getElementsByClassName('canvas-wrapper')[0];
					var canvasHandler = self.newCanvasHandler(canvas,canvasWrapper.clientWidth,self.height);

					function loadImage(src,canvasHandler){
						imageService.get(
							src,
							function(data){	//HTMLImageElement as data
								canvasHandler.setHtmlImageElement(data);
								canvasHandler.paint();
							},
							function(error){
								$log.debug(error);
							}
						);
					}
					scope.$watch(	//$watcher for changes into src
						function(){return self.src;},
						function(newVal,oldVal){
							if(newVal !== oldVal)
								loadImage(newVal,canvasHandler);
						}
					);
					scope.$watch(	//$watcher for changed into height
						function(){return self.height;},
						function(newVal,oldVal){
							if(newVal !== oldVal)
								canvasHandler.resize(canvasWrapper.clientWidth,newVal);
						}
					);
					angular.element(window).bind('resize',function(){	//Event Listener for window changes
						canvasHandler.resize(canvasWrapper.clientWidth,self.height);
					});

					loadImage(self.src,canvasHandler);
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