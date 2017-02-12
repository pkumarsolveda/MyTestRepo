/**
 * Handles the display and click actions in Dashboard page
 */

var DashBoardHelper = {
	urlPrefix : window.location.protocol + '//' + window.location.hostname,
	urlPrefixWcs : window.location.protocol + '//' + window.location.hostname ,
	wcsResources : '/wcs/resources/store/',
	firstSlotDate : '',
	disableSaveButton : 'N',
	searchResources : WCParamJS.searchHostNamePath+'/search/resources/store/' ,
    orderStatus  : 'N,M,A,B,C,R,S,D,F,G,L,c,b,x,p,q,d,e,l,s,r,m,n,t,a,w,y,o,u,f',
    orders : {},
    orderIds : [],
    orderDetail : {},
    monthNames : [
                      "Jan", "Feb", "Mar",
                      "Apr", "May", "Jun", "Jul",
                      "Aug", "Sep", "Oct",
                      "Nov", "Dec"
                    ],
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
    storeId : WCParamJS.storeId || '10151',
    catalogId : WCParamJS.catalogId,
	langId : WCParamJS.langId,
	currentOrderId : '',
	currentSlotId : '',
	selectedSlot:{},
	curPageNum : 1,
	displayAddress :function(){
		  $.ajax({
	          url: DashBoardHelper.urlPrefix +DashBoardHelper.wcsResources+ WCParamJS.storeId + '/person/@self/contact',			
	          method: 'GET',
	          cache: false,
	          context: this
	      }).done(function(data){
	    	  
	    	  nunjucks.configure(WCParamJS.staticServerHost+ 'templates/', {
		  			autoescape: true,
		  			web: {
		  				useCache: true
		  			}
		  		});
	    	  if (data.contact) {
					var dummyAddress = [];
					var newContact  = [];
					$.each(data.contact, function(i, contacts) {
					if(contacts.firstName === contacts.nickName){
						dummyAddress.push(contacts.nickName);
						} else{
						newContact.push(contacts);
						}
					});
					if(newContact.length > 0){
						data.contact = newContact;
					}else{
						delete data.contact;
					}
				}
	    	  if(data.contact == undefined){
	    	       if($('.dashboard__address').find('li').length <=1 ) {
	    	    	  if($('.dashboard__address').find('li').length == 1){
	    	    		  $('.dashboard__address').find('li').remove();
	    	    	  }
	    	          $('.js-new-address-cta').hide();
	    	          $('.resp-tab-content-active:visible').find('.dashboard-no-items').removeClass('js-hide-show');
	    	          $('.resp-tab-content-active:visible').find('.dashboard__address--label').hide();	    	          

	  	    	      $('.delivery-vertical__address-new').delay(200).fadeIn(500);	
	  	    	      
	    	        }    	      
			  	  document.getElementById('formNewAddress').reset();
			  	  
				  	var selectedPincode = $('.delivery-code__pin').text();
				  	if(selectedPincode.length > 0){
				  		var pincodeState = undefined;
				    	var pincodeCity = undefined;
				    	//$('.delivery-vertical__address-new').find('[name="newPincode"]').val(selectedPincode);	//AE-17463
				    	var pincodeMap = DMStorage.getValue('pincodeMap');
				    	if(selectedPincode != '' && pincodeMap != null){
							$.each(pincodeMap, function(i, pin) {
								if(selectedPincode == pin.Pincode){
									pincodeState = pin.State;
									pincodeCity = pin.Region
								}
							});
						}
				    	if(pincodeState != undefined && pincodeCity != undefined){
				    		$('.delivery-vertical__address-new').find('[name=newCity]').val(pincodeCity).prop("disabled", true);
				    		$('.delivery-vertical__address-new').find('[name=newState]').val(pincodeState).prop("disabled", true);
				    	}
				  	}
				  	$('.delivery-vertical__address-new').find('[name=mobileNumber]').val($('#changeMobileNumber').val());
			    	
	    	  }else{			    	  
			    	  
			    	$('.resp-tab-content-active:visible').find('.dashboard-no-items').addClass('js-hide-show');
			    	var htmlCode = nunjucks.render('_modules/dashboard-manage-address.nunjucks', {
			  			data: data
			  		});  			    	
			    	
			    	$('.js-new-address-cta').show();
			    	 $('.resp-tab-content-active:visible').find('.dashboard__address--label').show();
			  		$('.dashboard__address-manage-address').html(htmlCode);
			  		
			  		
	    	  }
	    	  $('.manage-address').perfectScrollbar({
				  suppressScrollX: true,
				  swipePropagation: true
			  });
	    	  $('html, body').css('overflow', 'auto');
	      });		
		  
		  
		  console.log($('.dashboard__address-manage-address').width());
		  console.log($('.dashboard__address').width());
		/*  $('.dashboard__address-manage-address').width($('.dashboard__address-manage-address').width()* .95);
		  $('.dashboard__address-manage-address').mCustomScrollbar({
	  	      scrollbarPosition: 'outside',
	  	      scrollInertia: 60,
	  	      callbacks: {
	  	        whileScrolling: function () {
	  	          $(this).on('mousewheel', function (e) {
	  	            e.preventDefault();
	  	            e.stopPropagation();
	  	          });
	  	        }
	  	      }
	  	    }); */
	},
	
	renderAddressModal :function(data){
		nunjucks.configure(WCParamJS.staticServerHost+ 'templates/', {
			autoescape: true,
			web: {
				useCache: true
			}
		});
		$('#error-msg-container').before(nunjucks.render('_modules/modal-address-edit.nunjucks'));
		$('#error-msg-container').before(nunjucks.render('_modules/modal-address-new.nunjucks'));
	},

	changePersonalDetails :function(){
		
	  // to hide verfiy email link if email field is empty JIRA 7326
    	if($('#dashboardPersonalDetailsValidation #email').val() == ""){
    		$('.verifyEmailLink').css('display', 'none');
    	}else{
    		$('.verifyEmailLink').css('display', 'block');
    	}
	    
		var prevFirstName = $('#firstName').data('prevfirstname');
		var prevLastName = $('#lastName').data('prevlastname');
		var prevMobileNo = $('#changeMobileNumber').data('prevmobilenumber');
		var prevEmail = $('#dashboardPersonalDetailsValidation #email').data('prevemail');
		
		var firstName = $('#firstName').val();
		var lastName = $('#lastName').val();
		var mobileNo = $('#changeMobileNumber').val();
		var email = $('#dashboardPersonalDetailsValidation #email').val();
		
		var params = {};
		
		var formChanged = false;
		var emailChanged = false;
		var mobileChanged = false;
		if(prevFirstName!=firstName){
			params.firstName = firstName;
			formChanged = true;
		}
		if(prevLastName!=lastName){
			params.lastName = lastName;
			formChanged = true;
		}
		if(prevMobileNo!=mobileNo){
			params.logonId = mobileNo;
			formChanged = true;
			mobileChanged = true;
		}
		if(prevEmail!=email){
			params.prevEmail = prevEmail; // Fix for JIRA 7014
			params.email2 = email;
			formChanged = true;
			emailChanged = true;
		}
		
		params = JSON.stringify(params);
		
		if(formChanged && $('#dashboardPersonalDetailsValidation').valid()){
			$.ajax({
				url: "/wcs/resources/store/" + storeId + "/person/@self/changeCredentials",
				type: "PUT",
				data: params,
				context: this,
				contentType: "application/json"
			}).done(function(data) {
				if(mobileChanged){
					var commonData = 'storeId='+ WCParamJS.storeId + '&catalogId=' + WCParamJS.catalogId + '&langId=' + WCParamJS.langId
					var redirectURL = 'OTPValidateView?' + commonData;
					redirectURL += '&actionCmd=LogonIdChangeCmd&operation=0&mobileNumber='+mobileNo;
					var previousPage = 'AjaxLogonForm?' +  commonData + '&myAcctMain=1';
					redirectURL += '&URL='+encodeURIComponent(previousPage);
					window.location.href = redirectURL;
				}
				if(!emailChanged){
					errorMessageHelper.showGenericError(MessageHelper.messages["MY_DASHBOARD_DETAILS_CHANGE_SUCCESS"]);
				}else{  // Fix for JIRA 7014
					if(email == ''){
						errorMessageHelper.showGenericError(MessageHelper.messages["MY_DASHBOARD_DETAILS_CHANGE_SUCCESS"]);
					}else{
						var modMessage = MessageHelper.messages["MY_DASHBOARD_DETAILS_EMAIL_CHANGE_SUCCESS"].replace("#email",email);
						errorMessageHelper.showGenericError(modMessage);
				    	$('.verified-email').hide();
				    	$('.not-verified-email').show();
					}
				}
			}).fail(function(data) {
				errorMessageHelper.showGenericError(MessageHelper.messages["GENERIC_ERROR_MESSAGE"]);
			});
		}		
	},
	
	changePassword:function(){
		var newPassword = $('#showHidePassword').val();
		var oldPassword = $('#oldPassword').val();
		if(newPassword && oldPassword){
			var params = {};
			params.newPassword = newPassword;
			params.oldPassword = oldPassword;
			params = JSON.stringify(params);
			$.ajax({
				url: "/wcs/resources/store/" + storeId + "/person/@self/changeCredentials",
				type: "PUT",
				data: params,
				context: this,
				contentType: "application/json"
			}).done(function(data) {				
				errorMessageHelper.showGenericError(MessageHelper.messages["MY_DASHBOARD_PASSWORD_CHANGE_SUCCESS"]);	
				document.getElementById('dashboardChangePasswordValidation').reset();	
				// Change text field back to password field
				$('#showHidePassword').attr('type', 'password');
				$('div.progress-password').hide();
				
				// Reset previous values
				$('#firstName').attr('data-prevfirstname',$('#firstName').val());
				$('#lastName').attr('data-prevlastname',$('#lastName').val());
				$('#changeMobileNumber').attr('data-prevmobilenumber',$('#changeMobileNumber').val());
				$('#email').attr('data-prevemail',$('#email').val());
			}).fail(function(data){
				if(JSON.parse(data.responseText).errors[0].errorKey == "_ERR_PASSWORD_INVALID"){
					errorMessageHelper.showGenericError(MessageHelper.messages["MY_DASHBOARD_ERR_PASSWORD_INVALID"]);
				}else{
					errorMessageHelper.showGenericError(JSON.parse(data.responseText).errors[0].errorMessage);
				}
			});
		}
	},
	
	editAddressLoad: function(nickName) {
		var div = $('#editAddressModal');
		$("#formEditAddress").data('validator').resetForm();
		div.show();
		var addressData = $('#addressList-' + nickName).val().split('||');
		div.find("[name='editName']").val(addressData[0]);
		// OOB doesnt have andmark. Bad approach
		if(addressData[1].indexOf('Landmark:') > 0){
			div.find("[name='editAddress']").val((addressData[1].substr(0,addressData[1].indexOf('Landmark:') -1)));
			var landmark = (addressData[1].substr(addressData[1].indexOf('Landmark:'), addressData[1].length)).replace('Landmark: ','');
			if(landmark.substr(landmark.length-1,landmark.length) == ','){
				landmark = landmark.substr(0,landmark.length-1);
			}
			div.find("[name='editLandmark']").val(landmark);
		}
		else{
			div.find("[name='editAddress']").val(addressData[1].substr(0,(addressData[1].length-2)));
			div.find("[name='editLandmark']").val('');
		}
		div.find("[name='editCity']").val(addressData[2]).prop("disabled", true);
		div.find("[name='editState']").val(addressData[3]).prop("disabled", true);
		div.find("[name='editPincode']").val(addressData[4]);
		$('#editAddressModal').find('#editMobileNumber').val(addressData[5]);
		$('#editAddressModal').find('#addressList-nickName').val(nickName);
		if(addressData[6] === 'fav'){
			$('#editAddressModal').find('.js-make-default-address').addClass('active');
		}else{
			$('#editAddressModal').find('.js-make-default-address').removeClass('active');
		}

	},
	
	editAddress: function() {
		var nickName = $('#editAddressModal').find('#addressList-nickName').val();
		var values = {};
		var inputData = {};
		$('#editAddressModal input[name=editCity]').prop("disabled", false);
		$('#editAddressModal input[name=editState]').prop("disabled", false);
		$('#editPincode-error,#newPincode-error,#newCity-error').remove();
		$.each($('#formEditAddress').serializeArray(), function(i, field) {
			values[field.name] = field.value;
		});
		if (!this.checkValidPincode(values.editPincode)){
				setTimeout(function(){
				$('#editPincode-error').remove();
				var divObject = $('#formEditAddress').find("[name='editPincode']");
				divObject.addClass('error');
				divObject.parent().append('<span id="newPincode-error" class="error" style="display: inline;">Selected pin code not serviceable!</span>');
				}, 500);
				return false; 
		}
		inputData.nickName = nickName;
		inputData.firstName = values.editName.trim();
		inputData.addressLine = [];
		inputData.addressLine[0] = values.editAddress.replace(/\n/g, ' ').trim();
		// OOB doesnt have landmark. so saving with a flag
		if(values.editLandmark.length > 0){
			inputData.addressLine.push('Landmark: '+values.editLandmark);
		}else{
			inputData.addressLine.push("");
		}			
		inputData.city = values.editCity;
		inputData.addressType = 'ShippingAndBilling';
		inputData.state = values.editState;
		inputData.phone1 = values.editMobileNumber;
		inputData.mobilePhone1 = values.editMobileNumber;
		inputData.zipCode = values.editPincode;
		inputData.primary = ($('#editAddressModal').find('.js-make-default-address').hasClass('active')).toString();
		inputData.country = 'India';
		inputData = JSON.stringify(inputData);
		$.ajax({
			url: "/wcs/resources/store/" + storeId + "/person/@self/contact/" + nickName,
			type: "PUT",
			data: inputData,
			context: this,
			contentType: "application/json"
		}).done(function(data) {
			$('#formEditAddress').removeClass('add-in-progress');
			this.displayAddress();
			$('#editAddressModal').hide();
		}).fail(function(data){
			$('#formEditAddress').removeClass('add-in-progress');
			errorMessageHelper.showGenericError(JSON.parse(data.responseText).errors[0].errorMessage);
		});

	},
	
	saveAddress: function(formName) {
		var values = {};
		var inputData = {};
		$('#'+formName+' input[name=newCity]').prop("disabled", false);
		$('#'+formName+' input[name=newState]').prop("disabled", false);	
		$.each($('#'+formName).serializeArray(), function(i, field) {
			values[field.name] = field.value;
		});
		if (!this.checkValidPincode(values.newPincode)){
				setTimeout(function(){
					var divObject = $('#'+formName).find("[name='newPincode']");
					divObject.addClass('error');
					divObject.parent().append('<span id="newPincode-error" class="error" style="display: inline;">Selected pin code not serviceable!</span>');
				}, 500);
				return false; 
		}
		inputData.nickName = new Date().getTime().toString();
		inputData.firstName = values.newName.trim();
		inputData.addressLine = [];
		inputData.addressLine[0] = values.newAddress.replace(/\n/g, ' ').trim();
		// OOB doesnt have landmark. saving with a flag
		if(values.newLandmark.length > 0){
			inputData.addressLine.push('Landmark: '+values.newLandmark);
		}
		inputData.city = values.newCity;
		inputData.addressType = 'ShippingAndBilling';
		inputData.state = values.newState;
		if(values.newMobileNumber){
			inputData.phone1 = values.newMobileNumber;
			inputData.mobilePhone1 = values.newMobileNumber;
		}else{
			inputData.phone1 = values.mobileNumber;
			inputData.mobilePhone1 = values.mobileNumber;
		}
		inputData.zipCode = values.newPincode;
		inputData.primary = ($('#'+formName).find('.js-make-default-address').hasClass('active')).toString();
		inputData.country = 'India';
		inputData = JSON.stringify(inputData);
		$.ajax({
			url: "/wcs/resources/store/" + storeId + "/person/@self/contact",
			type: "POST",
			data: inputData,
			context: this,
			contentType: "application/json"
		}).done(function(data) {
			$('#formNewAddressModal').removeClass('add-in-progress');
			$('#formNewAddress').removeClass('add-in-progress');
			this.displayAddress();
			$('#newAddressModal').hide();
		}).fail(function(data){
			$('#formNewAddressModal').removeClass('add-in-progress');
			$('#formNewAddress').removeClass('add-in-progress');
			errorMessageHelper.showGenericError(JSON.parse(data.responseText).errors[0].errorMessage);
		});
	},
	
	deleteAddress: function(nickName) {
		$.ajax({
			url: "/wcs/resources/store/" + storeId + "/person/@self/contact/" + nickName,
			type: "DELETE",
			context: this,
			contentType: "application/json"
		}).done(function(data) {
			this.displayAddress();
		});

	},

	makeAddressFav: function(nickName,isPrimary) {
		var inputData = {};
		inputData.primary = isPrimary;
		inputData = JSON.stringify(inputData);
		$.ajax({
			url: "/wcs/resources/store/" + storeId + "/person/@self/contact/" + nickName,
			type: "PUT",
			data: inputData,
			context: this,
			contentType: "application/json"
		}).done(function(data) {
			this.displayAddress();
		});
	},
	
	renderMyOrders: function(divId, data,isLazyLoad) {
		var JSONdata = {};
		var imgUrl= window.location.origin+'/webapp/wcs/stores/servlet/';
		this.config= {'baseUrl':imgUrl};
		var self = this;
		self.orderIds = [];
		var pageSize = 4;
		$.ajax({
			url: this.urlPrefixWcs  + this.wcsResources + WCParamJS.storeId + '/order/orderByStatus/all?pageNumber='+self.curPageNum+'&pageSize='+pageSize+'&allStoreFlag=true',
		    method: 'GET',
		    context: this,
		    cache : false,
		    async: false
		}).done(function(data) {
			var totalOrders = data.recordSetCount;
			if(totalOrders == 0){
				return;
			}
		    $.each(data.Order, function(ordIndex, ordObject) {
		    	var orderIdentifier = ordObject.orderId;
		    	var order = {};
		    	if(ordObject.x_sixtyDaysEligible == 'valid'){
		    		order.identifier = ordObject.orderId;
			    	order.placedDate = ordObject.x_formattedPlacedDate;
			    	order.eligibleOrder = ordObject.x_sixtyDaysEligible;
			    	order.deliveryMode = ordObject.x_deliveryMode;
			    	order.status = ordObject.orderStatus;
			    	order.statusText = self.statusMapper(ordObject.orderStatus);
			    	if(ordObject.orderStatus == 'M' || ordObject.orderStatus == 'F'){
			    		var field3 = ordObject.x_field3;
			    		if(field3 == 'undefined' || field3 == null || field3 ==''){ //COD order
			    			order.statusText = 'Under Process';
			    		}
			    	}
			    	order.slotDatePast = ordObject.x_slotDatePast;
			    	order.isSlotChangeEligible = self.checkSlotChangeEligibility(ordObject.orderStatus,ordObject.x_slotDate,ordObject.x_slotDatePast);
			    	order.isCancelOrderEligible = self.checkCancelOrderEligibility(ordObject.orderStatus);
			    	order.isRepayOrderEligible = self.checkRepayOrderEligibility(ordObject.orderStatus,ordObject.placedDate,ordObject.x_field3);
			    	order.placedDateAndTime = ordObject.placedDate;
			    	order.isReorderEligible = self.checkReorderEligibility(ordObject.orderStatus);
			    	order.slotDate = typeof ordObject.x_slotDate != 'undefined' ? ordObject.x_slotDate.replace(/-/g, ' ') : ordObject.x_slotDate;
			    	order.slotStart = typeof ordObject.x_slotStartTime != 'undefined' ? ordObject.x_slotStartTime.replace(/ /g, '') : ordObject.x_slotStartTime;
			    	order.slotEnd = typeof ordObject.x_slotEndTime != 'undefined' ? ordObject.x_slotEndTime.replace(/ /g, '') : ordObject.x_slotEndTime; 
			    	if(ordObject.x_slotDate != undefined){
						//var dateModified = ordObject.x_slotDate.replace(/-/g,'/');
			    		// Fix for displaying the current Slot as selected in IE
						var dateArray = ordObject.x_slotDate.split('-');
						var modSlotDate = new Date(dateArray[2]+'/'+dateArray[1]+'/'+dateArray[0]);
						// Fix for JIRA 5298
						var soltMonth = parseInt(modSlotDate.getMonth()+1);
						if(soltMonth.toString().length == 1){
							 soltMonth = "0".concat(soltMonth);
						}
						var orderSlotDate = modSlotDate.getDate();
						if(orderSlotDate.toString().length == 1){
							orderSlotDate = "0".concat(orderSlotDate);
						}
						modSlotDate = orderSlotDate+'/'+soltMonth+'/'+modSlotDate.getFullYear();
						order.modSlotDate = modSlotDate;
		    		}
			    	order.slotResourcePoolKey = ordObject.x_slotResourcePoolKey;
			    	
			    	if(ordObject.x_field3 == null || ordObject.x_field3 == '' || ordObject.x_field3 == undefined){
			    		order.paymentMode =  "Cash On Delivery";
			    	}else{
			    		order.paymentMode =  "Prepaid";
			    	}
			    	order.grandTot =  parseFloat(ordObject.grandTotal);
			    	order.codRounded = ordObject.x_codRoundedOrderTotal;
			    	self.orders[order.identifier] = order;
			    	self.orderIds.push(ordObject.orderId);
		    	}
		    	
		    	
		    });
		    var loadTotal = data.recordSetTotal;
	        var total = $('.dashboard-myorder-list li').length;
	        var windowPos = $(window).scrollTop();
	        var myorderHeight = $('.dashboard-myorder-list li').height();
	        var loadMore = myorderHeight * total;
		    nunjucks.configure(WCParamJS.staticServerHost+'templates/',{ autoescape: true, web : {useCache:true} });
		    JSONdata.orders = self.orders;
		    JSONdata.orderIds = self.orderIds;
		    JSONdata.config=this.config;
		    JSONdata.storeId = self.storeId;
		    JSONdata.catalogId = self.catalogId;
		    JSONdata.langId = self.langId;
		    var urlPrefix = window.location.protocol + '//' + window.location.hostname + '/webapp/wcs/stores/servlet/';
		    JSONdata.formAction=urlPrefix+"CheckoutView";
		     if(JSONdata.orderIds.length>0){
		    	 $.each(JSONdata.orders,function(){
		    		 this.placedDate=this.placedDate.replace(/[-]/g," "); 
		    	 });
		     }
		    if (isLazyLoad) {
		    	if(JSONdata.orderIds.length>0) {
    	            $('#' + divId).append(nunjucks.render('_modules/dashboard-my-orders.nunjucks', {
    	                data: JSONdata
    	            }));
    	            lazyLoadActive = false;
            	}

	        } else {
	        	if(JSONdata.orderIds.length>0) {
	        		$('#' + divId).html(nunjucks.render('_modules/dashboard-my-orders.nunjucks', {
	                    data: JSONdata
	                }));
	        	}
	        }
		    total = $('.dashboard-myorder-list li').length;
        	if(total >= loadTotal) {
        		$('.dashboard-myorder-list .no-more-datas').remove();
                //$('#MyOrdersDiv .dashboard-myorder-list').last().append('<li class="no-more-datas">&nbsp;</li><li class="no-more-datas alert alert-danger text-center">No more datas!</li>');
        	}
		   
		});
		
		if($('.dashboard-myorder-list li').length <1 && DashBoardHelper.orderIds.length < 1){
			$('.dashboard-myorder--heading').hide();
			$('#new-customer').show();
		} 
		
		$(window).scroll(this.scrollPage);
    },
    
    scrollPage : function(){
    	var handle;
    	var footerHeight = $('footer').height() + $('.footer-credibility').height();
    	if(handle) {
        	window.clearTimeout(handle);
        }	
        handle =	window.setTimeout(function() {
        	if ($(window).scrollTop() > ($(document).height() - $(window).height() - footerHeight ) && !this.lazyLoadActive) {
        		DashBoardHelper.curPageNum = DashBoardHelper.curPageNum + 1;
	            this.lazyLoadActive = true;
	            DashBoardHelper.renderMyOrders('MyOrdersDiv', null, true);
	            window.clearTimeout(handle);
        	 }
        	},100);
       
    },
    renderOrderDetails : function(divId,orderId){
    	//alert("orderId " +orderId);
    	var JSONdata = {};
    	var oiAttributeJSON = {};
    	var orderItemIds = [];
    	var catentryIds = [];
		var imgUrl= WCParamJS.imageServerHost;
		this.config= {'baseUrl':imgUrl};
		var totalQuantity = 0;
		var totalItemLevelSavings = 0;
		var cartTotal = 0;
		var self = this;
		$.ajax({
		    url: this.urlPrefixWcs  + this.wcsResources + WCParamJS.storeId + '/order/byId/' + orderId +'?allStoreFlag=true',
		    method: 'GET',
		    context: this,
		    async: false,
		    cache : false
		}).done(function(data) {
			 self.orderDetail.orderItems = {};
			 self.orderDetail.orderItemsArray = [];
			 $.each(data.orderItem, function(ordItemIndex, ordItemObject) {
				 var tempOrderItem = {};
				 tempOrderItem.orderItemId = ordItemObject.orderItemId;
				 orderItemIds.push(ordItemObject.orderItemId);
				 catentryIds.push(ordItemObject.productId);
				 tempOrderItem.partNumber = ordItemObject.partNumber;
				 tempOrderItem.catentryId = ordItemObject.productId;
				 tempOrderItem.quantity = parseInt(ordItemObject.quantity);
				 //Check if order item is either cancelled or returned.
				 //ordItemObject.orderItemStatus = 'x'	-- For testing
				 
				 tempOrderItem.unitPrice = parseFloat(ordItemObject.unitPrice);
				 tempOrderItem.orderItemPrice = parseFloat(ordItemObject.orderItemPrice);
				 tempOrderItem.orderItemAdjustment = parseFloat(ordItemObject.totalAdjustment['value']);
				 if(typeof ordItemObject.adjustment !='undefined'){
					 tempOrderItem.orderItemAdjustment=-parseFloat(DashBoardHelper.calculateItemDiscount(ordItemObject.adjustment,'OrderItem','Discount'));
				 }
				 tempOrderItem.orderItemAdjustedPrice =  tempOrderItem.orderItemPrice + tempOrderItem.orderItemAdjustment;
				 cartTotal +=  tempOrderItem.orderItemAdjustedPrice;
				 tempOrderItem.orderItemStatus = ordItemObject.orderItemStatus;
				 tempOrderItem.firstName = ordItemObject.firstName;
				 tempOrderItem.field2 = ordItemObject.xitem_field2;
				 tempOrderItem.savings = parseFloat(0);
				 var priceChange = false;
				 tempOrderItem.freeGift = ordItemObject.freeGift;
				 tempOrderItem.rq = 0;
				 tempOrderItem.cq = 0; 
				 if(ordItemObject.xitem_field2 != '' && ordItemObject.xitem_field2 != undefined && ordItemObject.xitem_field2 != null){
					 var pp = JSON.parse(ordItemObject.xitem_field2).PP;
					 if(pp != undefined && pp != null && pp != ''){
						 tempOrderItem.previousPrice = parseFloat(pp);
						 if(tempOrderItem.unitPrice !=  tempOrderItem.previousPrice ){
							 priceChange = true;
						 }
					 }
					 var mrp = JSON.parse(ordItemObject.xitem_field2).MRP;
					 if(mrp != undefined && mrp != null && mrp != ''){
						tempOrderItem.calculatedMRP = parseFloat(mrp); //Fix for AE-10841
						var tempSavings = (tempOrderItem.quantity * parseFloat(mrp)) - tempOrderItem.orderItemAdjustedPrice;
						if(tempSavings > 0 ){
							tempOrderItem.savings = tempSavings.toFixed(2); 
							totalItemLevelSavings = totalItemLevelSavings + parseFloat(tempOrderItem.savings);
						}
					 }
					 //Getting the Cancelled Quantity
					 var cq = JSON.parse(ordItemObject.xitem_field2).CQ;
					 if(cq != undefined && cq != null && cq != ''){
							tempOrderItem.cq = cq;
					 }
					//Getting the Returned Quantity
					 var rq = JSON.parse(ordItemObject.xitem_field2).RQ;
					 if(rq != undefined && rq != null && rq != ''){
							tempOrderItem.rq = rq;
					 }
				 }
				 //tempOrderItem.orderItemCRStatus = self.checkOICancelReturnedStatus(ordItemObject.orderItemStatus,tempOrderItem.cq,tempOrderItem.rq);
				 var crStat = self.checkOICancelReturnedStatus(ordItemObject.orderItemStatus,tempOrderItem.cq,tempOrderItem.rq);
				 tempOrderItem.orderItemCRStatus = crStat.cancelReturnFlag;
				 tempOrderItem.orderItemCanStatusText ='';
				 tempOrderItem.orderItemRetStatusText ='';
				 if(tempOrderItem.orderItemCRStatus){
					  var stCanTxt = self.statusMapper(crStat.oiCanStatus);
					  var stRetTxt = self.statusMapper(crStat.oiRetStatus);
					  if(tempOrderItem.cq>0 && stCanTxt != 'Status Unknown'){
						  stCanTxt = stCanTxt + '('+ tempOrderItem.cq+ ')';
						  tempOrderItem.orderItemCanStatusText = stCanTxt;
					  } 
					  if(tempOrderItem.rq > 0 && stRetTxt != 'Status Unknown'){
						  stRetTxt = stRetTxt + '('+ tempOrderItem.rq+ ')';
						  tempOrderItem.orderItemRetStatusText = stRetTxt;
					  }
				 }

				 if(ordItemObject.adjustment && ordItemObject.adjustment.length>0 ) {
					 var len = ordItemObject.adjustment.length;
					 for(i=0;i<len;i++) {
			    		if(ordItemObject.adjustment[i].displayLevel === 'OrderItem') {
			    			tempOrderItem.offerDescription = ordItemObject.adjustment[i].description;
			    			tempOrderItem.offer = true;
			    		}
			    	}
				 }
				 tempOrderItem.adjustment = ordItemObject.adjustment;
				 tempOrderItem.priceChangeFlag = priceChange;
				 tempOrderItem.lastName = ordItemObject.lastName;
				 tempOrderItem.middleName = ordItemObject.middleName;
				 tempOrderItem.addressLine1 = ordItemObject.addressLine[0];
				 tempOrderItem.addressLine2 = ordItemObject.addressLine[1];
				 tempOrderItem.addressLine3 = ordItemObject.addressLine[2];
				 tempOrderItem.city = ordItemObject.city;
				 tempOrderItem.state = ordItemObject.state;
				 tempOrderItem.country = ordItemObject.country;
				 tempOrderItem.zipCode = ordItemObject.zipCode;
				 tempOrderItem.phone1 = ordItemObject.phone1;
				 totalQuantity = totalQuantity + parseInt(ordItemObject.quantity);
				 self.orderDetail.orderItems[ordItemObject.orderItemId]=tempOrderItem;
				 self.orderDetail.orderItemsArray.push(tempOrderItem);
				 
			 });
			 
			 //Call getItemDetailsFromSOLR()
			 self.getItemDetailsFromSOLR(catentryIds,data.storeUniqueID);
			 oiAttributeJSON.orderItems = self.orderDetail.orderItems;
			 oiAttributeJSON = self.packProductAttributes(oiAttributeJSON,data.storeUniqueID);
			 
			 self.orderDetail.orderIdentifier = data.orderId;
			 self.orderDetail.orderStatus = data.orderStatus;
			 self.orderDetail.statusText = self.statusMapper(data.orderStatus);
		    	if(data.orderStatus == 'M' || data.orderStatus == 'F'){
		    		var field3 = data.x_field3;
		    		if(field3 == 'undefined' || field3 == null || field3 ==''){ //COD order
		    			self.orderDetail.statusText = 'Under Process';
		    		}
		    	}
		     self.orderDetail.deliveryMode = (data.x_deliveryMode=='Pickup Point')?'DMart Ready Pick-up Point':data.x_deliveryMode;
			 self.orderDetail.slotDate = data.x_slotDate.substr(0, 3)+DashBoardHelper.monthNamesObj[data.x_slotDate.substr(3, 3)]+data.x_slotDate.substr(6, 5);
			 self.orderDetail.slotStartTime = data.x_slotStartTime.replace(/ /g, '');  // Fix for JIRA 5298
			 self.orderDetail.slotEndTime = data.x_slotEndTime.replace(/ /g, '');
			 self.orderDetail.orderPlacedDate = data.x_formattedPlacedDate.substr(0, 3)+DashBoardHelper.monthNamesObj[data.x_formattedPlacedDate.substr(3, 3)]+data.x_formattedPlacedDate.substr(6, 5);
			 self.orderDetail.slotDatePast = data.x_slotDatePast;
			 self.orderDetail.isSlotChangeEligible = self.checkSlotChangeEligibility(self.orderDetail.orderStatus,self.orderDetail.orderPlacedDate,self.orderDetail.slotDatePast);
	    	 if(data.x_slotDate != undefined){
				var dateArray = data.x_slotDate.split('-');
				var modSlotDate = new Date(dateArray[2]+'/'+dateArray[1]+'/'+dateArray[0]);
				// Fix for JIRA 5298
				var soltMonth = parseInt(modSlotDate.getMonth()+1);
				if(soltMonth.toString().length == 1){
					 soltMonth = "0".concat(soltMonth);
				}
				var orderSlotDate = modSlotDate.getDate();
				if(orderSlotDate.toString().length == 1){
					orderSlotDate = "0".concat(orderSlotDate);
				}
				modSlotDate = orderSlotDate+'/'+soltMonth+'/'+modSlotDate.getFullYear();
				self.orderDetail.modSlotDate = modSlotDate;
    		 } 
	    	 
			 //if(data.paymentInstruction != undefined && data.paymentInstruction[0] != undefined){
				 self.orderDetail.paymentMethod = typeof data.x_field3 == 'undefined' ? "Cash on delivery" :
					 data.x_field3.split('|')[0];	
			 //}
			 self.orderDetail.cartTotal = CartHelper.formatPricesForDisplay(cartTotal);
			 self.orderDetail.totalProductPrice = parseFloat(data.totalProductPrice);
			 self.orderDetail.grandTotal = parseFloat(data.grandTotal);
			 self.orderDetail.codRounded = parseFloat(data.x_codRoundedOrderTotal);
			 //self.orderDetail.codRounded = (data.grandTotal % 1) > 0.56 ? Math.ceil(data.grandTotal) : Math.floor(data.grandTotal);
			 self.orderDetail.tax = parseFloat(data.totalSalesTax);
			 self.orderDetail.totalAdjustment = parseFloat(data.totalAdjustment);
			 self.orderDetail.orderLevelDiscount = parseFloat(CartHelper.calculateDiscount(data.adjustment,'Order', 'Discount').toFixed(2)); 
			 self.orderDetail.totalItemLevelSavings = parseFloat(totalItemLevelSavings.toFixed(2));
			 self.orderDetail.totalShippingCharge = parseFloat(data.totalShippingCharge);
			 self.orderDetail.orderLevelQuantity = totalQuantity;
			 self.orderDetail.orderItemIds= orderItemIds;
			 self.orderDetail.discount=CartHelper.calculateDiscount(data.adjustment,'Order','Discount');
			 self.orderDetail.shipmentDiscount=CartHelper.calculateDiscount(data.adjustment,'Order','Shipping Adjustment');
			 //For the order items and attributes
			 self.orderDetail.oiAttributes = oiAttributeJSON;
			 
			 // Make this dynamic
			 self.orderDetail.isItemCancelled = false;
			 self.orderDetail.howManyCancelled = 0;
			 // Make this dynamic
			 
			 nunjucks.configure(WCParamJS.staticServerHost+'templates/',{ autoescape: true, web : {useCache:true} });
			 JSONdata.orderDetail = self.orderDetail;
			 JSONdata.config=this.config;
			 JSONdata.storeId = self.storeId;
			 JSONdata.catalogId = self.catalogId;
			 JSONdata.langId = self.langId;
			 JSONdata.noImagePath=WCParamJS.imageServerHost+'images/DMart/NoImage_T.jpg';
			 var htmlcode = nunjucks.render('order-details.nunjucks', {data:JSONdata});
			 $('#OrderDetails').html(htmlcode);
			 //$('#order-detail-cart').removeStyle('display');
			 
		}).error(function (data){
			$('#guestOrderTrackModal').css('display','block');
			$('#guestOrderTrackModal #guestOrderId').val(orderId);
		});
    	
    },
    
    calculateItemDiscount : function(adjustment,displayLevel,usage) {
    	var discount = 0, len = 0, i =0;
    	
    	if(adjustment) {
    		len = adjustment.length;
    		for(;i<len;i++) {
    			if(adjustment[i].usage === usage && adjustment[i].displayLevel === displayLevel ) {
    				discount += parseFloat(adjustment[i].amount);
    			}
    		}
    	}
    	
    	return -discount;
    },

    showCityAndStateForPincode: function(aPinCode, divName) {
		var pincodeState = undefined;
    	var pincodeCity = undefined;
		var pincodeMap = DMStorage.getValue('pincodeMap');
		if(pincodeMap != null){
			$.each(pincodeMap, function(i, pin) {
				if(aPinCode == pin.Pincode){
					pincodeState = pin.State;
					pincodeCity = pin.Region
				}
			});
		}
		if(pincodeState != undefined && pincodeCity != undefined){
			var divCityIdentifier = (divName == 'new') ? '#newAddressModal input[name=newCity]'
					: '#editAddressModal input[name=editCity]';			
			var divStateIdentifier = (divName == 'new') ? '#newAddressModal input[name=newState]'
					: '#editAddressModal input[name=editState]';	
			$(divCityIdentifier).val(pincodeCity).prop("disabled", true);
			$(divStateIdentifier).val(pincodeState).prop("disabled", true);
			$(divStateIdentifier).removeClass('error');
			$(divStateIdentifier).removeClass('error');	
			$((divName == 'new') ? '#newCity-error' : '#editCity-error').hide();
			$((divName == 'new') ? '#newState-error' : '#editState-error').hide();
		}else{
			//$('#newCity-error').remove();
			(divName == 'new') ? this.showPinCodeNotServedNew() : this.showPinCodeNotServedEdit() ;
		}
		
	},
	showPinCodeNotServedNew : function() {
		setTimeout(function(){
			var divObject = $('#formNewAddressModal').find("[name='newPincode']");
			divObject.addClass('error');
			var newPincode = $('#newAddressModal input[name=newPincode]').val();
			var errorMsg = 'Selected pin code not serviceable!';
			var content = $('#newPincode-error').html();
			if(newPincode == ''){
				errorMsg = 'Enter Pincode';
			}else if(content == 'Please enter a valid pin code.'){
				errorMsg = 'Please enter a valid pin code.';
			}
			//if(content && content.length >0){
			if($('#newPincode-error').length >0){
				$('#newPincode-error').html(errorMsg);
			}else{
				$('#newPincode-error').remove();
				divObject.parent().append('<span id="newPincode-error" class="error" style="display: inline;">'+errorMsg+'</span>');	
			}
			$('#newAddressModal input[name=newCity]').val('').prop("disabled", true);	//AE-17463
			$('#newAddressModal input[name=newState]').val('').prop("disabled", true);
			}, 500);
	},
	showPinCodeNotServedEdit : function() {
		setTimeout(function(){
			var divObject = $('#formEditAddress').find("[name='editPincode']");
			divObject.addClass('error');
			var newPincode = $('#editAddressModal input[name=editPincode]').val();
			var errorMsg = 'Selected pin code not serviceable!';
			var content = $('#newPincode-error').html();
			if(newPincode == ''){
				errorMsg = 'Enter Pincode';
			}else if(content == 'Please enter a valid pin code.'){
				errorMsg = 'Please enter a valid pin code.';
			}
			//if(content && content.length >0){
			if($('#newPincode-error').length >0){
				$('#newPincode-error').html(errorMsg);
			}else{
				$('#newPincode-error').remove();
				divObject.parent().append('<span id="newPincode-error" class="error" style="display: inline;">'+errorMsg+'</span>');	
			}
			$('#formEditAddress input[name=editCity]').val('').prop("disabled", false);
			$('#formEditAddress input[name=editState]').val('').prop("disabled", false);
			}, 500);
	},
    statusMapper: function(orderStatus) {
    	var status ;
    	switch(orderStatus){
     		case 'F' : status = "Payment Received";
     					break;
     		case 'M' : status = "Payment Under Process";
						break;
     		case 'a' : status = "Pending Payment";
     					break;
     		case 'c' : status = "Confirmed";
						break;
     		case 'x' : status = "Cancelled";
						break;
     		case 'p' : status = "Ready for Pickup";
     					break;
     		case 'q' : status = "Ready for Shipping";
						break;
     		case 'd' : status = "Delivered";
     					break;
     		case 'e' : status = "Partly Delivered";
						break;
     		case 's' : status = "Out for Delivery";
						break;
     		case 'r' : status = "Rejected";
     					break;
     		case 'b' : status = "Confirmed";
						break;
     		case 'm' : status = "Refund to be Initiated";
     					break;
     		case 'n' : status = "Refunded";
						break;
     		case 'o' : status = "Refund Initiated";
						break;
     		case 't' : status = "In Transit";
     					break;
     		case 'w' : status = "Confirmed";
						break;
     		case 'y' : status = "Delivered";
     					break;
     		case 'u' : status = "Undelivered";
						break;
     		case 'f' : status = "Out for Delivery";
     					break;
			default : status = "Status Unknown";					  
    	}
    	return status;
    },
    /*
     * Checks if Re order is supported 
     * Refunded, Delivered, Returned & Cancelled
     * 
     */
    checkReorderEligibility: function(orderStatus) {
    	 var reorderEligibleStatus = ['n','r','s','h','x','d','t','e','y','f'];
    	 return (reorderEligibleStatus.indexOf(orderStatus) > -1);
    },
    checkSlotChangeEligibility : function(orderStatus,slotDate, slotDatePast) {
    	var eligible = false ;
    	// c for Created -- using instead of G
    	// b for Order reserved
    	// r for Returned
    	// s for Shipped or Out of delivery
    	// h for Ready to be shipped
    	// x for cancelled
    	// d for delayed
    	// t for in transit
    	// f for delivered
    	// e for partially delivered
    	// y for Refunded
    	// f for Out for Delivery to Pup
    	if(orderStatus != '' && orderStatus != undefined && slotDate !='' && slotDate != undefined && slotDatePast != "true" ){
    		if(orderStatus == 'c' || orderStatus == 'b'){
    			eligible = true;
    		}
    	}
    	return eligible;
    },
    
    checkCancelOrderEligibility : function(orderStatus) {
    	var eligible = false ;
    	// c for Created -- using instead of G
    	// b for Order reserved
    	// r for Returned
    	// s for Shipped or Out of delivery
    	// h for Ready to be shipped
    	// x for cancelled
    	// d for delayed
    	// t for in transit
    	// f for delivered
    	// e for partially delivered
    	// y for Refunded 
    	if(orderStatus != '' && orderStatus != undefined){
    		if(orderStatus == 'c' || orderStatus == 'b'){
    			eligible = true;
    		}
    	}
    	return eligible;
    },
    
    checkRepayOrderEligibility : function(orderStatus, placedDateAndTime, x_field3) {
    	
    	var eligible = false ;
    	
    	var currentTimeStamp = new Date().getTime();
    	var placedTimeStamp = Date.parse(placedDateAndTime);
    	var minutes = ((parseInt(currentTimeStamp)-parseInt(placedTimeStamp))/1000)/60;
    	var remorseTimeInMinutes = $('#remorseTimeInMinutes').val();
    	
    	if(parseInt(minutes)<parseInt(remorseTimeInMinutes) && orderStatus != '' && orderStatus != undefined && orderStatus == 'M'
    		&& x_field3 != null && x_field3 != '' && x_field3 != undefined){
    			eligible = true;
    	}
    	return eligible;
    },
    
    checkOICancelReturnedStatus : function(orderItemStatus,cancelled,returned){
    	var crStatus = false;
    	var itemCStatus = '';
    	var itemRStatus = '';
    	if(orderItemStatus != '' && orderItemStatus != undefined){
			    		if (orderItemStatus == 'x' || orderItemStatus == 'r'
					|| orderItemStatus == 'm' || orderItemStatus == 'n'
					|| orderItemStatus == 'o' || cancelled > 0 || returned > 0) {
    			crStatus = true;
    			if(cancelled > 0){
    				itemCStatus = 'x'	
    			}
    			if(returned > 0){
    				itemRStatus = 'r'
    			}
    		}
    	}
    	return {cancelReturnFlag : crStatus, oiRetStatus: itemRStatus, oiCanStatus: itemCStatus};
    	
    },

    getItemDetailsFromSOLR : function(catentryArray, storeIdOrder) {
   	 if (catentryArray.length > 0) {

            var idString = 'id=' + catentryArray.join('&id=');
            if(window.location.protocol === "https:"){
 	    		this.searchResources=  WCParamJS.searchSecureHostNamePath+ '/search/resources/store/';
 	    	 }
            $.ajax({
                url: this.searchResources + storeIdOrder + '/productview/byIds?' + idString + '&profileName=X_findProductInfo_NoEntitlementCheck_DMART',
                method: 'GET',
                context: this,
                async:false
            }).done(function(data) {
                var catentries = [];
                $.each(data.catalogEntryView, function(indx, val) {
                    DMStorage.set('item_' + val.uniqueID, val);
                });
                //this.fetchPriceAndInvDetails(priceMissing,myOrderJSON);	                 
            });
   	 }
    },
    packProductAttributes : function(cartJSON,storeIdOrder) {
		var itemIds = [],self=this, images = [], productItemKeys = [], itemBean = {}, totalSavings = 0;
		productItemKeys = DMStorage.getSpecificKeys('proditems');
		var outOfStockOrderItemIds = [];
		cartJSON.orderInvStatus = true;
		$.each(cartJSON.orderItems,function(){
				itemBean = DMStorage.getValue('item_'+this.catentryId); 
				if(itemBean){
					this.productTitle = itemBean.name;
					images = getImageURLs(itemBean,'images/DMart/products/');
					this.imgUrl = images?images[0]:''; 
					this.parentCatentryId = itemBean.parentCatalogEntryID ;
					this.parentCatalogGroupID = itemBean.parentCatalogGroupID;
					
					this.topCategory = CartHelper.getTopCategory(this.parentCatentryId);
					
					if(this.topCategory == null || this.topCategory.length == 0){
						this.topCategory = CartHelper.getItemTopCategory(this.catentryId);
					}
					if(this.topCategory == null || this.topCategory.length == 0){
						this.topCategory = self.findItemTopCategory(this.parentCatalogGroupID[0],storeIdOrder);
					}
					this.brand = self.findAttributeInfo(itemBean,'FILTER1_BRAND_GROCERY');
					this.freebieDescription = self.findAttributeInfo(itemBean,DMartAttributes.Constants.Grocery.Descriptive.FreebieProdDescription) || 'NONE';
					this.categoryType='';
					$.each(itemBean.attributes,function() {
						if(this.identifier.toUpperCase() === 'CATEGORY TEMPLATE TYPE'){
							this.categoryType = this.values[0].value;
							return;
						}
						
					});
					if(this.categoryType==='Grocery'||this.categoryType==='HouseHold'){
						this.variant = CartHelper.findAttributeInfo(itemBean,'WEIGHT_DAGROCERY');
					}else{
						this.size = CartHelper.findAttributeInfo(itemBean,'Size');
					}
				}				
		});			
		
		return cartJSON;
	},
	findItemTopCategory : function(parentCatalogGroupID,storeUniqueID) {
		var topCat = '',self=this;
    	if(DMStorage.getValue('categoryHierarchyStore_' +storeUniqueID)== null || typeof DMStorage.getValue('categoryHierarchyStore_' +storeUniqueID)== "undfined"){
    		self.populateCategoryHeirarchyForStore(storeUniqueID);
    	}
    	var categoryHierarchy= DMStorage.getValue('categoryHierarchyStore_' +storeUniqueID);
    	if(null != categoryHierarchy && typeof categoryHierarchy != "undefined"){
    		topCat = CartHelper.getL1Category(parentCatalogGroupID, categoryHierarchy);
    	}
    	return topCat;
	},
	populateCategoryHeirarchyForStore : function(storeUniqueID) {
		if(window.location.protocol === "https:"){
    		this.searchResources=  WCParamJS.searchSecureHostNamePath+ '/search/resources/store/';
    	}
		var ajaxCallParams = {
            url: this.searchResources + storeUniqueID + '/categoryview/@top' +
                '?depthAndLimit=13,13', 
            method: 'GET',
            context: this,
		    async: false,
            cache : false
        };
		
		$.ajax(ajaxCallParams).done(function(data) {
			DMStorage.set('categoryHierarchyStore_' +storeUniqueID, data);
		});
	},
	/**
	 * Pass the attribute name
	 * @param : ItemBean and attribute name
	 * @return : attribute value / empty string
	 */
	findAttributeInfo: function(itemBean,attrib){
		var attribVal = ''
		$.each(itemBean.attributes,function(){
			if(this.name===attrib){
				attribVal = this.values[0].value;
				return false;
				}
		});
		
		return attribVal;
	},
	

	renderSlotSummary: function() {
		var inputData = {};
		var now = new Date();
		// js badly requires date formatter. some jquery tweaks available but heavy. 
		inputData.date = now.getFullYear() + "-" + ('0' + (parseInt(now.getMonth()) + 1)).slice(-2) + "-" + ('0' + now.getDate()).slice(-2) +
			' ' + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
		inputData.orderId = this.currentOrderId;
		inputData.weekNo = "1";
		inputData = JSON.stringify(inputData);
		this.invokeSlotOMSAjax(inputData, false);
	},
	
	renderNextSlotSummary: function() {
		var inputData = {};
		var now = new Date();
		if(DashBoardHelper.firstSlotDate != undefined && DashBoardHelper.firstSlotDate != ''){
			var firstDateTemp = DashBoardHelper.firstSlotDate.split('/');	
			var fDate = [firstDateTemp[1],firstDateTemp[0],firstDateTemp[2]].join('/');
			var firstDateObject = new Date(fDate);
			now.setDate(firstDateObject.getDate() + 7);
		}else{
			now.setDate(now.getDate() + 7);
		}		
		inputData.weekNo = "2";
		// js badly requires date formatter. some jquery tweaks available but heavy. 
		inputData.date = now.getFullYear() + "-" + ('0' + (parseInt(now.getMonth()) + 1)).slice(-2) + "-" + ('0' + now.getDate()).slice(-2) +
			' 00:00:00';
		inputData.orderId = this.currentOrderId;
		inputData = JSON.stringify(inputData);
		this.invokeSlotOMSAjax(inputData, true);

	},
	
	invokeSlotOMSAjax: function(inputData,isNextWeekSlot) {
		var firstDateTemp = '';
		var nextWeekSwitch = $('#nxtWeekSlotSwitch').val();
		$.ajax({
			url: "/wcs/resources/store/" + storeId + "/slot/getSlots",
			type: "POST",
			data: inputData,
			contentType: "application/json",
			context: this
		}).done(function(data) {
			var JSONdata = [];
			var uniqueDateList = [];
			var slotresourcePoolkey = data.availableSlots.resourcePoolkey;
			$.each(data.availableSlots.slotList, function(idx, slotsI) {
				if (uniqueDateList.indexOf(slotsI.date) == -1) {
					var slotDayList = {};
					var dateList = [],
						startTimeList = [],
						endTimeList = [],
						availabilityList = [],
						dayOfTheWeekList = [];
					uniqueDateList.push(slotsI.date);
					$.each(data.availableSlots.slotList, function(idxj, slotsJ) {
						if (slotsI.date === slotsJ.date) {
							dateList.push(slotsJ.date);
							startTimeList.push(slotsJ.startTime.replace(/ /g, ''));  // Fix for JIRA 5298
							endTimeList.push(slotsJ.endTime.replace(/ /g, ''));
							availabilityList.push(slotsJ.availability);
						}
					});
					slotDayList.date = slotsI.date;
					if(firstDateTemp == ''){
						firstDateTemp = slotsI.date;	
					}
					slotDayList.dateList = dateList;
					slotDayList.dayOfTheWeek = slotsI.dayOfTheWeek;
					slotDayList.todayOrTomorrow = slotsI.todayOrTomorrow;
					slotDayList.startTimeList = startTimeList;
					slotDayList.endTimeList = endTimeList;
					slotDayList.availabilityList = availabilityList;
					JSONdata.push(slotDayList);
				}
			});

			nunjucks.configure(WCParamJS.staticServerHost+ 'templates/', {
				autoescape: true,
				web: {
					useCache: true
				}
			});
			
			var slotSelectiondata = {};
			slotSelectiondata.slotResourcePoolKey = slotresourcePoolkey;
			slotSelectiondata.nextWeekSwitch = nextWeekSwitch;			
			$('#dashboardSlotChange').html(nunjucks.render('_modules/modal-slot-change.nunjucks',
			{
					data: slotSelectiondata
			}));
			
			var data = {};
			data.uniqueDateList = uniqueDateList;
			data.JSONdata = JSONdata;
			$(('.delivery-selection--') + (isNextWeekSlot ? 'coming' : 'this') + ('-week')).html(nunjucks.render('_modules/slot-selection-grid.nunjucks', {
				data: data
			}));

			if (isNextWeekSlot) {
				$('.delivery-next-week').show();
				$('.js-delivery-next-week').html('PREVIOUS 7 DAYS');
			}else{
				$('.js-delivery-next-week').html('NEXT 7 DAYS');
				DashBoardHelper.firstSlotDate = firstDateTemp;
			}
			
		   if(!$('#dashboardSlotChange').is(":visible")){
			   $('#dashboardSlotChange').show();
		   }
		   
		   if($('span[id="'+this.currentSlotId+'"]').length != 0){
			   $('span[id="'+this.currentSlotId+'"]').addClass('selected-slot');
		   }
		   
		   var gridBreakpointsSm = 767;
		    if ($(window).width() <= gridBreakpointsSm) {
		      $('.delivery-selection--this-week, .delivery-selection--coming-week').perfectScrollbar({
		        suppressScrollY: true
		      });
		    }

		    var gridBreakpointsMd = 1024;
		    if ($(window).width() <= gridBreakpointsMd) {
		      $('.dashboard-slot-change .delivery-selection--this-week, .dashboard-slot-change .delivery-selection--coming-week, .dashboard-myorder-scroll').perfectScrollbar({
		        suppressScrollY: true
		      });
		    
		    }
		    $('#dashboardSlotChange .blurb').css('border-top',"none");
		   
		});
			
	},
		
	changeSlot: function(){
		var params = {};
		params.orderId = this.currentOrderId;
		var slotObj = this.selectedSlot;
		var slotDate = slotObj.slotDate.split('/');
		var slotDateFormatted = slotDate[2]+"-"+slotDate[1]+"-"+slotDate[0];		
	    params.consumptionDate = slotDateFormatted.toString();
	    params.resourcePool = slotObj.resourcePoolkey;
	    params.startTime = this.getTimein24Hr(slotObj.startTime)+":00:00" ;
	    params.endTime = this.getTimein24Hr(slotObj.endTime)+":00:00" ;
	    params.mode = "edit";
	    params = JSON.stringify(params);
		
		$.ajax({
			url: "/wcs/resources/store/" + storeId + "/slot/reserveSlots",
	        method: 'POST',
	        data: params,
	        context: this,
	        contentType: "application/json",
	        async: false,

	    }).done(function (data) {		    	
	    	$('#dashboardSlotChange').hide();
	    	var dateTemp = this.selectedSlot.slotDate.split('/');
	    	var orderDisplaySlot = dateTemp[0]+' '+DashBoardHelper.monthNamesObj[DashBoardHelper.monthNames[parseInt(dateTemp[1]-1)]]+' '+dateTemp[2];

	    	if($('.dashboard-myorder-list').length>0){	    		    	
		    	var text = orderDisplaySlot+'<br>'+this.selectedSlot.startTime+ '-' + this.selectedSlot.endTime  
		        +'<span>'
		    	+'<a href="javascript:;" id="slotChangeButton" class="button-slot-change" data-orderid="'+this.currentOrderId+'" '
		        +'data-slotid="'+this.selectedSlot.slotDate+'||'+this.selectedSlot.startTime+'||'+this.selectedSlot.endTime+'">Change</a>'
		        +'</span>';
		    	$('#'+this.currentOrderId).html(text);
	    	} else{
	    		//$('#orderDetailsDate').html(' <h4 class="delivery-address--pup-info"> <strong>Order Date:</strong>'+orderDisplaySlot);
	    		var text = '<h4 class="delivery-address--pup-info"><strong>Delivery Date and Time Selected:</strong>'+orderDisplaySlot+', '+this.selectedSlot.startTime+ ' to ' + this.selectedSlot.endTime
	    				    + '<a href="javascript:;" id="slotChangeButton" class="modal-link" data-orderid="'+this.currentOrderId+'"'
	    			        +'data-slotid="'+this.selectedSlot.slotDate+'||'+this.selectedSlot.startTime+'||'+this.selectedSlot.endTime+'">'
	    				    +'<i class="icon-pencil"></i></a></h4>';
	    		$('#orderDetailsTime').html(text);
	    	}
	        errorMessageHelper.showGenericError(MessageHelper.messages["MY_DASHBOARD_ORDERS_TAB_CHANGE_SLOT_SUCCESS"]);
	        $('#generic-error-section').append(this.currentOrderId);
	        this.selectedSlot = {};
	        DMAnalytics.events( DMAnalytics.Constants.Action.SlotChange, "InputData:"+JSON.stringify(params) , document.title, 0,null );
	    }).fail(function(data) {
	    	$('#dashboardSlotChange').hide();
	    	errorMessageHelper.showGenericError(MessageHelper.messages["MY_DASHBOARD_ORDERS_TAB_CHANGE_SLOT_FAILURE"]);
	    	console.log(data);
	    }); 	
	},
	
	getTimein24Hr: function(strTime){
		// Here comes the issues of having different time formats at different levels. 
		// OMS wants time in HH:MM:SS (24 hr) format but passed to WCS as 12 hr format!!!! 
		var timeHr = parseInt(strTime.substr(0, 2));
		var timeIdentifier = strTime.substr(2, 3); 
		return ('0' + (timeHr + ((timeIdentifier == 'PM' && timeHr != 12) ? 12 : (timeIdentifier == 'AM' && timeHr == 12) ? -12 : 0))).slice(-2);
		
	},
	
	checkValidPincode: function(aPincode) {	
		var pincodeMap = DMStorage.getValue('pincodeMap');
		var pinCodeServed = false;
		if(pincodeMap != null){
			$.each(pincodeMap, function(i, pin) {
				if(aPincode == pin.Pincode){
					pinCodeServed = true;
				}
			});
		}		
		return pinCodeServed;
	},
	
	verifyEmail: function(logonId, isVerifyEmail){
		var parameters = {};
		  parameters.logonId = logonId;
		  parameters.isVerifyEmail = isVerifyEmail;
		  if($('#dashboardPersonalDetailsValidation #email').val().length>0 && $('#dashboardPersonalDetailsValidation').valid()){
			  dojo.xhrPost({
				  url: "ResendEmailValidationCmd",				
				    handleAs: "json",
				    content: parameters,
				    service: this,
				    load: function(response){
				    	errorMessageHelper.showGenericError("Email validation link sent successfully!");
				    	DMAnalytics.events( DMAnalytics.Constants.Action.VerifyEmail, "Verify Email Link Click", document.title, 0,null );
				    },
				    error: function(errObj,ioArgs) {
				    	errorMessageHelper.showGenericError("Problem in sending validation link!");
						  requestSubmitted  =  false;
				    }
			 });
		 }
	}
};

$(document).ready(function() {
	$('.newsletter__cta').css('height',"39px");
	$('#manageAddress').on('click',function(){
		if(!DMStorage.getValue('pincodeMap')){
			$(document).trigger('dmart.checkOut.pincode.fetchall');
		}
		if( $('#dashboard__address').html()==undefined ){
			DashBoardHelper.displayAddress();
		}		
	});	
	
	$(document).on('click', '#changePersonalDetails', function() {
		DashBoardHelper.changePersonalDetails();
	});
	$(document).on('click','.resp-accordion.hor_1',function(){
		if($(this).text()=="Manage Address"){
		DashBoardHelper.displayAddress();
		}
	});
	
	$(document).on('click', '#changePasswordSave', function() {
		if($('#dashboardChangePasswordValidation').valid()){
			DashBoardHelper.changePassword();
		}		
	});
	
	//DashBoardHelper.renderAddressModal();
	
	// event for save new address from Modal
	$(document).on('click', '#checkoutNewAddressSave', function() {
		if($('#formNewAddressModal').hasClass('add-in-progress')){
			return;
		}
		var form = 'formNewAddressModal';
		$('#formNewAddressModal').validate();
		if($('#formNewAddressModal').valid()){
			$('#formNewAddressModal').addClass('add-in-progress');
			setTimeout(function(){
				DashBoardHelper.saveAddress(form);
			}, 100);
		}else{
			$('#formNewAddressModal').removeClass('add-in-progress');
		}
	});
	
	// event for save new address from Page
	$(document).on('click', '#saveAddress', function() {
		if($('#formNewAddress').hasClass('add-in-progress')){
			return;
		}
		var form = 'formNewAddress';
		if($('#formNewAddress').valid()){
			$('#formNewAddress').addClass('add-in-progress');
			setTimeout(function(){
				DashBoardHelper.saveAddress(form);
			}, 100);	
			window.scroll(0,0);
		}else{
			$('#formNewAddress').removeClass('add-in-progress');
		}
	});
	
	
	// event for edit address click
	$(document).on('click', '.js-address-edit', function() {
		DashBoardHelper.editAddressLoad($(this).attr('id'));
	});
	
	// event for edit address save
	$(document).on('click', '#editAddressModalSave', function() {
		if($('#formEditAddress').hasClass('add-in-progress')){
			return;
		}
		if($('#formEditAddress').valid()){
			$('#formEditAddress').addClass('add-in-progress');
			DashBoardHelper.editAddress($(this).attr('id'));
		}else{
			$('#formEditAddress').removeClass('add-in-progress');
		}
	});

	// event for delete address
	$(document).on('click', '.js-address-delete', function() {
		DashBoardHelper.deleteAddress($(this).attr('id'));
	
	});

	// event for make an address favourite
	$(document).on('click', '.js-dashboard-favorite', function() {
		var isPrimary = $(this).find('.icon-heart-outlined').length > 0 ? "true" : "false";
		$(this).parents('li').toggleClass('favorite-address');
		//$(this).find('.js-delivery-favorite-icon').toggle();			
		DashBoardHelper.makeAddressFav($(this).attr('id'),isPrimary);
	});
	
//    $('.js-make-default-address').clickToggle( function () {
//        $(this).addClass('active');
//      }, function () {
//        $(this).removeClass('active');
//      });
	
	$(document).on('click', '.js-make-default-address', function () {
        if($(this).hasClass('active')){
        	$(this).removeClass('active');	
        }else{
        	$(this).addClass('active');
        }
	});   

	
	// Event Binding for my orders tab click
	$(document).on('click', '#myOrders', function() {
		DashBoardHelper.renderMyOrders('MyOrdersDiv',null,false);
	});
	
    // Slot change
	$(document).on('click', '#slotChangeButton', function() {
    	DashBoardHelper.currentOrderId = $(this).data('orderid');
    	DashBoardHelper.currentSlotId =  $(this).data('slotid');
//    	DashBoardHelper.currentSlot.slotDate =  $(this).data('slotid');
//    	DashBoardHelper.currentSlot.startTime = slotData[1];
//    	DashBoardHelper.currentSlot.endTime = slotData[2];
//    	DashBoardHelper.currentSlot.resourcePoolkey = $('#slot-resourcePoolkey').val();
    	DashBoardHelper.renderSlotSummary();
	});
    
	// Weeks switch
	$(document).on('click', '.js-delivery-next-week', function() {
		if ($(this).text() == 'NEXT 7 DAYS') {
			if ($('.delivery-selection--next-week').find('.delivery-selection-row').length > 0) {
				$('.delivery-current-week').hide();
				$('.delivery-next-week').fadeIn();
			} else {
				// refresh next date slot	
				DashBoardHelper.renderNextSlotSummary();					 				
			}
			$(this).text('PREVIOUS 7 DAYS');
		} else {

			if ($('.delivery-selection--current-week').find('.delivery-selection-row').length > 0) {
				$('.delivery-next-week').hide();
				$('.delivery-current-week').fadeIn();
			} else {
				// refresh next date slot	
				DashBoardHelper.renderSlotSummary();					 				
			}
			$(this).text('NEXT 7 DAYS');
		}

	});
	
	$(document).on('click','.resp-accordion.hor_1',function(){
		if($(this).text()=="My Orders"){
			$('#myOrders').click();
		}
	});
	// event for slot selection
	$(document).on('click', '.delivery-selection-row span', function() {
		if (!$(this).hasClass('delivery-slot--not-selectable')) {
			var slotData = ($(this).attr('id')).split('||');
			var slotObject = {};
			slotObject.slotDate = slotData[0];
			slotObject.startTime = slotData[1];
			slotObject.endTime = slotData[2];
			slotObject.resourcePoolkey = $('#slot-resourcePoolkey').val();
			DashBoardHelper.selectedSlot = slotObject;
			$('.delivery-selection-row span').removeClass('selected-slot');
			$(this).addClass('selected-slot');
			
			var newSlotSelected = $(this).attr('id');
			if(DashBoardHelper.currentSlotId == newSlotSelected){
				DashBoardHelper.disableSaveButton = 'Y';
			}else{
				DashBoardHelper.disableSaveButton = 'N';
			}
		}
	});	

	// event binding for save slot change button
	$(document).on('click','#confirmSlotChange',function(){
		if(Object.keys(DashBoardHelper.selectedSlot).length !== 0 && DashBoardHelper.disableSaveButton == 'N'){
			DashBoardHelper.changeSlot();
		}
	});
	
	// binding for cancel button in change slot popup
	$(document).on('click','#cancelSlotChange',function(){		
		$('#dashboardSlotChange').hide();
	});
	
	// binding for cancel button in cancel order popup
	$(document).on('click','#cancelCancelOrder',function(){		
		$('#cancelOrderModal').hide();
	});
	
	// binding for Yes button in cancel order popup
	$(document).on('click','#confirmCancelOrder',function(){
		var orderId = $(this).data('orderid');
		var params = {};		
		params.orderId = orderId;
		params = JSON.stringify(params);
		$.ajax({
			url: "/wcs/resources/store/" + storeId + "/slot/cancelOrder",
	        method: 'PUT',
	        data: params,
	        context: this,
	        async: false,
	        contentType: "application/json"
	    }).done(function (data) {		    	
	    	$('.dashbaord-myorder--undelivered.active .order-status-process').text('Cancelled').addClass('canceled-order');
	    	$('.dashbaord-myorder--undelivered.active .order-status-process').attr('title','Cancelled');
	        $('.dashbaord-myorder--undelivered.active .button-order-cancel, .dashbaord-myorder--undelivered.active .my-order-date span').hide();
	        $('.dashbaord-myorder--undelivered.active .button-order-cancel').attr("id","re-order").attr("title","Re Order").html("RE ORDER");
	        $('.dashbaord-myorder--undelivered.active .button-order-cancel').fadeIn();
	        DMAnalytics.events( DMAnalytics.Constants.Action.CancelOrder, "Cancel Order:"+orderId , document.title, 0,null );
	        errorMessageHelper.showGenericError(MessageHelper.messages["MY_DASHBOARD_ORDERS_TAB_CANCEL_ORDER_SUCCESS"]);
	    }).fail(function(data) {
	    	errorMessageHelper.showGenericError(MessageHelper.messages["MY_DASHBOARD_ORDERS_TAB_CANCEL_ORDER_FAILURE"]);
	    	console.log(data);
	    }); 	
		
		$('#cancelOrderModal').hide();
	});
	
	
	
	// Binding For Cancel Order Button in order Listing
	$(document).on('click','#cancel-order',function(){	

		var orderId = $(this).data('orderid');
		var orderData = {};
		orderData.orderId = orderId;
		$(this).parents('.dashboard-myorder--details').addClass('active');
					
		nunjucks.configure(WCParamJS.staticServerHost+ 'templates/', {
  			autoescape: true,
  			web: {
  				useCache: true
  			}
  		});		
		
		$('#cancelOrderModal').html(nunjucks.render('_modules/modal-cancel-order.nunjucks',
				{
						data: orderData
				}));		
		$('#cancelOrderModal').show();		
	});    
	
	// Binding For Re Order Button in order Listing
	$(document).on('click','#re-order',function(){
		var orderId = $(this).data('orderid');
		var selectedPincode = $('.delivery-code__pin').text();
		localStorage.removeItem('OrderId');
        localStorage.removeItem('OOSitemsList');
		dojo.cookie("DM_OrderId", null, {expires: -1,path: '/'});
		var urlString = window.location.origin+'/webapp/wcs/stores/servlet/';
		DMAnalytics.events( "Add All to Cart", "fromOrderId:"+orderId , document.title, 0,null );
		document.location.href = urlString.replace(/https/g, 'http')
			+ 'DmartReorder?fromOrderId='+orderId+'&pincode='+selectedPincode+'&isRest=false';
	});  
	
	// Binding For Track Order Button
	$(document).on('click','.button-order-track, .order-details--track-link',function(){
		var orderId = $(this).data('orderid');
		window.open(loginextURL.replace('##',orderId),'_blank');
	});   
	
	
	// Repay order	$(document).on('click','.retry-payment',function(){		var orderIdRepay = $(this).data('orderidrepay');		var placedDateAndTime = $(this).data('placeddateandtime');
    	var currentTimeStamp = new Date().getTime();
    	var placedTimeStamp = Date.parse(placedDateAndTime);
    	var minutes = ((parseInt(currentTimeStamp)-parseInt(placedTimeStamp))/1000)/60;
    	var remorseTimeInMinutes = $('#remorseTimeInMinutes').val();
    	
    	if(minutes<parseInt(remorseTimeInMinutes)){
    		$('#orderIdRepay').val(orderIdRepay);        	$('#formRepay').submit();    	}
    });
	// Pincode lookup and render details
	$(document).on('focusout', '#newAddressModal input[name=newPincode]', function () {
    	var selectedPincode = $('.delivery-code__pin').text();
    	var newPincode = $('#newAddressModal input[name=newPincode]').val();
    	DashBoardHelper.showCityAndStateForPincode(newPincode,'new');
    });
    $(document).on('focusout', '#editAddressModal input[name=editPincode]', function () {
    	var selectedPincode = $('.delivery-code__pin').text();
    	$('#editPincode-error,#newPincode-error,#newCity-error').remove();
    	var newPincode = $('#editAddressModal input[name=editPincode]').val();
    	if($('#editAddressModal input[name=editPincode]').valid())
    	DashBoardHelper.showCityAndStateForPincode(newPincode,'edit');    	
    });
    $(document).on('focusout', '#formNewAddress input[name=newPincode]', function () {
    	$('#newAddressModal input[name=newCity]').val(pincodeCity).prop("disabled", true);		//AE-17463
		$('#newAddressModal input[name=newState]').val(pincodeState).prop("disabled", true);
    	var newPincode = $('#formNewAddress input[name=newPincode]').val();    	
    	var pincodeState = undefined;
    	var pincodeCity = undefined;
    	var pincodeMap = DMStorage.getValue('pincodeMap');
		if(pincodeMap != null){
			$.each(pincodeMap, function(i, pin) {
				if(newPincode == pin.Pincode){
					pincodeState = pin.State;
					pincodeCity = pin.Region
				}
			});
			if(pincodeState != undefined && pincodeCity != undefined){
				$('#formNewAddress input[name=newCity]').val(pincodeCity).prop("disabled", true).removeClass('error');
				$('#formNewAddress input[name=newState]').val(pincodeState).prop("disabled", true).removeClass('error');
				$('#newCity-error').hide();
				$('#newState-error').hide();
			}else{
				$('#newCity-error').remove();
				setTimeout(function(){
					var divObject = $('#formNewAddress').find("[name='newPincode']");
					divObject.addClass('error');
					if(!$('#newPincode-error').is(":visible")){
						$('#newPincode-error').remove();
						divObject.parent().append('<span id="newPincode-error" class="error" style="display: inline;">Selected pin code not serviceable!</span>');
					}
					$('#formNewAddress input[name=newCity]').val('').prop("disabled", true);	//AE-17463
					$('#formNewAddress input[name=newState]').val('').prop("disabled", true);
					}, 500);
			}
		}
		
    });
    
    
    $(document).on('click', '#dashboardNewAdd', function () {
    	document.getElementById('formNewAddressModal').reset();
    	var selectedPincode = $('.delivery-code__pin').text();
    	var pincodeState = undefined;
    	var pincodeCity = undefined;
    	//$('#newAddressModal input[name=newPincode]').val(selectedPincode);	//AE-17463
    	var pincodeMap = DMStorage.getValue('pincodeMap');
		if(selectedPincode != '' && pincodeMap != null){
			$.each(pincodeMap, function(i, pin) {
				if(selectedPincode == pin.Pincode){
					pincodeState = pin.State;
					pincodeCity = pin.Region
				}
			});
		}
		if(pincodeState != undefined && pincodeCity != undefined){
			$('#newAddressModal input[name=newCity]').val(pincodeCity).prop("disabled", true);
			$('#newAddressModal input[name=newState]').val(pincodeState).prop("disabled", true);
		}
		$('#newAddressModal input[name=newMobileNumber]').val($('#changeMobileNumber').val());
		
    });
    // lets load pincodes upfront and store in local storage.
    // no call if already available
    $(document).trigger('dmart.checkOut.pincode.fetchall');

});
