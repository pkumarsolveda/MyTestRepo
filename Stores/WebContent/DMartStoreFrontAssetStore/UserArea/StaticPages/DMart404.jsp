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
	<title>404 Page - DMart</title>
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
			      <div class="static-page--error">
			        <div class="row">
			          <div class="col-xs-12 col-md-9 static-page--error-center">
			            <div class="col-xs-12 col-md-3">
			              <div class="error-notification-wrap">
			                <i class="icon-404 error-notification-icon"></i>
			              </div>
			            </div>
			            <div class="col-xs-12 col-md-9">
			              <div class="error-notification-message">
			                <h1 class="static-page--error-title">Cannot find this page!!!</h1>
			                <p class="static-page--error-description">Sorry the page you were looking is not found.
			                <br>
			
			                <a href="http://localhost/webapp/wcs/stores/servlet/en/home" class="error__btn-cta button--block button-white" title="GO TO HOME PAGE">GO TO HOME PAGE</a></p>
			              </div>
			            </div>
			          </div>
			        </div>
			      </div>
			    </div>
			  </div
			
			
			
			
			
			
			
			
			<div id="footerWrapper">
				<%out.flush();%>
				<c:import url="${env_jspStoreDir}Widgets/Footer/Footer.jsp"/>
				<%out.flush();%>
			</div>
		
		</div>
		
	</body>	
	


<!-- END ProductDisplay.jsp -->		
</html>