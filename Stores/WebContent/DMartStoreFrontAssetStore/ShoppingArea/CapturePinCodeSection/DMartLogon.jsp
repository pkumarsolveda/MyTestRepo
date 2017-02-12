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


<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><c:out value="${pageTitle}"/></title>
<meta name="description" content="<c:out value="${metaDescription}"/>"/>
<meta name="keywords" content="<c:out value="${metaKeyword}"/>"/>
<meta name="pageIdentifier" content="HomePage"/>
<meta name="pageId" content="<c:out value="${page.pageId}"/>"/>
<meta name="pageGroup" content="content"/>	
<link rel="canonical" href="<c:out value="${env_TopCategoriesDisplayURL}"/>" />
<link rel="stylesheet" href="${jspStoreImgDir}${env_vfileStylesheet}" type="text/css" media="screen"/>
<c:if test="${b2bStore eq 'true'}">
	<c:if test="${userType =='G'}">
		<c:set var="hideHeader" value="true" />
	</c:if>
</c:if>
<c:set var="pageGroup" value="LoginPage" />
<%@include file="../../../Common/DMartCommonJSToInclude.jspf" %>

<div id="headerWidget">
	<%out.flush();%>
		<c:import url="${env_jspStoreDir}/Widgets/Header/Header.jsp" />
	<%out.flush();%>
</div>
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
		<div class="container">
			<div class="row">
				<div class="col-xs-12 col-md-6">
					<div class="blurb">
						<h2 class="blurb__title">Benefits of Sign In</h2>
						<div class="blurb__img">
							<img class="img-responsive"
								src="${jspStoreImgDir}/images/DMart/temp/login/signin_img.jpg" alt="Sign In">
						</div>

						<div class="blurb__content">
							<p>While you can shop without signing-in, here are some of the reasons why we recommend you Sign-in before you start shopping. When you are signed-in, you can: </p>

							<!-- <p class="margin-reset">DMart offers a wide section of
								products in the following categories:</p> -->
							<div>
								<ul>
									<li>View all your past purchases under "My Order" along with dates and amounts with the option to re-order.</li>
									<li>Add frequently bought items to "My list" and enjoy a faster shopping experience.</li>
									<li>Save multiple addresses and also indicate your preferred address to speed up the checkout process.</li>
									<li>You can quickly place an order using previous orders from "Shop from Your Previous Order" section.</li>
								</ul>
							</div>
							<!-- <div class="blurb__content-right">
								<ul>
									<li>Toiletries and Beauty Products</li>
									<li>Kitchenware</li>
									<li>Toys and Games</li>
									<li>Home Appliances</li>
								</ul>
							</div> -->

						</div>
					</div>


				</div>
				<div class="col-xs-12 col-md-6">
					<div class="form">
						<h2 class="form__title">Sign In</h2>
						<form class="form__signin" action="javascript:;" method="post"
							id="formValidation1" name="formValidation1" novalidate>
							<input type="hidden" name="storeId"
								value="<c:out value="${WCParam.storeId}"/>"/>
							<input type="hidden" name="catalogId"
								value="<c:out value="${WCParam.catalogId}"/>"/>
							<input type="hidden" name="reLogonURL"
								value="<c:out value="${reLogonURL}"/>"/>
							<c:choose>
								<c:when
									test="${(!empty logonId) && (!empty validationCode) && (empty WCParam.errorMessage)}">
									<input type="hidden" name="myAcctMain"
										value="<c:out value="1"/>" />
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
							<input type="hidden" name="previousPage" value=""/>
							<input type="hidden" name="returnPage"
								value="<c:out value="${returnPage}"/>"/>
							<input type="hidden" name="rememberMe" value="true"/>


            
            <input type="hidden" name="pinCodeNewLogin" value="" id="pinCodeNewLogin"/>
            <input type="hidden" name="storeIdNewLogin" value="" id="storeIdNewLogin"/>
            
							<c:if test="${!empty nextUrl}">
								<input type="hidden" name="nextUrl"
									value="<c:out value="${nextUrl}"/>" />
							</c:if>
							<c:choose>
								<c:when test="${returnPage eq 'quickcheckout'}">
									<input type="hidden" name="URL"
										value="<c:out value='${orderMove}&getCart=N' />"/>
								</c:when>
								<c:otherwise>
									<c:choose>
										<c:when test="${!empty URL}">
											<input type="hidden" name="URL"
												value="<c:out value='${URL}'/>&getCart=N"/>
										</c:when>
										<c:otherwise>
											<input type="hidden" name="URL"
												value="<c:out value="${orderMove}"/>&getCart=N"/>
										</c:otherwise>
									</c:choose>
								</c:otherwise>
							</c:choose>

							<div class="form-control">
								<label for="logonId"
									class="form__label required-field spacing-bottom-tiny">Mobile
									Number</label>
								<div class="form__input--group">
									<span class="form__input-prefix">+91</span> <input type="tel"
										required maxlength="10" placeholder="9999999999"
										id="mobileNumber" name="logonId" class="form__input">
								</div>
							</div>

							<div class="js-signin-password">
								<div class="form-control">
									<label class="form__label required-field spacing-bottom-tiny"
										for="logonPassword">Password</label> <input
										class="form__input" type="password" name="logonPassword"
										placeholder="" maxlength="" required autocomplete="off">
								</div>
							</div>

							<div class="signin__alternate form__control--pull-up">
								<a class="signin--forgot-password modal-link"
									data-target="forgotPasswordModal" href="javascript:;">Forgot
									Password?</a>
							</div>

							<div class="form__btn js-form-btn-signin">
								<button type="button" class="signin__btn-cta button-primary" onclick="javascript:setDeleteCartCookie(); GlobalLoginJS.deleteLoginCookies(); GlobalLoginJS.submitGLSignInForm('formValidation1','');return false;">Sign
									In</button>
								<button type="submit"
									class="js-form-submit signin__btn-otp button-primary">Send
									OTP</button>
								<button type="submit" class="signin__btn-submit button-primary">Submit</button>
							</div>

							<div class="signin__register-link">
								<span>New Customer?</span> <a href="../registration/">Register</a>
							</div>
						</form>

					<%
						StoreConfigurationRegistry scfRegistry = (StoreConfigurationRegistry) RegistryManager.singleton().getRegistry("StoreConfigurationRegistry");
						String socialEnabled = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Social.Enabled");
						pageContext.setAttribute("socialEnabled", socialEnabled);
						String fbRedirectURL = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Social.Facebook.RedirectURL.web.web");
						pageContext.setAttribute("fbRedirectURL", fbRedirectURL);
						String gpAppId = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Social.Googleplus.AppID.web.web");
						pageContext.setAttribute("gpAppId", gpAppId);
						String gpRedirectURL = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Social.Googleplus.RedirectURL.web.web");
						pageContext.setAttribute("gpRedirectURL", gpRedirectURL);		
						
					  %>
					  <c:if test="${!empty socialEnabled && socialEnabled == 'true'}">
					    <div class="form__divider">
							<span class="form__divider--text">OR</span>
						</div>
					  
					  	<div class="signin__btn-social">
							<a class="signin__btn-social--fb button-primary" href="http://www.facebook.com/dialog/oauth?client_id=${fbAppId}&redirect_uri=${fbRedirectURL}&scope=email&selectedMedia=Facebook"><i class="icon-facebook"></i>Signin With Facebook</a>
							<a class="signin__btn-social--google button-primary" href="https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${gpAppId}&redirect_uri=${gpRedirectURL}&scope=email%20profile"><i class="icon-google"></i> Sign In with Google+</a>
						</div>
					  </c:if>						
					</div>

				</div>
			</div>
		</div>
	</div>
</body>