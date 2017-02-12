/**
 * Helper class for rendering products to 
 * product listing page. 
 * 
 * Assumption: before invoking this, product attributes will be set in local storage. 
 * 				( for non HTML 5 browser pass the product JSON)
 * 
 *  
 *  Inputs : Key ( key for getting the product details from Local storage)
 *  	   : divId ( place holder to render the compiled HTML
 *  	   : prodJson ( for non HTML 5 browsers)
 *  			format Products [{attributes},[items{item attribute}]]
 * 
 */
var productListing = {

	/**
	 * Entry point to the js class
	 */
	init : function(catalogID, pageNum, divId,isLazyLoad, prodJSON) {
		 this.filtersOnpage = ProductHelper.getFiltersOnPage();
		 this.lazyLoadActive = null;
		 this.objKey = {
	                category: catalogID,
	                filters: this.filtersOnpage,
	                pageNumber : pageNum,
	                storeId: $('#storeId').val() || '10151' // Check if storeId is there
	            };
		 this.objKey = JSON.stringify(this.objKey);
		 this.divIdVal = divId;
		 var self = this;
		var parentIds = DMStorage.getValue(this.objKey);
		
		var JSONdata = new Object();
		JSONdata.product = this.createJSON(parentIds);
		var imgUrl= getAbsoluteURL();
		var config= {'baseUrl':imgUrl};
		JSONdata.config=config;
		JSONdata.maxnumber=5;		
		nunjucks.configure(getAbsoluteURL()+'DMartStoreFrontAssetStore/templates/',{ autoescape: true, web : {useCache:true} });
		if(isLazyLoad){
			$('#'+divId).append(nunjucks.render('_modules/product-listing-grocery.nunjucks', {data:JSONdata}));
			this.lazyLoadActive = false;
		}else{
		$('#'+divId).html(nunjucks.render('_modules/product-listing-grocery.nunjucks', {data:JSONdata}));
		}
		$(window).scroll(this.scrollPage);
	},
	createJSON : function(parentIds) {
		var childIds = [];
		var childAttrs = [];
		$.each(parentIds, function(indx, productId) {
			childIds.push(JSON.parse(localStorage.getItem('proditems_'
					+ productId)).value);
		});
		$.each(childIds, function(indx, productId) {
			childAttrs.push(JSON.parse(localStorage
					.getItem('item_' + productId[0])).value);
			/*$.each(productId, function(indx, item) {
				//console.log('item_' + item);
				childAttrs.push(JSON.parse(localStorage
						.getItem('item_' + item)).value);
			});	*/		
		});
		var jsonOBJ = [];
		$.each(childAttrs, function(i, obj) {
			var jsonChildOBJ = new Object();
			var attributes  = new Object();
			jsonChildOBJ.outofstock = obj.buyable;
			jsonChildOBJ.img_src = obj.thumbnail;
			jsonChildOBJ.title = obj.name;
			jsonChildOBJ.brand = obj.manufacturer;
			attributes.colour = ["blue", i%2?"red":"black", i%2?"white":i%3?"orange":"yellow", "green"];
			attributes.size = ["S","M","L"];
			jsonChildOBJ.attributes =attributes;
			var priceObj = new Object();
			$.each(obj.price, function(indx, itmPrice) {
				if(itmPrice.usage == "Offer"){
					priceObj.offerPrice = parseInt(itmPrice.value);
				}else {
					priceObj.sellingPrice = i%2? parseInt(itmPrice.value) + 1 : parseInt(itmPrice.value);
				}
				priceObj.savings = priceObj.sellingPrice - priceObj.offerPrice;
				jsonChildOBJ.price = priceObj;
			});
			jsonOBJ.push(jsonChildOBJ);
		});
		return jsonOBJ;
	},
	scrollPage : function(){
        if($(window).scrollTop() + $(window).height() > $(document).height() - 200 && ! this.lazyLoadActive) {
			curPageNum =curPageNum +1;
			this.lazyLoadActive = true;
        	ProductHelper.init(currCatalogId.toString(),curPageNum);
        }
    },

};
