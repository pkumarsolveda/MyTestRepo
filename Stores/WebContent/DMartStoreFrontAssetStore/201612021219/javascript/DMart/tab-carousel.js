'use strict';
(function(dmUIConfig) {
  $(document).ready(function () {
	    if($(window).width() > 1023) {
	      // Product details Upsell flexslider
	      $('.js-carousel').flexslider({
	        selector: '.slides:first > li',
	        animation: 'slide',
	        animationLoop: false,
	        slideshow: false,
	        controlNav: false,
	        reverse: false,
	        itemWidth: 218,
	        itemMargin: 20,
	        useCSS: false,
	        minItems: 1,
	        maxItems: 4,
	        customDirectionNav: $('.carousel-navigation a')
	      });
	    }
	    else {
	      // Product details Upsell flexslider
	      $('.js-carousel').flexslider({
	        selector: '.slides:first > li',
	        animation: 'slide',
	        animationLoop: false,
	        slideshow: false,
	        controlNav: false,
	        reverse: false,
	        itemWidth: 238,
	        itemMargin: 20,
	        minItems: 1,
	        maxItems: 4,
	        move: 1,
	        useCSS: false,
	        customDirectionNav: $('.carousel-navigation a')
	      });
	    }


    $('.js-promotions-carousel').flexslider({
      selector: '.slides:first > li',
      animation: 'slide',
      animationLoop: false,
      slideshow: false,
      controlNav: false,
      reverse: false,
      itemWidth: 218,
      itemMargin: 12,
      minItems: 1,
      maxItems: 3,
      move: 1,
      customDirectionNav: $('.promotions-carousel-navigation a')
    });
  });
}(DM_UI_CONFIG));
