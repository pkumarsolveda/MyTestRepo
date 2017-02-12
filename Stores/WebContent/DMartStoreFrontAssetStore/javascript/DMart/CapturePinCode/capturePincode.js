(function(dmUIConfig) {
  $(document).ready(function () {
	  var servicedPincodesJSON;
	  //var matches = [];
	  var currPath = window.location.pathname;
	  var requestUrl;
	  
	  if('http:' == window.location.protocol){
		  requestUrl = "http://"+window.location.hostname+"/wcs/resources/store/"+storeId+"/storepincodedetails/byPinCode"; 
	  }else{
		  requestUrl = "https://"+window.location.hostname+"/wcs/resources/store/"+storeId+"/storepincodedetails/byPinCode";
	  }

	  populatePincodeInfoFromCookieInLogonForm();
	  if($('#locationModal').is(':visible')){
		  $('body').css('overflow', 'hidden');
		  dojo.xhrGet({
              // The URL to request
              url: requestUrl,
              handleAs : "json",
              load: function(result) {
            	  servicedPincodesJSON = result.StorePincodeDetails;
            	  DMStorage.set('pincodeMap', servicedPincodesJSON);
              }
          });
	  }
	  
	  $(document).on('click', '.delivery-code', function() {
		  	if(null != document.getElementById("locationModal") && typeof checkoutConfirm === 'undefined'){
		  		$('body').css('overflow', 'hidden');
		  		$('html').prop('style').removeProperty('overflow');
		  		document.getElementById("locationModal").style.display='block';
		  		$(document).trigger('dmart.checkOut.pincode.fetchall');
		  	}
	  });
	  
	  $(document).on('touchstart', '.main-menu__location-mini', function() {
		  	if(null != document.getElementById("locationModal") && typeof checkoutConfirm === 'undefined'){
		  		$('body').css('overflow', 'hidden');
		  		$('html').prop('style').removeProperty('overflow');
		  		document.getElementById("locationModal").style.display='block';
		  		$(document).trigger('dmart.checkOut.pincode.fetchall');
		  	}
	  });
	  
	  
	  $(document).off('dmart.checkOut.pincode.fetchall').on('dmart.checkOut.pincode.fetchall', function() {
		 if(DMStorage.getValue('pincodeMap') == null){
	    	  dojo.xhrGet({
	              url: requestUrl,
	              handleAs : "json",
	              load: function(result) {
	            	  servicedPincodesJSON = result.StorePincodeDetails;
	            	  DMStorage.set('pincodeMap', servicedPincodesJSON);            	  
	            	  $(document).trigger('dmart.checkout.pincode.Loaded');
	              }
	          });
		 }
      });
	  
	  $(document).on('dmart.pincode.delayed.cartAdd', function() {
		  var delayedObj = DMStorage.getSessionValue("addtoCartDelayedAction");
		  var callBack = '';
		  if(window.location.pathname.indexOf('/myCart') > -1){
		  	delayedObj.callBackName = "cartPage";
		  }
		  switch(delayedObj.callBackName) {
		    case "handleAddToCartResponse":
		    	callBack = handleAddToCartResponse;
		        break;
		    case "handleAddToCartResponsePLP":
		    	callBack = handleAddToCartResponsePLP;
		        break;
		    case "handleUpdateItemVariantResponsePLP":
		    	callBack = handleUpdateItemVariantResponsePLP;
		        break;
		    case "handleUpdateItemQuantityResponsePLP":
		    	callBack = handleUpdateItemQuantityResponsePLP;
		        break;
		    case "handleAddToCartResponsePDPFreq":
		    	callBack = handleAddToCartResponsePDPFreq;
		        break;
		    case "handleAddToCartResponseOffers":
		    	callBack = handleAddToCartResponseOffers;
		        break;
		    case "cartPage":
		    	callBack = handleAddToCartResponseFromCart;
		        break;
		    default:
		    	callBack = handleAddToCartResponsePincodeSkip;
		} 
		  callAddToCart(delayedObj.params,handleAddToCartResponsePincodeSkip,delayedObj.argsList);
		  sessionStorage.removeItem("addtoCartDelayedAction");
		  sessionStorage.removeItem("pincodeSkip");
		  // So many add to cart events, couldnt find all. 
		  // page reload will do that for me
		  //window.location.reload();  
	      });
	  
      $('.delivery-code .delivery-code__label, .delivery-code .delivery-code__pin, .delivery-code .icon-delivery-caret-down').on('dmart.browse.pincode.fetchall', function() {

    	  dojo.xhrGet({
              // The URL to request
              url: requestUrl,
              handleAs : "json",
              load: function(result) {
            	  servicedPincodesJSON = result.StorePincodeDetails;
            	  DMStorage.set('pincodeMap', servicedPincodesJSON);
              }
          });
      });
      
      
      
	  $('.autocomplete-input').on('dmart.browse.pincode.autosuggest', function() {
		  if(DMStorage.getValue('pincodeError') != 'Y'){
			  $('#pinCodeSuggestions').empty();
			  $('#errorSpan').empty();
		  }

		  //var counter=0;
		  var valueEntered=$('#pinNumberModal').val();
		  var pinEntered;
		  var areaEntered;
		  var arrayVal;
		  if(!isNaN(valueEntered)){
			  pinEntered= valueEntered;
		  }else{
			  arrayVal= valueEntered.split(',');
			  if(isNaN(arrayVal[0])){
				  areaEntered=arrayVal[0];
			  }else{
				  pinEntered=arrayVal[0];
				  areaEntered=arrayVal[1];
			  }
		  }
		  
		  if((pinEntered != undefined && pinEntered.length >1) || (areaEntered != undefined && areaEntered.length >2)) {
			  var pincodeMapLocalStorage = DMStorage.getValue('pincodeMap');
			  if((servicedPincodesJSON == null || servicedPincodesJSON == undefined) && (pincodeMapLocalStorage != null && pincodeMapLocalStorage != undefined) ){
				  servicedPincodesJSON = pincodeMapLocalStorage;
			  }
			  var matches = [];
	    	  for(idx in servicedPincodesJSON){
	    		  
				var servicedPincode = servicedPincodesJSON[idx];
				if(servicedPincode != '[' || servicedPincode != ']'){
					//console.log(servicedPincode.Pincode + ":" + servicedPincode.Area + ":" + servicedPincode.StoreId+"-"+idx);
					var pinCode=servicedPincode.Pincode;
					var area=servicedPincode.Area;
					if(/*(counter<10) &&*/ /*Commented out the counter as per narcinha.pai's comments in AE-10793*/
							((pinEntered != undefined && pinCode != undefined && pinCode.indexOf(pinEntered)!= -1) || 
									(areaEntered != undefined && area != undefined && area.toUpperCase().indexOf(areaEntered.toUpperCase())!= -1))){
						var suggestion=pinCode+', '+area;
						//$('<li />', {html:suggestion}).appendTo('ul#pinCodeSuggestions');
						matches.push(suggestion);
						//counter++;
					}
				}
			  }
			  //localStorage.setItem('pinCodeSuggestions',JSON.stringify(matches));
			  setPincodeLSData(matches);
		  }
	  });	
	  
	  $('.autocomplete-input input').autoComplete({
		  minChars: 2,
	      source: function(term, suggest){
	    	  term = term.toLowerCase();
			  var valueEntered=$('#pinNumberModal').val();
			  var pinEntered;
			  var areaEntered;
			  var arrayVal;
			  if(!isNaN(valueEntered)){
				  pinEntered= valueEntered;
			  }else{
				  arrayVal= valueEntered.split(',');
				  if(isNaN(arrayVal[0])){
					  areaEntered=arrayVal[0];
				  }else{
					  pinEntered=arrayVal[0];
					  areaEntered=arrayVal[1];
				  }
			  }
			  
			  if((pinEntered != undefined && pinEntered.length >1) || (areaEntered != undefined && areaEntered.length >2)) {
				  //var suggestionData = localStorage.getItem('pinCodeSuggestions');
				  var suggestionData = getPincodeLSData('pinCodeSuggestions');
		        if(null != suggestionData){
		        	suggestionData = JSON.parse(suggestionData);
		        	suggest(suggestionData);
		            $('.autocomplete-suggestions').perfectScrollbar('destroy');
		            $('.autocomplete-suggestions').perfectScrollbar();
			        $('.autocomplete-suggestions').scrollTop(1).perfectScrollbar('update');			        
		        }
			  }else{
				  $('.autocomplete-suggestions').hide();
			  }
			  DMStorage.remove('pinCodeSuggestions');
	      }
	    });
	  
	  
	  $('#savePinNumberModal').on('click', function() { 
		  if($('#formLocationValidationModal').valid()){
			  var valueEntered=$('#pinNumberModal').val();
			  var arrayVal= valueEntered.split(',');
			  var pinCodeChosen=$.trim(arrayVal[0]);
			  var areaChosen=$.trim(arrayVal[1]);
			  var pinMatchFound;
			  var areaMatchFound;
			  var matchFailed;
			  var chosenStoreId;
			 for(idx in servicedPincodesJSON){
					var servicedPincode = servicedPincodesJSON[idx];
					var pinCode=servicedPincode.Pincode;
					var area=servicedPincode.Area;
					if(pinCode==pinCodeChosen){
						pinMatchFound =true;
						chosenStoreId=servicedPincode.StoreId;
						if(areaChosen != undefined){
							areaMatchFound=true;
							/*if(area.indexOf(areaChosen)!= -1){
								areaMatchFound=true;
								console.log("serviceable pincode "+pinCodeChosen+" with area "+areaChosen );
								break;
							}*/
						}else{
							//console.log("serviceable pincode "+pinCodeChosen+" no area provided ");
							break;
						}
					}
				}
			 //console.log("url"+window.location.origin+'/webapp/wcs/stores/servlet/');
			 	if (!pinMatchFound){
			 		
					$("input[id=storeIdNew]").val('N');
					$("input[id=pinCodeNew]").val(pinCodeChosen);
					DMStorage.remove('pincodeError');
					$.ajax({						
						url:window.location.origin+'/webapp/wcs/stores/servlet/' + "DmartSavePincodeCmd", 
						data:{ 
							storeIdNew:"N",
							pinCodeNew :pinCodeChosen,
						},
						cache: false,
	                    async: false,
	                    dataType:'text',
	                    success: function(result) {
	                    	var errorMessage;
	                    	if(isNaN(pinCodeChosen) || pinCodeChosen.length != 6){
	                    		errorMessage = $("input[id=incorrectPincodeMesg]").val();
	                    	}else{
	                    		errorMessage = $("input[id=pincodeNotServicedMesg1]").val();
	                    	}
	                    	DMStorage.set('pincodeError', 'Y');
	    			 		displayErrorMessage(errorMessage);
	                    },
	                    error: function (){
	                    	var errorMessage;
	                    	if(isNaN(pinCodeChosen) || pinCodeChosen.length != 6){
	                    		errorMessage = $("input[id=incorrectPincodeMesg]").val();
	                    	}else{
	                    		errorMessage = $("input[id=pincodeNotServicedMesg1]").val();
	                    	}
	                    	DMStorage.set('pincodeError', 'Y');
	    			 		displayErrorMessage(errorMessage);
	                    }
					});		
			 		

				}else if (pinMatchFound && !areaMatchFound && areaChosen != undefined){
					sessionStorage.removeItem('pincodeSkip');
					if(sessionStorage.getItem("addtoCartDelayedAction")  != null){
						$(document).trigger('dmart.pincode.delayed.cartAdd');
					}
					//console.log("serviceable pincode "+pinCodeChosen+" but area "+areaChosen + " is not serviceable");
				}else{
					var pincodeSkipSessionVal = DMStorage.getSessionValue("pincodeSkip");
					sessionStorage.removeItem('pincodeSkip');
					var oldPincode=document.getElementById("delivery_pin").innerHTML;
                	var cookieVal=chosenStoreId+"_"+pinCodeChosen;
                	var CookieDate = new Date();
                	CookieDate.setFullYear(CookieDate.getFullYear()+1);
                	document.cookie = "DMART_Pincode_Cookie=" + cookieVal + ";expires=" + CookieDate.toGMTString( ) + ";path=/";
					$("input[id=storeIdNew]").val(chosenStoreId);
					$("input[id=storeId]").val(chosenStoreId);
					if(storeUserType!='R'){
						var currentCart =  DMStorage.getValue('OrderId');
						if(currentCart != null && currentCart != undefined){
							var currentOrderId = DMStorage.getValue('OrderId').orderId;
							$("input[id=currentOrderId]").val(currentOrderId);
						}
						if(typeof userFieldValue != "undefined" && userFieldValue!=null && userFieldValue != ""){
							if(typeof oldGuestId != "undefined" && oldGuestId!=null && oldGuestId != "" && oldGuestId != "-1002"){
								$("input[id=oldGuestIdInput]").val(oldGuestId);
								$("input[id=userField3]").val(userFieldValue);
							}
						}
					}else{
						$("input[id=storeUserType]").val(storeUserType);
						if(typeof oldGuestId != "undefined" && oldGuestId!=null && oldGuestId != "" && oldGuestId != "-1002"){
							$("input[id=oldGuestIdInput]").val(oldGuestId);
						}
					}
					$("input[id=pinCodeNew]").val(pinCodeChosen);
					$("input[id=storeIdNewLogin]").val(chosenStoreId);
					$("input[id=pinCodeNewLogin]").val(pinCodeChosen);
					$("input[id=currentPath]").val(window.location.href);
					if($('#myList').length>0){
						var add=constructUrl();
						if(typeof add!='undefined' && add!=null)
							$("input[id=currentPath]").val(add);
					}
					
					document.getElementById("delivery_pin").innerHTML=pinCodeChosen;
					$('.main-menu__location-mini span').html(pinCodeChosen+' <i class="icon-delivery-caret-down icon-caret-down"></i>');
					$('.pup-selected-code').html(pinCodeChosen);
					if((storeId!= chosenStoreId || oldPincode!=pinCodeChosen)){
                        localStorage.removeItem('orderId');
                        localStorage.removeItem('OOSitemsList');
						dojo.cookie("DM_OrderId", null, {expires: -1,path: '/'});
						var locationAction = $('#formLocationValidationModal').prop('action');
						if(storeUserType=='R'){
							if(locationAction.indexOf('http') > -1 && locationAction.indexOf('https') == -1){
								//if http page
								locationAction = locationAction.replace('http', 'https');
							}
							$('#formLocationValidationModal').prop('action',locationAction);
						}
						if(sessionStorage.getItem("addtoCartDelayedAction")  != null){
							try{
								$(document).trigger('dmart.pincode.delayed.cartAdd');
								// lets call save pincode with some delay after add to cart completeion. 
								setTimeout(function(){
									localStorage.removeItem('orderId');
									dojo.cookie("DM_OrderId", null, {expires: -1,path: '/'});
									$('#formLocationValidationModal').submit();
									}, 500);	
								}catch(err) {
									$('#formLocationValidationModal').submit();
								}
						}else{
							$('#formLocationValidationModal').submit();
						}
						
																		
					}else{
						$(this).parents('.modal-dialog').hide();
						$('html').css('overflow', 'auto');
						if(sessionStorage.getItem("addtoCartDelayedAction")  != null){
							$(document).trigger('dmart.pincode.delayed.cartAdd');
						}
					}
				}
			}
		  DMAnalytics.events( DMAnalytics.Constants.Category.Pincode, DMAnalytics.Constants.Action.SelectPincode, document.title, 0, {pincode: $('#pinNumberModal').val()});
	  });	
  });
}(DM_UI_CONFIG));


//Added for location sensing
  function geoFindMe() {
  	if (!navigator.geolocation){
  		var errorMessage = $("input[id=errorInAutoDetection]").val();
 		displayErrorMessage(errorMessage);
  	    return;
  	}

  	function success(position) {
  		var latitude  = position.coords.latitude;
  	    var longitude = position.coords.longitude;

  	   
  	    findAddress(latitude, longitude);

  	};

  	function error() {
  		var errorMessage = $("input[id=errorInAutoDetection]").val();
 		displayErrorMessage(errorMessage);
  	};


  	navigator.geolocation.getCurrentPosition(success, error, {'enableHighAccuracy':true,'timeout':10000,'maximumAge':0});
  	DMAnalytics.events( DMAnalytics.Constants.Action.AutoLocation,DMAnalytics.Constants.Action.AutoLocation , document.title, 0,null );
  }
  function constructUrl(){
	  var address=null;
	  if($('#myList').length>0){
		  var listId=$('.my-list .resp-tabs-list li.resp-tab-active').val();
		  var queryParameters = {}, queryString = location.search.substring(1),
		    re = /([^&=]+)=([^&]*)/g, m;
		  while (m = re.exec(queryString)) {
			    queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
			}
		  queryParameters['giftListId'] = listId;
		  delete queryParameters.krypto
		  address=location.protocol + '//' + location.host + location.pathname+'?'+$.param(queryParameters);
	  }
	  return address;
  }

  function findAddress(lat, lng) {
  	var latlng = new google.maps.LatLng(lat, lng);
     
      var geocoder = new google.maps.Geocoder();
      var errorMessage;
      geocoder.geocode({'latLng': latlng}, function(results, status) {
      	if (status == google.maps.GeocoderStatus.OK) {
      		//console.log(results);
      		if (results[1]) {
      			//formatted address

      			for (var i=0; i<results[0].address_components.length; i++) {
      				for (var b=0;b<results[0].address_components[i].types.length;b++) {

      					//there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
      					if (results[0].address_components[i].types[b] == "postal_code") {
      						//this is the object you are looking for
      						postCode= results[0].address_components[i];
      						break;
      					}
      					if (results[0].address_components[i].types[b] == "locality") {
      						//this is the object you are looking for
      						area= (results[0].address_components[i].long_name);
      						break;
      					}
      				}
      			}
      			document.getElementById("pinNumberModal").value = postCode.short_name+', '+area;
      		} else {
      			errorMessage = $("input[id=errorInAutoDetection]").val();
		 		displayErrorMessage(errorMessage);
      		}
      	} else {
      		errorMessage = $("input[id=errorInAutoDetection]").val();
	 		displayErrorMessage(errorMessage);
      	}
      });
  }

  function changePincode()
  {    
    if(null != document.getElementById("locationModal") && typeof checkoutConfirm === 'undefined'){
    	document.getElementById("locationModal").style.display='block';
  		$('body').css('overflow', 'hidden');
  		$('html').prop('style').removeProperty('overflow');
        $("#locationModal").find('.location-skip').show();
        $("#locationModal").find('.modal-dialog__close').show();
  	}
  }
  
  function populatePincodeInfoFromCookieInLogonForm(){
	var pincodeCookie = getCookie("DMART_Pincode_Cookie");
	if(typeof pincodeCookie != 'undefined'){
		var chosenStoreId = pincodeCookie.split("_")[0];
		var pinCodeChosen = pincodeCookie.split("_")[1];
		$("input[id=storeIdNew]").val(chosenStoreId);
		$("input[id=storeId]").val(chosenStoreId);
		if(storeUserType!='R'){
			var currentCart =  DMStorage.getValue('OrderId');
			if(currentCart != null && currentCart != undefined){
				var currentOrderId = DMStorage.getValue('OrderId').orderId;
				$("input[id=currentOrderId]").val(currentOrderId);
			}
			if(typeof userFieldValue != "undefined" && userFieldValue!=null && userFieldValue != ""){
				if(typeof oldGuestId != "undefined" && oldGuestId!=null && oldGuestId != "" && oldGuestId != "-1002"){
					$("input[id=oldGuestIdInput]").val(oldGuestId);
					$("input[id=userField3]").val(userFieldValue);
				}
			}
		}else{
			$("input[id=storeUserType]").val(storeUserType);
			if(typeof oldGuestId != "undefined" && oldGuestId!=null && oldGuestId != "" && oldGuestId != "-1002"){
				$("input[id=oldGuestIdInput]").val(oldGuestId);
			}
		}
		$("input[id=pinCodeNew]").val(pinCodeChosen);
	} 
	
  }
  
  
  function displayErrorMessage(errorMessage){
		$("#pinNumberModal").addClass('form__input js-hide-show error');
		$("#errorSpan").html(errorMessage);
		$("#errorSpan").css("display", "inline");
  }

  function getBrowserInfo() {
      var ua = navigator.userAgent, tem, M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
      if(/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name: 'IE', version: (tem[1]||'')};
      }
      if(M[1]==='Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/);
        if(tem !== null) {
          return {name: 'Opera', version: tem[1]};
        }
      }
      M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
      if((tem = ua.match(/version\/(\d+)/i)) !== null) {
        M.splice(1, 1, tem[1]);
      }
      return {
        name: M[0],
        version: M[1]
      };
    }
	  function setPincodeLSData(pincodeSug){
	      //console.log('storing for'+key + 'value'+value);
	          if (!window.localStorage || WCParamJS.dontUseLocalStorage === '1') {
	        	  jsonObjOnPage['pinCodeSuggestions'] = JSON.stringify(pincodeSug);
	          } else {
	              if(typeof jsonObjOnPage === 'undefined') {
	                    jsonObjOnPage = {};
	              }
	              
	              localStorage.setItem('pinCodeSuggestions',JSON.stringify(pincodeSug));
	          }
	      }


	function getPincodeLSData(key){
	      //console.log('storing for'+key + 'value'+value);
	  if (!window.localStorage || WCParamJS.dontUseLocalStorage === '1') {
	  if(typeof jsonObjOnPage === 'undefined') {
	        return null;
	  }
	  
	  return (jsonObjOnPage[key] ? jsonObjOnPage[key]  : null );
	} else {
	              return localStorage.getItem('pinCodeSuggestions');                        
	          }
	      }
