

<!--  BEGIN DmartBreadcrumbTrailGeneric.jsp -->

<%@ include file="/Widgets_701/Common/EnvironmentSetup.jspf" %>

<%@ include file="ext/DmartBreadcrumbTrail_Data.jspf" %>
<c:if test = "${param.custom_data ne 'true'}">
	<%@ include file="DmartBreadcrumbTrailGeneric_Data.jspf" %>
</c:if>


<%@ include file="ext/DmartBreadcrumbTrail_UI.jspf" %>
<c:if test = "${param.custom_view ne 'true'}">
	<%@ include file="DmartBreadcrumbTrail_UI.jspf" %>
</c:if>


<!--  END BreadcrumbTrailGeneric.jsp -->