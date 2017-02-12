<%
/*
 *----------------------------------------------------------------------
 * Licensed Materials - Property of IBM
 *
 * WebSphere Commerce
 *
 * (c) Copyright IBM Corp. 2007, 2012
 *
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *
 *-----------------------------------------------------------------------
 *
 *-----------------------------------------------------------------------
 * The sample contained herein is provided to you "AS IS."
 *
 * It is furnished by IBM as a simple example and has not been thoroughly 
 * tested under all conditions.  IBM, therefore, cannot guarantee its
 * reliability, serviceability or functionality.
 *
 * This sample may include the names of individuals, companies, brands
 * and products in order to illustrate concepts as completely as
 * possible.  All of these names are fictitious and any similarity to the 
 * names and addresses used by actual persons or business enterprises is 
 * entirely coincidental.
 *---------------------------------------------------------------------
 */
%>

<%--
  * This WebServiceeMarketingSpotDisplay.jsp file is built as a sample snippet to display an e-Marketing Spot in a
  * store page. It uses Web services to call the Dialog Marketing runtime to get the data to display
  * in the e-Marketing Spot. 
  * 
  * Use this version of the sample snippet for e-Marketing Spots that use the marketing tool 
  * supplied with Management Center. For e-Marketing Spots that use the marketing tool 
  * supplied with WebSphere Commerce Accelerator, use the snippet called eMarketingSpotDisplay.jsp.
  * 
  * The code in this e-Marketing Spot .jsp file supports the display of the following types of data:
  *	- Catalog entries (specified in Web activities and through merchandising associations)
  * - Categories
  *	- Content (also known as ad copy or collateral)
  *
  * If you intend to display only one type of data in the e-Marketing Spot,
  * then you can remove the applicable sections of the code that will not be used.
  *
  * Prerequisites:
  * 	This code requires the following two parameters:
  *		- emsName
  *		  This .jsp file can be reused in different store pages by including it and assigning 
  * 	          a unique value for the emsName parameter. This value should match exactly with an 
  *               eMarketingSpot name that is defined in the Management Center when creating a new 
  *               eMarketingSpot.
  *		- catalogId
  *		  The catalogId parameter needs to be passed because it is required to build the proper URLs.
  *
  *   This code supports the following optional parameters:
  *   - emsUsage
  *     The usage type of the e-Marketing Spot. If nothing is specified, then the default MARKETING is used.
  *   - previewReport
  *     Set to true if the marketing services should return the report of the e-Marketing Spot evaluation.  	
  *  
  *   This code supports the following three optional parameters:
  *   - numberCategoriesToDisplay
  *     The maximum number of categories that can be displayed in the e-Marketing Spot at the same time.
  *   - numberProductsToDisplay
  *     The maximum number of catalog entries that can be displayed in the e-Marketing Spot at the same time.
  *   - numberContentToDisplay    
  *     The maximum number of content that can be displayed in the e-Marketing Spot at the same time.
  * 
  *   This code supports the following optional parameters for substituting variables in marketing content:
  *   - substitutionName1, substitutionValue1
  *     The name and value of a variable to replace in marketing content text.
  *   - substitutionName2, substitutionValue2
  *     The name and value of a variable to replace in marketing content text.
  *  
  *   This code supports the following two optional parameters:
  *   - errorViewName
  *     The URL to call if there is an error or exception when clicking on a content link in the e-Marketing Spot snippet.
  *   - orderId
  *     The ID of the current order of the customer to include when calling the errorViewName URL.
  *  
  * How to use this snippet:
  *	This is an example of how this file can be included in a page:
  *		<c:import url="${jspStoreDir}include/WebServiceeMarketingSpotDisplay.jsp">
  *			<c:param name="emsName" value="ShoppingCartPage" />
  *			<c:param name="catalogId" value="${WCParam.catalogId}" />
  *		</c:import>
  *
  * This is another example including some of the optional parameters:
  *		<%out.flush();%>
  *		<c:import url="${jspStoreDir}include/WebServiceeMarketingSpotDisplay.jsp">
  *			<c:param name="emsName" value="HomePageRow1Ads" />
  *			<c:param name="catalogId" value="${WCParam.catalogId}" />
  *			<c:param name="numberContentToDisplay" value="1" />	
  *			<c:param name="previewReport" value="true" />	  
  *			<c:param name="errorViewName" value="AjaxOrderItemDisplayView" />
  *			<c:param name="substitutionName1" value="[storeName]" />
  *		  <c:param name="substitutionValue1" value="Madisons" />
  *		</c:import>
  *		<%out.flush();%>
  *
  *	An example of when the e-Marketing has a specific usage type:
  *		<c:import url="${jspStoreDir}include/WebServiceeMarketingSpotDisplay.jsp">
  *			<c:param name="emsName" value="SearchPage" />
  *			<c:param name="emsUsage" value="SEARCH" />
  *			<c:param name="catalogId" value="${WCParam.catalogId}" />
  *		</c:import>
  *
  * If the e-Marketing Spot name (emsName) contains special characters, they must be encoded to pass
  * successfully to this page through the request parameter. Use the following technique:
  *   
  *   1. Before setting the emsName parameter in the import statement:
  * 	 request.setAttribute("emsName", java.net.URLEncoder.encode("ShoppingCartPage"));
  *   
  *   2.To retrieve the emsName parameter from the request when setting the parameter in the import statement:
  *     <c:param name="emsName" value="${requestScope.emsName}"/>
  *
--%>

<!-- Start - JSP File Name: WebServiceeMarketingSpotDisplay.jsp -->

<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://commerce.ibm.com/base" prefix="wcbase" %>
<%@ taglib uri="http://commerce.ibm.com/foundation" prefix="wcf" %>
<%@ taglib uri="flow.tld" prefix="flow" %>
<%@ include file="../Common/JSTLEnvironmentSetup.jspf"%>

<% 
   /* Get the e-Marketing Spot name from the request parameters, and decode it in case it has been encoded. */
   String emsName = request.getParameter("emsName");
   if (emsName != null) {
   	emsName = java.net.URLDecoder.decode(emsName, "UTF-8");
	  request.setAttribute("emsName", emsName);
   }
   
   /* Set the values for the maximum number of data to display. This is used to create the appropriate     */
   /* key to find the e-Marketing Spot data created by the campaigns filter when using e-Marketing Spot    */
   /* JSP snippet caching. The snippet caching is configured in the EMarketingSpotInvocationList.xml file. */
   int displayCategories = 20;
   int displayProducts   = 20;
   int displayContent    = 20;
   
   String numberCategoriesToDisplayString = request.getParameter("numberCategoriesToDisplay");
   if (numberCategoriesToDisplayString != null) {
   	request.setAttribute("numberCategoriesToDisplay", numberCategoriesToDisplayString);
   	displayCategories = Integer.parseInt(numberCategoriesToDisplayString);
   }
   String numberProductsToDisplayString = request.getParameter("numberProductsToDisplay");
   if (numberProductsToDisplayString != null) {
   	request.setAttribute("numberProductsToDisplay", numberProductsToDisplayString);
   	displayProducts = Integer.parseInt(numberProductsToDisplayString);
   }
   String numberContentToDisplayString = request.getParameter("numberContentToDisplay");
   if (numberContentToDisplayString != null) {
   	request.setAttribute("numberContentToDisplay", numberContentToDisplayString);
   	displayContent = Integer.parseInt(numberContentToDisplayString);
   }   
   
   java.util.Hashtable emsHash = (java.util.Hashtable)request.getAttribute(com.ibm.commerce.marketing.beans.EMarketingSpot.EMS_REQUEST_ATTRIBUTE_CONTAINER_NAME);
   if (emsHash != null) {
      request.setAttribute("emsFromFilter", 
           emsHash.get(com.ibm.commerce.tools.campaigns.CampaignRuntimeUtil.generateEMarketingSpotInvocationKey(emsName, 20, displayProducts, displayCategories, displayContent)));      
   }
   
   /* Set the name of the command that has called this page. */
   String pathInfo = (String)request.getAttribute("javax.servlet.forward.path_info");
   if (pathInfo != null && pathInfo.startsWith ("/")) {
      pathInfo = pathInfo.substring (1);
   }
   request.setAttribute("requestURI", pathInfo);
   
   /* Get the marketing context information if it has been configured in the businessContext.xml file. */
   request.setAttribute("marketingContext", com.ibm.commerce.foundation.server.services.businesscontext.ContextServiceFactory.getContextService().findContext(com.ibm.commerce.marketing.dialog.context.MarketingContext.CONTEXT_NAME));
   
   Object DM_marketingSpotBehavior = request.getAttribute("DM_emsBehavior-" + emsName);
   if (DM_marketingSpotBehavior != null) {
   	request.setAttribute("DM_marketingSpotBehavior", DM_marketingSpotBehavior.toString());
   }    
%>   

  <%--
    *
    * Set up the variables required by the snippet.
    *
  --%>
	<c:set var="requestURI"                value="${requestScope.requestURI}"/>
	<c:set var="marketingContext"          value="${requestScope.marketingContext}"/>
	<c:set var="emsFromFilter"             value="${requestScope.emsFromFilter}"/>
	<c:set var="emsName"                   value="${requestScope.emsName}"/>
	<c:set var="numberCategoriesToDisplay" value="${requestScope.numberCategoriesToDisplay}"/>
	<c:set var="numberProductsToDisplay"   value="${requestScope.numberProductsToDisplay}"/>
	<c:set var="numberContentToDisplay"    value="${requestScope.numberContentToDisplay}"/>

  <%--
    *
    * Specify if a fully qualified URL or relative paths should be used for
    * image tags. A fully qualified URL is required for e-mail activity functionality.
    *
  --%>
  <c:set var="prependFullURL">
	  <c:out value="${param.useFullURL}" default="false" />
  </c:set>

  <%--
    *
    * Set the ClickInfo command URL if the optional clickInfoURL parameter is provided; otherwise, use the
    * default value of the URL.
    *
  --%>
  <c:set value="ClickInfo" var="clickInfoCommand" />
  <c:set value="" var="clickOpenBrowser" />
  <c:if test="${!empty param.clickInfoURL}">
	  <c:set value="${param.clickInfoURL}" var="clickInfoCommand" />
	  <c:set value='target="_blank"' var="clickOpenBrowser" />
  </c:if>

  <%--
    *
    * Specify the host name of the URL that is used to point to the shared image directory.  
    * Use this variable to reference images.
    *
  --%>
  <c:set var="hostPath" value="" />
  <c:if test="${prependFullURL}">
    <c:set value="${pageContext.request.scheme}://${pageContext.request.serverName}" var="hostPath" />
  </c:if>

  <%--
    *
    * Create the e-Marketing Spot.
    *
  --%>
	<c:choose>
		<%-- Check if we already have the data - it could have been populated in the campaigns filter when JSP snippet caching is configured --%>
		<c:when test="${emsFromFilter != null && emsFromFilter.name eq emsName}">
			<c:set var="marketingSpotDatas" value="${emsFromFilter.marketingSpotData}"/>
		</c:when>

    <%-- Call the web service to get the data to display in the e-Marketing Spot --%>
		<c:otherwise>
			<%-- Set up the information required for the web service call --%>
			<wcf:getData type="com.ibm.commerce.marketing.facade.datatypes.MarketingSpotDataType" var="marketingSpotDatas" expressionBuilder="findByMarketingSpotName">
			
				<%-- the name of the e-Marketing Spot --%>
				<wcf:param name="DM_EmsName" value="${emsName}" />
					
				<%-- the usage type of the e-Marketing Spot. If nothing is specified, then the default of MARKETING will be used. --%>
        <c:if test="${!empty param.emsUsage}">
        	<wcf:param name="DM_Emspot_Usage" value="${param.emsUsage}" />
        </c:if>
        
				<%-- Should a preview report be returned. If nothing is specified, then no preview report will be returned. --%>
        <c:if test="${!empty param.previewReport}">
        	<wcf:param name="DM_PreviewReport" value="${param.previewReport}" />
        </c:if>        
												
				<%-- the maximum number of items to display --%>
				<c:if test="${numberCategoriesToDisplay != null}">
					<wcf:param name="DM_DisplayCategories" value="${numberCategoriesToDisplay}" />
				</c:if>
				<c:if test="${numberProductsToDisplay != null}">
					<wcf:param name="DM_DisplayProducts"   value="${numberProductsToDisplay}" />
				</c:if>
				<c:if test="${numberContentToDisplay != null}">
					<wcf:param name="DM_DisplayContent"    value="${numberContentToDisplay}" />
				</c:if>								
		
				<%-- url command name --%>
				<wcf:param name="DM_ReqCmd" value="${requestURI}" />
					
				<%-- for e-Marketing Spot caching --%>
				<wcf:param name="DM_marketingSpotBehavior" value="${requestScope.DM_marketingSpotBehavior}"/>							
					
        <%-- url name value pair parameters --%>					
				<c:forEach var="aParam" items="${WCParamValues}">
					<c:forEach var="aValue" items="${aParam.value}">
						<wcf:param name="${aParam.key}" value="${aValue}" />
					</c:forEach>
				</c:forEach>
				
				<%-- Example of specifying the customer is viewing a particular product.
				     The marketing activity could then display merchandising associations
				     of this product.
				     
				<wcf:param name="productId" value="12345" />
				--%>
				<%-- Example of specifying the customer is viewing a set of products.
				     The marketing activity could then display merchandising associations
				     of these products.
				     
				<wcf:param name="productId" value="12345,67890,54321" />
				--%>
												
				<%-- Example of including a value from a specific cookie
				<wcf:param name="MYCOOKIE" value="${cookie.MYCOOKIE.value}" />
				--%>
				
				<%-- Example of including all cookies 
				<c:forEach var="cookieEntry" items="${cookie}">
					<wcf:param name="${cookieEntry.key}" value="${cookieEntry.value.value}" />					
				</c:forEach>
				--%>
				
				<%-- Example of including substitution variables. These variables will be replaced
				     in the Marketing Content marketing text string. For example, if the marketing
				     text is: "Marketing text [parameterName1],[parameterName2]"
				     then it will be changed to: "Marketing text parameterValue1,parameterValue2"
				     
				<wcf:param name="DM_SubstitutionName1" value="[parameterName1]" />
				<wcf:param name="DM_SubstitutionValue1" value="parameterValue1" />
				<wcf:param name="DM_SubstitutionName2" value="[parameterName2]" />
				<wcf:param name="DM_SubstitutionValue2" value="parameterValue2" />
				--%>		
				<c:if test="${!empty param.substitutionName1 && !empty param.substitutionValue1}">
				    <wcf:param name="DM_SubstitutionName1" value="${param.substitutionName1}" />
				    <wcf:param name="DM_SubstitutionValue1" value="${param.substitutionValue1}" />
				</c:if>
				<c:if test="${!empty param.substitutionName2 && !empty param.substitutionValue2}">
				    <wcf:param name="DM_SubstitutionName2" value="${param.substitutionName2}" />
				    <wcf:param name="DM_SubstitutionValue2" value="${param.substitutionValue2}" />
				</c:if>				
	 	
				<%-- Example of specifying that the marketing service should only return the
				     catalog entry IDs to display, and do not return the entire catalog entry SDO.
				     This is useful when the client wants to retrieve the catalog entry information,
				     so it is not necessary for the marketing service to return the catalog entry SDO.
				     In the code below, instead of ${marketingSpotData.dataType eq "CatalogEntry"},
				     then ${marketingSpotData.dataType eq "CatalogEntryId"} would be required.
				     This is also supported for categories and marketing content by setting
				     DM_ReturnCatalogGroupId and DM_ReturnMarketingContentId to true, and checking
				     for dataType CatalogGroupId and MarketingContentId.
				     
				<wcf:param name="DM_ReturnCatalogEntryId" value="true" />
				--%>
				
				<%-- Example of specifying the marketing service should return data in the exact
				     order specified in the marketing activities, and it should not group the
				     catalog entries, categories, and marketing content. Any ordering specified
				     for this e-Marketing Spot will be ignored.
				     
				<wcf:param name="DM_ActivityOrder" value="true" />
				--%>
									 	
				<%-- marketing context name value pair parameters, currently not used
				<c:forEach var="aPair" items="${marketingContext.nameValuePairs}">
					<wcf:param name="${aPair.key}" value="${aPair.value}" />
				</c:forEach>
				--%>
					 	
			</wcf:getData>
		</c:otherwise>
	</c:choose>
		
	<%-- for e-Marketing Spot caching --%>
  <wcf:eMarketingSpotCache marketingSpotData="${marketingSpotDatas}"
  		contentDependencyName="contentId" catalogEntryDependencyName="productId" categoryDependencyName="categoryId" />
  				
  <%-- Example of the marketing content being the name of a JSP to include - this is useful in JSP experiments
  <c:choose>
    <c:when test="${!empty marketingSpotDatas.baseMarketingSpotActivityData}">
      <c:forEach var="marketingSpotData" items="${marketingSpotDatas.baseMarketingSpotActivityData}">
        <c:if test='${marketingSpotData.dataType eq "MarketingContent"}'>
          <c:import url="${marketingSpotData.marketingContent.url}" />
        </c:if>
      </c:forEach> 
    </c:when>
    <c:otherwise>
      <c:import url="DefaultPageName.jsp" />
    </c:otherwise>
  </c:choose>
  --%>


<div class="genericESpot"><div class="caption" style="display:none">[<c:out value="${emsName}"/>]</div>
<%-- example header
<c:if test="${!empty marketingSpotDatas.baseMarketingSpotActivityData}">
You might be interested in:
</c:if>
--%>

<%--
  *
  * The following section can be used when debugging the output displayed on the page.
  * Note: The data can be viewed by customers with the View Source browser function if 
  * this section is left in the .jsp snippet.
  *
--%>
<!--
	<table>
	<tr><td>MarketingSpotIdentifier UniqueID:</td> <td> <c:out value="${marketingSpotDatas.marketingSpotIdentifier.uniqueID}" /> </td></tr>
	<tr><td>MarketingSpotIdentifier Name:</td> <td> <c:out value="${marketingSpotDatas.marketingSpotIdentifier.externalIdentifier.name}" /> </td></tr>
	</table>			
-->

<%--
  *
  * Start: Categories
  * The following block is used to display the categories associated with this e-Marketing Spot.
  * The category display page that shows the selected category will be referenced
  * through the submission of the HTML form in the calling .jsp file.
  *
--%>
	<% int i = 1; %>
  <!-- <h4>Categories</h4> -->
  <table><tr>
	<c:forEach var="marketingSpotData" items="${marketingSpotDatas.baseMarketingSpotActivityData}">
		<c:if test='${marketingSpotData.dataType eq "CatalogGroup"}'>
		  <td>
		    <table>
		    	
		    	<%--
           *
           * Set up the URL to call when clicking on the image.
           *
          --%>
		 	    <c:url value="CategoryDisplay" var="TargetURL">
				    <c:param name="catalogId" value="${param.catalogId}" />
				    <c:param name="categoryId" value="${marketingSpotData.catalogGroup.catalogGroupIdentifier.uniqueID}" />
				    <c:param name="storeId" value="${WCParam.storeId}" />
				    <c:param name="langId" value="${langId}" />
				    <c:if test="${marketingSpotData.catalogGroup.topCatalogGroup}">
					      <c:param name="top" value="Y"/>
					      <c:param name="top_category" value="${marketingSpotData.catalogGroup.catalogGroupIdentifier.uniqueID}"/>
				    </c:if>					    	
			    </c:url>
			    <c:url value="${clickInfoCommand}" var="ClickInfoURL">
				    <c:param name="evtype" value="CpgnClick" />
				    <c:param name="mpe_id" value="${marketingSpotDatas.marketingSpotIdentifier.uniqueID}" />
				    <c:param name="intv_id" value="${marketingSpotData.activityIdentifier.uniqueID}" />
				    <c:param name="storeId" value="${WCParam.storeId}" />
			    	<c:forEach var="expResult" items="${marketingSpotData.experimentResult}" begin="0" end="0">					    
							    <c:param name="experimentId" value="${expResult.experiment.uniqueID}" />
							    <c:param name="testElementId" value="${expResult.testElement.uniqueID}" />
							    <c:param name="expDataType" value="${marketingSpotData.dataType}" />
							    <c:param name="expDataUniqueID" value="${marketingSpotData.uniqueID}" />
						</c:forEach>				    	
				    <c:param name="URL" value="${TargetURL}" />
			    </c:url>
			   
          <c:forEach var="attribute" items="${marketingSpotData.catalogGroup.attributes}">	
             <c:if test='${attribute.key eq "rootDirectory"}'>				    
                <c:set var="imageFilePath" value="${staticAssetContextRoot}/${attribute.value}/" />
             </c:if>		
          </c:forEach>
          
          <c:forEach var="description" items="${marketingSpotData.catalogGroup.description}" begin="0" end="0">					    
          	 	<%--
               *
               * Display the category image.
               *
              --%>	
				      <tr><td>
				  	    <a href="${ClickInfoURL}" ${clickOpenBrowser} >
				  	       <img src="<c:out value="${hostPath}"/><c:out value="${imageFilePath}${description.thumbnail}"/>" 
				  	   	        alt="<c:out value="${description.shortDescription}"/>"
				  		          border="0" />
				  	    </a>
				      </td></tr>
		    	    <%--
               *
               * Display the category name.
               *
              --%>					  	
			        <tr><td><c:out value="${description.name}" escapeXml="false" /></td></tr>
			    </c:forEach>
			    
          <%--
           *
           * The following section can be used when debugging the output displayed on the page.
           * Note: The data can be viewed by customers with the View Source browser function if 
           * this section is left in the .jsp snippet.
           *
          --%>
			    <!--
			    <%= i++ %>: <c:out value="${marketingSpotData.catalogGroup.catalogGroupIdentifier.uniqueID}" />
			    <c:forEach var="description" items="${marketingSpotData.catalogGroup.description}" begin="0" end="0">					    
			        <tr><td>Short Description:</td> <td> <c:out value="${description.shortDescription}" /> </td></tr>		
			    </c:forEach>
			    <tr><td>Name:</td> <td> <c:out value="${marketingSpotData.name}" /> </td></tr>
			    <tr><td>DataType:</td> <td> <c:out value="${marketingSpotData.dataType}" /> </td></tr>
			    <tr><td>ActivityIdentifier UniqueID:</td> <td> <c:out value="${marketingSpotData.activityIdentifier.uniqueID}" /> </td></tr>
			    <tr><td>ActivityIdentifier Name:</td> <td> <c:out value="${marketingSpotData.activityIdentifier.externalIdentifier.name}" /> </td></tr>
			    <tr><td>Activity Description:</td> <td> <c:out value="${marketingSpotData.properties['mktActivityDescription']}" /></td></tr>
			    <tr><td>CampaignName:</td> <td> <c:out value="${marketingSpotData.campaignName}" /> </td></tr>
			    <tr><td>ActivityFormat:</td> <td> <c:out value="${marketingSpotData.activityFormat}" /> </td></tr>
			    <tr><td>ActivityPriority:</td> <td> <c:out value="${marketingSpotData.activityPriority}" /> </td></tr>
			    -->
		    </table>	
	    </td>		
		</c:if>
	</c:forEach> 
  </tr></table>
<%--
  *
  * End: Categories
  *
--%>  
	

<%--
  *
  * Start: Catalog Entries
  * The following block is used to display the catalog entries associated with this e-Marketing Spot. The
  * product display page that shows the selected catalog entry will be referenced
  * through the submission of the HTML form in the calling .jsp file.
  *
--%>	
	<% i = 1; %>
  <!-- <h4>Catalog Entries</h4> -->
  <table><tr>
	<c:forEach var="marketingSpotData" items="${marketingSpotDatas.baseMarketingSpotActivityData}">
		<c:if test='${marketingSpotData.dataType eq "CatalogEntry"}'>
			<td>
		    <table>
		    	<%--
           *
           * Set up the URL to call when clicking on the image.
           *
          --%>		    	
			    <c:url value="ProductDisplay" var="TargetURL">
				    <c:param name="catalogId" value="${param.catalogId}" />
				    <c:param name="productId" value="${marketingSpotData.catalogEntry.catalogEntryIdentifier.uniqueID}" />
				    <c:param name="storeId" value="${WCParam.storeId}" />
				    <c:param name="langId" value="${langId}" />
			    </c:url>
			    <c:url value="${clickInfoCommand}" var="ClickInfoURL">
				    <c:param name="evtype" value="CpgnClick" />
				    <c:param name="mpe_id" value="${marketingSpotDatas.marketingSpotIdentifier.uniqueID}" />
				    <c:param name="intv_id" value="${marketingSpotData.activityIdentifier.uniqueID}" />
				    <c:param name="storeId" value="${WCParam.storeId}" />
			    	<c:forEach var="expResult" items="${marketingSpotData.experimentResult}" begin="0" end="0">					    
							    <c:param name="experimentId" value="${expResult.experiment.uniqueID}" />
							    <c:param name="testElementId" value="${expResult.testElement.uniqueID}" />
							    <c:param name="expDataType" value="${marketingSpotData.dataType}" />
							    <c:param name="expDataUniqueID" value="${marketingSpotData.uniqueID}" />							    	
						</c:forEach>				    	
				    <c:param name="URL" value="${TargetURL}" />
			    </c:url>
			    
          <c:forEach var="attribute" items="${marketingSpotData.catalogEntry.catalogEntryAttributes.attributes}">	
             <c:if test='${attribute.name eq "rootDirectory"}'>				    
                <c:set var="imageFilePath" value="${staticAssetContextRoot}/${attribute.stringValue.value}/" />
             </c:if>		          	
          </c:forEach>
          			    
			    <c:forEach var="description" items="${marketingSpotData.catalogEntry.description}" begin="0" end="0">					    
		    	    <%--
               *
               * Display the catalog entry image.
               *
              --%>				    
              <tr><td>
          	    <a href="${ClickInfoURL}" ${clickOpenBrowser} >
          	        <img src="<c:out value="${hostPath}"/><c:out value="${imageFilePath}${description.thumbnail}"/>" 
          	    	       alt="<c:out value="${description.shortDescription}"/>"
          		           border="0" />
          	    </a>
              </td></tr>				
		    	    <%--
               *
               * Display the catalog entry name.
               *
              --%>	          	
			        <tr><td><c:out value="${description.name}" /></td></tr>
			    </c:forEach>
			    	
			    <c:forEach var="contractPrice" items="${marketingSpotData.catalogEntry.price.contractPrice}">
			    	<tr>
			    	  <%-- You would want the next line in a B2B store to list the associated contract --%>	
			    		<!-- <td><c:out value="${contractPrice.contractIdentifier.externalIdentifier.name}" /></td> -->
			    	  <td><fmt:formatNumber value="${contractPrice.price.price.value}" type="currency" currencyCode="${contractPrice.price.price.currency}" />
			    	  	  <c:out value="${contractPrice.price.price.currency}" /></td>
			    	</tr>
			    </c:forEach> 
          <%--
           *
           * The following section can be used when debugging the output displayed on the page.
           * Note: The data can be viewed by customers with the View Source browser function if 
           * this section is left in the .jsp snippet.           
           *
          --%>
			    <!--
			    <%= i++ %>: <c:out value="${marketingSpotData.catalogEntry.catalogEntryIdentifier.uniqueID}" />
			    <c:forEach var="description" items="${marketingSpotData.catalogEntry.description}" begin="0" end="0">					    
			        <tr><td>Short Description:</td> <td> <c:out value="${description.shortDescription}" /> </td></tr>
			    </c:forEach> 
			    <tr><td>Name:</td> <td> <c:out value="${marketingSpotData.name}" /> </td></tr>
			    <tr><td>DataType:</td> <td> <c:out value="${marketingSpotData.dataType}" /> </td></tr>
			    <tr><td>ActivityIdentifier UniqueID:</td> <td> <c:out value="${marketingSpotData.activityIdentifier.uniqueID}" /> </td></tr>
			    <tr><td>ActivityIdentifier Name:</td> <td> <c:out value="${marketingSpotData.activityIdentifier.externalIdentifier.name}" /> </td></tr>
			    <tr><td>Activity Description:</td> <td> <c:out value="${marketingSpotData.properties['mktActivityDescription']}" /></td></tr>
			    <tr><td>CampaignName:</td> <td> <c:out value="${marketingSpotData.campaignName}" /> </td></tr>
			    <tr><td>ActivityFormat:</td> <td> <c:out value="${marketingSpotData.activityFormat}" /> </td></tr>
			    <tr><td>ActivityPriority:</td> <td> <c:out value="${marketingSpotData.activityPriority}" /> </td></tr>
			    -->
			    <%--
			    <tr><td>List Price:</td><td><c:out value="${marketingSpotData.catalogEntry.listPrice.price.value}" /> <c:out value="${marketingSpotData.catalogEntry.listPrice.price.currency}" /></td></tr>
			    <tr><td>Standard Price:</td><td><c:out value="${marketingSpotData.catalogEntry.price.standardPrice.price.price.value}" /> <c:out value="${marketingSpotData.catalogEntry.price.standardPrice.price.price.currency}" /></td></tr>
			    --%>

		    </table>
	    </td>
		</c:if>
	</c:forEach> 
	</tr></table>
<%--
  *
  * End: CatalogEntries
  *
--%>	


<%--
  *
  * Start: Content
  * The following block is used to display the content associated with this e-Marketing
  * Spot. The URL link defined with the content can be referenced through the submission of
  * the HTML form in the calling .jsp file.
  *
--%>
	<% i = 1; %>
  <!-- <h4>Content</h4> -->
  <table><tr>
	<c:forEach var="marketingSpotData" items="${marketingSpotDatas.baseMarketingSpotActivityData}">
		<c:if test='${marketingSpotData.dataType eq "MarketingContent"}'>
			<td>
		  <table>
		   <%--
         *
         * Set up the URL to call when the image or text is clicked.
         *
        --%>	
        
			  <c:url value="${marketingSpotData.marketingContent.url}" var="contentClickUrl">
				  <c:if test="${!empty param.errorViewName}" >
					  <c:param name="errorViewName" value="${param.errorViewName}" />
					  <c:if test="${!empty param.orderId}">
						  <c:param name="orderId" value="${param.orderId}"/>
					  </c:if>
				  </c:if>
			  </c:url>
			        	  	
			  <c:url value="${clickInfoCommand}" var="ClickInfoURL">
				  <c:param name="evtype" value="CpgnClick" />
				  <c:param name="mpe_id" value="${marketingSpotDatas.marketingSpotIdentifier.uniqueID}" />
				  <c:param name="intv_id" value="${marketingSpotData.activityIdentifier.uniqueID}" />
				  <c:param name="storeId" value="${WCParam.storeId}" />
				  <c:param name="catalogId" value="${param.catalogId}" />
				  <c:param name="langId" value="${langId}" />
			    <c:forEach var="expResult" items="${marketingSpotData.experimentResult}" begin="0" end="0">					    
							    <c:param name="experimentId" value="${expResult.experiment.uniqueID}" />
							    <c:param name="testElementId" value="${expResult.testElement.uniqueID}" />
							    <c:param name="expDataType" value="${marketingSpotData.dataType}" />
							    <c:param name="expDataUniqueID" value="${marketingSpotData.uniqueID}" />							    	
					</c:forEach>	
 					<c:param name="URL" value="${contentClickUrl}" /> 					
			  </c:url>
			  
		    <tr><td>
			  <c:choose>
				  <c:when test="${marketingSpotData.marketingContent.marketingContentFormat.name == 'File'}">		  	
				  	 <c:choose>
	              <c:when test="${(marketingSpotData.marketingContent.mimeType eq 'image') || (marketingSpotData.marketingContent.mimeType eq 'images')}">		
	              	 <%--
                    *
                    * Display the content image, with optional click information.
                    *
                   --%>			
 				           <c:if test="${!empty marketingSpotData.marketingContent.url}">
				             <a href="${ClickInfoURL}" ${clickOpenBrowser} >
				           </c:if>
					            <img
                          src='<c:out value="${hostPath}"/><c:out value="${staticAssetContextRoot}/${marketingSpotData.marketingContent.attachment.attachmentAsset[0].rootDirectory}/${marketingSpotData.marketingContent.attachment.attachmentAsset[0].attachmentAssetPath}"/>'
                          alt='<c:out value="${marketingSpotData.marketingContent.attachment.attachmentDescription[0].shortDescription}"/>'
                          border="0"
	                    />
                   <c:if test="${!empty marketingSpotData.marketingContent.url}">	           
					           </a>
					         </c:if>
			          </c:when>	
			          
			          <c:when test="${(marketingSpotData.marketingContent.mimeType eq 'application') || 
			          	              (marketingSpotData.marketingContent.mimeType eq 'applications') || 
			          	              (marketingSpotData.marketingContent.mimeType eq 'text') || 
			          	              (marketingSpotData.marketingContent.mimeType eq 'textyv') || 
			          	              (marketingSpotData.marketingContent.mimeType eq 'video') || 
			          	              (marketingSpotData.marketingContent.mimeType eq 'audio') || 
			          	              (marketingSpotData.marketingContent.mimeType eq 'model')
			          	              }">		
		          	   <%--
                    *
                    * Display the content: flash, audio, or other.
                    *
                   --%>		
                   <c:forEach var="attachmentAsset" items="${marketingSpotData.marketingContent.attachment.attachmentAsset}" begin="0" end="0">			        

	                    <c:choose>
                         <c:when test="${(attachmentAsset.mimeType eq 'application/x-shockwave-flash')}" >
                           <object data="<c:out value="${hostPath}"/><c:out value="${staticAssetContextRoot}/${attachmentAsset.rootDirectory}/${attachmentAsset.attachmentAssetPath}"/>" type="application/x-shockwave-flash">
													    <param name="movie" value="<c:out value="${hostPath}"/><c:out value="${staticAssetContextRoot}/${attachmentAsset.rootDirectory}/${attachmentAsset.attachmentAssetPath}"/>" />
													    <param name="quality" value="high"/>
													    <param name="bgcolor" value="#FFFFFF"/>
													    <param name="pluginurl" value="http://www.macromedia.com/go/getflashplayer"/>
													    <param name="wmode" value="opaque"/>
                           </object>
                         </c:when>
                         <c:otherwise>
                            <a href="<c:out value="${hostPath}"/><c:out value="${staticAssetContextRoot}/${attachmentAsset.rootDirectory}/${attachmentAsset.attachmentAssetPath}"/>" target="_blank"> 
                            <img
                               src='<c:out value="${hostPath}"/><c:out value="${staticAssetContextRoot}/${attachmentAsset.rootDirectory}/${marketingSpotData.marketingContent.attachment.attachmentUsage.image}"/>'
                               alt='<c:out value="${marketingSpotData.marketingContent.attachment.attachmentDescription[0].shortDescription}"/>'
                               border="0"
                            />
                            </a>
                         </c:otherwise>
                      </c:choose>
                      
		       	          <%--
                       *
                       * Display the content text, with optional click information.
                       *
                      --%>	                      
 				              <c:if test="${!empty marketingSpotData.marketingContent.url}">
				                 <a href="${ClickInfoURL}" ${clickOpenBrowser} >
				              </c:if>
				              <c:forEach var="contentDescription" items="${marketingSpotData.marketingContent.marketingContentDescription}" begin="0" end="0">
					            		<c:out value="${contentDescription.marketingText}" escapeXml="false" />
					            </c:forEach> 
                      <c:if test="${!empty marketingSpotData.marketingContent.url}">	           
					              </a>
					            </c:if>                         	
        
	                 </c:forEach> 

			          </c:when>	
			          
			          <c:otherwise>
		       	       <%--
                    * Content type is File, but no image or known mime type is associated, so display a link to the URL. 
                    * Display the content text, with optional click information.
                    *
                   --%>				
                   <a href="<c:out value='${marketingSpotData.marketingContent.attachment.attachmentAsset[0].attachmentAssetPath}' />" target="_new"> 
                   	 <c:out value="${marketingSpotData.marketingContent.attachment.attachmentAsset[0].attachmentAssetPath}"/>
                   </a>		          	
 				           <c:if test="${!empty marketingSpotData.marketingContent.url}">
				             <a href="${ClickInfoURL}" ${clickOpenBrowser} >
				           </c:if>
				           <c:if test="${!empty marketingSpotData.marketingContent.marketingContentDescription[0].marketingText}">
				           	    <br/>
       						      <c:out value="${marketingSpotData.marketingContent.marketingContentDescription[0].marketingText}" escapeXml="false" />
				           </c:if>
                   <c:if test="${!empty marketingSpotData.marketingContent.url}">	           
					           </a>
					         </c:if> 			       	
			          </c:otherwise>
			       </c:choose>
          </c:when>
          <c:when test="${marketingSpotData.marketingContent.marketingContentFormat.name == 'Text'}">		  
		       	 <%--
              *
              * Display the content text, with optional click information.
              *
             --%>			          	
 				     <c:if test="${!empty marketingSpotData.marketingContent.url}">
				       <a href="${ClickInfoURL}" ${clickOpenBrowser} >
				     </c:if>
				     <c:forEach var="contentDescription" items="${marketingSpotData.marketingContent.marketingContentDescription}" begin="0" end="0">
					   		<c:out value="${contentDescription.marketingText}" escapeXml="false" />
					   </c:forEach> 
             <c:if test="${!empty marketingSpotData.marketingContent.url}">	           
					     </a>
					   </c:if>        	
          </c:when>	
        </c:choose>        
			  </td></tr>
        <%--
          *
          * The following section can be used when debugging the output displayed on the page.
          * Note: The data can be viewed by customers with the View Source browser function if 
          * this section is left in the .jsp snippet.            
          *
        --%>
        <!--
        <%= i++ %>: <c:out value="${marketingSpotData.marketingContent.marketingContentIdentifier.uniqueID}" />
        <c:out value="${marketingSpotData.marketingContent.marketingContentIdentifier.externalIdentifier.name}" />
			  <tr><td>Name:</td> <td> <c:out value="${marketingSpotData.name}" /> </td></tr>
			  <tr><td>DataType:</td> <td> <c:out value="${marketingSpotData.dataType}" /> </td></tr>
			  <tr><td>ActivityIdentifier UniqueID:</td> <td> <c:out value="${marketingSpotData.activityIdentifier.uniqueID}" /> </td></tr>
			  <tr><td>ActivityIdentifier Name:</td> <td> <c:out value="${marketingSpotData.activityIdentifier.externalIdentifier.name}" /> </td></tr>
			  <tr><td>Activity Description:</td> <td> <c:out value="${marketingSpotData.properties['mktActivityDescription']}" /></td></tr>
			  <tr><td>CampaignName:</td> <td> <c:out value="${marketingSpotData.campaignName}" /> </td></tr>
			  <tr><td>ActivityFormat:</td> <td> <c:out value="${marketingSpotData.activityFormat}" /> </td></tr>
			  <tr><td>ActivityPriority:</td> <td> <c:out value="${marketingSpotData.activityPriority}" /> </td></tr>
        <tr><td>Url Link:</td> <td> <c:out value="${marketingSpotData.marketingContent.url}" /> </td></tr>	
        <c:forEach var="contentDescription" items="${marketingSpotData.marketingContent.marketingContentDescription}" begin="0" end="0">			
        	<tr><td>Marketing Text:</td> <td> <c:out value="${contentDescription.marketingText}" /> </td></tr>
        	<tr><td>Location:</td> <td> <c:out value="${contentDescription.location}" /> </td></tr>
        </c:forEach> 
        <tr><td>Format UniqueID:</td> <td> <c:out value="${marketingSpotData.marketingContent.marketingContentFormat.uniqueID}" /> </td></tr>
        <tr><td>Format Name:</td> <td> <c:out value="${marketingSpotData.marketingContent.marketingContentFormat.name}" /> </td></tr>      	
        <tr><td>Content Mime Type:</td> <td> <c:out value="${marketingSpotData.marketingContent.mimeType}" /> </td></tr>    
        <tr><td>Name:</td> <td> <c:out value="${marketingSpotData.marketingContent.attachment.attachmentDescription[0].name}" /> </td></tr>      	      	      	
        <tr><td>Short Description:</td> <td> <c:out value="${marketingSpotData.marketingContent.attachment.attachmentDescription[0].shortDescription}" /> </td></tr>      	      	      	      	
        <tr><td>Image:</td> <td> <c:out value="${marketingSpotData.marketingContent.attachment.attachmentUsage.image}" /> </td></tr>           
        <c:forEach var="attachmentAsset" items="${marketingSpotData.marketingContent.attachment.attachmentAsset}">
            <tr><td>Asset Mime Type:</td> <td> <c:out value="${attachmentAsset.mimeType}" /> </td></tr>      	
            <tr><td>Asset Path:</td> <td> <c:out value="${attachmentAsset.attachmentAssetPath}" /> </td></tr>      	      	
            <tr><td>Root Directory:</td> <td> <c:out value="${attachmentAsset.rootDirectory}" /> </td></tr>      	      	
	      </c:forEach>           	      	 	      	      	      	
        -->
		  </table>
		  </td>
		</c:if>
	</c:forEach> 
	</tr></table>
<%--
  *
  * End: Content
  *
--%>	

</div>
<!-- End - JSP File Name: WebServiceeMarketingSpotDisplay.jsp -->
