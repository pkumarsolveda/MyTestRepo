<%--
 =================================================================
  Licensed Materials - Property of IBM

  WebSphere Commerce

  (C) Copyright IBM Corp. 2014 All Rights Reserved.

  US Government Users Restricted Rights - Use, duplication or
  disclosure restricted by GSA ADP Schedule Contract with
  IBM Corp.
 =================================================================
--%>

<!-- BEGIN GlobalLoginOrganizationAndContract.jsp -->

<%@ include file="/Widgets_701/Common/EnvironmentSetup.jspf" %>
<%@ include file="/Widgets_701/Common/ErrorMessageSetup.jspf" %>
<%@ include file="/Widgets_701/Common/nocache.jspf" %>

<%@ include file="GlobalLoginOrganizationAndContract_Data.jspf" %>

<%-- If shop on behalf option is enabled --%>
<c:choose>
  <c:when test="${env_shopOnBehalfEnabled eq true}">
    <%@ include file="GlobalLoginShopOnBehalfEnabled_UI.jspf" %>
  </c:when>
  <c:otherwise>
    <%@ include file="GlobalLoginShopOnBehalfDisabled_UI.jspf" %>
  </c:otherwise>
</c:choose>	

<!-- END GlobalLoginOrganizationAndContract.jsp -->