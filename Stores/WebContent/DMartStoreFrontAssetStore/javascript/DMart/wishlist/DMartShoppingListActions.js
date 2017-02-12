var wishListJSON=[];
DMartShoppingListActionsJS={
		urlPrefix: WCParamJS.searchHostNamePath+ '/search/resources/store/',
		urlPrefixWcs : window.location.protocol + '//' + window.location.hostname + '/wcs/resources/store/',
		wcsResources : '/wcs/resources/store/' ,
		curPageNum : 1,
		lazyDiv :1,
		//size:10,
		lazyFlag: false,
		isLazyLoadFlag:true,
		listStoreID:WCParamJS.storeId,
		displayList : function(divId,self){
			//DMartShoppingListActionsJS.lazyFlag=false;
			//DMartShoppingListActionsJS.isLazyLoadFlag=true;
			DMartShoppingListActionsJS.curPageNum=1;
			var currentGiftlistId=$('#giftListId').val();
			var parent;
			if(storeUserType != 'G'){
				$(document).off('dmart.products.loaded');
				if(!DMStorage.invalid('UserLists') && CachedHeader.storageValidForListCookie()){
					wishListJSON=DMStorage.getValue('UserLists');
					}
				var itemDetailsJson;
				$(document).on('dmart.products.loaded',function(){
					wishListJSON = $.grep(wishListJSON,function(list){return list.accessSpecifier == 'Private'});
					if(wishListJSON.length>0){
						 nunjucks.configure(WCParamJS.staticServerHost+ 'templates/', {
				             autoescape: true,
				             web: {
				                 useCache: true
				             }
				         });
						var itemids;
						var itemDetailsJson;
						if(typeof divId === 'number'){
							/*if(DMartShoppingListActionsJS.lazyFlag){
								var div="items-"+DMartShoppingListActionsJS.lazyDiv;
								itemids=DMStorage.getValue('listItemIds_'+DMartShoppingListActionsJS.lazyDiv);
								itemDetailsJson=DMartShoppingListActionsJS.listItemJson(itemids,DMartShoppingListActionsJS.lazyDiv);
								currentGiftlistId=DMartShoppingListActionsJS.lazyDiv;
								if(itemDetailsJson.length>0){
									$('#'+div).append(nunjucks.render('list-lazyload-display.nunjucks',{data:itemDetailsJson}));
									var itemLength=$('#'+div).children().length;
									var prod_text = 'Products';
					                if(itemLength == 1){
					                  prod_text = 'Product';
					                }
									$('#'+DMartShoppingListActionsJS.lazyDiv).find('.existing-order--count').text("Showing Total "+itemLength+" "+prod_text);
								}
								else{
									//DMartShoppingListActionsJS.isLazyLoadFlag=false;
									//DMartShoppingListActionsJS.lazyFlag=false;
								}
							}
							else{*/
							parent=$(self).parent();
							currentGiftlistId=divId;
							itemids=DMStorage.getValue('listItemIds_'+divId);
							
							if(itemids && itemids.length>0){
								itemDetailsJson=DMartShoppingListActionsJS.listItemJson(itemids,currentGiftlistId);
								itemDetailsJson.NoOfProduct=itemDetailsJson.length;
								}
								else{
									itemDetailsJson={"NoOfProduct":"0"};
								}
							$('#' + divId).html(nunjucks.render('list-display.nunjucks',{itemDetailsJson:itemDetailsJson,divId:divId}));
							
							if(itemDetailsJson.NoOfProduct == '0'){
								$('.mylist-noitems-alert[data-glistid='+divId+']').show();
							}
						//}
							
						}
						else{
							/*if(DMartShoppingListActionsJS.lazyFlag){
								var div="items-"+DMartShoppingListActionsJS.lazyDiv;
								currentGiftlistId=DMartShoppingListActionsJS.lazyDiv;
								itemids=DMStorage.getValue('listItemIds_'+DMartShoppingListActionsJS.lazyDiv);
								itemDetailsJson=DMartShoppingListActionsJS.listItemJson(itemids,DMartShoppingListActionsJS.lazyDiv);
								if(itemDetailsJson.length>0){
									$('#'+div).append(nunjucks.render('list-lazyload-display.nunjucks',{data:itemDetailsJson}));
									//DMartShoppingListActionsJS.lazyFlag=false;
									var itemLength=$('#'+div).children().length;
									var prod_text = 'Products';
					                if(itemLength == 1){
					                  prod_text = 'Product';
					                }
									$('#'+DMartShoppingListActionsJS.lazyDiv).find('.existing-order--count').text("Showing Total "+itemLength+" Products");
								}
								else{
									DMartShoppingListActionsJS.isLazyLoadFlag=false;
									DMartShoppingListActionsJS.lazyFlag=false;
								}
								
							}
							else{*/
							itemids=DMStorage.getValue('listItemIds_'+currentGiftlistId);
							if(itemids.length>0){
							itemDetailsJson=DMartShoppingListActionsJS.listItemJson(itemids,currentGiftlistId);
							itemDetailsJson.NoOfProduct=itemDetailsJson.length;
							}
							else{
								itemDetailsJson={"NoOfProduct":"0"};
							}
							
							$('#' + divId).html(nunjucks.render('my-list-display.nunjucks',{listNameData:wishListJSON,itemDetailsJson:itemDetailsJson,currentGiftlistId:currentGiftlistId,divId:currentGiftlistId}));
							if(itemDetailsJson.NoOfProduct == '0'){
								$('.mylist-noitems-alert[data-glistid='+currentGiftlistId+']').show();
							}
						//}
						}
						 $('#' + divId).ready(function(){
							 parent=$('.my-list .resp-tabs-list li').parent();
							 if(divId=="myList"){
							 $('.js-accordion-tabs-vertical').easyResponsiveTabs({
							      type: 'vertical',
							      width: 'auto',
							      fit: true,
							      tabidentify: 'tabs-primary--vertical'
							    });
							 }
							 $('.js-alert-disabled').clickToggle( function () {
							      $('.js-alert-week select, .js-alert-month select, .js-alert-change select').attr('disabled', true);
							      $('.mylist-set-alert-save button').removeAttr('disabled').removeClass('button--disabled');
							      if(!$('.js-alert-disabled').is(':checked')){
							    	  $('.js-alert-week select, .js-alert-month select, .js-alert-change select').removeAttr('disabled');
							      }
							    }, function () {
							      if($('.js-alert-change select').val() >= 1) {
							    	if(!$('.js-alert-disabled').is(':checked')){
							        $('.js-alert-week select, .js-alert-month select, .js-alert-change select').removeAttr('disabled');
							    	}
							    	else{
							    		$('.js-alert-week select, .js-alert-month select, .js-alert-change select').attr('disabled', true);
									    $('.mylist-set-alert-save button').removeAttr('disabled').removeClass('button--disabled');
							    	}
							      }
							      else {
							        $('.js-alert-change select').removeAttr('disabled');
							        if(!$('.js-alert-disabled').is(':checked')){
							        $('.mylist-set-alert-save button').attr('disabled', true).addClass('button--disabled');
							        }
							        else{
							        	$('.js-alert-week select, .js-alert-month select, .js-alert-change select').attr('disabled', true);
									    $('.mylist-set-alert-save button').removeAttr('disabled').removeClass('button--disabled');
							        }
							      }
							    });
							 $.each($(parent).children(),function(){
						    		if($(this).val() !=currentGiftlistId){
						    			$('#'+$(this).val()).hide();
						    			$(this).removeClass('resp-tab-active');
						    		}
						    		else{
						    			$('#'+$(this).val()).show();
						    			$(this).addClass('resp-tab-active');
						    		}
						    	});	
							 if(typeof divId !== 'number'){
								 $('#'+currentGiftlistId).addClass('resp-tab-content-active');
							 }
							 $('.product-listing__quantity--select-quantity').selectric({maxHeight: 60});
							 DMartShoppingListActionsJS.setAlertUI(currentGiftlistId);
							 
							 $('.selectric-items .selectric-scroll').perfectScrollbar({
							      suppressScrollX: true,
							      swipePropagation: true
							    });
				    	 });
						 
						 
//						 $(document).on('click','.js-alter-module .product-listing-item__primary input[type="checkbox"]', function () {
//						        $(this).parents('.js-alter-module').find('.pdp-alternate-list__summary-add-cta').css('display', 'inline');
//						        $(this).parents('.product-listing-item__primary').toggleClass('selected');
//						        
//						        var totalLi = $(this).parents('.product-listing-item').parent().parent().find('.product-listing-item').length;
//						        var alterTotal = $(this).parents('.js-alter-module').find('.product-listing-item__primary input:checked').not(':disabled').length;
//						        if (alterTotal === totalLi) {
//						          alterTotal = 'All';
//						        }
//						        else if(alterTotal >= 1) {
//						          $(this).parents('.js-alter-module').find('.js-alter-cta-panel').show();
//						        }
//						        else {
//						          $(this).parents('.js-alter-module').find('.js-alter-cta-panel').hide();
//						        }
//						        $(this).parents('.js-alter-module').find('.pdp-alternate-list__summary-add-cta span, .js-mylist-add-all span, .exiting-order__price-added-btn span, .pdp-alternate-list__summary-added-cart-cta span').text(alterTotal);
//						        $('.existing-order__price-view-cart-btn').hide();
//						      });
						 
					}
					else{
						$('.my-listing-products').html('<p class="text-center">You don\'t seem to have a Shopping List. <br>Creating a Shopping List allows you to quickly add the items from this list to your shopping cart. </p>');

					}
					//$(document).off('dmart.products.loaded');
					});
				
				if(typeof divId == 'number'){
					//console.log("if");
					this.getItemDetails(divId,false);
				}
				else{

					if(wishListJSON.length==0){
					var wishlistUrl = window.location.protocol+'//'+window.location.hostname+'/wcs/resources/store/'+WCParamJS.storeId+'/wishList/@self';
					if(previewToken){
						wishlistUrl = window.location.origin+'/wcs/previewresources/store/'+WCParamJS.storeId+'/wishList/@self';
					}
					$.ajax({
		                url: wishlistUrl,
		                method: 'GET',
		                context: this,
						cache : false
		                
		            }).done(function (data) {
		            	if(data.recordSetCount!=0){
		            	wishListJSON = data.GiftList;
		            	DMStorage.set('UserLists',wishListJSON);
		            	if(typeof currentGiftlistId!='undefined' && currentGiftlistId.length>0){
		            		if(this.chekForListAvailability(currentGiftlistId)) {
		            			this.getItemDetails(currentGiftlistId,false);
		            		}
		            		else{
		            			$('.js-accordion-tabs-vertical, .mylist-search-delete-cta').remove();
			                    $('.my-listing-products').html('<p class="text-center">You don\'t seem to have a Shopping List. <br>Creating a Shopping List allows you to quickly add the items from this list to your shopping cart. </p>');
		            		}
		            	}
		            	else{
		            		$.each(wishListJSON,function(){
		            			if(this.accessSpecifier =='Private'){
		            				currentGiftlistId=this.externalIdentifier;
		            				DMartShoppingListActionsJS.getItemDetails(currentGiftlistId,false);
				            		return false;
		            			}
		            		});
		            	}
		            	}
		            	else{
		            		$('.js-accordion-tabs-vertical, .mylist-search-delete-cta').remove();
		                      $('.my-listing-products').html('<p class="text-center">You don\'t seem to have a Shopping List. <br>Creating a Shopping List allows you to quickly add the items from this list to your shopping cart. </p>');

		            	}
//		            	$.each(wishListJSON,function(){
//	            			if(this.accessSpecifier =='Private'){
//	            				var prodArr = [];
//	            				$.each(this.item, function() {
//	            					prodArr.push(this.productId);
//	            				});
//	            				DMStorage.set('listItemIds_'+this.externalIdentifier,prodArr);
//	            				DMStorage.set('wishListItemDetail_'+this.externalIdentifier,this);
//	            			}
//	            		});
		            	
		            }
		            
		            ).error(function (data) {
		            	$('.js-accordion-tabs-vertical, .mylist-search-delete-cta').remove();
	                      $('.my-listing-products').html('<p class="text-center">You don\'t seem to have a Shopping List. <br>Creating a Shopping List allows you to quickly add the items from this list to your shopping cart. </p>');
		            	
		            });
			}
				else if (wishListJSON.length>0){
					if(typeof currentGiftlistId!='undefined' && currentGiftlistId.length>0){
						if(this.chekForListAvailability(currentGiftlistId)) {
							this.getItemDetails(currentGiftlistId,false);
						}
	            		else{
	            			$('.js-accordion-tabs-vertical, .mylist-search-delete-cta').remove();
		                    $('.my-listing-products').html('<p class="text-center">You don\'t seem to have a Shopping List. <br>Creating a Shopping List allows you to quickly add the items from this list to your shopping cart. </p>');
	            		}
		            	
		            	}
		            	else{
		            		var noList=true;
		            		$.each(wishListJSON,function(){
		            			if(this.accessSpecifier =='Private'){
		            				currentGiftlistId=this.externalIdentifier;
		            				noList=false;
		            				DMartShoppingListActionsJS.getItemDetails(currentGiftlistId,false);
				            		return false;
		            			}
		            		});
		            		if(noList){
		            			$('.js-accordion-tabs-vertical, .mylist-search-delete-cta').remove();
		                    	$('.my-listing-products').html('<p class="text-center">You don\'t seem to have a Shopping List. <br>Creating a Shopping List allows you to quickly add the items from this list to your shopping cart. </p>');
		            		}
		            	}
				}
				}
			
			}
			//$(window).scroll(this.scrollPage);
		},
		scrollPage : function(){
	        if ($(window).scrollTop() + $(window).height() > $(document).height() - 300 && DMartShoppingListActionsJS.isLazyLoadFlag) {
	        	DMartShoppingListActionsJS.curPageNum = DMartShoppingListActionsJS.curPageNum + 1;
	            this.lazyLoadActive = true;
	            DMartShoppingListActionsJS.lazyFlag=true;
	            var listId=$('.resp-tabs-list .resp-tab-active').val();
	            DMartShoppingListActionsJS.lazyDiv=listId;
	            DMartShoppingListActionsJS.getItemDetails(listId,true);
	            
	        }
	    },
		chekForListAvailability : function(currentGiftlistId){
			var flag=false;
			
			$.each(wishListJSON,function(){
				if(this.externalIdentifier==currentGiftlistId){
					flag=true;
					return false;
				}
			});
			return flag;
		},
		setAlertUI : function(currentGiftlistId){
			 $.each(wishListJSON,function(){
					if(this.externalIdentifier==currentGiftlistId) {
						$('.mylist-set-alert-save button').removeClass('button--disabled');
						$('.mylist-set-alert-save button').removeAttr('disabled');
						document.getElementById('formSetAlert').reset();
						var day;
						if(typeof this.x_field1 !='undefined'){
							$('.mylist-set-alert-save button').removeClass('button--disabled');
							$('.mylist-set-alert-save button').removeAttr('disabled');
						if(this.x_field1==1 ){
							document.getElementById('formSetAlert').reset();
							$('.mylist-set-alert--val select').removeAttr('disabled');
							day=parseInt(this.x_field2);
							$('.js-alert-disabled').removeAttr('disabled');
//							if($('.js-alert-disabled').is(':checked')){
//								$('.js-alert-disabled').click();
//							}
							if(this.x_field3=='Week'){
								$('.mylist-set-alert--val.js-alert-change select').val(1);
								$('.js-alert-week select').val(day);
								$('.js-alert-week').removeClass('hide');
								$('.js-alert-week select').removeAttr('disabled');
								if(!$('.js-alert-month').hasClass('hide')){
									$('.js-alert-month').addClass('hide');
									
								}
							}
							else if(this.x_field3=='Month'){
								document.getElementById('formSetAlert').reset();
								$('.mylist-set-alert--val.js-alert-change select').val(2);
								$('.js-alert-week').addClass('hide');
								$('.js-alert-month').removeClass('hide');
								$('.js-alert-month select').val(day);
								$('.js-alert-month select').removeAttr('disabled');
							}
							$('.mylist-set-alert-save button').removeClass('button--disabled');
							$('.mylist-set-alert-save button').removeAttr('disabled');
						}
						else if(this.x_field1==0){
							day=parseInt(this.x_field2);
							if(this.x_field3=='Week'){
								$('.mylist-set-alert--val.js-alert-change select').val(1);
								$('.js-alert-week select').val(day);
								$('.js-alert-week').removeClass('hide');
								$('.js-alert-week select').removeAttr('disabled');
								if(!$('.js-alert-month').hasClass('hide')){
									$('.js-alert-month').addClass('hide');
									
								}
							}
							else if(this.x_field3=='Month'){
								document.getElementById('formSetAlert').reset();
								$('.mylist-set-alert--val.js-alert-change select').val(2);
								$('.js-alert-week').addClass('hide');
								$('.js-alert-month').removeClass('hide');
								$('.js-alert-month select').val(day);
								$('.js-alert-month select').removeAttr('disabled');
							}
							$('.js-alert-disabled').removeAttr('disabled');
							$('.js-alert-disabled').click();
						}
					}
						else{
							document.getElementById('formSetAlert').reset();
							if(!$('.mylist-set-alert-save button').hasClass('button--disabled')){
								$('.mylist-set-alert-save button').addClass('button--disabled');
								$('.mylist-set-alert-save button').attr('disabled',true);
							}
							$('.mylist-set-alert--val select').removeAttr('disabled');
							$('.js-alert-disabled').attr('disabled','true');
							$('.mylist-set-alert--val.js-alert-change select').val(0);
							if(!$('.custom-dropdown.js-alert-month').hasClass('hide')){
								$('.custom-dropdown.js-alert-month').addClass('hide');
								$('.custom-dropdown.js-alert-week').removeClass('hide');
							}
							$('.custom-dropdown.js-alert-week select').attr('disabled','true');
						}
					}
				 });
		},
		removeItemFromList: function(itemId,listId,self,giftListItemId){
			var wishlistUrl = window.location.protocol+'//'+window.location.hostname+'/wcs/resources/store/'+WCParamJS.storeId+'/wishlist/'+listId+'?itemId='+giftListItemId+'&responseFormat=json';
			if(previewToken){
				wishlistUrl = window.location.origin+'/wcs/previewresources/store/'+WCParamJS.storeId+'/wishlist/'+listId+'?itemId='+giftListItemId+'&responseFormat=json';
			}
			
			$.ajax({
                url: wishlistUrl,
                method: 'DELETE',
                context: this
                
            }).done(function (data) {
            	CachedHeader.invalidateListStorage();
            	var parentfind= $(self).parents('.js-alter-module');
            	$(self).parents('.product-listing-item').find('.product-listing-details').find('.product-listing-checkbox').find('.product-alternate-checkbox').prop('checked', false);
            	
                  var listItemIds=DMStorage.getValue('listItemIds_'+listId);
                  var index=listItemIds.indexOf(itemId.toString());
                  if(index>-1)
                  	listItemIds.splice(index, 1);
                  DMStorage.set('listItemIds_'+listId,listItemIds);
                  var listItemDetails=DMStorage.getValue('wishListItemDetail_'+listId);
                  if(listItemDetails){
                  $.each(listItemDetails.item,function(index ){
                	  if(this.productId==itemId){
                		  listItemDetails.item.splice(index,1);
                		  DMStorage.set('wishListItemDetail_'+listId,listItemDetails);
                	  }
                  });
                  }
                  var totalList = $(self).parents('.js-alter-module').find('.product-listing-item').length;
                  var prod_text = 'Products';
                  if(listItemIds.length == 1){
                	  prod_text = 'Product';
                  }
                  $(self).parents('.product-listing-item').fadeOut(300, function () {
              		
              		$(self).remove();
              		var checklength = $(parentfind).find('.product-alternate-checkbox:checked').length;

              		$(parentfind).find('.pdp-alternate-list_summary-add-cta span, .js-mylist-add-all span, .existing-orderprice-added-btn span, .pdp-alternate-list_summary-added-cart-cta span').text(checklength);
              		if(checklength <1 && listItemIds.length>0)
              		{ $(parentfind).find('.js-alter-cta-panel .pdp-alternate-list__summary-add-cta').hide(); $(parentfind).find('.js-alter-cta-panel .existing-order__price-view-cart-btn').show(); 
              		}
              		else if(checklength>0 && listItemIds.length>0){
              			$(parentfind).find('.existing-order__price-cta-btn span').text(checklength);
              		}
                    });
                  $(self).parents('.js-alter-module').find('.existing-order--count').text("Showing Total "+listItemIds.length+" "+prod_text);
                  if(listItemIds.length==0){
                	  $(self).parents('.js-alter-module').find('.mylist-set-alert a').removeAttr('data-target');
                	  $(self).parents('.js-alter-module').find('.mylist-set-alert a').addClass('button--disabled');
                	  $(self).parents('.js-alter-module').find('.existing-order__price-cta-btn').addClass('button--disabled');
                	  $(self).parents('.js-alter-module').find('.existing-order__price-cta-btn span').text('ALL');
                	  $('.mylist-noitems-alert[data-glistid='+listId+']').show();
                  }
                  $(self).parents('.product-listing-item.plp-grocery').remove();  
                  CachedHeader.renderTopnavList();
                  
            }
            
            ).error(function (data) {
            	errorMessageHelper.showGenericError('Error while removing item from list');
            	
            });
		},
		addItemToCartListPage : function(itemId,qty,orderItemId,orderItemQty,self){
			var param={};
			if(orderItemId.length>0 && itemId.length==0){
				 param={"orderItemId":orderItemId,"orderItemQty":orderItemQty};
			}
			else if(itemId.length>0 && orderItemId.length==0){
				param={"catentryIds":itemId,"newItemQty":qty};
			}
			else if(orderItemId.length>0 && itemId.length>0 ){
				param={"orderItemId":orderItemId,"orderItemQty":orderItemQty,"catentryIds":itemId,"newItemQty":qty};
			}
			if(orderItemId.length>0 || itemId.length>0){
			var wishlistUrl = this.urlPrefixWcs+ WCParamJS.storeId + '/cart/addItemFromList?responseFormat=json';
			if(previewToken){
				wishlistUrl = window.location.origin+'/wcs/previewresources/store/'+WCParamJS.storeId+'/cart/addItemFromList?responseFormat=json';
			}	
			
			$.ajax({
	              url: wishlistUrl,
	              headers: {
	                  "Content-Type":"application/json"
	              },
	  				
	              'data': JSON.stringify(param),
	              method: 'POST',
	              context: this
	          }).done(function(response){
	        	  CartHelper.getCartItems();
	        	  $(self).css('display', 'none');
	          		$(self).parents('.js-alter-module').find('.existing-order__price-view-cart-btn').fadeIn();
	      	      $(self).parents('.js-alter-module').find('.view-list-active .selected .product-listing__cta-btn').css('display', 'none');
	      	      $(self).parents('.js-alter-module').find('.view-list-active .selected .product-listing__cta-added').fadeIn();
	      	      
	      	      $(self).parents('.js-alter-module').find('.view-list-active .selected .product-alternate-checkbox').attr('checked', false);
	      	      
	      	      $(self).parents('.js-alter-module').find('.product-listing-item__primary').removeClass('selected');
	      	    DMAnalytics.events( "Add All To Cart", "inputData:"+JSON.stringify(param) , document.title, 0,null );
	          }).fail(function(data) {
	        	  errorMessageHelper.showGenericError('Error while adding item to list');

	          });  
		}
		},
		updateList:function(listId,param,self,isAdd){
			
			
			var url=this.urlPrefixWcs + WCParamJS.storeId + '/wishlist/' + listId;
			if(isAdd){
				url=url+'?addItem=true&responseFormat=json';
			}
			$.ajax({
			    url: url,
			    headers: {
	                "Content-Type":"application/json"
	            },
			    method: 'PUT',
			    'data': JSON.stringify(param),
			    context: this
			}).done(function(data) {
				if(self !=null){
				$(self).parents('.modal-dialog').hide();
		        $('.gldp-default').hide();
		        $('html, body').css('overflow', 'auto');
		        errorMessageHelper.showGenericError('Recurrence rule is set successfully');
		        //CachedHeader.invalidateListStorage();
		        //DMStorage.remove('listItemIds_'+listId);
		        $.each(wishListJSON,function(){
		        	if(this.uniqueID==listId){
		        		this.x_field1=param.x_field1;
		        		this.x_field2=param.x_field2;
		        		this.x_field3=param.x_field3;
		        		return false;
		        	}
		        });
		        if(wishListJSON){
		        	DMStorage.set("UserLists",wishListJSON);
		        }
		        DMartShoppingListActionsJS.setAlertUI(listId);
				}
				else{
					errorMessageHelper.showGenericError('Quantity updated successfuly.');
				}
			}).fail(function(data) {
					errorMessageHelper.showGenericError('Error while updating wishlist recurrence rule.');

	          });
		},
		getItemDetails:function(listId,isLazyLoad){
			var obj=$.grep(wishListJSON,function(list){return list.externalIdentifier ==parseInt(listId);});
			if(typeof obj!='Undefined' && obj.length>0)
				DMartShoppingListActionsJS.listStoreID=obj[0].storeId;
			var storeIdentifier=WCParamJS.storeId;
		
			if(DMartShoppingListActionsJS.listStoreID!=null){
				storeIdentifier=DMartShoppingListActionsJS.listStoreID;
			}
			 var prodArr=DMStorage.getValue('listItemIds_'+listId);
			 var wishlsititems=DMStorage.getValue('wishListItemDetail_'+listId);
			 var eventName='dmart.listItemId.loaded'+listId;
			 $(document).off(eventName);
			 if(window.location.protocol === "https:"){
	 	    		this.urlPrefix=  WCParamJS.searchSecureHostNamePath+ '/search/resources/store/';
	 	    	 }
			 console.log('prodarr'+prodArr);
				$(document).on(eventName,function(){
					var catentryIds=[];
					var catEntryPrice=[];
					if(prodArr){
					for(var indx=0;indx<prodArr.length ;indx++){
						if(DMStorage.invalid('item_'+prodArr[indx])) {
							catentryIds.push(prodArr[indx]);
						}
						if (DMStorage.invalid('item_PriceInv_' + storeIdentifier + prodArr[indx])) {
							catEntryPrice.push(prodArr[indx]);
			            }
					}
					}
		       		 if(catEntryPrice.length>0 || catentryIds.length>0){
		       			if(catentryIds.length>0 || (catEntryPrice.length>0 && catentryIds.length>0)){
		       			var idString = 'id=' + catentryIds.join('&id=');
		       			console.log('idString'+idString);
		       			 $.ajax({
		                    url: DMartShoppingListActionsJS.urlPrefix + storeIdentifier + '/productview/byIds?' + idString + '&profileName=X_findProductInfo_NoEntitlementCheck_DMART',
		                    method: 'GET',
		                    context: this,
							cache : false
		                }).done(function(data) {
		               	 
		               	 $.each(data.catalogEntryView, function(prodIndx,productDetails){
		               		DMStorage.set('item_' + productDetails.uniqueID, productDetails);
		               		});
		               	
			               	ProductHelper.fetchPriceAndInvDetails(prodArr);
		               	
		                });
				}
		       			else{
		       				ProductHelper.fetchPriceAndInvDetails(prodArr);
		       			}
		       		 }
		       		 else{
		       			$(document).trigger('dmart.products.loaded');
		       		 }
		       		 
					});
			
		    // Get total number of items in current list
			var allListDetails = DMStorage.getValue('UserLists'),thisListDetails;
			var pageSize = 50; // Default value
			if(allListDetails){
				var searchResults = $.grep(allListDetails,function(list){return list.uniqueID ==listId;});
				if(searchResults.length>0) {
					thisListDetails = searchResults[0];
					if(typeof thisListDetails.recordSetCount != "undefined" && thisListDetails.recordSetCount>0)
						pageSize = thisListDetails.recordSetCount;
					/*if(prodArr && typeof prodArr!='undefined' && pageSize==prodArr.length)
						isLazyLoad=false;*/
				}
			} 
				
			//if(!prodArr || !wishlsititems || isLazyLoad){
			if(!prodArr || !wishlsititems ){
				
				var wishlistUrl = window.location.protocol+'//'+window.location.hostname+'/wcs/resources/store/'+WCParamJS.storeId+'/wishlist/'+listId+'/item?pageSize='+pageSize+'&pageNumber='+DMartShoppingListActionsJS.curPageNum+'&responseFormat=json';
				if(previewToken){
					wishlistUrl = window.location.origin+'/wcs/previewresources/store/'+WCParamJS.storeId+'/wishlist/'+listId+'/item?pageSize='+pageSize+'&pageNumber='+DMartShoppingListActionsJS.curPageNum+'&responseFormat=json';
				}
				
				$.ajax({
	                url: wishlistUrl,
	                method: 'GET',
	                context: this,
					cache : false
	                
	            }).done(function (data) {
	            	console.log("data"+data.recordSetTotal);
	            	var id=[];
	            	if(data.recordSetTotal !="0"){
	            	$.each(data.GiftList[0].item,function(ind,itm){
	            		if(typeof itm.productId !='undefined'){
	            			id.push(itm.productId);
	            		}
	            	});
	            	/*if(isLazyLoad)
	            		{
	            			var result=prodArr.concat(id);
	            			DMStorage.set('listItemIds_'+listId, result);
	            		}*/
	            	DMStorage.set('wishListItemDetail_'+listId,data.GiftList[0]);
	            	prodArr=id;
	            	DMStorage.set('listItemIds_'+listId, prodArr);
	            	$(document).trigger(eventName);
	            	}
	            	else{
	            		prodArr=id;
		            	DMStorage.set('listItemIds_'+listId, prodArr);
		            	$(document).trigger('dmart.products.loaded');
		            	
	            	}
	            });
			}
			else{
				if(prodArr.length>0){
					$(document).trigger(eventName);
				}
				else{
					$(document).trigger('dmart.products.loaded');
				}
			}
		},
		listItemJson : function(itemIds,listId){
			console.log("items:"+itemIds);
			this.itemJson=[];
			var self=this;
			var indx=0;
			var images=[];
			var wishlsititems=DMStorage.getValue('wishListItemDetail_'+listId);
			var currentOrder=DMStorage.getValue('OrderId');
			//var threshold=(DMartShoppingListActionsJS.curPageNum-1)*DMartShoppingListActionsJS.size;
			$.each(itemIds,function(index,id){
//				if(index<threshold)
//					return true;
//				if(index>=DMartShoppingListActionsJS.curPageNum*DMartShoppingListActionsJS.size)
//					return false;
				var catId=id;
				var storeid=DMartShoppingListActionsJS.listStoreID;
				if(storeid==0 || storeId==null || typeof storeid == 'undefined')
					storeid=WCParamJS.storeId;
				var productBean=self.itemJson[indx] = {};
				var itemBean=DMStorage.getValue('item_'+id);
				if(itemBean != null){
				var priceobj=DMStorage.getValue('item_PriceInv_'+storeid+id);
				var Category=DMartShoppingListActionsJS.findAttributeInfo(itemBean,'CATEGORY TEMPLATE TYPE');
/*				var variant;
				//images = productListing.getImageURLs(itemBean,'DMartStoreFrontAssetStore/images/DMart/products/');
				if(Category==='Grocery'||Category=='HouseHold' || Category==='General_Merchandise'){
					var definingAttr=$.merge(DMartAttributes.Constants.Grocery.Defining.Size,DMartAttributes.Constants.SizeAttributeConstants);
					var brandAttr=DMartAttributes.Constants.Grocery.Filters.Brands;
					if(Category=='General_Merchandise' || Category=='HouseHold'){
						definingAttr=$.merge(DMartAttributes.Constants.HouseHold.Defining.Size,DMartAttributes.Constants.SizeAttributeConstants);
						brandAttr=DMartAttributes.Constants.HouseHold.Filters.Brands;
					}
					$.each(definingAttr,function(indx,val){
						productBean.variant = DMartShoppingListActionsJS.findAttributeInfo(itemBean,val);
						if(productBean.variant.length>0){
							return false;
						}
					});
					$.each(brandAttr,function(indx,val){
						productBean.brand= DMartShoppingListActionsJS.findAttributeInfo(itemBean,val);
						if(productBean.brand.length>0){
							return false;
						}
					});
					
				}else{
					productBean.size = DMartShoppingListActionsJS.findAttributeInfo(itemBean,DMartAttributes.Constants.Apparel.Filters.Size);
					if(productBean.size.length==0){
					productBean.size = DMartShoppingListActionsJS.findAttributeInfo(itemBean,'Size');
					}
					productBean.colour = DMartShoppingListActionsJS.getColorAttributeValue(itemBean);
					productBean.brand= DMartShoppingListActionsJS.findAttributeInfo(itemBean,'brand');
				}*/
				
				var definingAttributes = productListing.getItemDefiningAttributes(itemBean.attributes,id);
				if(Category == 'Apparel') {
					productBean.size = definingAttributes.Size;
					productBean.colour = definingAttributes.Colour;
				} else {
					productBean.variant = definingAttributes.Size;
				}
				
				
				$.each(itemBean.attributes, function() {
					  if(this.identifier.indexOf('BRAND') > -1) {
						  productBean.brand = this.values[0].value;
						  return ;
					  }
				  });
				
				
				$.each(wishlsititems.item,function(indx,val){
					if(this.productId == catId){
					productBean.quantityRequested=val.quantityRequested;
					productBean.giftlistItemid=val.giftListItemID;
					
					}
				});
//				if(currentOrder !=null && typeof currentOrder !='Undefined' && currentOrder.orderItems.length>0){
//				 $.each(currentOrder.orderItems,function(){
//		    		  
//		    		  if(this.catentryId==catId){
//		    			  productBean.quantityRequested=this.quantity;
//		    		  }
//		    		  
//		    	  });
//				}
					productBean.maxOrderQtySolr = DMartShoppingListActionsJS.findAttributeInfo(itemBean,'ITEMWISE');
					if(productBean.maxOrderQtySolr.length==0){
						productBean.maxOrderQtySolr="5";
					}
					if(productBean.quantityRequested>parseFloat(productBean.maxOrderQtySolr)){
						productBean.quantityRequested=productBean.maxOrderQtySolr;
					}
					productBean.parentId =itemBean.parentCatalogEntryID;
					productBean.url="ProductDisplay?storeId="+WCParamJS.storeId+"&catalogId="+WCParamJS.catalogId+"&langId=-1&categoryId="+itemBean.parentCatalogGroupID+"&productId="+itemBean.parentCatalogEntryID;
					productBean.imgUrl = images?images[0]:'';
					productBean.uniqueId=itemBean.uniqueID;
					
					productBean.name = itemBean.name;
					productBean.partnumber = itemBean.partNumber;
					if(priceobj!=null){
					productBean.MRP = priceobj.sellingPrice;
					productBean.DmartPrice = priceobj.offerPrice;
					productBean.outofstock=!priceobj.inventoryStatus;
					productBean.savings = parseFloat(productBean.MRP)-parseFloat(productBean.DmartPrice);
					}
					//productBean.quantityRequested='1';
					productBean.topCategory = Category;
					
					self.itemJson[indx] = productBean;
					indx= indx+1;
				}
				
			});
			return this.itemJson;
		},
		
		removeList : function(listId){
			var wishlistUrl = window.location.protocol+'//'+window.location.hostname+'/wcs/resources/store/'+WCParamJS.storeId+'/wishlist/'+listId+'?responseFormat=json';
			if(previewToken){
				wishlistUrl = window.location.origin+'/wcs/previewresources/store/'+WCParamJS.storeId+'/wishlist/'+listId+'?responseFormat=json';
			}
			
			$.ajax({
                url: wishlistUrl,
                method: 'DELETE',
                context: this
                
            }).done(function (data) {
            	CachedHeader.invalidateListStorage();
            	$('.resp-tabs-container .resp-tab-content-active, .resp-tabs-list .resp-tab-active, .resp-accordion .resp-tab-active').addClass('tab-remove').delay(600).fadeOut('slow', function () {
                    console.log($('.resp-tabs-list .resp-tab-active').length);
                    if($('.resp-tabs-list .resp-tab-active').length === 1 || $('.resp-accordion .resp-tab-active').length === 1) {
                    	if($('.resp-tabs-list .tab-remove, .resp-accordion .tab-remove').next('li').length >0){
                        	$('.resp-tabs-list .tab-remove, .resp-accordion .tab-remove').next('li').trigger('click');
                        	}
                        	else{
                        		$('.resp-tabs-list .tab-remove, .resp-accordion .tab-remove').prev('li').trigger('click');
                        	}
                    }
                    else {
                      $('.js-accordion-tabs-vertical, .mylist-search-delete-cta').remove();
                      $('.my-listing-products').html('<p class="text-center">You don\'t seem to have a Shopping List.<br>Creating a Shopping List allows you to quickly add the items from this list to your shopping cart. </p>');
                      $('#generic-error-section').parent().hide();
                    }
                    
                    $('#'+listId).remove();
                    
                    $.each($('.resp-tabs-list li'),function(){
                    	if($(this).val()==listId){
                    		$(this).remove();
                    	}
                    });
                    
                  });
            	CachedHeader.renderTopnavList();
            	DMAnalytics.events( DMAnalytics.Constants.Action.DeleteList, "listId:"+listId , document.title, 0,null );
            }
            
            ).error(function (data) {
            	errorMessageHelper.showGenericError('Error while removing list');
            	
            });
		},
		findAttributeInfo: function(itemBean,attrib){
			var attribVal = '', attributes;
			if(!itemBean){
				return '';
			}
			
			if(itemBean.attributes){
				attributes=itemBean.attributes;
			}
			else{
				attributes=itemBean.Attributes;
			}
			$.each(attributes,function(){
				if(this.name.indexOf(attrib) > -1){
					if(this.values){
					attribVal = this.values[0].value;
					}
					
					return false;
					}
				else if((this.name==='Size' || this.name==DMartAttributes.Constants.Apparel.Filters.Size) && attrib==='CATEGORY TEMPLATE TYPE'){
					attribVal = 'Apparel';
				}
			});
			
			return attribVal;
		},
		getAttributeValue: function(itemBean,attrib){
			var attribVal = '';
				var attributes;
			if(itemBean.attributes){
				attributes=itemBean.attributes;
			}
			$.each(attributes,function(){
				if(this.name && this.name.toUpperCase().indexOf(attrib) === 0){
					if(this.values){
						attribVal = this.values[0].value;
					}
					return false;
				}
			});
			
			return attribVal;
		},
		getColorAttributeValue: function(itemBean){
			var attribVal = '';
			var colorKeys = DMartAttributes.Constants.Apparel.Defining.Colour;
			if(!itemBean) {
				return '';
			}
			$.each(itemBean.attributes,function(){
				if(this.name && colorKeys.indexOf(this.name) > 0){
					if(this.values){
						attribVal = this.values[0].value;
					}
					return false;
				}
			});
			
			return attribVal;
		},
		getListDetails:function(self){
			
			
			if(isGuest == false){
				nunjucks.configure(WCParamJS.staticServerHost+ 'templates/', {
		             autoescape: true,
		             web: {
		                 useCache: true
		             }
		         });
				if(wishListJSON.length==0 && !DMStorage.invalid('UserLists') && CachedHeader.storageValidForListCookie()){
				wishListJSON=DMStorage.getValue('UserLists');
				}
				if($(self).parent().siblings('.product-listing-item__tertiary').find('.product-listing-item__tertiary-lists ul li').length==0 && wishListJSON.length==0)
				{
					var wishlistUrl = window.location.protocol+'//'+window.location.hostname+'/wcs/resources/store/'+WCParamJS.storeId+'/wishList/@self';
					if(previewToken){
						wishlistUrl = window.location.origin+'/wcs/previewresources/store/'+WCParamJS.storeId+'/wishList/@self';
					}
					$.ajax({
		                url: wishlistUrl,
		                method: 'GET',
		                context: this,
		                async:false,
		                cache : false
		            }).done(function (data) {
		            	wishData=data;
		            	wishListJSON = wishData.GiftList;
		            	var htmlcode=nunjucks.render('_modules/add-to-shop-list.nunjucks', {listData:wishListJSON});
		            	
		    			$('.product-listing-item__tertiary').replaceWith([htmlcode]);
		    			
		            }
		            
		            ).error(function (data) {
		            	var htmlcode=nunjucks.render('_modules/add-to-shop-list.nunjucks');
		            	$('.product-listing-item__tertiary').replaceWith([htmlcode]);
		            });
			}
				else{
					 $('.product-listing-item__tertiary .add-list-submit-cta').removeClass('active').text('Submit');
					 var htmlcode = nunjucks.render('_modules/add-to-shop-list.nunjucks', {listData:wishListJSON});
       			 $('.product-listing-item__tertiary').replaceWith([htmlcode]);
				}
				if($(self).parent().siblings('.product-listing-item__tertiary').length==0){
					$(self).parent().children('.product-listing-item__tertiary').animate({
			            opacity: 1
			          },{
			        	  complete: function(){
			        		  $(this).find('.product-listing-item__tertiary-lists ul li a').css('padding','4.99px 15px');
			          }
			          
			          }, 500).css('display', 'block');
				}
				else{
				$(self).parent().siblings('.product-listing-item__tertiary').animate({
		            opacity: 1,
		          },{
		        	  complete: function(){
		        		  $(this).find('.product-listing-item__tertiary-lists ul li a').css('padding','4.99px 15px');
		        		  
		          }
		          }, 500).css('display', 'block');
			}
				$('.product-listing-item__tertiary-lists').perfectScrollbar({
			        suppressScrollX: true,
			        swipePropagation: true
			      });
				
			}
			else{
				errorMessageHelper.showGenericError(MessageHelper.messages['_ERR_USER_NOT_LOGGED_IN']);
			}
			
		},
		
		addToList:function(self,lists,itemIds,qty){
			wc.service.declare({
				id:"ShoppingListServiceAddItem",
				actionId:"ShoppingListServiceAddItem",
				url: window.location.origin+'/webapp/wcs/stores/servlet/'+ "AjaxRestWishListAddItem",
				formId:"",

				 /**
			     * Hides all the messages and the progress bar.
			     * @param (object) serviceResponse The service response object, which is the
			     * JSON object returned by the service invocation.
			     */
				successHandler: function(serviceResponse) {
					CachedHeader.invalidateListStorage();
					
					$(self).text('Added to List');
					$(self).parents('.product-listing-item__tertiary').delay(500).fadeOut(300).animate({
			            opacity: 0
			          }, 100);
			          $('.product-listing-item__tertiary-lists a, .add-list-submit-cta').removeClass('selected');
					dojo.topic.publish("ShoppingListItem_Added");
					DMStorage.remove('listItemIds_'+serviceResponse.giftListId[0]);
					CachedHeader.renderTopnavList();
				},
					
				/**
			     * display an error message.
			     * @param (object) serviceResponse The service response object, which is the
			     * JSON object returned by the service invocation.
			     */
				failureHandler: function(serviceResponse) {
					
					
					if (serviceResponse.errorMessage) {
						//$(self).text(serviceResponse.errorMessage);
						//MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
						errorMessageHelper.showGenericError('Error while adding item to list ');
					} 
					else {
						 if (serviceResponse.errorMessageKey) {
							//$(self).text(serviceResponse.errorMessageKey);
							//MessageHelper.displayErrorMessage(serviceResponse.errorMessageKey);
							errorMessageHelper.showGenericError('Error while adding item to list');
						 }
					}
					(self).parents('.product-listing-item__tertiary').delay(500).fadeOut(1000).animate({
			            opacity: 0
			          }, 100);
			          $('.product-listing-item__tertiary-lists a, .add-list-submit-cta').removeClass('selected');
					cursor_clear();
				}			
			});

			
			var externalIdList= lists;
			
			var length = externalIdList.length;
			
			
			for(var i = 0; i < externalIdList.length; i++) {
				 
					  var params =this.setCommonParameters();
					  params.giftListId=externalIdList[i];
					  params.async=false;
					 
					  
					  
					  
					  
					  for(var j=1;j<=itemIds.length;j++){
						  params["catEntryId"+"_"+j]=itemIds[j-1];
						 
						  params["quantity"+"_"+j] = parseInt(qty[j-1]);
						  
						  
						 
						 
					  }
					  
					  wc.service.invoke('ShoppingListServiceAddItem',params);
					  DMAnalytics.events( DMAnalytics.Constants.Action.AddToList,
							  params, 0, null );
					  
				  }
			
			
			
			
			



		},
		
		// Creates a wishlist
		create : function(wishName,self){
			
			
			if(this.checkIfDuplicateListName(wishName,self)) {
				return false;
			}
			if(wishName.length<=15){
				var params ={};
				params.descriptionName=wishName;
				params.description=wishName;
				
				$.ajax({
		            url: window.location.protocol+'//'+window.location.hostname+this.wcsResources+ WCParamJS.storeId + '/wishlist?responseFormat=json',
		            headers: {
		                "Content-Type":"application/json"
		            },
					
		            'data': JSON.stringify(params),
		            method: 'POST',
		            context: this
		        }).done(function(serviceResponse){
		        	CachedHeader.invalidateListStorage();
					$(self).parents('.product-listing-item__tertiary').find('.product-listing-item__tertiary-lists ul').prepend('<li value='+serviceResponse.uniqueID+'><a href="javascript:;">'+serviceResponse.descriptionName+'</a></li>');
					wishListJSON.push({externalIdentifier:serviceResponse.uniqueID,uniqueID:serviceResponse.uniqueID,descriptionName:serviceResponse.descriptionName,storeName:serviceResponse.descriptionName,accessSpecifier:'Private',recordSetCount:'0'});
					nunjucks.configure(WCParamJS.staticServerHost+ 'templates/', {
	                     autoescape: true,
	                     web: {
	                         useCache: true
	                     }
	                 });
					CachedHeader.invalidateListStorage();
	            	var htmlcode=nunjucks.render('_modules/nav-my-list.nunjucks', {listData:wishListJSON});	     
	            	$('#userlists').html(htmlcode);
			          //$('.product-listing-item__tertiary-lists a, .add-list-submit-cta').removeClass('selected');
		        }).fail(function(serviceResponse) {
					if (serviceResponse.errorMessage) {
						//MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
						errorMessageHelper.showGenericError('Error while creating list');
					} 
					else {
						 if (serviceResponse.errorMessageKey) {
							//MessageHelper.displayErrorMessage(serviceResponse.errorMessageKey);
							 errorMessageHelper.showGenericError('Error while creating list');
						 }
					}
			});
			 return true;
			}
			else{
				errorMessageHelper.showGenericError("Length of Wish list name should not exceed 15");
				return false;
			}
				
			
		},
		createWithItem : function(listName,self){
			var cartData={};
			cartData.item=[];
			var json={};
			if($(self).parents('#frequent').length>0){
				var itemIds = resolveSKURecomendationsPid(self);
				var qty = resolveSKURecomendationsQty(self);
				$.each(itemIds,function(index,order){
	    			var dataJson={};
	    			dataJson.quantityRequested=qty[index];
	    			dataJson.productId=itemIds[index];
	    			cartData.item.push(dataJson);
	    		});
			}
			else{
			var prodId=$(self).parents('.product-listing-item.plp-grocery').data('productid');
			if(typeof prodId=='undefined'){
				prodId=$(self).parents('.product-listing-item').data('productid');
			}
			if(typeof prodId !='undefined'){
				json.quantityRequested=$(self).parents('.product-listing-item.plp-grocery').find('.product-listing__quantity--select-quantity').val();
				if(typeof json.quantityRequested=='undefined')
					json.quantityRequested="1";
				json.productId=productListing.products[prodId].currentItem;
				cartData.item.push(json);
			}
			else{
				var itemId = $('#productDetails .slider-variant ul .active').data('item');
				if(typeof itemId == 'undefined'){
					itemId=$('#productDetails .slider-variant ul .addedToCart').data('item');
				}
				json.productId=itemId.toString();
				json.quantityRequested=productDisplay.product.selectedQty[0];
				cartData.item.push(json);
			}
			}
			
			
			cartData.descriptionName=listName;
			cartData.description=listName;
			if(listName.length<=15){
			$.ajax({
	            url: window.location.protocol+'//'+window.location.hostname+this.wcsResources+ WCParamJS.storeId + '/wishlist?responseFormat=json',
	            headers: {
	                "Content-Type":"application/json"
	            },
				
	            'data': JSON.stringify(cartData),
	            method: 'POST',
	            context: this
	        }).done(function(serviceResponse){
	        	CachedHeader.invalidateListStorage();
	        	CachedHeader.renderTopnavList();
	        	$(self).parents('.product-listing-item__tertiary').find('.product-listing-item__tertiary-lists ul').prepend('<li value='+serviceResponse.uniqueID+'><a href="javascript:;">'+serviceResponse.descriptionName+'</a></li>');
				wishListJSON.push({externalIdentifier:serviceResponse.uniqueID,uniqueID:serviceResponse.uniqueID,descriptionName:serviceResponse.descriptionName,storeName:serviceResponse.descriptionName,accessSpecifier:'Private',recordSetCount:'1'});
				nunjucks.configure(WCParamJS.staticServerHost+ 'templates/', {
                     autoescape: true,
                     web: {
                         useCache: true
                     }
                 });
            	var htmlcode=nunjucks.render('_modules/nav-my-list.nunjucks', {listData:wishListJSON});	     
            	$('#userlists').html(htmlcode);
            	$(self).parents('.product-listing-item__tertiary--add-list').siblings('.add-list-submit-cta.button').text('Added to List');
				$(self).parents('.product-listing-item__tertiary').delay(500).fadeOut(300).animate({
		            opacity: 0
		          }, 100);
		          //$('.product-listing-item__tertiary-lists a, .add-list-submit-cta').removeClass('selected');
	        }).fail(function(serviceResponse) {
	        	if (serviceResponse.errorMessage) {
					//MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
	        		errorMessageHelper.showGenericError('Error while adding item to list');
				} 
				else {
					 if (serviceResponse.errorMessageKey) {
						//MessageHelper.displayErrorMessage(serviceResponse.errorMessageKey);
						 errorMessageHelper.showGenericError('Error while adding item to list');
					 }
				}
	        });
		    }
			else{
				errorMessageHelper.showGenericError("Length of Wish list name should not exceed 15");
			}
		},
	
		setCommonParameters:function(){
			var params = [];
			params["storeId"]= storeId;
			params["langId"]="-1";
			
			return params;
		},
		
		addSingleItemToList : function(listId,itemId,callBack,callBackParams) {
			 var item   = [{
					 productId: itemId+'',
					 quantityRequested: '1'
			 }];
			 var input = {};
			 input['item'] = item;
			 $.ajax({
	                url: this.urlPrefixWcs + WCParamJS.storeId + '/wishlist/'+listId+'?addItem=true&responseFormat=json',
	                method: 'PUT',
	                context: this,
	                data : JSON.stringify(input),
	                dataType :'json',
	                headers: { 
	                    'Accept': 'application/json',
	                    'Content-Type': 'application/json' 
	                }
	            }).done(function(data) {
	            	CachedHeader.invalidateListStorage();
	               callBackParams.unshift(data);
	               callBack.apply(this,callBackParams);
	               DMAnalytics.events( DMAnalytics.Constants.Action.AddToList,
	            		   input, 0, null );
	            });
			
		},
		/** Fix for AE-15547 STARTS **/
		checkIfDuplicateListName : function(name,self) {
			var parent = $(self).parents('.product-listing-item__tertiary');
			// Check if name entered is already there in the list
			var dupLists = $.grep($(parent).find('.product-listing-item__tertiary-lists li a'),function(x) {return $(x).text() === $.trim(name)} );
			
			if(dupLists.length>0) {
				$(parent).find('.product-listing-item-list-error').css('display','block'); // this will show error message
				$(parent).find('.product-listing-item__tertiary--field.input-text-field').addClass('input-text-field-error'); //this will add error border to textbox.
				$(parent).find('.product-listing-item__tertiary--add-cta.button').addClass('button--disabled').addClass('button-error').attr('disabled','disabled'); // this will disabled the add button.
				return true;
			}
			
			return false;
		}
		/** Fix for AE-15547 ENDS **/
};
