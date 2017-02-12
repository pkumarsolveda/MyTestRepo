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
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://commerce.ibm.com/base" prefix="wcbase" %>
<%@ taglib uri="http://commerce.ibm.com/foundation" prefix="wcf" %>  
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="flow.tld" prefix="flow" %>
<%@ taglib uri="http://commerce.ibm.com/coremetrics"  prefix="cm" %>
<%@ include file="../Common/nocache.jspf" %>
<%@ include file="../Common/EnvironmentSetup.jspf" %>

<!DOCTYPE HTML>
<html>
<!-- Begin DmartSiteMap.jsp -->			
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Sitemap products - DMart</title>
	
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,user-scalable=no">
	
	<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600" rel="stylesheet" type="text/css">
	<link rel="stylesheet" href="/wcsstore/DMartStoreFrontAssetStore/css/common1_1.css" type="text/css"/>
	<link rel="stylesheet" href="<c:out value="${jspStoreImgDir}${env_vfileStylesheet}"/>" type="text/css"/>
	
	<%@ include file="../Common/CommonJSToInclude.jspf"%>
	<c:set var="pageGroup" value="Common" />
	<%@include file="../Common/DMartCommonJSToInclude.jspf" %>
	<script type="text/javascript" src="${jsVersionFolder}javascript/DMart/sitemap.js"></script>
	<script type="text/javascript">
		function popupWindow(URL) {
			window.open(URL, "mywindow", "status=1,scrollbars=1,resizable=1");
		}
	</script>  
	<%@ include file="../Common/CommonJSPFToInclude.jspf"%>
</head>
		
<body>		
	<div id="page">
		<div class="header_wrapper_position" id="headerWidget">
			<%out.flush();%>
			<c:import url = "${env_jspStoreDir}/Widgets/Header/Header.jsp" />
			
			<%out.flush();%>
		</div>
		<c:set var="subcategoryLimit" value="12"/>
		<c:set var="depthAndLimit" value="${subcategoryLimit + 1},${subcategoryLimit + 1}"/>
		<wcf:rest var="categoryHierarchy" url="${searchHostNamePath}${searchContextPath}/store/${WCParam.storeId}/categoryview/@top" >
			<c:if test="${empty WCParam.langId}">
				<wcf:param name="langId" value="${langId}"/>
			</c:if>
			<wcf:param name="responseFormat" value="json"/>
			<wcf:param name="depthAndLimit" value="${depthAndLimit}"/>		
		</wcf:rest>
		<wcf:rest var="catalogEntryViewForOffers" url="${searchHostNamePath}${searchContextPath}/store/${WCParam.storeId}/productview/bySearchTerm/*" >
				<wcf:param name="facet" value="promotion_Store:(10101 ${WCParam.storeId})"/>
			<c:if test="${empty profileName}">
				<wcf:param name="profileName" value="X_findOfferProductsBySearchTerm_DMART"/>
			</c:if>
			<wcf:param name="responseFormat" value="json"/>
		</wcf:rest>
		<div class="sitemap-headsectn">
			<div class="container">
				<h2 class="sitemap-heading">Sitemap</h2>
				<div class="row">
					<c:forEach var="department" items="${categoryHierarchy.catalogGroupView}">
						<c:if test="${!empty department.catalogGroupView}">
							<div class="col-md-3 col-sm-6 col-xs-6 col-details">
					        	<a href="#prohead_${department.uniqueID}">
					         		<c:out value="${department.name}"/>
					        	</a>
					        </div>
				        </c:if>
			       	</c:forEach>
			       	<c:if test="${catalogEntryViewForOffers.recordSetTotal > 0}">
			       	<div class="col-md-3 col-sm-6 col-xs-6 col-details">
			        	<a href="#prohead_offers">
			         		<fmt:message bundle="${storeText}" key="OFFERS_TEXT"/>
			        	</a>
			        </div>
			        </c:if>
		       	</div>
				<div class="area-separt">
					<div class="row">
						<div class="col-md-3 col-sm-6 col-xs-6 col-details">
						    <a href="${env_TopCategoriesDisplayURLHierarchy}/dmart-area-pup">Area Served</a>
					    </div>
					    <div class="col-md-3 col-sm-6 col-xs-6 col-details">
					    	<a href="${env_TopCategoriesDisplayURLHierarchy}/dmart-area-pup">Pickup Points</a>
					    </div>
					</div>
				</div>
			</div>
		</div>
		<div class="sitemap-productdetails" style="margin-top: 382px;">
			<div class="container">
				<jsp:useBean id="categoryURLMap" class="java.util.HashMap"/>
				<c:forEach var="department" items="${categoryHierarchy.catalogGroupView}" varStatus="levelOneCount">
					<wcf:url var="categoryURL" value="Category3" patternName="DmartCanonicalCategoryURL">
						<wcf:param name="storeId" value="${storeId}"/>
						<wcf:param name="catalogId" value="${catalogId}"/>		
						<wcf:param name="langId" value="${langId}"/>
						<wcf:param name="urlLangId" value="${urlLangId}"/>
						<wcf:param name="categoryId" value="${department.uniqueID}"/>
						<wcf:param name="pageView" value="${env_defaultPageView}"/>
						<wcf:param name="beginIndex" value="0"/>
					</wcf:url>
					<c:set target="${categoryURLMap}" property="${department.uniqueID}" value="${categoryURL}"/>
					
					<c:if test="${!empty department.catalogGroupView}">
						<div class="site-map-l1-head" id="prohead_${department.uniqueID}">
							<div class="prohead">
					           <span class="scolling-span">
					           		<c:out value="${department.name}"/>
					           </span>
					        </div>
					        <div class="row">
					        	<c:set var="l2Count" value="1"/>
					        	<c:forEach var="category" items="${department.catalogGroupView}" varStatus="levelTwoCount">
					        		<c:if test="${levelTwoCount.count % 2 != 0}">
					        			<%-- Conditional divs for col-xs-12 col-sm-12 col-md-6 site-map-l2-div and row 
					        				- condition added to make the structure and styles in sync with the htmls provided --%>
										<div class="col-xs-12 col-sm-12 col-md-6 site-map-l2-div">
					        			<div class="row">
									</c:if>
			        				<wcf:url var="categoryURL" value="Category3" patternName="DmartCategoryURL">
										<wcf:param name="storeId" value="${storeId}"/>
										<wcf:param name="catalogId" value="${catalogId}"/>
										<wcf:param name="langId" value="${langId}"/>
										<wcf:param name="urlLangId" value="${urlLangId}"/>
										<wcf:param name="categoryId" value="${category.uniqueID}"/>
										<wcf:param name="top_category" value="${department.uniqueID}"/>
										<wcf:param name="pageView" value="${env_defaultPageView}"/>
										<wcf:param name="beginIndex" value="0"/>
									</wcf:url>
									<c:set target="${categoryURLMap}" property="${department.uniqueID}_${category.uniqueID}" value="${categoryURL}"/>
					        			
			        				<div class="col-xs-6 column-product site-map-l3-div">
			        					<c:choose>
				        					<c:when test="${!empty category.catalogGroupView}">
				        						<div class="l2-sitemap">
					        						<c:out value="${category.name}"/>
					        					</div>
				        						<c:forEach var="subcategory" items="${category.catalogGroupView}" varStatus="levelThreeCount">
				        							<wcf:url var="categoryURL" value="Category3" patternName="DmartCategoryURLWithParentCategory">
														<wcf:param name="storeId" value="${storeId}"/>
														<wcf:param name="catalogId" value="${catalogId}"/>
														<wcf:param name="langId" value="${langId}"/>
														<wcf:param name="urlLangId" value="${urlLangId}"/>
														<wcf:param name="categoryId" value="${subcategory.uniqueID}"/>
														<wcf:param name="parent_category_rn" value="${category.uniqueID}"/>
														<wcf:param name="top_category" value="${department.uniqueID}"/>
														<wcf:param name="pageView" value="${env_defaultPageView}"/>
														<wcf:param name="beginIndex" value="0"/>
													</wcf:url>
													<c:set var="categoryURL" value="${env_TopCategoriesDisplayURLHierarchy}/${department.seo_token_ntk}/${category.seo_token_ntk}/${subcategory.seo_token_ntk}"/>
													<c:set target="${categoryURLMap}" property="${department.uniqueID}_${category.uniqueID}_${subcategory.uniqueID}" value="${categoryURL}"/>
	
				        							<div>
					        							<c:choose>
					        								<c:when test="${!empty subcategory.seo_token_ntk}">
					        									<c:set var="key" value="${department.uniqueID}_${category.uniqueID}_${subcategory.uniqueID}"/>
																<a href="${fn:escapeXml(categoryURLMap[key])}"><c:out value="${subcategory.name}"/>
																</a>
															</c:when>
															<c:otherwise>
																<a href="${env_TopCategoriesDisplayURLHierarchy}/CategoryDisplay?categoryId=${subcategory.uniqueID}&catalogId=${catalogId}&storeId=${storeId}"><c:out value="${subcategory.name}"/>
																</a>
															</c:otherwise>
														</c:choose>
				        							</div>
				        						</c:forEach>
				        					</c:when>
				        					<c:otherwise>
					        					<div class="l2-sitemap">
					        						<c:choose>
				        								<c:when test="${!empty category.seo_token_ntk}">
				        									<c:set var="key" value="${department.uniqueID}_${category.uniqueID}"/>
															<a href="${fn:escapeXml(categoryURLMap[key])}"><c:out value="${category.name}"/>
															</a>
														</c:when>
														<c:otherwise>
															<a href="${env_TopCategoriesDisplayURLHierarchy}/CategoryDisplay?categoryId=${category.uniqueID}&catalogId=${catalogId}&storeId=${storeId}"><c:out value="${category.name}"/>
															</a>
														</c:otherwise>
													</c:choose>
					        					</div>
				        					</c:otherwise>
			        					</c:choose>
			        				</div>
					        		<c:if test="${levelTwoCount.count % 2 == 0}">
					        			<%-- Conditional closing divs for col-xs-12 col-sm-12 col-md-6 site-map-l2-div and row --%>
					        			</div>
					        			</div>
					        		</c:if>
					        		<c:set var="l2Count" value="${levelTwoCount.count}"/>
					        	</c:forEach>
					        	<c:if test="${l2Count % 2 != 0}">
					        		<%-- Conditional closing divs for col-xs-12 col-sm-12 col-md-6 site-map-l2-div and row --%>
					        		</div>
					        		</div>
					        	</c:if>
					        </div>
				        </div>
			        </c:if>
				</c:forEach>
				<c:if test="${catalogEntryViewForOffers.recordSetTotal > 0}">
					<div class="site-map-l1-head" id="prohead_offers">
						<div class="prohead">
				           <span class="scolling-span">
				           		<fmt:message bundle="${storeText}" key="OFFERS_TEXT"/>
				           </span>
				        </div>
				        
				        <div class="row">
					        <div class="col-xs-12 col-sm-12 col-md-6 site-map-l2-div">
					        	<div class="row">
					        		<jsp:useBean id="offersMap" class="java.util.HashMap"/>
							        <c:forEach var="eachCatalogEntry" items="${catalogEntryViewForOffers.catalogEntryView}" varStatus="offerCount">
							        	<c:choose>
											<c:when test="${offersMap[eachCatalogEntry.parentCatalogGroupID[0]] eq null or offersMap[eachCatalogEntry.parentCatalogGroupID[0]] eq undefined}">
												<div class="col-xs-6 column-product site-map-l3-div">
												<c:set target="${offersMap}" property="${eachCatalogEntry.parentCatalogGroupID[0]}" value="1"/>
												<div>
													<a href="CategoryDisplay?catalogId=${catalogId}&categoryId=${eachCatalogEntry.parentCatalogGroupID[0]}&storeId=${WCParam.storeId}&offerCat=(10101 ${WCParam.storeId})">
														<span data-id="${eachCatalogEntry.parentCatalogGroupID[0]}">
														</span>
														(<span data-quantity="${eachCatalogEntry.parentCatalogGroupID[0]}"></span>)
													</a>
				       							</div>
				       							<script>
									        		var eachCatId = ${eachCatalogEntry.parentCatalogGroupID[0]};
									        		var eachCatName = getCategoryNameForSiteMap(eachCatId,${categoryHierarchy});
									        		if(eachCatName == null || typeof eachCatName == 'undefined' || eachCatName == ''){
									        			eachCatName = "${eachCatalogEntry.name}";
									        		}
									        		$("span[data-id="+eachCatId+"]").html(eachCatName);
									        		$("span[data-quantity="+eachCatId+"]").html(1);
									        	</script>
									        	</div>
											</c:when>
											<c:otherwise>
												<c:set target="${offersMap}" property="${eachCatalogEntry.parentCatalogGroupID[0]}" value="${offersMap[eachCatalogEntry.parentCatalogGroupID[0]] + 1}"/>
												<script>
									        		var eachCatId = ${eachCatalogEntry.parentCatalogGroupID[0]};
									        		$("span[data-quantity="+eachCatId+"]").html(${offersMap[eachCatalogEntry.parentCatalogGroupID[0]]});
									        	</script>
											</c:otherwise>
										</c:choose>
							        </c:forEach>
					     		</div>
				     		</div>
				        </div>
			        </div>
		        </c:if>
			</div>
		</div>
		<div id="footerWrapper">
			<%out.flush();%>
			<c:import url="${env_jspStoreDir}Widgets/Footer/Footer.jsp"/>
			<%out.flush();%>
		</div>
	</div>
</body>	

<!-- END DmartSiteMap.jsp -->		
</html>