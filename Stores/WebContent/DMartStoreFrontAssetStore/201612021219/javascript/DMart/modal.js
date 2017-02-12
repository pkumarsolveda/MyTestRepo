(function(dmUIConfig) {
  $(document).ready(function () {
	$(document).on('click', '.modal-link', function() {
	  if( $(this).attr('id') === 'slotChangeButton'){
		  return;
	  }
      var targetDiv = $(this).data('target');
      
      var largeScreen = 1000;
      if($(window).width() >= largeScreen) {
        $('#'+targetDiv).fadeIn(100, function () {
          $('.delivery-selection--this-week').scrollTop(0).perfectScrollbar('update');
        });
      }
      else {
        $('#'+targetDiv).css('display', 'block');
        $('.delivery-selection--this-week').scrollTop(0).perfectScrollbar('update');
      }

      if(targetDiv === 'sizeGuideModal') {
    	  var category = $(this).data('category');
    	  nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
              autoescape: true,
              web: {
                  useCache: true
              }
          });
    	  var sgContent = nunjucks.render('sizeguides/'+category+'.html');
    	  $('#'+targetDiv +' .modal-dialog__body').html(sgContent);
    	  $('#'+targetDiv +' .img-responsive').attr('src',WCParamJS.staticServerHost+'templates/sizeguides/'+category+'.png');
      }
      if(targetDiv.indexOf('PromotionsModal') != -1) {
    	  cartDisplay.displayPromoPopUps('promotions');
      }
      if($('#locationModal').length <= 0) {
    	  $('html, body').css('overflow', 'hidden');
 	  }
     
    });

	$(document).on('click', '.modal-dialog__close, .location-skip', function() {
	  if($('#locationModal').is(":visible") && typeof  getCookie("DMART_Pincode_Cookie") =="undefined"){
    	  DMStorage.sessionSet("pincodeSkip","true");
    	  $('.delivery-code__pin').html(defPinCode);
    	  $('.main-menu__location-mini span').html(defPinCode+' <i class="icon-delivery-caret-down icon-caret-down"></i>');
    	  var CookieDate = new Date();
      	  CookieDate.setFullYear(CookieDate.getFullYear()+1);
      	  document.cookie = "DMART_Pincode_skip="+defPinCode+";expires=" + CookieDate.toGMTString( ) + ";path=/";
      }
      $(this).parents('.modal-dialog').hide();
      
      if($(this).parents('#locationModal').length <= 0 && 
    		  $(this).parents('#primaryPromotionsModal').length <= 0 && 
    		  $(this).parents('#secondaryPromotionsModal').length <= 0 &&
    		  $(this).parents('#ternaryPromotionsModal').length <= 0 &&
    		  $(this).parents('#quaternaryPromotionsModal').length <= 0 &&
    		  $(this).parents('#quinaryPromotionsModal').length <= 0 &&
    		  $(this).parents('#senaryPromotionsModal').length <= 0 &&
    		  $(this).parents('#promotions').length <= 0 &&
    		  $(this).parents('.promotions-modal').length <= 0) { //AE-16300 - handling promotions popup in cart
    	 $('html, body').css('overflow', 'auto');  
	  }else{
	 	$('body').css('overflow', 'auto'); 
	 	$('html').prop('style').removeProperty('overflow');
	  }
      DMAnalytics.events( DMAnalytics.Constants.Action.PinCodeSkip,DMAnalytics.Constants.Action.PinCodeSkip , document.title, 0,null );
      /*if($(this).parents().hasClass('promotionsModal')){
    	  window.location.href = 'myCart?storeId='+WCParamJS.storeId+'&catalogId='+WCParamJS.catalogId+'&langId='+WCParamJS.langId;
      } */
      
    });

    //close on ESC
    $(document).bind('keydown', function(e){
      if (e.which === 27) {
        if($('#locationModal').length <= 0) {
          	$('html, body').css('overflow', 'auto');  
  	   	}else{
  	   	 	$('body').css('overflow', 'auto'); 
  		 	$('html').prop('style').removeProperty('overflow');
  		 	if($('#locationModal').is(":visible") && typeof  getCookie("DMART_Pincode_Cookie") =="undefined"){
  	    	  DMStorage.sessionSet("pincodeSkip","true");
  	    	  $('.delivery-code__pin').html(defPinCode);
  	    	  $('.main-menu__location-mini span').html(defPinCode+' <i class="icon-delivery-caret-down icon-caret-down"></i>');
  	    	  var CookieDate = new Date();
  	      	  CookieDate.setFullYear(CookieDate.getFullYear()+1);
  	      	  document.cookie = "DMART_Pincode_skip="+defPinCode+";expires=" + CookieDate.toGMTString( ) + ";path=/";
  	      }
  	   	}
        $('.js-modal-dialog-esc').hide();
        $('.js-share-cart-cancel-bta').trigger('click');
      }
    });

    $('.delivery-code .delivery-code__label, .splash .delivery-code .delivery-code__label-choose, .splash .delivery-code .delivery-code__label-choose-location, .delivery-code .delivery-code__pin, .delivery-code .icon-delivery-caret-down').on('click', function () {
    	if(null != document.getElementById("locationModal") && typeof checkoutConfirm === 'undefined'){
    		$('#locationModal').show();
    		$(this).trigger('dmart.browse.pincode.fetchall');
    	}
     //$('html, body').css('overflow', 'hidden');
    });

    $('#ShareCartModal').on('click', '.modal-dialog__close', function () {
      $('.js-share-cart-cancel-bta').trigger('click');
    });

    // Fix : AE-4254
    // Add the below script when you display the '.alert' message box

    // $('html, body').animate({
    //   scrollTop: 0
    // }, 500);
  });
}(DM_UI_CONFIG));
