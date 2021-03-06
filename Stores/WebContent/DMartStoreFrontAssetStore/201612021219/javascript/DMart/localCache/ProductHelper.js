// PLP PDP helper
var SORT_ORDER_INV_RELEVANCE = '0'; // Sort by Inventory, Relevance
var SORT_ORDER_INV_NAME = '1'; // Sort by Inventory, Name
var SORT_ORDER_INV_LOHI = '2'; // Sort by Inventory, Price Low to High
var SORT_ORDER_INV_HILO = '3'; // Sort by Inventory, Price High to Low

var ProductHelper = {
    urlPrefix:  WCParamJS.searchHostNamePath+ '/search/resources/store/',
    pageid: {
        category: '',
        filters: {},
        pageNumber: '',
        storeId: WCParamJS.storeId
    },
    /**
     * String which will be the key for localDMStorage
     */
    pidstr: '',
    
    pageType : '',
    
    facetNavLoaded : false,
    
    facetLSKey : '',
    
    isNoResults : false,
    
    breadcrumbsLoaded: false,
    
    hasNoFacets : false,
    /**
     * Initialize on page load with categoryId or page details object
     * Inputs : categoryId 
     * 			pageNumberInt - page number for pagination starts from 1...
     * 			pageSizeInt - number of products to be fetched starts from 1...
     */
    init: function(categoryId, pageNumberInt, pageSizeInt, searchTerm) {
    	if(window.location.protocol === "https:"){
    		this.urlPrefix=  WCParamJS.searchSecureHostNamePath+ '/search/resources/store/';
    	}
        
        this.pageNumber = pageNumberInt;
        this.pageSize = pageSizeInt;
        if(categoryId != ""){
        	if (typeof categoryId === 'string') {
                this.pageid = {
                    category: categoryId,
                    filters: this.filtersOnpage,
                    pageNumber: this.pageNumber,
                    storeId: WCParamJS.storeId || '10151' // Check if storeId is there
                };
            } else {

                this.pageid = categoryId;
            }
        }else if(searchTerm != "" && typeof searchTerm === 'string'){
        	this.pageid = {
        			search: searchTerm,
                    filters: this.filtersOnpage,
                    pageNumber: this.pageNumber,
                    storeId: WCParamJS.storeId || '10151' // Check if storeId is there
                };
        }else if (typeof WCParamJS.handledManufacturer != "undefined" && WCParamJS.handledManufacturer != ""){
        	console.log("brand is "+WCParamJS.handledManufacturer);
        	this.pageid = {
        			brand: WCParamJS.handledManufacturer,
                    filters: this.filtersOnpage,
                    pageNumber: this.pageNumber,
                    storeId: WCParamJS.storeId || '10151' // Check if storeId is there
                };
        }        
        this.filtersOnpage = this.getFiltersOnPage();
        this.pageid.filters = this.filtersOnpage;
        this.pidstr = JSON.stringify(this.pageid);
        this.getProducts();
    },
    /**
     * get the filters available on page before every rest call.
     * Iterate through filter div (js-filter-sortby) and
     * separate filters based on filter type  
     * brand, type, variants, color, size etc. 
     * also sets the sort option. 
     */
    getFiltersOnPage: function() {
        //this.sort = $('.js-filter-sortby').val();
        this.sort = DMStorage.getValue('sortOptionChosen_'+(this.pageid.category||this.pageid.search||this.pageid.brand));
        var filtersSelected = {}, filterValue = '', filterStr = "",
        salePriceMin, salePriceMax, priceFilterString="", 
        discountMin, discountMax, discountFilterString="";
        
        var selectedFilters = DMStorage.getValue('filtersChosen_'+(this.pageid.category||this.pageid.search||this.pageid.brand));
        if(selectedFilters) {
	        $.each(selectedFilters, function(indx, filter) {
	        	// encode filter value for url
	        	filterValue = encodeURIComponent(filter.filterValue);
	            if (filtersSelected[filter.filterType]) {
	                filtersSelected[filter.filterType] = filtersSelected[filter.filterType] + ',"' + filterValue + '"';
	            } else {
	                filtersSelected[filter.filterType] = ('"' + filterValue + '"');
	            }
	        });
        }

        var priceRangeChosen = DMStorage.getValue('priceRangeChosen_'+(this.pageid.category||this.pageid.search||this.pageid.brand));
        if(priceRangeChosen) {
        	var prices = priceRangeChosen.split('-');
        	priceFilterString =  "&minSalePrice="+prices[0]+"&maxSalePrice="+prices[1];
        }
        
        var discountRangeChosen = DMStorage.getValue('discountRangeChosen_'+(this.pageid.category||this.pageid.search||this.pageid.brand));
        if(discountRangeChosen) {
        	var discounts = discountRangeChosen.split('-');
        	discountFilterString =  "&minDiscPerc="+discounts[0]+"&maxDiscPerc="+discounts[1];
        }
        
       /* if (typeof WCParamJS.handledManufacturer != "undefined" && WCParamJS.handledManufacturer != ""){
        	if (filtersSelected[WCParamJS.brandFacet]) {
                filtersSelected[WCParamJS.brandFacet] = filtersSelected[WCParamJS.brandFacet] + ',"' + WCParamJS.handledManufacturer + '"';
            } else {
                filtersSelected[WCParamJS.brandFacet] = ('"' + WCParamJS.handledManufacturer + '"');
            }
        }*/
        
        if (typeof WCParamJS.offerCat != "undefined" && WCParamJS.offerCat != ""  && WCParamJS.offerCat != null){
        	if (filtersSelected['promotion_Flag']) {
                filtersSelected['promotion_Flag'] = 1;
            } else {
                filtersSelected['promotion_Flag'] = ('"' + 1 + '"');
            }        	
        	filtersSelected['promotion_Store'] = WCParamJS.offerCat;
        	
        }
        
        $.each(filtersSelected, function(key, value) {
            filterStr = filterStr + "&facet=" + key + ":" + value.split(',').sort().join();
        });
        // Set default sort order for PLP and Search Results
        var defaultSortOption = SORT_ORDER_INV_RELEVANCE;
        /*
         *      if(this.pageid.brand) {
                	defaultSortOption = SORT_ORDER_INV_LOHI;
                } else if(this.pageid.search) {
                	defaultSortOption = SORT_ORDER_INV_RELEVANCE;
                }
         */
        
        return filterStr + '&orderBy=' + (this.sort||defaultSortOption)+priceFilterString+discountFilterString;
    },
    /**
     * Invoke if a filter is selected filtername is the filter group
     * 
     */
    selectFilter: function(filterName, filterValue) {
        var filter = this.pageid.filters[filterName];

        // If filtergroup is not present in list,
        // add it
        if (!filter) {
            filter = this.pageid.filters[filterName] = [];
        }

        if (filter && filter.indexOf(filterValue) === -1) {
            filter.push(filterValue);
            filter.sort();
            this.pidstr = JSON.stringify(this.pageid);
            // Get products
            this.getProducts();

        }
    },
    /**
     * Remove filter to update pageId
     */
    removeFilter: function(filterName, filterValue) {
        var filter = this.pageid.filters[filterName];

        if (filter && filter.indexOf(filterValue) > -1) {

            filter.splice(filter.indexOf(filterValue), 1);
            // If filter list is empty, remove the filter
            // for consistency , reduces key length
            if (filter.length === 0) {
                this.pageid.filters[filterName] = undefined;
            } else {
                // Sort non empty filter list
                filter.sort();
            }
            this.pidstr = JSON.stringify(this.pageid);
            this.getProducts();
        }
    },

    /**
     * Returns catentries corresponding to the category and filters selected
     */
    getProducts: function() {
        var list = null;
        var constant=DMartAttributes.Constants;
        if (DMStorage.invalid(this.pidstr)) {
        	if(typeof this.pageid.category != "undefined" && this.pageid.category != ""){
        		var ajaxCallParams = {
                    url: this.urlPrefix + this.pageid.storeId + '/productview/byCategory/' + this.pageid.category +
                        '?pageNumber=' + this.pageid.pageNumber + '&pageSize=' + this.pageSize + this.filtersOnpage +
                        '&profileName=X_findProductsByCategory_DMART',
                    method: 'GET',
                    context: this,
                    cache : false
                };
        		
        		//For Storepreview
    			if(parent.dmartPreviewToken) {
    				ajaxCallParams.xhrFields = {
    			        withCredentials: true
    			    };
    				ajaxCallParams.headers = { 
    						WCPreviewToken: parent.dmartPreviewToken
    				};
    			}
        		
        		
        		$.ajax(ajaxCallParams).done(function(data) {

                    var catentries = [];
                    var type;
                    $.each(data.catalogEntryView, function(indx, val) {
                        catentries.push(val.uniqueID);
                        if (DMStorage.invalid('prod_' + val.uniqueID)) {
                            var productBean = {};
                            productBean.attribs = val;
                            DMStorage.set('prod_' + val.uniqueID, productBean);
                        }
                        if(typeof val.attributes != "undefined" && val.attributes != null ){
                        $.each(val.attributes, function(count, attr) {
                        if (attr.name == constant.Grocery.Descriptive.CategoryType || attr.name.toUpperCase() ==  constant.Apparel.Descriptive.CategoryType) {
                            	type= attr.values[0].value.toLowerCase();
                            }
                        });
                    }

                    });
                    
                    if (type != "" && type != undefined){
                    	this.pageType=type;
                    }
                    var values = new Object();
                	values["catentries"]=catentries;
                    DMStorage.set(this.pidstr, values);
                    //DMStorage.set(this.pidstr, catentries);
                    // to populate facet navigation local storage                
                   // if (this.pageid.filters.length == 0) {
                        this.getFacetNavigationList(data);
                        if(!this.isNoResults){
                        	if(!this.hasNoFacets){
                        		$('.filter-module').css('display', 'block');
                        	}else{
                        		$('.filter-module').css('display', 'none');
                        	}                      	
                            $('.breadcrumbs').css('display', 'block');
                            $('#pricediscountsort').css('display', 'block');
                        }
                    //}
                    this.fetchProductDetails(catentries);
                    this.data = data;
                    $('#noResultsContent').html("");
                    // load facet also when products are loaded.               
                });
                list = DMStorage.getValue(this.pidstr);
        	}else if ((typeof this.pageid.search != "undefined" && this.pageid.search != "")||(typeof this.pageid.brand != "undefined" && this.pageid.brand != "")){
        		var searchURL;
        		if(typeof this.pageid.brand != "undefined" && this.pageid.brand != ""){
        			this.pageid.search='*';
        			this.pageid.brand = decodeURIComponent( this.pageid.brand);
        			searchURL=  this.urlPrefix + this.pageid.storeId + '/productview/dmartsearch/' + encodeURIComponent(this.pageid.search.replace('&amp;','&')) +
                    '?pageNumber=' + this.pageid.pageNumber + '&pageSize=' + this.pageSize +"&manufacturer="+escape(this.pageid.brand)+ this.filtersOnpage +
                    '&profileName=X_findProductsBySearchTerm_DMART'+ '&searchType=1000&searchSource=Q'+
                    '&intentSearchTerm='+ encodeURIComponent(this.pageid.search.replace('&amp;','&')) +'&metaData='+WCParamJS.metaData;
        		}else{
        			searchURL = this.urlPrefix + this.pageid.storeId + '/productview/dmartsearch/' + encodeURIComponent(this.pageid.search.replace('&amp;','&'))  +
                    '?pageNumber=' + this.pageid.pageNumber + '&pageSize=' + this.pageSize + this.filtersOnpage +
                    '&profileName=X_findProductsBySearchTerm_DMART'+ '&searchType=1000&searchSource=Q'+
                    '&intentSearchTerm='+ encodeURIComponent(this.pageid.search.replace('&amp;','&'))+'&metaData='+WCParamJS.metaData;
        		}
        		var ajaxCallParams = {
                    url: searchURL,
                    method: 'GET',
                    context: this,
                    cache : false
                };
        		
        		//For Storepreview
    			if(parent.dmartPreviewToken) {
    				ajaxCallParams.xhrFields = {
    			        withCredentials: true
    			    };
    				ajaxCallParams.headers = { 
    						WCPreviewToken: parent.dmartPreviewToken
    				};
    			}
        		
        		$.ajax(ajaxCallParams).done(function(data) {

                    var catentries = [];
                    var type;
                    if(data.recordSetTotal != 0){
                    	$.each(data.catalogEntryView, function(indx, val) {
                            catentries.push(val.uniqueID);
                            if (DMStorage.invalid('prod_' + val.uniqueID)) {
                                var productBean = {};
                                productBean.attribs = val;
                                DMStorage.set('prod_' + val.uniqueID, productBean);
                            }
                            var constant=DMartAttributes.Constants;
                            $.each(val.attributes, function(count, attr) {
                                if (attr.name == "CATEGORY TEMPLATE TYPE" || attr.name ==  "Category Template Type") {
                                	type= attr.values[0].value.toLowerCase();
                                }
                            });
                        });
                    	if (type != "" && type != undefined){
                        	this.pageType=type;
                        }
                    	var values = new Object();
                    	values["catentries"]=catentries;
                    	if(data.suggestedSearchTerm) {
                    		values["dymTerm"]=data.suggestedSearchTerm;
                        }
                    	values["totalRecords"]=data.recordSetTotal;
                        DMStorage.set(this.pidstr, values);
                        //DMStorage.set(this.pidstr, catentries);
                        // to populate facet navigation local storage                
                       // if (this.pageid.filters.length == 0) {
                            this.getFacetNavigationList(data);
                            if(!this.isNoResults){
                            	if(!this.hasNoFacets){
                            		$('.filter-module').css('display', 'block');
                            	}else{
                            		$('.filter-module').css('display', 'none');
                            	}                          	
                                $('.breadcrumbs').css('display', 'block');
                                $('#pricediscountsort').css('display', 'block');
                            }
                        //}
                        this.fetchProductDetails(catentries);
                        this.data = data;
                        $('#noResultsContent').html("");
                        // load facet also when products are loaded.
                    }else if ((data.recordSetTotal == 0 && typeof data.metaData.spellcheck != "undefined" && data.metaData.spellcheck != "")&&(typeof WCParamJS.handledManufacturer == "undefined" || WCParamJS.handledManufacturer == "")){
                    	
                    	var spellcheckSearchTerm=data.metaData.spellcheck[0];
                    	if (typeof spellcheckSearchTerm != "undefined" || spellcheckSearchTerm != ""){
                    		var ajaxCallParams = {
                                url: this.urlPrefix + this.pageid.storeId + '/productview/bySearchTerm/' + spellcheckSearchTerm +
                                    '?pageNumber=' + this.pageid.pageNumber + '&pageSize=' + this.pageSize + this.filtersOnpage +
                                    '&profileName=X_findProductsBySearchTerm_DMART'+ '&searchType=1000&searchSource=S'+
                                    '&intentSearchTerm='+spellcheckSearchTerm+'&metaData='+WCParamJS.metaData+'&originalSearchTerm='+this.pageid.search,
                                method: 'GET',
                                context: this,
                                cache : false
                            };
                    		
                    		//For Storepreview
                			if(parent.dmartPreviewToken) {
                				ajaxCallParams.xhrFields = {
                			        withCredentials: true
                			    };
                				ajaxCallParams.headers = { 
                						WCPreviewToken: parent.dmartPreviewToken
                				};
                			}
                    		
                    		$.ajax(ajaxCallParams).done(function(data) { 
                            	if(data.recordSetTotal != 0){
                                	$.each(data.catalogEntryView, function(indx, val) {
                                        catentries.push(val.uniqueID);
                                        if (DMStorage.invalid('prod_' + val.uniqueID)) {
                                            var productBean = {};
                                            productBean.attribs = val;
                                            DMStorage.set('prod_' + val.uniqueID, productBean);
                                        }
                                        $.each(val.attributes, function(count, attr) {
                                            if (attr.name == constant.Grocery.Descriptive.CategoryType || attr.name.toUpperCase() ==  constant.Apparel.Descriptive.CategoryType) {
                                            	type= attr.values[0].value.toLowerCase();
                                            }
                                        });

                                    });
                                	if (type != "" && type != undefined){
                                    	this.pageType=type;
                                    }
                                	var values = new Object();
                                	values["catentries"]=catentries;
                                	values["dymTerm"]=spellcheckSearchTerm;
                                    DMStorage.set(this.pidstr, values);
                                    // to populate facet navigation local storage                
                                   // if (this.pageid.filters.length == 0) {
                                        this.getFacetNavigationList(data);
                                        if(!this.isNoResults){
                                        	if(!this.hasNoFacets){
                                        		$('.filter-module').css('display', 'block');
                                        	}else{
                                        		$('.filter-module').css('display', 'none');
                                        	} 
                                            $('.breadcrumbs').css('display', 'block');
                                            $('#pricediscountsort').css('display', 'block');
                                        }
                                    //}
                                    this.fetchProductDetails(catentries);
                                    this.data = data;
                                    $('#noResultsContent').html("");
                                    // load facet also when products are loaded.
                                }else{
                                	if($('.common-search__instead').length){
                                    	if (typeof searchTerm != "undefined" && searchTerm != ""){
                                    		ProductHelper.isNoResults =true;
                                    		this.loadNoResultsPage();
                                    	}
                                	}
                                }
                            });
                    	}
                    	
                    }else{
                    	if($('.common-search__instead').length){
                        	if (typeof searchTerm != "undefined" && searchTerm != ""){
                        		ProductHelper.isNoResults =true;
                        		this.loadNoResultsPage();
                        	}
                    	}
                    }
                }).fail(function(data){
                	ProductHelper.isNoResults =true;
            		this.loadNoResultsPage();
                });
                list = DMStorage.getValue(this.pidstr);
        	}           
        } else {
            var catentriesObject = DMStorage.getValue(this.pidstr);
            var catentries = catentriesObject.catentries;
            if(!this.isNoResults){
            	if(!this.hasNoFacets){
            		$('.filter-module').css('display', 'block');
            	}else{
            		$('.filter-module').css('display', 'none');
            	} 
                $('.breadcrumbs').css('display', 'block');
                $('#pricediscountsort').css('display', 'block');
            }
            $(document).trigger('dmart.facet.loaded');
            if((this.pageNumber == 1)){
            	this.loadBreadCrumbSubCat();
            }
            
            this.fetchProductDetails(catentries);

        }

    },
    /**
     * Stores filters corresponding to the category selected in local storage
     */
    getFacetNavigationList: function(data) {
        var brands = [],
            price_band = [],
            size = [],
            weights = [],
            types = [],
            colour = [],
            catgroup = [],
            categoryFilter = [],
            categoryNames = [];
        var price = {},
            facet_nav = {}, filterLoaded = '',filterSetTitles=[],facetLSKey='';
        
        var self = this;
        var filterChain = facetNavigationDisplay.selectedFilters;
        var constant=DMartAttributes.Constants;
        
        var brandFacetLSKey = this.pageid.category || this.pageid.search; 
        if(this.pageid.brand){
        	brandFacetLSKey = this.pageid.brand; 
		}
        if(typeof data.facetView != "undefined"){
        
            var counter = 1, nFilters = 0;
            
/*while(nFilters < 3 && data.facetView.length < counter) {
        var filterElement = $.grep(data.facetView,function(){return this.name.indexOf('FILTER'+counter) === 0;});
        
        
        
        counter++;
}*/
    
    while(counter<=99 && nFilters < 3) {
    	if(typeof data.facetView != "undefined"){
        $.each(data.facetView,function(indx,val){
            if (val.name.indexOf('FILTER'+counter) === 0) {
                var filters = [];
                var nameSplit = val.name.split('_');
                var filterSetName = nameSplit[1];
                var priceBandSplit = [];
                $.each(val.entry, function(iter, entry) {
                  if (entry.count > 0) {
                      var oneFilter = {
                    		  title : entry.label,
                              type : val.value
                              
                      };
                  if('BRAND' === filterSetName) {
                	 // DMStorage.set('brandFacet_'+brandFacetLSKey,entry.value);
                      oneFilter.img_src = entry.label + "-STD.svg";
                  }
                  else if('PRICE BAND' === filterSetName) {
                      var temp = "";
                      temp = entry.label;
                      if (priceBandSplit.length == 0) {
                         $.each(temp.split("-"), function(loop, priceSplit) {
                                 priceBandSplit[loop] = priceSplit;
                         });
                      } else {
                         $.each(temp.split("-"), function(loop, priceSplit) {
                                 priceBandSplit[priceBandSplit.length] = priceSplit;
                         });
                      }
                  }
                 filters.push(oneFilter);
                }
              });
             if('PRICE BAND' !== filterSetName){
                 nFilters++;
                 facet_nav[filterSetName] = filters;
                 filterLoaded = filterSetName;
                 filterSetTitles.push(filterSetName);
             } else {
                 price["min"] = Math.min.apply(Math, priceBandSplit);
                 price["max"] = Math.max.apply(Math, priceBandSplit);
                 facet_nav["Price"] = price;
                 facet_nav["Price_Band"] = price_band;
                 filterLoaded = "Price_Band";
             }

             /**
              *  Get previous state of facetNav for this set of filters, if this type of filter 
              *  is already in the selected filters list.
              *  
              */ 
            var thisTypeOfFilterAlreadySelected = $.grep(facetNavigationDisplay.selectedFilters,function(filter) {return filter.filterType === val.value;}).length > 0;
         	if(filterChain.length>0 && thisTypeOfFilterAlreadySelected) {
                facetLSKey = self.pageid.category || self.pageid.search; 
                if(self.pageid.brand){
                   facetLSKey = self.pageid.brand; 
                }
                /**
                 * Get the previous state for this filter type
                 */
                // Clone selected filters list
                var selectedFiltersCopy = [];
                if( facetNavigationDisplay.selectedFilters.length>0) {
               	 var poppedItem = facetNavigationDisplay.selectedFilters[facetNavigationDisplay.selectedFilters.length-1];
               	 var i = -1;
               	 $.each(facetNavigationDisplay.selectedFilters,function(indx,filter) {
               		 if(filter.filterType === poppedItem.filterType) {
               			 i = indx;
               			 return false;
               		 }
               	 });
               	 
               	 if(i !== -1) {
               		 selectedFiltersCopy =  facetNavigationDisplay.selectedFilters.slice(0,i);
               	 }
                }
                
                var keySuffix = (selectedFiltersCopy.length>0)?JSON.stringify(selectedFiltersCopy):'';
                var previousState = DMStorage.getValue('facet_nav_' +facetLSKey+keySuffix);
                facet_nav[filterLoaded] = previousState[filterLoaded]; 
             }
             return false;
           }
                                                 
          });
                 
        counter++;
    }
       }

        }
        if(typeof data.facetView != "undefined"){
        $.each(data.facetView, function(indx, val) {
	    	if (val.name == constant.Grocery.Filters.ParentCatalogGroup) {
	            $.each(val.entry, function(iter, entry) {
	                var catgroupItem = {
	                    title : entry.label,
	                    value : entry.value
	                };
	                catgroup.push(catgroupItem);
	            });
	            //facet_nav["Category"] = catgroup;
	            facet_nav["isCategory"]=false;
	            filterLoaded = "Category";
	        }
        });
        }
        
        facet_nav["pageType"] = this.pageType;

        var parentCatalogGroup;
        if(typeof data.catalogEntryView != "undefined"){
        $.each(data.catalogEntryView, function(index, catalogEntry) { 
        	parentCatalogGroup = Array.isArray(catalogEntry.parentCatalogGroupID)?catalogEntry.parentCatalogGroupID[0]:catalogEntry.parentCatalogGroupID;
        	facet_nav["parentCatalogGroup"]=parentCatalogGroup;
        	if(catgroup.length != 0){
        		$.each(catgroup, function(index, catgroupItem) {
           		 if(catgroupItem.value == catalogEntry.parentCatalogGroupID){
           			 if(categoryNames.indexOf(catgroupItem.title)==-1){
           				 var categoryFilterItem =  {
           						 title : catgroupItem.title,
           						 value : catgroupItem.value
           				 };
           				 categoryFilter.push(categoryFilterItem);
           				 categoryNames.push(catgroupItem.title);
           			 }
           		 }
           	 });
        	}
		 });   
        }
        var parentLevelTwoCat;	
        if(categoryFilter.length == 0){
        	var categoryHierarchy;
        	if(DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId)!= null && typeof DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId)!= "undfined"){
        		categoryHierarchy= DMStorage.getValue('categoryHierarchy_' +storeId);
        		if(typeof categoryHierarchy.catalogGroupView != 'undefined'){
        			$.each(categoryHierarchy.catalogGroupView, function(index, catalogGroupItem) { 
        				if(typeof catalogGroupItem.catalogGroupView != 'undefined'){
        					$.each(catalogGroupItem.catalogGroupView, function(index, levelTwoCatalogGroupItem) { 
        						if(typeof levelTwoCatalogGroupItem.catalogGroupView!= 'undefined'){
        							$.each(levelTwoCatalogGroupItem.catalogGroupView, function(index, levelThreeCatalogGroupItem) {
                        				if(levelThreeCatalogGroupItem.uniqueID == parentCatalogGroup){
                        					parentLevelTwoCat=levelThreeCatalogGroupItem.parentCatalogGroupID;
                        				}
                        			});
        						}                    			
                    		});
        				}
                	});
                	$.each(categoryHierarchy.catalogGroupView, function(index, catalogGroupItem) {
                		if(typeof catalogGroupItem.catalogGroupView != 'undefined'){
                			$.each(catalogGroupItem.catalogGroupView, function(index, levelTwoCatalogGroupItem) { 
                    			if(levelTwoCatalogGroupItem.uniqueID == parentLevelTwoCat){
                    				if(typeof levelTwoCatalogGroupItem.catalogGroupView != 'undefined'){
                    					$.each(levelTwoCatalogGroupItem.catalogGroupView, function(index, levelThreeCatalogGroupItem) { 
                        					var categoryFilterItem = {
                        				 	title : levelThreeCatalogGroupItem.name,
                        				 	value : levelThreeCatalogGroupItem.uniqueID
                        					};
                        				 	categoryFilter.push(categoryFilterItem);
                        				 	categoryNames.push(levelThreeCatalogGroupItem.name);
                            			});
                    				}
                    			}
                    		});
                		}                		
                	});
                	facet_nav["isCategory"]=true;
        		}        		
        	}
        }
        
        $('.js-filter-price-range').ionRangeSlider({
			type: 'double',
			min: 0,
			max: 10000,
			from: 0,
			to: 10000,
			prefix: '<i class="icon-rupees"></i>',
			prettify_enabled: true,
			prettify_separator: ',',
			force_edges: true
		});
        
        
        this.facetLSKey = this.pageid.category || this.pageid.search; 
        if(this.pageid.brand){
			this.facetLSKey = this.pageid.brand; 
		}
        this.facetLSKey += (filterChain.length>0)?JSON.stringify(filterChain):'';
        if((!DMStorage.invalid('facet_nav_' + ProductHelper.facetLSKey )) && (this.pageNumber > 1)){
        	 var oldFacets = DMStorage.getValue('facet_nav_' + ProductHelper.facetLSKey);
        	 var oldCategoryFacets = oldFacets.category;
        	 $.each(oldCategoryFacets, function(index, facetItem) { 
        		 if(categoryNames.indexOf(facetItem.title)==-1){
        			 categoryFilter.push(facetItem);
        		 }
        	 });
        }
        facet_nav["category"] = categoryFilter; 
        if(filterSetTitles.length == 0){
   		 	this.hasNoFacets =true;
   	 	}else{
   	 		this.hasNoFacets =false;
   	 	}
        
        DMStorage.set('facet_nav_' + this.facetLSKey, facet_nav);
        DMStorage.set('filter_titles_'+this.facetLSKey,filterSetTitles);
        this.facetNavLoaded = true;
        if(CachedHeader.topNavLoaded){
        	$(document).trigger('dmart.facet.loaded');
        }
        if((this.pageNumber == 1)){
        	this.loadBreadCrumbSubCat();
        }
    },
    fetchIndividualItemDetails:function(arr) {
    	if (window.location.protocol === "https:") {
      	  this.urlPrefix = WCParamJS.searchSecureHostNamePath + '/search/resources/store/';
      	 }
      	 if (arr.length > 0) {
      	  var idString = 'id=' + arr.join('&id=');
      	 }
      	var ajaxCallParams = {
                url: WCParamJS.searchURLPrefix[window.location.protocol] + '/search/resources/store/' + WCParamJS.storeId + '/productview/byIds?' + idString + '&profileName=X_findProductByIds_Details_DMART',
                method: 'GET',
                context: this,
                cache : false,
                async: false
            };
      //For Storepreview
		if(parent.dmartPreviewToken) {
			ajaxCallParams.xhrFields = {
		        withCredentials: true
		    };
			ajaxCallParams.headers = { 
				WCPreviewToken: parent.dmartPreviewToken
			};
		}
		
		$.ajax(ajaxCallParams).done(

                function(data) {

                    // For each catalog entry 
                    $.each(data.catalogEntryView, function(itemIdx,
                        itemDetail) {
                        var items = [];
                        DMStorage.set(
                                'item_' + itemDetail.uniqueID,
                                itemDetail);
                    });
                });
		
    },
    fetchIndividualPriceAndInvDetails: function(arr) {
    	 if (window.location.protocol === "https:") {
    	  this.urlPrefix = WCParamJS.searchSecureHostNamePath + '/search/resources/store/';
    	 }
    	 if (arr.length > 0) {
    	  var idString = 'id=' + arr.join('&id=');
    	  var ajaxCallParams = {
    	   url: this.urlPrefix + WCParamJS.storeId + '/productview/byIds?' + idString + '&profileName=X_findProductPrices_DMART',
    	   method: 'GET',
    	   context: this,
    	   cache: false,
    	   async: false
    	  };

    	  $.ajax(ajaxCallParams).done(function(data) {
    	   var currStoreId = WCParamJS.storeId;
    	   $.each(data.DocumentList, function(itmIndx, itemDetails) {
    	    var price = {};
    	    var offerpriceString = "price_SALE_" + currStoreId;
    	    var sellingpriceString = "price_MRP_" + currStoreId;
    	    price.offerPrice = itemDetails[offerpriceString];
    	    price.sellingPrice = itemDetails[sellingpriceString];
    	    if (itemDetails["inv_status_" + currStoreId] && itemDetails["inv_status_" + currStoreId] == 0) {
    	     price.inventoryStatus = false;
    	    }
    	    /*else if(itemDetails["inv_status_"+storeId]>0){
    	    	price.inventoryStatus = true;
    	    }*/
    	    else {
    	     price.inventoryStatus = true;
    	    }

    	    DMStorage.set('item_PriceInv_' + currStoreId + itemDetails.catentry_id, price);
    	   });
    	  });
    	 }
    	},
    /**
     * Fetch items and attributes for the products.
     * 
     * Fetch inventory and price for items
     * 
     */
    fetchPriceAndInvDetails: function(arr,callBack,callBackParams) {
    	if(window.location.protocol === "https:"){
    		this.urlPrefix=  WCParamJS.searchSecureHostNamePath+ '/search/resources/store/';
    	}
        var len = arr.length,
            i = 0,
            inputArr = [];
        var currStoreId = WCParamJS.storeId;
        if(typeof DMartShoppingListActionsJS.listStoreID != 'undefined' && DMartShoppingListActionsJS.listStoreID!=currStoreId && DMartShoppingListActionsJS.listStoreID!=null){
        	currStoreId=DMartShoppingListActionsJS.listStoreID;
        }
        // Get all item with price and inv not available in localStorage
        $.each(arr, function(indx, itemId) {
            if (DMStorage.invalid('item_PriceInv_' + currStoreId + itemId)) {
                inputArr.push(itemId);
            }
        });
        // Go for SOLR call only if there are items not in localStorage ( or expired items)
        if (inputArr.length > 0) {
            var idString = 'id=' + inputArr.join('&id=');
            var ajaxCallParams = {
                    url: this.urlPrefix + currStoreId + '/productview/byIds?' + idString + '&profileName=X_findProductPrices_DMART',
                    method: 'GET',
                    context: this,
                    cache : false
                };

            //For Storepreview
			if(parent.dmartPreviewToken) {
				ajaxCallParams.xhrFields = {
			        withCredentials: true
			    };
				ajaxCallParams.headers = { 
						WCPreviewToken: parent.dmartPreviewToken
				};
			}
            
            $.ajax(ajaxCallParams).done(function(data) {
                var currStoreId = WCParamJS.storeId;
                if(typeof DMartShoppingListActionsJS.listStoreID != 'undefined' && DMartShoppingListActionsJS.listStoreID!= currStoreId && DMartShoppingListActionsJS.listStoreID!=null){
        		currStoreId=DMartShoppingListActionsJS.listStoreID;
        		}
                $.each(data.DocumentList, function(itmIndx, itemDetails) {                
                    var price = {};
                    var offerpriceString="price_SALE_"+currStoreId;
                    var sellingpriceString="price_MRP_"+currStoreId;
                    price.offerPrice = itemDetails[offerpriceString];
                    price.sellingPrice = itemDetails[sellingpriceString];
                    if(itemDetails["inv_status_"+currStoreId] && itemDetails["inv_status_"+currStoreId]==0){
                    	price.inventoryStatus = false;
                    }
                    /*else if(itemDetails["inv_status_"+storeId]>0){
                    	price.inventoryStatus = true;
                    }*/else{
                    	price.inventoryStatus = true;
                    }
                    	
                    DMStorage.set('item_PriceInv_' + currStoreId + itemDetails.catentry_id, price);
                });   
                if(callBack) {
                	callBack.apply(this,callBackParams);
                	return;
                }
                
                $(document).trigger('dmart.products.loaded', this.pageNumber);
                if(!this.isNoResults){
                	if(!this.hasNoFacets){
                		$('.filter-module').css('display', 'block');
                	}else{
                		$('.filter-module').css('display', 'none');
                	} 
                    $('.breadcrumbs').css('display', 'block');
                    $('#pricediscountsort').css('display', 'block');
                }                
            });
        } else {
            if(callBack) {
            	callBack.apply(this,callBackParams);
            	return;
            }
            $(document).trigger('dmart.products.loaded', this.pageNumber);
            if(!this.isNoResults){
            	if(!this.hasNoFacets){
            		$('.filter-module').css('display', 'block');
            	}else{
            		$('.filter-module').css('display', 'none');
            	} 
                $('.breadcrumbs').css('display', 'block');
                $('#pricediscountsort').css('display', 'block');
            }
        }
    },
    /**
     * Fetch items and attributes for the products.
     * 
     * Fetch inventory and price for items
     * 
     */
    fetchProductDetails: function(arr,callBack,callBackParams) {

        var len = arr.length,
            i = 0,
            inputArr = [];
        inputPriceArr = [];
        this.inputNoCachePriceArray = [];
        var self = this;
        // Get all products not available in localStorage
        $.each(arr, function(indx, productId) {
            if (DMStorage.invalid('proditems_' + WCParamJS.storeId + productId)) {
                inputArr.push(productId);
            }else{
            	var itemsObj = DMStorage.getValue('proditems_' + WCParamJS.storeId + productId);
        		$.each(itemsObj,function(ind,itm){
        			inputPriceArr.concat(itm);
        			self.inputNoCachePriceArray.push(itm);
        		});
            }
        });
        // Go for SOLR call only if there are items not in localStorage ( or expired items)
        if (inputArr.length > 0) {

            var idString = 'id=' + inputArr.join('&id=');
            
            var ajaxCallParams = {
                    url: WCParamJS.searchURLPrefix[window.location.protocol] + '/search/resources/store/' + WCParamJS.storeId + '/productview/byIds?' + idString + '&profileName=X_findProductByIds_Details_DMART',
                    method: 'GET',
                    context: this,
                    cache : false
                };
            //For Storepreview
			if(parent.dmartPreviewToken) {
				ajaxCallParams.xhrFields = {
			        withCredentials: true
			    };
				ajaxCallParams.headers = { 
					WCPreviewToken: parent.dmartPreviewToken
				};
			}
            
            $.ajax(ajaxCallParams).done(

                function(data) {

                    // For each catalog entry 
                    $.each(data.catalogEntryView, function(prodIndx,
                        productDetails) {
                        var items = [];
                        var productBean = DMStorage.getValue('prod_' + productDetails.uniqueID);

                        // For each item under the product
                       if(typeof productDetails.sKUs != 'undefined'){
                        $.each(productDetails.sKUs,
                            function(skuIndx, item) {
                                if (DMStorage.invalid('item_' + item.uniqueID)) {
                                    DMStorage.set(
                                        'item_' + item.uniqueID,
                                        item);
                                }
                                items.push(item.uniqueID);
                                inputPriceArr.push(item.uniqueID);
                            });
							DMStorage.set('proditems_' + WCParamJS.storeId + productDetails.uniqueID, items);
                    }else{
                    	console.log("issue"+productDetails.uniqueID);
                    }
                        
                        // Remove duplicate field
                        productDetails.sKUs = undefined;
                        
                        var productBean = DMStorage.getValue('prod_' + productDetails.uniqueID);
                        
                        if(productBean === null) {
                              productBean = {};
                              productBean.attribs = productDetails;
                              DMStorage.set('prod_' + productDetails.uniqueID,productBean);
                              
                        }else if(typeof productBean.seo_token_ntk == 'undefined' && productDetails.seo_token_ntk != 'undefined'){
                        	productBean.seo_token_ntk = productDetails.seo_token_ntk;
                        	DMStorage.set('prod_' + productDetails.uniqueID,productBean);
                        }
                        /*
                         * fire price and inventory calls here		
                         */
                    });

                    // Signal AJAX response has been parsed
                    // and products are ready (move this to success call of
                    // price and inventory )
                    // should be done only after price load
					if(inputPriceArr.length ==0 && this.inputNoCachePriceArray.length > 0){
						inputPriceArr = this.inputNoCachePriceArray;
					}
                    this.fetchPriceAndInvDetails(inputPriceArr,callBack,callBackParams);
                    // $(document).trigger('dmart.products.loaded',this.pageNumber);
                });
        } else {
            // Products are already available in localStorage
            //$(document).trigger('dmart.products.loaded',this.pageNumber);
            this.fetchPriceAndInvDetails(this.inputNoCachePriceArray.length > 0?this.inputNoCachePriceArray:inputPriceArr,callBack,callBackParams);
            //$(document).trigger('dmart.category.facet.loaded','facet_'+this.pidstr);
        }
    },
    
    /**
     * Display no results page
     * 
     */
    loadNoResultsPage : function() {
    	var self = this;
    	nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
            autoescape: true,
            web: {
                useCache: true
            }
        });
    	$('#apparellisting').removeClass('row');
		$('#apparellisting').html(nunjucks.render('no-result.nunjucks'));
		self.fetchNoResultsUpsell();
		$('#apparellisting').ready(function(){
			$('#contShop').attr('href',WCParamJS.homepageURL);
        });	
		$('.filter-module').css('display', 'none');
		$('#pricediscountsort').css('display', 'none');
		$('.breadcrumbs').css('display', 'none');
		
    },
    
    fetchNoResultsRecommendations : function (upSellProducts){
    	var ajaxCallParams = {
    			url: window.location.protocol + '//' + window.location.hostname + '/wcs/resources/store/' + WCParamJS.storeId + '/espot/' + 'DMartNoResultsRecommendations',
    			method: 'GET',
    			context: this
    		};
    	//For Storepreview
		if(parent.dmartPreviewToken) {
			ajaxCallParams.xhrFields = {
		        withCredentials: true
		    };
			ajaxCallParams.headers = { 
				WCPreviewToken: parent.dmartPreviewToken
			};
		}
    	$.ajax(ajaxCallParams).done(function(data) {
			if(data.MarketingSpotData && data.MarketingSpotData[0].baseMarketingSpotActivityData) {
				var productId, recommendedProducts = [];
				$.each(data.MarketingSpotData[0].baseMarketingSpotActivityData,function(upSellIndex, baseMarketingSpotActivityDataObj){
					productId=baseMarketingSpotActivityDataObj.productId;
					recommendedProducts.push(productId);
				});
				$(document).trigger('dmart.noResultsRecommendation.products',[upSellProducts,recommendedProducts]);	
			}else{
				if(typeof upSellProducts != "undefined" && upSellProducts != "" && upSellProducts != null){
					$(document).trigger('dmart.noResultsRecommendation.products',[upSellProducts]);	
				}else{
					$(document).trigger('dmart.noResultsRecommendation.products');	
				}
			}

		}).fail(function(){

		});
    },
    
    fetchNoResultsUpsell:  function (recommendedProducts){
    	if(enableUpsell==1){
    		var ajaxCallParams = {
        			url: window.location.protocol + '//' + window.location.hostname + '/wcs/resources/store/' + WCParamJS.storeId + '/espot/' + 'DMartNoResultsUpsell',
        			method: 'GET',
        			context: this
        		};
        	//For Storepreview
    		if(parent.dmartPreviewToken) {
    			ajaxCallParams.xhrFields = {
    		        withCredentials: true
    		    };
    			ajaxCallParams.headers = { 
    				WCPreviewToken: parent.dmartPreviewToken
    			};
    		}
    		
    		$.ajax(ajaxCallParams).done(function(data) {
    			if(data.MarketingSpotData && data.MarketingSpotData[0].baseMarketingSpotActivityData) {
    				var productId, upSellProducts = [];
    				$.each(data.MarketingSpotData[0].baseMarketingSpotActivityData,function(upSellIndex, baseMarketingSpotActivityDataObj){
    					productId=baseMarketingSpotActivityDataObj.productId;
    					upSellProducts.push(productId);
    				});
    				$(document).trigger('dmart.noResultsUpsell.products',[upSellProducts]);	
    			}else{
    				if(enableProdRecomm==1){
    					$(document).trigger('dmart.noResultsUpsell.products');	
    				}
    			}
    					
    		}).fail(function(){

    		});
    	}else if(enableProdRecomm==1){
    		$(document).trigger('dmart.noResultsUpsell.products');	
    	}    	
    },
    
    loadBreadCrumbSubCat : function (){
    	var categoryHierarchy;
    	this.breadcrumbsLoaded = true;
    	if(DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId)!= null && typeof DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId)!= "undfined"){
    		categoryHierarchy= DMStorage.getValue('categoryHierarchy_' +storeId);
    	}
    	if(CachedHeader.topNavLoaded){
         	$(document).trigger('dmart.plp.breadcrumbs.loaded');
         }
    },
    
    loadBreadCrumbsDropdown : function (){
    	var topCat = $('.breadcrumb-menu__navigation--category-dropdown').attr('data-topCat');
    	var categoryHierarchy, levelOneCategoryInfo = {}, levelTwoCategoryInfo = {}, levelThreeCategoryInfo = {}, 
    	levelTwoCount = {}, levelThreeCategoryId = {}, levelTwoCategoryId = [], levelOneCategoryId = [], JSONData = {};
    	if(DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId)!= null && typeof DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId)!= "undfined"){
    		categoryHierarchy= DMStorage.getValue('categoryHierarchy_' +storeId);
    		if(typeof categoryHierarchy.catalogGroupView != 'undefined'){
    			$.each(categoryHierarchy.catalogGroupView, function(index, catGroupItem) { 
            		if(catGroupItem.name == topCat){
            			if(typeof catGroupItem.catalogGroupView != 'undefined'){
            				$.each(catGroupItem.catalogGroupView, function(index, levelTwoCatGroupItem) { 
            					var levelTwoCatItem =  new Object();
            					levelTwoCategoryInfo[levelTwoCatGroupItem.uniqueID]= {};
            					levelTwoCatItem.title= levelTwoCatGroupItem.name;
            					levelTwoCatItem.value= levelTwoCatGroupItem.uniqueID;
            				 	levelTwoCategoryInfo[levelTwoCatGroupItem.uniqueID]= levelTwoCatItem;
            				 	if(typeof levelTwoCatGroupItem.seo_token_ntk != "undefined" && levelTwoCatGroupItem.seo_token_ntk != null){
            				 		levelTwoCategoryInfo[levelTwoCatGroupItem.uniqueID].seourl = levelTwoCatGroupItem.seo_token_ntk;
            				 	}
            				 	levelTwoCategoryId.push(levelTwoCatGroupItem.uniqueID);
            				 	var countVar='FacetCount'+levelTwoCatGroupItem.uniqueID;
            				 	levelTwoCount[levelTwoCatGroupItem.uniqueID]= catGroupItem[countVar];
            				 	levelThreeCategoryId[levelTwoCatGroupItem.uniqueID] = [];
            				 	if(typeof levelTwoCatGroupItem.catalogGroupView != 'undefined'){
            				 		$.each(levelTwoCatGroupItem.catalogGroupView, function(index, levelThreeCatGroupItem) { 
                				 		var levelThreeCatItem =  new Object();
                				 		levelThreeCategoryInfo[levelThreeCatGroupItem.uniqueID] = {};
                				 		levelThreeCatItem.title= levelThreeCatGroupItem.name;
                				 		levelThreeCatItem.value= levelThreeCatGroupItem.uniqueID;
                    				 	levelThreeCategoryInfo[levelThreeCatGroupItem.uniqueID]= levelThreeCatItem;
                    				 	levelThreeCategoryInfo[levelThreeCatGroupItem.uniqueID].seourl = levelThreeCatGroupItem.seo_token_ntk;
                    				 	levelThreeCategoryId[levelTwoCatGroupItem.uniqueID].push(levelThreeCatGroupItem.uniqueID);
                					});
            				 	}
            				});
            			}
            			
            			var levelOneCatItem =  new Object();
            			levelOneCategoryInfo[catGroupItem.uniqueID]= {};
    					levelOneCatItem.title= catGroupItem.name;
    					levelOneCatItem.value= catGroupItem.uniqueID;
    					levelOneCategoryInfo[catGroupItem.uniqueID]= levelOneCatItem;
    				 	if(typeof catGroupItem.seo_token_ntk != "undefined" && catGroupItem.seo_token_ntk != null){
    				 		levelOneCategoryInfo[catGroupItem.uniqueID].seourl = catGroupItem.seo_token_ntk;
    				 	}
    				 	levelOneCategoryId.push(catGroupItem.uniqueID);
            		}
            	});
    		}
        	
    	}
    	
    	JSONData.levelOneCategoryInfo = levelOneCategoryInfo;
    	 JSONData.levelTwoCategoryInfo = levelTwoCategoryInfo;
    	 JSONData.levelThreeCategoryInfo = levelThreeCategoryInfo;
    	 JSONData.levelTwoCount = levelTwoCount;
    	 JSONData.levelThreeCategoryId = levelThreeCategoryId;
    	 JSONData.levelTwoCategoryId = levelTwoCategoryId;
    	 JSONData.levelOneCategoryId = levelOneCategoryId;
    	 JSONData.catalogId = WCParamJS.catalogId;
    	 JSONData.storeId = WCParamJS.storeId;
    	 JSONData.urlHierarchy = WCParamJS.homepageURLHierarchy;
    	 
		 nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
	            autoescape: true,
	            web: {
	                useCache: true
	            }
	        });
		 var htmlCode = nunjucks.render('_modules/breadcrumbs-category.nunjucks', {
	            data: JSONData
	        });
		$('.breadcrumb-menu__navigation--category-dropdown').html(htmlCode);
		if(typeof WCParamJS.handledManufacturer != "undefined" && WCParamJS.handledManufacturer != ""){
			if(window.location.href.split('?')[1].split('&manufacturer=')[1] != null &&  window.location.href.split('?')[1].split('&manufacturer=')[1] != ""){
				$.each($('.breadcrumbs li'), function(key, value) {
		            if($(value).html().indexOf("Brand") !== -1){
		            	$(value).html("Brand: "+decodeURIComponent(window.location.href.split('?')[1].split('&manufacturer=')[1].split('&')[0]));
		            }
		        });
			}			
		}
    }
};