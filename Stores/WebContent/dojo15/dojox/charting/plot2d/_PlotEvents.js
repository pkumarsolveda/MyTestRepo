/*
	Copyright (c) 2004-2013, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.charting.plot2d._PlotEvents"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.charting.plot2d._PlotEvents"] = true;
dojo.provide("dojox.charting.plot2d._PlotEvents");

dojo.declare("dojox.charting.plot2d._PlotEvents", null, {
	constructor: function(){
		this._shapeEvents = [];
		this._eventSeries = {};
	},
	destroy: function(){
		//	summary:
		//		Destroy any internal elements and event handlers.
		this.resetEvents();
		this.inherited(arguments);
	},
	plotEvent: function(o){
		//	summary:
		//		Stub function for use by specific plots.
		//	o: Object
		//		An object intended to represent event parameters.
	},
	raiseEvent: function(o){
		//	summary:
		//		Raises events in predefined order
		//	o: Object
		//		An object intended to represent event parameters.
		this.plotEvent(o);
		var t = dojo.delegate(o);
		t.originalEvent = o.type;
		t.originalPlot  = o.plot;
		t.type = "onindirect";
		dojo.forEach(this.chart.stack, function(plot){
			if(plot !== this && plot.plotEvent){
				t.plot = plot;
				plot.plotEvent(t);
			}
		}, this);
	},
	connect: function(object, method){
		//	summary:
		//		Helper function to connect any object's method to our plotEvent.
		//	object: Object
		//		The object to connect to.
		//	method: String|Function
		//		The method to fire when our plotEvent is fired.
		//	returns: Array
		//		The handle as returned from dojo.connect (see dojo.connect).
		this.dirty = true;
		return dojo.connect(this, "plotEvent", object, method);	//	Array
	},
	events: function(){
		//	summary:
		//		Find out if any event handlers have been connected to our plotEvent.
		//	returns: Boolean
		//		A flag indicating that there are handlers attached.
		var ls = this.plotEvent._listeners;
		if(!ls || !ls.length){ return false; }
		for(var i in ls){
			if(!(i in Array.prototype)){
				return true;
			}
		}
		return false;
	},
	resetEvents: function(){
		//	summary:
		//		Reset all events attached to our plotEvent (i.e. disconnect).
		if(this._shapeEvents.length){
			dojo.forEach(this._shapeEvents, function(item){
				item.shape.disconnect(item.handle);
			});
			this._shapeEvents = [];
		}
		this.raiseEvent({type: "onplotreset", plot: this});
	},
	_connectSingleEvent: function(o, eventName){
		this._shapeEvents.push({
			shape:  o.eventMask,
			handle: o.eventMask.connect(eventName, this, function(e){
				o.type  = eventName;
				o.event = e;
				this.raiseEvent(o);
				o.event = null;
			})
		});
	},
	_connectEvents: function(o){
		o.chart = this.chart;
		o.plot  = this;
		o.hAxis = this.hAxis || null;
		o.vAxis = this.vAxis || null;
		o.eventMask = o.eventMask || o.shape;
		this._connectSingleEvent(o, "onmouseover");
		this._connectSingleEvent(o, "onmouseout");
		this._connectSingleEvent(o, "onclick");
	},
	_reconnectEvents: function(seriesName){
		var a = this._eventSeries[seriesName];
		if(a){
			dojo.forEach(a, this._connectEvents, this);
		}
	},
	fireEvent: function(seriesName, eventName, index, eventObject){
		//	summary:
		//		Emulates firing an event for a given data value (specified by
		//		an index) of a given series.
		//	seriesName: String:
		//		Series name.
		//	eventName: String:
		//		Event name to emulate.
		//	index:	Number:
		//		Valid data value index used to raise an event.
		//	eventObject: Object?:
		//		Optional event object. Especially useful for synthetic events.
		//		Default: null.
		var s = this._eventSeries[seriesName];
		if(s && s.length && index < s.length){
			var o = s[index];
			o.type  = eventName;
			o.event = eventObject || null;
			this.raiseEvent(o);
			o.event = null;
		}
	}
});

}
