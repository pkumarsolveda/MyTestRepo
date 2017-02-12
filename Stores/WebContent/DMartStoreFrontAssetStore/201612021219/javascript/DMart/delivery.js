(function(dmUIConfig) {
  $(document).ready(function () {
	$('#marker_list li').css('border','1px solid red');
		
	$(document).on('click', '.delivery-address-rdo', function (event) {
		event.stopPropagation();
        $('.delivery-favorite-cta').show();
        checkoutHelper.hideFavForGuestUser();
        $('.view-address-wrapper').remove();
        $('.pup-address').removeClass('pup-address-active');
        $(this).addClass('address-selected');
        $(this).next('.pup-address').addClass('pup-address-active');
        $(this).parents('label').find('.delivery-favorite-cta').hide();
        var pupId = $(this).attr('id');
        var addressLink = '<div class=\"view-address-wrapper\"><a href=\"javascript:;\" class=\"view-address-text\" id=\"'+pupId+'"\">View Addrees<\/a><\/div>';
        $(this).parents("label").append(addressLink);
        /*var indexpup = $(this).parents('li').index();
        var pupadd_height = 0;
        var counter;
        for(counter=0; counter<=indexpup; counter++ ) {
        	pupadd_height += $('#marker_list li')[counter].clientHeight;   
        }
        if(counter==1)
        	$('.delivery-vertical__address').scrollTop(0);
        else
        	$('.delivery-vertical__address').scrollTop(pupadd_height);*/
    });
    $(document).on('click', '.view-address-text', function () {
       var selectedPUP= $(this);	
       if($('.pup-popover').css('display') == "block") return;
       var strVar="";
       strVar += "<div class=\"pup-popover\">";
   	   strVar += "<div class=\"puparrow-up\">";
   	   strVar += "<\/div>";
   	   strVar += "<div class=\"pup-text\">";
   	   $.each(pupAddress.addressItms,function (index,addressItm){
   		  if(addressItm.addressId == $(selectedPUP).attr('id')){
   			strVar += addressItm.name.replace(/^\|\||\|\|$/g,'').split('||').join(' ').replace(/\|/g,':');
   			return false;
   		  }
   	   });
   	   //strVar += "Shop No 9, Acharya Commercial CHS, Dr Choitaram Gidwani Marg, Chembur,Mumbai 400 074";
   	   strVar += "<\/div>";
   	   strVar += "<\/div>"; 
       $('.pup-popover').remove();
       $(this).parents('.view-address-wrapper').append(strVar);
       $(this).parents('.view-address-wrapper').find('.pup-popover').show();
       var adr_length = $(this).parents('li').find('.pup-label').find('.pup-address').width();
       var view_addr =$(this).width();
       var total_width =adr_length+view_addr;
       $(this).parents('.view-address-wrapper').find('.pup-popover').width(total_width);
    });
    $('body, html').on('mouseup touchend keyup', function(e) {
    	if($('.pup-popover').is(':visible')) {
    		var container = $('.view-address-wrapper, .pup-popover');
    		if ((!container.is(e.target) && container.has(e.target).length === 0) || e.which === 27) {
    			 container.parent().find('.pup-popover').hide();
    		}
    	}
    });
    $('.js-delivery-selection-cta').on('click', function () {
      $('.js-delivery-selection-slot, .js-delivery-address, .js-payment-method').hide();
      $('.js-delivery-selection').fadeIn();
      $('.js-payment-highlight').removeClass('active');     
      checkoutHelper.renderCartSummary();
      DMAnalytics.events( "Delivery Method Change Link", "Delivery Method Change", document.title, 0,null );
    });

    $('.delivery-vertical__address').on('click', 'label', function() {
      $('.js-delivery-slot-cta').addClass('enabled').removeClass('button--disabled');
    });

    // Delivery Slots
    $(document).on('click', '#checkOutNewAddress', function () {
     	document.getElementById('formNewAddressModal').reset();
    	$('#newAddressModal').show();
    	if(userType == 'G'){
        	$('#guestEmailDiv').show();
        }
    	var selectedPincode = $('.delivery-code__pin').text();
    	var pincodeState = undefined;
    	var pincodeCity = undefined;
    	//$('#newAddressModal input[name=newPincode]').val(selectedPincode); -- AE-17463
    	var pincodeMap = DMStorage.getValue('pincodeMap');
    	if(pincodeMap == null){
    		checkoutHelper.setPincodeMap();
			var pincodeMap = DMStorage.getValue('pincodeMap');
		}
		if(selectedPincode != '' && pincodeMap != null){
			$.each(pincodeMap, function(i, pin) {
				if(selectedPincode == pin.Pincode){
					pincodeState = pin.State;
					pincodeCity = pin.Region;
				}
			});
		}
	if(pincodeState != undefined && pincodeCity != undefined){
		$('#newAddressModal input[name=newCity]').val(pincodeCity).prop("disabled", true);
		$('#newAddressModal input[name=newState]').val(pincodeState).prop("disabled", true);
	}
	$('#newAddressModal input[name=newMobileNumber]').val(checkoutHelper.logonId);
    });

    $('.js-payment-emi').on('click', function () {
      $('.js-div-table-scrollable').perfectScrollbar('update');
    });
    
    $(document).on('focusout', '#newAddressModal input[name=newPincode]', function () {
    	var selectedPincode = $('.delivery-code__pin').text();
    	var newPincode = $('#newAddressModal input[name=newPincode]').val();
    	checkoutHelper.showCityAndStateForPincode(newPincode,'new');    	
    });
    $(document).on('focusout', '#editAddressModal input[name=editPincode]', function () {
    	var selectedPincode = $('.delivery-code__pin').text();
    	var newPincode = $('#editAddressModal input[name=editPincode]').val();
    	checkoutHelper.showCityAndStateForPincode(newPincode,'edit');    	
    });
    $(document).on('click', '#checkoutNewAddressClose', function () {
    	$('#newAddressModal').hide();
    	if(userType == 'G'){
        	$('#guestEmailDiv').show();
        	$('#guestEmailEditDiv').show();
        }
    });
    
    $('.js-make-default-address').clickToggle( function () {
      $(this).addClass('active');
    }, function () {
      $(this).removeClass('active');
    });

 

    $('.delivery-vertical__address').on('click', '.js-delivery-favorite', function () {
      // dummy '.favorite-address' class name - indicating the address as favorite.
      $(this).parents('li').toggleClass('favorite-address');
      $(this).find('.js-delivery-favorite-icon').toggle();
    });

    $('.js-cart-accept').on('click', function () {
      // Redirect to My Cart page
      // $(this).parents('.container').remove();
    });

    var selectedCard ;
   
    // select bank for net banking
    $( '.card-selection').on('click', function() {
        selectedCard = $('input[name=card-selection]:checked', '#formNetBankvalidation').val();
     }); 
         
      $('.select-other-banks').on('click',  function() {
        selectedCard = $('#select-other-banks :selected').val();
        $('.card-selection').prop( "checked", false );
     });


    // Enable Pay Now
     $(document).on('click', '.payment-method--card input[type="radio"]', function() {
      $(this).parents('.resp-tab-content-active').find('.js-payment-pay-now').removeClass('button--disabled');
    });

    $('.payment-method--card select').on('change', function () {
      $(this).parents('.resp-tab-content-active').find('.js-payment-pay-now').removeClass('button--disabled');
    });

    $('.form__input--expiry-date .form__input').on('focus', function () {
      $(this).parent().addClass('form__input--group-focus');
    });

    $('.payment-form:visible').on('click', 'input', function () {
      console.log($(this).is(':checked'));
    });
    
    $('.js-accordion-tabs-delivery .resp-tab-item').on('click', function () {
    	if($(this).data('payment') == null || $(this).data('payment') == undefined || $(this).data('payment') == '' ){
            //$(this).parents('.js-accordion-tabs-delivery').find('form input').val('');
            //$(this).parents('.js-accordion-tabs-delivery').find('form textarea').val('');
            $(this).parents('.js-accordion-tabs-delivery').find('form').each(function() {
              //$(this).validate().resetForm();
            	$(this).find('span.error').hide();
            	$(this).find('input').removeClass('error');
            	$(this).find('textarea').removeClass('error');
            });
    	}
    	else{
    	var paymentMethod=$(this).text();
    	DMAnalytics.events( DMAnalytics.Constants.Category.PaymentMethod,"Payment Method: "+paymentMethod , document.title, 0,null );
    	}
      });
    $(document).on('click','.pup-check',function()
    	    {
    	         
    	          $('.variant-delivery-header').text('Please choose your preferred DMart Ready Pick-up Point');
    	    });

    	$(document).on('click','.delivery-check',function()
    	    {
    	      
    	      if($('.js-new-address-cta').css('display') == 'none')
    	            {
    	          $('.variant-delivery-header').text('Please enter your delivery address');
    	            }
    	            else {
    	              $('.variant-delivery-header').text('Please choose your preferred delivery address');

    	            }
    	          

    	    });
    	 if ($(window).width() < 1024) {

    	  $('.delivery-container-accordian').find('h2:last').on('click',function()
    	    {
    	        $('.variant-delivery-header').text('Please choose your preferred DMart Ready Pick-up Point');

    	    });
    	 $('.delivery-container-accordian').find('h2:first').on('click',function()
    	    {
    	         if($('.js-new-address-cta').css('display') == 'none')
    	            {
    	          $('.variant-delivery-header').text('Please enter your delivery address');
    	            }
    	            else {
    	              $('.variant-delivery-header').text('Please choose your preferred delivery address');

    	            }
    	    });

    	}
    	 $('.payment-method').find('.resp-tab-item').removeClass('resp-tab-active');
    	 $('.payment-method').find('.resp-accordion').removeClass('resp-tab-active');
    	 $('.payment-method').find('.resp-tab-content').removeClass('resp-tab-content-active').attr('style', 'display:none');
    	 
    	 $('.js-delivery-orderpreview-cta').on('click', function () {
    		      $('.js-delivery-selection-slot, .js-delivery-address, .js-payment-method').hide();
    		       $('.js-delivery-address').fadeIn();
    		       $('.js-payment-highlight').removeClass('active');
    		     });

  });
}(DM_UI_CONFIG));
