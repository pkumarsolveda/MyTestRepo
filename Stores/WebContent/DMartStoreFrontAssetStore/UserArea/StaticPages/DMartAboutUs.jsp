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
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://commerce.ibm.com/base" prefix="wcbase" %>
<%@ taglib uri="http://commerce.ibm.com/foundation" prefix="wcf" %>  
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="flow.tld" prefix="flow" %>
<%@ taglib uri="http://commerce.ibm.com/coremetrics"  prefix="cm" %>
<%@ include file="../../Common/nocache.jspf" %>
<%@ include file="../../Common/EnvironmentSetup.jspf" %>

<!DOCTYPE HTML>
<html>
<!-- Begin Page -->			
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>About Us - DMart</title>
	<link rel="stylesheet" href="<c:out value="${jspStoreImgDir}${env_vfileStylesheet}"/>" type="text/css"/>
	
	<%@ include file="../../Common/CommonJSToInclude.jspf"%>
	<c:set var="pageGroup" value="Common" />
	<%@include file="../../Common/DMartCommonJSToInclude.jspf" %>
	<%--
	<%@ include file="../../include/ErrorMessageSetupBrazilExt.jspf" %>
	
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/CommonContextsDeclarations.js"/>"></script>
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/CommonControllersDeclaration.js"/>"></script>
	
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/ServicesDeclaration.js"/>"></script>
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/UserArea/LogonForm.js"/>"></script>
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/UserArea/AddressHelper.js"/>"></script>
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/UserArea/MyAccountDisplay.js"/>"></script>
	<c:if test="${isBrazilStore}"> 
		<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/UserArea/MyBrazilAccountDisplay.js"/>"></script>
	</c:if>

	<c:if test="${empty B2BLogonFormJSIncluded}">
		<script type="text/javascript" src="<c:out value="${staticAssetContextRoot}${env_siteWidgetsDir}com.ibm.commerce.store.widgets.RegistrationForm/javascript/B2BLogonForm.js"/>"></script>
		<c:set var="B2BLogonFormJSIncluded" value="true" scope="request"/>
	</c:if>
	 --%>
		<script type="text/javascript">
		function popupWindow(URL) {
			window.open(URL, "mywindow", "status=1,scrollbars=1,resizable=1");
		}
	</script>  

	<%@ include file="../../Common/CommonJSPFToInclude.jspf"%>
      
</head>
			
		
		
		
	<body>		
		<div id="page">
			<div class="header_wrapper_position" id="headerWidget">
				<%out.flush();%>
				<c:import url = "${env_jspStoreDir}/Widgets/Header/Header.jsp" />
				
				<%out.flush();%>
			</div>
			
			  <div class="container">
    <div class="static-page">
      <div class="row">
        
        <div class="col-md-12">
          <h2 class="static-page--title">About Us</h2>
          <h3 class="static-page--subtitle"> What is DMart?</h3>
          <p> DMart is India&#39;s largest online food and grocery store. With over 14,000 products and over a 1000 brands in our catalogue you will find everything you are looking for. Right from fresh Fruits and Vegetables, Rice and Dals, Spices and Seasonings to Packaged products, Beverages, Personal care products, Meats &#8211; we have it all.
          Choose from a wide range of options in every category, exclusively handpicked to help you find the best quality available at the lowest prices. Select a time slot for delivery and your order will be delivered right to your doorstep, anywhere in Bangalore, Mysore, Mumbai, Hyderabad, Pune, Chennai & Delhi. You can pay online using your debit / credit card or by cash / sodexo on delivery. </p>
          <p> We guarantee on time delivery, and the best quality!  </p>
          <h3 class="static-page--subtitle"> Why should I use DMart? </h3>
          <p> DMart allows you to walk away from the drudgery of grocery shopping and welcome an easy relaxed way of browsing and shopping for groceries. Discover new products and shop for all your food and grocery needs from the comfort of your home or office. No more getting stuck in traffic jams, paying for parking, standing in long queues and carrying heavy bags &#8211; get everything you need, when you need, right at your doorstep. Food shopping online is now easy as every product on your monthly shopping list, is now available online at DMart, India&#39;s best online grocery store.</p>
          <h3 class="static-page--subtitle"> Where do we operate? </h3>
          <p>We currently offer our services in Bangalore, Mysore , Hyderabad , Mumbai, Pune, Chennai & Delhi city limits.</p>
</div>
        
      </div>
    </div>
  </div>
			
			<div id="footerWrapper">
				<%out.flush();%>
				<c:import url="${env_jspStoreDir}Widgets/Footer/Footer.jsp"/>
				<%out.flush();%>
			</div>
		
		</div>
		
	</body>	
	


<!-- END ProductDisplay.jsp -->		
</html>