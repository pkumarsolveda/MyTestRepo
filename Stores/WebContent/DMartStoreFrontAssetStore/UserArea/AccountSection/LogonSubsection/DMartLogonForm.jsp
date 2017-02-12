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

<%@ include file="../../../Common/CommonJSToInclude.jspf"%>

<%--<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/CheckoutArea/Guest-Checkout.js"/>"></script> --%>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<fmt:message bundle="${storeText}"key="LOGIN_PAGE_TITLE" var="pageTitleCustom" />
<c:if test="${not empty pageTitle && pageTitle ne ''}" >
		<c:set var="pageTitleCustom" value="${pageTitle}"/>
</c:if>
<title><c:out value="${pageTitleCustom}"/></title>
<meta name="description" content="<c:out value="${metaDescription}"/>"/>
<meta name="keywords" content="<c:out value="${metaKeyword}"/>"/>
<meta name="pageIdentifier" content="HomePage"/>
<meta name="pageId" content="<c:out value="${page.pageId}"/>"/>
<meta name="pageGroup" content="content"/>	
<link rel="canonical" href="<c:out value="${env_TopCategoriesDisplayURL}"/>" />
		

<link rel="stylesheet" href="${staticServerHostPath}${env_vfileStylesheet}" type="text/css" media="screen"/>
<%-- Header Nav Start --%>
<c:if test="${b2bStore eq 'true'}">
	<c:if test="${userType =='G'}">
		<c:set var="hideHeader" value="true" />
	</c:if>
</c:if>
<script>
 dojo.addOnLoad(function(){
 	if(window.location.pathname.indexOf('DMartLogonView') === -1) {
 		$('#otpCheckbox1').hide();
 		$('label[for=otpCheckbox1]').hide();
 	}else{
 		$('#otpCheckbox1').attr('checked', false);
 	}
 });
</script>
<c:set var="pageGroup" value="LoginPage" />
<%@include file="../../../Common/DMartCommonJSToInclude.jspf" %>

<%-- Import Header Widget --%>
<div id="headerWidget">
	<%out.flush();%>
		<c:import url="${env_jspStoreDir}/Widgets/Header/Header.jsp" />
	<%out.flush();%>
</div>
<%-- Header Nav End --%>
</head>
<body>

<c:set var="widgetId" value="${param.widgetId}"/>
<c:if test="${empty widgetId}">
  <c:set var="widgetId" value="${WCParam.widgetId}"/>
</c:if>
<c:set var="redirectToPageName" value="${param.redirectToPageName}"/>
<c:if test="${empty redirectToPageName}">
  <c:set var="redirectToPageName" value="${WCParam.redirectToPageName}"/>
</c:if>
<c:set var="userIdOrder" value="${param.userIdOrder}"/>
<c:if test="${empty userIdOrder}">
  <c:set var="userIdOrder" value="${WCParam.userIdOrder}"/>
</c:if>
<c:set var="repayOrderId" value="${param.repayOrderId}"/>
<c:if test="${empty repayOrderId}">
  <c:set var="repayOrderId" value="${WCParam.repayOrderId}"/>
</c:if>

<c:if test="${empty WCParam.ForgetPasswordURL}">
<wcf:url var="ForgetPasswordURL" value="ResetPasswordGuestErrorView">
	<wcf:param name="langId" value="${WCParam.langId}" />
	<wcf:param name="storeId" value="${WCParam.storeId}" />
	<wcf:param name="catalogId" value="${WCParam.catalogId}" />
	<wcf:param name="state" value="forgetpassword" />
</wcf:url>
</c:if>

<c:if test="${empty WCParam.ResendActivationURL}">
<wcf:url var="ResendActivationURL" value="ResendActivationGuestView">
	<wcf:param name="langId" value="${WCParam.langId}" />
	<wcf:param name="storeId" value="${WCParam.storeId}" />
	<wcf:param name="catalogId" value="${WCParam.catalogId}" />
</wcf:url>
</c:if>

<wcbase:isRemembered>
	<c:set var="rememberMeFlag" value="true" />
</wcbase:isRemembered>

<wcbase:isNotRemembered>
	<c:set var="rememberMeFlag" value="false" />
</wcbase:isNotRemembered>

<c:set var="accountActivationFlag" value="false" />
<flow:ifEnabled feature="AccountActivation"> 
	<c:set var="accountActivationFlag" value="true" />
</flow:ifEnabled>	

<c:if test="${empty WCParam.RegisterURL}">
	<wcf:url var="RegisterURL" value="UserRegistrationForm">
		<wcf:param name="langId" value="${WCParam.langId}" />
		<wcf:param name="storeId" value="${WCParam.storeId}" />
		<wcf:param name="catalogId" value="${WCParam.catalogId}" />
		<wcf:param name="isFromCheckout" value="${WCParam.isFromCheckout}" />
		<wcf:param name="checkOutOrderId" value="${WCParam.orderId}" />
		<wcf:param name="myAcctMain" value="1" />
		<wcf:param name="new" value="Y" />
		<c:if test="${!empty WCParam.nextUrl}">
			<wcf:param name="nextUrl" value="${WCParam.nextUrl}" />
		</c:if>    
		<c:if test="${!empty WCParam.URL}">
			<wcf:param name="postRegisterURL" value="${WCParam.URL}" />
		</c:if>                                                
	</wcf:url>
</c:if>
<c:set var="isFromCheckout" value="false"/>
<c:if test="${WCParam.isFromCheckout =='true'}">
	<input type="hidden" id="isFromCheckout" value="true"/>
	<input type="hidden" id="checkOutOrderId" value="${WCParam.orderId}"/>
	<c:set var="isFromCheckout" value="true"/>
</c:if>
<c:set var="newURL" value="${env_TopCategoriesDisplayURL}"/>
<c:set var="reLogonURL" value="${newURL}"/>

<c:if test="${!empty redirectToPageName && redirectToPageName == 'SavedOrderPage'}">
<wcf:url var="SavedOrderListDisplayURLOriginal" value="ListOrdersDisplayView">
	<wcf:param name="storeId"   value="${WCParam.storeId}"  />
	<wcf:param name="catalogId" value="${WCParam.catalogId}"/>
	<wcf:param name="langId" value="${WCParam.langId}" />
	<wcf:param name="myAcctMain" value="1" />   
	<wcf:param name="page" value="savedorder"/>
</wcf:url>
<c:set var="newURL" value="${SavedOrderListDisplayURLOriginal}"/>
</c:if>

<c:if test="${!empty redirectToPageName && redirectToPageName == 'WishList'}">
<wcf:url var="WishListDisplayURLOriginal" value="WishListDisplayView">
	<wcf:param name="listId" value="." />
	<wcf:param name="storeId"   value="${storeId}"  />
	<wcf:param name="catalogId" value="${catalogId}"/>
	<wcf:param name="langId" value="${langId}" />
</wcf:url>
<c:set var="newURL" value="${WishListDisplayURLOriginal}"/>
</c:if>

<c:if
	test="${!empty redirectToPageName && redirectToPageName == 'Repayment'}">
	<wcf:url var="RepaymentURL" value="CheckoutView">
		<wcf:param name="storeId" value="${storeId}" />
		<wcf:param name="catalogId" value="${catalogId}" />
		<wcf:param name="langId" value="${langId}" />
		<wcf:param name="currentAction" value="Payment" />
		<wcf:param name="paymentFailure" value="repay" />
		<wcf:param name="userIdOrder" value="${userIdOrder}" />
		<wcf:param name="orderId" value="${repayOrderId}" />
	</wcf:url>
	<c:set var="newURL" value="${RepaymentURL}" />
</c:if>
<c:if test="${!empty WCParam.isTrackOrder && WCParam.isTrackOrder == 'false'}">
	<wcf:url var="OrderDetailsURL" value="OrderDetailsView">
		<wcf:param name="storeId" value="${WCParam.storeId}" />
		<wcf:param name="orderId" value="${WCParam.orderId}" />
		<wcf:param name="isTrackOrder" value="false" />
	</wcf:url>
</c:if>
<c:if
	test="${!empty WCParam.giftListId}">
	<wcf:url var="MyListUrl" value="myList">
		<wcf:param name="langId" value="${langId}" />
		<wcf:param name="giftListId" value="${WCParam.giftListId}" />
	</wcf:url>
	<c:set var="newURL" value="${MyListUrl}" />
</c:if>

<%-- Check if env_TopCategoriesDisplayURL is a SEO URL,  --%>
<c:choose>
	<c:when test="${fn:contains(newURL, '?') || fn:contains(newURL, '%3F') || fn:contains(newURL, '%3f')}">
		<c:set var="newURL" value="${newURL}&"/>
	</c:when>
	<c:otherwise>
		<c:set var="newURL" value="${newURL}?"/>
	</c:otherwise>
</c:choose>

<c:if test="${empty WCParam.orderMove}">
	<c:choose>
		<c:when test="${WCParam.returnPage eq 'quickcheckout'}">
			<wcf:url var="QuickCheckoutView" value="OrderCopy">
				<wcf:param name="URL" value="RESTOrderPrepare?URL=QuickCheckoutSummaryView"/>
				<wcf:param name="orderId" value="."/>
				<wcf:param name="toOrderId" value="."/>
				<wcf:param name="shippingAddressFromOrderProfile" value="1"/>
				<wcf:param name="orderInfoFrom" value="q"/>
				<wcf:param name="payInfoFrom" value="q"/>
				<wcf:param name="langId" value="${langId}" />
				<wcf:param name="storeId" value="${WCParam.storeId}" />
				<wcf:param name="catalogId" value="${WCParam.catalogId}" />
				<wcf:param name="status" value="P" />       
				<wcf:param name="orderItemId*" value="" />
				<wcf:param name="quantity*" value="" />                                                                                           
				<wcf:param name="errorViewName" value="OrderCopyErrorView" />                                                  
			</wcf:url>
		 
			<wcf:url var="orderMove" value="RESTMoveOrderItem">
				<wcf:param name="URL" value="RESTOrderCalculate?URL=${QuickCheckoutView}"/>
				<wcf:param name="page" value="${WCParam.page}"/>
				<wcf:param name="fromOrderId" value="*"/>
				<wcf:param name="toOrderId" value="."/>
				<wcf:param name="deleteIfEmpty" value="*"/>
				<wcf:param name="continue" value="1"/>
				<wcf:param name="createIfEmpty" value="1"/>
				<wcf:param name="calculationUsageId" value="-1"/>
				<wcf:param name="calculationUsageId" value="-2"/>
				<wcf:param name="calculationUsageId" value="-7"/>
				<wcf:param name="updatePrices" value="0"/>
				<wcf:param name="storeId" value="${WCParam.storeId}" />
				<wcf:param name="catalogId" value="${WCParam.catalogId}" />
			</wcf:url>						
		</c:when>
		<c:otherwise>			
			<c:if test="${empty WCParam.URL}">
				<%-- Assume MultipleActiveOrders feature is enabled. May have many inactive orders. In this case, dont want to merge the orders, just calculate the total --%>
				<c:set var="orderMove" value="RESTOrderCalculate?URL=${newURL}calculationUsageId=-1&calculationUsageId=-2&deleteCartCookie=true&page=${WCParam.page}&catalogId=${WCParam.catalogId}&storeId=${WCParam.storeId}"/>

				<%-- If MultipleActiveOrders is disabled and current order is NOT NULL, then call orderMove --%>
				<flow:ifDisabled feature="MultipleActiveOrders">
					
					<c:set var="orderItemMoveRequired" value="false"/>
					
					<c:set var="cookieOrderIdKey" value="WC_CartOrderId_${storeId}"/>
					<c:set var="cartId" value="${cookie[cookieOrderIdKey].value}"/>
					<c:if test="${!empty cartId}">
						<c:set var="cookieCartTotalKey" value="WC_CartTotal_${cartId}"/>
						<c:set var="cartTotal" value="${cookie[cookieCartTotalKey].value}"/>
						<c:if test="${!empty cartTotal && !fn:startsWith(cartTotal,0)}">
							<%-- Both orderId and cartTotal cookies are present and # of items in cart is > 0. So orderItemMove is required --%>
							<c:set var="orderItemMoveRequired" value="true"/>
						</c:if>
					</c:if>

					<c:if test="${orderItemMoveRequired}">
						<wcf:url var="orderMove" value="RESTMoveOrderItem">
							<%-- There should be only 1 order. Merge all the orders with the current one --%>
							<wcf:param name="URL" value="RESTOrderCalculate?URL=${newURL}calculationUsageId=-1&calculationUsageId=-2&deleteCartCookie=true"/>
							<wcf:param name="page" value="${WCParam.page}"/>
							<wcf:param name="fromOrderId" value="*"/>
							<wcf:param name="toOrderId" value="."/>
							<wcf:param name="deleteIfEmpty" value="*"/>
							<wcf:param name="continue" value="1"/>
							<wcf:param name="createIfEmpty" value="1"/>
							<wcf:param name="calculationUsageId" value="-1"/>
							<wcf:param name="calculationUsageId" value="-2"/>
							<wcf:param name="calculationUsageId" value="-7"/>
							<wcf:param name="updatePrices" value="0"/>
							<wcf:param name="storeId" value="${WCParam.storeId}" />
							<wcf:param name="catalogId" value="${WCParam.catalogId}" />
						</wcf:url>
					</c:if>
				</flow:ifDisabled>
			</c:if>			
		</c:otherwise>
	</c:choose>
</c:if>						



	<div id="page">
<%-- 
<div class="container js-resend-otp-alert js-hide-show">
  <div class="row">
    <div class="col-xs-12">
      <div class="alert alert-warning-bg">
        <strong><i class="icon-notification"></i> Notification:</strong> OTP number sent to your mobile number.
        <a class="alert-close-cta js-cart-reject alert-cross-pos" href="javascript:;" title="Close"><i class="icon-cta-close icon-cancel"></i></a>
      </div>
    </div>
  </div>
</div>
--%>

<div class="container js-hide-show" id="error-msg-container">
  <div class="row">
    <div class="col-xs-12">
      <div class="alert alert-warning-bg js-alert-order">
        <strong><i class="icon-notification"></i><fmt:message key="GENERIC_NOTIFICATION" bundle="${storeText}"/></strong>
        	<span id="generic-error-section">
        	</span>	
        <a class="alert-close-cta js-cart-reject align-right alert-cross-pos" href="javascript:;" title="Close"><i class="icon-cta-close icon-cancel"></i></a>
      </div>
    </div>
  </div>
</div>

<div class="container">

			<div class="row">
				<div class="col-xs-12 col-md-6 show-md-up">
					<div class="blurb">
						<h2 class="blurb__title"><fmt:message bundle="${storeText}" key="LOGIN_MESG_TITLE_BENEFITS"/></h2>
						<div class="blurb__img">
							<img class="img-responsive"
								src="${staticServerHostPath}images/DMart/temp/login/signin_img.jpg" alt="Login">
						</div>

						<div class="blurb__content">
							<p><fmt:message bundle="${storeText}" key="LOGIN_MESG_SIDEBAR1"/></p>

							<%-- <p class="margin-reset"><fmt:message bundle="${storeText}" key="LOGIN_MESG_SIDEBAR2"/></p> --%>
							<div>
								<ul>
									<li><fmt:message bundle="${storeText}" key="LOGIN_SIDE_LIST1_1"/></li>
									<li><fmt:message bundle="${storeText}" key="LOGIN_SIDE_LIST1_2"/></li>
									<li><fmt:message bundle="${storeText}" key="LOGIN_SIDE_LIST1_3"/></li>
									<li><fmt:message bundle="${storeText}" key="LOGIN_SIDE_LIST1_4"/></li>
								</ul>
							</div>
							<%-- <div class="blurb__content-right">
								<ul>
									<li><fmt:message bundle="${storeText}" key="LOGIN_SIDE_LIST2_1"/></li>
									<li><fmt:message bundle="${storeText}" key="LOGIN_SIDE_LIST2_2"/></li>
									<li><fmt:message bundle="${storeText}" key="LOGIN_SIDE_LIST2_3"/></li>
									<li><fmt:message bundle="${storeText}" key="LOGIN_SIDE_LIST2_4"/></li>
								</ul>
							</div> --%>
						</div>
					</div>
				</div>
				<div class="col-xs-12 col-md-6">
					<div class="signin-wrapper">					
 						<h2 class="form__title-signin"><fmt:message key="LOGIN_OR_REGISTER_MSG" bundle="${storeText}" /></h2>
					<div class="form signin-form">
						<div class="new-reg">
						   <a href="<c:out value="${RegisterURL}"/>"> <fmt:message key="LOGIN_NEW_USER_MSG" bundle="${storeText}" /></a>
  						</div>				
					    <div class="form__divider">
					    	<span class="form__divider--text"><fmt:message key="LOGIN_MESG_OR" bundle="${storeText}" /></span>
 						</div>
						<%-- Span added for DMart --%>
						<span class="error_msg" id="1_logonErrorMessage_GL"></span>						
						<form class="form__signin" action="javascript:;" method="post"
							id="formValidation1" name="formValidation1" >
							<div class="error_msg" id="formOtpValidation_error"></div>
							<input type="hidden" name="storeId"
								value="<c:out value="${WCParam.storeId}"/>"/>
							<input type="hidden" name="catalogId"
								value="<c:out value="${WCParam.catalogId}"/>"/>
							<input type="hidden" name="orderId" id="redirectionOrderId"
								value="<c:out value="${WCParam.orderId}"/>"/>
							<c:choose>
								<c:when	test="${!empty redirectToPageName && redirectToPageName == 'Repayment'}">
									<input type="hidden" name="reLogonURL"
										value="<c:out value="${RepaymentURL}"/>"/>
								</c:when>
								<c:when	test="${!empty WCParam.giftListId}">
									<input type="hidden" name="reLogonURL"
										value="<c:out value="${MyListUrl}"/>"/>
								</c:when>
								<c:otherwise>
									<input type="hidden" name="reLogonURL"
										value="<c:out value="${reLogonURL}"/>"/>
								</c:otherwise>
							</c:choose>
							<c:choose>
								<c:when
									test="${(!empty logonId) && (!empty validationCode) && (empty WCParam.errorMessage)}">
									<input type="hidden" name="myAcctMain"
										value="<c:out value="1"/>" />
								</c:when>
								<c:when	test="${!empty notaSocialUser}">
									<span class="error_msg" id="logonErrorMessage"><c:out value="Social SignIn not permitted since email is already registered. Please use the registerd account"/></span>
								</c:when>
								<c:otherwise>
									<input type="hidden" name="myAcctMain"
										value="<c:out value="${myAcctMain}"/>" />
								</c:otherwise>
							</c:choose>
							
							<input type="hidden" name="fromOrderId" value="*"/>
							<input type="hidden" name="toOrderId" value="."/>
							<input type="hidden" name="deleteIfEmpty" value="*"/>
							<input type="hidden" name="continue" value="1"/>
							<input type="hidden" name="createIfEmpty" value="1"/>
							<input type="hidden" name="calculationUsageId" value="-1"/>
							<input type="hidden" name="updatePrices" value="0"/>
							<input type="hidden" name="errorViewName"
								value="AjaxOrderItemDisplayView"/>
							<input type="hidden" name="previousPage" id="previousPage" value="${header['referer']}"/>
							<input type="hidden" name="returnPage"
								value="<c:out value="${returnPage}"/>"/>
							<input type="hidden" name="rememberMe" value="true"/>
							<input type="hidden" name="storeIdNew" value="" id="storeIdNew" />
							<input type="hidden" name="pinCodeNew" value="" id="pinCodeNew" />

							<c:choose>
								<c:when	test="${!empty redirectToPageName && redirectToPageName == 'Repayment'}">
									<input type="hidden" name="nextUrl"
										value="<c:out value="${RepaymentURL}"/>" />
								</c:when>
								<c:when	test="${!empty WCParam.giftListId}">
									<input type="hidden" name="nextUrl"
										value="<c:out value="${MyListUrl}"/>" />
								</c:when>
								<c:when test="${!empty nextUrl}">
									<input type="hidden" name="nextUrl"
										value="<c:out value="${nextUrl}"/>" />
								</c:when>
							</c:choose>
							<c:choose>
								<c:when	test="${!empty redirectToPageName && redirectToPageName == 'Repayment'}">
									<input type="hidden" name="URL" id="returnURL"
										value="<c:out value="${RepaymentURL}"/>" />
								</c:when>
								<c:when	test="${!empty WCParam.giftListId}">
									<input type="hidden" name="URL" id="returnURL"
										value="<c:out value="${MyListUrl}"/>" />
								</c:when>
								<c:when test="${returnPage eq 'quickcheckout'}">
									<input type="hidden" name="URL" id="returnURL"
										value="<c:out value='${orderMove}' />&getCart=N"/>
								</c:when>
								<c:otherwise>
									<c:choose>
										<c:when test="${!empty URL}">
											<c:choose>
												<c:when test="${OrderDetailsURL ne ''}">
													<input type="hidden" name="URL" id="returnURL"  value="<c:out value='${OrderDetailsURL}'/>"/>
												</c:when>
												<c:otherwise>
													<input type="hidden" name="URL" id="returnURL"  value="<c:out value='${URL}&getCart=N'/>"/>
												</c:otherwise>
											</c:choose>
										</c:when>
										<c:otherwise>
											<input type="hidden" name="URL" id="returnURL" value=""/>
										</c:otherwise>
									</c:choose>
								</c:otherwise>
							</c:choose>

							<div class="form-control">
								<label for="logonId"
									class="form__label required-field spacing-bottom-tiny"><fmt:message key="LOGIN_LBL_MOBL_NUM" bundle="${storeText}" /></label>
								<div class="form__input--group">
									<span class="form__input-prefix"><fmt:message key="LOGIN_LBL_MOBL_NUM_PREFIX" bundle="${storeText}" /></span> <input type="tel"
										required maxlength="10" placeholder="<fmt:message key="LOGIN_PHOLDER_MOBL_NUM" bundle="${storeText}" />"
										id="logonId" name="logonId" class="form__input">
								</div>
							</div>

							<div class="js-signin-password">
								<div class="form-control">
									<label class="form__label required-field spacing-bottom-tiny"
										for="logonPassword"><fmt:message key="LOGIN_LBL_PASSWD" bundle="${storeText}" /></label> <input
										class="form__input" type="password" id="logonPassword"  name="logonPassword"
										 required autocomplete="off">
								</div>
							</div>

							<div class="js-signin-otp js-hide-show">
						      <div class="form-control spacing-bottom-half">
						        <label for="otpNumber" class="form__label required-field spacing-bottom-tiny"><fmt:message key="LOGIN_LBL_OTP" bundle="${storeText}" /></label>
						        <div class="otp-group clearfix">
						          <input type="number" rel="otpInput" class="form__input otpInput ignore" name="otpNumber1" id="otpNumber1" required="" aria-required="true">
						          <input type="number" rel="otpInput" class="form__input otpInput ignore" name="otpNumber2" id="otpNumber2" required="" aria-required="true">
						          <input type="number" rel="otpInput" class="form__input otpInput ignore" name="otpNumber3" id="otpNumber3" required="" aria-required="true">
						          <input type="number" rel="otpInput" class="form__input otpInput ignore" name="otpNumber4" id="otpNumber4" required="" aria-required="true">
						          <input type="number" rel="otpInput" class="form__input otpInput ignore" name="otpNumber5" id="otpNumber5" required="" aria-required="true">
						          <input type="number" rel="otpInput" class="form__input otpInput ignore" name="otpNumber6" id="otpNumber6" required="" aria-required="true">
						        </div>
						      </div>
						    </div>
							<div class="signin__alternate form__control--pull-up">
							<%--<c:if test="${WCParam.isFromCheckout =='true'}">--%>
									<input id="otpCheckbox1" class="form__input js-signin-alternate hide-dropdown valid" 
									type="checkbox" name="otpCheckbox1" aria-invalid="false"/>
									<label class="form__label hide-dropdown" for="otpCheckbox1"><fmt:message key="LOGIN_LBL_GUESTCHKOUT" bundle="${storeText}" /></label>
							<%--</c:if>--%>
		      					<a class="signin--forgot-password modal-link" data-target="forgotPasswordModal" href="javascript:;"><fmt:message key="LOGIN_LINKTEXT_FRGT_PASSWD" bundle="${storeText}" /></a>
							</div>
							<div class="form__btn js-form-btn-signin">
								<button type="button" class="signin__btn-cta button-primary" onclick="javascript:setDeleteCartCookie(); GlobalLoginJS.deleteLoginCookies(); GlobalLoginJS.submitGLSignInForm('formValidation1','1');return false;"><fmt:message key="LOGIN_LBL_SIGN_IN" bundle="${storeText}" /></button>
								<button type="button" class="js-form-submit signin__btn-otp button-primary" onclick="javascript:guestCheckout.sendOtp(document.formValidation1);return false;"><fmt:message key="LOGIN_LBL_SEND_OTP" bundle="${storeText}" /></button>
								<button type="button" class="signin__btn-submit button-primary" onclick="javascript:guestCheckout.validateOtp(document.formValidation1);return false;"><fmt:message key="LOGIN_LBL_SUBMIT" bundle="${storeText}" /></button>
								
							 <div class="js-hide-show js-show-resend-otp">
						     	 <p id="otpresend">
						    	  <fmt:message key="LOGIN_MESG_WAIT_OTP" bundle="${storeText}" /> <a class="link-alternate js-resend-otp" onclick="javascript:guestCheckout.reSendOtp(document.formValidation1);return false;" title="Resend OTP"><strong><fmt:message key="LOGIN_LINKTEXT_RSND_OTP" bundle="${storeText}" /></strong></a>
						    	 </p>
						    </div>
							</div>
						</form>
						

						
			<%
						StoreConfigurationRegistry socialConfigVals = (StoreConfigurationRegistry) RegistryManager.singleton().getRegistry("StoreConfigurationRegistry");
						String socialEnabled = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Social.Enabled");
						pageContext.setAttribute("socialEnabled", socialEnabled);
						String fbAppId = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Social.Facebook.AppID.web.web");
						pageContext.setAttribute("fbAppId", fbAppId);
						String fbRedirectURL = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Social.Facebook.RedirectURL.web.web");
						pageContext.setAttribute("fbRedirectURL", fbRedirectURL);
						String gpAppId = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Social.Googleplus.AppID.web.web");
						pageContext.setAttribute("gpAppId", gpAppId);
						String gpRedirectURL = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Social.Googleplus.RedirectURL.web.web");
						pageContext.setAttribute("gpRedirectURL", gpRedirectURL);		
						
					  %>
					<c:if test="${!empty socialEnabled && socialEnabled == 'true'}">
						<div class="form__divider">
								<span class="form__divider--text"><fmt:message key="LOGIN_MESG_OR" bundle="${storeText}" /></span>
							</div>
						<div class="signin__btn-social">
							<a class="signin__btn-social--fb button-primary" onclick="javascript:DMAnalytics.events( DMAnalytics.Constants.Category.SocialSignIn,'Facebook' , document.title, 0,null ); GlobalLoginJS.setSocialLogonCookie('${isFromCheckout}');" 
							          href="http://www.facebook.com/dialog/oauth?client_id=${fbAppId}&redirect_uri=${fbRedirectURL}&scope=email&selectedMedia=Facebook"><i class="icon-facebook"></i> <fmt:message key="LOGIN_LINKTEXT_FB_SIGNIN" bundle="${storeText}" /></a>
							<a class="signin__btn-social--google button-primary" onclick="javascript:DMAnalytics.events( DMAnalytics.Constants.Category.SocialSignIn,'Google Plus' , document.title, 0,null ); GlobalLoginJS.setSocialLogonCookie('${isFromCheckout}');" 
									href="https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${gpAppId}&redirect_uri=${gpRedirectURL}&scope=email%20profile"><i class="icon-google"></i>  <fmt:message key="LOGIN_LINKTEXT_GP_SIGNIN" bundle="${storeText}" /></a>
						</div>
					 </c:if>			
					</div>
					</div>
					
				</div>
				<div class="col-xs-12 col-md-6 show-sm-down">
					<div class="blurb">
						<h2 class="blurb__title"><fmt:message bundle="${storeText}" key="LOGIN_MESG_TITLE_BENEFITS"/></h2>
						<div class="blurb__img">
							<img class="img-responsive"
								src="${staticServerHostPath}images/DMart/temp/login/signin_img.jpg" alt="Login">
						</div>

						<div class="blurb__content">
							<p><fmt:message bundle="${storeText}" key="LOGIN_MESG_SIDEBAR1"/></p>

							<p class="margin-reset"><fmt:message bundle="${storeText}" key="LOGIN_MESG_SIDEBAR2"/></p>
							<div class="blurb__content-left">
								<ul>
									<li><fmt:message bundle="${storeText}" key="LOGIN_SIDE_LIST1_1"/></li>
									<li><fmt:message bundle="${storeText}" key="LOGIN_SIDE_LIST1_2"/></li>
									<li><fmt:message bundle="${storeText}" key="LOGIN_SIDE_LIST1_3"/></li>
									<li><fmt:message bundle="${storeText}" key="LOGIN_SIDE_LIST1_4"/></li>
									<li><fmt:message bundle="${storeText}" key="LOGIN_SIDE_LIST1_5"/></li>
								</ul>
							</div>
							<div class="blurb__content-right">
								<ul>
									<li><fmt:message bundle="${storeText}" key="LOGIN_SIDE_LIST2_1"/></li>
									<li><fmt:message bundle="${storeText}" key="LOGIN_SIDE_LIST2_2"/></li>
									<li><fmt:message bundle="${storeText}" key="LOGIN_SIDE_LIST2_3"/></li>
									<li><fmt:message bundle="${storeText}" key="LOGIN_SIDE_LIST2_4"/></li>
								</ul>
							</div>

						</div>
					</div>


				</div>
			</div>
		</div>
	</div>
	
<div id="footerWrapper">
	<%out.flush();%>
	<c:import url="${env_jspStoreDir}Widgets/Footer/Footer.jsp"/>
	<%out.flush();%>
</div>

	
<script>
	dojo.addOnLoad(function() {
		<fmt:message bundle="${storeText}" key="ERR_OTP_EXPIRED" var="ERR_OTP_EXPIRED"/>
		MessageHelper.setMessage("ERR_OTP_EXPIRED", <wcf:json object="${ERR_OTP_EXPIRED}"/>);
		
		<fmt:message bundle="${storeText}" key="LOGIN_MESG_WAIT_OTP" var="LOGIN_MESG_WAIT_OTP"/>
		MessageHelper.setMessage("LOGIN_MESG_WAIT_OTP", <wcf:json object="${LOGIN_MESG_WAIT_OTP}"/>);
		
		<fmt:message bundle="${storeText}" key="ERR_OTP_EXPIRED_SHORT" var="ERR_OTP_EXPIRED_SHORT"/>
		MessageHelper.setMessage("ERR_OTP_EXPIRED_SHORT", <wcf:json object="${ERR_OTP_EXPIRED_SHORT}"/>);
		
		<fmt:message bundle="${storeText}" key="OTP_RESEND_STATUS_MESSAGE" var="OTP_RESEND_STATUS_MESSAGE"/>
		MessageHelper.setMessage("OTP_RESEND_STATUS_MESSAGE", <wcf:json object="${OTP_RESEND_STATUS_MESSAGE}"/>);
		
		populatePincodeInfoFromCookieInLogonForm();
		var orderId=$('#redirectionOrderId').val();
		if($('#formValidation1 #returnURL').val().indexOf('OrderDetailsView')>0){
			$('#guestOrderTrackModal').css('display','block');
			$('#guestOrderTrackModal #guestOrderId').val($('#redirectionOrderId').val());
		}
		});
</script>

</body>