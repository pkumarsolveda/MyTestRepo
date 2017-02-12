/**
 * This js file contains the cart functions.
 */

(function(dmUIConfig) {
	$(document).ready(function () {

		//Add item to list on click of submit button in frequently brought section 
		$(document).on('dmart.pdp.addproduct.recomendations',function(event, self){
			addToListRecomendations (self);
		});
		$(document).on('dmart.pdp.quantity.perfectscroll',function(){
			$('.product-details__btn-quantity .selectric-items .selectric-scroll').perfectScrollbar({

			      suppressScrollX: true,
			      swipePropagation: true
			  });
			if(parseInt($('.product-details__btn-quantity--add').attr('data-maxLimit')) > 6){
				$('.product-details__btn-quantity').find('.selectric-items').css('height','114px');
			}
		});
		//Add item to list from PLP
		$(document).on('dmart.plp.additem.tolist',function(event, self){
			var productId = $(self).parents('.product-listing-item').data('productid');
			var catentryId=[];
			var quantity=[];
			//catentryId.push(productListing.products[productId].currentItem);
			if ($(self).parents('.product-listing-item').length){
				//catentryId.push($(this).parents('.product-listing-item.plp-grocery').find('.product-listing__quantity--select-weight').val());
				catentryId.push(productListing.products[productId].currentItem);
				var qty=$(self).parents('.product-listing-item').find('.product-listing__quantity--select-quantity').val();
				quantity.push(qty>0?qty:1);
			}
			
			if(catentryId.length==0||quantity.length==0){
				catentryId.push(productListing.products[productId].selectedItems);
				quantity.push(1);
			}

			var lists=resolveSelectedLists(self);
			DMartShoppingListActionsJS.addToList(self,lists,catentryId,quantity);
	        //DMAnalytics.events( DMAnalytics.Constants.Category.List,
	        	//	DMAnalytics.Constants.Action.AddToList+ catentryId, quantity, null );

		});

		//add item to list from PDP
		$(document).on('dmart.PDP.main.additem.tolist',function(event, self){
			var lists=resolveSelectedLists(self);
			var itemId = $('#productDetails .slider-variant ul .active').data('item');
			if(typeof itemId == 'undefined'){
				itemId=$('#productDetails .slider-variant ul .addedToCart').data('item');
			}
			if(typeof itemId != 'undefined'){
				var itemIds=[];
				itemIds.push(itemId.toString());
			DMartShoppingListActionsJS.addToList(self,lists,itemIds,productDisplay.product.selectedQty);
//			DMAnalytics.events( DMAnalytics.Constants.Category.List,
//					DMAnalytics.Constants.Action.AddToList+ productDisplay.product.selectedItem, productDisplay.product.selectedQty, null );
			}
			else{
				errorMessageHelper.showGenericError(MessageHelper.messages['_ERR_VARIANT_NOT_SELECTED']);
			}

		});


		//Add item to cart on click of Add To Cart button from PDP secondary view
		$(document).on('dmart.pdp.cart.addproduct.recommendations',function(event, self){
			addItemsToCart(self,'FREQ');	
		});

		//Add item to cart on click of Add To Cart button from PLP primary view
		$(document).on('dmart.plp.addtocart.primary', function(event, self) {
			addItemsToCartPLP(self);
		});

		//Add item to cart on click of Add More dropdown from PLP secondary view
		$(document).on('dmart.plp.addtocart.secondary', function(event, self) {
			handleAddMore(self);
		});

		//Add item to cart on click of Add More dropdown from PLP primary/tertiary view
		$(document).on('dmart.plp.addtocart.tertiary', function(event, self) {
			handleAddMore(self);		  	      
		});

		//Show wish list options from PLP & recommendation section
		$(document).on('dmart.freq.showList',function(event,self){

			var currentPos=$(self).parent();
			DMartShoppingListActionsJS.getListDetails(currentPos);
		});

		// Show wish list options from PDP page
		$(document).on('dmart.PDP.showList',function(event,self){
			var itemIdPDP = [];
			var qty=[];
			$.each($(self).parents('.product-details.product-details--grocery').find('.slider-variant-wrap .active'),function(index,dataset) {


				itemIdPDP.push($('.product-details__addtolist a').parents('.product-details.product-details--grocery').find('.slider-variant-wrap .active')[index].dataset.item);
				//qty.push("1");
			});
			if ($(this).parents('.plp-grocery').length){
				productDisplay.product.selectedItem=itemIdPDP;
			}
			qty.push("1");
			productDisplay.product.selectedQty=qty;
			//productDisplay.product.selectedItem=itemIdPDP;
			productDisplay.product.selectedQty=qty;

			DMartShoppingListActionsJS.getListDetails(self);
		});
		//Remove item from cart from secondary view
		$(document).on('dmart.plp.remove', function(event, self) {
			removeItemsFromCartPLP(self);		  	      
		});

		//Update quantity of item in cart from secondary view
		$(document).on('dmart.plp.update.quantity', function(event, self) {
			updateItemQuantityInCartPLP(self);		  	      
		});

		//Update variant of item in cart from secondary view
		$(document).on('dmart.plp.update.variant', function(event, self) {
			updateItemVariantInCartPLP(self);		  	      
		});

		//Add item to cart on click of Add To Cart button from PDP
		$(document).on('dmart.pdp.addtocart', function(event, self) {
			//var self = this;		  
			if($('.product-details .slider-variant .slides .active').length === 0){
				$('.product-details__btn-addtocart').hide();
				$('.product-details__btn--addtocart-popup').show();  
			}else{
				//var self = this;		  
				addItemsToCart(self,'PDP');
			}  	      
		});

		//Update quantity from PDP
		$(document).on('dmart.pdp.updatecart', function(event, self) {
			// var self = this;		  
			updateItemsInCart(self);		  	      
		});

		//Add item to cart on click of Add More button from PDP
		$(document).on('dmart.pdp.addmore', function(event, self) {
			if($('.product-details .slider-variant .slides .active').length === 0){
				$('.product-details__btn-add-more').hide();
				$('.product-details__btn--addtocart-popup').show();  
			}else{
				$(self).parents('.product-details').find('.selectric-product-details__btn-quantity--add .selectric p.label').html(1);
				//var self = this;		  
				addItemsToCart(self,'PDP');	
			}	  	      
		});
		//Proceed to checkout from cart
		$(document).on('dmart.proceed.to.checkout',function(event,self){
			errorMessageHelper.removeUnavailableItems();
			proceedToCheckout(self);	
		});

		//Clear cart
		$(document).on('dmart.clear.cart',function(event,self){
			clearCart(self);	
		});

		//Continue shopping
		$(document).on('dmart.continue.shopping',function(event,self){
			continueShopping();	
		});

		
		//Add to cart from cart offers popup
		$(document).on('dmart.cart.itemEspot.add',function(event,self){
			  addItemsToCartOffers(self);	
		});
		
		//update cart from cart offers popup
		$(document).on('dmart.cart.itemEspot.update',function(event,self){
			updateItemsInCartOffers(self);	
		});
		
	});
}(DM_UI_CONFIG));

/**
 * Proceed to checkout
 * @param self
 **/
function proceedToCheckout(self){
	$('#formProceedToCart').submit();
}

/**
 * Clear cart contents
 * @param self
 **/
function clearCart(self){
	var cartData= DMStorage.getValue('OrderId');
	var orderItemId,qty;
	//For invoking Cancel reservation inventory
	$.each(cartData.orderItems,function(){
		if(this.freeGift=="false"){
			orderItemId=this.orderItemId;
			qty=this.quantity;
			return false;
		}
	});
	var params = {};
	params.orderItemId = orderItemId;
	params.quantity = qty;
	params.storeId = WCParamJS.storeId;
	params.catalogId = WCParamJS.catalogId;
	params.langId = WCParamJS.langId;    
	params.orderId = cartData.orderId.toString();
	params.inventoryValidation = "true";
	params.calculateOrder = "0";	
	//For invoking Cancel reservation inventory
	var urlString = window.location.protocol + '//' + window.location.hostname+'/webapp/wcs/stores/servlet/';
	if(previewToken){
		urlString = window.location.origin+'/webapp/wcs/preview/servlet/';
	}
	$.ajax({
		url : urlString + "AjaxRESTOrderItemUpdate",
		method : "POST",
		data : params
	}).done(function (data){
		var deleteUrl = window.location.protocol + '//' + window.location.hostname + '/wcs/resources/store/' + WCParamJS.storeId + '/cart/@self';
		if(previewToken){
			deleteUrl = window.location.origin+'/wcs/previewresources/store/' + WCParamJS.storeId + '/cart/@self';
		}
		$.ajax({
		url: deleteUrl,
		method: 'DELETE',
		context: this,
		async: false,

	}).done(function (data) {
		MiniCartDisplay.updateHeader(0,0.0);
		//Clear the local storage variable
		DMStorage.remove('OrderId');

		$(self).parents('.modal-dialog').hide();
		$('.cart-details__item-list').find('.cart-details__item-lists').remove();
		$('.cart-details__item-list').find('.cart-no-items').fadeIn();
		$('html, body').animate({
			scrollTop: 0
		}, 1000);  	 
		
   	 	$('.missed-items').parents('.container').addClass('hide');
   	 	$('.cart-details').parents('.container').addClass('hide');
   	 	$('.empty-cart').parents('.container').removeClass('hide');
		
		MiniCartDisplay.renderMiniCart();
		$('#error-msg-container').css('display','none');
		localStorage.removeItem('PincodeExcludedItems');
		localStorage.removeItem('OOSitemsList');
	}).fail(function(data) {    	
			errorMessageHelper.showGenericError(MessageHelper.messages['_ERR_CART_UPDATE_ERROR']);
		}); 
	}).fail(function(data){
		errorMessageHelper.showGenericError(MessageHelper.messages['_ERR_CART_UPDATE_ERROR']);
	}); 
	DMAnalytics.events( DMAnalytics.Constants.Category.ClearCart, DMAnalytics.Constants.Action.EmptyCart, document.title, 0,null );
}

/**
 * Calculate order - Continue Shopping
 **/
function continueShopping(){
	var cartDataJson=DMStorage.getValue('OrderId');
	if(cartDataJson && cartDataJson.orderInvStatus === false){
		var params = {};
		var oosItemsInCart=false;
		var oosCount = 0;	
		var urlString = window.location.protocol + '//' + window.location.hostname+'/webapp/wcs/stores/servlet/';
		if(previewToken){
			urlString = window.location.origin+'/webapp/wcs/preview/servlet/';
		}
		$.each(cartDataJson.outOfStockOrderItemIds,function (i, eachOrderItem){
			oosCount = oosCount+1;
			params["orderItemId_" + (parseInt(oosCount))] = eachOrderItem;
			params["quantity_" + (parseInt(oosCount))]        = 0.0;			
		});
		params.storeId                 = storeId;
		params.catalogId             =  WCParamJS.catalogId;
		params.langId                   = -1;
		params.orderId                = ".";

		$.ajax({
			url: urlString + "AjaxRESTOrderItemUpdate",
			method: 'POST',
			context: this,
			async: false,
			data: params,
		}).done(function (data) {
			//  Invoke Order calculate and update the cart JSON
			var params = {};
			params.storeId = WCParamJS.storeId;
			params.catalogId = WCParamJS.catalogId;
			params.langId = WCParamJS.langId; 
			params.orderId = ".";
			params.inventoryValidation = "true";
			params.calculationUsageId = "-1";
			var urlPrefix = window.location.protocol + '//' + window.location.hostname + '/wcs/resources/';
    		if(previewToken){
    			urlPrefix = window.location.origin+'/wcs/previewresources/';
    		}
			$.ajax({
				url : urlPrefix + 'store/' + WCParamJS.storeId + '/cart/dmartcalculate',
				method : "POST",
				async: false,
				data : params
			}).done(function(data) {		
				CartHelper.storeOrderItems(data,false);
				$('#continueShoppingForm').submit();
			}).fail(function(data) {
				errorMessageHelper.showGenericError(MessageHelper.messages['_ERR_CART_UPDATE_ERROR']);
			});    		    	

		}).fail(function(data) {
			errorMessageHelper.showGenericError(MessageHelper.messages['_ERR_DELETING_OOS_ITEMS']);
		}); 
		DMAnalytics.events( DMAnalytics.Constants.Category.Products, ((typeof params.quantity != "undefined" && params.quantity == 0) ? DMAnalytics.Constants.Action.CartRemove
				: DMAnalytics.Constants.Action.CartUpdate) , document.title, 0,params );
	}else{
		$('#continueShoppingForm').submit();
	}	
}

/**
 * Resolve SKU for frequently brought products
 * @param self
 **/
function resolveSKURecomendationsProductId(self){
	var pid = [];
	var freqChecked = $(self).parents('#frequent').find('.product-alternate-checkbox:checkbox:checked');
	$(freqChecked).each(function(i, obj) {
		if(!$(obj).is(':disabled')){
			pid.push($(obj).parents('.product-listing-item.plp-grocery').data('productid'));
		}	
	});
	return pid;
}

/**
 * Resolve SKU for recommended products
 * @param self
 **/
function resolveSKURecomendationsPid(self){
	var itemIds=[];
	var freqChecked = $(self).parents('#frequent').find('.product-alternate-checkbox:checkbox:checked');
	$(freqChecked).each(function(i, obj) {
		if(!$(obj).is(':disabled')){
			itemIds.push($(obj).parents('.product-listing-item').find('.product-listing__quantity--select-weight').val());
		}
	});
	return itemIds;
}

/**
 * Resolve the list chosen by the user
 * @param self
 **/
function resolveSelectedLists(self){
	var lists=[];
	$.each($(self).parents('.product-listing-item__tertiary').find('.selected'),function(indx,acnhor) {

		lists.push($(this).parent().attr('value'));
	});
	return lists;
}

/**
 * Resolve the quantity chosen for recommended products
 * @param self
 **/
function resolveSKURecomendationsQty(self){
	var qty=[];

	var freqChecked = $(self).parents('#frequent').find('.product-alternate-checkbox:checkbox:checked');
	$(freqChecked).each(function(i, objct) {
		if(!$(objct).is(':disabled')){
			$(objct).parents('.product-listing-item.plp-grocery').each(function(i, obj) {
				qty.push($(obj).find('.selectric-wrapper.selectric-product-listing__quantity--select-quantity .label').text());
			});
		}
	});
	
	return qty;
}

/**
 * Add to list from recommendations
 * @param self
 **/
function addToListRecomendations(self){
	var itemIds = resolveSKURecomendationsPid(self);
	var qty = resolveSKURecomendationsQty(self);
	var lists=resolveSelectedLists(self);

	DMartShoppingListActionsJS.addToList(self,lists,itemIds,qty);

//	DMAnalytics.events( DMAnalytics.Constants.Category.List,
//			DMAnalytics.Constants.Action.AddToList+ itemIds, qty, null );
}

/**
 * Add More from PLP
 * @param self
 **/
function handleAddMore(self) {
	var productId = $(self).parents('.product-listing-item').data('productid');
	var thisItemId = $(self).val();

	var orderItemId = productListing.products[productId].itemDetails[thisItemId].orderItemId;
	var productDetails = productListing.products[productId];
	productDetails.currentItem=thisItemId;
	if(orderItemId === undefined || orderItemId === null || orderItemId === "" || orderItemId == 0){
		//Item not in cart, call ATC
		addItemsToCartPLP(self);
	}else{
		//Item in cart, call update cart
		updateItemQuantityInCartPLP(self);
	}
}

/**
 * Method to change the variant of product from PLP page secondary Display
 * @param self
 **/
function updateItemVariantInCartPLP(self) {
	var prevItemId = $(self).parents('.added-product-wrap__list').data('itemid');
	var newItemId = $(self).val();
	var quantityOfPrevItem = $(self).parents('.added-product-wrap__list').find('.added-product__quantity-size').find('select').val();
	var productDetails,fromSection,productId;

	if($(self).parents('#frequent').length===1){
		fromSection = 'FREQ';
		productId = $(self).parents('.product-listing-item').data('productid');
		productDetails = productsRecommendation.frequentProducts[productId];
	}else{
		productId = $(self).parents('.js-switch-view').find('.product-listing-item').data('productid');
		if($('.recommended-products').find('#upSellHead.resp-tab-active').length > 0){
			fromSection = 'UPSELL';
			productDetails = productsRecommendation.upsellingProducts[productId];
		}else if($('.recommended-products').find('#recommHead.resp-tab-active').length > 0){
			fromSection = 'RECOMMENDATION';
			productDetails = productsRecommendation.recommendedProducts[productId];
		}else{
			fromSection = 'PLP';
			productDetails = productListing.products[productId];
		}
	}

	var existingNewItemQntyInCart = productDetails.itemDetails[newItemId].qtyInCart;
	if(existingNewItemQntyInCart != null && existingNewItemQntyInCart != undefined && existingNewItemQntyInCart != 0 && existingNewItemQntyInCart != ""){
		//Check if the new item already exists in cart
		var quantityNew = parseInt(quantityOfPrevItem) + parseInt(existingNewItemQntyInCart);
		var newItemOrdItmId = productDetails.itemDetails[newItemId].orderItemId;
	}else{
		var quantityNew = parseInt(quantityOfPrevItem);
	}
	var argList = [self,productId,newItemId,prevItemId,quantityNew,quantityOfPrevItem,fromSection];

	var params = {};
	params.orderItemId_1 = productDetails.itemDetails[prevItemId].orderItemId; //delete the previous product
	params.quantity_1 = 0;

	if(newItemOrdItmId != null && newItemOrdItmId != undefined && newItemOrdItmId != 0 && newItemOrdItmId != ""){
		params.orderItemId_2 = newItemOrdItmId; //update the existing orderItem, if any
		params.quantity_2  = quantityNew;
	}else{
		params.catEntryId_2 = newItemId; //add new product if no existing orderitem for the new item
		params.quantity_2 = quantityNew;
	}

	callUpdateCartService(params,handleUpdateItemVariantResponsePLP,argList);
}

/**
 * Method to handle response while update of product variant in cart from PLP page 
 * @param serviceResponse : Response from update cart service
 * @param self
 * @param productId : product id 
 * @param newItemId : item id of new item in cart
 * @param prevItemId : item id of previous item that was in cart
 * @param quantityNew : quantity of new item in cart
 * @param quantityOfPrevItem : quantity of previous item that was in cart
 * @param fromSection : section which triggered update cart
 **/
function handleUpdateItemVariantResponsePLP(serviceResponse,self,productId,newItemId,prevItemId,quantityNew,quantityOfPrevItem,fromSection) {
	var productDetails,divToChange;

	if(fromSection=='FREQ'){
		productDetails = productsRecommendation.frequentProducts[productId];
		divToChange = $(self).parents('.product-listing-item.plp-grocery.product-added-to-cart[data-productid='+productId+']').parent();
	}else{
		divToChange = $(self).parents('.js-switch-view');
		if(fromSection=='PLP'){
			productDetails = productListing.products[productId];	
			if(productListing.products[productId].pageType === 'apparel'){
				productDetails.selectedColor= productDetails.itemDetails[newItemId].definingAttributes.Colour;
				productDetails.selectedSize= productDetails.itemDetails[newItemId].definingAttributes.Size;
				productDetails.currentItemInCart = newItemId;
			}
		}else if(fromSection=='UPSELL'){
			productDetails = productsRecommendation.upsellingProducts[productId];
			if(productListing.products[productId].pageType === 'apparel'){
				productDetails.selectedColor= productDetails.itemDetails[newItemId].definingAttributes.Colour;
				productDetails.selectedSize= productDetails.itemDetails[newItemId].definingAttributes.Size;
				productDetails.currentItemInCart = newItemId;
			}
		}else if(fromSection=='RECOMMENDATION'){
			productDetails = productsRecommendation.recommendedProducts[productId];
			if(productListing.products[productId].pageType === 'apparel'){
				productDetails.selectedColor= productDetails.itemDetails[newItemId].definingAttributes.Colour;
				productDetails.selectedSize= productDetails.itemDetails[newItemId].definingAttributes.Size;
				productDetails.currentItemInCart = newItemId;
			}
		}
	}

	//Update the JSON objects
	var oldOrderItemId = productDetails.itemDetails[prevItemId].orderItemId;
	productDetails.itemDetails[prevItemId].orderItemId = 0;
	productDetails.itemDetails[prevItemId].qtyInCart = 0;

	var orderId = serviceResponse.orderId;
	var orderItemId = serviceResponse.orderItem[0].orderItemId;
	var x_orderTotal = serviceResponse.x_orderTotal;
	var x_itemsInCart = serviceResponse.x_itemsInCart;

	//Update the orderitem id and order id in the cart json
	productDetails.itemDetails[newItemId].orderItemId = orderItemId;
	productDetails.itemDetails[newItemId].qtyInCart = quantityNew;


	//Update total price and savings for the product in cart
	productDetails.totalPriceInCart = parseFloat(productDetails.totalPriceInCart) + ((parseFloat(productDetails.itemDetails[newItemId].price.offerPrice) - parseFloat(productDetails.itemDetails[prevItemId].price.offerPrice))*parseInt(quantityOfPrevItem));
	productDetails.totalSavingsInCart = parseFloat(productDetails.totalSavingsInCart) + ((parseFloat(productDetails.itemDetails[newItemId].price.savings) - parseFloat(productDetails.itemDetails[prevItemId].price.savings))*parseInt(quantityOfPrevItem));
	if(typeof productDetails.totalPriceInCart == "number"){
		productDetails.totalPriceInCart = productDetails.totalPriceInCart.toFixed(2);
	}if(typeof productDetails.totalSavingsInCart == "number"){
		productDetails.totalSavingsInCart =productDetails.totalSavingsInCart.toFixed(2);
	}
	
	//Setting the price and Savings as null so that these are updated after order Calculate
	productDetails.totalPriceInCart = null;
	productDetails.totalSavingsInCart = null;
	
	var isList = $('.plp-view-option__list').hasClass('active');

	nunjucks.configure(WCParamJS.staticServerHost+'templates/',{ autoescape: true, web : {useCache:true} });

	/* Nunjucks start */
	// Single element object for product data and single element arrat for product id
	var  JSONdata = {};
	JSONdata.product = {};
	JSONdata.product[productId] = productDetails;
	JSONdata.productIds = [productId];
	JSONdata.config=productListing.config;
	JSONdata.storeId = WCParamJS.storeId;
	JSONdata.homePageURL=WCParamJS.homepageURLHierarchy;
	JSONdata.noImagePath=WCParamJS.staticServerHost+'images/DMart/NoImage_M.jpg';
	//var htmlcode = nunjucks.render('product-listing-grocery-singleitem.nunjucks', {data:JSONdata});
	var htmlcode;    
	if(productListing.products[productId].pageType === 'apparel'){
		htmlcode = nunjucks.render('product-listing-apparel-singleitem.nunjucks', {data:JSONdata});
	} else if(productListing.products[productId].pageType === 'grocery'){
		htmlcode = nunjucks.render('product-listing-grocery-singleitem.nunjucks', {data:JSONdata});
	}

	$(divToChange).html(htmlcode);


	if(productListing.products[productId].pageType === 'apparel'){
		self = $(divToChange).find('.plp-apparel .plp-apparel__cta-button');
	} else if(productListing.products[productId].pageType === 'grocery'){
		self = $(divToChange).find('.plp-grocery .product-listing__cta-button');
	}
	var $parents = $(self).parents('.product-listing-item');

	formatProductCard();

	//List View
	if(isList){
		/*if(!$('.plp-view-option__list').hasClass('active')){
			$('.plp-view-option__list').addClass('active');
		}*/
		$parents.find('.product-listing--original-price, .product-listing--discounted-price, .product-listing__quantity-secondary, .product-listing__cta-container, .product-listing__total-items').hide();
		$parents.delay(2000).addClass('product-added-to-cart');
		$parents.find('.product-listing-item__secondary, .product-listing__total-items--list-view').css('display', 'block');
		$('.product-added-to-cart').find('.product-listing-item__secondary').css('display', 'block');

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

/*		$('select').selectric();
		//$('.added-product-wrap select, .product-listing-item__secondary .add-product-other-quantity select').selectric('destroy');
		$('.added-product-wrap select').selectric('destroy').parent().addClass('custom-dropdown');
		$('.product-listing-item__secondary .add-product-other-quantity select').selectric('destroy');
		$('.slide-margin .product-listing__quantity--select, .product-listing__quantity-other--select').selectric('destroy');
		if($('.cart-wrap .cart-details-dropdown').data('selectric')) {
	    	$('.cart-wrap .cart-details-dropdown').selectric('destroy');
	    }*/
		$('.product-listing__quantity-secondary select').selectric({
			maxHeight: 170
		});
		
		$('.product-listing__quantity-other--select').selectric();

	}else{
		flipCardCustom($parents);      

		$parents.find('.slider-variant').resize();  
		$('.slide-margin .product-listing__quantity--select').selectric('destroy');
	}
	$('.product-listing__quantity--select').selectric('destroy');
	if(productListing.products[productId].pageType === 'apparel'){
		productListing.checkInventoryForApparel(null,null);
	}
	//updateHeaderMiniCartSection(x_orderTotal,x_itemsInCart);
	updateLocalStorage(0,prevItemId,orderId,oldOrderItemId,x_orderTotal,x_itemsInCart);//for old item
	updateLocalStorage(quantityNew,newItemId,orderId,orderItemId,x_orderTotal,x_itemsInCart);//for new item
	
	//fix for multiple ajax issue in IE
  	var ua = window.navigator.userAgent;		
    var msie = ua.indexOf("MSIE ");
    var trident = ua.indexOf('Trident/');
    var edge = ua.indexOf('Edge/');
    if (msie > 0 || trident > 0 || edge > 0) { 
    	$("#SimpleSearchForm_SearchTerm").focus();
    }
    renderRupeeSymbolInDropDown();
}

/**
 * Service call for update cart 
 * @param self
 */
function callUpdateCartService(params,callBack,argsList) {
	params.storeId = WCParamJS.storeId;
	params.catalogId = WCParamJS.catalogId;
	params.langId = WCParamJS.langId;    
	params.orderId = ".";
	params.inventoryValidation = "true";
	params.calculateOrder = "0";	

	//Setting the orderCalculation done as false
	var cartJSON = DMStorage.getValue('OrderId');
	if(cartJSON){
		cartJSON.orderCalculationDone = 'N';
		DMStorage.set('OrderId',cartJSON);
	}
	var urlString = window.location.protocol + '//' + window.location.hostname+'/webapp/wcs/stores/servlet/';
	if(previewToken){
		urlString = window.location.origin+'/webapp/wcs/preview/servlet/';
	}
	$.ajaxq('ItemQueue', {
		url : urlString+ "AjaxRESTOrderItemUpdate",
		method : "POST",
		data : params
	}).done(function(data) {
		if(data.indexOf("errorCode") == -1){
			responseData = JSON.parse(data);
			argsList.unshift(responseData);
			callBack.apply(this,argsList);
			MiniCartDisplay.miniCartRendered =  false;
			CartHelper.invalidateCookieForOtherProtocol();
			invokeOrderCalculate();
		}else{
			errorMessageHelper.showGenericError(MessageHelper.messages['_ERR_CART_UPDATE_ERROR']);
		}
	})
	.fail(function(data) {
		errorMessageHelper.showGenericError(MessageHelper.messages['_ERR_CART_UPDATE_ERROR']);
	}) ;	
	DMAnalytics.events(  ((typeof params.quantity != "undefined" && params.quantity == 0) ? DMAnalytics.Constants.Action.CartRemove
			: DMAnalytics.Constants.Action.CartUpdate) , "inputData:"+JSON.stringify(params), document.title, 0,params );
}

/**
 * Method to update the product variant quantity in cart from PLP page 
 * @param self
 **/
function updateItemQuantityInCartPLP(self) {
	var productId = '', productDetails = {}, fromSection = '', thisItemId, oldQuantityOfUpdatedItem, newQuantityOfUpdatedItem;

	if($(self).parents('#frequent').length===1){
		fromSection = 'FREQ';
		productId = $(self).parents('.product-listing-item').data('productid');
		productDetails = productsRecommendation.frequentProducts[productId];		
	}else{
		productId = $(self).parents('.js-switch-view').find('.product-listing-item').data('productid');
		if($('.recommended-products').find('#upSellHead.resp-tab-active').length > 0){
			fromSection = 'UPSELL';
			productDetails = productsRecommendation.upsellingProducts[productId];
		}else if($('.recommended-products').find('#recommHead.resp-tab-active').length > 0){
			fromSection = 'RECOMMENDATION';
			productDetails = productsRecommendation.recommendedProducts[productId];
		}else{
			fromSection = 'PLP';
			productDetails = productListing.products[productId];
			if(productListing.products[productId].pageType === 'apparel'){
				productDetails.selectedColor= productDetails.itemDetails[productDetails.currentItem].definingAttributes.Colour;
				productDetails.selectedSize= productDetails.itemDetails[productDetails.currentItem].definingAttributes.Size;
				productDetails.currentItemInCart = productDetails.currentItem;
			}
		}
	}

	if($(self).hasClass('product-listing__quantity--select') || $(self).hasClass('product-listing__quantity-other--select')){ //Add More
		thisItemId = $(self).val();
		oldQuantityOfUpdatedItem = productDetails.itemDetails[thisItemId].qtyInCart;
		if(oldQuantityOfUpdatedItem == 0){
			var items = DMStorage.getValue('OrderId').orderItems;
			var freegift = false;
			$.each(items , function(indx, item) { 
				if(item.catentryId == thisItemId && item.freeGift == "true") {
					oldQuantityOfUpdatedItem = item.quantity;
					} 
				});
		}
		newQuantityOfUpdatedItem = parseInt(oldQuantityOfUpdatedItem)+1;
	}else{ // Update quantity
		thisItemId = $(self).parents('.added-product-wrap__list').data('itemid');
		oldQuantityOfUpdatedItem = productDetails.itemDetails[thisItemId].qtyInCart;
		newQuantityOfUpdatedItem = $(self).parents('.added-product-wrap__list').find('.added-product__quantity-size').find('select').val();
	}	

	productDetails.currentItem = thisItemId;        

	var orderItemId = productDetails.itemDetails[thisItemId].orderItemId;
	
	var callBack = '',argsList= [];
	if($(self).hasClass('product-listing__quantity--select') || $(self).hasClass('product-listing__quantity-other--select')){ //Add More
		callBack = handleAddToCartResponsePLP;
		argsList = [self,productId,thisItemId,1,fromSection];
	} else{ // Update quantity
		callBack = handleUpdateItemQuantityResponsePLP;
		argsList = [self,productId,thisItemId,oldQuantityOfUpdatedItem,newQuantityOfUpdatedItem,fromSection];
	}

	var params = {};
	params.orderItemId = orderItemId;
	params.quantity = newQuantityOfUpdatedItem;
	
	var futureQtyInCart = parseInt(newQuantityOfUpdatedItem);
	
	if(futureQtyInCart > productDetails.itemDetails[thisItemId].maxOrderQty){
		errorMessageHelper.showGenericError(MessageHelper.messages['_ERR_MAX_QTY_ERROR']);
		if($(self).hasClass('product-listing__quantity--select') || $(self).hasClass('product-listing__quantity-other--select')){
			$(self).prop('selectedIndex', 0);
			$(self).selectric('refresh');
		}		
	}else{
		errorMessageHelper.hideError();
		callUpdateCartService(params,callBack,argsList);
	} 
}

/**
 * Method to handle response while update of product variant quantity in cart from PLP page 
 * @param serviceResponse : Response from update cart service
 * @param self
 * @param productId : product id 
 * @param thisItemId : item id of the item in cart
 * @param oldQuantityOfUpdatedItem : old quantity of the item in cart
 * @param newQuantityOfUpdatedItem : new quantity of the item in cart
 * @param fromSection : section which triggered update cart
 **/
function handleUpdateItemQuantityResponsePLP(serviceResponse,self,productId,thisItemId,oldQuantityOfUpdatedItem,newQuantityOfUpdatedItem,fromSection) {
	//Update the JSON objects
	var productDetails,$parents;

	if(fromSection=='FREQ'){
		productDetails = productsRecommendation.frequentProducts[productId];
		$parents = $(self).parents('.product-listing-item');
	}else{
		$parents = $(self).parents('.js-switch-view').find('.product-listing-item');
		if(fromSection=='PLP'){
			productDetails = productListing.products[productId];
			if(productListing.products[productId].pageType === 'apparel'){
				productDetails.selectedColor= productDetails.itemDetails[thisItemId].definingAttributes.Colour;
				productDetails.selectedSize= productDetails.itemDetails[thisItemId].definingAttributes.Size;
				productDetails.currentItemInCart = thisItemId;
			}
		}else if(fromSection=='UPSELL'){
			productDetails = productsRecommendation.upsellingProducts[productId];
		}else if(fromSection=='RECOMMENDATION'){
			productDetails = productsRecommendation.recommendedProducts[productId];
		}
	}
	productDetails.itemDetails[thisItemId].qtyInCart = newQuantityOfUpdatedItem;
	productDetails.totalQtyInCart = parseInt(productDetails.totalQtyInCart) - parseInt(oldQuantityOfUpdatedItem) + parseInt(newQuantityOfUpdatedItem);

	var changeInQnty = parseInt(newQuantityOfUpdatedItem) - parseInt(oldQuantityOfUpdatedItem);
	changeInQnty = Math.abs(changeInQnty);

	//Update total price and savings for the product in cart
	productDetails.totalPriceInCart = parseFloat(productDetails.totalPriceInCart) + (parseFloat(productDetails.itemDetails[thisItemId].price.offerPrice)*parseInt(changeInQnty));
	productDetails.totalSavingsInCart = parseFloat(productDetails.itemDetails[thisItemId].price.savings)*parseInt(newQuantityOfUpdatedItem);
	if(typeof productDetails.totalPriceInCart == "number"){
		productDetails.totalPriceInCart = productDetails.totalPriceInCart.toFixed(2);
	}if(typeof productDetails.totalSavingsInCart == "number"){
		productDetails.totalSavingsInCart =productDetails.totalSavingsInCart.toFixed(2);
	}

	var totalQtyInCart = productDetails.totalQtyInCart;
	var totalSavingsInCart = productDetails.totalSavingsInCart;
	var totalPriceInCart = productDetails.totalPriceInCart;

	$parents.find('.badge').html(totalQtyInCart);
	$parents.find('.product-listing__total-items').html('Total of '+totalQtyInCart+' Packs Added to Cart');
	$parents.find('.product-listing__total-items--list-view').html('Total of '+totalQtyInCart+' Packs Added to Cart');
	
	//Commenting off so that savings are updated after order calculate
	/*
	if(totalSavingsInCart > 0){
		$parents.find('.product-price__saving').html('Your Savings <span><i class="icon-rupees"></i>'+totalSavingsInCart+'</span>');
		$parents.find('.product-price__saving').css('display','block');
	}else{
		$('.pdp-price-total__savings').css('display','none');
	}
	$parents.find('.product-price__total').html('Total Price <i class="icon-rupees"></i>'+totalPriceInCart);
	*/

	var x_orderTotal = serviceResponse.x_orderTotal;
	var x_itemsInCart = serviceResponse.x_itemsInCart;
	var orderId = serviceResponse.orderId;
	var orderItemId = serviceResponse.orderItem[0].orderItemId;
	//updateHeaderMiniCartSection(x_orderTotal,x_itemsInCart);
	updateLocalStorage(newQuantityOfUpdatedItem,thisItemId,orderId,orderItemId,x_orderTotal,x_itemsInCart);
}

/**
 * Method to remove and item from cart from PLP page 
 * @param self
 **/
function removeItemsFromCartPLP(self) {
	var productId = '', productDetails = {}, fromSection = '';

	if($(self).parents('#frequent').length === 1){ 
		fromSection ='FREQ';
		productId = $(self).parents('.product-listing-item').data('productid');
		productDetails = productsRecommendation.frequentProducts[productId];
	}else{
		productId = $(self).parents('.js-switch-view').find('.product-listing-item').data('productid');		
		if($('.recommended-products').find('#upSellHead.resp-tab-active').length > 0){
			fromSection = 'UPSELL';
			productDetails = productsRecommendation.upsellingProducts[productId];
		}else if($('.recommended-products').find('#recommHead.resp-tab-active').length > 0){
			fromSection = 'RECOMMENDATION';
			productDetails = productsRecommendation.recommendedProducts[productId];
		}else{
			fromSection = 'PLP';
			productDetails = productListing.products[productId];
		}
	}

	var thisItemId = $(self).parents('.added-product-wrap__list').data('itemid');

	var argsList  = [self,productId,thisItemId,fromSection];
	var params = {};
	params.orderItemId = productDetails.itemDetails[thisItemId].orderItemId;
	params.quantity = 0;

	callUpdateCartService(params,handleRemoveItemsResponsePLP,argsList);
}

/**
 * Method to handle response while removal of an item from cart from PLP page 
 * @param serviceResponse : Response from update cart service
 * @param self
 * @param productId : product id 
 * @param thisItemId : item id of the item removed from cart
 * @param fromSection : section which triggered update cart
 **/
function handleRemoveItemsResponsePLP(serviceResponse,self,productId,thisItemId,fromSection) {
	//Update the JSON objects
	var productDetails,$parents;

	if(fromSection=='FREQ'){
		$parents = $(self).parents('.product-listing-item');
		productDetails = productsRecommendation.frequentProducts[productId];
	}else{
		$parents = $(self).parents('.js-switch-view').find('.product-listing-item');
		if(fromSection=='PLP'){
			productDetails = productListing.products[productId];
		}else if(fromSection=='UPSELL'){
			productDetails = productsRecommendation.upsellingProducts[productId];
		}else if(fromSection=='RECOMMENDATION'){
			productDetails = productsRecommendation.recommendedProducts[productId];
		}
	}
	productDetails.itemDetails[thisItemId].orderItemId = 0;
	var quantityOfDeletedItem = productDetails.itemDetails[thisItemId].qtyInCart;
	productDetails.itemDetails[thisItemId].qtyInCart = 0;
	productDetails.totalQtyInCart = parseInt(productDetails.totalQtyInCart) - parseInt(quantityOfDeletedItem);

	//Update total price and savings for the product in cart
	productDetails.totalPriceInCart = parseFloat(productDetails.totalPriceInCart) - (parseFloat(productDetails.itemDetails[thisItemId].price.offerPrice)*parseInt(quantityOfDeletedItem));
	productDetails.totalSavingsInCart = parseFloat(productDetails.totalSavingsInCart) - (parseFloat(productDetails.itemDetails[thisItemId].price.savings)*parseInt(quantityOfDeletedItem));
	if(typeof productDetails.totalPriceInCart == "number"){
		productDetails.totalPriceInCart = productDetails.totalPriceInCart.toFixed(2);
	}if(typeof productDetails.totalSavingsInCart == "number"){
		productDetails.totalSavingsInCart =productDetails.totalSavingsInCart.toFixed(2);
	}
	var totalQtyInCart = productDetails.totalQtyInCart;
	var totalSavingsInCart = productDetails.totalSavingsInCart;
	var totalPriceInCart = productDetails.totalPriceInCart;

	$parents.find('.badge').html(totalQtyInCart);
	$parents.find('.product-listing__total-items').html('Total of '+totalQtyInCart+' Packs Added to Cart');
	$parents.find('.product-listing__total-items--list-view').html('Total of '+totalQtyInCart+' Packs Added to Cart');
	
	//Commentiong off so that this is updated after order Calculate
	/*
	if(totalSavingsInCart > 0){
		$parents.find('.product-price__saving').html('Your Savings <span><i class="icon-rupees"></i>'+totalSavingsInCart+'</span>');
		$parents.find('.product-price__saving').css('display','block');
	}else{
		$('.pdp-price-total__savings').css('display','none');
	}
	$parents.find('.product-price__total').html('Total Price <i class="icon-rupees"></i>'+totalPriceInCart);
	*/

	if(productDetails.pageType === 'apparel'){
		if(productDetails.currentItemInCart == thisItemId){
			if(productDetails.totalQtyInCart > 0){
				$.each(productDetails.itemDetails, function(indx, item) {
					if(item.qtyInCart > 0){
						productDetails.selectedColor= item.definingAttributes.Colour;
						productDetails.selectedSize= item.definingAttributes.Size;
						productDetails.currentItemInCart = item.uniqueID;
					}					
				});
			}
		}}


	var addedProductLength = $(self).parents('.added-product-wrap').find('.added-product-wrap__list').length;

	if(fromSection=='FREQ'){
		$(self).parents('.product-listing-item').find('.added-product-wrap__list[data-itemid="'+thisItemId+'"]').remove();
	}else{
		$(self).parents('.js-switch-view').find('.added-product-wrap__list[data-itemid="'+thisItemId+'"]').remove();
	}

	$parents.find('.badge').html(totalQtyInCart);
	//$parents.find('.added-product-details').hide();
    //$('.added-product-wrap').scrollTop(0).perfectScrollbar('update'); //Bug fix for AE-16305
	$parents.find('.added-product-wrap ul li').find('.custom-dropdown').removeClass('primary-border');
	if(addedProductLength === 1) {
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
        $(self).parents('.added-product-wrap').perfectScrollbar('destroy');
	} else if(addedProductLength === 2) {
		$parents.find('.product-listing-item__secondary').find('.cart-icon').removeClass('small');
        $(self).parents('.added-product-wrap').perfectScrollbar('destroy');
	} else {
		$parents.find('.added-product-wrap').removeAttr('style');
		$parents.find('.product-listing-item__secondary').find('.cart-icon').addClass('small');
	}  

	if(productListing.products[productId].pageType === 'apparel'){
		$parents.find('.slider-variant li a').each(function(){ 
			$(this).removeClass('selected');
			$(this).html($(this).attr('title'));
		});
		if(productDetails.totalQtyInCart > 0){
			$parents.find('.slider-variant li a').each(function(){ 
				$(this).removeClass('selected');
				$(this).html($(this).attr('title'));
				$(this).removeClass('addedToCart');
				if($(this).attr('title') === productDetails.selectedSize){
					//$(this).addClass('selected');
					$(this).html(productDetails.selectedSize+' <span>('+productListing.products[productId].itemDetails[productDetails.currentItemInCart].qtyInCart+')</span>');
				}
			});
			$parents.find('.plp-apparel__color-pallette li').each(function(){
				$(this).removeClass('selected');
				if($(this).data('color') === productDetails.selectedColor){
					$(this).addClass('selected');
				}
			});
		}else{
			if($parents.hasClass('plp-apparel')) {
				$parents.find('.plp-apparel__color-pallette').show();
				$parents.find('.plp-apparel__color-pallette-alt').hide();
				$parents.find('.slides a.addedToCart').removeClass('addedToCart');
				var defaultItemId = productListing.products[productId].itemIds[0];
				var defaultItemDetails = productListing.products[productId].itemDetails[defaultItemId];
				$parents.find('.product-listing-details .product-listing--original-price .strike-diagonal').html('<i class="icon-rupees"></i>' + defaultItemDetails.price.sellingPrice);
				$parents.find('.product-listing-details .product-listing--discounted-price').html('DMart <i class="icon-rupees"></i>' + defaultItemDetails.price.offerPrice);
				$parents.find('.product-listing-details .product-listing__save .product-listing__save--price').html('<i class="icon-rupees"></i>' + defaultItemDetails.price.savings);
				$parents.find('.plp-apparel__color-pallette li').each(function(){
					$(this).removeClass('selected');
					if($(this).data('color') === defaultItemDetails.definingAttributes.Colour){
						$(this).addClass('selected');
					}
				});
				if(defaultItemDetails.price.savings > 0){
					$parents.find('.product-listing-details .product-listing__save ').show();
				}else{
					$parents.find('.product-listing-details .product-listing__save ').hide();
				}
			}
		}		
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
	}

	$parents.find('.product-listing--image').addClass('small'); 
/*	$('select').selectric();
	//$('.added-product-wrap select,  .product-listing-item__secondary .add-product-other-quantity select').selectric('destroy');
	$('.added-product-wrap select').selectric('destroy').parent().addClass('custom-dropdown');
	$('.product-listing-item__secondary .add-product-other-quantity select').selectric('destroy');
	$('.slide-margin .product-listing__quantity--select').selectric('destroy');
	if($('.cart-wrap .cart-details-dropdown').data('selectric')) {
    	$('.cart-wrap .cart-details-dropdown').selectric('destroy');
    }*/
	
	$('.product-listing__quantity-secondary select').selectric({
		maxHeight: 170
	});
	$('.product-listing__quantity-other--select').selectric();
	
	 if($('#topCategoryOffers').length > 0){
		 $('#topCategoryOffers select').selectric('destroy');
		 $('.product-listing_update_itemsize--select').selectric('destroy');
		 $('.product-listing_update_quantity--select').selectric('destroy');
		 $('#topCategoryOffers .md-custom-select').addClass('custom-dropdown');
	  }
	 
	var x_orderTotal = serviceResponse.x_orderTotal;
	var x_itemsInCart = serviceResponse.x_itemsInCart;
	var orderId = serviceResponse.orderId;
	//updateHeaderMiniCartSection(x_orderTotal,x_itemsInCart);
	updateLocalStorage(0,thisItemId,orderId,0,x_orderTotal,x_itemsInCart);
}

/**
 * Method to add items to cart from PLP page 
 * @param self
 **/
function addItemsToCartPLP(self) {
	var productDetails,productId,fromSection;

	if($(self).parents('#frequent').length === 1){ //Frequently bought
		fromSection ='FREQ';
		productId = $(self).parents('.product-listing-item').data('productid');
		productDetails = productsRecommendation.frequentProducts[productId];
	}else{
		productId = $(self).parents('.js-switch-view').find('.product-listing-item').data('productid');		
		if($('.recommended-products').find('#upSellHead.resp-tab-active').length > 0){
			fromSection = 'UPSELL';
			productDetails = productsRecommendation.upsellingProducts[productId];
			if(productListing.products[productId].pageType === 'apparel'){
				productDetails.selectedColor= productDetails.itemDetails[productDetails.currentItem].definingAttributes.Colour;
				productDetails.selectedSize= productDetails.itemDetails[productDetails.currentItem].definingAttributes.Size;
				productDetails.currentItemInCart = productDetails.currentItem;
			}
		}else if($('.recommended-products').find('#recommHead.resp-tab-active').length > 0){
			fromSection = 'RECOMMENDATION';
			productDetails = productsRecommendation.recommendedProducts[productId];
			if(productListing.products[productId].pageType === 'apparel'){
				productDetails.selectedColor= productDetails.itemDetails[productDetails.currentItem].definingAttributes.Colour;
				productDetails.selectedSize= productDetails.itemDetails[productDetails.currentItem].definingAttributes.Size;
				productDetails.currentItemInCart = productDetails.currentItem;
			}
		}else{
			fromSection = 'PLP';
			productDetails = productListing.products[productId];
			if(productListing.products[productId].pageType === 'apparel'){
				productDetails.selectedColor= productDetails.itemDetails[productDetails.currentItem].definingAttributes.Colour;
				productDetails.selectedSize= productDetails.itemDetails[productDetails.currentItem].definingAttributes.Size;
				productDetails.currentItemInCart = productDetails.currentItem;
			}
		}
	}

	if(($(self).hasClass('product-listing__cta-button') || $(self).hasClass('plp-apparel__cta-button')) && productDetails != undefined){
		var thisItemId = productDetails.currentItem;
	}else{
		var	thisItemId = $(self).val();
	}

	var thisQuantity = $(self).parents('.product-listing-item').find('.selectric-product-listing__quantity--select-quantity').find('.label').text();
	if(thisQuantity === undefined || thisQuantity === null || thisQuantity === ""){
		//RWD issue : AE-6833
		thisQuantity = $(self).parents('.product-listing-item').find('.product-listing__quantity--select-quantity').val();
		if(thisQuantity === undefined || thisQuantity === null || thisQuantity === ""){
			thisQuantity = 1;
		}
	}

	productDetails.currentItem = thisItemId;

	var params = {};
	params.catEntryId_1 = thisItemId;
	params.quantity_1 = thisQuantity;
	var argList = [self, productId,thisItemId, thisQuantity,fromSection];
	
	var futureQtyInCart = productDetails.itemDetails[thisItemId].qtyInCart + parseInt(thisQuantity);
	if(productDetails.itemDetails[thisItemId].freeGiftQty) {
		futureQtyInCart +=productDetails.itemDetails[thisItemId].freeGiftQty;
	}
	
	if(futureQtyInCart > parseInt(productDetails.itemDetails[thisItemId].maxOrderQty) ){
		errorMessageHelper.showGenericError(MessageHelper.messages['_ERR_MAX_QTY_ERROR']);
	}else{
		errorMessageHelper.hideError();
		callAddToCart(params,handleAddToCartResponsePLP,argList);
	}   
}

/**
 * Pincode is mandatory for all cart action.
 * This class checks if a pincode is selected
 * and forces user to select one before adding 
 * and item to cart. 
 */
function hasPincodeSelected(){
	
	var hasPincodeSkip = DMStorage.getSessionValue("pincodeSkip");
	if(hasPincodeSkip != null && hasPincodeSkip == "true" && typeof getCookie('DMART_Pincode_Cookie') == "undefined"){
		$('.icon-delivery-caret-down').trigger('click');
		$("#locationModal").find('.location-skip').hide();
		$("#locationModal").find('.modal-dialog__close').hide();
		return false;
	}
	return true;
}
/**
 * Function to invoke Add to cart
 * @param params
 * @param callBack
 * @param argList
 */

function callAddToCart(params,callBack,argsList){
	
	if(!hasPincodeSelected()){
		var dalayedParams = {};
		dalayedParams.params = params;
		dalayedParams.callBackName = callBack.name;
		dalayedParams.argsList = argsList;
		 DMStorage.sessionSet("addtoCartDelayedAction",dalayedParams);
		 return;
	}
	
	//checkItemInCart(params);
	
	params.storeId = WCParamJS.storeId;
	params.catalogId = WCParamJS.catalogId;
	params.langId = WCParamJS.langId;    
	params.orderId = ".";
	params.inventoryValidation = "true";
	params.calculateOrder = "0";	

	//Setting the orderCalculation done as false
	var cartJSON = DMStorage.getValue('OrderId');
	if(cartJSON){
		cartJSON.orderCalculationDone = 'N';
		DMStorage.set('OrderId',cartJSON);
	}
	var urlString = window.location.protocol + '//' + window.location.hostname+'/webapp/wcs/stores/servlet/';
	if(previewToken){
		urlString = window.location.origin+'/webapp/wcs/preview/servlet/';
	}
	$.ajaxq('ItemQueue', {
		url : urlString+ "AjaxRESTOrderItemAdd",
		method : "POST",
		data : params
	}).done(function(data) {
		if(data.indexOf("errorCode") == -1){
			responseData = JSON.parse(data);
			argsList.unshift(responseData);
			callBack.apply(this,argsList);
			CartHelper.invalidateCookieForOtherProtocol();
			invokeOrderCalculate();
		}else{
			errorMessageHelper.showGenericError(MessageHelper.messages['_ERR_CART_UPDATE_ERROR']);
		}
	})
	.fail(function(data) {
		errorMessageHelper.showGenericError(MessageHelper.messages['_ERR_CART_UPDATE_ERROR']);
	}) ;
	DMAnalytics.events( DMAnalytics.Constants.Action.CartAdd, "inputData: "+JSON.stringify(params), document.title, 0,params );
}

/**
 * To handle the scenario when same product is added from multiple tabs
 * Existing item in cart will be removed and new item will be added.
 * @param params
 */
function checkItemInCart(params){	
	var ord = DMStorage.getValue('OrderId');
	var deleteParams = {};
	if(DMStorage.getValue('OrderId')){
		var items = ord.orderItems;
		var numberOfItemsAdded = (Object.keys(params).length)/2;
		for(var i=1;i<=numberOfItemsAdded;i++){
			if(params['catEntryId_'+i]){
				$.each(items,function(j){
					if(items[j].catentryId == params['catEntryId_'+i]){
						deleteParams['orderItemId_'+i] = items[j].orderItemId;
						deleteParams['quantity_'+i] = 0;
					}
				});
			}
		}
	}
	
	if(!$.isEmptyObject(deleteParams)){
		deleteParams.storeId = WCParamJS.storeId;
		deleteParams.catalogId = WCParamJS.catalogId;
		deleteParams.langId = WCParamJS.langId;    
		deleteParams.orderId = ".";
		deleteParams.inventoryValidation = "true";
		deleteParams.calculateOrder = "0";	
		var urlString = window.location.protocol + '//' + window.location.hostname +'/webapp/wcs/stores/servlet/';
		if(previewToken){
			urlString = window.location.origin+'/webapp/wcs/preview/servlet/';
		}
		$.ajaxq('ItemQueue', {
			url : urlString+ "AjaxRESTOrderItemUpdate",
			method : "POST",
			data : deleteParams
		}).done(function(data) {
			if(data.indexOf("errorCode") == -1){
				responseData = JSON.parse(data);
			}else{
				errorMessageHelper.showGenericError(MessageHelper.messages['_ERR_CART_UPDATE_ERROR']);
			}
		})
		.fail(function(data) {
			errorMessageHelper.showGenericError(MessageHelper.messages['_ERR_CART_UPDATE_ERROR']);
		}) ;			
	}
}

/**
 * Checks whethere there are any cart related actions in queue
 */
$(document).on('dmart.product.change.success',function(e){
	var itemQueues = $.ajaxq.queuesList['ItemQueue'];
	if(itemQueues && itemQueues != null && itemQueues.length==0){		
		invokeOrderCalculate();
	}
});

/**
 * Invokes order calculate command and invokes the function to update cartJSON in localStorage
 */
function invokeOrderCalculate() {
	var itemQueues = $.ajaxq.queuesList['ItemQueue'];
	if(itemQueues && itemQueues.length===0) {	

		var params = {};
		params.storeId = WCParamJS.storeId;
		params.catalogId = WCParamJS.catalogId;
		params.langId = WCParamJS.langId; 
		params.orderId = ".";
		params.inventoryValidation = "true";
		params.calculationUsageId = "-1";
		var urlPrefix = window.location.protocol + '//' + window.location.hostname + '/wcs/resources/';
		if(previewToken){
			urlPrefix = window.location.origin+'/wcs/previewresources/';
		}
		$.ajaxq('ItemQueue', {
			url : urlPrefix + 'store/' + WCParamJS.storeId + '/cart/dmartcalculate',
			method : "POST",
			data : params
		}).done(function(data) {		
			CartHelper.storeOrderItems(data,false);
			$(document).trigger('dmart.pdp.quantity.perfectscroll');
		}).fail(function(data) {
			errorMessageHelper.showGenericError(MessageHelper.messages['_ERR_CART_UPDATE_ERROR']);
		});
	}
}
/**
 * Method to handle response while addition of an item to cart from Cart page 
 **/
function handleAddToCartResponseFromCart(){
	localStorage.removeItem('orderId');
	dojo.cookie("DM_OrderId", null, {expires: -1,path: '/'});
	location.reload();
}

/**
 * Method to handle response while addition of an item to cart from Cart page 
 **/
function handleAddToCartResponsePincodeSkip(){
	localStorage.removeItem('orderId');
	dojo.cookie("DM_OrderId", null, {expires: -1,path: '/'});
}
/**
 * Method to handle response while addition of an item to cart from PLP page 
 * @param serviceResponse : Response from update cart service
 * @param self
 * @param productId : product id 
 * @param thisItemId : item id of the item added to cart
 * @param thisQuantity : quantity of the item added to cart
 * @param fromSection : section which triggered add to cart
 **/
function handleAddToCartResponsePLP(serviceResponse,self,productId,thisItemId,thisQuantity,fromSection) {
	var orderId = serviceResponse.orderId;
	var orderItemId = serviceResponse.orderItem[0].orderItemId;
	var x_orderTotal = serviceResponse.x_orderTotal;
	var x_itemsInCart = serviceResponse.x_itemsInCart;
	var productDetails,divToChange,itemType,htmlcode;
	var isList = $('.plp-view-option__list').hasClass('active');

	if(fromSection=='FREQ'){
		productDetails = productsRecommendation.frequentProducts[productId];
		divToChange = $(self).parents('.product-listing-item.plp-grocery.product-added-to-cart[data-productid='+productId+']').parent();
	}else{
		divToChange = $(self).parents('.js-switch-view');
		if(fromSection=='PLP'){
			productDetails = productListing.products[productId];	

			if(productListing.products[productId].pageType === 'apparel'){
				productListing.products[productId].selectedColor= productListing.products[productId].itemDetails[productListing.products[productId].currentItem].definingAttributes.Colour;
				productListing.products[productId].selectedSize=productListing.products[productId].itemDetails[productListing.products[productId].currentItem].definingAttributes.Size;
				productListing.products[productId].currentItemInCart = productListing.products[productId].currentItem;
			} 
		}else if(fromSection=='UPSELL'){
			productDetails = productsRecommendation.upsellingProducts[productId];
			if(productListing.products[productId].pageType === 'apparel'){
				productListing.products[productId].selectedColor= productListing.products[productId].itemDetails[productListing.products[productId].currentItem].definingAttributes.Colour;
				productListing.products[productId].selectedSize=productListing.products[productId].itemDetails[productListing.products[productId].currentItem].definingAttributes.Size;
				productListing.products[productId].currentItemInCart = productListing.products[productId].currentItem;
			} 
		}else if(fromSection=='RECOMMENDATION'){
			productDetails = productsRecommendation.recommendedProducts[productId];
			if(productListing.products[productId].pageType === 'apparel'){
				productListing.products[productId].selectedColor= productListing.products[productId].itemDetails[productListing.products[productId].currentItem].definingAttributes.Colour;
				productListing.products[productId].selectedSize=productListing.products[productId].itemDetails[productListing.products[productId].currentItem].definingAttributes.Size;
				productListing.products[productId].currentItemInCart = productListing.products[productId].currentItem;
			} 
		}
	}

	//Update the orderitem id and order id in the cart json
	productDetails.itemDetails[thisItemId].orderItemId = orderItemId;

	//Update the quantity of items in cart at item level and product level, number of variants
	productDetails.itemDetails[thisItemId].qtyInCart = parseInt(productDetails.itemDetails[thisItemId].qtyInCart) + parseInt(thisQuantity);
	productDetails.totalQtyInCart = parseInt(productDetails.totalQtyInCart) + parseInt(thisQuantity);


	//Update total price and savings for the product in cart
	productDetails.totalPriceInCart = parseFloat(productDetails.totalPriceInCart) + (parseFloat(productDetails.itemDetails[thisItemId].price.offerPrice)*parseInt(thisQuantity));
	productDetails.totalSavingsInCart = parseFloat(productDetails.totalSavingsInCart) + (parseFloat(productDetails.itemDetails[thisItemId].price.savings)*parseInt(thisQuantity));
	if(typeof productDetails.totalPriceInCart == "number"){
		productDetails.totalPriceInCart = productDetails.totalPriceInCart.toFixed(2);
	}if(typeof productDetails.totalSavingsInCart == "number"){
		productDetails.totalSavingsInCart =productDetails.totalSavingsInCart.toFixed(2);
	}
	
	//Setting the price and Savings as null so that these are updated after order Calculate
	productDetails.totalPriceInCart = null;
	productDetails.totalSavingsInCart = null;
	nunjucks.configure(WCParamJS.staticServerHost+'templates/',{ autoescape: true, web : {useCache:true} });

	/* Nunjucks start */
	// Single element object for product data and single element arrat for product id
	var  JSONdata = {};
	JSONdata.product = {};
	JSONdata.product[productId] = productDetails;
	JSONdata.productIds = [productId];
	JSONdata.config=productListing.config;
	JSONdata.storeId = WCParamJS.storeId;
	JSONdata.homePageURL=WCParamJS.homepageURLHierarchy;
	JSONdata.noImagePath=WCParamJS.staticServerHost+'images/DMart/NoImage_M.jpg';
	var htmlcode;    
	if(productListing.products[productId].pageType === 'apparel'){
		htmlcode = nunjucks.render('product-listing-apparel-singleitem.nunjucks', {data:JSONdata});
	} else if(productListing.products[productId].pageType === 'grocery' || productListing.products[productId].pageType === 'general_merchandise'){
		htmlcode = nunjucks.render('product-listing-grocery-singleitem.nunjucks', {data:JSONdata});
	}

	$(divToChange).html(htmlcode);

	//formatProductCard();

	if(productListing.products[productId].pageType === 'apparel'){
		self = $(divToChange).find('.plp-apparel .plp-apparel__cta-button');
	} else if(productListing.products[productId].pageType === 'grocery' || productListing.products[productId].pageType === 'general_merchandise'){
		self = $(divToChange).find('.plp-grocery .product-listing__cta-button');
	}
	var $parents = $(self).parents('.product-listing-item');   
    

	//List View
	if(isList){
		$parents.find('.product-listing--original-price, .product-listing--discounted-price, .product-listing__quantity-secondary, .product-listing__cta-container, .product-listing__total-items').hide();
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

/*		$('select').selectric();
		//$('.added-product-wrap select,  .product-listing-item__secondary .add-product-other-quantity select').selectric('destroy');
		$('.added-product-wrap select').selectric('destroy').parent().addClass('custom-dropdown');
		$('.add-product-other-quantity select').selectric('destroy');
		$('.slide-margin .product-listing__quantity--select, .product-listing__quantity-other--select').selectric('destroy');
		if($('.cart-wrap .cart-details-dropdown').data('selectric')) {
	    	$('.cart-wrap .cart-details-dropdown').selectric('destroy');
	    }*/
		$('.product-listing__quantity-secondary select').selectric({
			maxHeight: 170
		});
		$('.product-listing__quantity-other--select').selectric();
		if($parents.hasClass('plp-apparel')) {
			$parents.find('.plp-apparel__color-pallette').hide();
			$parents.find('.plp-apparel__color-pallette-alt').show();
		}
	}else{
		flipCardCustom($parents);      

		$parents.find('.slider-variant').resize(); 
		$('.slide-margin .product-listing__quantity--select').selectric('destroy');
	}
	//$('.product-listing__quantity--select').selectric('destroy');
	$parents.find('.slider-variant-wrap li a').removeClass('selected');
	//updateHeaderMiniCartSection(x_orderTotal,x_itemsInCart);
	if(productListing.products[productId].pageType === 'apparel'){
		productListing.checkInventoryForApparel(null,null);
	}
	updateLocalStorage(productDetails.itemDetails[thisItemId].qtyInCart,thisItemId,orderId,orderItemId,x_orderTotal,x_itemsInCart);
	
	//fix for multiple ajax issue in IE
  	var ua = window.navigator.userAgent;		
    var msie = ua.indexOf("MSIE ");
    var trident = ua.indexOf('Trident/');
    var edge = ua.indexOf('Edge/');
    if (msie > 0 || trident > 0 || edge > 0) { 
    	$("#SimpleSearchForm_SearchTerm").focus();
    }
    
    
    if($('#missedItems').length > 0){
    	removeSelectricForMissedItems(productId);
    }
    renderRupeeSymbolInDropDown();
}

/**
 * Method to remove selectric for missed items sectionin cart page
 * @param productId
 **/
function removeSelectricForMissedItems(productId) {
 $('#missedItems').find("[data-productid='" + productId + "']").find('.product-listing-item__secondary .add-product-other-quantity select').selectric('destroy');
 $('#missedItems').find("[data-productid='" + productId + "']").find('.md-custom-select select').selectric().parents('.md-custom-select').removeClass('custom-dropdown');
 $('#missedItems').find('.resp-tabs-container .add-product-other-quantity select, .resp-tabs-container .product-listing__quantity-secondary select').selectric('destroy')
}

/**
 * Method to add items to cart from PDP page 
 * @param self
 * @param fromSection : section which triggered add to cart
 **/
function addItemsToCart(self,fromSection) {
	var productId = productDisplay.pageid.productId;
	var activeItemElements; 
	var itemIds,qty, pid;

	if(fromSection=='PDP'){
		if(productDisplay.product.pageType === 'apparel'){
			catentryId = productDisplay.product.selectedItem[0];
		} else if(productDisplay.product.pageType === 'grocery'){
			activeItemElements = $(self).parents('.product-details').find('.slider-variant').find('.active');
		}
		else if(productDisplay.product.pageType === 'general_merchandise' ){
			activeItemElements = $(self).parents('.product-details').find('.slider-variant').find('.active');
		}
	}else if(fromSection=='FREQ'){
		itemIds = resolveSKURecomendationsPid(self);
		qty = resolveSKURecomendationsQty(self);
		pid = resolveSKURecomendationsProductId(self);		
	}

	var params = {};
	if(fromSection=='PDP'){
		if(productDisplay.product.pageType === 'apparel'){
			params.catEntryId_1 = catentryId;
			params.quantity_1 = 1;
		} else if(productDisplay.product.pageType === 'grocery' || productDisplay.product.pageType === 'general_merchandise'){
			$(activeItemElements).each(function(i, obj) {
				params["catEntryId_" + (parseInt(i)+1)] = $(obj).data('item');
				params["quantity_" + (parseInt(i)+1)]        = 1;
			});
		}

	}           
	else if(fromSection=='FREQ'){
		$.each(itemIds, function(i) {
			params["catEntryId_" + (parseInt(i)+1)] = itemIds[i];
		});

		$.each(qty, function(i) {
			params["quantity_" + (parseInt(i)+1)]	= qty[i];
		});

	}

	var argList = [];
	var callBack = '';

	if(fromSection=='PDP'){
		argList = [self,productId];
		callBack = handleAddToCartResponse;
	}else if(fromSection=='FREQ'){
		argList = [self,pid,itemIds,qty];
		callBack = handleAddToCartResponsePDPFreq;
	}	
	callAddToCart(params,callBack,argList);			
}

/**
 * Method to handle response while addition of an item to cart from PDP page 
 * @param serviceResponse : Response from update cart service
 * @param self
 * @param productId : product id 
 **/
function handleAddToCartResponse(serviceResponse,self,productId) {
	var orderId = serviceResponse.orderId;
	for (var i=0; i<serviceResponse.orderItem.length; i++) {
		var orderItemId = serviceResponse.orderItem[i].orderItemId;
		var catentryId = serviceResponse.orderItem[i].productId;
		productDisplay.product.itemDetails[catentryId].orderItemId = orderItemId;
		productDisplay.product.totalQtyInCart = productDisplay.product.totalQtyInCart + 1;
		productDisplay.product.itemDetails[catentryId].qtyInCart = 1;
		productDisplay.product.totalPriceInCart = parseFloat(productDisplay.product.totalPriceInCart)+parseFloat(productDisplay.product.itemDetails[catentryId].price.offerPrice);
		productDisplay.product.totalSavingsInCart = parseFloat(productDisplay.product.totalSavingsInCart)+parseFloat(productDisplay.product.itemDetails[catentryId].price.savings);
		if(typeof productDisplay.product.totalPriceInCart == "number"){
			productDisplay.product.totalPriceInCart = productDisplay.product.totalPriceInCart.toFixed(2);
		}if(typeof productDisplay.product.totalSavingsInCart == "number"){
			productDisplay.product.totalSavingsInCart =productDisplay.product.totalSavingsInCart.toFixed(2);
		}
		if(productDisplay.product.pageType === 'apparel'){
			productDisplay.product.selectedColor= productDisplay.product.itemDetails[productDisplay.product.currentItem].definingAttributes.Colour;
			productDisplay.product.selectedSize=productDisplay.product.itemDetails[productDisplay.product.currentItem].definingAttributes.Size;
			productDisplay.product.currentItemInCart = productDisplay.product.currentItem;
		} 

	}

	var x_orderTotal = serviceResponse.x_orderTotal;
	var x_itemsInCart = serviceResponse.x_itemsInCart;

	var $productVariantParent = $('.product-details .slider-variant .slides');

	$('.product-details__btn-quantity select').prop('selectedIndex', 1).selectric('refresh');
	$('.product-details__btn-quantity select').selectric('refresh');
	//Add to cart button
	if($(self).hasClass('product-details__btn-addtocart')){
		if(!$('.product-details .slider-variant .slides li').hasClass('active')) {
			$(self).css('display', 'none');
			$(self).siblings('.product-details__btn--addtocart-popup').hide();
			//$productVariantParent.find('.active').addClass('enableChangeQty addedToCart');
		} else {
			$(self).css('display', 'none');
			$('.product-listing__save, .pdp-price-panel__primary, .pdp-price-panel__price-mrp').css('display', 'none');
			$('.product-details .slider-variant .active a').children('.product-unit').css('display', 'inline');
			$('.product-details__btn-quantity').css('display', 'block');
			//, .pdp-price-total, .quick-product-cart
			$(self).siblings('.product-details__btn--addtocart-popup').css('display', 'none');
			$productVariantParent.find('.active').addClass('enableChangeQty addedToCart');
			$('.slider-variant .active .product-unit-count').text(1);
			$('.quick-product-cart .quick-product-cart--count').text(productDisplay.product.totalQtyInCart);
			$('.quick-product-delivery, .quick-product-not-cod, .quick-product-available').hide();
			//fix for JIRA 6185
			$('.product-details .slider-variant .slides .active').find('.product-details__change-qty').css('display', 'block');
			//$productVariantParent.find('.active').removeClass('active');

		}
	}
	//Add more button
	else if($(self).hasClass('product-details__btn-add-more')){
		if($productVariantParent.find('.active').length <= 0) {
			$(self).css('display', 'none');
			$(self).siblings('.product-details__btn--addtocart-popup').fadeIn();
		} else {
			$(self).css('display', 'none');
			$('.pdp-price-panel__price-mrp, .pdp-price-panel__primary').hide();
			$('.product-listing__save').hide();
			$('.pdp-price-total').css('display', 'block');
			$(self).siblings('.product-details__btn--addtocart-popup').css('display', 'none');
			$('.slider-variant .active a').children('.product-unit').css('display', 'inline');
			$('.slider-variant .active .product-unit-count').text(1);
			$('.product-details__btn-quantity').css('display', 'block');
			$('.product-details__btn-addtocart, .product-details__btn-add-more').css('display', 'none');
			$productVariantParent.find('.active').addClass('enableChangeQty addedToCart');
			//$productVariantParent.find('.active').removeClass('active');
			var selectedProductLength = $productVariantParent.find('.enableChangeQty').length;
			$('.quick-product-cart .quick-product-cart--count').text(productDisplay.product.totalQtyInCart);
			$('.product-details .slider-variant .slides .active').find('.product-details__change-qty').css('display', 'block');
		}
	}
	productDisplay.product.currentItem = catentryId;
	//$('.product-details__btn-viewcart').css('display', 'block');
	//updateHeaderMiniCartSection(x_orderTotal,x_itemsInCart);
	//Commenting off the code to update price and Savings after orderCalculate
	//updateTotalPriceAndSavingsPDP(productDisplay.product.totalSavingsInCart,productDisplay.product.totalPriceInCart);
	updateLocalStorage(1,catentryId,orderId,orderItemId,x_orderTotal,x_itemsInCart)
}

/**
 * Method to handle response while addition of an item to cart from recommendations section in PDP page 
 * @param serviceResponse : Response from update cart service
 * @param self
 * @param productId : product id 
 * @param itemIds : item ids of the items added to cart
 * @param quantity : quantity of the item added to cart
 **/
function handleAddToCartResponsePDPRecommendations(serviceResponse,self,productIds,itemIds,quantity) {
	var orderId = serviceResponse.orderId;
	var orderItemId,catentryId,qty;

	var x_orderTotal = serviceResponse.x_orderTotal;
	var x_itemsInCart = serviceResponse.x_itemsInCart;


	for (var i=0; i<serviceResponse.orderItem.length; i++) {
		orderItemId = serviceResponse.orderItem[i].orderItemId;
		catentryId = serviceResponse.orderItem[i].productId;
		qty = serviceResponse.orderItem[i].quantity;

		var obj;

		$.each(productIds, function(index) {
			obj = productsRecommendation.frequentProducts[productIds[index]];
			if(obj.itemDetails[catentryId] != undefined){

				//Update the orderitem id and order id in the cart json
				obj.itemDetails[catentryId].orderItemId = orderItemId;

				//Update the quantity of items in cart at item level and product level, number of variants
				obj.itemDetails[catentryId].qtyInCart = parseInt(obj.itemDetails[catentryId].qtyInCart) + parseInt(qty);
				obj.totalQtyInCart = parseInt(obj.totalQtyInCart) + parseInt(qty);

				//Update total price and savings for the product in cart
				obj.totalPriceInCart = parseFloat(obj.totalPriceInCart) + (parseFloat(obj.itemDetails[catentryId].price.offerPrice)*parseInt(qty));
				obj.totalSavingsInCart = parseFloat(obj.totalSavingsInCart) + (parseFloat(obj.itemDetails[catentryId].price.savings)*parseInt(qty));
				if(typeof obj.totalPriceInCart == "number"){
					obj.totalPriceInCart = obj.totalPriceInCart.toFixed(2);
				}if(typeof obj.totalSavingsInCart == "number"){
					obj.totalSavingsInCart =obj.totalSavingsInCart.toFixed(2);
				}

			}

		});	
		updateLocalStorage(qty,catentryId,orderId,orderItemId,x_orderTotal,x_itemsInCart);
	}
	
	nunjucks.configure(WCParamJS.staticServerHost+'templates/',{ autoescape: true, web : {useCache:true} });

	/* Nunjucks start */
	var  JSONdata = {};
	$.each(itemIds, function(count) {

		var pid = productIds[count];

		// Single element object for product data and single element array for product id
		JSONdata.product = {};
		JSONdata.product[pid] = productsRecommendation.frequentProducts[pid];
		JSONdata.productIds = [pid];
		JSONdata.config = productsRecommendation.config;		
		JSONdata.storeId = WCParamJS.storeId;
		JSONdata.homePageURL=WCParamJS.homepageURLHierarchy;
		JSONdata.noImagePath=WCParamJS.staticServerHost+'images/DMart/NoImage_M.jpg';
		var htmlcode;    
		if(productListing.products[pid].pageType === 'apparel'){
			htmlcode = nunjucks.render('product-listing-apparel-singleitem.nunjucks', {data:JSONdata});
		} else if(productListing.products[pid].pageType === 'grocery' || productListing.products[pid].pageType==='general_merchandise'){
			htmlcode = nunjucks.render('product-listing-grocery-singleitem.nunjucks', {data:JSONdata});
		}

		var divToChange = $(self).parents('#frequentlyPurchased').find('.product-alternate-checkbox:checkbox:checked').parents('.product-listing-item[data-productid='+pid+']').parents('.col-xs-12.col-md-6.col-lg-3');
		$(divToChange).html(htmlcode);

		self = $(divToChange).find('.plp-grocery .product-listing__cta-button');
		var $parents = $(self).parents('.product-listing-item');   



		flipCardCustom($parents);
		$parents.find('.slider-variant').resize();
		if(productListing.products[pid].pageType === 'apparel'){
			productListing.checkInventoryForApparel(null,null);
		}
	});

	//updateHeaderMiniCartSection(x_orderTotal,x_itemsInCart);
	
	//fix for multiple ajax issue in IE
  	var ua = window.navigator.userAgent;		
    var msie = ua.indexOf("MSIE ");
    var trident = ua.indexOf('Trident/');
    var edge = ua.indexOf('Edge/');
    if (msie > 0 || trident > 0 || edge > 0) { 
    	$("#SimpleSearchForm_SearchTerm").focus();
    }
}

/**
 * Method to handle response while addition of an item to cart from frequently brought together section in PDP page 
 * @param serviceResponse : Response from update cart service
 * @param self
 * @param productId : product id 
 * @param itemIds : item ids of the items added to cart
 * @param quantity : quantity of the item added to cart
 **/
function handleAddToCartResponsePDPFreq(serviceResponse,self,productIds,itemIds,quantity) {
	var orderId = serviceResponse.orderId;
	var orderItemId,catentryId,qty;

	var x_orderTotal = serviceResponse.x_orderTotal;
	var x_itemsInCart = serviceResponse.x_itemsInCart;


	for (var i=0; i<serviceResponse.orderItem.length; i++) {
		orderItemId = serviceResponse.orderItem[i].orderItemId;
		catentryId = serviceResponse.orderItem[i].productId;
		qty = serviceResponse.orderItem[i].quantity;

		var obj;

		$.each(productIds, function(index) {
			obj = productsRecommendation.frequentProducts[productIds[index]];
			if(obj.itemDetails[catentryId] != undefined){

				//Update the orderitem id and order id in the cart json
				obj.itemDetails[catentryId].orderItemId = orderItemId;

				//Update the quantity of items in cart at item level and product level, number of variants
				obj.itemDetails[catentryId].qtyInCart = parseInt(obj.itemDetails[catentryId].qtyInCart) + parseInt(qty);
				obj.totalQtyInCart = parseInt(obj.totalQtyInCart) + parseInt(qty);

				//Update total price and savings for the product in cart
				obj.totalPriceInCart = parseFloat(obj.totalPriceInCart) + (parseFloat(obj.itemDetails[catentryId].price.offerPrice)*parseInt(qty));
				obj.totalSavingsInCart = parseFloat(obj.totalSavingsInCart) + (parseFloat(obj.itemDetails[catentryId].price.savings)*parseInt(qty));
				if(typeof obj.totalPriceInCart == "number"){
					obj.totalPriceInCart = obj.totalPriceInCart.toFixed(2);
				}if(typeof obj.totalSavingsInCart == "number"){
					obj.totalSavingsInCart =obj.totalSavingsInCart.toFixed(2);
				}
			}
		});	
		updateLocalStorage(qty,catentryId,orderId,orderItemId,x_orderTotal,x_itemsInCart);
	}
	//updateHeaderMiniCartSection(x_orderTotal,x_itemsInCart);
}

/**
 * Method to update items in cart from PDP page 
 * @param self
 **/
function updateItemsInCart(self) {
	var activeItemElements;
	var productId = productDisplay.pageid.productId;
	if(productDisplay.product.pageType === 'general_merchandise'){
		activeItemElements = $(self).parents('.product-details').find('.slider-variant').find('.active');
	}
	else{
		activeItemElements = $(self).parents('.product-details').find('.slider-variant').find('.active');
	}
	var quantityToUpdate = $(self).parents('.selectric-product-details__btn-quantity--add').find('.selectric p.label').text();

	if(quantityToUpdate === undefined || quantityToUpdate === null || quantityToUpdate === ""){
		//RWD issue : AE-6538
		quantityToUpdate = $(self).val();
		if(quantityToUpdate === undefined || quantityToUpdate === null || quantityToUpdate === ""){
			quantityToUpdate = 1;
		}
	}
	
	

	var params = {};
	$(activeItemElements).each(function(i, obj) {
		var catentryId = $(obj).data('item');
		params["catEntryId_1"] = catentryId;
		params["orderItemId_" + (parseInt(i)+1)] = productDisplay.product.itemDetails[catentryId].orderItemId;
		
		params["quantity_" + (parseInt(i)+1)]        = quantityToUpdate;
	});

	argList = [self,quantityToUpdate];
	callUpdateCartService(params,handleUpdateCartResponse,argList);       
	DMAnalytics.events( DMAnalytics.Constants.Action.PDPQtySelection, "inputData:"+JSON.stringify(params) , document.title, 0,null );
}

/**
 * Method to handle response while update cart in PDP page 
 * @param serviceResponse : Response from update cart service
 * @param self
 * @param quantityToUpdate : new quantity of item in cart
 **/
function handleUpdateCartResponse(serviceResponse,self,quantityToUpdate) {
	var $productVariantParent = $('.product-details .slider-variant .slides');

	var orderId = serviceResponse.orderId;
	var x_orderTotal = serviceResponse.x_orderTotal;
	var x_itemsInCart = serviceResponse.x_itemsInCart;

	if(parseInt(quantityToUpdate) > 0){ //update quantity
		for (var i=0; i<serviceResponse.orderItem.length; i++) {

			var orderItemId = serviceResponse.orderItem[i].orderItemId;
			var catentryId = serviceResponse.orderItem[i].productId;

			var oldItemQuantityInCart = productDisplay.product.itemDetails[catentryId].qtyInCart;


			var quantity = serviceResponse["quantity_"+(i+1)];

			productDisplay.product.itemDetails[catentryId].qtyInCart = quantity; //change this
			productDisplay.product.totalQtyInCart = parseInt(productDisplay.product.totalQtyInCart) - parseInt(oldItemQuantityInCart) + parseInt(quantity);

			var changeInQnty = parseInt(quantity) - parseInt(oldItemQuantityInCart);
			productDisplay.product.totalPriceInCart = parseFloat(productDisplay.product.totalPriceInCart)+(parseFloat(productDisplay.product.itemDetails[catentryId].price.offerPrice)*changeInQnty);
			productDisplay.product.totalSavingsInCart = parseFloat(productDisplay.product.totalSavingsInCart)+(parseFloat(productDisplay.product.itemDetails[catentryId].price.savings)*changeInQnty);
			if(typeof productDisplay.product.totalPriceInCart == "number"){
				productDisplay.product.totalPriceInCart = productDisplay.product.totalPriceInCart.toFixed(2);
			}if(typeof productDisplay.product.totalSavingsInCart == "number"){
				productDisplay.product.totalSavingsInCart =productDisplay.product.totalSavingsInCart.toFixed(2);
			}	

			if(productDisplay.product.pageType === 'apparel'){
				productDisplay.product.selectedColor= productDisplay.product.itemDetails[catentryId].definingAttributes.Colour;
				productDisplay.product.selectedSize= productDisplay.product.itemDetails[catentryId].definingAttributes.Size;
				productDisplay.product.currentItemInCart = catentryId;
			}
		}

		var quantity = $(self).val();
		$('option', self).eq(0).attr('selected', true);
		//AE-16294- Now cart flip should hgappen after dmartcalculate
		//$(self).parents('.product-details__btn-quantity').css('display', 'none');
		$('.slider-variant .active .product-unit-count').text(quantity);
		$('.product-details .slider-variant .active a').children('.product-unit').css('display', 'inline');
		//$('.product-details__btn-add-more').fadeIn().css('display', 'block');
		$productVariantParent.find('.active').addClass('addedToCart').removeClass('active');
		$('.product-details .slider-variant .slides .active').find('.product-details__change-qty').css('display', 'block');
		$('.quick-product-cart .quick-product-cart--count').text(productDisplay.product.totalQtyInCart);
		$('.quick-product-delivery, .quick-product-not-cod, .quick-product-available').hide();

		$('.product-details__btn-quantity select').prop('selectedIndex', quantity).selectric('refresh');
		$('.product-details__btn-quantity select').selectric('refresh');
		productDisplay.product.currentItem = catentryId;
		//Commenting off the code to update price and Savings after orderCalculate
		//updateTotalPriceAndSavingsPDP(productDisplay.product.totalSavingsInCart,productDisplay.product.totalPriceInCart);
		updateLocalStorage(quantity,catentryId,orderId,orderItemId,x_orderTotal,x_itemsInCart);
	}else{
		//delete item
		$('.slider-variant .active .product-unit').hide();
		$('.product-details .slider-variant .slides .active').find('.product-details__change-qty').css('display', 'none');
		var catentryIdDeleted = $productVariantParent.find('li.active').data('item');
		productDisplay.product.totalQtyInCart = parseInt(productDisplay.product.totalQtyInCart) - parseInt(productDisplay.product.itemDetails[catentryIdDeleted].qtyInCart);
		var deletedItemQnty =  parseInt(productDisplay.product.itemDetails[catentryIdDeleted].qtyInCart);
		productDisplay.product.itemDetails[catentryIdDeleted].qtyInCart = 0;
		productDisplay.product.totalPriceInCart = parseFloat(productDisplay.product.totalPriceInCart)-(parseFloat(productDisplay.product.itemDetails[catentryIdDeleted].price.offerPrice)*deletedItemQnty);
		productDisplay.product.totalSavingsInCart = parseFloat(productDisplay.product.totalSavingsInCart)-(parseFloat(productDisplay.product.itemDetails[catentryIdDeleted].price.savings)*deletedItemQnty);
		if(typeof productDisplay.product.totalPriceInCart == "number"){
			productDisplay.product.totalPriceInCart = productDisplay.product.totalPriceInCart.toFixed(2);
		}if(typeof productDisplay.product.totalSavingsInCart == "number"){
			productDisplay.product.totalSavingsInCart =productDisplay.product.totalSavingsInCart.toFixed(2);
		}


		$('.quick-product-cart .quick-product-cart--count').text(productDisplay.product.totalQtyInCart);
		$('.slider-variant .active .product-unit-count').text(0);

		$productVariantParent.find('li[data-item="'+catentryIdDeleted+'"]').removeClass('active enableChangeQty addedToCart');
		/*if($productVariantParent.find('li[data-item="'+catentryIdDeleted+'"]').hasClass('active')){
			$productVariantParent.find('li[data-item="'+catentryIdDeleted+'"]').removeClass('active');
		}*/
		$productVariantParent.find('li[data-item="'+catentryIdDeleted+'"]').find('.product-details__change-qty').css('display', 'none');
		$('.product-details__btn-quantity').css('display', 'none');
		if(productDisplay.product.totalQtyInCart > 0){
			$('.product-details__btn-add-more').css('display', 'block');
			$('.product-details .slider-variant .slides .enableChangeQty').find('.product-details__change-qty').css('display', 'block');
		}else{
			$('.product-details__btn-addtocart').css('display', 'block');
			if(productDisplay.product.itemDetails[catentryIdDeleted].outofstock){
				$('.product-details__btn-addtocart, .product-details__btn-add-more').addClass('button--disabled');
			}else{
				$('.product-details__btn-addtocart, .product-details__btn-add-more').removeClass('button--disabled');
			}
		}

		$('.product-details__btn-quantity select').prop('selectedIndex', 1).selectric('refresh');
		$('.product-details__btn-quantity select').selectric('refresh');
		productDisplay.product.currentItem = catentryIdDeleted;
		if(productDisplay.product.totalQtyInCart === 0){
			updateVariantPriceInPDP(catentryIdDeleted);
			$('.pdp-price-total').hide();
			$('.quick-product-cart').hide();
			if($('.pdp-price-panel__price-mrp span').hasClass('no-strike-diagonal')){
				$('.pdp-price-panel__price-mrp span.no-strike-diagonal').html('<i class="icon-rupees"></i>'+productDisplay.product.itemDetails[catentryIdDeleted].price.sellingPrice);			            
		    }else if($('.pdp-price-panel__price-mrp span').hasClass('strike-diagonal')){
		    	$('.pdp-price-panel__price-mrp span.strike-diagonal').html('<i class="icon-rupees"></i>'+productDisplay.product.itemDetails[catentryIdDeleted].price.sellingPrice);
		    }
			//$('.pdp-price-panel .pdp-price-panel__price-mrp .strike-diagonal').html('<i class="icon-rupees"></i>' + productDisplay.product.itemDetails[catentryIdDeleted].price.sellingPrice);
	        $('.pdp-price-panel .pdp-price-panel__primary .pdp-price-panel__primary--price-dmart').html('<i class="icon-rupees"></i>' + productDisplay.product.itemDetails[catentryIdDeleted].price.offerPrice);
	        if(productDisplay.product.itemDetails[catentryIdDeleted].price.savings > 0){
	        	$('.product-listing__save .product-listing__save--price').html('<i class="icon-rupees"></i>' + productDisplay.product.itemDetails[catentryIdDeleted].price.savings);
		        $('.product-listing__save').show();
		        if($('.pdp-price-panel__price-mrp span').hasClass('no-strike-diagonal')){
		        	$('.pdp-price-panel__price-mrp span').removeClass('no-strike-diagonal');
	        		$('.pdp-price-panel__price-mrp span').addClass('strike-diagonal');
		        }
		        $('.pdp-price-panel__price-mrp').show();
	        }else if(productDisplay.product.itemDetails[catentryIdDeleted].price.savings == 0){
	        	 if($('.pdp-price-panel__price-mrp span').hasClass('strike-diagonal')){
			        	$('.pdp-price-panel__price-mrp span').removeClass('strike-diagonal');
		        		$('.pdp-price-panel__price-mrp span').addClass('no-strike-diagonal');
	        	 }
	        	$('.pdp-price-panel__price-mrp').show();
	        }else{
	        	 if($('.pdp-price-panel__price-mrp span').hasClass('strike-diagonal')){
		        	$('.pdp-price-panel__price-mrp span').removeClass('strike-diagonal');
	        		$('.pdp-price-panel__price-mrp span').addClass('no-strike-diagonal');
	        	 }
	        	 $('.product-listing__save').hide();
	        	 $('.pdp-price-panel__price-mrp').hide()
			}
			//$('.pdp-price-panel__price-mrp').show();
			$('.pdp-price-panel__primary').show();
			$('.pdp-price-total').css('display', 'none');
			
			var homeDelivery = '';
			var codFlag = '';
			var currentItemAttributes = productDisplay.product.itemDetails[catentryIdDeleted].attributes;
			$.each(currentItemAttributes, function(index, attrib) {
				if (attrib.name === DMartAttributes.Constants.Grocery.Descriptive.DeliveryFlag) {
					homeDelivery= attrib.values[0].value;
				} else if (attrib.name === DMartAttributes.Constants.Grocery.Descriptive.CODFlag) {
					codFlag= attrib.values[0].value;
				}
			});
			if(homeDelivery === '1'){
				$('.product-details .quick-product-delivery').html('Home Delivery Only <i class="icon-home"></i>');
				$('.product-details .quick-product-delivery').show();
			}else{
				$('.product-details .quick-product-delivery').html('');
			}
			if(codFlag === 'N'){
				$('.product-details .quick-product-not-cod').html('Not Available for COD <i class="icon-unavailable-cod"></i>');
				$('.product-details .quick-product-not-cod').show();
			}else{
				$('.product-details .quick-product-not-cod').html('');
			}
			

		}else{
			//Commenting off the code to update price and Savings after orderCalculate
			//updateTotalPriceAndSavingsPDP(productDisplay.product.totalSavingsInCart,productDisplay.product.totalPriceInCart);
		}
		updateLocalStorage(0,catentryIdDeleted,orderId,0,x_orderTotal,x_itemsInCart);

	}
	//updateHeaderMiniCartSection(x_orderTotal,x_itemsInCart);
}

/**
 * Method to flip the state of product card in PLP 
 * @param $parents : parent div for the product card
 **/
function flipCardCustom($parents) {
	if(!$parents.hasClass('view-list-active')) {
		$parents.find('.product-listing-item__primary').css('display', 'none');
		$parents.find('.product-listing-item__secondary').css('display', 'block');
        $('.added-product-wrap').scrollTop(0).perfectScrollbar('update');

		var addedProductLength = $parents.find('.added-product-wrap .added-product-wrap__list').length;

		if(addedProductLength<=1) {
			$parents.find('.cart-icon').removeClass('small');
		}
		else {
			$parents.find('.cart-icon').addClass('small');
		}

		$parents.find('.product-listing--original-price, .product-listing--discounted-price, .product-listing__quantity-secondary, .product-listing__cta-container').hide();
		$parents.delay(2000).addClass('product-added-to-cart');
		$parents.find('.added-product-wrap ul li').find('.custom-dropdown').removeClass('primary-border');
	}
	else {
        $parents.find('.product-listing--original-price, .product-listing__size-guide, .product-listing--discounted-price, .product-listing__quantity-secondary, .product-listing__cta-container, .product-listing__total-items').hide();
		$parents.delay(2000).addClass('product-added-to-cart');
        $parents.find('.slides a.selected').addClass('addedToCart').removeClass('selected');
		$parents.find('.product-listing-item__secondary, .product-listing__total-items--list-view').css('display', 'block');
		
		$parents.find('.product-listing__quantity-other--select').selectric();
		
	}
	if($parents.hasClass('view-list-active')) {
		$('.product-added-to-cart').find('.product-listing-item__secondary').css('display', 'block');
	}
}

/**
 * Method to update the mini cart section in header
 * @param totalPrice : parent div for the product card
 * @param quantity : parent div for the product card
 **/
function updateHeaderMiniCartSection(totalPrice,quantity){	
	var orderTot = (totalPrice % 1) > 0.5 ? Math.ceil(totalPrice) : Math.floor(totalPrice);
	orderTotal = orderTot.toLocaleString('en-IN');
	$('.cart-wrap').find('.badge').html(parseInt(quantity));
	$('.cart-wrap').find('.cart-price-label').html(
			'<i class="header-icon-rupee icon-rupees"></i>' + orderTotal
			+ '<i class="header-icon-caret-down icon-caret-down"></i>');
	CartHelper.deleteCartCookie();
	var orderDetails = parseInt(totalPrice) +'_'+parseInt(quantity);
	document.cookie = "DM_OrderId="+orderDetails+";expires=-1;path=/";
	
}
/**
 * Method to update the price section in PDP when variant is chosen
 * @param self 
 **/
function updateVariantPriceInPDP(self){
	var mrp=productDisplay.product.itemDetails[self].price.sellingPrice;
	var dmartPrice=productDisplay.product.itemDetails[self].price.offerPrice;
	var savings=productDisplay.product.itemDetails[self].price.savings;
	var homeDelivery = '';
	var unitprice = '';
	var bulkIndicator = '';
	var freeItem = '';
	var codFlag = '';
	var currentItemAttributes = productDisplay.product.itemDetails[self].attributes;
	$.each(currentItemAttributes, function(index, attrib) {
		if (attrib.name === DMartAttributes.Constants.Grocery.Descriptive.DeliveryFlag) {
			homeDelivery= attrib.values[0].value;
		}
		else if (attrib.name === DMartAttributes.Constants.Grocery.Descriptive.UnitPrice) {
			unitprice= attrib.values[0].value;
		}
		else if (attrib.name ===  DMartAttributes.Constants.Grocery.Descriptive.BulkyFlag) {
			bulkIndicator= attrib.values[0].value;
		}
		else if (attrib.name === DMartAttributes.Constants.Grocery.Descriptive.FreebieProdDescription) {
			freeItem= attrib.values[0].value;
		}
	});
	if(homeDelivery === '1'){
		$('.product-details .quick-product-delivery').html('Home Delivery Only <i class="icon-home"></i>');
		$('.product-details .quick-product-delivery').show();
	}else{
		$('.product-details .quick-product-delivery').html('');
	}
	if(codFlag === 'N'){
		$('.product-details .quick-product-not-cod').html('Not Available for COD <i class="icon-unavailable-cod"></i>');
		$('.product-details .quick-product-not-cod').show();
	}else{
		$('.product-details .quick-product-not-cod').html('');
	}
	if(unitprice != ''){
		$('.product-details .product-details__additional-note').html(unitprice);
	}else{
		$('.product-details .product-details__additional-note').html('');
	}
	if(bulkIndicator === 'Y'){
		$('.product-gallery__panel .product-details__bulk').html('<span class="product-details__bulk--btn button-tertiary">Bulk</span>');
	}else{
		$('.product-gallery__panel .product-details__bulk').html('');
	}
	if(freeItem != ''){
		$('.product-details .product-details__offer').html('<span class="product-details__offer--btn button-secondary">Free</span> <span>'+freeItem+'</span>');
		$('.brand-wrapper').css('min-height','80px');

	}else{
		$('.product-details .product-details__offer').html('');
		$('.brand-wrapper').css('min-height','60px');
	}
	if($('.pdp-price-panel__price-mrp span').hasClass('no-strike-diagonal')){
		$('.pdp-price-panel__price-mrp span.no-strike-diagonal').html('<i class="icon-rupees"></i>'+mrp);			            
    }else if($('.pdp-price-panel__price-mrp span').hasClass('strike-diagonal')){
    	$('.pdp-price-panel__price-mrp span.strike-diagonal').html('<i class="icon-rupees"></i>'+mrp);
    }
	//$('.pdp-price-panel__price-mrp').children('.strike-diagonal').html('<i class="icon-rupees"></i>'+mrp);
	$('.pdp-price-panel__primary--price-dmart').html('<i class="icon-rupees"></i>'+dmartPrice);
	$('.product-listing__save--price').html('<i class="icon-rupees"></i>'+savings);
	$('.product-details--title').html(productDisplay.product.itemDetails[self].name);
}

/**
 * Method to update the total price and savings in PDP
 * after addition/updation/removal of cart items
 * @param self 
 **/
function updateTotalPriceAndSavingsPDP(totalSavingsInCart, totalPriceInCart){
	if(totalSavingsInCart > 0){
		$('.pdp-price-total__savings').html('Your Savings <span><i class="icon-rupees"></i>'+totalSavingsInCart+'</span>');
		$('.pdp-price-total__savings').css('display','block');
	}else{
		$('.pdp-price-total__savings').css('display','none');
	}
	$('.pdp-price-total__price').html('Total Price <i class="icon-rupees"></i>'+totalPriceInCart);
}

/**
 * Method to update the object in local storage
 * after addition/ updation of cart items
 * @param qtyInCart : quantity of item in cart
 * @param thisItemId : item id of item in cart
 * @param orderId : order id
 * @param orderItemId : order item id
 * @param x_orderTotal : order total
 * @param x_itemsInCart : total quantity in cart
 **/
function updateLocalStorage(qtyInCart,thisItemId,orderId,orderItemId,x_orderTotal,x_itemsInCart){
	var cartJSON = DMStorage.getValue('OrderId');
	var itemTimeStamp = null;

	if(cartJSON === null) { // ATC scenario
		var cartJSONNew = {};
		cartJSONNew.orderId = orderId;
		cartJSONNew.total = Math.round(x_orderTotal);
		var orderItems = [];
		var orderItem = {};
		orderItem.orderItemId = orderItemId;
		orderItem.quantity = qtyInCart;
		orderItem.catentryId = thisItemId.toString();
		// orderItem.lastUpdateDate = val.lastUpdateDate;
		orderItems.push(orderItem);	
		cartJSONNew.orderItems = orderItems;
		cartJSONNew.totalQTY = x_itemsInCart;
		DMStorage.set('OrderId', cartJSONNew);
	}else{
		var isItemAlreadyInCart = false;
		var requiresLocalStorageUpdate = false;
		$.each(cartJSON.orderItems,function(indx,orderItem) {
			if(orderItem != undefined){
				var thisCatentryId = orderItem.catentryId;
				if(thisItemId.toString() === thisCatentryId.toString()){
					isItemAlreadyInCart = true;
					if(qtyInCart != orderItem.quantity) { //different in quantity, update the local storage
						orderItem.quantity = qtyInCart;
						requiresLocalStorageUpdate = true;
					}
					if(qtyInCart === 0){ //Item is deleted
						cartJSON.orderItems.splice(indx, 1);
					}
				}
			}else{
				if(qtyInCart === 0){ //Item is deleted
					cartJSON.orderItems.splice(indx, 1);
				}
			}
		});
		if(!isItemAlreadyInCart){ // create a new entry in local storage order json
			var orderItem = {};
			orderItem.orderItemId = orderItemId;
			orderItem.quantity = qtyInCart;
			orderItem.catentryId = thisItemId.toString();
			// orderItem.lastUpdateDate = val.lastUpdateDate;
			cartJSON.orderItems.push(orderItem);
			requiresLocalStorageUpdate = true;
		}
		if(requiresLocalStorageUpdate){
			if(x_itemsInCart > 0){
				cartJSON.total = Math.round(x_orderTotal);
				cartJSON.totalQTY = x_itemsInCart;
				DMStorage.set('OrderId', cartJSON);
			}else{ //all items in cart are deleted
				DMStorage.remove('OrderId');
			}
		}
	}	
}

/**
 * Method to format the product card once rendered
 * Rerender necessary jquery plugins
 **/
function formatProductCard(){
	//$('.add-product-other-quantity select').selectric('refresh');
	$('.product-listing-item__secondary .add-product-other-quantity select').selectric('destroy');

	$('.added-product-wrap').perfectScrollbar( {
		suppressScrollX: true,
		swipePropagation: true
	});
}

/**
 * Add to cart from offers section in Cart page
 **/
function addItemsToCartOffers(self){
	var params = {};
	var thisItemId = $(self).data('item');
	var thisQuantity =1;
	params.catEntryId_1 = thisItemId;
	params.quantity_1 = thisQuantity;
	var argList = [self, thisItemId, thisQuantity];
	
	var futureQtyInCart = thisQuantity + cartDisplay.itemModalDetails[thisItemId].qtyInCart;
	if(cartDisplay.itemModalDetails[thisItemId].freeGiftQty) {
		futureQtyInCart += cartDisplay.itemModalDetails[thisItemId].freeGiftQty;
	}
	if(futureQtyInCart > cartDisplay.itemModalDetails[thisItemId].maxOrderQty){
		errorMessageHelper.showGenericError(MessageHelper.messages['_ERR_MAX_QTY_ERROR']);
	}else{
		errorMessageHelper.hideError();
		callAddToCart(params,handleAddToCartResponseOffers,argList);
	}  
}

/**
 * Handles add to cart response from offers section in Cart page
 **/
function handleAddToCartResponseOffers (serviceResponse,self,thisItemId,thisQuantity){
	$(self).css('display', 'none');
	$(self).parents('.promotion-panel').find('.promotion-panel--change-qty-cta').fadeIn();
    $(self).parents('.promotion-panel__btn').find('.promotion-panel__btn-viewcart').fadeIn();
    var orderId = serviceResponse.orderId;
	var orderItemId = serviceResponse.orderItem[0].orderItemId;
	var x_orderTotal = serviceResponse.x_orderTotal;
	var x_itemsInCart = serviceResponse.x_itemsInCart;
	
	//Update the orderitem id and order id in the cart json
	cartDisplay.itemModalDetails[thisItemId].orderItemId = orderItemId;

	//Update the quantity of items in cart at item level and product level, number of variants
	cartDisplay.itemModalDetails[thisItemId].qtyInCart = parseInt(cartDisplay.itemModalDetails[thisItemId].qtyInCart) + parseInt(thisQuantity);

	//Update total price and savings for the product in cart
	cartDisplay.itemModalDetails[thisItemId].totalPriceInCart = parseFloat(cartDisplay.itemModalDetails[thisItemId].totalPriceInCart) + (parseFloat(cartDisplay.itemModalDetails[thisItemId].offerPrice)*parseInt(thisQuantity));
	cartDisplay.itemModalDetails[thisItemId].totalSavingsInCart = parseFloat(cartDisplay.itemModalDetails[thisItemId].totalSavingsInCart) + (parseFloat(cartDisplay.itemModalDetails[thisItemId].savings)*parseInt(thisQuantity));
	if(typeof cartDisplay.itemModalDetails[thisItemId].totalPriceInCart == "number"){
		cartDisplay.itemModalDetails[thisItemId].totalPriceInCart = cartDisplay.itemModalDetails[thisItemId].totalPriceInCart.toFixed(2);
	}if(typeof cartDisplay.itemModalDetails[thisItemId].totalSavingsInCart == "number"){
		cartDisplay.itemModalDetails[thisItemId].totalSavingsInCart =cartDisplay.itemModalDetails[thisItemId].totalSavingsInCart.toFixed(2);
	}
	if(!$('#'+cartDisplay.itemModalDetails[thisItemId].target).hasClass('promotionsModal')){
    	$('#'+cartDisplay.itemModalDetails[thisItemId].target).addClass('promotionsModal');
    }
	
    //updateHeaderMiniCartSection(x_orderTotal,x_itemsInCart);
	updateLocalStorage(cartDisplay.itemModalDetails[thisItemId].qtyInCart,thisItemId,orderId,orderItemId,x_orderTotal,x_itemsInCart);
}

/**
 * Update quantity in cart from offers section in Cart page
 **/
function updateItemsInCartOffers(self){
	var callBack = '',argsList= [];
	var thisItemId = $(self).parents('.modal-dialog').data('item');
	var oldQuantityOfUpdatedItem = cartDisplay.itemModalDetails[thisItemId].qtyInCart;
	var newQuantityOfUpdatedItem = $(self).val();
	callBack = handleUpdateItemQuantityResponseOffers;
	argsList = [self,thisItemId,oldQuantityOfUpdatedItem,newQuantityOfUpdatedItem];
	
	var params = {};
	params.orderItemId_1 = cartDisplay.itemModalDetails[thisItemId].orderItemId; //delete the previous product
	params.quantity_1 = newQuantityOfUpdatedItem;

	var futureQtyInCart = parseInt(newQuantityOfUpdatedItem);
	if(cartDisplay.itemModalDetails[thisItemId].freeGiftQty) {
		futureQtyInCart += cartDisplay.itemModalDetails[thisItemId].freeGiftQty;
	}
	if(futureQtyInCart > cartDisplay.itemModalDetails[thisItemId].maxOrderQty){
		errorMessageHelper.showGenericError(MessageHelper.messages['_ERR_MAX_QTY_ERROR']);
	}else{
		errorMessageHelper.hideError();
		callUpdateCartService(params,callBack,argsList);
	} 
}

/**
 * Handles update cart response from offers section in Cart page
 **/
function handleUpdateItemQuantityResponseOffers (serviceResponse,self,thisItemId,oldQuantityOfUpdatedItem,newQuantityOfUpdatedItem){
	cartDisplay.itemModalDetails[thisItemId].qtyInCart = newQuantityOfUpdatedItem;
	var changeInQnty = parseInt(newQuantityOfUpdatedItem) - parseInt(oldQuantityOfUpdatedItem);

	//Update total price and savings for the product in cart
	cartDisplay.itemModalDetails[thisItemId].totalPriceInCart = parseFloat(cartDisplay.itemModalDetails[thisItemId].totalPriceInCart) + (parseFloat(cartDisplay.itemModalDetails[thisItemId].offerPrice)*parseInt(changeInQnty));
	cartDisplay.itemModalDetails[thisItemId].totalSavingsInCart = parseFloat(cartDisplay.itemModalDetails[thisItemId].totalSavingsInCart) + (parseFloat(cartDisplay.itemModalDetails[thisItemId].savings)*parseInt(changeInQnty));
	if(typeof cartDisplay.itemModalDetails[thisItemId].totalPriceInCart == "number"){
		cartDisplay.itemModalDetails[thisItemId].totalPriceInCart = cartDisplay.itemModalDetails[thisItemId].totalPriceInCart.toFixed(2);
	}if(typeof cartDisplay.itemModalDetails[thisItemId].totalSavingsInCart == "number"){
		cartDisplay.itemModalDetails[thisItemId].totalSavingsInCart =cartDisplay.itemModalDetails[thisItemId].totalSavingsInCart.toFixed(2);
	}
	
	/*$(self).css('display', 'none');
    $(self).parents('.promotion-panel__btn').find('.promotion-panel__btn-viewcart').fadeIn();*/
	
	$(self).parents('.promotion-panel__btn-quantity').css('display', 'none');
    $(self).parents('.promotion-panel').find('.promotion-panel--change-qty-cta').fadeIn();
    $(self).parents('.promotion-panel__btn').find('.promotion-panel__btn-viewcart').fadeIn();
    
    if(!$('#'+cartDisplay.itemModalDetails[thisItemId].target).hasClass('promotionsModal')){
    	$('#'+cartDisplay.itemModalDetails[thisItemId].target).addClass('promotionsModal');
    }
    
    var x_orderTotal = serviceResponse.x_orderTotal;
	var x_itemsInCart = serviceResponse.x_itemsInCart;
	var orderId = serviceResponse.orderId;
	var orderItemId = serviceResponse.orderItem[0].orderItemId;
	//updateHeaderMiniCartSection(x_orderTotal,x_itemsInCart);
	updateLocalStorage(newQuantityOfUpdatedItem,thisItemId,orderId,orderItemId,x_orderTotal,x_itemsInCart);
}
