<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://commerce.ibm.com/base" prefix="wcbase" %>
<%@ taglib uri="flow.tld" prefix="flow" %>
<%@ include file="EnvironmentSetup.jspf" %>
<%@ include file="nocache.jspf" %>
<%@ taglib uri="http://commerce.ibm.com/foundation" prefix="wcf" %>             
<%@ taglib uri="http://commerce.ibm.com/coremetrics"  prefix="cm" %>
<%@ include file="../include/ErrorMessageSetup.jspf" %>
<%@ page import="java.math.*"%>
<%@ page import="java.io.*,java.util.*, javax.servlet.*"%>
<%@ page import="javax.servlet.http.*"%>
<%@ page import="com.ibm.commerce.datatype.MapBasedTypedProperty" %>
<%@ page import="java.net.URL" %>
<%@ page import="java.net.MalformedURLException" %>

<!DOCTYPE HTML>

<!-- BEGIN DmartRedirectURL.jsp -->
<html xmlns="http://www.w3.org/1999/xhtml" lang="${shortLocale}" xml:lang="${shortLocale}">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	
	<link rel="stylesheet" href="<c:out value="${jspStoreImgDir}${env_vfileStylesheet}"/>" type="text/css"/> 
	<%@ include file="CommonJSToInclude.jspf"%>
	<%@ include file="CommonJSPFToInclude.jspf"%>
	<c:set var="pageGroup" value="OrderDetails"/>
	<%@ include file="DMartCommonJSToInclude.jspf"%>
	<%
		StoreConfigurationRegistry storeRegistry = (StoreConfigurationRegistry) RegistryManager.singleton().getRegistry("StoreConfigurationRegistry");
		String appDomain = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.qGraph.Mobile.App.Domain");
		String appRedirectTimeout = StoreConfigurationRegistry.getSingleton().getValue(0, "DMart.Mobile.Deeplink.Redirect.Timeout");
		pageContext.setAttribute("appDomain", appDomain);
		pageContext.setAttribute("appTimeout", appRedirectTimeout);		
	%>

</head>
<body>
	<div id="loadingActionDiv" class="modal-dialog js-modal-dialog-esc">
		<img id="loadingsymbol"  style="position: absolute; margin: auto; top: 0; left: 0; right: 0; bottom: 0;" src="/wcsstore/DMartStoreFrontAssetStore/images/CheckoutLoader.gif" alt="Please Wait">
	</div>
	<!-- Page Start -->
	<div id="page">
		<%
			String userAgent = request.getHeader("User-Agent");
			Hashtable ht = new Hashtable();
			MapBasedTypedProperty obj = (MapBasedTypedProperty)request.getAttribute("RequestProperties");
			String redirectUrl = obj.getString("redirectURL");
			pageContext.setAttribute("originalURL", redirectUrl);
			try {				
				URL aURL = new URL(redirectUrl);
				pageContext.setAttribute("urlProtocol", aURL.getProtocol());
				pageContext.setAttribute("urlPath", aURL.getFile());
			} catch (MalformedURLException e) {
				//System.out.println("DmartRedirectURL - MalformedURLException ==> " + e.toString());
			}		
		%>
		<input id="originalURL" type="hidden" var="originalURL" value="${originalURL}" />
		<input id="urlPath" type="hidden" var="urlPath" value="${urlPath}" />
		<input id="urlProtocol" type="hidden" var="urlProtocol" value="${urlProtocol}" />
		<input id="appDomain" type="hidden" var="appDomain" value="${appDomain}" />
		<input id="appTimeout" type="hidden" var="appTimeout" value="${appTimeout}" />
	</div>

	<script type="text/javascript">
		var originalURL = document.getElementById("originalURL").value;
		var urlPath = document.getElementById("urlPath").value;
		var urlProto = document.getElementById("urlProtocol").value;
		var appDomain = document.getElementById("appDomain").value;
		var appTimeout = document.getElementById("appTimeout").value;
		var appURL = appDomain + ":/"+  urlPath;		
		$(document).bind('dmart.redirect.action.inprogress',
			function(e) {
				showLoadingImage();		
		});
		$(document).bind('dmart.redirect.action.completed',
			function(e) {
				stopLoadingImage();		
		});
		$(document).trigger('dmart.redirect.action.inprogress');
		(function() {
			var app = {
		   	launchApp: function() {
			var isRequestFromMobile = {
				Android: function() {
					return navigator.userAgent.match(/Android/i);
				},
				BlackBerry: function() {
					return navigator.userAgent.match(/BlackBerry/i);
				},
				iOS: function() {
					return navigator.userAgent.match(/iPhone|iPad|iPod/i);
				},
				Opera: function() {
					return navigator.userAgent.match(/Opera Mini/i);
				},
				Windows: function() {
					return navigator.userAgent.match(/IEMobile/i);
				},
				anyMobile: function() {
					return (isRequestFromMobile.iOS());
				}
			};
				
				if(isRequestFromMobile.anyMobile() ){
					window.location.replace(appURL);
					this.timer = setTimeout(this.openWebApp, appTimeout);
				}
				else{
					app.openWebApp();
				}
			},
		
			openWebApp: function() {
				window.location.replace(originalURL);
				//alert("Browser => openWebApp");
			}
			};
	  		app.launchApp();
		})();
		function showLoadingImage() {
				$('#loadingActionDiv').show();
		}
		function stopLoadingImage() {
				$('#loadingActionDiv').hide();
		}
		
	</script>
	<style type="text/css">
		.modal-dialog {
			  position: fixed;
			  top: 0;
			  right: 0;
			  bottom: 0;
			  left: 0;
			  background: rgba(0, 0, 0, 0.8);
			  z-index: 99999;
			  display: none;
			  -webkit-transition: opacity 100ms ease-in;
			          transition: opacity 100ms ease-in;
			  overflow-x: hidden;
			  overflow-y: inherit;
			  margin: 0;
		}
	</style>	
		
</body>
</html>
<!-- END DmartRedirectURL.jsp -->
