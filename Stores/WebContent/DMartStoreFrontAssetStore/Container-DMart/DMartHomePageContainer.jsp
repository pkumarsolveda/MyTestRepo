

<!-- BEGIN DmartSubCategoryPageContainer.jsp -->

<%@include file="../Common/EnvironmentSetup.jspf"%>
<%@taglib uri="http://commerce.ibm.com/pagelayout" prefix="wcpgl"%>
<script>
$(document).ready(function(){
	<fmt:message bundle="${storeText}" key="_ERR_USER_NOT_LOGGED_IN" var="_ERR_USER_NOT_LOGGED_IN"/>
	<fmt:message bundle="${storeText}" key="_ERR_MAX_QTY_ERROR" var="_ERR_MAX_QTY_ERROR"/>
	
	MessageHelper.setMessage("_ERR_USER_NOT_LOGGED_IN", <wcf:json object="${_ERR_USER_NOT_LOGGED_IN}"/>);
	MessageHelper.setMessage("_ERR_MAX_QTY_ERROR", <wcf:json object="${_ERR_MAX_QTY_ERROR}"/>);
	
	// Adjusting heights and removing unwanted classes from OOTB containers
	$('.landing-banner').parents('.contentRecommendationWidget').css('margin-top','0px');
	$('.landing-quick-shop').parents('.contentRecommendationWidget').removeClass('contentRecommendationWidget');
	$('.landing-quick-shop').parents('.left_espot').removeClass('left_espot');
	$('.landing-banner').parents('.contentRecommendationWidget').removeClass('contentRecommendationWidget');
	$('.landing-banner').parents('.left_espot').removeClass('left_espot');
});
</script>

<div id="container_${pageDesign.layoutId}" class="rowContainer" style="padding:0px;">
	<div id="positionError" style="display:none;padding-top:20px;"></div>
		<div class="container" id="error-msg-container">
			<div class="row">
				<div class="col-xs-12">
					<div class="alert alert-warning-bg js-alert-order"
						style="display: none;">
						<strong><i class="icon-notification"></i> <fmt:message
								bundle="${storeText}" key="MSG_NOTIFCATION" /> </strong> <span
							id="generic-error-section"> </span> <a
								class="alert-close-cta js-cart-reject align-right alert-cross-pos"
								href="javascript:;" title="Close"><i
									class="icon-cta-close icon-cancel"></i> </a>
					</div>
				</div>
			</div>
		</div>

	<div class="container" style=" max-width: 100%; padding: 0px;">
		<div class="row margin-true" >
			<div class="col12" data-slot-id="1"><wcpgl:widgetImport slotId="1"/></div>
		</div>
	</div>
	<div class="container">
		<div class="row">
			<div class="col-xs-12 col-md-8 col-lg-9" data-slot-id="2"><wcpgl:widgetImport slotId="2"/></div>
			<div class="col-xs-12 col-md-4 col-lg-3" data-slot-id="3"><wcpgl:widgetImport slotId="3"/></div>
		</div>
	</div>
	<div data-slot-id="4"><wcpgl:widgetImport slotId="4"/></div>
	<div class="container">
		<div class="row">
			<div class="col12" data-slot-id="5"><wcpgl:widgetImport slotId="5"/></div>
		</div>
	</div>
	
		
</div>

<!-- END DmartSubCategoryPageContainer.jsp -->
