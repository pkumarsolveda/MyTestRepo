//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2007, 2014 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------

/** 
 * @fileOverview This javascript is used by UserRegistrationAddForm.jsp and CheckoutLogon.jsp.
 * @version 1.0
 */

  /* Import dojo classes. */
dojo.require("wc.service.common");

/**
 *  The functions defined in the class helps the customer to register with the store. Another function enables a returning 
 *  customer to Sign in for quickcheckout from the shopping cart page.
 *
 *  @class This LogonForm class defines all the functions and variables used to validate the information provided by the
 *	customer to register with the store.To register, a customer creates a logon ID and password. Then, the customer provides their first name, 
 *  last name, street address, city, country/region, state/province, ZIP/postal code, e-mail address and phone number. Other registration options 
 *  include promotional e-mails, preferred language and currency, age, gender, and the remember me option. 
 */
LogonForm ={

	/**
	 * This function validates the logon ID and password for returning customers to sign in and complete the checkout process.
	 * @param {string} form The name of the form containing logon ID and password fields.
	 */
	SubmitAjaxLogin:function(form){
		reWhiteSpace = new RegExp(/^\s+$/);

		if(form.logonId != null && reWhiteSpace.test(form.logonId.value) || form.logonId.value == ""){ 
			MessageHelper.formErrorHandleClient(form.logonId.id,MessageHelper.messages["LOGON_REQUIRED_FIELD_ENTER"]); return;}
			
		if(form.logonPassword != null && reWhiteSpace.test(form.logonPassword.value) || form.logonPassword.value == ""){ 
			MessageHelper.formErrorHandleClient(form.logonPassword.id,MessageHelper.messages["PASSWORD_REQUIRED_FIELD_ENTER"]); return;}
		
		/*For Handling multiple clicks. */
		if(!submitRequest()){
			return;
		}
		setDeleteCartCookie();
				
		form.submit();	

	},
	
	/** 
	 * This function is called when the Submit button is clicked on the Registration page. All the fields containing customer
	 * information are validated and PersonProcessServicePersonRegistration is called. 
	 * @param {string} form The name of the registration form containing all the customer information.
	 */
	prepareSubmit:function (form)
	{
		/* For Handling multiple clicks. */
		/*if(!submitRequest()){
			return;
		}*/
		
	
		// Move this to OTP.js
		dojo.cookie("WC_SHOW_USER_ACTIVATION_" + WCParamJS.storeId, "true", {path:'/'});
		
		$('#'+form.id).validate();
		
		if($('#'+form.id).valid()){
			//form.submit();
			var xhrArgs = {
					url: "CreateDMartUserCmd",
					handleAs: "json",
					content: {
						logonId: form.logonId.value,
						logonPassword:  form.logonPassword.value,
						email1 :  form.email1.value,
						firstName :  form.firstName.value,
						lastName :  form.lastName.value,
						socialUser :  typeof(form.isSocialSignIn) != "undefined" ? form.isSocialSignIn.value : '0'
						
					},
					load: function(response){
						
						 if(response != null) {
							 DMAnalytics.events( DMAnalytics.Constants.Action.Register, DMAnalytics.Constants.Action.Register, document.title, 0, null);
							 //var data = JSON.parse(response);
							 if(response.excMsg) {
								 $('#'+form.id+'_error').html(MessageHelper.messages[response.excMsg.applicationMessageKey]);
								 // Scroll up to the error message
								 if(form.id == 'formRegisterValidation1') {
									  $('html,body').animate({ scrollTop: 0},'fast');
								 }
								 requestSubmitted  =  false;
							 } else {
								 var redirectURL = 'OTPValidateView?';
								 if(form.storeId) {
									 redirectURL += 'storeId='+form.storeId.value;
								 }
								 if(form.catalogId) {
									 redirectURL += '&catalogId='+form.catalogId.value;
								 }
								 if(form.langId) {
									 redirectURL += '&langId='+form.langId.value;
								 }
								 redirectURL += '&actionCmd=RegistrationValidationCmd&operation=0&mobileNumber='+form.logonId.value;
								 
								 // Add originating page to sessionStorage or redirect itself, if session storage is not supported
								 var previousPage = 'StoreView?storeId='+form.storeId.value;
								 if(form.previousPage && form.previousPage.value !== '') {
									 previousPage = form.previousPage.value;
								 }
								 /*
								 if(window.sessionStorage) {
									 sessionStorage.setItem('previousPage',previousPage);
								 } else {*/
								 if(form.isFromCheckout.value == 'true'){
									 var checkoutPage = window.location.origin+'/webapp/wcs/stores/servlet/'+"CheckoutView?catalogId="+form.catalogId.value+"&langId="+form.langId.value+"&storeId="+form.storeId.value+"&orderId="+form.checkOutOrderId.value;
									 redirectURL += '&URL='+ encodeURIComponent(checkoutPage);
								 }else{
									 redirectURL += '&URL='+encodeURIComponent(previousPage);
								 }
								 //}
								 CachedHeader.invalidateListStorage();
								 CartHelper.invalidateCookieForOtherProtocol();
								 
								 window.location.href = redirectURL;
							 }
						 }
					},
					error: function(error){
					  $('#'+form.id+'_error').html(error);
					  // Scroll up to the error message
					  if(form.id == 'formRegisterValidation1') {
						  $('html,body').animate({ scrollTop: 0},'fast');
					  }
					  requestSubmitted  =  false;
					}
				  };
				  
				  var deferred = dojo.xhrPost(xhrArgs);
        } else {
        	requestSubmitted  =  false;
        }           
		
	},
	
	/**
	 * The function is called to validate and prepare the form.
	 * @param {string} form The name of the registration form containing all the customer information.
	 * @return (Boolean) true if the form is ready to submit, false otherwise.
	 */
	validatePrepareForm: function(form){
		reWhiteSpace = new RegExp(/^\s+$/);
		if(form.logonId != null && reWhiteSpace.test(form.logonId.value) || form.logonId.value == ""){ 
			MessageHelper.formErrorHandleClient(form.logonId.id,MessageHelper.messages["ERROR_LogonIdEmpty"]); return false;
		} else if (typeof this.validateLoginId == "function") {
				if (!this.validateLoginId(form.logonId)) {
					return false;
				}
		}

		if (form.ancestorOrgs != null) {
			if (form.ancestorOrgs.value == "") {
				MessageHelper.formErrorHandleClient(form.ancestorOrgs.id,MessageHelper.messages["ERROR_OrgNameEmpty"]);
				return false;
			} else if (form.ancestorOrgs.value == "Default Organization") {
				MessageHelper.formErrorHandleClient(form.ancestorOrgs.id,MessageHelper.messages["ERROR_DefaultOrgRegistration"]);
				return false;
			}
		}
	         
		if(form.logonPassword != null && reWhiteSpace.test(form.logonPassword.value) || form.logonPassword.value == ""){ 
			MessageHelper.formErrorHandleClient(form.logonPassword.id,MessageHelper.messages["ERROR_PasswordEmpty"]); return false;}
		if(form.logonPasswordVerify != null && reWhiteSpace.test(form.logonPasswordVerify.value) || form.logonPasswordVerify.value == ""){ 
			MessageHelper.formErrorHandleClient(form.logonPasswordVerify.id,MessageHelper.messages["ERROR_VerifyPasswordEmpty"]); return false;}
		if(form.logonPassword.value!= form.logonPasswordVerify.value){ 
			MessageHelper.formErrorHandleClient(form.logonPasswordVerify.id,MessageHelper.messages["PWDREENTER_DO_NOT_MATCH"]);
			return false;
		}
		
		/** Uses the common validation function defined in AddressHelper class for validating first name, 
		 *  last name, street address, city, country/region, state/province, ZIP/postal code, e-mail address and phone number. 
		 */
		if(!AddressHelper.validateAddressForm(form)){
			return false;
		}
		
		/* Checks whether the customer has registered for promotional e-mails. */
		if(form.sendMeEmail && form.sendMeEmail.checked){
		    form.receiveEmail.value = true;
		}
		else {
			form.receiveEmail.value = false;
		}
		
		if(form.sendMeSMSNotification &&  form.sendMeSMSNotification.checked){
		    form.receiveSMSNotification.value = true;
		}
		else {
			form.receiveSMSNotification.value = false;
		}
		
		if(form.sendMeSMSPreference && form.sendMeSMSPreference.checked){
		    form.receiveSMS.value = true;
		}
		else {
			form.receiveSMS.value = false;
		}
		
		if(form.mobileDeviceEnabled != null && form.mobileDeviceEnabled.value == "true"){
			if(!MyAccountDisplay.validateMobileDevice(form)){
				return false;
			}
		}
		if(form.birthdayEnabled != null && form.birthdayEnabled.value == "true"){
			if(!MyAccountDisplay.validateBirthday(form)){
				return false;
			}
		}
		return true;
	},
		
	/**
	 *  This function validates the customer's input for age. If the user is under age, pop up a message to ask the user to review the store policy.
	 *  @param {string} The name of the form containing personal information of the customer.
	 */
	validateAge: function(form){
		
		var birth_year = parseInt(form.birth_year.value);
		var birth_month = parseInt(form.birth_month.value);
		var birth_date = parseInt(form.birth_date.value);
		
		if (birth_year == 0 || birth_month == 0 || birth_date == 0) {
			return;
		}
		
		var curr_year = parseInt(form.curr_year.value);
		var curr_month = parseInt(form.curr_month.value);
		var curr_date = parseInt(form.curr_date.value);
		
		/*Check whether age is less than 13, if so, pop up a message to ask the user to review the store policy. */
		if((curr_year - birth_year) < 13){
			alert(MessageHelper.messages["AGE_WARNING_ALERT"]);
		}else if((curr_year - birth_year) == 13){
			if(curr_month < birth_month){
				alert(MessageHelper.messages["AGE_WARNING_ALERT"]);
			}else if((curr_month == birth_month) && (curr_date < birth_date)){
				alert(MessageHelper.messages["AGE_WARNING_ALERT"]);
			}
		}
	},
	
	/**
	  *	This function is used when "Age" option is changed.
	  * This will show one alert message if the user age is under 13.
	  * @param {string} form The name of the registration form containing customer's age.
	  */

	checkAge:function (form)
	{
		if(form.age.value==1) {
			alert(MessageHelper.messages["AGE_WARNING_ALERT"]);
		}
	}
};
