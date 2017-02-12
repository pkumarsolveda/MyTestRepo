

<!-- BEGIN DmartSubCategoryPageContainer.jsp -->

<%@include file="../Common/EnvironmentSetup.jspf"%>
<%@taglib uri="http://commerce.ibm.com/pagelayout" prefix="wcpgl"%>

<div id="container_${pageDesign.layoutId}">
	<div class="container">
		<div class="row">
			<div class="col-xs-12 col-md-6" data-slot-id="1"><wcpgl:widgetImport slotId="1"/></div>
			<div class="col-xs-12 col-md-6" data-slot-id="2"><wcpgl:widgetImport slotId="2"/></div>
		</div>
	</div>
	<div class="container">
		<div class="row">
			<div data-slot-id="3"><wcpgl:widgetImport slotId="3"/></div>
		</div>
	</div>
	<div class="container">
		<div class="row">
			<div class="col-xs-12" data-slot-id="4"><wcpgl:widgetImport slotId="4"/></div>
		</div>
	</div>
	<div class="container product_container" data-slot-id="5"><wcpgl:widgetImport slotId="5"/></div>
</div>

<!-- END DmartSubCategoryPageContainer.jsp -->
