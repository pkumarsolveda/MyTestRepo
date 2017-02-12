/**
 * @class
 * DMStorage  class for rendering facet area
 */
var facetNavigation = {

		/**
		 * Entry point to the js class
		 */
		init : function(objKey) {
			
			var facetData = DMStorage.getValue(objKey);
			var brands = [], colours = [], sizes= [];
			$.each(facetData.colurFacet, function(indx, val) {
				colours.push(val.value);
			});
			$.each(facetData.sizeFacet, function(indx, val) {
				sizes.push(val.value);
			});
			$.each(facetData.mfgFacet, function(indx, val) {
				var brandItm = new Object();
				brandItm.title = val.value;
				brandItm.img_src = val.value+".jpg";
				brands.push(brandItm);
			});
			var imgUrl= getAbsoluteURL()+'DMartStoreFrontAssetStore/';
			var data = new Object();
            var config= {'baseUrl':imgUrl};
			data.pageTitle = 'apparel';
			data.brands = brands;
			data.config  = config;
			data.colour = colours.filter(function(item, pos) { return colours.indexOf(item) == pos; });
			data.sizes = sizes.filter(function(item, pos) { return sizes.indexOf(item) == pos; });
			nunjucks.configure(WCParamJS.staticServerHost+'templates/',{ autoescape: true, web : {useCache:true} });	     
	        $('#filtersection').html(nunjucks.render('_modules/filter.nunjucks', { data : data }));
		},
        
};