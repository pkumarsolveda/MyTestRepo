'use strict';
(function(dmUIConfig) {
  $(window).load(function () {

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
  });
}(DM_UI_CONFIG));
