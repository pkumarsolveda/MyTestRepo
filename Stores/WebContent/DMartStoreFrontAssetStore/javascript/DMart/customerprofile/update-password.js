updatePassword = {
		
updateNewpassword: function(form) {
	if($('#formUpdatePwdValidation').valid()){
		 var targetNode = dojo.byId("formUpdatePwdValidation_error");
		 var urlString = window.location.protocol + '//' + window.location.hostname+'/webapp/wcs/stores/servlet/';
		 var parameters = {};
		 parameters.logonId = form.logonId.value;
		 parameters.previousPage=form.previousPage.value;
		 parameters.URL = form.URL.value;
		 parameters.validationCode = form.validationCode.value;
		 parameters.newPwd = form.password.value;
		 parameters.otpCode = form.otpCode.value;
			  
         $.ajax({
        	 url : urlString + "AjaxUpdateNewPassword",
        	 type: "POST",
        	 data: parameters,
         }).success(function(data) {
        	 data = data.trim();
        	 data = data.replace('/*','');
        	 data = data.replace('*/','');
        	 var response = JSON.parse(data);
        	 
        	 if(response.errorMessage != null && response.errorMessage != '' && response.errorMessage != undefined){
        		 var error = response.errorMessage;
               	 targetNode.innerHTML = error;
    			 requestSubmitted  =  false;
        	 }else{
     			 var storeIdNewLogin = response.storeIdNewLogin;
    			 var pinCodeNewLogin = response.pinCodeNewLogin;
    			
            	 var storePinCookieVal = getCookie("DMART_Pincode_Cookie");
    			 if(storePinCookieVal == null && storeIdNewLogin != '' && pinCodeNewLogin != ''
    				 	&& storeIdNewLogin != undefined && pinCodeNewLogin != undefined){
    				 var cookieVal=storeIdNewLogin+"_"+pinCodeNewLogin;
    				 document.cookie = "DMART_Pincode_Cookie=" + cookieVal + ";expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/";
    			 }
    			
            	 if(updatePassword.isUrl(response.previousPage)){
            		if(response.previousPage.indexOf('DMartLogonView') > 0 ||
            				response.previousPage.indexOf('UserRegistrationForm') > 0 ||
            				response.previousPage.indexOf('OTPValidateView') > 0 ) {
    				//DMartLogonView,UserRegistrationForm,OTPValidateView
            			window.location.href = WCParamJS.homepageURL;
            		} else {
            			window.location.href = response.previousPage;
            		}
            	 }else{
    				window.location.href = response.previousPage;
            	 } 
        	 }
         }).fail(function(response){
           	 var error;
           	 error= JSON.parse(response.responseText).errors[0].errorMessage;
           	 targetNode.innerHTML = error;
			 requestSubmitted  =  false;
         });
	}
		
},

isUrl: function(prevPg) {
	   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	   return regexp.test(prevPg);
}

}
