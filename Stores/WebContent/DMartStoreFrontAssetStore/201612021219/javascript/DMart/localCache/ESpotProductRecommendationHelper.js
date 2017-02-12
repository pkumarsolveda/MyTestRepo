/**
 * 
 */
var espotProductsRecommendation = {
		urlSolrPrefix : WCParamJS.searchHostNamePath+ '/search/resources/store/',
		isHomePage : true,
		itemsObjectArray : {},
		init : function() {
			var self = this;
			// Commented out for AE-16296
			/*$('.landing-quick-shop').parents('.contentRecommendationWidget').removeClass('contentRecommendationWidget');
			$('.landing-quick-shop').parents('.left_espot').removeClass('left_espot');
			$('.landing-banner').parents('.contentRecommendationWidget').css('margin-top','0px');
			$('.landing-banner').parents('.contentRecommendationWidget').removeClass('contentRecommendationWidget');
			$('.landing-banner').parents('.left_espot').removeClass('left_espot');*/
			//$('#mostpopular').hide();
			var ajaxCallParams = {
					url: window.location.protocol + '//' + window.location.hostname + '/wcs/resources/store/' + WCParamJS.storeId + '/espot/' + 'DMartMostPopularItems',
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
				if(data.MarketingSpotData && data.MarketingSpotData[0].baseMarketingSpotActivityData) {

					var catentries = data.MarketingSpotData[0].baseMarketingSpotActivityData;
					var length = catentries.length;
					var itemIds = [];
					for(var i=0;i<length;i++) {
						itemIds.push(catentries[i].productId);
					}

					this.getItemDetails(itemIds,true);
				}else{
					if ($('#mostpopular .landing-tabs--title').css('visibility') != 'hidden') {
						$('#mostpopular .landing-tabs--title').css('display','none');
					 }
					
				}

			}).fail(function(){

			});
		},

		renderProducts : function(itemIds) {
			var list = [];
			$.each(this.itemsObjectArray,function(itemId, item){
				if(item.inventoryStatus == true) {  list.push(itemId);}
			});
			// If no in stock items to display
            if(list.length == 0) {
            	return;
            }
			
            $('#mostpopular').removeClass('js-hide-show');
			
			nunjucks.configure(WCParamJS.staticServerHost+'templates', {
				autoescape: true,
				web: {
					useCache: true
				}
			});
			var JSONdata = {
					itemDetails : this.itemsObjectArray,
					itemIds : itemIds,
					config : {
						homePageURL :WCParamJS.homepageURLHierarchy,
						catalogId :WCParamJS.catalogId,
						storeId: WCParamJS.storeId,
						langId :WCParamJS.langId,
						noImagePath: WCParamJS.staticServerHost+'images/DMart/NoImage_M.jpg',
						baseUrl: window.location.origin+'/webapp/wcs/stores/servlet/'
					}
			};
			var genHTML = nunjucks.render('/_modules/landing-upper-product.nunjucks', {data: JSONdata});
			$('#popular').append(genHTML);
			if (!$('#mostpopular .landing-tabs--title').css('visibility') === 'hidden') {
				 $('#mostpopular .landing-tabs--title').css('display','block');
			 }				 
			
			$('#popular').ready(function(){
				var gridBreakpointsSm = 1023;
				if ($(window).width() <= gridBreakpointsSm) {
					 // landing Most Popular for small devices
				      $('.js-landing-upper-carousel').flexslider({
				        selector: '.slides:first > li',
				        animation: 'slide',
				        animationLoop: false,
				        slideshowSpeed: 3000,
				        animationSpeed: 500,
				        slideshow: false,
				        controlNav: false,
				        reverse: false,
				        itemWidth: 268,
				        itemMargin: 12,
				        minItems: 1,
				        maxItems: 3,
				        move: 1,
				        smoothHeight: false,
				        touch: true,
				        customDirectionNav: $('.promotions-carousel-navigation a')
				      });
				}else{
					// landing Most Popular for large devices
				      $('.js-landing-upper-carousel').flexslider({
				        selector: '.slides:first > li',
				        animation: 'slide',
				        animationLoop: false,
				        slideshowSpeed: 3000,
				        animationSpeed: 500,
				        slideshow: false,
				        controlNav: false,
				        reverse: false,
				        itemWidth: 357,
				        itemMargin: 14,
				        minItems: 1,
				        maxItems: 3,
				        move: 1,
				        smoothHeight: false,
				        useCSS: false,
				        customDirectionNav: $('.promotions-carousel-navigation a')
				      });
				      if($('#mostpopular .promotion-panel').length < 3){
							 $('#mostpopular .promotions-carousel-navigation').hide();
					  }
				}
	        });	
			/*if($.trim($('#popular ul').html()).length == 0) {
				$('#mostpopular').hide();
			}*/
			this.changeDivLengthForGuestUser();
		},
		isGuestUser : function(){
			return typeof storeUserType != "undefined" && storeUserType == "G" ? true : false;
		}, 
		changeDivLengthForGuestUser : function(){
			if(this.isGuestUser() && $('#mostpopular .promotion-panel').length > 2 && $('.landing-quick-shop').length ==0){
				$('.landing-tabs.landing-tabs--primary.spacing-bottom').parent().removeClass('col-xs-12 col-md-8 col-lg-9').addClass('col-xs-12 col-md-12 col-lg-12');
			}
		},
		getItemDetails : function (ids,isHomePage,callBack,callBackParams) {
			if(ids.length ==0){
				return false;
			}
			this.isHomePage=isHomePage;
			var self = this;
			var itemIdStr = 'id='+ids.join('&id=');
			var ajaxCallParams = {
					url: WCParamJS.searchURLPrefix[window.location.protocol]+ '/search/resources/store/' + WCParamJS.storeId + '/productview/byIds?' + itemIdStr +'&profileName=X_findProductByIds_Details_DMART',
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
				$.each(data.catalogEntryView, function(itemIndx,
						itemDetails) {
					var constant=DMartAttributes.Constants;
					var sizeAttributeConstants=DMartAttributes.Constants.SizeAttributeConstants;
					var colourAttributeConstants=DMartAttributes.Constants.Apparel.Defining.Colour;
					var attribCombo = {};
					var brandName =itemDetails.manufacturer, type='', brandAttr='';
					var imageObj = {};
					var imageURLs = [];
					var maxOrderQty=0;
					$.each(itemDetails.attributes, function() {

						if (this.usage === 'Defining') {
							var attribName = this.name;
							var identifer = this.identifier;
							var list = $.grep(sizeAttributeConstants,function(str){
		            			return identifer.indexOf(str) === 0;
		            		});
							if(list.length>0) {
		            			 attribName = 'Size';
		            		}
							/*if(this.identifier.indexOf(sizeAttributeConstants) !== -1 ) {
								attribName = 'Size';
							}*/
							if(colourAttributeConstants.indexOf(this.identifier) !== -1 ) {
								attribName = 'Colour';
							}
							attribCombo[attribName] = this.values[0].value;
						}
						if (this.usage === 'Descriptive') {
							if (this.identifier == constant.Grocery.Descriptive.ImageDisplayCode) {
								imageObj['imageFlag'] = parseInt(this.values[0].value).toString(2);
							}
							if (this.identifier == constant.Grocery.Descriptive.ImageDisplayKey) {
								imageObj['imageIdentifier'] = this.values[0].value;
							}
							if (this.name.toUpperCase() === constant.Grocery.Descriptive.CategoryType) {
								type= this.values[0].value.toLowerCase();
							}
							if (this.name === 'ITEMWISE') {
					   	    	maxOrderQty= this.values[0].value;
					   	    }
						}
					});
					if((brandName == "undefined" || brandName == null || brandName == "")&&(typeof type != "undefined" && type != null && type != "" && type != 'apparel')){
						/*if(this.identifier === constant.Grocery.Filters.Brand || this.identifier === 'Brand' || this.identifier === constant.HouseHold.Filters.Brand) {
							brandName = this.values[0].value;
							return ;
						}*/
						
						if(type==='grocery'){
							brandAttr=DMartAttributes.Constants.Grocery.Filters.Brands;
						}else if(type=='houseHold' || type==='general_merchandise'){
							 brandAttr=DMartAttributes.Constants.HouseHold.Filters.Brands;
						}
						$.each(brandAttr,function(indx,val){
							$.each(itemDetails.attributes, function() {
								if(this.name.indexOf(val) > -1){
									if(this.values){
										brandName = this.values[0].value;
									}
								}
							});	
						});
					}	
					if (!imageObj['imageIdentifier']) {
						imageObj['imageIdentifier'] = itemDetails.partNumber;
					}

					if(imageObj.imageFlag){
						$.each(imageObj.imageFlag.split(''), function(index, flag) {
							if(flag == '1'){
								var imageNameWithPath = imageObj.imageIdentifier.replace(/(\S)(\S)(\S)\S*/,'$1/$2/$3/'+imageObj.imageIdentifier);
								imageURLs.push(WCParamJS.imageServerHost+'images/DMart/products/'+imageNameWithPath + '_' + parseInt(index + 1) + '_M.jpg');
							}
						});
					}
					
					if(maxOrderQty == 0){
	                	maxOrderQty=confMaxOrderQty;
	                }
					
					var itemId = itemDetails.uniqueID;
					self.itemsObjectArray[itemId] = {};
					self.itemsObjectArray[itemId].brand=brandName;
					self.itemsObjectArray[itemId].attributes=attribCombo;
					self.itemsObjectArray[itemId].imageURL=imageURLs;
					self.itemsObjectArray[itemId].type=type;
					self.itemsObjectArray[itemId].name=itemDetails.name;
					self.itemsObjectArray[itemId].maxOrderQty=maxOrderQty;
					self.itemsObjectArray[itemId].itemId = itemId;
					self.itemsObjectArray[itemId].categoryId = itemDetails.parentCatalogGroupID;
					self.itemsObjectArray[itemId].qtyInCart=0;
					self.itemsObjectArray[itemId].orderItemId='';
					
					if(itemDetails.promotion_Store == assetStoreId || itemDetails.promotion_Store == WCParamJS.storeId){
						self.itemsObjectArray[itemId].promotion_Store = itemDetails.promotion_Store;
						self.itemsObjectArray[itemId].promotion_Flag = itemDetails.promotion_Flag;
						self.itemsObjectArray[itemId].promotion_Message = itemDetails.promotion_Message;
					}
					// SEO url
					self.itemsObjectArray[itemId].seo_token_ntk = itemDetails.seo_token_ntk;
					self.itemsObjectArray[itemId].productId = itemDetails.parentCatalogEntryID;

				});
				this.getItemInventoryAndPrice(ids,callBack,callBackParams);
				this.getCartDetailsforESpot();
			});

		},

		getItemInventoryAndPrice : function(itemIds,callBack,callBackParams) {
			var i=0, length = itemIds.length,itemId = '', currStoreId = WCParamJS.storeId,allItemIds = itemIds.slice();
			var offerpriceString="price_SALE_"+currStoreId;
			var sellingpriceString="price_MRP_"+currStoreId;
			var self = this;
			for(;i<length;i++) {
				itemId = allItemIds[i];
				if (!DMStorage.invalid('item_PriceInv_' + currStoreId + itemId)) {
					var priceCache = DMStorage.getValue('item_PriceInv_' +currStoreId + itemId);
					self.itemsObjectArray[itemId].offerPrice = priceCache.offerPrice;
					self.itemsObjectArray[itemId].sellingPrice = priceCache.sellingPrice;
					self.itemsObjectArray[itemId].inventoryStatus = priceCache.inventoryStatus;
					allItemIds.splice(i,1);
				}
			}


			if(allItemIds.length>0) {
				allItemIds = 'id='+allItemIds.join('&id=');
				var ajaxCallParams = {
						url: WCParamJS.searchURLPrefix[window.location.protocol]+ '/search/resources/store/' + WCParamJS.storeId  + '/productview/byIds?' + allItemIds+ '&profileName=X_findProductPrices_DMART',
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
						var itemId = itemDetails.catentry_id;		
						if(typeof self.itemsObjectArray[itemId] != "undefined" && self.itemsObjectArray[itemId] != null){
							self.itemsObjectArray[itemId].priceExists=true;
			                if (typeof itemDetails[offerpriceString] == "undefined" || itemDetails[offerpriceString] == 0 || itemDetails[offerpriceString] ==null || isNaN(itemDetails[offerpriceString])){
			                	itemDetails[offerpriceString] = 0;
			                	self.itemsObjectArray[itemId].priceExists=false;
			                }
			                if (typeof itemDetails[sellingpriceString] == "undefined" || itemDetails[sellingpriceString] == 0 || itemDetails[sellingpriceString] ==null || isNaN(itemDetails[sellingpriceString])){
			                	itemDetails[sellingpriceString] = 0;
			                	self.itemsObjectArray[itemId].priceExists=false;
			                }
			                self.itemsObjectArray[itemId].offerPrice = itemDetails[offerpriceString];
							self.itemsObjectArray[itemId].sellingPrice = itemDetails[sellingpriceString];						
			                if((typeof itemDetails[offerpriceString] != "undefined" && itemDetails[offerpriceString] != 0 && itemDetails[offerpriceString] !=null)&&(Number(itemDetails[offerpriceString]) < Number(itemDetails[sellingpriceString]))){
			                	//self.itemsObjectArray[itemId].savings = +(itemDetails[sellingpriceString] - itemDetails[offerpriceString]).toFixed(2);
			               	 	self.itemsObjectArray[itemId].priceExists=true;
			                }
			                if(itemDetails["inv_status_"+currStoreId] && itemDetails["inv_status_"+currStoreId]==0){
			                	self.itemsObjectArray[itemId].inventoryStatus = false;
		                    }
		                    /*else if(itemDetails["inv_status_"+storeId]>0){
		                    	price.inventoryStatus = true;
		                    }*/else{
		                    	self.itemsObjectArray[itemId].inventoryStatus = true;
		                    }
						}					
					}); 
					if(callBack) {
						callBack.apply(this,callBackParams);
					} else if(this.isHomePage){
						this.renderProducts(itemIds);
					}else{
						$(document).trigger('dmart.cart.itemEspot.load');
					}
				});
			} else {
				if(callBack) {
					callBack.apply(this,callBackParams);
				} else if(this.isHomePage){
					this.renderProducts(itemIds);
				}else{
					$(document).trigger('dmart.cart.itemEspot.load');
				}
			}

		},
		/** 
		 * Get all item ids configured in sliding banner
		 * 
		 */
		getBannerItemIds : function() {
			var itemIds=[];
			$.each($('.landing-banner .slides li'),function(){
				var itemid = $(this).data('itemid');
				if(itemid) {
					itemIds.push(itemid);
				}
			});
			return itemIds;
		},
		/**
		 * Entry point for homepage banner items.
		 * Populates all item properties in banner. 
		 */
		loadBannerItems : function(){
			var itemIds = this.getBannerItemIds();
			if(itemIds && itemIds.length > 0) {
				this.getItemDetails(itemIds,false,this.showBannerItemDetails,[itemIds]);
			}
		},
		/**
		 * Callback function (for homepage banner) after all items are loaded through ajax
		 */
		showBannerItemDetails : function(itemIds) {
			var i=0,len = itemIds.length;
			for(;i<len;i++) {
				var thisItem = espotProductsRecommendation.itemsObjectArray[itemIds[i]];
				if(typeof thisItem != "undefined" && thisItem != null){
					var $bannerSection = $('.landing-banner .slides li[data-itemid='+itemIds[i]+'] .banner-caption');
					$bannerSection.find('.banner-caption--title span').html(thisItem.attributes.Size);
					if(thisItem.sellingPrice == thisItem.offerPrice) {
						$bannerSection.find('.banner-caption--mrp').hide();
					} else {
						$bannerSection.find('.banner-caption--mrp .strike-diagonal').html('<i class="icon-rupees"></i>'+thisItem.sellingPrice);
					}
					$bannerSection.find('.banner-caption--dmart-price').html('DMart <i class="icon-rupees"></i>'+thisItem.offerPrice);
					$bannerSection.parents('li').attr('data-maxorderqty',thisItem.maxOrderQty);
					$bannerSection.parents('li').attr('data-orderitemid',thisItem.orderItemId);
					//this.updateBannerForItemsInCart();
				}				
			}
		},
		
		getCartDetailsforESpot : function (){
			var cartJson = DMStorage.getValue('OrderId');
			//var self = this;			
			if(typeof cartJson == "undefined" || cartJson === null) {
	              return;
	        }
	        if(typeof cartJson != 'undefined' && typeof cartJson.orderItems != 'undefined' ){
		        $.each(this.itemsObjectArray,function(indx,itemDetails) {
		        	itemDetails.qtyInCart =  cartJson?SearchHelper.findQtyInCart(cartJson.orderItems,itemDetails.itemId):0;
					if(cartJson) {
						var orderItem = $.grep(cartJson.orderItems,function(item){
							return item.catentryId == itemDetails.itemId && item.freeGift == 'false';
						});
						itemDetails.orderItemId = orderItem.length>0?orderItem[0].orderItemId:'';
					} else {
						itemDetails.orderItemId = '';
					}
		        });
	        }
	        this.updateBannerForItemsInCart();
		},
		
		updateBannerForItemsInCart : function(){
			var cartJson = DMStorage.getValue('OrderId');
			if(typeof cartJson != 'undefined' && typeof cartJson.orderItems != 'undefined' ){
		        $.each(this.itemsObjectArray,function(indx,itemDetails) {
		        	itemDetails.qtyInCart =  cartJson?SearchHelper.findQtyInCart(cartJson.orderItems,itemDetails.itemId):0;
		        	var $bannerSection = $('.landing-banner .slides li[data-itemid='+itemDetails.itemId+'] .banner-caption');
					if(itemDetails.qtyInCart === 0) {
				    	$bannerSection.find('.product-search__btn-addtocart').show();
				    	$bannerSection.find('.quantity-select').addClass('js-hide-show');
				    }else {
			    	    $bannerSection.find('.product-search__btn-addtocart').hide();
			    	    $bannerSection.find('.quantity-select').removeClass('js-hide-show');
			    	    $bannerSection.find('.quantity-select .quantity-input .form__input').val(itemDetails.qtyInCart);
				    }
		        });
	        }	        
		}


};

// Event handling
function espotHandleAfterAddToCart(data,itemId) {
	var suggestion = $('li[data-itemid='+itemId+']');
	if($(suggestion).hasClass('promotion-panel')){
		$(suggestion).find('.product-search__btn-addtocart').html('<i class="icon-cart"></i>Add To Cart').removeClass('ADDED').hide();
	}else{
		$(suggestion).find('.product-search__btn-addtocart').html('<i class="icon-cart"></i>Add').removeClass('ADDED').hide();
	}
    $(suggestion).find('.quantity-select').removeClass('js-hide-show');
    $(suggestion).find('.quantity-select .quantity-input .form__input').val(1);
    var itemInHotspot = espotProductsRecommendation.itemsObjectArray[itemId];
    if(itemInHotspot) {
    	itemInHotspot.qtyInCart = 1;
    }
    $(suggestion).attr('data-orderitemid',data.orderItem[0].orderItemId);
}
$(document).on('click','.promotion-panel__btn-addtocart.product-search__btn-addtocart', function() {
	if($(this).hasClass('ADDED')) {
		return;
	}
	$(this).addClass('ADDED');
    $(this).empty();
    var strVar="";
    strVar += "<span class=\"added-animated\"><i class=\"icon-cart-added\"><\/i> Added<\/span>";
    $(this).append(strVar);
	var params = {};
	params.catEntryId_1 = $(this).parents('li').data('itemid');
	params.quantity_1 = 1;
	callAddToCart(params,espotHandleAfterAddToCart,[params.catEntryId_1]);
});
var TIMEOUT_IN_MS = 100;
var globalTimeOut = {};
$(document).on('click','.js-quantity-plus', function () {
	var itemId = $(this).parents('li').attr('data-itemid');
	if(globalTimeOut[itemId]) {
		window.clearTimeout(globalTimeOut[itemId]);
	}
	var qty = $(this).parents('.quantity-select').find('.quantity-input .form__input').val();
	var params = {};
	var maxorderqty =  $(this).parents('li').attr('data-maxorderqty');
	params.orderItemId_1 = $(this).parents('li').attr('data-orderitemid'); 
    if(parseInt(qty) <= maxorderqty) {
      var newQty = parseInt(qty) + 1;
      if(newQty<=maxorderqty) {
	      $(this).parents('.quantity-select').find('.quantity-input .form__input').val(newQty);
	     
	  	  params.quantity_1 = newQty+'';
      } else {
    	  params.quantity_1 = maxorderqty;
      }
  	  globalTimeOut[itemId]=window.setTimeout(function() {  doneWithClicking(params); },TIMEOUT_IN_MS);
    }
    
});

$(document).on('click','.js-quantity-minus', function () {
	var itemId = $(this).parents('li').attr('data-itemid')
	if(globalTimeOut[itemId]) {
		window.clearTimeout(globalTimeOut[itemId]);
	}
	var qty = $(this).parents('.quantity-select').find('.quantity-input .form__input').val();
	var params = {};
    if(parseInt(qty) > 0) {
      var newQty = parseInt(qty) - 1;
      $(this).parents('.quantity-select').find('.quantity-input .form__input').val(newQty);
      // Save context
      var self = this;
      params.orderItemId_1 = $(this).parents('li').attr('data-orderitemid'); 
  	  params.quantity_1 = newQty+'';
  	  params.itemId = itemId;
      if(newQty === 0) {
    	    var  suggestion = $(this).parents('li');
    	    $(suggestion).find('.product-search__btn-addtocart').show();
    	    $(suggestion).find('.quantity-select').addClass('js-hide-show');
      }	
  	  globalTimeOut[itemId]=window.setTimeout(function() {  doneWithClicking(params); },TIMEOUT_IN_MS);
    }

});

function doneWithClicking(params) {
	if(globalTimeOut[params.itemId]) {
		window.clearTimeout(globalTimeOut[params.itemId]);
	}
	callUpdateCartService(params,function(){},[]);
	//$(self).parents('.quantity-select').find('.quantity-input .form__input').val();
}
