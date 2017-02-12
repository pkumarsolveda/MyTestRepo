<!DOCTYPE html>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://commerce.ibm.com/base" prefix="wcbase" %>
<%@ taglib uri="flow.tld" prefix="flow" %>
<%@ include file="../../Common/EnvironmentSetup.jspf" %>
<%@ include file="../../include/ErrorMessageSetup.jspf" %>
<%@ include file="../../Common/nocache.jspf" %>
<%@ taglib uri="http://commerce.ibm.com/foundation" prefix="wcf" %>
<%@ taglib uri="http://commerce.ibm.com/coremetrics"  prefix="cm" %>

<%@ include file="../../Common/CommonJSToInclude.jspf"%>


<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title><c:out value="${pageTitle}"/></title>
	<meta name="description" content="<c:out value="${metaDescription}"/>"/>
	<meta name="keywords" content="<c:out value="${metaKeyword}"/>"/>
	<meta name="pageIdentifier" content="HomePage"/>
	<meta name="pageId" content="<c:out value="${page.pageId}"/>"/>
	<meta name="pageGroup" content="content"/>	
	<link rel="canonical" href="<c:out value="${env_TopCategoriesDisplayURL}"/>" />
			
	<!--Main Stylesheet for browser -->
	<link rel="stylesheet" href="${jspStoreImgDir}${env_vfileStylesheet}" type="text/css" media="screen"/>
	<!-- Style sheet for print -->
	<link rel="stylesheet" href="${jspStoreImgDir}${env_vfileStylesheetprint}" type="text/css" media="print"/>
	<!-- Header Nav Start -->
	<c:if test="${b2bStore eq 'true'}">
		<c:if test="${userType =='G'}">
			<c:set var="hideHeader" value="true" />
		</c:if>
	</c:if>
	<!-- Import Header Widget -->
	<div id="headerWidget">
		<%out.flush();%>
			<c:import url="${env_jspStoreDir}/Widgets/Header/Header.jsp" />
		<%out.flush();%>
	</div>
	<!-- Header Nav End -->
</head>
<body>
<div id="page">
<div class="container">
  <div class="row">
  	<div class="col-md-6">
     <div class="blurb blurb--right-border">
   <h2 class="blurb__title">Why Location Search</h2>
   <div class="blurb__img">
      <img class="img-responsive" src="${jspStoreImgDir}images/DMart/temp/location/location.jpg" alt="">
  </div>

  <div class="blurb__content">
    <p>DMart seeks to be a one-stop shopping destination for entire family, meeting all their daily household Needs.</p>
  </div>
</div>


    </div>
    <div class="col-md-6">
     

<div class="form form--location">
	<h2 class="form__title">Choose Location</h2>
	<form method="post" id="formLocationValidation" action="javascript:;" novalidate>
    <div class="autocomplete-input">
      
<div class="form-control">
  <label class="form__label spacing-bottom-tiny" for="pinNumber"></label>
  <input class="form__input" name="pinNumber" placeholder="Enter your delivery pin-code to continue" id="pinNumber" maxlength="200" required autocomplete="off">
</div>

        <ul class="autocomplete-suggestions js-hide-show">
          <li>40007</li>
          <li>400076, Powai</li>
          <li>400077, Ghatkopar (E)</li>
          <li>400078, Bhandup (W)</li>
        </ul>
    </div>

    <div class="location-links">
      <div class="row">
        <div class="col-xs-6">
          <a href="javascript:;" class="location__link">
            <i class="icon-location"></i> <span>Get my location</span>
          </a>
        </div>
        <div class="col-xs-6"><button class="button-primary button--block" type="submit">Save</button></div>
      </div>
    </div>
	</form>
</div>


    </div>
  </div>
</div>

<!-- Use classname "modal-link" and add data-target as modal id to link modal to tag
EX: <a href="javascript:;" class="modal-link" data-target="locationModal"> -->
<div id="locationModal" class="modal-dialog">
	<div class="modal-dialog__content modal-dialog__content-medium">
		<a href="javascript:;" title="Close" class="modal-dialog__close">X</a>
		<div class="modal-dialog__header">
			<h4 class="modal-dialog__header-title">Choose Location</h4>
		</div>
		<div class="modal-dialog__body">
			<div>
				<form class="form form--location form--modal" action="javascript:;" method="post" id="formLocationValidationModal" novalidate>
					<div class="autocomplete-input">
						
<div class="form-control">
  <label class="form__label spacing-bottom-tiny" for="pinNumberModal"></label>
  <input class="form__input" name="pinNumberModal" placeholder="Enter your delivery pin-code to continue" id="pinNumberModal" maxlength="200" required autocomplete="off">
</div>

						<ul class="autocomplete-suggestions js-hide-show">
							<li>40007</li>
							<li>400076, Powai</li>
							<li>400077, Ghatkopar (E)</li>
							<li>400078, Bhandup (W)</li>
						</ul>
					</div>
					<div class="location-links">
						<div class="row">
							<div class="col-xs-6">
								<a href="javascript:;" class="location__link">
									<i class="icon-location"></i> <span>Get my location</span>
								</a>
							</div>
							<div class="col-xs-6"><button class="button-primary button--block" type="submit">Save</button></div>
						</div>
					</div>
				</form>
				<div class="blurb blurb--top-border">

					<div class="row">
						<div class="col-xs-8 col-sm-9">
						<h4 class="blurb__title--small">Why Location Search</h4>
							<div class="blurb__content">
								<p>DMart seeks to be a one-stop shopping destination for entire family, meeting all their daily household Needs.</p>
							</div>
						</div>
						<div class="col-xs-4 col-sm-3">
							<div class="blurb__img blurb__img--no-padding">
								<img class="img-responsive" src="${jspStoreImgDir}images/DMart/temp/location/location-bag.jpg" alt="">
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div id="footerWrapper">
	<%out.flush();%>
	<c:import url="${env_jspStoreDir}Widgets/Footer/Footer.jsp"/>
	<%out.flush();%>
</div>

</div>
</body>
</html>