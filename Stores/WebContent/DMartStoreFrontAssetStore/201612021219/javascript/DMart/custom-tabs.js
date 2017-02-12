'use strict';
(function(dmUIConfig) {
  $(document).ready(function () {
    // Tabs and Accordion for Recommended products on Product Details
    $('.js-accordion-tabs').easyResponsiveTabs({
      type: 'default',
      width: 'auto',
      fit: true,
      tabidentify: 'hor_1',
      activate: function(event) {
        $(this).removeClass('js-hide-show');
        // $('.resp-tab-content').scrollTop(1).perfectScrollbar('update');
      }
    });


    $('.js-accordion-tabs-recommanded').easyResponsiveTabs({
        type: 'default',
        width: 'auto',
        fit: true,
        tabidentify: 'hor_1',
        activate: function(event) {
          $('.js-carousel, .js-landing-carousel, .product-listing__quantity-primary .slider-variant').resize();
          $('.landing-carousel-navigation, .landing-top-carousel-navigation, .landing-top-carousel-navigation-secondary, .landing-top-carousel-navigation-tertiary').css('opacity', 0).delay(100).animate({
            opacity: 1
          }, 800);
          $('.resp-tab-content-active .dashboard-notification--list').scrollTop(1).perfectScrollbar('update');
        }
      });


    $('.js-accordion-tabs-delivery').easyResponsiveTabs({
      type: 'vertical',
      width: 'auto',
      fit: true,
      tabidentify: 'delivery-vertical'
    });
    //Accordio for FAQ
    $('.js-accordion-tab').on('click', function() {
        if(!$(this).hasClass('active')) {

          $('.js-accordion-tab').removeClass('active');
          $('.js-accordion-tab i').removeClass('icon-caret-up');
          $('.js-accordion-panel .js-accordion-content').slideUp();

          $(this).find('i').addClass('icon-caret-up');
          $(this).addClass('active');
          $(this).parents('.js-accordion-panel').find('.js-accordion-content').toggleClass('active').slideDown();
        }
        else {
          $('.js-accordion-tab').removeClass('active');
          $('.js-accordion-tab i').removeClass('icon-caret-up');
          $('.js-accordion-panel .js-accordion-content').slideUp();
        }
      });

      $('.js-accordion-tab-inner').on('click', function() {
        if(!$(this).hasClass('active')) {

          $('.js-accordion-tab-inner').removeClass('active');
          $('.js-accordion-tab-inner i').removeClass('icon-caret-up');
          $('.js-accordion-panel-inner .js-accordion-content-inner').slideUp();

          $(this).find('i').addClass('icon-caret-up');
          $(this).addClass('active');
          $(this).parents('.js-accordion-panel-inner').find('.js-accordion-content-inner').toggleClass('active').slideDown();
        }
        else {
          $('.js-accordion-tab-inner').removeClass('active');
          $('.js-accordion-tab i-inner').removeClass('icon-caret-up');
          $('.js-accordion-panel-inner .js-accordion-content-inner').slideUp();
        }
      });

    // .magic-line navigation border movement
    $(function() {

      var $el, leftPos, newWidth, tabWidth,
      $mainNav = $('.resp-tabs-list');
      $mainNav.append('<span class="magic-line"></span>');
      tabWidth = $('.resp-tabs-list .resp-tab-active').outerWidth();
      $('.resp-tabs-list .magic-line').width(tabWidth);

      // Immediate li and a tags are taregeted
      $('.resp-tabs-list > li').hover(function() {
        $el = $(this);
        leftPos = $el.position().left;
        newWidth = $el.outerWidth();
        $(this).parent().find('.magic-line').show();
        $(this).parent().find('.magic-line').stop().animate({
          left: leftPos,
          'opacity': 1,
          width: newWidth
        }, 500);
      }, function() {
        $(this).parent().find('.magic-line').stop().animate({
          'opacity': 0
        }, 400);
      });
    });
  });
}(DM_UI_CONFIG));
