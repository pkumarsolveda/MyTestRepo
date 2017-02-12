<%--  The following code is created as an example. Modify the generated code and add any additional required code.  --%>
<%-- BEGIN DMartPDPFrequentlyBoughtWidget.jsp --%>

<%@include file="/Widgets_701/Common/EnvironmentSetup.jspf"%>
<fmt:setBundle basename="/Widgets-DMart/Properties/dmartwidgettext" var="dmartwidgettext" />
<c:set var="widgetPreviewText" value="${dmartwidgettext}"/>
<c:set var="emptyWidget" value="false"/>
	
<%@include file="DMartPDPFrequentlyBoughtWidget_Data.jspf"%>

<c:if test="${env_inPreview && !env_storePreviewLink}">	
	<jsp:useBean id="previewWidgetProperties" class="java.util.LinkedHashMap" scope="page" />
	<c:set target="${previewWidgetProperties}" property="widgetOrientation" value="${param.widgetOrientation}" />
	<c:set target="${previewWidgetProperties}" property="numberOfContentToDisplay" value="${param.numberOfContentToDisplay}" />
</c:if>
<%@ include file="/Widgets_701/Common/StorePreviewShowInfo_Start.jspf" %>

<%@ include file="DMartPDPFrequentlyBoughtWidget_UI.jspf"%>

<%@ include file="/Widgets_701/Common/StorePreviewShowInfo_End.jspf" %>

<%-- END DMartPDPFrequentlyBoughtWidget.jsp --%>
