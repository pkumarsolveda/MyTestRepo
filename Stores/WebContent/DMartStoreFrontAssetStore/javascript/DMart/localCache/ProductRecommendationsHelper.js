/**
 * Helper class for rendering recommendation products to 
 * PDP page. 
 * 
 * Assumption: before invoking this, product attributes will be set in local storage. 
 * 				( for non HTML 5 browser pass the product JSON)
 * 
 *  
 *  Inputs : Key ( key for getting the product details from Local storage)
 *  	   : divId ( place holder to render the compiled HTML
 *  	   : prodJson ( for non HTML 5 browsers)
 *  			format Products [{attributes},[items{item attribute}]]
 * 
 */
var productsRecommendation = {
		
		pageid : {
					storeId:  $('#storeId').val() || '10151'
					//productId : 
				 },
		
	/**
	 * Entry point to the js class
	 */
		init : function(catalogID,products,upsellProducts, recommProducts, divId, prodJSON) {
			
			var JSONdata = {};
			if(upsellProducts != null && upsellProducts.length > 0){
				JSONdata.upProduct = this.upsellingProducts = productListing.createJSON(upsellProducts);
				JSONdata.upsellProductIds = this.upsellProductIds = upsellProducts;
				JSONdata.productCount=upsellProducts.length;
				if(divId === 'prodRecommendations'){
					$("#upsellProdCount").val(upsellProducts.length);
				}
			}
				
			if(recommProducts != null && recommProducts.length > 0){
				JSONdata.recProduct  = this.recommendedProducts = productListing.createJSON(recommProducts);
				JSONdata.recommProductIds = this.recommProductIds = recommProducts;
				JSONdata.productCount=recommProducts.length;
				if(divId === 'prodRecommendations'){
			    	$("#recommendationProdCount").val(recommProducts.length);
				}
			}
			
			if (products != null && products.length > 0){
				JSONdata.product = this.frequentProducts = productListing.createJSON(products);
				JSONdata.productIds = this.productIds = products;
				JSONdata.productCount=products.length;
			}	
			var imgUrl= WCParamJS.imageServerHost;
			this.config= {'baseUrl':window.location.origin+'/webapp/wcs/stores/servlet/'};
			JSONdata.config=this.config;
			JSONdata.type=divId;
			JSONdata.outofstock=false;
			JSONdata.maxnumber=5;
			JSONdata.catalogId = WCParamJS.catalogId;
			JSONdata.storeId = WCParamJS.storeId;
			JSONdata.noImagePath=WCParamJS.staticServerHost+'images/DMart/NoImage_M.jpg';
			nunjucks.configure(WCParamJS.staticServerHost+'templates/',{ autoescape: true, web : {useCache:true} });
			var htmlcode;
			if((divId === 'upselling' && (upsellProducts.length > 0 ||recommProducts.length > 0)) || (divId === 'prodRecommendations')){
				htmlcode = nunjucks.render('_modules/up-selling-products.nunjucks', {data:JSONdata});	
				$('#recommendations').css('display', 'block');
			}else if (divId === 'frequent' && products.length > 0){
				htmlcode = nunjucks.render('_modules/frequently-bought-products.nunjucks', {data:JSONdata});
			}
			renderRupeeSymbolInDropDown();
			if((divId === 'upselling' && (upsellProducts.length > 0 ||recommProducts.length > 0)) || (divId === 'prodRecommendations')){
				$('#'+divId).append(htmlcode);	
				if(divId === 'prodRecommendations'){
					$('#noResultsContent').css('display', 'block');
				}
			}else if (divId === 'frequent' && products.length > 0){
				$('#'+divId).html(htmlcode);
				$('#frequentlyPurchased').css('display', 'block');
			}
			
			$('.js-carousel').flexslider({
			      selector: '.slides:first > li',
			      animation: 'slide',
			      animationLoop: false,
			      slideshow: false,
			      controlNav: false,
			      reverse: false,
			      itemWidth: 218,
			      itemMargin: 20,
			      minItems: 1,
			      maxItems: 4,
			      customDirectionNav: $('.carousel-navigation a'),
			      start: function (index) {
			    	   $('.js-carousel .flex-viewport').css('overflow', 'hidden');
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

			
			$('.md-custom-select .cart-details-dropdown, .js-filter-sortby, .product-details .product-details__btn-quantity select, .product-listing__quantity-secondary select, .add-product-other-quantity select').selectric();
			$('.product-listing-item__secondary .add-product-other-quantity select').selectric('destroy');
		    $('.resp-tabs-container .add-product-other-quantity select, .resp-tabs-container .product-listing__quantity-secondary select').selectric('destroy').parent().addClass('custom-dropdown');
		    $('.md-custom-select select').selectric().parents('.md-custom-select').removeClass('custom-dropdown'); 
		    
		    if((divId === 'upselling' || divId === 'prodRecommendations') && (upsellProducts === null || upsellProducts === undefined || upsellProducts.length<1)){
		    	if(recommProducts !=null && recommProducts.length>0){
		    		$('#recommHead').trigger('click');
			    	$( "#upSellHead").hide();
			    	var headingValues =$('#upselling .resp-accordion');
			    	$.each(headingValues,function(elementCount,element){
			    			if($(element).text() == 'Up Selling Products'){
			    				$(element).hide();
			    			}
			    	});			    	
			    	this.renderPageCount('recommHead');	
		    	}else{
		    		$( "#upSellHead").hide();
		    		var headingValues =$('#upselling .resp-accordion');
			    	$.each(headingValues,function(elementCount,element){
			    			if($(element).text() == 'Up Selling Products'){
			    				$(element).hide();
			    			}
			    	});
		    		$( "#recommHead").hide();
		    		var headingValues =$('#upselling .resp-accordion');
			    	$.each(headingValues,function(elementCount,element){
			    			if($(element).text() == 'Recommended Products '){
			    				$(element).hide();
			    			}
			    	});
		    		$('.carousel-navigation .flex-prev').hide();
					$('.carousel-navigation .flex-next').hide();
					$('#tab1Widget').hide();
		    	}
				
			}else if((divId === 'upselling' || divId === 'prodRecommendations') && (upsellProducts != null && upsellProducts.length>0)){
				this.renderPageCount('upSellHead');
			}
		    if((divId === 'upselling' || divId === 'prodRecommendations') && (recommProducts == null || recommProducts.length <= 0)){
				$( "#recommHead").css('display', 'none');
			}
		    
		    $('.tabButtonContainer').hide();
			$('.margin-true').find('div[role=tabpanel]').css('border','0px');
			$('.product-listing__quantity--select-quantity').selectric();
			
			
			if(this.upsellingProducts != null && this.upsellingProducts != undefined && (divId === 'upselling' || divId === 'prodRecommendations')){
				this.updateCartDetails(JSONdata.upProduct,'UPSELL');
				this.updateCardsForInTrolley(JSONdata.upProduct,'UPSELL');
			}
			if(this.recommendedProducts != null && this.recommendedProducts != undefined && (divId === 'upselling' || divId === 'prodRecommendations')){
				this.updateCartDetails(JSONdata.recProduct,'RECOMMENDATION');
				this.updateCardsForInTrolley(JSONdata.recProduct,'RECOMMENDATION');
			}
			/*if(this.frequentProducts != null && this.frequentProducts != undefined && divId === 'frequent'){
				this.updateCartDetails(JSONdata.product,'FREQ');
				this.updateCardsForInTrolley(JSONdata.product,'FREQ');
			}*/
			$('.product-listing__quantity-primary .slider-variant').flexslider({
		          animation: 'slide',
		          animationLoop: false,
		          itemWidth: 48,
		          itemMargin: 1,
		          slideshow: false,
		          controlNav: false,
		          reverse: false,
		          minItems: 2,
		          maxItems: 3,
		          prevText: '<i class="icon-caret-left"></i>',
		          nextText: '<i class="icon-caret-right"></i>',
		          move: 1
		        });
			if(divId === 'prodRecommendations'){
				$('#prodRecommendations').ready(function(){
					$('.filter-module').css('display', 'none');
					$('#pricediscountsort').css('display', 'none');
					$('.breadcrumbs').css('display', 'none');		
		        });
			}			
		},
		
		renderPageCount: function (divId) {
			var activeTab = $('#headerId .resp-tab-active').data('type');
			var recCount = $("#recommendationProdCount").val();
			var upCount = $("#upsellProdCount").val();
			var min=0;
			var max=4;
			if(divId === 'upSellHead'){
				var total=upCount;
			}	
			else if (divId === 'recommHead'){
				var total=recCount;
			}
			if(total > max){
				min = max;
				max = total;
			}else{
				min=total;
				max=total;
			}
			if((min !=0 && min != '') && (max !='') && (max !=0)){
				var htmlCode = 'Showing ' + min + ' out of '+ max;
				$('.countClass').html(htmlCode);
			}
			
			if((min !=0 && min != '') && (max !='') && max<5){
				$('.carousel-navigation .flex-prev').hide();
				$('.carousel-navigation .flex-next').hide();
			}else{
				$('.carousel-navigation .flex-prev').show();
				$('.carousel-navigation .flex-next').show();
			}	
		},
		
		
		 updateCartDetails :  function(products,fromSection) {
		        var cartJSON = DMStorage.getValue('OrderId');
		        var itemTimeStamp = null;
		        
		        if(cartJSON === null) {
		              return;
		        }
		        if(typeof cartJSON != 'undefined' && typeof cartJSON.orderItems != 'undefined' ){
		        $.each(cartJSON.orderItems,function(indx,orderItem) {
		              $.each(products,function(indx,product) {
		            	  var productId = product.productId;
		            	  var productSection = findProductSection(productId);
		            	  //console.log('fromSection:'+fromSection+', productId:'+productId+', productSection:'+productSection);
							if(productSection === fromSection){
								itemTimeStamp = null;
							    var thisCatentryId = orderItem.catentryId;
							    if(product.itemDetails && product.itemDetails[thisCatentryId]) {
							    	  var qty = parseInt(orderItem.quantity);
							          product.itemDetails[thisCatentryId].qtyInCart = qty;
							          product.itemDetails[thisCatentryId].orderItemId = orderItem.orderItemId;
							          
							          if(itemTimeStamp !== null && new Date(itemTimeStamp) < new Date(orderItem.lastUpdateDate) ) {
							                product.currentItem = orderItem.catentryId;
							                itemTimeStamp = orderItem.lastUpdateDate;
							          }
							          products[product.productId] = product;
							    }
							}
		                    
		              });
		        });
		        }
		  
		  
		  },
		  
		  updateCardsForInTrolley : function(products,fromSection) {
			  $.each(products,function(indx, product){
				  var productId = product.productId;
            	  var productSection = findProductSection(productId);
            	  //console.log('fromSection:'+fromSection+', productId:'+productId+', productSection:'+productSection);
				  	if(productSection === fromSection){
						  if(product.totalQtyInCart>0) {
							  var productCard = $('.product-listing-item[data-productid='+product.productId+']');
							  productCard.find('.product-listing-item__primary').css('display', 'none');
							  productCard.find('.product-listing-item__secondary').fadeIn();
						      
							  productCard.find('.cart-icon').addClass('small');

							  productCard.find('.product-listing--original-price, .product-listing--discounted-price, .product-listing__quantity-secondary, .product-listing__cta-container').hide();
							  productCard.addClass('product-added-to-cart');
							  productCard.find('.added-product-wrap ul li').find('.custom-dropdown').removeClass('primary-border');

						  }
					}

			  });
		  }
};



function findProductSection(productId) {
	  var productSection = '';
	  if($('.product-listing-item[data-productid="'+productId+'"]').parents('#frequentlyPurchased').length>0){
		  productSection = 'FREQ';
	  }
	  if(($('.product-listing-item[data-productid="'+productId+'"]').parents('#upselling').length>0) || ($('.product-listing-item[data-productid="'+productId+'"]').parents('#prodRecommendations').length>0)){
		  if(productsRecommendation.upsellProductIds != null && productsRecommendation.upsellProductIds != undefined 
				  && productsRecommendation.upsellProductIds.indexOf(productId)>=0){
			  productSection = 'UPSELL';
		  }
		  if(productsRecommendation.recommProductIds != null && productsRecommendation.recommProductIds != undefined 
				  && productsRecommendation.recommProductIds.indexOf(productId)>=0){
			  productSection = 'RECOMMENDATION'; 
		  }
		  
	  }
	  return productSection;
}
