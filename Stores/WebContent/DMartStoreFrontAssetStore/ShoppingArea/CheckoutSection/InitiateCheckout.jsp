<!DOCTYPE html>
<%@page import="com.ibm.commerce.foundation.internal.server.services.registry.StoreConfigurationRegistry"%>
<%@page import="com.ibm.commerce.registry.RegistryManager"%>
<html lang="en">
<head>
<title> Checkout | DMart</title>
<link rel="shortcut icon" href="/wcsstore/DMartStoreFrontAssetStore/images/icon-favicon.ico" mce_href="/wcsstore/DMartStoreFrontAssetStore/images/icon-favicon.ico"/>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="description" content="">
<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,user-scalable=no">
<meta name="robots" content="noindex,nofollow" />
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://commerce.ibm.com/base" prefix="wcbase" %>
<%@ taglib uri="flow.tld" prefix="flow" %>
<%@ include file="../../include/ErrorMessageSetup.jspf" %>
<%@ include file="../../Common/nocache.jspf" %>
<%@ taglib uri="http://commerce.ibm.com/foundation" prefix="wcf" %>
<%@ taglib uri="http://commerce.ibm.com/coremetrics"  prefix="cm" %>
<c:set var="pageGroup" value="Checkout" />
<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600" rel="stylesheet" type="text/css">
</head>
<body class="margin-reset">
<%
			StoreConfigurationRegistry scfRegistry = (StoreConfigurationRegistry) RegistryManager.singleton().getRegistry("StoreConfigurationRegistry");
			String maximumPUPAddresses = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.MaximumPUPAddresses");
			pageContext.setAttribute("maximumPUPAddresses", maximumPUPAddresses);
			String radiusPUP = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.PUP.Radius");
			pageContext.setAttribute("radiusPUP", radiusPUP);
			String googleAPIKey = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.GoogleAPIKey");
			pageContext.setAttribute("googleAPIKey", googleAPIKey);
			String cartMinThreshold = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.CartMinThreshold");
			pageContext.setAttribute("cartMinThreshold", cartMinThreshold);
			String netBankingURL = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.NetBanking");
			pageContext.setAttribute("netBankingURL", netBankingURL);
			String ccValidationPath = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.CCValidation.Path");
			pageContext.setAttribute("ccValidationPath", ccValidationPath);			
			String maxPUPAmnt=StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.PUPMaxThreshold");
			pageContext.setAttribute("maxPUPAmnt", maxPUPAmnt);
			String maxCODHomeDlvryAmnt=StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.CODHomeDeliveryMaxThreshold");
			pageContext.setAttribute("maxCODHomeDlvryAmnt", maxCODHomeDlvryAmnt);
			String isCODEnabledForPUP=StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.CODEnabledForPUP");
			pageContext.setAttribute("isCODEnabledForPUP", isCODEnabledForPUP);
			CommandContext cmdContext = (CommandContext)request.getAttribute(ECConstants.EC_COMMANDCONTEXT);
			String userId = cmdContext.getUserId().toString();
			pageContext.setAttribute("userIdRepay", userId);
			String appDynaDisabled = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Disable.AppDynamics");
			pageContext.setAttribute("appDynaDisabled", appDynaDisabled);
			String nextWeekSlotSwitch = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Slot.Week.Switch");
			pageContext.setAttribute("nextWeekSlotSwitch", nextWeekSlotSwitch);
		  %>
<input type="hidden" name="cartMinThreshold" value="${cartMinThreshold}" id="cartMinThreshold" />		  
<input type="hidden" name="pupMaxThreshold" value="${maxPUPAmnt}" id="pupMaxThreshold" />	
<input type="hidden" name="maxCODHomeDlvryAmnt" value="${maxCODHomeDlvryAmnt}" id="maxCODHomeDlvryAmnt" />		  
<input type="hidden" name="maximumPUPAddresses" value="${maximumPUPAddresses}" id="maximumPUPAddresses" />
<input type="hidden" name="radiusPUP" value="${radiusPUP}" id="radiusPUP" />
<input type="hidden" name="userIdRepay" value="${userIdRepay}" id="userIdRepay" />
<input type="hidden" name="isCODEnabledForPUP" value="${isCODEnabledForPUP}" id="isCODEnabledForPUP" />
<input type="hidden" name="nextWeekSlotSwitch" value="${nextWeekSlotSwitch}" id="nextWeekSlotSwitch" />
<script type="text/javascript" src="//maps.googleapis.com/maps/api/js?sensor=false&key=${googleAPIKey}"></script>
<%@ include file= "../../Common/EnvironmentSetup.jspf" %>

<%@ include file="InitiateCheckoutImports.jspf" %>
<c:if test="${!empty WCParam.storeMigrationOOSItems}">
		<input type='hidden' value='${WCParam.storeMigrationOOSItems}' id='storeMigrationOOSItems'>
		<input type='hidden' value='${WCParam.newOrderId}' id='newOrderId'>
</c:if>
<c:if test="${appDynaDisabled eq '0'}" >
	<script> 
    	window['adrum-start-time']= new Date().getTime(); 
	</script> 
	<script src="${jsAssetsDir}javascript/DMart/AppDynamics/adrum.js">
	</script>
</c:if>	
<script>
var OOSitemArray =undefined;
var newOrderId =undefined;
dojo.addOnLoad(function() {
	var OOSitems =  $('#storeMigrationOOSItems').val();
	if(typeof OOSitems != 'undefined' && OOSitems.length > 2){
	OOSitemArray = $('#storeMigrationOOSItems').val().replace(/[^\w\s]/gi, '').split(' ');	
    errorMessageHelper.saveunavailableItems();	
    $(document).trigger('dmart.generic.error.display');
	}else{
	$(document).trigger('dmart.generic.error.display');
	}
	
});
</script>

		  

<script type="text/javascript">

	dojo.addOnLoad(function() {
	<fmt:message bundle="${storeText}" key="_ERR_INVALID_PARAMETER" var="_ERR_INVALID_PARAMETER"/>
		MessageHelper.setMessage("_ERR_INVALID_PARAMETER", <wcf:json object="${_ERR_INVALID_PARAMETER}"/>);
	});

dojo.addOnLoad(function() {

   	var action = checkoutHelper.getParameterByName('currentAction');
	var reason = checkoutHelper.getParameterByName('paymentFailure');
	if(action == 'Payment' && (reason == 'true' || reason == 'repay')){
		checkoutHelper.showLoadingImage();
	}
	
   nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
   		autoescape: true,
   		web: {
   			useCache: true
   		}
   	});
   	var config = {};
   	config.baseUrl = 'wcsstore/DMartStoreFrontAssetStore/javascript/DMart';
   	config.homeURL = '${env_TopCategoriesDisplayURL}';
   	config.contentbaseURL = '${env_TopCategoriesDisplayURLHierarchy}';
   	config.currYear = new Date().getFullYear();
   		$('#checkoutListing').html(nunjucks.render('delivery.nunjucks', {
   			data: config
   		}));
   	
   	checkoutHelper.fetchEmergencyMessageHeader();
   	
	if(action == 'Payment' && (reason == 'true' || reason == 'repay')){
		checkoutHelper.init();
		checkoutHelper.stopLoadingImage();	
	}else{
	   	checkoutHelper.getLocation("dmart.checkout.pageLoad.completed");
	}

	//$(document).trigger('dmart.checkout.pageLoad.completed');
	var pincodeCookie = getCookie("DMART_Pincode_Cookie");
	if(typeof pincodeCookie != 'undefined'){
	pincodeCookie = pincodeCookie.split('_');
	$('.delivery-code').find('.delivery-code__pin').html(pincodeCookie[1]);
	}
});

  </script>  
  <script type="text/javascript">
  var userType = '${userType}';
  var storeId = ${storeId};
  var orderId = '${WCParam.orderId}';
  if(orderId.length>0){
  	orderId = parseInt(orderId);
  }else{
  	orderId = checkoutHelper.getParameterByName('orderId');
  }
  var pupAddress = "";
  var pinCode = "";
  var latitude = "";
  var longitude = "";
  var checkoutObjects = {};
  var jsonObjOnPage = {};
  var isCheckoutPage = true;
  var recalPrice = false;
  var nonStockItemsInTrolley = false;
  var cartMinThreshold = parseInt('${cartMinThreshold}');
  var primaryAddress = "";
  var favouritePUP = "";
  
  var storePinCookieVal = getCookie("DMART_Pincode_Cookie");
	if(storePinCookieVal != null){
		$('#locationModal').hide();
		var pin = storePinCookieVal.split("_");
		var cookiePin = pin[1];
		if(cookiePin != null){
			 pinCode = cookiePin;
		}	
	}
  
$(document).bind(
        'dmart.checkout.pageLoad.completed',
        function(e) {
            checkoutHelper.init();
        });          

</script>

<c:if test="${WCParam.paymentFailure eq 'true'}">
	<input id="BillDeskResponseMsg" name="responseMsg" value="<fmt:message bundle="${storeText}" key="GENERIC_PAYMENT_ERROR"/>" type="hidden">
</c:if>
<%--<script src="${jsAssetsDir}javascript/DMart/payment/payment.js"></script>--%>

	<form id="NetBankingBilldesk" method="post" action="${netBankingURL}">
			<input id="NetBankingMessage" name="msg" value="" type="hidden">
 </form>
	  
<script src="${ccValidationPath}" type="text/javascript"></script>
	  
	  <form id="CCBilldesk" method="post" action="javascript:;">
	  
			<input name="msg" value="" type="hidden" id="CCMessage">
			
			<input name="cnumber" value="" type="hidden" id="cnumber">
			<input name="expmon"  value="" type="hidden" id="expmon">
			<input name="expyr"   value="" type="hidden" id="expyr">
			<input name="cname2"  value="" type="hidden" id="cname2">
			<input name="cvv2"    value="" type="hidden" id="cvv2">
			
	 </form>

<div class="row" id="checkoutHeader"></div>
<div class="row" id="checkoutListing"></div>
<div id="loadingActionDiv" class="modal-dialog js-modal-dialog-esc">
<img id="loadingsymbol"  style="position: absolute; margin: auto; top: 0; left: 0; right: 0; bottom: 0;" src="/wcsstore/DMartStoreFrontAssetStore/images/CheckoutLoader.gif" alt="Please Wait">
</div>

</body>

</html>