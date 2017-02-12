<%--
 =================================================================
  Licensed Materials - Property of IBM

  WebSphere Commerce

  (C) Copyright IBM Corp. 2011, 2014 All Rights Reserved.

  US Government Users Restricted Rights - Use, duplication or
  disclosure restricted by GSA ADP Schedule Contract with
  IBM Corp.
 =================================================================
--%>

<!doctype HTML>

<!-- BEGIN ProductDisplay.jsp -->

<%-- 
  *****
  * This JSP diplay the product details given a productId or partNumber. This page imports the following components
  * Header Component - Display header links, department widget, mini shop-cart widget and Search widget
  * Product Image Component - Display the product image
  * Product Description Component - Displays product short description, attributes, inventory component, price component etc.,
  * Merchandising Association Component
  * E-spots for Recently Viewed and Recommendations
  * Product TAB component
  * Footer Component - Display footer links
  *****
--%>

<%@include file="../../../Common/EnvironmentSetup.jspf" %>
<%@include file="../../../Common/nocache.jspf" %>

<wcf:url var="ProductDisplayURL" patternName="DmartProductURL" value="Product1">
	<wcf:param name="langId" value="${langId}" />
	<wcf:param name="storeId" value="${storeId}" />
	<wcf:param name="catalogId" value="${catalogId}" />
	<wcf:param name="productId" value="${productId}" />
	<wcf:param name="urlLangId" value="${urlLangId}" />
</wcf:url>
<c:set var="pageCategory" value="Browse" scope="request"/>

<c:if test="${!empty productId}">
	<%-- Since this is a product page, get all the details about this product and save it in internal cache, so that other components can use it... --%>

	<wcf:rest var="catalogNavigationView" url="${searchHostNamePath}${searchContextPath}/store/${WCParam.storeId}/productview/byId/${productId}" >	
		<wcf:param name="langId" value="${langId}"/>
		<wcf:param name="currency" value="${env_currencyCode}"/>
		<wcf:param name="responseFormat" value="json"/>		
		<wcf:param name="catalogId" value="${WCParam.catalogId}"/>
		<c:forEach var="contractId" items="${env_activeContractIds}">
			<wcf:param name="contractId" value="${contractId}"/>
		</c:forEach>
	</wcf:rest>
	<%-- Cache it in our internal hash map --%>
	<c:set var="key1" value="${productId}+getCatalogEntryViewAllByID"/>
	<wcf:set target = "${cachedCatalogEntryDetailsMap}" key="${key1}" value="${catalogNavigationView.catalogEntryView[0]}"/>

	<wcf:rest var="getPageResponse" url="store/{storeId}/page">
		<wcf:var name="storeId" value="${storeId}" encode="true"/>
		<wcf:param name="langId" value="${langId}"/>
		<wcf:param name="q" value="byCatalogEntryIds"/>
		<wcf:param name="catalogEntryId" value="${productId}"/>
	</wcf:rest>
	<c:set var="page" value="${getPageResponse.resultList[0]}"/>
	
	<c:if test="${!empty catalogNavigationView && !empty catalogNavigationView.catalogEntryView[0]}">
		<c:set var="catalogEntryDetails" value="${catalogNavigationView.catalogEntryView[0]}"/>
	</c:if>
	
	<c:set var="parentCatEntryId" value="${catalogNavigationView.catalogEntryView[0].parentCatalogEntryID}" scope="request"/>
	<%-- If parentCateEntryId is not empty, then this is an item and not a product --%>
	<c:if test="${not empty parentCatEntryId}">
		<%-- Since this is an item, get all the details about the parent product and save it in internal cache, so that other components can use it... --%>

		<wcf:rest var="parentCatalogNavigationView" url="${searchHostNamePath}${searchContextPath}/store/${WCParam.storeId}/productview/byId/${parentCatEntryId}" >	
				<wcf:param name="langId" value="${WCParam.langId}"/>
				<wcf:param name="currency" value="${env_currencyCode}"/>
				<wcf:param name="responseFormat" value="json"/>		
				<wcf:param name="catalogId" value="${WCParam.catalogId}"/>
				<c:forEach var="contractId" items="${env_activeContractIds}">
					<wcf:param name="contractId" value="${contractId}"/>
				</c:forEach>
		</wcf:rest>
		
		<%-- Check if the parent is a product and not package or bundle --%>
		<c:if test="${parentCatalogNavigationView.catalogEntryView[0].catalogEntryTypeCode eq 'ProductBean'}">
			<%-- Keep all the defining attributes and its value in WCParam so that it will be selected by default --%>
			<c:forEach var="attribute" items="${catalogNavigationView.catalogEntryView[0].attributes}">
				<c:if test="${attribute.usage eq 'Defining'}">
					<c:set target="${WCParam}" property="${attribute.name}" value="${attribute.values[0].value}"/>
				</c:if>
			</c:forEach>
			
			<%-- So that the parent page can be displayed instead of item page and pre select the values correspoding to the item --%>
			<c:set var="catalogNavigationView" value="${parentCatalogNavigationView}" />
			<c:set var="productId" value="${parentCatEntryId}" scope="request"/>
			<c:set var="catalogEntryDetails" value="${catalogNavigationView.catalogEntryView[0]}"/>
			
			<%-- Cache parent catalog entry in our internal hash map --%>
			<c:set var="key1" value="${productId}+getCatalogEntryViewAllByID"/>
			<wcf:set target = "${cachedCatalogEntryDetailsMap}" key="${key1}" value="${catalogNavigationView.catalogEntryView[0]}"/>
		</c:if>
	</c:if>
	
</c:if>
<fmt:setBundle basename="/${sdb.jspStoreDir}/storetext_v2" var="storeText" scope="request"/>
<c:set var="pageTitle" value="${page.title}" />
<c:set var="metaDescription" value="${page.metaDescription}" />
<c:set var="metaKeyword" value="${page.metaKeyword}" />
<fmt:message var="metaRobot" key="SEO_ROBOTS" bundle="${storeText}"/>
<fmt:message var="metaRevisit" key="SEO_REVISIT_AFTER" bundle="${storeText}"/>
<c:set var="fullImageAltDescription" value="${page.fullImageAltDescription}" scope="request" />
<c:set var="categoryId" value="${catalogNavigationView.catalogEntryView[0].parentCatalogGroupID}"/>
<c:set var="partNumber" value="${catalogNavigationView.catalogEntryView[0].partNumber}" scope="request"/>
<c:if test="${ empty partNumber}">
	<c:set var="partNumber" value="${page.partNumber}" scope="request"/>
</c:if>
<c:set var="search" value='"'/>
<c:set var="search01" value="'"/>
<c:set var="replaceStr" value='\\\\"'/>
<c:set var="replaceStr01" value="\\\\'"/>

<c:set var="type" value="${fn:toLowerCase(catalogEntryDetails.catalogEntryTypeCode)}" />
<c:set var="type" value="${fn:replace(type,'bean','')}" />
<c:choose>
	<c:when test="${type == 'item'}">
		<c:set var="pageGroup" value="Item" scope="request"/>
	</c:when>
	<c:otherwise>
		<c:set var="pageGroup" value="Product" scope="request"/>
	</c:otherwise>
</c:choose>

<wcf:rest var="getPageDesignResponse" url="store/{storeId}/page_design">
	<wcf:var name="storeId" value="${storeId}" encode="true"/>
	<wcf:param name="catalogId" value="${catalogId}"/>
	<wcf:param name="langId" value="${langId}"/>
	<wcf:param name="q" value="byObjectIdentifier"/>
	<wcf:param name="objectIdentifier" value="${productId}"/>
	<wcf:param name="deviceClass" value="${deviceClass}"/>
	<wcf:param name="pageGroup" value="${pageGroup}"/>
</wcf:rest>
<c:set var="pageDesign" value="${getPageDesignResponse.resultList[0]}" scope="request"/>
<c:set var="PAGE_DESIGN_DETAILS_JSON_VAR" value="pageDesign" scope="request"/>

<%-- Special case when part of both master and sales catalog, categoryId returned is an array --%>
<c:set var="numParentCategories" value="0" />
<c:forEach var="aParentCategory" items="${categoryId}">
	<c:set var="numParentCategories" value="${numParentCategories+1}" />
</c:forEach>
<c:if test="${numParentCategories>1}">
	<c:set var="categoryId" value="${fn:split(categoryId[0], '_')[1]}"/>
</c:if>

<wcf:rest var="subCategory" url="${searchHostNamePath}${searchContextPath}/store/${WCParam.storeId}/categoryview/byId/${categoryId}" >	
	<wcf:param name="langId" value="${WCParam.langId}"/>
	<wcf:param name="currency" value="${env_currencyCode}"/>
	<wcf:param name="responseFormat" value="json"/>		
	<wcf:param name="catalogId" value="${WCParam.catalogId}"/>
	<c:forEach var="contractId" items="${env_activeContractIds}">
		<wcf:param name="contractId" value="${contractId}"/>
	</c:forEach>
</wcf:rest>

<c:set var="emsNameLocalPrefix" value="${fn:replace(subCategory.catalogGroupView[0].identifier,' ','')}" scope="request"/>
<c:set var="emsNameLocalPrefix" value="${fn:replace(emsNameLocalPrefix,'\\\\','')}"/>

<html xmlns:wairole="http://www.w3.org/2005/01/wai-rdf/GUIRoleTaxonomy#"
<flow:ifEnabled feature="FacebookIntegration">
	<%-- Facebook requires this to work in IE browsers --%>
	xmlns:fb="http://www.facebook.com/2008/fbml" 
	xmlns:og="http://opengraphprotocol.org/schema/"
</flow:ifEnabled>
xmlns:waistate="http://www.w3.org/2005/07/aaa" lang="${shortLocale}" xml:lang="${shortLocale}">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><c:out value="${pageTitle}"/></title>
		<meta name="viewport" content="<c:out value="${viewport}"/>"/>
		<meta name="description" content="<c:out value="${metaDescription}"/>"/>
		<meta name="keywords" content="<c:out value="${metaKeyword}"/>"/>
		<meta name="robots" content="<c:out value="${metaRobot}"/>"/>
		<meta name="revisit-after" content="<c:out value="${metaRevisit}"/>"/>
		<meta name="pageIdentifier" content="<c:out value="${partNumber}"/>"/>
		<meta name="pageId" content="<c:out value="${productId}"/>"/>
		<meta name="pageGroup" content="<c:out value="${pageGroup}"/>"/>
	    <link rel="canonical" href="<c:out value="${ProductDisplayURL}"/>" />
		
		<!--Main Stylesheet for browser -->
		<link rel="stylesheet" href="${jspStoreImgDir}${env_vfileStylesheet}" type="text/css" media="screen"/>
		<!-- Style sheet for print -->
		<link rel="stylesheet" href="${jspStoreImgDir}${env_vfileStylesheetprint}" type="text/css" media="print"/>
		
		<!-- Include script files -->
		<%@include file="../../../Common/CommonJSToInclude.jspf" %>
		<%@include file="../../../Common/DMartCommonJSToInclude.jspf" %>
		<%-- 	<script type="text/javascript" src="${jsAssetsDir}javascript/CommonContextsDeclarations.js"></script>
		<script type="text/javascript" src="${jsAssetsDir}javascript/CommonControllersDeclaration.js"></script>
		<script type="text/javascript" src="${jsAssetsDir}javascript/Widgets/collapsible.js"></script>--%>
		<script type="text/javascript">
			dojo.addOnLoad(function() { 
					shoppingActionsServicesDeclarationJS.setCommonParameters('<c:out value="${langId}" />','<c:out value="${storeId}" />','<c:out value="${catalogId}" />');
				});
			<c:if test="${!empty requestScope.deleteCartCookie && requestScope.deleteCartCookie[0]}">					
					document.cookie = "WC_DeleteCartCookie_${requestScope.storeId}=true;path=/";				
				</c:if>
		</script>
		
		<flow:ifEnabled feature="FacebookIntegration">
			<%@include file="../../../Common/JSTLEnvironmentSetupExtForFacebook.jspf" %>
			
			<%--Facebook Open Graph tags that are required  --%>
			<meta property="og:title" content="<c:out value="${pageTitle}"/>" />
			
			<c:choose>
				<c:when test="${!empty catalogEntryDetails.thumbnail}">
					<c:choose>
						<c:when test="${(fn:startsWith(catalogEntryDetails.thumbnail, 'http://') || fn:startsWith(catalogEntryDetails.thumbnail, 'https://'))}">
							<wcst:resolveContentURL var="imagePath" url="${catalogEntryDetails.thumbnail}" includeHostName="true"/>
						</c:when>
						<c:otherwise>
							<c:set var="imagePath" value="${catalogEntryDetails.thumbnail}" />
						</c:otherwise>
					</c:choose>
				</c:when>				
				<c:when test="${!empty catalogEntryDetails.fullImage}">
					<c:choose>
						<c:when test="${(fn:startsWith(catalogEntryDetails.fullImage, 'http://') || fn:startsWith(catalogEntryDetails.fullImage, 'https://'))}">
							<wcst:resolveContentURL var="imagePath" url="${catalogEntryDetails.fullImage}" includeHostName="true"/>
						</c:when>
						<c:otherwise>
							<c:set var="imagePath" value="${catalogEntryDetails.fullImage}" />
						</c:otherwise>
					</c:choose>
				</c:when>
				<c:otherwise>
					<c:set var="imagePath" value="${jspStoreImgDir}images/logo.png" />
				</c:otherwise>
			</c:choose>
			<c:if test="${(!fn:startsWith(imagePath, 'http://') && !fn:startsWith(imagePath, 'https://'))}">
				<c:set var="imagePath" value="${schemeToUse}://${request.serverName}${portUsed}${imagePath}"/>
			</c:if>
			<meta property="og:image" content="<c:out value="${imagePath}" />"/>
			
			<meta property="og:url" content="<c:out value="${ProductDisplayURL}"/>"/>
			<meta property="og:type" content="product"/>
			<meta property="og:description" content="<c:out value="${metaDescription}"/>" />
			<meta property="fb:app_id" name="fb_app_id" content="<c:out value="${facebookAppId}"/>"/>
		</flow:ifEnabled>
		
			<wcpgl:jsInclude/>
	</head>
		
	<body>
		<%-- This file includes the progressBar mark-up and success/error message display markup --%>
		<%@ include file="../../../Common/CommonJSPFToInclude.jspf"%>
		
<c:set var="catalogEntryID" value="${catalogEntryDetails.uniqueID}" />
<c:set var="entitledItems" value="${catalogEntryDetails.sKUs}"/>
<c:set var="numberOfSKUs" value="${catalogEntryDetails.numberOfSKUs}"/>
<c:set var="attributes" value="${catalogEntryDetails.attributes}"/>

<div id="entitledItem_<c:out value='${catalogEntryID}'/>" style="display:none;">
		[
		<c:if test="${type == 'product'}">

				<%-- SwatchCode start --%>
				<c:if test="${!empty entitledItems}">
				<%-- Find out if we have angle image attachments in the product, if there is then we should retrieve that for all items. --%>
					<%-- Otherwise, we can use a lighter service. --%>
					<c:set var="hasAngleImages" value="false" />
					<c:set var="allAttachments" value="${catalogEntryDetails.attachments}" />
					<c:forEach var="anAttachment" items="${allAttachments}">
						<c:if test="${'ANGLEIMAGES_THUMBNAIL' eq anAttachment.usage}">
							<c:set var="hasAngleImages" value="true" />
						</c:if>
					</c:forEach>
				</c:if>
				<%-- SwatchCode end --%>

				<c:forEach var='entitledItem' items='${entitledItems}' varStatus='outerStatus'>
					<c:if test="${entitledItem.buyable eq 'true'}">
						<c:set var="sku" value="${entitledItem}"/>
						<c:set var="skuID" value="${entitledItem.uniqueID}"/>
	
						{
						"catentry_id" : "<c:out value='${skuID}' />",
						"Attributes" :	{
							<c:set var="hasAttributes" value="false"/>											
							<c:forEach var="definingAttrValue2" items="${sku.attributes}" varStatus="innerStatus">
								<c:if test="${definingAttrValue2.usage == 'Defining'}">
									<c:if test='${hasAttributes eq "true"}'>,</c:if>
									"<c:out value="${fn:replace(definingAttrValue2.name, search01, replaceStr01)}_${fn:replace(fn:replace(definingAttrValue2.values[0].value, search01, replaceStr01), search, replaceStr)}" />":"<c:out value='${innerStatus.count}' />"
									<c:set var="hasAttributes" value="true"/>
								</c:if>
							</c:forEach>
							},
							
							<%-- SwatchCode start --%>
																
							<c:set var="catalogEntryViewItemDetails" value="${catalogEntryDetails.sKUs}"/>
						
			
							<c:forEach items = "${catalogEntryViewItemDetails}" var="itemDetail">
								
										<c:if test="${!empty itemDetail.thumbnail}">
											<c:choose>
												<c:when test="${(fn:startsWith(itemDetail.thumbnail, 'http://') || fn:startsWith(itemDetail.thumbnail, 'https://'))}">
													<wcst:resolveContentURL var="thumbnailImage" url="${itemDetail.thumbnail}"/>
												</c:when>
												<c:otherwise>
													<c:set var="thumbnailImage" value="${itemDetail.thumbnail}" />
												</c:otherwise>
											</c:choose>
											<c:set var="itemFullImagePath" value="${fn:replace(thumbnailImage, productThumbnailImage, productMasterImage)}" />
										</c:if>
								
							
								<c:if test="${empty itemFullImagePath}">
										<c:set var="itemFullImagePath" value="${hostPath}${jspStoreImgDir}images/NoImageIcon.jpg"/>
								</c:if>
								
								<c:if test="${itemDetail.uniqueID == entitledItem.uniqueID}">
									"ItemImage" : "<c:out value='${itemFullImagePath}' />",
									"ItemImage467" : "<c:out value='${itemFullImagePath}' />",
									"ItemThumbnailImage" : "<c:out value='${fn:replace(itemFullImagePath, productMasterImage, productThumbnailImage)}' />"
									<c:if test="${fn:length(itemDetail.attachments) > 0}">
										,"ItemAngleThumbnail" : {
										<c:set var="imageCount" value="0" />
										<c:forEach var="itemAttachment" items="${itemDetail.attachments}" varStatus="status1">
											<c:if test="${itemAttachment.usage == 'ANGLEIMAGES_THUMBNAIL'}">
												<c:if test='${imageCount gt 0}'>,</c:if>
												<c:set var="imageCount" value="${imageCount+1}" />
												<c:choose>
													<c:when test="${(fn:startsWith(itemAttachment.attachmentAssetPath, 'http://') || fn:startsWith(itemAttachment.attachmentAssetPath, 'https://'))}">
														<wcst:resolveContentURL var="resolvedPath" url="${itemAttachment.attachmentAssetPath}"/>
													</c:when>
													<c:otherwise>
														<c:set var="resolvedPath" value="${env_imageContextPath}/${itemAttachment.attachmentAssetPath}" />
													</c:otherwise>
												</c:choose>
												"image_${imageCount}" : "<c:out value='${resolvedPath}' />"
											</c:if>
										</c:forEach>
										},
										"ItemAngleThumbnailShortDesc" : {
										<c:set var="imageCount" value="0" />
										<c:forEach var="itemAttachment" items="${itemDetail.attachments}" varStatus="status1">
											<c:if test="${itemAttachment.usage == 'ANGLEIMAGES_THUMBNAIL'}">
												<c:if test='${imageCount gt 0}'>,</c:if>
												<c:set var="imageCount" value="${imageCount+1}" />
												"image_${imageCount}" : "<c:out value='${itemAttachment.identifier}' />"
											</c:if>
										</c:forEach>
										},										
										"ItemAngleFullImage" : {
										<c:set var="imageCount" value="0" />
										<c:forEach var="itemAttachment" items="${itemDetail.attachments}" varStatus="status2">
											<c:set var="imgSource" value="${itemAttachment.attachmentAssetPath}" />
											<c:if test="${itemAttachment.usage == 'ANGLEIMAGES_FULLIMAGE'}">
												<c:if test='${imageCount gt 0}'>,</c:if>
												<c:set var="imageCount" value="${imageCount+1}" />
												<c:choose>
													<c:when test="${(fn:startsWith(imgSource, 'http://') || fn:startsWith(imgSource, 'https://'))}">
														<wcst:resolveContentURL var="imgSource" url="${imgSource}"/>
													</c:when>
													<c:otherwise>
														<c:set var="imgSource" value="${env_imageContextPath}/${imgSource}" />
													</c:otherwise>
												</c:choose>
												"image_${imageCount}" : "<c:out value='${imgSource}' />"
											</c:if>
										</c:forEach>
										}
									</c:if>
								</c:if>
							</c:forEach>
							<%-- SwatchCode end --%>
						}<c:if test='${!outerStatus.last}'>,</c:if>
					</c:if>
				</c:forEach>
			
		</c:if>
		<c:if test="${type == 'package' || type == 'bundle' || type == 'item' || type == 'dynamickit'}">
			{
			"catentry_id" : "<c:out value='${catalogEntryID}'/>",
			"Attributes" :	{ }
			}
		</c:if>
		]
</div>

	
		<!-- Begin Page -->						
		<c:set var="layoutPageIdentifier" value="${productId}"/>
		<c:set var="layoutPageName" value="${partNumber}"/>
		<%@ include file="/Widgets_701/Common/ESpot/LayoutPreviewSetup.jspf"%>
				
		<div id="page">
			<div id="grayOut"></div>
			<div id="headerWrapper">
				<%out.flush();%>
				<c:import url = "${env_jspStoreDir}Widgets/Header/Header.jsp" />
				<%out.flush();%>
			</div>
			
			<c:set var="rootWidget" value="${pageDesign.widget}"/>
			<wcpgl:widgetImport uniqueID="${rootWidget.widgetDefinitionId}" debug=false/>
			
			
				<%out.flush();%>
				<c:import url="${env_jspStoreDir}Widgets/Footer/Footer.jsp"/>
				<%out.flush();%>
			
		</div>
		
		<flow:ifEnabled feature="Analytics">
			<%@include file="../../../AnalyticsFacetSearch.jspf" %>
			<cm:product catalogNavigationViewJSON="${catalogNavigationView}" extraparms="null, ${analyticsFacet}"/>
			<cm:pageview pageType="wcs-productdetail"/>
		</flow:ifEnabled>
	<%@ include file="../../../Common/JSPFExtToInclude.jspf"%> </body>

<wcpgl:pageLayoutCache pageLayoutId="${pageDesign.layoutId}"/>
<!-- END ProductDisplay.jsp -->		
</html>
