/**
 * This js file contains the cart functions.
 */

(function(dmUIConfig) {
  $(document).ready(function () {
	  
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
	  $('.product-details__btn-addtocart').on('dmart.pdp.addtocart', function() {
		  var self = this;		  
		  addItemsToCart(self);		  	      
	  });
	  
	  //Update quantity from PDP
	  $('.product-details__btn-quantity--add').on('dmart.pdp.updatecart', function() {
		  var self = this;		  
		  updateItemsInCart(self);		  	      
	  });
	  
	  //Add item to cart on click of Add More button from PDP
	  $('.product-details__btn-add-more').on('dmart.pdp.addmore', function() {
	      $(this).parents('.product-details').find('.selectric-product-details__btn-quantity--add .selectric p.label').html(1);
		  var self = this;		  
		  addItemsToCart(self);		  	      
	  });
	  
  });
}(DM_UI_CONFIG));

function handleAddMore(self) {
	var primaryContainer = $(self).parents('.product-listing-item__primary');
	var productId = $(self).parents('.product-listing-item').data('productid');
	var thisItemId = $(self).val();
	
	if(productListing.products[productId].itemDetails[thisItemId].orderItemId === undefined 
			|| productListing.products[productId].itemDetails[thisItemId].orderItemId === null 
			|| productListing.products[productId].itemDetails[thisItemId].orderItemId === ""
			|| productListing.products[productId].itemDetails[thisItemId].orderItemId === 0){
		//Item not in cart, call ATC
		addItemsToCartPLP(self);
	}else{
		//Item in cart, call update cart
		updateItemQuantityInCartPLP(self);
	}
	
}

function updateItemVariantInCartPLP(self) {
	var primaryContainer = $(self).parents('.js-switch-view').find('.product-listing-item__primary');
	var productId = $(self).parents('.js-switch-view').find('.product-listing-item').data('productid');
	var prevItemId = $(self).parents('.added-product-wrap__list').data('itemid');
	var newItemId = $(self).val();
	var quantityOfPrevItem = $(self).parents('.added-product-wrap__list').find('.added-product__quantity-size').find('select').val();
	var existingNewItemQntyInCart = productListing.products[productId].itemDetails[newItemId].qtyInCart;
	if(existingNewItemQntyInCart != null && existingNewItemQntyInCart != undefined 
			&& existingNewItemQntyInCart != 0 && existingNewItemQntyInCart != ""){
		//Check if the new item already exists in cart
		var quantityNew = parseInt(quantityOfPrevItem) + parseInt(existingNewItemQntyInCart);
		var newItemOrdItmId = productListing.products[productId].itemDetails[newItemId].orderItemId;
	}else{
		var quantityNew = parseInt(quantityOfPrevItem);
	}
	
	wc.service.declare({
		id: "PLPAjaxUpdateOrderItem",
		actionId: "AjaxRESTOrderItemUpdate",
		type : "PUT",
		url: getAbsoluteURL() + "AjaxRESTOrderItemUpdate",
		formId: ""

	 /**
	 * display a success message
	 * @param (object) serviceResponse The service response object, which is the
	 * JSON object returned by the service invocation
	 */

		,successHandler: function(serviceResponse) {
			
			handleUpdateItemVariantResponsePLP(serviceResponse,self,productId,newItemId,prevItemId,quantityNew,quantityOfPrevItem);
			
		}
	 /**
	 * display an error message
	 * @param (object) serviceResponse The service response object, which is the
	 * JSON object returned by the service invocation
	 */
		,failureHandler: function(serviceResponse) {
			alert("update variant error");
		}

	});	
	
	 var params = [];
	 	params.storeId                 = productListing.storeId;
	 	params.catalogId             =  productListing.catalogID;
	    params.langId                   = -1;
	    params.orderId                = ".";
	    params.orderItemId_1 = productListing.products[productId].itemDetails[prevItemId].orderItemId; //delete the previous product
	    params.quantity_1 = 0;
	    
	    if(newItemOrdItmId != null && newItemOrdItmId != undefined 
				&& newItemOrdItmId != 0 && newItemOrdItmId != ""){
		    params.orderItemId_2 = newItemOrdItmId; //update the existing orderItem, if any
		    params.quantity_2  = quantityNew;
	    }else{
		    params.catEntryId_2 = newItemId; //add new product if no existing orderitem for the new item
		    params.quantity_2 = quantityNew;
	    }
	    
		wc.service.invoke("PLPAjaxUpdateOrderItem", params);
}

function handleUpdateItemVariantResponsePLP(serviceResponse,self,productId,newItemId,prevItemId,quantityNew,quantityOfPrevItem) {
	
	
	//Update the JSON objects
	productListing.products[productId].itemDetails[prevItemId].orderItemId = 0;
	productListing.products[productId].itemDetails[prevItemId].qtyInCart = 0;
	
	var orderId = serviceResponse.orderId;
	var orderItemId = serviceResponse.orderItem[0].orderItemId;
	var x_orderTotal = serviceResponse.x_orderTotal;
	var x_itemsInCart = serviceResponse.x_itemsInCart;
	
	//Update the orderitem id and order id in the cart json
	productListing.products[productId].itemDetails[newItemId].orderItemId = orderItemId;
	productListing.products[productId].itemDetails[newItemId].qtyInCart = quantityNew;
	
	
	//Update total price and savings for the product in cart
	productListing.products[productId].totalPriceInCart = parseInt(productListing.products[productId].totalPriceInCart) + ((parseInt(productListing.products[productId].itemDetails[newItemId].price.offerPrice) - parseInt(productListing.products[productId].itemDetails[prevItemId].price.offerPrice))*parseInt(quantityOfPrevItem));
	productListing.products[productId].totalSavingsInCart = parseInt(productListing.products[productId].totalSavingsInCart) + ((parseInt(productListing.products[productId].itemDetails[newItemId].price.savings) - parseInt(productListing.products[productId].itemDetails[prevItemId].price.savings))*parseInt(quantityOfPrevItem));
	
	var isList = $('.plp-view-option__list').hasClass('active');
	
	nunjucks.configure(getAbsoluteURL()+'DMartStoreFrontAssetStore/templates/',{ autoescape: true, web : {useCache:true} });
			
  /* Nunjucks start */
// Single element object for product data and single element arrat for product id
    var  JSONdata = {};
    JSONdata.product = {};
    JSONdata.product[productId] = productListing.products[productId];
    JSONdata.productIds = [productId];
    JSONdata.config=productListing.config;
    
    var htmlcode = nunjucks.render('product-listing-grocery-singleitem.nunjucks', {data:JSONdata});
   
    var divToChange = $(self).parents('.js-switch-view');
    $(divToChange).html(htmlcode);

    self = $(divToChange).find('.plp-grocery .product-listing__cta-button');
    var $parents = $(self).parents('.product-listing-item');
        
	//List View
	if(isList){
		//alert('list');
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
	      
	      $('select').selectric();
		  $('.added-product-wrap select').selectric('destroy');
	      
	      
	}else{
		//alert('grid');
	    flipCardCustom($parents);      
	    
	    $parents.find('.slider-variant').resize();  
	}
		
}

function updateItemQuantityInCartPLP(self) {
	
	var primaryContainer = $(self).parents('.js-switch-view').find('.product-listing-item__primary');
	var productId = $(self).parents('.js-switch-view').find('.product-listing-item').data('productid');
	
	
	if($(self).hasClass('product-listing__quantity--select') || $(self).hasClass('product-listing__quantity-other--select')){ //Add More
		var thisItemId = $(self).val();
		var oldQuantityOfUpdatedItem = productListing.products[productId].itemDetails[thisItemId].qtyInCart;
		var newQuantityOfUpdatedItem = parseInt(oldQuantityOfUpdatedItem)+1;
	}else{ // Update quantity
		var thisItemId = $(self).parents('.added-product-wrap__list').data('itemid');
		var oldQuantityOfUpdatedItem = productListing.products[productId].itemDetails[thisItemId].qtyInCart;
		var newQuantityOfUpdatedItem = $(self).parents('.added-product-wrap__list').find('.added-product__quantity-size').find('select').val();
	}	
	  
    productListing.products[productId].currentItem = thisItemId;        
	
	wc.service.declare({
		id: "PLPAjaxUpdateOrderItem",
		actionId: "AjaxRESTOrderItemUpdate",
		type : "PUT",
		url: getAbsoluteURL() + "AjaxRESTOrderItemUpdate",
		formId: ""

	 /**
	 * display a success message
	 * @param (object) serviceResponse The service response object, which is the
	 * JSON object returned by the service invocation
	 */

		,successHandler: function(serviceResponse) {
			if($(self).hasClass('product-listing__quantity--select') || $(self).hasClass('product-listing__quantity-other--select')){ //Add More
				handleAddToCartResponsePLP(serviceResponse,self,productId,thisItemId,1);
			}else{ // Update quantity
				handleUpdateItemQuantityResponsePLP(serviceResponse,self,productId,thisItemId,oldQuantityOfUpdatedItem,newQuantityOfUpdatedItem);
			}
			
			
		}
	 /**
	 * display an error message
	 * @param (object) serviceResponse The service response object, which is the
	 * JSON object returned by the service invocation
	 */
		,failureHandler: function(serviceResponse) {
			alert("update quantity error");
		}

	});	
	
	 var params = [];
	 	params.storeId                 = productListing.storeId;
	 	params.catalogId             =  productListing.catalogID;
	    params.langId                   = -1;
	    params.orderId                = ".";
	    params.orderItemId = productListing.products[productId].itemDetails[thisItemId].orderItemId;
	    params.quantity                = newQuantityOfUpdatedItem;
	    
		wc.service.invoke("PLPAjaxUpdateOrderItem", params);
	
}


function handleUpdateItemQuantityResponsePLP(serviceResponse,self,productId,thisItemId,oldQuantityOfUpdatedItem,newQuantityOfUpdatedItem) {
	
	//Update the JSON objects

	productListing.products[productId].itemDetails[thisItemId].qtyInCart = newQuantityOfUpdatedItem;
	productListing.products[productId].totalQtyInCart 
		= parseInt(productListing.products[productId].totalQtyInCart) - parseInt(oldQuantityOfUpdatedItem) + parseInt(newQuantityOfUpdatedItem);
	
	var changeInQnty = parseInt(newQuantityOfUpdatedItem) - parseInt(oldQuantityOfUpdatedItem);
	
	//Update total price and savings for the product in cart
	productListing.products[productId].totalPriceInCart = parseInt(productListing.products[productId].totalPriceInCart) + (parseInt(productListing.products[productId].itemDetails[thisItemId].price.offerPrice)*parseInt(changeInQnty));
	productListing.products[productId].totalSavingsInCart = parseInt(productListing.products[productId].totalSavingsInCart) + (parseInt(productListing.products[productId].itemDetails[thisItemId].price.savings)*parseInt(changeInQnty));
	
	
  	var $parents = $(self).parents('.js-switch-view').find('.product-listing-item');
    $parents.find('.badge').html(productListing.products[productId].totalQtyInCart);
    $parents.find('.product-listing__total-items').html('Total '+productListing.products[productId].totalQtyInCart+' Packs in Cart');
    $parents.find('.product-listing__total-items--list-view').html('Total '+productListing.products[productId].totalQtyInCart+' Packs in Cart');
    $parents.find('.product-price__saving').html('Your Savings <span><i class="icon-rupees"></i>'+productListing.products[productId].totalSavingsInCart+'</span>');
    $parents.find('.product-price__total').html('Total Price <i class="icon-rupees"></i>'+productListing.products[productId].totalPriceInCart);
    
	var x_orderTotal = serviceResponse.x_orderTotal;
	var x_itemsInCart = serviceResponse.x_itemsInCart;
    updateHeaderMiniCartSection(x_orderTotal,x_itemsInCart);
	
}

function removeItemsFromCartPLP(self) {
   
	var primaryContainer = $(self).parents('.js-switch-view').find('.product-listing-item__primary');
	var productId = $(self).parents('.js-switch-view').find('.product-listing-item').data('productid');
	
    var thisProduct = productListing.products[productId];
    var thisItemId = $(self).parents('.added-product-wrap__list').data('itemid');
	  
    productListing.products[productId].currentItem = thisItemId;
	
	wc.service.declare({
		id: "PLPAjaxRemoveOrderItem",
		actionId: "AjaxRESTOrderItemUpdate",
		type : "PUT",
		url: getAbsoluteURL() + "AjaxRESTOrderItemUpdate",
		formId: ""

	 /**
	 * display a success message
	 * @param (object) serviceResponse The service response object, which is the
	 * JSON object returned by the service invocation
	 */

		,successHandler: function(serviceResponse) {    			
			handleRemoveItemsResponsePLP(serviceResponse,self,productId,thisItemId);
		}
	 /**
	 * display an error message
	 * @param (object) serviceResponse The service response object, which is the
	 * JSON object returned by the service invocation
	 */
		,failureHandler: function(serviceResponse) {
			alert("delete error");
		}

	});
	
	 var params = [];
	 	params.storeId                 = productListing.storeId;
	 	params.catalogId             =  productListing.catalogID;
	    params.langId                   = -1;
	    params.orderId                = ".";
	    params.orderItemId = productListing.products[productId].itemDetails[thisItemId].orderItemId;
	    params.quantity                = 0;
		wc.service.invoke("PLPAjaxRemoveOrderItem", params);
}


function handleRemoveItemsResponsePLP(serviceResponse,self,productId,thisItemId) {
	//Update the JSON objects
	productListing.products[productId].itemDetails[thisItemId].orderItemId = 0;
	var quantityOfDeletedItem = productListing.products[productId].itemDetails[thisItemId].qtyInCart;
	productListing.products[productId].itemDetails[thisItemId].qtyInCart = 0;
	productListing.products[productId].totalQtyInCart = parseInt(productListing.products[productId].totalQtyInCart) - parseInt(quantityOfDeletedItem);
	
	//Update total price and savings for the product in cart
	productListing.products[productId].totalPriceInCart = parseInt(productListing.products[productId].totalPriceInCart) - (parseInt(productListing.products[productId].itemDetails[thisItemId].price.offerPrice)*parseInt(quantityOfDeletedItem));
	productListing.products[productId].totalSavingsInCart = parseInt(productListing.products[productId].totalSavingsInCart) - (parseInt(productListing.products[productId].itemDetails[thisItemId].price.savings)*parseInt(quantityOfDeletedItem));
	
	
  	var $parents = $(self).parents('.js-switch-view').find('.product-listing-item');
  	
    $parents.find('.badge').html(productListing.products[productId].totalQtyInCart);
    $parents.find('.product-listing__total-items').html('Total '+productListing.products[productId].totalQtyInCart+' Packs in Cart');
    $parents.find('.product-listing__total-items--list-view').html('Total '+productListing.products[productId].totalQtyInCart+' Packs in Cart');
    $parents.find('.product-price__saving').html('Your Savings <span><i class="icon-rupees"></i>'+productListing.products[productId].totalSavingsInCart+'</span>');
    $parents.find('.product-price__total').html('Total Price <i class="icon-rupees"></i>'+productListing.products[productId].totalPriceInCart);
    
    
    var addedProductLength = $(self).parents('.added-product-wrap').find('.added-product-wrap__list').length;
    $(self).parents('.js-switch-view').find('.added-product-wrap__list[data-itemid="'+thisItemId+'"]').remove();
    $parents.find('.badge').html(productListing.products[productId].totalQtyInCart);
	$parents.find('.added-product-details').hide();
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
	    	$parents.find('.product-listing__cta-container').fadeIn();
	    }
		$parents.find('.product-listing-item__secondary').css('display', 'none');
		$parents.removeClass('product-added-to-cart');
		$parents.find('.product-listing-item__primary, .product-listing-details, .product-listing--original-price, .product-listing--discounted-price, .product-listing__quantity-secondary').fadeIn();
	} else if(addedProductLength === 2) {
	    $parents.find('.product-listing-item__secondary').find('.cart-icon').removeClass('small');
	} else {
	    $parents.find('.added-product-wrap').removeAttr('style');
	    $parents.find('.product-listing-item__secondary').find('.cart-icon').addClass('small');
	}   
    
	$parents.find('.product-listing--image').addClass('small'); 
    $('select').selectric();
	$('.added-product-wrap select').selectric('destroy');
	
	var x_orderTotal = serviceResponse.x_orderTotal;
	var x_itemsInCart = serviceResponse.x_itemsInCart;
	updateHeaderMiniCartSection(x_orderTotal,x_itemsInCart);
}

function addItemsToCartPLP(self) {
	
	var primaryContainer = $(self).parents('.product-listing-item__primary');
	var productId = $(self).parents('.product-listing-item').data('productid');
	
	if($(self).hasClass('product-listing__cta-button') && productListing.products[productId] != undefined){
		var thisItemId = productListing.products[productId].currentItem;
	}else{
		var	thisItemId = $(self).val();
	}
	
	var thisQuantity = $(self).parents('.product-listing-item').find('.selectric-product-listing__quantity--select-quantity').find('.label').text();
	if(thisQuantity === undefined || thisQuantity === null || thisQuantity === ""){
		thisQuantity = 1;
	}
	  
    productListing.products[productId].currentItem = thisItemId;
	
    wc.service.declare({
		id: "PLPAjaxAddOrderItem",
		actionId: "AjaxRESTOrderItemAdd",
		type : "POST",
		url: getAbsoluteURL() + "AjaxRESTOrderItemAdd",
		formId: ""

	 /**
	 * display a success message
	 * @param (object) serviceResponse The service response object, which is the
	 * JSON object returned by the service invocation
	 */

		,successHandler: function(serviceResponse) {		
			handleAddToCartResponsePLP(serviceResponse,self,productId,thisItemId,thisQuantity);  			
		}
	 /**
	 * display an error message
	 * @param (object) serviceResponse The service response object, which is the
	 * JSON object returned by the service invocation
	 */
		,failureHandler: function(serviceResponse) {
			alert("atc error");
		}

	});    	
	
	 var params = [];
	    params.storeId                 = productListing.storeId;
	    params.catalogId             =  productListing.catalogID;
	    params.langId                   = -1;
	    params.orderId                = ".";
	    params.inventoryValidation = "true";
	    params.calculateOrder = "0";
	    params.catEntryId_1 = thisItemId;
	    params.quantity_1 = thisQuantity;
	    
		wc.service.invoke("PLPAjaxAddOrderItem", params);
}

function handleAddToCartResponsePLP(serviceResponse,self,productId,thisItemId,thisQuantity) {
	var orderId = serviceResponse.orderId;
	var orderItemId = serviceResponse.orderItem[0].orderItemId;
	var x_orderTotal = serviceResponse.x_orderTotal;
	var x_itemsInCart = serviceResponse.x_itemsInCart;
	
	var isList = $('.plp-view-option__list').hasClass('active');
	//Update the orderitem id and order id in the cart json
	productListing.products[productId].itemDetails[thisItemId].orderItemId = orderItemId;
	
	//Update the quantity of items in cart at item level and product level, number of variants
	productListing.products[productId].itemDetails[thisItemId].qtyInCart = parseInt(productListing.products[productId].itemDetails[thisItemId].qtyInCart) + parseInt(thisQuantity);
	productListing.products[productId].totalQtyInCart = parseInt(productListing.products[productId].totalQtyInCart) + parseInt(thisQuantity);
	
	
	//Update total price and savings for the product in cart
	productListing.products[productId].totalPriceInCart = parseInt(productListing.products[productId].totalPriceInCart) + (parseInt(productListing.products[productId].itemDetails[thisItemId].price.offerPrice)*parseInt(thisQuantity));
	productListing.products[productId].totalSavingsInCart = parseInt(productListing.products[productId].totalSavingsInCart) + (parseInt(productListing.products[productId].itemDetails[thisItemId].price.savings)*parseInt(thisQuantity));
	
	nunjucks.configure(getAbsoluteURL()+'DMartStoreFrontAssetStore/templates/',{ autoescape: true, web : {useCache:true} });
			
  /* Nunjucks start */
// Single element object for product data and single element arrat for product id
    var  JSONdata = {};
    JSONdata.product = {};
    JSONdata.product[productId] = productListing.products[productId];
    JSONdata.productIds = [productId];
    JSONdata.config=productListing.config;
    
    var htmlcode = nunjucks.render('product-listing-grocery-singleitem.nunjucks', {data:JSONdata});
   
    //console.debug(htmlcode);
    var divToChange = $(self).parents('.js-switch-view');
    $(divToChange).html(htmlcode);

    self = $(divToChange).find('.plp-grocery .product-listing__cta-button');
    var $parents = $(self).parents('.product-listing-item');   


	//List View
	if(isList){
		//alert('list');
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
	      
	      $('select').selectric();
		  $('.added-product-wrap select').selectric('destroy');
	      
	      
	}else{
		//alert('grid');
	    flipCardCustom($parents);      
	    
	    $parents.find('.slider-variant').resize();  
	}

	updateHeaderMiniCartSection(x_orderTotal,x_itemsInCart);

}


function addItemsToCart(self) {
	
	var productId = productDisplay.pageid.productId;
	var activeItemElements = $(self).parents('.product-details').find('.flex-viewport').find('.active');
	
	wc.service.declare({
		id: "PDPAjaxAddOrderItem",
		actionId: "AjaxRESTOrderItemAdd",
		type : "POST",
		url: getAbsoluteURL() + "AjaxRESTOrderItemAdd",
		formId: ""
	
	 /**
	 * display a success message
	 * @param (object) serviceResponse The service response object, which is the
	 * JSON object returned by the service invocation
	 */
	
		,successHandler: function(serviceResponse) {			
			
			handleAddToCartResponse(serviceResponse,self,productId);
		}
	 /**
	 * display an error message
	 * @param (object) serviceResponse The service response object, which is the
	 * JSON object returned by the service invocation
	 */
		,failureHandler: function(serviceResponse) {
			alert("atc error");					
			// TODO : Error handling
		}
	
	});    	
	
	var params = [];
    params.storeId                 = productListing.storeId;
    params.catalogId             =  productListing.catalogID;
    params.langId                   = -1;
    params.orderId                = ".";
    params.inventoryValidation = "true";
    params.calculateOrder = "0";
    
	$(activeItemElements).each(function(i, obj) {
		params["catEntryId_" + (parseInt(i)+1)] = $(obj).data('item');
		params["quantity_" + (parseInt(i)+1)]	= 1;
    });
    
	wc.service.invoke("PDPAjaxAddOrderItem", params);
	
}

function handleAddToCartResponse(serviceResponse,self,productId) {
	var orderId = serviceResponse.orderId;
	for (var i=0; i<serviceResponse.orderItem.length; i++) {
		var orderItemId = serviceResponse.orderItem[i].orderItemId;
		var catentryId = serviceResponse.orderItem[i].productId;
		productDisplay.product.itemDetails[catentryId].orderItemId = orderItemId;
		productDisplay.product.totalQtyInCart = productDisplay.product.totalQtyInCart + 1;
		productDisplay.product.itemDetails[catentryId].qtyInCart = 1;
	}
	//var orderItemId = serviceResponse.orderItem[0].orderItemId;
	var x_orderTotal = serviceResponse.x_orderTotal;
	var x_itemsInCart = serviceResponse.x_itemsInCart;
	
	var $productVariantParent = $('.product-details .slider-variant .slides');
	//var selectedProductLength = $productVariantParent.find('.active').length;
	
    $(self).parents('.product-details').find('.selectric-product-details__btn-quantity--add .selectric p.label').html(1);
    $(self).parents('.product-details').find('.selectric-product-details__btn-quantity--add .selectric-scroll li.selected').removeClass('selected');
    $(self).parents('.product-details').find('.selectric-product-details__btn-quantity--add .selectric-scroll li[data-index=1]').addClass('selected');
    
	//Add to cart button
	if($(self).hasClass('product-details__btn-addtocart')){
		if(!$('.product-details .slider-variant .slides li').hasClass('active')) {
			$(self).css('display', 'none');
			$(self).siblings('.product-details__btn--addtocart-popup').hide();
		} else {
		    $(self).css('display', 'none');
		    $('.product-listing__save, .pdp-price-panel__primary, .pdp-price-panel__price-mrp').css('display', 'none');
		    $('.product-details .slider-variant .active a').children('.product-unit').css('display', 'inline');
		    $('.product-details__btn-quantity, .pdp-price-total, .quick-product-cart').fadeIn();
		    $(self).siblings('.product-details__btn--addtocart-popup').css('display', 'none');
		    $productVariantParent.find('.active').addClass('enableChangeQty');
	        $('.slider-variant .active .product-unit-count').text(1);
		    $('.quick-product-cart .quick-product-cart--count').text(productDisplay.product.totalQtyInCart);
		    $('.quick-product-delivery, .quick-product-not-cod, .quick-product-available').hide();
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
	        $('.pdp-price-total').fadeIn().css('display', 'block');
	        $(self).siblings('.product-details__btn--addtocart-popup').css('display', 'none');
	        $('.slider-variant .active a').children('.product-unit').css('display', 'inline');
	        $('.slider-variant .active .product-unit-count').text(1);
	        $('.product-details__btn-quantity').css('display', 'block');
	        $productVariantParent.find('.active').addClass('enableChangeQty');
	        var selectedProductLength = $productVariantParent.find('.enableChangeQty').length;
	        $('.quick-product-cart .quick-product-cart--count').text(productDisplay.product.totalQtyInCart);
	    }
	}
	
	updateHeaderMiniCartSection(x_orderTotal,x_itemsInCart);

}


function updateItemsInCart(self) {
	
	var productId = productDisplay.pageid.productId;
	var activeItemElements = $(self).parents('.product-details').find('.flex-viewport').find('.active');
	var quantityToUpdate = $(self).parents('.selectric-product-details__btn-quantity--add').find('.selectric p.label').text();
	
	wc.service.declare({
		id: "PDPAjaxUpdateOrderItem",
		actionId: "AjaxRESTOrderItemUpdate",
		type : "PUT",
		url: getAbsoluteURL() + "AjaxRESTOrderItemUpdate",
		formId: ""
	
	 /**
	 * display a success message
	 * @param (object) serviceResponse The service response object, which is the
	 * JSON object returned by the service invocation
	 */
	
		,successHandler: function(serviceResponse) {			
			
			handleUpdateCartResponse(serviceResponse,self,quantityToUpdate);
		}
	 /**
	 * display an error message
	 * @param (object) serviceResponse The service response object, which is the
	 * JSON object returned by the service invocation
	 */
		,failureHandler: function(serviceResponse,self) {
			alert("update cart error");					
			// TODO : Error handling
		}
	
	});    	
	
	 var params = [];
	 	params.storeId = productListing.storeId;
	 	params.catalogId =  productListing.catalogID;
	    params.langId = -1;
	    params.orderId = ".";
	    
		$(activeItemElements).each(function(i, obj) {
			var catentryId = $(obj).data('item');
			params["orderItemId_" + (parseInt(i)+1)] = productDisplay.product.itemDetails[catentryId].orderItemId;
			params["quantity_" + (parseInt(i)+1)]	= quantityToUpdate;
	    });
	    
		wc.service.invoke("PDPAjaxUpdateOrderItem", params);
	
}

function handleUpdateCartResponse(serviceResponse,self,quantityToUpdate) {
	
	var $productVariantParent = $('.product-details .slider-variant .slides');
	//var selectedProductLength = $(self).parents('.selectric-product-details__btn-quantity--add').find('.selectric p.label').text();
	
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
		}
		//var orderItemId = serviceResponse.orderItem[0].orderItemId;

		

		var quantity = $(self).val();
	    $('option', self).eq(0).attr('selected', true);
	    $(self).parents('.product-details__btn-quantity').css('display', 'none');
	    $('.slider-variant .active .product-unit-count').text(quantity);
	    $('.product-details .slider-variant .active a').children('.product-unit').css('display', 'inline');
	    $('.product-details__btn-add-more').fadeIn().css('display', 'block');
	    $productVariantParent.find('.active').addClass('addedToCart').removeClass('active');
	    $('.product-details .slider-variant .slides .active').find('.product-details__change-qty').css('display', 'block');
	    $('.quick-product-cart .quick-product-cart--count').text(productDisplay.product.totalQtyInCart);
	    $('.quick-product-delivery, .quick-product-not-cod, .quick-product-available').hide();
	    
	    $(self).parents('.product-details').find('.selectric-product-details__btn-quantity--add .selectric p.label').html(quantity);
	    $(self).parents('.product-details').find('.selectric-product-details__btn-quantity--add .selectric-scroll li.selected').removeClass('selected');
	   // var dataIndex = parseInt(quantity)-1;
	    $(self).parents('.product-details').find('.selectric-product-details__btn-quantity--add .selectric-scroll li[data-index="'+quantity+'"]').addClass('selected');
	}else{
		//delete item
		$('.slider-variant .active .product-unit').hide();
		$('.product-details .slider-variant .slides .active').find('.product-details__change-qty').css('display', 'none');
	    var catentryIdDeleted = $productVariantParent.find('li.active').data('item');
	    productDisplay.product.totalQtyInCart = parseInt(productDisplay.product.totalQtyInCart) - parseInt(productDisplay.product.itemDetails[catentryIdDeleted].qtyInCart);
	    productDisplay.product.itemDetails[catentryIdDeleted].qtyInCart = 0;
	    
        $('.quick-product-cart .quick-product-cart--count').text(productDisplay.product.totalQtyInCart);
        $('.slider-variant .active .product-unit-count').text(0);
	    
		$productVariantParent.find('li[data-item="'+catentryIdDeleted+'"]').removeClass('active enableChangeQty addedToCart')
        $('.product-details__btn-quantity').css('display', 'none');
        $('.product-details__btn-addtocart').css('display', 'block');
        

        
	    $(self).parents('.product-details').find('.selectric-product-details__btn-quantity--add .selectric p.label').html(1);
	    $(self).parents('.product-details').find('.selectric-product-details__btn-quantity--add .selectric-scroll li.selected').removeClass('selected');
	    $(self).parents('.product-details').find('.selectric-product-details__btn-quantity--add .selectric-scroll li[data-index=1]').addClass('selected');
	}
    updateHeaderMiniCartSection(x_orderTotal,x_itemsInCart);
}

function flipCardCustom($parents) {
    if(!$parents.hasClass('view-list-active')) {
      $parents.find('.product-listing-item__primary').css('display', 'none');
      $parents.find('.product-listing-item__secondary').fadeIn();

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
      $parents.find('.product-listing--original-price, .product-listing--discounted-price, .product-listing__quantity-secondary, .product-listing__cta-container, .product-listing__total-items').hide();
      $parents.delay(2000).addClass('product-added-to-cart');
      $parents.find('.product-listing-item__secondary, .product-listing__total-items--list-view').css('display', 'block');
    }
    if($parents.hasClass('view-list-active')) {
      $('.product-added-to-cart').find('.product-listing-item__secondary').css('display', 'block');
    }
  }

function updateHeaderMiniCartSection(TotalPrice,quantity){
	
	   $('.cart-wrap').find('.badge').html(parseInt(quantity));
	   $('.cart-wrap').find('.cart-price-label').html(
	   '<i class="header-icon-rupee icon-rupees">	</i>' + parseInt(TotalPrice) 
	   + '<i class="header-icon-caret-down icon-caret-down"></i>');
	   CartHelper.deleteCartCookie();
	   
	}