
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://commerce.ibm.com/base" prefix="wcbase" %>
<%@ taglib uri="flow.tld" prefix="flow" %>
<%@ include file="../../../Common/EnvironmentSetup.jspf" %>
<%@ include file="../../../Common/nocache.jspf" %>
<%@ taglib uri="http://commerce.ibm.com/foundation" prefix="wcf" %>             
<%@ taglib uri="http://commerce.ibm.com/coremetrics"  prefix="cm" %>
<%@ include file="../../../include/ErrorMessageSetup.jspf" %>

<c:set var="myAccountPage" value="true" scope="request"/>
<c:set var="hasBreadCrumbTrail" value="false" scope="request"/>
<c:set var="pageCategory" value="MyAccount" scope="request"/>

<fmt:message bundle="${storeText}" key="MO_ORDERDETAILS" var="contentPageName" scope="request"/>

<!DOCTYPE HTML>

<%--
 =================================================================
  Licensed Materials - Property of IBM

  WebSphere Commerce

  (C) Copyright IBM Corp. 2008, 2014 All Rights Reserved.

  US Government Users Restricted Rights - Use, duplication or
  disclosure restricted by GSA ADP Schedule Contract with
  IBM Corp.
 =================================================================
--%>
<!-- BEGIN OrderDetailDisplay.jsp -->
<html xmlns="http://www.w3.org/1999/xhtml" lang="${shortLocale}" xml:lang="${shortLocale}">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>
		<c:choose>
			<c:when test="${WCParam.isQuote eq true}">
				<fmt:message bundle="${storeText}" key='MO_MYQUOTES'/>
			</c:when>
			<c:otherwise>
				<fmt:message bundle="${storeText}" key='MY_ORDER_DETAILS_TITLE'/>
			</c:otherwise>
		</c:choose>
	</title>
	
	<link rel="stylesheet" href="<c:out value="${jspStoreImgDir}${env_vfileStylesheet}"/>" type="text/css"/> 
	<%@ include file="../../../Common/CommonJSToInclude.jspf"%>
	<%--<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/CommonContextsDeclarations.js"/>"></script>
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/CommonControllersDeclaration.js"/>"></script>
	
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/UserArea/MyAccountDisplay.js"/>"></script>
	<script type="text/javascript" src="<c:out value='${jsAssetsDir}javascript/CheckoutArea/Punchout.js'/>"></script>
	<script type="text/javascript" src="<c:out value='${jsAssetsDir}javascript/UserArea/MyAccountControllersDeclaration.js'/>"></script>
	
	<script src="${jsAssetsDir}javascript/DMart/OrderStatus/OrderStatusHelper.js"></script> --%>
	
	<%@ include file="../../../Common/CommonJSPFToInclude.jspf"%>
	<c:set var="pageGroup" value="OrderDetails"/>
	<%@ include file="../../../Common/DMartCommonJSToInclude.jspf"%>
	<%
		StoreConfigurationRegistry storeRegistry = (StoreConfigurationRegistry) RegistryManager.singleton().getRegistry("StoreConfigurationRegistry");
		String loginextURL = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Loginext.Endpoint");
		pageContext.setAttribute("loginextURL", loginextURL);
	%>
<script type="text/javascript">
	var loginextURL = ${loginextURL};
</script>
	
	<script type="text/javascript">
		dojo.addOnLoad(function() {
			/* MyAccountControllersDeclarationJS.setControllerURL("RecurringOrderChildOrdersDisplayController", "<c:out value='${RecurringOrderChildOrdersTableDetailsDisplayURL}'/>");
			MyAccountControllersDeclarationJS.setControllerURL("SubscriptionChildOrdersDisplayController", "<c:out value='${SubscriptionChildOrdersTableDetailsDisplayURL}'/>"); */
			<fmt:message bundle="${storeText}" key="MO_ORDER_CANCELED_MSG" var="MO_ORDER_CANCELED_MSG"/>
			<fmt:message bundle="${storeText}" key="MO_OrderStatus_X" var="MO_OrderStatus_X"/>
			MessageHelper.setMessage("MO_ORDER_CANCELED_MSG", <wcf:json object="${MO_ORDER_CANCELED_MSG}"/>);
			MessageHelper.setMessage("MO_OrderStatus_X", <wcf:json object="${MO_OrderStatus_X}"/>);<fmt:message bundle="${storeText}" key="MY_DASHBOARD_ORDERS_TAB_CHANGE_SLOT_SUCCESS" var="MY_DASHBOARD_ORDERS_TAB_CHANGE_SLOT_SUCCESS"/>	
			MessageHelper.setMessage("MY_DASHBOARD_ORDERS_TAB_CHANGE_SLOT_SUCCESS", <wcf:json object="${MY_DASHBOARD_ORDERS_TAB_CHANGE_SLOT_SUCCESS}"/>);
			<fmt:message bundle="${storeText}" key="MY_DASHBOARD_ORDERS_TAB_CHANGE_SLOT_FAILURE" var="MY_DASHBOARD_ORDERS_TAB_CHANGE_SLOT_FAILURE"/>	
			MessageHelper.setMessage("MY_DASHBOARD_ORDERS_TAB_CHANGE_SLOT_FAILURE", <wcf:json object="${MY_DASHBOARD_ORDERS_TAB_CHANGE_SLOT_FAILURE}"/>);
		});
	</script>
</head>
<body>

	<!-- Page Start -->
	<div id="page">

		<!-- Import Header Widget -->
		<div class="header_wrapper_position" id="headerWidget">
			<%out.flush();%>
			<c:import url = "${env_jspStoreDir}/Widgets/Header/Header.jsp" />
			<%out.flush();%>
		</div>
		<!-- Header Nav End -->
		<c:set var="orderIdentifier" value="${WCParam.orderId}" ></c:set>
		<c:set var="isTrackOrder" value="${WCParam.isTrackOrder}" ></c:set>
		<c:set var="orderStatusDetails" value="${WCParam.orderStatusDetails}" ></c:set>
		<c:set var="slotDetails" value="${WCParam.slotDetails}" ></c:set>
		
		<wcf:url var="MyOrdersBreadCrumbURL" value="AjaxLogonForm">
		  <wcf:param name="langId" value="${param.langId}" />
		  <wcf:param name="storeId" value="${param.storeId}" />
		  <wcf:param name="catalogId" value="${param.catalogId}" />
		   <wcf:param name="isBreadCrumb" value="true" />
		  <wcf:param name="myAcctMain" value="1" />
		</wcf:url>

<c:if test="${WCParam.isTrackOrder eq false}">
	<div class="container">
 	 <div class="row">
	   <div class="col-xs-12 col-md-6">
	   <c:if test="${userType != 'G'}">
		<ul class="breadcrumbs link-bordered">
  			<li><a href="${env_TopCategoriesDisplayURL}" title="Home"><fmt:message bundle="${storeText}" key="MY_DASHBOARD_BREADCRUMB_1"/></a></li>
  			<li><a href="${fn:escapeXml(MyOrdersBreadCrumbURL)}#my-account4" title="My Orders"><fmt:message bundle="${storeText}" key="MY_DASHBOARD_BREADCRUMB_2"/></a></li>
  			<li id="orderId">${WCParam.orderId}</li>
		</ul>
		</c:if>
	  </div>
    </div>
   </div>
</c:if>
		<!-- Main Content Start -->
		<div class="container" id="error-msg-container">
		  <div class="row">
		    <div class="col-xs-12">
		      <div class="alert alert-warning-bg js-alert-order" style="display:none;">
		        <strong><i class="icon-notification"></i><fmt:message key="ERROR_WARNING" bundle="${storeText}"/></strong>
		        	<a id="generic-error-section">
		        		
		        	<a>	
		        <a class="alert-close-cta js-cart-reject align-right alert-cross-pos" href="javascript:;" title="Close"><i class="icon-cta-close icon-cancel"></i></a>
		      </div>
		    </div>
		  </div>
		</div>
		
		<div id="OrderDetails">
			
		</div>
		
		<div id="cancelOrderModal" class="modal-dialog modal-dialog--clear-cart js-modal-dialog-esc">
		</div>
		<div id="dashboardSlotChange" class="modal-dialog modal-dialog--clear-cart js-modal-dialog-esc">
		</div>
		
		<!-- Main Content End -->			 
		
		<!-- Footer Start -->
		<div class="footer_wrapper_position">
			<%out.flush();%>
				<c:import url = "${env_jspStoreDir}/Widgets/Footer/Footer.jsp" />
			<%out.flush();%>
		</div>
		<!-- Footer End -->
	</div>
	<script type="text/javascript">
	var isTrackOrder = ${WCParam.isTrackOrder};
	var orderStatusDetails = '${WCParam.orderStatusDetails}';
	var slotDetails = '${WCParam.slotDetails}';
	if(isTrackOrder != false && isTrackOrder){
		$(document).on('dmart.topcatinfo.loaded',
			function() {
			orderStatusHelper.displayOrderDetail('OrderDetails',orderStatusDetails,slotDetails);
		});  
   }else{
   		$(document).on('dmart.topcatinfo.loaded',
			function() {
			DashBoardHelper.renderOrderDetails('OrderDetails',${orderIdentifier});
		}); 
	}
		
	</script>
	<flow:ifEnabled feature="Analytics"><cm:pageview/></flow:ifEnabled>
<%@ include file="../../../Common/JSPFExtToInclude.jspf"%> </body>
</html>
<!-- END OrderDetailDisplay.jsp -->
