<%--
 =================================================================
  Licensed Materials - Property of IBM

  WebSphere Commerce

  (C) Copyright IBM Corp. 2009, 2014 All Rights Reserved.

  US Government Users Restricted Rights - Use, duplication or
  disclosure restricted by GSA ADP Schedule Contract with
  IBM Corp.
 =================================================================
--%>

<!-- BEGIN AutoSuggestSerialize.jsp -->

<%@include file="../../Common/JSTLEnvironmentSetup.jspf" %>
<%@include file="../../Common/EnvironmentSetup.jspf" %>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="java.util.List"%>
<%@page import="java.util.Vector"%>
<%@page import="org.apache.solr.client.solrj.SolrQuery"%>
<%@page import="org.apache.solr.client.solrj.impl.HttpSolrServer"%>
<%@page import="org.apache.solr.client.solrj.SolrServer"%>
<%@page import="org.apache.solr.client.solrj.request.QueryRequest"%>
<%@page import="org.apache.solr.client.solrj.response.TermsResponse.Term"%>
<%@page import="org.apache.solr.common.params.TermsParams"%>
<%@page import="org.apache.solr.client.solrj.SolrRequest"%>
<%@page import="com.ibm.commerce.foundation.internal.server.services.search.config.solr.SolrSearchConfigurationRegistry"%>
<%@page import="com.ibm.commerce.foundation.internal.server.services.search.metadata.solr.SolrSearchServiceConstants"%>

<fmt:message bundle="${storeText}" var="suggestedKeyWords" key="SUGGESTED_KEYWORDS" />
<fmt:message bundle="${storeText}" var="suggestedProducts" key="SUGGESTED_PRODUCTS" />
<%
		String PARAM_TERM = "term";
		String PARAM_SHOWHEADER = "showHeader";
		String term = request.getParameter(PARAM_TERM);
		pageContext.setAttribute("showHeader", request.getParameter(PARAM_SHOWHEADER));
		pageContext.setAttribute("term", term);
		String lowerCaseTerm = term.toLowerCase();
		pageContext.setAttribute("lowerCaseSearchTerm", lowerCaseTerm);

%>

<c:if test="${fn:length(term) > 1}">
	<c:set var="keywordViewIndex" value="0"/>
	<c:set var="productViewIndex" value="0"/>
	<flow:ifEnabled feature="KeywordSuggestions">
	<wcf:rest var="terms" url="${searchHostNamePath}${searchContextPath}/store/${WCParam.storeId}/sitecontent/keywordSuggestionsByTerm/*" >
			<%-- Default sort for CatEntListWidget --%>
			<c:choose>
				<c:when test="${!empty WCParam.langId}">
					<wcf:param name="langId" value="${WCParam.langId}"/>
				</c:when>
				<c:otherwise>
					<wcf:param name="langId" value="${langId}"/>
				</c:otherwise>
			</c:choose>
			<wcf:param name="searchTerm" value="${term}"/>
			<wcf:param name="catalogId" value="${WCParam.catalogId}"/>
			<c:forEach var="contractId" items="${env_activeContractIds}">
				<wcf:param name="contractId" value="${contractId}"/>
			</c:forEach>
	</wcf:rest>
	<c:choose>
	<c:when test="${fn:length(terms.suggestionView) > 0 and fn:length(terms.suggestionView[0].entry) > 0}">
		<%-- Start showing the results --%>
		<c:set var="keywordViewIndex" value="${fn:length(terms.suggestionView[0].entry)}"/>
		<div id='suggestedKeywordResults'>
			<c:if test="${showHeader}">
				<div id='suggestedKeywordsHeader'>
					<ul class="autoSuggestDivNestedList">
						<li class="heading">
							<span id="suggest_keywords_ACCE_Label"><c:out value="${suggestedKeyWords}"/></span>
						</li>
					</ul>
				</div>
			</c:if>
			<div class='list_section'>
				<div title="${suggestedKeyWords}" role='list' aria-labelledby="suggest_keywords_ACCE_Label"></div>
				<c:forEach items="${terms.suggestionView[0].entry}" var="resultTerm" varStatus="status">
					<c:set var="result" value="${resultTerm.term}"/>
					<c:set var="resultInLowerCase" value="${fn:toLowerCase(result)}"/>
					<ul class="autoSuggestDivNestedList">
						<li id='suggestionItem_${status.index}' role='listitem' tabindex='-1'>
							<a role='listitem' href='#' onmouseout="this.className=''"
							onmouseover='SearchJS.enableAutoSelect("${status.index}");' onclick='SearchJS.selectAutoSuggest(this.title); return false;' title='<c:out value="${result}"/>'
							id='autoSelectOption_${status.index}'>
								<%-- Highlight the search term in the result --%>
								<c:out value="${fn:substringBefore(result,lowerCaseSearchTerm)}"/><span class='highlight'><c:out value="${WCParam.term}"/></span><c:out value="${fn:substringAfter(result,lowerCaseSearchTerm)}"/>
							</a>
						</li>
					</ul>
				</c:forEach>
			</div>
		</div>
	</c:when>
	<c:otherwise>
		<div class="no-result-found">
  			<p class="alert alert-danger"><i class="icon-error-type icon-notification"></i> No Result Found</p>
		</div>
	</c:otherwise>
	</c:choose>
	</flow:ifEnabled>
	
	<flow:ifEnabled feature="ProductSuggestions">
	<wcf:rest var="suggestProductsTerms" url="${searchHostNamePath}${searchContextPath}/store/${WCParam.storeId}/sitecontent/productSuggestionsBySearchTerm/*" >
			<%-- Default sort for CatEntListWidget --%>
			<c:choose>
				<c:when test="${!empty WCParam.langId}">
					<wcf:param name="langId" value="${WCParam.langId}"/>
				</c:when>
				<c:otherwise>
					<wcf:param name="langId" value="${langId}"/>
				</c:otherwise>
			</c:choose>
			<wcf:param name="searchTerm" value="${term}"/>
			<wcf:param name="catalogId" value="${WCParam.catalogId}"/>
			<wcf:param name="pageNumber" value="1"/>
			<wcf:param name="pageSize" value="4"/>
			<c:forEach var="contractId" items="${env_activeContractIds}">
				<wcf:param name="contractId" value="${contractId}"/>
			</c:forEach>
	</wcf:rest>
	<c:choose>
	<c:when test="${fn:length(suggestProductsTerms.suggestionView) > 0 and fn:length(suggestProductsTerms.suggestionView[0].entry) > 0}">
		<%-- Start showing the results --%>

		<c:set var="productViewIndex" value="${fn:length(suggestProductsTerms.suggestionView[0].entry)}"/>
		<div id='suggestedProductsResults'>
			<c:if test="${showHeader}">
				<div id='suggestedProductsHeader'>
					<ul class="autoSuggestDivNestedList">
						<li class="heading">
							<span id="suggest_products_ACCE_Label"><c:out value="${suggestedProducts}"/></span>
						</li>
					</ul>
				</div>
			</c:if>
			<div class='list_section'>
				<div title="${suggestedProducts}" role='list' aria-labelledby="suggest_products_ACCE_Label"></div>
				<c:forEach items="${suggestProductsTerms.suggestionView[0].entry}" var="resultTerm" varStatus="status">
					<c:set var="result" value="${resultTerm.name}"/>		
					<c:set var="resultThumbnail" value="${resultTerm.thumbnail}"/>				
					<c:set var="resultPartNumber" value="${resultTerm.partNumber}"/>
					<c:set var="resultInLowerCase" value="${fn:toLowerCase(result)}"/>
					<c:set var="resultIndex" value="${status.index + keywordViewIndex}"/>
					<wcf:url var="productDisplayUrl" patternName="DmartProductURL" value="Product2">
						<wcf:param name="catalogId" value="${WCParam.catalogId}"/>
						<wcf:param name="storeId" value="${WCParam.storeId}"/>
						<wcf:param name="productId" value="${resultTerm.uniqueID}"/>
						<wcf:param name="langId" value="${WCParam.langId}"/>
						<wcf:param name="urlLangId" value="${WCParam.langId}" />
					</wcf:url>	
					
					<ul class="autoSuggestDivNestedList">
						<li id='suggestionItem_${resultIndex}' role='listitem' tabindex='-1'>
							<a role='listitem' href='<c:out value="${productDisplayUrl}"/>' onmouseout="this.className=''"
							onmouseover='SearchJS.enableAutoSelect("${resultIndex}");' title='<c:out value="${result}"/>'
							id='autoSelectOption_${resultIndex}'>
								<div class="as_thumbnail">
									<img alt='<c:out value="${result}"/>' src="${jsServerPath}${resultThumbnail}">
								</div>
								<c:if test="${fn:indexOf(resultInLowerCase,lowerCaseSearchTerm)ne-1}">
									<%-- Highlight the search term in the result --%>
									<c:out value="${fn:substringBefore(resultInLowerCase,lowerCaseSearchTerm)}"/><span class='highlight'><c:out value="${WCParam.term}"/></span><c:out value="${fn:substringAfter(resultInLowerCase,lowerCaseSearchTerm)}"/>
								</c:if>
								<c:if test="${fn:indexOf(resultInLowerCase,lowerCaseSearchTerm)eq-1}">
									<c:out value="${result}"/>
								</c:if>
								<br>
								<span class="partNumber"><c:out value="${resultPartNumber}"/></span>
							</a>
						</li>
					</ul>
				</c:forEach>
			</div>	
		</div>
	</c:when>
	<c:otherwise>
		<div class="no-result-found">
  			<p class="alert alert-danger"><i class="icon-error-type icon-notification"></i> No Result Found</p>
		</div>
	</c:otherwise>
	</c:choose>
	</flow:ifEnabled>
	<input type='hidden' id='autoSuggestOriginalTerm' value='<c:out value="${WCParam.term}"/>'/>
	<input type='hidden' id='dynamicAutoSuggestTotalResults' value="${keywordViewIndex + productViewIndex}"/>
</c:if>
<!-- END AutoSuggestSerialize.jsp -->
