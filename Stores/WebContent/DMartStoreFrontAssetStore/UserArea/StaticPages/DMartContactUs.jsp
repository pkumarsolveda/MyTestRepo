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
	<title><fmt:message bundle="${storeText}" key="MESSAGE_CONTACTUS_11"/></title>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="description" content="">
<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,user-scalable=no">

<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600" rel="stylesheet" type="text/css">

	<link rel="stylesheet" href="<c:out value="${jspStoreImgDir}${env_vfileStylesheet}"/>" type="text/css"/>
	
	<%@ include file="../../Common/CommonJSToInclude.jspf"%>
	<c:set var="pageGroup" value="Common" />
	<%@include file="../../Common/DMartCommonJSToInclude.jspf" %>
	<%--
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/CommonContextsDeclarations.js"/>"></script>
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/CommonControllersDeclaration.js"/>"></script>
	
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/ServicesDeclaration.js"/>"></script>
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/UserArea/LogonForm.js"/>"></script>
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/UserArea/AddressHelper.js"/>"></script>
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/UserArea/MyAccountDisplay.js"/>"></script>
	
	
	<c:if test="${empty B2BLogonFormJSIncluded}">
		<script type="text/javascript" src="<c:out value="${staticAssetContextRoot}${env_siteWidgetsDir}com.ibm.commerce.store.widgets.RegistrationForm/javascript/B2BLogonForm.js"/>"></script>
		<c:set var="B2BLogonFormJSIncluded" value="true" scope="request"/>
	</c:if>
	 --%>
	<script type="text/javascript">
		function popupWindow(URL) {
			window.open(URL, "mywindow", "status=1,scrollbars=1,resizable=1");
		}
		
		dojo.addOnLoad(function() {
			<fmt:message bundle="${storeText}" key="MESSAGE_EMAIL_SENT" var="MESSAGE_EMAIL_SENT"/>
			MessageHelper.setMessage("ERR_EMAIL_SENT", <wcf:json object="${ERR_EMAIL_SENT}"/>);
			
			<fmt:message bundle="${storeText}" key="MESSAGE_EMAIL_SENDING_FAILED_1" var="MESSAGE_EMAIL_SENDING_FAILED_1"/>
			MessageHelper.setMessage("MESSAGE_EMAIL_SENDING_FAILED_1", <wcf:json object="${MESSAGE_EMAIL_SENDING_FAILED_1}"/>);
			
			<fmt:message bundle="${storeText}" key="MESSAGE_EMAIL_SENDING_FAILED_2" var="MESSAGE_EMAIL_SENDING_FAILED_2"/>
			MessageHelper.setMessage("MESSAGE_EMAIL_SENDING_FAILED_2", <wcf:json object="${MESSAGE_EMAIL_SENDING_FAILED_2}"/>);
		});
		
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
			
	<%
		StoreConfigurationRegistry storeRegistry = (StoreConfigurationRegistry) RegistryManager.singleton().getRegistry("StoreConfigurationRegistry");
		String custEmail = StoreConfigurationRegistry.getSingleton().getValue(0, "DMartCustomerCareEmail");
		String custMobile = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.CustomerCare.PhoneNumber");
		String appRedirectTimeout = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Mobile.Deeplink.Redirect.Timeout");
		pageContext.setAttribute("customerCareEmail", custEmail);
		pageContext.setAttribute("customerCareMobile", custMobile);		
	%>
			<%--<script type="text/javascript" src="${jsAssetsDir}javascript/DMart/Utilities/dmartutilities.js"></script> --%>
			<div class="container">
  <div class="static-page contact-page">
    <h2 class="static-page--title"><fmt:message bundle="${storeText}" key="MESSAGE_CONTACTUS_8"/></h2>
    
    
    <div class="row">
      <div class="col-xs-12 col-md-6 col-lg-5">
		  <div id="messageDiv" style="display:none">
          	<label id="messageLable"><fmt:message bundle="${storeText}" key="MESSAGE_EMAIL_SENT"/></label>
          	
          </div>
        <div class="form">
          <h3 class="static-page--subtitle"><fmt:message bundle="${storeText}" key="MESSAGE_CONTACTUS_1"/></h3>
          <form name="contactUsForm" action="javascript:;" class="form__contact" method="post" id="formContactValidation" >
			<div class="form-control">
			  <label class="form__label required-field spacing-bottom-tiny" for="nameContact"><fmt:message bundle="${storeText}" key="MESSAGE_CONTACTUS_2"/></label>
			  <input class="form__input" name="nameContact" placeholder="Enter your name" id="nameContact" maxlength="" required autocomplete="off">
			</div>
			<div class="form-control">
  				<label class="form__label required-field spacing-bottom-tiny" for="emailContact"><fmt:message bundle="${storeText}" key="MESSAGE_CONTACTUS_3"/></label>
  				<input class="form__input" type="email" name="emailContact" placeholder="Enter your email address" id="emailContact" maxlength="" required autocomplete="off">
			</div>
            <div class="form-control">
              <label for="messageContact" class="form__label required-field"><fmt:message bundle="${storeText}" key="MESSAGE_CONTACTUS_4"/></label>
              <textarea class="form__input form-description" name="messageContact" id="messageContact" placeholder="Enter your message" required rows="5"></textarea>
            </div>

            <div class="form__btn">
              <button type="submit" class="js-form-submit button-primary" onclick="javascript:submitComment(document.contactUsForm);"><fmt:message bundle="${storeText}" key="MESSAGE_CONTACTUS_9"/></button>
            </div>

          </form>
          
        </div>
      </div>
      <div class="col-xs-12 col-md-6 col-lg-offset-1">
        <h3 class="static-page--subtitle"><fmt:message bundle="${storeText}" key="MESSAGE_CONTACTUS_5"/></h3>

        <address class="spacin-bottom-half address-field address-field--primary">
          <div class="address-field--contact-icon">
				<i class="icon-phone"></i>
          </div>
          <div class="address-field--contact-label">
            <h4 class="address-field--contact-title"><fmt:message bundle="${storeText}" key="MESSAGE_CONTACTUS_6"/></h4>
            <span>${customerCareMobile}</span>
          </div>
        </address>
        <address class="address-field address-field--secondary">
          <div class="address-field--contact-icon">
            <i class="icon-contact-mail"></i>
          </div>
          <div class="address-field--contact-label">
            <h4 class="address-field--contact-title"><fmt:message bundle="${storeText}" key="MESSAGE_CONTACTUS_7"/></h4>
            <span><a class="address-field--email" href="mailto:${customerCareEmail}" title="Mail to customerservice@dmartindia.com">${customerCareEmail}</a></span>
          </div>
        </address>
        <div class="address-field--tertiary">
          <h3 class="static-page--subtitle"><fmt:message bundle="${storeText}" key="MESSAGE_CONTACTUS_ADDRESS_1"/></h3>
          <address class="address-field">
            <fmt:message bundle="${storeText}" key="MESSAGE_CONTACTUS_ADDRESS_LINE_1"/><br>
            <fmt:message bundle="${storeText}" key="MESSAGE_CONTACTUS_ADDRESS_LINE_2"/><br>
            <fmt:message bundle="${storeText}" key="MESSAGE_CONTACTUS_ADDRESS_LINE_3"/><br>
            <fmt:message bundle="${storeText}" key="MESSAGE_CONTACTUS_ADDRESS_LINE_4"/><br>
            <strong><fmt:message bundle="${storeText}" key="MESSAGE_CONTACTUS_ADDRESS_LINE_5"/></strong> ${customerCareMobile} <br>
          </address>
        </div>
      </div>
    </div>
  </div>
</div>
<script language="javascript">
	function submitComment() {
		$('#messageDiv').hide();
		if($('#formContactValidation').valid()){
			sendContactUs(document.contactUsForm);
		}
	}
	dojo.addOnLoad(function(){
		$('.form input, .form textarea').on('focus',function(){
			$('#messageDiv').hide();
		});
	});
</script>			
			<div id="footerWrapper">
				<%out.flush();%>
				<c:import url="${env_jspStoreDir}Widgets/Footer/Footer.jsp"/>
				<%out.flush();%>
			</div>
		
		</div>
		
	</body>	
	


<!-- END ProductDisplay.jsp -->		
</html>