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
<%@ include file="../../Common/EnvironmentSetup.jspf" %>
<%@ include file="../../Common/CommonJSToInclude.jspf" %>

<!DOCTYPE HTML>
<html>
<!-- Begin Page -->			
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Error</title>
	<link rel="stylesheet" href="<c:out value="${jspStoreImgDir}${env_vfileStylesheet}"/>" type="text/css"/>
	<meta name="robots" content="noindex,nofollow" />
	<c:set var="pageGroup" value="ErrorPage" />
	<%@include file="../../Common/DMartCommonJSToInclude.jspf" %>
	<meta name="robots" content="noindex,nofollow" />


      
</head>
	<script type="text/javascript">

	</script>		
		
		
		
	<body>		
		<div id="page">
			<div class="header_wrapper_position" id="headerWidget">
			<c:set var="dmartGenericErrorPage" value="true" scope="request"/>
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
              <div class="error-notification-wrap margin-reset-top">
                <i class="icon-not-available error-notification-icon"></i>
              </div>
            </div>
            <div class="col-xs-12 col-md-9">
              <div class="error-notification-message">
                <h1 class="static-page--error-title">Oops.. We goofed up!</h1>
                <p class="static-page--error-description">We'll sort it out ASAP. PLEASE RETRY
                <br>
                <a href="${env_TopCategoriesDisplayURL}" style="text-transform:none" class="error__btn-cta button--block button-white" title="Continue Shopping">Continue Shopping</a></p>
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
		
		</div>
		
	</body>	
	


<!-- END ProductDisplay.jsp -->		
</html>