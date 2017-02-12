<%--
 =================================================================
  Licensed Materials - Property of IBM

  WebSphere Commerce

  (C) Copyright IBM Corp. 2011, 2013 All Rights Reserved.

  US Government Users Restricted Rights - Use, duplication or
  disclosure restricted by GSA ADP Schedule Contract with
  IBM Corp.
 =================================================================
--%>

<!-- BEGIN Header.jsp -->

<%@ include file= "../../Common/EnvironmentSetup.jsp" %>
<%@page import="com.ibm.commerce.foundation.internal.server.services.registry.StoreConfigurationRegistry"%>
<%@page import="com.ibm.commerce.registry.RegistryManager"%>

<%
	StoreConfigurationRegistry scfRegistryVar = (StoreConfigurationRegistry) RegistryManager.singleton().getRegistry("StoreConfigurationRegistry");
	String appDynaDisabled = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Disable.AppDynamics");
	pageContext.setAttribute("appDynaDisabled", appDynaDisabled);
%>
<script type="text/javascript">
var previewToken='';
if(parent.workspacePreviewTokenXhrArgs) {
    var urlUpdated = parent.workspacePreviewTokenXhrArgs.url.replace("{workspaceStoreId}","<c:out value='${WCParam.storeId}'/>")
    parent.workspacePreviewTokenXhrArgs.url = urlUpdated;
    var result = dojo.xhrPost(parent.workspacePreviewTokenXhrArgs);
	previewToken = parent.dmartPreviewToken;
}
</script>

<c:if test="${appDynaDisabled eq '0'}" >
	<script> 
    	window['adrum-start-time']= new Date().getTime(); 
	</script> 
	<script src="${jsAssetsDir}javascript/DMart/AppDynamics/adrum.js">
	</script>
</c:if>



<c:if test="${WCParam.omitHeader != 1}">
	<%@ include file="ext/Header_Data.jspf" %>
	<c:if test = "${param.custom_data ne 'true'}">
		<%@ include file="Header_Data.jspf" %>
	</c:if>

	<%@ include file="ext/Header_UI.jspf" %>
	<c:if test = "${param.custom_view ne 'true'}">
		<%@ include file="Header_UI.jspf" %>
	</c:if>
</c:if>
<jsp:useBean id="Header_TimeStamp" class="java.util.Date" scope="request"/>




<!-- END Header.jsp -->