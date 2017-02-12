/**
 * Handles mini cart display functions. 
 *  
 */
var MiniCartDisplay = {
	/**
	 * This flag is used to check if the cart has to be rendered afresh.
	 * This is unset by default on page load and set on rendering the cart.
	 * 
	 */
	miniCartRendered : false,
	/**
	 * Update cart header
	 */
	updateHeader : function(totalQty,orderTotal) {
		$('.cart-wrap').find('.badge').html(totalQty);
		$('.main-menu__cart-mini .cart-icon').find('.badge').html(totalQty); // Fix for JIRA 7661
		var orderTot = (orderTotal % 1) > 0.5 ? Math.ceil(orderTotal) : Math.floor(orderTotal);
		orderTotal = orderTot.toLocaleString('en-IN');
		var orderTotalString= '<i class="header-icon-rupee icon-rupees"></i>'+orderTotal;
		$('.cart-price-label').html(orderTotalString+'<i class="header-icon-caret-down icon-caret-down"></i>');
		$('.main-menu__cart-mini a').html(orderTotalString);
	},
	/**
	 * Renders minicart using nunjucks and minicart json
	 */
	renderMiniCart : function() {		
		nunjucks.configure(WCParamJS.staticServerHost + 'templates/_modules/', {
			autoescape : true,
			web : {
				useCache : true
			}
		});

		var cartJSON = DMStorage.getValue('OrderId');
		if(!cartJSON){
			cartJSON = {
					total : 0,
					tax : 0,
					totalQTY :0,
					totalSavings :0,
					orderItems :[]
			};
		}
		$.each(cartJSON.orderItems,function(indx,orderItem) {
			orderItem.price = orderItem.price.toFixed(2);
		});
		cartJSON.storeId = WCParamJS.storeId;
		cartJSON.catalogId = WCParamJS.catalogId;
		cartJSON.langId = WCParamJS.langId;
		cartJSON.total = CartHelper.formatPricesForDisplay(cartJSON.total);
		cartJSON.totalSavings = CartHelper.formatPricesForDisplay(cartJSON.totalSavings);
		cartJSON.homePageURL =  WCParamJS.homepageURL;
		cartJSON.noImagePath=WCParamJS.staticServerHost+'images/DMart/NoImage_T.jpg';
		var htmlcode = nunjucks.render('header-minicart.nunjucks', {
			data : cartJSON
		});
		
		var top = $('.cart-details__scroll').length>0?$('.cart-details__scroll').scrollTop():0;
		$('.header-dropdown--minicart').html(htmlcode);
		
		$('.cart-details__scroll').scrollTop(top).perfectScrollbar('update');
		// set flag to true. Contents are up to date.
		this.miniCartRendered = true;

	},
	/**
	 * Callback after removing an item from minicart by clicking on 'X'.
	 */
	removeMiniCartItem : function(response, self, productId, itemId) {
		if (response) {
			$(self).parents('.cart-details__item-lists').fadeOut('slow');

			if ($(self).parents('.cart-details__item-list').find(
					'.cart-details__item-lists').length === 1) {
				$(self).parents('.cart-details__item-list').find(
						'.cart-no-items').delay(400).fadeIn(500);
			}

			var orderTotal = response.x_orderTotal;
			var itemsInCart = response.x_itemsInCart;
			var orderId = response.orderId;

			if (typeof productListing !== 'undefined') {
//				MiniCartDisplay.updatePLPByMiniCart('REMOVE',productId,itemId);
				var productCard = $('.product-listing-item[data-productid='+productId+']');
				if (productCard.hasClass('plp-apparel')) {
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
			}
			
			if (typeof productDisplay !== 'undefined') {
				MiniCartDisplay.updatePDPByMiniCart(itemId,0);
			}
			
			updateLocalStorage(0, itemId, orderId, 0, orderTotal,
					itemsInCart);
		}
	},
	/**
	 * Callback on updating mini cart item. 
	 */
	updateMiniCartItem : function(response,productId, itemId, newQty) {
		if (response) {
			var orderTotal = response.x_orderTotal;
			var itemsInCart = response.x_itemsInCart;
			var orderId = response.orderId;
			var orderItemId = response.orderItem[0].orderItemId;
			updateLocalStorage(newQty, itemId, orderId, orderItemId,
					orderTotal, itemsInCart);

			
			// For product listing page updates
			/*if (typeof productListing !== 'undefined') {
				MiniCartDisplay.updatePLPByMiniCart('UPDATE',productId);
			}*/
			
			if (typeof productDisplay !== 'undefined') {
//				MiniCartDisplay.updatePDPByMiniCart(itemId,newQty);
			}
		}
		
	},
	/**
	 * Update PDP when a minicart action occurs
	 */
	updatePDPByMiniCart : function(itemId,newQty) {
		var productDetails =  productDisplay.product;
		var itemDetails = productDetails.itemDetails[itemId];
		if(itemDetails) {
			var oldQty = itemDetails.qtyInCart;
			itemDetails.qtyInCart = newQty;
			var deltaQty = parseInt(newQty) - oldQty;
			productDetails.totalQtyInCart += deltaQty;
			productDetails.totalPriceInCart = parseInt(productDetails.totalPriceInCart)+(parseInt(itemDetails.price.offerPrice)*deltaQty);
			productDetails.totalSavingsInCart = parseInt(productDetails.totalSavingsInCart)+(parseInt(itemDetails.price.savings)*deltaQty);
			
			productDetails.itemDetails[itemId] = itemDetails;
			productDisplay.product = productDetails;
			
			var $sliderItem =  $('.product-details').find('.slides li[data-item='+itemId+']');
			if(newQty === 0) {
				$sliderItem.find('.product-unit').hide();
				$sliderItem.removeClass('active enableChangeQty addedToCart');
				$sliderItem.find('.product-details__change-qty').hide();
				$('.product-details__btn-quantity').hide();
				$('.product-details__btn-add-more').css('display', 'none');
				$('.product-details__btn-addtocart').show();
				//$('.product-details__btn-viewcart').css('display','none');
				$('.pdp-price-total').hide();
				$('.quick-product-cart').hide();
				$('.pdp-price-panel__price-mrp').show();
				$('.pdp-price-panel__primary').show();
				var mrp=productDisplay.product.itemDetails[itemId].price.sellingPrice;
				var dmartPrice=productDisplay.product.itemDetails[itemId].price.offerPrice;
				var savings=productDisplay.product.itemDetails[itemId].price.savings;
				var homeDelivery = '';
				var unitprice = '';
				var bulkIndicator = '';
				var freeItem = '';
				var codFlag = '';
				var currentItemAttributes = productDisplay.product.itemDetails[itemId].attributes;
				$.each(currentItemAttributes, function(index, attrib) {
					if (attrib.name === DMartAttributes.Constants.Grocery.Descriptive.DeliveryFlag) {
						homeDelivery= attrib.values[0].value;
					}
					else if (attrib.name === DMartAttributes.Constants.Grocery.Descriptive.UnitPrice) {
						unitprice= attrib.values[0].value;
					}
					else if (attrib.name === DMartAttributes.Constants.Grocery.Descriptive.BulkyFlag) {
						bulkIndicator= attrib.values[0].value;
					}
					else if (attrib.name === DMartAttributes.Constants.Grocery.Descriptive.FreebieProdDescription) {
						freeItem= attrib.values[0].value;
					}
					else if (attrib.name === DMartAttributes.Constants.Grocery.Descriptive.CODFlag) {
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
				
				$('.product-details .quick-product-delivery, .product-details .product-details__additional-note, .product-gallery__panel .product-details__bulk, .product-details .product-details__offer').show();
				$('.pdp-price-panel__price-mrp').children('.strike-diagonal').html('<i class="icon-rupees"></i>'+mrp);
				$('.pdp-price-panel__primary--price-dmart').html('<i class="icon-rupees"></i>'+dmartPrice);
				$('.product-listing__save--price').html('<i class="icon-rupees"></i>'+savings);
				// Fix for AE-8595
				//$('.product-details--title').html(productDisplay.product.itemDetails[itemId].name); 
				
			} else {
				$sliderItem.find('.product-unit-count').text(newQty);
				$('.product-details__btn-addtocart,.product-details__btn-add-more').css('display', 'none');
				//$('.product-details__btn-viewcart').css('display','block');
				$('.product-details__btn-quantity').css('display', 'block');
				$('.product-details__btn-quantity').val(newQty);
				$('.product-details__btn-quantity select').prop('selectedIndex', newQty);
				$('.product-details__btn-quantity select').selectric('refresh');
			}
			//$('.product-details').find('.slides li').removeClass('active');
			//$('.product-details').find('.slides li[data-item='+itemId+']').addClass('active');
			$('.quick-product-cart .quick-product-cart--count').text(productDisplay.product.totalQtyInCart);
			updateTotalPriceAndSavingsPDP(productDisplay.product.totalSavingsInCart,productDisplay.product.totalPriceInCart);
		}
	},
	/**
	 * Update PDP when a minicart action occurs
	 */
	updatePLPByMiniCart : function(flag,productId,itemId) {
		// Remove
		var cartJSON = DMStorage.getValue('OrderId');
		var productDetails = productListing.products[productId];
		if(productDetails) {
			productListing.updateProductUsingCart(productDetails,cartJSON);
			if('REMOVE' === flag) {
				// Remove
				productDetails.itemDetails[itemId].orderItemId = 0;
				var quantityOfDeletedItem = productDetails.itemDetails[itemId].qtyInCart;
				productDetails.itemDetails[itemId].qtyInCart = 0;
				productDetails.totalQtyInCart = parseInt(productDetails.totalQtyInCart) - parseInt(quantityOfDeletedItem);
				productListing.productCardForRemove(productId,itemId);
			} else {
				// Update
				var updateParams = {
						totalQtyInCart : productDetails.totalQtyInCart,
						totalSavingsInCart : productDetails.totalSavingsInCart,
						totalPriceInCart : productDetails.totalPriceInCart
				                    };
				productListing.productCardForAddOrUpdate(productId,updateParams);
			}
		}
		
	}
};