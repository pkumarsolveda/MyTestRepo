<!DOCTYPE html>
<html lang="en">
<head>
<title>Order Confirmation | DMart</title>
<link rel="shortcut icon" href="/wcsstore/DMartStoreFrontAssetStore/images/icon-favicon.ico" mce_href="/wcsstore/DMartStoreFrontAssetStore/images/icon-favicon.ico"/>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="description" content="">
<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,user-scalable=no">
<meta name="robots" content="noindex,nofollow" />

</head>
<body class="margin-reset">
<%@ include file= "../../Common/EnvironmentSetup.jspf" %>
<script type="text/javascript" src="//maps.googleapis.com/maps/api/js?sensor=false"></script>
<c:set var="pageGroup" value="Checkout" />
<%@ include file="InitiateCheckoutImports.jspf" %>

<input id="BillDeskResponseMsgConf" name="responseMsg" value="${WCParam.respMesg}" type="hidden">
<input id="overallStatus" name="overallStatus" value="${WCParam.overallStatus}" type="hidden">
<%
	StoreConfigurationRegistry scfRegistry = (StoreConfigurationRegistry) RegistryManager.singleton().getRegistry("StoreConfigurationRegistry");
	String customerCarePhone = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.CustomerCare.PhoneNumber");
	pageContext.setAttribute("customerCarePhone", customerCarePhone);
%>
<input type="hidden" name="customerCarePhone" value="${customerCarePhone}" id="customerCarePhone" />		  
<script type="text/javascript">
var storeId = ${storeId};
var checkoutConfirm = 'true';
dojo.addOnLoad(function() {
	var homeURL = '${env_TopCategoriesDisplayURL}';
	var isOrderPlaced = checkoutHelper.getCheckoutObjects('confirmOrder');
	// check if a page reload
	if (typeof isOrderPlaced != 'undefined' && typeof isOrderPlaced1 != 'undefined') {
	    document.location.href = homeURL;
	}else{
  	var data = {};
  	var orderIdReq = checkoutHelper.getParameterByName('orderId');
	var orderRepay = DMStorage.getValue('OrderIdRepay');
	if (orderRepay != null && orderRepay.orderId != null && orderRepay.orderId == orderIdReq){
		var orderObj =  orderRepay;
  		var addressObj = checkoutHelper.getCheckoutObjects('addressObjRepay');
  		var slotObj = checkoutHelper.getCheckoutObjects('slotObjRepay');
	}else{
		var orderObj =  DMStorage.getValue('OrderId');
	  	var addressObj = checkoutHelper.getCheckoutObjects('addressObj');
  		var slotObj = checkoutHelper.getCheckoutObjects('slotObj');
  		
	}
	if(orderObj.orderId != addressObj.orderId || ( typeof getCookie('CartFlag') != "undefined" && !CartHelper.storageValidForThisProtocol())){
		document.location.href = homeURL;
	}	
  	data.orderId = addressObj.orderId;
  	data.addressData = addressObj.addressData.split('||');
  	data.addressData[1]=data.addressData[1].replace(/(\r\n|\n|\r)/gm,"");
  	data.slotData = slotObj;
  	data.orderData = orderObj;
  	
  	data.paymentMode = checkoutHelper.getCheckoutObjects('paymentMode');
  	
	data.orderData.totalMinusDiscount = parseFloat(orderObj.total) - parseFloat(orderObj.discount);
  	data.orderData.totalMinusDiscount = CartHelper.formatPricesForDisplay(data.orderData.totalMinusDiscount);
  	data.orderData.totalSavingsPlusDiscount = parseFloat(orderObj.totalSavings) + parseFloat(orderObj.discount);
  	data.orderData.totalSavingsPlusDiscount = CartHelper.formatPricesForDisplay(data.orderData.totalSavingsPlusDiscount);
	data.orderData.total = CartHelper.formatPricesForDisplay(data.orderData.total);
	data.orderData.discount = CartHelper.formatPricesForDisplay(data.orderData.discount);
	data.orderData.totalShippingCharge = CartHelper.formatPricesForDisplay(data.orderData.totalShippingCharge);
	/*data.orderData.grandTotal = CartHelper.formatPricesForDisplay(data.paymentMode == "Cash On Delivery" ? 
					Math.round(data.orderData.grandTotal) : data.orderData.grandTotal);*/
	data.orderData.grandTotal = CartHelper.formatPricesForDisplay(data.orderData.grandTotal);
	if(data.paymentMode== "Cash On Delivery"){
		data.orderData.amountYouPay = data.orderData.x_codRoundedOrderTotal;
	}
	data.orderData.tax = CartHelper.formatPricesForDisplay(data.orderData.tax);
  	data.customerCareNumber = $('#customerCarePhone').val();
  	data.storeId = storeId;
  	var imgUrl= window.location.origin+'/webapp/wcs/stores/servlet/';
  	this.config= {'baseUrl':imgUrl};
  	data.config = this.config;
  	data.catalogId = WCParamJS.catalogId;  	
  	data.homeURL = homeURL;
  	data.selectedShipMode = addressObj.selectedShipMode=='Pick up Point'?'DMart Ready Pick-up Point':addressObj.selectedShipMode;
  	data.fulfillmentType = (addressObj.selectedShipMode != 'Home Delivery') ? "Pick-up Point ": "Delivery ";
  	
  	if($('#BillDeskResponseMsgConf').val() != '' && $('#BillDeskResponseMsgConf').val() != null && $('#overallStatus').val() == 'Pending'){
  		data.confirmationMessage = $('#BillDeskResponseMsgConf').val();
  		data.success=false;
	}else{
		data.confirmationMessage1 = "Thank You! Your order ";
		data.confirmationMessage2 = " has been placed successfully!";
		data.success=true;
	}
  	
	data.viewOrderUrl = imgUrl;
  	if(storeUserType == 'R'){
  		data.viewOrderUrl = data.viewOrderUrl + 'OrderDetailsView?catalogId='+data.catalogId+'&isTrackOrder=false&langId=-1&storeId='+data.storeId+'&orderId='+data.orderId;
  	}else{
  		var strArray, phoneNumber;
       	if(typeof userFieldValue != "undefined" && userFieldValue!=null && userFieldValue != ""){
    		strArray = userFieldValue.split("_");
			phoneNumber = strArray[0];
    	}	
  		data.viewOrderUrl = data.viewOrderUrl + 'TrackOrderDetailsView?catalogId='+data.catalogId+'&langId=-1&storeId='+data.storeId+'&orderId='+data.orderId+'&mobileNumber='+phoneNumber;
  	}
  	data.currYear = new Date().getFullYear();
  	if(addressObj.selectedShipMode=='Pick up Point'){
  		data.selectedPUP=addressObj.pupName
  		data.landmark=data.addressData[2].indexOf('Landmark')>-1 ? data.addressData[2].substring(data.addressData[2].indexOf('Landmark')).trim():null;
  		if(data.addressData[2].indexOf('Landmark')>-1)
  			data.addressData.splice(2,1);
  		}
  	else{
  	data.landmark=data.addressData[1].indexOf('Landmark')>-1 ? data.addressData[1].substring(data.addressData[1].indexOf('Landmark')).trim():null;
  	}
	nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
  		autoescape: true,
  		web: {
  			useCache: true
  		}
  	});
  	
  	$('#checkoutListing').html(nunjucks.render('order-confirmation.nunjucks', {
  		data: data
	}));
	DMAnalytics.submitRevenueData();
	//sessionStorage.clear();
	
	checkoutHelper.saveCheckoutObjects('confirmOrderObj', data.orderId);
	dojo.cookie("DM_OrderId", null, {expires: -1,path: '/'});
	}
});

	dojo.addOnLoad(function() {
		var pincodeCookie = getCookie("DMART_Pincode_Cookie");
		if(typeof pincodeCookie != 'undefined'){
			pincodeCookie = pincodeCookie.split('_');
			$('.delivery-code').find('.delivery-code__pin').html(pincodeCookie[1]);
		}
	});
  </script>  

<div class="row" id="checkoutHeader"></div>
<div class="row" id="checkoutListing"></div>
</body>
</html>