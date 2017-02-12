//Recommendations Helper

var RecommendationsJS = {
		urlPrefix: WCParamJS.searchHostNamePath+ '/search/resources/store/',
		urlPrefixWcs : window.location.protocol + '//' + window.location.hostname + '/wcs/resources/store/',
		catRecommEms : "PDP_Recommendation_" + $('#emsCatgroupId').val(),
		pageid : {
					storeId:  $('#storeId').val() || '10151'
					//productId : 
				 },
		loadFrequentMerchandisingAssociations : function(prodId){
			 var prodId = $("#prodIdentifier").val();
			 var freqBoughtProducts = [];
			 if(window.location.protocol === "https:"){
		    		this.urlPrefix=  WCParamJS.searchSecureHostNamePath+ '/search/resources/store/';
			 }
			 var enableFBT= $('#freqBoughtTogether').val();
			 var data=DMStorage.getValue('freqBoughtProducts_'+prodId,data);
			 if(enableFBT==1){
			 
			 if(!data){
				 var ajaxCallParams = {
						    url: this.urlPrefix + this.pageid.storeId + '/productview/byId/' + prodId,
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
						freqBoughtProducts=this.populateFreqData(data);
						DMStorage.set('freqBoughtProducts_'+prodId,freqBoughtProducts);
					  
					});
			 }
			 else{
				 freqBoughtProducts=data;
				 $(document).trigger('dmart.recommendation.frequent',[freqBoughtProducts]);
			 }
			 
			
			 $(document).on(
						'dmart.products.loaded',
						function(event) {
							$(document).trigger('dmart.recommendation.frequent',[freqBoughtProducts]);
						$(document).off('dmart.products.loaded');
					});
			}
			 else{
				 $('#frequent').parent().hide();
				 }
			 $(document).trigger('dmart.upsell.master');
			
		},
		
		populateFreqData : function(data){
			 
			var freqBoughtProducts = [];
			 $.each(data.catalogEntryView, function(prodIndx, productDetails) {
			    	manufacturerName = productDetails.manufacturer;
			    	if(productDetails.merchandisingAssociations != null){
			    		$.each(productDetails.merchandisingAssociations,function(merchIndex, merchObj){
				    		var assoType = merchObj.associationType;
				    		if(assoType != null && assoType.length >0 && assoType == 'ACCESSORY'){
				    			freqBoughtProducts.push(merchObj.uniqueID);
				    			//console.debug("Product accessory " + merchObj.uniqueID);
				    		}
				    	
				    	});
			    		
			    	}
			    });
			    	ProductHelper.fetchProductDetails(freqBoughtProducts);
			    	if(freqBoughtProducts === null || freqBoughtProducts === undefined || freqBoughtProducts.length<1){
			    		$( "#frequentlyPurchased").remove();
			    	}
			    	
			    	return freqBoughtProducts;
			 
		},
		
		loadUpsellMerchandisingAssociations : function(prodId){
			 var upSellProducts = [];
			 var recommendedProducts = [];
			 var categoryId ;
			 var catgroup = $("#catgroupId").val();
			 var emsName = "PDP_Recommendation_"+catgroup;
			 var enableUpsell=$('#upsell').val();
			 var enableProdRecomm= $('#recommendedProd').val();
			 var self = this;
			 if(window.location.protocol === "https:"){
		    		this.urlPrefix=  WCParamJS.searchSecureHostNamePath+ '/search/resources/store/';
			} if(enableUpsell==1){
			 var data=DMStorage.getValue('upsellProducts_'+prodId,data);
			 if(!data){
				 var ajaxCallParams = {
						    url: this.urlPrefix + this.pageid.storeId + '/productview/byId/' + prodId+'?t='+new Date().getTime(),
						    method: 'GET',
						    context: this,
						    async: false
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
				 $.ajax(ajaxCallParams).done(function(response) {
						DMStorage.set('upsellProducts_'+prodId,response);
						data=response;
					});
			 }
			 
			 $.each(data.catalogEntryView, function(prodIndx, productDetails1) {
			    	if(productDetails1.merchandisingAssociations != null){
			    		$.each(productDetails1.merchandisingAssociations,function(merchIndex, merchObj1){
				    		//console.debug(" Unique ID : "+merchIndex + " - "  + merchObj.uniqueID + " :: " + merchObj.associationType);
				    		var assoType = merchObj1.associationType;
				    		if(assoType != null && assoType.length >0 && assoType == 'UPSELL'){
				    			upSellProducts.push(merchObj1.uniqueID);
				    			//console.debug("Product Upsell " + merchObj1.uniqueID);
				    		}
				    		
				    	});				    		
			    	}
			    });
			 
		}
			 else{
				 $('#upSellHead').hide();
			 }
				  if(enableProdRecomm==1){
					  var marketingSpotData=DMStorage.getValue('MarketingSpotData_'+prodId);
					  var catRecomm="PDP_Recommendation_" + $('#emsCatgroupId').val();
					  if(!marketingSpotData){
						var ajaxCallParams = {
							    url: this.urlPrefixWcs + this.pageid.storeId + '/espot/' + catRecomm+'?t='+new Date().getTime(),
							    method: 'GET',
							    context: this,
							    async: false
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
							marketingSpotData = data.MarketingSpotData;
							DMStorage.set('MarketingSpotData_'+prodId,data.MarketingSpotData);
						});
					}
				    if(marketingSpotData != null){
						$.each(marketingSpotData, function(index, marketingSpotDetails) {
							if(marketingSpotDetails.baseMarketingSpotActivityData != null){
								$.each(marketingSpotDetails.baseMarketingSpotActivityData,function(merchIndex, baseMarketingSpotActivityDataObj){
									categoryId = baseMarketingSpotActivityDataObj.categoryId;
						    		//console.debug(" productPartNumber : "+ baseMarketingSpotActivityDataObj.productId);
						    	});
							}
					    });
					}
						if(categoryId !=null){
							var catentryView=DMStorage.getValue('catentryView_'+prodId);
						if(!catentryView){
							 var ajaxCallParams = {
									 	url: this.urlPrefix + this.pageid.storeId + '/productview/byCategory/' + categoryId+'?t='+new Date().getTime(),
									    method: 'GET',
									    context: this,
									    async: false
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
									DMStorage.set('catentryView_'+prodId,data.catalogEntryView);
									catentryView = data.catalogEntryView;
								});
						}
						 if(catentryView != null){
								$.each(catentryView, function(index, catentryViewDetails) {
									//console.debug(" productPartNumber : "+ catentryViewDetails.uniqueID);
									recommendedProducts.push(catentryViewDetails.uniqueID);
								});
							}
					}
				
					
				}
				else{
					$('#recommHead').hide();
				}
//					$(document).on('dmart.recomm.products.loaded',
//							function(event) {
//								 $(document).trigger('dmart.recommendation.upsell',[upSellProducts,recommendedProducts]);
//							$(document).off('dmart.recomm.products.loaded');
//					});
				    
				    var recommCount=0;
				    var upsellCount=0;
				    if(upSellProducts != null || recommendedProducts != null ){
				    	if(upSellProducts !=null){
				    		upsellCount = upSellProducts.length;
				    	}
				    	if(recommendedProducts !=null){
				    		recommCount = recommendedProducts.length;
				    	}
				    	$("#upsellProdCount").val(upsellCount);
				    	$("#recommendationProdCount").val(recommCount);
				    	self.loadProducts(upSellProducts,recommendedProducts);
				    }	
				    				  
				//});
			 	
			  
			
		},
		triggerUpsell: function(upSellProducts,recommendedProducts){
			//var currProductId = $('#currProductId').val();
			var currCatalogId = $('#currCatalogId').val();
			if(currCatalogId != null && currCatalogId != undefined){
				productsRecommendation.init(currCatalogId.toString(),null,upSellProducts,recommendedProducts,'upselling', null);
			}
		},
		
		 /**
	     * Fetch items and attributes for the products.
	     * 
	     * Fetch inventory and price for items
	     * 
	     */
		loadProducts: function (upsell,recomm) {
			
			
	        var len1 = upsell.length,
	        	len2 = recomm.length,
	            i = 0,
	            inputArr = [];
	        	inputPriceArr = [];
	        	
	        var self = this;

	        // Get all products not available in localStorage
	        $.each(upsell, function (indx, productId) {
	        	inputPriceArr.push(productId);
	            if (DMStorage.invalid('proditems_'+self.pageid.storeId+productId)) {
	                inputArr.push(productId);
	            }
	        });
	        $.each(recomm, function (indx, productId) {
	        	inputPriceArr.push(productId);
	            if (DMStorage.invalid('proditems_'+self.pageid.storeId+productId)) {
	                inputArr.push(productId);
	            }
	        });
	        if(window.location.protocol === "https:"){
	    		this.urlPrefix=  WCParamJS.searchSecureHostNamePath+ '/search/resources/store/';
	        }
	     // Go for SOLR call only if there are items not in localStorage ( or expired items)
	        if (inputArr.length > 0) {

	            var idString = 'id=' + inputArr.join('&id=');
	            var ajaxCallParams = {
		                url: this.urlPrefix + this.pageid.storeId + '/productview/byIds?' + idString,
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
	            
	            $.ajax(ajaxCallParams).done(

	                function(data) {

	                    var itemsDetails = [];
	                    // For each catalog entry 
	                    $.each(data.catalogEntryView, function(prodIndx,
	                        productDetails) {
	                        var items = [];
	                        if(DMStorage.getValue('prod_' + productDetails.uniqueID) == null){
	                        	var productBean ={};
	                            productBean.attribs = productDetails;
	                            DMStorage.set('prod_' + productDetails.uniqueID, productBean);
	                        }
	                        // For each item under the product
	                        $.each(productDetails.sKUs,

	                            function(skuIndx, item) {
	                                if (DMStorage.invalid('item_' + item.uniqueID)) {
	                                    items.push(item.uniqueID);
	                                    itemsDetails.push(item.uniqueID);
	                                    DMStorage.set(
	                                        'item_' + item.uniqueID,
	                                        item);
	                                }
	                            });

	                        DMStorage.set('proditems_' + self.pageid.storeId + productDetails.uniqueID, items);
	                        // Remove duplicate field
	                        //productDetails.sKUs = undefined;
	                        /*
	                         * fire price and inventory calls here		
	                         */
	                    });

	                    // Signal AJAX response has been parsed
	                    // and products are ready (move this to success call of
	                    // price and inventory )
	                    // should be done only after price load
	                    this.fetchPriceAndInvDetails(itemsDetails,upsell,recomm);
	                    // $(document).trigger('dmart.products.loaded',this.pageNumber);
	                });
	        } else {
	            // Products are already available in localStorage
	            //$(document).trigger('dmart.products.loaded',this.pageNumber);
	            this.fetchPriceAndInvDetails(inputPriceArr,upsell,recomm);
	            //$(document).trigger('dmart.category.facet.loaded','facet_'+this.pidstr);
	        }
	    },
	    
	    /**
	     * Fetch items and attributes for the products.
	     * 
	     * Fetch inventory and price for items
	     * 
	     */
	    fetchPriceAndInvDetails: function(arr,upsell,recomm) {

	        var len = arr.length,
	            i = 0,
	            inputArr = [];
	        var currStoreId = WCParamJS.storeId;
	        // Get all item with price and inv not available in localStorage
	        $.each(arr, function(indx, itemId) {
	            if (DMStorage.invalid('item_PriceInv_' + currStoreId + itemId)) {
	                inputArr.push(itemId);
	            }
	        });
	        if(window.location.protocol === "https:"){
	    		this.urlPrefix=  WCParamJS.searchSecureHostNamePath+ '/search/resources/store/';
	        }
	        // Go for SOLR call only if there are items not in localStorage ( or expired items)
	        if (inputArr.length > 0) {
	            var idString = 'id=' + inputArr.join('&id=');
	            var ajaxCallParams = {
		                url: this.urlPrefix + this.pageid.storeId + '/productview/byIds?' + idString+ '&profileName=X_findProductPrices_DMART',
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
	                $.each(data.DocumentList, function(itmIndx, itemDetails) {
	                	var price = {};
	                    var offerpriceString="price_SALE_"+currStoreId;
	                    var sellingpriceString="price_MRP_"+currStoreId;
	                    price.offerPrice = itemDetails[offerpriceString];
	                    price.sellingPrice = itemDetails[sellingpriceString];
	                    if(itemDetails["inv_status_"+currStoreId] && itemDetails["inv_status_"+currStoreId]==0){
	                    	price.inventoryStatus = false;
	                    }
	                    else{
	                    	price.inventoryStatus = true;
	                    }
	                    	
	                    DMStorage.set('item_PriceInv_' + currStoreId + itemDetails.catentry_id, price);
	                });                
	                //$(document).trigger('dmart.recomm.products.loaded', this.pageNumber);
	                this.triggerUpsell(upsell,recomm);
	            });
	        } else {
	            //$(document).trigger('dmart.recomm.products.loaded', this.pageNumber);
	        	this.triggerUpsell(upsell,recomm);
	        }
	    },
		
		loadProductRecommendations : function(){
			 var recommendedProducts = [];
			 var catgroup = $("#catgroupId").val();
			 var emsName = "PDP_Recommendation_"+catgroup;
			 var ajaxCallParams = {
					    url: this.urlPrefixWcs + this.pageid.storeId + '/espot/' + emsName,
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
					var marketingSpotData = data.MarketingSpotData;
					if(marketingSpotData != null){
						$.each(marketingSpotData, function(index, marketingSpotDetails) {
							if(marketingSpotDetails.baseMarketingSpotActivityData != null){
								$.each(marketingSpotDetails.baseMarketingSpotActivityData,function(merchIndex, baseMarketingSpotActivityDataObj){
						    		//console.debug(" productPartNumber : "+ baseMarketingSpotActivityDataObj.productId);
						    		recommendedProducts.push(baseMarketingSpotActivityDataObj.productId);
						    	});
								
							}
					    });
					}
					ProductHelper.fetchProductDetails(recommendedProducts);
			
				});
				$(document).on(
						'dmart.products.loaded',
						function(event) {
							 $(document).trigger('dmart.recommendation.products',[recommendedProducts]);
						$(document).off('dmart.products.loaded');
					});
		},
		
		
		
		waitForUpsellTrigger : function(){
			var self = this;
			$(document).on('dmart.upsell.master', function() {
				var prodId = $("#productIdentifier").val();
				//console.debug("waitForUpsellTrigger "+ prodId);
				self.loadUpsellMerchandisingAssociations(prodId);
			});
		},
		
		waitForFrequentTrigger : function(){
			var self = this;
			$(document).on('dmart.frequent.master', function() {
				var prodId = $("#prodIdentifier").val();
				self.loadFrequentMerchandisingAssociations(prodId);
			});
		},
		
		waitForRecommendationTrigger : function(){
			var self = this;
			$(document).on('dmart.recommendations.master', function() {
				var catgroup = $("#catgroupId").val();
			});
		}
		
};

$(document).ready(function () {
	$(document).on('click','#frequentlyPurchased .product-listing-item__primary input[type="checkbox"]', function (event) {
		$(this).parents('.js-alter-module').find('.pdp-alternate-list__summary-add-cta').css('display', 'inline');
	    $(this).parents('.js-alter-module').find('.pdp-alternate-list__summary-added-cart-cta').hide();
	    $(this).parents('.js-alter-module').find('.existing-order__price-view-cart-btn').hide();
	    $(this).parents('.product-listing-item__primary').toggleClass('selected');
	    var totalLi = $(this).parents('.product-listing-item').parent().parent().find('.product-listing-item').length;
	    var alterTotal = $(this).parents('.js-alter-module').find('.product-listing-item__primary input:checked').not(':disabled').length;
	    if (alterTotal === totalLi) {
	    	alterTotal = 'All';
	    }
	    else if(alterTotal >= 1) {
	    	$(this).parents('.js-alter-module').find('.js-alter-cta-panel').show();
	    }
	    else {
	    	$(this).parents('.js-alter-module').find('.js-alter-cta-panel').hide();
	    }
	    if(alterTotal <1) {
	        $(this).parents('.js-alter-module').find('.js-alter-cta-panel .pdp-alternate-list__summary-add-cta').hide();
	        $(this).parents('.js-alter-module').find('.js-alter-cta-panel .existing-order__price-view-cart-btn').show();

	      }
	    $(this).parents('.js-alter-module').find('.pdp-alternate-list__summary-add-cta span, .js-mylist-add-all span, .exiting-order__price-added-btn span, .pdp-alternate-list__summary-added-cart-cta span').text(alterTotal);
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
	  });
});