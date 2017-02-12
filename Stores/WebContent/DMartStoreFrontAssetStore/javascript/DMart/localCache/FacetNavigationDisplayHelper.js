var facetNavigationDisplay = {
		
    selectedFilters : [],
    overlay : true,
    init: function(catalogID, divId, prodJSON, searchTerm, brand) {
    	
    	var facetNav = {};
    	
    	var facetNavStorageKey =  "facet_nav_" + (catalogID || searchTerm);
    	if(typeof brand!= "undefined" && brand != ""){
    		facetNavStorageKey ="facet_nav_" + brand; 
		}
        
    	facetNavStorageKey +=  (this.selectedFilters.length>0)?JSON.stringify(this.selectedFilters):'';
    	
    	facetNav = DMStorage.getValue(facetNavStorageKey);
    	if(!facetNav) {
    		return;
    	}
    	facetNavHeaders = DMStorage.getValue('filter_titles_'+(catalogID || searchTerm || brand));
        var imgUrl = WCParamJS.imageServerHost;
        var data = new Object();
        var config = {
            'baseUrl': imgUrl
        };
        data.pageTitle = facetNav.pageType;

        
        data.overlay = this.overlay;
        data.category = facetNav.category;
        data.isCategory = facetNav.isCategory;
        data.storeId = WCParamJS.storeId;
        data.catalogId = WCParamJS.catalogId;
        data.langId = WCParamJS.langId;
        data.config=config;
        
        
        var counter = 0;
        data.facets = {};
        
        $.each(facetNavHeaders,function(){
       		 data.facets[this] = facetNav[this];
        });
        
        nunjucks.configure(WCParamJS.staticServerHost + 'templates/', {
            autoescape: true,
            web: {
                useCache: true
            }
        });
        $(divId).html(nunjucks.render('_modules/filter.nunjucks', {
            data: data
        }));
        
        this.applySliders();
        
        if(this.overlay) {
        	this.getHotspots('DMartFacetNavOverlay','.filter-add-baner__holder');
        }
       // this.overlay = false; // Stop displaying overlay after initial filter load
        
         this.hiliteSelectedFilters(); 
         $(divId).ready(function(){ 
        	 if(data.category.length == 0){
        		 $('.fiter-module__option-primary').css('display','none');
        	 }
        	 if(Object.keys(data.facets).length == 0){
        		 ProductHelper.hasNoFacets =true;
        	 }else{
        		 ProductHelper.hasNoFacets =false;
        	 }
         });	
       
    },
    
    hiliteSelectedFilters : function() {
    	$.each(this.selectedFilters,function(){
    		var name = this.filterType;
    		var title = this.filterValue;
    		$('.filter-component a[data-filtertype="'+name+'"][data-filtervalue="'+title+'"]').addClass('selected');
    	});
    	
    	// Current category highlight
    	$('.filter-module__category ul li a[title="'+$('.breadcrumbs li:last').text()+'"]').addClass('selected');

    },
    
    removeFilterFromList : function(name,title) {
    	var filterLength = this.selectedFilters.length;
      	for(var i=0;i<filterLength;i++) {
      		if(name == 'priceRange' || name == 'discountRange'){
      			 if(this.selectedFilters[i].filterType === name)
      	      		 {
      	      		 	this.selectedFilters.splice(i,1);
      	      		 	break;
      	      		 }
      		}else{
      			 if(this.selectedFilters[i].filterType === name &&
      	      			this.selectedFilters[i].filterValue === title)
      	      		 {
      	      		 	this.selectedFilters.splice(i,1);
      	      		 	break;
      	      		 }
      		}
      	}
    },
    getHotspots : function(hotspotName,containerSelector) {
    	
    	var ajaxCallParams = {
    		url:window.location.protocol+'//'+window.location.hostname+'/wcs/resources/store/'+WCParamJS.storeId+'/espot/'+hotspotName+'?categoryId='+WCParamJS.categoryId+'&DM_ReqCmd=CategoryDisplay',
    		method: 'GET',
    		dataType:'json',
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
    	
    	$.ajax(ajaxCallParams).done(function(data){
    		if(data.MarketingSpotData && data.MarketingSpotData[0].baseMarketingSpotActivityData) {
	    		var content = data.MarketingSpotData[0].baseMarketingSpotActivityData[0].marketingContentDescription[0].marketingText;
	    		// Special handling for product card espot
	    		if(containerSelector == '#plp-grocery-offer') {
	    			// Make the product card espot on the fly
	    			var html = '<div class="col-xs-12 col-md-4 col-lg-3 js-switch-view js-hide-show">';
	    	        html+='<div class="product-listing-item plp-grocery-offer" id="plp-grocery-offer">';
	    	        html+=content;
	    	        html+='</div></div>';
	    	        // Temporary storage. So that it wont cause issues in positioning
	    	        $('body').append(html);	
	    		} else {
	    			$(containerSelector).html(content);
	    		}
	    		
	    		productListing.showProductCardEspot();
    		} 
    	}).fail(function(data){
    		console.log(JSON.stringify(data)+' : ESPOT call failed');
    	});
    },
    
    applySliders : function() {
    	if($('.filter-module__brand-slider').data('flexslider')) {
    		$('.filter-module__brand-slider').flexslider('destroy');
    	}
    	$('.filter-module__brand-slider').flexslider({
    	      animation: 'slide',
    	      animationLoop: false,
    	      itemWidth: 60,
    	      itemMargin: 10,
    	      slideshow: false,
    	      controlNav: false,
    	      reverse: false,
    	      prevText: '<i class="icon-caret-left"></i>',
    	      nextText: '<i class="icon-caret-right"></i>',
    	      move: 1
    	    });
    	var colourMaxWidth = 0;
    	var colourliValues =$('.filter-module__colour-slider').find('.slides li');
    	var colourliCount = $('.filter-module__colour-slider').find('.slides  a').length;
    	$.each(colourliValues,function(colourCount,colourElement){
    		var colourWidth= $(colourElement).width();
    		if(colourMaxWidth < colourWidth){
    			colourMaxWidth=colourWidth;
    		}
    	});
    	
    	if($('.filter-module__colour-slider').data('flexslider')) {
    		$('.filter-module__colour-slider').flexslider('destroy');
    	}
    	
    	$('.filter-module__colour-slider').flexslider({
    	      animation: 'slide',
    	      animationLoop: false,
    	      itemWidth: 23,
    	      itemMargin: 10,
    	      slideshow: false,
    	      controlNav: false,
    	      reverse: false,
    	      minItems: colourliCount>6 ? 6 : 1,
    	      maxItems: colourliCount,
    	      prevText: '<i class="icon-caret-left"></i>',
    	      nextText: '<i class="icon-caret-right"></i>',
    	      move: 1
    	    });
    	$('.filter-module__variant-slider').flexslider({
    	      animation: 'slide',
    	      animationLoop: false,
    	      itemWidth: 59,
    	      itemMargin: 10,
    	      slideshow: false,
    	      controlNav: false,
    	      reverse: false,
    	      minItems: 3,
    	      maxItems: 7,
    	      prevText: '<i class="icon-caret-left"></i>',
    	      nextText: '<i class="icon-caret-right"></i>',
    	      move: 1
    	    });
    	if($(window).width() > 769 && $(window).width() < 1023) {
    	$.each($('.filter-module__type-slider'), function(key, value) {
	    	var liCount = $(value).find('.slides  a').length;
	    	var maxWidth = 0;
	    	var liValues = $(value).find('.slides li a');
	    	$.each(liValues,function(count,element){
	    		var width= $(element).width();
	    		if(maxWidth < width){
	    			maxWidth=width;
	    		}
	    	});
	    	$(value).flexslider({
	    	      animation: 'slide',
	    	      animationLoop: false,
	    	      itemWidth: 125,
	    	      itemMargin: 10,
	    	      slideshow: false,
	    	      controlNav: false,
	    	      reverse: false,
	    	      minItems: liCount>3 ? 3 : 1,
	    	      maxItems: liCount,
	    	      prevText: '<i class="icon-caret-left"></i>',
	    	      nextText: '<i class="icon-caret-right"></i>',
	    	      move: 1
	    	    });
	});
    }else{
    	$.each($('.filter-module__type-slider'), function(key, value) {
 	    	var liCount = $(value).find('.slides  a').length;
			var maxWidth = 0;
	    	var liValues = $(value).find('.slides li');
	    	$.each(liValues,function(count,element){
	    		var width= $(element).width();				
	    		if(maxWidth < width){
	    			maxWidth=width;
	    		}
	    	});
 	    	$(value).flexslider({
 		            animation: 'slide',
 		            animationLoop: false,
 		            itemWidth: 125,
 		            itemMargin: 10,
 		            slideshow: false,
 		            controlNav: false,
 		            reverse: false,
 		            minItems: liCount>3 ? 3 : 1,
 		            maxItems: liCount,
 		            prevText: '<i class="icon-caret-left"></i>',
 		            nextText: '<i class="icon-caret-right"></i>',
 		            move: 1
 	    	    });
 	    });
    }
    }
};