<%--
 =================================================================
  Licensed Materials - Property of IBM

  WebSphere Commerce

  (C) Copyright IBM Corp. 2011, 2014 All Rights Reserved.

  US Government Users Restricted Rights - Use, duplication or
  disclosure restricted by GSA ADP Schedule Contract with
  IBM Corp.
 =================================================================
--%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://commerce.ibm.com/base" prefix="wcbase"%>
<%@ taglib uri="http://commerce.ibm.com/foundation" prefix="wcf"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="flow.tld" prefix="flow"%>
<%@ taglib uri="http://commerce.ibm.com/coremetrics" prefix="cm"%>
<%@ include file="../../../Common/nocache.jspf"%>
<%@ include file="../../../Common/EnvironmentSetup.jspf"%>
<%@ include file="../../../Common/CommonJSToInclude.jspf"%>
<%@ include file="../../../include/ErrorMessageSetupBrazilExt.jspf"%>


<!DOCTYPE HTML>
<html>
<!-- Begin Page -->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><fmt:message bundle="${storeText}" key="STLOC_TITLE"></fmt:message></title>
<link rel="stylesheet"
	href="<c:out value="${jspStoreImgDir}${env_vfileStylesheet}"/>"
	type="text/css" />
	
<c:set var="pageGroup" value="PUPList" />
<%@include file="../../../Common/DMartCommonJSToInclude.jspf" %>
<%--
<script type="text/javascript"
	src="<c:out value="${jsAssetsDir}javascript/Common/Pup-List.js"/>"></script>
<script type="text/javascript"
	src="<c:out value="${jsAssetsDir}javascript/CommonContextsDeclarations.js"/>"></script>
<script type="text/javascript"
	src="<c:out value="${jsAssetsDir}javascript/CommonControllersDeclaration.js"/>"></script>

<script type="text/javascript"
	src="<c:out value="${jsAssetsDir}javascript/ServicesDeclaration.js"/>"></script>
<script type="text/javascript"
	src="<c:out value="${jsAssetsDir}javascript/UserArea/LogonForm.js"/>"></script>
<script type="text/javascript"
	src="<c:out value="${jsAssetsDir}javascript/UserArea/AddressHelper.js"/>"></script>
<script type="text/javascript"
	src="<c:out value="${jsAssetsDir}javascript/UserArea/MyAccountDisplay.js"/>"></script>
<c:if test="${isBrazilStore}">
	<script type="text/javascript"
		src="<c:out value="${jsAssetsDir}javascript/UserArea/MyBrazilAccountDisplay.js"/>"></script>
</c:if>

<c:if test="${empty B2BLogonFormJSIncluded}">
	<script type="text/javascript"
		src="<c:out value="${staticAssetContextRoot}${env_siteWidgetsDir}com.ibm.commerce.store.widgets.RegistrationForm/javascript/B2BLogonForm.js"/>"></script>
	<c:set var="B2BLogonFormJSIncluded" value="true" scope="request" />
</c:if>
 --%>
<script type="text/javascript">
	function popupWindow(URL) {
		window.open(URL, "mywindow", "status=1,scrollbars=1,resizable=1");
	}
</script>

<%@ include file="../../../Common/CommonJSPFToInclude.jspf"%>

</head>
<%
	String googleAPIKey = StoreConfigurationRegistry.getSingleton()
			.getValue(0, "DMart.GoogleAPIKey");
	pageContext.setAttribute("googleAPIKey", googleAPIKey);
%>
<%-- <script type="text/javascript"
	src="//maps.googleapis.com/maps/api/js?sensor=false&key=${googleAPIKey}"></script> --%>


<body>
		<%
			out.flush();
		%>
		<c:import url="${env_jspStoreDir}/Widgets/Header/Header.jsp" />
		<%
			out.flush();
		%>
		
		<input type="hidden" name="pupArea" value="${WCParam.pupArea}" id="pupArea" />
		<div class="container">
			<div class="row">
				<div class="col-xs-12 col-md-6">
					<ul class="breadcrumbs link-bordered">
						<li>
							<a href="${env_TopCategoriesDisplayURL}" title="Home"><fmt:message bundle="${storeText}" key="BREADCRUMB_HOME"></fmt:message></a>
						</li>
						<li id="orderId">
							<c:choose>
								<c:when test="${WCParam.pupArea eq null or WCParam.pupArea eq ''}">
									<fmt:message bundle="${storeText}" key="BREADCRUMB_CURR_PAGE"></fmt:message>
								</c:when>
								<c:otherwise>
									<c:out value="${WCParam.pupArea}"/>
								</c:otherwise>
							</c:choose>
						</li>
					</ul>
				</div>
			</div>

		</div>
		<div class="container">
			<div class="row">
				<div class="col-xs-12 col-md-6">
					<div class="pup-location-lists">
						<div class="row">
							<div class="col-xs-12 col-md-12">
								<input placeholder="Find your nearest Pick-up Point by entering area or Pincode"
									class="pup--filter-field">
							</div>
						</div>
						<div class="pup-location-marker">
							<ul id="marker_list"></ul>
						</div>
					</div>
				</div>

				<div class="col-xs-12 col-md-6">



					<script>
						var pupAddress = pup.getList();
						pup.init();
						var infoWnd, mapCanvas, zoomChangeBoundsListener, google;
						function initialize() {
							var myOptions = {
								// scrollwheel: false,
								draggable : true,
								mapTypeId : google.maps.MapTypeId.ROADMAP
							};
							//Creates a map object.
							mapCanvas = new google.maps.Map(document
									.getElementById('map_canvas'), myOptions);

							// Fix hidden map in Tabs/Accordion
							jQuery(window)
									.load(
											function() {

												google.maps.event.trigger(
														mapCanvas, 'resize');
												jQuery('.js-delivery-favorite')
														.clickToggle(
																function() {
																	jQuery(this)
																			.parents(
																					'li')
																			.addClass(
																					'favorite-address');
																	jQuery(this)
																			.children()
																			.toggleClass(
																					'js-hide-show');
																},
																function() {
																	jQuery(this)
																			.parents(
																					'li')
																			.removeClass(
																					'favorite-address');
																	jQuery(this)
																			.children()
																			.toggleClass(
																					'js-hide-show');
																});

												setTimeout(
														function() {
															jQuery(
																	'#marker_list li:first-child label')
																	.trigger(
																			'click');
														}, 400);
											});

							//Creates a infowindow object.
							infoWnd = new google.maps.InfoWindow({
								maxWidth : 200
							});

							//Mapping markers on the map
							var bounds = new google.maps.LatLngBounds();
							var pup, i, latlng;
					
							for (i in pupAddress) {
								//Creates a marker
								if(pupAddress.hasOwnProperty(i)) {
									pup = pupAddress[i];
									var pupAreaSiteMap = $('#pupArea').val();
									if(pupAreaSiteMap != null && pupAreaSiteMap != "" && typeof pupAreaSiteMap != "undefined"){
										//var pupAddressArray = pup.address1.split(',');
										//var pupAddressArea = pupAddressArray[pupAddressArray.length-1];
										if(pup.address1.search(pupAreaSiteMap) >= 0){
											latlng = new google.maps.LatLng(pup.latlng[0],
											pup.latlng[1]);
											bounds.extend(latlng);
											var marker = createMarker(mapCanvas, latlng,
													pup.name);
			
											//Creates a address for the marker
											createMarkerButton(marker);
										}
									}else{
										latlng = new google.maps.LatLng(pup.latlng[0],
										pup.latlng[1]);
										bounds.extend(latlng);
										var marker = createMarker(mapCanvas, latlng,
												pup.name);
		
										//Creates a address for the marker
										createMarkerButton(marker);
									}
								}
							}
							
							//$('#marker_list li:first-child label').trigger('click');
							//Fits the map bounds
							mapCanvas.fitBounds(bounds);
 							zoomChangeBoundsListener = google.maps.event
									.addListenerOnce(mapCanvas,
											'bounds_changed', function(event) {
												if (this.getZoom()) {
													this.setZoom(12);
												}
											});
							setTimeout(
									function() {
										$('#marker_list li:first label').click();
										google.maps.event
												.removeListener(zoomChangeBoundsListener);
										
									}, 2000); 
						   	
						   $('.pup-location-marker').perfectScrollbar('update');
						   
						}

						function createMarker(map, latlng, title) {
							//Creates a marker
							var marker = new google.maps.Marker({
								position : latlng,
								map : map,
								title : title,
								animation : google.maps.Animation.DROP,
								// icon: '/images/dmart-symbol-logo.svg',// Marker icon
								scaledSize : new google.maps.Size(10, 10)
							// scaled size
							});
/* 							$('#marker_list input[type=radio]').each(
									function() {
										console.log($(this).trigger('click'));
										$(this).prop("checked", true);
										$(this).attr('checked', 'checked');
										return false;
									}); */
							//The infoWindow is opened when the address is clicked
							google.maps.event
									.addListener(
											marker,
											'click',
											function() {
												infoWnd
														.setContent('<div class="pupAddress-popup">DMart</div>');
												jQuery('.pupAddress-popup')
														.parent().parent()
														.parent().parent()
														.parent().hide();
												map.setZoom(16);
												map.panTo(marker.getPosition());
												infoWnd.open(map, marker);
												// infoWnd.close();
												// marker.addListener('click', toggleBounce);
											});
							return marker;

							 function toggleBounce() {
								if (marker.getAnimation() !== null) {
									marker.setAnimation(null);
								} else {
									marker
											.setAnimation(google.maps.Animation.BOUNCE);
								}
							} 
						}

						function createMarkerButton(marker) {
							//Creates a address buttons
							var ul = document.getElementById('marker_list');
							var li = document.createElement('li');
							var label = document.createElement('label');
							var address = document.createElement('address');
							var rbutton = document.createElement('input');
							rbutton.type = 'radio';
							rbutton.name = 'delivery-address';

							// Favorite buttons
							var favButton = document.createElement('a');
							favButton.className = 'js-delivery-favorite delivery-favorite-cta';
							favButton.title = 'Make it as Favorite PUP';

							var heartIcon = document.createElement('i');
							heartIcon.className = 'js-delivery-favorite-icon icon-heart js-hide-show pup-icon-heart-hide';

							var heartIconOutline = document.createElement('i');
							heartIconOutline.className = 'js-delivery-favorite-icon icon-heart-outlined pup-icon-heart-hide';

							var title = marker.getTitle();
							address.innerHTML = title;
							ul.appendChild(li);
							li.appendChild(label);
							label.appendChild(rbutton);
							label.appendChild(address);
							li.appendChild(favButton);
							favButton.appendChild(heartIcon);
							favButton.appendChild(heartIconOutline);

							//Trigger a click event to marker when the button is clicked.
							google.maps.event.addDomListener(label, 'click',
									function() {
										google.maps.event.trigger(marker,
												'click');
									});
						}
						google.maps.event.addDomListener(window, 'load',
								initialize);
					</script>

					<div id="map_canvas" class="pup-location-map"></div>

				</div>

			</div>
		</div>



		<div class="loading-animation-wrapper">
			<div class="loading-animation__panel">
				<img class="img-responsive" src="/images/loader.gif" alt="">
			</div>
		</div>

		<div id="footerWrapper">
			<%
				out.flush();
			%>
			<c:import url="${env_jspStoreDir}Widgets/Footer/Footer.jsp" />
			<%
				out.flush();
			%>
		</div>

	

</body>



<!-- END ProductDisplay.jsp -->
</html>

