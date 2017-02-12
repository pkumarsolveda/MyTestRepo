<%--
 =================================================================
  Copyright(c) Avenue E-Commerce Limited (2015). All Rights reserved. 
  This software is the confidential and proprietary information of 
  Avenue E-Commerce Limited ("Confidential  Information"). 
  You shall not disclose such Confidential Information and shall use it 
  only in accordance with the terms of the license agreement you entered  
  into with Avenue E-Commerce Limited.

	Author Name : Infosys
	Date : 11/9/2015

 =================================================================
--%>

<!-- BEGIN DmartTopCategoryRecommendation.jsp -->

<%@ include file="/Widgets_701/Common/EnvironmentSetup.jspf" %>
<%@ include file="/Widgets_701/Common/JSTLEnvironmentSetupExtForRemoteWidgets.jspf"%>

<%@ include file="ext/DmartTopCategoryRecommendation_Data.jspf" %>
<c:if test = "${param.custom_data ne 'true'}">
	<%@ include file="DmartTopCategoryRecommendation_Data.jspf" %>
</c:if>

<c:set var="uniqueID" value="${eSpotDatas.marketingSpotIdentifier}"/>
<c:set var="espotName" value="${fn:replace(emsName,' ','')}"/>
<c:set var="espotName" value="${fn:replace(espotName,'\\\\','')}"/>
<c:set var="espotName" value="${fn:replace(espotName,'\"','')}"/>

<c:if test="${env_inPreview && !env_storePreviewLink && empty ignorePreview}">	
	<c:if test="${empty categoryIdMap}">
		<c:set var="eSpotHasNoSupportedDataToDisplay" value="true"/>
	</c:if>
	<jsp:useBean id="previewWidgetProperties" class="java.util.LinkedHashMap" scope="page" />
	<c:set target="${previewWidgetProperties}" property="widgetOrientation" value="${param.widgetOrientation}" />	
	<c:if test="${param.widgetOrientation eq 'vertical'}" >
		<c:set target="${previewWidgetProperties}" property="pageSize" value="${param.pageSize}" />
	</c:if>
	<c:if test="${param.widgetOrientation eq 'horizontal' }">
		<c:set var="preference"><fmt:message key="displayPreference_${param.displayPreference}" bundle="${widgetText}" /></c:set>
		<c:set target="${previewWidgetProperties}" property="displayPreference" value="${preference}" />
	</c:if>
	<c:set target="${previewWidgetProperties}" property="showFeed" value="${param.showFeed}" />	
	<c:set var="widgetManagedByMarketing" value="true" />
	<%@ include file="/Widgets_701/Common/StorePreviewShowInfo_Start.jspf" %>
</c:if>

<%@ include file="ext/DmartTopCategoryRecommendation_UI.jspf" %>
<c:if test = "${param.custom_view ne 'true' && !empty categoryImageMap}">
	<c:if test = "${param.showFeed eq 'true'}">
		<c:url var="eMarketingFeedURL" value="${restURLScheme}://${pageContext.request.serverName}:${restURLPort}${restURI}/stores/${storeId}/MarketingSpotData/${emsName}">
			<c:param name="responseFormat" value="atom" />
			<c:param name="langId" value="${langId}" />
			<c:param name="currency" value="${env_currencyCode}"/>
		</c:url>
		<%-- 
			Set this key ${emsName} to true in this map, will tell EMarketingSpot.jsp to 
			set showFeed to false for the other widgets in the same espot. We only need to
			show one feed icon and url for one EMarketingSpot.
		--%>
		<c:if test="${eSpotRssFeedEnabled != null }" >
			<c:set target="${eSpotRssFeedEnabled }" property="${emsName}" value="true" />
		</c:if>
	</c:if>
	<c:choose>
		<c:when test="${param.widgetOrientation eq 'vertical'}">
			<%@include file="DmartTopCategoryRecommendation_Vertical_UI.jspf"%>
		</c:when>
		<c:otherwise>
			<%@ include file="DmartTopCategoryRecommendation_UI.jspf" %>
		</c:otherwise>
	</c:choose>
	<%-- 
		 A ESpot widget can have Content, CatlogEntry, and Category recommendations, the ${eSpotTitleIncluded} 
		 is used to make sure that the ESpost title only display once.
	--%>
	<c:if test="${ eSpotTitleIncluded == null}" >
		<jsp:useBean id="eSpotTitleIncluded" class="java.util.LinkedHashMap" scope="request" />
	</c:if>
	<c:if test="${empty eSpotTitleIncluded[emsName] }" >
		<c:set target="${eSpotTitleIncluded }" property="${emsName}" value="true" />
	</c:if>
</c:if>
<c:if test="${empty ignorePreview}">
<%@ include file="/Widgets_701/Common/StorePreviewShowInfo_End.jspf" %>
</c:if>
<wcpgl:pageLayoutWidgetCache/>
<!-- END DmartTopCategoryRecommendation.jsp -->