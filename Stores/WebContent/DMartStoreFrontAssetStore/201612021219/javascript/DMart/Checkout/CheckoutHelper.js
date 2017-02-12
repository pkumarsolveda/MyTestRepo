/**
 * This calls provide the js functions for checkout flow
 * 
 * Author Infosys limited (Vivek) 
 * Date: 14-Dec-2015
 */
var checkoutHelper = {
		
	firstSlotDate : '',
	/**
	 * Entry point to the class. All initializations happens here  
	 */
	init: function() {
		$('.js-load-gmap').hide();
		CartHelper.invalidateCookieForOtherProtocol();
		var action = checkoutHelper.getParameterByName('currentAction');
		var reason = checkoutHelper.getParameterByName('paymentFailure');
		var paymentIndicator = checkoutHelper.getParameterByName('paymentIndicator');
		var maxPUPAmnt=$('#pupMaxThreshold').val();
		var paymentPage = false;
		this.isNoAddress = false;
		var maxCODHomeDlvryAmnt=$('#maxCODHomeDlvryAmnt').val();
		if(action == 'Payment' && (reason == 'true' || paymentIndicator == 'Y')){
			paymentPage = true;
			var orderIdReq = checkoutHelper.getParameterByName('orderId');
			var cartJSONRepay = DMStorage.getValue('OrderIdRepay');
			var cartJSON = DMStorage.getValue('OrderId');
			if(cartJSON != null && cartJSON.orderId != null && cartJSON.orderId == orderIdReq){
				this.renderCartSummary();
				$('.js-delivery-selection, .js-delivery-selection-summary, .js-delivery-address, .js-payment-method').hide();
				$('.js-payment-highlight').addClass('active');
				$('.js-payment-method').fadeIn();
				$('.delivery-vertical-cta').hide();
				//$('.resp-tab-item[data-payment=COD]').hide();
				var orderTotalDisplay = CartHelper.formatPricesForDisplay(DMStorage.getValue('OrderId').grandTotal);
				$('.total-payment-amount').children().html('<i class="icon-rupees"></i>'+orderTotalDisplay);
				$('.cod-payment-totalamount').children().html('<i class="icon-rupees"></i>'+DMStorage.getValue('OrderId').x_codRoundedOrderTotal);
				if($('#BillDeskResponseMsg').val() != "" && $('#BillDeskResponseMsg').val() != null ){
					checkoutHelper.showCheckoutError($('#BillDeskResponseMsg').val());
				}
		          $('.cart-details__item .cart-details__item-list').css('display', 'none');
		          $('.cart-details__scroll-secondary').animate({
		        	  'min-height': 0,
		        	  'max-height': '87px'
		          }, 800);
		          $('.cart-details__item-list.mini-cart-details__item-list.cart-details__item--bottom-list').slideDown();
		          $('.cart-details__item-list.mini-cart-details__item-list.cart-details__item--bottom-list').parent('.cart-details__item-fixed').find('.cart-details__item--bottom').find('.cart-details__item--title-arrow i').toggleClass('icon-caret-up');
		          	          
			}else if (cartJSONRepay != null && cartJSONRepay.orderId != null && cartJSONRepay.orderId == orderIdReq){
				reason = 'repay';
				if($('#BillDeskResponseMsg').val() != "" && $('#BillDeskResponseMsg').val() != null ){
					checkoutHelper.showCheckoutError($('#BillDeskResponseMsg').val());
				}
			}
		} 
		if(action == 'Payment' && reason == 'repay'){
			paymentPage = true;
			
			var userIdOrder = checkoutHelper.getParameterByName('userIdOrder');
			if(userIdOrder != "" && userIdOrder != null ){
				var userIdRepay = $('#userIdRepay').val();
				if(userIdRepay == userIdOrder){
					this.renderCartSummaryRepay();
				}else{
					$('#BillDeskResponseMsg').val('You are not authorized to repay for this order.');
					$('#cart-summary-section').hide();
					$('.payment-method').parents('.container').hide();
				}
			}else{
				var repayError = checkoutHelper.getParameterByName('repayError');
				if(repayError != "" && repayError != null ){
					$('#BillDeskResponseMsg').val('You are not authorized to repay for this order.');
					$('#cart-summary-section').hide();
					$('.payment-method').parents('.container').hide();
				}else{
					this.renderCartSummaryRepay();
				}				
			}
		} 
		// back button after confirm order
		var orderPlaced = checkoutHelper.getCheckoutObjects('confirmOrderObj');
		if(orderPlaced != null && orderPlaced == orderId ){
			checkoutHelper.showCheckoutError('Order '+orderId+' is already placed.');			
			setTimeout(function(){
				$('.logo--large.img-responsive').trigger('click');
				}, 500);
		}
		else if (!paymentPage){
			var isPupSelected = checkoutHelper.getCheckoutObjects('pupSelected');
			sessionStorage.clear();
			//localStorage.removeItem('OrderId');
			if(isPupSelected == 'Y'){
				checkoutHelper.saveCheckoutObjects('pupSelected', 'Y');
			}
			this.renderElements();
		}

		// event for save new address
		$(document).on('click', '#checkoutNewAddressSave', function() {
			if($('#formNewAddressModal').hasClass('add-in-progress')){
				return;
			}
			$('#formNewAddressModal').validate();
			if($('#formNewAddressModal').valid()){
				$('#formNewAddressModal').addClass('add-in-progress');
				setTimeout(function(){
					checkoutHelper.saveAddress('formNewAddressModal');
				}, 100);
			}else{
				$('#formNewAddressModal').removeClass('add-in-progress');
			}
			// Fix for AE-8504
			if($('#formNewAddressModal input[name=newPincode]').val() != ""){
				checkoutHelper.showCityAndStateForPincode($('#formNewAddressModal input[name=newPincode]').val(),'new');    
			}
		});
		
		// event for location popup
		$(document).on('click', '#PUPLocationModal', function() {
			$('.delivery-code').trigger('click');
			checkoutHelper.saveCheckoutObjects('pupSelected', 'Y');
		});

		// event for rendering slots
		$(document).on('click', '.js-delivery-slot-cta.enabled', function() {
			if (!$(this).hasClass('link-secondary')) {
				checkoutHelper.saveAddressAndRenderSlot();
				DMAnalytics.events( "Time Slot Change Link", "Time Slot Change Link", document.title, 0,null );
			} else {
				$('.cart-order-summary').hide();
				$('.delivery-selection-slot').fadeIn();
				$('.payment-method').css('display', 'none');
			}
		});

		// event for edit address click
		$(document).on('click', '.js-address-edit', function() {
			checkoutHelper.editAddressLoad($(this).attr('id'));
		});

		// event for edit address save
		$(document).on('click', '#editAddressModalSave', function() {
			if($('#formEditAddress').hasClass('add-in-progress')){
				return;
			}
			$('#editPincode-error').remove();
			//if($('#formEditAddress').valid()){
				$('#formEditAddress').addClass('add-in-progress');
				setTimeout(function(){
					checkoutHelper.editAddress($(this).attr('id'));
				}, 100);
			//}
			// Fix for AE-8504
			if($('#formEditAddress input[name=editPincode]').val() != ""){
				checkoutHelper.showCityAndStateForPincode($('#formEditAddress input[name=editPincode]').val(),'edit');    
			}
		});
		
		// event for address selection
		$(document).on('change', '.address-select-radio', function() {
			if(!$('#formLocationValidationModal').is(":visible")){
			checkoutHelper.checkPincodeServed($(this).attr('id'));
			}
		});

		// event for delete address
		$(document).on('click', '.js-address-delete', function() {
			checkoutHelper.deleteAddress($(this).attr('id'));
		});

		// event for make an address favourite
		$(document).on('click', '.js-delivery-favorite', function() {
			$(this).parents('li').toggleClass('favorite-address');
			//$(this).find('.js-delivery-favorite-icon').toggle();			
			if ($('#delivery-address-section').hasClass('resp-tab-content-active')) {
				var isPrimary = $(this).find('.icon-heart-outlined').length > 0 ? "true" : "false";
				checkoutHelper.makeAddressFav($(this).attr('id'),isPrimary);
			}
			else if ($('#delivery-PUP-address-section').hasClass('resp-tab-content-active')) {
				var isPrimary = $(this).find('.icon-address-icon').length > 0 ? "true" : "false";
				checkoutHelper.updateFavouritePUPForUser($(this).attr('id'),isPrimary);
			}
		});
		// Analytics.
		 $(document).on('click','.resp-tabs-list.clearfix.delivery-vertical', function() {
			 if($(this).find('.resp-tab-active').find('.delivery-type--title').text().length>0){
				  
			 DMAnalytics.events( DMAnalytics.Constants.Category.DeliveryMode, $(this).find('.resp-tab-active').find('.delivery-type--title').text().indexOf("Home")>-1?"Home Delivery":"Pick up" , document.title, 0,null );
			 }
	    });
		// event for slot selection
		$(document).on('click', '.delivery-selection-row span', function() {
			if (!$(this).hasClass('delivery-slot--not-selectable')) {
				var slotData = ($(this).attr('id')).split('||');
				var slotObject = {};
				slotObject.slotDate = slotData[0];
				slotObject.startTime = slotData[1];
				slotObject.endTime = slotData[2];
				slotObject.resourcePoolkey = $('#slot-resourcePoolkey').val();
				checkoutHelper.saveCheckoutObjects('slotObj', slotObject);
				$('.delivery-selection-row span').removeClass('selected-slot');
				$(this).addClass('selected-slot');
				$('.js-place-order').addClass('enabled').removeClass('button--disabled');
				var selectedShipMode = checkoutHelper.getCheckoutObjects('addressObj').selectedShipMode;
				if(selectedShipMode=='Pick up Point'){
					$('.order-validity').show();
				}
				$('.order-delivery-info .red-slot-text:first').text(slotData[1]+'-'+slotData[2]);
				$('.order-delivery-info').show();
			}
		});

		$(document).on('click', '.js-place-order.enabled', function() {
			if(typeof nonStockItemsInTrolley != 'undefined' && nonStockItemsInTrolley || (localStorage.getItem('OOSitemsList') != null)){
				$('.js-cart-reject').trigger('click');
			}
			if(checkoutHelper.checkOrderThreshould()){
				var slotObj = checkoutHelper.getCheckoutObjects('slotObj');
				var isStartTimeValid = checkoutHelper.isFutureSlot(slotObj.slotDate,slotObj.startTime.indexOf('PM') > -1 && 
						slotObj.startTime.substring(0,2) != "12"  ? 						
								parseInt(slotObj.startTime.substring(0,2)) + 12 : parseInt(slotObj.startTime.substring(0,2)));
				var isEndTimeValid = checkoutHelper.isFutureSlot(slotObj.slotDate,slotObj.endTime.indexOf('PM') > -1 && 
						slotObj.startTime.substring(0,2) != "12"  ? 	
								parseInt(slotObj.endTime.substring(0,2)) + 12 : parseInt(slotObj.endTime.substring(0,2)));
				if(isStartTimeValid && isEndTimeValid){
					checkoutHelper.renderorderSummary();
					$('.js-delivery-selection-slot, .js-payment-method').hide();
					$('.js-delivery-selection-summary, .js-delivery-address').fadeIn();
					$('.js-payment-highlight').removeClass('active');
				}else{
					checkoutHelper.showCheckoutError(MessageHelper.messages['CHECKOUT_SLOT_INVALID']);
				}
				
			}
			var selectedShipMode = checkoutHelper.getCheckoutObjects('addressObj').selectedShipMode;
			var isCODEnabledForPUP = $('#isCODEnabledForPUP').val();
			var productsHavingNoCOD = DMStorage.getValue('OrderId').productsHavingNoCOD;
			if(selectedShipMode=='Pick up Point' && isCODEnabledForPUP == '0'){
			$.each($('.payment-method ul li'),function(){
				if($(this).attr('data-payment')=='COD'){
					$(this).hide();
				}
			});
			$.each($('.resp-accordion.delivery-vertical'),function(){
				if($(this).text()=='Cash On Delivery'){
					$(this).hide();
					}
				});
			}
			else{
				if(DMStorage.getValue('OrderId').grandTotal>maxCODHomeDlvryAmnt){
					$.each($('.payment-method ul li'),function(){
						if($(this).attr('data-payment')=='COD'){
							$(this).hide();
						}
					});
					$.each($('.resp-accordion.delivery-vertical'),function(){
						if($(this).text()=='Cash On Delivery'){
							$(this).hide();
							}
						});
				}else if(productsHavingNoCOD){
					$.each($('.payment-method ul li'),function(){
						if($(this).attr('data-payment')=='COD'){
							$(this).hide();
						}
					});
					$.each($('.resp-accordion.delivery-vertical'),function(){
						if($(this).text()=='Cash On Delivery'){
							$(this).hide();
						}
					});
				}else{
					$.each($('.payment-method ul li'),function(){
						if($(this).attr('data-payment')=='COD'){
							$(this).show();
						}
					});
					// commented for JIRA AE-8034
//					$.each($('.resp-accordion.delivery-vertical'),function(){
//						if($(this).text()=='Cash On Delivery'){
//							$(this).show();
//							}
//						});
				}
			}
		});

		$(document).on('click', '#delivery-selection-secondary', function() {
			$('.js-delivery-selection-slot, .js-delivery-address, .js-payment-method').hide();
			$('.js-delivery-selection').fadeIn();
			$('.js-payment-highlight').removeClass('active');
			checkoutHelper.renderCartSummary();
			DMAnalytics.events( "Change Delivey Method on Time Slot Page", "Change Delivey Method on Time Slot Page" , document.title, 0,null );
		});
		
		
		$(document).on('click', '.resp-accordion.delivery-vertical.resp-tab-active', function() {
			if($('#delivery-PUP-address-section').is(":visible") && checkoutHelper.isMobile()){
				$('.delivery-tabs .delivery-vertical__address--pup').perfectScrollbar('update');
			}
		});
		    
		$(document).on('click', '.js-payment-method-cta', function() {
			if(checkoutHelper.checkOrderThreshould() && checkoutHelper.checkReservationCompleted()){
		      $('.js-delivery-address').hide();
		      $('.js-payment-highlight').addClass('active');
		      $('.js-payment-method').fadeIn();
		      var orderTotal = DMStorage.getValue('OrderId').grandTotal;
			  var orderTotalDisplay = CartHelper.formatPricesForDisplay(orderTotal);
		      $('.total-payment-amount').children().html('<i class="icon-rupees"></i>'+orderTotalDisplay);
		      $('.cod-payment-totalamount').children().html('<i class="icon-rupees"></i>'+DMStorage.getValue('OrderId').x_codRoundedOrderTotal);
		      
		      checkoutHelper.setHistoryPushState('Payment');
		     // $('#creditCard').trigger('click');
		      DMAnalytics.events( "Proceed to Payment Button", "Proceed to Payment Button", document.title, 0,null );
			}
			
   		 });

		// Weeks switch
		$(document).on('click', '.js-delivery-next-week', function() {
			if ($(this).text() == 'NEXT 7 DAYS') {
				if ($('.delivery-selection--next-week').find('.delivery-selection-row').length > 0) {
					$('.delivery-current-week').hide();
					$('.delivery-next-week').fadeIn();
				} else {
					checkoutHelper.renderNextSlotSummary();
					// refresh next date slot		 				
				}
				$(this).text('PREVIOUS 7 DAYS');
			} else {

				if ($('.delivery-selection--current-week').find('.delivery-selection-row').length > 0) {
					$('.delivery-next-week').hide();
					$('.delivery-current-week').fadeIn();
				} else {
					checkoutHelper.renderSlotSummary();
					// refresh next date slot		 				
				}
				$(this).text('NEXT 7 DAYS');
			}

		});



		$(document).bind(
			'dmart.checkout.summary.ready',

		function(e) {
			var deliveryRestrictionFlag = false;
			var cartJson = DMStorage.getValue('OrderId');
			if(cartJson != null){
				deliveryRestrictionFlag = cartJson.deliveryRestrictionFlag;
			}
			if(deliveryRestrictionFlag || cartJson.grandTotal>maxPUPAmnt){
				if(document.getElementById('pickup_div')){
					$('#pickup_div').remove();
					$('#delivery-PUP-address-section').remove();
					$('.delivery-selection h2.delivery-vertical[aria-controls="delivery-vertical_tab_item-1"]').remove();
					if($('.js-new-address-cta').length == 0)
    	            {
						$('.variant-delivery-header').text('Please enter your delivery address');
    	            }
    	            else {
    	              $('.variant-delivery-header').text('Please choose your preferred delivery address');

    	            }
				}
			}
			if(cartJson.grandTotal<maxPUPAmnt && !deliveryRestrictionFlag){
				$('.js-load-gmap').show();
			}
			else{
				if($('.js-new-address-cta').length == 0)
	            {
	          $('.variant-delivery-header').text('Please enter your delivery address');
	            }
	            else {
	              $('.variant-delivery-header').text('Please choose your preferred delivery address');

	            }
			}
			checkoutHelper.renderCartSummary();
			checkoutHelper.showUnavailableItems();	
			checkoutHelper.checkOrderThreshould();
			var charge = getCookie("HomeDeliveryShipCharge");
			if (charge === undefined){
				var shipAdjust = 0 ;
				if(DMStorage.getValue('OrderId').shippingAdjustment){
					shipAdjust = cartJson.shippingAdjustment;
				}
				charge = cartJson.totalShippingCharge - shipAdjust;
			}
			charge = CartHelper.formatPricesForDisplay(charge);
			var val = "<i class=\"icon-rupees\"></i>"+Math.round(charge) + " Extra";
			$("span.offer-text:contains('Extra')").html(val);
			if($('#pickup_div').is(":visible")){				
				/* Reverting the changes.  
				 * Adding back !
				 */
				 setTimeout(function(){
					$('#pickup_div').trigger('click');
	    	     }, 500);
				
				setTimeout(function(){
					$.each($('.delivery-vertical__address.delivery-vertical__address--pup.pupAddress').find('[name=delivery-address]'), function(idx, displayedPUPs) {
						if(idx==0){
						$(displayedPUPs).prop('checked', true)
						}
					});	
	    	     }, 650); 
				
			}
			if($(".resp-accordion.delivery-vertical:contains('Pick up')").is(":visible")){
				 setTimeout(function(){
					 	$(".resp-accordion.delivery-vertical:contains('Pick up')").trigger('click');
		    	     }, 500);
				 
				 setTimeout(function(){
						$.each($('.delivery-vertical__address.delivery-vertical__address--pup.pupAddress').find('[name=delivery-address]'), function(idx, displayedPUPs) {
							if(idx==0){
							$(displayedPUPs).prop('checked', true)
							}
						});	
		    	     }, 650); 
			}
		});
		
		$(document).bind(
				'dmart.repay.summary.ready',

			function(e) {
				var cartJSON = DMStorage.getValue('OrderIdRepay');
				if(cartJSON != null && typeof cartJSON != 'undefined'){
					cartJSON.totalMinusDiscount = parseFloat(cartJSON.total) - parseFloat(cartJSON.discount);
		    		cartJSON.totalMinusDiscount = CartHelper.formatPricesForDisplay(cartJSON.totalMinusDiscount);
		    		cartJSON.totalSavingsPlusDiscount = parseFloat(cartJSON.totalSavings) + parseFloat(cartJSON.discount);
		    		cartJSON.totalSavingsPlusDiscount = CartHelper.formatPricesForDisplay(cartJSON.totalSavingsPlusDiscount);
		    		cartJSON.totalShippingAmount = CartHelper.formatPricesForDisplay(cartJSON.totalShippingCharge - cartJSON.shippingAdjustment);
		    		cartJSON.noImagePath = WCParamJS.staticServerHost + 'images/DMart/NoImage_T.jpg';
		    		cartJSON.showDeliveryCharge = "true";
		    		nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
		    			autoescape: true,
		    			web: {
		    				useCache: true
		    			}
		    		});
		    		$('#cart-summary-section').html(nunjucks.render('_modules/cart-summary-delivery.nunjucks', {
		    			data: cartJSON
		    		}));
		    		$('.cart-details__scroll').perfectScrollbar({
		      			suppressScrollX: true
	    			});
		    			
		    		$('.js-delivery-selection, .js-delivery-selection-summary, .js-delivery-address, .js-payment-method').hide();
		    		$('.js-payment-highlight').addClass('active');
		    		$('.js-payment-method').fadeIn();
		    		$('.delivery-vertical-cta').hide();
					var orderTotalDisplay = CartHelper.formatPricesForDisplay(DMStorage.getValue('OrderIdRepay').grandTotal);
		    		$('.total-payment-amount').children().html('<i class="icon-rupees"></i>'+orderTotalDisplay);
		    		$('.cod-payment-totalamount').children().html('<i class="icon-rupees"></i>'+DMStorage.getValue('OrderIdRepay').x_codRoundedOrderTotal);
		    			
		    	    $('.cart-details__item .cart-details__item-list').css('display', 'none');
		    	    $('.cart-details__scroll-secondary').animate({
		    	    	'min-height': 0,
		    	    	'max-height': '87px'
		    	    }, 800);
		    	    $('.cart-details__item-list.mini-cart-details__item-list.cart-details__item--bottom-list').slideDown();
		    	    $('.cart-details__item-list.mini-cart-details__item-list.cart-details__item--bottom-list').parent('.cart-details__item-fixed').find('.cart-details__item--bottom').find('.cart-details__item--title-arrow i').toggleClass('icon-caret-up');
		    	          
		    	    checkoutHelper.checkShippingMatrixForRepay('repay','');
		   			$(document).trigger('dmart.checkout.action.completed');
				}
	           	
			});
		
		$(document).bind(
				'dmart.checkout.pincode.Loaded',

			function(e) {
				//checkoutHelper.checkIfAddressServed();	
				console.log("render address section");
				checkoutHelper.renderAddressSummary();
//				$(document).unbind('dmart.checkout.pincode.Loaded');
		});
		
		$(document).bind(
				'dmart.checkout.action.inprogress',

			function(e) {
				checkoutHelper.showLoadingImage();		
		});
		
		$(document).bind(
				'dmart.checkout.action.completed',

			function(e) {
				checkoutHelper.stopLoadingImage();		
		});
		
		$(document).bind(
				'dmart.checkout.cart.failed',

			function(e) {
				checkoutHelper.renderFailedCartSummary();		
		});
		
		$(document).on('click', '.js-cart-summary-delivery .cart-details__item--title', function() {
	        if($(this).hasClass('cart-details__item--bottom') && $(this).hasClass('active')) {
	    	          $('.cart-details__item .cart-details__item-list').css('display', 'none');
	    	          $('.cart-details__scroll-secondary').animate({
	    	        	  'max-height': '87px'
	    	          }, 800);
	    	          $(this).next('.cart-details__item-list').slideDown(800, function () {
	    	              //$('.cart-details__scroll').scrollTop(0).perfectScrollbar('update');
	    	           });
	    	          $(this).find('.cart-details__item--title-arrow i').toggleClass('icon-caret-up');
	    	          $('.cart-details__scroll').find('.icon-caret-down').attr('class','icon-caret-down'); //AE-14582
	    	        }
	    	        else {
	    	        	if($(this).hasClass('activate')){
				        	$(this).toggleClass('activate');
				        	var height='87px';
				        	if($('.cart-details__item--title').hasClass('activate'))
				        		height='240px';
				        	
				        	$('.cart-details__item--bottom').next('.cart-details__item-list').css('display', 'none');
				            $('.cart-details__scroll-secondary').animate({
				            	'min-height': 0,
				            	'max-height': height
				            }, 800);			    	     
				    	     $(this).find('.cart-details__item--title-arrow i').toggleClass('icon-caret-up');
				    	     setTimeout(function(){
				    	    	$('.cart-details__scroll').perfectScrollbar('update');
				    	     }, 800);
		        		}
	    	        	else{
		    	        	$(this).toggleClass('activate');
		    	        	$('.cart-details__item--bottom').next('.cart-details__item-list').css('display', 'none');
				            $('.cart-details__scroll-secondary').animate({
				            	'min-height': 0,
				            	'max-height': '240px'
				            }, 800);			    	     
				    	     $(this).find('.cart-details__item--title-arrow i').toggleClass('icon-caret-up');
				    	     setTimeout(function(){
				    	    	$('.cart-details__scroll').perfectScrollbar('update');
				    	     }, 800);
	    	        	}
	    	        }
		});
		
		$(document).on('click', '.js-cart-reject', function() {
		      var userObj =checkoutHelper.getCheckoutObjects('userObj');
		      if((userObj != null && userObj.isItemsUnavailable && nonStockItemsInTrolley) || localStorage.getItem('OOSitemsList') != null){
		      checkoutHelper.removeUnavailableItems(userObj);
		      nonStockItemsInTrolley = false;
		      }
		      $(this).parents('.container').fadeOut(400, function () {
			$(this).hide();
		      });
	   	 });
		
		$(document).on('click', '.js-load-gmap', function() {
			$('.delivery-vertical__address--pup.pupAddress').perfectScrollbar({
			      suppressScrollX: true,
			      swipePropagation: true
		    });
			$('.delivery-tabs .delivery-vertical__address--pup').perfectScrollbar('update');
			if(favouritePUP != null){
				$('input:radio[name=delivery-address][id='+favouritePUP+']').prop('checked', true).trigger("click");
			}
	   	 });
		
		$(document).on('keyup', '.pup--filter-field', function() {
			checkoutHelper.filterPUPAddress();
			DMAnalytics.events( DMAnalytics.Constants.Category.PupSelection, DMAnalytics.Constants.Category.PupSelection , document.title, 0,null );
			$('.delivery-vertical__address--pup.pupAddress').perfectScrollbar('update');
		});
	   	// IE specific event for clear-text icon in textbox.
		$(document).on('input', '.pup--filter-field', function() {
            var inputString = $('.pup--filter-field').val();
            if(inputString == '') {
            	$('#marker_list li').show();
                $('.delivery-vertical__address--pup.pupAddress').perfectScrollbar('update');
            }
		});
	   	 window.onpopstate = function(event) {
		  var action = checkoutHelper.getParameterByName('currentAction');
		  // browser back action. just need to show hide div accordigly
		  if (action.length > 0) {
		   $('.js-delivery-selection,  .js-delivery-address, .js-payment-method, .js-delivery-selection-slot').hide();
		   switch (action) {
		    case 'Delivery':
		     $('.js-delivery-selection').fadeIn();
		     checkoutHelper.renderCartSummary();
		     break;
		    case 'Slot':
		     $('.js-delivery-selection-slot').fadeIn();
		     break;
		    case 'Summary':
		     $('.js-delivery-selection-summary, .js-delivery-address').fadeIn();
		     break;
		    case 'Payment':
		     $('.js-payment-highlight').addClass('active');
		     $('.js-payment-method').fadeIn();
		     break;
		    default:
		     checkoutHelper.init();
		   }
		  } else if(action == ""){
		  	history.go(-1);
		  }
		};
		sessionStorage.removeItem('confirmOrder');		
		if (localStorage.getItem('OOSitemsList') != null) {
        	checkoutHelper.showCheckoutError(MessageHelper.messages['CHECKOUT_ITEM_UNAVAILABLE']);
        }
		var requestUrl;
		  
		if('http:' == window.location.protocol){
		  requestUrl = "http://"+window.location.hostname+"/wcs/resources/store/"+storeId+"/storepincodedetails/byPinCode"; 
		}else{
		  requestUrl = "https://"+window.location.hostname+"/wcs/resources/store/"+storeId+"/storepincodedetails/byPinCode";
		}
		$(document).off('dmart.checkOut.pincode.fetchall').on('dmart.checkOut.pincode.fetchall', function() {
			 if(DMStorage.getValue('pincodeMap') == null){
		    	  dojo.xhrGet({
		              url: requestUrl,
		              handleAs : "json",
		              load: function(result) {
		            	  servicedPincodesJSON = result.StorePincodeDetails;
		            	  DMStorage.set('pincodeMap', servicedPincodesJSON);            	  
		            	  $(document).trigger('dmart.checkout.pincode.Loaded');
		              }
		          });
			 }
	      });
		this.hideFavForGuestUser();		
        $(document).trigger('dmart.checkOut.pincode.fetchall');
        this.setUserLogonId();
        
		$('.js-accordion-tabs-delivery').ready(function(){
			if(action == 'Payment' && (reason == 'true' ||reason=='repay' || paymentIndicator == 'Y')){
				checkoutHelper.checkShippingMatrixForRepay(reason,action);
			}
        });
        
        //this.checkInvalidInvReservation();
          if(!checkoutHelper.isMobile()){
        	document.body.style.overflowX = "hidden";
          }
	},
	checkInvalidInvReservation: function(){
	 var isInvalid = DMStorage.getValue('invalidReservation');
	 if(isInvalid){
	 	checkoutHelper.showCheckoutError("Oops! Your session expired due to inactivity, however your cart is still available. Please "+'<u><a href = "myCart">go back</a></u>'+" and replace your order.");
	 	localStorage.removeItem('invalidReservation');
	 }
	},
	hasOTPValidated: function(){
		if(this.isGuestUser()){
			if(typeof userFieldValue != "undefined" && userFieldValue == ""){
				checkoutHelper.showCheckoutError(MessageHelper.messages['CHECKOUT_OTP_NOT_VALIDATED']);
				return false;
			}else{
				try{
				var strArray = userFieldValue.split("_");
				var timeSet= Number(strArray[1]);
				var expConst =Number(confGuestCheckoutOTPTime*60*1000);
				var expiryTime= Number(timeSet+ expConst) ;
				var currentTime = Date.now();
				if(currentTime > expiryTime){
					checkoutHelper.showCheckoutError(" OTP expired. Please reverify OTP to continue");	
					return false;
				}
				var guestCookie = getCookie('guest');
				if(typeof guestCookie == 'undefined'|| guestCookie != 'valid'){
					checkoutHelper.showCheckoutError(MessageHelper.messages['CHECKOUT_OTP_NOT_VALIDATED']);
					return false;
				}
				}catch(err) {
					checkoutHelper.showCheckoutError(MessageHelper.messages['CHECKOUT_OTP_NOT_VALIDATED']);
					return false;
				}
			}
		}
		return true;
	},
	removeUnavailableItems: function(userObj) {
	$(document).trigger('dmart.checkout.action.inprogress');
	var cartJSON = DMStorage.getValue('OrderId');
	var freegiftOrderItem = [];
	var orderItemIdsinCart = [];
	    $.each(cartJSON.orderItems,function(idx,orderItem){ 
			if(orderItem.freeGift == "true"){
				freegiftOrderItem.push(orderItem.orderItemId);
			}    	
	   	});
	
	var params = {}; 
	var unavailableitemList = [];
	var iter = 0;
	if (typeof userObj.unavailableItems != "undefined") {
			$.each(userObj.unavailableItems,function (i, item){
				if(freegiftOrderItem.indexOf(item.orderItemId) == -1){
					unavailableitemList.push(item.orderItemId);
				}		
			});
		}	
		if (localStorage.getItem('OOSitemsList') != null) {
		   	 var OOSitemsList = DMStorage.getValue('OOSitemsList');
		   	$.each(OOSitemsList.unavailableItems,function (i, item){
		   		if(freegiftOrderItem.indexOf(item) == -1){
		   			unavailableitemList.push(item);
				}
		   	});
		}
		
		if(unavailableitemList.length>0){
			var result = [];
			  $.each(unavailableitemList, function(i, e) {
			    if ($.inArray(e, result) == -1) result.push(e);
			 });
			$.each(result,function (i, item){
				params["orderItemId_" + parseInt(i+1)] = parseInt(item);
				params["quantity_" + parseInt(i+1)]        = parseFloat('0.00');
			});
	}
	params.storeId = WCParamJS.storeId;
	params.catalogId = WCParamJS.catalogId;
	params.langId = WCParamJS.langId;
	params.orderId = orderId;
	
	$.ajax({
		        url: window.location.origin+'/webapp/wcs/stores/servlet/'+ "AjaxRESTOrderItemUpdate",
		        method: 'POST',
		        context: this,
		        async: false,
		        data: params,
		    }).done(function (data) {
		   	var userObj =this.getCheckoutObjects('userObj');
		   	delete userObj['isItemsUnavailable'];
		   	delete userObj['unavailableItems'];
		   	localStorage.removeItem('OOSitemsList');
		   	this.saveCheckoutObjects('userObj',userObj);
		   	if(typeof recalPrice != 'undefined'){
		   		recalPrice = true;
		   	}
		   	dojo.cookie("DM_OrderId", null, {expires: -1,path: '/'});
		    	this.invokeCartSummary();		    			    	
		    }).fail(function(data) {
		    	checkoutHelper.showCheckoutError(MessageHelper.messages['CHECKOUT_SERVER_ERROR']);		    	
		    	$(document).trigger('dmart.checkout.action.completed');
	    });

	},
	makeAddressFav: function(nickName,isPrimary) {
		var inputData = {};
		inputData.primary = isPrimary;
		inputData = JSON.stringify(inputData);
		var selectedAddress = undefined;
		$('#delivery-address-section input[type=radio]').each(function() {
			if ($(this).is(":checked")) {
				selectedAddress = ($(this).attr('id'));
			}
		});
		if (typeof selectedAddress != 'undefined') {
			this.saveCheckoutObjects("selectedAddr",selectedAddress);
		}
		$.ajax({
			url: "/wcs/resources/store/" + storeId + "/person/@self/contact/" + nickName,
			type: "PUT",
			data: inputData,
			context: this,
			contentType: "application/json"
		}).done(function(data) {
			this.renderAddressSummary();
			DMAnalytics.events( DMAnalytics.Constants.Category.AddressFav, "NickName:"+nickName , document.title, 0,null );
		});
	},
	setInventoryInvalidTime: function(){
		var userObj = checkoutHelper.getCheckoutObjects('addressObj');
		var now = new Date ();
		var invValidTime = new Date ( now );
		invValidTime.setMinutes ( now.getMinutes() + 25 );
		userObj.invValid = invValidTime.getTime();
		checkoutHelper.saveCheckoutObjects('addressObj',userObj);
	},
	
	checkOrderThreshould: function() {	
		var cartJSON = DMStorage.getValue('OrderId');
		if(typeof cartJSON != 'undefined' && typeof  cartJSON.total  != 'undefined' && cartJSON.total < cartMinThreshold){
			this.showCheckoutError(' Order threshold is <i class="icon-rupees"></i>'+cartMinThreshold+'. '+MessageHelper.messages['CHECKOUT_THRESHOULD_NOT_MET']);
			return false;
		}
		return this.hasOTPValidated();
		return true;
	},
	
	checkReservationCompleted: function() {
		var invValidTime = checkoutHelper.getCheckoutObjects('addressObj').invValid;
		if(typeof invValidTime == 'undefined'){
			checkoutHelper.showCheckoutError(" Your order is being reserved, please wait until the reservation completes.");
			setTimeout(function(){
				$('.js-payment-method-cta').trigger('click');
				}, 2000);
			return false;
		}else{
			$('.js-cart-reject').trigger('click');
			return true;
		}
	},
	showUnavailableItems: function() {	
		var userObj =this.getCheckoutObjects('userObj');
		if(DMStorage.getValue('OOSitemsList') != null || (typeof userObj != 'undefined' && userObj != null && typeof userObj.isItemsUnavailable != 'undefined')){
			this.showCheckoutError(MessageHelper.messages['CHECKOUT_ITEM_UNAVAILABLE']);
			nonStockItemsInTrolley = true;
		}
	},
	renderElements: function() {
		this.setShipModes();
		this.setDefaultShipModeInOrder();
		// First call mini trolley API to show product details
		this.invokeCartSummary();
//		this.checkItemAvailability();
		this.renderAddressSummary();
		this.checkFavouritePUPAndRenderPUP();
		
		//this.renderPUPAddress();
		this.setHistoryPushState('Delivery');
		setTimeout(function(){
		if($('#cart-summary-section').find('.cart-summary-delivery').length ==0){
		console.log('wait try');
		CartHelper.getCartItems();
		}
		}, 2000);

	},
	setShipModes: function() {
		var inputData = {};
		inputData.locale = "en_US";
		inputData.langId = "-1";		
		JSON.stringify(inputData);
		$.ajax({
			url: "/wcs/resources/store/" + storeId + "/cart/shipping_modes",
			type: "GET",
			data: inputData ,
			contentType: "application/json",
			context: this,
			async : false
		}).done(function(data) {
			var shipmodes = {};
			$.each(data.usableShippingMode, function(idx, shipMode) {
				if(shipMode.shipModeCode == "PickupInStore"){
					shipmodes.PickupInStore = shipMode.shipModeId;
				}else if(shipMode.shipModeCode == "Home Delivery" ){
					shipmodes.HomeDelivery = shipMode.shipModeId;
				}
			});
			this.saveCheckoutObjects("shipObj",shipmodes);
		}).fail(function(data) {
							this.showCheckoutError(MessageHelper.messages['CHECKOUT_SERVER_ERROR']);
		});
		
	},
	
	setDefaultShipModeInOrder: function() {
		var inputData = {};
		var selectedShipMode = this.getCheckoutObjects('shipObj').HomeDelivery;
		inputData.orderId = orderId;
		inputData.shipModeId = selectedShipMode;
		inputData = JSON.stringify(inputData);
		$.ajax({
			url: "/wcs/resources/store/" + storeId + "/cart/@self/shipping_info",
			type: "PUT",
			data: inputData,
			contentType: "application/json",
			context: this,
			async: false
		}).done(function(data) {
			
		}).fail(function(data){
			
		});
	},
	
	isDeliverySectionActive: function(){
		if(checkoutHelper.getParameterByName('currentAction') == 'Payment'){
			return false;
		}else{
			if($('.delivery-selection.js-delivery-selection').is(":visible")) {
				return true;
			} else{ 
				// no need to show delivery charge for pup also
				var selectedAdd = checkoutHelper.getCheckoutObjects('addressObj');
				if(selectedAdd != null && selectedAdd.selectedShipMode != "undefined" 
						&& selectedAdd.selectedShipMode == "Pick up Point"){
					return true;
				}else{
					return false;
				}				
			}			
		}
		return false;
	},
	renderorderSummary: function() {
		var addressId = this.getCheckoutObjects('addressObj').addressId;
		var selectedShipMode = this.getCheckoutObjects('addressObj').selectedShipMode;
		var slotObj = this.getCheckoutObjects('slotObj');
		var addressDetails = $('#' + addressId).parent().find("input[type='hidden']").attr('name').split('||');
		var inputData = {};
		inputData.fulfillmentType = "Delivery ";
		inputData.name = addressDetails[0];
		if(selectedShipMode === 'Home Delivery' ){
			inputData.address = addressDetails[1].replace(/(\r\n|\n|\r)/gm,"");
			inputData.city = addressDetails[2];
			inputData.state = addressDetails[3];
			inputData.zip = addressDetails[4];
			inputData.phone = addressDetails[5];
			inputData.landmark= addressDetails[1].indexOf('Landmark')>-1 ? addressDetails[1].substring(addressDetails[1].indexOf('Landmark')).trim():null;
			inputData.isDelivery = "true";
		}else{
			inputData.address = addressDetails[1]+', '+addressDetails[2]+', '+addressDetails[3];
			inputData.city = addressDetails[4];
			inputData.state = addressDetails[5];
			inputData.zip = addressDetails[6];
			inputData.phone = addressDetails[7];
			inputData.landmark=addressDetails[2].indexOf('Landmark')>-1 ? addressDetails[2].substring(addressDetails[2].indexOf('Landmark')).trim():null;
			inputData.fulfillmentType = "Pick-up Point ";
			inputData.selectedPupName = this.getCheckoutObjects('addressObj').pupName;
		}
		
		inputData.slotDetails = slotObj.slotDate + " " + slotObj.startTime + " to " + slotObj.endTime;
		inputData.slotDate= slotObj.slotDate;
		inputData.slotTime= slotObj.startTime + " to " + slotObj.endTime;
		inputData.selectedShipMode = selectedShipMode=='Pick up Point'?"DMart Ready Pick-up Point":selectedShipMode;
		nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
			autoescape: true,
			web: {
				useCache: true
			}
		});
		$('#checkout-address-slot-summary').html(nunjucks.render('_modules/order-summary-delivery-address.nunjucks', {
			data: inputData
		}));
		$('.js-delivery-selection-slot, .js-payment-method').hide();
		$('.js-delivery-selection-summary, .js-delivery-address').fadeIn();
		$('.js-payment-highlight').removeClass('active');
		this.setHistoryPushState('Summary');
		var cartJson=DMStorage.getValue('OrderId');
		var maxPUPAmnt=$('#pupMaxThreshold').val();
		var deliveryFlag=cartJson!=null?cartJson.deliveryRestrictionFlag:false;
		if(selectedShipMode!='Home Delivery' || deliveryFlag || cartJson.grandTotal>maxPUPAmnt)
			$('.prefer-pup-div').hide();
		else
			$('.prefer-pup-div').show();
		DMAnalytics.events( DMAnalytics.Constants.Action.PlaceOrder, DMAnalytics.Constants.Action.PlaceOrder, document.title, 0,null );
	},
	/**
	 * Class to show n action is in progress. This will add an loading image
	 * Needs more generic approach
	 */
	showLoading: function(divID) {
		$(divID).html('<img id="loadingsymbol"  style="align:center;" src="'+WCParamJS.staticServerHost+'images/colors/color1/loading.gif" alt="DMart">');
	},
	/**
	 * Class to show n action is in progress. This will remove the loading image
	 * Needs more generic approach
	 */
	removeLoading: function(divID) {
		$(divID).find('#loadingsymbol').remove();
	},
	/**
	 * TODO
	 */
	invokeCartSummary: function() {
		CartHelper.getCartItems();
	},
	renderCartSummaryRepay: function() {
		DMStorage.remove('OrderIdRepay');
		var orderIdReq = checkoutHelper.getParameterByName('orderId');
		var  urlPrefix = window.location.protocol + '//' + window.location.hostname;
		var  wcsResources = '/wcs/resources/store/';
		$.ajax({
			url: urlPrefix + wcsResources+ WCParamJS.storeId + '/order/'+orderIdReq,
			method: 'GET',
            context: this
        }).done(function(data){
          	CartHelper.storeOrderItems(data,true);           	
    			
        }).fail(function(data) {
			if(data.status==201){
				var cartJSON = {
					total : 0,
					tax : 0,
					totalQTY :0,
					totalSavings :0,
					orderItems :[]
			};					
            	DMStorage.set('OrderIdRepay', cartJSON);
		}
    });      


		

		
	},
	renderCartSummary: function() {
		var cartJSON = DMStorage.getValue('OrderId');
		// dont show delivery charge for delivery page
		var isDeliveryPage = this.isDeliverySectionActive();
		orderId = parseInt(cartJSON.orderId);
		cartJSON.absoluteUrl = window.location.origin+'/webapp/wcs/stores/servlet/';
		cartJSON.noImagePath = WCParamJS.staticServerHost + 'images/DMart/NoImage_T.jpg';
		cartJSON.storeId = WCParamJS.storeId;
		cartJSON.catalogId = WCParamJS.catalogId;
		cartJSON.langId = WCParamJS.langId;
		cartJSON.totalMinusDiscount = parseFloat(cartJSON.total) - parseFloat(cartJSON.discount);
		cartJSON.totalMinusDiscount = this.formatPrice(CartHelper.formatPricesForDisplay(cartJSON.totalMinusDiscount));
		cartJSON.totalSavingsPlusDiscount = parseFloat(cartJSON.totalSavings) + parseFloat(cartJSON.discount);
		cartJSON.totalSavingsPlusDiscount = this.formatPrice(CartHelper.formatPricesForDisplay(cartJSON.totalSavingsPlusDiscount));
		cartJSON.total = this.formatPrice(CartHelper.formatPricesForDisplay(cartJSON.total));
		cartJSON.discount = this.formatPrice(CartHelper.formatPricesForDisplay(cartJSON.discount));		
		cartJSON.grandTotal = isDeliveryPage ? this.formatPrice(CartHelper.formatPricesForDisplay(cartJSON.grandTotal - (cartJSON.totalShippingCharge - cartJSON.shippingAdjustment))) : 
			this.formatPrice(CartHelper.formatPricesForDisplay(cartJSON.grandTotal));
		cartJSON.totalShippingCharge = isDeliveryPage ? "0" : this.formatPrice(CartHelper.formatPricesForDisplay(cartJSON.totalShippingCharge));
		cartJSON.totalShippingAmount = isDeliveryPage ? "0" : this.formatPrice(CartHelper.formatPricesForDisplay(cartJSON.totalShippingCharge - cartJSON.shippingAdjustment));
		cartJSON.tax = this.formatPrice(CartHelper.formatPricesForDisplay(cartJSON.tax));
		cartJSON.showDeliveryCharge = "true";

		nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
			autoescape: true,
			web: {
				useCache: true
			}
		});
		$('#cart-summary-section').html(nunjucks.render('_modules/cart-summary-delivery.nunjucks', {
			data: cartJSON
		}));
		//$('.js-cart-summary-delivery .cart-details__item--title').trigger('click');
		this.adjustOrderSummarySection();
		$('.cart-details__item--title').removeClass('activate');
		$('.cart-details__scroll').perfectScrollbar({
		      suppressScrollX: true
	    });
		
		var orderTotalDisplay = CartHelper.formatPricesForDisplay(cartJSON.grandTotal);
		$('.total-payment-amount').children().html('<i class="icon-rupees"></i>'+orderTotalDisplay);
		$('.cod-payment-totalamount').children().html('<i class="icon-rupees"></i>'+cartJSON.x_codRoundedOrderTotal);
		this.checkAndRenderCOD(cartJSON.grandTotal);
		$(document).trigger('dmart.checkout.action.completed');
	},
	renderFailedCartSummary: function() {
		var cartJSON = {};
		var isDeliveryPage = this.isDeliverySectionActive();
		cartJSON.absoluteUrl = window.location.origin+'/webapp/wcs/stores/servlet/';
		cartJSON.noImagePath = WCParamJS.staticServerHost + 'images/DMart/NoImage_T.jpg';
		cartJSON.storeId = WCParamJS.storeId;
		cartJSON.catalogId = WCParamJS.catalogId;
		cartJSON.langId = WCParamJS.langId;
		cartJSON.totalMinusDiscount = 0.00;
		cartJSON.totalMinusDiscount = 0.00;
		cartJSON.totalSavingsPlusDiscount = 0.00;
		cartJSON.totalSavingsPlusDiscount = 0.00;
		cartJSON.total = 0.00;
		cartJSON.discount = 0.00;		
		cartJSON.grandTotal = 0.00;
		cartJSON.totalShippingCharge = 0.00;
		cartJSON.tax = 0.00;
		cartJSON.showDeliveryCharge = (!isDeliveryPage).toString();
		cartJSON.orderItems = [];
		cartJSON.totalShippingAmount = 0.00;
		nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
			autoescape: true,
			web: {
				useCache: true
			}
		});
		$('#cart-summary-section').html(nunjucks.render('_modules/cart-summary-delivery.nunjucks', {
			data: cartJSON
		}));
		//$('.js-cart-summary-delivery .cart-details__item--title').trigger('click');
		this.adjustOrderSummarySection();
		$('.cart-details__item--title').removeClass('activate');
		$('.cart-details__scroll').perfectScrollbar({
		      suppressScrollX: true
	    });
		$(document).trigger('dmart.checkout.action.completed');
		
		checkoutHelper.showCheckoutError(MessageHelper.messages['CHECKOUT_SERVER_ERROR']);
		window.location.href = 'GenericApplicationError?storeId='+WCParamJS.storeId+'&catalogId='+WCParamJS.catalogId+'&langId='+WCParamJS.langId;
	},
	checkIfAddressServed: function() {	
		if ($('#delivery-address-section').hasClass('resp-tab-content-active')) {
			var addressId = undefined;
			$('#delivery-address-section input[type=radio]').each(function() {
				if ($(this).is(":checked")) {
					addressId = ($(this).attr('id'));
				}
			});
			if(addressId == undefined && !($('#checkout-error-section').is(":visible")) && 
					$('#delivery-address-section input[type=radio]').length > 0) {
				this.showCheckoutError(MessageHelper.messages['CHECKOUT_SELECT_AN_ADDRESS']);
				return false;				
			}
			return this.checkPincodeServed(addressId);
		} else if ($('#delivery-PUP-address-section').hasClass('resp-tab-content-active')) {
			var selectedPin = undefined;
			$('#delivery-PUP-address-section input[type=radio]').each(function() {
				if ($(this).is(":checked")) {
					selectedPin = ($(this).parent().find('#pupAddressData').val().split('||'));
					selectedPin = selectedPin [selectedPin.length - 1].replace(/\s/g, '');
				}
			});
			/*	if($('#delivery_pin').html() != selectedPin){
				$('#delivery_pin').html(selectedPin);
				$('.main-menu__location-mini span').html(selectedPin+' <i class="icon-delivery-caret-down icon-caret-down"></i>');
				var cookieVal=WCParamJS.storeId+"_"+selectedPin;
		    	var CookieDate = new Date();
		    	CookieDate.setFullYear(CookieDate.getFullYear()+1);
		    	document.cookie = "DMART_Pincode_Cookie=" + cookieVal + ";expires=" + CookieDate.toGMTString( ) + ";path=/";
			} */
			//PUP pincodes doesnt need to be checked for pincode served. Just JIT - PUP mapping is enough.
			return true;
		}else{
			return true;		
		}
		
	},
	updateShipingAddress: function() {
		if ($('#delivery-address-section').hasClass('resp-tab-content-active')) {
			// selected delivery
			var addressId = undefined;
			$('#delivery-address-section input[type=radio]').each(function() {
				if ($(this).is(":checked")) {
					addressId = ($(this).attr('id'));
				}
			});
			if (typeof addressId === 'undefined') {
				this.showCheckoutError(MessageHelper.messages['CHECKOUT_SELECT_AN_ADDRESS']);
				return false;
			}
			$('.js-cart-reject').trigger('click');
			var addressData = $('#' + addressId).parent().find('input[type=hidden]').attr('name');
			if (typeof addressId != 'undefined' && typeof orderId != 'undefined') {
				var inputData = {};
				var selectedShipMode = this.getCheckoutObjects('shipObj').HomeDelivery;
				this.addressId = addressId;
				this.addressData = addressData;
				inputData.addressId = addressId;
				inputData.orderId = orderId;
				inputData.shipModeId = selectedShipMode;
				var orderItems = [];
				var cartJSON = DMStorage.getValue('OrderId');
				$.each(cartJSON.orderItems,function(indx,cartOrderItem) {
					var orderItem = {};
					orderItem.orderItemId = cartOrderItem.orderItemId;
					orderItem.shipModeId = selectedShipMode;
					orderItem.addressId = addressId;
					orderItems.push(orderItem);
				});			
			    inputData.orderItem = orderItems;
				inputData = JSON.stringify(inputData);
				$.ajax({
					url: "/wcs/resources/store/" + storeId + "/cart/@self/shipping_info",
					type: "PUT",
					data: inputData,
					contentType: "application/json",
					context: this
				}).done(function(data) {
					if (data.orderItem) {
						var addressObj = {};
						addressObj.storeId = storeId;
						addressObj.orderId = orderId;
						addressObj.addressId = this.addressId;
						addressObj.addressData = this.addressData;
						addressObj.selectedShipMode = "Home Delivery";
						this.saveCheckoutObjects('addressObj', addressObj);
						this.renderSlotSummary();
						this.addDummyPaymentInstruction();
					} else {
						this.showCheckoutError(MessageHelper.messages['CHECKOUT_SERVER_ERROR']);
						return false;
					}
				}).fail(function(data){
					if(data.responseJSON.errors[0].errorKey=='_ERR_RETRIEVE_PRICE'){
						CartHelper.invalidateCookieForOtherProtocol();
						CartHelper.checkItemAvailabilityForStore = true;
						CartHelper.getCartItems();
					}else{
						this.showCheckoutError(MessageHelper.messages['CHECKOUT_SERVER_ERROR']);
					}
				});
			}
		}
		else if ($('#delivery-PUP-address-section').hasClass('resp-tab-content-active')) {
			// selected PUP
			var addressId = undefined;
			var addressData = undefined;
			$('#delivery-PUP-address-section input[type=radio]').each(function() {
				if ($(this).is(":checked") && $(this).is(":visible")) {
					addressId = ($(this).attr('id'));
					addressData = ($(this).parent().find('#pupAddressData').val());
				}
			});
			if (typeof addressId === 'undefined') {
				this.showCheckoutError(MessageHelper.messages['CHECKOUT_SELECT_AN_ADDRESS']);
				return false;
			}
			$('.js-cart-reject').trigger('click');
			if (typeof addressId != 'undefined' && typeof orderId != 'undefined') {
				var inputData = {};
				this.addressId = addressId;
				this.addressData = addressData;
				inputData.orderId = orderId;
				var cartJSON = DMStorage.getValue('OrderId');
				var orderItems = [];
				var selectedShipMode = this.getCheckoutObjects('shipObj').PickupInStore;
				$.each(cartJSON.orderItems,function(indx,cartOrderItem) {
						var orderItem = {};
						orderItem.orderItemId = cartOrderItem.orderItemId;
						orderItem.physicalStoreId = addressId;
						orderItem.shipModeId = selectedShipMode;
						orderItems.push(orderItem);
				});			
				inputData.orderItem = orderItems;
				
				inputData = JSON.stringify(inputData);
				$.ajax({
					url: "/wcs/resources/store/" + storeId + "/cart/@self/shipping_info",
					type: "PUT",
					data: inputData,
					contentType: "application/json",
					context: this
				}).done(function(data) {
					if (data.orderItem) {
						var addressObj = {};
						addressObj.storeId = storeId;
						addressObj.orderId = orderId;
						addressObj.addressId = this.addressId;
						addressObj.addressData = this.addressData;
						addressObj.selectedShipMode = "Pick up Point";
						addressObj.pupName = $('.delivery-address-rdo:checked').siblings('.pup-address').text();
						this.saveCheckoutObjects('addressObj', addressObj);
						CartHelper.invalidateCookieForOtherProtocol();
						this.renderSlotSummary();
						this.addDummyPaymentInstruction();
					} else {
						this.showCheckoutError(MessageHelper.messages['CHECKOUT_SERVER_ERROR']);
						return false;
					}
				});
			}
		}
	},
	saveAddressAndRenderSlot: function() {

		if (this.checkIfAddressServed() && this.checkOrderThreshould() && this.checkNewStoreIdSelected()) {
			this.updateShipingAddress();
		}
		if(!checkoutHelper.isMobile()){
        	document.body.style.overflowX = "hidden";
         }
	},

	reserveInventory: function() {
		if (typeof orderId != 'undefined') {
			var params = {};
			params.storeId = this.getCheckoutObjects('addressObj').storeId;
			params.langId = "-1";
			params.orderId = orderId;
			params = JSON.stringify(params);

			$.ajax({
				url: "/wcs/resources/store/" + storeId + "/order/reserveInventory",
				type: "POST",
				data: params,
				contentType: "application/json",
				context: this
			}).done(function(data) {
				
				if(data.UnAllocatedOrderItems.length > 0 ){
					var cartJSON = DMStorage.getValue('OrderId');
					cartJSON.orderCalculationDone ='NoFreeGift';
					DMStorage.set('OrderId', cartJSON);	
					CartHelper.invalidateCookieForOtherProtocol();
				
				}		
				checkoutHelper.invokeCartSummary();
				checkoutHelper.setInventoryInvalidTime();
			}).fail(function(data) {
				this.showCheckoutError(MessageHelper.messages['CHECKOUT_SERVER_ERROR']);
			});
		}

	},
	
	checkItemAvailability : function() {

		var selectedPincode = $('#delivery_pin').html();
		if(typeof selectedPincode  != 'undefined' && selectedPincode.length > 0){
			var params = {};
			params.orderId = orderId;
			params.postcode = selectedPincode;
			params.checkInventory = false;
			params = JSON.stringify(params);
			$.ajax(
					{
						url : "/wcs/resources/store/" + storeId+ "/cart/checkItemAvailability",
						type : "POST",
						data : params,
						contentType : "application/json",
						context : this
					}).done(function(data) {
						if(data.unavailableItems.length > 0){
							DMStorage.set('OOSitemsList', data);
				          /*  if(typeof nonStockItemsInTrolley != 'undefined'){
				            	nonStockItemsInTrolley = true;
				    		} */
				            this.showCheckoutError(MessageHelper.messages['CHECKOUT_ITEM_UNAVAILABLE']);
						}else{
							DMStorage.remove('OOSitemsList');
						}
			}).fail(function(data) {
			});
		} else{
			setTimeout(function(){				
				console.log('wait try');
				checkoutHelper.checkItemAvailability();
				}, 2000);
		}
		

	},

	checkFavouritePUPAndRenderPUP : function() {

		var params = {};
		params.action = "get";
		params.attribute = "favouritePUP";
		// params.favouritePUPId = "10001";
		params = JSON.stringify(params);

		$.ajax(
				{
					url : "/wcs/resources/store/" + storeId	+ "/person/executeMemberAttribute",
					type : "POST",
					data : params,
					contentType : "application/json",
					context : this
				}).done(function(data) {
					favouritePUP = data.favouritePUPId;
					this.renderPUPAddress();
		}).fail(function(data) {
			this.renderPUPAddress();
		});

	},

	updateFavouritePUPForUser : function(favouritePUPId, isPrimary) {

		var params = {};
		if (isPrimary == "true") {
			params.action = "save";
		} else {
			params.action = "delete";
		}
		params.attribute = "favouritePUP";
		params.favouritePUPId = favouritePUPId;
		params = JSON.stringify(params);

		$.ajax(
				{
					url : "/wcs/resources/store/" + storeId + "/person/executeMemberAttribute",
					type : "POST",
					data : params,
					contentType : "application/json",
					context : this
				}).done(function(data) {
					favouritePUPId = data.favouritePUPId;
					$.each($('.delivery-vertical__address.delivery-vertical__address--pup.pupAddress').find('.js-delivery-favorite-icon'), function(idx, displayedPUPs) {
						if(favouritePUPId == $(displayedPUPs).attr('id')){
							$(displayedPUPs).removeClass('icon-heart-outlined');
							$(displayedPUPs).addClass('icon-heart');
							$('input:radio[name=delivery-address][id='+favouritePUPId+']').prop('checked', true).trigger("click");
							favouritePUP = favouritePUPId;
						}
						else{
							$(displayedPUPs).removeClass('icon-heart');
							$(displayedPUPs).addClass('icon-heart-outlined');
						}
					});	
		}).fail(function(data) {
			this.showCheckoutError(MessageHelper.messages['CHECKOUT_SERVER_ERROR']);
		});

	},

	addDummyPaymentInstruction: function() {

		var paymentInstruction = "";
		if (null != this.getCheckoutObjects('userObj')) {
			paymentInstruction = this.getCheckoutObjects('userObj').instruction;
		}
		if (paymentInstruction == "") {
			var cartJSON = DMStorage.getValue('OrderId');
			var params = {};
			params.storeId = this.getCheckoutObjects('addressObj').storeId;
			if(this.getCheckoutObjects('addressObj').selectedShipMode == 'Pick up Point'){
				var addressId = undefined;
				if(primaryAddress != ''){
					addressId = primaryAddress;
				}
				else{
					$('#delivery-address-section input[type=radio]').each(function() {
						addressId = ($(this).attr('id'));
					});
				}
				params.billing_address_id = addressId;
			}
			else{
				params.billing_address_id = this.getCheckoutObjects('addressObj').addressId;
			}
			params.payMethodId = "BillDesk";
			params.piAmount = cartJSON.total;

			$.ajax({
		        url: window.location.protocol + '//' + window.location.hostname + '/wcs/resources/store/' + WCParamJS.storeId + '/cart/@self/payment_instruction',
		        method: 'DELETE',
		        context: this,
		        async: false,

		    }).done(function (data) {
		    	$.ajax({
					url: window.location.origin+'/webapp/wcs/stores/servlet/' + "AjaxRESTOrderPIAdd",
					method: 'POST',
					context: this,
					async: false,
					data: params,
				}).done(function(data) {
					//alert('Success');	
					this.reserveInventory();
				}).fail(function(data) {
					this.showCheckoutError(MessageHelper.messages['CHECKOUT_SERVER_ERROR']);
				});
		    }).fail(function(data) {
		    	this.showCheckoutError(MessageHelper.messages['CHECKOUT_SERVER_ERROR']);
		    }); 
			
			
		}else{
			this.reserveInventory();
		}
	},

	renderSlotSummary: function() {
		var inputData = {};
		var now = new Date();
		// js badly requires date formatter. some jquery tweaks available but heavy. 
		inputData.date = now.getFullYear() + "-" + ('0' + (parseInt(now.getMonth()) + 1)).slice(-2) + "-" + ('0' + now.getDate()).slice(-2) +
			' ' + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
		inputData.orderId = orderId;
		var slotDate = inputData.date;
		inputData.weekNo = "1";
		inputData = JSON.stringify(inputData);
		this.invokeSlotOMSAjax(inputData, false);
		this.setHistoryPushState('Slot');
		
		DMAnalytics.events( DMAnalytics.Constants.Action.SlotSelection, DMAnalytics.Constants.Action.SlotSelection , document.title, 0,null );
	},
	renderNextSlotSummary: function() {
		var inputData = {};
		var now = new Date();
		if(checkoutHelper.firstSlotDate != undefined && checkoutHelper.firstSlotDate != ''){
			var firstDateTemp = checkoutHelper.firstSlotDate.split('/');	
			var fDate = [firstDateTemp[1],firstDateTemp[0],firstDateTemp[2]].join('/');
			var firstDateObject = new Date(fDate);
			firstDateObject.setDate(firstDateObject.getDate() + 7);
			now = firstDateObject;
		}else{
			now.setDate(now.getDate() + 7);
		}
		inputData.weekNo = "2";
		// js badly requires date formatter. some jquery tweaks available but heavy. 
		inputData.date = now.getFullYear() + "-" + ('0' + (parseInt(now.getMonth()) + 1)).slice(-2) + "-" + ('0' + now.getDate()).slice(-2) +
			' 00:00:00';
		inputData.orderId = orderId;
		inputData = JSON.stringify(inputData);
		this.invokeSlotOMSAjax(inputData, true);
		DMAnalytics.events( DMAnalytics.Constants.Category.SlotNext, DMAnalytics.Constants.Action.NextSlot , document.title, 0,null );

	},
	invokeSlotOMSAjax: function(inputData, isNextWeekSlot) {
		$('.js-delivery-selection, .js-delivery-selection-summary, .js-delivery-address, .js-payment-method').hide();
		$('.js-delivery-selection-slot').fadeIn();
		$('.js-payment-highlight').removeClass('active');
		var nextWeekSwitch = $('#nextWeekSlotSwitch').val();
		// Changed to perfectScrollbar as per RzF v1.0
	    var gridBreakpointsSm1 = 767;
	    var firstDateTemp = '';
	    if ($(window).width() <= gridBreakpointsSm1) {
	      $('.delivery-selection--this-week, .delivery-selection--coming-week').perfectScrollbar({
	        suppressScrollY: true
	      });
	    }
		if(isNextWeekSlot){			
			this.showLoading($('.delivery-selection.delivery-current-week'));}
		else{
			$('.delivery-selection.delivery-next-week').html('');
			this.showLoading($('.delivery-selection.delivery-current-week'));
		}
		$.ajax({
			url: "/wcs/resources/store/" + storeId + "/slot/getSlots",
			type: "POST",
			data: inputData,
			contentType: "application/json",
			context: this
		}).done(function(data) {
			var JSONdata = [];
			var uniqueDateList = [];
			var slotresourcePoolkey = data.availableSlots.resourcePoolkey;
			$.each(data.availableSlots.slotList, function(idx, slotsI) {
				if (uniqueDateList.indexOf(slotsI.date) == -1) {
					var slotDayList = {};
					var dateList = [],
						startTimeList = [],
						endTimeList = [],
						availabilityList = [],
						dayOfTheWeekList = [];
					uniqueDateList.push(slotsI.date);
					$.each(data.availableSlots.slotList, function(idxj, slotsJ) {
						if (slotsI.date === slotsJ.date) {
							dateList.push(slotsJ.date);
							try{
								startTimeList.push(slotsJ.startTime.replace(/ /g, '')); // Fix for JIRA 5298
								endTimeList.push(slotsJ.endTime.replace(/ /g, ''));
							}catch (err){
								startTimeList.push((slotsJ.startTime).split(' ').join('')); // Fix for JIRA 15005
								endTimeList.push((slotsJ.endTime).split(' ').join(''));
							}
							availabilityList.push(slotsJ.availability);
						}
					});
					slotDayList.date = slotsI.date;
					if(firstDateTemp == ''){
						firstDateTemp = slotsI.date;	
					}
					slotDayList.dateList = dateList;
					slotDayList.dayOfTheWeek = slotsI.dayOfTheWeek;
					slotDayList.todayOrTomorrow = slotsI.todayOrTomorrow;
					slotDayList.startTimeList = startTimeList;
					slotDayList.endTimeList = endTimeList;
					slotDayList.availabilityList = availabilityList;
					slotDayList.slotSwitch = nextWeekSwitch;
					JSONdata.push(slotDayList);
				}
			});

			nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
				autoescape: true,
				web: {
					useCache: true
				}
			});
			var slotSelectiondata = {};
			slotSelectiondata.slotResourcePoolKey = slotresourcePoolkey;
			slotSelectiondata.selectedShipMode = this.getCheckoutObjects('addressObj').selectedShipMode;
			slotSelectiondata.selectedPupName=this.getCheckoutObjects('addressObj').pupName;
			if('Pick up Point' == slotSelectiondata.selectedShipMode){
				slotSelectiondata.curationMsg = MessageHelper.messages['CHECKOUT_PUP_CURATION_MSG'];
			}
			slotSelectiondata.nextWeekSwitch = nextWeekSwitch;
			$('#checkout-slot-section').html(nunjucks.render('_modules/slot-selection.nunjucks', {
				data: slotSelectiondata
			}));
			var data = {};
			data.uniqueDateList = uniqueDateList;
			data.JSONdata = JSONdata;
			$(('.delivery-selection--') + (isNextWeekSlot ? 'next' : 'this') + ('-week')).html(nunjucks.render('_modules/slot-selection-grid.nunjucks', {
				data: data
			}));

			var gridBreakpointsSm = 1024;
		    
		    if ($(window).width() <= gridBreakpointsSm) {
		      $('.delivery-selection--this-week, .delivery-selection--current-week, .delivery-selection--next-week').perfectScrollbar({
		        suppressScrollY: true
		      });
		      $('.js-accordion-tabs .service-center-wrap').perfectScrollbar('destroy');
		      $('.js-accordion-tabs .service-center-wrap').perfectScrollbar({
		        suppressScrollY: true,
		        swipePropagation: true
		      });
		    }
			if ($('.delivery-selection-slot .delivery-selection-row').find('.selected-slot').length === 0) {
				$('.js-place-order').removeClass('enabled').addClass('button--disabled');
			}
			if (isNextWeekSlot) {
				$('.delivery-selection.delivery-next-week').show();
				$('.js-delivery-next-week').html('PREVIOUS 7 DAYS');
			}else{
				$('.js-delivery-next-week').html('NEXT 7 DAYS');
				checkoutHelper.firstSlotDate = firstDateTemp;
			}
		});
	},
	setUserLogonId: function(){
		this.logonId= undefined;
		if(typeof userFieldValue != "undefined" && userFieldValue!=null && userFieldValue != ""){
			this.logonId=userFieldValue.split("_")[0];
			$("#delivery-address-section #newMobileNumber").val(this.logonId);
			setTimeout(function(){
				this.logonId=userFieldValue.split("_")[0];				
				$("#delivery-address-section #newMobileNumber").val(this.logonId);
				}, 2000);
		}else{
			$.ajax({
				url: "/wcs/resources/store/" + storeId + "/person/@self",
				type: "GET",
				cache: false,
				context: this, 
			}).done(function(data) {
				if(data){
					this.logonId=data.logonId;
					$("#delivery-address-section #newMobileNumber").val(this.logonId);
				}
			});
		}
	},
	renderAddressSummary: function() {

		$.ajax({
			url: "/wcs/resources/store/" + storeId + "/person/@self/contact",
			type: "GET",
			cache: false,
			context: this
		}).done(function(data) {
			nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
				autoescape: true,
				web: {
					useCache: true
				}
			});
			data.userType = userType;
			if (data.contact) {
				var dummyAddress = [];
				var newContact  = [];
				$.each(data.contact, function(i, contacts) {
				if(contacts.firstName === contacts.nickName){
					dummyAddress.push(contacts.nickName);
					} else{
					newContact.push(contacts);
					}
				});
				if(newContact.length > 0){
					data.contact = newContact;
				}else{
					delete data.contact;
				}
			}			
			$('#delivery-address-section').html(nunjucks.render('_modules/selection-address-delivery.nunjucks', {
				data: data
			}));
			if (!data.contact) {
				$('#delivery-address-section').html($('.delivery-vertical__address-new').show());
				
				$('#saveFirstAddressDef').clickToggle( function () {
				      $(this).addClass('active');
				    }, function () {
				      $(this).removeClass('active');
				    });
				
				
				var newPincode = $('#delivery_pin').html();   
				if(newPincode == "" || newPincode.length <1 && getCookie("DMART_Pincode_Cookie")){
					newPincode = getCookie("DMART_Pincode_Cookie");
					newPincode = newPincode.split("_")[1];
				}
		    	var pincodeState = undefined;
		    	var pincodeCity = undefined;
		    	var pincodeMap = DMStorage.getValue('pincodeMap');
		    	if(pincodeMap == null){
					this.setPincodeMap();
					var pincodeMap = DMStorage.getValue('pincodeMap');
				}
		    	if(pincodeMap != null){
					$.each(pincodeMap, function(i, pin) {
						if(newPincode == pin.Pincode){
							pincodeState = pin.State;
							pincodeCity = pin.Region
						}
					});
					if(pincodeState != undefined && pincodeCity != undefined){
						//$('#formNoAddress input[name=newPincode]').val(newPincode); AE-17463
						$('#formNoAddress input[name=newCity]').val(pincodeCity).prop("disabled", true).removeClass('error');
						$('#formNoAddress input[name=newState]').val(pincodeState).prop("disabled", true).removeClass('error');
						$('#newCity-error').hide();
						$('#newState-error').hide();
					}
				}
		    	$('#formNoAddress input[name=mobileNumber]').attr('id','newMobileNumber').attr('name','newMobileNumber');
		    	//$('#formNoAddress input[name=newPincode]').val(newPincode);	AE-17463
		    	$(document).on('focusout', '#formNoAddress input[name=newPincode]', function () {
		        	var selectedPincode = $('.delivery-code__pin').text();
		        	var newPincode = $('#formNoAddress input[name=newPincode]').val();
		        	checkoutHelper.showCityAndStateForPincode(newPincode,'noAdd');    	
		        });
/*		    	$(document).on('focusout', '#formNoAddress input', function () {
		    		checkoutHelper.validateAddressData();
		        });*/
		    	this.isNoAddress = true;
		    	$("#delivery-address-section #newMobileNumber").val(this.logonId);
			}
			else{				
				$.each(data.contact, function(idx, address) {
					if(address.primary == 'true'){
						primaryAddress = address.addressId;
					}
				});
			}
			
			if($('.delivery-vertical_checkout').height() > ($('.delivery-vertical__address').height() + 25) ){
				$('.delivery-vertical_checkout').width($('.delivery-vertical__address').width() *0.95);
				$('.delivery-tabs .delivery-vertical__address').perfectScrollbar({
				      suppressScrollX: true,
				      swipePropagation: true
				});
			}
			$('#delivery-address-section').ready(function () {
				  //called when key is pressed in textbox
				  $("#delivery-address-section #newMobileNumber").keypress(function (e) {
				     //if the letter is not digit then display error and don't type anything
				     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
				        //display error message
				        //$("#errmsg").html("Digits Only").show().fadeOut("slow");
				               return false;
				    }
				   });
				});
			if (this.isNoAddress && data.contact) {
			    if ($('#delivery-address-section').hasClass('resp-tab-content-active')) {
			        var counter = 0;
			        $('#delivery-address-section input[type=radio]').each(function() {
			            $(this).attr('checked', true);
			            counter = counter + 1;
			        });			        
			        if (counter == 1) {
			        	if(!($('#checkout-error-section').is(":visible"))){
			        	this.isNoAddress = false;
			        	$('.js-delivery-selection').hide();
			        	this.showLoading($('.delivery-selection.delivery-current-week'));
			            $('.js-delivery-slot-cta.enabled').trigger("click");
			        	}else{
			        		$('.js-cart-reject').trigger('click');
			        		$(document).bind(
			        				'dmart.checkout.summary.ready',
			        				function(e) {
			        					if(checkoutHelper.isNoAddress && checkoutHelper.checkOrderThreshould()){
			        						$('.js-delivery-selection').hide();
			        						checkoutHelper.showLoading($('.delivery-selection.delivery-current-week'));
			        						checkoutHelper.saveAddressAndRenderSlot();
								            checkoutHelper.isNoAddress = false;
			        }
			        				});
			    }
			        	
			}
			    }
			}
			this.isNoAddress = false;
			checkoutHelper.hideFavForGuestUser();
			var favAddId = undefined;
			var selectedAddressId = checkoutHelper.getCheckoutObjects('selectedAddr');
			$('#delivery-address-section input[type=radio]').each(function() {
				if ($(this).is(":checked")) {
					favAddId = ($(this).attr('id'));
				}
			});			
			if (typeof favAddId === 'undefined' && selectedAddressId != null) {
				$('#'+selectedAddressId).prop('checked', true);
			}
			
			if(data.contact && data.contact.length == 1){
				$('#delivery-address-section input[type=radio]').each(function() {
					$(this).attr('checked',true);
				});
			}
			
		});


	},

	checkFirstAddressValid: function() {
		var div = $('#formNoAddress');
		var check = true;
		check = this.showFirstAddressErrpr($(div).find("[name='newName']"), 'Name', 'Enter Name') == true? check : false;
		check = this.showFirstAddressErrpr($(div).find("[name='newAddress']"), 'Address', 'Enter Address!') == true? check : false;
		check = this.showFirstAddressErrpr($(div).find("[name='newCity']"), 'City', 'Enter proper city name!') == true? check : false;
		check = this.showFirstAddressErrpr($(div).find("[name='newState']"), 'State', 'Enter proper state name') == true? check : false;
		check = this.showFirstAddressErrpr($(div).find("[name='newPincode']"), 'Pincode', 'Enter Pincode!') == true? check : false;
		check = this.showFirstAddressErrpr($(div).find("[name='newMobileNumber']"), 'MobileNumber', 'This field is required.') == true? check : false;
		if($(div).find('#guestEmailDiv').is(":visible") && $(div).find('#email').val().length > 0){
			check = this.showFirstAddressErrpr($(div).find("[name='email']"), 'Email', 'Please enter a valid email address.') == true? check : false; 
		}
		return check;
	},
	
	validateAddressData : function() {
		var parentdiv = $('#formNoAddress');
		$.each($('#formNoAddress input'), function(idx, inputDiv) {
			checkoutHelper.hideError(inputDiv,parentdiv, $(inputDiv).attr('name')+"-error");
		});
		var addressDiv = $('#formNoAddress').find("[name='newAddress']");
		this.hideError(addressDiv,parentdiv, "newAddress-error");
	},
	
	hideError: function (divObject,parentObj, divId){
		if($(divObject).val().length > 0){
			$(divObject).removeClass('error');
			$(parentObj).find("#"+(divId != 'email-error' ? divId: 'newEmail-error')).remove();
		}
	},
	showFirstAddressErrpr: function (divObject, divName, errorMsg){
		if($(divObject).val() == ""){
			$(divObject).addClass('error');
			var content = $('#new'+divName+'-error').html();
			if(content && content.length >0){
				$('#new'+divName+'-error').html(errorMsg);
			}else{
				$(divObject).parent().append('<span id="new'+divName+'-error" class="error" style="display: inline;"> '+errorMsg+'</span>');
			}
			return false;
		}
		else if(divName == "MobileNumber" && $(divObject).val().length>0 && !$(divObject).val().match(/^[7-9]+[0-9]{9}$/)){
			$(divObject).addClass('error');
			errorMsg = 'Enter valid mobile number';
			var content = $('#new'+divName+'-error').html();
			if(content && content.length >0){
				$('#newMobileNumber-error').html(errorMsg);
			}else{
				$(divObject).parent().append('<span id="new'+divName+'-error" class="error" style="display: inline;"> '+errorMsg+'</span>');
			}
			return false;
		}
		else if(divName == "Name" && $(divObject).val().length>0 && !$(divObject).val().match(/^[A-Za-z]+[A-Za-z\s]*$/)){
			errorMsg = 'Enter valid name';
			$(divObject).addClass('error');
			var content = $('#new'+divName+'-error').html();
			if(content && content.length >0){
				$('#new'+divName+'-error').html(errorMsg);
			}else{
				$(divObject).parent().append('<span id="new'+divName+'-error" class="error" style="display: inline;"> '+errorMsg+'</span>');	
			}
			return false;
		}
		else if(divName == "Email" && $(divObject).val().length>0 && !$(divObject).val().match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
			errorMsg = 'Please enter a valid email address.';
			$(divObject).addClass('error');
			var content = $('#new'+divName+'-error').html();
			if(content && content.length >0){
				$('#new'+divName+'-error').html(errorMsg);
			}else{
				$(divObject).parent().append('<span id="new'+divName+'-error" class="error" style="display: inline;"> '+errorMsg+'</span>');	
			}
			return false;
		}
		return true;
	},
	getLocation: function(callbackEvent) {
		try {
		var geocoder = new google.maps.Geocoder();
		var address = pinCode + " India";
		var location = [];
		geocoder.geocode({
			'address': address
		}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				latitude = results[0].geometry.location.lat();
				longitude = results[0].geometry.location.lng();
				//alert("Latitude: " + latitude + "\nLongitude: " + longitude);
				$(document).trigger(callbackEvent);
			} else {
				this.showCheckoutError(MessageHelper.messages['CHECKOUT_SERVER_ERROR']);
			}
		});
		}
		catch(err) {
			console.log("ohoh Google map not available");
			$(document).trigger(callbackEvent);
		}
	},

	renderPUPAddress: function() {

		var pupAddressData = undefined;
		pupAddressData = this.getCheckoutObjects('pupAddress-'+pinCode);
		
		if (typeof pupAddressData == 'undefined' || pupAddressData == null) {
			var maxItems = $('#maximumPUPAddresses').val();
			var radius = $('#radiusPUP').val();	
			$.ajax({
				url: "/wcs/resources/store/" + storeId + "//storelocator/latitude/" + latitude + "/longitude/" + longitude + "?siteLevelStoreSearch=false&responseFormat=json&maxItems="+maxItems+"&radius="+radius,
				type: "GET",
				context: this
			}).done(function(data) {
				var arrayData = [];
				$.each(data.PhysicalStore, function(index, physicalStore) {
					var addressItm = {};
					var latlngData = [];
					latlngData[0] = physicalStore.latitude;
					latlngData[1] = physicalStore.longitude;
					addressItm.latlng = latlngData;
					addressItm.displayName = physicalStore.storeName;
					//+ ', ' + physicalStore.addressLine[0] + ', ' + physicalStore.addressLine[1] + ', ' + physicalStore.addressLine[2] + ', ' + physicalStore.city + ' - ' + physicalStore.postalCode + ', ' + physicalStore.stateOrProvinceName + '.';
					//addressItm.name = physicalStore.storeName + '||' + physicalStore.addressLine[0] + '||' + physicalStore.addressLine[1] + '||' + physicalStore.addressLine[2] + '||' + physicalStore.city + '||' + physicalStore.stateOrProvinceName + '||' + physicalStore.postalCode;
					addressItm.name = physicalStore.addressLine[0] + '||' + physicalStore.addressLine[1] + '||' + physicalStore.addressLine[2] + '||' + physicalStore.city + '||' + physicalStore.stateOrProvinceName + '||' + physicalStore.postalCode;
					addressItm.addressId = physicalStore.uniqueID;
					if(favouritePUP != "" && favouritePUP == physicalStore.uniqueID){
						addressItm.favouritePUP = "true";
					}
					else{
						addressItm.favouritePUP = "false";
					}
					arrayData[index] = addressItm;
				});
				data.addressItms = arrayData;
				data.pinCode = pinCode;
				
				this.saveCheckoutObjects('pupAddress-'+pinCode,arrayData);
				
				this.displayPUPAddress(data);
			});																
		}
		else{
			var data = {};
			var arrayData = [];
			$.each(pupAddressData, function(index, physicalStore) {
				var addressItm = {};
				addressItm.latlng = physicalStore.latlng;
				addressItm.name = physicalStore.name;
				addressItm.addressId = physicalStore.addressId;
				if(favouritePUP != "" && favouritePUP == physicalStore.addressId){
					addressItm.favouritePUP = "true";
				}
				else{
					addressItm.favouritePUP = "false";
				}
				arrayData[index] = addressItm;
			});
			data.addressItms = arrayData;
			data.pinCode = pinCode;
			this.displayPUPAddress(data);
		}
			
		


	},
	
	displayPUPAddress: function(data) {
		nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
			autoescape: true,
			web: {
				useCache: true
			}
		});
		data.noPups = 'false';
		if(jQuery.isEmptyObject(data)){
			data.noPups = true;
		}
		var imgUrl= WCParamJS.staticServerHost + 'css/';
		var config= {'baseUrl':imgUrl};
		pupAddress = data;
		data.config = config
		$('#delivery-PUP-address-section').html(nunjucks.render('_modules/selection-address-pup.nunjucks', {
			data: data
		}));
		
		$('.delivery-tabs .delivery-vertical__address--pup').perfectScrollbar({
		      suppressScrollX: true,
		      swipePropagation: true
		});
		checkoutHelper.hideFavForGuestUser();
		
		var isPupSelected = checkoutHelper.getCheckoutObjects('pupSelected');
		if(isPupSelected == 'Y'){
			setTimeout(function(){
				$('#pickup_div').trigger('click');
			}, 500);
			
			checkoutHelper.saveCheckoutObjects('pupSelected', 'N');
		}
		$('#marker_list').ready(function(){
			$('.address-selected').find('.pup-label').find('.pup-address').addClass('pup-address-active');
			var pupId = $('.address-selected').find('.delivery-address-rdo').attr('id');
			$('.address-selected').find('label').find('.delivery-favorite-cta').hide();
			var addressLink = '<div class=\"view-address-wrapper\"><a href=\"javascript:;\" class=\"view-address-text\" id=\"'+pupId+'"\">View Addrees<\/a><\/div>';
			$('.address-selected').find("label").append(addressLink);
		});
	},
	
	filterPUPAddress: function() {
		var inputString = $('.pup--filter-field').val();
		$.each( $('#marker_list').children(), function(index, physicalStore) {
			var htmlData = $(physicalStore).html();
			if(htmlData.toLowerCase().indexOf(inputString.toLowerCase()) == -1){
				$(physicalStore).hide();
			}else{
				$('#pupDiv').css('display','block');
				$(physicalStore).show();
			}
		});
		if(!$('#marker_list li').is(':visible')){
			$('#pincode-text-span').html(inputString);
			$('.delivery-address-PUP-unavailable').css('display','block');
			$('#pupDiv').css('display','none');
			$('.delivery-address-padding-map').css('display','none');	
			$('.pup--filter-field').attr('style', 'border: solid 1px #ba5a5a;');
		}else{
			$('.delivery-address-PUP-unavailable').css('display','none');
			//$('.delivery-address-padding-side').css('display','block');
			$('#pupDiv').css('display','block');
			$('.delivery-address-padding-map').css('display','block');
			$('.pup--filter-field').removeAttr('style');
		}
	},
	
	isMobile: function(){
		if( navigator.userAgent.match(/Android/i)
			 || navigator.userAgent.match(/webOS/i)
			 || navigator.userAgent.match(/iPhone/i)
			 || navigator.userAgent.match(/iPad/i)
			 || navigator.userAgent.match(/iPod/i)
			 || navigator.userAgent.match(/BlackBerry/i)
			 || navigator.userAgent.match(/Windows Phone/i)
			 ){
			    return true;
			  }
			 else {
			    return false;
			  }
	},

	formatDate: function() {
		var now = new Date();
		var todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
		return todayUTC.toISOString().slice(0, 10).replace(/-/g, '-');
	},
	/**
	 * 
	 * @returns date in format YYYY-MM-DD
	 */
	addDays: function(days) {
		return new Date(new Date() + days * 24 * 60 * 60 * 1000);
	},
	dynamicSort: function(property) {
		var sortOrder = 1;
		if (property[0] === "-") {
			sortOrder = -1;
			property = property.substr(1);
		}
		return function(a, b) {
			var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
			return result * sortOrder;
		}
	},
	deleteAddress: function(nickName) {
		var selectedAddress = undefined;
		$('#delivery-address-section input[type=radio]').each(function() {
			if ($(this).is(":checked")) {
				selectedAddress = ($(this).attr('id'));
			}
		});
		if (typeof selectedAddress != 'undefined') {
			this.saveCheckoutObjects("selectedAddr",selectedAddress);
		}
		$.ajax({
			url: "/wcs/resources/store/" + storeId + "/person/@self/contact/" + nickName,
			type: "DELETE",
			context: this,
			contentType: "application/json"
		}).done(function(data) {
			this.renderAddressSummary();
			DMAnalytics.events( DMAnalytics.Constants.Category.DeleteAdd, "NickName:"+nickName , document.title, 0,null );
		});

	},
	changePinCodeSelected: function(pincodeData) {
		var inputs = {};
		inputs.pinNumberModal = pincodeData.Pincode+", "+pincodeData.Area;
		inputs.storeIdNew = pincodeData.StoreId;
		inputs.storeId = pincodeData.StoreId;
		if(storeUserType!='R'){
			var currentCart =  DMStorage.getValue('OrderId');
			if(currentCart != null && currentCart != undefined){
				var currentOrderId = DMStorage.getValue('OrderId').orderId;
				inputs.currentOrderId = currentOrderId;
			}
			if(typeof userFieldValue != "undefined" && userFieldValue!=null && userFieldValue != ""){
				if(typeof oldGuestId != "undefined" && oldGuestId!=null && oldGuestId != "" && oldGuestId != "-1002"){
					inputs.oldGuestIdInput = oldGuestId;
					inputs.userField3 = userFieldValue;
				}
			}
		}else{
			inputs.storeUserType = storeUserType;
			if(typeof oldGuestId != "undefined" && oldGuestId!=null && oldGuestId != "" && oldGuestId != "-1002"){
				inputs.oldGuestIdInput = oldGuestId;
			}
		}
		inputs.pinCodeNew = pincodeData.Pincode;
		inputs.currentPath = window.location.href;
		
		
		var cookieVal=pincodeData.StoreId+"_"+pincodeData.Pincode;
    	var CookieDate = new Date;
    	CookieDate.setFullYear(CookieDate.getFullYear()+1);
    	document.cookie = "DMART_Pincode_Cookie=" + cookieVal + ";expires=" + CookieDate.toGMTString( ) + ";path=/";
		$("input[id=storeIdNew]").val(pincodeData.StoreId);
		$("input[id=storeId]").val(pincodeData.StoreId);
		if(storeUserType!='R'){
			var currentCart =  DMStorage.getValue('OrderId');
			if(currentCart != null && currentCart != undefined){
				var currentOrderId = DMStorage.getValue('OrderId').orderId;
				$("input[id=currentOrderId]").val(currentOrderId);
			}
			if(typeof userFieldValue != "undefined" && userFieldValue!=null && userFieldValue != ""){
				if(typeof oldGuestId != "undefined" && oldGuestId!=null && oldGuestId != "" && oldGuestId != "-1002"){
					$("input[id=oldGuestIdInput]").val(oldGuestId);
					$("input[id=userField3]").val(userFieldValue);
				}
			}
		}else{
			$("input[id=storeUserType]").val(storeUserType);
			if(typeof oldGuestId != "undefined" && oldGuestId!=null && oldGuestId != "" && oldGuestId != "-1002"){
				$("input[id=oldGuestIdInput]").val(oldGuestId);
			}
		}
		$("input[id=pinCodeNew]").val(pincodeData.Pincode);
		$("input[id=storeIdNewLogin]").val(pincodeData.StoreId);
		$("input[id=pinCodeNewLogin]").val(pincodeData.Pincode);
		$("input[id=currentPath]").val(window.location.href);
		document.getElementById("delivery_pin").innerHTML=pincodeData.Pincode;
		dojo.cookie("DM_OrderId", null, {expires: -1,path: '/'});
		$('#formLocationValidationModal').submit();
			
	},
	checkNewStoreIdSelected: function() {
		if ($('#delivery-address-section').hasClass('resp-tab-content-active')) {
			var addressId = undefined;
			$('#delivery-address-section input[type=radio]').each(function() {
				if ($(this).is(":checked")) {
					addressId = ($(this).attr('id'));
				}
			});
			var addressPin = this.hasPincodeChanged(addressId);
			if(addressPin){
				var pincodeMap = DMStorage.getValue('pincodeMap');
				if(pincodeMap == null){
					this.setPincodeMap();
					var pincodeMap = DMStorage.getValue('pincodeMap');
				}
				var pincodeData = undefined; 
				$.each(pincodeMap, function(i, pin) {
					if(addressPin == pin.Pincode){
						pincodeData = pin;
						return false; 
					}
				});
				if(pincodeData.StoreId != WCParamJS.storeId){
					this.changePinCodeSelected(pincodeData);
					return false;
				}else{
					var pincodeCookie = getCookie("DMART_Pincode_Cookie");
					if(typeof pincodeCookie != 'undefined'){
						var pinCodeChosen = pincodeCookie.split("_")[1];
						if(pincodeData.Pincode != pinCodeChosen){
							$('#delivery_pin').html(pincodeData.Pincode);
							$('.main-menu__location-mini span').html(pincodeData.Pincode+' <i class="icon-delivery-caret-down icon-caret-down"></i>');
							var cookieVal=pincodeData.StoreId+"_"+pincodeData.Pincode;
					    	var CookieDate = new Date;
					    	CookieDate.setFullYear(CookieDate.getFullYear()+1);
					    	document.cookie = "DMART_Pincode_Cookie=" + cookieVal + ";expires=" + CookieDate.toGMTString( ) + ";path=/";
						}
					}
					/*
					 * Pincode change. Lets check for item availability after cart loads.  
					 */
					$(document).bind('dmart.checkout.summary.ready',
						    function(e) {
								checkoutHelper.checkItemAvailability();
						    });
				}
			}
			
		}
		return true;
	},
	hasPincodeChanged : function(addressId) {
		var addressData = $('#'+addressId).parent().find("input[type='hidden']").attr('name');
		if(typeof addressData != 'undefined' && addressData.length > 0){
			addressData = addressData.split('||');
			var selectedPin = $('#delivery_pin').html();
			var addressPin = addressData[4];
			if(addressPin != selectedPin){
				return addressPin;
			}else{
				return addressPin;
			}
		}		
	},
	checkValidPincode: function(aPincode) {	
		var pincodeMap = DMStorage.getValue('pincodeMap');
		if(pincodeMap == null){
			this.setPincodeMap();
			var pincodeMap = DMStorage.getValue('pincodeMap');
		}
		var pinCodeServed = false;
		if(pincodeMap != null){
			$.each(pincodeMap, function(i, pin) {
				if(aPincode == pin.Pincode){
					pinCodeServed = true;
				}
			});
		}
		
		return pinCodeServed;
	},
	checkPincodeServed: function(addressId) {		
		var addressData = $('#'+addressId).parent().find("input[type='hidden']").attr('name');
		if(typeof addressData != 'undefined' && addressData.length > 0){
			addressData = addressData.split('||');
			var addressPin = addressData[4];
			if(!(this.checkValidPincode(addressPin))){
				this.showCheckoutError(MessageHelper.messages['CHECKOUT_NON_SERVING_PINCODE']);
				$('#newAddressModal input[name=newCity]').val('').prop("disabled", false);
				$('#newAddressModal input[name=newState]').val('').prop("disabled", false);
				return false;
			}else{
				if($('#checkout-error-section').is(":visible") && 
						$('#checkout-error-section').html().indexOf('Please select a new pincode') >0 ){
					$('.js-cart-reject').trigger('click');
				}
				return true;
			}
		}else{
			//$(document).trigger('dmart.checkOut.pincode.fetchall');
			return false;
		}
	},
	
	formatPrice: function(price){
		var finalPrice = price.split('.');
		 if(finalPrice[1] && finalPrice[1].length > 2){
		 	finalPrice[1] = finalPrice[1].substr(0, 2);
		 }	
		 return finalPrice=="NaN" ? "0.00" : finalPrice.join('.');
	},
	
	editAddressLoad: function(nickName) {
		var div = $('#editAddressModal');
		div.show();
		if(userType == 'G'){        
        	$('#guestEmailEditDiv').show();
        }
		$("#formEditAddress").data('validator').resetForm();
		var addressData = $('#addressList-' + nickName).attr('name').split('||');
		div.find("[name='editName']").val(addressData[0]);
		// OOB doesnt have Landmark. Bad approach
		if(addressData[1].indexOf('Landmark:') > 0){
			div.find("[name='editAddress']").val((addressData[1].substr(0,addressData[1].indexOf('Landmark:') -1)).replace('Landmark: ','').trim());
			var landmark = (addressData[1].substr(addressData[1].indexOf('Landmark:'), addressData[1].length)).replace('Landmark: ','');
			if(landmark.substr(landmark.length-1,landmark.length) == ','){
			landmark = landmark.substr(0,landmark.length-1);
			}
			div.find("[name='editLandmark']").val(landmark);
		}
		else{
		div.find("[name='editAddress']").val(addressData[1].replace(/^\s+|\s+$/g, ''));
		div.find("[name='editLandmark']").val('');
		}
		div.find("[name='editCity']").val(addressData[2]).prop("disabled", true);
		div.find("[name='editState']").val(addressData[3]).prop("disabled", true);
		div.find("[name='editPincode']").val(addressData[4]);
		$('#editAddressModal').find('#editMobileNumber').val(addressData[5]);
		div.find("[name='email']").val(addressData[6]);
		$('#editAddressModal').find('#addressList-nickName').val(nickName);
		if(addressData[7] === 'fav'){
		$('#editAddressModal').find('.js-make-default-address').addClass('active');
		}else{
		$('#editAddressModal').find('.js-make-default-address').removeClass('active');
		}

	},

	editAddress: function() {
		var nickName = $('#editAddressModal').find('#addressList-nickName').val();
		var values = {};
		var inputData = {};
		$('#editAddressModal input[name=editCity]').prop("disabled", false);
		$('#editAddressModal input[name=editState]').prop("disabled", false);
		$.each($('#formEditAddress').serializeArray(), function(i, field) {
			values[field.name] = field.value;
		});
		if (!this.checkValidPincode(values.editPincode)){
		// somewhere the error is getting overwritten. Will find you. TODO
			this.showPinCodeNotServedEdit();
			return false; 
		}
		if(!$('#formEditAddress').valid()){
			return false;
		}
		inputData.nickName = nickName;
		inputData.firstName = values.editName.trim();
		inputData.addressLine = [];
		inputData.addressLine[0] = values.editAddress.replace(/\n/g, ' ').trim();
		// OOB doesnt have landmark. so saving with a flag
		if(values.editLandmark.length > 0){
			inputData.addressLine.push('Landmark: '+values.editLandmark);
		}else{
			inputData.addressLine.push("");
		}
		inputData.city = values.editCity;
		inputData.addressType = 'ShippingAndBilling'
		inputData.state = values.editState;
		inputData.phone1 = values.editMobileNumber;
		inputData.mobilePhone1 = values.editMobileNumber;
		if(values.email != ''){
			inputData.email1 = values.email;	
		}
		inputData.zipCode = values.editPincode;
		inputData.primary = ($('#editAddressModal').find('.js-make-default-address').hasClass('active')).toString();
		inputData.country = 'India';
		inputData = JSON.stringify(inputData);
		$.ajax({
			url: "/wcs/resources/store/" + storeId + "/person/@self/contact/" + nickName,
			type: "PUT",
			data: inputData,
			context: this,
			contentType: "application/json"
		}).done(function(data) {
			$('#formEditAddress').removeClass('add-in-progress');
			this.renderAddressSummary();
			$('#editAddressModal').hide();			
		}).fail(function(data) {    	
			$('#formEditAddress').removeClass('add-in-progress');
		});
		DMAnalytics.events( DMAnalytics.Constants.Category.AddressEdit, "NickName:"+nickName , document.title, 0,null );
	},
	saveAddress: function(divName) {
		var values = {};
		var inputData = {};
		$('#'+divName+' input[name=newCity]').prop("disabled", false);
		$('#'+divName+' input[name=newState]').prop("disabled", false);	
		$.each($('#'+divName).serializeArray(), function(i, field) {
			values[field.name] = field.value;
		});
		if (!this.checkValidPincode(values.newPincode)){
		// somewhere the error is getting overwritten. Will find you. TODO
			this.showPinCodeNotServedNew();
			return false; 
		}
		inputData.nickName = new Date().getTime().toString();
		inputData.firstName = values.newName.trim();
		inputData.addressLine = [];
		inputData.addressLine[0] = values.newAddress.replace(/\n/g, ' ').trim();
		// OOB doesnt have landmark. saving with a flag
		if(values.newLandmark.length > 0){
		inputData.addressLine.push('Landmark: '+values.newLandmark);
		}
		inputData.city = values.newCity;
		inputData.addressType = 'ShippingAndBilling'
		inputData.state = values.newState;
		inputData.phone1 = values.newMobileNumber;
		inputData.mobilePhone1 = values.newMobileNumber;
		if(values.email != ''){
			inputData.email1 = values.email;	
		}
		inputData.zipCode = values.newPincode;
		inputData.primary = ($('#'+divName).find('.js-make-default-address').hasClass('active')).toString();
		inputData.country = 'India';
		inputData = JSON.stringify(inputData);
		$.ajax({
			url: "/wcs/resources/store/" + storeId + "/person/@self/contact",
			type: "POST",
			data: inputData,
			context: this,
			contentType: "application/json"
		}).done(function(data) {
			this.renderAddressSummary();
			$('#newAddressModal').hide();
			$('#formNoAddress').removeClass('add-in-progress');
			$('#formNewAddressModal').removeClass('add-in-progress');
		}).fail(function(data) {    	
			$('#formNoAddress').removeClass('add-in-progress');
			$('#formNewAddressModal').removeClass('add-in-progress');
		});
		DMAnalytics.events( DMAnalytics.Constants.Category.AddAddress, "Data:"+inputData , document.title, 0,null );		
	},

	saveCheckoutObjects: function(key, value) {
		if (!window.sessionStorage || WCParamJS.dontUseLocalStorage === '1' ) {
			checkoutObjects[key] = JSON.stringify({
				value: value
			});
		} else {
			sessionStorage.setItem(key, JSON.stringify({
				value: value
			}));
		}
	},

	getCheckoutObjects: function(key) {
		if (!window.sessionStorage || WCParamJS.dontUseLocalStorage === '1' ) {
			return ((typeof checkoutObjects[key] === "undefined") ? null : JSON.parse(checkoutObjects[key]).value);
		}
		var temp = sessionStorage.getItem(key);
		if (temp) {
			return JSON.parse(temp).value;
		}
		return null;
	},
	
	showCheckoutError: function(errorMsg) {
		if(errorMsg.length > 0 && !$('.js-cart-reject').is(":visible")){
			$('#checkout-error-section').html(errorMsg);
			$('.alert.alert-warning-bg.js-alert-order').show();
			$('#checkout-error-section').parents('.container').show();
			$("html, body").animate({
				scrollTop: 0
			}, "slow");
		}
	},
	showLoadingImage: function() {
		$('#loadingActionDiv').show();
	},
	stopLoadingImage: function() {
		$('#loadingActionDiv').hide();
	},
	setHistoryPushState: function(action) {
		var baseURL = window.location.origin+'/webapp/wcs/stores/servlet/'+'CheckoutView?langId='+WCParamJS.langId+'&catalogId='+WCParamJS.catalogId+'&storeId='+WCParamJS.storeId+'&orderId='+orderId;
		var currentActionURL = '&currentAction='+action;
		var currentAction = { action: action };
		history.pushState(currentAction ,'Checkout | DMart', baseURL +currentActionURL );
	},
	getParameterByName: function(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	},
	showPinCodeNotServedNew : function() {
		if($('#formNewAddressModal').find("[name='newPincode']").val() != "" && $('#formNewAddressModal').find("[name='newPincode']").val().length > 5 ){
			setTimeout(function(){
				var divObject = $('#formNewAddressModal').find("[name='newPincode']");
				divObject.addClass('error');
				if(!$('#newPincode-error').is(":visible")){
					divObject.parent().append('<span id="newPincode-error" class="error" style="display: inline;">Selected pin code not serviceable!</span>');
				}
				$('#newAddressModal input[name=newCity]').val('').prop("disabled", true);	//AE-17463
				$('#newAddressModal input[name=newState]').val('').prop("disabled", true);	
				}, 500);
		}
	},
	
	isGuestUser : function(){
		return typeof storeUserType != "undefined" && storeUserType == "G" ? true : false;
	}, 
	hideFavForGuestUser : function(){
		if(this.isGuestUser()){
			$('#saveFirstAddressDef').hide();
			$('.js-delivery-favorite').hide();
			$('.js-make-default-address').hide();
		}
	},
	/*
	 * Cheking basic future slot date validation in UI
	 * Rest all should be handled in OMS. 
	 */
	isFutureSlot: function(slotDate, time){
		try{
			var slotDate = slotDate + " "+time+":00:00";
			var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
			var slotDateObj = new Date(slotDate.replace(pattern,'$3-$2-$1'));
			var now = new Date();		
			return slotDateObj == "Invalid Date" ? true : slotDateObj.getTime() >  now.getTime() ? true : false;
		} catch (err) {		
			return true;
		}
		
	},
	showPinCodeNotServednoAdd : function() {
		if($('#formNoAddress').find("[name='newPincode']").val() != "" && $('#formNoAddress').find("[name='newPincode']").val().length > 5 ){
			setTimeout(function(){
				var divObject = $('#formNoAddress').find("[name='newPincode']");
				divObject.addClass('error');
				if(!$('#newPincode-error').is(":visible")){
					divObject.parent().append('<span id="newPincode-error" class="error" style="display: inline;">Selected pin code not serviceable!</span>');
				}
				$('#formNoAddress input[name=newCity]').val('').prop("disabled", true);	//AE-17463
				$('#formNoAddress input[name=newState]').val('').prop("disabled", true);
				}, 500);
		}
	},
	showPinCodeNotServedEdit : function() {
		if($('#formEditAddress').find("[name='editPincode']").val() != "" && $('#formEditAddress').find("[name='editPincode']").val().length > 5 ){
			setTimeout(function(){
				$('#editPincode-error').remove();
				var divObject = $('#formEditAddress').find("[name='editPincode']");
				divObject.addClass('error');
				divObject.parent().append('<span id="editPincode-error" class="error" style="display: inline;">Selected pin code not serviceable!</span>');
				$('#formEditAddress input[name=editCity]').val('').prop("disabled", false);
				$('#formEditAddress input[name=editState]').val('').prop("disabled", false);
				}, 500);
		}
	},
	
	setPincodeMap : function (){
		 $.ajax({
		    	url: getAbsoluteURL()+"wcs/resources/store/"+storeId+"/storepincodedetails/byPinCode",
		    	method: 'GET',
		    	context: this,
		    	async: false,
		    	cache: false
		        }).done(function (data) {	
		        if(data.StorePincodeDetails){    
		        	servicedPincodesJSON  = data.StorePincodeDetails;
		            DMStorage.set('pincodeMap',servicedPincodesJSON); 
		        }
		    });	
	},
	showCityAndStateForPincode: function(aPinCode, divName) {
		var pincodeState = undefined;
    	var pincodeCity = undefined;
		var pincodeMap = DMStorage.getValue('pincodeMap');
		if(pincodeMap == null){
    		checkoutHelper.setPincodeMap();
			var pincodeMap = DMStorage.getValue('pincodeMap');
		}
		if(pincodeMap != null){
			$.each(pincodeMap, function(i, pin) {
				if(aPinCode == pin.Pincode){
					pincodeState = pin.State;
					pincodeCity = pin.Region
				}
			});
		}
		if(pincodeState != undefined && pincodeCity != undefined){
			var divCityIdentifier = (divName == 'new') ? '#newAddressModal input[name=newCity]' :
					(divName == 'noAdd') ? '#formNoAddress input[name=newCity]': '#editAddressModal input[name=editCity]';			
			var divStateIdentifier = (divName == 'new') ? '#newAddressModal input[name=newState]' :
					(divName == 'noAdd') ? '#formNoAddress input[name=newState]': '#editAddressModal input[name=editState]';	
			$(divCityIdentifier).val(pincodeCity).prop("disabled", true);
			$(divStateIdentifier).val(pincodeState).prop("disabled", true);
			$(divStateIdentifier).removeClass('error');
			$(divCityIdentifier).removeClass('error');	
			$((divName == 'new' || divName == 'noAdd' ) ? '#newCity-error' : '#editCity-error').hide();
			$((divName == 'new' || divName == 'noAdd' ) ? '#newState-error' : '#editState-error').hide();	
			$((divName == 'new' || divName == 'noAdd' ) ? '#newPincode-error' : '#editPincode-error').hide(); // Fix for AE-8462
			$('#formNoAddress input[name=newPincode]').removeClass('error');	
			$('#formNoAddress').find("#newPincode-error").empty();
		}else{
			//Commented out as a fix for AE-14096
			//$('#newCity-error').remove();
			//$('#newPincode-error').remove(); // Fix for AE-8462
			//$('#editPincode-error').remove(); // Fix for AE-8462
			(divName == 'new') ? this.showPinCodeNotServedNew() :
				(divName == 'noAdd') ? 	this.showPinCodeNotServednoAdd() : this.showPinCodeNotServedEdit() ;
		}
		
	},
	checkAndRenderCOD : function(grandTotal){
		var noCODProds = DMStorage.getValue('OrderId').productsHavingNoCOD;
        var maxCODHomeDlvryAmount;
        if($('#maxCODHomeDlvryAmnt').length > 0 ){
              maxCODHomeDlvryAmount = parseFloat($('#maxCODHomeDlvryAmnt').val());
        }else{
              maxCODHomeDlvryAmount = 10000;
        }
        if (noCODProds!= undefined && !noCODProds){
        	this.toggleCOD(grandTotal > maxCODHomeDlvryAmount ? false : true);	
        }else{
        	this.toggleCOD(false);
        }
	}, 
	toggleCOD : function(isShow){
		 $.each($('.payment-method ul li'), function() {
			if ($(this).attr('data-payment') == 'COD') {
				if (isShow) {
					$(this).show();
				} else {
					$(this).hide();
				}
			}
		});
	},
	checkShippingMatrixForRepay:function(reason,action){
		var selectedShipMode, grandTotal;
		var maxCODHomeDlvryAmount;
		if($('#maxCODHomeDlvryAmnt').length > 0 ){
			maxCODHomeDlvryAmount = parseFloat($('#maxCODHomeDlvryAmnt').val());
		}
		var productsHavingNoCOD = DMStorage.getValue('OrderId').productsHavingNoCOD;
		if(reason == 'true'){
			selectedShipMode = checkoutHelper.getCheckoutObjects('addressObj').selectedShipMode;
			grandTotal = DMStorage.getValue('OrderId').grandTotal;
		}else if(reason == 'repay'){
			selectedShipMode = checkoutHelper.getCheckoutObjects('addressObjRepay').selectedShipMode;
			grandTotal = DMStorage.getValue('OrderIdRepay').grandTotal;
		}else if(action == 'Payment' && reason==''){
			selectedShipMode = checkoutHelper.getCheckoutObjects('addressObj').selectedShipMode;
			grandTotal = DMStorage.getValue('OrderId').grandTotal;
		}
		var isCODEnabledForPUP = $('#isCODEnabledForPUP').val();
		if((selectedShipMode=='Pick up Point' || selectedShipMode=='Pickup Point') && isCODEnabledForPUP == '0'){
			$.each($('.payment-method ul li'),function(){
				if($(this).attr('data-payment')=='COD'){
					$(this).hide();
				}
			});
			$.each($('.resp-accordion.delivery-vertical'),function(){
				if($(this).text()=='Cash On Delivery'){
					$(this).hide();
				}
			});
		}else{
			if(grandTotal>maxCODHomeDlvryAmount){
				$.each($('.payment-method ul li'),function(){
					if($(this).attr('data-payment')=='COD'){
						$(this).hide();
					}
				});
				$.each($('.resp-accordion.delivery-vertical'),function(){
					if($(this).text()=='Cash On Delivery'){
						$(this).hide();
					}
				});
			}else if(productsHavingNoCOD){
				$.each($('.payment-method ul li'),function(){
					if($(this).attr('data-payment')=='COD'){
						$(this).hide();
					}
				});
				$.each($('.resp-accordion.delivery-vertical'),function(){
					if($(this).text()=='Cash On Delivery'){
						$(this).hide();
					}
				});
			}else{
				$.each($('.payment-method ul li'),function(){
					if($(this).attr('data-payment')=='COD'){
						$(this).show();
					}
				});
			}
		}
	},
	
	fetchEmergencyMessageHeader : function() {
		var ajaxCallParams = {
	    		url:window.location.protocol+'//'+window.location.hostname+'/wcs/resources/store/'+WCParamJS.storeId+'/espot/DMartEmergencyMessageESpot',
	    		method: 'GET',
	    		dataType:'json',
	    		cache : false
	    	};
	    	
	        //For Storepreview
			if(parent.dmartPreviewToken) {
				ajaxCallParams.xhrFields = {
			        withCredentials: true
			    };
				ajaxCallParams.headers = { 
					WCPreviewToken: parent.dmartPreviewToken
				};
			}
	    	
	    	$.ajax(ajaxCallParams).done(function(data){
	    		if(data.MarketingSpotData && data.MarketingSpotData[0].baseMarketingSpotActivityData) {
		    		var content = data.MarketingSpotData[0].baseMarketingSpotActivityData[0].marketingContentDescription[0].marketingText;
		    		$('.checkout-header .emergency-note div').html(content);
	    		} 
	    	}).fail(function(data){
	    		console.log(JSON.stringify(data)+' : ESPOT call failed');
	    	});
	},
	
	adjustOrderSummarySection : function() {
		var $parent = $('.cart-details__item--total.cart-details__item--bottom')
		 $('.cart-details__item .cart-details__item-list').css('display', 'none');
		 $('.cart-details__scroll-secondary').css({'max-height': '87px'});
		 $parent.addClass('active'); 
		 $parent.next('.cart-details__item-list').show();
		 $parent.find('.cart-details__item--title-arrow i').removeClass('icon-caret-up');
	}

};
// lets bind an action for cache refresh
$(document).bind('dmart.checkout.page.refresh', function(e) {
	checkoutHelper.init();
});

$(document).on('blur','#formNoAddress input',function() {
	$('#formNoAddress').data('validator', null);
	$('#formNoAddress').validate(checkoutHelper.noAddressFormValidator);
});

$(document).on('click', '#saveFirstAddress', function() {
	if($('#formNoAddress').hasClass('add-in-progress')){
		return;
	}
	$('#formNoAddress').data('validator', null);
	$('#formNoAddress').validate(checkoutHelper.noAddressFormValidator);
	if($('#formNoAddress').valid()){
		$('#formNoAddress').addClass('add-in-progress');
		setTimeout(function(){
			checkoutHelper.saveAddress('formNoAddress');
		}, 100);
	}else{
		$('#formNoAddress').removeClass('add-in-progress');
		$('#formNoAddress').find('label.error').hide();	
	}
	
});
checkoutHelper.noAddressFormValidator = {
		errorElement : 'span',
		onkeyup : function(element) {
			if (!$(element).attr('type') === 'tel') {
				this.element(element);
			}
		},
		onfocusout : function(element) {
			if ($(element).val() || $(element).val() !== '') {
				this.element(element);
			}
		},
		rules : {
			newName : {
				minlength : 1,
				maxlength : 128
			},
			newLandmark : {
				minlength : 1,
				maxlength : 118
			},
			newMobileNumber : {
				number : true,
				minlength : 10,
				maxlength : 10,
				regex : /^[7-9]+[0-9]*$/
			},
			newAlternateNumber : {
				number : true,
				minlength : 10,
				maxlength : 10
			},
			newCity : {
				minlength : 1,
				maxlength : 250,
				regex : /^[A-Za-z]+[A-Za-z\s]*$/
			},
			newState : {
				minlength : 1,
				maxlength : 250,
				regex : /^[A-Za-z]+[A-Za-z\s]*$/
			},
			newPincode : {
				number : true,
				minlength : 6,
				maxlength : 7,
				pincodeNotServed : true

			},
			newAddress : {
				minlength : 1,
				maxlength : 250
			}
		},
		messages : {
			newName: {
	        	  minlength: 'Enter minimum 3 alphabets!',
	        	  maxlength: 'Maximum limit exceeded!',
	          },
			mobileNumber : 'Please enter a 10 digit mobile number',
			newMobileNumber : 'Please enter a 10 digit mobile number',
			newCity : 'Enter only alphabets',
			newState : 'Enter only alphabets',
			newPincode : {
				number : 'Please enter a valid pin code.',
				minlength : 'Please enter a valid pin code.',
				maxlength : 'Please enter a valid pin code.',
				required : 'Enter Pincode',
				pincodeNotServed : 'Selected pin code not serviceable!'
			},
			newAddress : 'Address cannot be empty'
		}
};