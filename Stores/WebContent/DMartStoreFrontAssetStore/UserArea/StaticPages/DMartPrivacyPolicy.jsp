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
	<title>Privacy Policy - DMart</title>
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
          <h2 class="static-page--title">Privacy Policy</h2>
          <h3 class="static-page--subtitle">Personal Information</h3>
          <p> DMart is the licensed owner of the brand dmart.com and the website dmart.com (&#8220;The Site&#8220;) from DMart. DMart respects your privacy. This Privacy Policy provides succinctly the manner your data is collected and used by DMart on the Site. As a visitor to the Site/ Customer you are advised to please read the Privacy Policy carefully. By accessing the services provided by the Site you agree to the collection and use of your data by DMart in the manner provided in this Privacy Policy.  </p>

          <h3 class="static-page--subtitle"> What information is, or may be, collected form you? </h3>
          <p> As part of the registration process on the Site, DMart may collect the following personally identifiable information about you: Name including first and last name, alternate email address, mobile phone number and contact details, Postal code, Demographic profile (like your age, gender, occupation, education, address etc.) and information about the pages on the site you visit/access, the links you click on the site, the number of times you access the page and any such browsing information. </p>

          <h3 class="static-page--subtitle"> How do we Collect the Information ? </h3>
          <p>DMart will collect personally identifiable information about you only as part of a voluntary registration process, on-line survey or any combination thereof. The Site may contain links to other Web sites. DMart is not responsible for the privacy practices of such Web sites which it does not own, manage or control. The Site and third-party vendors, including Google, use first-party cookies (such as the Google Analytics cookie) and third-party cookies (such as the DoubleClick cookie) together to inform, optimize, and serve ads based on someone's past visits to the Site</p>

          <h3 class="static-page--subtitle"> How is information used ? </h3>
          <p>DMart will use your personal information to provide personalized features to you on the Site and to provide for promotional offers to you through the Site and other channels. DMart will also provide this information to its business associates and partners to get in touch with you when necessary to provide the services requested by you. DMart will use this information to preserve transaction history as governed by existing law or policy. DMart may also use contact information internally to direct its efforts for product improvement, to contact you as a survey respondent, to notify you if you win any contest; and to send you promotional materials from its contest sponsors or advertisers. DMart will also use this information to serve various promotional and advertising materials to you via display advertisements through the Google Ad network on third party websites. You can opt out of Google Analytics for Display Advertising and customize Google Display network ads using the Ads Preferences Manager. Information about Customers on an aggregate (exlcuding any information that may identify you specifically) covering Customer transaction data and Customer demographic and location data may be provided to partners of DMart for the purpose of creating additional features on the website, creating appropriate merchandising or creating new products and services and conducting marketing research and statistical analysis of customer behaviour and transactions.</p>

          <h3 class="static-page--subtitle">With whom your information will be shared </h3>
          <p>DMart will not use your financial information for any purpose other than to complete a transaction with you. DMart does not rent, sell or share your personal information and will not disclose any of your personally identifiable information to third parties. In cases where it has your permission to provide products or services you've requested and such information is necessary to provide these products or services the information may be shared with DMart&#39;s business associates and partners. DMart may, however, share consumer information on an aggregate with its partners or thrird parties where it deems necessary. In addition DMart may use this information for promotional offers, to help investigate, prevent or take action regarding unlawful and illegal activities, suspected fraud, potential threat to the safety or security of any person, violations of the Site&#39;s terms of use or to defend against legal claims; special circumstances such as compliance with subpoenas, court orders, requests/order from legal authorities or law enforcement agencies requiring such disclosure. </p>

          <h3 class="static-page--subtitle"> What Choice are available to you regarding collection, use and distribution of your information ?</h3>
          <p>To protect against the loss, misuse and alteration of the information under its control, DMart has in place appropriate physical, electronic and managerial procedures. For example, DMart servers are accessible only to authorized personnel and your information is shared with employees and authorised personnel on a need to know basis to complete the transaction and to provide the services requested by you. Although DMart will endeavour to safeguard the confidentiality of your personally identifiable information, transmissions made by means of the Internet cannot be made absolutely secure. By using this site, you agree that DMart will have no liability for disclosure of your information due to errors in transmission or unauthorized acts of third parties.  </p>

          <h3 class="static-page--subtitle">Policy updates</h3>
          <p>DMart reserves the right to change or update this policy at any time. Such changes shall be effective immediately upon posting to the Site.  </p>

          <h3 class="static-page--subtitle">Contact Information</h3>
          <address>
            DMart <br>
            1st Floor, Service Road, Wadala 2nd Stage, <br>
            Meera Road, Mumbai-560071 INDIA<br>
            Tel.: +91 99 999 9999 9999<br>
            Email id: customerservice@dmart.com <br>
          </address>
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