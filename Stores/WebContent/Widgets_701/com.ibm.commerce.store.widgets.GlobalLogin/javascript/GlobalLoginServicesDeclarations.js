//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2014 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------

/** 
 * @fileOverview This javascript is used by the Global Login widget to handle the services 
 * @version 1.10
 */

dojo.require("wc.service.common");
dojo.require("wc.render.common");

/**
 * This service allows customer to sign in
 * @constructor
 */
wc.service.declare({
	id:"globalLoginAjaxLogon",
	actionId:"globalLoginAjaxLogon",
	url: "AjaxLogon",
	formId:"",

	 /**
     * Hides all the messages and the progress bar.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	successHandler: function(serviceResponse) {		
		cursor_clear();	
		var errorMessage = "";
		if (serviceResponse.ErrorCode != null){
			var errorCode = Number(serviceResponse.ErrorCode);
			switch(errorCode){
				case 2000:
					errorMessage = MessageHelper.messages["GLOBALLOGIN_SIGN_IN_ERROR_2000"];
					break;
				case 2010:
					errorMessage = MessageHelper.messages["GLOBALLOGIN_SIGN_IN_ERROR_2010"];					
					break;
				case 2020:
					errorMessage = MessageHelper.messages["GLOBALLOGIN_SIGN_IN_ERROR_2020"];
					break;
				case 2030:
					errorMessage = MessageHelper.messages["GLOBALLOGIN_SIGN_IN_ERROR_2030"];
					break;
				case 2110:
					//errorMessage = MessageHelper.messages["GLOBALLOGIN_SIGN_IN_ERROR_2110"];
					$('#AccountBlocked').css('display', 'block');
					break;
				case 2300:
					errorMessage = MessageHelper.messages["GLOBALLOGIN_SIGN_IN_ERROR_2300"];
					break;
				case 2400:
					errorMessage = MessageHelper.messages["GLOBALLOGIN_SIGN_IN_ERROR_2400"];
					break;
				case 2410:
					errorMessage = MessageHelper.messages["GLOBALLOGIN_SIGN_IN_ERROR_2410"];
					break;
				case 2420:
					errorMessage = MessageHelper.messages["GLOBALLOGIN_SIGN_IN_ERROR_2420"];
					break;
				case 2430:					
					document.location.href = "ResetPasswordForm?storeId=" + WCParamJS.storeId + "&catalogId=" + WCParamJS.catalogId + "&langId=" + WCParamJS.langId + "&errorCode=" + errorCode;												
					break;
				case 2570:
					errorMessage = MessageHelper.messages["GLOBALLOGIN_SIGN_IN_ERROR_2570"];
					break;			
			}
			if (document.getElementById(serviceResponse.widgetId + "_logonErrorMessage_GL" ) != null){											
				document.getElementById(serviceResponse.widgetId + "_logonErrorMessage_GL" ).innerHTML = errorMessage;
				$('#'+serviceResponse.widgetId+'_logonErrorMessage_GL').removeClass('js-hide-show'); // Fix for 7795
				/* Commented out for DMart
				document.getElementById(serviceResponse.widgetId + "_WC_AccountDisplay_FormInput_logonId_In_Logon_1").setAttribute("aria-invalid","true");		
				document.getElementById(serviceResponse.widgetId + "_WC_AccountDisplay_FormInput_logonId_In_Logon_1").setAttribute("aria-describedby","logonErrorMessage_GL_alt");
				document.getElementById(serviceResponse.widgetId + "_WC_AccountDisplay_FormInput_logonPassword_In_Logon_1").setAttribute("aria-invalid","true");		
				document.getElementById(serviceResponse.widgetId + "_WC_AccountDisplay_FormInput_logonPassword_In_Logon_1").setAttribute("aria-describedby","logonErrorMessage_GL_alt");
				*/
				// Scroll up to the error message only for Login page
				if(serviceResponse.widgetId == '1') {
					$('html,body').animate({ scrollTop: 0},'fast');
				}
				
			}				
		}else{
			
			var url = serviceResponse.URL[0].replace(/&amp;/g, '&');
			url=url.replace(/#_/g,'');
			var languageId = serviceResponse.langId;
			
			if(languageId!=null && document.getElementById('langSEO'+languageId)!=null){// Need to switch language.
				var browserURL = document.location.href;
				var currentLangSEO = '/'+document.getElementById('currentLanguageSEO').value+'/';
				
				if (browserURL.indexOf(currentLangSEO) != -1) {
					// If it's SEO URL.
					var preferLangSEO = '/'+document.getElementById('langSEO'+languageId).value+'/';
					
					var query = url.substring(url.indexOf('?')+1, url.length);
					var parameters = dojo.queryToObject(query);
					if(parameters["URL"]!=null){
						var redirectURL = parameters["URL"];
						var query2 = redirectURL.substring(redirectURL.indexOf('?')+1, redirectURL.length);
						var parameters2 = dojo.queryToObject(query2);
						// No redirect URL
						if(parameters2["URL"]!=null){
							var finalRedirectURL = parameters2["URL"];
							if(finalRedirectURL.indexOf(currentLangSEO)!=-1){
								// Get the prefer language, and replace with prefer language.
								finalRedirectURL = finalRedirectURL.replace(currentLangSEO,preferLangSEO);
								parameters2["URL"] = finalRedirectURL;
							}
							query2 = dojo.objectToQuery(parameters2);
							redirectURL = redirectURL.substring(0, redirectURL.indexOf('?'))+'?'+query2;
						}else{
							//Current URL is the final redirect URL.
							redirectURL = redirectURL.toString().replace(currentLangSEO,preferLangSEO);
						}
						parameters["URL"]=redirectURL;
					}
					query = dojo.objectToQuery(parameters);
					url = url.substring(0, url.indexOf('?'))+'?'+query;
					
				}else{
					// Not SEO URL.
					// Parse the parameter and check whether if have langId parameter. 
					if(url.contains('?')){
						var query = url.substring(url.indexOf('?')+1, url.length);
						var parameters = dojo.queryToObject(query);
						if(parameters["langId"]!=null){
							parameters["langId"] = languageId;
							var query2 = dojo.objectToQuery(parameters);
							url = url.substring(0,url.indexOf('?'))+'?'+query2;
						}else{
							url = url + "&langId="+ languageId;
						}
					}else{
						url = url + "?langId="+ languageId;
					}
				}
			}
			
			var storeIdNewLogin = serviceResponse.storeIdNewLogin;
			var pinCodeNewLogin = serviceResponse.pinCodeNewLogin;
	
			//handle redirection after login - AE-2265 - BEGIN
            if(url.indexOf('?') != -1){
                  urlquery = url.substring(url.indexOf('?')+1, url.length);
                  var urlparams= dojo.queryToObject(urlquery);
                  if(urlparams["langId"] != null && languageId != null && languageId != undefined && languageId != ''){
                        urlparams["langId"] = languageId;
                  }
                  if(urlparams["storeId"] != null && storeIdNewLogin != null && storeIdNewLogin != undefined && storeIdNewLogin != ''){
                        urlparams["storeId"] = storeIdNewLogin;
                  }
                  urlquery = dojo.objectToQuery(urlparams);
                  //parameters["URL"]=parameters["URL"]+urlquery;
                  if(url.indexOf('?') != -1){ 
                	  url= url.substring(0,url.indexOf('?'))+'?'+urlquery;
                  }
            }
            
            //handle redirection after login - AE-2265 - END

			var storePinCookieVal = getCookie("DMART_Pincode_Cookie");
			if(/*storePinCookieVal == null && */storeIdNewLogin != '' && pinCodeNewLogin != ''
				&& storeIdNewLogin != undefined && pinCodeNewLogin != undefined){
				var cookieVal=storeIdNewLogin+"_"+pinCodeNewLogin;
				document.cookie = "DMART_Pincode_Cookie=" + cookieVal + ";expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/";
			}
			if(typeof $('#isFromCheckout').val() != 'undefined' && $('#isFromCheckout').val() == 'true'){
				url = "CheckoutView?catalogId="+ WCParamJS.catalogId+"&langId=-1&storeId="+storeId+"&orderId="+$('#checkOutOrderId').val()+"&getCart=N";
			}
			CartHelper.invalidateCookieForOtherProtocol();
			if(serviceResponse.EXPIREDPASSWORD == '1') {
				$('#'+serviceResponse.widgetId+'_logonErrorMessage_GL').html('Your password has expired. Click on Forgot Password to change your password.');
				$('#'+serviceResponse.widgetId+'_logonErrorMessage_GL').removeClass('js-hide-show');
			} else {
				window.location.href = url;
			}
		}			
	},
		
	/**
     * display an error message.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	failureHandler: function(serviceResponse) {		
		if (serviceResponse.errorMessage) {
			MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
		} 
		else {
			 if (serviceResponse.errorMessageKey) {
				MessageHelper.displayErrorMessage(serviceResponse.errorMessageKey);
			 }
		}
		cursor_clear();
	}			
});