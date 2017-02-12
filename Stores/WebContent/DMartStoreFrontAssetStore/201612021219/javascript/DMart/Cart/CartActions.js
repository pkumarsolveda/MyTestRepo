/**
 * Event handlers for mini cart actions
 */

    // x Remove product from My Cart
    $(document).on('click', '.cart-details__item--remove a', function(){
    	var self = this;
    	var thisCartItemDiv = $(this).parents('.cart-details__item-lists');
    	if($(thisCartItemDiv).attr('data-removeTriggered') == 'true') {
    		return;
    	}
    	$(thisCartItemDiv).attr('data-removeTriggered','true');
    	
    	var orderItemId = $(thisCartItemDiv).data('orderitemid');
    	var productId = $(thisCartItemDiv).data('productid');
    	var itemId = $(thisCartItemDiv).data('itemid');
    	var params = {
    			orderItemId : orderItemId,
    			quantity : 0
    	};
    	if($(self).parents('.cart-details').length>0){
    		callUpdateCartService(params,cartDisplay.removeTroleyItem,[self,productId,itemId]);
    	}
    	else{
    		callUpdateCartService(params,MiniCartDisplay.removeMiniCartItem,[self,productId,itemId]);
    	}

    });
    
    // Update action from cart / minicart
    $(document).on('change', '.cart-details__item-list .cart-details-dropdown', function() {
    	var self = this;
    	var thisCartItemDiv = $(this).parents('.cart-details__item-lists');
    	var orderItemId = $(thisCartItemDiv).data('orderitemid');
    	var productId = $(thisCartItemDiv).data('productid');
    	var itemId = $(thisCartItemDiv).data('itemid');
    	
    	var newQty = $(this).val();

    	var params = {
    			orderItemId : orderItemId,
    			quantity : newQty
    	};
    	
    	if($(self).parents('.cart-details').length>0){
    		callUpdateCartService(params,cartDisplay.updateTroleyItem,[productId,itemId,newQty]);
    	}
    	else{
    		callUpdateCartService(params,MiniCartDisplay.updateMiniCartItem,[productId,itemId,newQty]);
    	}

    	
    });    

    

    function goToCart(){
    	window.location.href = 'myCart?storeId='+WCParamJS.storeId+'&catalogId='+WCParamJS.catalogId+'&langId='+WCParamJS.langId;
    }
    
    
//User applies promo code
    
    $(document).on('click','#formCoupon .input-group-btn',function(){
    	var code=$('#promeCode').val().toUpperCase();
    	if( $('#formCoupon').valid())
    		cartDisplay.applyPromoCode(code);
    });
    
    $(document).on('click','.share-cart-form button',function(){
    	if(storeUserType != 'G'){
    		if($('#formShareCartValidation').valid()){
    		var mob=$('#mobileNumber').val();
    		var email=$('#email').val();
    		var data={};
    		data.item=[];
    		var order=DMStorage.getValue('OrderId');
    		var itemId=[],qty=[];
    		var json={};
    		json.product={};
    		$.each(order.orderItems,function(index,order){
    			if(typeof order.freeGift !='undefined' && order.freeGift !="true"){
    			if(json.product[order.catentryId]){
    				json.product[order.catentryId].quantityRequested=(parseInt(order.quantity.toString()) +parseInt(json.product[order.catentryId].quantityRequested)).toString();
    			}
    			else{
    			    var struct={};
    			    struct.quantityRequested=order.quantity.toString();
    			     struct.productId=order.catentryId;
    				json.product[order.catentryId]=struct;
        			
    			}
    			}
    		});
    		$.each(json.product,function(){
    		    data.item.push(this);
    		});
    		
    		//var data={itdemIds:itemId,quantity:qty};
    		data.descriptionName="Guest Shared List";
    		data.description="Guest Shared List";
    		data.giftCardAccepted="false";
    		data.accessSpecifier="0";
    		if(mob.length>0){
    			data.x_field5=mob.toString();
    			cartDisplay.createSharedList(data,this);
    		}
    		else if(email.length>0){
    			data.x_field5=email;
    			cartDisplay.createSharedList(data,this);
    		}
    		
    	}
    	}
    	
    });

    