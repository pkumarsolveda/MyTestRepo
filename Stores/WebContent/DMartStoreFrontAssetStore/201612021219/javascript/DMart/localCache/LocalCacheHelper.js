/**
 * Helper class for checking the local objects stored in browser cache. A global
 * variable cacheUpdate holds the last price/ inventory change time stamp. If
 * out local cache timestamp is less than the global variable cache refresh is
 * required.
 * 
 */
var localCache = {
    URLparams: {
        URLPrefix: window.location.protocol + '//' + window.location.hostname + '/wcs/resources/store/',
        storeID: $('#storeId').val() || '10151', // make this dynamic
        URLRefreshAllindex: "/cache/getAllCacheLastUpdate",
        URLLastUpdateindex: "/cache/cacheLastUpdate",
        URLCacheValidindex: "/cache/cacheValid",
        dataRefreshAll: 'responseFormat=json&all=true',
        dataLastUpdate: 'responseFormat=json&cacheName={cacheName}&isLastUpdate=true',
        dataCacheValid: 'responseFormat=json&cacheName={cacheName}&cacheUpdateTime={cacheUpdateTime}'

    },
    cacheUpdate: {
        Inventory: null,
        Price: null,
        Global: null
    },

    /**
     * Initialize on page load to populate the cache update timestamps to js
     * global variables
     */
    init: function() {
        this.refresh();
    },
    refresh: function() {
    	this.clearInventoryCache();
        $.ajax({
            url: this.URLparams.URLPrefix + this.URLparams.storeID + this.URLparams.URLLastUpdateindex,
            type: "POST",
            data: this.URLparams.dataRefreshAll,
            context: this,
            async: false
                // should be sync to force other actions to wait
        }).done(function(data) {
        	// Mozilla timeformat issue fix
        	if(data.Inventory) {
        		this.cacheUpdate.Inventory = new Date(data.Inventory.replace(' ',(navigator.userAgent.indexOf("Chrome") > -1)? " " : "T"));
        	}
        	if(data.Price) {
        		this.cacheUpdate.Price = new Date(data.Price.replace(' ',(navigator.userAgent.indexOf("Chrome") > -1)? " " : "T"));
        	}
            if(data.Global) {
            	this.cacheUpdate.Global = new Date(data.Global.replace(' ',(navigator.userAgent.indexOf("Chrome") > -1)? " " : "T"));
            }
            this.removeInvalidCache();
            $(document).trigger('dmart.cache.validator.completed');
        }).fail(function(data) {
        		$(document).trigger('dmart.cache.validator.completed');
        });
    },
    clearInventoryCache: function(){
    	$.each(localStorage, function(key, value) {
    		if(localCache.isInvCacheToBeRemoved(key)){
    			console.log("Removing inventory cache:"+key);
    			localStorage.removeItem(key);;
    		}
    	});
    },
    isInventoryCacheValid: function(cacheUpdateTimestamp) {
        if (this.cacheUpdate.Inventory == null) {
            refresh();
        }
        return (cacheUpdateTimestamp > this.cacheUpdate.Inventory.getTime());
    },

    isPriceCacheValid: function(cacheUpdateTimestamp) {
        if (this.cacheUpdate.Price == null) {
            refresh();
        }
        return (cacheUpdateTimestamp > this.cacheUpdate.Price.getTime());
    },

    isGlobalCacheValid: function(cacheUpdateTimestamp) {
        if (this.cacheUpdate.Global == null) {
            refresh();
        }
        return (cacheUpdateTimestamp > this.cacheUpdate.Global.getTime());
    },

    removeInvalidCache: function(cacheUpdateTimestamp) {

        if(!window.localStorage) {
        	return;
        }
        $.each(localStorage, function(key, value) {
        	if(key.indexOf('ADRUM') == 0) {
        		return;
        	}
        	
        	try {
            var cacheTimestamp = DMStorage.getTimeStamp(key);
        	} catch (err) {		
        		localStorage.removeItem(key);
        	}
            // clear LS for following conditions
            // Global timestamp mismatch - Clear all
            // Price/ Inv timestamp mismatch - clear item_PriceInv cache
            if (typeof cacheTimestamp === "undefined" || (
                    (localCache.isCacheToBeRemoved(key) && (!localCache
                        .isInventoryCacheValid(cacheTimestamp) || !localCache
                        .isPriceCacheValid(cacheTimestamp))) ||
                    !localCache.isGlobalCacheValid(cacheTimestamp))) {
                console.log('local cache cleared for ' + key);
                localStorage.removeItem(key);
                if(key.indexOf('categoryHierarchy_') > -1 || key.indexOf('topnav_') > -1){
                	 var storeId= WCParamJS.storeId || '10151';
         			 CachedHeader.init(DepartmentDropdownURL, userType, storeId);
    			}               
            }
        });
    },
    
    isCacheToBeRemoved: function(key){
    	//InvCacheClrEntries = ['topnav_', '"category":','categoryHierarchy_', 'facet_nav_','filter_titles', 'item_PriceInv'];
    	if (key.indexOf('topnav_') > -1 ||
    		    key.indexOf('"category":') > -1 ||
    		    key.indexOf('"search":') > -1 ||
    		    key.indexOf('categoryHierarchy_') > -1 ||
    		    key.indexOf('filter_titles') > -1 ||
    		    key.indexOf('item_PriceInv') > -1 ||
    		    key.indexOf('facet_nav_') > -1 ||
    		    key.indexOf('proditems_') > -1) {    			
    		    return true;
    		} else {
    		    return false;
    		}
    },
    
    isInvCacheToBeRemoved: function(key){
    	if ( key.indexOf('"category":') > -1 ||
    		    key.indexOf('"search":') > -1 ||
    		    key.indexOf('item_PriceInv') > -1) {    			
    		    return true;
    		} else {
    		    return false;
    		}
    },

};
// lets bind an action for cache refresh
$(document).bind('dmart.cache.validator.refresh', function(e) {
    localCache.init();
});