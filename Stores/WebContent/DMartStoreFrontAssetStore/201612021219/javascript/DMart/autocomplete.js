(function(dmUIConfig) {
  
  $(document).ready(function () {
    // Choose location auto complete
	$(document).trigger('dmart.frequent.master');
	
	  $(document).on('keyup','.autocomplete-input input', function(e) {
	  if(DMStorage.getValue('pincodeError') == 'Y' && e.which != 13 && e.which != 9 && e.which != 44){
    	  DMStorage.remove('pincodeError');
      }
      $(this).trigger('dmart.browse.pincode.autosuggest'); // Using trigger to call a method in another JavaScript file to perform some logic.

      //$('.autocomplete-suggestions').scrollTop(1).perfectScrollbar('update');

      // Enter key pressed
      if(e.which === 13) {
        if($(this).val() !== '' && $('.autocomplete-suggestions .autocomplete-suggestion.selected').text() !== '') {
          var valueEntered = $(this).val();
    	  var pincodeSuggestion = $('.autocomplete-suggestions .autocomplete-suggestion.selected').text();
    	  var pinEntered,arrayValEntered,areaEntered;
  		  if(!isNaN(valueEntered)){
			  pinEntered= valueEntered;
		  }else{
			  arrayValEntered= valueEntered.split(',');
			  if(isNaN(arrayValEntered[0])){
				  areaEntered=arrayValEntered[0];
			  }else{
				  pinEntered=arrayValEntered[0];
				  areaEntered=arrayValEntered[1];
			  }
		  }
      	  var pinSuggested,arrayValSuggested,areaSuggested;
		  if(!isNaN(pincodeSuggestion)){
			  pinSuggested= pincodeSuggestion;
		  }else{
			  arrayValSuggested= pincodeSuggestion.split(',');
			  if(isNaN(arrayValSuggested[0])){
				  areaSuggested=arrayValSuggested[0];
			  }else{
				  pinSuggested=arrayValSuggested[0];
				  areaSuggested=arrayValSuggested[1];
			  }
		  }
		  if((pinEntered != undefined && pinSuggested != undefined && pinSuggested.indexOf(pinEntered)!= -1) || 
						(areaEntered != undefined && areaSuggested != undefined && areaSuggested.toUpperCase().indexOf(areaEntered.toUpperCase())!= -1)){
			  $(this).val($('.autocomplete-suggestions .autocomplete-suggestion.selected').text());
	          $('.autocomplete-suggestions').hide();
			  $('#pinCodeSuggestions').empty();
			  $('#errorSpan').empty();
			  $('.autocomplete-suggestion').remove();
		      $('.autocomplete-suggestions').hide();
		      DMStorage.remove('pinCodeSuggestions');
		  }
        }
      } 

      // backspace key pressed
      if(e.which === 8 && !$('.autocomplete-suggestions').hasClass('ps-active-y')) {
        $('.autocomplete-suggestions').perfectScrollbar('destroy');
        $('.autocomplete-suggestions').perfectScrollbar();
        $('.autocomplete-suggestions').scrollTop(10).perfectScrollbar('update');
      }
      
      if(e.which === 46 || e.which === 8) {
		  var valueEntered=$('#pinNumberModal').val();
		  var pinEntered;
		  var areaEntered;
		  var arrayVal;
		  if(!isNaN(valueEntered)){
			  pinEntered= valueEntered;
		  }else{
			  arrayVal= valueEntered.split(',');
			  if(isNaN(arrayVal[0])){
				  areaEntered=arrayVal[0];
			  }else{
				  pinEntered=arrayVal[0];
				  areaEntered=arrayVal[1];
			  }
		  }
		  
		  if(!((pinEntered != undefined && pinEntered.length >1) || (areaEntered != undefined && areaEntered.length >2))) {
			  $('.autocomplete-suggestion').remove();
		      $('.autocomplete-suggestions').hide();
		  }
    	  DMStorage.remove('pinCodeSuggestions');
      }
      
    });

    // iphone fixes 'Done' button
    $('.autocomplete-input input').on('focusout', function(e) {
      if($(this).val() == '') {
        $(this).val($('.autocomplete-suggestions .autocomplete-suggestion.selected').text());
        $('.autocomplete-suggestions').hide();
      }
    });

    /*$('.autocomplete-input input').autoComplete({
      minChars: 1,
      source: function(term, suggest){
        term = term.toLowerCase();

        // Convert into Ajax request based on back-end implementation
        var choices = ['40007', '400076, Powai', '400077, Ghatkopar (E)', '400078, Bhandup (W)', '400078, Bhandup (W)', '400077, Ghatkopar (E)', '400078, Bhandup (W)', '400077, Ghatkopar (E)', '400078, Bhandup (W)'];
        var matches = [];
        for (var i=0; i<choices.length; i++) {
          if (~choices[i].toLowerCase().indexOf(term)) {
            matches.push(choices[i]);
          }
        }
        suggest(matches);
        $('.autocomplete-suggestions').scrollTop(1).perfectScrollbar('update');
      }
    });*/

    $('.autocomplete-suggestions').perfectScrollbar({
      suppressScrollX: true
    });

    //close suggestions on focusout, esc key and click out
    $('body, html').on('mouseup touchend keyup', function(e) {
      if($('.autocomplete-suggestions').is(':visible')) {
        var container = $('.autocomplete-suggestions:visible, .autocomplete-input input');
        if ((!container.is(e.target) && container.has(e.target).length === 0) || e.which === 27) {
          $('.autocomplete-suggestions:visible').hide();
        }
      }
    });
  });
}(DM_UI_CONFIG));
