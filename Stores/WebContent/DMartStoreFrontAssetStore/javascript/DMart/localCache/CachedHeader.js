var CachedHeader = {

		urlPrefix:  WCParamJS.searchHostNamePath+ '/search/resources/store/',	

		topNavLoaded: false,

		offerProducts : [],

		facetViewForOffers: {},

		catalogEntryViewForOffers: {},
		
		offerCount : 0,
		
		currentCategoryName : '',
		/**
		 * Populate top navigation on page load
		 */
		init: function (departmentURL,userType,storeId) {
			if(DMStorage.invalid('topnav_' +storeId)){
				$.ajax({
					url: departmentURL,					
					method: 'GET',
					context: this
				}).done(function(data){
					$('.main-menu .js-main-menu').html(data);
					CachedHeader.updateRWDTopCategories();
					DMStorage.set('topnav_' +storeId, data);
					if(userType == 'G'){
						$('#userlistitem').css('display','none');
					}
					$(document).trigger('dmart.topcat.loaded',userType);
				});
			}else{
				var htmlContent= DMStorage.getValue('topnav_' +storeId);
				$('.main-menu .js-main-menu').html(htmlContent);
				CachedHeader.updateRWDTopCategories();
				console.log("retrieve from local storage");
				if(userType == 'G'){
					$('#userlistitem').css('display','none');
				}
				$(document).trigger('dmart.topcat.loaded', userType);
			}
		},
		renderTopnavList : function(){
			if(DMStorage.invalid('UserLists') || !this.storageValidForListCookie()){
			var wishlistUrl = window.location.protocol+'//'+window.location.hostname+'/wcs/resources/store/'+WCParamJS.storeId+'/wishList/@self';
			if(previewToken){
				wishlistUrl = window.location.origin+'/wcs/previewresources/store/'+WCParamJS.storeId+'/wishList/@self';
			}
			$.ajax({
				url: wishlistUrl,
				method: 'GET',
				context: this,
				cache : false
			}).done(function (data) {
				//console.log("data"+data.recordSetTotal);
				var wishListResult=data;
				var wishListJSON = wishListResult.GiftList;

				DMStorage.set('UserLists', wishListJSON);
				var cookieObj = {};
				var protocol = window.location.protocol;
				var otherProtocol = (protocol === 'http:')? 'https:':'http:';
		    	cookieObj[protocol] = true;
		    	if(getCookie('ListFlag')){
		    	cookieObj[otherProtocol] = JSON.parse(getCookie('ListFlag'))[otherProtocol];
		    	}
		    	else{
		    		cookieObj[otherProtocol] =false;
		    	}
				document.cookie='ListFlag='+JSON.stringify(cookieObj)+'; expires=-1; path=/';
				this.renderTopnavListHtml(wishListJSON);
				

			}).error(function (data) {
				//console.log("data"+data.recordSetTotal);
				$('#userlistitem').css('display','none');
			});
			}
			else{
				var wishListJSON=DMStorage.getValue('UserLists');
				this.renderTopnavListHtml(wishListJSON);
			}
		},
		storageValidForListCookie : function(){
			var listFlagCookie = getCookie('ListFlag');
	    	var protocol = window.location.protocol;
	    	if(listFlagCookie) {
	    		return JSON.parse(listFlagCookie)[protocol];
	    	} 
	    	this.invalidateListStorage();
	    	return false;
		},
		invalidateListStorage : function(){
			var cookieObj = {};
			var protocol = window.location.protocol;
			var otherProtocol = (protocol === 'http:')? 'https:':'http:';
	    	cookieObj[protocol] = false;
	    	cookieObj[otherProtocol] = false;
			document.cookie='ListFlag='+JSON.stringify(cookieObj)+'; expires=-1; path=/';
			DMStorage.remove('UserLists');
		},
		renderTopnavListHtml : function(wishListJSON){
			var listCount=0;
			nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
				autoescape: true,
				web: {
					useCache: true
				}
			});
			$.each(wishListJSON, function(index, wishListItem) {
				if(wishListItem.accessSpecifier == 'Private'){
					listCount++;
				}
			});
			var config = {
		            baseUrl: WCParamJS.staticServerHost
		        };
			if(listCount >0){
				var htmlcode=nunjucks.render('_modules/nav-my-list.nunjucks', {listData:wishListJSON, config:config});	     
				$('#userlists').html(htmlcode);
				$('#userlistitem').css('display','block');
			}else{
				$('#userlistitem').css('display','none');
			}			
		},
		renderOffersInfo : function (){
			if(window.location.protocol === "https:"){
				this.urlPrefix=  WCParamJS.searchSecureHostNamePath+ '/search/resources/store/';
			}
			var ajaxCallParams = {
					url: this.urlPrefix + WCParamJS.storeId + '/productview/bySearchTerm/*?profileName=X_findOfferProductsBySearchTerm_DMART&facet=promotion_Store:('+assetStoreId+' '+WCParamJS.storeId+')',
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
			
			$.ajax(ajaxCallParams).done(function (data) {

				this.facetViewForOffers= data.facetView;
				this.catalogEntryViewForOffers= data.catalogEntryView;
				$(document).trigger('dmart.offers.loaded');

			}).error(function (data) {
				//console.log("data"+data.recordSetTotal);
				$('#offerslist').hide(); 
				$( ".main-menu__navigation--category-dropdown li:nth-last-child(2) a.js-category-parent").css('-webkit-box-shadow', '#6dad5c 0 2px 0');
				$( ".main-menu__navigation--category-dropdown li:nth-last-child(2) a.js-category-parent").css('box-shadow', '#6dad5c 0 2px 0');
				$( ".main-menu__navigation--category-dropdown li:nth-last-child(2) a.js-category-parent").css('border-bottom', '1px solid #6dad5c');
				$('#offersText').css('display','none');
			});
		},
		setTopNavInfoInLS: function (categoryHierarchy){
			if(DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId)== null || typeof DMStorage.getValue('categoryHierarchy_' +WCParamJS.storeId)== "undfined"){
				DMStorage.set('categoryHierarchy_' +storeId, categoryHierarchy);
			}
			if(typeof categoryHierarchy.recordSetTotal != "undefined" && categoryHierarchy.recordSetTotal>0){
				
			
			this.topNavLoaded=true;
			var categoryFilter = [];
			if((typeof ProductHelper.facetNavLoaded != "undefined" && ProductHelper.facetNavLoaded)){
				if(typeof ProductHelper.facetLSKey != "undefined"){
					var facetNav = DMStorage.getValue('facet_nav_' + ProductHelper.facetLSKey);	  
					if((!DMStorage.invalid('facet_nav_' + ProductHelper.facetLSKey))&&(typeof facetNav.category != "undefined" && facetNav.category != "" && facetNav.category != null)){
						$(document).trigger('dmart.facet.loaded');
					}else{
						var parentLevelTwoCat;	
						if(typeof categoryHierarchy.catalogGroupView != 'undefined'){
							$.each(categoryHierarchy.catalogGroupView, function(index, catalogGroupItem) {
								if(typeof catalogGroupItem.catalogGroupView != 'undefined'){
									$.each(catalogGroupItem.catalogGroupView, function(index, levelTwoCatalogGroupItem) {
										if(typeof levelTwoCatalogGroupItem.catalogGroupView != 'undefined'){
											$.each(levelTwoCatalogGroupItem.catalogGroupView, function(index, levelThreeCatalogGroupItem) {
												if(levelThreeCatalogGroupItem.uniqueID == facetNav.parentCatalogGroup){
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
													var categoryFilterItem =  new Object();
													categoryFilterItem.title= levelThreeCatalogGroupItem.name;
													categoryFilterItem.value= levelThreeCatalogGroupItem.uniqueID;
													categoryFilter.push(categoryFilterItem);
												});
											}
										}
									});
								}
								
							});
							facetNav["isCategory"]=true;
							facetNav["category"] = categoryFilter;   
							DMStorage.set('facet_nav_' + ProductHelper.facetLSKey, facetNav);
							$(document).trigger('dmart.facet.loaded');
						}
					}
				}
			}
			if((typeof ProductHelper.breadcrumbsLoaded != "undefined" && ProductHelper.breadcrumbsLoaded)){
				ProductHelper.loadBreadCrumbSubCat();
			}
			}else{
				nunjucks.configure(WCParamJS.staticServerHost+'templates/', {
		            autoescape: true,
		            web: {
		                useCache: true
		            }
		        });
				var containerDiv = null;
				if($('#error-msg-container').parents('.rowContainer') != null && $('#error-msg-container').parents('.rowContainer') != undefined 
						&& $('#error-msg-container').parents('.rowContainer').length >0){
					containerDiv = $('#error-msg-container').parents('.rowContainer');
				}else if($('#error-msg-container').parents('.container') != null && $('#error-msg-container').parents('.container') != undefined 
						&& $('#error-msg-container').parents('.container').length >0){
					containerDiv = $('#error-msg-container').parents('.container');
				}
		    	if(containerDiv != null){
		    		containerDiv.html(nunjucks.render('no-result.nunjucks'));
		    		containerDiv.ready(function(){
						$('#contShop').attr('href',WCParamJS.homepageURL);
			        });	
					$('.filter-module').css('display', 'none');
					$('#pricediscountsort').css('display', 'none');
					$('.breadcrumbs').css('display', 'none');
		    	}
			}
		},
		loadTopNavOffers: function (){

			var commonData={'storeId' : WCParamJS.storeId, 'catalogId' : WCParamJS.catalogId, 'langId' : WCParamJS.langId, 'imageURL' : WCParamJS.imageServerHost};
			if((typeof this.facetViewForOffers != "undefined" && this.facetViewForOffers != null)&&(typeof this.catalogEntryViewForOffers != "undefined" && this.catalogEntryViewForOffers != null)){
				var offerInfo = {}, offerLabels = [], self=this;
				$.each(this.catalogEntryViewForOffers, function(index, catalogEntry) {
					$.each(catalogEntry.parentCatalogGroupID, function(index1, currentParentCatalogGroupID) {
						self.currentCategoryName = '';
						self.getCategoryName(currentParentCatalogGroupID, DMStorage.getValue('categoryHierarchy_'+commonData.storeId));
						if(self.currentCategoryName != "undefined" && self.currentCategoryName != ''){
							if(offerLabels.indexOf(currentParentCatalogGroupID)==-1){
								offerLabels.push(currentParentCatalogGroupID);
								self.offerCount++;
							}
							if(offerInfo.hasOwnProperty(currentParentCatalogGroupID)){
								offerInfo[currentParentCatalogGroupID].productId.push(catalogEntry.uniqueID);
								offerInfo[currentParentCatalogGroupID].productCount++;
								offerInfo[currentParentCatalogGroupID].count++;
							}else{
							
								offerInfo[currentParentCatalogGroupID] = {};
								offerInfo[currentParentCatalogGroupID].identifier = currentParentCatalogGroupID;
								self.currentCategoryName = '';
								self.getCategoryName(currentParentCatalogGroupID, DMStorage.getValue('categoryHierarchy_'+commonData.storeId));
								offerInfo[currentParentCatalogGroupID].label = self.currentCategoryName;
								offerInfo[currentParentCatalogGroupID].count = 0;
								offerInfo[currentParentCatalogGroupID].URL = '/webapp/wcs/stores/servlet/CategoryDisplay?catalogId='+commonData.catalogId+'&categoryId='+currentParentCatalogGroupID+'&storeId='+commonData.storeId+'&offerCat=('+assetStoreId+' '+WCParamJS.storeId+')';
								offerInfo[currentParentCatalogGroupID].productId =[];
								offerInfo[currentParentCatalogGroupID].productCount= 0;
							
								offerInfo[currentParentCatalogGroupID].productId.push(catalogEntry.uniqueID);
								offerInfo[currentParentCatalogGroupID].productCount++;
								offerInfo[currentParentCatalogGroupID].count++;
							}
							$.each(catalogEntry.attributes, function(count, attr) {
								if (attr.name == "CATEGORY TEMPLATE TYPE" || attr.name ==  "Category Template Type") {
									offerInfo[currentParentCatalogGroupID].type= attr.values[0].value.toLowerCase();
								}
							});
							return false;
						}
					});
				});
				nunjucks.configure(WCParamJS.staticServerHost+'templates/', {
					autoescape: true,
					web: {
						useCache: true
					}
				});
				var htmlcode=nunjucks.render('_modules/nav-sub-category-alt.nunjucks', {offerData:offerInfo, offerLabels:offerLabels, commonData:commonData});	     
				$('#offerCat').html(htmlcode); 
				$('#offerslist').css('display','block'); 
				$(document).trigger('dmart.topnav.offers.loaded');
			}else{
				$('#offerslist').css('display','none'); 
				$( ".main-menu__navigation--category-dropdown li:nth-last-child(2) a.js-category-parent").css('-webkit-box-shadow', '#6dad5c 0 2px 0');
				$( ".main-menu__navigation--category-dropdown li:nth-last-child(2) a.js-category-parent").css('box-shadow', '#6dad5c 0 2px 0');
				$( ".main-menu__navigation--category-dropdown li:nth-last-child(2) a.js-category-parent").css('border-bottom', '1px solid #6dad5c');
			}

		},
		getCategoryName: function (categoryId,cat) {
		
			var i;
			var categoryName;
			var self=this;
			if(typeof cat.catalogGroupView != "undefined" && cat.catalogGroupView != null){
				for(i=0;i<cat.catalogGroupView.length;i++){
					this.getCategoryName(categoryId,cat.catalogGroupView[i]);
					
				}
			}
			else if(cat.uniqueID == categoryId){
				self.currentCategoryName = cat.name;
				return(cat.name);
			}
		},
		loadOfferProducts : function (){

			if((typeof this.facetViewForOffers != "undefined" && this.facetViewForOffers != null)&&(typeof this.catalogEntryViewForOffers != "undefined" && this.catalogEntryViewForOffers != null)){
				var inputArray = [];
				$.each(this.catalogEntryViewForOffers, function(index, catalogEntry) { 
					if (DMStorage.invalid('prod_' + catalogEntry.uniqueID)) {
						var productBean = {};
						productBean.attribs = catalogEntry;
						DMStorage.set('prod_' + catalogEntry.uniqueID, productBean);
					}
					inputArray.push(catalogEntry.uniqueID);	
				});	    		 

				if(inputArray.length>0){
					this.offerProducts = inputArray;
					ProductHelper.fetchProductDetails(inputArray);
				}		    	
			}else{
				$('#offersText').css('display','none');
			}	    	
		},
		loadOffersSection : function (){   

			var commonData={'storeId' : WCParamJS.storeId, 'catalogId' : WCParamJS.catalogId, 'langId' : WCParamJS.langId, 'imageURL' : WCParamJS.imageServerHost};
			if((typeof this.facetViewForOffers != "undefined" && this.facetViewForOffers != null)&&(typeof this.catalogEntryViewForOffers != "undefined" && this.catalogEntryViewForOffers != null)){
				var offersInfo = {}, offersLabel = [], self = this;
				
				$.each(this.catalogEntryViewForOffers, function(index, catalogEntry) {
					$.each(catalogEntry.parentCatalogGroupID, function(index1, currentParentCatalogGroupID) {
						self.currentCategoryName = '';
						self.getCategoryName(currentParentCatalogGroupID, DMStorage.getValue('categoryHierarchy_'+commonData.storeId));
						if(self.currentCategoryName != "undefined" && self.currentCategoryName != ''){
							if(offersLabel.indexOf(currentParentCatalogGroupID)==-1){
								offersLabel.push(currentParentCatalogGroupID);
								self.offerCount++;
							}
							if(offersInfo.hasOwnProperty(currentParentCatalogGroupID)){
								offersInfo[currentParentCatalogGroupID].productId.push(catalogEntry.uniqueID);
								offersInfo[currentParentCatalogGroupID].productCount++;
								offersInfo[currentParentCatalogGroupID].count++;
							}else{
							
								offersInfo[currentParentCatalogGroupID] = {};
								offersInfo[currentParentCatalogGroupID].identifier = currentParentCatalogGroupID;
								
								self.getCategoryName(currentParentCatalogGroupID, DMStorage.getValue('categoryHierarchy_'+commonData.storeId));
								offersInfo[currentParentCatalogGroupID].label = self.currentCategoryName;
								offersInfo[currentParentCatalogGroupID].count = 0;
								offersInfo[currentParentCatalogGroupID].URL = '/webapp/wcs/stores/servlet/CategoryDisplay?catalogId='+commonData.catalogId+'&categoryId='+currentParentCatalogGroupID+'&storeId='+commonData.storeId+'&offerCat=('+assetStoreId+' '+WCParamJS.storeId+')';
								offersInfo[currentParentCatalogGroupID].productId =[];
								offersInfo[currentParentCatalogGroupID].productCount= 0;
							
								offersInfo[currentParentCatalogGroupID].productId.push(catalogEntry.uniqueID);
								offersInfo[currentParentCatalogGroupID].productCount++;
								offersInfo[currentParentCatalogGroupID].count++;
							}
							$.each(catalogEntry.attributes, function(count, attr) {
								if (attr.name == "CATEGORY TEMPLATE TYPE" || attr.name ==  "Category Template Type") {
									offersInfo[currentParentCatalogGroupID].type= attr.values[0].value.toLowerCase();
								}
							});
							return false;
						}
					});
				});
				
				var JSONdata = {};
				JSONdata.product = productListing.createJSON(this.offerProducts);
				this.config = {
						baseUrl: window.location.origin+'/webapp/wcs/stores/servlet/'
				};
				JSONdata.config = this.config;
				JSONdata.maxnumber = 5;
				JSONdata.categoryId = WCParamJS.catalogID;
				JSONdata.catalogId = WCParamJS.catalogId;
				JSONdata.storeId = WCParamJS.storeId;
				JSONdata.productIds = this.offerProducts;
				JSONdata.pageTitle=productListing.pageType;
				JSONdata.offerLabels= offersLabel;
				JSONdata.offerInfo= offersInfo;
		        JSONdata.assetStoreId = assetStoreId;
		        JSONdata.homePageURL=WCParamJS.homepageURLHierarchy;
		        JSONdata.noImagePath=WCParamJS.staticServerHost +'images/DMart/NoImage_M.jpg';
		        JSONdata.topOffersTitle = WCParamJS.topOffersTitle;
				nunjucks.configure(WCParamJS.staticServerHost+'templates/', {
					autoescape: true,
					web: {
						useCache: true
					}
				});				

				var htmlcode=nunjucks.render('_modules/top-category-offers.nunjucks', {
					data: JSONdata
				});
				$('#topCategoryOffers').html(htmlcode);
				renderRupeeSymbolInDropDown();
				$('#topCategoryOffers').ready(function(){
					$.each($('.landing-tabs--quaternary .js-landing-carousel'), function(key, value) {
						$(value).flexslider({
							selector: '.slides:first > li',
							animation: 'slide',
							easing: 'linear',
							animationLoop: false,
							slideshowSpeed: 3000,
							animationSpeed: 500,
							slideshow: false,
							controlNav: false,
							reverse: false,
							itemWidth: 218,
							itemMargin: 20,
							minItems: 1,
							maxItems: 4,
							move:1,
							touch: true,
							directionNav: true,
							prevText: '<i class="icon-caret-left"></i>',
							nextText: '<i class="icon-caret-right"></i>',
							//customDirectionNav: $('#landing-top-carousel-navigation-quaternary'+key-1+' a'),
							 start: function (index) {
						    	   $('.js-landing-carousel .flex-viewport').css('overflow', 'hidden');
						    	   if(index.count <= 4) {
						    		   if(!index.parents('.product-listing-details').length){
						    			   index.find('.flex-direction-nav').hide();
						    		   }						               
						             }
					    	      }	
						});
					});
					
				    $('.js-accordion-tabs-recommanded').easyResponsiveTabs({
				        type: 'default',
				        width: 'auto',
				        fit: true,
				        tabidentify: 'hor_1',
				        activate: function(event) {
				          $('.js-carousel, .js-landing-carousel, .product-listing__quantity-primary .slider-variant').resize();
				          $('.landing-carousel-navigation, .landing-top-carousel-navigation, .landing-top-carousel-navigation-secondary, .landing-top-carousel-navigation-tertiary').css('opacity', 0).delay(100).animate({
				            opacity: 1
				          }, 800);
				          $('.resp-tab-content-active .dashboard-notification--list').scrollTop(1).perfectScrollbar('update');
				        }
				      });

					// .magic-line navigation border movement
					/*$(function() {

						var $el, leftPos, newWidth, tabWidth,
						$mainNav = $('.resp-tabs-list');
						$mainNav.append('<span class="magic-line"></span>');
						tabWidth = $('.resp-tabs-list .resp-tab-active').outerWidth();
						$('.resp-tabs-list .magic-line').width(tabWidth);

						// Immediate li and a tags are taregeted
						$('.resp-tabs-list > li').hover(function() {
							$el = $(this);
							leftPos = $el.position().left;
							newWidth = $el.outerWidth();
							$(this).parent().find('.magic-line').show();
							$(this).parent().find('.magic-line').stop().animate({
								left: leftPos,
								'opacity': 1,
								width: newWidth
							}, 500);
						}, function() {
							$(this).parent().find('.magic-line').stop().animate({
								'opacity': 0
							}, 400);
						});
					});*/
				    
					$('.js-landing-carousel .flex-direction-nav').addClass('landing-top-carousel-navigation-quaternary');

					$('.product-listing__quantity--select-quantity').selectric();
					$('.product-listing__quantity--select-weight').selectric();
					$('#topCategoryOffers select').selectric('destroy');
					$('.product-listing_update_itemsize--select').selectric('destroy');
					$('.product-listing_update_quantity--select').selectric('destroy');
					$('#topCategoryOffers .md-custom-select').addClass('custom-dropdown');

					// for variant slider
					setTimeout(function(){
						$.each($('.product-listing-item .slider-variant'), function(idx, val) {
							$(val).flexslider({
							      animation: 'slide',
							      animationLoop: true,
							      itemWidth: 45,
							      itemMargin: 1,
							      slideshow: false,
							      controlNav: false,
							      keyboard: false,
							      reverse: false,
							      minItems: 1,
							      maxItems: 3,
							      touch: false,
							      useCSS: false,
							      prevText: '<i class="icon-caret-left"></i>',
							      nextText: '<i class="icon-caret-right"></i>',
							      move: 1,
							      start: function (index) {
							        if(index.count <= 3) {
							          index.find('.flex-direction-nav li a').addClass('disabled');
							          // index.parent('.slider-variant-wrap').width(index.count * index.itemW);
							          index.find('.flex-viewport').css('margin', '0');
							          index.find('.flex-viewport li:last-child').css('borderRight', 'none');
							          index.find('.flex-direction-nav').hide();
							          index.find('.slides li').addClass('three-variant');
							        }
							        else {
							          if($(window).width() <=1000) {
							            index.parent('.slider-variant-wrap').width(190);
							          }
							        }

							        if(index.count < 3) {
							          // adding '.two-variant' class when two variants available with defined width by css
							          index.find('.slides li').removeClass('three-variant').addClass('two-variant');
							        }
							        if(index.count < 2) {
							          // adding '.one-variant' class when single variants available with defined width by css
							          index.find('.slides li').removeClass('two-variant three-variant').addClass('one-variant');
							        }
							      }
							});
						});
					}, 2000);					
					
					if(self.offerCount > 3){
						$('#viewAllOffers').css('display','block');
					}
				});
				
				productListing.updateCardsForInTrolley();
				//if(JSONdata.pageTitle=="apparel"){
					productListing.checkInventoryForApparel(null,null);
				//}
					productListing.checkOOSDefaultVariant();	
			}else{
				$('#offersText').css('display','none');
			}
		},
		waitForOffersTrigger : function(){
			var self = this;
			$(document).on('dmart.topnav.offers.loaded', function(event) {
				self.loadOfferProducts();
				$(document).off('dmart.topnav.offers.loaded');
			});
		},
		loadMoreOffers : function(){
			for(var i=4; i<=this.offerCount; i++){
				var $parent = $('#offer_'+i);
				$parent.css('display','block');
				
				$parent.find('.landing-tabs--quaternary .js-landing-carousel').resize();

				$($parent.find('.landing-tabs--quaternary .js-landing-carousel')).flexslider({
					selector: '.slides:first > li',
					animation: 'slide',
					easing: 'linear',
					animationLoop: false,
					slideshowSpeed: 3000,
					animationSpeed: 500,
					slideshow: false,
					controlNav: false,
					reverse: false,
					itemWidth: 218,
					itemMargin: 20,
					minItems: 1,
					maxItems: 4,
					move:1,
					touch: true,
					directionNav: true,
					prevText: '<i class="icon-caret-left"></i>',
					nextText: '<i class="icon-caret-right"></i>',
					//customDirectionNav: $('#landing-top-carousel-navigation-quaternary'+key-1+' a'),
					 start: function (index) {
				    	   $('.js-landing-carousel .flex-viewport').css('overflow', 'hidden');
				    	   if(index.count <= 4) {
				    		   if(!index.parents('.product-listing-details').length){
				    			   index.find('.flex-direction-nav').hide();
				    		   }
				             }
			    	      }	
				});
				
				

				$parent.find('.js-landing-carousel .flex-direction-nav').addClass('landing-top-carousel-navigation-quaternary');
				
				setTimeout(function(){
					$.each($parent.find('.product-listing-item .slider-variant'), function(idx, val) {
						$(val).flexslider({
						      animation: 'slide',
						      animationLoop: true,
						      itemWidth: 45,
						      itemMargin: 1,
						      slideshow: false,
						      controlNav: false,
						      keyboard: false,
						      reverse: false,
						      minItems: 1,
						      maxItems: 3,
						      touch: false,
						      useCSS: false,
						      prevText: '<i class="icon-caret-left"></i>',
						      nextText: '<i class="icon-caret-right"></i>',
						      move: 1,
						      start: function (index) {
						        if(index.count <= 3) {
						          index.find('.flex-direction-nav li a').addClass('disabled');
						          // index.parent('.slider-variant-wrap').width(index.count * index.itemW);
						          index.find('.flex-viewport').css('margin', '0');
						          index.find('.flex-viewport li:last-child').css('borderRight', 'none');
						          index.find('.flex-direction-nav').hide();
						          index.find('.slides li').addClass('three-variant');
						        }
						        else {
						          if($(window).width() <=1000) {
						            index.parent('.slider-variant-wrap').width(190);
						          }
						        }
	
						        if(index.count < 3) {
						          // adding '.two-variant' class when two variants available with defined width by css
						          index.find('.slides li').removeClass('three-variant').addClass('two-variant');
						        }
						        if(index.count < 2) {
						          // adding '.one-variant' class when single variants available with defined width by css
						          index.find('.slides li').removeClass('two-variant three-variant').addClass('one-variant');
						        }
						      }
						});
					});
				}, 2000);
			
			
			}
		},
		updateRWDTopCategories : function() {
			// items in topcategories recommendation bar
			var $lis = $('.main-menu__navigation').children('li:not(.main-menu__navigation--category,.main-menu__pin-cart)').clone();
			$lis.addClass('js-category-item sub-menu-item');
			$('.top-selling-category-md ul').append($lis);
		},
		
		updateShopNowSection : function(){
			$('.sub-menu-img').parents('.contentRecommendationWidget').removeClass('contentRecommendationWidget');
			$('.sub-menu-img').parents('.left_espot').removeClass('left_espot');
		}
};
