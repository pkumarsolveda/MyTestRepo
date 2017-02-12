/*
	Copyright (c) 2004-2009, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["wc.analytics.CoremetricsEventListener"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["wc.analytics.CoremetricsEventListener"] = true;
//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2009 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------

/**
 * This file is Coremetrics-specific analytics event listener 
  * @version 1.0
 * 
 **/

/**
* @class This class handles the page view and product view events and calls the appropriate 
* One and only one global analyticsJS should be created. Therefore, we create this object only when it is not present in Coremetrics JavaScript functions to register such calls.
*
**/
dojo.provide("wc.analytics.CoremetricsEventListener");

dojo.require("wc.analytics.GenericEventListener");

dojo.declare("wc.analytics.CoremetricsEventListener", wc.analytics.GenericEventListener, {
	
	PARAM_STORE_ID: "storeId",

	/** 
	 *  This function is the handler for PageView events .This is the method called when a PageView event is triggered via the "/wc/analytics/pageview" topic.
	 * @param{Object} obj JSON object containing the following fields;
	 * 	              pagename (optional), the name of the page, accordion panel, etc. that is being viewed.
	 * 	             If not provided, the HTML page title will be used.
	 * 	             category (optional), the category of the page that is being viewed. If not provided,
	 * 	             no category data will be sent.
	 * 	             searchTerms (optional), the terms that the user searched for and is required for search results pages.
	 * 	             searchCount (optional), the total number of results returned by the search and required when searchTerm is set.
	 * 
	 */

	handlePageView: function(obj) {
		var PARAM_PAGENAME = "pagename";
		var PARAM_CATEGORY = "category";
		var PARAM_SEARCHTERMS = "searchTerms";
		var PARAM_SEARCHCOUNT = "searchCount";

		// set some defaults
		var pagename = document.title;
		var category = null;
		var searchTerms = null;
		var searchCount = null;

		var storeId = this._getStoreId();
		var args = new Array();

		// search object for known values and save the unknown ones
		for(x in obj) {
			if(x == PARAM_PAGENAME) {
				pagename = obj[x];
			}
			else if(x == PARAM_CATEGORY) {
				category = obj[x];
			}
			else if(x == PARAM_SEARCHTERMS) {
				searchTerms = obj[x];
			}
			else if(x == PARAM_SEARCHCOUNT) {
				searchCount = obj[x];
			}
			else if(x == this.PARAM_STORE_ID) {
				storeId = obj[x];
			}
			else {
				args.push(obj[x]);
			}
		}

		/** put known variables at the beginning**/
		args.unshift(pagename, category, searchTerms, searchCount, storeId);
		/** call Coremetrics tag**/

		cmCreatePageviewTag.apply({}, args);
		
		var obj = document.getElementById('cm-pageview');
		if (obj != null) {
			var toLog = "cmCreatePageviewTag(";
			if (pagename != null && pagename != "") {
				toLog += "\"" + pagename + "\", ";
			} else {
				toLog += "null, ";
			}
			if (category != null && category != "") {
				toLog += "\"" + category + "\", ";
			} else {
				toLog += "null, ";
			}	
			if (searchTerms != null && searchTerms != "") {
				toLog += "\"" + searchTerms + "\", ";
			} else {
				toLog += "null, ";
			}		
			if (searchCount != null && searchCount != "") {
				toLog += "\"" + searchCount + "\", ";
			} else {
				toLog += "null, ";
			}	
			if (storeId != null && storeId != "") {
				toLog += "\"" + storeId + "\");\n";
			} else {
				toLog += "null);";
			}				
			
			var txtNode = document.createTextNode(toLog);
			obj.appendChild(txtNode); 
			obj.appendChild(document.createElement('br'));
		}
		
	},
	/** 
	 *  This function is the handler for ProductView events .This is the method called when a ProductView event is triggered via the "/wc/analytics/productview" topic.
	 * @param{Object} obj JSON object containing the following fields;
	 * 	                productId (required), the product identifier for the product being viewed. Typically contains the SKU.
	 *                  name (required), the name of the product.
	 *                  category (required), the catalog category of the product being viewed or virtual category
	 *                  such as "Search" or "Cross-sell".
	 *                  masterCategory (required), the catalog category of the product being viewed from the store's master catalog
	 * 
	 */
	handleProductView: function(obj) {
		var PARAM_PRODUCTID = "productId";
		var PARAM_PRODUCTNAME = "name";
		var PARAM_CATEGORY = "category";
		var PARAM_MASTERCATEGORY = "masterCategory";
	
		/** set some defaults**/
		var productId = null;
		var productName = null;
		var category = null;
		var masterCategory = null;
	
		var storeId = this._getStoreId();
		var args = new Array();
	
		/** search object for known values and save the unknown ones **/
		for(x in obj) {
			if(x == PARAM_PRODUCTID) {
				productId = obj[x];
			}
			else if(x == PARAM_PRODUCTNAME) {
				productName = obj[x];
			}
			else if(x == PARAM_CATEGORY) {
				category = obj[x];
			}
			else if(x == PARAM_MASTERCATEGORY) {
				masterCategory = obj[x];
			}
			else if(x == this.PARAM_STORE_ID) {
				storeId = obj[x];
			}
			else {
				args.push(obj[x]);
			}
		}
		
		/** enforce required parameters **/
		if((productId == null) || (productName == null) || (category == null) || (masterCategory == null)) {

		}
		else {
			/** put known variables at the beginning **/
			args.unshift(null, productId, productName, category, storeId, "N", masterCategory);
			
			/** call Coremetrics tag **/
			cmCreateProductviewTag.apply({}, args);
			
			var obj = document.getElementById('cm-productview');
			if (obj != null) {
				var toLog = "cmCreateProductviewTag(null, ";
				if (productId != null && productId != "") {
					toLog += "\"" + productId + "\", ";
				} else {
					toLog += "null, ";
				}
				if (productName != null && productName != "") {
					toLog += "\"" + productName + "\", ";
				} else {
					toLog += "null, ";
				}	
				if (category != null && category != "") {
					toLog += "\"" + category + "\", ";
				} else {
					toLog += "null, ";
				}	
				if (storeId != null && storeId != "") {
					toLog += "\"" + storeId + "\", \"N\", ";
				} else {
					toLog += "null, \"N\", ";
				}		
				if (masterCategory != null && masterCategory != "") {
					toLog += "\"" + masterCategory + "\");\n";
				} else {
					toLog += "null);";
				}				
				var txtNode = document.createTextNode(toLog);
				obj.appendChild(txtNode); 
				obj.appendChild(document.createElement('br'));
			}			
		}
	},

	/**
	 *  This function is a handler for CartView events.This is the method called when a CartView event is triggered via the "/wc/analytics/cartview" topic.
	 * @param{Object} obj  JSON object with a single 'cart' array where each element is an Object containing the following fields;
		*       productId (required), the product identifier for the product being viewed. Typically contains the SKU.
		*       name (required), the name of the product.
		*       category (required), the catalog category of the product being viewed or virtual category
		*       such as "Search" or "Cross-sell".
		*       masterCategory (required), the catalog category of the product being viewed from the store's master catalog.
		*       quantity (required), the number of units ordered.
		*       price (required), the selling price fo the product.
		*       currency (required), the currency of the price.
	 */

	handleCartView: function(obj) {
		var PARAM_PRODUCTID = "productId";
		var PARAM_PRODUCTNAME = "name";
		var PARAM_CATEGORY = "category";
		var PARAM_MASTERCATEGORY = "masterCategory";
		var PARAM_QTY = "quantity";
		var PARAM_PRICE = "price";
		var PARAM_CURRENCY = "currency";

		var shop5created = false;

		if(obj.cart && dojo.isArrayLike(obj.cart)) {
			var cart = obj.cart;
			for(var i = 0; i < cart.length; i++) {
				// set some defaults
				var productId = null;
				var productName = null;
				var category = null;
				var masterCategory = null;
				var quantity = null;
				var price = null;
				var currency = null;
			
				var storeId = this._getStoreId();
				var args = new Array();

				var values = cart[i];

				/** search object for known values and save the unknown ones **/
				for(x in values) {
					if(x == PARAM_PRODUCTID) {
						productId = values[x];
					}
					else if(x == PARAM_PRODUCTNAME) {
						productName = values[x];
					}
					else if(x == PARAM_CATEGORY) {
						category = values[x];
					}
					else if(x == PARAM_MASTERCATEGORY) {
						masterCategory = values[x];
					}
					else if(x == PARAM_QTY) {
						quantity = values[x];
					}
					else if(x == PARAM_PRICE) {
						price = values[x];
					}
					else if(x == PARAM_CURRENCY) {
						currency = values[x];
					}
					else if(x == this.PARAM_STORE_ID) {
						storeId = values[x];
					}
					else {
						args.push(values[x]);
					}
				}

				/**enforce required parameters**/
				if((productId == null) || (productName == null) || (category == null) || (masterCategory == null) ||
						(quantity == null) || (price == null) || (currency == null)) {

				}
				else {
					shop5created = true;
					
					/** put known variables at the beginning**/
					args.unshift(productId, productName, quantity, price, category, storeId, currency, masterCategory);
					/**
					 *  call Coremetrics tag
					 */
					cmCreateShopAction5Tag.apply({}, args);
					var obj = document.getElementById('cm-shopAction');
					if (obj != null) {
						var toLog = "cmCreateShopAction5Tag(";
						if (productId != null && productId != "") {
							toLog += "\"" + productId + "\", ";
						} else {
							toLog += "null, ";
						}
						if (productName != null && productName != "") {
							toLog += "\"" + productName + "\", ";
						} else {
							toLog += "null, ";
						}	
						if (quantity != null && quantity != "") {
							toLog += "\"" + quantity + "\", ";
						} else {
							toLog += "null, ";
						}
						if (price != null && price != "") {
							toLog += "\"" + price + "\", ";
						} else {
							toLog += "null, ";
						}	
						if (category != null && category != "") {
							toLog += "\"" + category + "\", ";
						} else {
							toLog += "null, ";
						}	
						if (storeId != null && storeId != "") {
							toLog += "\"" + storeId + "\", ";
						} else {
							toLog += "null, ";
						}
						if (currency != null && currency != "") {
							toLog += "\"" + currency + "\", ";
						} else {
							toLog += "null, ";
						}								
						if (masterCategory != null && masterCategory != "") {
							toLog += "\"" + masterCategory + "\");\n";
						} else {
							toLog += "null);";
						}				
						var txtNode = document.createTextNode(toLog);
						obj.appendChild(txtNode); 
						obj.appendChild(document.createElement('br'));
					}
				}
			}
		}
		else {

		}
		
		if(shop5created) {
			cmDisplayShop5s();
		}
		
	},

	/**
	* This function is a handler for Element events.This is the method called when an Element event is triggered via the "/wc/analytics/element" topic. This is an empty placeholder that should be extended by the implementation.
	* @param{Object} obj JSON object containing the following fields;
	*    elementId (required), the identifier for the element being interacted with.
	*       category (optional), the category of the element.
	*       pageId (optional), the ID of the associated page that the element is on.
	*       pageCategory (optional), the category of the associated page that the element is on.
	*       location (optional), the location of the element on the page. For example, "top navigation" or "footer". 
	 */

	handleElement: function(obj) {
		var PARAM_ELEMENTID = "elementId";
		var PARAM_CATEGORY = "category";
		var PARAM_PAGEID = "pageId";
		var PARAM_PAGECATEGORY = "pageCategory";
		var PARAM_LOCATION = "location";
	
		/** set some defaults**/
		var elementId = null;
		var category = null;
		var pageId = null;
		var pageCategory = null;
		var elementLocation = null;
	
		var storeId = this._getStoreId();
		var args = new Array();
	
		/** search object for known values and save the unknown ones**/
		for(x in obj) {
			if(x == PARAM_ELEMENTID) {
				elementId = obj[x];
			}
			else if(x == PARAM_CATEGORY) {
				category = obj[x];
			}
			else if(x == PARAM_PAGEID) {
				pageId = obj[x];
			}
			else if(x == PARAM_PAGECATEGORY) {
				pageCategory = obj[x];
			}
			else if(x == PARAM_LOCATION) {
				elementLocation = obj[x];
			}
			else if(x == this.PARAM_STORE_ID) {
				storeId = obj[x];
			}
			else {
				args.push(obj[x]);
			}
		}
		
		/** enforce required parameters**/
		if(elementId == null) {
		}
		else {
			/** put known variables at the beginning**/
			args.unshift(elementId, category, pageId, pageCategory, elementLocation, storeId);
			
			/** call Coremetrics tag**/
			cmCreatePageElementTag.apply({}, args);
			var obj = document.getElementById('cm-element');
			if (obj != null) {
				var toLog = "cmCreatePageElementTag(";
				if (elementId != null && elementId != "") {
					toLog += "\"" + elementId + "\", ";
				} else {
					toLog += "null, ";
				}
				if (category != null && category != "") {
					toLog += "\"" + category + "\", ";
				} else {
					toLog += "null, ";
				}	
				if (pageId != null && pageId != "") {
					toLog += "\"" + pageId + "\", ";
				} else {
					toLog += "null, ";
				}	
				if (pageCategory != null && pageCategory != "") {
					toLog += "\"" + pageCategory + "\", ";
				} else {
					toLog += "null, ";
				}
				if (elementLocation != null && elementLocation != "") {
					toLog += "\"" + elementLocation + "\", ";
				} else {
					toLog += "null, ";
				}	
				if (storeId != null && storeId != "") {
					toLog += "\"" + storeId + "\");\n";
				} else {
					toLog += "null);";
				}				
				var txtNode = document.createTextNode(toLog);
				obj.appendChild(txtNode); 
				obj.appendChild(document.createElement('br'));
			}
			
		}
	},
	/**
	 * This function is a handler for Registration events
	 * @param obj JSON object containing the following fields:
	 *            userId,userEmail,userCity,userState,userZip,newsletterName,subscribedFlag,storeId,userCountry,age,gender,maritalStatus,numChildren,numInHousehold
	 *            companyName,hobbies,income
	 */
	handleRegistration: function(obj) {
		// known parameters
		var PARAM_USERID = "userId";
		var PARAM_USEREMAIL = "userEmail";
		var PARAM_USERCITY = "userCity";
		var PARAM_USERSTATE = "userState";
		var PARAM_USERZIP = "userZip";
		var PARAM_NEWSLETTERNAME = "newsletterName";
		var PARAM_SUBSCRIBEDFLAG = "subscribedFlag";
		var PARAM_STOREID = "storeId";
		var PARAM_USERCOUNTRY = "userCountry";
		var PARAM_AGE = "age";
		var PARAM_GENDER = "gender";
		var PARAM_MARITALSTATUS = "maritalStatus";
		var PARAM_NUMCHILDREN = "numChildren";
		var PARAM_NUMINHOUSEHOLD = "numInHousehold";
		var PARAM_COMPANYNAME = "companyName";
		var PARAM_HOBBIES = "hobbies";
		var PARAM_INCOME = "income";

		var userId = null;
		var userEmail = null;
		var userCity = null;
		var userState = null;
		var userZip = null;
		var newsletterName = null;
		var subscribedFlag = null;
		var userCountry = null;
		var age = null;
		var gender = null;
		var maritalStatus = null;
		var numChildren = null;
		var numInHousehold = null;
		var companyName = null;
		var hobbies = null;
		var income = null;
		var storeId = this._getStoreId();
		var args = new Array();
		
		/** search object for known values and save the unknown ones**/
		for(x in obj) {
			if(x == PARAM_USERID) {
				userId = obj[x];
			}
			else if(x == PARAM_USEREMAIL ) {
				userEmail = obj[x];
			}
			else if(x == PARAM_USERCITY) {
				userCity = obj[x];
			}
			else if(x == PARAM_USERSTATE) {
				userState = obj[x];
			}
			else if(x == PARAM_USERZIP) {
				userZip = obj[x];
			}
			else if(x == PARAM_NEWSLETTERNAME ) {
				newsletterName = obj[x];
			}
			else if(x == PARAM_SUBSCRIBEDFLAG) {
				subscribedFlag = obj[x];
			}
			else if(x == PARAM_STOREID) {
				storeId = obj[x];
			}
			else if(x == PARAM_USERCOUNTRY) {
				userCountry = obj[x];
			}
			else if(x == PARAM_AGE) {
				age = obj[x];
			}
			else if(x == PARAM_GENDER ) {
				gender = obj[x];
			}
			else if(x == PARAM_MARITALSTATUS) {
				maritalStatus = obj[x];
			}
			else if(x == PARAM_NUMCHILDREN) {
				numChildren = obj[x];
			}
			else if(x == PARAM_NUMINHOUSEHOLD) {
				numInHousehold = obj[x];
			}			
			else if(x == PARAM_COMPANYNAME) {
				companyName = obj[x];
			}
			else if(x == PARAM_HOBBIES) {
				hobbies = obj[x];
			}
			else if(x == PARAM_INCOME ) {
				income = obj[x];
			}
			else {
				args.push(obj[x]);
			}
		}

		/** put known variables at the beginning**/
		args.unshift(userId, userEmail, userCity, userState, userZip, newsletterName, subscribedFlag, storeId, userCountry, age, gender, 
				maritalStatus, numChildren, numInHousehold, companyName, hobbies, income);
		
		/** call Coremetrics tag**/
		cmCreateRegistrationTag.apply({}, args);
		
		var obj = document.getElementById('cm-registration');
		if (obj != null) {
			var toLog = "cmCreateRegistrationTag(";
			if (userId != null && userId != "") {
				toLog += "\"" + userId + "\", ";
			} else {
				toLog += "null, ";
			}
			if (userEmail != null && userEmail != "") {
				toLog += "\"" + userEmail + "\", ";
			} else {
				toLog += "null, ";
			}	
			if (userCity != null && userCity != "") {
				toLog += "\"" + userCity + "\", ";
			} else {
				toLog += "null, ";
			}	
			if (userState != null && userState != "") {
				toLog += "\"" + userState + "\", ";
			} else {
				toLog += "null, ";
			}
			if (userZip != null && userZip != "") {
				toLog += "\"" + userZip + "\", ";
			} else {
				toLog += "null, ";
			}	
			
			if (newsletterName != null && newsletterName != "") {
				toLog += "\"" + newsletterName + "\", ";
			} else {
				toLog += "null, ";
			}
			if (subscribedFlag != null && subscribedFlag != "") {
				toLog += "\"" + subscribedFlag + "\", ";
			} else {
				toLog += "null, ";
			}	
			if (storeId != null && storeId != "") {
				toLog += "\"" + storeId + "\", ";
			} else {
				toLog += "null, ";
			}	
			if (userCountry != null && userCountry != "") {
				toLog += "\"" + userCountry + "\", ";
			} else {
				toLog += "null, ";
			}
			if (age != null && age != "") {
				toLog += "\"" + age + "\", ";
			} else {
				toLog += "null, ";
			}	
			
			if (gender != null && gender != "") {
				toLog += "\"" + gender + "\", ";
			} else {
				toLog += "null, ";
			}
			if (maritalStatus != null && maritalStatus != "") {
				toLog += "\"" + maritalStatus + "\", ";
			} else {
				toLog += "null, ";
			}	
			if (numChildren != null && numChildren != "") {
				toLog += "\"" + numChildren + "\", ";
			} else {
				toLog += "null, ";
			}	
			if (numInHousehold != null && numInHousehold != "") {
				toLog += "\"" + numInHousehold + "\", ";
			} else {
				toLog += "null, ";
			}
			if (companyName != null && companyName != "") {
				toLog += "\"" + companyName + "\", ";
			} else {
				toLog += "null, ";
			}				
			if (hobbies != null && hobbies != "") {
				toLog += "\"" + hobbies + "\", ";
			} else {
				toLog += "null, ";
			}				
			if (income != null && income != "") {
				toLog += "\"" + income + "\");\n";
			} else {
				toLog += "null);";
			}				
			var txtNode = document.createTextNode(toLog);
			obj.appendChild(txtNode); 
			obj.appendChild(document.createElement('br'));
		}
		
	},
	
	/**
	 * _getStoreId This function returns the store identifier of the page currently being viewed
	 * @return{String} returns the store identifier of the page currently being viewed
	 */
	_getStoreId: function() {
		
		var pairs = window.location.search.substr(1).split("&");
		for(var i = 0; i < pairs.length; i++) {
			var nvp = pairs[i].split("=");
			if((nvp.length == 2) && (nvp[0] == this.PARAM_STORE_ID)) {
				return nvp[1];
			}
		}
		return null;
	}
});

}
