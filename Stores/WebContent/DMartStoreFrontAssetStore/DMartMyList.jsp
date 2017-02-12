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
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="robots" content="noindex,nofollow" />
	<title><fmt:message bundle="${storeText}"key="DMART_LIST_TITLE"></fmt:message></title>		
	
	<link rel="stylesheet" href="<c:out value="${jspStoreImgDir}${env_vfileStylesheet}"/>" type="text/css"/>
	<%@ include file="Common/CommonJSToInclude.jspf"%>
	<%-- 	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/CommonContextsDeclarations.js"/>"></script>
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/CommonControllersDeclaration.js"/>"></script>	
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/ServicesDeclaration.js"/>"></script>	 --%>
<%-- 	<script src="${jsAssetsDir}javascript/DMart/plugins/jquery.min.js"></script> --%>
	<%-- <script src="${jsAssetsDir}javascript/DMart/localCache/Storage.js"></script> --%>
	<%@ include file="Common/CommonJSPFToInclude.jspf"%> 	     
</head>
<body>

<%-- <script src="${jsAssetsDir}javascript/DMart/Cart/CartHelper.js"></script> --%>
<c:set var="pageGroup" value="MyList" scope="request"/>
<%@include file="Common/DMartCommonJSToInclude.jspf" %>
<input type="hidden" name="giftListId" id="giftListId" value='${WCParam.giftListId}' />
<script type="text/javascript">

dojo.addOnLoad(function() {
	$(document).bind(
        'dmart.cache.validator.completed',
        function(e) {
            DMartShoppingListActionsJS.displayList('myList');
        });
});
</script>
			
<div class="header_wrapper_position" id="headerWidget">
	<%out.flush();%>
		<c:import url = "${env_jspStoreDir}/Widgets/Header/Header.jsp" />				
	<%out.flush();%>
</div>
	<div class="container">
		<div class="row">
			<div class="col-xs-12 col-md-6">
				
					<ul class="breadcrumbs link-bordered">
						<li><a href="${env_TopCategoriesDisplayURL}" title="Home"><fmt:message bundle="${storeText}"key="LIST_BREADCRUMB1"></fmt:message></a></li>
						<li class="breadcrumb-dropdown"><a href="javascript:;" title="My List"><fmt:message bundle="${storeText}"key="LIST_BREADCRUMB2"></fmt:message> </a></li>
						<li><fmt:message bundle="${storeText}"key="LIST_BREADCRUMB3"></fmt:message></li>
					</ul>
				
			</div>
		</div>
	</div>
<div class="container" id="error-msg-container">
  <div class="row">
    <div class="col-xs-12">
      <div class="alert alert-warning-bg js-alert-order" style="display:none;">
        <strong><i class="icon-notification"></i> <fmt:message bundle="${storeText}"key="LIST_NOTE"></fmt:message></strong>
        	<span id="generic-error-section">
        		
        	</span>
        <a class="alert-close-cta js-cart-reject align-right alert-cross-pos" href="javascript:;" title="Close"><i class="icon-cta-close icon-cancel"></i></a>
      </div>
    </div>
  </div>
</div>
<div class="container">
	<div class="row">
		<div class="col-xs-12">
			<div class="my-listing-products" id="myList">
			
			</div>
		</div>
	</div>
</div>
<div id="clearMyListModal" class="modal-dialog modal-dialog--clear-mylist js-modal-dialog-esc">
  <div class="modal-dialog__content modal-dialog__content-small">
    <a href="javascript:;" title="Close" class="modal-dialog__close">X</a>
    <div class="modal-dialog__header">
      <h4 class="modal-dialog__header-title"><fmt:message bundle="${storeText}"key="LIST_EMPTY_BUTTON"></fmt:message></h4>
    </div>
    <div class="modal-dialog__body">
      <div class="blurb">
        <p class="spacing-bottom"><fmt:message bundle="${storeText}"key="LIST_EMPTY_MESSAGE"></fmt:message></p>
        <div class="clear-cart-bta-wrap text-right">
          <a class="clear-mylist-confirm button button-white button--block" href="javascript:;"><fmt:message bundle="${storeText}"key="BUTTON_OK"></fmt:message></a>
          <a class="clear-mylist-reject button button-primary" href="javascript:;"><fmt:message bundle="${storeText}"key="BUTTON_CANCEL"></fmt:message></a>
        </div>
      </div>
    </div>
  </div>
</div>


<div id="setAlertModal" class="modal-dialog modal-dialog--clear-mylist js-modal-dialog-esc">
  <div class="modal-dialog__content modal-dialog__content-small">
    <a href="javascript:;" title="Close" class="modal-dialog__close">X</a>
    <div class="modal-dialog__header">
      <h4 class="modal-dialog__header-title"><fmt:message bundle="${storeText}"key="LIST_SET_ALERT"></fmt:message></h4>
    </div>
    <div class="modal-dialog__body mylist-set-alert-modal">
      <form class="form form--modal" action="javascript:;" method="post" id="formSetAlert">
        <div class="blurb">
          <h4 class="mylist-set-alert-title"><fmt:message bundle="${storeText}"key="LIST_ALERT_MESSAGE"></fmt:message></h4>
          <div class="custom-dropdown mylist-set-alert--val js-alert-change">
            <select>
              <option value="0"><fmt:message bundle="${storeText}"key="ALERT_FREQ1"></fmt:message></option>
              <option value="1"><fmt:message bundle="${storeText}"key="ALERT_FREQ2"></fmt:message></option>
              <option value="2"><fmt:message bundle="${storeText}"key="ALERT_FREQ3"></fmt:message></option>
            </select>
          </div>
          <span>on</span>
          <div class="custom-dropdown js-alert-week">
            <select disabled="">
              <option value="1">Sunday</option>
              <option value="2">Monday</option>
              <option value="3">Tuesday</option>
              <option value="4">Wednesday</option>
              <option value="5">Thursday</option>
              <option value="6">Friday</option>
              <option value="7">Saturday</option>
            </select>
          </div>
          <div class="custom-dropdown js-alert-month hide">
            <select>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="21">21</option>
              <option value="22">22</option>
              <option value="23">23</option>
              <option value="24">24</option>
              <option value="25">25</option>
              <option value="26">26</option>
              <option value="27">27</option>
              <option value="28">28</option>
              <option value="29">29</option>
              <option value="30">30</option>
              <option value="31">31</option>
            </select>
          </div>
          <div class="mylist-set-alert-disable">
            <div class="form-control">
              <input class="js-alert-disabled" type="checkbox" name="alertDisable">
              <label for="alertDisable"><fmt:message bundle="${storeText}"key="LIST_DISABLE_ALERT"></fmt:message></label>
            </div>

          </div>
          <div class="mylist-set-alert-save">
            <button class="button-primary button--block button--disabled" disabled="" type="submit"><fmt:message bundle="${storeText}"key="LIST_ALERT_SAVE"></fmt:message></button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

<div id="forgotPasswordModal" class="modal-dialog js-modal-dialog-esc">
	<div class="modal-dialog__content modal-dialog__content-small">
		<a href="javascript:;" title="Close" class="modal-dialog__close">X</a>
		<div class="modal-dialog__header">
			<h4 class="modal-dialog__header-title"><fmt:message bundle="${storeText}"key="FORGOT_PWD"></fmt:message></h4>
		</div>
		<div class="modal-dialog__body">
			<div>
				<p class="form-notification"><fmt:message bundle="${storeText}"key="FORGOT_PWD_MSG1"></fmt:message></p>
				<form class="form form--modal" method="post" action="javascript:;" id="forgotValidation" novalidate="novalidate">
					<div class="form-control">
  <label for="mobileNumber" class="form__label required-field spacing-bottom-tiny"><fmt:message bundle="${storeText}"key="MOB_NO"></fmt:message></label>
  <div class="form__input--group">
    <span class="form__input-prefix">+91</span>
    <input type="tel" required="" maxlength="10" placeholder="9999999999" id="mobileNumber" name="mobileNumber" class="form__input" aria-required="true">
  </div>
</div>


					<button class="js-form-submit button-primary button--block" type="submit"><fmt:message bundle="${storeText}"key="FORGOT_PWD_BUTTON"></fmt:message></button>
				</form>
			</div>
		</div>
	</div>
</div>

     
			<div id="footerWrapper">
				<%out.flush();%>
				<c:import url="${env_jspStoreDir}Widgets/Footer/Footer.jsp"/>
				<%out.flush();%>
			</div>
		
	
	</body>	
	
</html>

