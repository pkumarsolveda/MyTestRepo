// PLP PDP helper
var CLPProductHelper = {
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
        return filterStr + '&orderBy=' + (this.sort||'0')+priceFilterString+discountFilterString;
    },
    /**
     * Invoke if a filter is selected filtername is the filter group
     * 
     */
    selectFilter: function(filterName, filterValue) {
//        var filter = this.pageid.filters[filterName];
//
//        // If filtergroup is not present in list,
//        // add it
//        if (!filter) {
//            filter = this.pageid.filters[filterName] = [];
//        }
//
//        if (filter && filter.indexOf(filterValue) === -1) {
//            filter.push(filterValue);
//            filter.sort();
//            this.pidstr = JSON.stringify(this.pageid);
//            // Get products
//            this.getProducts();
//
//        }
    },
    /**
     * Remove filter to update pageId
     */
    removeFilter: function(filterName, filterValue) {
//        var filter = this.pageid.filters[filterName];
//
//        if (filter && filter.indexOf(filterValue) > -1) {
//
//            filter.splice(filter.indexOf(filterValue), 1);
//            // If filter list is empty, remove the filter
//            // for consistency , reduces key length
//            if (filter.length === 0) {
//                this.pageid.filters[filterName] = undefined;
//            } else {
//                // Sort non empty filter list
//                filter.sort();
//            }
//            this.pidstr = JSON.stringify(this.pageid);
//            this.getProducts();
//        }
    },

    /**
     * Returns catentries corresponding to the category and filters selected
     */
    getProducts: function() {
    	if(ClpHelper.pendingAjaxRequests != 0){
    		return;
    	}
    	//alert("CLPProductHelper.getProducts for products: "+ClpHelper.parentIds);
        var list = null;
        var constant=DMartAttributes.Constants;
        if (DMStorage.invalid(this.pidstr)) {
        	
        	// get Product details byproductId
        
        		var arr = ClpHelper.parentIds;
    			var idString = 'id=' + arr.join('&id=');
        		var ajaxCallParams = {
                    url: this.urlPrefix + WCParamJS.storeId + '/productview/byIds?' + idString + '&profileName=X_findProductByIds_Details_DMART',
                    method: 'GET',
                    context: this,
                    cache : false
                };
        		
        		
        		
        		
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
                    DMStorage.set(this.pidstr, values);
                  
                    this.fetchProductDetails(catentries);
                    this.data = data;
                             
                });
                list = DMStorage.getValue(this.pidstr);
        
        }
    },
    /**
     * Stores filters corresponding to the category selected in local storage
     */
    getFacetNavigationList: function(data) {
    	//alert("CLPProductHelper.getFacetNavigationList");
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
        if((!DMStorage.invalid('facet_nav_' + CLPProductHelper.facetLSKey )) && (this.pageNumber > 1)){
        	 var oldFacets = DMStorage.getValue('facet_nav_' + CLPProductHelper.facetLSKey);
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
        	
        	//$(document).trigger('dmart.facet.loaded');
        }
        if((this.pageNumber == 1)){
        	this.loadBreadCrumbSubCat();
        }
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
                    url: this.urlPrefix + WCParamJS.storeId + '/productview/byIds?' + idString + '&profileName=X_findProductPrices_DMART',
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
                //alert("triggering dmart.clpproducts.loaded ");
                $(document).trigger('dmart.clpproducts.loaded', this.pageNumber);
                if(!this.isNoResults){
                	
                    $('.breadcrumbs').css('display', 'block');
                    $('#pricediscountsort').css('display', 'block');
                }                
            });
        } else {
//            if(callBack) {
//            	callBack.apply(this,callBackParams);
//            	return;
//            }
//            alert("triggering dmart.clpproducts.loaded ");
//            $(document).trigger('dmart.clpproducts.loaded', this.pageNumber);
         
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
        var self = this;
        // Get all products not available in localStorage
        $.each(arr, function(indx, productId) {
            if (DMStorage.invalid('proditems_' + WCParamJS.storeId + productId)) {
                inputArr.push(productId);
            }else{
            	var itemsObj = DMStorage.getValue('proditems_' + WCParamJS.storeId + productId);
        		$.each(itemsObj,function(ind,itm){
        			inputPriceArr.concat(itm);
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
                    this.fetchPriceAndInvDetails(inputPriceArr,callBack,callBackParams);
                    // $(document).trigger('dmart.products.loaded',this.pageNumber);
                });
        } else {
            // Products are already available in localStorage
            //$(document).trigger('dmart.products.loaded',this.pageNumber);
            this.fetchPriceAndInvDetails(inputPriceArr,callBack,callBackParams);
            //$(document).trigger('dmart.category.facet.loaded','facet_'+this.pidstr);
        }
    },
    
    
    
   
    
   
    
    loadBreadCrumbSubCat : function (){
    	var categoryHierarchy;
    	this.breadcrumbsLoaded = true;
    	if(DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId)!= null && typeof DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId)!= "undfined"){
    		categoryHierarchy= DMStorage.getValue('categoryHierarchy_' +storeId);
    	}
    	if(CachedHeader.topNavLoaded){
         	$(document).trigger('dmart.clp.breadcrumbs.loaded');
         }
    },
    
    loadBreadCrumbsDropdown : function (){
    	
    	var topCat = $('.breadcrumb-menu__navigation--category-dropdown').attr('data-topCat');
    	var categoryHierarchy, levelTwoCategoryInfo = {}, levelThreeCategoryInfo = {}, 
    	levelTwoCount = {}, levelThreeCategoryId = {}, levelTwoCategoryId = [], JSONData = {};
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
            		}
            	});
    		}
        	
    	}
    	
    	 JSONData.levelTwoCategoryInfo = levelTwoCategoryInfo;
    	 JSONData.levelThreeCategoryInfo = levelThreeCategoryInfo;
    	 JSONData.levelTwoCount = levelTwoCount;
    	 JSONData.levelThreeCategoryId = levelThreeCategoryId;
    	 JSONData.levelTwoCategoryId = levelTwoCategoryId;
    	 JSONData.catalogId = WCParamJS.catalogId;
    	 JSONData.storeId = WCParamJS.storeId;
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
		
	
    }
};