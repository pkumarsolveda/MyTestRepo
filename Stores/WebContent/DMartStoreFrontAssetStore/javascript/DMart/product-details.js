'use strict';
(function(dmUIConfig) {
	$(document).ready(function () {
		var $productVariant = $('.product-details .slider-variant .slides li a');
		var $productVariantParent = $('.product-details .slider-variant .slides');
		var $totalVariant = $('.product-details .slider-variant .slides li');

		// product details variant selection
		$(document).on('click', '.product-details .slider-variant .slides li a', function () {
			if($productVariantParent.length <= 0){
				$productVariantParent = $('.product-details .slider-variant .slides');
			}
			var thisItemId = $(this).parent().data('item');
			var noImagePathThumb= WCParamJS.staticServerHost+'images/DMart/NoImage_T.jpg';
        	var noImagePathMain= WCParamJS.staticServerHost+'images/DMart/NoImage_M.jpg';
			//if(!$(this).parent().hasClass('addedToCart')){
				$productVariantParent.css('marginLeft', 0);
				$(this).parents('ul').find('li').removeClass('active');
				var $parents = $(this).parents('.product-details');
				//$('.product-details .slider-variant .slides .active').removeClass('active');
				if($(this).hasClass('disabled')){
					$('#productDetails .product-details__btn-addtocart, .product-details__btn-add-more').addClass('button--disabled');
					$('#productDetails .product-details__addtolist a').addClass('disabled');
				}
				else{
					$('#productDetails .product-details__btn-addtocart, .product-details__btn-add-more').removeClass('button--disabled');
					$('#productDetails .product-details__addtolist a').removeClass('disabled');
				}
				$(this).parent().toggleClass('active');
				$productVariantParent.find('.enableChangeQty').addClass('addedToCart');
				

				if($parents.hasClass('product-details--apparel')) {
					$(this).trigger('dmart.pdp.variant', [this]);   
				}else{					
		        	var $parentThumbs= $('.product-gallery__thumbnails-wrapper .slides');
		        	var $parentImages= $('.product-gallery__viewport .slides');
		        	
		        	if (typeof thisItemId != "undefined" && thisItemId != null && 
		        			typeof productDisplay.product.itemDetails[thisItemId].imageObjs != "undefined" && productDisplay.product.itemDetails[thisItemId].imageObjs != null && productDisplay.product.itemDetails[thisItemId].imageObjs.length > 0){
		        		$parentThumbs.html("");
			        	$parentImages.html("");
		        		 $.each(productDisplay.product.itemDetails[thisItemId].imageObjs,function (index,imageObj){
		 	        			$($parentThumbs).append('<li><a href="javascript:;" title="" rel="'+index+'" id="js-thumb-'+index+'"><img class="img-responsive" src="'+imageObj+'" alt="'+productDisplay.product.itemDetails[thisItemId].title+'" title="'+productDisplay.product.itemDetails[thisItemId].title+'" onerror=this.src="'+noImagePathThumb+'";></a></li>');
		 	        			$($parentImages).append('<li id="js-product-img-'+index+'" ><div class="easyzoom easyzoom--overlay"><a href="'+imageObj.replace('_T.jpg','_Z.jpg')+'" title=""><img class="img-responsive" src="'+imageObj.replace('_T.jpg','_M.jpg')+'" alt="'+productDisplay.product.itemDetails[thisItemId].title+'" title="'+productDisplay.product.itemDetails[thisItemId].title+'"  onerror=this.src="'+noImagePathMain+'";></a></div></li>');
		 		        });
		        	}
		        	$('.product-gallery__thumbnails .slides li:first-child a').addClass('current').addClass('active');
		        	$('.product-gallery__thumbnails-prev a').bind('click',function(e) {productDisplay.prevThumb();});
		        	$('.product-gallery__thumbnails-next a').bind('click',function(e) {productDisplay.nextThumb();});
	        		$('.product-gallery__thumbnails .slides li a').bind('click',function(e) {productDisplay.changeProductImage(e);});
	        		$('.easyzoom').easyZoom();		        
				}

				if($parents.hasClass('product-details--grocery') || $parents.hasClass('product-details--general_merchandise')) {
					var mrp=productDisplay.product.itemDetails[thisItemId].price.sellingPrice;
					var dmartPrice=productDisplay.product.itemDetails[thisItemId].price.offerPrice;
					var savings=productDisplay.product.itemDetails[thisItemId].price.savings;
					if($('.pdp-price-panel__price-mrp span').hasClass('no-strike-diagonal')){
						$('.pdp-price-panel__price-mrp span.no-strike-diagonal').html('<i class="icon-rupees"></i>'+mrp);			            
			        }else if($('.pdp-price-panel__price-mrp span').hasClass('strike-diagonal')){
			        	$('.pdp-price-panel__price-mrp span.strike-diagonal').html('<i class="icon-rupees"></i>'+mrp);
			        }
					//$('.pdp-price-panel__price-mrp').children('.strike-diagonal').html('<i class="icon-rupees"></i>'+mrp);
					$('.pdp-price-panel__primary--price-dmart').html('<i class="icon-rupees"></i>'+dmartPrice);
					$('.product-listing__save--price').html('<i class="icon-rupees"></i>'+savings);
					$('.product-details--title #item_title').html(productDisplay.product.itemDetails[thisItemId].name);
					var vegIndicatorHtml;
					if(productDisplay.product.itemDetails[thisItemId].vegNonvegFlag == 3){
						$('.food-type-pdp').html('<span class="egg-food"><i class="icon-egg icon-circle"></i></span>');
					}else if (productDisplay.product.itemDetails[thisItemId].vegNonvegFlag == 1){
						$('.food-type-pdp').html('<span class="veg-food"><i class="icon-veg icon-circle"></i></span>');
					}else if (productDisplay.product.itemDetails[thisItemId].vegNonvegFlag == 2){
						$('.food-type-pdp').html('<span class="non-veg-food"><i class="icon-non-veg icon-circle"></i></span>');
					}
					$('.product-details--code').html('Product Code: '+productDisplay.product.itemDetails[thisItemId].partNumber);
				}
				if(!$(this).parent().hasClass('enableChangeQty') && $productVariantParent.find('.enableChangeQty').length > 0) {
					$('.product-details .slider-variant .slides .enableChangeQty').removeClass('active');
					$productVariantParent.find('.enableChangeQty').addClass('addedToCart');
					$('.product-details .slider-variant .slides').find('.enableChangeQty .product-details__change-qty').css('display', 'block');
					$('.pdp-price-panel__price-mrp, .pdp-price-panel__primary, .product-details__btn-add-more').fadeIn().css('display', 'block');
					$('.pdp-price-total').css('display', 'none');
					if(productDisplay.product.itemDetails[thisItemId].price.savings > 0){
						$('.product-listing__save--price').html('<i class="icon-rupees"></i>'+productDisplay.product.itemDetails[thisItemId].price.savings);
						if(productDisplay.product.itemDetails[thisItemId].qtyInCart == 0){
							$('.product-listing__save').show(); 		
						}										
						if($('.pdp-price-panel__price-mrp span').hasClass('no-strike-diagonal')){
			        		$('.pdp-price-panel__price-mrp span').removeClass('no-strike-diagonal');
			        		$('.pdp-price-panel__price-mrp span').addClass('strike-diagonal');
			        	}
						if(productDisplay.product.itemDetails[thisItemId].qtyInCart == 0){
							$('.pdp-price-panel__price-mrp').css('display', 'block');
						}
					}else if(productDisplay.product.itemDetails[thisItemId].price.savings == 0){
						$('.product-listing__save--price').html('<i class="icon-rupees"></i>'+productDisplay.product.itemDetails[thisItemId].price.savings);
						if(productDisplay.product.itemDetails[thisItemId].qtyInCart == 0){
							$('.product-listing__save').show();
						}
						if($('.pdp-price-panel__price-mrp span').hasClass('strike-diagonal')){
			        		$('.pdp-price-panel__price-mrp span').removeClass('strike-diagonal');
			        		$('.pdp-price-panel__price-mrp span').addClass('no-strike-diagonal');
			        	}
						if(productDisplay.product.itemDetails[thisItemId].qtyInCart == 0){
							$('.pdp-price-panel__price-mrp').css('display', 'block');
						}
					}else{
			        	$('.product-listing__save').hide();		
			        	if($('.pdp-price-panel__price-mrp span').hasClass('no-strike-diagonal')){
			        		$('.pdp-price-panel__price-mrp span').removeClass('no-strike-diagonal');
			        		$('.pdp-price-panel__price-mrp span').addClass('strike-diagonal');
			        	}
			        	$('.pdp-price-panel__price-mrp').css('display', 'none');
			        }
					$('.pdp-price-total').hide();
					$('.product-details__btn-addtocart, .product-details__btn-quantity').css('display', 'none');
					//$('.product-details__btn-viewcart').css('display','none');
					$('.product-details__btn-add-more').css('display', 'block');
				}
				else {
					//$('.product-details__btn-addtocart').fadeIn();
					$('.product-details__btn--addtocart-popup, .product-details__btn-quantity, .product-details__btn-add-more').css('display', 'none');
				}
				
				var selectDropdown = "";
				for(var i=0;i<productDisplay.product.itemDetails[thisItemId].maxOrderQty;i++){
					selectDropdown += '<option value='+i+'>'+i+'</option>';							
				}
				$('.product-details__btn-quantity--add').html(selectDropdown);
				$('.product-details__btn-quantity--add').attr('data-maxLimit', productDisplay.product.itemDetails[thisItemId].maxOrderQty);
				$('.product-details__btn-quantity--add').selectric('refresh');
				if($(this).parent().hasClass('addedToCart')) {
					$('.product-details .slider-variant .slides .active').removeClass('active');
					$('.product-details .slider-variant .slides').find('.addedToCart[data-item="'+thisItemId+'"]').addClass('active');
					
					$('.product-details__btn-quantity').css('display', 'block');
					//$('.product-details__btn-addtocart').css('display', 'none');
					$('.product-details__btn-addtocart, .product-details__btn-add-more').css('display', 'none');
					var itemQuantityInCart = productDisplay.product.itemDetails[thisItemId].qtyInCart;
					//$(this).parents('.product-details').find('.selectric-product-details__btn-quantity--add .selectric p.label').html(itemQuantityInCart);
					$('.product-details__btn-quantity select').prop('selectedIndex', itemQuantityInCart).selectric('refresh');
					$('.product-details__btn-quantity select').selectric('refresh');
					$(document).trigger('dmart.pdp.quantity.perfectscroll');
					//price fix
					if(productDisplay.product.totalSavingsInCart > 0){
						$('.pdp-price-total__savings').html('Your Savings <span><i class="icon-rupees"></i>'+ productDisplay.product.totalSavingsInCart+'</span>');
						$('.pdp-price-total__savings').css('display','block');
						$('.product-listing__save').hide();
					}else{
	        			$('.pdp-price-total__savings').css('display','none');
					}
					$('.pdp-price-total__price').html('Total Price <i class="icon-rupees"></i>'+productDisplay.product.totalPriceInCart);
					$('.pdp-price-panel__price-mrp, .pdp-price-panel__primary').css('display', 'none');
					$('.pdp-price-total').css('display', 'block');
					$('.product-listing__save').hide();
					//price fix
				}else{
					//price fix
					$('.product-details__btn-quantity select').selectric('refresh');
					$('.product-details__btn-quantity--add').html(selectDropdown);
					$('.product-details__btn-quantity--add').attr('data-maxLimit', productDisplay.product.itemDetails[thisItemId].maxOrderQty);
					$('.product-details__btn-quantity--add').selectric('refresh');
					$('.pdp-price-panel__primary').css('display', 'block');
					$('.pdp-price-total').css('display', 'none');
					if(productDisplay.product.itemDetails[thisItemId].price.savings > 0){
						$('.product-listing__save--price').html('<i class="icon-rupees"></i>'+productDisplay.product.itemDetails[thisItemId].price.savings);
						if(productDisplay.product.itemDetails[thisItemId].qtyInCart == 0){
							$('.product-listing__save').show();
						}						
						if($('.pdp-price-panel__price-mrp span').hasClass('no-strike-diagonal')){
			        		$('.pdp-price-panel__price-mrp span').removeClass('no-strike-diagonal');
			        		$('.pdp-price-panel__price-mrp span').addClass('strike-diagonal');
			        	}
						if(productDisplay.product.itemDetails[thisItemId].qtyInCart == 0){
							$('.pdp-price-panel__price-mrp').css('display', 'block');
						}						
					}else if(productDisplay.product.itemDetails[thisItemId].price.savings == 0){
						if($('.pdp-price-panel__price-mrp span').hasClass('strike-diagonal')){
			        		$('.pdp-price-panel__price-mrp span').removeClass('strike-diagonal');
			        		$('.pdp-price-panel__price-mrp span').addClass('no-strike-diagonal');
			        	}
						if(productDisplay.product.itemDetails[thisItemId].qtyInCart == 0){
							$('.pdp-price-panel__price-mrp').css('display', 'block');
						}
					}else{
						$('.product-listing__save').hide();
						if($('.pdp-price-panel__price-mrp span').hasClass('strike-diagonal')){
							$('.pdp-price-panel__price-mrp span').removeClass('strike-diagonal');
							$('.pdp-price-panel__price-mrp span').addClass('no-strike-diagonal');
			        	}
						$('.pdp-price-panel__price-mrp').css('display', 'none');
					}
					//price fix
				}

				$('.quick-product-cart .quick-product-cart--count').text(productDisplay.product.totalQtyInCart);
				if($('.product-details .slider-variant .slides').find('.active').length <= 0) {
					$('.product-details__btn--addtocart-popup').fadeIn();
					$('.product-details__btn-addtocart, .product-details__btn-add-more').css('display', 'none');
				}
				else {
					$('.product-details__btn--addtocart-popup').css('display', 'none');
					if($('.product-details__btn-quantity').css('display') == 'none'){
						if(!$(this).parent().hasClass('enableChangeQty') && $productVariantParent.find('.enableChangeQty').length > 0) {
							$('.product-details__btn-add-more').css('display', 'block');
							$('.product-details__btn-addtocart').css('display', 'none');
						}else{
							$('.product-details__btn-add-more').css('display', 'none');
							$('.product-details__btn-addtocart').css('display', 'block');
						}					
					}else{
						$('.product-details__btn-addtocart, .product-details__btn-add-more').css('display', 'none');
					}
				}
			//}
			var homeDelivery = '';
			var codAvailable = '';
			var unitprice = '';
			var bulkIndicator = '';
			var freeItem = '';
			var nutritionFacts='';
			var serviceCenter =  (productDisplay.product.pageType == "general_merchandise") ? productDisplay.getServiceCenter() : "";
			var currentItemAttributes = productDisplay.product.itemDetails[thisItemId].attributes;
			$.each(currentItemAttributes, function(index, attrib) {
				if (attrib.name === DMartAttributes.Constants.Grocery.Descriptive.DeliveryFlag) {
					homeDelivery= attrib.values[0].value;
				}
				else if (attrib.name === DMartAttributes.Constants.Grocery.Descriptive.CODFlag) {
					codAvailable= attrib.values[0].value;
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
				else if (attrib.name === DMartAttributes.Constants.Grocery.Descriptive.NutritionFacts && typeof attrib.values[0] != "undefined" && null != attrib.values[0]) {
					nutritionFacts= attrib.values[0].value.trim();										
				}
			});
			if(homeDelivery === '1'){
				$('.product-details .quick-product-delivery').html('Home Delivery Only <i class="icon-home"></i>');
				$('.product-details .quick-product-delivery').show();
			}else{
				$('.product-details .quick-product-delivery').html('');
			}
			if(codAvailable === 'N'){
				$('.product-details .quick-product-not-cod').html('Not Available for COD<i class="icon-unavailable-cod"></i>');
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
			if(productDisplay.product.itemDetails[thisItemId].price.sellingPrice > 0 && productDisplay.product.itemDetails[thisItemId].qtyInCart <= 0){
	        	if(productDisplay.product.itemDetails[thisItemId].price.savings > 0){
		        	$('.product-listing__save--price').html('<i class="icon-rupees"></i>'+productDisplay.product.itemDetails[thisItemId].price.savings);
		        	if(productDisplay.product.itemDetails[thisItemId].qtyInCart == 0){
		        		$('.product-listing__save').show();
						$('.pdp-price-panel__price-mrp').show();
		        	}
	        	}else if(productDisplay.product.itemDetails[thisItemId].price.savings == 0){
	        		if(productDisplay.product.itemDetails[thisItemId].qtyInCart == 0){
	        			$('.pdp-price-panel__price-mrp').show();
	        		}
	        	}else{
		        	$('.product-listing__save').hide();
		        	$('.pdp-price-panel__price-mrp').hide();
		        }
			}else{
	        	$('.pdp-price-panel__price-mrp').hide();
				$('.product-listing__save').hide();
	        }
	        if(productDisplay.product.itemDetails[thisItemId].price.offerPrice >0 && productDisplay.product.itemDetails[thisItemId].qtyInCart <= 0){
	        	if(productDisplay.product.itemDetails[thisItemId].qtyInCart == 0){
	        		$('.pdp-price-panel__primary').show();
	        	}	        	
	        	if(productDisplay.product.itemDetails[thisItemId].price.savings > 0){
	        		$('.product-listing__save--price').html('<i class="icon-rupees"></i>'+productDisplay.product.itemDetails[thisItemId].price.savings);
	        		if(productDisplay.product.itemDetails[thisItemId].qtyInCart == 0){
	        			$('.product-listing__save').show();
	        		}	        		
	        	}else{
		        	$('.product-listing__save').hide();
		        }
	        }else{
	        	$('.pdp-price-panel__primary').hide();
				$('.product-listing__save').hide();
	        }
	        if(productDisplay.product.itemDetails[thisItemId].qtyInCart > 0){
	        	$('.pdp-price-total').css('display','block');
	        	if(productDisplay.product.totalSavingsInCart > 0){
				$('.pdp-price-total__savings').css('display', 'block');
	        	}else{
	        		$('.pdp-price-total__savings').css('display', 'none');
	        	}				
				$('.pdp-price-total__price').css('display', 'block');
				$('.product-listing__save').hide();
	        }
	        if(productDisplay.product.itemDetails[thisItemId].priceExists){        	
	        	$('.product-details__btn-addtocart, .product-details__btn-add-more').removeClass('button--disabled');
	        }else{
	        	$('.product-details__btn-addtocart, .product-details__btn-add-more').addClass('button--disabled');
	        }
	        if(productDisplay.product.pageType == 'general_merchandise' && serviceCenter != ""){
	        	$('#PDP-ServiceCenter-Data').html(serviceCenter);
	        }else if (productDisplay.product.pageType == "grocery"){
	        	$('#PDP-Nutrition-Data').html(nutritionFacts);
	        }

			if($(this).hasClass('disabled')){
					$('#productDetails .product-details__btn-addtocart, .product-details__btn-add-more').addClass('button--disabled');
					$('#productDetails .product-details__addtolist a').addClass('disabled');
			}	
			
			productDisplay.displayProductInfo(thisItemId);
			DMAnalytics.events( DMAnalytics.Constants.Action.PDPVariantSelection, "itemId:"+thisItemId , document.title, 0,null );
		});

		// product details add to cart function
		$(document).on('click', '.product-details__btn-addtocart', function () {
			if(!$('.product-details__btn-addtocart').hasClass('button--disabled')){
			$(this).trigger('dmart.pdp.addtocart',[this]);
			}
		});

		// product details update quantity
		$(document).on('change', '.product-details__btn-quantity--add', function () {	
			$(this).trigger('dmart.pdp.updatecart',[this]);
		});

		// add more to variant
		$(document).on('click', '.product-details__btn-add-more', function () {		
			if(!$(this).hasClass('button--disabled')){
			$(this).trigger('dmart.pdp.addmore',[this]);
			}
		});

		// variant change qty
		$(document).on('click', '.enableChangeQty .product-details__change-qty', function () {
			$('.product-details .slider-variant .slides').find('li').removeClass('active');
			$(this).parent().addClass('active');
			$('.product-details__btn-quantity').fadeIn();
			$('.product-details__btn-add-more, .product-details__btn--addtocart-popup, .product-details__btn-addtocart').css('display', 'none');
	
			
			//Custom changes
			var thisItemId = $(this).parent().data('item');
			var selectDropdown = "";
			for(var i=0;i<productDisplay.product.itemDetails[thisItemId].maxOrderQty;i++){
				selectDropdown += '<option value='+i+'>'+i+'</option>';							
			}			
			$('.product-details__btn-quantity--add').html(selectDropdown);
			$('.product-details__btn-quantity--add').attr('data-maxLimit', productDisplay.product.itemDetails[thisItemId].maxOrderQty);
			$('.product-details__btn-quantity--add').selectric('refresh');
			var itemQuantityInCart = productDisplay.product.itemDetails[thisItemId].qtyInCart;
			//price fix
			if($(this).parent().hasClass('addedToCart')) {
				if(productDisplay.product.totalSavingsInCart > 0){
					$('.pdp-price-total__savings').html('Your Savings <span><i class="icon-rupees"></i>'+ productDisplay.product.totalSavingsInCart+'</span>');
					$('.pdp-price-total__savings').css('display','block');
					$('.product-listing__save').hide();
				}else{
        			$('.pdp-price-total__savings').css('display','none');
				}
				$('.pdp-price-total__price').html('Total Price <i class="icon-rupees"></i>'+productDisplay.product.totalPriceInCart);
				$('.pdp-price-panel__price-mrp, .pdp-price-panel__primary').css('display', 'none');
				$('.pdp-price-total').css('display', 'block');
				$('.product-listing__save').hide();
			}else{
				$('.product-details__btn-quantity select').selectric('refresh');
				$('.product-details__btn-quantity--add').html(selectDropdown);
				$('.product-details__btn-quantity--add').attr('data-maxLimit', productDisplay.product.itemDetails[thisItemId].maxOrderQty);
				$('.product-details__btn-quantity--add').selectric('refresh');
				
				$('.pdp-price-panel__primary').css('display', 'block');
				$('.pdp-price-total').css('display', 'none');
				if(productDisplay.product.itemDetails[thisItemId].price.savings > 0){
					$('.product-listing__save--price').html('<i class="icon-rupees"></i>'+productDisplay.product.itemDetails[thisItemId].price.savings);
					if(productDisplay.product.itemDetails[thisItemId].qtyInCart == 0){
						$('.product-listing__save').show();
					}						
					if($('.pdp-price-panel__price-mrp span').hasClass('no-strike-diagonal')){
		        		$('.pdp-price-panel__price-mrp span').removeClass('no-strike-diagonal');
		        		$('.pdp-price-panel__price-mrp span').addClass('strike-diagonal');
		        	}
					if(productDisplay.product.itemDetails[thisItemId].qtyInCart == 0){
						$('.pdp-price-panel__price-mrp').css('display', 'block');
					}						
				}else if(productDisplay.product.itemDetails[thisItemId].price.savings == 0){
					if($('.pdp-price-panel__price-mrp span').hasClass('strike-diagonal')){
		        		$('.pdp-price-panel__price-mrp span').removeClass('strike-diagonal');
		        		$('.pdp-price-panel__price-mrp span').addClass('no-strike-diagonal');
		        	}
					if(productDisplay.product.itemDetails[thisItemId].qtyInCart == 0){
						$('.pdp-price-panel__price-mrp').css('display', 'block');
					}
				}else{
					$('.product-listing__save').hide();
					if($('.pdp-price-panel__price-mrp span').hasClass('strike-diagonal')){
						$('.pdp-price-panel__price-mrp span').removeClass('strike-diagonal');
						$('.pdp-price-panel__price-mrp span').addClass('no-strike-diagonal');
		        	}
					$('.pdp-price-panel__price-mrp').css('display', 'none');
				}
			}
			//price fix			
			$('.product-details__btn-quantity select').prop('selectedIndex', itemQuantityInCart).selectric('refresh');
			$('.product-details__btn-quantity select').selectric('refresh');
			$(document).trigger('dmart.pdp.quantity.perfectscroll');
			//$('.product-details__btn-viewcart').css('display','none');
			if($('#productDetails .product-details__addtolist a').hasClass('disabled')){
				$('#productDetails .product-details__addtolist a').removeClass('disabled');
			}			
		});

		//add to list in frequently brought together
		$(document).on('click','.pdp-alternate-list__summary-add-list',function(){
			$( document ).trigger( 'dmart.freq.showList', [this]);
		});

		//user clicks on submit button from frequently brought section
		$(document).on('click','.pdp-alternate-list .add-list-submit-cta.button.active',function(){
			$( document ).trigger( 'dmart.pdp.addproduct.recomendations', [this]);
		});

		//user clicks on show wishlist in PDP page
		$(document).on('click', '.product-details__addtolist a', function() {
			if(!$(this).hasClass('disabled')){
			$( document ).trigger( 'dmart.PDP.showList', [this]);
			}
		});

		//user adds item in list from PDP
		$(document).on('click', '.product-details .add-list-submit-cta.active', function() {
			$( document ).trigger( 'dmart.PDP.main.additem.tolist', [this]);
		});



		// Frequently bought together for apparel
		$(document).on('click', '.pdp-alternate-list .slider-variant .slides a', function () {
			$(this).parents('.product-listing-item__primary').find('.slider-variant .slides a').removeClass('selected');
			$(this).toggleClass('selected');
		});

		// Frequently Bought Together
		$(document).on('click','.pdp-alternate-list__summary-add-cta',function(){
	    	if($('.pdp-alternate-list__summary-add-cta').parents('#myList').length == 0){
	    		$( document ).trigger( 'dmart.pdp.cart.addproduct.recommendations', [this]);
	    		$(this).css('display', 'none');
	    		$(this).siblings('.pdp-alternate-list__summary-added-cart-cta').fadeIn();
				$(this).parents('.js-alter-module').find('.product-listing-item__primary.selected .product-alternate-checkbox').attr('disabled', true);
	    	}
		});
		
	    var gridBreakpointsSm = 1024;
	    // Write a review
	    $(document).on('click', '.product-gallery .review-quick__new a', function () {
	      if ($(window).width() <= gridBreakpointsSm) {
	        $('html, body').animate({
	          scrollTop: $('.customer-reviews').offset().top - 30
	        }, 1200);
	      }
	      else {
	        $('html, body').animate({
	          scrollTop: $('.customer-reviews').offset().top - 130
	        }, 1200);
	      }

	      $('.write-review__form').slideDown();
	      $('.write-review__form input').focus();
	    });

		$(document).on('click', '.write-review-cta', function () {
			$('.write-review__form').slideDown();
		});

		$(document).on('click', '.js-form-cancel', function () {
			$('.write-review__form').slideUp();
		});

		// read review
		$(document).on('click', '.product-gallery .review-quick__count a', function () {
			$('html, body').animate({
				scrollTop: $('.user-review').offset().top - 280
			}, 1200);
		});
		
	    // Product Details Apparel color highlights
		$(document).on('click', '.product-details__option-secondary .plp-apparel__color-pallette a', function () {
			if(!$(this).parent().hasClass('selected')){
				$(this).parents('.plp-apparel__color-pallette').find('li').removeClass('selected');
				$(this).parent().toggleClass('selected');
				$(this).trigger('dmart.pdp.variant', [this]);  
				DMAnalytics.events( DMAnalytics.Constants.Action.PDPColourSelection, "productId:"+$(this).parents('.product-details--apparel').data('productid') , document.title, 0,null );
			}
		});
		
		// Frequently bought together(moved in recommendation.js)
//		$(document).on('click', '.js-alter-module .product-listing-item__primary input[type="checkbox"]', function () {
//	      $(this).parents('.js-alter-module').find('.pdp-alternate-list__summary-add-cta').css('display', 'inline');
//	      $(this).parents('.js-alter-module').find('.pdp-alternate-list__summary-added-cart-cta').hide();
//	      $(this).parents('.js-alter-module').find('.existing-order__price-view-cart-btn').hide();
//	      $(this).parents('.product-listing-item__primary').toggleClass('selected');
//	      var totalLi = $(this).parents('.product-listing-item').parent().parent().find('.product-listing-item').length;
//	      var alterTotal = $(this).parents('.js-alter-module').find('.product-listing-item__primary input:checked').not(':disabled').length;
//	      if (alterTotal === totalLi) {
//	        alterTotal = 'All';
//	      }
//	      else if(alterTotal >= 1) {
//	        $(this).parents('.js-alter-module').find('.js-alter-cta-panel').show();
//	      }
//	      else {
//	        $(this).parents('.js-alter-module').find('.js-alter-cta-panel').hide();
//	      }
//
//	      if(alterTotal <1) {
//	        $(this).parents('.js-alter-module').find('.js-alter-cta-panel .pdp-alternate-list__summary-add-cta').hide();
//	        $(this).parents('.js-alter-module').find('.js-alter-cta-panel .existing-order__price-view-cart-btn').show();
//
//	      }
//	      $(this).parents('.js-alter-module').find('.pdp-alternate-list__summary-add-cta span, .js-mylist-add-all span, .existing-order__price-added-btn span, .pdp-alternate-list__summary-added-cart-cta span').text(alterTotal);
//	    });
	});
}(DM_UI_CONFIG));
