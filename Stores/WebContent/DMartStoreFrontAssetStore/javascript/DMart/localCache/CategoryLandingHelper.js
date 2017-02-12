/**
 * Helper class for rendering content  to 
 * category listing page. 
 * 
 * 
 *  
 *  	   
 * 
 */

var ClpHelper = {
		
		pendingAjaxRequests: 0,
		//nOfItemstoLoadinRail means the number of items to be loaded from the L3 category for curated rail in case there is no curation for that category.
		nOfItemstoLoadinRail: 4,
		//nOfItemstoLoadinRail means the number of items to be showed in the rail from the L3 category.
		nOfItemstoShowinRail: 4,
		//minOfItemsInRail means the minimum number of items in a curated rail that is required to display a curated rail.
		minOfItemsInRail: 2,
		pageMode: '',
		categoryId: '',
		parentIds:[],
		clpData: {
			
			"product":{},
			"clpTopBanner": {},
        	"childCategories": {},
        	"curatedRailsData":{"subCategoryCuratedData" :[]},
        	"config" : '',
        	"maxnumber" : '',
        	"categoryId" : '',
        	"manufacturer" : '',
        	"catalogId" : '',
        	"assetStoreId" : '10101',
        	"noImagePath" : '',
        	"homePageURL" : ''
        	
        	
        },
        
        curatedRailsData: [],
		
		 searchUrlPrefix:  WCParamJS.searchHostNamePath+ '/search/resources/store/',
		 restUrlPrefix:  window.location.protocol + '//' + window.location.hostname + '/wcs/resources/store/',
		 pageid: {
		        category: WCParamJS.categoryId,
		        filters: {},
		        storeId: WCParamJS.storeId || '10151'
		    },
		 /**
	     * Entry point to the js class
	     */
	    init: function(categoryId, filterBy , divId) {
		    	
	        var self = this;
	        var JSONdata = ClpHelper.clpData;
	        
	        this.config = {
	            baseUrl: window.location.origin+'/webapp/wcs/stores/servlet/'
	        };
	        
	        JSONdata.config = this.config;
	        JSONdata.maxnumber = 5;
	        JSONdata.categoryId = categoryId;
	        JSONdata.manufacturer=  WCParamJS.handledManufacturer;
	        JSONdata.storeId = WCParamJS.storeId;
	        JSONdata.catalogId = WCParamJS.catalogId;
	        JSONdata.assetStoreId = '10101';
	        JSONdata.homePageURL=WCParamJS.homepageURLHierarchy;
	        JSONdata.noImagePath=WCParamJS.imageServerHost+'/images/DMart/NoImage_M.jpg';
	        nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
	        autoescape: true,
	            web: {
	                useCache: true
	            }
	        });
	        
	        
    		$('#' + divId).html(nunjucks.render('category-landing.nunjucks', {
                data: JSONdata
            }));
 	 
	    },
	    
	    /**
	     * Returns child categories of the category. Used for populating clp buttons
	     */
	    loadChildCategories: function() {
	    	console.debug("loadChildCategories()");
	    	//alert("loadChildCategories()");
	    	
	        var list = null;
	        var childCategories = {"childCategoryList" : []};
	        var constant=DMartAttributes.Constants;
	       
	        	
	        		
	        		// ajax parameters for getting child categories
	        		var ajaxCallParams = {
	                    url: this.searchUrlPrefix + this.pageid.storeId + '/categoryview/byParentCategory/' + this.pageid.category +
	                        '?depthAndLimit=50,50',
	                    method: 'GET',
	                    context: this,
	                    cache : false
	                };
	        		
	        		
	        		$.ajax(ajaxCallParams).done(function(data) {
					
	                    var catentries = [];
	                    var type;
	                    
	                    //construct childCategories Object with minimal data (categoryname & seo url) to be used to display clp buttons
	                    $.each(data.catalogGroupView[0].catalogGroupView, function(indx, val) {
	                    	
	                    	
	                    	childCategories.childCategoryList.push({  "name": val.name, "url": window.location.origin+'/webapp/wcs/stores/servlet/'+val.seo_token_ntk, "id": val.uniqueID});
	                    	
	                    	// load curated rails data for sub categories
	                    	
	                    	ClpHelper.loadCuratedEspotData(val.uniqueID , val.name , window.location.origin+'/webapp/wcs/stores/servlet/'+val.seo_token_ntk);
	                    	
	                    });
	                   
	                    this.clpData.childCategories=childCategories;
	                    
	                    
	                 
	                });
	        	     
	    },
	    
	    /* 
	     * To load the data required for rendering curated rails in CLP.
	     * It will be stored in ClpHelper.clpData.curatedRailsData
	     */
	    
	    loadCuratedRailsData:function(categoryId){
	    	//Logic: Iterate the list of subcategories, in each subcategory, see if curated rail espot is there. if yes, see if the number of products matches with the configured number to display. If yes, push them to JSON in given order, else, get the configured number of products under that category, applying brand filter if any, and push to JSON. 
	    	
	    	//get the child categories: Can reuse the  ClpHelper.clpData.childCategories.childCategoryList[] already loaded in the JSON.
	    	
	    	for(var i = 0; i < ClpHelper.clpData.childCategories.childCategoryList.length; i++) {
	    	    var obj = ClpHelper.clpData.childCategories.childCategoryList[i];

	    	   
	    	   //TODO: get curated rail data of each of the sub category
	    	  
	    	    //Begin curated rails data get   
	    	 // ajax parameters for getting child categories
        		var ajaxCallParams = {
                    url: this.searchUrlPrefix + this.pageid.storeId + '/categoryview/byParentCategory/' + this.pageid.category +
                        '?depthAndLimit=50,50',
                    method: 'GET',
                    context: this,
                    cache : false
                };
        		
        
        		
        		
        		$.ajax(ajaxCallParams).done(function(data) {
				
                    var catentries = [];
                    var type;
                    var childCategories ={"childCategoryList":[]};
                    //construct childCategories Object with minimal data (categoryname & seo url) to be used to display clp buttons
                    $.each(data.catalogGroupView[0].catalogGroupView, function(indx, val) {
                    	
                    	childCategories.childCategoryList.push({  "name": val.name, "url": window.location.origin+'/webapp/wcs/stores/servlet/'+val.seo_token_ntk, "id": val.uniqueID});
                    });
                    
                    this.clpData.childCategories=childCategories;
//                    console.debug("CLpHelper.loadCuratedRailsData: triggering dmart.clp.data.completed");
//                   // alert("CLpHelper.loadCuratedRailsData: triggering dmart.clp.data.completed");
//                    $(document).trigger('dmart.clp.data.completed', this.categoryId);
                    
                    
                    console.debug("Triggering loadCuratedRailsDatadmart.clp.curatedRail.data.completed");
        			//alert("Triggering loadCuratedRailsData dmart.clp.curatedRail.data.completed");
                    
                    $(document).trigger('dmart.clp.curatedRail.data.completed', this.categoryId);
                    
                  
                             
                });
        		//End curated rails data get 
	    	    
	    	}
	    	
	    
	    },
	    
	    loadClpTopBanner:function(){
	    	//Load the CLP top banner espot content to the JsonElement: ClpHelper.clpData.clpTopBanner
	    	var ajaxCallParams = {
                    url: this.restUrlPrefix + this.pageid.storeId + '/espot/CLP_TopBanner_' + WCParamJS.categoryId,
                    method: 'GET',
                    context: this,
                    cache : false
                };
        		
        		
        		$.ajax(ajaxCallParams).done(function(data) {
        			
        			if(!data.MarketingSpotData[0].baseMarketingSpotActivityData)
        			{
        			// get the defaultBanner espot
        				
        				var ajaxCallParams = {
        	                    url: this.restUrlPrefix + this.pageid.storeId + '/espot/CLP_TopBanner_Default',
        	                    method: 'GET',
        	                    context: this,
        	                    cache : false
        	                };
        	        		
        	        		
        	        		$.ajax(ajaxCallParams).done(function(data) {
        	        			                  
        	                    //construct childCategories Object with minimal data (categoryname & seo url) to be used to display clp buttons
        	                    
        	                    this.clpData.clpTopBanner=data;
        	                    console.debug("Triggering loadClpTopBanner: dmart.clp.topbanner.data.completed with default banner");
        	                    $(document).trigger('dmart.clp.topbanner.data.completed', this.categoryId);
        	                                  
        	                });
        				
        				
        			}                   
                    //construct childCategories Object with minimal data (categoryname & seo url) to be used to display clp buttons
                    
        			else{
                     this.clpData.clpTopBanner=data;
                     console.debug("Triggering loadClpTopBanner: dmart.clp.topbanner.data.completed");
                     $(document).trigger('dmart.clp.topbanner.data.completed', this.categoryId);
        			}
                    
                                  
                });
	    	
	    },
	    
	    loadCuratedEspotData:function(subCategoryId , name, url){
	    	
	    	this.pendingAjaxRequests = this.pendingAjaxRequests+1;
	    	
	    	var ajaxCallParams = {
                    url: this.restUrlPrefix + this.pageid.storeId + '/espot/CLP_CuratedRail_' + subCategoryId,
                    method: 'GET',
                    context: this,
                    cache : false
                };
        		
        		$.ajax(ajaxCallParams).done(function(data) {
					
        			if(data.MarketingSpotData[0].baseMarketingSpotActivityData != undefined)//if Curated espot found:
        				
        				{
                   
	                     var curatedItems = JSON.parse(data.MarketingSpotData[0].baseMarketingSpotActivityData[0].marketingContentDescription[0].marketingText).curatedItems;
        				 var subCategoryCuratedArray = [];
	                     for(var i = 0; i < curatedItems.length; i++) {
	                    	    var item = curatedItems[i];

	                    	    
	                    	    if(item.Type == 'Product'){
	                    	    	//push product Id
	                    	    	ClpHelper.parentIds.push(item.ID);
	                    	    	subCategoryCuratedArray.push({"id": item.ID , "type": item.Type});
	                    	    	
	                    	    }
	                    	    else if(item.Type == 'Content'){
	                    	    	
	                    	    	
	                    	    	
	                    	    	//Load the CLP top banner espot content to the JsonElement: ClpHelper.clpData.clpTopBanner
	                    	    	var params = {
	                                        url: this.restUrlPrefix + this.pageid.storeId + '/espot/CLP_CuratedRailContentDataEspot_' + item.ID,
	                                        method: 'GET',
	                                        context: this,
	                                        cache : false
	                                    };
	                            		
	                            		
	                            		$.ajax(params).done(function(responseData) {
	                    					                    
	                            			var curatedContent = JSON.parse(responseData.MarketingSpotData[0].baseMarketingSpotActivityData[0].marketingContentDescription[0].marketingText);
	                            			subCategoryCuratedArray.push({"id": item.ID , "type": "Content" , "ImgPath": curatedContent.ImgPath , "LinkTo": curatedContent.LinkTo , "LinkToId": curatedContent.LinkToId , "LinkToURL": window.location.origin+'/webapp/wcs/stores/servlet/en/'+curatedContent.LinkToURL});             
	                                    });
	                    	    	
	                    	    	
	                    	    	
	                    	    }
	                    	}
	                     ClpHelper.pushSubCatCuratedData(subCategoryId, name, url, subCategoryCuratedArray);
	                    
	                     this.pendingAjaxRequests = this.pendingAjaxRequests-1;
            	    	 //alert("this.pendingAjaxRequests: "+this.pendingAjaxRequests);
            	    	if(this.pendingAjaxRequests == 0) {
            	    		
            	    		 //alert("Triggering ClpHelper.loadCuratedEspotData: dmart.clp.subcategories.data.completed");
     	                    //alert("Triggering ClpHelper.loadChildCategories: dmart.clp.subcategories.data.completed");
     	                    $(document).trigger('dmart.clp.subcategories.data.completed', this.categoryId);
            	    	}
	                   }
	        			else{
	        				//GO for default products, considering brand filters
	        				
	        				this.getDefaultProductsForRail(subCategoryId, name, url);
	        				
	        			}
                  
//        			console.debug("Triggering load curated espotdata dmart.clp.curatedRail.data.completed");
//        			alert("Triggering curated espotdata dmart.clp.curatedRail.data.completed");
//                    $(document).trigger('dmart.clp.curatedRail.data.completed', this.categoryId);
                    
                  

                             
                });
	    	
	    },
	    
	    pushSubCatCuratedData:function(subCategoryId, name, url, curatedItems){
	    	
	    	this.clpData.curatedRailsData.subCategoryCuratedData.push({"subCategoryId": subCategoryId, "subCategoryName":name ,"url": url, "curatedItems": curatedItems});
			
	    	
	    },
	    
	    getDefaultProductsForRail:function(subCategoryId, name, url){
	    	
	    	
        		var ajaxCallParams = {
                    url: this.restUrlPrefix + this.pageid.storeId + '/productview/byCategory/' + subCategoryId +
                        '?pageNumber=' + 1 + '&pageSize=' + ClpHelper.nOfItemstoLoadinRail + '&profileName=X_findProductsByCategory_DMART',
                    method: 'GET',
                    context: this,
                    cache : false
                };
        		
        	
        		$.ajax(ajaxCallParams).done(function(data) {
                    var curatedItems =[];
                    $.each(data.CatalogEntryView, function(indx, val) {
                                           
                     if(val.buyable == 'true' && curatedItems.length < ClpHelper.nOfItemstoLoadinRail){
                    	
                    	 ClpHelper.parentIds.push(val.uniqueID);
                    	 curatedItems.push({"id": val.uniqueID, "type": "Product" });
                    	 
                     }

                    });
                    
                  //if number of fetched products for rail is less than the minimum number of products required to display rail, do not add that rail data. else, add that rail data.
                        if(curatedItems.length < ClpHelper.minOfItemsInRail){
                        	console.debug("Selected items count doesn't meet the minimum requirement to display the L3 rail");
                        }
                        else{
                        	
                        	this.pushSubCatCuratedData(subCategoryId, name, url, curatedItems);
                        }
                        this.pendingAjaxRequests = this.pendingAjaxRequests-1;
                        
                        if(this.pendingAjaxRequests == 0) {
            	    		
           	    		 //alert("Triggering ClpHelper.getDefaultProductsForRail: dmart.clp.subcategories.data.completed");
    	                    //alert("Triggering ClpHelper.loadChildCategories: dmart.clp.subcategories.data.completed");
    	                    $(document).trigger('dmart.clp.subcategories.data.completed', this.categoryId);
           	    	}
                });
               
        	}
	    	
		
};


$(document).ready(function() {
	
	if(window.location.protocol === "https:"){
		ClpHelper.searchUrlPrefix=  WCParamJS.searchSecureHostNamePath+ '/search/resources/store/';
			
	}
	localStorage.clear();
	
		ClpHelper.pageid= {
	    category: WCParamJS.categoryId,
	    filters: {},
	    storeId: WCParamJS.storeId || '10151'
	 };
		
	 ClpHelper.categoryId= WCParamJS.categoryId;

	 ClpHelper.loadChildCategories(WCParamJS.categoryId);
	
	 
	 			$(document).bind(
		        'dmart.clp.topbanner.data.completed',
		        function(e) {
		            console.debug("ClpHelper.parentIds:::::: "+ClpHelper.parentIds);
			        //ClpHelper.clpData.product = CLPProductListingHelper.createJSON(ClpHelper.parentIds);
			        
		               
		                
		        });
		        
		        
		            $(document).bind('dmart.clpproducts.loaded', function(e) {
		           // alert("dmart.clpproducts.loaded");
		         	 CLPProductListingHelper.init(currCatalogId.toString(), curPageNum,
		                'apparellisting', curPageNum > 1 ? true : false, 50,'');
		              
		           
		       		 });
		       		
					$(document).bind('dmart.clp.curatedRail.data.completed', function(e) {
					
				        while(false){
				        //wait for 50 milliseconds
				        	 if(ClpHelper.pendingAjaxRequests != 0){
							     
				             setTimeout(function () {}, 50);
				        	 }
				        	 else if(ClpHelper.pendingAjaxRequests == 0){
				        		
					          	 break;
				        	 }
				        }
				        
				       
				        	//alert("INITING CLPProductHelper");
				        CLPProductHelper.init(WCParamJS.categoryId, 1, 50,'');
			          	
				       
		       		 });
		       		 
		           
		           
		             $(document).bind('dmart.clpdata.ready', function(e) {
		                
		                
		                //alert("dmart.clpdata.ready");
		            	 ClpHelper.init(currcategoryId.toString(),  filterBy , 'ClpContent');
		            	  CLPProductHelper.loadBreadCrumbSubCat();
		                  
		             });
		             
		              $(document).bind(
				        'dmart.clp.subcategories.data.completed',
				        function(e) {
				       
				         ClpHelper.loadCuratedRailsData(WCParamJS.categoryId);
				         
				         ClpHelper.loadClpTopBanner();
				         
				        });

		              $(document).on('dmart.clp.breadcrumbs.loaded',
		          			function(event) {
		            	  CLPProductHelper.loadBreadCrumbsDropdown();
		          	}); 
});