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

<%@ include file= "../../Common/EnvironmentSetup.jspf" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<%
StoreConfigurationRegistry scfRegistry = (StoreConfigurationRegistry) RegistryManager.singleton().getRegistry("StoreConfigurationRegistry");
String maxLevelThreeCount = scfRegistry.getSingleton().getValue(0, "DMart.LevelThreeCategory.Count");
pageContext.setAttribute("maxLevelThreeCount", maxLevelThreeCount);	
%>

<c:set var="departmentId" value="${param.categoryId}"/>

<c:set var="subcategoryLimit" value="12"/>
<c:set var="depthAndLimit" value="${subcategoryLimit + 1},${subcategoryLimit + 1}"/>
<wcf:rest var="categoryHierarchy" url="${searchHostNamePath}${searchContextPath}/store/${WCParam.storeId}/categoryview/@top" >
	<c:if test="${!empty WCParam.langId}">
	<wcf:param name="langId" value="${WCParam.langId}"/>
	</c:if>
	<c:if test="${empty WCParam.langId}">
	<wcf:param name="langId" value="${langId}"/>
	</c:if>

	<wcf:param name="responseFormat" value="json"/>		
	
	<wcf:param name="depthAndLimit" value="${depthAndLimit}"/>	
</wcf:rest>

<script>
dojo.addOnLoad(function() {
	CachedHeader.setTopNavInfoInLS(${categoryHierarchy});
});
</script>

<jsp:useBean id="categoryURLMap" class="java.util.HashMap"/>

<c:forEach var="department" items="${categoryHierarchy.catalogGroupView}">
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
	<c:forEach var="category" items="${department.catalogGroupView}">
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
		<c:forEach var="subcategory" items="${category.catalogGroupView}">
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
		</c:forEach>
	</c:forEach>
</c:forEach>
<c:if test="${userType ne 'G'}" > 
	<wcf:rest var="wishListResult" url="/store/{storeId}/wishlist/@self">
		<wcf:var name="storeId" value="${WCParam.storeId}" />
	</wcf:rest>
	<c:set var="userWishLists" value="${wishListResult.GiftList}"/>
</c:if>

<ul class="main-menu__navigation--category-dropdown">
<h4 class="main-menu-title-md"><i class="icon-angle-left js-main-menu-back"></i><fmt:message bundle="${storeText}" key="SHOP_BY_CAT_TEXT"/></h4>
    <li class="show-md-down top-selling-category-md js-category main-menu-item">
      <a class="js-category-parent" href="javascript:;"><fmt:message bundle="${storeText}" key="TOP_SELLING_CAT"/><span class="nav-parent-icon"><i class="icon-angle-right show-lg-up"></i><i class="icon-angle-down show-md-down"></i></span></a>
      <div class="js-sub-menu sub-menu">
        <ul>
        </ul>
      </div>
    </li>
	<li id="userlistitem" class="js-category main-menu-item"><a class="js-category-parent" href="javascript:;"><fmt:message bundle="${storeText}" key="MY_LIST_TEXT"/>
		<span class="nav-parent-icon"><i class="icon-angle-right show-lg-up"></i><i class="icon-angle-down show-md-down"></i></span></a>
		<div id="userlists" class="js-sub-menu sub-menu" style=""></div>
	</li>
	<c:forEach var="department" items="${categoryHierarchy.catalogGroupView}" varStatus="levelOneCount">
		<c:if test="${!empty department.catalogGroupView}">
			<li class="js-category main-menu-item"><a class="js-category-parent"><c:out value="${department.name}"/><c:if test="${empty department.catalogGroupView}"></a></c:if>
		
			
				<span class="nav-parent-icon"><i class="icon-angle-right show-lg-up"></i><i class="icon-angle-down show-md-down"></i></span></a>
					<div class="js-sub-menu sub-menu" style="">
						<h3 class="menu-item-title"><c:out value="${department.name}"/></h3>
						<ul>
							<c:forEach var="category" items="${department.catalogGroupView}" varStatus="levelTwoCount">
								<c:set var="key" value="${department.uniqueID}_${category.uniqueID}"/>
								<%-- Sub-menu --%>
								<li class="js-category-item sub-menu-item">
								<c:set var="countKey" value="FacetCount${category.uniqueID}"/>
								<%-- Navigate to L2 with no L3 --%>
									
											<c:choose>
												<c:when test="${!empty category.seo_token_ntk}">
													<c:set var="key" value="${department.uniqueID}_${category.uniqueID}"/>
													<a class="sub-menu-parent" href="${fn:escapeXml(categoryURLMap[key])}"><c:out value="${category.name}" /><span class="count">&nbsp;(${department[countKey]})</span></a>
												</c:when>
												<c:otherwise>
													<a class="sub-menu-parent" href="${env_TopCategoriesDisplayURLHierarchy}/CategoryDisplay?categoryId=${category.uniqueID}&catalogId=${catalogId}&storeId=${storeId}"><c:out value="${category.name}" /><span class="count">&nbsp;(${department[countKey]})</span></a>
												</c:otherwise>
											</c:choose> 
																		
									<%-- Navigate to L2 with no L3 --%>
									<c:if test="${!empty category.catalogGroupView}">
										<span class="nav-parent-icon"><i class="icon-angle-right show-lg-up"></i><i class="icon-angle-down show-md-down"></i></span></a>
										<c:set var="levelThreeTotal" value="${fn:length(category.catalogGroupView)}"/>
										<div class="sub-menu-items <c:if test="${levelTwoCount.count > levelThreeTotal}">max-items</c:if> <c:if test="${levelThreeTotal > maxLevelThreeCount}">sub-menu-items--expand</c:if>">
											<h4 class="sub-menu-item-title">${category.name}</h4>
												<ul>
													<c:forEach var="subcategory" items="${category.catalogGroupView}" varStatus="levelThreeCount">
														<c:set var="key" value="${department.uniqueID}_${category.uniqueID}_${subcategory.uniqueID}"/>
	  													<li>
	  													<c:choose>
															<c:when test="${!empty subcategory.seo_token_ntk}">
																<a href="${fn:escapeXml(categoryURLMap[key])}"><c:out value="${subcategory.name}"/>
															</c:when>
															<c:otherwise>
																<a href="${env_TopCategoriesDisplayURLHierarchy}/CategoryDisplay?categoryId=${subcategory.uniqueID}&catalogId=${catalogId}&storeId=${storeId}"><c:out value="${subcategory.name}"/>
															</c:otherwise>
														</c:choose>
	  													</a></li>
	  												</c:forEach>
	  											</ul>
	  											<%-- Sub Menu Image --%>
							  					<c:set var="espotName" value="Category_Content_ESpot_${department.uniqueID}"/>
												<%out.flush();%>
												<c:import url="${env_siteWidgetsDir}com.ibm.commerce.store.widgets.ContentRecommendation/ContentRecommendation.jsp">
													<c:param name="emsName" value="${espotName}" /> 
													<c:param name="storeId" value="${storeId}"/>
													<c:param name="catalogId" value="${catalogId}" />
													<c:param name="imagePath" value="${jspStoreImgDir}" />
												</c:import> 
												<%out.flush();%>
	  										</div>
  										</c:if>
  									</li>
	    					</c:forEach>
	    				</ul>
	    			</div>
	    		</li>
	    	</c:if>
	</c:forEach>
		<li id= "offerslist" class="js-category main-menu-item" style="display: none;"><a class="js-category-parent" href="javascript:;"><fmt:message bundle="${storeText}" key="OFFERS_TEXT"/>
			<span class="nav-parent-icon"><i class="icon-angle-right show-lg-up"></i><i class="icon-angle-down show-md-down"></i></span></a>
			<div class="js-sub-menu sub-menu" style="">
				<h3 class="menu-item-title"><fmt:message bundle="${storeText}" key="OFFERS_TEXT"/></h3>
				<div id="offerCat"></div>
			</div>
		</li>
</ul>
