
var orderStatusHelper = {
		
		urlPrefix : window.location.protocol + '//' + window.location.hostname,
		urlPrefixWcs : window.location.protocol + '//' + window.location.hostname ,
		wcsResources : '/wcs/resources/store/',
		searchResources :  '/search/resources/store/' ,
		orderStatusDetail : {},
		storeId : WCParamJS.storeId || '10151',
	    catalogId : WCParamJS.catalogId,
		langId : WCParamJS.langId,
		monthNamesObj : {
    	    "Jan": "January",
    	    "Feb": "February",
    	    "Mar": "March",
    	    "Apr": "April",
    	    "May": "May",
    	    "Jun": "June",
    	    "Jul": "July",
    	    "Aug": "August",
    	    "Sep": "September",
    	    "Oct": "October",
    	    "Nov": "November",
    	    "Dec": "December"
    	},
	
    displayOrderDetail: function( divId, responseData, responseSlotData, additionalInfo) {
            var JSONdata = {};
        	var oiAttributeJSON = {};
        	var orderItemIds = [];
        	var catentryIds = [];
    		var imgUrl= WCParamJS.imageServerHost;
    		this.config= {'baseUrl':imgUrl};
    		var totalQuantity = 0;
    		var totalItemLevelSavings = 0;
    		var self = this;
    		 self.orderStatusDetail.orderItems = {};
			 self.orderStatusDetail.orderItemsArray = [];
			 var data = responseData;
			 var slotData = responseSlotData;
			 var ordAddInfo = additionalInfo;
			 var cartTotal = 0;
			 $.each(responseData.orderStatusDetails.orderItemDetails,function(){
				 var orderItemDetail = this;
			 
			// for(var i=0; i<data.orderStatusDetails.orderDetails.totalNoOfProds; i++){
			 
				 var tempOrderItem = {};
				 //var orderItemDetail = 'orderItem_'+i;
				 tempOrderItem.orderItemId = orderItemDetail.orderItemsId;
				 orderItemIds.push(orderItemDetail.orderItemsId);
				 catentryIds.push(orderItemDetail.productId);
				 tempOrderItem.partNumber = orderItemDetail.partNumber;
				 tempOrderItem.catentryId = orderItemDetail.productId;
				 tempOrderItem.quantity = parseInt(orderItemDetail.totalItemQuantity);
				 
				 /*if(tempOrderItem.orderItemCRStatus){
					 tempOrderItem.orderItemStatusText = DashBoardHelper.statusMapper(data.orderStatusDetails[orderItemDetail].orderItemStatus);
				 }*/
				 tempOrderItem.unitPrice = parseFloat(orderItemDetail.unitPrice);
				 tempOrderItem.orderItemPrice = parseFloat(orderItemDetail.orderItemTotalPrice);
				 tempOrderItem.orderItemAdjustment = parseFloat(orderItemDetail.itemLevelDiscount);
				 tempOrderItem.orderItemAdjustedPrice =  tempOrderItem.orderItemPrice + tempOrderItem.orderItemAdjustment;
				 cartTotal +=  tempOrderItem.orderItemAdjustedPrice;
				 tempOrderItem.orderItemStatus = orderItemDetail.orderItemStatus;
				 tempOrderItem.firstName = data.orderStatusDetails.addressDetails.firstName;
				 tempOrderItem.field2 = orderItemDetail.orderItemPPAndMRP;
				 tempOrderItem.rq = 0;
				 tempOrderItem.cq = 0; 
				 tempOrderItem.savings = parseFloat(0);
				
				 var priceChange = false;
				 if(orderItemDetail.orderItemPPAndMRP != '' && orderItemDetail.orderItemPPAndMRP != undefined 
						 && orderItemDetail.orderItemPPAndMRP != null){
					 var pp = JSON.parse(orderItemDetail.orderItemPPAndMRP.replace(/\\"/g,'"')).PP;
					 if(pp != undefined && pp != null && pp != ''){
						 tempOrderItem.previousPrice = parseFloat(pp);
						 if(tempOrderItem.unitPrice !=  tempOrderItem.previousPrice ){
							 priceChange = true;
						 }
					 }
					 var mrp = JSON.parse(orderItemDetail.orderItemPPAndMRP.replace(/\\"/g,'"')).MRP;
					 if(mrp != undefined && mrp != null && mrp != ''){
						tempOrderItem.calculatedMRP = parseFloat(mrp); //Fix for AE-10841
						var save = (tempOrderItem.quantity * parseFloat(mrp)) - tempOrderItem.orderItemAdjustedPrice ;
						tempOrderItem.savings =  save.toFixed(2);
						totalItemLevelSavings = totalItemLevelSavings + parseFloat(tempOrderItem.savings);
					 }
					 //Getting the Cancelled Quantity
					 var cq = JSON.parse(orderItemDetail.orderItemPPAndMRP.replace(/\\"/g,'"')).CQ;
					 if(cq != undefined && cq != null && cq != ''){
							tempOrderItem.cq = cq;
					 }
					//Getting the Returned Quantity
					 var rq = JSON.parse(orderItemDetail.orderItemPPAndMRP.replace(/\\"/g,'"')).RQ;
					 if(rq != undefined && rq != null && rq != ''){
							tempOrderItem.rq = rq;
					 }
				 }
				//Check if order item is either cancelled or returned.
				 var crStat = DashBoardHelper.checkOICancelReturnedStatus(tempOrderItem.orderItemStatus,tempOrderItem.cq,tempOrderItem.rq);
				 tempOrderItem.orderItemCRStatus = crStat.cancelReturnFlag;
				 tempOrderItem.orderItemCanStatusText ='';
				 tempOrderItem.orderItemRetStatusText ='';
				 if(tempOrderItem.orderItemCRStatus){
					  var stCanTxt = DashBoardHelper.statusMapper(crStat.oiCanStatus);
					  var stRetTxt = DashBoardHelper.statusMapper(crStat.oiRetStatus);
					  if(tempOrderItem.cq>0 && stCanTxt != 'Status Unknown'){
						  stCanTxt = stCanTxt + '('+ tempOrderItem.cq+ ')';
						  tempOrderItem.orderItemCanStatusText = stCanTxt;
					  } 
					  if(tempOrderItem.rq > 0 && stRetTxt != 'Status Unknown'){
						  stRetTxt = stRetTxt + '('+ tempOrderItem.rq+ ')';
						  tempOrderItem.orderItemRetStatusText = stRetTxt;
					  }
				 }
				 tempOrderItem.priceChangeFlag = priceChange;
				 tempOrderItem.lastName = data.orderStatusDetails.addressDetails.lastName;
				 tempOrderItem.middleName = data.orderStatusDetails.addressDetails.middleName;
				 tempOrderItem.addressLine1 = data.orderStatusDetails.addressDetails.address1;
				 tempOrderItem.addressLine2 = data.orderStatusDetails.addressDetails.address2;
				 tempOrderItem.addressLine3 = data.orderStatusDetails.addressDetails.address3;
				 tempOrderItem.city = data.orderStatusDetails.addressDetails.city;
				 tempOrderItem.state = data.orderStatusDetails.addressDetails.state;
				 tempOrderItem.country = data.orderStatusDetails.addressDetails.country;
				 tempOrderItem.zipCode = data.orderStatusDetails.addressDetails.zipcode;
				 if(data.orderStatusDetails.addressDetails.phone == null){  // Fix for JIRA 9966
					 tempOrderItem.phone1 = '';
				 }else{
					 tempOrderItem.phone1 = data.orderStatusDetails.addressDetails.phone;
				 }
				 totalQuantity = totalQuantity + parseInt(orderItemDetail.totalItemQuantity);
				 self.orderStatusDetail.orderItems[orderItemDetail.orderItemsId]=tempOrderItem;
				 self.orderStatusDetail.orderItemsArray.push(tempOrderItem);
				 
			 });
			 
			 //Call getItemDetailsFromSOLR()
			 DashBoardHelper.getItemDetailsFromSOLR(catentryIds,ordAddInfo.storeIdOrder);
			 oiAttributeJSON.orderItems = self.orderStatusDetail.orderItems;
			 oiAttributeJSON = DashBoardHelper.packProductAttributes(oiAttributeJSON,ordAddInfo.storeIdOrder);
			 
			 self.orderStatusDetail.orderIdentifier = data.orderStatusDetails.orderDetails.orderId;
			 self.orderStatusDetail.deliveryMode = data.orderStatusDetails.orderDetails.shipModeCode;
			 self.orderStatusDetail.slotStartTime = slotData.SlotDetails.slotStartTime;
			 self.orderStatusDetail.slotEndTime = slotData.SlotDetails.slotEndTime;
			 self.orderStatusDetail.slotDate = slotData.SlotDetails.slotDate.substr(0, 3)+orderStatusHelper.monthNamesObj[slotData.SlotDetails.slotDate.substr(3, 3)]+slotData.SlotDetails.slotDate.substr(6, 5);
			 self.orderStatusDetail.orderPlacedDate = data.orderStatusDetails.orderDetails.orderDate.substr(0, 3)+orderStatusHelper.monthNamesObj[data.orderStatusDetails.orderDetails.orderDate.substr(3, 3)]+data.orderStatusDetails.orderDetails.orderDate.substr(6, 5);
			 self.orderStatusDetail.paymentMethod = data.orderStatusDetails.orderDetails.modeOfPayment.split('|')[0];
			 self.orderStatusDetail.totalProductPrice = parseFloat(data.orderStatusDetails.orderDetails.orderTotalPrice);
			 self.orderStatusDetail.cartTotal = cartTotal;
			 var orderGrandTotal = parseFloat(data.orderStatusDetails.orderDetails.orderTotalPrice)+
			 parseFloat(data.orderStatusDetails.orderDetails.orderShippingCharge)+parseFloat(data.orderStatusDetails.orderDetails.orderTotalAdjustment);
			 self.orderStatusDetail.grandTotal = parseFloat(orderGrandTotal);
			 self.orderStatusDetail.codRounded = parseFloat(ordAddInfo.codRoundedOrderTotal);		
			 //self.orderStatusDetail.codRounded = (orderGrandTotal % 1) > 0.56 ? Math.ceil(orderGrandTotal) : Math.floor(orderGrandTotal);
			 self.orderStatusDetail.tax = parseFloat(data.orderStatusDetails.orderDetails.orderTax);
			 self.orderStatusDetail.totalAdjustment = parseFloat(data.orderStatusDetails.orderDetails.orderTotalAdjustment);
			 self.orderStatusDetail.orderLevelDiscount = Math.abs(parseFloat(data.orderStatusDetails.orderDetails.orderLevelDiscount));
			 self.orderStatusDetail.orderLevelDiscount= parseFloat(self.orderStatusDetail.orderLevelDiscount.toFixed(2));
			 self.orderStatusDetail.totalItemLevelSavings = parseFloat(totalItemLevelSavings.toFixed(2));
			 self.orderStatusDetail.totalShippingCharge = parseFloat(data.orderStatusDetails.orderDetails.orderShippingCharge);
			 self.orderStatusDetail.orderLevelQuantity = totalQuantity;
			 self.orderStatusDetail.orderStatus = data.orderStatusDetails.orderDetails.orderStatus;
			 self.orderStatusDetail.statusText = DashBoardHelper.statusMapper(data.orderStatusDetails.orderDetails.orderStatus);
			 if(data.orderStatusDetails.orderDetails.orderStatus == 'M' || data.orderStatusDetails.orderDetails.orderStatus == 'F'){
				 	var modeOfPayment = self.orderStatusDetail.paymentMethod;
					if(modeOfPayment && modeOfPayment =='Cash On Delivery'){ //COD order
		    			self.orderStatusDetail.statusText = 'Under Process';
		    		}
			 }
			 self.orderStatusDetail.orderItemIds= orderItemIds;
			 self.orderStatusDetail.isSlotChangeEligible = false;
			 self.orderStatusDetail.discount=self.orderStatusDetail.orderLevelDiscount;
			 self.orderStatusDetail.shipmentDiscount=0;
			 
			 //For the order items and attributes
			 self.orderStatusDetail.oiAttributes = oiAttributeJSON;
			 
			 // Make this dynamic
			 self.orderStatusDetail.isItemCancelled = false;
			 self.orderStatusDetail.howManyCancelled = 0;
			 // Make this dynamic
			 
			 nunjucks.configure(WCParamJS.staticServerHost+'templates/',{ autoescape: true, web : {useCache:true} });
			 JSONdata.orderDetail = self.orderStatusDetail;
			 JSONdata.config=this.config;
			 JSONdata.storeId = self.storeId;
			 JSONdata.catalogId = self.catalogId;
			 JSONdata.langId = self.langId;
			 JSONdata.noImagePath=WCParamJS.staticServerHost+'/images/DMart/NoImage_T.jpg';
			 var htmlcode = nunjucks.render('order-details.nunjucks', {data:JSONdata});
			 $('#'+divId).html(htmlcode);
    }
  
    
   
};

