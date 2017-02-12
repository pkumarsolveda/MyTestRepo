(function(dmUIConfig) {
	$(document).ready(function () {
		var highCounter = 0;
		$('.dropdown-signin').on('click', function () {

			if($( window ).width() <= 768 ) {

				window.location.href = $('#SignInURL').val();

			}
			else {
				//Change the URL to https
				GlobalLoginJS.InitHTTPSecure('Header_GlobalLogin');
				requestSubmitted=false;
				$(this).toggleClass('opened');
				$('.form .form__input, .form .form__input--mobile').removeClass('form__input--error');

				if($(this).hasClass('opened')) {
					$(this).parent().find('.dropdown-register').removeClass('opened');
					$(this).parent().find('.header-dropdown--register').hide();
					$(this).parent().find('.header-dropdown--signin').fadeIn();
				}
				else {
					$(this).parent().find('.header-dropdown--signin').hide();
				}
			}
		});

		$('.dropdown-register').on('click', function () {

			if($( window ).width() <= 768 ) {

				window.location.href = $('#RegisterURL').val();

			} else {
				GlobalLoginJS.InitHTTPSecure('Header_GlobalLogin','register');   
				$(this).toggleClass('opened');
				$('.form .form__input, .form .form__input--mobile').removeClass('form__input--error');

				if($(this).hasClass('opened')) {
					$(this).parent().find('.dropdown-signin').removeClass('opened');
					$(this).parent().find('.header-dropdown--signin').hide();
					$(this).parent().find('.header-dropdown--register').fadeIn();
				}
				else {
					$(this).parent().find('.header-dropdown--register').hide();
				}
			}
		});

		$('.main-menu__cart-mini').on('click', function () {
			if($( window ).width() <= 1024 ) { 	      	
				window.location.href = $('#cartURL').val();       	  
			}
		});
		//$('.dropdown-minicart').on('click', function () {
		var cartTimer;
		$('.dropdown-minicart, .cart-wrap .cart-icon').hover( function () {
			if($( window ).width() <= 768 ) { 	      	
				window.location.href = $('#cartURL').val();       	  
			}else {
				cartTimer = setTimeout(function(){
					 $('.dropdown-minicart').addClass('opened');
					 if($('.dropdown-minicart').hasClass('opened')) {
						 if(!MiniCartDisplay.miniCartRendered) {
								MiniCartDisplay.renderMiniCart();
						 }
						 $('.dropdown-minicart').parent().find('.header-dropdown--minicart').fadeIn();
						 $('.cart-details__scroll').perfectScrollbar('update');
						 if($('.cart-wrap .cart-details-dropdown').data('selectric')) {
								$('.cart-wrap .cart-details-dropdown').selectric('destroy');
						 }
						 DMAnalytics.events( DMAnalytics.Constants.Action.MiniCartClick,DMAnalytics.Constants.Category.MiniCart, document.title, 0, null);
					 }
					 else {
						 $('.dropdown-minicart').parent().find('.header-dropdown--minicart').hide();
					 }
				}, 100);
			}
			}, function(){
				clearTimeout(cartTimer);
		});

		$('.js-myaccount-dropdown').on('click', function () {
			$(this).toggleClass('opened');
			clearTimeout(cartTimer);
			if($(this).hasClass('opened')) {
				$(this).parent().find('.header-dropdown--myaccount').fadeIn();
			}
			else {
				$(this).parent().find('.header-dropdown--myaccount').hide();
			}
		});

		//close suggestions on focusout, esc key and click out
		$('body, html').on('mouseup touchend keyup', function(e) {
			var container = $('.dropdown-register, .header-dropdown--register');
			if($('.header-dropdown--register').is(':visible')) {
				if ((!container.is(e.target) && container.has(e.target).length === 0) || e.which === 27) {
					container.removeClass('opened');
					container.parent().find('.header-dropdown--register').hide();
				}
			}
		});

		//close suggestions on focusout, esc key and click out
		$('body, html').on('mouseup touchend keyup', function(e) {
			var container = $('.dropdown-signin, .header-dropdown--signin');
			if($('.header-dropdown--signin').is(':visible')) {
				if ((!container.is(e.target) && container.has(e.target).length === 0) || e.which === 27) {
					container.removeClass('opened');
					container.parent().find('.header-dropdown--signin').hide();
				}
			}
		});

		$(document).on('keydown','.js-search-field,.search-toolbar__field',function(event){
			if(event.which === 13) {
				var searchTerm = $.trim($(event.target).val());
				if(searchTerm.length>0) {
					var path = window.location.pathname;
					var urlPrefix = 'http://'+window.location.hostname+path.substring(0,path.lastIndexOf('/'))+'/';
					document.location.href = urlPrefix+"SearchDisplay?storeId="+WCParamJS.storeId+"&langId="+WCParamJS.langId+"&catalogId="+WCParamJS.catalogId+"&searchTerm="+encodeURIComponent(searchTerm.replace('&amp;','&'));
				}
			}

		});
		$(document).on('click','.my-list-search-toolbar .search-toolbar__cta',function(){
			var searchTerm = $.trim($('.my-list-search-toolbar .search-toolbar__field').val());
			if(searchTerm.length>0) {
				var path = window.location.pathname;
				var urlPrefix = 'http://'+window.location.hostname+path.substring(0,path.lastIndexOf('/'))+'/';
				document.location.href = urlPrefix+"SearchDisplay?storeId="+WCParamJS.storeId+"&langId="+WCParamJS.langId+"&catalogId="+WCParamJS.catalogId+"&searchTerm="+searchTerm;
			}
		});
		var autosuggestKeypressTimer;
		var gridBreakpointsLg = 1000;
		if ($(window).width() >= gridBreakpointsLg) {
			//enlarging search box
			$('.js-search-field').on('keyup', function(event) {
				if(autosuggestKeypressTimer) {
					window.clearTimeout(autosuggestKeypressTimer);
				}
				if(event.which >= 37  && event.which <= 40 ) {
					return;
				}

				$(this).addClass('active');

				if($.trim($(this).val()).length > 2 && event.which !== 13  ) {
					//$('.header-dropdown--search').html('');	
					var searchTermNow = $(this).val();
					autosuggestKeypressTimer = window.setTimeout(function(){
					SearchHelper.autosuggest(searchTermNow,true)
					},100);
					highCounter = 0;
					$(this).parents('.header-component__primary').find('.delivery-code__label, .delivery-code__pin, .delivery-code__label-choose, .delivery-code__label-choose-location, .icon-delivery-caret-down, .cart-price-label').css({
						display: 'none',
						opacity: 0
					});
					$(this).next('i.icon-search-voice').addClass('active');
					$('.js-class-delivery-downdown, .js-class-cart-downdown').removeClass('col-lg-3 col-lg-2').addClass('col-lg-1');
					if($('.js-header-container').hasClass('header-sticky')) {
						$('.js-class-alt-search').removeClass('col-lg-6').addClass('col-lg-9');
					}
					else {
						$('.js-class-alt-search').removeClass('col-lg-6').addClass('col-lg-10');
						$('.js-class-alt-search').css("marginRight","30px")
					}

					$('.delivery-code .icon-delivery-location, .delivery-code__label-choose, .delivery-code__label-choose-location, .cart-wrap, .avatar').addClass('active');
					$(this).parent().find('.header-dropdown').delay(400).slideDown('fast', function () {
						$(this).parents().find('.header-dropdown .search-dropdown').perfectScrollbar('update');
					});

				}
				else {
					$(this).parent().find('.header-dropdown').slideUp('fast');
				}
			});
		}

		//close header search dropdown on focusout, esc key and click out
		$('body, html').on('mouseup touchend keyup', function(e) {
			var container = $('.js-search-field, .header-dropdown--search');
			if($('.header-dropdown--search').is(':visible') || $('.search-toolbar__field.js-search-field').hasClass('active')) {
				if ((!container.is(e.target) && container.has(e.target).length === 0) || e.which === 27) {
					$('.header-dropdown--search').slideUp('fast');
					$('.js-class-alt-search').removeClass('col-lg-9 col-lg-10').addClass('col-lg-6');
					$('.js-class-alt-search').css("marginRight","");

					setTimeout(function(){
						$('.header-component__primary').find('.delivery-code__label, .delivery-code__pin, .icon-delivery-caret-down, .cart-price-label').show().animate({
							opacity: 1
						}, 450);

						if($('.splash').length) {
							$('.header-component__primary').find('.delivery-code__label-choose, .delivery-code__label-choose-location').show().animate({
								opacity: 1
							}, 450);
						}
						$('i.icon-search-voice').removeClass('active');
						if($('.js-header-container').hasClass('header-sticky')) {
							$('.js-class-delivery-downdown').removeClass('col-lg-1').addClass('col-lg-2');
						}
						else{
							$('.js-class-delivery-downdown').removeClass('col-lg-1').addClass('col-lg-3');
						}
						$('.js-class-cart-downdown').removeClass('col-lg-1').addClass('col-lg-3');

						$('.delivery-code .icon-delivery-location, .cart-wrap, .avatar').removeClass('active');
						$('.search-toolbar__field.js-search-field').removeClass('active');

					}, 320);
				}
			}
		});

		//close mini cart on focusout, esc key and click out
		$('body, html').on('mouseup touchend keyup', function(e) {
			if($('.header-dropdown--minicart').is(':visible')) {
				var container = $('.dropdown-minicart, .header-dropdown--minicart');
				if ((!container.is(e.target) && container.has(e.target).length === 0) || e.which === 27) {
					container.removeClass('opened');
					container.parent().find('.header-dropdown--minicart').hide();
				}
			}
		});

		//close myaccount dropdown on focusout, esc key and click out
		$('body, html').on('mouseup touchend keyup', function(e) {
			if($('.header-dropdown--myaccount').is(':visible')) {
				var container = $('.js-myaccount-dropdown, .header-dropdown--myaccount');
				if ((!container.is(e.target) && container.has(e.target).length === 0) || e.which === 27) {
					container.removeClass('opened');
					container.parent().find('.header-dropdown--myaccount').hide();
				}
			}
		});


		$('.form__input[name=logonPassword]').on('keydown',function(event) {
			if(event.which == 13) {
				setDeleteCartCookie();
				CartHelper.deleteCartCookie();
				GlobalLoginJS.deleteLoginCookies();
				GlobalLoginJS.submitGLSignInForm($(this).parents('form').attr('id'),'0');
				DMAnalytics.events( DMAnalytics.Constants.Category.SignIn, DMAnalytics.Constants.Action.SignIn, document.title, 0, null);
			}
		});

		$('.form__input[name=guestOrderId]').on('keydown',function(event) {
			if(event.which == 13) {
				orderStatus.validateOrderAndMemberId(document.guestOrderDetails);
			}
		});

		$('.form__input[name=guestMobileNumber]').on('keydown',function(event) {
			if(event.which == 13) {
				orderStatus.validateOrderAndMemberId(document.guestOrderDetails);
			}
		});

		$(document).on('click', '#searchBox .search-toolbar__cta', function(e) {
			var str = $.trim($('#searchBox .search-toolbar__field').val());
			if(str.length === 0) {
				e.preventDefault(); //prevent the submit if length = 0
			}
		});


		$('.search-toolbar__field.js-search-field').on("keyup", function(event){
			var scroll,distance = $('.header-dropdown--search > ul > li').height();
			var $container = $('.search-dropdown');
			if($('.header-dropdown--search').is(':visible') && (event.which == 40)){
				if(highCounter < $('.header-dropdown--search > ul > li').length){
					clearHighlight();
					highCounter ++;
					highlightFromSearch(highCounter);
					if(($('.header-dropdown--search > ul > li').length > 4) && highCounter > 2){
						scroll = $container.scrollTop() + distance;
						$container.scrollTop(scroll);
					}
				}
			}
			else if($('.header-dropdown--search').is(':visible') && (event.which == 38)){
				if(highCounter > 1){
					clearHighlight();
					highCounter --;
					highlightFromSearch(highCounter);
					scroll = $container.scrollTop() - distance;
					$container.scrollTop(scroll);
				}
			}
		});

		function highlightFromSearch(ctr){
			$('#item'+ctr).addClass('search-highligh-item');
			//document.getElementById("item"+ctr).className += 'search-highligh-item';
		}

		function clearHighlight(){
			$('.header-dropdown--search > ul > li').removeClass('search-highligh-item');
			/*document.getElementById("item1").className = '';
		document.getElementById("item2").className = '';
		document.getElementById("item3").className = '';
		document.getElementById("item4").className = '';
		document.getElementById("item5").className = '';
		document.getElementById("item6").className = '';*/

		}
	});
}(DM_UI_CONFIG));
