(function(dmUIConfig) {
	$(document).ready(function () {
		
		$(document).on('keydown', '#guestOrderId, #guestMobileNumber', function () {
			$('#guestOrderDetails #validationMsg').hide();
		});
		
	});
}(DM_UI_CONFIG));


orderStatus = {
urlPrefixWcs : window.location.protocol + '//' + window.location.hostname + '/wcs/resources/store/',
wcsResources : '/wcs/resources/store/' ,
validateOrderAndMemberId: function(form) {
	if($('#guestOrderDetails').valid()){
		var targetNode = dojo.byId("validationMsg");		
		var parameters = {};
		 parameters.mobileNumber = form.guestMobileNumber.value;
		 parameters.orderId = form.guestOrderId.value;
		 
		 dojo.xhrPost({
			    url: "GuestOrderStatusValidation",				
			    handleAs: "json",
			    content: parameters,
			    service: this,
			    load: function(response){
			    	
			    	if(response.isUserIdAndOrderIdValid){
			    		
			    		var redirectURl = 	"TrackOrderDetailsView?";
		                if(form.storeId) {
		                	redirectURl += 'storeId='+form.storeId.value;
		                }
		              if(form.catalogId) {
		            	  redirectURl += '&catalogId='+form.catalogId.value;
		              }
		              if(form.langId) {
		            	  redirectURl += '&langId='+form.langId.value;
		              }
		              redirectURl += '&mobileNumber='+form.guestMobileNumber.value+'&orderId='+form.guestOrderId.value;
			    		  window.location = redirectURl;
			    		  DMAnalytics.events( DMAnalytics.Constants.Category.orderStatus, "inputData: "+JSON.stringify(parameters) , document.title, 0,null );
			    	}else{
			    		$('#guestOrderDetails #validationMsg').show();
			    		error= "Please check the Order Id and Mobile Number.";
			    		targetNode.innerHTML = error;
			    	}
			    },
			    error: function(errObj,ioArgs) {
			    	targetNode.innerHTML = "Order Id is not valid.";
			    }
		 });
	}

    },
getOrderDetails: function(orderId,mob){
	$.ajax({
        url: this.urlPrefixWcs+WCParamJS.storeId+'/order/ordStatus/'+orderId+'?mobileNumber='+mob,
        method: 'GET',
        context: this,
		cache : false,
		async: false
        
    }).done(function (data) {
    	var isTrackOrder = data.isTrackOrder;
    	var orderStatusDetails = data.orderStatusDetails;
    	var slotDetails = data.slotDetails;
    	var orderAddInfo = data.orderAdditionalInfo;
     	if(isTrackOrder != false && isTrackOrder){
     		$(document).on('dmart.topcatinfo.loaded', 
     			function() { 
     			orderStatusHelper.displayOrderDetail('OrderDetails',orderStatusDetails,slotDetails,orderAddInfo); 
    		}); 
        }else{ 
     	   	$(document).on('dmart.topcatinfo.loaded', 
     				function() { 
    				DashBoardHelper.renderOrderDetails('OrderDetails',orderId);
     			}); 
     	} 
		$(document).trigger('dmart.topcatinfo.loaded');
		/*var nowTime = new Date().getTime();
		if(data.updateTime!= '' && ((nowTime-data.updateTime)/60000) > 5){
			console.log("data.updateTime " +data.updateTime);
			console.log("Order details page refresh after 5 mins");
			window.location.href = window.location.origin+'/webapp/wcs/stores/servlet/' + 'TrackOrderDetailsView?storeId='+${storeId}+'&catalogId='+${catalogId}+'&langId=-1&mobileNumber='+${WCParam.mobileNumber}+'&orderId='+${orderIdentifier};
		}*/
    }).error(function (data) {
    	console.log('fail');
  	
    });
}
};