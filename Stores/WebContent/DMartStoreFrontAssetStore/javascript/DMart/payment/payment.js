(function(dmUIConfig) {
	
	$(document).ready(function () {
		
		$(document).on('click', '#creditCard', function () {
			$('.payment-overlay').hide();
			$('.total-payable-del-text').html('Total Payable');
			$('input[id=creditCardNumber]').val(null);	
			$('input[name=creditExpiryDate]').val(null);
			$('input[name=creditCardCvv]').val(null);
			$('input[id=CCName]').val(null);
			$('input[id=creditCardNumber]').removeClass('error');
			$('input[name=creditExpiryDate]').removeClass('error');
			$('input[name=creditCardCvv]').removeClass('error');
			$('input[id=CCName]').removeClass('error');
			$('#creditCardNumber-error').hide();
			$('#creditExpiryDate-error').hide();
			$('#creditCardCvv-error').hide();
			$('#CCName-error').hide();
			$('span.error').hide();
			$('.payment-method--card-credit').find('.payment-card-type').find('.dmart-sprite').attr({'style':'opacity: 0; top: 35px;'});
		});
		
		$(document).on('click', '#debitCard', function () {
			$('.payment-overlay').hide();
			$('.total-payable-del-text').html('Total Payable');
			$('input[id=debitCardNumber]').val(null);	
			$('input[name=debitExpiryDate]').val(null);
			$('input[name=debitCardCvv]').val(null);
			$('input[id=DCName]').val(null);
			$('input[id=debitCardNumber]').removeClass('error');
			$('input[name=debitExpiryDate]').removeClass('error');
			$('input[name=debitCardCvv]').removeClass('error');
			$('input[id=DCName]').removeClass('error');
			$('#debitCardNumber-error').hide();
			$('#dc-expDetails-error').hide();
			$('#dc-cvv-error').hide();
			$('#DCName-error').hide();
			$('span.error').hide();
			$('.payment-method--card-debit').find('.payment-card-type').find('.dmart-sprite').attr({'style':'opacity: 0; top: 35px;'});
		});
		
		$(document).on('click', '#debitCardPin', function () {
			$('.payment-overlay').hide();
			$('.total-payable-del-text').html('Total Payable');
			$("input:radio").attr("checked", false);
			$('.select-dcp-banks option:selected').attr("selected",null);
			$('.select-dcp-banks option[value=""]').attr('selected', 'selected');
		});
		
		$(document).on('click', '#netBanking', function () {
			$('.payment-overlay').hide();
			$('.total-payable-del-text').html('Total Payable');
			$("input:radio").attr("checked", false);
			$('.select-nb-banks option:selected').attr("selected",null);
			$('.select-nb-banks option[value=""]').attr('selected', 'selected');
		});
		
		$(document).on('click', '#cashOnDelivery', function () {
			$('.payment-overlay').hide();
			$('.total-payable-del-text').html('Total Amount');
		});
		
		$(document).on('click', '#card-selection', function () {
			$(this).parents('.payment-method--card').find('#select-other-banks option:selected').attr("selected",null);
		});
		
		$(document).on('change', '#select-other-banks', function () {
//			$('#card-selection').prop( "checked", false );
			$("input:radio").attr("checked", false);
		});
		
	      if ($(window).width() > 1023) {
	    	  $('.payment-method').find('.resp-tab-item').removeClass('resp-tab-active');
	    	  $(".payment-overlay").show();
	      }	
		
		if($('#BillDeskResponseMsg').val() != "" && $('#BillDeskResponseMsg').val() != null ){
			checkoutHelper.showCheckoutError($('#BillDeskResponseMsg').val());
		}
		// API to retrieve bank details and dynamically populate payment-methods nunjucks
		$.ajax({
			url: window.location.protocol + '//' + window.location.hostname + '/wcs/resources/store/'+WCParamJS.storeId+'/checkout/bankDetails?bankStatus=A',
			 method: 'GET',
             context: this,
             async: false
            
		}).done(function(data) {
			
			var i;
			for(i=0; i < data.TotalNumberOfBanks ;i++){
				var bankDetailsId = 'Bank_'+i;
				
				if(data[bankDetailsId].Mode == 'NB'){
					if(data[bankDetailsId].Isfav == 'Y'){
						$('#formNetBankvalidation .bank-list').append('<label> <input type="radio" name="card-selection" id="card-selection" value="'+							 
								data[bankDetailsId].BankId+'"><i class="'+data[bankDetailsId].Image+'"></i></label>');
					}
					$('#NetBanking_PayMethod .custom-dropdown #select-other-banks').append('<option value="'+
							data[bankDetailsId].BankId+'">'+data[bankDetailsId].BankName+'</option>');
					
				}
				if(data[bankDetailsId].Mode == 'DA'){
					if(data[bankDetailsId].Isfav == 'Y'){
						$('#formDebitATMvalidation .bank-list').append('<label> <input type="radio" name="card-selection" id="card-selection" value="'+
								 data[bankDetailsId].BankId+'"><i class="'+data[bankDetailsId].Image+'"></i></label>');
					}
					$('#formDebitATMvalidation .custom-dropdown #select-other-banks').append('<option value="'+
								data[bankDetailsId].BankId+'">'+data[bankDetailsId].BankName+'</option>');
				}
				

		   }
			  
		       });
			
		});
		
	
}(DM_UI_CONFIG));

payments = {
		
netBanking: function(form){
	
	
	checkoutHelper.saveCheckoutObjects('paymentMode', "Net Banking");

	var selectedBankId = null;
	var selectedBilldeskPayment = null;
    
	if($('#formNetBankvalidation').is(':visible')){
		
		selectedBilldeskPayment = "Internet Banking";
		checkoutHelper.saveCheckoutObjects('paymentMode', "Net Banking");

	    if($('input[name=card-selection]:checked', '#formNetBankvalidation').val() != undefined && 
	    		$('input[name=card-selection]:checked', '#formNetBankvalidation').val() != null && 
	    		$('input[name=card-selection]:checked', '#formNetBankvalidation').val() != ""){
	    	
	    	selectedBankId = $('input[name=card-selection]:checked', '#formNetBankvalidation').val();
	    	checkoutHelper.showLoadingImage();
	    }else if($('#formNetBankvalidation').find('#select-other-banks option:selected').val() != undefined && $('#formNetBankvalidation').find('#select-other-banks option:selected').val() != null && 
	    		$('#formNetBankvalidation').find('#select-other-banks option:selected').val() != ""){
	    	
	    	selectedBankId = $('#formNetBankvalidation').find('#select-other-banks option:selected').val();
	    	checkoutHelper.showLoadingImage();
	    }
	}else if($('#formDebitATMvalidation').is(':visible')){
		selectedBilldeskPayment = "Debit Card with ATM Pin";
		checkoutHelper.saveCheckoutObjects('paymentMode', "Debit Card");		
		
	    if($('input[name=card-selection]:checked', '#formDebitATMvalidation').val() != undefined && 
	    		$('input[name=card-selection]:checked', '#formDebitATMvalidation').val() != null && 
	    		$('input[name=card-selection]:checked', '#formDebitATMvalidation').val() != ""){
	    	
	    	selectedBankId = $('input[name=card-selection]:checked', '#formDebitATMvalidation').val();
	    	checkoutHelper.showLoadingImage();
	    }else if($('#formDebitATMvalidation').find('#select-other-banks option:selected').val() != undefined && $('#formDebitATMvalidation').find('#select-other-banks option:selected').val() != null && 
	    		$('#formDebitATMvalidation').find('#select-other-banks option:selected').val() != ""){
	    	
	    	selectedBankId = $('#select-other-banks :selected').val();
	    	checkoutHelper.showLoadingImage();
	    }
	}
    if(null != selectedBankId){
        var action = checkoutHelper.getParameterByName('currentAction');
    	var reason = checkoutHelper.getParameterByName('paymentFailure');
    	var orderPlaced = checkoutHelper.getCheckoutObjects('orderPlaced');
    	if((action == 'Payment' && (reason == 'true' || reason == 'repay'))||orderPlaced){
    		payments.checkSumMsg(selectedBankId,selectedBilldeskPayment);
    	}else{
    		payments.UpdatePaymentInstruction("BillDesk",selectedBankId,selectedBilldeskPayment);
    	}
    }

	  
},

checkSumMsg: function(selectedBankId, selectedBilldeskPayment){
	
	history.pushState('paymentIndicator' ,'Checkout - DMart', window.location.href +'&paymentIndicator=Y' );
	
	var parameters = {},piId;
	var currentTime = Date.now(); 
	var urlString = window.location.origin+'/webapp/wcs/stores/servlet/';
	var reason = checkoutHelper.getParameterByName('paymentFailure');
	var orderIdReq = checkoutHelper.getParameterByName('orderId');
	var cartJSONRepay = DMStorage.getValue('OrderIdRepay');
	if (cartJSONRepay != null && cartJSONRepay.orderId != null && cartJSONRepay.orderId == orderIdReq && reason=='true'){
		reason = 'repay';
	}
	if(reason == 'repay'){
		piId = checkoutHelper.getCheckoutObjects('userObjRepay').instruction;
		parameters.orderId =DMStorage.getValue("OrderIdRepay").orderId;
	}else{
		piId = checkoutHelper.getCheckoutObjects('userObj').instruction;
		parameters.orderId =DMStorage.getValue("OrderId").orderId;
	}
	
	
	if(piId == null || piId == ''){
		piId = checkoutHelper.getParameterByName('piId');
	}
	parameters.billDeskUniqueId = parameters.orderId+'_'+currentTime;

	if(parameters.orderId == null || parameters.orderId == ''){
		parameters.orderId = checkoutHelper.getParameterByName('orderId');
	}
	parameters.absoluteUrl = urlString+'PunchoutPaymentCallBack';
	parameters.device = "WEB";
	parameters.selectedBilldeskPayment = selectedBilldeskPayment;
	
	if(selectedBankId == "CCDCBank"){		
		
		parameters.cardType = $('.dmart-sprite[style*="opacity: 1"]').data('card');
		
		/*if(selectedBilldeskPayment == "Credit Card"){
			parameters.bankId = "EPG";
		}else if (selectedBilldeskPayment == "Debit Card"){
			if(parameters.cardType == 'VISA'){
				parameters.bankId = "EPG";
				//parameters.itemCode = "VDDIRECT";
			}
			if(parameters.cardType == 'MASTER'){
				parameters.bankId = "EPG";
				//parameters.itemCode = "MDDIRECT";
			}
		}*/
		
		dojo.xhrPost({
			  url: "DMartBillDeskHMac",				
			    handleAs: "json",
			    content: parameters,
			    service: this,
			    load: function(response){
			    	var expDate, expDateDetails = [], errorMessage;
			    	if(response.eligibleForPayment == 'true'){
			    	if($('#formCCvalidation').is(':visible')){
			    		$('#CCMessage').val(response.message);
				    	$('#cnumber').val($('#creditCardNumber').val().replace(/\s/g, ''));
				    	expDate = $('.checkMonth').val();
				    	 $.each(expDate.split("/"), function(loop, expDateSplit) {
				    		 expDateDetails[loop] = expDateSplit;
		               });
				    	$('#expmon').val(expDateDetails[0].replace(/\s/g, ''));
				    	// fix for JIRA 4806
				    	if(expDateDetails[1].replace(/\s/g, '').length == 4){
				    		$('#expyr').val(expDateDetails[1].replace(/\s/g, ''));
				    	}else{
				    		$('#expyr').val('20'+expDateDetails[1].replace(/\s/g, ''));
				    	}
				    	$('#cname2').val($('#CCName').val());
				    	$('#cvv2').val($('.cc-cvc').val());
			    	}else{
			    		$('#CCMessage').val(response.message);
				    	$('#cnumber').val($('#debitCardNumber').val().replace(/\s/g, ''));
				    	expDate = $('#dc-expDetails').val();
				    	 $.each(expDate.split("/"), function(loop, expDateSplit) {
				    		 expDateDetails[loop] = expDateSplit;
		               });
				    	$('#expmon').val(expDateDetails[0].replace(/\s/g, ''));
				    	// fix for JIRA 4806
				    	if(expDateDetails[1].replace(/\s/g, '').length == 4){
				    		$('#expyr').val(expDateDetails[1].replace(/\s/g, ''));
				    	}else{
				    		$('#expyr').val('20'+expDateDetails[1].replace(/\s/g, ''));
				    	}
				    	$('#cname2').val($('#DCName').val());
				    	$('#cvv2').val($('#dc-cvv').val());
			    	}
			    	
			    	cscvForm  = CCBilldesk;
			    	addHiddenElements(cscvForm, 'reqid', 'cc_processall');
			    	addHiddenElements(cscvForm, 'txtBankID', 'CARD');
			    	addHiddenElements(cscvForm, 'txtItemCode', 'DIRECT');
			    	ccvalidation.process({ 
			    		"cardNumber":CCBilldesk.cnumber, 
			    		"cardExpMonth":CCBilldesk.expmon, 
			    		"cardExpYear":CCBilldesk.expyr, 
			    		"cardHolderName":CCBilldesk.cname2, 
			    		"cardPasscode" : CCBilldesk.cvv2
			    	});
			    	checkoutHelper.stopLoadingImage();
			    	}else if(response.resendStatus == undefined){
			    		var key=response.excMsg['applicationMessageKey'];
			    		errorMessage =  MessageHelper.messages[key];
			    		checkoutHelper.showCheckoutError(errorMessage);
			    		checkoutHelper.stopLoadingImage();
			    	}else{
			    		errorMessage = response.errorMessage;
			    		checkoutHelper.showCheckoutError(errorMessage);
			    		checkoutHelper.stopLoadingImage();
			    	}
			    },
			    error: function(errObj,ioArgs) {
			    	checkoutHelper.stopLoadingImage();
			    }
		 });
	}else{
		  parameters.bankId = selectedBankId;
		  
		  dojo.xhrPost({
			  url: "DMartBillDeskHMac",				
			    handleAs: "json",
			    content: parameters,
			    service: this,
			    load: function(response){
			    	var errorMessage;
			    	if(response.eligibleForPayment == 'true'){
			    	$('#NetBankingMessage').val(response.message);
			    	$('input[name=txtBankID]').val(selectedBankId);
			    	
			    	$('#NetBankingBilldesk').submit();
			    	}else if(response.resendStatus == undefined){
			    		var key=response.excMsg['applicationMessageKey'];
			    		errorMessage =  MessageHelper.messages[key];
			    		checkoutHelper.showCheckoutError(errorMessage);
			    		checkoutHelper.stopLoadingImage();
			    	}else{
			    		errorMessage = response.errorMessage;
			    		checkoutHelper.showCheckoutError(errorMessage);
			    		checkoutHelper.stopLoadingImage();
			    	}
			    },
			    error: function(errObj,ioArgs) {
			    	checkoutHelper.stopLoadingImage();
			    }
		 });
	}
	//Clear the current order cookie if present.
	dojo.cookie("DM_OrderId", null, {expires: -1,path: '/'});

},

creditAndDebitCard: function(form){
	
	checkoutHelper.showLoadingImage();
	var valid = false; 
	var selectedBilldeskPayment = null;
	//Validate CC/DC section
	if($('.resp-tab-item[data-payment=CC]').hasClass('resp-tab-active')){
		if($('#formCCvalidation').valid()){
			valid = true;
			selectedBilldeskPayment = "Credit Card";
		}else{
			valid = false;
		}
	}else if($('.resp-tab-item[data-payment=DC]').hasClass('resp-tab-active')){
		if($('#formDCvalidation').valid()){
			valid = true;
			selectedBilldeskPayment = "Debit Card";
		}else{
			valid = false;
		}
	}	
	
	if(valid && selectedBilldeskPayment != null){
		checkoutHelper.saveCheckoutObjects('paymentMode', selectedBilldeskPayment);
		var orderPlaced = checkoutHelper.getCheckoutObjects('orderPlaced');
	    var action = checkoutHelper.getParameterByName('currentAction');
		var reason = checkoutHelper.getParameterByName('paymentFailure');
		if((action == 'Payment' && (reason == 'true' || reason == 'repay'))||orderPlaced){
			payments.checkSumMsg("CCDCBank",selectedBilldeskPayment);
		}else{
			payments.UpdatePaymentInstruction("BillDesk","CCDCBank",selectedBilldeskPayment);
		}
	}else{
		checkoutHelper.stopLoadingImage();
	}

},

cashOnDelivery: function(){
	
	checkoutHelper.showLoadingImage();
	checkoutHelper.saveCheckoutObjects('paymentMode',"Cash On Delivery");
	
	
	var reason = checkoutHelper.getParameterByName('paymentFailure');
	var orderIdReq = checkoutHelper.getParameterByName('orderId');
	var cartJSONRepay = DMStorage.getValue('OrderIdRepay');
	var orderPlaced = checkoutHelper.getCheckoutObjects('orderPlaced');
	
	if (cartJSONRepay != null && cartJSONRepay.orderId != null && cartJSONRepay.orderId == orderIdReq && reason=='true'){
		reason = 'repay';
	}
	if(reason == 'true'){
		payments.codAfterBilldeskPayFail(DMStorage.getValue("OrderId").orderId);
	} else if(reason == 'repay'){
		payments.codAfterBilldeskPayFail(DMStorage.getValue("OrderIdRepay").orderId);
	} else if (orderPlaced){ // Back button scenario
		payments.codAfterBilldeskPayFail(DMStorage.getValue("OrderId").orderId);
	} else{
		$.ajax({
	        url: window.location.protocol + '//' + window.location.hostname + '/wcs/resources/store/' + WCParamJS.storeId + '/cart/@self/payment_instruction',
	        method: 'DELETE',
	        context: this,
	        async: false,

	    }).done(function (data) {
	    	payments.AddPaymentInstructionCOD();
	    }).fail(function(data) {
	    	var errorMessage = "Error while processing COD order.";
			checkoutHelper.showCheckoutError(errorMessage);
	    	checkoutHelper.stopLoadingImage();
	    }); 
	}
},
codAfterBilldeskPayFail: function(orderId){
	var params = {};
	params.storeId = WCParamJS.storeId;
	params.orderId = orderId;
	var urlString = window.location.origin+'/webapp/wcs/stores/servlet/';
	 dojo.xhrPost({
		  url: "CashOnDeliveryAfterPlaceOrderCmd",				
		    handleAs: "json",
		    content: params,
		    service: this,
		    load: function(data){
	    		var errorMessage;
		    	if(data.eligibleForPayment == 'true'){
		    		window.location.href = urlString + "ConfirmOrder?langId=-1&catalogId="+WCParamJS.catalogId+"&storeId="+WCParamJS.storeId+"&orderId="+orderId;
		    	}else if(data.resendStatus == undefined){
		    		var key=response.excMsg['applicationMessageKey'];
		    		errorMessage =  MessageHelper.messages[key];
		    		checkoutHelper.showCheckoutError(errorMessage);
		    		checkoutHelper.stopLoadingImage();
		    	}else{
		    		errorMessage = data.errorMessage;
		    		checkoutHelper.showCheckoutError(errorMessage);
		    		checkoutHelper.stopLoadingImage();
		    	}   
		    },
		    error: function(errObj,ioArgs) {
				var errorMessage = "Error Adding COD payment instruction for order.";
				checkoutHelper.showCheckoutError(errorMessage);
				checkoutHelper.stopLoadingImage();
		    }
	 });
},

AddPaymentInstructionCOD: function(){
	var params = {};
	var urlString = window.location.origin+'/webapp/wcs/stores/servlet/';
	params.storeId = WCParamJS.storeId;
	if(checkoutHelper.getCheckoutObjects('addressObj').selectedShipMode == 'Pick up Point'){
		var addressId = undefined;
		if(primaryAddress != ''){
			addressId = primaryAddress;
		}
		else{
			$('#delivery-address-section input[type=radio]').each(function() {
				addressId = ($(this).attr('id'));
			});
		}
		if(typeof addressId == "undefined"){
			addressId = this.saveDummyAddress();
		} 
		params.billing_address_id = addressId;
	}
	else{
		params.billing_address_id = checkoutHelper.getCheckoutObjects('addressObj').addressId;
	}
	
	params.payMethodId = "COD";
	params.piAmount = DMStorage.getValue('OrderId').grandTotal;
	
	$.ajax({
        url: urlString + "AjaxRESTOrderPIAdd",
        method: 'POST',
        context: this,
        async: false,
        data: params,
    }).done(function (data) {
    	
    	payments.preCheckout("COD",null,null);
    	
    }).fail(function(data) {
		var errorMessage = "Error Adding payment instruction for order.";
		checkoutHelper.showCheckoutError(errorMessage);
		checkoutHelper.stopLoadingImage();
    }); 
	
},

UpdatePaymentInstruction: function(payMethod,selectedBankId,selectedBilldeskPayment){
	
	var params = {};
	params.storeId = WCParamJS.storeId;
	params.piAmount = DMStorage.getValue('OrderId').grandTotal;
	params.payMethodId = payMethod;
	params.piId = checkoutHelper.getCheckoutObjects('userObj').instruction;
	var urlString = window.location.origin+'/webapp/wcs/stores/servlet/';
	$.ajax({
       url: urlString + "AjaxRESTOrderPIUpdate",
        method: 'POST',
        context: this,
        async: false,
        data: params,
 
    }).done(function (data) {
    
        data = JSON.parse(data);
    	// update cache if piId changes
    	var userObj = checkoutHelper.getCheckoutObjects('userObj');
    	if(userObj != null && userObj.instruction != data.paymentInstruction && userObj.instruction != data.paymentInstruction[0].piId){
    		userObj.instruction = data.paymentInstruction[0].piId;
    		sessionStorage.setItem('userObj', JSON.stringify({
	            value: userObj
	        }));
    	}
    	
    	payments.preCheckout(payMethod,selectedBankId,selectedBilldeskPayment);
    	
    }).fail(function(data) {
		var errorMessage = "Error updating payment instruction for order.";
	    checkoutHelper.showCheckoutError(errorMessage);
		checkoutHelper.stopLoadingImage();
    });
	
},

preCheckout: function(paymentMethod,selectedBankId,selectedBilldeskPayment){
	if(payments.isInvReservationValid() && checkoutHelper.checkOrderThreshould()){
		$.ajax({
			url: window.location.protocol + '//' + window.location.hostname + '/wcs/resources/store/' + WCParamJS.storeId + '/cart/@self/precheckout',
	        method: 'PUT',
	        context: this,
	        async: false,

	    }).done(function (data) {
	    	
	    	payments.placeOrder(paymentMethod,selectedBankId,selectedBilldeskPayment);
	    	 
	    }).fail(function(data) {
			var errorMessage = "Error during precheckout.";
			checkoutHelper.showCheckoutError(errorMessage);
			checkoutHelper.stopLoadingImage();
	    }); 
	} else{
		checkoutHelper.stopLoadingImage();
		checkoutHelper.showCheckoutError("Oops! Your session expired due to inactivity, however your cart is still available. Please "+'<u><a href = "myCart">go back</a></u>'+" and replace your order.");
		/*var reserveInv = true;
		DMStorage.set('invalidReservation', reserveInv);
		setTimeout(function(){
			window.location.reload();
			}, 2000);*/
		
	}
		
},
isInvReservationValid: function(){
	var invValidTime = checkoutHelper.getCheckoutObjects('addressObj').invValid;
	var nowTime = new Date().getTime();	
	return invValidTime > nowTime;
},
getTimein24Hr: function(strTime){
	// Here comes the issues of having different time formats at different levels. 
	// OMS wants time in HH:MM:SS (24 hr) format but passed to WCS as 12 hr format!!!! 
	var timeHr = parseInt(strTime.substr(0, 2));
	var timeIdentifier = strTime.substr(2, 3); 
	return ('0' + (timeHr + ((timeIdentifier == 'PM' && timeHr != 12) ? 12 : (timeIdentifier == 'AM' && timeHr == 12) ? -12 : 0))).slice(-2);
	
},

placeOrder: function(paymentMethod,selectedBankId,selectedBilldeskPayment){
	
	var params = {};
	var slotObj = checkoutHelper.getCheckoutObjects('slotObj');
	var slotDate = slotObj.slotDate.split('/');
	var slotDateFormatted = slotDate[2]+"-"+slotDate[1]+"-"+slotDate[0];
      params.xslot_consumptionDate = slotDateFormatted.toString();
      params.xslot_resourcePool = slotObj.resourcePoolkey;
      params.xslot_startTime = this.getTimein24Hr(slotObj.startTime)+":00:00" ;
      params.xslot_endTime = this.getTimein24Hr(slotObj.endTime)+":00:00" ;
      params.x_paymentMethod = paymentMethod;    
      var dummyaddresss =  checkoutHelper.getCheckoutObjects('dummyAddress');
      if(dummyaddresss != null && dummyaddresss.length > 0){
    	  params.x_dummyAddress =  dummyaddresss;
      }

      params = JSON.stringify(params); 
	$.ajax({
		url: window.location.protocol + '//' + window.location.hostname + '/wcs/resources/store/' + WCParamJS.storeId + '/cart/@self/checkout',
        method: 'POST',
        data: params,
        context: this,
        contentType: "application/json",
        async: false,

    }).done(function (data) {
    	
    	checkoutHelper.saveCheckoutObjects('orderPlaced',true);
    	var urlString = window.location.origin+'/webapp/wcs/stores/servlet/';
    	if(paymentMethod === "COD"){
    		window.location.href = urlString + "ConfirmOrder?langId=-1&catalogId="+WCParamJS.catalogId+"&storeId="+WCParamJS.storeId;	
    	}else{
    		if(selectedBankId !=null){
    			payments.checkSumMsg(selectedBankId,selectedBilldeskPayment);
    		}    		
    	}    	
    	 
    }).fail(function(data) {
    	checkoutHelper.showCheckoutError(data.responseJSON.errors[0].errorMessage);
    	checkoutHelper.stopLoadingImage();
    }); 
	
},
/*
 * OOB doesnt support payment addition without a address
 * but guest users can place COD through PUP where the user wont have
 * any address. Creating a dummy address and deleting after order process here. 
 *  
 */
saveDummyAddress: function() {
	var dummyAddress = undefined;
	var inputData = {};
	var nickName = new Date().getTime().toString();
	inputData.nickName = nickName;
	inputData.firstName = nickName;
	inputData.addressLine = [];
	inputData.addressLine[0] = "Dummy Address for PUP Guest COD option";
	inputData.addressLine[1] = "OOB doesnt support COD with out any address";
	inputData.city = "Mumbai";
	inputData.addressType = 'ShippingAndBilling';
	inputData.state = "MAHARASHTRA";
	inputData.phone1 = "9995555555";
	inputData.mobilePhone1 = "9995555555";
	inputData.zipCode = $('#delivery_pin').html();
	inputData.primary = false;
	inputData.country = 'India';
	inputData = JSON.stringify(inputData);
	$.ajax({
		url: "/wcs/resources/store/" + storeId + "/person/@self/contact",
		type: "POST",
		data: inputData,
		context: this,
		async: false,
		contentType: "application/json"
	}).done(function(data) {		
		dummyAddress = data.addressId;
		checkoutHelper.saveCheckoutObjects('dummyAddress', dummyAddress);
	});
	return dummyAddress;
}


};