(function(dmUIConfig) {
  $(document).ready(function () {
	  
	$('#otp_button').on('click', function() { 
		if($('#formAccountValidation').valid()){
          var otp = $('#formAccountValidation #otpNumber1').val() + $('#formAccountValidation #otpNumber2').val() + 
          $('#formAccountValidation #otpNumber3').val() + $('#formAccountValidation #otpNumber4').val() + 
          $('#formAccountValidation #otpNumber5').val() + $('#formAccountValidation #otpNumber6').val();
          $("#otpCode").val(otp);
          
          // SessionStorage check, otherwise URL will be set in hidden variable
         /* var homePage = 'StoreView?storeId='+$('#formAccountValidation input[name=storeId]').val();
          var previousPage = homePage;
          if(window.sessionStorage) {
        	 previousPage = sessionStorage.getItem('previousPage');
        	 if(null === previousPage || previousPage === '') {
        		 previousPage = homePage;
        	 }
        	 $('#formAccountValidation input[name=URL]').val(previousPage);
          }*/
          
          $('#formAccountValidation').submit();
        }
    }); 
	
	$('#formAccountValidation .form__input.otpInput').keypress(function(){
		if(event.which == 13)
		{
			if($('#formAccountValidation').valid()){
			event.preventDefault(); 
			var otp = $('#formAccountValidation #otpNumber1').val() + $('#formAccountValidation #otpNumber2').val() + 
	          $('#formAccountValidation #otpNumber3').val() + $('#formAccountValidation #otpNumber4').val() + 
	          $('#formAccountValidation #otpNumber5').val() + $('#formAccountValidation #otpNumber6').val();
	          $("#otpCode").val(otp);
			$('#formAccountValidation').submit(); 
			}
		}

		});
	
	$('#formValidation1 .form__input.otpInput').keypress(function(){
		if(event.which == 13)
		{
			guestCheckout.validateOtp(document.formValidation1);
		}

		});
	$('#formValidation .form__input.otpInput').keypress(function(event){
		if(event.which == 13)
		{ 
			guestCheckout.validateOtp(document.formValidation);
		}

	});
	  
	  
  });
}(DM_UI_CONFIG));
  

function resendOtp(form) {
	var mobile = dojo.byId("mobNumber").value;
	var operation = dojo.byId("operation").value;
	var listId=$('#listId').val();
	var param={};
	if(listId.length>0){
		param.listId = listId;
	}
	else{
		param.logonId=mobile;
	}
	if(operation == ""){
		operation="0";
	}
	param.operation=operation;
	var xhrArgs = {
		url: "ResendOTPCmd",
		handleAs: "json",
		content: param,
		load: function(response){
		  var error ;
		  if(response.resendStatus == undefined){
			var key=response.excMsg['applicationMessageKey'];
			error =  MessageHelper.messages[key];
		  }else{
				for ( var index = 1; index < 7; index++) {
					var str = "otpNumber" + index;
					$('#'+form.name+' #' + str).val('');
				}
			  error = MessageHelper.messages["OTP_RESEND_STATUS_MESSAGE"];	
				var newtext = $(form).find('#otpresend').html().replace(MessageHelper.messages["ERR_OTP_EXPIRED_SHORT"],MessageHelper.messages["LOGIN_MESG_WAIT_OTP"]);
				$(form).find('#otpresend').html(newtext);
		  }
		  errorMessageHelper.showGenericError(error);
		},
		error: function(error){
		  var error = MessageHelper.messages["GENERIC_ERROR_MESSAGE"] + error;
		  errorMessageHelper.showGenericError(error);
		}
	  }
	  // Call the asynchronous xhrGet
	  var deferred = dojo.xhrGet(xhrArgs);
	DMAnalytics.events( DMAnalytics.Constants.Action.ResendOTP,DMAnalytics.Constants.Action.ResendOTP , document.title, 0,null );
}

$(document).on('click', '#resendEmailbutton', function () {	
	var params = {};
	params.userId = $('#dmUserId').val();
	$.ajax({
		url:"ResendEmailValidationCmd",
		data:params,
		type: "POST"
	}).done(function(data){
		errorMessageHelper.showGenericError(MessageHelper.messages["EMAIL_VERIFICATION_RESEND"]);
	}).fail(function(data){
		errorMessageHelper.showGenericError(MessageHelper.messages["GENERIC_ERROR_MESSAGE"]);
	});	
});

function resendEmail() {
	var targetNode = dojo.byId("resendEmailmessage");
	var userId = dojo.byId("dmUserId").value;
	if(userId == '-1002' || userId.length==0){
		userId=dojo.byId("userId").value;
	}
	
	var param={};
	
	param.userId = userId;
	
	var xhrArgs = {
		url: "ResendEmailValidationCmd",
		handleAs: "json",
		content: param,
		load: function(response){
		  var error ;
		  if(response.resendStatus == undefined){
			var key=response.excMsg['applicationMessageKey'];
			error =  MessageHelper.messages[key];
		  }else{
			  dojo.style(dojo.byId('emailValResult'), "display", "none");
			  error = response.resendStatus;
		  }
		  targetNode.innerHTML = error;
		},
		error: function(error){
		  targetNode.innerHTML = MessageHelper.messages["GENERIC_ERROR_MESSAGE"] + error;
		}
	  };
	  // Call the asynchronous xhrGet
	  var deferred = dojo.xhrGet(xhrArgs);
}

function getImageURLs(items, relativeURL) {

    var imageObj = {};
	$.each(items.attributes, function(index, attrib) {
	    if (attrib.usage === 'Descriptive') {
		if (attrib.identifier == 'BINARY IMAGE CODE') {
		    imageObj['imageFlag'] = parseInt(attrib.values[0].value).toString(2);
		}
		if (attrib.identifier == 'IMAGE KEY') {
		    imageObj['imageIdentifier'] = attrib.values[0].value;
		}
	    }
	});
	var imageURLs = [];
	if(imageObj.imageFlag){
	// if image key not present use item part number 
	if (!imageObj['imageIdentifier']) {
	    imageObj['imageIdentifier'] = items.partNumber;
	}
	$.each(imageObj.imageFlag.split(''), function(index, flag) {
		if(flag == '1'){
			var imageNameWithPath = imageObj.imageIdentifier.replace(/(\S)(\S)(\S)\S*/,'$1/$2/$3/'+imageObj.imageIdentifier);
		imageURLs.push(WCParamJS.imageServerHost+relativeURL+imageNameWithPath + '_' + parseInt(index + 1) + '_T.jpg');}
	});
	}
    return imageURLs;

}

function fetchEmailVerificationPageProducts(){
	
	var popularProductsData = [];
	var otherProductsData = [];
	var urlPrefixWcs = window.location.protocol + '//' + window.location.hostname + '/wcs/resources/store/';
	$.ajax({
		 url: urlPrefixWcs + WCParamJS.storeId + '/espot/DMartMostPopularProducts',
		    method: 'GET',
		    context: this,
		    async: false
	}).done(function(data) {		
		if(data.MarketingSpotData && data.MarketingSpotData[0].baseMarketingSpotActivityData) {
			var catentries = data.MarketingSpotData[0].baseMarketingSpotActivityData;
			var length = catentries.length;
			for(var i=0;i<length;i++) {
				popularProductsData.push(catentries[i].productId);
			}
		}
	});
	
	$.ajax({
		 url: urlPrefixWcs + WCParamJS.storeId + '/espot/DMartOtherPopularProducts',
		    method: 'GET',
		    context: this,
		    async: false
	}).done(function(data) {
		if(data.MarketingSpotData && data.MarketingSpotData[0].baseMarketingSpotActivityData) {
			var catentries = data.MarketingSpotData[0].baseMarketingSpotActivityData;
			var length = catentries.length;
			for(var i=0;i<length;i++) {
				otherProductsData.push(catentries[i].productId);
			}
		}
	});	
	
	var productsArray = popularProductsData.concat(otherProductsData);
	
	ProductHelper.fetchProductDetails(productsArray,renderEmailVerficationEspots,[popularProductsData,otherProductsData]);
}

function renderEmailVerficationEspots(popularProductsData,otherProductsData){
	productsRecommendation.init('',null,popularProductsData, otherProductsData, 'prodRecommendations', null);
}


function checkValidPincode(aPincode) {	
	var pincodeMap = DMStorage.getValue('pincodeMap');
	var pinCodeServed = false;
	if(pincodeMap != null){
		$.each(pincodeMap, function(i, pin) {
			if(aPincode == pin.Pincode){
				pinCodeServed = true;
			}
		});
	}		
	return pinCodeServed;
}
	
function sendContactUs(form) {
	var name = form.nameContact.value;
	var email = form.emailContact.value;
	var message = form.messageContact.value;
	var param={};
	param.name = name;
	param.email = email;
	param.message = message;
	var messageContent = form.messageContact.value;
	var targetNode = document.getElementById("messageDiv");
	 $.ajax({
		    url: "/wcs/resources/store/" + WCParamJS.storeId + "/common/contactUs",
		    method: 'POST',
		    data : JSON.stringify(param),
		    contentType: "application/json"
		}).done(function(data) {
			if(data != undefined){
				if(data.emailStatus == 'Success'){
					$('#messageDiv').show();
					form.reset();
				}else{
					targetNode.innerHTML =MessageHelper.messages["MESSAGE_EMAIL_SENDING_FAILED_1"];
					$('#messageDiv').show();
				}
			}
			
		}).fail(function(data) {
			targetNode.innerHTML =MessageHelper.messages["MESSAGE_EMAIL_SENDING_FAILED_2"];
			$('#messageDiv').show();
		});
}

function renderRupeeSymbolInDropDown(){
	var browser = getBrowserDetails();
	
	 // Detect OS
    var OSName = 'Unknown OS';
    if (navigator.appVersion.indexOf('Win') !== -1) {
      OSName = 'Windows';
    }
    else if (navigator.appVersion.indexOf('Mac') !== -1) {
      OSName = 'MacOS';
    }
    else if (navigator.appVersion.indexOf('X11') !== -1) {
      OSName = 'UNIX';
    }
    else if (navigator.appVersion.indexOf('Linux') !== -1) {
      OSName = 'Linux';
    }
    // Fix for Rupee symbol in Windows lower browser versions
    if(OSName === 'Windows' && browser.version <= 46) {
      $('.js-rupee').addClass('has-rupee');
      $('.js-rupee select option').text(function(index, text) {
        return text.replace('₹', '`');
      });
      $('.js-rupee ul li').text(function(index, text) {
          return text.replace('₹', '`');
      });
    }
}

// detect browser
function getBrowserDetails(){
  var ua = navigator.userAgent, tem, M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if(/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return {name: 'IE', version: (tem[1]||'')};
  }
  if(M[1]==='Chrome') {
    tem = ua.match(/\bOPR\/(\d+)/);
    if(tem !== null) {
      return {name: 'Opera', version: tem[1]};
    }
  }
  M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
  if((tem = ua.match(/version\/(\d+)/i)) !== null) {
    M.splice(1, 1, tem[1]);
  }
  return {
    name: M[0],
    version: M[1]
  };
}