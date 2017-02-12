<!DOCTYPE html>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://commerce.ibm.com/base" prefix="wcbase" %>
<%@ taglib uri="flow.tld" prefix="flow" %>
<%@ include file="../../Common/nocache.jspf" %>
<%@ taglib uri="http://commerce.ibm.com/foundation" prefix="wcf" %>
<%@ taglib uri="http://commerce.ibm.com/coremetrics"  prefix="cm" %>



<%-- Included for location sensing --%>
<script type="text/javascript" src="//maps.googleapis.com/maps/api/js?sensor=false"></script>

<div id="locationModal" class="modal-dialog js-modal-dialog-esc">
	<div class="modal-dialog__content modal-dialog__content-medium">
		
		<div class="modal-dialog__header">
			<h4 class="modal-dialog__header-title"><fmt:message bundle="${storeText}" key="LOC_TEXT_1"/></h4>
			<h4 class="modal-dialog__header-title-small"><fmt:message bundle="${storeText}" key="LOC_TEXT_2"/></h4>
		</div>
		<div class="modal-dialog__body">
			<div>
			<c:set var="savePincodeActionURL" value="DmartSavePincodeCmd" scope="request" />
			<div class="modal-location-para">
				<fmt:message bundle="${storeText}" key="LOC_TEXT_3"/>
			</div>
			<div class="bitmap-modal">
				<h3 class="modal-location-header"><fmt:message bundle="${storeText}" key="LOC_TEXT_4"/></h3>
				<img class="img-responsive" src="${staticServerHostPath}images/DMart/bitmap-pincode.png" alt="bitmap missing">
			</div>
			<h3 class="modal-location-enter"><fmt:message bundle="${storeText}" key="LOC_TEXT_5"/></h3>
				<form class="form form--location form--modal" method="post" id="formLocationValidationModal" 
					action="<c:out value="${savePincodeActionURL}"/>" novalidate>
					<div class="row">
					<div class="autocomplete-input col-md-8 col-xs-12">
						
						<div class="form-control">
						  <label class="form__label spacing-bottom-tiny" for="pinNumberModal"></label>
						  <input class="form__input" name="pinNumberModal" placeholder="example: Azad Nagar OR 400053" id="pinNumberModal" maxlength="200" required autocomplete="off">
						  <span id="errorSpan" class="error" style="top:40px;display:none">
						  </span>
						</div>
						<span class="auto-detecttext" onclick="javascript:geoFindMe();"><fmt:message bundle="${storeText}" key="LOC_TEXT_6"/></span>
						<div class="auto-detecttext-mobile col-sm-6" onclick="javascript:geoFindMe();"><fmt:message bundle="${storeText}" key="LOC_TEXT_6"/></div>
						</div>
						<div class="col-xs-5 col-sm-4 button-mobile">
							<button class="button-modal-location button--block  col-xs-6" type="button" id="savePinNumberModal"><fmt:message bundle="${storeText}" key="LOC_TEXT_14"/></button>
							<a href="javascript:;" class="skip-location location-skip"><fmt:message bundle="${storeText}" key="LOC_TEXT_7"/></a>
						</div>
					</div>
					<%-- <div class="location-links">
						<div class="row">
							<div class="col-xs-6">
								<a href="javascript:geoFindMe();" class="location__link">
									<i class="icon-location"></i> <span><fmt:message bundle="${storeText}" key="LOC_GET_LOCATION"/></span>
								</a>
							</div>
							
							<div class="col-xs-3"><a href="javascript:;" class="location-skip"><fmt:message bundle="${storeText}" key="LOC_SKIP"/></a></div>
							<div class="col-xs-3" style="left: -1px;"><button class="button-primary button--block" type="button" id="savePinNumberModal"><fmt:message bundle="${storeText}" key="LOC_SAVE"/></button></div>
						</div>
					</div> --%>
					<input type="hidden" name="storeIdNew" value="" id="storeIdNew" />
					<input type="hidden" name="storeId" value="" id="storeId" />
					<input type="hidden" name="currentOrderId" value="" id="currentOrderId" />
					<input type="hidden" name="userField3" value="" id="userField3" />
					<input type="hidden" name="oldGuestIdInput" value="" id="oldGuestIdInput" />
					<input type="hidden" name="storeUserType" value="" id="storeUserType" />
					<input type="hidden" name="pinCodeNew" value="" id="pinCodeNew" />
					<input type="hidden" name="currentPath" value="" id="currentPath" />
				</form>
				<input type="hidden" name="pincodeNotServicedMesg1" value="<fmt:message key='LOC_PINCODE_NOT_SERVICED_MSG1' bundle='${storeText}'/>" id="pincodeNotServicedMesg1" />
				<input type="hidden" name="pincodeNotServicedMesg2" value="<fmt:message key='LOC_PINCODE_NOT_SERVICED_MSG2' bundle='${storeText}'/>" id="pincodeNotServicedMesg2" />
				<input type="hidden" name="incorrectPincodeMesg" value="<fmt:message key='LOC_INCORRECT_PINCODE_MSG' bundle='${storeText}'/>" id="incorrectPincodeMesg" />
				<input type="hidden" name="errorInAutoDetection" value="<fmt:message key='LOC_ERROR_IN_AUTO_DETECTION' bundle='${storeText}'/>" id="errorInAutoDetection" />
				
				<div>
					<div class="row mobile-footer-none">
						<div class="col-xs-12">
							<h3 class="modal-location-enter"><fmt:message bundle="${storeText}" key="LOC_TEXT_8"/></h3>
							<div class="blurb__content">
								<div><fmt:message bundle="${storeText}" key="LOC_TEXT_9"/><span class="ready-span"><fmt:message bundle="${storeText}" key="LOC_TEXT_10"/></span><fmt:message bundle="${storeText}" key="LOC_TEXT_11"/>&nbsp;<a href="javascript:DMartStaticContent.PUPListDMart();"><fmt:message bundle="${storeText}" key="LOC_TEXT_12"/></a>&nbsp;<fmt:message bundle="${storeText}" key="LOC_TEXT_13"/></div>
							</div>
						</div>			
					</div>
				</div>
				<%-- <div class="blurb blurb--top-border">

					<div class="row">
						<div class="col-xs-8 col-sm-9">
						<h4 class="blurb__title--small"><fmt:message bundle="${storeText}" key="LOC_WHY_LOCATION_SEARCH"/></h4>
							<div class="blurb__content">
								<p><fmt:message bundle="${storeText}" key="LOC_DMART_MESSAGE"/></p>
							</div>
						</div>
						<div class="col-xs-4 col-sm-3">
							<div class="blurb__img blurb__img--no-padding">
								<img class="img-responsive" src="${jspStoreImgDir}images/DMart/temp/location/location-bag.jpg" alt="Location">
							</div>
						</div>
					</div>--%>
				</div>
			</div>
		</div>
	</div>
<!-- </div> -->


