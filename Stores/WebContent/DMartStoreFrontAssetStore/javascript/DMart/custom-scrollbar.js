'use strict';
(function(dmUIConfig) {
  $(document).ready(function () {

    var windowWidth = $(window).innerWidth();

    $('.selectric-items .selectric-scroll, .product-info-accordion-tabs .resp-tab-content, .js-div-table-scrollable, .dropdown-search-add-list, .dashboard-box--body-content-scroll, .manage-address').perfectScrollbar({
      suppressScrollX: true,
      swipePropagation: true
    });
    
    if (windowWidth >= 768) {
      $('.cart-summary .cart-summary__details').perfectScrollbar({
        suppressScrollX: true,
        swipePropagation: true
      });
    }

    $('.dashboard-notification--list, .product-filter .filter__scroll').perfectScrollbar({
      suppressScrollX: true,
      swipePropagation: true
    });

    $('.cart-details__scroll, .header-dropdown--search .search-dropdown, .product-listing-item__tertiary-lists').perfectScrollbar({
      suppressScrollX: true,
      swipePropagation: true
    });
    var gridBreakpointsSm = 1024;
    if ($(window).width() <= gridBreakpointsSm) {
      $('.delivery-selection--this-week, .delivery-selection--coming-week').perfectScrollbar({
        suppressScrollY: true
      });
      $('.js-accordion-tabs .service-center-wrap').perfectScrollbar('destroy');
      $('.js-accordion-tabs .service-center-wrap').perfectScrollbar({
        suppressScrollY: true,
        swipePropagation: true
      });
    }
  });

  $(window).load(function () {
    $('.pup-location-marker').perfectScrollbar({
      suppressScrollX: true
    });

    $('.cart-summary-secondary .cart-summary__details, .js-perfectscrollbar-destroy').perfectScrollbar('destroy');
  });
}(DM_UI_CONFIG));
