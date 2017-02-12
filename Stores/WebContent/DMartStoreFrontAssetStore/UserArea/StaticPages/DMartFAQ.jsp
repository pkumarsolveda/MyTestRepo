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
	<title>FAQs - DMart</title>
	
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,user-scalable=no">
	
	<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600" rel="stylesheet" type="text/css">
	
	
	<link rel="stylesheet" href="/wcsstore/DMartStoreFrontAssetStore/css/common1_1.css" type="text/css"/
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
  <div class="static-page static-page--faq">
    <div class="row">
      <div class="col-xs-12">
        <div class="faq-page">
          <h2 class="static-page--title">Frequently Asked Questions</h2>
          <div class="faq-panel js-accordion-panel">
            <h3 class="faq-title js-faq-section-data">
              <a href="javascript:;">
                  <fmt:message bundle="${storeText}" key="FAQ_QUESTION_1"></fmt:message>
			<i class="icon-caret-down"></i>
              </a>
            </h3>
            <ul class="faq-content js-accordion-content">
            <fmt:message bundle="${storeText}" key="FAQ_ANSWER_1"></fmt:message>
            </ul>
          </div>
          <div class="faq-panel js-accordion-panel">
            <h3 class="faq-title js-faq-section-data">
              <a href="javascript:;">
                  <fmt:message bundle="${storeText}" key="FAQ_QUESTION_2"></fmt:message>
			<i class="icon-caret-down"></i>
              </a>
            </h3>
            <ul class="faq-content js-accordion-content">
            <fmt:message bundle="${storeText}" key="FAQ_ANSWER_2"></fmt:message>
            </ul>
          </div>
          <div class="faq-panel js-accordion-panel">
            <h3 class="faq-title js-faq-section-data">
              <a href="javascript:;">
                  <fmt:message bundle="${storeText}" key="FAQ_QUESTION_3"></fmt:message>
			<i class="icon-caret-down"></i>
              </a>
            </h3>
            <ul class="faq-content js-accordion-content">
            <fmt:message bundle="${storeText}" key="FAQ_ANSWER_3"></fmt:message>
            </ul>
          </div>
          <div class="faq-panel js-accordion-panel">
            <h3 class="faq-title js-faq-section-data">
              <a href="javascript:;">
                  <fmt:message bundle="${storeText}" key="FAQ_QUESTION_4"></fmt:message>
			<i class="icon-caret-down"></i>
              </a>
            </h3>
            <ul class="faq-content js-accordion-content">
            <fmt:message bundle="${storeText}" key="FAQ_ANSWER_4"></fmt:message>
            </ul>
          </div>
          <div class="faq-panel js-accordion-panel">
            <h3 class="faq-title js-faq-section-data">
              <a href="javascript:;">
                  <fmt:message bundle="${storeText}" key="FAQ_QUESTION_5"></fmt:message>
			<i class="icon-caret-down"></i>
              </a>
            </h3>
            <ul class="faq-content js-accordion-content">
            <fmt:message bundle="${storeText}" key="FAQ_ANSWER_5"></fmt:message>
            </ul>
          </div>
          <div class="faq-panel js-accordion-panel">
            <h3 class="faq-title js-faq-section-data">
              <a href="javascript:;">
                  <fmt:message bundle="${storeText}" key="FAQ_QUESTION_6"></fmt:message>
			<i class="icon-caret-down"></i>
              </a>
            </h3>
            <ul class="faq-content js-accordion-content">
            <fmt:message bundle="${storeText}" key="FAQ_ANSWER_6"></fmt:message>
            </ul>
          </div>
          <div class="faq-panel js-accordion-panel">
            <h3 class="faq-title js-faq-section-data">
              <a href="javascript:;">
                  <fmt:message bundle="${storeText}" key="FAQ_QUESTION_7"></fmt:message>
			<i class="icon-caret-down"></i>
              </a>
            </h3>
            <ul class="faq-content js-accordion-content">
            <fmt:message bundle="${storeText}" key="FAQ_ANSWER_7"></fmt:message>
            </ul>
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
		
		
<script>
dojo.addOnLoad(function() {
	 $(document).on('click', '.js-faq-section-data', function() {
      if(!$(this).hasClass('active')) {

        $('.js-faq-section-data').removeClass('active');
        $('.js-faq-section-data i').removeClass('icon-caret-up');
        $('.js-accordion-panel .js-accordion-content').slideUp();

        $(this).find('i').addClass('icon-caret-up');
        $(this).addClass('active');
        $(this).parents('.js-accordion-panel').find('.js-accordion-content').toggleClass('active').slideDown();
      }
      else {
        $('.js-faq-section-data').removeClass('active');
        $('.js-faq-section-data i').removeClass('icon-caret-up');
        $('.js-accordion-panel .js-accordion-content').slideUp();
      }
    });
	
});
</script>
		
    
	</body>	
	


<!-- END DMartFAQ.jsp -->		
</html>