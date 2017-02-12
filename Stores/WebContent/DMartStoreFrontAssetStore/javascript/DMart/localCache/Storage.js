// Storage wrapper
var DMStorage = {
    EXPIRY_IN_DAYS: 1, // Set number of days to expire here.
    set: function(key, value) {
    //console.log('storing for'+key + 'value'+value);
        if (!window.localStorage || WCParamJS.dontUseLocalStorage === '1') {
        	if(typeof jsonObjOnPage === 'undefined') {
        		jsonObjOnPage = {};
        	}
            jsonObjOnPage[key] = JSON.stringify({
                value: value
            });
        } else {
        	var itemToStore =  JSON.stringify({
                value: value,
                timestamp: new Date().getTime()
            });
        	if(WCParamJS.disableLSCompression != '1'){
        		itemToStore = LZString.compressToUTF16(itemToStore);
        	}
        	try {
            localStorage.setItem(key, itemToStore);
        	} catch (err) {			
				if (err.name == 'QuotaExceededError') {
					console.log('Local storage size exceeded. Lets delete some old data');
					this.purgeData();
					this.set(key, itemToStore);
				}
			}

        }
        //console.log('key : ' + key);
        //console.log('value : ' + value);
        //console.log('localStorage : ' + JSON.stringify(localStorage));

    },
    // store values in session store
    sessionSet: function(key, value) {
            if (!window.sessionStorage) {
                jsonObjOnPage[key] = JSON.stringify({
                    value: value
                });
            } else {
            	var itemToStore =  JSON.stringify({
                    value: value
                });
            	if(WCParamJS.disableLSCompression != '1'){
            		itemToStore = LZString.compressToUTF16(itemToStore);
            	}
            	sessionStorage.setItem(key, itemToStore);
            }
        },
    // Get value from session storage
    getSessionValue: function(key) {
            if (!window.sessionStorage) {
                return ((typeof jsonObjOnPage[key] === "undefined") ? true : JSON.parse(jsonObjOnPage[key]).value);
            }
            var temp = sessionStorage.getItem(key);

            if (temp) {
            	if(WCParamJS.disableLSCompression != '1'){
            		temp = LZString.decompressFromUTF16(temp);
            	}
                return JSON.parse(temp).value;
            }

            return null;
        },    
    // Expire based on timestamp (TODO: or flag). 
    // Returns true if item is not found in localStorage
    invalid: function(key) {
        if (!window.localStorage || WCParamJS.dontUseLocalStorage === '1') {
            return true;
        }
        var timeStamp = this.getTimeStamp(key);

        if (timeStamp) {

            return ((timeStamp + this.EXPIRY_IN_DAYS * 24 * 3600 * 1000) < new Date().getTime());
        }

        return true;
    },
    // Get value only using key
    getValue: function(key) {
        if (!window.localStorage || WCParamJS.dontUseLocalStorage === '1') {
        	if(typeof jsonObjOnPage === 'undefined') {
        		return null;
        	}
        	
            return (jsonObjOnPage[key] ? JSON.parse(jsonObjOnPage[key]).value : null );
        }
        var temp = localStorage.getItem(key);
        var lsData = null;
        if (temp) {
        	if(WCParamJS.disableLSCompression != '1'){
        		temp = LZString.decompressFromUTF16(temp);
        	}
        	try {
                lsData = JSON.parse(temp).value;
            	} catch (err) {	
            		console.log('oh oh issue. compressed');
            		localStorage.removeItem(key);
            		return null;
            	}
            return lsData;
        }

        return null;
    },
    // Get timestamp only using key
    getTimeStamp: function(key) {

        if (!window.localStorage || WCParamJS.dontUseLocalStorage === '1') {
            return null;
        }
        
        var temp = localStorage.getItem(key);
        var lsData = null;
        if (temp) {
        	if(WCParamJS.disableLSCompression != '1'){
        		temp = LZString.decompressFromUTF16(temp);
        	}
        	try {
                lsData = JSON.parse(temp).timestamp;
            	} catch (err) {	
            		console.log('oh oh issue. compressed');
            		localStorage.removeItem(key);
            		return null;
            	}
        	return lsData;
        }
        
        return null;
        
    },
    // Force expiry
    remove: function(key) {
        if (!window.localStorage || WCParamJS.dontUseLocalStorage === '1') {
        	if(typeof jsonObjOnPage === 'undefined') {
        		return;
        	}
        	jsonObjOnPage[key] = undefined;
            return;
        }
        
        if (localStorage[key]) {
            localStorage.removeItem(key);
        }
    },
    /**
     * method to remove old data when storage is full. 
     * Get the list of all localstorage object's timestamp and key
     * sort the list based on timestamp
     * and remove the first 100 entries. 
     * A bit expensive operation. 
     */    

    purgeData : function() {    	
		var lsObjs = [];
		$.each(localStorage, function(key, value) {
			// append timestamp + key ( for removal)
			lsObjs.push(DMStorage.getTimeStamp(key) + '||' + key);
		});
		lsObjs.sort();
		// remove the first 100 entries.
		for (j = 0; j < 100; j++) {
			localStorage.removeItem(lsObjs[j].split('||')[1]);
		}
	},
    /**
	 * From localStorage find keys
	 * 
	 */
	getSpecificKeys : function(keyStrPattern) {
		var keys=[];
		if(window.localStorage && WCParamJS.dontUseLocalStorage !== '1') {
			$.each(localStorage ,function(key,val){
				keys.push(key);
			});
		} else {
			$.each(jsonObjOnPage,function(key,val){
				keys.push(key);
			});
		}
		var patt = new RegExp(keyStrPattern+'_.*');
		// Filter out keys starting with string
		keys = $.grep(keys,function(key){
			
			return key.search(patt) === 0;
		});
		
		return keys;
	}

};