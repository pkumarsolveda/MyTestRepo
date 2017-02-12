<%--  The following code is created as an example. Modify the generated code and add any additional required code.  --%>
<%-- BEGIN DMartTopCategroyOffersWidget.jsp --%>

<%@ include file="/Widgets_701/Common/EnvironmentSetup.jspf" %>
<fmt:setBundle basename="/Widgets-DMart/Properties/dmartwidgettext" var="dmartwidgettext" />
<c:set var="widgetPreviewText" value="${dmartwidgettext}"/>
<c:set var="emptyWidget" value="false"/>
	
<%@include file="DMartTopCategroyOffersWidget_Data.jspf"%>


<%@ include file="/Widgets_701/Common/StorePreviewShowInfo_Start.jspf" %>

<%@ include file="DMartTopCategroyOffersWidget_UI.jspf"%>

<%@ include file="/Widgets_701/Common/StorePreviewShowInfo_End.jspf" %>

<%-- END DMartTopCategroyOffersWidget.jsp --%>
