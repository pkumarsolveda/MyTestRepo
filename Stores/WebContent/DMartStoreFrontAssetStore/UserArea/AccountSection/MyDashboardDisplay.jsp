<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://commerce.ibm.com/base" prefix="wcbase" %>
<%@ include file="../../Common/EnvironmentSetup.jspf"%>
<%@ include file="../../Common/nocache.jspf"%>
<%@ taglib uri="http://commerce.ibm.com/foundation" prefix="wcf" %>

<c:set var="pageCategory" value="MyAccount" scope="request"/>

<%@page import="com.ibm.commerce.foundation.internal.server.services.registry.StoreConfigurationRegistry"%>
<%@page import="com.ibm.commerce.registry.RegistryManager"%>

<%
StoreConfigurationRegistry storeRegistry = (StoreConfigurationRegistry) RegistryManager.singleton().getRegistry("StoreConfigurationRegistry");
String loginextURL = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Loginext.Endpoint");
pageContext.setAttribute("loginextURL", loginextURL);
String remorseTimeInMinutes = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.BillDesk.RemorseTimeInMunites");
pageContext.setAttribute("remorseTimeInMinutes", remorseTimeInMinutes);
String nxtWeekSlotSwitch = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Slot.Week.Switch");
pageContext.setAttribute("nxtWeekSlotSwitch", nxtWeekSlotSwitch);
%>
<input type="hidden" name="remorseTimeInMinutes" value="${remorseTimeInMinutes}" id="remorseTimeInMinutes" />
<input type="hidden" name="nxtWeekSlotSwitch" value="${nxtWeekSlotSwitch}" id="nxtWeekSlotSwitch" />	
<script type="text/javascript">
	var loginextURL = ${loginextURL};
</script>

<fmt:message bundle="${storeText}" key="MA_MYACCOUNT" var="contentPageName" scope="request"/>
<html xmlns="http://www.w3.org/1999/xhtml"
xmlns:wairole="http://www.w3.org/2005/01/wai-rdf/GUIRoleTaxonomy#"
xmlns:waistate="http://www.w3.org/2005/07/aaa" lang="${shortLocale}" xml:lang="${shortLocale}">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link href="<c:out value="${jspStoreImgDir}${env_vfileStylesheet}"/>" rel="stylesheet" type="text/css" />
	<%@ include file="../../Common/CommonJSToInclude.jspf"%>
	<c:set var="pageGroup" value="MyAccount"/>
	<%@ include file="../../Common/DMartCommonJSToInclude.jspf"%>
	<%@ include file="../../Common/CommonJSPFToInclude.jspf"%>
		
	<title><fmt:message bundle="${storeText}" key="MY_DASHBOARD_PAGE_TITLE"/></title>

	<script type="text/javascript">
	dojo.addOnLoad(function() {
		categoryDisplayJS.setCommonParameters('<c:out value="${WCParam.langId}"/>','<c:out value="${WCParam.storeId}"/>','<c:out value="${WCParam.catalogId}"/>','${userType}');
				<fmt:message bundle="${storeText}" key="MO_ORDER_CANCELED_MSG" var="MO_ORDER_CANCELED_MSG"/>
		<fmt:message bundle="${storeText}" key="SCHEDULE_ORDER_CANCEL_MSG" var="SCHEDULE_ORDER_CANCEL_MSG"/>
		MessageHelper.setMessage("MO_ORDER_CANCELED_MSG", <wcf:json object="${MO_ORDER_CANCELED_MSG}"/>);
			});
	</script>
	
	<meta name="robots" content="noindex,nofollow" />
</head>
<body>
 
<div class="RWDPage">
	<div class="header_wrapper_position" id="headerWidget">
		<%out.flush();%>
		<c:import url = "${env_jspStoreDir}/Widgets/Header/Header.jsp" />
		<%out.flush();%>
	</div>
	
	<wcf:rest var="person" url="store/{storeId}/person/@self" scope="request">
		<wcf:var name="storeId" value="${WCParam.storeId}" encode="true"/>
	</wcf:rest>
	<div class="container" id="error-msg-container">
	  <div class="row">
	    <div class="col-xs-12">
	      <div class="alert alert-warning-bg js-alert-order" style="display:none;">
	        <strong><i class="icon-notification"></i><fmt:message key="ERROR_WARNING" bundle="${storeText}"/></strong>
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
	      <div class="blurb-page">
	        <h3 class="blurb-page--title"><fmt:message key="MY_DASHBOARD_TITLE" bundle="${storeText}"/></h3>
	      </div>
	    </div>
	  </div>
	</div>
	
	<div class="container">
	  <div class="row">
	    <div class="col-xs-12">
	
	      <div class="my-dashboard">
	        <div  id="my-account" class="js-accordion-tabs-recommanded">
	          <div class="no-border-tabs margin-reset">
	            <ul class="resp-tabs-list clearfix hor_1">
	              <li id="personalDetails"><fmt:message key="MY_DASHBOARD_DETAILS_TAB" bundle="${storeText}"/></li>
	              <c:set var="passwordChangeDisplayIndicator" scope="page" value="true"/>
	              <c:if test="${not empty person.contextAttribute}">
	              	<c:forEach items="${person.contextAttribute}" var="personAttributes" >	              
	              		<c:if test="${personAttributes.attributeName == 'SocialSignIn'}">
	              			<c:if test="${personAttributes.attributeValue[0].value[0] == '1' || personAttributes.attributeValue[0].value[0] == '2'}">
	              				<c:set var="passwordChangeDisplayIndicator" value="false"/>
	              			</c:if>
	              		</c:if>
	              	</c:forEach>
	              </c:if>	      
	              <c:if test="${passwordChangeDisplayIndicator == true}">
	              	<li id="changePassword"><fmt:message key="MY_DASHBOARD_PASSWORD_TAB" bundle="${storeText}"/></li>
	              </c:if>	              
	              <li id="manageAddress"><fmt:message key="MY_DASHBOARD_ADDRESS_TAB" bundle="${storeText}"/></li>
	              <li id="myOrders"><fmt:message key="MY_DASHBOARD_ORDERS_TAB" bundle="${storeText}"/></li>
	            </ul>
	            <div class="resp-tabs-container hor_1">
	            
	              <%-- Personal Details --%>
	              <div>
					<div class="row">
					  <div class="col-xs-12">
					    <div class="dashboard-details">
					      <div class="dashboard-details__personal">
					        <div class="form">
					          <form class="form__personaldetails" action="javascript:;" method="post" id="dashboardPersonalDetailsValidation">
					          	<div class="row">
									<div class="col-xs-12 col-md-6 col-lg-4">
										<div class="form-control">
										  <label for="firstName" class="form__label required-field spacing-bottom-tiny"><fmt:message key="MY_DASHBOARD_DETAILS_TAB_FIRST_NAME" bundle="${storeText}"/></label>
											<input type="text" required="true" value="<c:out value="${person.firstName}"/>" id="firstName" name="firstName" class="form__input" data-prevfirstname = "${person.firstName}" >
										</div>
									</div>
									<div class="col-xs-12 col-md-6 col-lg-4">
										<div class="form-control">
										  <label for="lastName" class="form__label required-field spacing-bottom-tiny"><fmt:message key="MY_DASHBOARD_DETAILS_TAB_LAST_NAME" bundle="${storeText}"/></label>
											<input type="text" required="true"  value="<c:out value="${person.lastName}"/>"  id="lastName" name="lastName" class="form__input" data-prevlastname = "${person.lastName}" >
										</div>
									</div>
					            </div>
								<div class="row">
								
									<div class="col-xs-12 col-md-6 col-lg-4">
										<div class="form-control">
										  <label for="mobileNumber" class="form__label required-field spacing-bottom-tiny"><fmt:message key="MY_DASHBOARD_DETAILS_TAB_MOBILE_NUMBER" bundle="${storeText}"/></label>
										  <div class="form__input--group">
											<span class="form__input-prefix">+91</span>
											<input type="tel" required="true" maxlength="10" value="<c:out value="${person.logonId}"/>" id="changeMobileNumber" name="editMobileNumber" class="form__input" data-prevmobilenumber="${person.logonId}">
										  </div>
										</div>
						            </div>
						            
						            
									<div class="col-xs-12 col-md-6 col-lg-4">
										<div class="form-control">
										  <label for="email" class="form__label spacing-bottom-tiny"><fmt:message key="MY_DASHBOARD_DETAILS_TAB_EMAIL" bundle="${storeText}"/></label>
										  <c:choose>
										  	<c:when test="${not empty person.email2}">
										  		<c:set var="email" value="${person.email2}" scope="page"/>
										  		<c:set var="emailValidated" value="false" scope="page"/>
										  	</c:when>
										  	<c:when test="${not empty person.email1}">
										  		<c:set var="email" value="${person.email1}" scope="page"/>
										  		<c:set var="emailValidated" value="true" scope="page"/>
										  	</c:when>								  	
										  </c:choose>
										  <input type="email" value="<c:out value="${email}"/>"  id="email" name="email" class="form__input" data-prevemail = "${email}" maxlength="" autocomplete="off">
										  <div class="verifyEmailLink" <c:if test="${empty email }">style = "display:none;"</c:if>>
											   <%-- If Email is not verified remove js-hide-show --%>
								              <label class="not-verified-email <c:if test='${emailValidated}'>js-hide-show</c:if>"> 
								              	<span class="not-verified"><i class="icon-notification"></i><fmt:message key="MY_DASHBOARD_DETAILS_TAB_EMAIL_NOT_VERIFIED" bundle="${storeText}"/></span>
								              	<a class="not-verified not-verified-link js-not-verified" href="javascript:DashBoardHelper.verifyEmail(${person.logonId},true);" title="Resend Verification Email"><fmt:message key="MY_DASHBOARD_DETAILS_TAB_EMAIL_RESEND" bundle="${storeText}"/></a> 
								              	</label>
								
								              <%-- If Email is not verified add js-hide-show --%>
								              <label class="verified-email <c:if test='${not emailValidated}'>js-hide-show</c:if>">
								              	<span><i class="icon-checkmark"></i></span>
								              	<fmt:message key="MY_DASHBOARD_DETAILS_TAB_EMAIL_VERIFIED" bundle="${storeText}"/>
								              </label>
										  </div>
										</div>
									</div>
						        </div>   
						        <div class="row">
								    <div class="col-xs-12 col-lg-8">
										<div class="form__btn">
										  <button type="submit" class="dashboard__btn-cta button-primary" id="changePersonalDetails"><fmt:message key="MY_DASHBOARD_DETAILS_TAB_SAVE" bundle="${storeText}"/></button>
										</div>
									</div>
					            </div>
					          </form>
					        </div>
					      </div>
					    </div>
					  </div>
					</div>
				  </div>
		          <%-- Personal Details End--%>				
	              <%-- Chnage password --%>
	              <c:if test="${passwordChangeDisplayIndicator == true}" >
	              <div>
					<div class="row">
					  <div class="col-xs-12 col-md-6 col-lg-5">
					      <div class="dashboard-details__personal-password">
					        <div class="form">
					         
					          <form class="form__changepassword" action="javascript:;" method="post" id="dashboardChangePasswordValidation" name="dashboardChangePasswordValidation">
					          
				           	    <div class="form-control">
					              <label for="password" class="form__label required-field spacing-bottom-tiny"><fmt:message key="MY_DASHBOARD_PASSWORD_TAB_OLD_PASSWORD" bundle="${storeText}"/></label>
					                <input type="password"  required="true"  id="oldPassword" name="oldPassword" class="form__input">
					            </div>
					            
					            <div class="form-control">
					              <label class="form__label required-field spacing-bottom-tiny" for="password"><fmt:message key="MY_DASHBOARD_PASSWORD_TAB_NEW_PASSWORD" bundle="${storeText}"/></label>
					              <div class="password-show-hide-field">
					                <input class="form__input" type="password" name="password" id="showHidePassword" required="true">
					                <div class="show-hide-password-block">
					                  <input type="checkbox" id="showHide">
					                  <label for="showHide" id="showHideLabel"><fmt:message key="MY_DASHBOARD_PASSWORD_TAB_SHOW" bundle="${storeText}"/></label>
					                </div>
					              </div>
					            </div>
					            
					            <div class="form__btn">
					              <button type="submit" class="dashboard__btn-cta button-primary" id="changePasswordSave"><fmt:message key="MY_DASHBOARD_PASSWORD_TAB_SAVE" bundle="${storeText}"/></button>
					            </div>
					            
					          </form>
					        </div>
					      </div>
					  </div>
					</div>
				  </div>
				  </c:if>
	              <%-- Manage Address --%>
	              <div>
	                <%-- display '.dashboard-no-items' alert if nothing to show --%>
	                <div class="dashboard-no-items js-hide-show">
	                  <div class="row">
	                    <div class="col-xs-12 col-md-6">
	                      <div class="delivery-vertical__address-new form">
	                        <h4 class="delivery-vertical__address-new--title"><fmt:message key="MY_DASHBOARD_ADDRESS_TAB_NEW" bundle="${storeText}"/></h4>														
	                      </div>
	                    </div>
	                  </div>
	                </div>
	                <h3 class="dashboard__address--label">
					  <fmt:message key="MY_DASHBOARD_ADDRESS_TAB_CURRENT_ADDRESS" bundle="${storeText}"/>
					</h3>
					<div class="form__btn js-new-address-cta">
					  <button type="submit" class="dashboard__btn-cta button-white modal-link" title="Add New Address" id="dashboardNewAdd" data-target="newAddressModal"><fmt:message key="MY_DASHBOARD_ADDRESS_TAB_ADD_NEW_ADDRESS" bundle="${storeText}"/></button>
					</div>

	                <div class="dashboard__address-manage-address">
					</div>
	              </div>
	              
	              <%-- My Orders --%>
	              	<div class="dashboard-myorder">
	              	<div id="no-previous-order" style="display:none">
	              		<span><fmt:message key="MY_DASHBOARD_ORDERS_TAB_NO_PREVIOUS_ORDER" bundle="${storeText}"/></span>
	              	</div> 
	              	<div id="new-customer" style="display:none">
	              		<span><fmt:message key="MY_DASHBOARD_ORDERS_TAB_NEW_CUSTOMER" bundle="${storeText}"/></span>
	              	</div>
					<div class="dashboard-myorder--heading">
				    	<span><fmt:message key="MY_DASHBOARD_ORDERS_TAB_ORDER_NO" bundle="${storeText}"/></span>
				    	<span><fmt:message key="MY_DASHBOARD_ORDERS_TAB_ORDER_DATE" bundle="${storeText}"/></span>
				    	<span><fmt:message key="MY_DASHBOARD_ORDERS_TAB_DELIVERY_MODE" bundle="${storeText}"/></span>
				    	<span class="my-order-date"><fmt:message key="MY_DASHBOARD_ORDERS_TAB_DELIVERY_DATE" bundle="${storeText}"/></span>
				    	<span class="my-order-amount"><fmt:message key="MY_DASHBOARD_ORDERS_TAB_ORDER_AMOUNT" bundle="${storeText}"/></span>
				    	<span class="my-order-status"><fmt:message key="MY_DASHBOARD_ORDERS_TAB_ORDER_STATUS" bundle="${storeText}"/></span>
				  	</div>
	              <div id="MyOrdersDiv">
	                <%-- display '.dashboard-no-items' alert if nothing to show --%>
	                <div class="dashboard-no-items js-hide-show">
	                  <p class="alert alert-danger text-center"><fmt:message key="MY_DASHBOARD_ORDERS_TAB_NO_ORDERS" bundle="${storeText}"/></p>
	                </div>
	              </div>
	              	</div>
	            </div>
	          </div>
	        </div>
	      </div>
	    </div>
	  </div>
	</div>
	<div id="cancelOrderModal" class="modal-dialog modal-dialog--clear-cart js-modal-dialog-esc">
	</div>
	<div id="dashboardSlotChange" class="modal-dialog modal-dialog--clear-cart js-modal-dialog-esc">
	</div>
					
	<%-- Main Content End --%>					

	<%-- Footer Start  --%>
	<div class="footer_wrapper_position">
		<%out.flush();%>
		<c:import url = "${env_jspStoreDir}/Widgets/Footer/Footer.jsp" />
		<%out.flush();%>
	</div> 
     <%-- Footer Start End --%>
</div>

<script type="text/javascript">
var isTrackOrder = '${WCParam.isTrackOrder}';
var isBreadCrumb = '${WCParam.isBreadCrumb}'
if(isBreadCrumb || (isTrackOrder != '' && isTrackOrder)){
	$(document).ready(function () {
		$('#myOrders').click();
	});
} 
dojo.addOnLoad(function() {
	nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
		autoescape: true,
		web: {
			useCache: true
		}
	});		
	$('#error-msg-container').before(nunjucks.render('_modules/modal-address-edit.nunjucks'));
	$('#error-msg-container').before(nunjucks.render('_modules/modal-address-new.nunjucks'));		
	var htmlCode = nunjucks.render('_modules/selection-address-delivery-add-address.nunjucks');  			    	
  	$('.delivery-vertical__address-new').append(htmlCode);
  	
	<%-- Dmart User Messages --%>
	<fmt:message bundle="${storeText}" key="_ERR_PASSWORD_INVALID" var="_ERR_PASSWORD_INVALID"/>	
	MessageHelper.setMessage("_ERR_PASSWORD_INVALID", <wcf:json object="${_ERR_PASSWORD_INVALID}"/>);
	<fmt:message bundle="${storeText}" key="MY_DASHBOARD_DETAILS_CHANGE_SUCCESS" var="MY_DASHBOARD_DETAILS_CHANGE_SUCCESS"/>	
	MessageHelper.setMessage("MY_DASHBOARD_DETAILS_CHANGE_SUCCESS", <wcf:json object="${MY_DASHBOARD_DETAILS_CHANGE_SUCCESS}"/>);
	<fmt:message bundle="${storeText}" key="MY_DASHBOARD_DETAILS_EMAIL_CHANGE_SUCCESS" var="MY_DASHBOARD_DETAILS_EMAIL_CHANGE_SUCCESS"/>	
	MessageHelper.setMessage("MY_DASHBOARD_DETAILS_EMAIL_CHANGE_SUCCESS", <wcf:json object="${MY_DASHBOARD_DETAILS_EMAIL_CHANGE_SUCCESS}"/>);
	<fmt:message bundle="${storeText}" key="MY_DASHBOARD_PASSWORD_CHANGE_SUCCESS" var="MY_DASHBOARD_PASSWORD_CHANGE_SUCCESS"/>	
	MessageHelper.setMessage("MY_DASHBOARD_PASSWORD_CHANGE_SUCCESS", <wcf:json object="${MY_DASHBOARD_PASSWORD_CHANGE_SUCCESS}"/>);
	<fmt:message bundle="${storeText}" key="MY_DASHBOARD_ORDERS_TAB_CHANGE_SLOT_SUCCESS" var="MY_DASHBOARD_ORDERS_TAB_CHANGE_SLOT_SUCCESS"/>	
	MessageHelper.setMessage("MY_DASHBOARD_ORDERS_TAB_CHANGE_SLOT_SUCCESS", <wcf:json object="${MY_DASHBOARD_ORDERS_TAB_CHANGE_SLOT_SUCCESS}"/>);
	<fmt:message bundle="${storeText}" key="MY_DASHBOARD_ORDERS_TAB_CHANGE_SLOT_FAILURE" var="MY_DASHBOARD_ORDERS_TAB_CHANGE_SLOT_FAILURE"/>	
	MessageHelper.setMessage("MY_DASHBOARD_ORDERS_TAB_CHANGE_SLOT_FAILURE", <wcf:json object="${MY_DASHBOARD_ORDERS_TAB_CHANGE_SLOT_FAILURE}"/>);
	<fmt:message bundle="${storeText}" key="MY_DASHBOARD_ORDERS_TAB_CANCEL_ORDER_SUCCESS" var="MY_DASHBOARD_ORDERS_TAB_CANCEL_ORDER_SUCCESS"/>	
	MessageHelper.setMessage("MY_DASHBOARD_ORDERS_TAB_CANCEL_ORDER_SUCCESS", <wcf:json object="${MY_DASHBOARD_ORDERS_TAB_CANCEL_ORDER_SUCCESS}"/>);
	<fmt:message bundle="${storeText}" key="MY_DASHBOARD_ORDERS_TAB_CANCEL_ORDER_FAILURE" var="MY_DASHBOARD_ORDERS_TAB_CANCEL_ORDER_FAILURE"/>	
	MessageHelper.setMessage("MY_DASHBOARD_ORDERS_TAB_CANCEL_ORDER_FAILURE", <wcf:json object="${MY_DASHBOARD_ORDERS_TAB_CANCEL_ORDER_FAILURE}"/>);
	<fmt:message bundle="${storeText}" key="GENERIC_ERROR_MESSAGE" var="GENERIC_ERROR_MESSAGE"/>	
	MessageHelper.setMessage("GENERIC_ERROR_MESSAGE", <wcf:json object="${GENERIC_ERROR_MESSAGE}"/>);
	<fmt:message bundle="${storeText}" key="MY_DASHBOARD_ERR_PASSWORD_INVALID" var="MY_DASHBOARD_ERR_PASSWORD_INVALID"/>	
	MessageHelper.setMessage("MY_DASHBOARD_ERR_PASSWORD_INVALID", <wcf:json object="${MY_DASHBOARD_ERR_PASSWORD_INVALID}"/>);
});
</script>


</html>
