(function(dmUIConfig) {
  $(document).ready(function () {

    $('.js-accordion-tabs-vertical').easyResponsiveTabs({
      type: 'vertical',
      width: 'auto',
      fit: true,
      tabidentify: 'tabs-primary--vertical'
    });

    $(document).on('change', '.js-order-change-qty select', function() {
      $(this).parents('.product-listing-details').find('.js-button-addedCart').css('display', 'none');
      $(this).parents('.product-listing-details').find('.product-listing__cta-btn').fadeIn();
      $(this).parents('.product-listing-details').find('.product-alternate-checkbox').attr('disabled', false);
    });

    $(document).on('click', '.product-listing__cta-btn', function () {
      $(this).css('display', 'none');
      $(this).parents('.view-list-active').addClass('item-added-to-cart');
      $(this).siblings('.js-button-addedCart').fadeIn();
      $(this).parents('.product-listing-details').find('.product-alternate-checkbox').attr('checked', false);
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
      $(this).parents('.js-alter-module').find('.pdp-alternate-list__summary-add-cta span, .existing-order__price-added-btn span').text(alterTotal);
      $(this).parents('.product-listing-details').find('.product-alternate-checkbox').attr('disabled', true);

    });

    $(document).on('click', '.js-alter-module .added-product__remove a', function() {
      console.log('dd');
      $(this).parents('.product-listing-item').fadeOut(300, function () {
        $(this).remove();
      });

      var totalList = $(this).parents('.js-alter-module').find('.product-listing-item').length;
      if(totalList <=1) {
        $('.clear-mylist-confirm').delay(800).trigger('click');
      }
    });

    // customize the interval for setTimeout based on ajax call request
    // $(document).on('click', '.js-loading-full', function () {
    //   var windowH = $(window).height();
    //   windowH = windowH / 2;
    //   $('.loading-animation-wrapper').fadeIn();
    //   $('.loading-animation-wrapper .loading-animation__panel').css('marginTop', windowH);
    //   $('body').addClass('body-overflow-hidden');

    //   setTimeout(function() {
    //     $('.loading-animation-wrapper').fadeOut();
    //     $('body').removeClass('body-overflow-hidden');
    //   }, 500);
    // });

    $(document).on('click', '.existing-order__price-cta-btn', function () {
      $(this).css('display', 'none');
      $(this).parents('.js-alter-module').find('.existing-order__price-view-cart-btn').fadeIn();
      $(this).parents('.js-alter-module').find('.view-list-active .selected .product-listing__cta-btn').css('display', 'none');
      $(this).parents('.js-alter-module').find('.view-list-active .selected .product-listing__cta-added').fadeIn();
      $(this).parents('.js-alter-module').find('.view-list-active .selected .product-alternate-checkbox').attr('checked', false);
      $(this).parents('.js-alter-module').find('.view-list-active .selected .product-alternate-checkbox').attr('disabled', true);
    });

  });
}(DM_UI_CONFIG));
