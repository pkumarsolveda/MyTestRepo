/**
 * Copyright(c) Avenue E-Commerce Limited (2015). All Rights reserved. This
 * software is the confidential and proprietary information of Avenue E-Commerce
 * Limited ("Confidential Information"). You shall not disclose such
 * Confidential Information and shall use it only in accordance with the terms
 * of the license agreement you entered into with Avenue E-Commerce Limited.
 * 
 * Author Aditya_Pathak02 Date 14/12/2015
 */
var guestCheckout = {

		sendOtp : function(form) {
			var isFromValid = false;
			if(form.name == "formValidation"){
				$('#formValidation').validate();
				if ($('#formValidation').valid()) {
					isFromValid=true;
				}

			}else{
				$('#formValidation1').validate();
				if ($('#formValidation1').valid()) {
					isFromValid=true;
				}
			}

			if (isFromValid) {
				if($('#'+form.name).find('.form__input').not(':disabled').val()  !== '' && (!$('#'+form.name).find('#mobileNumber').hasClass('error'))) {
					$('#'+form.name).find('.form__input.otpInput.ignore').removeClass('ignore');
					$('#'+form.name).find('.js-form-btn-signin .button-primary, .js-signin-password, .signin__alternate').css('display', 'none');
					$('#'+form.name).find('.js-form-btn-signin .signin__btn-submit, .js-signin-otp').css('display', 'block');
					$('#'+form.name).find('#mobileNumber').prop("disabled", true);
				}
				var mobile = form.logonId.value;
				var orderId = parseInt($('#checkOutOrderId').val());
				var operation = 2;
				if (operation == "") {
					operation = "0";
				}
				var xhrArgs = {
						url : "ResendOTPCmd",
						handleAs : "json",
						content : {
							logonId : mobile,
							operation : operation,
							referenceId : form.logonId.value
						}
				};
				// Call the asynchronous xhrGet
				var deferred = dojo.xhrGet(xhrArgs);
				$('#'+form.name).find('.js-form-btn-signin .js-show-resend-otp').css('display', 'block');
			}
			if(form.name == "formValidation"){
				$(document.formValidation).find('#logonId').prop("disabled", false);
			}else{
				$(document.formValidation1).find('#logonId').prop("disabled", false);
			}		  

		},
		reSendOtp : function(form) {
			var mobile = form.logonId.value;
			var orderId = parseInt($('#checkOutOrderId').val());
			var operation = 2;
			var xhrArgs = {
					url : "ResendOTPCmd",
					handleAs : "json",
					content : {
						logonId : mobile,
						operation : operation,
						referenceId : form.logonId.value
					},
					load : function(response) {
						//Clear the OTP already entered in page, if any
						for ( var index = 1; index < 7; index++) {
							var str = "otpNumber" + index;
							if(form.name == "formValidation"){
								$('#formValidation #' + str).val('');
							}else{
								$('#formValidation1 #' + str).val('');
							}			
						}
						if(response.resendStatus != null && response.resendStatus != ''){
							
							if(form.name == "formValidation"){
								$('.js-resend-otp-alert').html(MessageHelper.messages["OTP_RESEND_STATUS_MESSAGE"]);
								$('.js-resend-otp-alert').fadeIn('slow');
							}else{
								//Using showGenericError method to display the OTP re-sent message
								errorMessageHelper.showGenericError(MessageHelper.messages["OTP_RESEND_STATUS_MESSAGE"]);
							}

							var newtext = $(form).find('#otpresend').html().replace(MessageHelper.messages["ERR_OTP_EXPIRED_SHORT"],MessageHelper.messages["LOGIN_MESG_WAIT_OTP"]);
							$(form).find('#otpresend').html(newtext);
						}
					}
			};
			// Call the asynchronous xhrGet
			var deferred = dojo.xhrGet(xhrArgs);
			
			
		},
		validateOtp : function(form) {
			var isFromValid = false;
			if(form.name == "formValidation"){
				$('#formValidation').validate();
				if ($('#formValidation').valid()) {
					isFromValid=true;
				}			
			}else{
				$('#formValidation1').validate();
				if ($('#formValidation1').valid()) {
					isFromValid=true;
				}
			}
			if (isFromValid) {
				$('.js-resend-otp-alert').css('display','none');
				var service = window.location.protocol + '//' + window.location.hostname + "/wcs/resources/store/" + storeId
				+ "/checkout/validateOtp?responseFormat=application/json";
				console.log(service);

				var otp;
				if(form.name == "formValidation"){
					otp= $('#formValidation #otpNumber1').val();
				}else{
					otp= $('#formValidation1 #otpNumber1').val();
				}

				for ( var index = 2; index < 7; index++) {
					var str = "otpNumber" + index;
					if(form.name == "formValidation"){
						otp = otp.concat($('#formValidation #' + str).val());
					}else{
						otp = otp.concat($('#formValidation1 #' + str).val());
					}			
				}
				var inputData = {};
				inputData.otp = otp;
				inputData.operation = "2";
				inputData.referenceId = form.logonId.value;
				inputData.isGuestCheckout = true;
				var currentURL= window.location.href;
				currentURL=currentURL.replace(/#_/g,'');
				var xhrArgs = {
						url : service,
						handleAs : "json",
						content : inputData,
						load : function(response) {
							if (response.OTPValidation === "Success") {
								document.cookie = "guest=valid; path=/";
								if(typeof $('#isFromCheckout').val() != 'undefined' && $('#isFromCheckout').val() == 'true'){
									window.location.href = window.location.origin+'/webapp/wcs/stores/servlet/' +"CheckoutView?catalogId="+WCParamJS.catalogId+"&langId=-1&storeId="+storeId+"&orderId="+$('#checkOutOrderId').val();
								}else if (typeof $('#isFromSignIn').val() != 'undefined' && $('#isFromSignIn').val() == 'true'){
									var loc=currentURL;
									loc=loc.replace("popup=login&",'');
									loc=loc.replace("popup=login",'');
									loc=loc.replace(/#_/g,'');
									if(loc)
										window.location.href = loc;
									else
										window.location.href = currentURL;
									//window.location.href = currentURL;
								}
							}else{
								if(form.name == "formValidation"){
									$('.js-resend-otp-alert').html(response.invalidOTPErrMessage);
									$('.js-resend-otp-alert').fadeIn('slow');
								}else{
									errorMessageHelper.showGenericError(response.invalidOTPErrMessage);
								}
								
								if(response.invalidOTPErrMessage==MessageHelper.messages["ERR_OTP_EXPIRED"]){
									var newtext = $(form).find('#otpresend').html().replace(MessageHelper.messages["LOGIN_MESG_WAIT_OTP"],MessageHelper.messages["ERR_OTP_EXPIRED_SHORT"]);
									$(form).find('#otpresend').html(newtext);
								}			
								console.log(response.invalidOTPErrMessage);
							}
						}
				};
				// Call the asynchronous xhrPost
				var deferred = dojo.xhrPost(xhrArgs);
			}

		}
};