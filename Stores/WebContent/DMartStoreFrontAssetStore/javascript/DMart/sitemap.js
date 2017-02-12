(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

(function (dmUIConfig) {
  function productheight() {
    if ($(window).width() >= 768) {
      var st_height = $(".sitemap-headsectn").outerHeight();
      var h_height = $(".header").height();

      var topTotal = parseInt(st_height) + parseInt(h_height);
      $(".sitemap-productdetails").css("margin-top", topTotal);
    }
    if ($(window).width() < 768) {
      $(".sitemap-productdetails").css("margin-top", 0);
    }
  }
  

  
  $(document).ready(function () {
    productheight();
    $(".col-details a").on("click", function () {
      //$('html,body').unbind().animate({scrollTop: $(element).offset().top+400},'slow');
      var $anchor = $(this);

      var header_height = $(".top-header").outerHeight(true);
      var headermenu_height = $(".main-menu").outerHeight(true);
      var links_height = $(".sitemap-headsectn").outerHeight(true);
      var final_height = header_height + headermenu_height + links_height + 20;

      $("html, body").stop().animate({
        scrollTop: $($anchor.attr("href")).offset().top - final_height
      }, 200);
      event.preventDefault();
    });
  });
  $(window).resize(function () {
    productheight();
  });
})(DM_UI_CONFIG);

},{}]},{},[1]);

var categoryName;

function getCategoryNameForSiteMap(categoryId,cat){
	var i;
	
	if(typeof cat.catalogGroupView != "undefined" && cat.catalogGroupView != null){
		for(i=0;i<cat.catalogGroupView.length;i++){
			this.getCategoryNameForSiteMap(categoryId,cat.catalogGroupView[i]);
		}
		return categoryName;
	} else if(cat.uniqueID == categoryId){
		console.log('matched the category, '+cat.name);
		this.categoryName = cat.name;
		return(cat.name);
	}
	
  }
