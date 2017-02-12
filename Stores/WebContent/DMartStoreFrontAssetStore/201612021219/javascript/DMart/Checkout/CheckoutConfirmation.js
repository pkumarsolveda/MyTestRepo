/**
 * Helper class for showing  checkout confirmation
 */
var checkoutConfirmation = {
		
		init: function (){
			var isOrderPlaced = checkoutHelper.getCheckoutObjects('confirmOrder');
		  	var data = {};
		  	var addressObj = checkoutHelper.getCheckoutObjects('addressObj');
		  	var slotObj = checkoutHelper.getCheckoutObjects('slotObj');
		  	var orderObj =  DMStorage.getValue('OrderId');
		  	data.orderId = addressObj.orderId;
		  	data.addressData = addressObj.addressData.split('||');
		  	data.slotData = slotObj;
		  	data.orderData = orderObj;
		  	
		  	data.paymentMode = checkoutHelper.getCheckoutObjects('paymentMode');;
		  	data.selectedShipMode = addressObj.selectedShipMode;
		  	
		  	data.orderData.totalMinusDiscount = parseFloat(orderObj.total) - parseFloat(orderObj.discount);
		  	data.orderData.totalMinusDiscount = CartHelper.formatPricesForDisplay(data.orderData.totalMinusDiscount);
		  	data.orderData.totalSavingsPlusDiscount = parseFloat(orderObj.totalSavings) + parseFloat(orderObj.discount);
		  	data.orderData.totalSavingsPlusDiscount = CartHelper.formatPricesForDisplay(data.orderData.totalSavingsPlusDiscount);
			data.orderData.total = CartHelper.formatPricesForDisplay(data.orderData.total);
			data.orderData.discount = CartHelper.formatPricesForDisplay(data.orderData.discount);
			data.orderData.totalShippingCharge = CartHelper.formatPricesForDisplay(data.orderData.totalShippingCharge);
			/*data.orderData.grandTotal = CartHelper.formatPricesForDisplay(data.paymentMode== "Cash On Delivery" ? 
					Math.round(data.orderData.grandTotal) : data.orderData.grandTotal);*/
			data.orderData.grandTotal = CartHelper.formatPricesForDisplay(data.orderData.grandTotal);
			if(data.paymentMode== "Cash On Delivery"){
				data.orderData.amountYouPay = data.orderData.x_codRoundedOrderTotal;
			}
			data.orderData.tax = CartHelper.formatPricesForDisplay(data.orderData.tax);
		  	
		  	
		  	
		  	data.homeURL = homeURL;
		  	
		  	var imgUrl= window.location.origin+'/webapp/wcs/stores/servlet/';
		  	var config= {'baseUrl':imgUrl};
		  	data.config = config;
		  	
		  	if($('#BillDeskResponseMsg').val() != '' && $('#BillDeskResponseMsg').val() != null ){
		  		data.confirmationMessage = $('#BillDeskResponseMsg').val();
			}else{
				data.confirmationMessage = "Your order has been successfully placed!";
			}
		  	
		  	data.viewOrderUrl = imgUrl;
		  	if(storeUserType == 'R'){
		  		data.viewOrderUrl = data.viewOrderUrl + 'OrderDetailsView?catalogId='+data.catalogId+'&isTrackOrder=false&langId=-1&storeId='+data.storeId+'&orderId='+data.orderId;
		  	}else{
		  		data.viewOrderUrl = data.viewOrderUrl + 'TrackOrderDetailsView?catalogId='+data.catalogId+'&langId=-1&storeId='+data.storeId+'&orderId='+data.orderId;
		  	}
		  	
		  	nunjucks.configure(WCParamJS.staticServerHost+ 'templates/', {
		  		autoescape: true,
		  		web: {
		  			useCache: true
		  		}
		  	});
		  	
		  	$('#checkoutListing').html(nunjucks.render('order-confirmation.nunjucks', {
		  		data: data
			}));
			//sessionStorage.clear();
			dojo.cookie("DM_OrderId", null, {expires: -1,path: '/'});
			var pinCode = getCookie("DMART_Pincode_Cookie").split("_")[1];
			$("#delivery_pin").html(pinCode);
			$('.main-menu__location-mini span').html(pinCode+' <i class="icon-delivery-caret-down icon-caret-down"></i>');
		},

    
};
