<%--
 =================================================================
  Licensed Materials - Property of IBM

  WebSphere Commerce

  (C) Copyright IBM Corp. 2008, 2014 All Rights Reserved.

  US Government Users Restricted Rights - Use, duplication or
  disclosure restricted by GSA ADP Schedule Contract with
  IBM Corp.
 =================================================================
--%>

<span class="spanacce" id="orgNameForAcce">
	<fmt:message bundle="${storeText}" key="ORG_CREATE_ORG_NAME"/>${orgEntityDetails.displayName}
</span>
<div id="PageHeader_CreateEditOrganization" style="margin-bottom:0px;" tabindex="0" aria-labelledby="orgNameForAcce">
	<h1 style="padding: 0px 0px;">${orgEntityDetails.displayName}</h1>
</div>

<div class="row">
	<div class="col12">
		<%out.flush();%>
			<c:import url="${env_siteWidgetsDir}com.ibm.commerce.store.widgets.OrganizationSummary/OrganizationSummary.jsp">
				<c:param name="orgSummaryType" value="edit"/>
				<c:param name="orgSummaryBasicEdit" value="true"/>
				<c:param name="orgSummaryAddressEdit" value="true"/>
				<c:param name="orgSummaryContactInfoEdit" value="true"/>
				<c:param name="orgEntityId" value="${orgEntityId}"/>
			</c:import>
		<%out.flush();%>

		<%out.flush();%>
			<c:import url="${env_siteWidgetsDir}com.ibm.commerce.store.widgets.OrganizationMemberApprovalGroups/OrganizationMemberApprovalGroups.jsp"/>
		<%out.flush();%>

		<%out.flush();%>
			<c:import url="${env_siteWidgetsDir}com.ibm.commerce.store.widgets.OrganizationRoles/OrganizationRoles.jsp"/>
		<%out.flush();%>
	</div>
</div>
<input type="hidden" id="authToken" value="${authToken}"/>
<div id="overlay" class="nodisplay"></div>
