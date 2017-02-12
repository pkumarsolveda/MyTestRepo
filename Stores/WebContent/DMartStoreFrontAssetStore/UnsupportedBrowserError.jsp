<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://commerce.ibm.com/base" prefix="wcbase" %>
<%@ taglib uri="flow.tld" prefix="flow" %>
<%@ taglib uri="http://commerce.ibm.com/coremetrics"  prefix="cm" %>
<%@ include file="Common/EnvironmentSetup.jspf" %>
<%@ include file="Common/nocache.jspf" %>

<c:set var="pageCategory" value="Error" scope="request"/>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<!--
 =================================================================
  Licensed Materials - Property of IBM

  WebSphere Commerce

  (C) Copyright IBM Corp. 2012, 2013 All Rights Reserved.

  US Government Users Restricted Rights - Use, duplication or
  disclosure restricted by GSA ADP Schedule Contract with
  IBM Corp.
 =================================================================
-->
<html lang="${shortLocale}" xml:lang="${shortLocale}">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<title><fmt:message bundle="${storeText}" key="UnsupportedBrowserError_Title"/></title>
		<link rel="stylesheet" href='<c:out value="${jspStoreImgDir}${env_vfileStylesheet}"/>' type="text/css"/>
		<%@ include file="Common/CommonJSToInclude.jspf"%>
		<meta charset="utf-8">
		<meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
		<meta content="" name="description">
		<meta content=
		"width=device-width,initial-scale=1,minimum-scale=1,user-scalable=no" name=
		"viewport">
		<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600" rel=
		"stylesheet" type="text/css">
		<link rel="stylesheet" href="${jspStoreImgDir}css/DMart/bootstrap.min.css">
		<style>
		.right-panheader {
		   color:#C1A36F;
		   font-size:17px;
		   font-weight: 600;
		}

		.img-cofusedsmall {
		 margin:0 auto;
		}
        a {
		color:#000;
		}
		.logo {
		 margin:50px 0;
		 width:100%;
		}
        .logo img {
		  margin: 0 auto;
		}
		.small-font {
		font-size:14px;
		}

		.desktop-confused {
           float: right;
           height: 160px;
           margin-top: 16px;
           width: 160px;
        }
	 	.mobile-confused {
           height: 132px;
            width: 132px;
			margin: 0 auto;
        }
     .last-para {
          margin-top:17px;
        }
		@media (max-width: 767.9px) and (min-width: 481px){
		 .mobile-text {
		 margin: 0 auto;
		 width:450px;
		 }

		}
		</style>
		
		
	</head>
		
	<body>
 	
	<div class="container main-content">
     <div class="row logo">
	  <img class="img-responsive" src="${jspStoreImgDir}images/DMart/logo.png" alt="dmart">
	 </div>
	 
	 
	 
	<div class="row">
		
		<div class="col-xs-12 col-sm-4 col-md-4">
			<img class="hidden-xs desktop-confused" src="${jspStoreImgDir}images/DMart/icon-confused.png" alt="sorry">
			<img class="visible-xs mobile-confused" src="${jspStoreImgDir}images/DMart/icon-confused.png" alt="sorry" >
		</div>
		<div class="col-xs-12 col-sm-8 col-md-8">
		<div class="mobile-text">
			<h3 class="right-panheader">SORRY! Your browser version is not supported</h3>
			<p class="small-font">Dmart.in is compatible with the following latest browser versions.</p>
			
				<div class="small-font">1. <a href="#nogo">Google Chrome</a></div>
				<div class="small-font">2. <a href="#nogo">Mozilla Firefox</a></div>
				<div class="small-font">3. <a href="#nogo">Internet Explorer</a></div>
		
			<p class="small-font last-para">Please click any of the above links to download the browser that is best <br>suited for your operating system</p>
			</div>
		</div>
		

	</div>
    </div>
	</body>
	</html>