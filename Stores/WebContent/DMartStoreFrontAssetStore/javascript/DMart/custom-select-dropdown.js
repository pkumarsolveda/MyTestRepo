'use strict';
(function(dmUIConfig) {
  $(document).ready(function () {

    // detect browser
    function getBrowserInfo() {
      var ua = navigator.userAgent, tem, M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
      if(/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name: 'IE', version: (tem[1]||'')};
      }
      if(M[1]==='Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/);
        if(tem !== null) {
          return {name: 'Opera', version: tem[1]};
        }
      }
      M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
      if((tem = ua.match(/version\/(\d+)/i)) !== null) {
        M.splice(1, 1, tem[1]);
      }
      return {
        name: M[0],
        version: M[1]
      };
    }

    var browser = getBrowserInfo();

    // Detect OS
    var OSName = 'Unknown OS';
    if (navigator.appVersion.indexOf('Win') !== -1) {
      OSName = 'Windows';
    }
    else if (navigator.appVersion.indexOf('Mac') !== -1) {
      OSName = 'MacOS';
    }
    else if (navigator.appVersion.indexOf('X11') !== -1) {
      OSName = 'UNIX';
    }
    else if (navigator.appVersion.indexOf('Linux') !== -1) {
      OSName = 'Linux';
    }

    // Fix for Rupee symbol in Windows lower browser versions
    if(OSName === 'Windows' && browser.version <= 46) {
      $('.js-rupee').addClass('has-rupee');
      $('.js-rupee select option').text(function(index, text) {
        return text.replace('?', '`');
      });
    }

    $('.md-custom-select .cart-details-dropdown, .js-filter-sortby, .product-details .product-details__btn-quantity select, .product-listing__quantity-secondary select, .add-product-other-quantity select').selectric({
      maxHeight: 170
    });
    // disable custom-dropdown by selectric
    $('.resp-tabs-container .add-product-other-quantity select, .resp-tabs-container .product-listing__quantity-secondary select').selectric('destroy').parent().addClass('custom-dropdown');
    $('.my-list.cart-details__item-lists .md-custom-select select').selectric().parents('.md-custom-select').removeClass('custom-dropdown');

    $('.tabs-primary__content--blurb .product-listing-item .product-listing__quantity-secondary select').selectric({
      maxHeight: 60
    });

    $('.cart-details__item .product-not-available .cart-details-dropdown').attr('disabled', true).selectric('refresh');
    $('.slide-margin .product-listing__quantity--select, .product-listing__quantity-other--select').selectric('destroy');
  });
}(DM_UI_CONFIG));
