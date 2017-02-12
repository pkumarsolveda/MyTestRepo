(function(dmUIConfig) {
  $(document).ready(function () {
    // x Remove product from My Cart
	// Moved handler to MiniCartDisplayHelper.js 
    /*
      $('.cart-details__item--remove a').on('click', function(){
      $(this).parents('.cart-details__item-lists').fadeOut('slow', function(){
        $(this).remove();
      });

      if ($(this).parents('.cart-details__item-list').find('.cart-details__item-lists').length === 1) {
        $(this).parents('.cart-details__item-list').find('.cart-no-items').delay(400).fadeIn(500);
      }
    });*/
 // Merged with RzF 0.5.0
	    $(document).on('click', '.cart-details__item--title',function() {

	        $(this).toggleClass('active');
	        if($(this).hasClass('active') && !$(this).hasClass('cart-details__item--bottom')) {
			    	
	        	$('.cart-details__item .cart-details__item--title').removeClass('active');
	        	$(this).find('.cart-details__item--title-arrow i').toggleClass('icon-caret-down icon-caret-up');
	        	if( $(this).parents('.cart-summary-delivery').hasClass('js-cart-summary-delivery')) {
	        		$(this).find('.cart-details__item--title-arrow i').toggleClass('icon-caret-up');
	        	}
	        	$('.js-cart-summary-delivery .cart-details__item--bottom').next('.cart-details__item-list').hide();
	        	$(this).next('.cart-details__item-list').slideToggle(800, function () {
	            	//$('.cart-details__scroll').scrollTop(0).perfectScrollbar('update');
	        	});
	        	$('.js-cart-summary-delivery .cart-details__item--bottom').find('.cart-details__item--title-arrow i').addClass('icon-caret-up');
		    } 
	        // Handled collapsed items in main cart
	        var isMainCart = $(this).parents('#cartDetails').length > 0;
	        var category = $.trim($(this).text().substr(0,$(this).text().indexOf('(')));
	        if($(this).find('.cart-details__item--title-arrow i').hasClass('icon-caret-up'))
	        {
	        	if(isMainCart && typeof cartDisplay != 'undefined') {
		    		cartDisplay.collapsed.push(category);
		    	}
		    	
	        } else {
	        	if(isMainCart && typeof cartDisplay != 'undefined') {
		    		cartDisplay.collapsed.splice(cartDisplay.collapsed.indexOf(category),1);
		    	}
	        }
	    });
    $('.js-cart-summary-delivery .cart-details__item--title').on('click', function() {
	        if($(this).hasClass('cart-details__item--bottom') && $(this).hasClass('active')) {
	          $('.cart-details__item .cart-details__item-list').css('display', 'none');
	          $('.cart-details__scroll-secondary').animate({
	        	 'max-height': '87px'
	          }, 800);
	          $(this).next('.cart-details__item-list').slideDown(800, function () {
	              //$('.cart-details__scroll').scrollTop(0).perfectScrollbar('update');
	            });
	          $(this).find('.cart-details__item--title-arrow i').toggleClass('icon-caret-up');
	          $('.cart-details__scroll').find('.icon-caret-down').attr('class','icon-caret-down')
	        }
	        else {
	        	$('.cart-details__item--bottom').next('.cart-details__item-list').css('display', 'none');
	        	$('.cart-details__scroll-secondary').animate({
	        		'min-height': 0,
	        		'max-height': '240px'
	        	}, 800);	          
	          $(this).find('.cart-details__item--title-arrow i').toggleClass('icon-caret-up');
	          setTimeout(function(){
	        	  $('.cart-details__scroll').perfectScrollbar('update');
	          }, 800);
	        }
	      });

    $('.order-details-info .cart-details__item--title').on('click', function(e) {
      e.stopPropagation();
    });

    $(document).on('click','.cart-summary--delivery-details', function(){
      $(this).parents('.cart-summary__price-details').find('.delivery-charges__details').toggleClass('js-hide-show');
      $('.cart-summary__details').scrollTop(0).perfectScrollbar('update');
    });

    $(document).on('click','.js-share-cart', function(){
    	if(storeUserType !='G'){
      $(this).hide();
      $('.share-cart-form').removeClass('js-hide-show');
      $('.cart-summary__details--primary .form__divider').hide();
      $('.proceed-cta').addClass('button--disabled');
      $('.cart-summary__details').scrollTop($('.share-cart-form').offset().top).perfectScrollbar('update');
	  $('#formShareCartValidation input').val('');
    	}
    	else{
    		errorMessageHelper.showGenericError('User not logged in');
    	}
    });

    $('.clear-cart-cta-btn').on('click', function () {
      $('#clearCartModal').show();
    });

    // Clear cart modal 'OK' action
    $(document).on('click', '#clearCartModal .clear-cart-confirm', function () {
    	$(this).trigger('dmart.clear.cart', [this]); 
     /* $(this).parents('.modal-dialog').hide();
      $('.cart-details__item-list').find('.cart-details__item-lists').remove();
      $('.cart-details__item-list').find('.cart-no-items').fadeIn();
      $('html, body').animate({
        scrollTop: $('.cart-title').offset().top - 100
      }, 1000);*/
    });

    // Clear cart modal 'Cancel' action
    $(document).on('click', '.clear-cart-reject', function(e) {
   // $('#clearCartModal').on('click', '.clear-cart-reject', function () {
      $(this).parents('.modal-dialog').hide();
    });

    // Share A Cart - close
    $(document).on('click', '.js-share-cart-cancel-bta', function(e) {
      $("#formShareCartValidation").data('validator').resetForm();
      $('.share-cart-form').addClass('js-hide-show');
      $('.js-share-cart').show();
      $('.proceed-cta').removeClass('button--disabled');
      $('.cart-summary__details--primary .form__divider').show();
      $('.cart-summary__details').perfectScrollbar('update');
    });

    // Promotion panel add to cart function
    $(document).on('click','.promotions-modal .promotion-panel__btn-addtocart', function(){
    	$(document).trigger('dmart.cart.itemEspot.add', [this]);
    });
    
    $(document).on('click','.promotion-panel--change-qty-cta', function () {
        $(this).css('display', 'none');
        $(this).parents('.promotion-panel').find('.promotion-panel__btn-quantity').fadeIn();
        $(this).parents('.promotion-panel').find('.promotion-panel__btn-viewcart').css('display', 'none');
      });
    
    // Promotion panel update cart function
    $(document).on('change', '.promotion-panel__btn-quantity .cart-details-dropdown', function(){
    	$(document).trigger('dmart.cart.itemEspot.update', [this]);
    });
    
    $(document).on('click','.promotion-panel--change-qty-cta', function(){
        $(this).css('display', 'none');
        $(this).parents('.promotion-panel').find('.promotion-panel__btn-quantity').fadeIn();
        $(this).parents('.promotion-panel').find('.promotion-panel__btn-viewcart').css('display', 'none');
      });
    
    // Search and Add to list

    var gridBreakpointsLg = 1024;
    if ($(window).width() >= gridBreakpointsLg) {

       $(document).on('keyup','.my-list-search-toolbar .search-toolbar__field', function () {
    	 if($.trim($(this).val()).length > 2) {
    		 $('.dropdown-search-add-list').html('');
	    	 SearchHelper.autosuggest($(this).val(),false);
	         $('.dropdown-search-add-list').slideDown(600, function () {
	             $(this).scrollTop(0).perfectScrollbar('update');
	           });
	        $('html, body').animate({
	          scrollTop: $('.my-list-search-toolbar').offset().top - 250
	        }, 800);
    	 }
      });
      
    }

   /* $('.dropdown-search-add-list').on('click', '.product-search__btn-addtolist.js-not-added', function () {
      $(this).text('Added to List').removeClass('js-not-added');
      // Adding sample product
      $('.resp-tab-content-active .product-listing-item:last-child').find('.product-listing__quantity-secondary select').selectric('destroy');
      var cloneList = $('.resp-tab-content-active .product-listing-item:last-child').clone();
      $('.resp-tab-content-active .tabs-primary__content--blurb').append(cloneList);
      $('.resp-tab-content-active .product-listing-item:last-child').css({opacity: 0, display: 'block'}).animate({
        opacity: 1
      }, 1000).css('display', 'block');
      $('.resp-tab-content-active .product-listing-item .product-listing__quantity-secondary select').selectric({
        maxHeight: 85
      });
      // $('.selectric-items .selectric-scroll').mCustomScrollbar();
      $('.dropdown-search-add-list').slideUp();
      $('.js-mylist-show-alert').addClass('js-hide-show');
    });*/

    $('.product-search-item--size-select').on('change', function(){
      var selectedValue = $('option:selected', this).text();
      if(selectedValue !== 'Size') {
        $(this).parents('li').find('.product-search__btn-addtolist').show().removeClass('cart-button-disabled').attr('disabled', false);
        $(this).parents('li').find('.quantity-select').addClass('js-hide-show');
        $(this).parents('li').find('.quantity-select .form__input').val('1');
      }
      else {
        $(this).parents('li').find('.product-search__btn-addtolist').show().addClass('cart-button-disabled').attr('disabled', true);
        $(this).parents('li').find('.quantity-select').addClass('js-hide-show');
        $(this).parents('li').find('.quantity-select .form__input').val('1');
      }
    });

    // My List search dropdown - close
    $('body, html').on('mouseup touchend', function(e) {
      var container = $('.my-list-search-toolbar');
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        $('.dropdown-search-add-list').css('display', 'none');
      }
    });

    // My List

    $(document).on('click','.delete-my-list-cta', function () {
      $('#clearMyListModal').show();
    });

    // Clear My List modal 'OK' action
    // moved to ListActions.js
//    $('.modal-dialog--clear-mylist').on('click', '.clear-mylist-confirm', function () {
//      $(this).parents('.modal-dialog').hide();
//
//      $('html, body').animate({
//        scrollTop: 0
//      }, 500);
//
//      $('.resp-tabs-container .resp-tab-content-active, .resp-tabs-list .resp-tab-active, .resp-accordion .resp-tab-active').addClass('tab-remove').delay(600).fadeOut('slow', function () {
//        console.log($('.resp-tabs-list .resp-tab-active').length);
//        if($('.resp-tabs-list .resp-tab-active').length === 1 || $('.resp-accordion .resp-tab-active').length === 1) {
//          $('.resp-tabs-list .tab-remove, .resp-accordion .tab-remove').next().trigger('click');
//        }
//        else {
//          $('.js-accordion-tabs-vertical, .mylist-search-delete-cta').remove();
//          $('.my-listing-products').html('<p class="text-center">No List available</p>');
//        }
//        $('.resp-tabs-container .tab-remove, .resp-tabs-list .tab-remove, .resp-accordion .tab-remove').remove();
//      });
//
//    });

    // Clear My List modal 'Cancel' action
    $(document).on('click', '.modal-dialog--clear-mylist .clear-mylist-reject', function () {
      $(this).parents('.modal-dialog').hide();
    });
	
    $(document).on('click', '.js-show-back-form', function () {
    	cartDisplay.deactivatePromoCode(this);
    	
    });

    // $(document).on('click', '.calendar-block', function () {
    //   $('#setAlertDate').trigger('click');
    // });

    $(document).on('change', '.js-alert-change select', function () {
      var choose = $(this).val();

      if(choose < 1) {
        $(this).parents('.blurb').find('.js-alert-week select').attr('disabled', true);
        $(this).parents('.blurb').find('.mylist-set-alert-save button').attr('disabled', true);
        $(this).parents('.blurb').find('.js-alert-week').removeClass('hide');
        $(this).parents('.blurb').find('.js-alert-month').addClass('hide');
        $(this).parents('.blurb').find('.mylist-set-alert-save button').addClass('button--disabled').attr('disabled', true);
     }
      else if(choose >= 2) {
        $(this).parents('.blurb').find('.js-alert-month').removeClass('hide');
        $(this).parents('.blurb').find('.js-alert-week').addClass('hide');
        $(this).parents('.blurb').find('.js-alert-month select').attr('disabled', false);
        $(this).parents('.blurb').find('.mylist-set-alert-save button').attr('disabled', false).removeClass('button--disabled');
      }
      else {
        $(this).parents('.blurb').find('.js-alert-month').addClass('hide');
        $(this).parents('.blurb').find('.js-alert-week').removeClass('hide');
        $(this).parents('.blurb').find('.js-alert-week select').attr('disabled', false);
        $(this).parents('.blurb').find('.mylist-set-alert-save button').removeClass('button--disabled').attr('disabled', false);
      }
    });

    //	moving to DMartShoppingListActions.js
//    $('.js-alert-disabled').clickToggle( function () {
//      $('.js-alert-week select, .js-alert-month select, .js-alert-change select').attr('disabled', true);
//      $('.mylist-set-alert-save button').removeAttr('disabled').removeClass('button--disabled');
//    }, function () {
//      if($('.js-alert-change select').val() >= 1) {
//        $('.js-alert-week select, .js-alert-month select, .js-alert-change select').removeAttr('disabled');
//      }
//      else {
//        $('.js-alert-change select').removeAttr('disabled');
//        $('.mylist-set-alert-save button').attr('disabled', true).addClass('button--disabled');
//      }
//    });
    
    // Proceed to checkout
    $(document).on('click', '.proceed-cta', function() {
	 if(!($(this).hasClass('button--disabled'))){
	       $(this).trigger('dmart.proceed.to.checkout', [this]);
	 }
    });
    
    // Continue Shopping
    $('#continueShopping,.empty-cart--cta').on('click', function() {
      $(this).trigger('dmart.continue.shopping', [this]); 
    });
    // Change the condition based on the dynamic lesser amount of 1000
    $('.cart-details__item').on('change', '.simulation-test', function () {
      if($(this).val() <= 1) {
        $('.js-less-total-value').removeClass('js-hide-show');
        $('html, body').animate({
          scrollTop: 0
        }, 600);
        $('.cart-summary__cta-container .proceed-cta').attr('disabled', true).addClass('button--disabled');
      }
      else {
        $('html, body').animate({
          scrollTop: 0
        }, 600);
        $('.js-less-total-value').addClass('js-hide-show');
        $('.cart-summary__cta-container .proceed-cta').attr('disabled', false).removeClass('button--disabled');
      }
    });

    
  });
}(DM_UI_CONFIG));
