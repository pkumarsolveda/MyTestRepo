/**
 * Event handlers for mini cart actions
 */

    
    $(document).on('click', '.my-list .resp-tabs-list li', function(){
    	
    	var listId=$(this).val();
    	
    	if($('#'+listId).children().length == 0){
    	
    	//DMartShoppingListActionsJS.displayList(listId,this);
    	}
    	else{
    		$('#'+listId).show();
    		DMartShoppingListActionsJS.setAlertUI(listId);
    		//DMartShoppingListActionsJS.isLazyLoadFlag=true;
    		//$(window).scroll(DMartShoppingListActionsJS.scrollPage);
    	}
    	

    });
    /** Fix for AE-15547 STARTS **/
    /** Clear errors if clicked on a wishlist name **/
    $(document).on('click', '.product-listing-item__tertiary-lists li a', function(){
    	
    	var parent = $(this).parents('.product-listing-item__tertiary');
    	$(parent).find('.product-listing-item-list-error').css('display','none'); // this will hide the error message
		$(parent).find('.product-listing-item__tertiary--field.input-text-field').removeClass('input-text-field-error'); //this will remove error border fromtextbox.
		// this will enable the add button.
		$(parent).find('.product-listing-item__tertiary--add-cta.button').removeClass('button--disabled').removeClass('button-error').removeAttr('disabled'); 

    });
    /** Clear errors on focusout **/
    $(document).on('blur', '.product-listing-item__tertiary--field.input-text-field', function(){
    	
    	var parent = $(this).parents('.product-listing-item__tertiary');
    	$(parent).find('.product-listing-item-list-error').css('display','none'); // this will hide the error message
		$(parent).find('.product-listing-item__tertiary--field.input-text-field').removeClass('input-text-field-error'); //this will remove error border fromtextbox.
		// this will enable the add button.
		$(parent).find('.product-listing-item__tertiary--add-cta.button').removeClass('button--disabled').removeClass('button-error').removeAttr('disabled'); 

    });
    /** Clear errors on keyup **/
    $(document).on('keyup', '.product-listing-item__tertiary--field.input-text-field', function(event){
    	if(event.which == 13) {
    		return;
    	}
    	var parent = $(this).parents('.product-listing-item__tertiary');
    	$(parent).find('.product-listing-item-list-error').css('display','none'); // this will hide the error message
		$(parent).find('.product-listing-item__tertiary--field.input-text-field').removeClass('input-text-field-error'); //this will remove error border fromtextbox.
		// this will enable the add button.
		$(parent).find('.product-listing-item__tertiary--add-cta.button').removeClass('button--disabled').removeClass('button-error').removeAttr('disabled'); 

    });
    /** Fix for AE-15547 ENDS **/
    
    $(document).on('click', '.modal-dialog--clear-mylist .clear-mylist-confirm', function () {
        $(this).parents('.modal-dialog').hide();
        
        $('html, body').animate({
          scrollTop: 0
        }, 500);
        var listId=$('.resp-tabs-list .resp-tab-active').val();
        DMartShoppingListActionsJS.removeList(listId);

      });
    $(document).on('change','.my-list .product-listing-checkbox',function(){
    	if(!$(this).children('.product-alternate-checkbox').is(':checked')){
    		var itemId= $(this).parents('.product-listing-item__primary').data('itemid');
    		DMAnalytics.events( DMAnalytics.Constants.Category.UncheckEvent,"ItemId : "+itemId , document.title, 0,null );
    		
    	}
    });
    $(document).on('click', '#myList .existing-order__price-cta-btn', function () {
	      
	      if(!$(this).hasClass('button--disabled')){
	      var parent=$(this).parents('.js-alter-module').find('.product-listing-item__primary.selected');
	      var itemId=[];
	      var orderItemId=[];
	      var qty=[];
	      var orderItemQty=[];
	      var param = {};
	      var currentOrder=DMStorage.getValue('OrderId');
	      
	      $.each(parent,function(i,obj){
	    	  var flag= true;
	    	  var qtyRequested=parseInt($(this).find('.product-listing__quantity--select-quantity').val());
	    	  var maxQty=parseInt($(obj).data('maxqty'));
	    	  if(currentOrder !=null && typeof currentOrder !='Undefined' && currentOrder.orderItems.length>0){
	    	  $.each(currentOrder.orderItems,function(){
	    		  
	    		  if(this.catentryId==$(obj).data('itemid')){
	    			  orderItemId.push(this.orderItemId);
	    			  //var quantityOfItem=qtyRequested;
	    			  if((qtyRequested + this.quantity )>maxQty){
	    				  orderItemQty.push(maxQty);
	    			  }
	    			  else{
	    			  orderItemQty.push(qtyRequested + this.quantity);
	    			  }
	    			  flag= false;
	    			  return false;
	    		  }
	    		  
	    	  });
	    	  if(flag){
	    		  itemId.push($(obj).data('itemid'));
	    		  if(qtyRequested>maxQty){
	    			  qty.push(maxQty);
	    		  }
	    		  else{
    	    	  qty.push(qtyRequested);
	    		  }
	    	  }
	      }
	    	  else{
	    		  itemId.push($(obj).data('itemid'));
	    		  if(qtyRequested>maxQty){
	    			  qty.push(maxQty);
	    		  }
	    		  else{
	    			  qty.push(qtyRequested);
	    		  }
    	    	  
	    	  }
	    	 
	    	  
	      });
	     
	      console.log(itemId,qty,orderItemId,orderItemQty);
	      DMartShoppingListActionsJS.addItemToCartListPage(itemId,qty,orderItemId,orderItemQty,this);
    	  }
	      
	    });
    
    $(document).on('change', '#myList .product-listing__quantity--select-quantity', function() {
    	
    	var requestedQty=$(this).val();
    	var itemId=$(this).parents('.product-listing-item__primary').data('giftlistitemid').toString();
    	var listId=$('.my-list .resp-tabs-list li.resp-tab-active').val();
    	var data={
    			item : [{
    				"giftListItemID": itemId,
    				"quantityRequested": requestedQty
    				}]
    			};
    	
    });

    $(document).on('click','#shop-from-list', function(){
    	if(storeUserType!='G'){
			window.location.href = 'myList?storeId='+WCParamJS.storeId+'&catalogId='+WCParamJS.catalogId+'&langId=-1';
		}
		else{
			
			window.location.href = 'DMartLogonView?storeId='+WCParamJS.storeId+'&catalogId='+WCParamJS.catalogId+'&langId=-1';
		}
    	DMAnalytics.events( DMAnalytics.Constants.Category.ShopFromList, "Shop from List" , document.title, 0,null );
    });
	
    $(document).on('click','#shop-from-prev-order', function(){
		if(storeUserType!='G'){
			window.location.href = 'AjaxLogonForm?storeId='+WCParamJS.storeId+'&catalogId='+WCParamJS.catalogId+'&langId=-1&myAcctMain=1&isTrackOrder=true';
		}
		else{
			window.location.href = 'DMartLogonView?storeId='+WCParamJS.storeId+'&catalogId='+WCParamJS.catalogId+'&langId=-1';
		}
		DMAnalytics.events( DMAnalytics.Constants.Category.ShopFromPrevOrd, "Shop from Previous Order" , document.title, 0,null );
    });
    
    $(document).on('click','.sub-menu-img .button-primary.button-navigation',function(){
    	var category=$(this).parents('.js-sub-menu.sub-menu').find('.menu-item-title').text();
    	DMAnalytics.events( DMAnalytics.Constants.Category.ShopNow,"category: "+category , document.title, 0,null );
    });
    
    $(document).on('click','.landing-banner ul li a',function(){
    	//var category=$(this).attr('href');
    	//var itemId=$(this).parent().data('itemid');
    	DMAnalytics.events( DMAnalytics.Constants.Category.BannerClick,DMAnalytics.Constants.Category.BannerClick , document.title, 0,null );
    });
    
    $(document).on('click','.landing-banner ul li .promotion-panel__btn-addtocart',function(){
    	var itemId=$(this).parents('li').data('itemid');
    	DMAnalytics.events( DMAnalytics.Constants.Category.BannerATC,"itemId: "+itemId , document.title, 0,null );
    });
     
    $(document).on('mouseover','.breadcrumbs li a',function(){
    	DMAnalytics.events( DMAnalytics.Constants.Category.BreadcrumNav,DMAnalytics.Constants.Category.BreadcrumNav, document.title, 0,null );
    });
    
    $(document).on('change','.product-listing-details .product-listing__quantity--select-quantity',function(){
    	
    	var selectedQty=$(this).val();
    	var itemId=$(this).parents('.product-listing-item__primary').data('itemid');
    	//var itemId=productListing.products[prodId].currentItem;
    	DMAnalytics.events( DMAnalytics.Constants.Category.PLPQtySelection,"itemId: "+itemId+" SelectedQty: "+selectedQty, document.title, 0,null );
    });
    $(document).on('click','.mylist-set-alert-save button',function(){
    	var duration=$('.custom-dropdown.mylist-set-alert--val.js-alert-change select').val();
    	var listId=$('.my-list .resp-tabs-list li.resp-tab-active').val();
    	var data={};
    	if(duration==="1"){
    		data.x_field3='Week';
    		data.x_field2=$('.custom-dropdown.js-alert-week select').val();
    	}
    	else if(duration==="2"){
    		data.x_field2=$('.custom-dropdown.js-alert-month select').val();
    		data.x_field3='Month';
    	}
    	if($('.js-alert-disabled').is(':checked')){
    		data.x_field1="0";
    	}
    	else{
    		data.x_field1="1";
    	}
    	DMartShoppingListActionsJS.updateList(listId,data,this,false);
    	
    	
    });
    
    $(document).on('click', '#myList .js-alter-module .added-product__remove a', function() {
        
        var giftListItemId=$(this).parents('.product-listing-item__primary').data('giftlistitemid');
        var listId=$('.my-list .resp-tabs-list li.resp-tab-active').val();
        var itemId=$(this).parents('.product-listing-item__primary').data('itemid');
        DMartShoppingListActionsJS.removeItemFromList(itemId,listId,this,giftListItemId);
        
      });
    
    
    function goToList(listId){
    	window.location.href = 'myList?storeId='+WCParamJS.storeId+'&catalogId='+WCParamJS.catalogId+'&langId=-1&giftListId='+listId;
    }
    
    $(document).on('click','.js-alter-module .product-listing-item__primary input[type="checkbox"]', function () {
        $(this).parents('.js-alter-module').find('.pdp-alternate-list__summary-add-cta').css('display', 'inline');
        $(this).parents('.product-listing-item__primary').toggleClass('selected');
        
        var totalLi = $(this).parents('.product-listing-item').parent().parent().find('.product-listing-item').length;
        var alterTotal = $(this).parents('.js-alter-module').find('.product-listing-item__primary input:checked').not(':disabled').length;
        if (alterTotal === totalLi) {
          alterTotal = 'All';
        }
        else if(alterTotal >= 1) {
          $(this).parents('.js-alter-module').find('.js-alter-cta-panel').show();
        }
        else {
          $(this).parents('.js-alter-module').find('.js-alter-cta-panel').hide();
        }
        $(this).parents('.js-alter-module').find('.pdp-alternate-list__summary-add-cta span, .js-mylist-add-all span, .exiting-order__price-added-btn span, .pdp-alternate-list__summary-added-cart-cta span').text(alterTotal);
        $('.existing-order__price-view-cart-btn').hide();
      });
    