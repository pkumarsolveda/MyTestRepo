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
<title>Change Password - DMart</title>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,user-scalable=no">

<meta name="description" content="<c:out value="${metaDescription}"/>"/>
<meta name="keywords" content="<c:out value="${metaKeyword}"/>"/>
<meta name="pageIdentifier" content="HomePage"/>
<meta name="pageId" content="<c:out value="${page.pageId}"/>"/>
<meta name="pageGroup" content="content"/>	
<link rel="canonical" href="<c:out value="${env_TopCategoriesDisplayURL}"/>" />
<link rel="stylesheet" href="${jspStoreImgDir}${env_vfileStylesheet}" type="text/css" media="screen"/>

<%--<script src="${jsAssetsDir}javascript/DMart/customerprofile/update-password.js"></script> --%>

<c:set var="pageGroup" value="PasswordReset" />
<%@include file="../../../Common/DMartCommonJSToInclude.jspf" %>

<%-- Header Nav Start --%>
<c:if test="${b2bStore eq 'true'}">
	<c:if test="${userType =='G'}">
		<c:set var="hideHeader" value="true" />
	</c:if>
</c:if>
<%-- Import Header Widget --%>
<div id="headerWidget">
	<%out.flush();%>
		<c:import url="${env_jspStoreDir}/Widgets/Header/Header.jsp" />
	<%out.flush();%>
</div>
<%-- Header Nav End --%>

<meta name="robots" content="noindex,nofollow" />
</head>
<body>

<div class="container padding-double">
  <div class="row">
    <div class="col-xs-12 col-md-6 show-md-up">
     <div class="blurb blurb--right-border">
   <h2 class="blurb__title"> <fmt:message bundle="${storeText}" key="CHANGE_PWORD_TITLE"/> </h2>
   <div class="blurb__img">
      <img class="img-responsive" src="${jspStoreImgDir}/images/DMart/temp/login/login-bag.jpg" alt="Location">
  </div>

  <div class="blurb__content clearfix">
    <p><fmt:message bundle="${storeText}" key="CHANGE_PWD_SIDE_MESSAGE"/></p>

    <p class="margin-reset"><fmt:message bundle="${storeText}" key="REGN_SIDE_LIST_HEADER"/></p>
    <br>
    <p class="margin-reset"><fmt:message bundle="${storeText}" key="REGN_SIDE_LIST_HEADER1"/></p>
   
   </div>
</div>


    </div>
    <div class="col-xs-12 col-md-6">
     
<div class="form form--no-border form--no-right-padding">
  <h2 class="form__title"><fmt:message bundle="${storeText}" key="UPDATE_PASS"/></h2>
  <form name="formUpdatePwdValidation" id="formUpdatePwdValidation" novalidate="novalidate" method="post">
  <input type="hidden" name="storeId" value='<c:out value="${WCParam.storeId}" />' id="storeId"/>
		<input type="hidden" name="catalogId" value='<c:out value="${WCParam.catalogId}" />' id="catalogId"/>
		<input type="hidden" name="langId" value='<c:out value="${langId}" />' id="langId"/>
		<input type="hidden" name="URL" value="LogonForm" id="URL"/>
		<input type="hidden" name="errorViewName" value="ResetPasswordForm" id="errorViewName"/>
		<input type="hidden" name="authToken" value="${authToken}"  id="authToken"/>
		<input type="hidden" name="logonId" value="${WCParam.logonId}"  id="logonId"/>
		<input type="hidden" name="validationCode" value="${WCParam.validationCode}"  id="validationCode"/>
		<input id="previousPage" type="hidden" value="${WCParam.previousPage}" name="previousPage"/>
		<input id="otpCode" type="hidden" value="${WCParam.otpCode}" name="otpCode"/>
    <div class="form-control">
      <label class="form__label required-field spacing-bottom-tiny" for="password"><fmt:message bundle="${storeText}" key="REGN_FORM_LABEL_PASSWORD"/></label>
      <div class="password-show-hide-field">
        <input class="form__input" autocomplete="off" type="password" name="password" id="showHideChangePwd" required autofocus>
        <div class="show-hide-password-block">
          <input type="checkbox" id="showHideChangePwdChkBox">
          <label for="showHide" id="showHideLabel"><fmt:message bundle="${storeText}" key="REGN_FORM_LABEL_PWORDSHOW"/></label>
        </div>
      </div>
    </div>
       
   <script>
   function removeAllOrderDetails() {
		try{
			CartHelper.invalidateCookieForOtherProtocol();
			dojo.cookie("DM_OrderId", null, {expires: -1,path: '/'});
		    localStorage.removeItem('orderId');
			localStorage.removeItem('OOSitemsList');
	    }catch(err) {
				}
		}
	</script>  
	<button class="button-primary button--block"
	type="button" onclick="javascript:updatePassword.updateNewpassword(document.formUpdatePwdValidation);removeAllOrderDetails();return false;">
	Update
	</button>
	 <div>
	<span class="error_msg" id="formUpdatePwdValidation_error"></span>
	</div>
  </form>
</div>
    </div>
    
       <div class="col-xs-12 col-md-6 show-sm-down">
     <div class="blurb blurb--right-border">
   <h2 class="blurb__title"> <fmt:message bundle="${storeText}" key="CHANGE_PWORD_TITLE"/> </h2>
   <div class="blurb__img">
      <img class="img-responsive" src="${jspStoreImgDir}/images/DMart/temp/login/login-bag.jpg" alt="Change Password">
  </div>

  <div class="blurb__content clearfix">
    <p><fmt:message bundle="${storeText}" key="CHANGE_PWD_SIDE_MESSAGE"/></p>

    <p class="margin-reset"><fmt:message bundle="${storeText}" key="REGN_SIDE_LIST_HEADER"/></p>
    <br>
    <p class="margin-reset"><fmt:message bundle="${storeText}" key="REGN_SIDE_LIST_HEADER1"/></p>
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

<script>
	dojo.addOnLoad(function() {	
		$('#showHideChangePwd').val('');
	});
</script>

</body>
