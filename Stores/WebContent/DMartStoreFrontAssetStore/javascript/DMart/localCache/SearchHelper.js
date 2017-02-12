/**
 * This js helper objects handles all search suggestion related aspects.
 * 
 */

var SearchHelper = {
		
		urlPrefix : WCParamJS.searchURLPrefix,
		searchResources : '/search/resources/store/',
		autosuggestProducts : {},
		/**
		 * Invoked when number of search chars greater than or equal to 3
		 *  
		 */
		autosuggest : function(term,isHeaderSearch) {
			SearchHelper.autosuggestProducts = {};
			this.searchTerm = term;
			this.isHeaderSearch = isHeaderSearch;
			var self = this,itemIdsList = [];
			var cartJson = DMStorage.getValue('OrderId');
			// Turned off caching for AE-15338
			var ajaxCallParams = {
	                url: this.urlPrefix[window.location.protocol]+this.searchResources+WCParamJS.storeId+'/sitecontent/productSuggestionsBySearchTerm/'+term+'?profileName=X_findProductSuggestions_DMart&orderBy=0',
	                method: 'GET',
	                context: this,
	                cache : false
	            };
			
			//For Storepreview
			if(parent.dmartPreviewToken) {
				ajaxCallParams.xhrFields = {
			        withCredentials: true
			    };
				ajaxCallParams.headers = { 
						WCPreviewToken: parent.dmartPreviewToken
				};
			}			
			
			$.ajax(ajaxCallParams).done(function(data) {
            	this.catentryIds = [];
            	var products = {};
            	if(data.suggestionView && data.suggestionView[0].entry) {
            		$.each( data.suggestionView[0].entry, function() {
            			var productId = this.uniqueID;
            			self.catentryIds.push(productId);
            			products[productId] = {};
            			products[productId].productId = this.uniqueID;
            			products[productId].title = this.name;
            			products[productId].catGroup = SearchHelper.fetchCatgroupId(this.parentCatalogGroupID);
            			products[productId].seo = this.seo_token_ntk;
            			
            			$.each(this.attributes, function(count, attr) {
    		                if (attr.name === "Brand") {
    		                	products[productId].brand = attr.values[0].value;
    		                }
    		                if (attr.name.toUpperCase() === DMartAttributes.Constants.Grocery.Descriptive.CategoryType) {
    		                	products[productId].type = attr.values[0].value.toLowerCase();
    		                }
    		            });
    		            // Fetch product name
    		            products[productId].name =  this.name;
    		            products[productId].itemDetails = {};
    		            // list of item ids of this product
    		            products[productId].itemIdList = [];
    		            var defaultItemId = '';
    		            if(this.sKUs) {
	    		            $.each(this.sKUs, function() {
	    		            	if(defaultItemId == ''){
	    							defaultItemId = products[productId].selectedItemId = this.uniqueID;
	    						}
	    		            	var lsItemDetails = this;
								var itemDetails = {};
								var itemid= this.uniqueID;
								itemIdsList.push(itemid);
								products[productId].itemIdList.push(itemid);
								itemDetails.imageObjs = productListing.getImageURLs(lsItemDetails,'images/DMart/products/');
								// Change the implementation of this function
								itemDetails.brand = productListing.getBrand(itemid,lsItemDetails);
								itemDetails.definingAttributes = productListing.getItemDefiningAttributes(lsItemDetails.attributes,itemid);
								var maxQtyAttr = $.grep(lsItemDetails.attributes,function(attr){
									return attr.identifier === 'ITEMWISE';
								});
								itemDetails.maxOrderQty = maxQtyAttr[0]?maxQtyAttr[0].values[0].value:confMaxOrderQty;//Setting default value
				                
				                itemDetails.qtyInCart =  cartJson?SearchHelper.findQtyInCart(cartJson.orderItems,itemid):0;
				                itemDetails.inCurrentList = SearchHelper.findIfAddedToList(itemid);
				                
				                if(cartJson) {
									var orderItem = $.grep(cartJson.orderItems,function(item){
										return item.catentryId == itemid && item.freeGift == 'false';
									});
									itemDetails.orderItemId = orderItem.length>0?orderItem[0].orderItemId:'';
								} else {
									itemDetails.orderItemId = '';
								}
				                
				                
								products[productId].itemDetails[itemid] =  itemDetails;
	    		            	
	    		            });
	    		            defaultItemId  = self.getDefaultItem(this.sKUs);
	    		            if(defaultItemId ==''){
	    		            	defaultItemId = this.sKUs[0].uniqueID;
	    		            }
	    		            products[productId].selectedItemId = defaultItemId;
    		            }
    		            
    		            if(defaultItemId ==''){
    						delete products[productId];
    					}else{
	    					products[productId].currentAttributeCombo = products[productId].itemDetails[defaultItemId].definingAttributes;
	    					products[productId].attributes = productListing.getAttributesForProduct(products[productId]);
	    					
	    					if(products[productId].currentAttributeCombo && products[productId].currentAttributeCombo.Colour) {
	    						products[productId].applicableSizes = [];
	    						$.each(products[productId].itemDetails,function (index,itemDetail){
	    		            		if(itemDetail.definingAttributes.Colour == products[productId].currentAttributeCombo.Colour){
	    		            			products[productId].applicableSizes.push(itemDetail.definingAttributes.Size);
	    		            		}
	    		            	});
	    					}
    					}
    		            
    		            
            		});
            		
            		
            		self.autosuggestProducts = products;
            		self.getPriceInventoryStatus(itemIdsList);
		            //ProductHelper.fetchPriceAndInvDetails(itemIdsList,self.setPriceInventoryStatus,[]);
            	} else {
            	  // 
            	  this.renderAutosuggest(this.searchTerm,{},[],this.isHeaderSearch);
            	}
           
            });
			
			
		},
		/*
		 * get the correct categoryId from the list of all
		 * available catelog_category group .
		 */
		fetchCatgroupId: function (catgroupArray){
			if(typeof catgroupArray == "object" && catgroupArray.length > 1){
				var category = "";
				$.each(catgroupArray, function(itmIndx, catgroup) {
					if(catgroup.indexOf(WCParamJS.catalogId) ==0){
						try{
							category = catgroup.split('_')[1];							
						}catch(err) {
							category = catgroup;
						}						 						
					}					
				});
				return category;
			}else{
				return catgroupArray;
			}
		}, 
		
		getPriceInventoryStatus : function(itemIdsList) {
			 var priceBean = {};
			 if(itemIdsList.length == 0) {
				 return;
			 }
			 var idString = 'id=' + itemIdsList.join('&id=');
			 var self = this;
	            var ajaxCallParams = {
	                    url: this.urlPrefix[window.location.protocol] + this.searchResources + WCParamJS.storeId + '/productview/byIds?' + idString + '&profileName=X_findProductPrices_DMART',
	                    method: 'GET',
	                    context: this,
	                    cache : false
	                };

	            //For Storepreview
				if(parent.dmartPreviewToken) {
					ajaxCallParams.xhrFields = {
				        withCredentials: true
				    };
					ajaxCallParams.headers = { 
							WCPreviewToken: parent.dmartPreviewToken
					};
				}
	            
	            $.ajax(ajaxCallParams).done(function(data) {
	                var currStoreId = WCParamJS.storeId;
	                $.each(data.DocumentList, function(itmIndx, itemDetails) {                
	                	priceBean[itemDetails.catentry_id] = {};
	                    var offerpriceString="price_SALE_"+currStoreId;
	                    var sellingpriceString="price_MRP_"+currStoreId;
	                    priceBean[itemDetails.catentry_id].offerPrice = itemDetails[offerpriceString];
	                    priceBean[itemDetails.catentry_id].sellingPrice = itemDetails[sellingpriceString];
	                    if(itemDetails["inv_status_"+currStoreId] && itemDetails["inv_status_"+currStoreId]==0){
	                    	priceBean[itemDetails.catentry_id].inventoryStatus = false;
	                    }
	                    else{
	                    	priceBean[itemDetails.catentry_id].inventoryStatus = true;
	                    }
	                });
	                
	                self.setPriceInventoryStatus(priceBean);
	                
	            });
			
		},
		setPriceInventoryStatus : function(priceBean) {
			$.each(SearchHelper.autosuggestProducts,function(productId,product) {
				$.each(product.itemDetails,function(itemId,item) {
					var priceCache = priceBean[itemId];
	                var priceObj = {
		                    offerPrice: 0,
		                    sellingPrice: 0
		                };
		                if (priceCache) {
		                    priceObj.offerPrice = parseFloat(priceCache.offerPrice).toFixed(2);
		                    priceObj.sellingPrice = parseFloat(priceCache.sellingPrice).toFixed(2);
		                    item.outofstock = !priceCache.inventoryStatus;
		                    // Remove from storage, for safety
		                    DMStorage.remove('item_PriceInv_' +WCParamJS.storeId + itemId);
		                }
		                item.priceExists=true;
		                if (typeof priceObj.offerPrice == "undefined" || priceObj.offerPrice == 0 || priceObj.offerPrice ==null || isNaN(priceObj.offerPrice)){
		                	priceObj.offerPrice = 0;
		                	item.priceExists=false;
		                }
		                if (typeof priceObj.sellingPrice == "undefined" || priceObj.sellingPrice == 0 || priceObj.sellingPrice ==null || isNaN(priceObj.sellingPrice)){
		                	priceObj.sellingPrice = 0;
		                	item.priceExists=false;
		                }
		                if((typeof priceObj.offerPrice != "undefined" && priceObj.offerPrice != 0 && priceObj.offerPrice !=null)&&(Number(priceObj.offerPrice) < Number(priceObj.sellingPrice))){
		               	 	priceObj.savings = +(priceObj.sellingPrice - priceObj.offerPrice).toFixed(2);
		               	 	item.priceExists=true;
		                }
		                item.price = priceObj;
		                
		                SearchHelper.autosuggestProducts[productId].itemDetails[itemId] = item;
				});
				
				// Find instock item
				var defItemId = SearchHelper.autosuggestProducts[productId].selectedItemId = SearchHelper.getInStockVariantAsDefault(product);
				// Set attribute set and attribute combo of default item for display
               	SearchHelper.autosuggestProducts[productId].currentAttributeCombo = SearchHelper.autosuggestProducts[productId].itemDetails[defItemId].definingAttributes;
               	SearchHelper.autosuggestProducts[productId].attributes = productListing.getAttributesForProduct(SearchHelper.autosuggestProducts[productId]);
               	// If it is an apparel (or has a colour defining attribute, get applicable Sizes for display
				if(SearchHelper.autosuggestProducts[productId].currentAttributeCombo && SearchHelper.autosuggestProducts[productId].currentAttributeCombo.Colour) {
						SearchHelper.autosuggestProducts[productId].applicableSizes = [];
						$.each(SearchHelper.autosuggestProducts[productId].itemDetails,function (index,itemDetail){
		            		if(itemDetail.definingAttributes.Colour == SearchHelper.autosuggestProducts[productId].currentAttributeCombo.Colour){
		            			SearchHelper.autosuggestProducts[productId].applicableSizes.push(itemDetail.definingAttributes.Size);
		            		}
		            	});
				}
                	
                
				
			});
			// AE-15362
			SearchHelper.pushOOSProductsDown();
			SearchHelper.renderAutosuggest(SearchHelper.searchTerm,SearchHelper.autosuggestProducts,SearchHelper.catentryIds,SearchHelper.isHeaderSearch)
		},
		/**
		 * Renders the autosuggest div using the products' details fetched
		 * isHeaderSearch true - search is from header, false - search invoked from list
		 */
		renderAutosuggest: function(term,products,catentryIds,isHeaderSearch){

			var catentryIdsTemp = [];		                	
			$.each(catentryIds, function(idx, value) { 
				if(products[value]){
					catentryIdsTemp.push(value);
				}
			});	
			nunjucks.configure(WCParamJS.staticServerHost+ 'templates', {
				autoescape: true,
				web: {
					useCache: true
				}
			});
			var JSONdata = {
					products : products,
					productIds : catentryIdsTemp,
					config : {
						storeId : WCParamJS.storeId,
						langId :WCParamJS.langId,
						catalogId : WCParamJS.catalogId,
						isHeaderSearch : isHeaderSearch,
						noImagePath: WCParamJS.staticServerHost+'images/DMart/NoImage_M.jpg'
					},
					searchTerm : term
	
			};
			var genHTML = nunjucks.render('/_modules/header-search-item.nunjucks', {data: JSONdata});
			
			var targetContainer = isHeaderSearch?'.header-dropdown--search':'.dropdown-search-add-list';
			
			$(targetContainer).html(genHTML);

			$(isHeaderSearch?(targetContainer+' .search-dropdown'):targetContainer).perfectScrollbar({
			      suppressScrollX: true,
			      swipePropagation: true
		    });
			
			this.disableVariantsIfOutOfStock();

		},
		/**
		 * Find total number items for the catentry id in cart
		 * 
		 */
		findQtyInCart : function(orderItems, itemId) {
			var qty = 0;
			for ( var i = 0, len = orderItems.length; i < len; i++) {
				if (orderItems[i].catentryId === itemId && orderItems[i].freeGift != "true") {
					qty += orderItems[i].quantity;
					break;
				}
			}
		return qty;
	},
		/**
		 * Check if the item is already added to the current list in focus
		 */
		findIfAddedToList : function(itemId) {
			 //Get active list id
			var listId = $('.my-list li.resp-tab-active').attr('value');
			
			if(listId) {
				var itemIds = DMStorage.getValue('listItemIds_'+listId);
				if(itemIds && itemIds.indexOf(itemId)!== -1) {
					return true;
				}
				return false;
			}
			return false;
		},
		/**
		 * Get default item id
		 */
		getDefaultItem : function (itemBeans){
			  var defaultItemId = '';
			  $.each(itemBeans, function(i,item) {
			      var currentItemAttributes = item.attributes;	      
			      $.each(currentItemAttributes, function(index, attrib) {
			            if (attrib.name === 'DEFAULT VARIANT (Y/N)' && attrib.values[0].value == 'Y') {
			            	defaultItemId=item.uniqueID;
			            }
			        });
			  });
			  return defaultItemId;
		  },
		  // Disable Size options out of stock
		  disableVariantsIfOutOfStock : function() {
			  $.each(this.autosuggestProducts,function(productId,product){
				  $.each(product.itemDetails,function(itemId,item) {
					  if(item.outofstock) {
						  // For grocery items, disable all 
						  var size = item.definingAttributes.Size;
						  $('.search-dropdown li[data-productid='+productId+'] .product-search-item--size-select option[value="'+size+'"]').attr('disabled','true');
					  }
				  });
			  });
		  },
		  
		  getInStockVariantAsDefault : function(productBean) {
			  var itemDetails = productBean.itemDetails;
			  var defaultVariantId = productBean.selectedItemId;
			  var alternateVariant  = '';
			  // Find an alternate variant if default is OOS
			  if(productBean.itemDetails[defaultVariantId].outofstock) {
				  $.each(itemDetails,function(itemId,item) {
					  // Find first in stock variant
					  if(!item.outofstock) {
						  alternateVariant = itemId;
						  return false;
					  }
				  });
				  // If still no instock variant revert to defaultVariantId
				  if(alternateVariant == '') {
					  return defaultVariantId;
				  }
				  // Return the alternate variant id
				  return alternateVariant;
			  }
			  // If default variant is in stock
			  return defaultVariantId;
		  },
		  pushOOSProductsDown : function() {

				var oosCatentries= [];
				// Find list of oos catentry ids
				$.each(SearchHelper.autosuggestProducts,function(id,product) {   		 
				  if(product.itemDetails[product.selectedItemId].outofstock == true) { 
					 oosCatentries.push(id);
				  } 
				});

				if(oosCatentries.length != SearchHelper.catentryIds.length) {
				var len = oosCatentries.length;
				for(var i=0;i<len;i++) {
				 var indx= SearchHelper.catentryIds.indexOf(oosCatentries[i]);
				 if(indx>-1) { 
				   SearchHelper.catentryIds.splice(indx,1); 
				 }
				} 
				SearchHelper.catentryIds = SearchHelper.catentryIds.concat(oosCatentries);
				}
			}
};

/**
 * All event handlers for autosuggest are below
 */
// Things to be handled when ordercalculate completes and cart is updated
$(document).on('dmart.cart.ready',function(){
	var cartJson = DMStorage.getValue('OrderId');
	if(cartJson && cartJson.orderItems) {
		$.each($('.quantity-select').parents('li[data-itemid]'),function() {
		   
			
		   var newItemId = $(this).attr('data-itemid');
		   var productId = $(this).attr('data-productid');
		   var qty = SearchHelper.findQtyInCart(cartJson.orderItems,newItemId+'');
		   if(productId && SearchHelper.autosuggestProducts[productId] && newItemId.length > 0 ) {
		    	SearchHelper.autosuggestProducts[productId].itemDetails[newItemId].qtyInCart = qty;
		   }
		   if(qty == 0) {
				$(this).find('.product-search__btn-addtocart').show();
			    $(this).find('.quantity-select').addClass('js-hide-show');
			    $(this).removeAttr( 'data-orderitemid');
			} else {
				$(this).find('.product-search__btn-addtocart').hide();
			    $(this).find('.quantity-select').removeClass('js-hide-show');
			    $(this).find('.quantity-input input').val(qty);
			    var orderItem = $.grep(cartJson.orderItems,function(item){
					return item.catentryId == newItemId && item.freeGift == 'false';
				});
			    if(orderItem.length>0) {
			    	$(this).attr('data-orderitemid',orderItem[0].orderItemId);
			    }
			}
		   
		   
		});
		
	}
});

function suggestHandleAfterAddToCart(data,itemId) {
	var suggestion = $('li[data-itemid='+itemId+']');
    $(suggestion).find('.product-search__btn-addtocart').html('<i class="icon-cart"></i>Add').removeClass('ADDED').hide();
    $(suggestion).find('.quantity-select').removeClass('js-hide-show');
    $(suggestion).find('.search-cart-button .quantity-input input').val(1);
    var productId = suggestion.data('productid');
    SearchHelper.autosuggestProducts[productId].itemDetails[itemId].qtyInCart = 1;
    SearchHelper.autosuggestProducts[productId].itemDetails[itemId].orderItemId = data.orderItem[0].orderItemId;
    $(suggestion).attr('data-orderitemid',data.orderItem[0].orderItemId);
   
}
$(document).on('click','.search-cart-button .product-search__btn-addtocart', function(event) {
	if($(this).hasClass('ADDED')) {
		return;
	}
	$(this).addClass('ADDED');
    $(this).empty();
    var strVar="";
    strVar += "<span class=\"added-animated\"><i class=\"icon-cart-added\"><\/i> Added<\/span>";
    $(this).append(strVar);
	var params = {};
	params.catEntryId_1 = $(this).parents('li').attr('data-itemid');
	params.quantity_1 = 1;
	callAddToCart(params,suggestHandleAfterAddToCart,[params.catEntryId_1]);
	DMAnalytics.events( 'Add to Cart button click', $('#SimpleSearchForm_SearchTerm').val(), document.title, 0, null);
});
/*
 * Handles colour selection for apparel auto suggestion
 */
$(document).on('click','.js-colorselector .dropdown-menu a', function () {
	// Get the color
	var color = $(this).data('color');
	// Find the suggestion row
	var suggestion  =$(this).parents('li[data-productid]');
	// Get the product id
	var productId = $(suggestion).data('productid');
	// Store reference to the size selection dropdown
	var sizeSelect = $(suggestion).find('.product-search-item--size-select');
	// Flush the dropdown, by overwriting it
	$(sizeSelect).html('<option>Size</option>');
	// For each size corresponding to the selected color, create a new row in the dropdown
	$.each(SearchHelper.autosuggestProducts[productId].itemDetails,function (index,itemDetail){
		if(itemDetail.definingAttributes.Colour == color){
			var option = '<option value="'+itemDetail.definingAttributes.Size+'">'+itemDetail.definingAttributes.Size+'</option>';
			$(sizeSelect).append(option);
		}
	});
	// Hide prices, since no sizes will be selected
	$(suggestion).find('.product-listing--original-price').hide();
	$(suggestion).find('.product-search-listing--discounted-price').hide();
	// Hide quantity selector, if any and display button (disabled)
	// Use button-primary class so that it works the same way for list suggestions as well 
	$(suggestion).find('.button-primary').addClass('cart-button-disabled').attr('disabled','true').show();
	$(suggestion).find('.quantity-select').addClass('js-hide-show');
	// Display swatch control
    $(this).parents('.js-colorselector').find('.dropdown-menu a').removeClass('selected');
    $(this).addClass('selected');
    $(this).parents('.js-colorselector').find('.dropdown-toggle span').css('background-color', $(this).css('background-color'));
    $(this).parents('.dropdown-menu').fadeOut();
    
    
    
});


$(document).on('change','.product-search-item--size-select',function(){
	var suggestion = $(this).parents('li');
	var selectedColor,selectedSize;
	var selectedValue = $('option:selected', this).text();
	
	var productId = suggestion.data('productid');
	
	selectedSize = $(this).val();
	selectedColor = $(suggestion).find('.dropdown-colorselector .dropdown-menu .selected').data('color');
	var items = SearchHelper.autosuggestProducts[productId].itemDetails;
	var newItemId = '';
	// Simple SKU resolution using colour and size selected
	// Accounts for colour = undefined, assumes it is not apparel
	$.each(items,function(itemId, itemDetails){
		if((!selectedColor && selectedSize === itemDetails.definingAttributes.Size ) || 
		   (selectedColor && selectedSize === itemDetails.definingAttributes.Size 
				   && selectedColor === itemDetails.definingAttributes.Colour)
		   ) {
			newItemId = itemId;
			return;
		}
		
	});
	
	if($(this).hasClass('apparel-size-select')) {
		if(selectedValue !== 'Size')  {
			if(items[newItemId].priceExists){        	
				$(suggestion).find('.product-search__btn-addtocart').show().removeClass('cart-button-disabled').attr('disabled', false);
				$(suggestion).find('.product-search__btn-addtolist').show().removeClass('cart-button-disabled').attr('disabled', false);
	        }else{
	        	$(suggestion).find('.product-search__btn-addtocart').show().addClass('cart-button-disabled').attr('disabled', true);
	        	$(suggestion).find('.product-search__btn-addtolist').show().addClass('cart-button-disabled').attr('disabled', true);
	        }
			$(suggestion).find('.product-listing--original-price').show();
			$(suggestion).find('.product-search-listing--discounted-price').show();
			//selectedColor = $(suggestion).find('.dropdown-colorselector .dropdown-menu .selected').data('color');
		} else {
			$(suggestion).find('.product-search__btn-addtocart').show().addClass('cart-button-disabled').attr('disabled', true);
			$(suggestion).find('.product-search__btn-addtolist').show().addClass('cart-button-disabled').attr('disabled', true);
			$(suggestion).find('.quantity-select').addClass('js-hide-show');
			$(suggestion).find('.product-listing--original-price').hide();
			$(suggestion).find('.product-search-listing--discounted-price').hide();
			return false;
		}
	} 

	
	if(newItemId !== '') {
		$(suggestion).attr('data-itemid',newItemId);
		// Handle for price display
		var mrp = items[newItemId].price.sellingPrice,dmartPrice = items[newItemId].price.offerPrice;
		// Commented out for AE-10813
/*		if(mrp == dmartPrice) {
			$(suggestion).find('.product-listing--original-price').hide();
		} else {*/
			var savings = mrp - dmartPrice;
			var mrpPriceString = 'MRP <span class="strike-diagonal"><i class="icon-rupees"></i>'+mrp+'</span>';
			if(savings > 0){
				mrpPriceString = 'MRP <span class="strike-diagonal"><i class="icon-rupees"></i>'+mrp+'</span>';
			}else if (savings == 0){
				mrpPriceString = 'MRP <span class="no-strike-diagonal"><i class="icon-rupees"></i>'+mrp+'</span>';
			}
					
			$(suggestion).find('.product-listing--original-price').html(mrpPriceString);
		//}
		var dmartPriceString = 'DMart <i class="icon-rupees"></i>'+dmartPrice;
		$(suggestion).find('.product-search-listing--discounted-price').html(dmartPriceString);
		
		if(items[newItemId].outofstock || !items[newItemId].priceExists) {
			
			$(suggestion).find('.product-search__btn-addtocart').addClass('cart-button-disabled');
			$(suggestion).find('.product-search__btn-addtocart').attr('disabled',true);
		} else {
			$(suggestion).find('.product-search__btn-addtocart').removeClass('cart-button-disabled');
			$(suggestion).find('.product-search__btn-addtocart').attr('disabled',false);
		}
		// Image handling for out of stock items
		if(items[newItemId].outofstock) {
			$(suggestion).find('.img-responsive').addClass('product-out-of-stock-image-disabled');
			$(suggestion).find('.product-listing--label-out-of-stock').show();
		} else {
			$(suggestion).find('.img-responsive').removeClass('product-out-of-stock-image-disabled');
			$(suggestion).find('.product-listing--label-out-of-stock').hide();
		}
		
		// Handle qty in trolley change
		if(items[newItemId].qtyInCart == 0) {
			$(suggestion).find('.product-search__btn-addtocart').show();
		    $(suggestion).find('.quantity-select').addClass('js-hide-show');
		} else {
			$(suggestion).find('.product-search__btn-addtocart').hide();
		    $(suggestion).find('.quantity-select').removeClass('js-hide-show');
		    $(suggestion).find('.quantity-input input').val(items[newItemId].qtyInCart);
		}
		// Set orderitem id
		$(suggestion).attr('data-orderitemid',items[newItemId].orderItemId);
		
		$(suggestion).find('.img-responsive').attr('src',items[newItemId].imageObjs[0]);
		
		
		/*
		 * Handle list changes
		 */
		// By default, add class js-not-added
		$(suggestion).find('.product-search__btn-addtolist').addClass('js-not-added').html('<i class="icon-cart"></i> Add to List');
		if(SearchHelper.findIfAddedToList(newItemId)) {
			$(suggestion).find('.product-search__btn-addtolist').removeClass('js-not-added').html('Added to List');
		}
	}
	
});


function suggestHandleAfterAddToList(data,listId,itemId) {
	var  itemIdList = DMStorage.getValue('listItemIds_'+listId);
	itemIdList.push(itemId+''); // Setting as string since all items are strings in list localstorage
	DMStorage.set('listItemIds_'+listId,itemIdList);
	CachedHeader.renderTopnavList();
	var suggestion = $('li[data-itemid='+itemId+']');
	var productId = $(suggestion).data('productid');
	var itemDetails = SearchHelper.autosuggestProducts[productId].itemDetails[itemId];
	$(suggestion).find('.product-search__btn-addtolist').removeClass('js-not-added').html('Added to List');
	var JSONdata = {
				 outofstock:($(suggestion).find('.product-listing--label-out-of-stock').css('display')=='none')?false:true,
	             giftlistItemid : data.item[0].giftListItemID,
	             imgsrc : $(suggestion).find('.img-responsive').attr('src'),
	             url : $(suggestion).find('.product-search-item a').attr('href'),
	             uniqueId : itemId,
	             title :  $(suggestion).find('.product-search-item a').html(),
	             brand :  $(suggestion).find('.product-search-brand a').html(),
	             variant : ($(suggestion).find('.product-search-item--size-select option:selected').val())?$(suggestion).find('.product-search-item--size-select option:selected').val():$(suggestion).find('.single-variant').text(),
	    	     size : ($(suggestion).find('.product-search-item--size-select option:selected').val())?$(suggestion).find('.product-search-item--size-select option:selected').val():$(suggestion).find('.single-variant').text(),
	             color : $(suggestion).find('.dropdown-colorselector span').css("background-color"),
	             mrp : itemDetails.price.sellingPrice,
	             dmart : itemDetails.price.offerPrice,
	             save : itemDetails.price.sellingPrice -itemDetails.price.offerPrice,
	             quantityRequested : 1,
	             maxOrderQtySolr : itemDetails.maxOrderQty 
	};
	/**only for apparel**/
	var apparelColor = $(suggestion).find('.dropdown-colorselector span').css("background-color");
	if(typeof apparelColor != 'undefined'){
		JSONdata.colour = apparelColor;
		JSONdata.type = 'Apparel';
	}
	nunjucks.configure(WCParamJS.staticServerHost+ 'templates', {
		autoescape: true,
		web: {
			useCache: true
		}
	});
	
	var genHTML = nunjucks.render('/_modules/single-list-item.nunjucks', {data: JSONdata});
	var itemData={};
	itemData.giftListItemID=data.item[0].giftListItemID;
	itemData.productId=itemId;
	itemData.quantityRequested="1.0";
	var itemJSON=DMStorage.getValue('wishListItemDetail_'+listId);
	if(itemJSON){
	itemJSON.item.push(itemData);
	DMStorage.set('wishListItemDetail_'+listId,itemJSON);
	}
	$('#'+listId+' .tabs-primary__content--blurb').append(genHTML);
	
	$('.product-listing-item__primary[data-itemid='+itemId+']').find('.product-listing__quantity--select-quantity').selectric({maxHeight: 85});
	var prod_txt = 'Products';
    if(itemIdList.length == 1){
    	prod_txt = 'Product';
    }
	$('.resp-tab-content-active .existing-order--count').html('Showing Total '+itemIdList.length+' '+prod_txt);
	$('.selectric-items .selectric-scroll').perfectScrollbar({
	      suppressScrollX: true,
	      swipePropagation: true
	    });
	if($('#'+listId+' .existing-order__price-view-cart-btn.button--block').css('display')!='none'){
		$('#'+listId+' #productAlternate-'+data.item[0].giftListItemID).attr('checked',false);
		$('#'+listId+' #productAlternate-'+data.item[0].giftListItemID).parents('.product-listing-item__primary').removeClass('selected');
	}
	// Hide no items in list message
	$('.mylist-noitems-alert').hide();
}

$(document).on('click','.product-search__btn-addtolist.js-not-added',function(){
	var suggestion = $(this).parents('li');
	var itemId = suggestion.attr('data-itemid');
	
	var listId = $('.my-list li.resp-tab-active').attr('value');
	
	DMartShoppingListActionsJS.addSingleItemToList(listId,itemId,suggestHandleAfterAddToList,[listId,itemId]);
	DMAnalytics.events( DMAnalytics.Constants.Category.SearchAndAdd,DMAnalytics.Constants.Category.SearchAndAdd , document.title, 0,null );
});