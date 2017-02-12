'use strict';
(function(dmUIConfig) {
  $(document).ready(function () {
    $('.product-gallery__thumbnails').flexslider({
      animation: 'slide',
      direction: 'vertical',
      itemWidth: 38,
      controlNav: false,
      animationLoop: false,
      slideshow: false,
      asNavFor: '.product-gallery__viewport',
      prevText: '<i class="icon-caret-up"></i>',
      nextText: '<i class="icon-caret-down"></i>'
    });

    $('.product-gallery__viewport').flexslider({
      animation: 'fade',
      controlNav: false,
      animationLoop: false,
      animationSpeed: 600,
      slideshow: false,
      sync: '.product-gallery__thumbnails',
      nextText: '',
      prevText: ''
    });

    $('.js-carousel').flexslider({
      selector: '.slides:first > li',
      animation: 'slide',
      animationLoop: false,
      slideshow: false,
      controlNav: false,
      reverse: false,
      itemWidth: 230,
      itemMargin: 20,
      minItems: 1,
      maxItems: 4,
      customDirectionNav: $('.carousel-navigation a')
    });
  });
}(DM_UI_CONFIG));
