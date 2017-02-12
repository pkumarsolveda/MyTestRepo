/**
 * Helper class for showing error messages
 * 
 */
var errorMessageHelper = {

    showGenericError: function(errorMsg) {
        if (errorMsg && errorMsg.length > 0) {
            $('#generic-error-section').html(errorMsg);
            $('#error-msg-container').parent().css("float", "none");
            $('.alert.alert-warning-bg.js-alert-order').show();
            $('#generic-error-section').parents('.container').show();
            $("html, body").animate({
                scrollTop: 0
            }, 600);
            if($("#positionError")){
            	$("#positionError").css("display", "block");
            }
        }
    },
    
    hideError: function() {        
            $('#generic-error-section').html("");
            //$('#error-msg-container').parent().css("float", "none");
            $('.alert.alert-warning-bg.js-alert-order').hide();
            $('#generic-error-section').closest('.container').hide();            
    },

    saveunavailableItems: function() {
        if (typeof OOSitemArray != 'undefined' && OOSitemArray.length > 0) {
            var OOSitemMap = {};
            OOSitemMap.orderId = $('#newOrderId').val();
            OOSitemMap.unavailableItems = OOSitemArray;
            DMStorage.set('OOSitemsList', OOSitemMap);
            if(typeof nonStockItemsInTrolley != 'undefined'){
            	nonStockItemsInTrolley = true;
    		}
        }

    },
    checkAndDisplayErrors: function() {
    	if(!getCookie('DM_OrderId') && DMStorage.getValue('allItemsOOS') != "Y") {
    		// No need for OOSitemsList if there is no cart
    		localStorage.removeItem('OOSitemsList');
    	}
    	// check for all error conditions here
    	// AE-15002- OOS should be shown only in cart page - reverting now
        if (localStorage.getItem('OOSitemsList') != null) {
        	errorMessageHelper.showGenericError('Some item in your cart have been sold out and will be removed as you proceed to checkout or continue shopping.');
        }
        
        var notAddedItems =  $('#notAddedItems').val();
        if(typeof notAddedItems != 'undefined' && notAddedItems.length > 2){
        	errorMessageHelper.showGenericError('Some items in your cart are unavailable in the current pincode and is not added to your cart.');
        }
        

    },
    removeDuplicatesFromList: function(array){
    	var temp = {};
    	for (var i = 0; i < array.length; i++)
            temp[array[i]] = true;
        var uniqueList = [];
        for (var k in temp)
        	uniqueList.push(k);
        return uniqueList;
    },
    removeUnavailableItems: function() {
        var OOSitemsList = DMStorage.getValue('OOSitemsList');
        if(window.location.pathname.indexOf("myCart")>-1){
        	var excludedItems = DMStorage.getValue('PincodeExcludedItems');
        	if(excludedItems != null){
        		if(OOSitemsList == null){
					var OOSitemsList = {};
					OOSitemsList.unavailableItems = excludedItems;
					DMStorage.set('OOSitemsList',OOSitemsList);
				}else{
					OOSitemsList.unavailableItems  = this.removeDuplicatesFromList
							(OOSitemsList.unavailableItems.concat(excludedItems));
				}
				localStorage.removeItem('PincodeExcludedItems');
        	}			
		}
        if (OOSitemsList != null) {
            $(document).trigger('dmart.generic.action.inprogress');
            var cartJSON = DMStorage.getValue('OrderId');
            var params = {};
            var iter = 1;
            if(cartJSON == null){
            	/*localStorage.removeItem('OOSitemsList');
            	$(document).trigger('dmart.generic.action.completed');
            	return false; */
            	$.each(OOSitemsList.unavailableItems, function(i, item) {
                		params["orderItemId_" + parseInt(iter)] = parseInt(item);
                		params["quantity_" + parseInt(iter)] = parseFloat('0.00');
                		iter = iter +1;
                });
            }else{
            	var orderItemIdsinCart = [];
                $.each(cartJSON.orderItems,function(idx,orderItem){
               		orderItemIdsinCart.push(orderItem.orderItemId)
               	});
                $.each(OOSitemsList.unavailableItems, function(i, item) {
                	if(orderItemIdsinCart.indexOf(item) > -1){
                		params["orderItemId_" + parseInt(iter)] = parseInt(item);
                		params["quantity_" + parseInt(iter)] = parseFloat('0.00');
                		iter = iter +1;
                	}
                });
            }            
            if(iter == 1){
            	localStorage.removeItem('OOSitemsList');
            	$(document).trigger('dmart.generic.action.completed');
            	return false;
            }
            params.storeId = WCParamJS.storeId;
            params.catalogId = WCParamJS.catalogId;
            params.langId = WCParamJS.langId;
            params.orderId = OOSitemsList.orderId;
            var urlString = window.location.origin+'/webapp/wcs/stores/servlet/';
    		if(previewToken){
    			urlString = window.location.origin+'/webapp/wcs/preview/servlet/';
    		}
            $.ajax({
                    url: urlString + "AjaxRESTOrderItemUpdate",
                    method: 'POST',
                    context: this,
                    async: false,
                    data: params,
                })
                .done(
                    function(data) {
                        dojo.cookie("DM_OrderId", null, {
                            expires: -1,
                            path: '/'
                        });
                        localStorage.removeItem('orderId');
                        localStorage.removeItem('OOSitemsList');
                        if(typeof isCheckoutPage == 'undefined'){
                        	// reloading the page to render correct page
	                        if(window.location.href.indexOf('storeMigrationOOSItems') > -1){
	                        	window.location.href = window.location.href
	                            .replace('storeMigrationOOSItems',
	                                'deletedItems');
	                        }else{
	                        	location.reload();
	                        }                        
                        }
						else {
							checkoutHelper.invokeCartSummary();
							$(document).trigger(
                            'dmart.generic.action.completed');
						}
                    })
                .fail(
                    function(data) {
                        this
                            .showGenericError(' Error in deleting the out of stock items');
                        $(document).trigger(
                            'dmart.generic.action.completed');
                    }); 
        }
    },

    showLoadingImage: function() {
        $('#loadingActionDiv').show();
    },
    stopLoadingImage: function() {
        $('#loadingActionDiv').hide();
    },
};
$(document).bind('dmart.generic.error.display', function() {
	
    errorMessageHelper.checkAndDisplayErrors();
});

$(document).on('click', '.js-cart-reject', function() {
	if((typeof isCheckoutPage == 'undefined') && $(this).parents('.js-coupon-applied').length===0){
	$(this).closest('.container').fadeOut(400, function() {
        $(this).hide();
    });
    errorMessageHelper.removeUnavailableItems();
    if($("#positionError")){
    	$("#positionError").css("display", "none");
    }
	}
});

$(document).bind('dmart.generic.action.inprogress',

    function(e) {
        errorMessageHelper.showLoadingImage();
    });

$(document).bind('dmart.generic.action.completed',

    function(e) {
        errorMessageHelper.stopLoadingImage();
    });