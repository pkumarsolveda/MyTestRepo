/*
	Copyright (c) 2004-2009, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.lang.oo.Filter"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.lang.oo.Filter"] = true;
dojo.provide("dojox.lang.oo.Filter");

(function(){
	var oo = dojox.lang.oo,

	F = oo.Filter = function(bag, filter){
		//	summary:
		//		Filter to control mixing in objects by skipping
		//		properties and renaming them.
		//	description:
		//		This object is used as a holder of an original object
		//		(whose properites are to be copied), and a filter
		//		function used while copying by dojox.lang.oo.mixin.
		//	bag: Object:
		//		object to be filtered
		//	filter: Function|Object:
		//		a function to handle the name filtering,
		//		or an object with exec() method
		this.bag = bag;
		this.filter = typeof filter == "object" ?
			function(){ return filter.exec.apply(filter, arguments); } : filter;
	};

	// the default map-based filter object
	var MapFilter = function(map){
		this.map = map;
	};
	MapFilter.prototype.exec = function(name){
		return this.map.hasOwnProperty(name) ? this.map[name] : name;
	};

	oo.filter = function(bag, map){
		//	summary:
		//		creates a simple filter object
		//	bag: Object:
		//		object to be filtered
		//	map: Object:
		//		the dictionary for renaming/removing while copying
		//	returns:
		//		new dojox.lang.oo.Filter object
		return new F(bag, new MapFilter(map));
	};
})();

}
