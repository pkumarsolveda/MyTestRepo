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
 *  	   
 * 
 */
var productListing = {

	pageType : '',
	
	products : {},
	
	formatRangeSlider: false,
	
	noMoreProductsToShow : false,
	
    /**
     * Entry point to the js class
     */
    init: function(categoryId, pageNum, divId, isLazyLoad, prodCount, searchTerm,firstLoad) {
    	// Load filters from localStorage
        this.filtersOnpage = ProductHelper.getFiltersOnPage();
        
        this.objKey = {
    			search: searchTerm,
                filters: this.filtersOnpage,
                pageNumber: pageNum,
                storeId: WCParamJS.storeId || '10151' // Check if storeId is there
            };
        
        // Create the key which will be used to fetch product ids from localStorage
        if(categoryId != "" && typeof categoryId != 'undefined'){
        	this.objKey = {
                    category: categoryId,
                    filters: this.filtersOnpage,
                    pageNumber: pageNum,
                    storeId: WCParamJS.storeId || '10151' // Check if storeId is there
                };
        }else if(searchTerm != "" && typeof searchTerm != 'undefined'){
        	this.objKey = {
        			search: searchTerm,
                    filters: this.filtersOnpage,
                    pageNumber: pageNum,
                    storeId: WCParamJS.storeId || '10151' // Check if storeId is there
                };
        	
        }else if (typeof WCParamJS.handledManufacturer != "undefined" && WCParamJS.handledManufacturer != ""){
        	this.objKey = {
        			brand: WCParamJS.handledManufacturer,
                    filters: this.filtersOnpage,
                    pageNumber: pageNum,
                    storeId: WCParamJS.storeId || '10151' // Check if storeId is there
                };
        }  
        
        this.objKey = JSON.stringify(this.objKey);
        this.divIdVal = divId;
        var self = this;
        var parentIds = DMStorage.getValue(this.objKey).catentries;
        
        var JSONdata = {};
        JSONdata.product = this.createJSON(parentIds);
        this.config = {
            baseUrl: window.location.origin+'/webapp/wcs/stores/servlet/'
        };
        
        JSONdata.config = this.config;
        JSONdata.maxnumber = 5;
        JSONdata.categoryId = WCParamJS.categoryId;
        JSONdata.searchTerm= searchTerm;
        JSONdata.isBrowse = (typeof searchTerm == "undefined" || searchTerm.length ==0) ? true : false;
        if(typeof WCParamJS.handledManufacturer != "undefined" && WCParamJS.handledManufacturer != ""){
        	if(window.location.href.split('?')[1].split('&manufacturer=')[1] != null || window.location.href.split('?')[1].split('&manufacturer=')[1] != ""){
            	JSONdata.manufacturer=  decodeURIComponent(window.location.href.split('?')[1].split('&manufacturer=')[1]);
            } 
        }               
        JSONdata.storeId = WCParamJS.storeId;
        JSONdata.catalogId = WCParamJS.catalogId;
        JSONdata.assetStoreId = '10101';
        JSONdata.productIds = parentIds;
        JSONdata.pageTitle=this.pageType;
        JSONdata.homePageURL=WCParamJS.homepageURLHierarchy;
        JSONdata.noImagePath=WCParamJS.staticServerHost+'images/DMart/NoImage_M.jpg';
        
        nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
            autoescape: true,
            web: {
                useCache: true
            }
        });
        
        this.noMoreProductsToShow = parentIds.length < confListingProductCount;
        var param ;
        if (isLazyLoad) {
        	// Render div only if there are more products
        	if(categoryId != "" && typeof categoryId != 'undefined'){
        		if(JSONdata.productIds.length>0) {
    	            $('#' + divId).append(nunjucks.render('product-listing.nunjucks', {
    	                data: JSONdata
    	            }));
    	            lazyLoadActive = false;
            	} 
        		param = {lazyLoad: true,CatalogId:$('#plpCategoryId').val(),PageNum:curPageNum};
                DMAnalytics.events( DMAnalytics.Constants.Category.Products, DMAnalytics.Constants.Action.PLPLazyLoad, document.title, 0,param );
                
        	}else if((searchTerm != "" && typeof searchTerm != 'undefined')||(typeof WCParamJS.handledManufacturer != "undefined" && WCParamJS.handledManufacturer != "")){
        		if(JSONdata.productIds.length>0) {
    	            $('#' + divId).append(nunjucks.render('product-listing.nunjucks', {
    	                data: JSONdata
    	            }));
    	            lazyLoadActive = false;
            	} 
        		param = {lazyLoad: true,SearchTerm:searchTerm,PageNum:curPageNum};
                DMAnalytics.events( DMAnalytics.Constants.Category.Search, DMAnalytics.Constants.Action.SearchTerm, document.title, 0,param );
        	}
        	if($('.plp-view-option .plp-view-option__list').hasClass('active')) {
            	$('.plp-view-option .plp-view-option__list').trigger('click');
            }


        } else {
        	if(JSONdata.productIds.length == 0){
       		 	ProductHelper.hasNoFacets =true;
       	 	}else{
       	 		ProductHelper.hasNoFacets =false;
       	 	}
        	if(categoryId != "" && typeof categoryId != 'undefined'){
        		$('#' + divId).html(nunjucks.render('product-listing.nunjucks', {
                    data: JSONdata
                }));
        		 param = {lazyLoad: false,CatalogId:currCatalogId,PageNum:0};
                 DMAnalytics.events( DMAnalytics.Constants.Category.PLPListing, DMAnalytics.Constants.Action.PLPListing, document.title, 0,param );
                 this.cardESpotShownOnce = false;  
                 this.loadProductCardHotspot();
                 
        	}else if((searchTerm != "" && typeof searchTerm != 'undefined')||(typeof WCParamJS.handledManufacturer != "undefined" && WCParamJS.handledManufacturer != "")){
        		$('#' + divId).html(nunjucks.render('product-listing.nunjucks', {
                    data: JSONdata
                }));
        		param = {lazyLoad: true,SearchTerm:searchTerm,PageNum:0};
        		DMAnalytics.events( DMAnalytics.Constants.Category.Search, searchTerm, document.title, 0,param );
        	}      	
        }        
        
        renderRupeeSymbolInDropDown();
               
        //Load filters on page load from localStorage
 		var isRefreshFilters = this.updateChosenFilters (categoryId,searchTerm);	
 		var	isRefreshPriceDiscount = this.updatePriceDiscountFilters (categoryId,searchTerm);
 		
        this.updateCardsForInTrolley();
        if(JSONdata.pageTitle=="apparel"){
        	this.checkInventoryForApparel(null,null);
        }
        
        /** Commented out for AE-14538 
        // If in list view, change to list view by simulating a click
        if($('.plp-view-option .plp-view-option__list').hasClass('active')) {
        	$('.plp-view-option .plp-view-option__list').trigger('click');
        }*/
        var dymTerm= DMStorage.getValue(this.objKey).dymTerm;
        var recordSetTotal = DMStorage.getValue(this.objKey).totalRecords;
        if($('.common-search__instead').length){
        	if (typeof searchTerm != "undefined" && searchTerm != ""){
        		if(typeof dymTerm != "undefined" && dymTerm != ""){
        			$('.common-search').css('display', 'block');
        			$('.common-search__instead').html('<p>'+MessageHelper.messages['_MSG_SEARCH_WE_DONT_HAVE']+'"<span class="bold">'+searchTerm+'</span>". '+MessageHelper.messages['_MSG_SEARCH_BTW_DID_YOU_MEAN']+'"<span class="highlight bold">'+dymTerm+'</span>"?.</p>');
        		}else{
        			$('.common-search').css('display', 'block');
        			$('.common-search__instead').html('<p>'+MessageHelper.messages['_MSG_SEARCH_SHOWING']+' 1-'+Object.keys(this.products).length+' '+MessageHelper.messages['_MSG_SEARCH_OF']+' '+recordSetTotal+' '+MessageHelper.messages['_MSG_SEARCH_RESULTS_FOR']+' "<span class="bold">'+searchTerm+'</span>".</p>');
        		}
        	}
        }
		
		$('#' + divId).ready(function(){
        	self.formatPage();	
        	 $('#noResultsContent').html("");
        });
		if(!this.cardESpotShownOnce) {
			this.showProductCardEspot();
		}
		if(searchTerm != "" && typeof searchTerm === 'string' && $('ul.breadcrumbs > li').length==1)
			$('.breadcrumbs li:contains(Home)').remove();

				
/*				if(isRefreshFilters || isRefreshPriceDiscount){
			    	  ProductHelper.init(currCatalogId.toString(),1, confListingProductCount,  WCParamJS.searchTerm);
		        }
*/				
        
    },


    /**
     * Creates this.products object for page rendering
     *  
     */
    createJSON: function(parentIds) {
        /*
         * products public variable format
         * ------------------------------
         * this.products = {
         *             product1:{
         * 
         *                 itemIds     : [ itemid1, itemid2, ... ],
         *                 itemDetails : {
         *                                 itemid1 : {
         *                                             attributes
         *                                           }, 
         *                                 itemid2 : {
         *                                             attributes
         *                                           }, 
         *                                 ...
         *                                },
         *                 currentItem : itemidX
         *             },
         *             
         *              product2 :  .......
         *            }
         * 
         */

    	// Does not overwrite products on lazyloads
        this.products = this.products || {};
        var itemArrayObject = [];
        var productObject = this.products;
        $.each(productObject, function(indx, productId) {
        	$.each(productId.itemIds, function(indx1, itemId) {
        		itemArrayObject.push(itemId)
        	});
        });
        var self = this;
        var constant=DMartAttributes.Constants;
        $.each(parentIds, function(indx, productId) {
            var productBean = self.products[productId] = {};

            productBean.productId = productId;
            productBean.itemIds = DMStorage.getValue('proditems_' + WCParamJS.storeId + productId);
            if(productBean.itemIds == null || productBean.itemIds.length <=0) {
            	return true;
            }
            var productDetails = DMStorage.getValue('prod_' + productId);
            var brandNameProd;
            var type;
            if(typeof productDetails != "undefined" && productDetails != null ){
            brandNameProd= productDetails.attribs.manufacturer;
            $.each(productDetails.attribs.attributes, function(count, attr) {                
                if (attr.name.toUpperCase() === constant.Grocery.Descriptive.CategoryType) {
                	type= attr.values[0].value.toLowerCase();
                }
            });
            // Fetch product name
            var productName =  productDetails.attribs.name;
            
            if (type != "" && type != undefined){
            	self.pageType=type;
            }
                      
			productBean.selectedItems = [];
			productBean.prodOutOfStock=true;
            productBean.itemDetails = {};
            $.each(productBean.itemIds, function(i, itemId) {
                var thisItem = DMStorage.getValue('item_' + itemId);
                //thisItem.outofstock = !thisItem.buyable;
                if (thisItem.thumbnail) {
                    thisItem.img_src = thisItem.thumbnail.replace("wcsstore/", "");
                } else {
                	if(self.pageType == "apparel"){
                		thisItem.img_src = 'DMartStoreFrontAssetStore/images/temp/plp/product-apparel-5.jpg';
                	}else{
                		thisItem.img_src = 'DMartStoreFrontAssetStore/images/temp/plp/product-1.jpg';
                	}
                }
                // Set product name
                thisItem.title = thisItem.title || productName || thisItem.name || thisItem.shortDescription || '';
                //thisItem.brand = self.getBrand(productId,thisItem) || thisItem.brand || thisItem.manufacturer;
                thisItem.brand=brandNameProd;
                
                //To redirect to brand page
               /* var brandFacetLSKey;
                if(typeof self.objKey == "undefined"){
                	if(typeof WCParamJS.categoryId != "undefined" && WCParamJS.categoryId != ""){
                		brandFacetLSKey = WCParamJS.categoryId;
                	}else if (typeof WCParamJS.searchTerm != "undefined" && WCParamJS.searchTerm != ""){
                		brandFacetLSKey = WCParamJS.searchTerm;
                	}else if(typeof WCParamJS.handledManufacturer != "undefined" && WCParamJS.handledManufacturer != ""){
                    	brandFacetLSKey = WCParamJS.handledManufacturer;
                    } 
                }else{
                	brandFacetLSKey = JSON.parse(self.objKey).category || JSON.parse(self.objKey).search;
                    if(JSON.parse(self.objKey).brand){
                    	brandFacetLSKey = JSON.parse(self.objKey).brand;
                    } 
                }                                               
                thisItem.brandFacet= DMStorage.getValue('brandFacet_' +brandFacetLSKey);*/
                //To redirect to brand page
                
                /*if (thisItem.brand === '' || typeof thisItem.brand === 'undefined' ){
                   	thisItem.brand=brandNameProd;
                }*/
                    

                // Bound to change
                var priceObj = {
                    offerPrice: 0,
                    sellingPrice: 0,
                    savings: 0
                };
                
                var priceCache = DMStorage.getValue('item_PriceInv_' +WCParamJS.storeId + itemId);
                if (priceCache) {
                    priceObj.offerPrice = parseFloat(priceCache.offerPrice).toFixed(2);
                    priceObj.sellingPrice = parseFloat(priceCache.sellingPrice).toFixed(2);
                }
                else{
                	if(itemArrayObject>0){
                		ProductHelper.fetchIndividualPriceAndInvDetails(itemArrayObject);
                	}else{
                		ProductHelper.fetchIndividualPriceAndInvDetails(productBean.itemIds);
                	}                	
                	priceCache = DMStorage.getValue('item_PriceInv_' +WCParamJS.storeId + itemId);
					if (priceCache) {
						priceObj.offerPrice = parseFloat(priceCache.offerPrice).toFixed(2);
						priceObj.sellingPrice = parseFloat(priceCache.sellingPrice).toFixed(2);
					}
                }
               if(priceCache && typeof priceCache.inventoryStatus !='undefined'){
			   
            	   if(priceCache.inventoryStatus){
	            	   productBean.prodOutOfStock=false;
	            	   thisItem.outofstock = false;
            	   }
				   else{
					   thisItem.outofstock = true;
				   }
               }
               else{
            	   thisItem.outofstock = true;
               }
                //thisItem.outofstock = !priceCache.inventoryStatus;
                priceObj.savings = 0.0;               
                thisItem.priceExists=true;
                if (typeof priceObj.offerPrice == "undefined" || priceObj.offerPrice == 0 || priceObj.offerPrice ==null || isNaN(priceObj.offerPrice)){
                	priceObj.offerPrice = 0;
                	thisItem.priceExists=false;
                }
                if (typeof priceObj.sellingPrice == "undefined" || priceObj.sellingPrice == 0 || priceObj.sellingPrice ==null || isNaN(priceObj.sellingPrice)){
                	priceObj.sellingPrice = 0;
                	thisItem.priceExists=false;
                }
                if((typeof priceObj.offerPrice != "undefined" && priceObj.offerPrice != 0 && priceObj.offerPrice !=null)&&(Number(priceObj.offerPrice) < Number(priceObj.sellingPrice))){
               	 priceObj.savings = +(priceObj.sellingPrice - priceObj.offerPrice).toFixed(2);
               	 thisItem.priceExists=true;
               }

                thisItem.price = priceObj;
                
                thisItem.qtyInCart = 0;
				thisItem.orderItemId = 0;

                productBean.itemDetails[itemId] = thisItem;
                thisItem.definingAttributes = self.getItemDefiningAttributes(productBean.itemDetails[itemId].attributes, itemId);
        	
                thisItem.imageObjs = self.getImageURLs(thisItem,'images/DMart/products/');
                
                thisItem.maxOrderQty = self.getMaxOrderQty(thisItem);
                if(thisItem.maxOrderQty == 0){
                	thisItem.maxOrderQty=confMaxOrderQty;
                }
                
                if(type === "grocery") {
                	thisItem.vegNonvegFlag = self.getVegNonvegIndicator(thisItem);
                }
                
                thisItem.hasPromotionApplicable = thisItem.promotion_Flag === '1' &&
						            	(((thisItem.promotion_Store.indexOf(WCParamJS.storeId)>-1 || 
						            			thisItem.promotion_Store.indexOf('10101')>-1))|| 
						                	  (thisItem.promotion_Store==='10101' )
						                ); 
                
            });
            
            productBean.isSingleVariant = (typeof productBean.itemIds == 'undefined')?true:(productBean.itemIds.length==1);
            var defaultItemId = productBean.currentItem = self.getDefaultItem(productId,productBean.itemIds);
            if (typeof defaultItemId == 'undefined' || defaultItemId == null){
            	defaultItemId = productBean.currentItem = productBean.itemIds[0];
            }

            var defaultItem = productBean.itemDetails[defaultItemId];
            // May have to change this depending on SOLR response
            /*
             * Currently going through individual items and forming an attribute object.
             * (Data for displaying swatch and size slider)
             * 
             * Sample attributes object
             * ------------------------
             * {
             *    Size : ['1','2','3'],
             *    Color : ['Blue','Red','White'] 
             * }
             * 
             */
			productBean.pageType=self.pageType;
            productBean.attributes = self.getAttributesForProduct(productBean);

            productBean.currentAttributeCombo = defaultItem.definingAttributes;
            		
            productBean.totalQtyInCart = 0;
            productBean.selectedColor = '';
            productBean.selectedSize='';
            productBean.currentItemInCart='';
            productBean.totalPriceInCart = 0;
            productBean.totalSavingsInCart = 0;
            productBean.seoToken = productDetails.seo_token_ntk;
            productBean.categoryId = defaultItem.parentCatalogGroupID;
			productBean.applicableSizes= [];
			if(productBean.pageType === "apparel"){
            	$.each(productBean.itemDetails,function (index,itemDetail){
            		if(itemDetail.definingAttributes.Colour == productBean.currentAttributeCombo.Colour){
            			productBean.applicableSizes.push(itemDetail.definingAttributes.Size);
            		}
            	});
            }
            
			productBean.masterCategoryId = productDetails.attribs['catgroup_Identifier'] || '';
			
            self.products[productId] = productBean;
            }
        });


        this.updateCartDetails();
        
        return this.products;


    },
    
    checkInventoryForApparel : function(prodId,self){
        if(prodId && self){
     
        	var colour=$(self).parent().attr('data-color');
        	var current=$(self).parents('.plp-apparel__color-pallette').siblings('.product-listing-details').find('.slides li a');
        	var attributes=productListing.products[prodId].attributes.Size;
        	var size=productListing.products[prodId].attributes.Size;
        	$.each(size,function(){
    			var itemId=productListing.resolveSKU(prodId, {
                    Colour: colour,
                    Size: this.valueOf()
                });
    			
    			
    			var thisItem=productListing.products[prodId].itemDetails[itemId];
    			//var index=size.indexOf(this.valueOf());
    			//var now=$(current)[index];
    			// AE-16682
    			var now = $(self).parents('.product-listing-item__primary').find('.slides li a[title='+this.valueOf()+']');
    			if(thisItem && thisItem.outofstock){
    				$(now).removeClass('selected');
    				$(now).addClass('disabled');
    			}
    			else{
    				$(now).removeClass('disabled');
    			}
    		});
        }
        	else{
        	$.each($('.product-listing-item .plp-apparel__color-pallette').children('.selected'),function(){
        		var colour=$(this).attr('data-color');
        		var self=this;
        		var current=$(this).parent().siblings('.product-listing-details').find('.slides li a');
        		var prodId=$(this).parents('.product-listing-item.plp-apparel').attr('data-productid');
        		var size=productListing.products[prodId].attributes.Size;
				if(typeof size != "undefined"){
        		$.each(size,function(){
        			var itemId=productListing.resolveSKU(prodId, {
                        Colour: colour,
                        Size: this.valueOf()
                    });
        			var thisItem=productListing.products[prodId].itemDetails[itemId];
        			if(thisItem && thisItem.outofstock){
        				var index=size.indexOf(this.valueOf());
        				var now=$(current)[index];
        				$(now).addClass('disabled');
        				
        				if ($('.product-listing__quantity--select option[value='+itemId+']').length > 0){
            				$('.product-listing__quantity--select option[value='+itemId+']').remove();
            				$('.product-listing__quantity--select').selectric();
        				}
        				if ($('.product-listing_update_itemsize--select option[value='+itemId+']').length > 0){
        					$('.product-listing_update_itemsize--select option[value='+itemId+']').remove();
        				}
        			}
        		});
				}
        		});
        }
        },
    scrollPage : function(){
    	//var scrollPercent = 100 * $(window).scrollTop() / ($(document).height() - $(window).height());
    	var bottomOfProductsList = $('#apparellisting')[0].getBoundingClientRect().bottom;
        if ($(window).scrollTop() + $(window).height() > bottomOfProductsList && !this.lazyLoadActive && productListing.hasProducts()) {
    	//if(scrollPercent > 10 && !this.lazyLoadActive) {
            curPageNum = curPageNum + 1;
            this.lazyLoadActive = true;
            ProductHelper.init($('#plpCategoryId').val(), curPageNum, confListingProductCount, WCParamJS.searchTerm);
        }
        
                //Remember filters on page reload
                var filtersLSKey= currCatalogId || searchTerm; 
                if(WCParamJS.handledManufacturer){
                	filtersLSKey = WCParamJS.handledManufacturer; 
          		}
          	  	if(DMStorage.getValue('scrollPosition_' +filtersLSKey)){
          	  		DMStorage.remove('scrollPosition_' +filtersLSKey);
          	  	}
          	  	DMStorage.set('scrollPosition_' +filtersLSKey,$(window).scrollTop());
          	  	//Remember filters on page reload
    },
    hasProducts : function(){
    	return $('#apparellisting').find('.product-listing-item.plp-grocery').length > 0;
    },
	padLeft : function(nr, n, str){
		return Array(n-String(nr).length+1).join(str||'0')+nr;
	},
    getImageURLs : function(items,relativeURL){
	    var imageObj = {};
	    var constants=DMartAttributes.Constants.Grocery.Descriptive;
	   	$.each(items.attributes, function(index, attrib) {
	   	    if (attrib.usage === 'Descriptive') {
	   		if (attrib.identifier == constants.ImageDisplayCode) {
	   		    imageObj['imageFlag'] = productListing.padLeft(parseInt(attrib.values[0].value).toString(2),16,"0");
	   		}
	   		if (attrib.identifier == constants.ImageDisplayKey) {
	   		    imageObj['imageIdentifier'] = attrib.values[0].value;
	   		}
	   	    }
	   	});
	   	if (!imageObj['imageIdentifier']) {
	   	    imageObj['imageIdentifier'] = items.partNumber;
	   	}
	   	var imageURLs = [];
	   	if(imageObj.imageFlag){
	   	$.each(imageObj.imageFlag.split(''), function(index, flag) {
	   		if(flag == '1'){
	   			var imageNameWithPath = imageObj.imageIdentifier.replace(/(\S)(\S)(\S)\S*/,'$1/$2/$3/'+imageObj.imageIdentifier);
	   			imageURLs.push(WCParamJS.imageServerHost+relativeURL+imageNameWithPath + '_' + parseInt(index + 1) + '_M.jpg');
	   		}
	   	});
	   	}
		return imageURLs;
    },
    /**
     * 
     */
    getAttributesForProduct: function(productBean) {
        var items = productBean.itemDetails,
            itemid, attribs,
            attributeList = {},
            anAttribute, name, value, currentAttribute;
        // For each item of the product...
        for (itemid in items) {
            // For each defining attribute of the item ...
            for (name in items[itemid].definingAttributes) {

                value = items[itemid].definingAttributes[name];
                currentAttribute = attributeList[name];
                if (!currentAttribute) {
                    currentAttribute = [value];
                } else {
                    if (currentAttribute.indexOf(value) === -1) {
                        currentAttribute.push(value);
                    }
                }
                attributeList[name] = currentAttribute;
            }

        }

        return attributeList;

    },
    resolveSKU: function(productId, attribCombo) {
        var name, value, itemid, itmAttrValue, thisItem;
        var itemsList = this.products[productId].itemDetails;
        // Clone itemId list since JS is pass by reference
        var itemIdsSelected = this.products[productId].itemIds.slice();

        // For each item of the product...
        for (itemid in itemsList) {
            // For each defining attribute of the item ...
            thisItem = itemsList[itemid];
          if(Object.getOwnPropertyNames(thisItem.definingAttributes).length!==0){
            for (name in thisItem.definingAttributes) {
                // Attribute value for this item
                itmAttrValue = thisItem.definingAttributes[name];
                if(itmAttrValue) {
                // If the current attribute does not match, remove that item from list
                if (attribCombo[name] !== itmAttrValue && itemIdsSelected.indexOf(itemid)!=-1) {
                    itemIdsSelected.splice(itemIdsSelected.indexOf(itemid), 1);
	                }
                } else {
                	 var indexOfFaultyItem = itemIdsSelected.indexOf(itemid);
                	 if(indexOfFaultyItem && indexOfFaultyItem > -1) {
                		 itemIdsSelected.splice(indexOfFaultyItem, 1);
                	 }
                }
            }
        }else{
        	  if(itemid){
        	  itemIdsSelected.splice(itemIdsSelected.indexOf(itemid), 1);
        	  }
          }
        }
        // Set selected item as resolved SKU
        // Only one item should remain
        if (itemIdsSelected.length === 1) {
            return itemIdsSelected[0];
        }
        return null;
    },
    /**
     * Create a better item-level defining attributes object from the SOLR data
     * Parse array to find Defining attributes and return the combination.
     * 
     * 
     */
    getItemDefiningAttributes: function(attributes, itemid) {
        var attribCombo = {};
        /*var sizeAttributeConstants=DMartAttributes.Constants.SizeAttributeConstants;
        var colourAttributeConstants=DMartAttributes.Constants.Apparel.Defining.Colour;
        */
        
        $.each(attributes, function(index, attrib) {
            if (attrib.usage === 'Defining') {
            	var attribName = attrib.name;
            	if(attrib.identifier.toUpperCase().indexOf('COLOUR') === 0) {
            		attribName = 'Colour';
            	} else {
            		// Check if atleast one attribute begins with ['Size','Weight','Volume' etc]
/*            		var list = $.grep(sizeAttributeConstants,function(str){
            			return attrib.identifier.indexOf(str) === 0;
            		});
            		if(list.length>0) {*/
            			 attribName = 'Size';
            		//}
            		
            	}
                attribCombo[attribName] = attrib.values[0].value;
            }
        });
        return attribCombo;
    },
    
    /**
     *  Update cart details for all products in page
     */
    updateCartDetails :  function() {
        var cartJSON = DMStorage.getValue('OrderId');
        var self = this, itemTimeStamp = null;
        
        if(cartJSON === null) {
              return;
        }
        if(typeof cartJSON != 'undefined' && typeof cartJSON.orderItems != 'undefined' ){
	        $.each(self.products,function(indx,product) {
	            self.products[product.productId] = self.updateProductUsingCart(product,cartJSON);
	        });
        }
  
  },
  /**
   * Update cart details for a single product
   */
  updateProductUsingCart : function(product,cartJSON) {
	product.totalQtyInCart = 0;
    product.totalPriceInCart = 0;
    product.totalSavingsInCart = 0;
   if(typeof cartJSON != 'undefined' && typeof cartJSON.orderItems != 'undefined' ){
	// Reset item quantities to zero as well
	if(product.itemDetails) {
		$.each(product.itemDetails,function(itemId,item) {
				product.itemDetails[itemId].qtyInCart = 0;
				product.itemDetails[itemId].freeGiftQty = 0;
		});
	}
	$.each(cartJSON.orderItems,function(indx,orderItem) {
              itemTimeStamp = null;
              var thisCatentryId = orderItem.catentryId;
              if(typeof product.itemDetails != 'undefined') {
              if(product.itemDetails[thisCatentryId]) {
              	  var qty = parseInt(orderItem.quantity);
              	  if(orderItem.freeGift == "true"){              		
              		product.itemDetails[thisCatentryId].freeGiftQty = qty;
              		qty = 0;
              	  } else {
              	    	product.itemDetails[thisCatentryId].qtyInCart = qty;
              	  }
                                        
                    if(orderItem.freeGift == "true"){
                    	if(product.itemDetails[thisCatentryId].orderItemId == 0){
                    		product.itemDetails[thisCatentryId].orderItemId = orderItem.orderItemId;
                    	}
                    }else{
                    	product.itemDetails[thisCatentryId].orderItemId = orderItem.orderItemId;
                    }
                    product.totalQtyInCart += qty;
                    //product.totalPriceInCart += parseFloat(product.itemDetails[thisCatentryId].price.offerPrice) * qty;
                    product.totalPriceInCart = parseFloat(product.totalPriceInCart) +  orderItem.price;
                    
                    var savings = orderItem.savings;
                    
                    //product.totalPriceInCart = parseFloat(product.totalPriceInCart) +  parseFloat(product.itemDetails[thisCatentryId].price.offerPrice) * qty
                    ////product.totalSavingsInCart += parseFloat(product.itemDetails[thisCatentryId].price.savings) * qty;
					//product.totalSavingsInCart = parseFloat(product.totalSavingsInCart) + parseFloat(product.itemDetails[thisCatentryId].price.savings) * qty;
                    product.totalSavingsInCart = parseFloat(product.totalSavingsInCart) + savings;
					if(typeof product.totalPriceInCart == "number"){
						product.totalPriceInCart = product.totalPriceInCart.toFixed(2);
					}if(typeof product.totalSavingsInCart == "number"){
						product.totalSavingsInCart =product.totalSavingsInCart.toFixed(2);
					}			
					
                          product.selectedColor= product.itemDetails[thisCatentryId].definingAttributes.Colour;
                          product.selectedSize=product.itemDetails[thisCatentryId].definingAttributes.Size;
                          product.currentItemInCart=thisCatentryId;
                    if(itemTimeStamp !== null && new Date(itemTimeStamp) < new Date(orderItem.lastUpdateDate) ) {
                          product.currentItem = orderItem.catentryId;
                          itemTimeStamp = orderItem.lastUpdateDate;
                          }
                    }
              	}
              });
   }
  	return product;
  },
  
  updateCardsForInTrolley : function() {
	  var self = this;
	  $.each(this.products,function(indx, product){
		  if(product.totalQtyInCart>0) {
			  self.productCardForAddOrUpdate(product.productId);
		  }else{
			  var $parents = $('.product-listing-item[data-productid='+product.productId+']');
			  if ($($parents).parents().find("#frequent").length ==0){
				  if($parents.hasClass('product-added-to-cart')){
					  var totalQtyInCart = product.totalQtyInCart;
					  var totalSavingsInCart = product.totalSavingsInCart;
					  var totalPriceInCart = product.totalPriceInCart;

						$parents.find('.badge').html(totalQtyInCart);
						if(totalQtyInCart == 1){
							$parents.find('.product-listing__total-items').html('Total of '+totalQtyInCart+' Pack Added to Cart');
							$parents.find('.product-listing__total-items--list-view').html('Total of '+totalQtyInCart+' Pack Added to Cart');
						}
						else{
							$parents.find('.product-listing__total-items').html('Total of '+totalQtyInCart+' Packs Added to Cart');
							$parents.find('.product-listing__total-items--list-view').html('Total of '+totalQtyInCart+' Packs Added to Cart');
						}
						if(totalSavingsInCart > 0){
							$parents.find('.product-price__saving').html('Your Savings <span><i class="icon-rupees"></i>'+totalSavingsInCart+'</span>');
							$parents.find('.product-price__saving').css('display','block');
						}
						$parents.find('.product-price__total').html('Total Price <i class="icon-rupees"></i>'+totalPriceInCart);
						
						$parents.find('.added-product-wrap__list').remove();
						
						$parents.find('.added-product-details').hide();
						$parents.find('.added-product-wrap ul li').find('.custom-dropdown').removeClass('primary-border');
						
						if($parents.hasClass('plp-grocery')) {
							$parents.find('.product-listing__cta-container').show();
							$parents.find('.product-listing-item__primary').find('.product-listing--image').removeClass('small');
							$parents.find('.slides a.selected span').remove();
							$parents.find('.slides a.selected').removeClass('selected');
							$parents.find('.product-listing__save, .product-listing__size-guide, .plp-grocery__color-pallette').show();
							$parents.find('.plp-grocery__color-pallette-alt').hide();
						} else {
							$parents.find('.product-listing-details').show();
							$parents.find('.product-listing__cta-container').hide();
						}
						
						$parents.find('.product-listing-item__secondary').css('display', 'none');
						$parents.removeClass('product-added-to-cart');
						$parents.find('.product-listing-item__primary, .product-listing-details, .product-listing--original-price, .product-listing--discounted-price, .product-listing__quantity-secondary').fadeIn();
						
						$parents.find('.product-listing--image').addClass('small'); 
						/*$('select').selectric();
						//$('.added-product-wrap select, .product-listing-item__secondary .add-product-other-quantity select').selectric('destroy');
						$('.added-product-wrap select').selectric('destroy').parent().addClass('custom-dropdown');
						$('.product-listing-item__secondary .add-product-other-quantity select').selectric('destroy');
						$('.slide-margin .product-listing__quantity--select, .product-listing__quantity-other--select').selectric('destroy');
						*/
						
						$parents.find('.product-listing__quantity-secondary select').selectric({
							maxHeight: 170
						});
						$parents.find('.product-listing__quantity-other--select').selectric();
						if($parents.hasClass('plp-apparel')) {
							$parents.find('.slider-variant li a').each(function(){ 
								$(this).removeClass('selected');
								$(this).removeClass('addedToCart');
								$(this).html($(this).attr('title'));
							});
							$parents.find('.plp-apparel__color-pallette').show();
							$parents.find('.plp-apparel__color-pallette-alt').hide();
							var defaultItemId = productListing.products[product.productId].itemIds[0];
							var defaultItemDetails = productListing.products[product.productId].itemDetails[defaultItemId];
							$parents.find('.product-listing-details .product-listing--original-price .strike-diagonal').html('<i class="icon-rupees"></i>' + defaultItemDetails.price.sellingPrice);
							$parents.find('.product-listing-details .product-listing--discounted-price').html('DMart <i class="icon-rupees"></i>' + defaultItemDetails.price.offerPrice);
							$parents.find('.product-listing-details .product-listing__save .product-listing__save--price').html('<i class="icon-rupees"></i>' + defaultItemDetails.price.savings);
							$parents.find('.plp-apparel__color-pallette li').each(function(){
								$(this).removeClass('selected');
								if($(this).data('color') === defaultItemDetails.definingAttributes.Colour){
									$(this).addClass('selected');
								}
							});
							if(defaultItemDetails.price.savings != 0){
								$parents.find('.product-listing-details .product-listing__save ').show();
							}
						}
				  }
			  }			  
		  }
	  });
	  renderRupeeSymbolInDropDown();

  },
  
  productCardForAddOrUpdate : function (productId,updateObject){
	  var productCard = $('.product-listing-item[data-productid='+productId+']');
	  if ($(productCard).parents().find("#frequent").length ==0){
		  //productCard.find('.cart-icon').addClass('small');
		  productCard.find('.product-listing--original-price, .product-listing--discounted-price, .product-listing__quantity-secondary, .product-listing__cta-container, .product-listing__save').hide();
		  productCard.addClass('product-added-to-cart');
		  productCard.find('.added-product-wrap ul li').find('.custom-dropdown').removeClass('primary-border');
		  productCard.find('.product-listing-item__secondary').removeClass('js-hide-show');
		  if(!updateObject && this.products[productId]) {
			  updateObject = {
					  totalQtyInCart : this.products[productId].totalQtyInCart,
					  totalSavingsInCart : this.products[productId].totalSavingsInCart,
					  totalPriceInCart : this.products[productId].totalPriceInCart
			  };
		  }
		  
		  if(updateObject) {
			  productCard.find('.badge').html(updateObject.totalQtyInCart);
			  if(updateObject.totalQtyInCart == 1){
				productCard.find('.product-listing__total-items').html('Total of '+updateObject.totalQtyInCart+' Pack Added to Cart');
				productCard.find('.product-listing__total-items--list-view').html('Total of '+updateObject.totalQtyInCart+' Pack Added to Cart');
			  }
			  else{
				productCard.find('.product-listing__total-items').html('Total of '+updateObject.totalQtyInCart+' Packs Added to Cart');
				productCard.find('.product-listing__total-items--list-view').html('Total of '+updateObject.totalQtyInCart+' Packs Added to Cart');
			  }
			  updateObject.totalSavingsInCart  = Math.abs(updateObject.totalSavingsInCart).toFixed(2);
			  if(updateObject.totalSavingsInCart > 0){
				  productCard.find('.product-price__saving').html('Your Savings <span><i class="icon-rupees"></i>'+updateObject.totalSavingsInCart+'</span>');
				  productCard.find('.product-price__saving').css('display','block');
			  }
			  productCard.find('.product-price__total').html('Total Price <i class="icon-rupees"></i>'+updateObject.totalPriceInCart);
			  productCard.find('.added-product-wrap ul').empty();
				$.each(this.products[productId].itemDetails,function (index,itemDetail){
					if(itemDetail.qtyInCart > 0){
						if(productCard.find('.added-product-wrap__list[data-itemid="'+index+'"]').length) {
							productCard.find('.added-product-wrap__list[data-itemid="'+index+'"] .product-listing_update_quantity--select').val(itemDetail.qtyInCart);
						} else {
							nunjucks.configure(WCParamJS.staticServerHost +'templates/_modules/',{ autoescape: true, web : {useCache:true} });
							var  JSONdata = {
									product : productListing.products[productId],
									thisItemId : index
							};							
							var listItemElement = nunjucks.render('plpcard-added-items-list.nunjucks', {data:JSONdata});
							productCard.find('.added-product-wrap ul').append(listItemElement);
						}
						//fix for AE-11632
						var item = productListing.products[productId].currentItemInCart;
			            var colour= productListing.products[productId].itemDetails[item].definingAttributes.Colour;
						if(productCard.hasClass('plp-apparel') && itemDetail.definingAttributes.Colour == colour){
							productCard.find('.slider-variant li a').each(function(){
								if($(this).attr('title') === itemDetail.definingAttributes.Size && !$(this).hasClass('selected') && !$(this).hasClass('itemDeleted')){
									$(this).html(itemDetail.definingAttributes.Size+' <span>('+itemDetail.qtyInCart+')</span>');
									$(this).addClass('addedToCart');
								}
							});
						}
					}
				});
				// AE-16682 update OOS status correctly
				if(productCard.hasClass('plp-apparel')) {
					productListing.checkInventoryForApparel(productId,productCard.find('.js-plp-color-pallette li.selected a'));
				}
				productCard.find('.product-listing__quantity-secondary select').selectric({
					maxHeight: 170
				});
				productCard.find('.product-listing__quantity-other--select').selectric();
				
			    if(productCard.find('.plp-card--offer-text').css('display') == 'block'){
			    	productCard.find('.product-listing-item__primary').find('.product-listing--image').addClass('small');
			    }else{
			    	productCard.find('.product-listing-item__primary').find('.product-listing--image').removeClass('small');
			    }
		  }
	  }
	 

    /*if(typeof productId != 'undefined' &&  typeof productListing != 'undefined' && typeof productListing.products[productId] != 'undefined'){
        if(productListing.products[productId].totalQtyInCart > 0){
            var item = productListing.products[productId].currentItemInCart;
            var colour= productListing.products[productId].itemDetails[item].definingAttributes.Colour;
            var size= productListing.products[productId].itemDetails[item].definingAttributes.Size;
            productCard.find('.slider-variant li a').each(function(){
             	$(this).removeClass('selected');
             	$(this).html($(this).attr('title'));
                if($(this).attr('title') === size){
                     //$(this).addClass('selected');
                }
            });
            productCard.find('.slider-variant li a.selected').each(function(){
             	$(this).html(size+' <span>('+productListing.products[productId].itemDetails[item].qtyInCart+')</span>');
            });
            productCard.find('.plp-apparel__color-pallette li').each(function(){
             	$(this).removeClass('selected');
             		if($(this).data('color') === colour){
                     	// $(this).addClass('plp-apparel__color-pallette-alt');
                     	$(this).addClass('selected');
                    }
         	});
			$.each(productListing.products[productId].itemDetails,function (index,itemDetail){
				if(itemDetail.qtyInCart > 0 && itemDetail.definingAttributes.Colour == colour){
					productCard.find('.slider-variant li a').each(function(){
						if($(this).attr('title') === itemDetail.definingAttributes.Size && !$(this).hasClass('selected') && !$(this).hasClass('itemDeleted')){
							$(this).html(itemDetail.definingAttributes.Size+' <span>('+itemDetail.qtyInCart+')</span>');
							$(this).addClass('addedToCart');
						}
					});
				}
			});
			if(productCard.hasClass('plp-apparel')) {
		    	productCard.find('.plp-apparel__color-pallette').hide();
		    	productCard.find('.plp-apparel__color-pallette-alt').show();
		    }
			var isList = $('.plp-view-option__list').hasClass('active');
			var divToChange = productCard.parents('.js-switch-view');
			var addedProductLength = productCard.find('.added-product-wrap__list').length;
			var $parents, htmlcode, JSONdata = {};
			if(addedProductLength == 0 || typeof addedProductLength == 'undefined' ) {				
				nunjucks.configure(WCParamJS.imageServerHost+'DMartStoreFrontAssetStore/templates/',{ autoescape: true, web : {useCache:true} });
				 Nunjucks start 
				// Single element object for product data and single element arrat for product id
				JSONdata.product = {};
				JSONdata.product[productId] = productListing.products[productId];
				JSONdata.productIds = [productId];
				JSONdata.config=productListing.config;
				JSONdata.storeId = WCParamJS.storeId;
				JSONdata.homePageURL = WCParamJS.homepageURLHierarchy;
				if(productListing.products[productId].pageType === 'apparel'){
					htmlcode = nunjucks.render('product-listing-apparel-singleitem.nunjucks', {data:JSONdata});
				} else if(productListing.products[productId].pageType === 'grocery' || productListing.products[productId].pageType === 'general_merchandise'){
					htmlcode = nunjucks.render('product-listing-grocery-singleitem.nunjucks', {data:JSONdata});
				}

				//$(divToChange).html(htmlcode);

				$('.add-product-other-quantity select').selectric('refresh');
				$('.product-listing-item__secondary .add-product-other-quantity select').selectric('destroy');

				$('.added-product-wrap').perfectScrollbar( {
					suppressScrollX: true,
					swipePropagation: true
				});

				if(productListing.products[productId].pageType === 'apparel'){
					self = $(divToChange).find('.plp-apparel .plp-apparel__cta-button');
				} else if(productListing.products[productId].pageType === 'grocery' || productListing.products[productId].pageType === 'general_merchandise'){
					self = $(divToChange).find('.plp-grocery .product-listing__cta-button');
				}
				$parents = $(self).parents('.product-listing-item');   


				//List View
				if(isList){
					$parents.find('.product-listing--original-price, .product-listing--discounted-price, .product-listing__quantity-secondary, .product-listing__cta-container, .product-listing__total-items, .product-listing__save').hide();
					$parents.delay(2000).addClass('product-added-to-cart');
					$parents.find('.product-listing-item__secondary, .product-listing__total-items--list-view').css('display', 'block');
					$('.product-added-to-cart').find('.product-listing-item__secondary').css('display', 'block');

					//$('.plp-view-option a').removeClass('active');
					//$(this).addClass('active');
					$parents.addClass('view-list-active');
					$parents.find('.product-listing__total-items').hide();
					$parents.find('.product-added-to-cart .product-listing__total-items--list-view').show();
					//$parents.parents('.js-switch-view').prop('class', 'col-xs-12 js-switch-view');
					if($parents.hasClass('product-added-to-cart')) {
						$parents.find('.product-added-to-cart .product-listing-item__secondary').css('display', 'block');
					}
					$parents.removeAttr('style');
					$parents.find('.product-listing-item__tertiary').hide();
					$(self).parents('.product-listing-item__primary').find('.product-listing--title').show();

					$('select').selectric();
					$('.added-product-wrap select, .product-listing-item__secondary .add-product-other-quantity select').selectric('destroy');
					$('.slide-margin .product-listing__quantity--select, .product-listing__quantity-other--select').selectric('destroy');

					if($parents.hasClass('plp-apparel')) {
						$parents.find('.plp-apparel__color-pallette').hide();
						$parents.find('.plp-apparel__color-pallette-alt').show();
					}
				}else{
					if(!$parents.hasClass('view-list-active')) {
						$parents.find('.product-listing-item__primary').css('display', 'none');
						$parents.find('.product-listing-item__secondary').fadeIn();

						addedProductLength = $parents.find('.added-product-wrap .added-product-wrap__list').length;

						if(addedProductLength<=1) {
							$parents.find('.cart-icon').removeClass('small');
						}
						else {
							$parents.find('.cart-icon').addClass('small');
						}

						$parents.find('.product-listing--original-price, .product-listing--discounted-price, .product-listing__quantity-secondary, .product-listing__cta-container, .product-listing__save').hide();
						$parents.delay(2000).addClass('product-added-to-cart');
						$parents.find('.added-product-wrap ul li').find('.custom-dropdown').removeClass('primary-border');
					}
					else {
						$parents.find('.product-listing--original-price, .product-listing--discounted-price, .product-listing__quantity-secondary, .product-listing__cta-container, .product-listing__total-items, .product-listing__save').hide();
						$parents.delay(2000).addClass('product-added-to-cart');
						$parents.find('.product-listing-item__secondary, .product-listing__total-items--list-view').css('display', 'block');
					}
					if($parents.hasClass('view-list-active')) {
						$('.product-added-to-cart').find('.product-listing-item__secondary').css('display', 'block');
					}    

					$parents.find('.slider-variant').resize();  
				}
			}else{
				 Nunjucks start 
				// Single element object for product data and single element arrat for product id
				nunjucks.configure(WCParamJS.imageServerHost+'DMartStoreFrontAssetStore/templates/',{ autoescape: true, web : {useCache:true} });
				JSONdata.product = {};
				JSONdata.product[productId] = productListing.products[productId];
				JSONdata.productIds = [productId];
				JSONdata.config=productListing.config;
				JSONdata.storeId = WCParamJS.storeId;
				JSONdata.homePageURL=WCParamJS.homepageURLHierarchy;
				if(productListing.products[productId].pageType === 'apparel'){
					htmlcode = nunjucks.render('product-listing-apparel-singleitem.nunjucks', {data:JSONdata});
				} else if(productListing.products[productId].pageType === 'grocery' || productListing.products[productId].pageType === 'general_merchandise'){
					htmlcode = nunjucks.render('product-listing-grocery-singleitem.nunjucks', {data:JSONdata});
				}

				//$(divToChange).html(htmlcode);

				$('.add-product-other-quantity select').selectric('refresh');
				$('.product-listing-item__secondary .add-product-other-quantity select').selectric('destroy');

				$('.added-product-wrap').perfectScrollbar( {
					suppressScrollX: true,
					swipePropagation: true
				});

				if(productListing.products[productId].pageType === 'apparel'){
					self = $(divToChange).find('.plp-apparel .plp-apparel__cta-button');
				} else if(productListing.products[productId].pageType === 'grocery' || productListing.products[productId].pageType === 'general_merchandise'){
					self = $(divToChange).find('.plp-grocery .product-listing__cta-button');
				}
				$parents = $(self).parents('.product-listing-item');   
				
				//List View
				if(isList){
					$parents.find('.product-listing--original-price, .product-listing--discounted-price, .product-listing__quantity-secondary, .product-listing__cta-container, .product-listing__total-items, .product-listing__save').hide();
					$parents.delay(2000).addClass('product-added-to-cart');
					$parents.find('.product-listing-item__secondary, .product-listing__total-items--list-view').css('display', 'block');
					$('.product-added-to-cart').find('.product-listing-item__secondary').css('display', 'block');

					//$('.plp-view-option a').removeClass('active');
					//$(this).addClass('active');
					$parents.addClass('view-list-active');
					$parents.find('.product-listing__total-items').hide();
					$parents.find('.product-added-to-cart .product-listing__total-items--list-view').show();
					//$parents.parents('.js-switch-view').prop('class', 'col-xs-12 js-switch-view');
					if($parents.hasClass('product-added-to-cart')) {
						$parents.find('.product-added-to-cart .product-listing-item__secondary').css('display', 'block');
					}
					$parents.removeAttr('style');
					$parents.find('.product-listing-item__tertiary').hide();
					$(self).parents('.product-listing-item__primary').find('.product-listing--title').show();

					$('select').selectric();
					$('.added-product-wrap select, .product-listing-item__secondary .add-product-other-quantity select').selectric('destroy');
					$('.slide-margin .product-listing__quantity--select, .product-listing__quantity-other--select').selectric('destroy');

					if($parents.hasClass('plp-apparel')) {
						$parents.find('.plp-apparel__color-pallette').hide();
						$parents.find('.plp-apparel__color-pallette-alt').show();
					}
				}else{
					if(!$parents.hasClass('view-list-active')) {
						$parents.find('.product-listing-item__primary').css('display', 'none');
						$parents.find('.product-listing-item__secondary').fadeIn();

						addedProductLength = $parents.find('.added-product-wrap .added-product-wrap__list').length;

						if(addedProductLength<=1) {
							$parents.find('.cart-icon').removeClass('small');
						}
						else {
							$parents.find('.cart-icon').addClass('small');
						}

						$parents.find('.product-listing--original-price, .product-listing--discounted-price, .product-listing__quantity-secondary, .product-listing__cta-container, .product-listing__save').hide();
						$parents.delay(2000).addClass('product-added-to-cart');
						$parents.find('.added-product-wrap ul li').find('.custom-dropdown').removeClass('primary-border');
					}
					else {
						$parents.find('.product-listing--original-price, .product-listing--discounted-price, .product-listing__quantity-secondary, .product-listing__cta-container, .product-listing__total-items, .product-listing__save').hide();
						$parents.delay(2000).addClass('product-added-to-cart');
						$parents.find('.product-listing-item__secondary, .product-listing__total-items--list-view').css('display', 'block');
					}
					if($parents.hasClass('view-list-active')) {
						$('.product-added-to-cart').find('.product-listing-item__secondary').css('display', 'block');
					} 

					$parents.find('.slider-variant').resize();  
				}
				//fix for AE-10795
				$.each(productListing.products[productId].itemDetails,function (index,itemDetail){
					if(itemDetail.qtyInCart > 0){
						productCard.find('.added-product-wrap__list[data-itemid="'+index+'"] .product-listing_update_quantity--select').val(itemDetail.qtyInCart);
					}
				});
			}
        }
    }*/
	  
  },  
  productCardForRemove : function(productId, itemId) {
	  var productCard = $('.product-listing-item[data-productid='+productId+']');
	  productCard.find('.product-listing--original-price, .product-listing--discounted-price, .product-listing__quantity-secondary, .product-listing__cta-container, .product-listing__save').show();
	  productCard.find('.product-listing-item__secondary').css('display', 'none');
	  productCard.removeClass('product-added-to-cart');
	  // item id should be assigned to all the variant divs!
	  // Getting the item details from LS and refreshing the div
	  // Thanks you jQuery! TODO needs change. 
	  var itemData = DMStorage.getValue('item_'+itemId);
	  var sizeValue = undefined;
	  $.each(itemData.attributes, function(key, value) {
			if(value.usage =='Defining' && value.name=="SIZE_DAAPPAREL"){ 
				sizeValue = value.values[0].value;
				}
	  });
	  if(typeof sizeValue != 'undefined'){
		  var itemDiv = $(productCard).find(".slider-variant-wrap a:contains('"+sizeValue+" (')");
		  $(itemDiv).removeClass('addedToCart').removeClass('selected').text(sizeValue);
		  if($(productCard).find(".slider-variant-wrap").find('.addedToCart,.selected').length ==0){
			  $(productCard).find('.product-listing__cta-container.clearfix').hide(); 
		  }
	  }
	  // Fix issue with selectric plugin
	  $(productCard).find('.product-listing__quantity--select-weight').selectric();
	  $(productCard).find('.product-listing__quantity--select-quantity').selectric();
	  
	  if (productCard.hasClass('plp-apparel')) {
			var colour = productListing.products[productId].itemDetails[itemId].definingAttributes.Colour;
			var size = productListing.products[productId].itemDetails[itemId].definingAttributes.Size;
			productCard.find('.slider-variant li a').each(function() {

				if ($(this).attr('title') === size) {
					$(this).removeClass('selected');
					$(this).html($(this).attr('title'));
					$(this).removeClass('addedToCart');
					$(this).addClass('itemDeleted');
					  if($(productCard).find(".slider-variant-wrap").find('.addedToCart,.selected').length ==0){
						  $(productCard).find('.product-listing__cta-container.clearfix').hide(); 
					  }
				}
			});
	  }
	  productCard.find('.added-product-wrap__list[data-itemid="'+itemId+'"]').remove();
	  
	    if(productCard.find('.plp-card--offer-text').css('display') == 'block'){
	    	productCard.find('.product-listing-item__primary').find('.product-listing--image').addClass('small');
	    }else{
	    	productCard.find('.product-listing-item__primary').find('.product-listing--image').removeClass('small');
	    }
  },
  
  getBrand : function(productId,thisItem) {
	  var  brandName = '';
	  var constant=DMartAttributes.Constants.Grocery.Filters;
	  var constant1=DMartAttributes.Constants.HouseHold.Filters;
	  $.each(thisItem.attributes, function() {
		  if(this.identifier === constant.Brand || this.identifier === 'Brand' || this.identifier === constant1.Brand) {
			  brandName = this.values[0].value;
			  return ;
		  }
	  });
	  
	  return brandName;
  }, 
  formatPage : function (){
	// Render fancy dropdowns using Selectric plugin
     /* $('select').selectric();
      //$('.added-product-wrap select, .product-listing-item__secondary .add-product-other-quantity select').selectric('destroy');
      $('.added-product-wrap select').selectric('destroy').parent().addClass('custom-dropdown');
	  $('.product-listing-item__secondary .add-product-other-quantity select').selectric('destroy');
      $('.slide-margin .product-listing__quantity--select, .product-listing__quantity-other--select').selectric('destroy');
      */
	  
		$('.product-listing__quantity-secondary select').selectric({
			maxHeight: 170
		});
		$('.product-listing__quantity-other--select').selectric();
      // for variant slider
      $('.product-listing-item .slider-variant').flexslider({
          animation: 'slide',
          animationLoop: true,
          itemWidth: 45,
          itemMargin: 1,
          slideshow: false,
          controlNav: false,
          keyboard: false,
          reverse: false,
          minItems: 1,
          maxItems: 3,
          touch: false,
          useCSS: false,
          prevText: '<i class="icon-caret-left"></i>',
          nextText: '<i class="icon-caret-right"></i>',
          move: 1,
          start: function (index) {
            if(index.count <= 3) {
              index.find('.flex-direction-nav li a').addClass('disabled');
              // index.parent('.slider-variant-wrap').width(index.count * index.itemW);
              index.find('.flex-viewport').css('margin', '0');
              index.find('.flex-viewport li:last-child').css('borderRight', 'none');
              index.find('.flex-direction-nav').hide();
              index.find('.slides li').addClass('three-variant');
            }
            else {
              if($(window).width() <=1000) {
                index.parent('.slider-variant-wrap').width(190);
              }
            }

            if(index.count < 3) {
              // adding '.two-variant' class when two variants available with defined width by css
              index.find('.slides li').removeClass('three-variant').addClass('two-variant');
            }
            if(index.count < 2) {
              // adding '.one-variant' class when single variants available with defined width by css
              index.find('.slides li').removeClass('two-variant three-variant').addClass('one-variant');
            }
          }
      });
    // Make div scrollable  
  	$('.added-product-wrap').perfectScrollbar( {
		suppressScrollX: true,
		swipePropagation: true
	});
  	
      	
  	//fix for multiple ajax issue in IE
  	var ua = window.navigator.userAgent;		
    var msie = ua.indexOf("MSIE ");
    var trident = ua.indexOf('Trident/');
    var edge = ua.indexOf('Edge/');
    if (msie > 0 || trident > 0 || edge > 0) { 
    	$("#SimpleSearchForm_SearchTerm").focus();
    }
    this.checkOOSDefaultVariant();
  },    

  checkOOSDefaultVariant : function (){
	  $('.product-listing-item').each(function (count, element){
		  if(!$(element).hasClass('plp-grocery-offer')){
			  var productId= $(element).data('productid');	
			  var primaryContainer = $(element).find('.product-listing-item__primary');
			  var thisProduct = productListing.products[productId];
			  if(typeof thisProduct != "undefined" && thisProduct != null && typeof thisProduct.itemDetails != "undefined" && thisProduct.itemDetails != null){
				  var defaultItem = thisProduct.itemDetails[thisProduct.currentItem];
				  if(typeof defaultItem != "undefined" && defaultItem != null){
					  if(productListing.products[productId].pageType!= "apparel" && defaultItem.outofstock && thisProduct.totalQtyInCart==0 ){
						  var itemId= $(primaryContainer).find('.product-listing__quantity--select-weight option:selected').val();
						  productListing.products[productId].currentItem= itemId;
						  var thisItem =thisProduct.itemDetails[itemId];
						  if(typeof thisItem != "undefined" && thisItem != null && typeof thisItem.price != "undefined" && thisItem.price != null){
							  if(typeof thisItem.imageObjs != "undefined" && thisItem.imageObjs != null && thisItem.imageObjs.length ==1 && typeof thisItem.imageObjs[0] != "undefined" && thisItem.imageObjs[0] != null){
								  var img_src = thisItem.imageObjs[0].replace("wcsstore/", "");
								  $(primaryContainer).find('.product-listing--image').attr('src', WCParamJS.imageServerHost + img_src);
							  }
							  $(primaryContainer).find('.product-listing__save--price').html('<i class="icon-rupees"></i>' + thisItem.price.savings);
							  if($(primaryContainer).find('.product-listing-details .product-listing--original-price span').hasClass('no-strike-diagonal')){
								  $(primaryContainer).find('.product-listing-details .product-listing--original-price .no-strike-diagonal').html('<i class="icon-rupees"></i>' + thisItem.price.sellingPrice);
							  }else if($(primaryContainer).find('.product-listing-details .product-listing--original-price span').hasClass('strike-diagonal')){
								  $(primaryContainer).find('.product-listing-details .product-listing--original-price .strike-diagonal').html('<i class="icon-rupees"></i>' + thisItem.price.sellingPrice);
							  }
							  $(primaryContainer).find('.product-listing--discounted-price').html('DMart <i class="icon-rupees"></i>' + thisItem.price.offerPrice);
							  if(thisItem.price.savings > 0){
								  if($(primaryContainer).find('.product-listing-details .product-listing--original-price span').hasClass('no-strike-diagonal')){
									  $(primaryContainer).find('.product-listing-details .product-listing--original-price span').removeClass('no-strike-diagonal');
									  $(primaryContainer).find('.product-listing-details .product-listing--original-price span').addClass('strike-diagonal');
								  }
								  $(primaryContainer).find('.product-listing-details .product-listing--original-price').show();
							  }else if(thisItem.price.savings == 0){
								  if($(primaryContainer).find('.product-listing-details .product-listing--original-price span').hasClass('strike-diagonal')){
									  $(primaryContainer).find('.product-listing-details .product-listing--original-price span').removeClass('strike-diagonal');
									  $(primaryContainer).find('.product-listing-details .product-listing--original-price span').addClass('no-strike-diagonal');
								  }
								  $(primaryContainer).find('.product-listing-details .product-listing--original-price').show();
							  } else{
								  if($(primaryContainer).find('.product-listing-details .product-listing--original-price span').hasClass('strike-diagonal')){
									  $(primaryContainer).find('.product-listing-details .product-listing--original-price span').removeClass('strike-diagonal');
									  $(primaryContainer).find('.product-listing-details .product-listing--original-price span').addClass('no-strike-diagonal');
								  }
								  $(primaryContainer).find('.product-listing-details .product-listing--original-price').hide();
							  }
							  
						      var $parent= $(primaryContainer).find('.product-listing__quantity--select-quantity');
							  $parent.html("");
							    // Append to original select    
							  for(var i=1; i<=thisItem.maxOrderQty; i++){
							    	$parent.append("<option value='"+ i +"'>" + i + "</option>");
							  }   
							  $parent.selectric('refresh');
						  }			        		
					  }
				  }		        	
			  }
		  }	        	    	
	  });
  },
  
  getDefaultItem : function (productId,itemIds){
	  var thisProduct = this.products[productId];
	  var defaultItemId;
	  $.each(itemIds, function(i, itemId) {
	      var currentItemAttributes = thisProduct.itemDetails[itemId].attributes;	      
	      $.each(currentItemAttributes, function(index, attrib) {
	            if (attrib.name === 'DEFAULT VARIANT (Y/N)' && attrib.values[0].value == 'Y') {
	            	defaultItemId=itemId;
	            }
	        });
	  });
	  return defaultItemId;
  },
  
  getMaxOrderQty: function (thisItem){
	  var maxOrderQty=0;
	  $.each(thisItem.attributes, function(index, attrib) {
	   	    if (attrib.name === 'ITEMWISE') {
	   	    	maxOrderQty= attrib.values[0].value;
	   	    	return;
	   	    }
	   	});
	  return maxOrderQty;
  },
  
  getVegNonvegIndicator : function(thisItem) {
	  var indicator =0;
	  $.each(thisItem.attributes, function(index, attrib) {
	   	    if (attrib.name === DMartAttributes.Constants.Grocery.Descriptive.VegNonVegIndicator) {
	   	    	indicator= attrib.values[0].value;
	   	    	return;
	   	    }
	   	});
	  return indicator;
  },
  
  loadProductCardHotspot : function() {
	  facetNavigationDisplay.getHotspots('DMartProductCardESpot-'+WCParamJS.categoryId,'#plp-grocery-offer');
  },
    
    //Remember filters on page load
    updateChosenFilters : function (categoryId,searchTerm){
  	
  	  var filtersLSKey= categoryId || searchTerm; 
  	  var appliedFilters;
        if(this.objKey.brand){
        	filtersLSKey = WCParamJS.handledManufacturer; 
  		}
        var x=1, $applyFilter, filterValue, filterType, isRefresh=false,
        salePriceMin, salePriceMax, discountMin, discountMax, priceRange, priceArray=[],
        discountRange, discountArray=[], sortOption, viewChosen = getCookie('viewChosen'), scrollPosition;
        $('.filter-applied-list').html('');
        if(DMStorage.getValue('filtersChosen_' +filtersLSKey)){
        	appliedFilters = DMStorage.getValue('filtersChosen_' +filtersLSKey);
        	facetNavigationDisplay.selectedFilters = appliedFilters;
        	facetNavigationDisplay.hiliteSelectedFilters();
        	$.each(appliedFilters, function(index, filter) {
        		if(filter.filterType != 'priceRange' && filter.filterType != 'discountRange'){
        			/*var val =filter.filterValue.replace(/ /g, "");*/

            		$applyFilter = '<li><a href="javascript:;" data-filtertype = "'+filter.filterType+'" data-filtervalue="'+filter.filterValue+'" id="filter-apply-'+index+'" rel="'+index+'">';
            		// If color show color div
            		if(typeof filter.filterValue === 'string' && filter.filterValue.indexOf('#') === 0){
            			$applyFilter += '<span class="type-color" style="background-color:'+filter.filterValue+' "></span>';
            		} else {
            			$applyFilter += '<span>'+filter.filterValue+'</span>';
            		}
            		$applyFilter += '<i class="filter-remove-cta icon-cross"></i></a></li>';
      	            $('.filter-applied-list').prepend($applyFilter);
        		}
        	});      
        	if($('.filter-applied-list li').length > 0) {
    	        $('.filter-module__applied').slideDown();
    	      }
    	      else {
    	        $('.filter-module__applied').slideUp();
    	      }        
        }
        
       /* if(DMStorage.getValue('viewChosen')){
      	  viewChosen = DMStorage.getValue('viewChosen');*/
      	  if(viewChosen == "list"){
      	      $('.plp-view-option a').removeClass('active');
      	      $('.plp-view-option .plp-view-option__list').addClass('active');
      	      $('.product-listing-item').addClass('view-list-active');
      	      $('.product-listing__total-items').hide();
      	      $('.product-added-to-cart .product-listing__total-items--list-view').show();
      	      $('.js-switch-view').prop('class', 'col-xs-12 js-switch-view');
      	      if($('.product-listing-item').hasClass('product-added-to-cart')) {
      	    	$('.product-added-to-cart .product-listing-item__secondary').css('display', 'block');
      	        if($('.product-listing-item').hasClass('plp-apparel')) {
      	        	$('.product-added-to-cart').find('.plp-apparel__color-pallette').hide();
      	        	$('.product-added-to-cart').find('.plp-apparel__color-pallette-alt').show();
      	        }
      	      }
      	      $('.product-listing-item').removeAttr('style');
      	      $('.product-listing-item__tertiary').hide();
      	  }
       // }
      /*  if(DMStorage.getValue('scrollPosition_' +filtersLSKey)){
      	  scrollPosition= DMStorage.getValue('scrollPosition_' +filtersLSKey);
      	  $(window).scrollTop(scrollPosition);
        } */
        
        if(DMStorage.getValue('sortOptionChosen_' +filtersLSKey)){
        	  sortOption = DMStorage.getValue('sortOptionChosen_' +filtersLSKey);
        	  $('.js-filter-sortby').val(sortOption);
            $('.js-filter-sortby').selectric('refresh');
            isRefresh=true;
        	  
          }
        
        return isRefresh;
    },
    
    updatePriceDiscountFilters : function (categoryId,searchTerm){
  	  if(this.formatRangeSlider){
  		  //for price, discount slider
  	      // Price Range Slider - default
  	      $('.js-filter-price-range').ionRangeSlider({
  	        type: 'double',
  	        min: 0,
  	        max: 10000,
  	        from: 0,
  	        to: 10000,
  	        prefix: '<i class="icon-rupees"></i>',
  	        prettify_enabled: true,
  	        prettify_separator: ',',
  	        force_edges: true
  	      });
  	      
  	      // Discount Range Slider - default
  	      $('.js-filter-discount-range').ionRangeSlider({
  	        type: 'double',
  	        min: 0,
  	        max: 100,
  	        from: 0,
  	        to: 100,
  	        postfix: '%',
  	        prettify_enabled: true,
  	        prettify_separator: ',',
  	        force_edges: true
  	      });
  	      this.formatRangeSlider=false;
  	  }  
        
      var filtersLSKey= categoryId || searchTerm; 
  	  var appliedFilters;
        if(this.objKey.brand){
        	filtersLSKey = WCParamJS.handledManufacturer; 
  		}
        var isRefresh=false, salePriceMin, salePriceMax, discountMin, discountMax, priceRange, priceArray=[],
        discountRange, discountArray=[], elementToShow;
        if(DMStorage.getValue('priceRangeChosen_' +filtersLSKey)){
      	  priceRange = DMStorage.getValue('priceRangeChosen_' +filtersLSKey);
      	  priceArray = priceRange.split('-');
      	  if(!($('.filter-price.filter-mobile-view').is(":visible"))){
      		  salePriceMin=$('.js-filter-price-range').data('ionRangeSlider').result.from;
            	  salePriceMax= $('.js-filter-price-range').data('ionRangeSlider').result.to;
            	  if(salePriceMin != priceArray[0] || salePriceMax != priceArray[1]){
            		$('.js-filter-price-range').data('ionRangeSlider').update({
            	        from : priceArray[0], to: priceArray[1]
          		  });
          		isRefresh=true;
            	  }
      	  }else if($('.filter-price.filter-mobile-view').is(":visible")){
      		  if (typeof priceArray[0] != 'undefined' && typeof priceArray[1] != 'undefined'){
      			  salePriceMin=$('.filter-price').find('.filter-sortby').find("option:selected").data('min');
                	  salePriceMax = $('.filter-price').find('.filter-sortby').find("option:selected").data('max');
                	  if(salePriceMin != priceArray[0] || salePriceMax != priceArray[1]){
                		elementToShow= $(".filter-price.filter-mobile-view .filter-sortby[data-min="+priceArray[0]+"][data-max="+priceArray[1]+"]");
                		$('.filter-price.filter-mobile-view .filter-sortby').value=elementToShow;
                		isRefresh=true;  
                	  }
      		  }
      	  }
        }
        if(DMStorage.getValue('discountRangeChosen_' +filtersLSKey)){
      	  discountRange = DMStorage.getValue('discountRangeChosen_' +filtersLSKey);
      	  discountArray = discountRange.split('-');
      	  if(!($('.filter-discounts.filter-mobile-view').is(":visible"))){
      		  discountMin=$('.js-filter-discount-range').data('ionRangeSlider').result.from;
            	  discountMax= $('.js-filter-discount-range').data('ionRangeSlider').result.to;
            	  if(discountMin != discountArray[0] || discountMax != discountArray[1]){
            		$('.js-filter-discount-range').data('ionRangeSlider').update({
            	        from : discountArray[0], to: discountArray[1]
          		  });          		
          		  isRefresh=true;
            	  }
      	  }else if($('.filter-discounts.filter-mobile-view').is(":visible")){
      		  if (typeof discountArray[0] != 'undefined' && typeof discountArray[1] != 'undefined'){
      			  discountMin=$('.filter-discounts').find('.filter-sortby').find("option:selected").data('min');
                	  discountMax = $('.filter-discounts').find('.filter-sortby').find("option:selected").data('max');
                	  if(discountMin != discountArray[0] || discountMax != discountArray[1]){
                		elementToShow= $(".filter-discounts.filter-mobile-view .filter-sortby[data-min="+priceArray[0]+"][data-max="+priceArray[1]+"]");
                		$('.filter-discounts.filter-mobile-view .filter-sortby').value=elementToShow;
                		isRefresh=true;
                	  }
      		  }
      	  }
        }
        return isRefresh;
  },
  
  showProductCardEspot : function() {
	  // If the content is available, then reposition and show the espot card
	  if($('#plp-grocery-offer').length >0 && $.trim($('#plp-grocery-offer').html()).length>0) {
			 var pos = ($('#plp-grocery-offer').find('input[name=position]').length>0)?parseInt($('#plp-grocery-offer').find('input[name=position]').val()):1;
			 // Handling data issues and revert to defaults
			 if(isNaN(pos) || pos<0) {
				 pos = 1;
			 }
			 var $espotCard = $('#plp-grocery-offer').parents('.js-switch-view');
			 if($('#apparellisting .js-switch-view').length >= pos) {
				 $espotCard.insertBefore($('#apparellisting .col-xs-12.col-md-4.col-lg-3.js-switch-view:nth-of-type('+pos+')'));
				 $espotCard.removeClass('js-hide-show');
				 this.cardESpotShownOnce = true;
				 // Once it is loaded remove the function. No need for unnecessary ifs
				 //this.showProductCardEspot = function() {};
			 } else if(productListing.noMoreProductsToShow) {
				 
				 pos = $('#apparellisting .js-switch-view').length;
				 $espotCard.insertAfter($('#apparellisting .col-xs-12.col-md-4.col-lg-3.js-switch-view:nth-of-type('+pos+')'));
				 $espotCard.removeClass('js-hide-show');
				 this.cardESpotShownOnce = true;
				 // Once it is loaded remove the function. No need for unnecessary ifs
				 //this.showProductCardEspot = function() {};
			 }
		}
  }
  
  
};

// SKU resolution on click of slider for apparel
$(document).ready(function() {
	
	if((typeof ClpHelper != 'undefined') &&  ClpHelper.pageMode != 'CLP'){
	if($('#apparellisting').length) {
		$(window).scroll(productListing.scrollPage);
	}
	
	$(document).off('dmart.productcard.select.slideritem').on('dmart.productcard.select.slideritem', function(event, self) {
    //$('.slider-variant .slides a').on('dmart.productcard.select.slideritem', function(event,self) {
        var primaryContainer = $(self).parents('.product-listing-item__primary');

        var productId = $(self).parents('.product-listing-item').data('productid');
        
        var color = $(primaryContainer).find('.plp-apparel__color-pallette .selected').data('color');
        var attrValue = $(primaryContainer).find('.slider-variant .slides .selected').attr('title');
        // TODO: color to be obtained using selected swatch data

        var thisProduct = productListing.products[productId];
        var thisItemId;
        
        if(typeof $(self).attr('rel') != 'undefined' && $(self).attr('rel').search("colorPallete")==0 ){
	    	   var $parent= $(primaryContainer).find('.slider-variant ul.slides');
	    	   $parent.html("");
	    	   var totalVariants = Object.keys(productListing.products[productId].itemDetails).length;
	    	   $.each(productListing.products[productId].itemDetails,function (index,itemDetail){
		        	if(itemDetail.definingAttributes.Colour == color){
		        		if(totalVariants==1){
		        			$($parent).append('<li class="one-variant"><a href="javascript:;" title="'+itemDetail.definingAttributes.Size+'">'+itemDetail.definingAttributes.Size+'</a></li>');
		        		}else if (totalVariants==2){
		        			$($parent).append('<li class="two-variant"><a href="javascript:;" title="'+itemDetail.definingAttributes.Size+'">'+itemDetail.definingAttributes.Size+'</a></li>');
		        		}else if (totalVariants==3){
		        			$($parent).append('<li class="three-variant"><a href="javascript:;" title="'+itemDetail.definingAttributes.Size+'">'+itemDetail.definingAttributes.Size+'</a></li>');
		        		}else{
		        			$($parent).append('<li><a href="javascript:;" title="'+itemDetail.definingAttributes.Size+'">'+itemDetail.definingAttributes.Size+'</a></li>');
		        		}
		        	}
		        });
	    	   
	   		var $slider = $('.product-listing-item[data-productid='+productId+'] .slider-variant');
	    	var clone = $slider.find('.slides li:last-child').clone();
	    	$slider.find('.slides li:last-child').remove();
	    	//$slider.data('flexslider',this);
	    	$slider.data('flexslider').addSlide(clone);
	    	$slider.find('.flex-direction-nav li a').removeClass('disabled');
	    	var count = $slider.find('.slides li').length;
	    	if(count <= 3) {
	    		$slider.find('.flex-direction-nav li a').addClass('disabled');
		    } else {
		    	$slider.find('.flex-direction-nav li a').removeClass('disabled');
		    }
	    	$(primaryContainer).find('.product-listing__cta-container').hide();
	    	productListing.checkInventoryForApparel(productId,self);
        }
        
        if(color != undefined && color != null && attrValue != undefined && attrValue != null ){
        	 thisItemId = productListing.resolveSKU(productId, {
                 Colour: color,
                 Size: attrValue
             });
        }
       
        var SKUs = [];
        SKUs.push(thisItemId);
        
        (color != undefined && color != null &&  attrValue == undefined) ?
        		(DMAnalytics.events( DMAnalytics.Constants.Category.PLPPallette,
        				productId+" : "+ color, document.title, 0, null ))
                		: (DMAnalytics.events( DMAnalytics.Constants.Category.PLPPallette,
                				productId+" : "+color+" : "+attrValue, document.title, 0, null ));
        		
       if(productListing.products[productId].pageType === "apparel"){	
    	   if (typeof thisItemId != "undefined"){
       		$(primaryContainer).find('#plpImageSlider').attr("src",productListing.products[productId].itemDetails[thisItemId].imageObjs[0]);
       		$(primaryContainer).find('#plpImageSlider-1').attr("src",productListing.products[productId].itemDetails[thisItemId].imageObjs[0]);
    		  // $(primaryContainer).find('#plpImageSlider').attr("src",'/webapp/wcs/stores/servlet/DMartStoreFrontAssetStore/images/temp/plp/product-apparel-1.jpg');
       		}else{
       			if (typeof attrValue == "undefined"){
       				var tempSize = $(primaryContainer).find('.slider-variant .slides li:first-child a').attr('title');
       				var tempItem = productListing.resolveSKU(productId, {
                       Colour: color,
                       Size: tempSize
       				});
       				$(primaryContainer).find('#plpImageSlider').attr("src",productListing.products[productId].itemDetails[tempItem].imageObjs[0]);
       				$(primaryContainer).find('#plpImageSlider-1').attr("src",productListing.products[productId].itemDetails[tempItem].imageObjs[0]);
       				//$(primaryContainer).find('#plpImageSlider').attr("src",'/webapp/wcs/stores/servlet/DMartStoreFrontAssetStore/images/temp/plp/product-apparel-1.jpg');
       			}
       		}
    	   		$(primaryContainer).find('#plpImageSlider').css('opacity', 0).removeClass('active');
    	   		$(primaryContainer).find('#plpImageSlider').animate({
		        opacity: 1
		      }, 600).addClass('active');
       }
        
        if (null === thisItemId || thisItemId == undefined) {
            return;
        }
        
        productListing.products[productId].currentItem = thisItemId;
        productListing.products[productId].currentAttributeCombo = {
            Colour: color,
            Size: attrValue
        };
		productListing.products[productId].applicableSizes= [];
        if(productListing.products[productId].pageType === "apparel"){
        	$.each(productListing.products[productId].itemDetails,function (index,itemDetail){
        		if(itemDetail.definingAttributes.Colour == productListing.products[productId].currentAttributeCombo.Colour){
        			productListing.products[productId].applicableSizes.push(itemDetail.definingAttributes.Size);
        		}
        	});
        }

        // Using plain jQuery to set the resolved items
        // May have to change this and replace with nunjucks
        var selectedItem = thisProduct.itemDetails[thisItemId];
        thisProduct.selectedItems = SKUs;        
        
        // Bug fix
        // $(primaryContainer).find('.product-listing--title a').text(selectedItem.title);
        $(primaryContainer).find('.product-listing--brand a').text(selectedItem.brand);
        if(productListing.products[productId].pageType != "apparel"){
        	$(primaryContainer).find('.product-listing--image').attr('src', WCParamJS.imageServerHost + selectedItem.img_src);
        }
        
        if($(primaryContainer).find('.product-listing-details .product-listing--original-price span').hasClass('no-strike-diagonal')){
            $(primaryContainer).find('.product-listing-details .product-listing--original-price .no-strike-diagonal').html('<i class="icon-rupees"></i>' + selectedItem.price.sellingPrice);
        }else if($(primaryContainer).find('.product-listing-details .product-listing--original-price span').hasClass('strike-diagonal')){
    		$(primaryContainer).find('.product-listing-details .product-listing--original-price .strike-diagonal').html('<i class="icon-rupees"></i>' + selectedItem.price.sellingPrice);
        }
        //$(primaryContainer).find('.product-listing--original-price .strike-diagonal').html('<i class="icon-rupees"></i>' + selectedItem.price.sellingPrice);
        $(primaryContainer).find('.product-listing--discounted-price').html('DMart <i class="icon-rupees"></i>' + selectedItem.price.offerPrice);
        $(primaryContainer).find('.product-listing__save--price').html('<i class="icon-rupees"></i>' + selectedItem.price.savings);
        $(primaryContainer).find('.product-listing__save').show();
        if($(primaryContainer).find('.product-listing__save').css('visibility') === 'hidden'){
        	$(primaryContainer).find('.product-listing__save').css('visibility','visible');
        }
        if (selectedItem.price.savings <= 0) {
            $(primaryContainer).find('.product-listing-details .product-listing__save').hide();
        }else{
        	$(primaryContainer).find('.product-listing-details .product-listing__save').show();
        }
        if(selectedItem.price.savings > 0){
        	if($(primaryContainer).find('.product-listing-details .product-listing--original-price span').hasClass('no-strike-diagonal')){
        		$(primaryContainer).find('.product-listing-details .product-listing--original-price span').removeClass('no-strike-diagonal');
        		$(primaryContainer).find('.product-listing-details .product-listing--original-price span').addClass('strike-diagonal');
        	}
        	$(primaryContainer).find('.product-listing-details .product-listing--original-price').show();
        }else if(selectedItem.price.savings == 0){
        	if($(primaryContainer).find('.product-listing-details .product-listing--original-price span').hasClass('strike-diagonal')){
        		$(primaryContainer).find('.product-listing-details .product-listing--original-price span').removeClass('strike-diagonal');
        		$(primaryContainer).find('.product-listing-details .product-listing--original-price span').addClass('no-strike-diagonal');
        	}
        	$(primaryContainer).find('.product-listing-details .product-listing--original-price').show();
        } else{
        	if($(primaryContainer).find('.product-listing-details .product-listing--original-price span').hasClass('strike-diagonal')){
        		$(primaryContainer).find('.product-listing-details .product-listing--original-price span').removeClass('strike-diagonal');
        		$(primaryContainer).find('.product-listing-details .product-listing--original-price span').addClass('no-strike-diagonal');
        	}
        	$(primaryContainer).find('.product-listing-details .product-listing--original-price').hide();
        }
        if(selectedItem.priceExists){        	
        	 if(productListing.products[productId].pageType != "apparel"){
        		 $(primaryContainer).find('.plp-apparel__cta-button').removeClass('button--disabled');
        	 }else{
        		 $(primaryContainer).find('.product-listing__cta-button').removeClass('button--disabled');
        	 }        	
        }        
        /*
         * Handle promotion text change
         */
        $(primaryContainer).find('.plp-card--offer-text').hide();
        if (selectedItem.promotion_Message && selectedItem.promotion_Flag === '1' &&
        	(($.isArray(selectedItem.promotion_Store) &&
        		(selectedItem.promotion_Store.indexOf(WCParamJS.storeId)>-1	|| selectedItem.promotion_Store.indexOf('10101')>-1)
        	  )
        	  || (selectedItem.promotion_Store === WCParamJS.storeId || selectedItem.promotion_Store==='10101' )
        	 )
        	){
        	$(primaryContainer).find('.plp-card--offer-text').html(selectedItem.promotion_Message);
        	$(primaryContainer).find('.plp-card--offer-text').show();
        } 

    });

    $(document).on('change','.product-listing__quantity--select-weight', function(event) {
        var primaryContainer = $(event.target).parents('.product-listing-item__primary');
        // For grocery item SKU resolution is simple
        var productId = $(event.target).parents('.product-listing-item').data('productid');
        var itemId = $(event.target).val();
        productListing.products[productId].currentItem = itemId;
        var itemAttribsList = productListing.products[productId].itemDetails[itemId].attributes;
        productListing.products[productId].currentAttributeCombo = productListing.getItemDefiningAttributes(itemAttribsList, itemId);

        // Using plain jQuery to set the resolved items
        // May have to change this and replace with nunjucks
        var selectedItem = productListing.products[productId].itemDetails[itemId];
        // Bug fix
        // $(primaryContainer).find('.product-listing--title a').text(selectedItem.title);
        $(primaryContainer).find('.product-listing--brand a').text(selectedItem.brand);
        //$(primaryContainer).find('.product-listing--image').attr('src', WCParamJS.imageServerHost + selectedItem.img_src);
        //
        if($(primaryContainer).find('.product-listing-details .product-listing--original-price span').hasClass('no-strike-diagonal')){
            $(primaryContainer).find('.product-listing-details .product-listing--original-price .no-strike-diagonal').html('<i class="icon-rupees"></i>' + selectedItem.price.sellingPrice);
        }else if($(primaryContainer).find('.product-listing-details .product-listing--original-price span').hasClass('strike-diagonal')){
    		$(primaryContainer).find('.product-listing-details .product-listing--original-price .strike-diagonal').html('<i class="icon-rupees"></i>' + selectedItem.price.sellingPrice);
        }
        $(primaryContainer).find('.product-listing-details .product-listing--discounted-price').html('DMart <i class="icon-rupees"></i>' + selectedItem.price.offerPrice);
        $(primaryContainer).find('.product-listing-details .product-listing__save--price').html('<i class="icon-rupees"></i>' + selectedItem.price.savings);
        if (selectedItem.price.savings <= 0) {
            $(primaryContainer).find('.product-listing-details .product-listing__save').hide();
        }else{
        	if($(primaryContainer).find('.product-listing__save').css('visibility') === 'hidden'){
            	$(primaryContainer).find('.product-listing__save').css('visibility','visible');
            }
        	$(primaryContainer).find('.product-listing-details .product-listing__save').show();
        }
        if(selectedItem.price.savings > 0){
        	if($(primaryContainer).find('.product-listing-details .product-listing--original-price span').hasClass('no-strike-diagonal')){
        		$(primaryContainer).find('.product-listing-details .product-listing--original-price span').removeClass('no-strike-diagonal');
        		$(primaryContainer).find('.product-listing-details .product-listing--original-price span').addClass('strike-diagonal');
        	}
        	$(primaryContainer).find('.product-listing-details .product-listing--original-price').show();
        }else if(selectedItem.price.savings == 0){
        	if($(primaryContainer).find('.product-listing-details .product-listing--original-price span').hasClass('strike-diagonal')){
        		$(primaryContainer).find('.product-listing-details .product-listing--original-price span').removeClass('strike-diagonal');
        		$(primaryContainer).find('.product-listing-details .product-listing--original-price span').addClass('no-strike-diagonal');
        	}
        	$(primaryContainer).find('.product-listing-details .product-listing--original-price').show();
        } else{
        	if($(primaryContainer).find('.product-listing-details .product-listing--original-price span').hasClass('strike-diagonal')){
        		$(primaryContainer).find('.product-listing-details .product-listing--original-price span').removeClass('strike-diagonal');
        		$(primaryContainer).find('.product-listing-details .product-listing--original-price span').addClass('no-strike-diagonal');
        	}
        	$(primaryContainer).find('.product-listing-details .product-listing--original-price').hide();
        }        
        if(selectedItem.priceExists){
        	$(primaryContainer).find('.product-listing__cta-button').removeClass('button--disabled');
        }
        /*
         * Handle promotion text change
         */
        $(primaryContainer).find('.plp-card--offer-text').hide();
        if (selectedItem.promotion_Message && selectedItem.promotion_Flag === 1 
        		&& (selectedItem.promotion_Store == WCParamJS.storeId || selectedItem.promotion_Store == '10101')) {
        	$(primaryContainer).find('.plp-card--offer-text').html(selectedItem.promotion_Message);
        	$(primaryContainer).find('.plp-card--offer-text').show();
        } 
        
        if($('.pdp-alternate-list__summary').length >0){
    	    //Updating the Total Price and TotalSavings on products deselect - Start
    	    var divs =$('.product-listing-item__primary input:checked');
    	    var newTotal=0.0;
    	    var newSavings=0.0;
    	    $.each(divs, function(index, divItem) {
    	    	var prodId = $(divItem).parents('.product-listing-item').data('productid');
    	    	var thisProduct = productsRecommendation.frequentProducts[prodId];
    	    	newTotal = parseFloat(newTotal) + parseFloat(thisProduct.itemDetails[thisProduct.currentItem].price.offerPrice);
    	    	newSavings = parseFloat(newSavings)+ parseFloat(thisProduct.itemDetails[thisProduct.currentItem].price.savings);
    	    	
    	    });
    	    $('#saveSpan').html(newSavings);
    	    $('#priceSpan').html(newTotal);
    	   //Updating the Total Price and TotalSavings on products deselect - End      
        }
        
        if (selectedItem.promotion_Message && selectedItem.promotion_Flag === '1' &&
            	(($.isArray(selectedItem.promotion_Store) &&
            		(selectedItem.promotion_Store.indexOf(WCParamJS.storeId)>-1	|| selectedItem.promotion_Store.indexOf('10101')>-1)
            	  )
            	  || (selectedItem.promotion_Store === WCParamJS.storeId || selectedItem.promotion_Store==='10101' )
            	 )
            	){
            	$(primaryContainer).find('.plp-card--offer-text').html(selectedItem.promotion_Message);
            	$(primaryContainer).find('.plp-card--offer-text').show();
        } 
        if(productListing.products[productId].pageType != "apparel"){
        	$(primaryContainer).find('.product-listing--image').attr('src', selectedItem.imageObjs[0]);
        }
        
        var $parent= $(primaryContainer).find('.product-listing__quantity--select-quantity');
	    $parent.html("");
	    // Append to original select    
	    for(var i=1; i<=selectedItem.maxOrderQty; i++){
	    	$parent.append("<option value='"+ i +"'>" + i + "</option>");
	    }   	    
	    // Refresh Selectric
	    $parent.selectric('refresh');
	    if($parent.parents('#topCategoryOffers').length>0)
	    	$parent.selectric('destroy');
	    
		var vegIndicatorHtml;
		if(selectedItem.vegNonvegFlag == 3){
			$(primaryContainer).find('.food-type').html('<span class="egg-food"><i class="icon-egg icon-circle"></i></span>');
		}else if (selectedItem.vegNonvegFlag == 1){
			$(primaryContainer).find('.food-type').html('<span class="veg-food"><i class="icon-veg icon-circle"></i></span>');
		}else if (selectedItem == 2){
			$(primaryContainer).find('.food-type').html('<span class="non-veg-food"><i class="icon-non-veg icon-circle"></i></span>');
		}
		DMAnalytics.events( DMAnalytics.Constants.Action.PLPVariantSelection, "itemId: "+itemId+" productId: "+productId , document.title, 0,null );

    });
    
    $(document).off('dmart.noResultsRecommendation.products').bind('dmart.noResultsRecommendation.products',
    		function(e,upSellProducts,recommendedProducts) {
    			$(document).off('dmart.noResultsRecommendation.products');
    			//RecommendationsJS.loadProducts(upSellProducts,recommendedProducts);
    			var inputArr = [];
    			$.each(upSellProducts, function (indx, productId) {
    	            if (DMStorage.invalid('proditems_'+WCParamJS.storeId+productId)) {
    	                inputArr.push(productId);
    	            }
    	        });
    	        $.each(recommendedProducts, function (indx, productId) {
    	            if (DMStorage.invalid('proditems_'+WCParamJS.storeId+productId)) {
    	                inputArr.push(productId);
    	            }
    	        });
    			$(document).off('dmart.products.loaded').on('dmart.products.loaded',
    					function(event) {
    		    			$(document).off('dmart.products.loaded');
    						productsRecommendation.init('',null,upSellProducts, recommendedProducts, 'prodRecommendations', null);				
    			});
    			ProductHelper.isNoResults =true;
    			ProductHelper.fetchProductDetails(inputArr);
    });
    	
    $(document).off('dmart.noResultsUpsell.products').on('dmart.noResultsUpsell.products',
    		function(event,upSellProducts) {
    			$(document).off('dmart.noResultsUpsell.products');
    			ProductHelper.fetchNoResultsRecommendations(upSellProducts);    			
	});  
}
});