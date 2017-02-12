//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2011, 2014 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------

/** 
 * @fileOverview This javascript is used by the wish list pages to handle CRUD operations.
 * @version 1.0
 */

/**
 * This REST service allows customers to create a new shopping list
 * @constructor
 */


/**
 * This REST service allows customers to update the name of a shopping list
 * @constructor
 */
wc.service.declare({
	id:"ShoppingListServiceUpdate",
	actionId:"ShoppingListServiceUpdate",
	url: window.location.origin+'/webapp/wcs/stores/servlet/'+ "AjaxRestWishListUpdate",
	formId:""

	 /**
     * Hides all the messages and the progress bar.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,successHandler: function(serviceResponse) {
		cursor_clear();
		closeAllDialogs();
		shoppingListJS.showMessageDialog(storeNLS['LIST_EDITED']);
		
		dojo.topic.publish('ShoppingList_Changed', {listId: serviceResponse.uniqueID, listName: serviceResponse.descriptionName, action: 'edit'});
	}
		
	/**
     * display an error message.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,failureHandler: function(serviceResponse) {
		if (serviceResponse.errorMessage) {
			MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
		} 
		else {
			 if (serviceResponse.errorMessageKey) {
				MessageHelper.displayErrorMessage(serviceResponse.errorMessageKey);
			 }
		}
		cursor_clear();
	}			
}),

/**
 * This REST service allows customers to delete a selected shopping list
 * @constructor
 */
wc.service.declare({
	id:"ShoppingListServiceDelete",
	actionId:"ShoppingListServiceDelete",
	url: window.location.origin+'/webapp/wcs/stores/servlet/'  + "AjaxRestWishListDelete",
	formId:""

	 /**
     * Hides all the messages and the progress bar.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,successHandler: function(serviceResponse) {
		cursor_clear();			
		closeAllDialogs();
		shoppingListJS.showMessageDialog(storeNLS['LIST_DELETED']);
		
		dojo.topic.publish('ShoppingList_Changed', {listId: serviceResponse.uniqueID, listName: '', action: 'delete'});
	}
		
	/**
     * display an error message.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,failureHandler: function(serviceResponse) {
		if (serviceResponse.errorMessage) {
			MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
		} 
		else {
			 if (serviceResponse.errorMessageKey) {
				MessageHelper.displayErrorMessage(serviceResponse.errorMessageKey);
			 }
		}
		cursor_clear();
	}			
}),

/**
 * This REST service allows customers to add an item to a shopping list
 * @constructor
 */


/**
 * This REST service allows customers to remove an item from a shopping list
 * @constructor
 */
wc.service.declare({
	id:"ShoppingListServiceRemoveItem",
	actionId:"ShoppingListServiceRemoveItem",
	url: window.location.origin+'/webapp/wcs/stores/servlet/' + "AjaxRestWishListRemoveItem",
	formId:""

	 /**
     * Hides all the messages and the progress bar.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,successHandler: function(serviceResponse) {
		cursor_clear();			
		MessageHelper.hideAndClearMessage();
		shoppingListJS.showMessageDialog(storeNLS['ITEM_REMOVED']);
	}
		
	/**
     * display an error message.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,failureHandler: function(serviceResponse) {
		if (serviceResponse.errorMessage) {
			MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
		} 
		else {
			 if (serviceResponse.errorMessageKey) {
				MessageHelper.displayErrorMessage(serviceResponse.errorMessageKey);
			 }
		}
		cursor_clear();
	}			
}),
	
/**
 * This REST service allows customers to add an item to a shopping list and remove from the shopping cart
 * @constructor
 */
wc.service.declare({
	id:"ShoppingListServiceAddItemAndRemoveFromCart",
	actionId:"ShoppingListServiceAddItemAndRemoveFromCart",
	url: window.location.origin+'/webapp/wcs/stores/servlet/'+ "AjaxRestWishListAddItem",
	formId:""

	/**
	 * Hides all the messages and the progress bar.
	 * @param (object) serviceResponse The service response object, which is the
	 * JSON object returned by the service invocation.
	 */
	,successHandler: function(serviceResponse) {
		cursor_clear();
		dojo.topic.publish("ShoppingListItem_Added");
	}
			
	/**
	 * display an error message.
	 * @param (object) serviceResponse The service response object, which is the
	 * JSON object returned by the service invocation.
	 */
	,failureHandler: function(serviceResponse) {
		if (serviceResponse.errorMessage) {
			MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
		} 
		else {
			 if (serviceResponse.errorMessageKey) {
				MessageHelper.displayErrorMessage(serviceResponse.errorMessageKey);
			 }
		}
		cursor_clear();
	}			
}),

/**
* This REST service allows customers to set a wish list as the default list
* @constructor
* 
**/
wc.service.declare({
	id:"AjaxGiftListServiceChangeGiftListStatus",
	actionId:"AjaxGiftListServiceChangeGiftListStatus",
	url: window.location.origin+'/webapp/wcs/stores/servlet/'+ "AjaxRestWishListChangeState",
	formId:""

	 /**
     * Hides all the messages and the progress bar.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,successHandler: function(serviceResponse) {
		cursor_clear();			
		MessageHelper.hideAndClearMessage();

		MultipleWishLists.updateDefaultListName('multipleWishListButton',serviceResponse.descriptionName);		
		MultipleWishLists.updateDefaultListName('addToMultipleWishListLink',serviceResponse.descriptionName);
		MultipleWishLists.setDefaultListId(serviceResponse.uniqueID);
		MultipleWishLists.updateContextPostSwitch(serviceResponse.uniqueID);
	}
		
	/**
     * display an error message.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,failureHandler: function(serviceResponse) {
		if (serviceResponse.errorMessage) {
			MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
		} 
		else {
			 if (serviceResponse.errorMessageKey) {
				MessageHelper.displayErrorMessage(serviceResponse.errorMessageKey);
			 }
		}
		cursor_clear();
	}			
}),

	/**
	 * This REST service sends the wish list to a specified email address.
	 */
	wc.service.declare({
		id: "AjaxGiftListAnnouncement",
		actionId: "AjaxGiftListAnnouncement",
		url: window.location.origin+'/webapp/wcs/stores/servlet/'+ "AjaxRESTWishListAnnounce",
		formId: ""

    /**
     * hides all the messages and the progress bar
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation
     */
		,successHandler: function(serviceResponse) {
			cursor_clear();			
			MessageHelper.hideAndClearMessage();
			shoppingListJS.showMessageDialog(storeNLS['WISHLIST_EMAIL_SENT']);
		}
     /**
     * display an error message
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation
     */
		,failureHandler: function(serviceResponse) {

			if (serviceResponse.errorMessage) {
				MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
			} 
			else {
				 if (serviceResponse.errorMessageKey) {
					MessageHelper.displayErrorMessage(serviceResponse.errorMessageKey);
				 }
			}
			cursor_clear();
		}

	})
