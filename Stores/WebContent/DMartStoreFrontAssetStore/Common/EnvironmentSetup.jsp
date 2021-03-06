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

<%-- 
  *****
  * This file retrieves and prepares a lot of information which are used by all the store JSP files.
  * This file creates JSTL variables which can just be referenced by the store JSP files that include
  * it.
  *****
--%>

<%@page import="com.ibm.commerce.context.ExternalCartContext"%>
<%@ include file="JSTLEnvironmentSetup.jspf" %>
<%@ page import="com.ibm.commerce.foundation.internal.server.services.search.config.solr.SolrSearchConfigurationRegistry"%>
<%@ page import="com.ibm.commerce.command.CommandContext" %>
<%@ page import="com.ibm.commerce.context.preview.PreviewContext" %>
<%@ page import="com.ibm.commerce.server.ECConstants"%>
<%@ page import="com.ibm.commerce.server.ConfigProperties" %>
<%@ page import="com.ibm.commerce.server.WebModuleConfig" %>
<%@ page import="com.ibm.commerce.server.WcsApp" %>
<%@page import="com.ibm.commerce.foundation.internal.server.services.registry.StoreConfigurationRegistry"%>
<%@page import="com.ibm.commerce.registry.RegistryManager"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<%@page import="com.ibm.commerce.datatype.WcParam"%>


<%
// check to see if wcparam is available; initialise it if it is not available
if( null == request.getAttribute(com.ibm.commerce.server.ECConstants.EC_INPUT_PARAM)){
	request.setAttribute(com.ibm.commerce.server.ECConstants.EC_INPUT_PARAM, new com.ibm.commerce.datatype.WcParam(request));
}
%>
<%
	StoreConfigurationRegistry defRegistryVal = (StoreConfigurationRegistry) RegistryManager.singleton().getRegistry("StoreConfigurationRegistry");
	String defStoreId = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Default.StoreId");
	pageContext.setAttribute("defStoreId", defStoreId);
	String defLangId = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Default.LangId");
	pageContext.setAttribute("defLangId", defLangId);
	String defCatalogId = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Default.CatalogId");
	pageContext.setAttribute("defCatalogId", defCatalogId);	
	String defPinCode = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Default.PinCode");
	pageContext.setAttribute("defPinCode", defPinCode);
    String dmartNewHomePage = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.NewHomePage.URL");
	pageContext.setAttribute("dmartNewHomePage", dmartNewHomePage);
	String dmartNewSEOPrepend = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.NewSEOPrepend.URL");
	pageContext.setAttribute("dmartNewSEOPrepend", dmartNewSEOPrepend);
%>

<script>
	var defPinCode = "<c:out value="${defPinCode}"/>";
</script>


<c:set var="storeId" value = "${CommandContext.storeId}" scope="request"/>
<c:if test="${empty storeId}">
	<c:set var="storeId" value = "${defStoreId}" scope="request"/>
</c:if>
<c:if test="${empty catalogId}">
	<c:set var="catalogId" value = "${defCatalogId}" scope="request"/>
</c:if>
<c:if test="${empty langId}">
	<c:set var="langId" value = "${defLangId}" scope="request"/>
</c:if>
<c:if test="${empty WCParam}">
	<%
	Map WCParamMap = new HashMap();
	WCParamMap.put("storeId",request.getAttribute("storeId").toString());
	WCParamMap.put("catalogId",request.getAttribute("catalogId").toString());
	WCParamMap.put("langId",request.getAttribute("langId").toString());
	WcParam WCParam = new WcParam(WCParamMap);
	request.setAttribute("WCParam", WCParam);
	%>	
</c:if>

<c:if test="${!empty WCParam}">
	<c:set target="${WCParam}" property="storeId" value="${storeId}"  />
	<c:set target="${WCParam}" property="catalogId" value="${catalogId}"  />
	<c:set target="${WCParam}" property="langId" value="${langId}"  />
</c:if>

<c:set var="storeIdPage" value = "${storeId}" scope="page"/>

<%-- This flow tag is used to change styles --%>
<flow:fileRef id="vfileColor" fileId="vfile.color"/>
<flow:fileRef id="StyleDir" fileId="StyleDir"/>
<flow:fileRef id="vfileStylesheet" fileId="vfile.stylesheet"/>
<flow:fileRef id="vfileStylesheetie" fileId="vfile.stylesheetie"/>
<flow:fileRef id="vfileStylesheetie7" fileId="vfile.stylesheetie7"/>
<flow:fileRef id="vfileStylesheetprint" fileId="vfile.stylesheetprint"/>
<flow:fileRef id="vfileStylesheetrwd" fileId="vfile.stylesheetrwd"/>

<c:set var = "env_vfileColor" scope="request" value="${vfileColor}"/>
<c:set var = "env_StyleDir" scope="request" value="${StyleDir}"/>
<c:set var = "env_vfileStylesheet" scope="request" value="${vfileStylesheet}"/>
<c:set var = "env_vfileStylesheetie7" scope="request" value="${vfileStylesheetie7}"/>
<c:set var = "env_vfileStylesheetprint" scope="request" value="${vfileStylesheetprint}"/>
<c:set var = "env_vfileStylesheetrwd" scope="request" value="${vfileStylesheetrwd}"/>

<%-- These are variables to use on pages --%>
<c:set var="locale" value="${CommandContext.locale}" scope="request" />
<c:set var="userType" value="${CommandContext.user.registerType}" scope="request"/>
<c:set var="userLogonState" value="0"/>
<c:if test="${userType ne 'G'}">
  <c:set var="userLogonState" value="1"/>
</c:if>
<c:set var="userDisplayName" value="${CommandContext.user.displayName}" scope="request"/>
<c:set var="anonymousUser" value="false" scope="request"/>
<c:if test="${CommandContext.user.userId eq '-1002'}">
	<c:set var="anonymousUser" value="true" scope="request"/>
</c:if>

<c:set var="lastCmdName" value="${CommandContext.commandName}" scope="request" />
<c:set var="langId" value="${CommandContext.languageId}" scope="request" />
<c:set var="storeId" value="${CommandContext.storeId}" scope="request"/>
<c:if test="${!empty WCParam.catalogId}">
	<c:set var="catalogId" scope="request"><c:out value="${WCParam.catalogId}"/></c:set>
</c:if>
<c:set var="userId" value="${CommandContext.userId}"/>

<c:set var="env_OnBehalfOf" value="false"/>
<c:set var="env_useExternalCart" value="false"/>
<c:set var="env_browseOnly" value="false"/>
<flow:ifEnabled feature="on-behalf-of">
	<%
		if (request.getAttribute(ExternalCartContext.KEY_EXTERNAL_CART_ID) == null) {
			CommandContext commandContext = (CommandContext) request.getAttribute("CommandContext");
			ExternalCartContext context = (ExternalCartContext) commandContext.getContext(ExternalCartContext.CONTEXT_NAME);
			if(context != null){
				request.setAttribute(ExternalCartContext.KEY_EXTERNAL_CART_ID, context.getAttribute(ExternalCartContext.KEY_EXTERNAL_CART_ID));
				
				String browseOnlyMode = context.getAttribute(ExternalCartContext.KEY_BROWSE_ONLY);
				if (browseOnlyMode != null && browseOnlyMode.compareToIgnoreCase("true")==0){
					request.setAttribute(ExternalCartContext.KEY_BROWSE_ONLY, "true");
				}
			}
		}
		if(null == request.getParameter("storeId")){
			String storeIdPage = pageContext.getAttribute("storeIdPage").toString();
			request.setAttribute("storeId",storeIdPage);
		}
	%>
	<c:if test="${!empty CommandContext.forUserId }">
		<c:set var="env_OnBehalfOf" value="true"/>
		<c:if test="${!empty extCartId }">
			<c:set var="env_useExternalCart" value="true"/>
		</c:if>	
		<c:if test="${!empty browseOnly}">
			<c:set var="env_browseOnly" value="true"/>
		</c:if>	
	</c:if>	
</flow:ifEnabled>

<%-- Determine if we are in preview mode. --%>
<wcst:preview var="env_inPreview" />
<%
	//Port changes for SOLR in secure pages
	StoreConfigurationRegistry storecnfRegistry = (StoreConfigurationRegistry) RegistryManager.singleton().getRegistry("StoreConfigurationRegistry");
	String SOLRSecurePort = storecnfRegistry.getSingleton().getValue(0, "DMart.SOLR.securehost");
	//Port changes for SOLR in secure pages
	if (request.getAttribute("searchHostNamePath") == null) {
		Boolean inPreview = (Boolean) request.getAttribute("env_inPreview");
		SolrSearchConfigurationRegistry env_SolrSearchConfigurationRegistry = SolrSearchConfigurationRegistry.getInstance();
		String hostname = env_SolrSearchConfigurationRegistry.getSearchServerHostname();
		if (inPreview != null && inPreview) {
			// In preview mode
			request.setAttribute("searchHostNamePath", "https://" + hostname + ":" + env_SolrSearchConfigurationRegistry.getSearchServerPreviewSecuredPort());
			//Port changes for SOLR in secure pages
			request.setAttribute("searchSecureHostNamePath", "https://" + hostname + ":" + SOLRSecurePort);
			request.setAttribute("searchContextPath", env_SolrSearchConfigurationRegistry.getSearchServerPreviewContextPath());
		} else {
			// Non preview mode
			request.setAttribute("searchHostNamePath", "http://" + hostname + ":" + env_SolrSearchConfigurationRegistry.getSearchServerPort());
			//Port changes for SOLR in secure pages
			request.setAttribute("searchSecureHostNamePath", "https://" + hostname + ":" + SOLRSecurePort);
			request.setAttribute("searchContextPath", env_SolrSearchConfigurationRegistry.getSearchServerContextPath());
		}
	}
	
	
	// Image URL for products
	String imageServerHost = storecnfRegistry.getSingleton().getValue(0, "DMart.ImageServer.Host");
	request.setAttribute("imageServerHostPath", imageServerHost);
	
	// Static server URL for CSS, Nunjucks, JS and other images 
	String staticServerHost = storecnfRegistry.getSingleton().getValue(0, "DMart.StaticServer.Host");
	request.setAttribute("staticServerHostPath", staticServerHost);
	
	// Enable/Disable LS
	String disableLocalStorage = storecnfRegistry.getSingleton().getValue(0, "DMart.Disable.LocalStorage");
	request.setAttribute("disableLocalStorage", disableLocalStorage);
	
	// LS compression
	String disableLSCompression = storecnfRegistry.getSingleton().getValue(0, "DMart.Disable.LocalStorage.Compression");
	request.setAttribute("disableLSCompression", disableLSCompression);	
%>

<c:if test="${empty REST_CONFIG}">
	<jsp:useBean id="REST_CONFIG" class="java.util.HashMap" scope="request"/>
	<c:choose>
		<c:when test="${pageContext.request.secure}">
			<c:choose>
				<c:when test="${env_inPreview}">
					<c:if test="${empty secureRestPreviewConfig}">
						<jsp:useBean id="secureRestPreviewConfig" class="java.util.HashMap" scope="request"/>
						<c:set target="${secureRestPreviewConfig}" property="schema" value="https"/>
						<c:set target="${secureRestPreviewConfig}" property="host" value="${pageContext.request.serverName}"/>
						<%
							WebModuleConfig webModuleConfig = WcsApp.configProperties.getWebModule("RestPreview");
							secureRestPreviewConfig.put("port", webModuleConfig.getSSLPort());
							secureRestPreviewConfig.put("contextPath", webModuleConfig.getContextPath());
						%>
					</c:if>
					<c:set target="${REST_CONFIG}" property="${storeId}" value="${secureRestPreviewConfig}"/>
				</c:when>
				<c:otherwise>
					<c:if test="${empty secureRestConfig}">
						<jsp:useBean id="secureRestConfig" class="java.util.HashMap" scope="request"/>
						<c:set target="${secureRestConfig}" property="schema" value="https"/>
						<c:set target="${secureRestConfig}" property="host" value="${pageContext.request.serverName}"/>
						<%
							WebModuleConfig webModuleConfig = WcsApp.configProperties.getWebModule("Rest");
							secureRestConfig.put("port", webModuleConfig.getSSLPort());
							secureRestConfig.put("contextPath", webModuleConfig.getContextPath());
						%>
					</c:if>
					<c:set target="${REST_CONFIG}" property="${storeId}" value="${secureRestConfig}"/>
				</c:otherwise>
			</c:choose>
		</c:when>
		<c:otherwise>
			<c:choose>
				<c:when test="${env_inPreview}">
					<c:if test="${empty restPreviewConfig}">
						<jsp:useBean id="restPreviewConfig" class="java.util.HashMap" scope="request"/>
						<c:set target="${restPreviewConfig}" property="schema" value="http"/>
						<c:set target="${restPreviewConfig}" property="host" value="${pageContext.request.serverName}"/>
						<%
							WebModuleConfig webModuleConfig = WcsApp.configProperties.getWebModule("RestPreview");
							restPreviewConfig.put("port", webModuleConfig.getNonSSLPort());
							restPreviewConfig.put("contextPath", webModuleConfig.getContextPath());
						%>
					</c:if>
					<c:set target="${REST_CONFIG}" property="${storeId}" value="${restPreviewConfig}"/>
				</c:when>
				<c:otherwise>
					<c:if test="${empty restConfig}">
						<jsp:useBean id="restConfig" class="java.util.HashMap" scope="request"/>
						<c:set target="${restConfig}" property="schema" value="http"/>
						<c:set target="${restConfig}" property="host" value="${pageContext.request.serverName}"/>
						<%
							WebModuleConfig webModuleConfig = WcsApp.configProperties.getWebModule("Rest");
							restConfig.put("port", webModuleConfig.getNonSSLPort());
							restConfig.put("contextPath", webModuleConfig.getContextPath());
						%>
					</c:if>
					<c:set target="${REST_CONFIG}" property="${storeId}" value="${restConfig}"/>
				</c:otherwise>
			</c:choose>
		</c:otherwise>
	</c:choose>
</c:if>

<wcf:useBean var="cachedCatalogEntryDetailsMap" classname="java.util.HashMap" scope="request"/>
<wcf:useBean var="cachedCategoryViewMap" classname="java.util.HashMap" scope="request"/>
<wcf:useBean var="cachedOnlineStoreMap" classname="java.util.HashMap" scope="request"/>
<wcf:useBean var="cachedUsableShippingInfoMap" classname="java.util.HashMap" scope="request"/>

<c:set var="key1" value="store/${storeId}/databean+IBM_Store_Details+${langId}+${jspStoreDir}"/>
<c:set var="sdb" value="${cachedOnlineStoreMap[key1]}"/>
<c:if test="${empty sdb}">
	<wcf:rest var="sdb" url="store/${storeId}/databean" cached="true">
		<wcf:var name="storeId" value="${storeId}" encode="true"/>
		<wcf:param name="profileName" value="IBM_Store_Details" encode="true"/>
		<wcf:param name="langId" value="${langId}" encode="true"/>
		<wcf:param name="jspStoreDir" value="${jspStoreDir}" encode="true" />
	</wcf:rest>
	<wcf:set target = "${cachedOnlineStoreMap}" key="${key1}" value="${sdb}"/>
</c:if>
<c:set var="storeName" value="${sdb.storeEntityDescription.displayName}" scope="request" />
<%-- Determine whether store is B2B store type --%>
<c:if test="${sdb.storeType == 'B2B' || sdb.storeType == 'BMH'}" >
	<c:set var="env_b2bStore" value="true"/>
</c:if>
<%-- Does this store support mobile store --%>
<c:if test = '${fn:contains(sdb.storeLevel,"MOBILE")}'>
	<c:set var="env_mobileStoreSupport" value="true" scope="request" />
</c:if>

<%--
	For CaaS, prefix the path of jspStoreImgDir and jsAssetsDir, so that it points to webserver. OOB it will be empty
--%>
<c:set var = "jsServerPath" value=""/>
<c:set var = "cssServerPath" value=""/>

<%-- urlLangId parameter can be passed to wcf:url tags. If passed, this urlLangId will be used to look up
the URL keywords. If keywords are not found for this urlLangId, then store default langId will be used to look up
the URL keywords. By default page langId is set as urlLangId. If store URLs are supported in only one language, then set that
Id here --%>
<c:set var="urlLangId" value="${langId}" scope="request"/>

<%-- URL pointing to the hosted store home directory.  Use this to reference images --%>
<c:set var="storeImgDir" value="${sdb.filePath}" scope="request" />

<%-- WebAsset directory of the hosted store.  Includes JSPs, HTML, Image files, etc --%>
<c:set var="storeDir" value="${sdb.jspPath}" scope="request" />

<%-- URL pointing to the shared image directory.  Use this to reference images --%>
<c:set var="jspStoreImgDir" value="${jsServerPath}${sdb.jspStoreDirFilePath}" scope="request" />

<%-- WebAsset directory of the shared file directory.  Includes JSPs, HTML, Image files, etc --%>
<c:set var="env_jspStoreDir" value="/${sdb.jspStoreDir}/" scope="request" />

<%-- Path used to retrieve the JavaScript assets.  Use this to reference your JavaScript files. --%>
<c:set var="jsAssetsDir" value="${cssServerPath}${sdb.jspStoreDirFilePath}" scope="request" />

<%-- Path to Commerce Composer site level widgets. --%>
<c:set var="env_siteWidgetsDir" value="/Widgets_701/" scope="request" />

<%--
Example directories:
storeImgDir - /wcsstore/<hostedstoredir>/
storeDir - /<hostedstoredir>/
jspStoreImgDir - /wcsstore/<sharedstorefrontassetstoredir>/ 
jspStoreDir - /<sharedstorefrontassetstoredir>/ 
--%>

<%-- Load the store bundles --%>
<c:if test="${env_inPreview }">
	<c:if test="${not empty cookie.WC_TOOLLOCALE.value }">
		<fmt:setLocale value="${cookie.WC_TOOLLOCALE.value}"/>
	</c:if>
	<c:if test="${empty cookie.WC_TOOLLOCALE.value }">
	<%-- 
		The TOOLLOCALE will be empty if the preview launched from Accelerator 
	--%>
		<fmt:setLocale value="${CommandContext.locale}" />
	</c:if>
	<fmt:setBundle basename="com.ibm.commerce.stores.preview.properties.StorePreviewer" var="previewText"  scope="request"/>
</c:if>

<fmt:setLocale value="${CommandContext.locale}" />
<fmt:setBundle basename="/${sdb.jspStoreDir}/storetext_v2" var="storeText" scope="request"/>

<c:set var="dojolocale" value="${fn:replace(locale, '_' , '-')}" />
<c:set var="dojolocale" value="${fn:toLowerCase(dojolocale)}" />

<c:set var="dojoDir" value="${staticAssetContextRoot}/dojo18"/>
<c:set var="dojoFile" value="${dojoDir}/dojo/dojo.js"/>
<c:set var="dojoFileDesktop" value="${dojoDir}/dojo/dojodesktop-rwd.js"/>

<%-- Register module path to the NLS error messages folder --%>
<c:set var="dojoConfigParams" value="parseOnLoad: true, isDebug: false,  modulePaths: {storetext: '${sdb.jspStoreDirFilePath}'}, useCommentedJson: true,locale: '${dojolocale}' "/>

<%-- Default view in which products are displayed--%>
<c:set var="env_defaultPageView" value="grid" scope="request"/>

<%-- Is contract selection enabled? --%>
<flow:ifEnabled feature="contractSelection">
	<c:set var="env_contractSelection" value="true" scope="request"/>
</flow:ifEnabled>
<flow:ifDisabled feature="contractSelection">
	<c:set var="env_contractSelection" value="false" scope="request"/>
</flow:ifDisabled>
<c:set var="env_displayListPriceInProductPage" value="true" scope="request"/>

<%-- Set to context root where images can be found --%>
<c:set var="env_imageContextPath" value="${staticAssetContextRoot}" /> 

<c:choose>
	<c:when test="${CommandContext.locale eq 'iw_IL'}">
		<c:set var="isBiDiLocale" value="true" scope="request"/>
		<c:set var="shortLocale" value="he"/>
	</c:when>
	<c:when test="${CommandContext.locale eq 'ar_EG'}">
		<c:set var="isBiDiLocale" value="true" scope="request"/>
		<c:set var="shortLocale" value="${fn:substring(CommandContext.locale,0,2)}"/>
	</c:when>
	<c:otherwise>
		<c:set var="shortLocale" value="${fn:substring(CommandContext.locale,0,2)}"/>
		<c:set var="isBiDiLocale" value="false" scope="request"/>
	</c:otherwise>
</c:choose>

<c:set var="key1" value="store/${storeId}/currency_format+byCurrency+${CommandContext.currency}+-1+${langId}"/>
<c:set var="currencyFormatterDB" value="${cachedOnlineStoreMap[key1]}"/>
<c:if test="${empty currencyFormatterDB}">
	<wcf:rest var="getCurrencyFormatResponse" url="store/{storeId}/currency_format" cached="true">
		<wcf:var name="storeId" value="${storeId}" />
		<wcf:param name="q" value="byCurrency" />
		<wcf:param name="currency" value="${CommandContext.currency}" />
		<wcf:param name="numberUsage" value="-1" />
		<wcf:param name="langId" value="${langId}" />
	</wcf:rest>
	<c:set var="currencyFormatterDB" value="${getCurrencyFormatResponse.resultList[0]}" scope="request" />
	<wcf:set target = "${cachedOnlineStoreMap}" key="${key1}" value="${currencyFormatterDB}"/>
</c:if>

<c:set var="env_currencyDecimal" value="${currencyFormatterDB.decimalPlaces}" scope="request"/>
<c:set var="env_currencyCode" value="${currencyFormatterDB.currencyCode}" scope="request"/>

<c:if test="${CommandContext.currency == 'KRW'}">
	<c:set property="currencySymbol" value='&#8361;' target="${currencyFormatterDB}"/>
</c:if>
<c:if test="${CommandContext.currency == 'PLN'}">
	<c:set property="currencySymbol" value='z&#322;' target="${currencyFormatterDB}"/>
</c:if>
<c:if test="${CommandContext.currency == 'TRY'}">
	<%-- No longer necessary when Turkish Lira is displayable through Unicode --%>
	<c:set property="currencySymbol" value="<IMG src='${env_imageContextPath}/images/turkish_lira.gif' align='bottom'>" target="${currencyFormatterDB}"/>
</c:if>
<c:if test="${CommandContext.currency == 'EGP' && locale != 'iw_IL'}">
	<c:set property="currencySymbol" value="<SPAN dir=ltr> .&#1580;.&#1605;</SPAN>" target="${currencyFormatterDB}"/>
</c:if>
<c:if test="${CommandContext.currency == 'ILS' && locale == 'iw_IL'}">
	<c:set property="currencySymbol" value="&#1513;&#1524;&#1495;" target="${currencyFormatterDB}"/>
</c:if>	

<c:set var="env_CurrencySymbolToFormat" value="${currencyFormatterDB.currencySymbol}" scope="request"/>

<%
    	// Add support for possible SSL Accelerator port setup in WC config file.
    	// There could be a setup for using different ports for SSL and nonSSL 
    	// which are not 443 and 80 respectively.
    	
    	// Uncomment the code below if using SSL Accelerator and want to read the values from the configuration file.
    	// Reading from config file can have a negative effect on performance. A better approach is to just enter the
    	// port values in this file directly by putting value in inSSLAcceleratorPort and inNonSSLAcceleratorPort
    	// variables below.
    	//WebModuleConfig storeWebModule = ConfigProperties.singleton().getWebModule(WcsApp.storeWebModuleName);
    	if (request.getAttribute("loginTimeoutValue") == null) {
			String loginTimeoutValue = ConfigProperties.singleton().getValue("LoginTimeout/Timeout/value");
			request.setAttribute("loginTimeoutValue", loginTimeoutValue);
    	}
    	
    	if (request.getAttribute("inSSLAcceleratorPort") == null) {
	    	int inSSLAcceleratorPort = 443;
	    	//if (storeWebModule.getInSSLPort() != null) {
	    	//	inSSLAcceleratorPort = new Integer(storeWebModule.getInSSLPort()).intValue();
	    	//}
	    	int inNonSSLAcceleratorPort = 80;
	    	//if (storeWebModule.getInNonSSLPort() != null) {
	    	//	inNonSSLAcceleratorPort = new Integer(storeWebModule.getInNonSSLPort()).intValue();
	    	//}
	    	request.setAttribute("inSSLAcceleratorPort", inSSLAcceleratorPort);
	    	request.setAttribute("inNonSSLAcceleratorPort", inNonSSLAcceleratorPort);
	    }
%>
<c:set var="request" value="${pageContext.request}"/>
<c:choose>
	<c:when test="${request.serverPort != 80 && request.serverPort != 443 && request.serverPort != requestScope.inSSLAcceleratorPort && request.serverPort != requestScope.inNonSSLAcceleratorPort}">
		<c:set var="portUsed" value=":${request.serverPort}"/>
	</c:when>
	<c:otherwise>
		<c:set var="portUsed" value=""/>
	</c:otherwise>
</c:choose>

<c:set var="schemeToUse" value="http"/>
<c:choose>
	<c:when test="${request.serverPort == requestScope.inSSLAcceleratorPort}">
		<c:set var="schemeToUse" value="https"/>
	</c:when>
	<c:when test="${request.serverPort == requestScope.inNonSSLAcceleratorPort}">
		<c:set var="schemeToUse" value="http"/>
	</c:when>
	<c:otherwise>
		<c:set var="schemeToUse" value="${request.scheme}"/>
	</c:otherwise>
</c:choose>

<c:set var="env_schemeToUse" value="${schemeToUse}" scope="request"/>
<c:set var="env_contextPathUsed" value="" scope="request"/>
<c:set var="env_absoluteUrl" value="" scope="request"/>

<%
	// Get context root from SEO Registry
	if (request.getAttribute("SEOContextPath") == null) {
		String contextRoot = com.ibm.commerce.seo.registry.SEOConfigurationRegistry.singleton().getRewriteRuleForStore();
		request.setAttribute("SEOContextPath",contextRoot);
	}
%>

<c:choose>
	<c:when test="${env_inPreview}">
		<c:if test="${!empty requestScope['requestURIPath'] && requestScope['requestURIPath'] != null && !empty requestScope['requestServletPath'] && requestScope['requestServletPath'] != null}">
			<c:set var="env_contextPathUsed" value="${fn:substringBefore(requestScope['requestURIPath'],requestScope['requestServletPath'])}" scope="request"/>
			<c:set var="env_contextAndServletPath" value="${env_contextPathUsed}${requestScope['requestServletPath']}" scope="request"/>
			<c:set var="env_absoluteUrl" value="${schemeToUse}://${request.serverName}${portUsed}${env_contextPathUsed}${requestScope['requestServletPath']}/" scope="request"/>
			<c:set var="env_TopCategoriesDisplayURLHierarchy" value="${schemeToUse}://${dmartNewSEOPrepend}" scope="request"/>
			<c:set var="env_TopCategoriesDisplayURL" value="${schemeToUse}://${dmartNewHomePage}" scope="request"/>
		</c:if>
	</c:when>
	<c:otherwise>
		<c:set var="env_contextAndServletPath" value="${SEOContextPath}" scope="request"/>
		<c:set var="env_absoluteUrl" value="${schemeToUse}://${request.serverName}${portUsed}${SEOContextPath}/" scope="request"/>
		<c:set var="env_TopCategoriesDisplayURLHierarchy" value="${schemeToUse}://${dmartNewSEOPrepend}" scope="request"/>
		<c:set var="env_TopCategoriesDisplayURL" value="${schemeToUse}://${dmartNewHomePage}" scope="request"/>
	</c:otherwise>
</c:choose>

<%-- This variable is used to determine if the should support payment type promotions on the shipping & billing method page. --%>
<flow:ifEnabled feature="PaymentPromotion">
	<c:set var="supportPaymentTypePromotions" value="true"/>
</flow:ifEnabled>
<flow:ifDisabled feature="PaymentPromotion">
	<c:set var="supportPaymentTypePromotions" value="false"/>
</flow:ifDisabled>

<%-- Constants used by subscriptions products --%>
<c:set var="env_subsFulfillmentFrequencyAttrName" value="fulfillmentFrequency" scope="request"/>
<c:set var="env_subsPaymentFrequencyAttrName" value="paymentFrequency" scope="request"/>
<c:set var="env_subsTimePeriodAttrName" value="timePeriod" scope="request"/>

<%-- Since this env file is included at lot of places, make sure that we construct HomePageURLWithLang SEO URL only once --%>
<%--
<c:if test = "${empty env_TopCategoriesDisplayURL}">
	<wcf:url var="TopCategoriesDisplayURLTemp" value="TopCategories1" patternName="HomePageURLWithLang">
		<wcf:param name="langId" value="${langId}" />
		<wcf:param name="storeId" value="${storeId}" />
		<wcf:param name="catalogId" value="${catalogId}" />
		<wcf:param name="urlLangId" value="${urlLangId}"/>
		<wcf:param name="homePageName" value="home"/>
	</wcf:url>
	<%-- Put the variable in request scope, so that imported JSP's will find this var 
	<c:set var="env_TopCategoriesDisplayURL" value="${TopCategoriesDisplayURLTemp}" scope="request"/>
</c:if>
--%>
<%--
<c:if test = "${empty env_TopCategoriesDisplayURLHierarchy}">
	<wcf:url var="TopCategoriesDisplayURLTempHierarchy" value="TopCategories1" patternName="HomePageURLWithLangHierarchy">
		<wcf:param name="langId" value="${langId}" />
		<wcf:param name="storeId" value="${storeId}" />
		<wcf:param name="catalogId" value="${catalogId}" />
		<wcf:param name="urlLangId" value="${urlLangId}"/>
	</wcf:url>
	<%-- Put the variable in request scope, so that imported JSP's will find this var 
	<c:set var="env_TopCategoriesDisplayURLHierarchy" value="${TopCategoriesDisplayURLTempHierarchy}" scope="request"/>
</c:if>
 --%>
<c:set var="env_maxOrderItemsToInspect" value="50"/>

<%-- Begin pagination control variables definition --%>
<%-- set default pageSize and beginIndex --%>
<c:set var="beginIndex" scope="request"><c:out value="${WCParam.beginIndex}" /> </c:set>
<c:if test="${empty beginIndex}">
	<c:set var="beginIndex" value = "0" scope="request"/>
</c:if>

<c:set var="pageSize" scope="request"><c:out value="${WCParam.pageSize}" /></c:set>
<c:if test="${empty pageSize}">
	<c:set var="pageSize" scope="request"><c:out value="${param.resultsPerPage}" /></c:set>
	<c:if test="${empty pageSize}">
		<c:set var="pageSize" value="12" scope="request"/>
	</c:if>
</c:if>
<c:set var="env_resultsPerRow" value="4" scope="request"/>
<c:set var="env_grid_pagination_count" value = "${12}" scope="request"/>
<c:set var="env_list_pagination_count" value = "${8}" scope="request"/>
<%-- End pagination control variables definition --%>

<%-- env_fetchMarketingDetailsOnLoad, if set to true will fetch discounts, promos and espot on page load --%>
<c:set var="env_fetchMarketingDetailsOnLoad" value="false" scope="request"/>

<%
	// gets the webalias (default is /wcsstore)
	if (request.getAttribute("env_webAlias") == null) {
		String webAlias = ConfigProperties.singleton().getWebModule(WcsApp.storeWebModuleName).getWebAlias();
		request.setAttribute("env_webAlias", webAlias);
	}
%>

<%-- Image directory name conventions --%>
<c:set var="itemThumbnailImage" value="200x310" scope="request"/>
<c:set var="itemFullImage" value="646x1000" scope="request"/>

<c:set var="productThumbnailImage" value="200x310" scope="request"/>
<c:set var="productMasterImage" value="646x1000" scope="request"/>

<c:set var="profileShippingNickname" value="Default_Shipping_${storeId}"/>
<c:set var="profileBillingNickname" value="Default_Billing_${storeId}"/>

<c:set var="maxOrderItemsPerPage" value="20"/>
<c:set var="maxOrderItemsToInspect" value="50"/>

<%-- Oracle has a limitation on the number of identifiers on an "in" clause --%>
<c:set var="maxSKUs" value="1000"/>

<%-- These variables are used to determine if the corresponding orders will be categorized and displayed in the order status section. --%>
<c:set var="showProcessedOrders" value="true"/>
<c:set var="showWaitingForApprovalOrders" value="false"/>
<flow:ifEnabled feature="contractSelection">
	<c:set var="showWaitingForApprovalOrders" value="true"/>
</flow:ifEnabled>
<c:set var="showScheduledOrders" value="false"/>

<%-- The variable showPONumber is used to indicate if the purchase order number should be displayed for this store. --%>
<c:set var="showPONumber" value="false"/>
<flow:ifEnabled feature="contractSelection">
	<c:set var="showPONumber" value="true"/>
</flow:ifEnabled>

<%-- The variable ariaMessageNode is used to indicate id of the span where refreshArea will update message when the content is updated.  This message will notify the user of certain section on the page is updated after the refreshArea is completed using aria live region.  The default span is located in MessageDisplay.jspf --%>
<c:set var="ariaMessageNode" value="ariaMessage" scope="request"/>

<%
	if (request.getAttribute("previewContext") == null) {
		request.setAttribute("previewContext", ((CommandContext) request.getAttribute("CommandContext")).getContext(PreviewContext.CONTEXT_NAME));
	}
%>
<c:set var="env_storePreviewLink" value="${!empty previewContext && !empty previewContext.properties['previewToken']}"/>

<%-- The amount of time that the inactivity dialog will stay before it closes itself, default is 20 sec  --%>
<c:set var="inactivityWarningDialogDisplayTimer" value="20000" scope="request"/>

<%-- The amount of time that the inactivity dialog will display before the server time out, the default server timeout is 30 minutes and the dialog wlil open 30 seconds before that --%>
<c:set var="inactivityWarningDialogBuffer" value="30000" scope="request"/>

<%@ include file="../ShoppingArea/Configurator/SterlingConfiguratorIntegrationSetup.jspf" %>	
<c:set var="android" value="${fn:contains(fn:toLowerCase(header['User-Agent']),'android')}" scope="request"/>
<c:set var="ios" value="${fn:contains(fn:toLowerCase(header['User-Agent']),'ipad') || fn:contains(fn:toLowerCase(header['User-Agent']),'iphone') || fn:contains(fn:toLowerCase(header['User-Agent']),'ipod')}" scope="request"/>
<c:if test="${ios == 'true'}">
	<c:set var="systemClass" value="class='ios'"/>
</c:if>
<c:set var="env_Tealeaf" value="false"/>
<flow:ifEnabled feature="Tealeaf">
	<c:set var="env_Tealeaf" value="true"/>
</flow:ifEnabled>

<%-- These variables are used to store the frequency values for a recurring order.--%>
<c:set var="RecurringOrderFrequency1" value="1"/>
<c:set var="RecurringOrderFrequency2" value="1"/>
<c:set var="RecurringOrderFrequency3" value="1"/>
<c:set var="RecurringOrderFrequency4" value="2"/>
<c:set var="RecurringOrderFrequency5" value="3"/>
<c:set var="RecurringOrderFrequency6" value="4"/>

<%-- These variables are used to store the UOM of recurring order frequencies. The possible values are: DAY, HUR, MON, WEE, ANN--%>
<c:set var="RecurringOrderFrequencyUOM1" value="DAY"/>
<c:set var="RecurringOrderFrequencyUOM2" value="DAY"/>
<c:set var="RecurringOrderFrequencyUOM3" value="WEE"/>
<c:set var="RecurringOrderFrequencyUOM4" value="WEE"/>
<c:set var="RecurringOrderFrequencyUOM5" value="WEE"/>
<c:set var="RecurringOrderFrequencyUOM6" value="WEE"/>
<c:set var="RecurringOrderFrequencyDayUOM" value="DAY"/>
<c:set var="RecurringOrderFrequencyWeekUOM" value="WEE"/>
<c:set var="RecurringOrderFrequencyMonthUOM" value="MON"/>

<%-- These variables are used to store the frequency display texts for recurring orders. --%>
<fmt:message bundle="${storeText}" var="RecurringOrderFrequencyText1" key="SCHEDULE_ORDER_INTERVAL_1" />
<fmt:message bundle="${storeText}" var="RecurringOrderFrequencyText2" key="EVERY_DAY" />
<fmt:message bundle="${storeText}" var="RecurringOrderFrequencyText3" key="EVERY_WEEK" />
<fmt:message bundle="${storeText}" var="RecurringOrderFrequencyText4" key="EVERY_X_WEEKS" >
	<fmt:param value="${RecurringOrderFrequency4}"></fmt:param>
</fmt:message>
<fmt:message bundle="${storeText}" var="RecurringOrderFrequencyText5" key="EVERY_X_WEEKS" >
	<fmt:param value="${RecurringOrderFrequency5}"></fmt:param>
</fmt:message>
<fmt:message bundle="${storeText}" var="RecurringOrderFrequencyText6" key="EVERY_X_WEEKS" >
	<fmt:param value="${RecurringOrderFrequency6}"></fmt:param>
</fmt:message>

<%-- This variable is used to store the notice period for cancelling a recurring order in seconds. --%>
<c:set var="cancelRecurringOrderNoticePeriod" value="43200"/>

<%-- This variable is used to store the notice period for cancelling a subscription in seconds. --%>
<c:set var="cancelSubscriptionNoticePeriod" value="43200"/>

<%-- Mobile30 setup START --%>
<c:set var="pageMax1" value="5"/>
<c:set var="pageMax2" value="10"/>
<c:set var="storeNameDir" value="mobile30/" scope="page" />
<c:set var="mobileBasePath" value="${storeNameDir}" scope="page" />

<%-- Set variables for device specific rendering --%>
<c:if test="${EC_deviceAdapter.deviceFormatId == -44 || EC_deviceAdapter.deviceFormatId == -42}">
	<c:set var="_worklightHybridApp" value="true" scope="request"/>
	<c:set var="mobileBasePath" value="WorklightHybrid/"/>
	<c:set var="pageMax1" value="20"/>
	<c:set var="pageMax2" value="20"/>
</c:if>

<flow:fileRef id="vfileStylesheet_m30" fileId="vfile.stylesheet"/>
<c:set var = "env_vfileStylesheet_m30" scope="request" value="${jspStoreImgDir}${storeNameDir}${vfileStylesheet_m30}" />

<%-- Set mobile viewport --%>
<c:set var="viewport" value="width=device-width, initial-scale=1"/>

<c:set var="shopcartMaxPageSize" value="${pageMax1}" />
<c:set var="addressBookMaxPageSize" value="${pageMax1}"/>
<c:set var="departmentMaxPageSize" value="${pageMax2}" />
<c:set var="categoryMaxPageSize" value="${pageMax2}" />
<c:set var="productsMaxPageSize" value="${pageMax2}" />
<c:set var="searchResultsMaxPageSize" value="${pageMax2}" />
<c:set var="storeLocatorResultMaxPageSize" value="${pageMax2}" />
<c:set var="wishlistMaxPageSize" value="${pageMax2}" />
<c:set var="orderHistoryMaxPageSize" value="${pageMax2}" />
<c:set var="orderSummaryMaxPageSize" value="${pageMax2}" />

<c:set var="totalCheckoutSteps" value="5" />

<%-- The number of products/items that can be compared at a time --%>
<c:set var="numProdToCompare" value="0" />
<c:set var="maxProdToCompare" value="2" />

<%-- Number of physical stores allowed in the store list --%>
<c:set var="physicalStoreCookieMaxSize" value="5" />
<%-- Mobile30 setup END --%>

<c:set var="deviceClass" value="Web"/>
<c:if test="${ (EC_device.properties.deviceClass != null) && (!empty EC_device.properties.deviceClass) }">
	<c:set var="deviceClass" value="${EC_device.properties.deviceClass}"/>
</c:if>

<%-- Set this to false, if you want the entire department list to be loaded during pageLoad itself. 
If set to true, department list will be loaded on-demand, when shopper clicks on the department button --%>
<c:set var="lazyLoadDepartmentsList" value="true"/>

<%-- Find out if multiple login session for same user is enabled --%> 
<%
	if (request.getAttribute("multiSessionEnabled") == null) {
		boolean multiSessionEnabled = false;
		String enabled = WcsApp.configProperties.getValue("SessionManagement/AllowMultipleLogonForSameUser/enabled");
		if (enabled != null && enabled.compareToIgnoreCase("true")==0){
			multiSessionEnabled = true;
		} else {
			multiSessionEnabled = false;
		}
		request.setAttribute("multiSessionEnabled", multiSessionEnabled);
	}
%>

<c:set var="defaultDisplayPriceRuleName" value="List price rule"/>
<c:set var="env_displayRibbonAdInGridMode" value="true" scope="request"/>
<c:set var="env_includeJSPFExtension" value="false" scope="request"/>

<%-- variables for buy on behalf  --%>
<c:if test="${empty env_shopOnBehalfEnabled and userType ne 'G'}">
    <c:set var="env_shopOnBehalfEnabled" value="false"/>
    <c:if test="${env_b2bStore eq true}">
      <c:set var="env_shopOnBehalfSessionEstablished" value="false"/>
      <c:if test="${CommandContext.callerId != CommandContext.forUserId && !empty CommandContext.stickyUserId}">
         <c:set var="env_shopOnBehalfSessionEstablished" value="true"/>
         <c:set var="env_shopOnBehalfEnabled" value="true"/>
         
         <%-- With the run as user set, the user display name cannot be based on the command context's current user--%>
         <c:set var="userLoginCookie" value="WC_LogonUserId_${WCParam.storeId}"/>
         <c:if test="${!empty cookie[userLoginCookie].value}"> 
	     <c:set var="userDisplayName" value="${cookie[userLoginCookie].value}"/>
	     <%
		      String decoded = java.net.URLDecoder.decode((String)pageContext.getAttribute("userDisplayName"), "UTF-8");
		      if(decoded != null){
		        pageContext.setAttribute("userDisplayName", decoded);
		      } 
	    %>
         </c:if>
         
         <c:set var="env_buyOnBehalfAdminUserId" value="${CommandContext.callerId}"/>
         <c:set var="env_buyOnBehalfUserId" value="${CommandContext.forUserId}"/>
      </c:if>
      <c:if test="${env_shopOnBehalfSessionEstablished eq false}">
        <%-- Enable shop on behalf for buyer adminstrators --%>
        <c:set var="userRoles" value="${CommandContext.user.roles}"/>
        <c:if test="${!empty userRoles}">
            <c:forEach items="${userRoles}" var="userRole">
                <c:if test="${userRole eq '-21'}">
                    <c:set var="env_shopOnBehalfEnabled" value="true"/>
                </c:if>
            </c:forEach>
        </c:if>
      </c:if> 
    </c:if>
</c:if>

<%-- IT configurable flag for disabling global login view  --%>
<c:set var="env_globalLoginViewDisabled" value="false"/>		
<%
response.setHeader("X-Frame-Options","SAMEORIGIN");
%>
