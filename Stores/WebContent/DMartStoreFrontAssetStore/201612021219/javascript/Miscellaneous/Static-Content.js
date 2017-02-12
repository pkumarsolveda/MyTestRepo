/**
 * Copyright(c) Avenue E-Commerce Limited (2015). All Rights reserved. This
 * software is the confidential and proprietary information of Avenue E-Commerce
 * Limited ("Confidential Information"). You shall not disclose such
 * Confidential Information and shall use it only in accordance with the terms
 * of the license agreement you entered into with Avenue E-Commerce Limited.
 * 
 * Author Aditya_Pathak02 Date 18/1/2016
 */
var DMartStaticContent = {
	faq : function() {
		var redirectURL = window.location.origin+'/webapp/wcs/stores/servlet/' + "faq?storeId=" + WCParamJS.storeId;
		load: window.location.href = redirectURL;
	},
	aboutDMart : function() {
		var redirectURL = window.location.origin+'/webapp/wcs/stores/servlet/' + "about-us?storeId=" + WCParamJS.storeId;
		load: window.location.href = redirectURL;
	},
	privacy : function() {
		var redirectURL = window.location.origin+'/webapp/wcs/stores/servlet/' + "privacy-policy?storeId=" + WCParamJS.storeId;
		load: window.location.href = redirectURL;
	},
	contactDMart : function() {
		var redirectURL = window.location.origin+'/webapp/wcs/stores/servlet/' + "contact-us?storeId=" + WCParamJS.storeId;
		load: window.location.href = redirectURL;
	},
	PUPListDMart : function() {
		var redirectURL = window.location.origin+'/webapp/wcs/stores/servlet/' + "StoreLocatorView?storeId=" + WCParamJS.storeId;
		//load: window.location.href = redirectURL;
		window.open(redirectURL,'_blank');
	}
};