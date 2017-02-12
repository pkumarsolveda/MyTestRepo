<%--
 =================================================================
  Licensed Materials - Property of IBM

  WebSphere Commerce

  (C) Copyright IBM Corp. 2011, 2014 All Rights Reserved.

  US Government Users Restricted Rights - Use, duplication or
  disclosure restricted by GSA ADP Schedule Contract with
  IBM Corp.
 =================================================================
--%>
<%@page import="com.ibm.commerce.foundation.internal.server.services.registry.StoreConfigurationRegistry"%>
<%@page import="com.ibm.commerce.registry.RegistryManager"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://commerce.ibm.com/base" prefix="wcbase" %>
<%@ taglib uri="http://commerce.ibm.com/foundation" prefix="wcf" %>  
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="flow.tld" prefix="flow" %>
<%@ taglib uri="http://commerce.ibm.com/coremetrics"  prefix="cm" %>
<%@ include file="Common/nocache.jspf" %>
<%@ include file= "Common/EnvironmentSetup.jspf" %>

<!DOCTYPE HTML>
<html xmlns:wairole="http://www.w3.org/2005/01/wai-rdf/GUIRoleTaxonomy#"
xmlns:waistate="http://www.w3.org/2005/07/aaa" lang="${shortLocale}" xml:lang="${shortLocale}">
		
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="robots" content="noindex,nofollow" />
	<title><fmt:message bundle="${storeText}"key="DMART_CART_TITLE"></fmt:message></title>		
	
	<link rel="stylesheet" href="<c:out value="${jspStoreImgDir}${env_vfileStylesheet}"/>" type="text/css"/>
	<%@ include file="Common/CommonJSToInclude.jspf"%>	
	<%@ include file="Common/CommonJSPFToInclude.jspf"%>      
	<c:set var="pageGroup" value="CartPage" />
	
	<%@include file="Common/DMartCommonJSToInclude.jspf" %>
</head>
<body>

<c:set var="cartEmpty" value="false"/>
<c:choose>
<c:when test="${CommandContext.user.userId != '-1002'}">
<wcf:rest var="order" url="store/{storeId}/cart/@self" scope="request">
		<wcf:var name="storeId" value="${WCParam.storeId}" encode="true"/>
</wcf:rest>
<c:if test="${empty order.orderItem}">
<c:set var="cartEmpty" value="true"/>
</c:if>
</c:when>
<c:otherwise>
<c:set var="cartEmpty" value="true"/>
</c:otherwise>
</c:choose>


<script type="text/javascript">

dojo.addOnLoad(function() {
    $(document).bind(
       'dmart.cache.validator.completed',
       function(e) {
			DMStorage.remove('OrderId');
			CartHelper.checkItemAvailabilityForStore = true;;
		    CartHelper.init();
		     //cartDisplay.displayCartSummary('cartSummary',cartData);
		    cartDisplay.clearCartModal('footerWrapper');
		    cartDisplay.displayMissedItems('missedItems',null);
		    cartDisplay.diplayPromotion('promotions','${jspStoreImgDir}');
	    });
	    <fmt:message bundle="${storeText}" key="_ERR_USER_NOT_LOGGED_IN" var="_ERR_USER_NOT_LOGGED_IN"/>
	    MessageHelper.setMessage("_ERR_USER_NOT_LOGGED_IN", <wcf:json object="${_ERR_USER_NOT_LOGGED_IN}"/>);
	    <fmt:message bundle="${storeText}" key="_ERR_MAX_QTY_ERROR" var="_ERR_MAX_QTY_ERROR"/>	    
		MessageHelper.setMessage("_ERR_MAX_QTY_ERROR", <wcf:json object="${_ERR_MAX_QTY_ERROR}"/>);
		<fmt:message bundle="${storeText}" key="_ERR_CART_UPDATE_ERROR" var="_ERR_CART_UPDATE_ERROR"/>
     	MessageHelper.setMessage("_ERR_CART_UPDATE_ERROR", <wcf:json object="${_ERR_CART_UPDATE_ERROR}"/>);
		
});
</script>
			
<jsp:useBean id="contentFormatMap" class="java.util.LinkedHashMap" type="java.util.Map"/>
<jsp:useBean id="contentTextMap" class="java.util.LinkedHashMap" type="java.util.Map"/>
<c:set var="currentRowCount" value="0" />
<div id="page">
<div id="grayOut"></div>
<div class="headerWrapper">
	<%out.flush();%>
		<c:import url = "${env_jspStoreDir}/Widgets/Header/Header.jsp" />				
	<%out.flush();%>
</div>

<input type="hidden" name="listId" id="listId" value='${WCParam.listId}' />
<div class="container <c:if test="${cartEmpty eq true}">hide</c:if>" id="error-msg-container">
  <div class="row">
    <div class="col-xs-12">
      <div class="alert alert-warning-bg js-alert-order" style="display:none;">
        <strong><i class="icon-notification"></i> <fmt:message bundle="${storeText}"key="CART_NOTE"></fmt:message></strong>
        	<span id="generic-error-section">
        		
        	</span>
        <a class="alert-close-cta js-cart-reject align-right alert-cross-pos" href="javascript:;" title="Close"><i class="icon-cta-close icon-cancel"></i></a>
      </div>
    </div>
  </div>
</div>


<div class="container  <c:if test="${cartEmpty eq false}">hide</c:if>">
    <div class="row">
      <div class="col-xs-12">
      <div class="empty-cart">
        <p><fmt:message bundle="${storeText}"key="CART_EMPTY_MESSAGE1"></fmt:message></p>
        <p>
          <a href="javascript:;" class="empty-cart--cta button-white" title="Continue Shopping"><fmt:message bundle="${storeText}"key="BUTTON_CONTINUE"></fmt:message></a>
        </p>
      </div>
      </div>
    </div>
  </div>


  <div class="container <c:if test="${cartEmpty eq true}">hide</c:if>">
    <div class="row">
      <div class="col-md-8" id="cartContainer">
		<%-- Call the REST service to get the data to display in the e-Marketing Spot --%>
			<wcf:rest var="eSpotDatasRoot" url="/store/{storeId}/espot/{name}" format="json" >
				<wcf:var name="storeId" value="${storeId}" encode="true"/>
				<wcf:var name="name" value="DMartCartOffers" encode="true"/>
	            <%-- the name of the e-Marketing Spot --%>
	            <wcf:param name="DM_EmsName" value="DMartCartOffers" />	
	            <wcf:param name="DM_contextPath" value="${env_contextAndServletPath}" />
	            <wcf:param name="DM_imagePath" value="${requestScope.jspStoreImgDir}" />
	 		</wcf:rest>
			<c:if test="${!empty eSpotDatasRoot.MarketingSpotData[0]}" >
				<c:set  var="eSpotDatas" value="${eSpotDatasRoot.MarketingSpotData[0]}"/>
			</c:if>	
	 <wcf:eMarketingSpotCache marketingSpotDataJSON="${eSpotDatas}" contentDependencyName="contentId" />
	 <c:forEach var="eSpotData" items="${eSpotDatas.baseMarketingSpotActivityData}" varStatus="status3">
	 	 <c:if test='${eSpotData.baseMarketingSpotDataType eq "MarketingContent"}'>
	 	 	 <c:if test="${eSpotData.contentFormatName == 'Text'}"> 
	 	 	 	<c:set target="${contentFormatMap}" property="${currentRowCount}" value="Text" />
	 	 	 	<c:set target="${contentTextMap}" property="${currentRowCount}" value="${eSpotData.marketingContentDescription[0].marketingText}"/>
	 	 	 </c:if>
	 	 </c:if>
	 </c:forEach>
	 <c:if test="${!empty contentFormatMap}">
	 	<c:forEach var="contentFormat" items="${contentFormatMap}">
			<c:set var="key" value="${contentFormat.key}"/>
			<c:forEach items="${contentFormatMap}" var="contentFormat">
		 		<c:if test="${contentFormatMap[key] == 'Text'}">
					${contentTextMap[key]}
				</c:if>
		 	</c:forEach>
		</c:forEach>
	 </c:if>
      <div class="cart-no-items-div" style="display:none">
		    <p class="alert alert-danger"><fmt:message bundle="${storeText}"key="CART_EMPTY_MESSAGE2"></fmt:message></p>
		</div>
      <h1 class="h2 cart-title" id="cart-title-cartpage"><fmt:message bundle="${storeText}"key="CART_BREADCRUMB1"></fmt:message> <span class="cart-subtitle"><span class="cart-subtitle--count"></span> <fmt:message bundle="${storeText}"key="CART_COUNT_UNIT"></fmt:message></span></h1>
      <div class="cart-details" id="cart-details-cartpage">
          <div class="cart-details--head">
            <div class="row">
              <div class="col-md-1"><h2 class="cart-details--heading"><fmt:message bundle="${storeText}"key="CART_HEADING1"></fmt:message></h2></div>
              <div class="col-md-5"><h2 class="cart-details--heading padding-reset"><fmt:message bundle="${storeText}"key="CART_HEADING2"></fmt:message></h2></div>
              <div class="col-md-2"><h2 class="cart-details--heading padding-reset"><fmt:message bundle="${storeText}"key="CART_HEADING3"></fmt:message></h2></div>
              <div class="col-md-3"><h2 class="cart-details--heading padding-reset"><fmt:message bundle="${storeText}"key="CART_HEADING4"></fmt:message></h2></div>
            </div>
          </div>
          
          <div class="cart-details__item" id="cartDetails">
          
          </div>
      	  </div>
      <div class="my-cart-cta" id="my-cart-cta-cartpage">
          <%
			StoreConfigurationRegistry scfRegistry = (StoreConfigurationRegistry) RegistryManager.singleton().getRegistry("StoreConfigurationRegistry");
			String continueShoppingLink = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.ContinueShoppingLink");
			pageContext.setAttribute("continueShoppingLink", continueShoppingLink);
			String cartMinThreshold = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.CartMinThreshold");
			pageContext.setAttribute("cartMinThreshold", cartMinThreshold);
		  %>
		  <input type="hidden" name="cartMinThreshold" value="${cartMinThreshold}" id="cartMinThreshold" />
		  <wcf:url var="ContinueShoppingURL" value="${continueShoppingLink}">
			<wcf:param name="langId" value="-1" />
			<wcf:param name="storeId" value="${storeId}" />
			<wcf:param name="catalogId" value="${catalogId}" />
		  </wcf:url>
      	  <form method="post" id="continueShoppingForm" 
					action="<c:out value="${env_TopCategoriesDisplayURL}"/>" novalidate>
	          <a href="javascript:;" class="button-white clear-cart-cta-btn" title="Clear Cart"><i class="icon icon-delete"></i></a>
	          <a href="javascript:;" class="button-white" id="continueShopping"><fmt:message bundle="${storeText}"key="BUTTON_CONTINUE"></fmt:message></a>
          </form>
      </div>
      </div>
      
      <div class="col-md-4" id="cartSummary">
       
      </div>
      </div>
      </div>
    <div class="container <c:if test="${cartEmpty eq true}">hide</c:if>">
    <div class="row">
      <div class="col-xs-12">
        <div class="missed-items" id="missedItems">
          
        </div>
      </div>
    </div>
  	</div>
  	<div id="ShareCartModal" class="modal-dialog js-modal-dialog-esc" style="display: none;">
  <div class="modal-dialog__content modal-dialog__content-small">
    <a href="javascript:;" title="Close" class="modal-dialog__close">X</a>
    <div class="modal-dialog__header">
      <h4 class="modal-dialog__header-title"><fmt:message bundle="${storeText}"key="CART_SUCCESS"></fmt:message></h4>
    </div>
    <div class="modal-dialog__body">
      <div>
        <p class="alert-details" id="sharecartsuccess"> <i class="icon-type-success icon-checkmark"></i> <fmt:message bundle="${storeText}"key="CART_SHARE_SUCCESS_MESSAGE"></fmt:message></p>

        
        <p class="alert-details" id="sharecartfail" style="display:none;"> <i class="icon-type-failed icon-notification"></i> <fmt:message bundle="${storeText}"key="CART_SHARE_FAIL_MESSAGE"></fmt:message></p>
      </div>
    </div>
  </div>
</div>
  	<div id='promotions'></div>
     
			<div id="footerWrapper">
				<%out.flush();%>
				<c:import url="${env_jspStoreDir}Widgets/Footer/Footer.jsp"/>
				<%out.flush();%>
			</div>
		</div>
	
	</body>	
</html>
