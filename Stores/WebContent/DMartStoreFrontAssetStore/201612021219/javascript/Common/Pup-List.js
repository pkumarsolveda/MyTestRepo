/**
 * Copyright(c) Avenue E-Commerce Limited (2015). All Rights reserved. This
 * software is the confidential and proprietary information of Avenue E-Commerce
 * Limited ("Confidential Information"). You shall not disclose such
 * Confidential Information and shall use it only in accordance with the terms
 * of the license agreement you entered into with Avenue E-Commerce Limited.
 * 
 * Author Aditya_Pathak02 Date 16/2/2016
 */
var pup = {

	init : function() {
		$(document).on('keyup input', '.pup--filter-field', function() {
			pup.filterPUPAddress();
			DMAnalytics.events( DMAnalytics.Constants.Category.PupSelection, DMAnalytics.Constants.Category.PupSelection , document.title, 0,null );
		});
	},
	filterPUPAddress : function() {
		var inputString = $('.pup--filter-field').val();
		if(inputString == '') {
			$('#marker_list li').show();
		} else {
			$.each($('#marker_list').children(),
					function(index, physicalStore) {
						var htmlData = $(physicalStore).html();
						if (htmlData.toLowerCase().indexOf(
								inputString.toLowerCase()) == -1) {
							$(physicalStore).hide();
						} else {
							$(physicalStore).show();
						}
					});
		}
		$('.pup-location-marker').perfectScrollbar('update');
	},
	getList : function() {

		var service = window.location.protocol + '//'
				+ window.location.hostname + "/wcs/resources/store/0/pup/list";
		var pupAddress = [];

		$.ajax(
				{
					url : window.location.protocol + '//'
							+ window.location.hostname
							+ "/wcs/resources/store/0/pup/list",
					method : 'GET',
					context : this,
					async : false
				}).success(
				function(data) {
					$.each(data.pupList, function(index, key) {
						var latlngObj = {};
						var latlng = [];
						var name;
						var address1;
						latlng.push(key.LATITUDE);
						latlng.push(key.LONGITUDE);
						
						// PUP identifier added as part of AE-15800 
						name = key.IDENTIFIER + ", " 
								+ key.ADDRESS1 + " "
								+ key.ADDRESS2 + " " + key.ADDRESS3 + " <br/>"
								+ key.CITY + " - " + key.ZIPCODE + " "
								+ key.STATE;

						address1 = key.ADDRESS1;
						
						latlngObj = {
							'latlng' : latlng,
							'name' : name,
							'address1' : address1
						};
						pupAddress.push(latlngObj);
					});
					console.log(pupAddress[0].name);
					console.log(pupAddress[0].latlng[0]);
					console.log(pupAddress[0].latlng[1]);
				});
		return pupAddress;
	}
};