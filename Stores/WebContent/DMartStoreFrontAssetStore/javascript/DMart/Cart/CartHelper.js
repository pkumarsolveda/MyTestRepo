
var CartHelper = {
	
	  urlPrefix: window.location.protocol + '//' + window.location.hostname ,
  	  checkItemAvailabilityForStore : false,
	  unavailableItems: [],	  
      wcsResources : '/wcs/resources/store/' ,
      searchResources : WCParamJS.searchHostNamePath+'/search/resources/store/' ,
	    /**
		 * Initialize on page load with the users cart details
		 */
	    init: function () { 
	    	if(window.location.protocol === "https:"){
	    		this.searchResources=  WCParamJS.searchSecureHostNamePath+ '/search/resources/store/';
	    	}
	    	//check if category hierarchy is available
			if(DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId)== null || typeof DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId)== "undefined"){
				this.populateCategoryHeirarchy();
			}
	    	$(document).on('dmart.cart.ready',function(){
	    		var orderTotal =0;
	    		var cartJSON =  DMStorage.getValue('OrderId');
	    		if(cartJSON) {
    				orderTotal = cartJSON.total;
		    		totalQty = cartJSON.totalQTY;
	            	var orderDetails = orderTotal+'_'+totalQty;
	            	//dojo.cookie("DM_OrderId", DMStorage.getValue('OrderId').total + ";" + DMStorage.getValue('OrderId').totalQTY, {expires:-1,path:'/'});
	            	if(totalQty>0){
	            		var CookieDate = new Date();
	                	CookieDate.setFullYear(CookieDate.getFullYear()+1);
	            		document.cookie = "DM_OrderId="+orderDetails+";expires=" + CookieDate.toGMTString( ) + ";path=/";
	            	} else {
	            		CartHelper.deleteCartCookie();
	            	}
	            	
	            	if(typeof productListing !== 'undefined') {
	            		productListing.updateCartDetails();
	            		productListing.updateCardsForInTrolley();
	            	}

	            	if (typeof productDisplay !== 'undefined' && typeof productDisplay.product !== 'undefined'){
	            		productDisplay.formatPage();
	            	}	            		

	            	//MiniCartDisplay.miniCartRendered = false;
	            	MiniCartDisplay.renderMiniCart();
	            	if($('#cartDetails').length!=0){
	            		cartDisplay.displayCartItems("cartDetails");
	            	}
	    		}
	    		if(typeof espotProductsRecommendation !== 'undefined'){
	    			espotProductsRecommendation.getCartDetailsforESpot();
	    		}
	    		
	    		MiniCartDisplay.updateHeader(totalQty,orderTotal);
	    		if(getCookie("DM_OrderId") != undefined && getCookie("DM_OrderId") != ""){
	    			$(document).trigger('dmart.generic.error.display');
	    		}    		
            	
    		});
	    	
			var currentCart =  DMStorage.getValue('OrderId');
	    	if(getCookie("DM_OrderId") == undefined || getCookie("DM_OrderId") == "" || 
	    			!this.storageValidForThisProtocol() || currentCart == undefined || currentCart.orderCalculationDone == 'N' ){		    		
				if (window.localStorage) {
	    			localStorage.removeItem('OrderId');
	    		}
				this.getCartItems(); 
	    		this.markLocalStorageAsUpdated();
	    	}else{
	    	 	var cartCookie = getCookie("DM_OrderId");
	    		var orderInfo = cartCookie.split("_");
	    		MiniCartDisplay.updateHeader(orderInfo[1],orderInfo[0]);
            	if(typeof cartDisplay !== 'undefined'){
            		cartDisplay.displayCartItems("cartDetails");
            	}
	    	}		
	    	
    		
	 	},
	    
	
	    /**
		 * Returns the cart Object corresponding to the user
		 * invoked from cart page, List and check out pages
		 */
	    getCartItems: function () {
	    	    var self = this;
	    		var orderCalLocalStorage = null;
	    		var cartJSONX = DMStorage.getValue('OrderId');
	    		var calUsageArray = [-1];
	    		if(typeof isCheckoutPage != 'undefined' && isCheckoutPage === true){
	    			calUsageArray = [-1,-2,-3,-7];
	    		}
	    		if(cartJSONX != null && cartJSONX.orderCalculationDone != null){
	    			orderCalLocalStorage = cartJSONX.orderCalculationDone;
	    			//overriding for checkout flow
	    			if(typeof recalPrice != 'undefined' && recalPrice){
	    			orderCalLocalStorage = 'N';
	    			}
	    		}
	    		var urlString = this.urlPrefix +this.wcsResources+ WCParamJS.storeId + '/cart/dmartcalculate';
	    		if(parent.dmartPreviewToken){
	    			urlString = window.location.origin+'/wcs/previewresources/store/'+ WCParamJS.storeId + '/cart/dmartcalculate';
	    		}
	    		$.ajaxq('ItemQueue',{
	                url: urlString,
					data:{ 
						orderCalculationDone:orderCalLocalStorage,
						calculationUsageId : calUsageArray,
						updatePrices :1
					},
	                method: 'POST',
	                context: this
	            }).done(function(data){
	            	var repayCheck = false;
	            	if(getCookie("DM_OrderId") == undefined || getCookie("DM_OrderId") == "" || DMStorage.getValue('OrderId') == undefined){
	            		self.checkItemAvailabilityForStore = true;
	            	}
	            	this.storeOrderItems(data,repayCheck);
	            }).fail(function(data) {
					if(data.status==201){
		            	cartJSON = {
							total : 0,
							tax : 0,
							totalQTY :0,
							totalSavings :0,
							orderItems :[]
						};					
		            	DMStorage.set('OrderId', cartJSON);
		            	$(document).trigger((typeof isCheckoutPage != 'undefined' && isCheckoutPage === true) ? 'dmart.checkout.summary.ready' : 'dmart.cart.ready');
		            	if(typeof espotProductsRecommendation != 'undefined' && typeof espotProductsRecommendation.isHomePage != 'undefined' && espotProductsRecommendation.isHomePage === true)
		            	 	$(document).trigger('dmart.recomm.cart.loaded');
					} else if (data.status==500){
						if(typeof isCheckoutPage != 'undefined' && isCheckoutPage === true){
							$(document).trigger('dmart.checkout.cart.failed');							
						}
					}
	            });            	        

	    },

		deleteCartCookie: function (){
			//document.cookie = "DM_OrderId="+""+";expires=-1;path=/";
			dojo.cookie("DM_OrderId", null, {expires:-1,path:'/'});
		},
		/**
		 * 
		 */
		addProductDetails : function(cartJSON,repay) {
			var itemIds = [],priceMissing=[];
			$.each(cartJSON.orderItems,function(){
				if(DMStorage.invalid('item_'+this.catentryId)) {
					itemIds.push(this.catentryId);
				}else{
					if (DMStorage.invalid('item_PriceInv_' + WCParamJS.storeId + this.catentryId)) {
						priceMissing.push(this.catentryId);
		            }
				}
			});
			if(itemIds.length >0 || priceMissing.length>0 ) {
				this.getItemDetailsFromSOLR(itemIds,priceMissing,cartJSON,repay);
			} else {
				if(this.checkItemAvailabilityForStore){
					this.solrAvailabitityCheck(cartJSON,repay);
				}else{
					this.packProductAttributes(cartJSON,repay);
				}
			}
		},
		
		solrAvailabitityCheck : function(cartJSON,repay){
			// Invoke SOLR to check whether item ids in the order is applicable to the store
			var availableItems = [];
			var self = this;
			var arr = cartJSON.cartItems;
            var idString = 'id=' + arr.join('&id=');
            if(window.location.protocol === "https:"){
	    		this.searchResources=  WCParamJS.searchSecureHostNamePath+ '/search/resources/store/';
	    	 }
            var ajaxCallParams = {
                    url: this.searchResources + WCParamJS.storeId + '/productview/byIds?' + idString + '&profileName=X_findProductByIds_Cart_DMART',
                    method: 'GET',
                    context: this
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
                $.each(data.catalogEntryView, function(indx, val) {
                	availableItems.push(val.uniqueID);
                });                 
                var unavailableItemsTemp = [];
                if(availableItems.length!=cartJSON.cartItems.length){
                	for( i=0;i<cartJSON.cartItems.length;i++){
                		if(-1 === $.inArray(cartJSON.cartItems[i],availableItems)){
                			unavailableItemsTemp.push(cartJSON.cartItems[i]);            			
                		}
                	}
                }
                self.unavailableItems = unavailableItemsTemp;
                self.packProductAttributes(cartJSON,repay);
            });           
		},
		
		
		/**
		 * Add product level attributes to the order items in JSON
		 */
		packProductAttributes : function(cartJSON,repay) {
			var itemIds = [],self=this, images = [], productItemKeys = [], itemBean = {}, totalSavings = 0;
			
			//check if category hierarchy is available
			if(DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId)== null || typeof DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId)== "undfined"){
				this.populateCategoryHeirarchy();
			}
			
			productItemKeys = DMStorage.getSpecificKeys('proditems');
			var outOfStockOrderItemIds = [];
			var pincodeExludedItems = [];
			var fulfillmentHomeOnly = false;
			var CODNotAvailable = false;
			cartJSON.orderInvStatus = true;
			self = this;
			var missingItems = [];
			$.each(cartJSON.orderItems,function(){
					itemBean = DMStorage.getValue('item_'+this.catentryId); 
					if(typeof itemBean != "undefined" && itemBean != null){
						this.productTitle = itemBean.name;
						images = getImageURLs(itemBean,'images/DMart/products/');
						this.imgUrl = images?images[0]:''; 
						this.parentCatentryId = itemBean.parentCatalogEntryID || self.findProductIdFromLS(this.catentryId,productItemKeys);
						this.parentCatalogGroupID = itemBean.parentCatalogGroupID;

						this.categoryType = '';
						$.each(itemBean.attributes, function() {
						    if (this.identifier.toUpperCase() === 'CATEGORY TEMPLATE TYPE') {
						    	self.categoryType = this.values[0].value;
						        return;
						    }

						});
						this.topCategory = self.getTopCategory(this.parentCatentryId);
						if (this.topCategory == null || this.topCategory.length == 0) {
						    this.topCategory = self.getItemTopCategory(this.catentryId);
						    if (this.topCategory == null || this.topCategory.length == 0) {
						        if (self.categoryType.length > 0) {
						            this.topCategory = self.categoryType;
						        } else {
						            // Defaulting to Grocery if category not found. Wrong idea. 
						            // cld be data. Proper fix needs to be done base on console logs
						            console.log("category not found for Product:" + this.parentCatentryId + " Item:" + this.catentryId);
						            this.topCategory = "Grocery";
						        }
						    }
						}
						var maxOrderQty = 5;
						var maxOrderQtySolr = self.findAttributeInfo(itemBean,'ITEMWISE');
						if(maxOrderQtySolr !=''){
							maxOrderQty = maxOrderQtySolr;
						}					
						this.maxOrderQty = maxOrderQty;
						//this.brand = self.findAttributeInfo(itemBean,'FILTER1_BRAND_GROCERY');
						this.brand = itemBean.manufacturer;
						if(self.unavailableItems.length>0){
							if(-1 !== $.inArray(this.catentryId,self.unavailableItems)){
								this.outofstock = true;
							}
						}
						var priceCache = DMStorage.getValue('item_PriceInv_' + WCParamJS.storeId + this.catentryId);
						if (priceCache) {
							this.MRP = priceCache.sellingPrice;
							this.dmartPrice =  priceCache.offerPrice;
							if(!this.outofstock){
								if(typeof priceCache.outofstock != "undefined"){
									this.outofstock = priceCache.outofstock;
								}else{
									this.outofstock =!priceCache.inventoryStatus;
								}								
							}
							if(this.outofstock){
								missingItems.push(this.orderItemId);
							}
							this.itemMissing = false;
						}else{
							missingItems.push(this.orderItemId);
							this.itemMissing = true;
							this.MRP = this.previousPrice;
							this.dmartPrice =  this.previousPrice;
							this.outofstock = true;
							cartJSON.totalQTY=cartJSON.totalQTY-this.quantity;
						}						
						
						if(this.outofstock === true && cartJSON.orderInvStatus !== false ){
							cartJSON.orderInvStatus = false;
						}
						this.itemMRPTotal = this.MRP; //Fix for AE-10841
						this.savings = (this.MRP)*this.quantity-this.price;
						if(this.savings > 0){
							totalSavings += parseFloat(this.savings);
						}
						if(this.categoryType==='Grocery'||this.categoryType==='HouseHold'){
							this.variant = self.findAttributeInfo(itemBean,'WEIGHT_DAGROCERY');
						}else{
							this.size = self.findAttributeInfo(itemBean,'Size');
						}
						
						if(this.previousPrice !== this.dmartPrice && parseFloat(this.previousPrice)!= this.dmartPrice){
							this.priceChanged = true;
						}
						if(this.outofstock){
							outOfStockOrderItemIds.push(this.orderItemId);
						}
						var fulfillmentFlag = self.findAttributeInfo(itemBean,DMartAttributes.Constants.Grocery.Descriptive.DeliveryFlag);
						if(fulfillmentFlag == '1'){
							fulfillmentHomeOnly = true;
						}
						var CODFlag = self.findAttributeInfo(itemBean,DMartAttributes.Constants.Grocery.Descriptive.CODFlag);
						if(CODFlag == 'N'){
							CODNotAvailable = true;
						}
						this.freebieDescription = self.findAttributeInfo(itemBean,DMartAttributes.Constants.Grocery.Descriptive.FreebieProdDescription) || 'NONE';
					}else{
						missingItems.push(this.orderItemId);
						this.itemMissing = true;
						cartJSON.totalQTY=cartJSON.totalQTY-this.quantity;
					}					
			});		
			var allItemsOOS = "N";
			if(missingItems.length>0){
				if(typeof OOSitemArray == "undefined"){
					OOSitemArray=missingItems;
					DMStorage.set('OOSitemsList',OOSitemArray);
				}else{
					OOSitemArray.concat(missingItems);
					DMStorage.set('OOSitemsList',OOSitemArray);
				}				
				errorMessageHelper.saveunavailableItems();	
				if(getCookie("DM_OrderId") != undefined && getCookie("DM_OrderId") != ""){
					$(document).trigger('dmart.generic.error.display');
				}else if(cartJSON.totalQTY == 0){
					allItemsOOS = "Y";
					DMStorage.remove('OrderId');
					if(typeof isCheckoutPage == 'undefined'){
						MiniCartDisplay.updateHeader(0,0.0);
						$('.cart-details__item-list').find('.cart-details__item-lists').remove();
						$('.cart-details__item-list').find('.cart-no-items').fadeIn();
						$('html, body').animate({
							scrollTop: $('.cart-no-items-div').offset().top - 1000
						}, 1000);  	 
						
				   	 	$('.missed-items').parents('.container').addClass('hide');
				   	 	$('.cart-details').parents('.container').addClass('hide');
				   	 	$('.empty-cart').parents('.container').removeClass('hide');						
						MiniCartDisplay.renderMiniCart();
					}else{
						$(document).trigger('dmart.checkout.cart.failed');		
					}									
					DMStorage.set('allItemsOOS',"Y");
					$(document).trigger('dmart.generic.error.display');
				}
			}else{	
				if(typeof isCheckoutPage == 'undefined'){
					localStorage.removeItem('OOSitemsList');
					if(localStorage.getItem('PincodeExcludedItems') == null){
						$('.js-cart-reject').closest('.container').fadeOut(10, function() {
					        $(this).hide();
						});
					}
				}				
			}
			cartJSON.orderItems.sort(function(a,b){
				return a.outofstock - b.outofstock;
			});
			cartJSON.deliveryRestrictionFlag = fulfillmentHomeOnly;
			cartJSON.productsHavingNoCOD = CODNotAvailable;
 			cartJSON.outOfStockOrderItemIds = outOfStockOrderItemIds;  
			var excludedItems = DMStorage.getValue('PincodeExcludedItems');
			if(excludedItems != null){
				pincodeExludedItems.push(excludedItems);
				cartJSON.pincodeExludedItems = pincodeExludedItems;  
			}
			cartJSON.totalSavings = totalSavings;
			if(repay){
            	DMStorage.set('OrderIdRepay',cartJSON);
            	$(document).trigger('dmart.repay.summary.ready');
            }else if (allItemsOOS == "N"){
            	DMStorage.set('OrderId',cartJSON);
            	 $(document).trigger((typeof isCheckoutPage != 'undefined' && isCheckoutPage === true) ? 'dmart.checkout.summary.ready' : 'dmart.cart.ready');
            	 if(typeof espotProductsRecommendation != 'undefined' && typeof espotProductsRecommendation.isHomePage != 'undefined' && espotProductsRecommendation.isHomePage === true)
            	 	$(document).trigger('dmart.recomm.cart.loaded');
            }  
		},
		
		/**
		 * Pass the attribute name
		 * @param : ItemBean and attribute name
		 * @return : attribute value / empty string
		 */
		findAttributeInfo: function(itemBean,attrib){
			var attribVal = '';
			if(attrib == 'Size' || attrib == 'WEIGHT_DAGROCERY'){
				var currentAttributeCombo = productListing.getItemDefiningAttributes(itemBean.attributes, itemBean.uniqueID);
				attribVal = currentAttributeCombo.Size;
			}else{
				$.each(itemBean.attributes,function(){
					if(this.name===attrib){
						attribVal = this.values[0].value;
						return false;
						}
				});
			}			
			return attribVal;
		},
		
		/**
		 * Get top category for grouping 
		 */
		getTopCategory : function(parentCatentryId){
			var topCat = '';
			var productBean = DMStorage.getValue('prod_'+parentCatentryId);
			/*if(productBean && productBean.attribs && productBean.attribs.attributes) {
				$.each(productBean.attribs.attributes,function() {
					if(this.identifier.toUpperCase() === 'CATEGORY TEMPLATE TYPE') {
						topCat = this.values[0].value;
						return;
					}
				});
			}*/
			if(productBean && productBean.attribs && productBean.attribs.attributes){
				var parentCategory = productBean.attribs.parentCatalogGroupID[0];
				var categoryHeirarchy;
				if(DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId)!= null && typeof DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId) != "undefined"){
					 categoryHeirarchy = DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId);
				}
				topCat = this.getL1Category(parentCategory,categoryHeirarchy);
			}			
			return topCat;
		},
		
		getItemTopCategory : function(catentryId){
			var topCat = '';
			var itemBean = DMStorage.getValue('item_'+catentryId);
			/*
			 * if data not available in LS lets fetch it
			 */
			if(!itemBean){
				ProductHelper.fetchIndividualItemDetails([catentryId])
				var itemBean = DMStorage.getValue('item_'+catentryId);
			}
			if(itemBean){
				var parentCategory = itemBean.parentCatalogGroupID[0];
				var categoryHeirarchy;
				if(DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId)!= null && typeof DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId)!= "undefined"){
					 categoryHeirarchy = DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId);
				}				
				topCat = this.getL1Category(parentCategory,categoryHeirarchy);
			}			
			return topCat;
		},
		
		searchTree: function (categoryId,cat) {
			var i, self=this;
			if(cat.uniqueID === categoryId) {
				return true;
			}  
			for(i=0;cat.catalogGroupView && i<cat.catalogGroupView.length;i++)
			{
				var result = self.searchTree(categoryId,cat.catalogGroupView[i]);
				if(result) return true;
			} 
			return false;
		},

		getL1Category: function (categoryId,cat) {
			var i;
			var self=this;
			if(typeof(cat) != 'undefined' && typeof(cat.catalogGroupView) != 'undefined'){
				for(i=0;i<cat.catalogGroupView.length;i++){
					if(self.searchTree(categoryId,cat.catalogGroupView[i])) {
						return cat.catalogGroupView[i].name;
					}
				} 	
			}			
			return null;
		},

		populateCategoryHeirarchy: function() {
			if(window.location.protocol === "https:"){
	    		this.searchResources=  WCParamJS.searchSecureHostNamePath+ '/search/resources/store/';
	    	}
			var ajaxCallParams = {
                    url: this.searchResources+WCParamJS.storeId + '/categoryview/@top' +
                        '?depthAndLimit=13,13', 
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
    				DMStorage.set('categoryHierarchy_' +WCParamJS.storeId, data);
    			});
		},
		/**
		 * Find the productId corresponding to the item id using key
		 */
		findProductIdFromLS : function(itemid,keys) {
			var key = '',productId = null, itemList;
			$.each(keys,function(){
				itemList = DMStorage.getValue(this);
				if(null !== itemList && itemList.indexOf(itemid)>-1) {
					productId = this.replace('proditems_'+WCParamJS.storeId,'');
					return;
				}
			});
			return productId;
		},
		/*
	     * Method to check item exclusion against postcode. 
	     */
	    checkItemAvailability : function(orderId) {			
			var excludedItems = undefined;
			if( window.location.pathname.indexOf("myCart")>-1){
				var selectedPincode = $('#delivery_pin').html();
				if(typeof selectedPincode  != 'undefined' && selectedPincode.length > 0){
					var params = {};
					params.orderId = orderId;
					params.postcode = selectedPincode;
					params.checkInventory = false;
					params = JSON.stringify(params);
					$.ajax(
							{
								url : "/wcs/resources/store/" + storeId+ "/cart/checkItemAvailability",
								type : "POST",
								data : params,
								contentType : "application/json",
								async: false,
								context : this
							}).done(function(data) {
								if(data.unavailableItems.length > 0){
									DMStorage.set('PincodeExcludedItems', data.unavailableItems);
									excludedItems = data.unavailableItems;								
								}else{
									DMStorage.remove('PincodeExcludedItems');
								}
					});
				} 
				if(excludedItems != undefined){
					errorMessageHelper.showGenericError('Some item in your cart have been sold out and will be removed as you proceed to checkout or continue shopping.');
				}
			}			
			return excludedItems;
		}, 
		/**
		 * Process output from get cart
		 * invoked from ShoppingActions, cart helper and checkout helper on item changes
		 */
		storeOrderItems : function(data,repay) {
			var cartJSON = {};
        	cartJSON.orderId = data.orderId;
        	var excludedItems = this.checkItemAvailability(data.orderId);
        	//cartJSON.total = Math.round(data.totalProductPrice); //Issue while deleting the item! Handle once order calculation is in place
        	var orderItems = [];
        	var totalQuantity = 0, orderTotal = 0;
        	var cartItems = [];
        	var unavailableItems = [];
        	var self = this;
        	var addressObj = {};
        	var shipMode ="";
        	if(data.orderItem != null){
        		$.each(data.orderItem, function (indx, val) {
        			 cartItems.push(val.productId);
            		 var orderItem = {};
            		 orderItem.orderItemId = val.orderItemId;
            		 orderItem.quantity = parseInt(val.quantity);
            		 orderItem.catentryId = val.productId;
            		 orderItem.lastUpdateDate = val.lastUpdateDate;
            		 shipMode = val.shipModeCode;
            		 orderItem.price = parseFloat(val.orderItemPrice).toFixed(2);
            		 
            		 if(val.adjustment && val.adjustment.length > 0) {
            			 orderItem.offerDescription = self.getOfferDescription(val.adjustment);
            			 orderItem.adjustment = self.calculateDiscount(val.adjustment, 'OrderItem','Discount');
            			 orderItem.adjustment = orderItem.adjustment.toFixed(2);
            		 } else {
            			 orderItem.offerDescription = 'NONE';
            			 orderItem.adjustment = 0;
            		 }          		 
            		 
            		 orderItem.price -= parseFloat(orderItem.adjustment).toFixed(2);
            		 orderItem.price = parseFloat(orderItem.price.toFixed(2));
            		 
            		 
            		 var previousPriceJSON = val.xitem_field2,previousPrice;
            		 if(typeof previousPriceJSON !='undefined'){
            			 previousPrice = JSON.parse(previousPriceJSON).PP;
            		 }
            		 else{
            			 previousPrice = val.unitPrice;
            		 }
            		 orderItem.previousPrice = previousPrice;            		 
            		 if(excludedItems != undefined && excludedItems.length > 0 && excludedItems.indexOf(val.orderItemId) > -1){
            			 orderItem.itemExcluded = true;
            		 } else{
            			 orderItem.itemExcluded = false;
            		 }
            		 if(val.orderItemInventoryStatus && val.orderItemInventoryStatus === "Unallocated" ){
            				 orderItem.outofstock = true;
            				 var unavailableItemData = {};
            				 unavailableItemData.catentryId = val.productId;
            				 unavailableItemData.orderItemId = val.orderItemId;
            				 unavailableItems.push(unavailableItemData);
            		 }
            		 
            		 totalQuantity += orderItem.quantity;
            		 // AE-16808 - Dont add orderitem price if OOS
            		 if(!orderItem.outofstock) {
            			 orderTotal +=  orderItem.price;
            			 
            		 }
            		 
            		 orderItem.freeGift = val.freeGift;
            		 
            		 orderItems.push(orderItem);	  
            		 
            		 if(repay){               	
            			var addressLine1 = "", addressLine2 = "", addressLine3 = "";
            			if (val.addressLine[0].length > 0) {
								addressLine1 = val.addressLine[0];
							}
						if (val.addressLine[1].length > 0) {
							addressLine2 = ", " + val.addressLine[1];
							}
						if (val.addressLine[2].length > 0) {
							addressLine3 = ", "+ val.addressLine[2];
						} 
                 		addressObj.addressId = val.addressId;
                 		addressObj.addressData = val.firstName+'||'+addressLine1 + addressLine2 + addressLine3+'||'+val.city+'||'+val.state+'||'+val.postalCode+'||'+val.phone1;
       				
            		 }
                 });
        	}
        	

			if (repay) {	
				addressObj.storeId = storeId;
				addressObj.orderId = orderId;
				addressObj.selectedShipMode = data.x_deliveryMode;
				checkoutHelper.saveCheckoutObjects('addressObjRepay', addressObj);
	
				var slotObject = {};
				slotObject.slotDate = data.x_slotDate;
				slotObject.startTime = data.x_slotStartTime;
				slotObject.endTime = data.x_slotEndTime;
	
				checkoutHelper.saveCheckoutObjects('slotObjRepay', slotObject);	
			}
   		 
        	if(data.promotionCode){
        		$.each(data.promotionCode,function(indx,val){
        			cartJSON.promotionCode = val.code;
        		});
        	}
        	 
         	/** 
         	 * TODO
         	 * Change logic to split savings from incentives and savings from product level offers
         	 */
         	//cartJSON.total = parseFloat(data.totalProductPrice).toFixed(2);
        	cartJSON.total =orderTotal;
         	cartJSON.tax = parseFloat(data.totalSalesTax);
         	cartJSON.totalAdjustment = data.totalAdjustment;
         	cartJSON.totalShippingCharge = parseFloat(data.totalShippingCharge);
         	cartJSON.cartItems = cartItems;
         	cartJSON.orderItems = orderItems;
         	cartJSON.totalQTY = totalQuantity;
 			cartJSON.orderCalculationDone = 'Y';
 			cartJSON.grandTotal = parseFloat(data.grandTotal);
 			cartJSON.discount = this.calculateDiscount(data.adjustment,'Order','Discount');
 			cartJSON.shippingAdjustment = this.calculateDiscount(data.adjustment,'Order','Shipping Adjustment');
 			cartJSON.x_codRoundedOrderTotal = data.x_codRoundedOrderTotal;
 			var shipCharge = parseFloat(data.totalShippingCharge - cartJSON.shippingAdjustment);
 			if(shipMode && shipMode === "Home Delivery"){
         		document.cookie = "HomeDeliveryShipCharge=" + Math.round(shipCharge) + ";path=/";
         	}else if (data.x_deliveryMode && data.x_deliveryMode === "Home Delivery"){
         		
         		document.cookie = "HomeDeliveryShipCharge=" + Math.round(shipCharge) + ";path=/";
         	}
        	// saving payment instr if any
        	if (data.paymentInstruction && data.paymentInstruction.length > 0 || unavailableItems.length > 0) {
			    var value = {};
			    if (data.paymentInstruction) {
			        value.instruction = data.paymentInstruction[0].piId;
			    }
			    if (unavailableItems.length > 0) {
			        value.isItemsUnavailable = true;
			        value.unavailableItems = unavailableItems;
			    }
			    if (!window.sessionStorage || WCParamJS.dontUseLocalStorage === '1') {
			    	var checkoutObjects = {};
			    	if(repay){
				        checkoutObjects['userObjRepay'] = JSON.stringify({
				            value: value
				        });
			    	}else{
				        checkoutObjects['userObj'] = JSON.stringify({
				            value: value
				        });
			    	}
			    } else {
			    	if(repay){
				        sessionStorage.setItem('userObjRepay', JSON.stringify({
				            value: value
				        }));
			    	}else{
				        sessionStorage.setItem('userObj', JSON.stringify({
				            value: value
				        }));
			    	}
			    }    
		
        	}
        	
        	this.addProductDetails(cartJSON,repay);
		},
		/**
		 * 
		 */
	    getItemDetailsFromSOLR : function(itemDetailsMissing,priceMissing,cartJSON,repay) {
	    		    	 
	    	 if (itemDetailsMissing.length > 0) {
	    		 var priceMissingItems = itemDetailsMissing.concat(priceMissing);
	             var idString = 'id=' + itemDetailsMissing.join('&id=');
	             if(window.location.protocol === "https:"){
	 	    		this.searchResources=  WCParamJS.searchSecureHostNamePath+ '/search/resources/store/';
	 	    	 }
	             var ajaxCallParams = {
		                 url: this.searchResources + WCParamJS.storeId + '/productview/byIds?' + idString + '&profileName=X_findProductInfo_NoEntitlementCheck_DMART',
		                 method: 'GET',
		                 context: this
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
	                 var catentries = [];
	                 $.each(data.catalogEntryView, function(indx, val) {
                         DMStorage.set('item_' + val.uniqueID, val);
	                 });
	                 this.fetchPriceAndInvDetails(priceMissingItems,cartJSON,repay);	                 
	             });
	    	 } else{
	    		 this.fetchPriceAndInvDetails(priceMissing,cartJSON,repay);	            
	    	 }
	    },
	    /**
	     * Get an order item corresponding to the orderItemId
	     */
	    findOrderItem : function(orderItemId) {
	    	var cartJSON = DMStorage.getValue('OrderId'), orderItem = null;
	    	if(cartJSON && cartJSON.orderItems) {
	    		$.each(cartJSON.orderItems,function(){
	    			if(this.orderItemId === orderItemId) {
	    				orderItem = this;
	    				return;
	    			}
	    		});
	    	}
	    	return orderItem;
	    },
	    fetchPriceAndInvDetails: function(inputArr,cartJSON,repay) {

	        if(window.location.protocol === "https:"){
	    		this.searchResources=  WCParamJS.searchSecureHostNamePath+ '/search/resources/store/';
	    	}
            var idString = 'id=' + inputArr.join('&id=');
            var ajaxCallParams = {
                    url: this.searchResources+ WCParamJS.storeId + '/productview/byIds?' + idString + '&profileName=X_findProductPrices_DMART',
                    method: 'GET',
                    context: this
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
                    var price = {};
                    var offerpriceString="price_SALE_"+currStoreId;
                    var sellingpriceString="price_MRP_"+currStoreId;
                    price.offerPrice = itemDetails[offerpriceString];
                    price.sellingPrice = itemDetails[sellingpriceString];
                    if(itemDetails["inv_status_"+storeId] && itemDetails["inv_status_"+storeId]==0){
                    	price.outofstock = true;
                    	price.inventoryStatus = false;
                    }
                    else{
                    	price.outofstock = false;
                    	price.inventoryStatus = true;
                    }
                    DMStorage.set('item_PriceInv_' + currStoreId + itemDetails.catentry_id, price);
                });   
                
				if(CartHelper.checkItemAvailabilityForStore){
					CartHelper.solrAvailabitityCheck(cartJSON,repay);
				}else{
					CartHelper.packProductAttributes(cartJSON,repay);
				}
                                          
            });
	    },
	    /**
	     * Check if there is any change that was done on the other side.
	     * To load the localStorage afresh.
	     */
	    storageValidForThisProtocol : function() {
	    	var cartFlagCookie = getCookie('CartFlag');
	    	var protocol = window.location.protocol;
	    	if(cartFlagCookie) {
	    		return JSON.parse(cartFlagCookie)[protocol];
	    	} 
	    	this.invalidateCookieForOtherProtocol();
	    	return false;
	    },
	    /**
	     * Flag localStorage for the other side as dirty
	     * 
	     */
	    invalidateCookieForOtherProtocol : function() {
	    	var protocol = window.location.protocol;
	    	var otherProtocol = (protocol === 'http:')? 'https:':'http:';
	    	var cookieObj = {};
	    	cookieObj[protocol] = true;
	    	cookieObj[otherProtocol] = false;
	    	document.cookie='CartFlag='+JSON.stringify(cookieObj)+'; expires=-1; path=/';
	    },
	    /**
	     * 
	     */
	    markLocalStorageAsUpdated : function() {
	    	var cartFlagCookie = getCookie('CartFlag');
	    	if(!cartFlagCookie) {
	    		return;
	    	}
	    	var protocol = window.location.protocol;
	    	var otherProtocol = (protocol === 'http:')? 'https:':'http:';
	    	var cookieObj = {};
	    	cookieObj[protocol] = true;
	    	cookieObj[otherProtocol] = JSON.parse(cartFlagCookie)[otherProtocol];
	    	document.cookie='CartFlag='+JSON.stringify(cookieObj)+'; expires=-1; path=/';
	    	
	    },
	    /**
	     * Calculates order level or order item level discounts from the 
	     * adjustments array
	     */
	    calculateDiscount : function(adjustment,displayLevel,usage) {
	    	var discount = 0, len = 0, i =0;
	    	
	    	if(adjustment) {
	    		len = adjustment.length;
	    		for(;i<len;i++) {
	    			if(adjustment[i].usage === usage &&
	    					adjustment[i].displayLevel === displayLevel) {
	    				discount += parseFloat(adjustment[i].amount);
	    			}
	    		}
	    	}
	    	
	    	return -discount;
	    },
	    /**
	     * Get offer description from adjustment array
	     */
	    getOfferDescription : function(adjustment) {
	    	var len = 0, i =0;
	    	
	    	if(adjustment) {
	    		len = adjustment.length;
	    		for(;i<len;i++) {
	    			if(adjustment[i].usage === 'Discount' &&
	    					adjustment[i].displayLevel === 'OrderItem') {
	    				return adjustment[i].description;
	    			}
	    		}
	    	}
	    	
	    	return 'NONE';
	    },
	    
	    formatPricesForDisplay : function(price) {
	    	var localeTotalPrice = parseFloat(price).toFixed(2);
	    	if(Number.prototype.toLocaleString){
	    		var formattedPrice = localeTotalPrice.toLocaleString('en-IN', {maximumFractionDigits: 2, minimumFractionDigits: 2});
	    	}else{
	    		var formattedPrice = this.formatPricesForDisplayLocal(localeTotalPrice) ;
	    	}
	    	
	    	return formattedPrice;
	    },
	    
	    /* some browsers dont support toLocaleString
	     * eg Safari. 
	     * 
	     * So writing my own logic in that case. (Vivek)
	     * Not foolproof 
	     */
	    formatPricesForDisplayLocal : function(price) {
	    	var priceObj = (''+price).split('.'), s = '', i, j;
	    	i = priceObj[0].length;
	    	var sep = ",";
	    	while (i > 3) {
	            j = i - 3;
	            s = sep + priceObj[0].slice(j, i) + s;
	            i = j;
	    }
	    	s = priceObj[0].slice(0, i) + s;
	    	priceObj[0] = s;
	    	if(priceObj[1] && priceObj[1] != "00"){
	    		if(priceObj[1].length != 1){
	    			var decimals = (""+(Math.round(('0.'+priceObj[1] *100)) / 10)).split('.')[1];
	    		}
	        	priceObj[1] = typeof decimals != "undefined" && decimals.length>0 ? decimals : priceObj[1].length == 1? priceObj[1]+"0" : priceObj[1];

	        }else{
	        	priceObj[1] = "00";
	        }
	        return priceObj.join('.');
	    }
	    

	};



