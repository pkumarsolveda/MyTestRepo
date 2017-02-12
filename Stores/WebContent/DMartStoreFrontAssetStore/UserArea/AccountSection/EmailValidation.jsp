<!DOCTYPE html>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ include file="../../Common/EnvironmentSetup.jspf"%>
<%@ include file="../../Common/CommonJSToInclude.jspf"%>


<%
	StoreConfigurationRegistry scfRegistry = (StoreConfigurationRegistry) RegistryManager.singleton().getRegistry("StoreConfigurationRegistry");
	String continueShoppingLink = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.ContinueShoppingLink");
	pageContext.setAttribute("continueShoppingLink", continueShoppingLink);
	String cartMinThreshold = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.CartMinThreshold");
	pageContext.setAttribute("cartMinThreshold", cartMinThreshold);
%>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport"
	content="width=device-width,initial-scale=1,minimum-scale=1,user-scalable=no">
<title><fmt:message bundle="${storeText}" key="EMAIL_VERIFICATION_PAGE_TITLE"/></title>
<meta name="description" content="<c:out value="${metaDescription}"/>" />
<meta name="keywords" content="<c:out value="${metaKeyword}"/>" />
<meta name="pageIdentifier" content="HomePage" />
<meta name="pageId" content="<c:out value="${page.pageId}"/>" />
<meta name="pageGroup" content="content" />
<link rel="canonical"
	href="<c:out value="${env_TopCategoriesDisplayURL}"/>" />

<!--Main Stylesheet for browser -->
<link rel="stylesheet" href="${jspStoreImgDir}${env_vfileStylesheet}"
	type="text/css" media="screen" />

<c:set var="pageGroup" value="EmailValidation" />
<%@include file="../../Common/DMartCommonJSToInclude.jspf" %>

<!-- Import Header Widget -->
<div id="headerWidget">
	<%
		out.flush();
	%>
	<c:import url="${env_jspStoreDir}/Widgets/Header/Header.jsp" />
	<%
		out.flush();
	%>
</div>
<meta name="robots" content="noindex,nofollow" />
<!-- Header Nav End -->

</head>

<body>
	<%--<script src="${jsAssetsDir}javascript/DMart/Utilities/dmartutilities.js" ></script> --%> 
	
	<%-- Displays the user messages - Start --%>
	<div class="container" id="error-msg-container">
	  <div class="row">
	    <div class="col-xs-12">
	      <div class="alert alert-warning-bg js-alert-order" style="display:none;">
	        <strong><i class="icon-notification"></i><fmt:message key="ERROR_WARNING" bundle="${storeText}"/></strong>
	        	<span id="generic-error-section">
	        		
	        	</span>	
	        <a class="alert-close-cta js-cart-reject align-right alert-cross-pos" href="javascript:;" title="Close"><i class="icon-cta-close icon-cancel"></i></a>
	      </div>
	    </div>
	  </div>
	</div>
	<%-- Displays the user messages - end --%>
	
	<div class="container">
		<input id="dmUserId" type="hidden" value="${dmUserId}" name="dmUserId"/>
		<c:set var="valResult" value="${validationResult}" />
		<div class="email-verification">
		  <div class="email-verification-panel">
			<div class="row">
			  <div class="col-xs-12 col-sm-2 col-md-3">
				<img class="img-responsive email-verification-img" src="${jspStoreImgDir}images/DMart/email-verification.svg">
			  </div>
			  <div class="col-xs-12 col-sm-10 col-md-9">
		  		<wcf:url var="ContinueShoppingURL" value="${continueShoppingLink}">
					<wcf:param name="langId" value="-1" />
					<wcf:param name="storeId" value="${storeId}" />
					<wcf:param name="catalogId" value="${catalogId}" />
				</wcf:url>
			  	
				<h2 class="email-verification-title"><fmt:message bundle="${storeText}" key="EMAIL_VERIFICATION_TITLE"/></h2>
				<c:if test="${valResult == 'Valid'}">
					<h3 class="email-verification-title-secondary"> <fmt:message bundle="${storeText}" key="EMAIL_VERIFICATION_SUCCESS"/> </h3>
					<br/><br/>
					<div class="clearfix">
						<form method="post" id="continueShoppingForm" action="<c:out value="${env_TopCategoriesDisplayURL}"/>" novalidate>
							<a class="button-white button--block countinue-shopping-button email-verification-button countinue-cta" href="javascript:;" id="continueShopping">Continue Shopping</a>
						</form>
					</div>
				</c:if>
				
				<c:if test="${valResult == 'Expired'}">
					<h3 class="email-verification-title-secondary"> <fmt:message bundle="${storeText}" key="EMAIL_VERIFICATION_EXPIRED"/> </h3>
					<br/><br/>
					<div class="clearfix">
						<a class="button-white button--block countinue-shopping-button email-verification-button countinue-cta" href="javascript:;" id="resendEmailbutton">Resend Email</a>
					</div>
				</c:if>
				
				<c:if test="${valResult == 'Existing'}">
					<h3 class="email-verification-title-secondary"> <fmt:message bundle="${storeText}" key="EMAIL_VERIFICATION_EXISTING"/> </h3>
					<br/><br/>
					<div class="clearfix">
						<form method="post" id="continueShoppingForm" action="<c:out value="${env_TopCategoriesDisplayURL}"/>" novalidate>
							<a class="button-white button--block countinue-shopping-button email-verification-button countinue-cta" href="javascript:;" id="continueShopping">Continue Shopping</a>
						</form>
					</div>
				</c:if>
				
			  </div>
			</div>
		  </div>
		</div>
		
		<%-- Displays the EMSpots - start --%>
		<div class="js-accordion-tabs-recommanded" id="emailValidationPage">
		  <div class="no-border-tabs recommended-products">
		  		<input id="recommendationProdCount" type="hidden" value="" /> 
				<input id="upsellProdCount" type="hidden" value="" />
			    <div class="carousel-navigation" ><span class="countClass"></span>
			      <a href="#" class="flex-prev"><i class="icon-caret-left"></i></a>
			      <a href="#" class="flex-next"><i class="icon-caret-right"></i></a>
			    </div>
			    <ul class="resp-tabs-list clearfix hor_1" id="headerId"> 
			  	<li id="upSellHead" data-type="upSellHead"  onclick="productsRecommendation.renderPageCount(this.id)"><fmt:message bundle="${storeText}" key="EMAIL_VERIFICATION_MOST_POPULAR_TITLE"/></li>
			  	<li id="recommHead" data-type="recommend" onclick="productsRecommendation.renderPageCount(this.id)"><fmt:message bundle="${storeText}" key="EMAIL_VERIFICATION_OTHER_ITEMS_TITLE"/></li>
			    </ul>
			    <div class="resp-tabs-container hor_1" id="prodRecommendations">
			    </div>
			</div>
		</div>
		<%-- Displays the EMSpots - end --%>

	</div>

	<!-- Import Footer Widget -->
	<div id="footerWrapper">
		<%
			out.flush();
		%>
		<c:import url="${env_jspStoreDir}Widgets/Footer/Footer.jsp" />
		<%
			out.flush();
		%>
	</div>
	<!-- Import Footer Widget end-->
	
	<script>
		dojo.addOnLoad(function() {
			<fmt:message bundle="${storeText}" key="EMAIL_VERIFICATION_RESEND" var="EMAIL_VERIFICATION_RESEND"/>
			MessageHelper.setMessage("EMAIL_VERIFICATION_RESEND", <wcf:json object="${EMAIL_VERIFICATION_RESEND}"/>);
			
			<fmt:message bundle="${storeText}" key="GENERIC_ERROR_MESSAGE" var="GENERIC_ERROR_MESSAGE"/>
			MessageHelper.setMessage("GENERIC_ERROR_MESSAGE", <wcf:json object="${GENERIC_ERROR_MESSAGE}"/>);
			fetchEmailVerificationPageProducts();
			
		});	
		
		$( document ).ready(function() {
        	var count1  = $('#recommendationProdCount').val();
			var count2  = $('#upsellProdCount').val();
			if(count1 <1 && count2 <1){
				$('#emailValidationPage').hide();
			}
    	});
		
	</script>
</body>
