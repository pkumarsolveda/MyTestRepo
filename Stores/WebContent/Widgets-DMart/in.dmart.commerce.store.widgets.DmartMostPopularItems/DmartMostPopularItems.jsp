<%--  The following code is created as an example. Modify the generated code and add any additional required code.  --%>
<%-- BEGIN DmartMostPopularItems.jsp --%>

<%@include file="/Widgets_701/Common/EnvironmentSetup.jspf"%>
<fmt:setBundle basename="/Widgets-DMart/Properties/mywidgettext" var="mywidgettext" />
<c:set var="widgetPreviewText" value="${mywidgettext}"/>
<c:set var="emptyWidget" value="false"/>
	
<%@include file="DmartMostPopularItems_Data.jspf"%>


<%@ include file="/Widgets_701/Common/StorePreviewShowInfo_Start.jspf" %>

<%@ include file="DmartMostPopularItems_UI.jspf"%>

<%@ include file="/Widgets_701/Common/StorePreviewShowInfo_End.jspf" %>

<%-- END DmartMostPopularItems.jsp --%>
