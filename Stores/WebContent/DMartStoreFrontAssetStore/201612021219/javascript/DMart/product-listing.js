'use strict';
(function(dmUIConfig) {
	$(document).ready(function () {

		//Remember filters on page reload
		var filtersLSKey;
		if(typeof currCatalogId != "undefined" && currCatalogId != ""){
			filtersLSKey= currCatalogId.toString();
		}
		if(typeof WCParamJS.searchTerm != "undefined" && WCParamJS.searchTerm != ""){
			filtersLSKey=  WCParamJS.searchTerm;
		}
		if(typeof  WCParamJS.handledManufacturer != "undefined" && WCParamJS.handledManufacturer != ""){
			filtersLSKey= WCParamJS.handledManufacturer;
		}
		//Remember filters on page reload

		// Grid and List View
    $(document).on('click', '.plp-view-option .plp-view-option__grid', function() {
			$('.plp-view-option a').removeClass('active');
			$(this).addClass('active');
			$('.product-listing-item').removeClass('view-list-active');
			$('.product-added-to-cart .product-listing__total-items').show();
			$('.product-listing__total-items--list-view, .product-added-to-cart .product-listing__save').hide();
			$('.js-switch-view').prop('class', 'col-xs-12 col-md-4 col-lg-3 js-switch-view');
			if($('.product-listing-item').hasClass('product-added-to-cart')) {
				$('.product-added-to-cart .product-listing-item__secondary').css('display', 'none');
				if($('.product-listing-item.product-added-to-cart').hasClass('plp-apparel')) {
					$('.product-added-to-cart').find('.plp-apparel__color-pallette').hide();
					$('.product-added-to-cart').find('.plp-apparel__color-pallette-alt').show();
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
				}
			}
			productListing.updateCardsForInTrolley();
			
			$('.sizeGuide').each(function(indx,val){				
				if($(val).css('padding-bottom') != '0px'){
					$(val).css('padding-bottom','27%');
				}
			});
			
			//Remember filters on page reload
			var CookieDate = new Date();
        	CookieDate.setFullYear(CookieDate.getFullYear()+1);
			document.cookie='viewChosen=grid;expires=' + CookieDate.toGMTString( ) + ';path=/';
			/*if(DMStorage.getValue('viewChosen')){
				DMStorage.remove('viewChosen');
			}
			DMStorage.set('viewChosen',"grid");*/
			//Remember filters on page reload
			
			// Hide grocery offer card if no content to show.
			if($.trim($('.plp-grocery-offer').html()).length == 0) {	
				$('.plp-grocery-offer').parents('.js-switch-view').addClass('js-hide-show')
			}
			$('.product-listing--title').css('width','auto'); //AE-14582
		});
    
    

    $(document).on('click', '.plp-view-option .plp-view-option__list', function() {
			$('.plp-view-option a').removeClass('active');
			$(this).addClass('active');
			$('.product-listing-item').addClass('view-list-active');
			$('.product-listing__total-items').hide();
			$('.product-added-to-cart .product-listing__total-items--list-view').show();
			$('.js-switch-view').prop('class', 'col-xs-12 js-switch-view');
			if($('.product-listing-item').hasClass('product-added-to-cart')) {
				$('.product-added-to-cart .product-listing-item__secondary').css('display', 'block');
				if($('.product-listing-item').hasClass('plp-apparel')) {
					$('.product-added-to-cart').find('.plp-apparel__color-pallette').hide();
					$('.product-added-to-cart').find('.plp-apparel__color-pallette-alt').show();
				}
			}
			$('.product-listing-item').removeAttr('style');
			$('.product-listing-item__tertiary').hide();
			
			$('.sizeGuide').each(function(indx,val){
				if($(val).css('padding-bottom') != '0px'){
					$(val).css('padding-bottom','5%');
				}
			});
			
			
			
			//Remember filters on page reload
			var CookieDate = new Date();
        	CookieDate.setFullYear(CookieDate.getFullYear()+1);        	
			document.cookie='viewChosen=list;expires=' + CookieDate.toGMTString( ) + ';path=/';
			/*if(DMStorage.getValue('viewChosen')){
				DMStorage.remove('viewChosen');
			}
			DMStorage.set('viewChosen',"list");*/
			//Remember filters on page reload
			
			//$('.product-listing--title').css('width','294px');
		});

		// Price Range Slider - default
		$('.js-filter-price-range').ionRangeSlider({
			type: 'double',
			min: 0,
			max: 10000,
			from: 0,
			to: 10000,
			prefix: '<i class="icon-rupees"></i>',
			prettify_enabled: true,
			prettify_separator: ',',
			force_edges: true
		});

		// Price Range Slider - update
		$(document).on('click', '.js-filter-price-range-cta', function() {
			//$('.js-filter-price-range-cta').on('click', function() {
			$(this).closest('.filter-price .custom-range-slider').hide();
			$(this).closest('.js-price-slider').removeClass('active');
			lazyLoadActive = false;
			curPageNum = 1;

			//Remember filters on page reload
			var salePriceMin=$('.js-filter-price-range').data().from;
			var salePriceMax= $('.js-filter-price-range').data().to;
			var priceRange= salePriceMin+"-"+salePriceMax;
			if(DMStorage.getValue('priceRangeChosen_' +filtersLSKey)){
				DMStorage.remove('priceRangeChosen_' +filtersLSKey);
			}
			facetNavigationDisplay.removeFilterFromList('priceRange',priceRange);
			facetNavigationDisplay.selectedFilters.push({filterValue:priceRange,  filterType:'priceRange'});
			DMStorage.set('priceRangeChosen_' +filtersLSKey,priceRange);
			//Remember filters on page reload

			ProductHelper.init(currCatalogId.toString(),1, confListingProductCount,  WCParamJS.searchTerm);
			DMAnalytics.events( DMAnalytics.Constants.Category.Filter,'Catalog'+currCatalogId+' Price Range:'+priceRange, document.title, 0,null );
		});

		// Price Range Slider - close
		$(document).on('click', '.js-price-slider span', function() {
			//$('.js-price-slider span').on('click', function() {
			$('.filter-price .custom-range-slider').fadeIn();
			$(this).parent().addClass('active');
		});

		// Price Range Slider - close
		$('body, html').on('click touchend', function(e) {
      if($('.js-price-slider .custom-range-slider').is(':visible')) {
			var container = $('.js-price-slider span');
			if (!container.is(e.target) && container.has(e.target).length === 0 && $('.filter-price .custom-range-slider').is(':visible')) {
				$('.filter-price .custom-range-slider').css('display', 'none');
				container.parent().removeClass('active');
          $('.js-filter-price-range').data('ionRangeSlider').reset();
        }
			}
		});

		// Discount Range Slider - default
		$('.js-filter-discount-range').ionRangeSlider({
			type: 'double',
			min: 0,
			max: 100,
			from: 0,
			to: 100,
			postfix: '%',
			prettify_enabled: true,
			prettify_separator: ',',
			force_edges: true
		});

		// Discount Range Slider - update
		$(document).on('click', '.js-filter-discount-range-cta', function() {
			//$('.js-filter-discount-range-cta').on('click', function() {
			$(this).closest('.filter-discounts .custom-range-slider').hide();
			$(this).closest('.js-discount-slider').removeClass('active');
			lazyLoadActive = false;
			curPageNum = 1;

			//Remember filters on page reload. Fixed data to get exact from and to values
			var discountMin=$('.js-filter-discount-range').data().from;
			var discountMax= $('.js-filter-discount-range').data().to;
			var discountRange= discountMin+"-"+discountMax;
			if(DMStorage.getValue('discountRangeChosen_' +filtersLSKey)){
				DMStorage.remove('discountRangeChosen_' +filtersLSKey);
			}
			facetNavigationDisplay.removeFilterFromList('discountRange',discountRange);
			facetNavigationDisplay.selectedFilters.push({filterValue:discountRange,  filterType:'discountRange'});
			DMStorage.set('discountRangeChosen_' +filtersLSKey,discountRange);
			//Remember filters on page reload

			ProductHelper.init(currCatalogId.toString(),1, confListingProductCount,  WCParamJS.searchTerm);
			DMAnalytics.events( DMAnalytics.Constants.Category.Filter,'Catalog'+currCatalogId+' Discount Range:'+discountRange, document.title, 0,null );
		});

		// Discount Range Slider - close
		$(document).on('click', '.js-discount-slider span', function() {
			//$('.js-discount-slider span').on('click', function() {
			$('.filter-discounts .custom-range-slider').fadeIn();
			$(this).parent().addClass('active');
		});

		// Discount Range Slider - close
		$('body, html').on('click touchend', function(e) {
      if($('.js-discount-slider .custom-range-slider').is(':visible')) {
			var container = $('.js-discount-slider span');
			if (!container.is(e.target) && container.has(e.target).length === 0 && $('.filter-discounts .custom-range-slider').is(':visible')) {
				$('.filter-discounts .custom-range-slider').css('display', 'none');
				container.parent().removeClass('active');
          $('.js-filter-discount-range').data('ionRangeSlider').reset();
        }
			}
		});

		// Filters
		var x=1, $applyFilter, filterValue, filterType;
		$(document).on('click', '.js-filter-add a', function() {
			if($(this).attr('name') != 'category'){
				if(!$(this).hasClass('selected')) {
					$(this).addClass('selected').attr('id', 'filter-'+x).attr('rel', x);
					if($(this).parents('.js-filter-add').hasClass('js-filter-add-color')) {
						filterValue = $(this).data('filtervalue');
						filterType = $(this).data('filtertype');
						/*
						$applyFilter = '<li><a href="javascript:;" name = "'+filterType+'" title="'+filterValue+'" id="filter-apply-'+x+'" rel="'+x+'">'+'<span class="type-color" style="background-color:'+filterValue+' "></span>'+'<i class="filter-remove-cta icon-cross"></i></a></li>';
						$('.filter-applied-list').prepend($applyFilter);*/
						curPageNum = 1;
						facetNavigationDisplay.selectedFilters.push({filterValue:filterValue,  filterType:filterType});
						//Remember filters on page reload
						if(DMStorage.getValue('filtersChosen_' +filtersLSKey)){
							DMStorage.remove('filtersChosen_' +filtersLSKey);
						}
						DMStorage.set('filtersChosen_' +filtersLSKey,facetNavigationDisplay.selectedFilters);
						//Remember filters on page reload
						ProductHelper.init(currCatalogId.toString(),1, confListingProductCount,  WCParamJS.searchTerm);
						DMAnalytics.events( DMAnalytics.Constants.Category.Filter,'Catalog'+currCatalogId+' Filters:'+
								facetNavigationDisplay.selectedFilters[facetNavigationDisplay.selectedFilters.length-1].filterValue, document.title, 0,null );

					}
					else {
						filterValue = $(this).data('filtervalue');
						filterType = $(this).data('filtertype');
						/*
						$applyFilter = '<li><a href="javascript:;" name = "'+filterType+'" title="'+filterValue+'" id="filter-apply-'+x+'" rel="'+x+'"><span>'+filterValue+'</span><i class="filter-remove-cta icon-cross"></i></a></li>';
						$('.filter-applied-list').prepend($applyFilter);*/
						curPageNum = 1;
						facetNavigationDisplay.selectedFilters.push({filterValue:filterValue,  filterType:filterType});
						//Remember filters on page reload
						if(DMStorage.getValue('filtersChosen_' +filtersLSKey)){
							DMStorage.remove('filtersChosen_' +filtersLSKey);
						}
						DMStorage.set('filtersChosen_' +filtersLSKey,facetNavigationDisplay.selectedFilters);
						//Remember filters on page reload
						ProductHelper.init(currCatalogId.toString(),1, confListingProductCount,  WCParamJS.searchTerm);
						DMAnalytics.events( DMAnalytics.Constants.Category.Filter,'Catalog'+currCatalogId+' Filters:'+
								facetNavigationDisplay.selectedFilters[facetNavigationDisplay.selectedFilters.length-1].filterValue, document.title, 0,null );
					}
					x++;

				} else {
					var id = $(this).attr('rel');

					var filterValue = $(this).data('filtervalue');
					var filterType = $(this).data('filtertype');

					$('.filter-applied-list a[data-filtervalue="'+filterValue+'"][data-filtertype="'+filterType+'"]').parent().remove();
					$(this).removeClass('selected').removeAttr('id rel');
					x--;
					curPageNum = 1;
					facetNavigationDisplay.removeFilterFromList(filterType,filterValue);
					//Remember filters on page reload
					if(DMStorage.getValue('filtersChosen_' +filtersLSKey)){
						DMStorage.remove('filtersChosen_' +filtersLSKey);
					}
					DMStorage.set('filtersChosen_' +filtersLSKey,facetNavigationDisplay.selectedFilters);
					//Remember filters on page reload
					ProductHelper.init(currCatalogId.toString(),1, confListingProductCount,  WCParamJS.searchTerm);
					DMAnalytics.events( DMAnalytics.Constants.Category.Filter,'Catalog'+currCatalogId+' Filters:'+
							facetNavigationDisplay.selectedFilters[facetNavigationDisplay.selectedFilters.length-1].filterValue, document.title, 0,null );
				}

				/*if($('.filter-applied-list li').length > 0) {
					$('.filter-module__applied').slideDown();
				}
				else {
					$('.filter-module__applied').slideUp();
				}*/
			}
		});

		$(document).on('click', '.filter-applied-list .filter-remove-cta', function() {
			var name = $(this).parent().data('filtertype');
			var title = $(this).parent().data('filtervalue');

			$(this).parents('li').remove();

			if($('.filter-applied-list li').length > 0) {
				$('.filter-module__applied').slideDown();
			}
			else {
				$('.filter-module__applied').slideUp();
			}
			lazyLoadActive = false;
			curPageNum = 1;
			facetNavigationDisplay.removeFilterFromList(name,title);
			//Remember filters on page reload
			if(DMStorage.getValue('filtersChosen_' +filtersLSKey)){
				DMStorage.remove('filtersChosen_' +filtersLSKey);
			}
			DMStorage.set('filtersChosen_' +filtersLSKey,facetNavigationDisplay.selectedFilters);
			//Remember filters on page reload
			ProductHelper.init(currCatalogId.toString(),1, confListingProductCount,  WCParamJS.searchTerm);
			DMAnalytics.events( DMAnalytics.Constants.Category.Filter,'Catalog'+currCatalogId+' Filter:'+
					facetNavigationDisplay.selectedFilters[facetNavigationDisplay.selectedFilters.length-1].filterValue, document.title, 0,null );
		});

		// Product Listing Apparel Color slider
		$(document).on('click', '.plp-apparel .js-plp-color-pallette a', function() {		
			if(!$(this).parent().hasClass('disabled')) {
		        $(this).parent().parent().find('li').removeClass('selected');
		        $(this).parent().addClass('selected');
		        var pallette = $(this).attr('rel').split('-').pop();

		        $(this).parents('.plp-apparel').find('.plp-image-slider img').css('opacity', 0).removeClass('active');
		        $(this).parents('.plp-apparel').find('.plp-image-slider #plpImageSlider-'+pallette).animate({
		          opacity: 1
		        }, 600).addClass('active');
		        $(this).trigger('dmart.productcard.select.slideritem', [this]);   
		        DMAnalytics.events( DMAnalytics.Constants.Action.PLPColourSelection, "productId:"+$(this).parents('.product-listing-item').data('productid') , document.title, 0,null );
		      }
		});

		// Remove product
		$(document).on('click', '.added-product__remove a', function() {
			if($(this).parents('#myList').length==0){
			$(this).trigger('dmart.plp.remove', [this]); 
			}
		});

		//On click of cart icon, flip
		$(document).on('click', '.product-added-to-cart__icon-wrap', function() {
			var $parents = $(this).parents('.product-listing-item');
			flipCard($parents);
		});

		//Update quantity
		$(document).on('change', '.added-product__quantity-size .product-listing_update_quantity--select', function(){
			$(this).trigger('dmart.plp.update.quantity', [this]); 
		});

		//Change variant
		$(document).on('change', '.added-product__quantity .product-listing_update_itemsize--select', function(){
			$(this).trigger('dmart.plp.update.variant', [this]); 
		});

		// Add to Shopping List (selecting a list)
		$(document).on('click', '.product-listing-item__tertiary-lists a', function() {
			$(this).toggleClass('selected');
			if($(this).parents('.product-listing-item__tertiary-lists').find('a').hasClass('selected')) {
				$(this).parents('.product-listing-item__tertiary-lists').siblings('.add-list-submit-cta').addClass('active');
			}
			else {
				$(this).parents('.product-listing-item__tertiary-lists').siblings('.add-list-submit-cta').removeClass('active');
			}
		});

		// On Click of the add to list button
		$(document).on('click', '.product-listing-item .add-list-submit-cta.button.active', function() {
			$( document ).trigger( 'dmart.plp.additem.tolist', [this]);
		});

		//Method to display the applicable wishlists   
		$(document).on('click', '.product-listing__quantity--add', function() {
			if(!$(this).children().hasClass('disabled')){
			$( document ).trigger( 'dmart.freq.showList', [$(this).parent()]);
			}
		});

		// validating Add to Shopping List input field by clicking CTA button
    $(document).on('click', '.product-listing-item__tertiary--add-cta', function(e) {
// UI Integration 28-06-2016
      e.preventDefault();
			if($(this).siblings('.product-listing-item__tertiary--field').val() === '') {
				$(this).siblings('.product-listing-item__tertiary--field').css('border', '1px solid #d35400');
				return false;
			}
			else {
				$(this).siblings('.product-listing-item__tertiary--field').removeAttr('style');
				var listValue = $(this).siblings('.product-listing-item__tertiary--field').val();
				if($(this).parents('.product-listing-item__tertiary--add-list').siblings('.product-listing-item__tertiary-lists').find('ul li').length==0){
					DMartShoppingListActionsJS.createWithItem(listValue,[this]);
				}
				else{
					var noErrors = DMartShoppingListActionsJS.create(listValue,[this]);
					//$('.product-listing-item__tertiary-lists ul').prepend('<li><a class="new" href="javascript:;">'+listValue+'</a></li>');
					$('.product-listing-item__tertiary-lists .mCSB_container .new').animate({opacity: 1}, 800).removeClass('new');
					if(noErrors) {
						$(this).siblings('.product-listing-item__tertiary--field').val('');
					}
				}
			}
		});


		// click outside to close Add to Shopping List popup
		$('body, html').on('mouseup touchend', function(e) {
			var container = $('.product-listing-item__tertiary:visible');
      if(container) {
			if (!container.is(e.target) && container.has(e.target).length === 0) {
				container.css('opacity', 0).fadeOut();
        }
			}
		});

		function flipCard($parents) {
			if(!$parents.hasClass('view-list-active')) {
				$parents.find('.product-listing-item__primary').css('display', 'none');
				$parents.find('.product-listing-item__secondary').css('display', 'block');
		        $('.added-product-wrap').scrollTop(0).perfectScrollbar('update');

				var addedProductLength = $parents.find('.added-product-wrap .added-product-wrap__list').length;

				if(addedProductLength<=1) {
					$parents.find('.cart-icon').removeClass('small');
				}
				else {
					$parents.find('.cart-icon').addClass('small');
				}

				$parents.find('.product-listing--original-price, .product-listing--discounted-price, .product-listing__quantity-secondary, .product-listing__cta-container').hide();
				$parents.delay(2000).addClass('product-added-to-cart');
// UI Integration 28-06-2016
        $parents.find('.added-product-wrap ul li').removeClass('primary-border');
			}
			else {
		        $parents.find('.product-listing--original-price, .product-listing__size-guide, .product-listing--discounted-price, .product-listing__quantity-secondary, .product-listing__cta-container, .product-listing__total-items').hide();
				$parents.delay(2000).addClass('product-added-to-cart');
				$parents.find('.slides a.selected').addClass('addedToCart').removeClass('selected');
				$parents.find('.product-listing-item__secondary, .product-listing__total-items--list-view').css('display', 'block');
			}
			if($parents.hasClass('view-list-active')) {
				$('.product-added-to-cart').find('.product-listing-item__secondary').css('display', 'block');
			}
		}

		function addWeight($parents) {
			$parents.find('.product-listing-item__secondary').find('.cart-icon').addClass('small');
      $parents.find('.added-product-wrap ul').append($parents.find('.added-product-wrap__list')[0].outerHTML);
      $parents.find('.added-product-wrap ul li').removeClass('primary-border');
      $parents.find('.added-product-wrap ul li:last-child').addClass('primary-border');
			var savingText = $parents.find('.product-price__saving').html();
			savingText = savingText.replace('Your', 'Total');
			$parents.find('.product-price__saving').html(savingText);
			var scrollHeight = $parents.find('.added-product-wrap ul li:last-child')[0].offsetTop;
      $parents.find('.added-product-wrap').scrollTop(scrollHeight).perfectScrollbar('update');
		}

		//Add to cart from secondary page
		$(document).on('change', '.add-product-other-quantity .product-listing__quantity--select', function(){
			$(this).trigger('dmart.plp.addtocart.secondary', [this]);   
		});

		//Add to cart from tertiary page
		$(document).on('change', '.product-listing-details .product-listing__quantity-other--select', function(){
			$(this).trigger('dmart.plp.addtocart.tertiary', [this]);
		});

		//Add to cart from primary page
		$(document).on('click', '.product-listing__cta-button', function() {  
			if($(this).hasClass('button--disabled') || $(this).hasClass('ADDED')) {
				return;
			}
			 $(this).addClass('ADDED'); //.unbind('click');
	         $(this).empty();
			 var strVar="";
			 strVar += "<span class=\"added-animated\"><i class=\"icon-cart-added\"><\/i> Added<\/span>";
			 $(this).append(strVar);
			
			$(this).trigger('dmart.plp.addtocart.primary', [this]);    	
			if($(this).parents('#topCategoryOffers').length>0){
				var categoryName=$(this).parents('.landing-non-tabs').find('ul.resp-tabs-list li').text();
				DMAnalytics.events( DMAnalytics.Constants.Action.ATCTopCat, "Category Name: "+categoryName, document.title, 0,null );
			}
		});

		$(document).on('click', '.product-listing-details .slider-variant .slides a', function() {
			if(!$(this).hasClass('disabled') && !$(this).hasClass('addedToCart')) {
				$(this).parent().siblings().children('.selected').removeClass('selected');
				$(this).toggleClass('selected');
				if($(this).hasClass('selected')){
					$(this).parents().siblings('.product-listing__cta-container').show();
					$(this).parents('.product-listing-item__primary').find('.product-listing--image').addClass('small');
				}else{
					$(this).parents().siblings('.product-listing__cta-container').hide();
					$(this).parents('.product-listing-item__primary').find('.product-listing--image').removeClass('small');
				}        

			}
			if($(this).parent().parent().find('.selected').length <=0) {
		        $(this).parents('.product-listing-details').find('.product-listing__cta-container').hide();
		        $(this).parents('.product-listing-item__primary').find('.product-listing--image').removeClass('small');
		    }
			$(this).trigger('dmart.productcard.select.slideritem', [this]);         
		});

		$(document).on('click', '.plp-apparel .plp-apparel__cta-button', function() {
			 if($(this).hasClass('button--disabled') || $(this).hasClass('ADDED')) {
				return;
			 }
			 $(this).addClass('ADDED');//.unbind('click');
	         $(this).empty();
			 var strVar="";
			 strVar += "<span class=\"added-animated\"><i class=\"icon-cart-added\"><\/i> Added<\/span>";
			 $(this).append(strVar);
			$(this).trigger('dmart.plp.addtocart.primary', [this]);
		});

		$('body, html').on('mouseup touchend', function(e) {
			var containerArray = $('.product-listing-item__secondary:visible');
			containerArray.each(function(index, container){
			if (!$(container).is(e.target) && $(container).has(e.target).length === 0) {
				if(!$(container).parents('.product-listing-item').hasClass('view-list-active')) {
					
				    if($(container).siblings('.product-listing-item__primary').find('.plp-card--offer-text').css('display') == 'block'){
				    	$(container).siblings('.product-listing-item__primary').find('.product-listing--image').addClass('small');
				    }else{
				    	$(container).siblings('.product-listing-item__primary').find('.product-listing--image').removeClass('small');
				    }
				    $(container).siblings('.product-listing-item__primary').css('display', 'block');
					$(container).css('display', 'none');
					var productId= $(container).parents('.product-listing-item').data('productid');
					if($(container).parents('.product-listing-item').hasClass('plp-apparel')) {
						if(typeof productId != 'undefined' && typeof productListing != 'undefined' && typeof productListing.products[productId] != 'undefined'){
							if(productListing.products[productId].totalQtyInCart > 0){
								var item = productListing.products[productId].currentItemInCart;
								var colour= productListing.products[productId].itemDetails[item].definingAttributes.Colour;
								var size= productListing.products[productId].itemDetails[item].definingAttributes.Size;
								$(container).parents('.product-listing-item').find('.slider-variant li a').each(function(){
									$(this).removeClass('selected');
									$(this).html($(this).attr('title'));
									if($(this).attr('title') === size){
										//$(this).addClass('selected');
									}
								});
								
								$(container).parents('.product-listing-item').find('.slider-variant li a.selected').each(function(){
									$(this).html(size+' <span>('+productListing.products[productId].itemDetails[item].qtyInCart+')</span>');
								});
								
								$(container).parents('.product-listing-item').find('.plp-apparel__color-pallette li').each(function(){
									$(this).removeClass('selected');
									if($(this).data('color') === colour){
										$(this).addClass('selected');
									}
								});
								
								// Fix for AE-16682 STARTS
								var $parent = $(container).parents('.product-listing-item').find('.slider-variant ul.slides');
								$parent.html("");

								var countVariants = 0; // Variants for this color
								$.each(productListing.products[productId].itemDetails,function (index,itemDetail){
									          if(itemDetail.definingAttributes.Colour == colour){
									        	  $($parent).append('<li><a href="javascript:;" title="'+itemDetail.definingAttributes.Size+'">'+itemDetail.definingAttributes.Size+'</a></li>');
									        	  countVariants++;
											  }
								});
						    	// Apply special classes
						    	if(countVariants==1){
					       			$($parent).find('li').addClass("one-variant");
					       		}else if (countVariants==2){
					       			$($parent).find('li').addClass("two-variant");
					       		}else if (countVariants==3){
					       			$($parent).find('li').addClass("three-variant");
					       		}  
										    	
						   		var $slider = $('.product-listing-item[data-productid='+productId+'] .slider-variant');
						   		if($slider.data('flexslider')) {
						    	var clone = $slider.find('.slides li:last-child').clone();
						    	$slider.find('.slides li:last-child').remove();
						    	//$slider.data('flexslider',this);
						    		$slider.data('flexslider').addSlide(clone);
						    	}
						    	$slider.find('.flex-direction-nav li a').removeClass('disabled');
						    	var count = $slider.find('.slides li').length;
						    	if(count <= 3) {
						    		$slider.find('.flex-direction-nav li a').addClass('disabled');
							    } else {
							    	$slider.find('.flex-direction-nav li a').removeClass('disabled');
							    }
						    	//$(primaryContainer).find('.product-listing__cta-container').hide();
						    	productListing.checkInventoryForApparel(productId, $(container).parents('.product-listing-item').find('.plp-apparel__color-pallette'));
								// Fix for AE-16682 ENDS 
						    	
								$.each(productListing.products[productId].itemDetails,function (index,itemDetail){
									if(itemDetail.qtyInCart > 0 && itemDetail.definingAttributes.Colour == colour){
										$(container).parents('.product-listing-item').find('.slider-variant li a').each(function(){
											if($(this).attr('title') === itemDetail.definingAttributes.Size && !$(this).hasClass('selected')){
												$(this).html(itemDetail.definingAttributes.Size+' <span>('+itemDetail.qtyInCart+')</span>');
												$(this).addClass('addedToCart');
											}
										});
									}
								});
							}
						}
					}
					$(container).parents('.product-listing-item').find('.added-product-details').show();
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
					$(container).parents('.product-listing-item').find('.plp-apparel__color-pallette').hide();
					$(container).parents('.product-listing-item').find('.plp-apparel__color-pallette-alt').show();
				}
			}
			});
		});

		function flipAdded() {
			var containerArray = $('.product-listing-item__secondary:visible');
			containerArray.each(function(index, container){
			if(!$(container).parents('.product-listing-item').hasClass('view-list-active')) {
				$(container).siblings('.product-listing-item__primary').css('display', 'block');
				$(container).parents('.product-listing-item').find('.product-listing__save, .product-listing__size-guide').hide();
				$(container).css('display', 'none');
				$(container).parents('.product-listing-item').find('.added-product-details').show();
				$(container).parents('.product-listing-item').find('.slider-variant').resize();
				$(container).parents('.product-listing-item').find('.plp-apparel__color-pallette').hide();
				$(container).parents('.product-listing-item').find('.plp-apparel__color-pallette-alt').show();
			}
			
			var productId= $(container).parents('.product-listing-item').data('productid');
			if($(container).parents('.product-listing-item').hasClass('plp-apparel')) {
				if(typeof productId != 'undefined' &&  typeof productListing != 'undefined' && typeof productListing.products[productId] != 'undefined'){
					if(productListing.products[productId].totalQtyInCart > 0){
						var item = productListing.products[productId].currentItemInCart;
						var colour= productListing.products[productId].itemDetails[item].definingAttributes.Colour;
						var size= productListing.products[productId].itemDetails[item].definingAttributes.Size;
						$(container).parents('.product-listing-item').find('.slider-variant li a').each(function(){
							$(this).removeClass('selected');
							$(this).html($(this).attr('title'));
							if($(this).attr('title') === size){
								//$(this).addClass('selected');
							}
						});
						$(container).parents('.product-listing-item').find('.slider-variant li a.selected').each(function(){
							$(this).html(size+' <span>('+productListing.products[productId].itemDetails[item].qtyInCart+')</span>');
						});
						$(container).parents('.product-listing-item').find('.plp-apparel__color-pallette li').each(function(){
							$(this).removeClass('selected');
							if($(this).data('color') === colour){
								$(this).addClass('selected');
							}
						});
						$.each(productListing.products[productId].itemDetails,function (index,itemDetail){
							if(itemDetail.qtyInCart > 0 && itemDetail.definingAttributes.Colour == colour){
								$(container).parents('.product-listing-item').find('.slider-variant li a').each(function(){
									if($(this).attr('title') === itemDetail.definingAttributes.Size && !$(this).hasClass('selected')){
										console.log("productId="+productId+"::size="+itemDetail.definingAttributes.Size);
										$(this).html(itemDetail.definingAttributes.Size+' <span>('+itemDetail.qtyInCart+')</span>');
										$(this).addClass('addedToCart');
									}
								});
							}
						});
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
					}
				}   
			}
		});
		}

    //fliping card after scroll
    $(window).scroll( $.throttle( 250, flipAdded ) );

		var myVar;
		$(document).on('mouseleave','.product-listing-item__secondary', function() {
			myVar = setInterval(function(){
				flipAdded();
			}, 4000);
		});

		$(document).on('mouseenter','.product-listing-item__secondary', function() {
			clearInterval(myVar);
		});
		
		$(document).on('click','.filter-add-baner__close',function(){
			$('.filter-add-baner').fadeOut(300);
			facetNavigationDisplay.overlay=false;
			DMAnalytics.events( DMAnalytics.Constants.Category.Filter, DMAnalytics.Constants.Action.FacetBannerClose, document.title, 0,null );
		});
		
		$(document).on('click','.filter-add-baner__holder',function(){
			DMAnalytics.events( DMAnalytics.Constants.Category.Filter, DMAnalytics.Constants.Action.FacetClick, document.title, 0,null );
		});
		
		$(document).on('click','#productInformation', function(event) {
			DMAnalytics.events( DMAnalytics.Constants.Action.PDPTabClick,$('#productInformation').find('.resp-tab-item.hor_1.resp-tab-active').html() , document.title, 0,null );    	
		});

		$(document).on('change', '.js-filter-sortby', function() {
			//if($('.js-filter-sortby').val() > 0 ){
				lazyLoadActive = false;
				curPageNum = 1;

				//Remember filters on page reload
				if(DMStorage.getValue('sortOptionChosen_' +filtersLSKey)){
					DMStorage.remove('sortOptionChosen_' +filtersLSKey);
				}
				DMStorage.set('sortOptionChosen_' +filtersLSKey,$('.js-filter-sortby').val());
				//Remember filters on page reload

				ProductHelper.init(currCatalogId.toString(),1, confListingProductCount,  WCParamJS.searchTerm);
				DMAnalytics.events( DMAnalytics.Constants.Category.Filter, 'Catalog'+currCatalogId+' Sort:'+$('.js-filter-sortby option:selected').text(), document.title, 0,null );
			//}
		});
		
		$(document).on('change', '.filter-sortby', function() {
			if($(this).parents().hasClass('filter-price') && $(this).parents().hasClass('filter-mobile-view')){
				var minVal= $(this).find("option:selected").data('min');
				var maxVal= $(this).find("option:selected").data('max');
				if (typeof minVal != 'undefined' && typeof maxVal != 'undefined'){
					lazyLoadActive = false;
					curPageNum = 1;

					//Remember filters on page reload
					var priceRange= minVal+"-"+maxVal;
					if(DMStorage.getValue('priceRangeChosen_' +filtersLSKey)){
						DMStorage.remove('priceRangeChosen_' +filtersLSKey);
					}
					facetNavigationDisplay.removeFilterFromList('priceRange',priceRange);
					facetNavigationDisplay.selectedFilters.push({filterValue:priceRange,  filterType:'priceRange'});
					DMStorage.set('priceRangeChosen_' +filtersLSKey,priceRange);
					//Remember filters on page reload

					ProductHelper.init(currCatalogId.toString(),1, confListingProductCount,  WCParamJS.searchTerm);
					DMAnalytics.events( DMAnalytics.Constants.Category.Filter,'Catalog'+currCatalogId+' Price Range:'+priceRange, document.title, 0,null );
				}
			}
			if($(this).parents().hasClass('filter-discounts') && $(this).parents().hasClass('filter-mobile-view')){
				var minVal= $(this).find("option:selected").data('min');
				var maxVal= $(this).find("option:selected").data('max');
				if (typeof minVal != 'undefined' && typeof maxVal != 'undefined'){
					lazyLoadActive = false;
					curPageNum = 1;

					//Remember filters on page reload
					var discountRange= minVal+"-"+maxVal;
					if(DMStorage.getValue('discountRangeChosen_' +filtersLSKey)){
						DMStorage.remove('discountRangeChosen_' +filtersLSKey);
					}
					facetNavigationDisplay.removeFilterFromList('discountRange',discountRange);
					facetNavigationDisplay.selectedFilters.push({filterValue:discountRange,  filterType:'discountRange'});
					DMStorage.set('discountRangeChosen_' +filtersLSKey,discountRange);
					//Remember filters on page reload

					ProductHelper.init(currCatalogId.toString(),1, confListingProductCount,  WCParamJS.searchTerm);
					DMAnalytics.events( DMAnalytics.Constants.Category.Filter,'Catalog'+currCatalogId+' Discount Range:'+discountRange, document.title, 0,null );
				}
			}
		});
	});
}(DM_UI_CONFIG));
