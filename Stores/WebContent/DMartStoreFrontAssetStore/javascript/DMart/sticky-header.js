'use strict';
(function(dmUIConfig) {
	$(document).ready(function () {

		function sticky() {
			var currentScrollPos = $(window).scrollTop();
			if (currentScrollPos >= 50 ) {
				$('.col-alt-logo').removeClass('col-lg-3').addClass('col-lg-2');
				$('.avatar-medium-device').removeClass('js-hide-show').addClass('col-md-2');
				$('.dropdown-signin, .dropdown-register, .js-myaccount-dropdown, .dropdown-minicart').removeClass('opened');
				$('.header-dropdown').css('display', 'none');
				$('.js-class-alt-search').removeClass('col-lg-8 col-lg-7').addClass('col-lg-5');
				setTimeout(function(){
					$('.header-component__primary').find('.delivery-code__label, .delivery-code__pin, .icon-delivery-caret-down, .cart-price-label').show().animate({
						opacity: 1
					}, 450);
					$('.js-class-delivery-downdown, .js-class-cart-downdown').removeClass('col-lg-1').addClass('col-lg-2');
					$('.delivery-code .icon-delivery-location, .cart-wrap, .avatar').removeClass('active');
				}, 320);
				// $('.js-sub-menu, .sub-menu-items').css('top', '98px');
				$('.js-header-container').addClass('header-sticky');
			}
			else {
				$('.col-alt-logo').removeClass('col-lg-2').addClass('col-lg-3');
				$('.avatar-medium-device').addClass('js-hide-show');
				// $('.js-sub-menu, .sub-menu-items').css('top', '141px');
				$('.js-header-container').removeClass('header-sticky');
			}
		}


		// Bind throttle sticky header only if width>=768p and sticky header enabled
		if($(window).width() >= 768 && (typeof isStickyHeader != 'undefined' && isStickyHeader == '1')) {
			$(window).scroll( $.throttle( 250, sticky ) );
		}

		// Category open
		$(document).on('click','.splash .js-category-dropdown', function () {
			$('#locationDeliveryModal').show();
			return false;
		});

		$('.main-menu__location-mini').on('touchstart', function () {
			$('#locationDeliveryModal').show();
			$('body').css('overflow', 'hidden');
		});

		if($(window).width() >= 1000) {
			//$(document).on('mouseenter mouseleave','.js-category-dropdown', function (event) {
			var categoryTimer;
			$('.js-category-dropdown').hover( function () {
				categoryTimer = setTimeout(function(){
					if(!$('.splash').length) {
						if($('.dropdown-minicart').hasClass('opened')) {
							$('.dropdown-minicart').removeClass('opened');
							$('.dropdown-minicart').parent().find('.header-dropdown--minicart').fadeOut();
						}
						if($('.header-dropdown--search').is(':visible') || $('.search-toolbar__field.js-search-field').hasClass('active')) {
							$('.header-dropdown--search').slideUp('fast');
						}
						$('.js-category-dropdown').addClass('category-open');
						$('.category-menu-down', '.js-category-dropdown').toggleClass('icon-caret-up category-menu-up');
						var menuHeight = $('.main-menu__navigation--category-dropdown').height();
						$('.sub-menu').height(menuHeight-1);
						$('.sub-menu-items').height(menuHeight - 70);
					}
				 },100);
			 },
			 function () {
				 if(!$('.splash').length) {
					 clearTimeout(categoryTimer);
					 if($('.js-category-dropdown').hasClass('category-open')){
						 $('.js-category-dropdown').removeClass('category-open');
						 $('.category-menu-down', '.js-category-dropdown').toggleClass('icon-caret-up category-menu-up');
					 }
				 }
			 });
				//if(event.type == 'mouseenter') {  
				/*} else {
					if(!$('.splash').length) {
						$(this).removeClass('category-open');
						$('.category-menu-down', this).toggleClass('icon-caret-up category-menu-up');
					}
				}*/
			//});

			$(document).on('mouseenter mouseleave','.js-category',function (event) {
				if(event.type == 'mouseenter') { 
					$(this).addClass('active');
					$(this).find('.js-sub-menu').css('display', 'block');
					$(this).find('.js-sub-menu .js-category-item:first-child .sub-menu-items').fadeIn();
					$(this).find('.js-sub-menu .js-category-item:first-child .sub-menu-items .sub-menu-img').css('display', 'block');
				} else {
					$(this).removeClass('active');
					$(this).find('.js-sub-menu').css('display', 'none');
					$(this).find('.js-sub-menu .js-category-item:first-child .sub-menu-items').fadeOut();
				}
			});
		}
		else {
			$('.js-category-dropdown').on('touchstart', function (event) {
				$(this).addClass('category-open');
			});
			
			$('.js-category-item .sub-menu-parent').on('click', function () {
				if(!$(this).parent().hasClass('active')) {
					$('.sub-menu-item').removeClass('active');
					$(this).parent().addClass('active');
					$(this).parent().find('.sub-menu-items ul').slideDown();
				}
				else {
					$('.sub-menu-item').removeClass('active');
					$(this).parent().removeClass('active');
					$(this).parent().find('.sub-menu-items ul').slideUp();
				}
			});
		}

		if($(window).width() <= 1023) {
			$(document).on('touchstart','.main-menu__navigation--category-dropdown .js-category-parent', function (event) {
				if(!$(this).hasClass('active')) {
					$('.main-menu__navigation--category-dropdown .js-category-parent').removeClass('active');
					$(this).addClass('active');
					$('.main-menu__navigation--category-dropdown .js-sub-menu').hide();
					$(this).parent().find('.js-sub-menu').slideDown();
				}
				else {
					$('.main-menu__navigation--category-dropdown .js-category-parent').removeClass('active');
					$(this).parent().find('.js-sub-menu').hide();
				}
			});
		}

		$(document).on('click','.js-main-menu-back', function () {
			$('.js-category-dropdown').removeClass('category-open');
			$('.js-category-dropdown .category-menu-down').removeClass('icon-caret-up category-menu-up');
		});

		$(document).on('touchstart','.js-main-menu-back', function (event) {
			event.stopPropagation();
			event.preventDefault();
			$('.js-category-dropdown').removeClass('category-open');
			$('.js-category-dropdown .category-menu-down').removeClass('icon-caret-up category-menu-up');
		});

	});
}(DM_UI_CONFIG));
