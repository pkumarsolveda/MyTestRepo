<%--  The following code is created as an example. Modify the generated code and add any additional required code.  --%>
<%-- BEGIN DmartCatalogEntryListWidget.jsp --%>

<%@include file="/Widgets_701/Common/EnvironmentSetup.jspf"%>
<fmt:setBundle basename="/Widgets-Dmart/Properties/dmartwidgettext" var="dmartwidgettext" />
<c:set var="widgetPreviewText" value="${dmartwidgettext}"/>
<c:set var="emptyWidget" value="false"/>
	
<%@include file="DmartCatalogEntryListWidget_Data.jspf"%>

<c:if test="${env_inPreview && !env_storePreviewLink}">	
	<jsp:useBean id="previewWidgetProperties" class="java.util.LinkedHashMap" scope="page" />
	<c:set target="${previewWidgetProperties}" property="pageView" value="${param.pageView}" />
	<c:set target="${previewWidgetProperties}" property="disableProductCompare" value="${param.disableProductCompare}" />
	<c:set target="${previewWidgetProperties}" property="enableSKUListView" value="${param.enableSKUListView}" />
</c:if>

<%@ include file="/Widgets_701/Common/StorePreviewShowInfo_Start.jspf" %>

<%@ include file="DmartCatalogEntryListWidget_UI.jspf"%>

<%@ include file="/Widgets_701/Common/StorePreviewShowInfo_End.jspf" %>

<%-- END DmartCatalogEntryListWidget.jsp --%>
