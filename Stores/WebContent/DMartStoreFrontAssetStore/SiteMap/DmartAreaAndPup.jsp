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
	<title>Area Served - DMart</title>
	
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
		
		<div class="container">
			<div class="row">
				<div class="col-xs-12 col-md-6">
					<ul class="breadcrumbs link-bordered">
  						<li><a href="${env_TopCategoriesDisplayURL}" title="Home">Home</a></li>
						<li> Area Served</li>
					</ul>
				</div>
			</div>
		</div>
		
		<div class="container">
		<%--
			<div class="home-deliveryst">
    			<h3>Home Delivery</h3> 
    			
    			<wcf:rest var="pincodeDetailsList" url="/store/${WCParam.storeId}/storepincodedetails/byPinCode" >
				</wcf:rest>
    			<div class="row">
	    			<c:forEach var="eachPincodeDetail" items="${pincodeDetailsList.StorePincodeDetails}">
	    				<div class="col-md-3 col-sm-6 col-xs-6 col-details">
		   			 		<c:out value="${eachPincodeDetail.Area}"/>
		    			</div>
			       	</c:forEach>
    			</div>
	 		</div>
 		--%>
 				<%-- Call the REST service to get the data to display in the e-Marketing Spot --%>
			<wcf:rest var="eSpotDatasRoot" url="/store/{storeId}/espot/{name}" format="json" >
				<wcf:var name="storeId" value="${storeId}" encode="true"/>
				<wcf:var name="name" value="DmartAreaServed" encode="true"/>
	            <%-- the name of the e-Marketing Spot --%>
	            <wcf:param name="DM_EmsName" value="DmartAreaServed" />	
	            <wcf:param name="DM_contextPath" value="${env_contextAndServletPath}" />
	            <wcf:param name="DM_imagePath" value="${requestScope.jspStoreImgDir}" />
	 		</wcf:rest>
	 		
			<c:if test="${!empty eSpotDatasRoot.MarketingSpotData[0]}" >
					<c:set var="eSpotDatas" value="${eSpotDatasRoot.MarketingSpotData[0]}"/>
			
					<c:forEach var="eSpotData" items="${eSpotDatas.baseMarketingSpotActivityData}" varStatus="status1">
					 	 <c:if test='${eSpotData.baseMarketingSpotDataType eq "MarketingContent"}'>
					 	 	 <c:if test="${eSpotData.contentFormatName == 'Text'}"> 
					 	 	    <c:forEach var="eSpotContent" items="${eSpotData.marketingContentDescription}" varStatus="status2">
					 	 	      ${eSpotContent.marketingText}
					 	 	    </c:forEach>
					 	 	 </c:if>
					 	 </c:if>
					</c:forEach>
			</c:if>
			 
			 <%--
    		<div class="pickup-pointst">
      			<h3>DMart Ready Pick-up points <span class="pickup-circle"><i class="icon-question"></i></span></h3> 
      			
      			<wcf:rest var="pupDetailsList" url="/store/0/pup/list" >
				</wcf:rest>
				
        		<div class="row">
        			<jsp:useBean id="pupNameMap" class="java.util.HashMap"/>
        			<c:forEach var="eachPupDetail" items="${pupDetailsList.pupList}">
        				<c:set var="eachPupAddressArray" value="${fn:split(eachPupDetail.value.ADDRESS1,',')}"/>
        				<c:set var="eachPupLocation" value="${fn:trim(eachPupAddressArray[fn:length(eachPupAddressArray)-1])}"/>
	        			<c:choose>
							<c:when test="${pupNameMap[eachPupLocation] eq null or pupNameMap[eachPupLocation] eq undefined}">
								<c:set target="${pupNameMap}" property="${eachPupLocation}" value="1"/>
							</c:when>
							<c:otherwise>
								<c:set target="${pupNameMap}" property="${eachPupLocation}" value="${pupNameMap[eachPupLocation] + 1}"/>
							</c:otherwise>
						</c:choose>
			       	</c:forEach>
	        		<c:forEach var="eachPup" items="${pupNameMap}">
	    				<div class="col-md-3 col-sm-6 col-xs-6 col-details">
		   			 		<a href="StoreLocatorView?storeId=${storeId}&pupArea=${eachPup.key}"><c:out value="${eachPup.key} (${eachPup.value})"/></a>
		    			</div>
			       	</c:forEach>
        		</div>
			</div>
			 --%>
			 
			<%-- Call the REST service to get the data to display in the e-Marketing Spot --%>
			<wcf:rest var="eSpotDatasRoot" url="/store/{storeId}/espot/{name}" format="json" >
				<wcf:var name="storeId" value="${storeId}" encode="true"/>
				<wcf:var name="name" value="DmartPickupPoints" encode="true"/>
	            <%-- the name of the e-Marketing Spot --%>
	            <wcf:param name="DM_EmsName" value="DmartPickupPoints" />	
	            <wcf:param name="DM_contextPath" value="${env_contextAndServletPath}" />
	            <wcf:param name="DM_imagePath" value="${requestScope.jspStoreImgDir}" />
	 		</wcf:rest>
	 		
			<c:if test="${!empty eSpotDatasRoot.MarketingSpotData[0]}" >
					<c:set var="eSpotDatas" value="${eSpotDatasRoot.MarketingSpotData[0]}"/>
			
					<c:forEach var="eSpotData" items="${eSpotDatas.baseMarketingSpotActivityData}" varStatus="status1">
					 	 <c:if test='${eSpotData.baseMarketingSpotDataType eq "MarketingContent"}'>
					 	 	 <c:if test="${eSpotData.contentFormatName == 'Text'}"> 
					 	 	    <c:forEach var="eSpotContent" items="${eSpotData.marketingContentDescription}" varStatus="status2">
					 	 	      ${eSpotContent.marketingText}
					 	 	    </c:forEach>
					 	 	 </c:if>
					 	 </c:if>
					</c:forEach>
			</c:if>
			
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