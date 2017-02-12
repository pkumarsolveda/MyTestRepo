(function(dmUIConfig) {
  $(document).ready(function () {

   $(document).on('click','.js-colorselector .dropdown-toggle', function () {
	        $('.dropdown-menu').hide();
	        $(this).parent().find('.dropdown-menu').fadeIn();
   });

   // Moved to SearchHelper.js
/*   $(document).on('click','.js-colorselector .dropdown-menu a', function () {
	        $(this).parents('.js-colorselector').find('.dropdown-menu a').removeClass('selected');
	        $(this).addClass('selected');
	        $(this).parents('.js-colorselector').find('.dropdown-toggle span').css('background-color', $(this).css('background-color'));
	        $(this).parents('.dropdown-menu').fadeOut();
   });*/

	      //close color selector on focusout, esc key and click out
   $('body, html').on('mouseup touchend keyup', function(e) {
	        if($('.js-colorselector').is(':visible')) {
	          var container = $('.js-colorselector');
	          if ((!container.is(e.target) && container.has(e.target).length === 0) || e.which === 27) {
	            $('.dropdown-menu:visible').hide();
	          }
	        }
   });


	  
	  
    /*Quantity selector*/
	 // Moved to ESpotProductRecommendationHelper.js
    /*$('.js-quantity-minus').on('click', function () {
      var qty = $(this).parents('.quantity-select').find('.quantity-input .form__input').val();
      if(parseInt(qty) > 1) {
        var newQty = parseInt(qty) - 1;
        $(this).parents('.quantity-select').find('.quantity-input .form__input').val(newQty);
      }
    });

    $('.js-quantity-plus').on('click', function(){
      var qty = $(this).parents('.quantity-select').find('.quantity-input .form__input').val();
      if(parseInt(qty) >= 1) {
        var newQty = parseInt(qty) + 1;
        $(this).parents('.quantity-select').find('.quantity-input .form__input').val(newQty);
      }
    });*/

    // Add to cart toggle with Quantity select
    $('.product-search__btn-addtocart').on('click', function() {
      $(this).hide();
      $(this).next('.quantity-select').removeClass('js-hide-show');
    });

    $('.product-search-item--size-select').on('change', function(){
      var selectedValue = $('option:selected', this).text();
      if(selectedValue !== 'Size') {
        $(this).parents('li').find('.product-search__btn-addtocart').show().removeClass('cart-button-disabled').attr('disabled', false);
        $(this).parents('li').find('.quantity-select').addClass('js-hide-show');
        $(this).parents('li').find('.quantity-select .form__input').val('1');
      }
      else {
        $(this).parents('li').find('.product-search__btn-addtocart').show().addClass('cart-button-disabled').attr('disabled', true);
        $(this).parents('li').find('.quantity-select').addClass('js-hide-show');
        $(this).parents('li').find('.quantity-select .form__input').val('1');
      }
    });
  });
}(DM_UI_CONFIG));
