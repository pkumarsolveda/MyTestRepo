var cartDisplay = {
		urlPrefix: window.location.protocol + '//' + window.location.hostname ,
	    wcsResources : '/wcs/resources/store/' ,
	    searchResources : WCParamJS.searchHostNamePath+'/search/resources/store/' ,
	    shareCartCall : true,
		itemModalDetails : {},
		itemModalItems : [],
		groupedMissedProducts : {},
		levelThreeCategories : [],
		levelThreeCategoyNames : {},
		collapsed : [],
    /**
     * Entry point to the js class
     */
		diplayPromotion: function(divId,imagePath) { 
        
			var JSONdata = {}, modalDetails = {}, self = this;
			var urlPrefixWcs = window.location.protocol + '//' + window.location.hostname + '/wcs/resources/store/';
			var urlPrefixSolr = WCParamJS.searchHostNamePath+ '/search/resources/store/';
			$.each($('.promotion-more-link'),function (index, eachItem){
				var content, target, espotName, itemId;
				target = $(eachItem).data('target');
				if(typeof modalDetails[target] == "undefined" || modalDetails[target] == null){
					modalDetails[target] = {};
					content = $(eachItem).data('content');
					modalDetails[target].target=target;
					modalDetails[target].content=content;
					if(content == "content"){				
						espotName=$(eachItem).data('espot');
						modalDetails[target].espotName=espotName;
					}else if (content == "item"){
						itemId=$(eachItem).data('item');
						modalDetails[target].itemId=itemId;
					}			
					console.log(content +" at "+ index + " has tagert "+target);
				}
			});
			$.each(modalDetails,function (index, modalObj){
				if(modalObj.content == "content"){
					var emsName= modalObj.espotName;
					var marketingSpotData;
					var params = {};
					params.imagePath = imagePath;
					$.ajax({
						url: urlPrefixWcs + WCParamJS.storeId + '/espot/' + emsName,
						method: 'GET',
						context: this,
						async: false,
						data: params,
					}).done(function(data) {
						if(typeof data.MarketingSpotData[0] != "undefined" && data.MarketingSpotData[0] != null){
							if(typeof data.MarketingSpotData[0].baseMarketingSpotActivityData[0] != "undefined"  && data.MarketingSpotData[0].baseMarketingSpotActivityData[0] != null){
								if(typeof data.MarketingSpotData[0].baseMarketingSpotActivityData[0].marketingContentDescription[0] != "undefined" && data.MarketingSpotData[0].baseMarketingSpotActivityData[0].marketingContentDescription[0] != null){
									marketingSpotData = data.MarketingSpotData[0].baseMarketingSpotActivityData[0].marketingContentDescription[0].marketingText;
									$('#' + divId).append(marketingSpotData);
								}
							}
						}
					});
				}else if(modalObj.content == "item"){
					self.itemModalItems.push(modalObj.itemId);
					self.itemModalDetails[modalObj.itemId] = {};
					self.itemModalDetails[modalObj.itemId].itemId=modalObj.itemId;
					self.itemModalDetails[modalObj.itemId].content=modalObj.content;
					self.itemModalDetails[modalObj.itemId].target=modalObj.target;
				}
			});
			espotProductsRecommendation.getItemDetails(self.itemModalItems,false);

		},

		displayPromoPopUps : function (divId){
			var itemDetails={};
			var self = this;
			itemDetails= espotProductsRecommendation.itemsObjectArray;
			$.each(self.itemModalItems,function (index, modalItem){
				if(self.itemModalDetails[modalItem] && itemDetails[modalItem]) {
					self.itemModalDetails[modalItem].name=itemDetails[modalItem].name;
					self.itemModalDetails[modalItem].brand=itemDetails[modalItem].brand;
					self.itemModalDetails[modalItem].attributes=itemDetails[modalItem].attributes;
					self.itemModalDetails[modalItem].imageURL=itemDetails[modalItem].imageURL[0];
					self.itemModalDetails[modalItem].type=itemDetails[modalItem].type;
					self.itemModalDetails[modalItem].offerPrice = itemDetails[modalItem].offerPrice;
					self.itemModalDetails[modalItem].sellingPrice = itemDetails[modalItem].sellingPrice;
					self.itemModalDetails[modalItem].savings =  itemDetails[modalItem].sellingPrice - itemDetails[modalItem].offerPrice;
					self.itemModalDetails[modalItem].savings = parseFloat(self.itemModalDetails[modalItem].savings.toFixed(2));
					self.itemModalDetails[modalItem].maxOrderQty =  itemDetails[modalItem].maxOrderQty;
					self.itemModalDetails[modalItem].qtyInCart = 0;
					self.itemModalDetails[modalItem].orderItemId = 0;
					self.itemModalDetails[modalItem].totalPriceInCart = 0;
					self.itemModalDetails[modalItem].totalSavingsInCart = 0;
					self.itemModalDetails[modalItem].priceExists = itemDetails[modalItem].priceExists;
					if(itemDetails[modalItem].promotion_Store == assetStoreId || itemDetails[modalItem].promotion_Store == WCParamJS.storeId){
						self.itemModalDetails[modalItem].promotion_Store = itemDetails[modalItem].promotion_Store;
						self.itemModalDetails[modalItem].promotion_Flag = itemDetails[modalItem].promotion_Flag;
						self.itemModalDetails[modalItem].promotion_Message = itemDetails[modalItem].promotion_Message;
					}
				}
			});

			nunjucks.configure(WCParamJS.staticServerHost +  'templates/', {
				autoescape: true,
				web: {
					useCache: true
				}
			});
			var commonData={'storeId' : WCParamJS.storeId, 'catalogId' : WCParamJS.catalogId, 'langId' : WCParamJS.langId, 'imageURL' : WCParamJS.imageServerHost, 'noImagePath':WCParamJS.staticServerHost+'images/DMart/NoImage_M.jpg'};
			$('#' + divId).append(nunjucks.render('_modules/modal-promotion.nunjucks', { modalData:self.itemModalDetails, modalTargets:this.itemModalItems, config:commonData})); 

			$('#' + divId).ready(function(){
				$('#promotions').find('.cart-details-dropdown').selectric();
				var cartJSON = DMStorage.getValue('OrderId');
				if(typeof cartJSON != 'undefined' && cartJSON != null && typeof cartJSON.orderItems != 'undefined' ){
					$.each(cartJSON.orderItems,function(indx,orderItem) {
			              var thisCatentryId = orderItem.catentryId;
			              if(typeof self.itemModalDetails != 'undefined') {
			              if( self.itemModalDetails[thisCatentryId]) {
			              	  	var qty = parseInt(orderItem.quantity);
			              	  	self.itemModalDetails[thisCatentryId].qtyInCart = qty;
			              	  	self.itemModalDetails[thisCatentryId].orderItemId = orderItem.orderItemId;
			              	  	self.itemModalDetails[thisCatentryId].totalPriceInCart = parseFloat(self.itemModalDetails[thisCatentryId].totalPriceInCart) +  orderItem.price;
			                    var savings = orderItem.itemMRPTotal - orderItem.price;
			                    self.itemModalDetails[thisCatentryId].totalSavingsInCart = parseFloat(self.itemModalDetails[thisCatentryId].totalSavingsInCart) + savings;
								if(typeof self.itemModalDetails[thisCatentryId].totalPriceInCart == "number"){
									self.itemModalDetails[thisCatentryId].totalPriceInCart = self.itemModalDetails[thisCatentryId].totalPriceInCart.toFixed(2);
								}if(typeof self.itemModalDetails[thisCatentryId].totalSavingsInCart == "number"){
									self.itemModalDetails[thisCatentryId].totalSavingsInCart =self.itemModalDetails[thisCatentryId].totalSavingsInCart.toFixed(2);
								}	
								$('#'+self.itemModalDetails[thisCatentryId].target).find('.promotion-panel__btn-addtocart, .promotion-panel__btn-quantity').css('display', 'none');
								$('#'+self.itemModalDetails[thisCatentryId].target).find('.promotion-panel--change-qty-cta, .promotion-panel__btn-viewcart').fadeIn();
								$('#'+self.itemModalDetails[thisCatentryId].target).find('.cart-details-dropdown').prop('selectedIndex', qty-1).selectric('refresh');
								$('#'+self.itemModalDetails[thisCatentryId].target).find('.cart-details-dropdown').selectric('refresh');
								if(!$('#'+self.itemModalDetails[thisCatentryId].target).hasClass('promotionsModal')){
							    	$('#'+self.itemModalDetails[thisCatentryId].target).addClass('promotionsModal');
							    }
			                    }
			              	}
			              });
						$.each(self.itemModalItems,function (index, item){
							if($('#'+self.itemModalDetails[item].target).hasClass('promotionsModal') && self.itemModalDetails[item].qtyInCart == 0){
						    	$('#'+self.itemModalDetails[item].target).removeClass('promotionsModal');
						    	$('#'+self.itemModalDetails[item].target).find('.promotion-panel__btn-addtocart').css('display', 'block');
						    	$('#'+self.itemModalDetails[item].target).find('.cart-details-dropdown').prop('selectedIndex', 0).selectric('refresh');
								$('#'+self.itemModalDetails[item].target).find('.cart-details-dropdown').selectric('refresh');
								$('#'+self.itemModalDetails[item].target).find('.promotion-panel--change-qty-cta, .promotion-panel__btn-viewcart, .promotion-panel__btn-quantity').css('display', 'none');
						    }
						});
				}
			});
		},
	checkThreshold:function(orderTotal){
		// Check total considering only in-stock items
		var orderTotal = 0;
		var cartJSON = DMStorage.getValue('OrderId');
		if(cartJSON && cartJSON.orderItems) {
			$.each(cartJSON.orderItems,function(){
				if(!this.outofstock) {
					orderTotal+=this.price
				}
			}); 
		}
		
		var cartMinThreshold = $('#cartMinThreshold').val();
		if(orderTotal<parseFloat(cartMinThreshold)){
			$('.proceed-cta').addClass('button--disabled');
			//$('.proceed-cta').prop('title', 'Minimum threshold is 500 INR');
			$('.js-less-total-value').removeClass('js-hide-show');
		}else{
			$('.proceed-cta').removeClass('button--disabled');
			$('.js-less-total-value').addClass('js-hide-show');
			//$('.proceed-cta').removeAttr('title');
		}
	},
    displayCartItems: function(divId){
    	//$('#missedItems').hide();
		
    	var cartJsonStorage = DMStorage.getValue('OrderId');
    	var listId="";
    	if(typeof $('#listId').val() !='undefined'){
    		listId=$('#listId').val();
    	}
    	if(!cartJsonStorage || (listId.length>0 && cartDisplay.shareCartCall)){
    		if(listId.length >0){
    			CartHelper.deleteCartCookie();
    		}
    		cartDisplay.shareCartCall = false;
    		CartHelper.getCartItems();
    		
    	}
     	
    	var cartJson=cartJsonStorage;
	    if(cartJson){
	    	//var cartJson=CartHelper.packProductAttributes(cartDataJson);
	    	//console.log(cartJson);
	    	 nunjucks.configure(WCParamJS.staticServerHost +  'templates/', {
	             autoescape: true,
	             web: {
	                 useCache: true
	             }
	         });
	    	 
	    	 var commonData={'storeId' : WCParamJS.storeId, 'catalogId' : WCParamJS.catalogId, 'langId' : WCParamJS.langId, 'noImagePath':WCParamJS.staticServerHost+'images/DMart/NoImage_T.jpg','collapsed' : this.collapsed};
	    	 
	    	 $.each(cartJson.orderItems,function(indx,orderItem) {
	    		 if(typeof orderItem.itemMRPTotal != "undefined" && typeof orderItem.itemMRPTotal != 'string' && orderItem.itemMRPTotal != null){
	    			 orderItem.itemMRPTotal = orderItem.itemMRPTotal.toFixed(2);
	    		 }if(typeof orderItem.price != "undefined" && typeof orderItem.price != 'string' && orderItem.price != null){
	    			 orderItem.price = orderItem.price.toFixed(2);
	    		 }if(typeof orderItem.savings != "undefined" && typeof orderItem.savings != 'string' && orderItem.savings != null){
	    			 orderItem.savings = orderItem.savings.toFixed(2);
	    		 }
	 		});
	    	 
	    	 $('#' + divId).html(nunjucks.render('my-cart-display.nunjucks',{cartData:cartJson,data:commonData}));    	 
/*	    	 	$('.cart-title').show();
	    		$('.cart-details').show();
	    		$('#cartSummary').show();
	    		$('.my-cart-cta').show();	
	    		$('.cart-no-items-div').hide();  */
	    	 $('.missed-items').parents('.container').removeClass('hide');
	    	 $('.cart-details').parents('.container').removeClass('hide');
	    	// $('.cart-details').parents('.container').show({
	    	 // done: function(){}
	    	 //});
	    	 $('.empty-cart').parents('.container').addClass('hide');
	    	  
	    	 $('#' + divId).ready(function(){
	    		 $('#cartDetails').find('.cart-details-dropdown').selectric();	    		
	    	 });
	    	
	    	var totalSavings=cartJson.totalSavings;
	    	var totalAmount=0;
	    	var tax=0;
	    	var totalAdjustment=parseFloat(cartJson.totalAdjustment);
	    	//var discount=-(adjustment.toFixed(2));
	    	var discount = cartJson.discount;
	    	totalSavings = totalSavings + discount;
	    	var subTotal=parseFloat(cartJson.total) - discount; 	
	    	totalAmount=subTotal; //+ parseFloat(cartJson.totalShippingCharge);
	    	var cartSummaryData={"subTotal":subTotal,"totalAmount":totalAmount,"savings":totalSavings,"discount":discount,"tax":tax,"orderInvStatus":cartJson.orderInvStatus,"promoCode":cartJson.promotionCode};
	    	if(subTotal>0){
	        	//Proceed to checkout data
				$('.cart-subtitle--count').text(cartJson.totalQTY);
	    		cartSummaryData.outOfStockOrderItemIds = cartJson.outOfStockOrderItemIds;
	        	var urlPrefix = window.location.protocol + '//' + window.location.hostname + '/webapp/wcs/stores/servlet/';
	        	cartSummaryData.proceedFormAction=urlPrefix+"RESTOrderItemUpdate";
	        	cartSummaryData.remerge="***";
	        	cartSummaryData.check="*n";
	        	cartSummaryData.allocate="***";
	        	cartSummaryData.backorder="***";
	        	cartSummaryData.calculationUsage="-1,-2,-3,-4,-5,-6,-7";
	        	cartSummaryData.calculateOrder="1";
	        	
	        	cartSummaryData.errorViewName="myCart";
	        	cartSummaryData.orderId=".";
	        	var strArray, phoneNumber,timeSet, expiryTime, expConst;
	        	if(typeof userFieldValue != "undefined" && userFieldValue!=null && userFieldValue != ""){
	        		strArray = userFieldValue.split("_");
					phoneNumber = strArray[0];
					timeSet= Number(strArray[1]);
					expConst =Number(confGuestCheckoutOTPTime*60*1000);
					expiryTime= Number(timeSet+ expConst) ;
	        	}	        	
	        	var currentTime = Date.now();
	        	if(storeUserType === 'G' && (this.isGuestSessionInValid(expiryTime))){
	            	cartSummaryData.guestChkout="1";
	            	cartSummaryData.URL="DMartLogonView?catalogId="+WCParamJS.catalogId+"&langId=-1&storeId="+WCParamJS.storeId+"&isFromCheckout=true&orderId="+cartJson.orderId;
	        	}else if(storeUserType === 'R' || (userFieldValue != "" && currentTime < expiryTime)){
	        		cartSummaryData.URL="CheckoutView?catalogId="+WCParamJS.catalogId+"&langId=-1&storeId="+WCParamJS.storeId+"&orderId="+cartJson.orderId;
	        	}
	        	var totalPriceInCart=cartJson.total;
	    		$.each(cartJson.orderItems,function (indx, eachOrderItem){
	    			if(eachOrderItem.outfstock === false && eachOrderItem.freeGift != true && eachOrderItem.freeGift != 'true'){	    				
	    				cartSummaryData.orderItemId_0 = eachOrderItem.orderItemId;
    					cartSummaryData.quantity_0 = eachOrderItem.quantity;  
    					return;
	    			}	    		
	    		});	    		
	    		cartSummaryData.totalPriceInCart=CartHelper.formatPricesForDisplay(totalPriceInCart);
	    		cartSummaryData.discount=CartHelper.formatPricesForDisplay(cartSummaryData.discount);
	    		cartSummaryData.subTotal=CartHelper.formatPricesForDisplay(cartSummaryData.subTotal);
	    		cartSummaryData.totalAmount=CartHelper.formatPricesForDisplay(cartSummaryData.totalAmount);
	    		cartSummaryData.savings=CartHelper.formatPricesForDisplay(cartSummaryData.savings);
	    		
	    		if(cartSummaryData.orderInvStatus){
		    		$.each(cartJson.orderItems,function (indx, eachOrderItem){
		    			if(eachOrderItem.freeGift != true && eachOrderItem.freeGift != 'true'){	    				
		    				cartSummaryData.orderItemId = eachOrderItem.orderItemId;
	    					return;
		    			}	    		
		    		});
	    		}	    		
	    		var cartMinThreshold = $('#cartMinThreshold').val();
	    		cartSummaryData.cartMinimumThreshold = cartMinThreshold;	    		
	    		$('#cartSummary').html(nunjucks.render('_modules/cart-summary.nunjucks',{summaryData:cartSummaryData}));
	    		$('#cartSummary').ready(function(){
	    			
	    	    	if(screen.width > 480){
	    	    		if($('.js-header-container')[0]){
	    		    		var stickyHeaderHeight = eval($('.js-header-container')[0].offsetHeight) + 25;
	    		    		var stickyFooterHeight = eval($('.footer')[0].offsetHeight) + eval($('.footer-credibility')[0].offsetHeight) + 10;
	    		    		$.lockfixed('.my-cart-summary',{offset: {top: stickyHeaderHeight, bottom: stickyFooterHeight}});
	    	    		}
	    	    	}
	    	    	
	    			// UI Integration 28-06-2016
	    			var windowWidth = $(window).innerWidth();
	    			if(windowWidth >= 768) {
		    		    $('.cart-summary .cart-summary__details').perfectScrollbar({
		    		        suppressScrollX: true,
		    		        swipePropagation: true
		    		    });
	    			}
	    		    $('#formCoupon').validate({
	    		        errorElement: 'span',
	    		        onkeyup: function(element) {
	    		          if ($(element).val() && $(element).val() === '') {
	    		            this.element(element);
	    		          }
	    		        },
	    		        onfocusout: function(element) {
	    		          if ($(element).val() || $(element).val() !== '') {
	    		            this.element(element);
	    		          }
	    		        },
	    		        rules: {
	    		          promeCode: {
	    		            minlength: 6,
	    		            maxlength: 10,
	    		            regex: /^[A-Za-z]+[A-Za-z0-9\s]*$/
	    		          }
	    		        },
	    		        messages: {
	    		          promeCode: 'Incorrect code'
	    		        },
	    		        submitHandler: function(form) {
	    		          $(form).find('.input-group').hide();
	    		          $('.promo-code--title').hide();
	    		          $('.js-coupon-applied').css('display', 'table-cell');
	    		          $('.js-coupon-code-applied').fadeIn().css('display', 'block');
	    		          form.reset();
	    		        }
	    		      });
	    		    
	    		    $('#formShareCartValidation').validate({
	    		        errorElement: 'span',
	    		        ignore: '.ignore',
	    		        onkeyup: function(element) {
	    		          if ($(element).val() && !($(element).attr('type') === 'email' || $(element).attr('type') === 'tel')) {
	    		            this.element(element);
	    		          }
	    		        },
	    		        onfocusout: function(element) {
	    		          if ($(element).val() || $(element).val() !== '') {
	    		            this.element(element);
	    		          }
	    		        },
	    		        rules: {
	    		          mobileNumber: {
	    		            number: true,
	    		            minlength: 10,
	    		            maxlength: 10,
	    		            regex: /^[7-9]+[0-9]*$/,
	    		            require_from_group: [1, '.requiredPhoneEmail']
	    		          },
	    		          email: {
	    		            minlength: 6,
	    		            maxlength: 150,
	    		            regex: /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
	    		            require_from_group: [1, '.requiredPhoneEmail']
	    		          }
	    		        },
	    		        groups: {
	    		          name: 'mobileNumber email'
	    		        },
	    		        messages: {
	    		          mobileNumber: 'Fill anyone field with proper value!',
	    		          email: 'Fill anyone field with proper value!'
	    		        },
	    		        errorPlacement: function (error, element) {
	    		          if (element.attr('rel') === 'requirePhoneEmail') {
	    		            error.insertAfter('.share-cart-form .form-control:last-child input');
	    		          }
	    		          else {
	    		            error.insertAfter(element);
	    		          }
	    		        },
	    		        submitHandler: function(form) {
	    		          //$('#ShareCartModal').fadeIn();
	    		        }
	    		      });
	    		    $("#cartSummary #mobileNumber").keypress(function (e) {
					     
					     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
					        
					               return false;
					    }
					   });
	    		});
	    		if(typeof cartSummaryData.promoCode != 'undefined'){
	    			var prevWidth=$('#cartSummary').css('width');
	    			$('#formCoupon').find('.input-group').css("display",'none');
	    			$('#cartSummary').css('width',prevWidth);
	    			$('.promo-code--title').hide();
			        $('.js-coupon-applied').css('display', 'table-cell');
			        $('.js-coupon-code-applied').fadeIn().css('display', 'block');
			        $('.cart-summary__price-details--tertiary').removeClass('divider');
			        $('.cart-summary__price-details-coupon').addClass('divider');
	    		} else if (!$('.cart-summary__price-details-coupon').hasClass('divider')){
	    			$('.cart-summary__price-details--tertiary').addClass('divider');
	    		}
	    		
    		cartDisplay.checkThreshold(subTotal);
			if(cartJson.orderInvStatus === false){
	    			$('#warning').show();
	    		}else{
	    			$('#warning').hide();
	    		}
	    	}
	    	else{
/*	    		$('#cart-detail-div').hide();
	    		$('#cartSummary').hide();
	    		$('#promotions .cart-title').hide();
	    		$('.my-cart-cta').hide();	
	    		
	    		//Fix for AE-6947
	    		$('#my-cart-cta-cartpage').show();
	    		$('#cart-title-cartpage').hide();
	    		$('#cart-details-cartpage').hide();
	    		$('#cartSummary').hide();
	    		$('.cart-no-items-div').show();*/
	    		
	    		$('.missed-items').parents('.container').addClass('hide');
	    		$('.cart-details').parents('.container').addClass('hide');
	    		$('.empty-cart').parents('.container').removeClass('hide');
	    		window.scrollTo(0,0);
	    	}
	    	$('.js-promotions-carousel').resize();

	    }
    	else{
/*    		$('#promotions .cart-title').hide();
    		$('#cart-detail-div').hide();
    		$('#cartSummary').hide();
    		$('.my-cart-cta').hide();	
    		
    		//To display empty cart message and continue shopping button in empty cart scenario -- Fix for AE-6947
    		$('#my-cart-cta-cartpage').show();	

    		if(!cartJsonStorage || (listId.length>0 && !cartJsonStorage)){
    			$('.cart-no-items-div').hide();
    		}
    		else{
    			//Fix for AE-6947
	    		$('#cart-title-cartpage').hide();
	    		$('#cart-details-cartpage').hide();
	    		$('#cartSummary').hide();
	    		
    		$('.cart-no-items-div').show();
    		}*/
    		$('.missed-items').parents('.container').addClass('hide');
    		$('.cart-details').parents('.container').addClass('hide');
    		$('.empty-cart').parents('.container').removeClass('hide');
    		window.scrollTo(0,0);
    		
    	}
	    
	    $.each($('.cart-details__item-lists  .product-variant'),function(indx,content) {
 			if($(content).find('span').text() == ''){
 				$(content).css('display','none');
 			}
 		});
    },
    isGuestSessionInValid : function(expiryTime){
    	var currentTime = Date.now();
    	var guestCookie = getCookie('guest');
    	if(userFieldValue == "" || currentTime > expiryTime){
    		return true;
    	}else if(typeof guestCookie == 'undefined'|| guestCookie != 'valid'){
    		return true;
    	}else{
    		return false;
    	}
    },
    displayMissedItems: function(divId,missedData){
    	var missedProducts = [];
    	var productIdentifier;
    	var urlPrefixWcs = window.location.protocol + '//' + window.location.hostname + '/wcs/resources/store/';
    	$.ajax({
		    url: urlPrefixWcs + WCParamJS.storeId + '/espot/CART_MISSED_ITEMS',
		    method: 'GET',
		    context: this,
		    cache: false,
		    async: false
		}).done(function(data) {
			marketingSpotData = data.MarketingSpotData;
			//DMStorage.set('MarketingSpotData_'+prodId,data.MarketingSpotData);
		});
    	if(marketingSpotData != null){
			$.each(marketingSpotData, function(index, marketingSpotDetails) {
				if(marketingSpotDetails.baseMarketingSpotActivityData != null){
					$.each(marketingSpotDetails.baseMarketingSpotActivityData,function(merchIndex, baseMarketingSpotActivityDataObj){
						productIdentifier = baseMarketingSpotActivityDataObj.productId;
						missedProducts.push(productIdentifier);
			    	});
				}
		    });
    	}
    	nunjucks.configure(WCParamJS.staticServerHost +  'templates/', {
            autoescape: true,
            web: {
                useCache: true
            }
        });
    	if(missedProducts.length>0){
    		ProductHelper.fetchProductDetails(missedProducts,this.renderMissedItems,[divId, missedProducts]);	
    	}
        
    },
    
    renderMissedItems :  function(divId, missedProducts){
    	console.debug("missedProducts :: "+missedProducts);
    	cartDisplay.groupMissedProducts(missedProducts);
    	cartDisplay.getCategoryNames();
    	var group = cartDisplay.groupedMissedProducts;
    	var JSONdata = {};
    	//var self = this;
    	JSONdata.product = productListing.createJSON(missedProducts);
    	JSONdata.productIds = missedProducts;
    	JSONdata.levelThreeCategoyNames	= cartDisplay.levelThreeCategoyNames;
    	JSONdata.levelThreeCategories = cartDisplay.levelThreeCategories;
    	JSONdata.groupedMissedProducts = cartDisplay.groupedMissedProducts;
    	var count = cartDisplay.groupedMissedProducts[cartDisplay.levelThreeCategories[0]].count;
    	var startCount = count;
    	if( count >= 4){
    		startCount = 4; 
    	}
    	JSONdata.startCount = startCount; 
    	JSONdata.endCount = count; 
        var imgUrl = WCParamJS.imageServerHost;
        this.config = {
            'baseUrl':  window.location.origin+'/webapp/wcs/stores/servlet/'
        };
        JSONdata.config = this.config;
        JSONdata.maxnumber = 5;
        JSONdata.catalogId = WCParamJS.catalogId;
        JSONdata.storeId = WCParamJS.storeId;
        JSONdata.homePageURL = WCParamJS.homepageURLHierarchy;
        JSONdata.noImagePath=WCParamJS.staticServerHost+'images/DMart/NoImage_M.jpg';
        nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
            autoescape: true,
            web: {
                useCache: true
            }
        });
        
    	$('#' + divId).append(nunjucks.render('_modules/missed-items.nunjucks',{data:JSONdata}));
    	
		$('.md-custom-select .cart-details-dropdown, .js-filter-sortby, .product-details .product-details__btn-quantity select, .product-listing__quantity-secondary select, .add-product-other-quantity select').selectric();
		$('.product-listing-item__secondary .add-product-other-quantity select').selectric('destroy');
	    $('.resp-tabs-container .add-product-other-quantity select, .resp-tabs-container .product-listing__quantity-secondary select').selectric('destroy').parent().addClass('custom-dropdown');
	    $('.md-custom-select select').selectric().parents('.md-custom-select').removeClass('custom-dropdown'); 
	    renderRupeeSymbolInDropDown();
    	$('#'+divId).ready(function(){
    		$('.js-carousel').flexslider({
  		      selector: '.slides:first > li',
  		      animation: 'slide',
  		      animationLoop: false,
  		      slideshow: false,
  		      controlNav: false,
  		      reverse: false,
  		      itemWidth: 218,
  		      itemMargin: 20,
  		      minItems: 1,
  		      maxItems: 4,
  		      customDirectionNav: $('.carousel-navigation a'),
  		      start: function (index) {
  		    	   $('.js-carousel .flex-viewport').css('overflow', 'hidden');
  	    	  }			      
    		});
  		 
    	    $('.js-accordion-tabs-recommanded').easyResponsiveTabs({
    	        type: 'default',
    	        width: 'auto',
    	        fit: true,
    	        tabidentify: 'hor_1',
    	        activate: function(event) {
    	          $('.js-carousel, .js-landing-carousel, .product-listing__quantity-primary .slider-variant').resize();
    	          $('.landing-carousel-navigation, .landing-top-carousel-navigation, .landing-top-carousel-navigation-secondary, .landing-top-carousel-navigation-tertiary').css('opacity', 0).delay(100).animate({
    	            opacity: 1
    	          }, 800);
    	          $('.resp-tab-content-active .dashboard-notification--list').scrollTop(1).perfectScrollbar('update');
    	          $('.product-listing__quantity-other--select').selectric('destroy');
    	        }
    	      });
    	    $('.product-listing__quantity-other--select').selectric('destroy');

    	});
    	
    },
    
    groupMissedProducts :  function(missedProducts){
    		groupProducts = {};
    		grpMissedProducts = {};
    		catgroupIds = [];
	    	$.each(missedProducts,function(index,productId) {
	    		var productBean = DMStorage.getValue('prod_'+productId);	
	    		if(typeof productBean != 'undefined'){
	    			var catgroupId = productBean.attribs.parentCatalogGroupID;
		    		catgroupIds.push(catgroupId);	
	    		}
	    	});
	    	groupProducts = cartDisplay.getUniqueMap(catgroupIds);
	    	grpMissedProducts = groupProducts;
	    	catgroupIds = this.levelThreeCategories;
	    	console.debug("levelThreeCategories " + catgroupIds);
	    	$.each(missedProducts,function(index,productId) {
	    		var productBean = DMStorage.getValue('prod_'+productId);	
	    		if(typeof productBean != 'undefined'){
	    			var catGpId = productBean.attribs.parentCatalogGroupID;
	    			var pId = productBean.attribs.uniqueID;
	    			var self = this;
	    			var count=0;
		    		/*$.each(catgroupIds,function(counter,catgroupId) {
		    			if(catGpId === catgroupId){
		    				count++;
		    				console.debug("Counter " + count);
		    				//groupProducts[catgroupId].push(productBean);
		    				grpMissedProducts[catgroupId].push(pId);
		    			}
		    		});*/
	    			
	    			grpMissedProducts[catGpId].push(pId);
	    			grpMissedProducts[catGpId].count++;
	    		}
	    	});
	    	//this.groupedProducts = groupProducts;
	    	this.groupedMissedProducts = grpMissedProducts;
	    	
    },
    
    getUniqueMap : function (catgroupIds) {
    	var groupedProducts = {}, prodBean = {}, temp = {};
        for (var i = 0; i < catgroupIds.length; i++){
        	temp[catgroupIds[i]] = true;
        }
        var prodArray = [];
        prodArray.push(prodBean);
        var unique = [];
        for (var k in temp){
        	unique.push(k);
        	//console.debug("unique Catgroup " + k);
        	groupedProducts[k]=[];
        	groupedProducts[k].count=0;
        }  
        this.levelThreeCategories = unique;
        return groupedProducts;
    },
    
    getCategoryNames : function(){
    	this.levelThreeCategoyNames = {};
    	if(window.location.protocol === "https:"){
    		this.searchResources=  WCParamJS.searchSecureHostNamePath+ '/search/resources/store/';
    	}
    	var idString = this.levelThreeCategories;
    	idString = idString.toString().replace(/,/g,'&id=');
    	var self =this;
    	 $.ajax({
			    url: this.searchResources + WCParamJS.storeId + '/categoryview/byIds?id=' + idString,
			    method: 'GET',
			    context: this,
			    async: false
			}).done(function(data) {
				$.each(data.catalogGroupView, function(indx, val) {
					console.debug("Group Name " + val.name + " :: " + val.uniqueID);
                    self.levelThreeCategoyNames[val.uniqueID] = [];
                    self.levelThreeCategoyNames[val.uniqueID].push(val.name);
                });
			}); 
    },
    
    clearCartModal : function(divId,data){
    	nunjucks.configure(WCParamJS.staticServerHost +  'templates/', {
            autoescape: true,
            web: {
                useCache: true
            }
        });
    	$('#' + divId).before(nunjucks.render('_modules/modal-clear-cart.nunjucks'));
    },
    /**
     * Creates this.products object for page rendering
     *  
     */
   
    
    updateHeader : function(totalQty,orderTotal) {
		$('.cart-wrap .cart-icon .badge').html(totalQty);
		var orderTotalString= '<i class="header-icon-rupee icon-rupees"></i>'+parseFloat(orderTotal).toFixed(2)+'<i class="header-icon-caret-down icon-caret-down"></i>';
		$('.cart-price-label').html(orderTotalString);
		 CartHelper.deleteCartCookie();
		 var orderDetails = parseInt(orderTotal) +'_'+parseInt(totalQty);
		  document.cookie = "DM_OrderId="+orderDetails+";expires=-1;path=/";
	},
	applyPromoCode : function(code){
		var udata={ 
			'URL': '',
			'catalogId': WCParamJS.catalogId,
			'langId': '-1',
			'promoCode': code,
			'requesttype': 'ajax',
			'storeId': WCParamJS.storeId,
			'taskType': 'A'
		};
		$.ajax({
            url: this.urlPrefix +this.wcsResources+ WCParamJS.storeId + '/cart/dmartApplyPromoCode',
            async:false,
            headers: {
                "Content-Type":"application/json"
            },
			
            'data': JSON.stringify(udata),
            method: 'POST',
            context: this
        }).done(function(data){
        	$('.js-coupon-applied').remove();
        	DMStorage.remove('OrderId');
    		CartHelper.deleteCartCookie();
        	CartHelper.checkItemAvailabilityForStore = true;
        	CartHelper.storeOrderItems(data,false);
        }).fail(function(data) {
        	$('.promo-code--title').hide();
            $('.promo-code-form .input-group').hide();
        	$('.js-coupon-applied').html('Invalid coupon code applied <a class="alert-close-cta js-cart-reject js-show-back-form alert-cross-pos" href="javascript:;" title="Close"><i class="icon-cta-close icon-cancel"></i></a>');
        	$('.js-coupon-applied').css('display', 'table-cell');
        });  
		DMAnalytics.events( "Promo Code Apply Button", DMAnalytics.Constants.Action.PromoCode + code, document.title, 0,udata );
	},
	deactivatePromoCode : function(self){
		if(typeof DMStorage.getValue('OrderId').promotionCode != 'undefined'){
		var code=DMStorage.getValue('OrderId').promotionCode;
		$.ajax({
            url: this.urlPrefix +this.wcsResources+ WCParamJS.storeId + '/cart/'+code,
            async:false,
            headers: {
                "Content-Type":"application/json"
            },
            method: 'DELETE',
            context: this
        }).done(function(data){
        	DMStorage.remove('OrderId');
    		CartHelper.deleteCartCookie();
        	CartHelper.checkItemAvailabilityForStore = true;
        	CartHelper.storeOrderItems(data,false);
        }).fail(function(data) {
        	errorMessageHelper.showGenericError('Error while deactivating promo code');

        }); 
		DMAnalytics.events( DMAnalytics.Constants.Category.Cart, DMAnalytics.Constants.Action.PromoCodeDel + code, document.title, 0,null );
	}
		else{
			$(self).parents('.alert').hide();
            $('.promo-code--title').fadeIn();
            $('.promo-code-form .input-group').fadeIn();
            $('.promo-code-form .input-group input').val('');
            $('.js-coupon-code-applied').hide();
            $('.cart-summary__price-details--tertiary').addClass('divider');
		}
	},
	handleApplyPromoCode : function(){
		$(document).on('dmart.cart.ready',function(){
			var cartDataJson=DMStorage.getValue('OrderId');
	    	var qty=cartDataJson.totalQTY;
	    	var total=cartDataJson.total;
		 //cartDisplay.updateHeader(qty,total);
		 cartDisplay.checkThreshold(total);
		});
		DMStorage.set('OrderId.orderCalculationDone','N');
		DMStorage.remove('OrderId');
		CartHelper.deleteCartCookie();
		CartHelper.getCartItems();		 
			
	},
	
	removeTroleyItem : function(response, self, productId, itemId) {
		if (response) {
			$(self).parents('.cart-details__item-lists').fadeOut('slow',
					function() {
						$(self).remove();
					});

			if ($(self).parents('.cart-details__item-list').find(
					'.cart-details__item-lists').length === 1) {
				$(self).parents('.cart-details__item-list').find(
						'.cart-no-items').delay(400).fadeIn(500);
			}

			var orderTotal = response.x_orderTotal;
			var itemsInCart = response.x_itemsInCart;
			var orderId = response.orderId;

			
			//updateHeaderMiniCartSection(orderTotal,itemsInCart);
			//cartDisplay.updateHeader(itemsInCart,orderTotal);
			//updateLocalStorage(0, itemId, orderId, 0, orderTotal,
			//		itemsInCart);
			//cartDisplay.displayCartItems("cartDetails");
			cartDisplay.checkThreshold(orderTotal);
		}
	},
	updateTroleyItem : function(response,productId, itemId, newQty) {
		if (response) {
			var orderTotal = response.x_orderTotal;
			var itemsInCart = response.x_itemsInCart;
			var orderId = response.orderId;
			var orderItemId = response.orderItem[0].orderItemId;
			//cartDisplay.updateHeader(itemsInCart,parseInt(orderTotal));
			//updateHeaderMiniCartSection(orderTotal,itemsInCart);
			//updateLocalStorage(newQty, itemId, orderId, orderItemId,
			//		orderTotal, itemsInCart);
			//cartDisplay.displayCartItems("cartDetails");
			//DMStorage.set('OrderId.grandTotal','N');
			cartDisplay.checkThreshold(orderTotal);
		}
	},
	createSharedList : function(cartData,self){
		
		$.ajax({
            url: window.location.protocol+'//'+window.location.hostname+this.wcsResources+ WCParamJS.storeId + '/wishlist?responseFormat=json',
            headers: {
                "Content-Type":"application/json"
            },
			
            'data': JSON.stringify(cartData),
            method: 'POST',
            context: this
        }).done(function(data){
        	
        	$.ajax({
                url: window.location.protocol+'//'+window.location.hostname+this.wcsResources+ WCParamJS.storeId + '/shareList/'+data.uniqueID+'/dmartsharelist?responseFormat=json',
                headers: {
                    "Content-Type":"application/json"
                },
    			
                'data': JSON.stringify({"contact":cartData.x_field5,"host":window.location.hostname}),
                method: 'POST',
                context: this
            }).done(function(response){
            	//clearCart(self);
            	MiniCartDisplay.updateHeader(0,0.0);
        		//Clear the local storage variable
        		DMStorage.remove('OrderId');

        		$(self).parents('.modal-dialog').hide();
        		$('.cart-details__item-list').find('.cart-details__item-lists').remove();
        		$('#ShareCartModal .modal-dialog__header-title').html('Success');
        		$('.cart-details__item-list').find('.cart-no-items').fadeIn();
        		$('html, body').animate({
        			scrollTop: $('.cart-no-items-div').offset().top - 100
        		}, 1000);  	 
        		
           	 	$('.missed-items').parents('.container').addClass('hide');
           	 	$('.cart-details').parents('.container').addClass('hide');
           	 	$('.empty-cart').parents('.container').removeClass('hide');
           	 	
            	$('#sharecartfail').hide();
            	$('#sharecartsuccess').show();
            	$('#ShareCartModal').fadeIn();
            	MiniCartDisplay.renderMiniCart();
            	
            }).fail(function(data) {
            
            	$('#sharecartsuccess').hide();
            	$('#ShareCartModal .modal-dialog__header-title').html('Fail');
            	$('#ShareCartModal').fadeIn();
            	$('#sharecartfail').show();
            });  
        	
        	
        	
        }).fail(function(data) {
        	$('#sharecartsuccess').hide();
            	
            	$('#ShareCartModal').fadeIn();
            	$('#sharecartfail').show();

        });  
		
		DMAnalytics.events( DMAnalytics.Constants.Category.Cart, DMAnalytics.Constants.Action.ShareCart, document.title, 0,cartData );
	}
  
};

$(document).ready(function() {
	//Load offers popup
	$(document).bind(
			'dmart.cart.itemEspot.load',
			function(e) {
				cartDisplay.displayPromoPopUps('promotions');
			});
	// Promotion panel view cart function
    $(document).on('click','.promotion-panel__btn-viewcart', function(){
    	window.location.href = 'myCart?storeId='+WCParamJS.storeId+'&catalogId='+WCParamJS.catalogId+'&langId='+WCParamJS.langId;
    });
    $(document).on('click','.missedCategoryName', function() {
    	var categoryId = $(this).data('categoryid');
    	var total = cartDisplay.groupedMissedProducts[categoryId].count;
    	var min=0;
		var max=4;
		if(total > max){
			min = max;
			max = total;
		}else{
			min=total;
			max=total;
		}
		if((min !=0 && min != '') && (max !='') && (max !=0)){
			var htmlCode = 'Showing ' + min + ' out of '+ max;
			htmlCode = htmlCode + '<a href="#" class="flex-prev"><i class="icon-caret-left"></i></a><a href="#" class="flex-next"><i class="icon-caret-right"></i></a>';
			$('#missedItemCarousel').html(htmlCode);
		}
    	
    });
  
    
});
