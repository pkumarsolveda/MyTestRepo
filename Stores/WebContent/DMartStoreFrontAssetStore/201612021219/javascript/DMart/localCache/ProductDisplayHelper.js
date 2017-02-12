/**
 * Helper class for rendering products to 
 * product details page. 
 * 
 * Assumption: before invoking this, product attributes will be set in local storage. 
 * 				( for non HTML 5 browser pass the product JSON)
 * 
 *  
 *  Inputs : Key ( key for getting the product details from Local storage)
 *  	   : divId ( place holder to render the compiled HTML
 *  	   : prodJson ( for non HTML 5 browsers)
 *  			format Products [{attributes},[items{item attribute}]]
 * 
 */
var productDisplay = {

    urlPrefix: WCParamJS.searchHostNamePath+ '/search/resources/store/',
    urlPrefixWcs : window.location.protocol + '//' + window.location.hostname + '/wcs/resources/store/',
    pageid: {
        productId: '',
        storeId: '10151'
    },
    /**
     * String which will be the key for localDMStorage
     */
    pidstr: '',
    currentIndex : 0,
    totalThumbs : 0, 
    thumbnailHeight: 0,
    pageType : '',
    brandFacet : '',

    init: function(productId) {
    	if(window.location.protocol === "https:"){
    		this.urlPrefix=  WCParamJS.searchSecureHostNamePath+ '/search/resources/store/';
    	}
        if (typeof productId === 'string') {
            this.pageid = {
                productId: productId,
                storeId: WCParamJS.storeId
            };
        } else {
            this.pageid = productId;
        }
        this.pidstr = JSON.stringify(this.pageid);
        this.fetchProductDetails(); 
    },
    
    fetchProductDetails: function() {
           var self = this;
        // Go for SOLR call only if there are items not in localStorage ( or expired items)
        if (DMStorage.invalid('proditems_' + this.pageid.storeId + this.pageid.productId)) {
        	var ajaxCallParams = {
                    url: this.urlPrefix + this.pageid.storeId + '/productview/byId/' + this.pageid.productId + '?profileName=X_findProductByIds_Details_DMART',
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
                	if(data.recordSetTotal>0){
                		var itemids = [];
                        $.each(data.catalogEntryView, function(prodIndx,
                            productDetails) {
                            if (DMStorage.invalid('prod_' + productDetails.uniqueID)) {
                                var productBean = {};
                                productBean.attribs = productDetails;
                                DMStorage.set('prod_' + productDetails.uniqueID, productBean);
                            }
                            // var productBean = DMStorage.getValue('prod_' + productDetails.uniqueID);
                            var items = [];
                            //productDetails=data.catalogEntryView;
                            // For each item under the product
                            $.each(productDetails.sKUs,
                                function(skuIndx, item) {
                                    if (DMStorage.invalid('item_' + item.uniqueID)) {                                    
                                        DMStorage.set(
                                            'item_' + item.uniqueID,
                                            item);
                                    }
                                    items.push(item.uniqueID);
                                    itemids.push(item.uniqueID);
                                });

                            DMStorage.set('proditems_' + self.pageid.storeId + productDetails.uniqueID, items);
                            // Remove duplicate field
                            //productDetails.sKUs = undefined;
                            /*
                             * fire price and inventory calls here		
                             */
                        });
                        // Signal AJAX response has been parsed
                        // and products are ready (move this to success call of
                        // price and inventory )
                        /*if (DMStorage.invalid('brandFacet_'+data.catalogEntryView[0].parentCatalogGroupID)) {
                        	 this.getBrandInfo(data);
                        }*/
                        this.fetchPriceAndInvDetails(itemids);
                        //$(document).trigger('dmart.product.loaded');
                        $('.breadcrumbs').css('display', 'block');
                        ProductHelper.loadBreadCrumbSubCat();
                	}else{
                		nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
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
                    
                });
        } else {
            // Products are already available in localStorage
        	var inputPriceArr = DMStorage.getValue('proditems_' + this.pageid.storeId + this.pageid.productId);
        	this.fetchPriceAndInvDetails(inputPriceArr);
        	 $('.breadcrumbs').css('display', 'block');
        	ProductHelper.loadBreadCrumbSubCat();
        }
    },

    loadProducts: function() {

        var itemIds = DMStorage.getValue('proditems_' + this.pageid.storeId + this.pageid.productId);
        var self = this;
        var JSONdata = {};
        JSONdata.product = this.createJSON();
        var imgUrl = WCParamJS.imageServerHost;
        var config = {
            'baseUrl': window.location.origin+'/webapp/wcs/stores/servlet/',
            imagePath : WCParamJS.imageServerHost+'images/DMart/products/',
            noImagePath: WCParamJS.staticServerHost+'images/DMart/NoImage_T.jpg'
        };
        JSONdata.config = config;
        JSONdata.maxnumber = 5;
        JSONdata.storeId = WCParamJS.storeId;
        JSONdata.catalogId = WCParamJS.catalogId;
        JSONdata.pageTitle = this.pageType;
        // Fix for JIRA 7747
        var firstItem = $('.product-details .slider-variant .slides li:first-child').data('item');
        if(JSONdata.product.itemDetails[this.product.currentItem].outofstock){
        	$.each(productDisplay.product.itemDetails, function(index, item) {
            	   if(!item.outofstock){ 
            		   	productDisplay.product.currentItem = item.uniqueID; 
            		   	//$('.product-details--code').html('Product Code: '+productDisplay.product.itemDetails[item.uniqueID].partNumber);
            	   		return false;
            	   }
            	});
        	//$('#productDetails .product-details__btn-addtocart, #productDetails .product-details__btn-add-more').addClass('button--disabled');
        }
        nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
            autoescape: true,
            web: {
                useCache: true
            }
        });        
        $('#apparelimages').html(nunjucks.render('_modules/product-gallery.nunjucks', {
            data: JSONdata
        }));
        $('#productDetails').html(nunjucks.render('_modules/product-details.nunjucks', {
            data: JSONdata
        }));
        /*$('#productReviews').html(nunjucks.render('_modules/user-reviews.nunjucks', {
            data: JSONdata
        }));*/
        $('#productDetails').ready(function(){
        	self.formatPage();	
        });
        
        // this.formatPage();
        this.fetchDescription([this.pageid.productId].concat(itemIds));
        if(JSONdata.product.outOfStock){
        	$('#productDetails .product-details__btn-addtocart, #productDetails .product-details__btn-add-more').addClass('button--disabled');
        }
        if($.isEmptyObject(this.product.attributes.Size)) {
        	$('.product-details__option-primary--label').hide();
        	$('.product-details .slider-variant-wrap').hide();
        	$('.pdp-price-panel').css('margin-top','60px');
        	$('.product-details__btn').css('margin-top','60px');
        }else{
        	$('.pdp-price-panel').css('margin-top','0px');
        	$('.product-details__btn').css('margin-top','0px');
        }
        
		
		$.each($('.slider-variant .slides li'),function(){
        	if($(this).hasClass('disabled') && $(this).hasClass('active')){
        		$(this).removeClass('active');
        		$('#productDetails .product-details__addtolist a').addClass('disabled');
        	}
        });
        
    },
	padLeft : function(nr, n, str){
		return Array(n-String(nr).length+1).join(str||'0')+nr;
	},
    getImageURLs : function(items,relativeURL){
        var imageObj = {};
        var constants=DMartAttributes.Constants.Grocery.Descriptive;
       	$.each(items.attributes, function(index, attrib) {
       	    if (attrib.usage === 'Descriptive') {
       		if (attrib.identifier == constants.ImageDisplayCode) {
       		    imageObj['imageFlag'] = productDisplay.padLeft(parseInt(attrib.values[0].value).toString(2),16,"0");
       		}
       		if (attrib.identifier == constants.ImageDisplayKey) {
       		    imageObj['imageIdentifier'] = attrib.values[0].value;
       		}
       	    }
       	});
       	if (!imageObj['imageIdentifier']) {
       	    imageObj['imageIdentifier'] = items.partNumber;
       	}
       	var imageURLs = [];
       	if(imageObj.imageFlag){
       	$.each(imageObj.imageFlag.split(''), function(index, flag) {
       		if(flag == '1'){
       			var imageNameWithPath = imageObj.imageIdentifier.replace(/(\S)(\S)(\S)\S*/,'$1/$2/$3/'+imageObj.imageIdentifier);	
       		imageURLs.push(WCParamJS.imageServerHost+relativeURL+imageNameWithPath+ '_' + parseInt(index + 1) + '_T.jpg');}
       	});
       	}
    	return imageURLs;
    },
    createJSON: function() {

        this.product = {};
        var self = this;
        var constant=DMartAttributes.Constants;
        var productBean = self.product = {};
        
        productBean.productId = this.pageid.productId;
        productBean.itemIds = DMStorage.getValue('proditems_' + this.pageid.storeId + this.pageid.productId);
        productBean.outOfStock=true;
        var productDetails = DMStorage.getValue('prod_' + this.pageid.productId);
        var brandNameProd, type;
        productBean.partNumber = productDetails.attribs.partNumber;
        if(typeof productDetails != "undefined" && productDetails != null ){
        	brandNameProd= productDetails.attribs.manufacturer;
	        $.each(productDetails.attribs.attributes, function(count, attr) {
	            if (attr.name.toUpperCase() == constant.Grocery.Descriptive.CategoryType) {
	            	type= attr.values[0].value.toLowerCase();
	            }
	        });
        }
        
        if (type != "" && type != undefined){
        	self.pageType=type;
        }
        
        productBean.itemDetails = {};
        $.each(productBean.itemIds, function(i, itemId) {
            var thisItem = DMStorage.getValue('item_' + itemId);
            // thisItem.outofstock = !thisItem.buyable;
            if (thisItem.thumbnail) {
                thisItem.img_src = thisItem.thumbnail.replace("wcsstore/", "");
            } else {
                thisItem.img_src = 'DMartStoreFrontAssetStore/images/temp/pdp/pdp-grocery-big-1.jpg';
            }
            if (!thisItem.title) {
                if (thisItem.name) {
                    thisItem.title = thisItem.name;
                } else if (thisItem.shortDescription) {
                    thisItem.title = thisItem.shortDescription;
                } else {
                    thisItem.title = '';
                }
            }

            //thisItem.brand = self.getBrand(thisItem);
            if(typeof brandNameProd != "undefined"){
            	thisItem.brand=brandNameProd;
            }else{
            	thisItem.brand="";
            }
            
            /*if (thisItem.brand === '' || typeof thisItem.brand === 'undefined'){
            	if(brandNameProd != '' && typeof brandNameProd != 'undefined'){
            		thisItem.brand=brandNameProd;
            	}else{
            		thisItem.brand="";
            	}            	
            }*/
            //To redirect to brand page
           /* var brandFacetLSKey = productDetails.attribs.parentCatalogGroupID;
            thisItem.brandFacet= DMStorage.getValue('brandFacet_' +brandFacetLSKey);*/
            //To redirect to brand page
            // Bound to change
            var priceObj = {
                offerPrice: 0,
                sellingPrice: 0,
                savings: 0
            };
            

            var priceCache = DMStorage.getValue('item_PriceInv_' +WCParamJS.storeId + itemId);
            if (priceCache) {
                priceObj.offerPrice = parseFloat(priceCache.offerPrice).toFixed(2);
                priceObj.sellingPrice = parseFloat(priceCache.sellingPrice).toFixed(2);
                thisItem.outofstock = !priceCache.inventoryStatus;
            }
           
            
            priceObj.savings = 0.0;
            thisItem.priceExists=true;
            
            if (typeof priceObj.offerPrice == "undefined" || priceObj.offerPrice == 0 || priceObj.offerPrice ==null || isNaN(priceObj.offerPrice)){
            	priceObj.offerPrice = 0;
            	thisItem.priceExists=false;
            }
            if (typeof priceObj.sellingPrice == "undefined" || priceObj.sellingPrice == 0 || priceObj.sellingPrice ==null || isNaN(priceObj.sellingPrice)){
            	priceObj.sellingPrice = 0;
            	thisItem.priceExists=false;
            }
            if((typeof priceObj.offerPrice != "undefined" && priceObj.offerPrice != 0 && priceObj.offerPrice !=null)&&(Number(priceObj.offerPrice) < Number(priceObj.sellingPrice))){
            	priceObj.savings = +parseFloat(priceObj.sellingPrice - priceObj.offerPrice).toFixed(2);
            	thisItem.priceExists=true;
            }
            
            if(priceCache && priceCache.inventoryStatus){
            	productBean.outOfStock=false;
            }
            thisItem.price = priceObj;
            // TODO: CART MODULE : update this field for item
            thisItem.qtyInCart = 0;

            productBean.itemDetails[itemId] = thisItem;
            thisItem.definingAttributes = self.getItemDefiningAttributes(itemId);
            
            thisItem.maxOrderQty = self.getMaxOrderQty(thisItem);
            if(thisItem.maxOrderQty == 0){
            	thisItem.maxOrderQty=confMaxOrderQty+1;
            }
            
            thisItem.imageObjs = self.getImageURLs(thisItem,'images/DMart/products/');
            
            if(self.pageType === "grocery") {
            	thisItem.vegNonvegFlag = self.getVegNonvegIndicator(thisItem);
            }

        });
        var defaultItemId = productBean.currentItem = self.getDefaultItem(productBean.itemIds);
        if (typeof defaultItemId == 'undefined' || defaultItemId == null){
        	defaultItemId = productBean.currentItem = productBean.itemIds[0];
        }
        var defaultItem = productBean.itemDetails[defaultItemId];
        // May have to change this depending on SOLR response
        /*
         * Currently going through individual items and forming an attribute object.
         * (Data for displaying swatch and size slider)
         * 
         * Sample attributes object
         * ------------------------
         * {
         *    Size : ['1','2','3'],
         *    Color : ['Blue','Red','White'] 
         * }
         * 
         */
        productBean.attributes = self.getAttributesForProduct(productBean);

        productBean.currentAttributeCombo = defaultItem.definingAttributes;
        productBean.deliveryOnly = self.isHomeDeliveryOnly(defaultItem) ? "true": "false";
        productBean.codAvailable = self.isCODAvailable(defaultItem) ? "true": "false";
        productBean.freebieProduct = self.hasFreebieProduct(defaultItem);
        productBean.isBulkyProduct = self.isBulkyProduct(defaultItem) ? "true": "false";
        productBean.pageType= self.pageType; 
        // TODO: CART MODULE : update this field for product			
        productBean.totalQtyInCart = 0;
        productBean.totalPriceInCart = 0;
        productBean.totalSavingsInCart = 0;
        //productBean.imageObjs = self.getImageURLs(productBean.itemDetails,'DMartStoreFrontAssetStore/images/DMart/products/');
        productBean.selectedItem = [];
        productBean.selectedItem.push(defaultItemId);
        productBean.selectedColor = defaultItem.definingAttributes.Colour;
        productBean.selectedSize= defaultItem.definingAttributes.Size;
        productBean.currentItemInCart='';
		productBean.selectedQty=0;
		
		productBean.masterCategoryId = productDetails.attribs['catgroup_Identifier'] || '';
        self.product = productBean;
        return this.product;

    },
    getAttributesForProduct: function(productBean) {
        var items = productBean.itemDetails,
            itemid, attribs,
            attributeList = {},
            anAttribute, name, value, currentAttribute;
        // For each item of the product...
        for (itemid in items) {
            // For each defining attribute of the item ...
            for (name in items[itemid].definingAttributes) {

                value = items[itemid].definingAttributes[name];
                currentAttribute = attributeList[name];
                if (!currentAttribute) {
                    currentAttribute = [value];
                } else {
                    if (currentAttribute.indexOf(value) === -1) {
                        currentAttribute.push(value);
                    }
                }
                attributeList[name] = currentAttribute;
            }

        }

        return attributeList;

    },
    isHomeDeliveryOnly: function(defaultItem){
    	var homeDeliveryFlag = false;
    	$.each (defaultItem.attributes, function(index, attr) {
    		if(attr.identifier == DMartAttributes.Constants.Grocery.Descriptive.DeliveryFlag){
    			if(attr.values[0].value == "1"){
    				homeDeliveryFlag =  true;
    			}
    		}    		
    	});
    	return homeDeliveryFlag;
    },
    
    isCODAvailable: function(defaultItem){
    	var codAvailabilityFlag = true;
    	$.each (defaultItem.attributes, function(index, attr) {
    		if(attr.identifier == DMartAttributes.Constants.Grocery.Descriptive.CODFlag){
    			if(attr.values[0].value == "N"){
    				codAvailabilityFlag =  false;
    			}
    		}    		
    	});
    	return codAvailabilityFlag;
    },
    
    hasFreebieProduct : function(defaultItem){
    	var freebieProduct = "";
    	$.each (defaultItem.attributes, function(index, attr) {
    		if(attr.identifier == DMartAttributes.Constants.Grocery.Descriptive.FreebieProdDescription){
    			if(attr.values[0].value != ""){
    				freebieProduct =  attr.values[0].value;
    			}
    		}    		
    	});
    	return freebieProduct;
    },
    
    isBulkyProduct: function(defaultItem){
    	var bulkyProductFlag = false;
    	$.each (defaultItem.attributes, function(index, attr) {
    		if(attr.identifier == DMartAttributes.Constants.Grocery.Descriptive.BulkyFlag){
    			if(attr.values[0].value == "Y"){
    				bulkyProductFlag =  true;
    			}
    		}    		
    	});
    	return bulkyProductFlag;
    },
    /**
     * Create a better item-level defining attributes object from the SOLR data
     * Parse array to find Defining attributes and return the combination.
     * 
     * 
     */
    getItemDefiningAttributes: function(itemid) {
        var currentItemAttributes = this.product.itemDetails[itemid].attributes;
        var attribCombo = {};
        /*var sizeAttributeConstants=DMartAttributes.Constants.SizeAttributeConstants;
        var colourAttributeConstants=DMartAttributes.Constants.Apparel.Defining.Colour;*/
        $.each(currentItemAttributes, function(index, attrib) {
            if (attrib.usage === 'Defining') {
            	var attribName = attrib.name;
            	if(attrib.identifier.toUpperCase().indexOf('COLOUR') === 0) {
            		attribName = 'Colour';
            	} else {
            		// Check if atleast one attribute begins with ['Size','Weight','Volume' etc]
            		/*var list = $.grep(sizeAttributeConstants,function(str){
            			return attrib.identifier.indexOf(str) === 0;
            		});
            		if(list.length>0) {*/
            			 attribName = 'Size';
            		//}
            		
            	}
                attribCombo[attribName] = attrib.values[0].value;

            }
        });
        return attribCombo;
    },
    formatPage: function() {        
        $('.product-details .slider-variant .slides').find('.active').removeClass('active');
    	$('.product-details .slider-variant .slides').find('[data-item="'+productDisplay.product.currentItem+'"]').addClass('active');  
    	if(productDisplay.product.itemDetails[productDisplay.product.currentItem].outofstock){
        	$('#productDetails .product-details__btn-addtocart, #productDetails .product-details__btn-add-more').addClass('button--disabled');
        }
    	if($('.product-details__offer--btn').length == 0){
    		$('.brand-wrapper').css('min-height','60px');
		}else{
			$('.brand-wrapper').css('min-height','80px');
		}
        if(DMStorage.getValue('OrderId') != null && DMStorage.getValue('OrderId').orderItems != null){
        	productDisplay.product.totalQtyInCart = 0;
        	productDisplay.product.totalPriceInCart = 0;
        	productDisplay.product.totalSavingsInCart= 0;
            $.each(DMStorage.getValue('OrderId').orderItems, function(indx, orItm) {

            	if(productDisplay.product.itemDetails[orItm.catentryId] != null &&
            			productDisplay.product.itemDetails[orItm.catentryId] != undefined){

                	if(orItm.freeGift == "true"){
                    	if(productDisplay.product.itemDetails[orItm.catentryId].orderItemId == 0){
                    		productDisplay.product.itemDetails[orItm.catentryId].orderItemId = orItm.orderItemId;
                    	}
                    	productDisplay.product.itemDetails[orItm.catentryId].freeGiftQty = parseInt(orItm.quantity);
                    }else{
                    	$('.slider-variant-wrap').find('[data-item="'+orItm.catentryId+'"] .product-unit .product-unit-count').html(orItm.quantity);
                    	$('.slider-variant-wrap').find('[data-item="'+orItm.catentryId+'"]').addClass('enableChangeQty addedToCart');
                    	$('.slider-variant-wrap').find('[data-item="'+orItm.catentryId+'"] .product-unit').show();
                    	productDisplay.product.itemDetails[orItm.catentryId].qtyInCart = orItm.quantity;
                    	productDisplay.product.itemDetails[orItm.catentryId].orderItemId = orItm.orderItemId;
                    }
                	//productDisplay.product.itemDetails[orItm.catentryId].orderItemId = Math.floor(orItm.orderItemId);
                	productDisplay.product.totalQtyInCart = parseInt(productDisplay.product.totalQtyInCart) + parseInt(orItm.freeGift == "true"? 0 : orItm.quantity);                	
                	//productDisplay.product.totalPriceInCart += parseFloat(productDisplay.product.itemDetails[orItm.catentryId].price.offerPrice) * parseInt(orItm.quantity);
					productDisplay.product.totalPriceInCart = parseFloat(productDisplay.product.totalPriceInCart) +  parseFloat(orItm.price);
                	//productDisplay.product.totalSavingsInCart += parseFloat(productDisplay.product.itemDetails[orItm.catentryId].price.savings) * parseInt(orItm.quantity);
					productDisplay.product.totalSavingsInCart = parseFloat(productDisplay.product.totalSavingsInCart) + parseFloat(orItm.savings);
					if(typeof productDisplay.product.totalPriceInCart == "number"){
						productDisplay.product.totalPriceInCart = productDisplay.product.totalPriceInCart.toFixed(2);
					}if(typeof productDisplay.product.totalSavingsInCart == "number"){
						productDisplay.product.totalSavingsInCart =productDisplay.product.totalSavingsInCart.toFixed(2);
					}
            	}
            });              
            
            if($('.product-details .slider-variant .slides li:first-child').hasClass('addedToCart')){            	
            	
            	var itemId = $('.product-details .slider-variant .slides li:first-child').data('item');
            	var qnty = productDisplay.product.itemDetails[itemId].qtyInCart;
            	$('.product-details__btn-quantity select').prop('selectedIndex', qnty).selectric('refresh');
            	$('.product-details__btn-quantity').css('display', 'block');
            	//$('.product-details__btn-viewcart').css('display', 'block');
            	$('.product-details__btn-addtocart, .product-details__btn-add-more').css('display', 'none');
            } 
            
            if(productDisplay.product.totalQtyInCart > 0){
            	$('.quick-product-cart .quick-product-cart--count').text(productDisplay.product.totalQtyInCart);
            	$('.quick-product-cart').css('display', 'block');
            	$('.quick-product-delivery, .quick-product-not-cod, .quick-product-available').hide();
            	//$('.pdp-price-total').fadeIn();
            	//$('.pdp-price-panel__price-mrp, .pdp-price-panel__primary').hide();
				//$('.product-listing__save').hide();
				//Price Fix
				if(productDisplay.product.itemDetails[productDisplay.product.currentItem].qtyInCart > 0){
					updateTotalPriceAndSavingsPDP(productDisplay.product.totalSavingsInCart,productDisplay.product.totalPriceInCart);
					$('.pdp-price-total').css('display', 'block');
					$('.pdp-price-panel__price-mrp, .pdp-price-panel__primary').hide();
					$('.product-listing__save').hide();
					$('.product-details__btn-quantity select').prop('selectedIndex', productDisplay.product.itemDetails[productDisplay.product.currentItem].qtyInCart).selectric('refresh');
					$('.product-details__btn-quantity select').selectric('refresh');
					$('.product-details__btn-quantity').css('display', 'block');
					//$('.product-details__btn-viewcart').css('display', 'block');
	            	$('.product-details__btn-addtocart').css('display', 'none');
	            	$('.product-details__btn-add-more').css('display', 'none');
				}else{
					$('.pdp-price-total').css('display', 'none');
					if($('.pdp-price-panel__price-mrp span').hasClass('no-strike-diagonal')){
						$('.pdp-price-panel .pdp-price-panel__price-mrp .no-strike-diagonal').html('<i class="icon-rupees"></i>' + productDisplay.product.itemDetails[this.product.currentItem].price.sellingPrice);			            
			        }else if($('.pdp-price-panel__price-mrp span').hasClass('strike-diagonal')){
			        	$('.pdp-price-panel .pdp-price-panel__price-mrp .strike-diagonal').html('<i class="icon-rupees"></i>' + productDisplay.product.itemDetails[this.product.currentItem].price.sellingPrice);
			        }
					//$('.pdp-price-panel .pdp-price-panel__price-mrp .strike-diagonal').html('<i class="icon-rupees"></i>' + productDisplay.product.itemDetails[this.product.currentItem].price.sellingPrice);
			        $('.pdp-price-panel .pdp-price-panel__primary .pdp-price-panel__primary--price-dmart').html('<i class="icon-rupees"></i>' + productDisplay.product.itemDetails[this.product.currentItem].price.offerPrice);
			        if(productDisplay.product.itemDetails[productDisplay.product.currentItem].price.savings > 0){
			        	$('.product-listing__save .product-listing__save--price').html('<i class="icon-rupees"></i>' + productDisplay.product.itemDetails[this.product.currentItem].price.savings);
				        $('.product-listing__save').show();
			        }else{
			        	$('.product-listing__save').hide();
			        }
			        $('.pdp-price-total').hide();
					$('.pdp-price-panel__price-mrp, .pdp-price-panel__primary').css('display', 'block');
					$('.pdp-price-total').css('display', 'none');
					$('.product-details__btn-quantity').css('display', 'none');
					//$('.product-details__btn-viewcart').css('display', 'none');
	            	$('.product-details__btn-addtocart').css('display', 'none');
	            	$('.product-details__btn-add-more').css('display', 'block');
				}
				//Price Fix
            }            
        }     
        
        //for image thumbnails
        this.totalThumbs = $('.product-gallery__thumbnails .slides li').length;
        this.thumbnailHeight = 70;
        $('.product-gallery__thumbnails .slides li:first-child a').addClass('current').addClass('active');
        $('.product-gallery__thumbnails-prev a').bind('click',function(e) {productDisplay.prevThumb();});
        $('.product-gallery__thumbnails-next a').bind('click',function(e) {productDisplay.nextThumb();});
        $('.product-gallery__thumbnails .slides li a').bind('click',function(e) {productDisplay.changeProductImage(e);});
        
        if(this.totalThumbs <= 3){
        	$('.product-gallery__thumbnails .product-gallery__thumbnails-next').css('visibility', 'hidden');
        }
 	    
        $('.easyzoom').easyZoom();
        $('.product-details__btn-quantity select').selectric();
        $(document).trigger('dmart.pdp.quantity.perfectscroll');
    },
    prevThumb: function()  {
        var prevThumbPos = $('.product-gallery__thumbnails .slides li .current').parent().prev().length;
        if (prevThumbPos === 0) {
          $('.page-carousel .carousel-thumbs-prev').css('visibility', 'hidden');
        }
        return prevThumbPos ? (this.currentIndex--) + this.changeThumb(this.currentIndex) : false;
      },

     nextThumb: function()  {
        var nextThumbPos = $('.product-gallery__thumbnails .slides li .current').parent().next().length;
        if (this.currentIndex < (this.totalThumbs - 3)) {
          return nextThumbPos ? (this.currentIndex++) + this.changeThumb(this.currentIndex) : false;
        }
      },

      changeProductImage: function(event)  {
       var imagePosition = event.currentTarget.attributes.getNamedItem('rel').nodeValue;
       //var imageURL = $(event.currentTarget.childNodes).attr('src').replace('_T.jpg','_M.jpg');
       $('.product-gallery__thumbnails .slides a, .product-gallery__viewport .slides li').removeClass('active');
        $('.product-gallery__thumbnails .slides #js-thumb-' + imagePosition).toggleClass('active');
        //$('.easyzoom--overlay.is-ready').find('.img-responsive').attr('src',imageURL);
        $('.product-gallery__viewport .slides li').hide();
        $('#js-product-img-'+imagePosition).show();
        DMAnalytics.events( DMAnalytics.Constants.Action.PDPImage, DMAnalytics.Constants.Action.PDPImage , document.title, 0,null );
      },
      changeThumb: function(index) {
    	  var self=this;
    	    if (index === 0) {
    	      $('.product-gallery__thumbnails .slides li a').removeClass('current');
    	      $('.product-gallery__thumbnails .slides #js-thumb-' + index).addClass('current');
    	      $('.product-gallery__thumbnails .product-gallery__thumbnails-prev').css('visibility', 'hidden');
    	    }
    	    else if (index === (this.totalThumbs - 5)) {
    	      $('.product-gallery__thumbnails .product-gallery__thumbnails-prev').css('visibility', 'visible');
    	      $('.product-gallery__thumbnails .product-gallery__thumbnails-next').css('visibility', 'hidden');
    	    }
    	    else {
    	      $('.product-gallery__thumbnails .slides li a').removeClass('current');
    	      $('.product-gallery__thumbnails .slides #js-thumb-' + index).addClass('current');
    	      $('.product-gallery__thumbnails .product-gallery__thumbnails-prev, .product-gallery__thumbnails .product-gallery__thumbnails-next').css('visibility', 'visible');
    	    }
    	    index++;
    	    $('.product-gallery__thumbnails .slides li a').removeClass('current');
    	    $('.product-gallery__thumbnails .slides #js-thumb-' + index).addClass('current');
    	    index--;
    	    $('.product-gallery__thumbnails .slides').animate({
    	      top: '-' + index * this.thumbnailHeight + 'px'
    	    }, 500);
    	    setTimeout(function(){
    	    	if(self.totalThumbs > 3){
                	$('.product-gallery__thumbnails .product-gallery__thumbnails-next').css('visibility', 'visible');
                }
			}, 1000);    	    
    	  },
    /**
     * Fetch description, specification,cautions terms and conditions
     * 
     * 
     */
    fetchDescription: function(arr) {

        var prodDescBean = this.prodDescBean = {};
        var self = this;
        var idString = 'id='+arr.join('&id=');
        var ajaxCallParams = {
                url: this.urlPrefix + this.pageid.storeId + '/productview/byIds?' + idString + '&profileName=X_findProductInfo_DMART',
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
                var itemids = [];
                
                $.each(data.catalogEntryView, function(prodIndx,
                    productDetails) {
                	
                	  prodDescBean = {};
                	  // If begins with '||'
                	  if(/^\|\|/.test($.trim(productDetails.longDescription))) {
    		           /*
    		            *  1.Remove leading and trailing ||
    		            *  2.Split lines by '||' and join them using  '<br>'
    		            *  3.Finally remove all '|' and replace by ':'
    		            */
    	            	prodDescBean.longDescription = $.trim(productDetails.longDescription).replace(/^\|\||\|\|$/g,'').split('||').join('<br>').replace(/\|/g,':');
                	  } else {
            		   // Otherwise just display
            	       prodDescBean.longDescription = productDetails.longDescription || '';
                	  }
                	
                    
                    var attributes = productDetails.attributes;
                    var specification = "";
                    $.each(attributes, function(attrIndx,
                        attr) {
                        if (attr.usage != "Defining") {
                            $.each(attr.values, function(attValIndx,
                                attrVal) {
                                
                                if(attr.identifier == DMartAttributes.Constants.Grocery.Descriptive.NutritionFacts){
                                	prodDescBean.nutritionFacts = attrVal.value;
                                } else if(attr.identifier == DMartAttributes.Constants.Grocery.Descriptive.Cautions){
                                	prodDescBean.cautions = attrVal.value;
                                } else if(attr.identifier == DMartAttributes.Constants.Grocery.Descriptive.Tnc){
                                	prodDescBean.tnc = attrVal.value;
                                } else {
                                    //specification = specification + "\n" + attr.name + ":" + attrVal.value;
                                }
                            });
                            
                        }
                    });
                    prodDescBean.specification = specification;
                    self.prodDescBean[productDetails.uniqueID] = prodDescBean;
                });
                
                self.displayProductInfo(this.product.currentItem);
                //$(document).trigger('dmart.productdescinfo.loaded');
            });
    },
    displayProductInfo: function(itemId) {
    	/* Duplicate code */
/*    	var input = self.prodDescBean;
    	self.prodDescBean.nutritionFacts = "";
    	if(typeof this.defaultItem != 'undefined'){
    		 var thisItem = DMStorage.getValue('item_' + this.defaultItem);
    		 $.each(thisItem.attributes, function(key, value) {
    			 if(value.usage == "Descriptive" && value.name == DMartAttributes.Constants.Grocery.Descriptive.NutritionFacts && productDisplay.product.pageType == "grocery" && value.values[0].value!=0){
    				 self.prodDescBean.nutritionFacts  = value.values[0].value.trim();
    			 }
    		 });
    		 if(typeof  thisItem.longDescription != 'undefined'){
    			 self.prodDescBean.longDescription = thisItem.longDescription.replace(/^\|\||\|\|$/g,'').split('||').join('<br>').replace(/\|/g,':');
    		 }
    	}*/
    	
    	var input = this.prodDescBean[itemId];
    	var defaultInput = this.prodDescBean[this.pageid.productId]
    	input.longDescription = input.longDescription || defaultInput.longDescription;
    	input.nutritionFacts = input.nutritionFacts || defaultInput.nutritionFacts || '';
    	
    	input.serviceCenter = '';
    	var serviceCenter =  (productDisplay.product.pageType == "general_merchandise") ? this.getServiceCenter() : "";
    	if(serviceCenter != ""){
    		input.serviceCenter = 'true';
    	}
    	
        nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
            autoescape: true,
            web: {
                useCache: true
            }
        });   
    	
        $('#productInformation').html(nunjucks.render('_modules/tabs.nunjucks', {
            data: input
        }));
        if(productDisplay.product.pageType == 'general_merchandise' && serviceCenter != ""){
        	$('#PDP-ServiceCenter-Data').html(serviceCenter);
        }else if (productDisplay.product.pageType == "grocery"){
        	$('#PDP-Nutrition-Data').append(input.nutritionFacts);
        }        
        $('#productInformation .js-accordion-tabs').easyResponsiveTabs({
        	type: 'default',
            width: 'auto',
            fit: true,
            tabidentify: 'hor_1'
        });
        // Allow horizontal/ veritcal swipe for service center data in small screen devices
        $('#PDP-ServiceCenter-Data').perfectScrollbar({
            swipePropagation: true
        });
        // For all other tabs, suppress horizontal scroll.
        $('.product-info-accordion-tabs .resp-tab-content').not('[id=PDP-ServiceCenter-Data]').perfectScrollbar({
            suppressScrollX: true,
            swipePropagation: true
        });

        $('.product-info-accordion-tabs').css('height', 'auto');
    },
    /**
     * function to get service center as eSpot.
     * 
     * Fetch inventory and price for items
     * 
     */
    getServiceCenter: function(){
    	var brand = $('.product-details--brand-name').text();
    	var htmlResp = "";
    	if(brand != ""){
    		var emsName = "SERVICECENTER-"+this.product.masterCategoryId+"-"+brand;
    		var ajaxCallParams = {
			    url: this.urlPrefixWcs + this.pageid.storeId + '/espot/' + emsName,
			    method: 'GET',
			    async: false,
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
				var marketingSpotData = data.MarketingSpotData;
				if(marketingSpotData != null){
					$.each(marketingSpotData, function(index, marketingSpotDetails) {
						if(marketingSpotDetails.baseMarketingSpotActivityData != null){
							$.each(marketingSpotDetails.baseMarketingSpotActivityData,function(merchIndex, baseMarketingSpotActivityDataObj){
								htmlResp = baseMarketingSpotActivityDataObj.marketingContentDescription[0].marketingText;
					    	});
							
						}
				    });
				}
			});
    	}
    return htmlResp;
    },
    /**
     * Fetch items and attributes for the products.
     * 
     * Fetch inventory and price for items
     * 
     */
    fetchPriceAndInvDetails: function(arr) {

        var len = arr.length,
            i = 0,
            inputArr = [];
        var currStoreId = this.pageid.storeId;
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
                    url: this.urlPrefix + this.pageid.storeId + '/productview/byIds?' + idString + '&profileName=X_findProductPrices_DMART',
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
                var currStoreId = this.pageid.storeId;
                $.each(data.DocumentList, function(itmIndx, itemDetails) {                
                    var price = {};
                    var offerpriceString="price_SALE_"+currStoreId;
                    var sellingpriceString="price_MRP_"+currStoreId;
                    price.offerPrice = itemDetails[offerpriceString];
                    price.sellingPrice = itemDetails[sellingpriceString];
                    if(itemDetails["inv_status_"+storeId] && itemDetails["inv_status_"+storeId]==0){
                    	price.inventoryStatus = false;
                    }
                    else
                    	price.inventoryStatus = true;
                    DMStorage.set('item_PriceInv_' + currStoreId + itemDetails.catentry_id, price);
                });                
                $(document).trigger('dmart.product.loaded');
            });
        } else {
        	 $(document).trigger('dmart.product.loaded');
        }
    },
    
    
    getBrand : function(thisItem) {
  	  var  brandName = '';
  	var constant=DMartAttributes.Constants.Grocery.Filters;
  	  $.each(thisItem.attributes, function() {
  		  if(this.identifier === constant.Brand || this.identifier === 'Brand' ||
  				this.identifier.indexOf('FILTER1_BRAND_') == 0 ) {
  			  brandName = this.values[0].value;
  			  return ;
  		  }
  	  });
  	  
  	  return brandName;
    },
	
    resolveSKU: function(productId, attribCombo) {
        var name, value, itemid, itmAttrValue, thisItem;
        var itemsList = this.product.itemDetails;
        // Clone itemId list since JS is pass by reference
        var itemIdsSelected = this.product.itemIds.slice();


        // For each item of the product...
        for (itemid in itemsList) {
            // For each defining attribute of the item ...
            thisItem = itemsList[itemid];
            for (name in thisItem.definingAttributes) {
                // Attribute value for this item
                itmAttrValue = thisItem.definingAttributes[name];

                // If the current attribute does not match, remove that item from list
                if (attribCombo[name] !== itmAttrValue && itemIdsSelected.indexOf(itemid)!=-1) {
                    itemIdsSelected.splice(itemIdsSelected.indexOf(itemid), 1);
                }
            }
        }
        // Set selected item as resolved SKU
        // Only one item should remain
        if (itemIdsSelected.length === 1) {
            return itemIdsSelected[0];
        }
        return null;
    },
    getDefaultItem : function (itemIds){
  	  var thisProduct = this.product;
  	  var defaultItemId;
  	  $.each(itemIds, function(i, itemId) {
  	      var currentItemAttributes = thisProduct.itemDetails[itemId].attributes;	      
  	      $.each(currentItemAttributes, function(index, attrib) {
  	            if (attrib.name === 'DEFAULT VARIANT (Y/N)' && attrib.values[0].value == 'Y') {
  	            	defaultItemId=itemId;
  	            }
  	        });
  	  });
  	  this.defaultItem = defaultItemId;
  	  return defaultItemId;
    },
    formatSliderVariant: function(){
		var $slider = $('.product-details--apparel .slider-variant');
    	var clone = $slider.find('.slides li:last-child').clone();
    	$slider.find('.slides li:last-child').remove();
    	$('.product-details--apparel .slider-variant').data('flexslider').addSlide(clone);
    	$slider.find('.flex-direction-nav').show();
    	var count = $slider.find('.slides li').length;
    	if($(window).width() > 769) {
 	          if(count <= 5) {
 	            $('.product-details--apparel .slider-variant-wrap').width(count * 82);
 	            $slider.find('.flex-viewport').css('margin', '0');
 	            $slider.find('.flex-viewport li:last-child').css('borderRight', 'none');
 	            $slider.find('.flex-direction-nav').hide();
 	          }
 	    }
 	    else {
 	      if(count <= 3) {
 	           $('.product-details--apparel .slider-variant-wrap').width(count * 82);
 	           $slider.find('.flex-viewport').css('margin', '0');
 	           $slider.find('.flex-viewport li:last-child').css('borderRight', 'none');
 	           $slider.find('.flex-direction-nav').hide();
 	      }
 	    }
    	    	
    },
    
    getBrandInfo : function(data){   
    	var constant=DMartAttributes.Constants.Grocery.Filters;
    	$.each(data.facetView, function(indx, val) {
    		 if (val.name == constant.Brand || val.name == 'Brand') {
    			 $.each(val.entry, function(iter, entry) {
    				 if (entry.count > 0) {
    					 DMStorage.set('brandFacet_'+data.catalogEntryView[0].parentCatalogGroupID, val.value);
    				 }
    			 });
    		 }
    	});
    },
    
    getMaxOrderQty: function (thisItem){
  	  var maxOrderQty=0;
  	  $.each(thisItem.attributes, function(index, attrib) {
  	   	    if (attrib.name === 'ITEMWISE') {
  	   	    	maxOrderQty= attrib.values[0].value;
  	   	    }
  	   	});
  	  if(maxOrderQty != 0){
  		maxOrderQty++;
  	  }  	  
  	  return maxOrderQty;
    },
    
    getVegNonvegIndicator : function(thisItem) {
  	  var indicator =0;
  	  $.each(thisItem.attributes, function(index, attrib) {
  	   	    if (attrib.name === DMartAttributes.Constants.Grocery.Descriptive.VegNonVegIndicator) {
  	   	    	indicator= attrib.values[0].value;
  	   	    }
  	   	});
  	  return indicator;
    }
    
};
$(document).ready(function() {
	$(document).off('dmart.pdp.variant').on('dmart.pdp.variant', function(event, self) {
	        var primaryContainer = $(self).parents('.product-details--apparel');
	        var productId = $(self).parents('.product-details--apparel').data('productid');
	        var color = $(primaryContainer).find('.plp-apparel__color-pallette .selected').data('color');
	        var attrValue =  $(primaryContainer).find('.slider-variant .slides .active a').attr('title');
	        var noImagePathThumb= WCParamJS.staticServerHost+'images/DMart/NoImage_T.jpg';
        	var noImagePathMain= WCParamJS.staticServerHost+'images/DMart/NoImage_M.jpg';
	        // TODO: color to be obtained using selected swatch data

	        var thisProduct = productDisplay.product;
	        var thisItemId;
	        if(color != undefined && color != null && attrValue != undefined && attrValue != null ){
	        	 thisItemId = productDisplay.resolveSKU(productId, {
	                 Colour: color,
	                 Size: attrValue
	             });
	        }
	       
	        if (typeof thisItemId != 'undefined' && thisItemId != null){
	        	productDisplay.product.currentItem = thisItemId;
		        productDisplay.product.currentAttributeCombo = {
		            Colour: color,
		            Size: attrValue
		        };

		        // Using plain jQuery to set the resolved items
		        // May have to change this and replace with nunjucks
		        var selectedItem = thisProduct.itemDetails[thisItemId];		        
		        thisProduct.selectedItem=[];
		        thisProduct.selectedItem.push(thisItemId);
		        $(primaryContainer).find('.product-details--title #item_title').text(selectedItem.title);
		        $(primaryContainer).find('.product-details--brand-name').text(selectedItem.brand);
		        
		        //$(primaryContainer).find('.product-listing--image').attr('src', WCParamJS.imageServerHost + selectedItem.img_src);
		        if($(primaryContainer).find('.pdp-price-panel .pdp-price-panel__price-mrp span').hasClass('no-strike-diagonal')){
		        	$(primaryContainer).find('.pdp-price-panel .pdp-price-panel__price-mrp span.no-strike-diagonal').html('<i class="icon-rupees"></i>' + selectedItem.price.sellingPrice);			            
		        }else if($(primaryContainer).find('.pdp-price-panel .pdp-price-panel__price-mrp span').hasClass('strike-diagonal')){
		        	$(primaryContainer).find('.pdp-price-panel .pdp-price-panel__price-mrp span.strike-diagonal').html('<i class="icon-rupees"></i>' + selectedItem.price.sellingPrice);
		        }
		        //$(primaryContainer).find('.pdp-price-panel .pdp-price-panel__price-mrp .strike-diagonal').html('<i class="icon-rupees"></i>' + selectedItem.price.sellingPrice);
		        $(primaryContainer).find('.pdp-price-panel .pdp-price-panel__primary .pdp-price-panel__primary--price-dmart').html('<i class="icon-rupees"></i>' + selectedItem.price.offerPrice);
		        if(selectedItem.price.savings > 0){
		        $(primaryContainer).find('.product-listing__save .product-listing__save--price').html('<i class="icon-rupees"></i>' + selectedItem.price.savings);
			        if(selectedItem.qtyInCart == 0){
			        	$(primaryContainer).find('.product-listing__save').show();
			        }			        
		        }
		        if (selectedItem.price.savings <= 0) {
		            $(primaryContainer).find('.product-listing__save').hide();
		        }
		        $('.product-details--code').html('Product Code: '+productDisplay.product.itemDetails[thisItemId].partNumber);
		        if(typeof  productDisplay.product.itemDetails[thisItemId].longDescription != 'undefined'){
		        	$('#PDP-longDescription').html(productDisplay.product.itemDetails[thisItemId].longDescription.replace(/^\|\||\|\|$/g,'').split('||').join('<br>').replace(/\|/g,':'))
		        }
	        }
	        
	       var showQty=false;
	       var showAddMore=false;
	       if(typeof $(self).attr('rel') != 'undefined' && $(self).attr('rel').search("colorPallete")==0 ){
	    	   var $parent= $(primaryContainer).find('.slider-variant ul.slides');
	    	   $parent.html("");
	    	   //$('.product-details--apparel .slider-variant').flexslider("destroy");
	    	   $.each(productDisplay.product.itemDetails,function (index,itemDetail){
		        	if(itemDetail.definingAttributes.Colour == color){
		        		var variantInfo= '<a href="javascript:;" title='+itemDetail.definingAttributes.Size+'>'+itemDetail.definingAttributes.Size+' <span class="product-unit">(<span class="product-unit-count">'+itemDetail.qtyInCart+'</span>)</span></a><span class="product-details__change-qty" href="#" title="Change Quantity">Change Qty.</span>';
	        			var appendvariant= '<li data-item="'+itemDetail.uniqueID+'"></li>';
	        			//$('<li />', {html:suggestion}).appendTo('ul#pinCodeSuggestions');
	        			if(itemDetail.outofstock){
	        				$($parent).append('<li data-item="'+itemDetail.uniqueID+'"><a href="javascript:;" class="disabled" title='+itemDetail.definingAttributes.Size+'>'+itemDetail.definingAttributes.Size+' <span class="product-unit">(<span class="product-unit-count">'+itemDetail.qtyInCart+'</span>)</span></a><span class="product-details__change-qty" href="#" title="Change Quantity">Change Qty.</span></li>');
	        			}
	        			else{
	        			$($parent).append('<li data-item="'+itemDetail.uniqueID+'"><a href="javascript:;" title='+itemDetail.definingAttributes.Size+'>'+itemDetail.definingAttributes.Size+' <span class="product-unit">(<span class="product-unit-count">'+itemDetail.qtyInCart+'</span>)</span></a><span class="product-details__change-qty" href="#" title="Change Quantity">Change Qty.</span></li>');
	        			}
		        	}
		        });
	    	  
	    	   $.each(productDisplay.product.itemDetails,function (index,itemDetail){
		        	if(itemDetail.definingAttributes.Colour == color){
		        		var variantfound=false;
		        		$.each($(primaryContainer).find('.slider-variant .slides li'),function(indx,list) {  
		        			var itemId=$(list).data("item");
		        			
		        				if(itemDetail.qtyInCart > 0){
					        		
					        		if(typeof thisItemId != 'undefined' && thisItemId != null && itemId == thisItemId && $(list).find('a').attr('title')===itemDetail.definingAttributes.Size){
					        			$('.product-details__btn-quantity select').prop('selectedIndex', itemDetail.qtyInCart).selectric('refresh');
					        			$(list).find('.product-details__change-qty').css('display', 'block');
					        			$(list).addClass('active enableChangeQty addedToCart');
										$(list).find('.product-unit-count').text(itemDetail.qtyInCart);
										$(list).find('.product-unit').css('display', 'inline');
					        			showQty=true;
					        		}else if($(list).find('a').attr('title')===itemDetail.definingAttributes.Size){
					        			$(list).removeClass('active');
					        			$(list).addClass('enableChangeQty addedToCart');
					        			$(list).find('.product-details__change-qty').css('display', 'block');
					        			$(list).find('.product-unit').css('display', 'inline');
					        			$(list).find('.product-unit-count').text(itemDetail.qtyInCart);
					        			showAddMore=true;
					        		}
					        	}else if($(list).find('a').attr('title')===itemDetail.definingAttributes.Size){
					        		$(list).find('.product-unit-count').text(0);
						        	$(list).find('.product-details__change-qty, .product-unit').css('display', 'none');
									//price fix
									$('.pdp-price-panel__price-mrp, .pdp-price-panel__primary').css('display', 'block');
					          	  	$('.pdp-price-total').css('display', 'none');
									//price fix
						        	$(list).removeClass('enableChangeQty addedToCart');
						        	if(itemId != thisItemId){
						        		$(list).removeClass('active');
						        	}else{
						        		$(list).addClass('active');
						        	}
						        	if(productDisplay.product.totalQtyInCart >0){
						        		showAddMore=true;
						        	}
					        	}
		        		     
		        		});
		        		
		        		if(showQty == true){
				        	$('.product-details__btn-quantity').css('display', 'block');
				        	$('.product-details__btn-addtocart, .product-details__btn-add-more').css('display', 'none');
				        	//$('.product-details__btn-viewcart').css('display', 'block');
				        }
				        if(showAddMore == true){
				        	$('.product-details__btn-addtocart, .product-details__btn-quantity').css('display', 'none');
				        	$('.product-details__btn-add-more').css('display', 'block');
				        	//$('.product-details__btn-viewcart').css('display', 'none');
				        }
		        	}
		        });
	    	  
	    	   if(showQty == true){
		        	$('.product-details__btn-quantity').css('display', 'block');
		        	$('.product-details__btn-addtocart, .product-details__btn-add-more').css('display', 'none');
		        	//$('.product-details__btn-viewcart').css('display', 'block');
		        }
		        if(showAddMore == true){
		        	$('.product-details__btn-addtocart, .product-details__btn-quantity').css('display', 'none');
		        	$('.product-details__btn-add-more').css('display', 'block');
		        	//$('.product-details__btn-viewcart').css('display', 'none');
		        }

				//price fix
		        if (typeof thisItemId != 'undefined' && thisItemId != null){
		        	if(productDisplay.product.itemDetails[thisItemId].qtyInCart>0){
		        		if(productDisplay.product.totalSavingsInCart > 0){
		        			$('.pdp-price-total__savings').html('Your Savings <span><i class="icon-rupees"></i>'+ productDisplay.product.totalSavingsInCart+'</span>');
		        			$('.pdp-price-total__savings').css('display','block');
		        		}else{
		        			$('.pdp-price-total__savings').css('display','none');
		        		}
	        			$('.pdp-price-total__price').html('Total Price <i class="icon-rupees"></i>'+productDisplay.product.totalPriceInCart);
	        			$('.pdp-price-panel__price-mrp, .pdp-price-panel__primary').css('display', 'none');
	        			$('.pdp-price-total').css('display', 'block');
	        			$('.product-details__btn-quantity').css('display', 'block');
	        			//$('.product-details__btn-viewcart').css('display', 'block');
	        			$('.product-details__btn-addtocart, .product-details__btn-add-more').css('display', 'none');
			        }
		        }else{
		        	$('.product-details__btn-quantity').css('display', 'none');
		        	$('.pdp-price-panel__price-mrp, .pdp-price-panel__primary').css('display', 'block');
        			$('.pdp-price-total').css('display', 'none');
		        	if(productDisplay.product.totalQtyInCart >0){
		        		$('.product-details__btn-add-more').css('display', 'block');
		        		//$('.product-details__btn-viewcart').css('display', 'none')
		        		$('.product-details__btn-quantity').css('display', 'none');;
		        		$('.product-details__btn-addtocart').css('display', 'none');
		        	}else{
		        		$('.product-details__btn-add-more').css('display', 'none');
		        		//$('.product-details__btn-viewcart').css('display', 'none');
		        		$('.product-details__btn-addtocart').css('display', 'block');
		        	}
		        }
				//price fix
	       }
	       
	       if(productDisplay.product.pageType === "apparel"){	
	        	var $parentThumbs= $('.product-gallery__thumbnails-wrapper .slides');
	        	var $parentImages= $('.product-gallery__viewport .slides');
	        	
	        	if (typeof thisItemId != "undefined" && thisItemId != null 
	        			&& typeof productDisplay.product.itemDetails[thisItemId].imageObjs != "undefined" && productDisplay.product.itemDetails[thisItemId].imageObjs != null && productDisplay.product.itemDetails[thisItemId].imageObjs.length > 0){
	        		$parentThumbs.html("");
		        	$parentImages.html("");
	        		 $.each(productDisplay.product.itemDetails[thisItemId].imageObjs,function (index,imageObj){
	 	        			$($parentThumbs).append('<li><a href="javascript:;" title="" rel="'+index+'" id="js-thumb-'+index+'"><img class="img-responsive" src="'+imageObj+'" alt="'+productDisplay.product.itemDetails[thisItemId].title+'" title="'+productDisplay.product.itemDetails[thisItemId].title+'" onerror=this.src="'+noImagePathThumb+'";></a></li>');
	 	        			$($parentImages).append('<li id="js-product-img-'+index+'" ><div class="easyzoom easyzoom--overlay"><a href="'+imageObj.replace('_T.jpg','_Z.jpg')+'" title=""><img class="img-responsive" src="'+imageObj.replace('_T.jpg','_M.jpg')+'" alt="'+productDisplay.product.itemDetails[thisItemId].title+'" title="'+productDisplay.product.itemDetails[thisItemId].title+'" onerror=this.src="'+noImagePathMain+'";></a></div></li>');
	 		        });
	        	}else{
	        		var tempSize = $(primaryContainer).find('.slider-variant .slides li:first-child a').attr('title');
      				var tempItem = productDisplay.resolveSKU(productId, {
                      Colour: color,
                      Size: tempSize
      				});
      				if(typeof productDisplay.product.itemDetails[tempItem].imageObjs != "undefined" && productDisplay.product.itemDetails[tempItem].imageObjs != null && productDisplay.product.itemDetails[tempItem].imageObjs.length > 0){
      					$parentThumbs.html("");
      		        	$parentImages.html("");
      		        	$.each(productDisplay.product.itemDetails[tempItem].imageObjs,function (index,imageObj){
      		        			$($parentThumbs).append('<li><a href="javascript:;" title="" rel="'+index+'" id="js-thumb-'+index+'"><img class="img-responsive" src="'+imageObj+'" alt="'+productDisplay.product.itemDetails[tempItem].title+'" title="'+productDisplay.product.itemDetails[tempItem].title+'" onerror=this.src="'+noImagePathThumb+'";></a></li>');
      		        			$($parentImages).append('<li id="js-product-img-'+index+'"><div class="easyzoom easyzoom--overlay"><a href="'+imageObj.replace('_T.jpg','_Z.jpg')+'" title=""><img class="img-responsive" src="'+imageObj.replace('_T.jpg','_M.jpg')+'" alt="'+productDisplay.product.itemDetails[tempItem].title+'" title="'+productDisplay.product.itemDetails[tempItem].title+'" onerror=this.src="'+noImagePathMain+'";></a></div></li>');
    	        		});
      				}	        		
	        	}
	        	$('.product-gallery__thumbnails .slides li:first-child a').addClass('current').addClass('active');
	        	$('.product-gallery__thumbnails-prev a').bind('click',function(e) {productDisplay.prevThumb();});
	        	$('.product-gallery__thumbnails-next a').bind('click',function(e) {productDisplay.nextThumb();});
	        	$('.product-gallery__thumbnails .slides li a').bind('click',function(e) {productDisplay.changeProductImage(e);});
	        	$('.easyzoom').easyZoom();
	        }	
	       
	       if (typeof thisItemId != 'undefined' && thisItemId != null){
		       if(selectedItem.price.sellingPrice > 0){
		        	if(selectedItem.price.savings > 0){
		        		if($(primaryContainer).find('.pdp-price-panel__price-mrp span').hasClass('no-strike-diagonal')){
		        			$(primaryContainer).find('.pdp-price-panel__price-mrp span').removeClass('no-strike-diagonal');
		        			$(primaryContainer).find('.pdp-price-panel__price-mrp span').addClass('strike-diagonal');
			        	}		        		
		        		$('.product-listing__save .product-listing__save--price').html('<i class="icon-rupees"></i>' + selectedItem.price.savings);
						if(productDisplay.product.itemDetails[thisItemId].qtyInCart == 0){
							$(primaryContainer).find('.pdp-price-panel__price-mrp').show();
							$('.product-listing__save').show();
						}		        		
		        	}else if(selectedItem.price.savings == 0){
		        		if($(primaryContainer).find('.pdp-price-panel__price-mrp span').hasClass('strike-diagonal')){
		        			$(primaryContainer).find('.pdp-price-panel__price-mrp span').removeClass('strike-diagonal');
		        			$(primaryContainer).find('.pdp-price-panel__price-mrp span').addClass('no-strike-diagonal');
			        	}
		        		if(productDisplay.product.itemDetails[thisItemId].qtyInCart == 0){
		        			$(primaryContainer).find('.pdp-price-panel__price-mrp').show();
		        		}		        		
		        	}else{
			        	$('.product-listing__save').hide();
			        	if($(primaryContainer).find('.pdp-price-panel__price-mrp span').hasClass('strike-diagonal')){
		        			$(primaryContainer).find('.pdp-price-panel__price-mrp span').removeClass('strike-diagonal');
		        			$(primaryContainer).find('.pdp-price-panel__price-mrp span').addClass('no-strike-diagonal');
			        	}
			        	$(primaryContainer).find('.pdp-price-panel__price-mrp').hide();
			        }
		        }else{
		        	$(primaryContainer).find('.pdp-price-panel__price-mrp').hide();
					$('.product-listing__save').hide();
		        }
		        if(selectedItem.price.offerPrice >0){
		        	if(selectedItem.price.savings > 0){
		        		$('.product-listing__save .product-listing__save--price').html('<i class="icon-rupees"></i>' + selectedItem.price.savings);
		        		if(productDisplay.product.itemDetails[thisItemId].qtyInCart == 0){
		        			$(primaryContainer).find('.pdp-price-panel__primary').show();
		        			$('.product-listing__save').show();
		        		}		        		
		        	}
		        }else{
		        	$(primaryContainer).find('.pdp-price-panel__primary').hide();
					$('.product-listing__save').hide();
		        }
		        if(selectedItem.priceExists){        	
		        	$(primaryContainer).find('.product-details__btn-addtocart').removeClass('button--disabled');
		        	$(primaryContainer).find('.product-details__btn-add-more').removeClass('button--disabled');
		        }else{
		        	$(primaryContainer).find('.product-details__btn-addtocart').addClass('button--disabled');
		        	$(primaryContainer).find('.product-details__btn-add-more').addClass('button--disabled');
		        }
	       }
	       
	       (color != undefined && color != null &&  attrValue == undefined) ?
	        		(DMAnalytics.events( DMAnalytics.Constants.Category.Products+" : "+productId,
	                		DMAnalytics.Constants.Action.PLPPallette+ color, document.title, 0, null ))
	                		: (DMAnalytics.events( DMAnalytics.Constants.Category.Products+" : "+productId,
	                        		DMAnalytics.Constants.Action.PLPVariant+color+" : "+attrValue, document.title, 0, null ));
	    });
});
