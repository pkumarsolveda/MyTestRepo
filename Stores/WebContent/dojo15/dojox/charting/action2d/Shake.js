/*
	Copyright (c) 2004-2013, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.charting.action2d.Shake"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.charting.action2d.Shake"] = true;
dojo.provide("dojox.charting.action2d.Shake");

dojo.require("dojox.charting.action2d.Base");
dojo.require("dojox.gfx.matrix");
dojo.require("dojo.fx");

/*=====
dojo.declare("dojox.charting.action2d.__ShakeCtorArgs", dojox.charting.action2d.__BaseCtorArgs, {
	//	summary:
	//		Additional arguments for highlighting actions.

	//	shift: Number?
	//		The amount in pixels to shift the pie slice.  Default is 3.
	shift: 3
});
=====*/
(function(){
	var DEFAULT_SHIFT = 3,
		m = dojox.gfx.matrix,
		gf = dojox.gfx.fx;

	dojo.declare("dojox.charting.action2d.Shake", dojox.charting.action2d.Base, {
		//	summary:
		//		Create a shaking action for use on an element in a chart.

		// the data description block for the widget parser
		defaultParams: {
			duration: 400,	// duration of the action in ms
			easing:   dojo.fx.easing.backOut,	// easing for the action
			shiftX:   DEFAULT_SHIFT,	// shift of the element along the X axis
			shiftY:   DEFAULT_SHIFT		// shift of the element along the Y axis
		},
		optionalParams: {},	// no optional parameters

		constructor: function(chart, plot, kwArgs){
			//	summary:
			//		Create the shaking action and connect it to the plot.
			//	chart: dojox.charting.Chart2D
			//		The chart this action belongs to.
			//	plot: String?
			//		The plot this action is attached to.  If not passed, "default" is assumed.
			//	kwArgs: dojox.charting.action2d.__ShakeCtorArgs?
			//		Optional keyword arguments object for setting parameters.
			if(!kwArgs){ kwArgs = {}; }
			this.shiftX = typeof kwArgs.shiftX == "number" ? kwArgs.shiftX : DEFAULT_SHIFT;
			this.shiftY = typeof kwArgs.shiftY == "number" ? kwArgs.shiftY : DEFAULT_SHIFT;

			this.connect();
		},

		process: function(o){
			//	summary:
			//		Process the action on the given object.
			//	o: dojox.gfx.Shape
			//		The object on which to process the slice moving action.
			if(!o.shape || !(o.type in this.overOutEvents)){ return; }

			var runName = o.run.name, index = o.index, vector = [], anim,
				shiftX = o.type == "onmouseover" ? this.shiftX : -this.shiftX,
				shiftY = o.type == "onmouseover" ? this.shiftY : -this.shiftY;

			if(runName in this.anim){
				anim = this.anim[runName][index];
			}else{
				this.anim[runName] = {};
			}

			if(anim){
				anim.action.stop(true);
			}else{
				this.anim[runName][index] = anim = {};
			}

			var kwArgs = {
				shape:     o.shape,
				duration:  this.duration,
				easing:    this.easing,
				transform: [
					{name: "translate", start: [this.shiftX, this.shiftY], end: [0, 0]},
					m.identity
				]
			};
			if(o.shape){
				vector.push(gf.animateTransform(kwArgs));
			}
			if(o.oultine){
				kwArgs.shape = o.outline;
				vector.push(gf.animateTransform(kwArgs));
			}
			if(o.shadow){
				kwArgs.shape = o.shadow;
				vector.push(gf.animateTransform(kwArgs));
			}

			if(!vector.length){
				delete this.anim[runName][index];
				return;
			}

			anim.action = dojo.fx.combine(vector);
			if(o.type == "onmouseout"){
				dojo.connect(anim.action, "onEnd", this, function(){
					if(this.anim[runName]){
						delete this.anim[runName][index];
					}
				});
			}
			anim.action.play();
		}
	});
})();

}
