<!DOCTYPE html>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://commerce.ibm.com/base" prefix="wcbase" %>
<%@ taglib uri="flow.tld" prefix="flow" %>
<%@ include file="../../../Common/EnvironmentSetup.jspf" %>
<%@ include file="../../../include/ErrorMessageSetup.jspf" %>
<%@ include file="../../../Common/nocache.jspf" %>
<%@ taglib uri="http://commerce.ibm.com/foundation" prefix="wcf" %>
<%@ taglib uri="http://commerce.ibm.com/coremetrics"  prefix="cm" %>
<!--Main Stylesheet for browser -->
<link rel="stylesheet" href="${jspStoreImgDir}${env_vfileStylesheet}" type="text/css" media="screen"/>

<%@ include file="../../../Common/CommonJSToInclude.jspf"%>
<c:set var="pageGroup" value="Common" />
<%@include file="../../../Common/DMartCommonJSToInclude.jspf" %>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,user-scalable=no">
<title><c:out value="Account verification"/></title>
<meta name="description" content="<c:out value="${metaDescription}"/>"/>
<meta name="keywords" content="<c:out value="${metaKeyword}"/>"/>
<meta name="pageIdentifier" content="HomePage"/>
<%--
<meta name="pageId" content="<c:out value="${page.pageId}"/>"/>
 --%>

<meta name="pageGroup" content="content"/>	
<link rel="canonical" href="<c:out value="${env_TopCategoriesDisplayURL}"/>" />
<%--<script type="text/javascript" src="<c:out value='${jsAssetsDir}javascript/MessageHelper.js'/>"></script> --%>



<c:set var="actionCmdName" value="${requestScope.actionCmd}" />

<!-- Header Nav Start -->
<c:if test="${b2bStore eq 'true'}">
	<c:if test="${userType =='G'}">
		<c:set var="hideHeader" value="true" />
	</c:if>
</c:if>
<!-- Import Header Widget -->
<div id="headerWidget">
	<%out.flush();%>
		<c:import url="${env_jspStoreDir}/Widgets/Header/Header.jsp" />
	<%out.flush();%>
</div>
<!-- Header Nav End -->
<meta name="robots" content="noindex,nofollow" />
</head>
<body>
<%--<script src="${jsAssetsDir}javascript/DMart/Utilities/dmartutilities.js"></script>--%>

<c:if test="${!empty errorMessage}">
	<c:set var="errorMessageText" value="${errorMessage}"/>
</c:if>

<c:if test="${WCParam.invalidOTPErrMessage != null}">
	<c:set var="errorMessageText" value="${WCParam.invalidOTPErrMessage}"/>
</c:if>
<c:if test="${WCParam.UserAlreadyVerifiedMessage != null}">
	<c:set var="errorMessageText" value="${WCParam.UserAlreadyVerifiedMessage}"/>	
</c:if>

<div class="container <c:if test="${empty errorMessageText}"> js-hide-show </c:if>" id="error-msg-container" >
  <div class="row">
    <div class="col-xs-12">
      <div class="alert alert-warning-bg js-alert-order">
        <strong><i class="icon-notification"></i><fmt:message key="GENERIC_NOTIFICATION" bundle="${storeText}"/></strong>
        	<span id="generic-error-section">
        		${errorMessageText}
        	</span>	
        <a class="alert-close-cta js-cart-reject align-right alert-cross-pos" href="javascript:;" title="Close"><i class="icon-cta-close icon-cancel"></i></a>
      </div>
    </div>
  </div>
</div>

<%--  asds   	
<div class="container js-resend-otp-alert <c:if test="${empty errorMessageText}"> js-hide-show </c:if>"> 
  <div class="row">
    <div class="col-xs-12">
      <div class="alert alert-warning-bg">
        <strong><i class="icon-notification"></i> <fmt:message key="GENERIC_NOTIFICATION" bundle="${storeText}" /> </strong> ${errorMessageText}
        <a class="alert-close-cta js-cart-reject alert-cross-pos" href="javascript:;" title="Close"><i class="icon-cta-close icon-cancel"></i></a>
      </div>
    </div>
  </div>
</div>

--%>  

<div class="container">

  <div class="row">
    <div class="col-xs-12 col-md-6 show-md-up">
     <div class="blurb">
   <h2 class="blurb__title"><fmt:message bundle="${storeText}" key="OTP_BENEFIT_HEADER"/></h2>
   <div class="blurb__img">
      <img class="img-responsive" src="${jspStoreImgDir}/images/DMart/temp/location/otp.jpg" alt="OTP">
  </div>

  <div class="blurb__content">
    <p><fmt:message bundle="${storeText}" key="OTP_MESSAGE_1"/></p>
	<p><fmt:message bundle="${storeText}" key="OTP_MESSAGE_2"/></p>
    <%-- <ul>
      <li class="spacing-bottom"><fmt:message bundle="${storeText}" key="OTP_MESSAGE_2"/></li>
      <li><fmt:message bundle="${storeText}" key="OTP_MESSAGE_3"/> 
      <a href="tel:1800-1234-5678" class="link-alternate"><fmt:message bundle="${storeText}" key="OTP_MESSAGE_4"/></a> <fmt:message bundle="${storeText}" key="OTP_MESSAGE_5"/> <a href="mailto:contact@dmartindia.com" class="link-alternate"><u><fmt:message bundle="${storeText}" key="OTP_MESSAGE_6"/></u></a>
      </li>
    </ul> --%>
  </div>
</div>

    </div>
    <div class="col-xs-12 col-md-6">
    
    
     
<div class="form">
	<h2 class="form__title"><fmt:message bundle="${storeText}" key="ACCOUNT_VERIFICATION"/></h2>
	
    <form class="form__account-verification" action="${WCParam.actionCmd}" method="post" id="formAccountValidation" name="formAccountValidation" novalidate>  
    <div class="form-control">
  		<label for="mobileNumber" class="form__label required-field spacing-bottom-tiny"><fmt:message bundle="${storeText}" key="OTP_MOBILE_NUMBER"/></label>
  		<div class="form__input--group">
    		<span class="form__input-prefix"><fmt:message bundle="${storeText}" key="OTP_MOBILE_PREFIX"/></span>
    		<input type="tel" required maxlength="10" placeholder="9999999999" id="mobileNumber" name="mobileNumber" class="form__input" value="${WCParam.mobileNumber}" readonly="true"/>
  		</div>
	</div> 

    <div class="js-signin-otp">
      <div class="form-control spacing-bottom-half">
        <label for="otpNumber" class="form__label required-field spacing-bottom-tiny"><fmt:message bundle="${storeText}" key="OTP_TEXT"/></label>
        <%-- modified maxlenght and input type based on RzF v 0.3.0 --%>
        <div class="otp-group clearfix">
          <input type="number" rel="otpInput" class="form__input otpInput" name="otpNumber1" id="otpNumber1" required>
          <input type="number" rel="otpInput" class="form__input otpInput" name="otpNumber2" id="otpNumber2" required>
          <input type="number" rel="otpInput" class="form__input otpInput" name="otpNumber3" id="otpNumber3" required>
          <input type="number" rel="otpInput" class="form__input otpInput" name="otpNumber4" id="otpNumber4" required>
          <input type="number" rel="otpInput" class="form__input otpInput" name="otpNumber5" id="otpNumber5" required>
          <input type="number" rel="otpInput" class="form__input otpInput" name="otpNumber6" id="otpNumber6" required>
        </div>
        <%-- modified maxlenght and input type based on RzF v 0.3.0 --%>
      </div>
    </div>
    
    <input id="mobNumber" type="hidden" value="${WCParam.mobileNumber}" name="mobileNumber"/>
    <input id="listId" type="hidden" value="${WCParam.listId}" name="listId"/>
	<input id="otpCode" type="hidden" value="" name="otpCode"/>
	<input id="logonId" type="hidden" value="${WCParam.mobileNumber}" name="logonId"/>
	<input id="URL" type="hidden" value="${WCParam.URL}" name="URL"/>
	<input id="delivery_pinCode" type="hidden" value="" name="pinCode"/>	
	<input id="operation" type="hidden" value="${WCParam.operation}" name="operation"/>
	<input id="isOTPSubmit" type="hidden" name="isOTPSubmit" value="true" />
	<input id="previousPage" type="hidden" value="${header['referer']}" name="previousPage"/>
	<input id="storeId" type="hidden" value="${WCParam.storeId}" name="storeId"/>
	<input id="pincodeNewReg" type="hidden" value="" name="pincodeNewReg"/>
	<input id="storeIdNewReg" type="hidden" value="" name="storeIdNewReg"/>
	<script type="text/javascript">
    function read_cookie(key)
		{
		    var result;
		    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
		}
	var locValues = read_cookie('DMART_Pincode_Cookie');
	if(locValues != null){
	locValues = locValues.split('_');
	$("input[id=pincodeNewReg]").val(locValues[1]);
	$("input[id=storeIdNewReg]").val(locValues[0]);
	}
    </script>
	
    <div class="form__btn">
      <button id="otp_button" type="button" class="js-form-submit signin__btn-submit button-primary"><fmt:message bundle="${storeText}" key="OTP_SUBMIT"/></button>
    </div>

    <p id="otpresend">
    <fmt:message bundle="${storeText}" key="ERR_OTP_EXPIRED" var="otpExpired"/>

    <c:choose>
	    <c:when test="${!empty errorMessageText && errorMessageText == otpExpired}">
	       	<fmt:message bundle="${storeText}" key="ERR_OTP_EXPIRED_SHORT"/>
	    </c:when>
	    <c:otherwise>
	    	<fmt:message bundle="${storeText}" key="OTP_WAIT_MESSAGE"/>
	    </c:otherwise>
    </c:choose>
     <a class="link-alternate js-resend-otp" href="#" onclick="resendOtp(document.formAccountValidation);return false;" title="Resend OTP"><strong><fmt:message bundle="${storeText}" key="OTP_RESEND"/></strong></a>
    </p>
	</form>

</div>

    </div>
    
    
        <div class="col-xs-12 col-md-6 show-sm-down">
     <div class="blurb">
   <h2 class="blurb__title"><fmt:message bundle="${storeText}" key="OTP_BENEFIT_HEADER"/></h2>
   <div class="blurb__img">
      <img class="img-responsive" src="${jspStoreImgDir}/images/DMart/temp/location/otp.jpg" alt="OTP">
  </div>

  <div class="blurb__content">
    <p><fmt:message bundle="${storeText}" key="OTP_MESSAGE_1"/></p>

    <ul>
      <li class="spacing-bottom"><fmt:message bundle="${storeText}" key="OTP_MESSAGE_2"/></li>
      <li><fmt:message bundle="${storeText}" key="OTP_MESSAGE_3"/> 
<%--       <a href="tel:1800-1234-5678" class="link-alternate"><fmt:message bundle="${storeText}" key="OTP_MESSAGE_4"/></a> <fmt:message bundle="${storeText}" key="OTP_MESSAGE_5"/> <a href="mailto:contact@dmartindia.com" class="link-alternate"><u><fmt:message bundle="${storeText}" key="OTP_MESSAGE_6"/></u></a> --%>
      </li>
    </ul>
  </div>
</div>

    </div>
    
  </div>
</div>

<%-- <div id="forgotPasswordModal" class="modal-dialog js-modal-dialog-esc">
	<div class="modal-dialog__content modal-dialog__content-small">
		<a href="javascript:;" title="Close" class="modal-dialog__close">X</a>
		<div class="modal-dialog__header">
			<h4 class="modal-dialog__header-title"><fmt:message bundle="${storeText}" key="FP_FORGOT_PASSWORD2"/></h4>
		</div>
		<div class="modal-dialog__body">
			<div>
				<p class="form-notification"><fmt:message bundle="${storeText}" key="YOU_WILL_RECEIVE_OTP"/></p>
				<form name="forgotValidation" class="form form--modal" method="post" action="DMartResetPassword"
					id="forgotValidation" >
					<input type="hidden" name="challengeAnswer" value="-" id="WC_PasswordResetForm_FormInput_challengeAnswer_In_ResetPasswordForm_1"/>
					<input type="hidden" name="storeId" value='<c:out value="${WCParam.storeId}" />' id="WC_PasswordResetForm_FormInput_storeId_In_ResetPasswordForm_1"/>
					<input type="hidden" name="catalogId" value='<c:out value="${WCParam.catalogId}" />' id="WC_PasswordResetForm_FormInput_catalogId_In_ResetPasswordForm_1"/>
					<input type="hidden" name="langId" value='<c:out value="${langId}" />' id="WC_PasswordResetForm_FormInput_langId_In_ResetPasswordForm_1"/>
					<input type="hidden" name="state" value="passwdconfirm" id="WC_PasswordResetForm_FormInput_state_In_ResetPasswordForm_1"/>
					<input type="hidden" name="URL" value="DMartOTPDisplayView" id="WC_PasswordResetForm_FormInput_URL_In_ResetPasswordForm_1"/>
					<input type="hidden" name="errorViewName" value="ResetPasswordErrorView" id="WC_PasswordResetForm_FormInput_errorViewName_In_ResetPasswordForm_1"/>
					<input type="hidden" name="authToken" value="${authToken}"  id="WC_PasswordResetForm_FormInput_authToken_In_ResetPasswordForm_1"/>
													
					<div class="form-control">
						<label for="mobileNumber"
							class="form__label required-field spacing-bottom-tiny"><fmt:message bundle="${storeText}" key="FP_MOBILE_NUMBER"/></label>
						<div class="form__input--group">
							<span class="form__input-prefix"><fmt:message bundle="${storeText}" key="FP_MOBILE_PREFIX"/></span> <input type="tel"
								required maxlength="10" placeholder="9999999999"
								id="logonId" name="logonId" class="form__input">
						</div>
					</div>
					THis div is removed in the latest
					<div class="form-control">
						<label class="form__label spacing-bottom-tiny" for="email"><fmt:message bundle="${storeText}" key="FP_EMAIL"/>
						</label> <input class="form__input" name="email"
							placeholder="xyz@email.com" id="email" maxlength=""
							autocomplete="off">
					</div>
					This div is removed in the latest
					<button class="js-form-submit button-primary button--block"
						type="submit">
						<fmt:message bundle="${storeText}" key="FP_FORGOT_PASSWORD1"/>
					</button>
				</form>
			</div>
		</div>
	</div>
</div>
 --%>
<div id="footerWrapper">
	<%out.flush();%>
	<c:import url="${env_jspStoreDir}Widgets/Footer/Footer.jsp"/>
	<%out.flush();%>
</div>

<script>
	dojo.addOnLoad(function() {
		<fmt:message bundle="${storeText}" key="ERR_OTP_RESEND_FAILED" var="ERR_OTP_RESEND_FAILED"/>
		MessageHelper.setMessage("ERR_OTP_RESEND_FAILED", <wcf:json object="${ERR_OTP_RESEND_FAILED}"/>);
		
		<fmt:message bundle="${storeText}" key="OTP_WAIT_MESSAGE" var="OTP_WAIT_MESSAGE"/>
		MessageHelper.setMessage("OTP_WAIT_MESSAGE", <wcf:json object="${OTP_WAIT_MESSAGE}"/>);
		
		<fmt:message bundle="${storeText}" key="ERR_OTP_EXPIRED_SHORT" var="ERR_OTP_EXPIRED_SHORT"/>
		MessageHelper.setMessage("ERR_OTP_EXPIRED_SHORT", <wcf:json object="${ERR_OTP_EXPIRED_SHORT}"/>);
		
		<fmt:message bundle="${storeText}" key="OTP_RESEND_STATUS_MESSAGE" var="OTP_RESEND_STATUS_MESSAGE"/>
		MessageHelper.setMessage("OTP_RESEND_STATUS_MESSAGE", <wcf:json object="${OTP_RESEND_STATUS_MESSAGE}"/>);
		
		<fmt:message bundle="${storeText}" key="GENERIC_ERROR_MESSAGE" var="GENERIC_ERROR_MESSAGE"/>
		MessageHelper.setMessage("GENERIC_ERROR_MESSAGE", <wcf:json object="${GENERIC_ERROR_MESSAGE}"/>);
		
		<fmt:message bundle="${storeText}" key="_ERR_INVALID_PARAMETER" var="_ERR_INVALID_PARAMETER"/>
		MessageHelper.setMessage("_ERR_INVALID_PARAMETER", <wcf:json object="${_ERR_INVALID_PARAMETER}"/>);
		});
		
	dojo.addOnLoad(function() {
		var pinCode="";
		var storePinCookieVal = getCookie("DMART_STORE_PINCODE");
		if(storePinCookieVal != null){
			var pin = storePinCookieVal.split("_");
			var cookiePin = pin[1];
			if(cookiePin != null){
				 pinCode = cookiePin;
			}	
		}
		document.getElementById("delivery_pinCode").value=pinCode;
	});
</script>
</body>
