'use strict';
(function(dmUIConfig) {
  $(document).ready(function () {
    var $productVariant = $('.product-details .slider-variant .slides li a');
    var $productVariantParent = $('.product-details .slider-variant .slides');
    $('.product-details .slider-variant .slides li:first-child').addClass('active');

    // product details variant selection
    $(document).on('click', '.product-details .slider-variant .slides li a', function () {
      $(this).parent().toggleClass('active');
      var thisItemId = $(this).parent().data('item');
      
      /*$('.product-details .slider-variant .slides .active').removeClass('active');
      $('.product-details .slider-variant .slides').find('li[data-item="'+thisItemId+'"]').addClass('active');
      $productVariantParent.find('.enableChangeQty').addClass('addedToCart');
      
      $(this).trigger('dmart.pdp.update.variant',[thisItemId]);*/
      if(!$(this).parent().hasClass('enableChangeQty') && $productVariantParent.find('.enableChangeQty').length > 0) {
        $('.product-details .slider-variant .slides .enableChangeQty').removeClass('active');
        $productVariantParent.find('.enableChangeQty').addClass('addedToCart');
        //$('.product-details .slider-variant .slides').find('.enableChangeQty .product-details__change-qty').css('display', 'block');
        $('.pdp-price-panel__price-mrp, .pdp-price-panel__primary, .product-details__btn-add-more').fadeIn().css('display', 'block');
        $('.pdp-price-total').hide();
        $('.product-details__btn-addtocart, .product-details__btn-quantity').css('display', 'none');
        $(this).parents('.product-details__btn-quantity').css('display', 'none');
        $('.product-details__btn-add-more').css('display', 'block');
      }
      else {
        $('.product-details__btn-addtocart').fadeIn();
        $('.product-details__btn--addtocart-popup, .product-details__btn-quantity, .product-details__btn-add-more').css('display', 'none');
      }
      if($(this).parent().hasClass('addedToCart')) {
        //$(this).children('.product-unit').hide();
        //$(this).parent().removeClass('enableChangeQty addedToCart active');
    	  $('.product-details .slider-variant .slides .active').removeClass('active');
    	  $('.product-details .slider-variant .slides').find('.addedToCart[data-item="'+thisItemId+'"]').addClass('active');
          $('.product-details__btn-quantity').css('display', 'block');
          $('.product-details__btn-addtocart').css('display', 'none');
          var itemQuantityInCart = productDisplay.product.itemDetails[thisItemId].qtyInCart;
          $(this).parents('.product-details').find('.selectric-product-details__btn-quantity--add .selectric p.label').html(itemQuantityInCart);
      }
      //var selectedProductLength = $productVariantParent.find('.enableChangeQty').length;
      $('.quick-product-cart .quick-product-cart--count').text(productDisplay.product.totalQtyInCart);
      if($productVariantParent.find('.active').length <= 0) {
        $('.product-details__btn--addtocart-popup').fadeIn();
        $('.product-details__btn-addtocart, .product-details__btn-add-more').css('display', 'none');
      }
      else {
        $('.product-details__btn--addtocart-popup').css('display', 'none');
      }
    });

    // product details add to cart function
    $('.product-details__btn-addtocart').on('click', function() {
    	
        $(this).trigger('dmart.pdp.addtocart');
        
/*        var selectedProductLength = $productVariantParent.find('.active').length;
        if(!$('.product-details .slider-variant .slides li').hasClass('active')) {
          $(this).css('display', 'none');
          $(this).siblings('.product-details__btn--addtocart-popup').hide();
        }
        else {
          $(this).css('display', 'none');
          $('.product-listing__save, .pdp-price-panel__primary, .pdp-price-panel__price-mrp').css('display', 'none');
          $('.product-details .slider-variant .active a').children('.product-unit').css('display', 'inline');
          $('.product-details__btn-quantity, .pdp-price-total, .quick-product-cart').fadeIn();
          $(this).siblings('.product-details__btn--addtocart-popup').css('display', 'none');
          $productVariantParent.find('.active').addClass('enableChangeQty');
          $('.quick-product-cart .quick-product-cart--count').text(selectedProductLength);
          $('.quick-product-delivery, .quick-product-not-cod, .quick-product-available').hide();
        }*/
    });

    // product details update quantity
    $('.product-details__btn-quantity--add').on('change', function() {
    	
    	$(this).trigger('dmart.pdp.updatecart');
    	
/*      var quantity = $(this).val();
      $('option', this).eq(0).attr('selected', true);
      $(this).parents('.product-details__btn-quantity').css('display', 'none');
      $('.slider-variant .active .product-unit-count').text(quantity);
      $('.product-details .slider-variant .active a').children('.product-unit').css('display', 'inline');
      $('.product-details__btn-add-more').fadeIn().css('display', 'block');
      $productVariantParent.find('.active').addClass('addedToCart').removeClass('active');
      $('.product-details .slider-variant .slides .active').find('.product-details__change-qty').css('display', 'block');
    */
    });

    // add more to variant
    $('.product-details__btn-add-more').on('click', function() {
    	
    	$(this).trigger('dmart.pdp.addmore');
    	
/*      if($productVariantParent.find('.active').length <= 0) {
        $(this).css('display', 'none');
        $(this).siblings('.product-details__btn--addtocart-popup').fadeIn();
      }
      else {
        $(this).css('display', 'none');
        $('.pdp-price-panel__price-mrp, .pdp-price-panel__primary').hide();
        $('.pdp-price-total').fadeIn().css('display', 'block');
        $(this).siblings('.product-details__btn--addtocart-popup').css('display', 'none');
        $('.slider-variant .active a').children('.product-unit').css('display', 'inline');
        $('.product-details__btn-quantity').css('display', 'block');
        $productVariantParent.find('.active').addClass('enableChangeQty');
        var selectedProductLength = $productVariantParent.find('.enableChangeQty').length;
        $('.quick-product-cart .quick-product-cart--count').text(selectedProductLength);
      }*/
    });

    // variant change qty
    $(document).on('click', '.enableChangeQty .product-details__change-qty', function () {
      $productVariantParent.find('li').removeClass('active');
      $(this).parent().addClass('active');
      $('.product-details__btn-quantity').fadeIn();
      $('.product-details__btn-add-more, .product-details__btn--addtocart-popup').css('display', 'none');
      
      //Custom changes
      var thisItemId = $(this).parent().data('item');
      var itemQuantityInCart = productDisplay.product.itemDetails[thisItemId].qtyInCart;
      $(this).parents('.product-details').find('.selectric-product-details__btn-quantity--add .selectric p.label').html(itemQuantityInCart);
      
      
    });

    

    
  //add to list in frequently brought together
    $(document).on('click','.pdp-alternate-list__summary-add-list',function(){
        
    	if(storeUserType != 'G'){
    		if($('.pdp-alternate-list .product-listing-item__tertiary-lists ul li').length==0){
    			displayList();
    	}
    	
    	$(this).parents('.pdp-alternate-list__summary').siblings('.product-listing-item__tertiary').animate({
            opacity: 1
          }, 500).css('display', 'block');
    	}
    	else{
    		alert("please login");
    	}
    });
    
  //user clicks on submit button from frequently brought section
    $(document).on('click','.pdp-alternate-list .add-list-submit-cta.button.active',function(){
    	
    	var lists=[];
    	$.each($(this).parents('.product-listing-item__tertiary').find('.selected'),function(indx,acnhor) {
    		  
    		  lists.push($(this).parent().attr('value'));
    	});
    	$( document ).trigger( 'dmart.pdp.addproduct.recomendations', [this,lists]);
    });

    //user clicks on add to wishlist in PDP page
    $(document).on('click', '.product-details__addtolist a', function() {
    	var itemIdPDP = [];
    	var qty=[];
    	$.each($(this).parents('.product-details.product-details--grocery').find('.slider-variant-wrap .active'),function(index,dataset) {
     		
    		console.log(index);
    		console.log(" ItemId: "+$('.product-details__addtolist a').parents('.product-details.product-details--grocery').find('.slider-variant-wrap .active')[index].dataset.item);
    		itemIdPDP.push($('.product-details__addtolist a').parents('.product-details.product-details--grocery').find('.slider-variant-wrap .active')[index].dataset.item);
    		qty.push("1");
    	});
    	productDisplay.product.selectedItem=itemIdPDP;
    	productDisplay.product.selectedQty=qty;
    	if(storeUserType != 'G'){
    		if($('.product-details.product-details--grocery .product-listing-item__tertiary-lists ul li').length==0){
    			
    			displayList();
        	}
    		else{
        		 if(!$(this).hasClass('disabled')) {
        	          $('.product-listing-item__tertiary .add-list-submit-cta').removeClass('active').text('Submit');
        	          $(this).parents('.product-details.product-details--grocery').find('.product-listing-item__tertiary').animate({
        	            opacity: 1
        	          }, 500).css('display', 'block');
        	          $(this).parents('#productDetails').find('.product-listing-item__tertiary-lists ul').mCustomScrollbar('updated');
        	        }
        	}
    		$(this).parents('.product-details.product-details--grocery').find('.product-listing-item__tertiary').animate({
	            opacity: 1
	          }, 500).css('display', 'block');
    	}else {
    		alert('Please Login');
    	}
    	
       
      });
    
$(document).on('click', '.product-details.product-details--grocery .add-list-submit-cta.active', function() {
    	
    	var lists=[];
      $.each($(this).parents('.product-listing-item__tertiary').find('.selected'),function(indx,acnhor) {
		  
		  lists.push($(this).parent().attr('value'));
	  });
      console.log("ExternalIds: "+lists);
      DMartShoppingListActionsJS.addToList(null,lists,productDisplay.product.selectedItem,productDisplay.product.selectedQty);
      $(this).text('Added to List');
      $(this).parents('.product-listing-item__tertiary').delay(500).fadeOut(1000).animate({
      opacity: 0
    }, 100);
    $('.product-listing-item__tertiary-lists a, .add-list-submit-cta').removeClass('selected');
      
    });
   
    

    // Frequently bought together for apparel
    $(document).on('click', '.pdp-alternate-list .slider-variant .slides a', function () {
      $(this).parents('.product-listing-item__primary').find('.slider-variant .slides a').removeClass('selected');
      $(this).toggleClass('selected');
    });

    // Frequently bought together
    $('.product-listing-item__primary input[type="checkbox"]').on('click', function () {
      $(this).parents('.product-listing-item__primary').toggleClass('selected');

      var alterTotal = $('.product-listing-item__primary input:checked').length;
      if(alterTotal === 1) {
        alterTotal = 'One';
        $('.pdp-alternate-list__summary').show();
      }
      else if(alterTotal === 2) {
        alterTotal = 'Two';
      }
      else if(alterTotal === 3) {
        alterTotal = 'all Three';
      }
      else {
        $('.pdp-alternate-list__summary').hide();
      }
      $('.pdp-alternate-list__summary-add-cta span').text(alterTotal);
    });

    // Write a review
    $(document).on('click', '.product-gallery .review-quick__new a', function () {
      $('html, body').animate({
        scrollTop: $('.customer-reviews').offset().top - 130
      }, 1200);
      $('.write-review__form input').focus();
    });

    $(document).on('click', '.write-review-cta', function () {
      $('.write-review__form').slideDown();
    });

    // read review
    $(document).on('click', '.product-gallery .review-quick__count a', function () {
      $('html, body').animate({
        scrollTop: $('.user-review').offset().top - 30
      }, 1200);
    });
  });
}(DM_UI_CONFIG));

function displayList(){
	var vListExists = $('#listExists').val();
	if(vListExists==="true"){
		var vdmartShoppingLists = $('#dmartShoppingLists').val();        		
		var wishListJSON = JSON.parse(vdmartShoppingLists);
		nunjucks.configure(getAbsoluteURL()
				+ 'DMartStoreFrontAssetStore/templates/_modules/', {
			autoescape : true,
			web : {
				useCache : true
			}
		});
		var htmlcode = nunjucks.render('add-to-shop-list.nunjucks', {
			listData : wishListJSON
		});
		$('.product-listing-item__tertiary').replaceWith([htmlcode]);
}
	else{
		nunjucks.configure(getAbsoluteURL()
				+ 'DMartStoreFrontAssetStore/templates/_modules/', {
			autoescape : true,
			web : {
				useCache : true
			}
		});
		var htmlcode = nunjucks.render('add-to-shop-list.nunjucks');
		$('.product-listing-item__tertiary').replaceWith([htmlcode]);
		
	}
}
