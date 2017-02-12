(function(dmUIConfig) {
  $(window).load(function () {

    $('.landing-tabs--secondary .js-landing-carousel').flexslider({
      selector: '.slides:first > li',
      animation: 'slide',
      animationLoop: false,
      slideshowSpeed: 3000,
      animationSpeed: 500,
      slideshow: false,
      controlNav: false,
      reverse: false,
      itemWidth: 218,
      itemMargin: 20,
      minItems: 1,
      maxItems: 4,
      move: 1,
      touch: true,
      customDirectionNav: $('.landing-carousel-navigation a')
    });

    $('.landing-tabs--secondary-recommended .js-landing-carousel').flexslider({
      selector: '.slides:first > li',
      animation: 'slide',
      animationLoop: false,
      slideshowSpeed: 3000,
      animationSpeed: 500,
      slideshow: false,
      controlNav: false,
      reverse: false,
      itemWidth: 218,
      itemMargin: 20,
      minItems: 1,
      maxItems: 4,
      move: 1,
      touch: true,
      customDirectionNav: $('.landing-carousel-navigation-recommended a')
    });

    $('.landing-tabs--tertiary .js-landing-carousel').flexslider({
      selector: '.slides:first > li',
      animation: 'slide',
      animationLoop: false,
      slideshowSpeed: 3000,
      animationSpeed: 500,
      slideshow: false,
      controlNav: false,
      reverse: false,
      itemWidth: 218,
      itemMargin: 20,
      minItems: 1,
      maxItems: 4,
      move: 1,
      touch: true,
      customDirectionNav: $('.landing-top-carousel-navigation a')
    });

    $('.landing-tabs--quaternary .js-landing-carousel').flexslider({
      selector: '.slides:first > li',
      animation: 'slide',
      animationLoop: false,
      slideshowSpeed: 3000,
      animationSpeed: 500,
      slideshow: false,
      controlNav: false,
      reverse: false,
      itemWidth: 218,
      itemMargin: 20,
      minItems: 1,
      maxItems: 4,
      move: 1,
      touch: true,
      customDirectionNav: $('.landing-top-carousel-navigation-quaternary a')
    });

    $('.landing-tabs--quinary .js-landing-carousel').flexslider({
      selector: '.slides:first > li',
      animation: 'slide',
      animationLoop: false,
      slideshowSpeed: 3000,
      animationSpeed: 500,
      slideshow: false,
      controlNav: false,
      reverse: false,
      itemWidth: 218,
      itemMargin: 20,
      minItems: 1,
      maxItems: 4,
      move: 1,
      touch: true,
      customDirectionNav: $('.landing-top-carousel-navigation-quinary a')
    });

    var gridBreakpointsSm = 1023;
    if ($(window).width() <= gridBreakpointsSm) {
      // for splash small devices
      $('.landing-tabs--tertiary .js-md-landing-carousel').flexslider({
        selector: '.slides:first > li',
        animation: 'slide',
        animationLoop: false,
        slideshowSpeed: 3000,
        animationSpeed: 500,
        slideshow: false,
        controlNav: false,
        reverse: false,
        itemWidth: 218,
        itemMargin: 20,
        minItems: 1,
        maxItems: 4,
        touch: true,
        move: 1,
        useCSS: false
      });

      // landing Most Popular for small devices
      $('.js-landing-upper-carousel').flexslider({
        selector: '.slides:first > li',
        animation: 'slide',
        animationLoop: false,
        slideshowSpeed: 3000,
        animationSpeed: 500,
        slideshow: false,
        controlNav: false,
        reverse: false,
        itemWidth: 268,
        itemMargin: 12,
        minItems: 1,
        maxItems: 3,
        move: 1,
        smoothHeight: false,
        touch: true,
        customDirectionNav: $('.promotions-carousel-navigation a')
      });
    }
    else {
      // landing Most Popular for large devices
      $('.js-landing-upper-carousel').flexslider({
        selector: '.slides:first > li',
        animation: 'slide',
        animationLoop: false,
        slideshowSpeed: 3000,
        animationSpeed: 500,
        slideshow: false,
        controlNav: false,
        reverse: false,
        itemWidth: 357,
        itemMargin: 12,
        minItems: 1,
        maxItems: 3,
        move: 1,
        smoothHeight: false,
        useCSS: false,
        customDirectionNav: $('.promotions-carousel-navigation a')
      });
    }
    
    // Changed for owl carousel changes AE-17677
    var owl = $('.owl-carousel');
    owl.owlCarousel({
     items:1,
     loop:true,
     autoplay:true,
     lazyLoad:true,
     autoplayTimeout:3500,
     smartSpeed:2000
    }).find('.item').css('display','block');
    
    if ($(window).width() < 420) {

    	$('.landing-tabs--clp-rails-l2 .js-landing-carousel').each(function() {
    	   $(this).flexslider({
    	     selector: '.slides:first > li',
    	     animation: 'slide',
    	     animationLoop: false,
    	     slideshowSpeed: 3000,
    	     animationSpeed: 500,
    	     slideshow: false,
    	     controlNav: false,
    	     reverse: false,
    	     itemWidth: 120,
    	     itemMargin: 20,
    	     minItems: 1,
    	     maxItems: 4,
    	     move: 1,
    	     touch: true,
    	     customDirectionNav: $(this).parents('.landing-tabs--clp-rails-l2').find('.landing-top-carousel-navigation a')
    	   });
    	});
    	}
    	$('.landing-tabs--clp-rails .js-landing-carousel').each(function() {
    	         $(this).flexslider({
    	             selector: '.slides:first > li',
    	             animation: 'slide',
    	             animationLoop: false,
    	             slideshowSpeed: 3000,
    	             animationSpeed: 500,
    	             slideshow: false,
    	             controlNav: false,
    	             reverse: false,
    	             itemWidth: 218,
    	             itemMargin: 20,
    	             minItems: 1,
    	             maxItems: 4,
    	             move: 1,
    	             touch: true,
    	             customDirectionNav: $(this).parents('.landing-tabs--clp-rails').find('.landing-top-carousel-navigation a')
    	         });
    	     });
    
  });


}(DM_UI_CONFIG));
