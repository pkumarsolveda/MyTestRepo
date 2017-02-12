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
var CLPProductListingHelper = {

	pageType : '',
	
	products : {},
	
	formatRangeSlider: false,
	
    /**
     * Entry point to the js class
     */
    init: function(categoryId, pageNum, divId, isLazyLoad, prodCount, searchTerm,firstLoad) {
		
    	// Load filters from localStorage
        this.filtersOnpage = CLPProductHelper.getFiltersOnPage();
        
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
        JSONdata.maxnumber = 50;
        JSONdata.categoryId = categoryId;
        JSONdata.searchTerm= searchTerm;
        JSONdata.manufacturer=  WCParamJS.handledManufacturer;
        JSONdata.storeId = WCParamJS.storeId;
        JSONdata.catalogId = WCParamJS.catalogId;
        JSONdata.assetStoreId = '10101';
        JSONdata.productIds = parentIds;
        JSONdata.pageTitle=this.pageType;
        JSONdata.homePageURL=WCParamJS.homepageURLHierarchy;
        JSONdata.noImagePath=WCParamJS.imageServerHost+'images/DMart/NoImage_M.jpg';
        
        ClpHelper.clpData.product = JSONdata.product;
        ClpHelper.clpData.config = JSONdata.config;
       //alert("triggering dmart.clpdata.ready ");
        $(document).trigger('dmart.clpdata.ready');
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
                	CLPProductHelper.fetchIndividualPriceAndInvDetails(productBean.itemIds);
                	priceCache = DMStorage.getValue('item_PriceInv_' +WCParamJS.storeId + itemId);
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
            
            productBean.isSingleVariant = productDetails.attribs.hasSingleSKU;
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
        	var attributes=CLPProductListingHelper.products[prodId].attributes.Size;
        	var size=CLPProductListingHelper.products[prodId].attributes.Size;
        	$.each(size,function(){
    			var itemId=CLPProductListingHelper.resolveSKU(prodId, {
                    Colour: colour,
                    Size: this.valueOf()
                });
    			
    			
    			var thisItem=CLPProductListingHelper.products[prodId].itemDetails[itemId];
    			var index=size.indexOf(this.valueOf());
    			var now=$(current)[index];
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
        		var size=CLPProductListingHelper.products[prodId].attributes.Size;
				if(typeof size != "undefined"){
        		$.each(size,function(){
        			var itemId=CLPProductListingHelper.resolveSKU(prodId, {
                        Colour: colour,
                        Size: this.valueOf()
                    });
        			var thisItem=CLPProductListingHelper.products[prodId].itemDetails[itemId];
        			if(thisItem && thisItem.outofstock){
        				var index=size.indexOf(this.valueOf());
        				var now=$(current)[index];
        				$(now).addClass('disabled');
        				
        				if ($('.product-listing__quantity--select option[value='+itemId+']').length > 0){
            				$('.product-listing__quantity--select option[value='+itemId+']').remove();
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

    getImageURLs : function(items,relativeURL){
	    var imageObj = {};
	    var constants=DMartAttributes.Constants.Grocery.Descriptive;
	   	$.each(items.attributes, function(index, attrib) {
	   	    if (attrib.usage === 'Descriptive') {
	   		if (attrib.identifier == constants.ImageDisplayCode) {
	   		    imageObj['imageFlag'] = parseInt(attrib.values[0].value).toString(2);
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
        var sizeAttributeConstants=DMartAttributes.Constants.SizeAttributeConstants;
        var colourAttributeConstants=DMartAttributes.Constants.Apparel.Defining.Colour;
        
        
        $.each(attributes, function(index, attrib) {
            if (attrib.usage === 'Defining') {
            	var attribName = attrib.name;
            	if(attrib.identifier.indexOf('COLOUR') === 0) {
            		attribName = 'Colour';
            	} else {
            		// Check if atleast one attribute begins with ['Size','Weight','Volume' etc]
            		var list = $.grep(sizeAttributeConstants,function(str){
            			return attrib.identifier.indexOf(str) === 0;
            		});
            		if(list.length>0) {
            			 attribName = 'Size';
            		}
            		
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
                    
                    var savings = orderItem.itemMRPTotal - orderItem.price;
                    
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
	 // facetNavigationDisplay.getHotspots('DMartProductCardESpot-'+WCParamJS.categoryId,'.plp-grocery-offer');
  },
    
    //Remember filters on page load
    updateChosenFilters : function (categoryId,searchTerm){
//  	
//  	  var filtersLSKey= categoryId || searchTerm; 
//  	  var appliedFilters;
//        if(this.objKey.brand){
//        	filtersLSKey = WCParamJS.handledManufacturer; 
//  		}
//        var x=1, $applyFilter, filterValue, filterType, isRefresh=false,
//        salePriceMin, salePriceMax, discountMin, discountMax, priceRange, priceArray=[],
//        discountRange, discountArray=[], sortOption, viewChosen, scrollPosition;
//        $('.filter-applied-list').html('');
//        if(DMStorage.getValue('filtersChosen_' +filtersLSKey)){
//        	appliedFilters = DMStorage.getValue('filtersChosen_' +filtersLSKey);
//        	facetNavigationDisplay.selectedFilters = appliedFilters;
//        	facetNavigationDisplay.hiliteSelectedFilters();
//        	$.each(appliedFilters, function(index, filter) {
//        		if(filter.filterType != 'priceRange' && filter.filterType != 'discountRange'){
//        			/*var val =filter.filterValue.replace(/ /g, "");*/
//
//            		$applyFilter = '<li><a href="javascript:;" data-filtertype = "'+filter.filterType+'" data-filtervalue="'+filter.filterValue+'" id="filter-apply-'+index+'" rel="'+index+'">';
//            		// If color show color div
//            		if(typeof filter.filterValue === 'string' && filter.filterValue.indexOf('#') === 0){
//            			$applyFilter += '<span class="type-color" style="background-color:'+filter.filterValue+' "></span>';
//            		} else {
//            			$applyFilter += '<span>'+filter.filterValue+'</span>';
//            		}
//            		$applyFilter += '<i class="filter-remove-cta icon-cross"></i></a></li>';
//      	            $('.filter-applied-list').prepend($applyFilter);
//        		}
//        	});      
//        	if($('.filter-applied-list li').length > 0) {
//    	        $('.filter-module__applied').slideDown();
//    	      }
//    	      else {
//    	        $('.filter-module__applied').slideUp();
//    	      }        
//        }
//        if(DMStorage.getValue('sortOptionChosen_' +filtersLSKey)){
//      	  sortOption = DMStorage.getValue('sortOptionChosen_' +filtersLSKey);
//      	  if($('.js-filter-sortby').val() != sortOption ){
//      		  $('.js-filter-sortby').prop('selectedIndex', sortOption).selectric('refresh');
//          	  $('.js-filter-sortby').selectric('refresh');
//          	  isRefresh=true;
//      	  }
//        }
//        if(DMStorage.getValue('viewChosen')){
//      	  viewChosen = DMStorage.getValue('viewChosen');
//      	  if(viewChosen == "list"){
//      	      $('.plp-view-option a').removeClass('active');
//      	      $('.plp-view-option .plp-view-option__list').addClass('active');
//      	      $('.product-listing-item').addClass('view-list-active');
//      	      $('.product-listing__total-items').hide();
//      	      $('.product-added-to-cart .product-listing__total-items--list-view').show();
//      	      $('.js-switch-view').prop('class', 'col-xs-12 js-switch-view');
//      	      if($('.product-listing-item').hasClass('product-added-to-cart')) {
//      	    	$('.product-added-to-cart .product-listing-item__secondary').css('display', 'block');
//      	        if($('.product-listing-item').hasClass('plp-apparel')) {
//      	        	$('.product-added-to-cart').find('.plp-apparel__color-pallette').hide();
//      	        	$('.product-added-to-cart').find('.plp-apparel__color-pallette-alt').show();
//      	        }
//      	      }
//      	      $('.product-listing-item').removeAttr('style');
//      	      $('.product-listing-item__tertiary').hide();
//      	  }
//        }
//        if(DMStorage.getValue('scrollPosition_' +filtersLSKey)){
//      	  scrollPosition= DMStorage.getValue('scrollPosition_' +filtersLSKey);
//      	  $(window).scrollTop(scrollPosition);
//        }
        return false; //isRefresh
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
  }
  
  
};
