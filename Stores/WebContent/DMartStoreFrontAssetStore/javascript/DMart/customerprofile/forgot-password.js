$(document).on('keyup','#forgotValidation input[type=tel]',function(event){
	if(event.which == 13) {
		DMAnalytics.events( DMAnalytics.Constants.Action.ForgotPwd,DMAnalytics.Constants.Action.ForgotPwd , document.title, 0,null );
		forgotPasswordSendOTP(document.forgotValidation);
	}
	
});




function forgotPasswordSendOTP(form) {
	if($('#forgotValidation').valid()){
		var targetNode = dojo.byId("LoginIdErrorMsg");
		if(typeof $('#isFromCheckout').val() != 'undefined' && $('#isFromCheckout').val() == 'true'){
			form.previousPage.value = window.location.origin+'/webapp/wcs/stores/servlet/'+"CheckoutView?catalogId="+WCParamJS.catalogId+"&langId=-1&storeId="+storeId+"&orderId="+$('#checkOutOrderId').val();
		}else {
			form.previousPage.value = window.location.href;
		}
		var parameters = {};
		  parameters.logonId = form.logonId.value;
		  parameters.previousPage=form.previousPage.value;
		  parameters.URL = form.URL.value;
		  parameters = JSON.stringify(parameters);
		  $.ajax({
              url: "/wcs/resources/store/" + storeId + "/person/SendOTPAndValidationLinkForgotPwd",
              type: "POST",
              data: parameters,
              context: this,
              contentType: "application/json"
        }).done(function(response) {
			    	var error;
			    	if(response.isSocialSignOn){
			    		error= "Forgot password not allowed for social signOn user";
			    		targetNode.innerHTML = error;
			    	}
			    	else if(response.isLockedUser){
//			    		error= "Account is locked, contact customer service"
//			    			 targetNode.innerHTML = error;
			    		$('#forgotPasswordModal').css('display', 'none');
			    		$('#AccountBlocked').css('display', 'block');
			    	}
			    	else{
			    	var redirectURl = 	"OTPValidateView?";
	                if(form.storeId) {
	                	redirectURl += 'storeId='+form.storeId.value;
	              }
	              if(form.catalogId) {
	            	  redirectURl += '&catalogId='+form.catalogId.value;
	              }
	              if(form.langId) {
	            	  redirectURl += '&langId='+form.langId.value;
	              }
	              redirectURl += '&actionCmd='+response.actionCmd+'&operation='+response.operation+'&mobileNumber='+response.logonId+'&URL='+response.previousPage;
	  
			    	window.location.href = redirectURl;
	    	}
                    
         }).fail(function(response){
        	 var error;
        	 if(JSON.parse(response.responseText).errors[0].errorCode == '10001'){
        		 error= JSON.parse(response.responseText).errors[0].errorMessage;
        	 }else{
        		 error = 'This mobile number is not registered with us';
        	 }
        	 targetNode.innerHTML = error;
       });
		
	}

}