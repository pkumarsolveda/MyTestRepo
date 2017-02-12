<%@include file="../../../Common/EnvironmentSetup.jspf" %>
<%@include file="../../../Common/nocache.jspf" %>
<c:set var="subcategoryLimit" value="10"/>
<c:set var="depthAndLimit" value="${subcategoryLimit + 1},${subcategoryLimit + 1}"/>
<wcf:rest var="categoryDetails" url="${searchHostNamePath}${searchContextPath}/store/${WCParam.storeId}/categoryview/byParentCategory/${WCParam.categoryId}" >
	<c:if test="${!empty WCParam.langId}">
	<wcf:param name="langId" value="${WCParam.langId}"/>
	</c:if>
	<c:if test="${empty WCParam.langId}">
	<wcf:param name="langId" value="${langId}"/>
	</c:if>

	<wcf:param name="responseFormat" value="json"/>		
	<wcf:param name="catalogId" value="${WCParam.catalogId}"/>
	<wcf:param name="depthAndLimit" value="${depthAndLimit}"/>
	<c:forEach var="contractId" items="${env_activeContractIds}">
		<wcf:param name="contractId" value="${contractId}"/>
	</c:forEach>
</wcf:rest>




<!DOCTYPE html>
<html lang="en"><head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<title> CLP  - DMart</title>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="description" content="">
<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,user-scalable=no">

<link href="CLP%20-%20DMart_files/css.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="CLP%20-%20DMart_files/main.css" media="all">


<style charset="utf-8" type="text/css" class="firebugResetStyles">/* See license.txt for terms of usage */

/** reset styling **/

.firebugResetStyles {

    z-index: 2147483646 !important;

    top: 0 !important;

    left: 0 !important;

    display: block !important;

    border: 0 none !important;

    margin: 0 !important;

    padding: 0 !important;

    outline: 0 !important;

    min-width: 0 !important;

    max-width: none !important;

    min-height: 0 !important;

    max-height: none !important;

    position: fixed !important;

    transform: rotate(0deg) !important;

    transform-origin: 50% 50% !important;

    border-radius: 0 !important;

    box-shadow: none !important;

    background: transparent none !important;

    pointer-events: none !important;

    white-space: normal !important;

}

style.firebugResetStyles {

    display: none !important;

}



.firebugBlockBackgroundColor {

    background-color: transparent !important;

}



.firebugResetStyles:before, .firebugResetStyles:after {

    content: "" !important;

}

/**actual styling to be modified by firebug theme**/

.firebugCanvas {

    display: none !important;

}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

.firebugLayoutBox {

    width: auto !important;

    position: static !important;

}



.firebugLayoutBoxOffset {

    opacity: 0.8 !important;

    position: fixed !important;

}



.firebugLayoutLine {

    opacity: 0.4 !important;

    background-color: #000000 !important;

}



.firebugLayoutLineLeft, .firebugLayoutLineRight {

    width: 1px !important;

    height: 100% !important;

}



.firebugLayoutLineTop, .firebugLayoutLineBottom {

    width: 100% !important;

    height: 1px !important;

}



.firebugLayoutLineTop {

    margin-top: -1px !important;

    border-top: 1px solid #999999 !important;

}



.firebugLayoutLineRight {

    border-right: 1px solid #999999 !important;

}



.firebugLayoutLineBottom {

    border-bottom: 1px solid #999999 !important;

}



.firebugLayoutLineLeft {

    margin-left: -1px !important;

    border-left: 1px solid #999999 !important;

}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

.firebugLayoutBoxParent {

    border-top: 0 none !important;

    border-right: 1px dashed #E00 !important;

    border-bottom: 1px dashed #E00 !important;

    border-left: 0 none !important;

    position: fixed !important;

    width: auto !important;

}



.firebugRuler{

    position: absolute !important;

}



.firebugRulerH {

    top: -15px !important;

    left: 0 !important;

    width: 100% !important;

    height: 14px !important;

    background: url("data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%13%88%00%00%00%0E%08%02%00%00%00L%25a%0A%00%00%00%04gAMA%00%00%D6%D8%D4OX2%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%04%F8IDATx%DA%EC%DD%D1n%E2%3A%00E%D1%80%F8%FF%EF%E2%AF2%95%D0D4%0E%C1%14%B0%8Fa-%E9%3E%CC%9C%87n%B9%81%A6W0%1C%A6i%9A%E7y%0As8%1CT%A9R%A5J%95*U%AAT%A9R%A5J%95*U%AAT%A9R%A5J%95*U%AAT%A9R%A5J%95*U%AAT%A9R%A5J%95*U%AAT%A9R%A5J%95*U%AAT%A9R%A5J%95*U%AATE9%FE%FCw%3E%9F%AF%2B%2F%BA%97%FDT%1D~K(%5C%9D%D5%EA%1B%5C%86%B5%A9%BDU%B5y%80%ED%AB*%03%FAV9%AB%E1%CEj%E7%82%EF%FB%18%BC%AEJ8%AB%FA'%D2%BEU9%D7U%ECc0%E1%A2r%5DynwVi%CFW%7F%BB%17%7Dy%EACU%CD%0E%F0%FA%3BX%FEbV%FEM%9B%2B%AD%BE%AA%E5%95v%AB%AA%E3E5%DCu%15rV9%07%B5%7F%B5w%FCm%BA%BE%AA%FBY%3D%14%F0%EE%C7%60%0EU%AAT%A9R%A5J%95*U%AAT%A9R%A5J%95*U%AAT%A9R%A5J%95*U%AAT%A9R%A5J%95*U%AAT%A9R%A5JU%88%D3%F5%1F%AE%DF%3B%1B%F2%3E%DAUCNa%F92%D02%AC%7Dm%F9%3A%D4%F2%8B6%AE*%BF%5C%C2Ym~9g5%D0Y%95%17%7C%C8c%B0%7C%18%26%9CU%CD%13i%F7%AA%90%B3Z%7D%95%B4%C7%60%E6E%B5%BC%05%B4%FBY%95U%9E%DB%FD%1C%FC%E0%9F%83%7F%BE%17%7DkjMU%E3%03%AC%7CWj%DF%83%9An%BCG%AE%F1%95%96yQ%0Dq%5Dy%00%3Et%B5'%FC6%5DS%95pV%95%01%81%FF'%07%00%00%00%00%00%00%00%00%00%F8x%C7%F0%BE%9COp%5D%C9%7C%AD%E7%E6%EBV%FB%1E%E0(%07%E5%AC%C6%3A%ABi%9C%8F%C6%0E9%AB%C0'%D2%8E%9F%F99%D0E%B5%99%14%F5%0D%CD%7F%24%C6%DEH%B8%E9rV%DFs%DB%D0%F7%00k%FE%1D%84%84%83J%B8%E3%BA%FB%EF%20%84%1C%D7%AD%B0%8E%D7U%C8Y%05%1E%D4t%EF%AD%95Q%BF8w%BF%E9%0A%BF%EB%03%00%00%00%00%00%00%00%00%00%B8vJ%8E%BB%F5%B1u%8Cx%80%E1o%5E%CA9%AB%CB%CB%8E%03%DF%1D%B7T%25%9C%D5(%EFJM8%AB%CC'%D2%B2*%A4s%E7c6%FB%3E%FA%A2%1E%80~%0E%3E%DA%10x%5D%95Uig%15u%15%ED%7C%14%B6%87%A1%3B%FCo8%A8%D8o%D3%ADO%01%EDx%83%1A~%1B%9FpP%A3%DC%C6'%9C%95gK%00%00%00%00%00%00%00%00%00%20%D9%C9%11%D0%C0%40%AF%3F%EE%EE%92%94%D6%16X%B5%BCMH%15%2F%BF%D4%A7%C87%F1%8E%F2%81%AE%AAvzr%DA2%ABV%17%7C%E63%83%E7I%DC%C6%0Bs%1B%EF6%1E%00%00%00%00%00%00%00%00%00%80cr%9CW%FF%7F%C6%01%0E%F1%CE%A5%84%B3%CA%BC%E0%CB%AA%84%CE%F9%BF)%EC%13%08WU%AE%AB%B1%AE%2BO%EC%8E%CBYe%FE%8CN%ABr%5Dy%60~%CFA%0D%F4%AE%D4%BE%C75%CA%EDVB%EA(%B7%F1%09g%E5%D9%12%00%00%00%00%00%00%00%00%00H%F6%EB%13S%E7y%5E%5E%FB%98%F0%22%D1%B2'%A7%F0%92%B1%BC%24z3%AC%7Dm%60%D5%92%B4%7CEUO%5E%F0%AA*%3BU%B9%AE%3E%A0j%94%07%A0%C7%A0%AB%FD%B5%3F%A0%F7%03T%3Dy%D7%F7%D6%D4%C0%AAU%D2%E6%DFt%3F%A8%CC%AA%F2%86%B9%D7%F5%1F%18%E6%01%F8%CC%D5%9E%F0%F3z%88%AA%90%EF%20%00%00%00%00%00%00%00%00%00%C0%A6%D3%EA%CFi%AFb%2C%7BB%0A%2B%C3%1A%D7%06V%D5%07%A8r%5D%3D%D9%A6%CAu%F5%25%CF%A2%99%97zNX%60%95%AB%5DUZ%D5%FBR%03%AB%1C%D4k%9F%3F%BB%5C%FF%81a%AE%AB'%7F%F3%EA%FE%F3z%94%AA%D8%DF%5B%01%00%00%00%00%00%00%00%00%00%8E%FB%F3%F2%B1%1B%8DWU%AAT%A9R%A5J%95*U%AAT%A9R%A5J%95*U%AAT%A9R%A5J%95*U%AAT%A9R%A5J%95*U%AAT%A9R%A5J%95*U%AAT%A9R%A5J%95*U%AAT%A9R%A5J%95*UiU%C7%BBe%E7%F3%B9%CB%AAJ%95*U%AAT%A9R%A5J%95*U%AAT%A9R%A5J%95*U%AAT%A9R%A5J%95*U%AAT%A9R%A5J%95*U%AAT%A9R%A5J%95*U%AAT%A9R%A5J%95*U%AAT%A9R%A5*%AAj%FD%C6%D4%5Eo%90%B5Z%ADV%AB%D5j%B5Z%ADV%AB%D5j%B5Z%ADV%AB%D5j%B5Z%ADV%AB%D5j%B5Z%ADV%AB%D5j%B5Z%ADV%AB%D5j%B5Z%ADV%AB%D5j%B5%86%AF%1B%9F%98%DA%EBm%BBV%AB%D5j%B5Z%ADV%AB%D5j%B5Z%ADV%AB%D5j%B5Z%ADV%AB%D5j%B5Z%ADV%AB%D5j%B5Z%ADV%AB%D5j%B5Z%ADV%AB%D5j%B5Z%AD%D6%E4%F58%01%00%00%00%00%00%00%00%00%00%00%00%00%00%40%85%7F%02%0C%008%C2%D0H%16j%8FX%00%00%00%00IEND%AEB%60%82") repeat-x !important;

    border-top: 1px solid #BBBBBB !important;

    border-right: 1px dashed #BBBBBB !important;

    border-bottom: 1px solid #000000 !important;

}



.firebugRulerV {

    top: 0 !important;

    left: -15px !important;

    width: 14px !important;

    height: 100% !important;

    background: url("data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0E%00%00%13%88%08%02%00%00%00%0E%F5%CB%10%00%00%00%04gAMA%00%00%D6%D8%D4OX2%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%06~IDATx%DA%EC%DD%D1v%A20%14%40Qt%F1%FF%FF%E4%97%D9%07%3BT%19%92%DC%40(%90%EEy%9A5%CB%B6%E8%F6%9Ac%A4%CC0%84%FF%DC%9E%CF%E7%E3%F1%88%DE4%F8%5D%C7%9F%2F%BA%DD%5E%7FI%7D%F18%DDn%BA%C5%FB%DF%97%BFk%F2%10%FF%FD%B4%F2M%A7%FB%FD%FD%B3%22%07p%8F%3F%AE%E3%F4S%8A%8F%40%EEq%9D%BE8D%F0%0EY%A1Uq%B7%EA%1F%81%88V%E8X%3F%B4%CEy%B7h%D1%A2E%EBohU%FC%D9%AF2fO%8BBeD%BE%F7X%0C%97%A4%D6b7%2Ck%A5%12%E3%9B%60v%B7r%C7%1AI%8C%BD%2B%23r%00c0%B2v%9B%AD%CA%26%0C%1Ek%05A%FD%93%D0%2B%A1u%8B%16-%95q%5Ce%DCSO%8E%E4M%23%8B%F7%C2%FE%40%BB%BD%8C%FC%8A%B5V%EBu%40%F9%3B%A72%FA%AE%8C%D4%01%CC%B5%DA%13%9CB%AB%E2I%18%24%B0n%A9%0CZ*Ce%9C%A22%8E%D8NJ%1E%EB%FF%8F%AE%CAP%19*%C3%BAEKe%AC%D1%AAX%8C*%DEH%8F%C5W%A1e%AD%D4%B7%5C%5B%19%C5%DB%0D%EF%9F%19%1D%7B%5E%86%BD%0C%95%A12%AC%5B*%83%96%CAP%19%F62T%86%CAP%19*%83%96%CA%B8Xe%BC%FE)T%19%A1%17xg%7F%DA%CBP%19*%C3%BA%A52T%86%CAP%19%F62T%86%CA%B0n%A9%0CZ%1DV%C6%3D%F3%FCH%DE%B4%B8~%7F%5CZc%F1%D6%1F%AF%84%F9%0F6%E6%EBVt9%0E~%BEr%AF%23%B0%97%A12T%86%CAP%19%B4T%86%CA%B8Re%D8%CBP%19*%C3%BA%A52huX%19%AE%CA%E5%BC%0C%7B%19*CeX%B7h%A9%0C%95%E1%BC%0C%7B%19*CeX%B7T%06%AD%CB%5E%95%2B%BF.%8F%C5%97%D5%E4%7B%EE%82%D6%FB%CF-%9C%FD%B9%CF%3By%7B%19%F62T%86%CA%B0n%D1R%19*%A3%D3%CA%B0%97%A12T%86uKe%D0%EA%B02*%3F1%99%5DB%2B%A4%B5%F8%3A%7C%BA%2B%8Co%7D%5C%EDe%A8%0C%95a%DDR%19%B4T%C66%82fA%B2%ED%DA%9FC%FC%17GZ%06%C9%E1%B3%E5%2C%1A%9FoiB%EB%96%CA%A0%D5qe4%7B%7D%FD%85%F7%5B%ED_%E0s%07%F0k%951%ECr%0D%B5C%D7-g%D1%A8%0C%EB%96%CA%A0%A52T%C6)*%C3%5E%86%CAP%19%D6-%95A%EB*%95q%F8%BB%E3%F9%AB%F6%E21%ACZ%B7%22%B7%9B%3F%02%85%CB%A2%5B%B7%BA%5E%B7%9C%97%E1%BC%0C%EB%16-%95%A12z%AC%0C%BFc%A22T%86uKe%D0%EA%B02V%DD%AD%8A%2B%8CWhe%5E%AF%CF%F5%3B%26%CE%CBh%5C%19%CE%CB%B0%F3%A4%095%A1%CAP%19*Ce%A8%0C%3BO*Ce%A8%0C%95%A12%3A%AD%8C%0A%82%7B%F0v%1F%2FD%A9%5B%9F%EE%EA%26%AF%03%CA%DF9%7B%19*Ce%A8%0C%95%A12T%86%CA%B8Ze%D8%CBP%19*Ce%A8%0C%95%D1ae%EC%F7%89I%E1%B4%D7M%D7P%8BjU%5C%BB%3E%F2%20%D8%CBP%19*Ce%A8%0C%95%A12T%C6%D5*%C3%5E%86%CAP%19*Ce%B4O%07%7B%F0W%7Bw%1C%7C%1A%8C%B3%3B%D1%EE%AA%5C%D6-%EBV%83%80%5E%D0%CA%10%5CU%2BD%E07YU%86%CAP%19*%E3%9A%95%91%D9%A0%C8%AD%5B%EDv%9E%82%FFKOee%E4%8FUe%A8%0C%95%A12T%C6%1F%A9%8C%C8%3D%5B%A5%15%FD%14%22r%E7B%9F%17l%F8%BF%ED%EAf%2B%7F%CF%ECe%D8%CBP%19*Ce%A8%0C%95%E1%93~%7B%19%F62T%86%CAP%19*Ce%A8%0C%E7%13%DA%CBP%19*Ce%A8%0CZf%8B%16-Z%B4h%D1R%19f%8B%16-Z%B4h%D1R%19%B4%CC%16-Z%B4h%D1R%19%B4%CC%16-Z%B4h%D1%A2%A52%CC%16-Z%B4h%D1%A2%A52h%99-Z%B4h%D1%A2%A52h%99-Z%B4h%D1%A2EKe%98-Z%B4h%D1%A2EKe%D02%5B%B4h%D1%A2EKe%D02%5B%B4h%D1%A2E%8B%96%CA0%5B%B4h%D1%A2E%8B%96%CA%A0e%B6h%D1%A2E%8B%96%CA%A0e%B6h%D1%A2E%8B%16-%95a%B6h%D1%A2E%8B%16-%95A%CBl%D1%A2E%8B%16-%95A%CBl%D1%A2E%8B%16-Z*%C3l%D1%A2E%8B%16-Z*%83%96%D9%A2E%8B%16-Z*%83%96%D9%A2E%8B%16-Z%B4T%86%D9%A2E%8B%16-Z%B4T%06-%B3E%8B%16-Z%B4T%06-%B3E%8B%16-Z%B4h%A9%0C%B3E%8B%16-Z%B4h%A9%0CZf%8B%16-Z%B4h%A9%0CZf%8B%16-Z%B4h%D1R%19f%8B%16-Z%B4h%D1R%19%B4%CC%16-Z%B4h%D1R%19%B4%CC%16-Z%B4h%D1%A2%A52%CC%16-Z%B4h%D1%A2%A52h%99-Z%B4h%D1%A2%A52h%99-Z%B4h%D1%A2EKe%98-Z%B4h%D1%A2EKe%D02%5B%B4h%D1%A2EKe%D02%5B%B4h%D1%A2E%8B%96%CA0%5B%B4h%D1%A2E%8B%96%CA%A0e%B6h%D1%A2E%8B%96%CA%A0e%B6h%D1%A2E%8B%16-%95a%B6h%D1%A2E%8B%16-%95A%CBl%D1%A2E%8B%16-%95A%CBl%D1%A2E%8B%16-Z*%C3l%D1%A2E%8B%16-Z*%83%96%D9%A2E%8B%16-Z*%83%96%D9%A2E%8B%16-Z%B4T%86%D9%A2E%8B%16-Z%B4T%06-%B3E%8B%16-Z%B4T%06-%B3E%8B%16-Z%B4h%A9%0C%B3E%8B%16-Z%B4h%A9%0CZf%8B%16-Z%B4h%A9%0CZf%8B%16-Z%B4h%D1R%19f%8B%16-Z%B4h%D1R%19%B4%CC%16-Z%B4h%D1R%19%B4%CC%16-Z%B4h%D1%A2%A52%CC%16-Z%B4h%D1%A2%A52h%99-Z%B4h%D1%A2%A52h%99-Z%B4h%D1%A2EKe%98-Z%B4h%D1%A2EKe%D02%5B%B4h%D1%A2EKe%D02%5B%B4h%D1%A2E%8B%96%CA0%5B%B4h%D1%A2E%8B%96%CA%A0e%B6h%D1%A2E%8B%96%CA%A0e%B6h%D1%A2E%8B%16-%95a%B6h%D1%A2E%8B%16-%95A%CBl%D1%A2E%8B%16-%95A%CBl%D1%A2E%8B%16-Z*%C3l%D1%A2E%8B%16-Z*%83%96%D9%A2E%8B%16-Z*%83%96%D9%A2E%8B%16-Z%B4T%86%D9%A2E%8B%16-Z%B4T%06-%B3E%8B%16-Z%B4%AE%A4%F5%25%C0%00%DE%BF%5C'%0F%DA%B8q%00%00%00%00IEND%AEB%60%82") repeat-y !important;

    border-left: 1px solid #BBBBBB !important;

    border-right: 1px solid #000000 !important;

    border-bottom: 1px dashed #BBBBBB !important;

}



.overflowRulerX > .firebugRulerV {

    left: 0 !important;

}



.overflowRulerY > .firebugRulerH {

    top: 0 !important;

}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

.fbProxyElement {

    position: fixed !important;

    pointer-events: auto !important;

}

</style></head>
<div style="margin-top: 170px;">






<div class="container">
  <div class="row">
    <div class="col-xs-12 col-md-6">
      <ul class="breadcrumbs link-bordered">
  <li><a href="javascript:;" title="Home">Home</a></li>
  
  <li class="breadcrumb-dropdown"><a href="javascript:;" title="Grocery">Grocery

  </a></li>
  <li class="breadcrumb-dropdown"> Dals &amp; Pulses 
      <i class="icon-caret-down"></i>
      <div class="breadcrumb-menu__navigation--category-dropdown">
    <ul class="breadcrumb-sub-menu">
 
  <li class="breadcrumb-sub-menu-items">
    <a href="javascript:;" title="Dals &amp; Pulses">Dals &amp; Pulses</a>
   
  </li>

  <li class="breadcrumb-sub-menu-items">
    <a href="javascript:;" title="Dmart Grocery">Dmart Grocery</a>
  
  </li>
  <li class="breadcrumb-sub-menu-items">
    <a href="javascript:;" title="Dry Fruits">Dry Fruits</a>
    
  </li>
      <li class="breadcrumb-sub-menu-items">
    <a href="javascript:;" title="Edible Oil &amp; Ghee">Edible Oil &amp; Ghee</a>
    
  </li>
  <li class="breadcrumb-sub-menu-items">
    <a href="javascript:;" title="Flours &amp; Grains">Flours &amp; Grains</a>
    
  </li>

  <li class="breadcrumb-sub-menu-items">
    <a href="javascript:;" title="Masala &amp; Spices">Masala &amp; Spices</a>
    
  </li>
 
</ul>


    </div>
    
    </li>
</ul>

    </div>

    
    <div class="col-xs-12 col-md-6">
      <div class="plp-header clp-header-relative">
 
   

 <div class="filter-sort-grid">
<div class="multiselectclp">
        <div class="selectBoxbrand">
            <select>
                <option selected="selected">Brand</option>
            </select>
            <div class="overSelect"></div>
        </div>
        <div class="checkboxesbrand ps-container ps-theme-default" data-ps-id="9caefa70-0f89-7e32-7e2f-76f3043c4aaf">
            <label><input type="checkbox"><span title="Premia">Premia</span></label>
            <label><input type="checkbox"><span title="Ricebran-fortune">Ricebran-fortune</span></label>
            <label><input type="checkbox"><span title="Krishna">Krishna</span></label>
            <label><input type="checkbox"><span title="Everest">Everest</span></label>
            
        <div class="ps-scrollbar-x-rail" style="left: 0px; bottom: 3px;"><div class="ps-scrollbar-x" tabindex="0" style="left: 0px; width: 0px;"></div></div><div class="ps-scrollbar-y-rail" style="top: 0px; right: 3px;"><div class="ps-scrollbar-y" tabindex="0" style="top: 0px; height: 0px;"></div></div></div>
    </div>
    <div class="js-mobile-filter mobile-filter-link show-sm-down">

    <a href="javascript:;">Show Brand Filter</a>

  </div>
  </div>
  
     
  
</div>
    </div>
    
  </div>
</div>



<div class="container">
  <div class="row">
    <div class="col-xs-12">
      <div class="alert alert-warning-bg">
        <strong><i class="icon-notification"></i> Please Note:</strong> Some item in your cart have been sold out and will be removed as you proceed to checkout or continue shopping.
        <a class="alert-close-cta js-cart-reject alert-cross-pos" href="javascript:;" title="Close"><i class="icon-cta-close icon-cancel"></i></a>
      </div>
    </div>
  </div>
</div>

<div class="container">
  <div class="row">
    <div class="col-xs-12">
      <div class="filter-module">
  <!-- Ad Banner -->
  <div class="filter-add-baner">
      <div class="filter-add-baner__banner-space">
        <div class="filter-add-baner__holder">
          <a href="javascript:;">
            <img class="filter-add-baner__image img-responsive" src="CLP%20-%20DMart_files/ad-banner-grocery.jpg">
          </a>
        </div>
    </div>
  </div>
</div>


    </div>
  </div>
</div>
<div class="container clp-btn-rail">
    <div class="row">
      <section class="landing-tabs landing-tabs--clp-rails-l2">
      
          


<div class="landing-non-tabs">
  <div class="no-border-tabs recommended-products">
    <ul class="landing-top-carousel-navigation">
      <li class="flex-nav-prev">
        <a href="#" class="flex-prev"><i class="icon-caret-left"></i></a>
      </li>
      <li class="flex-nav-next">
        <a href="#" class="flex-next"><i class="icon-caret-right"></i></a>
      </li>
    </ul>
    <!-- Maximum tabs should be 5 and each tabs text limitation is 20characters. tab will have ellipsis if more than 20characters -->

    <div class="resp-tabs-container hor_1">
      <div class="resp-tab-content">
        


        <div class="js-landing-carousel">
          <ul class="slides clearfix">
			   <c:forEach var="childCategory" items="${categoryDetails.catalogGroupView[0].catalogGroupView}">
			   <c:choose>
					<c:when test="${!empty childCategory.seo_token_ntk}">
					  <c:set var = "childCategoryUrl" value = "${env_TopCategoriesDisplayURLHierarchy}/${childCategory.seo_token_ntk}" />
					</c:when>
					<c:otherwise>
					    <c:set var = "childCategoryUrl" value = "CategoryDisplay?categoryId=${category.uniqueID}&catalogId=${catalogId}&storeId=${storeId}" />
					</c:otherwise>
				</c:choose> 
			   
	                  <li class="clp-btn">
	                   <a href = " ${childCategoryUrl }" > <c:out value="${childCategory.name }"/> </a>
	                  </li>
			        <c:remove var ="childCategoryUrl"  />         
			  </c:forEach>
               

                   

      
        </ul>
      </div>
      </div>
    </div>
  </div>
</div>

        </section>
    </div>
</div>
  <div class="container product_container">
    <div class="row">
      <div class="col-xs-12">
        <section class="landing-tabs landing-tabs--clp-rails">
      
          


<div class="landing-non-tabs">
  <div class="no-border-tabs recommended-products">
    <ul class="landing-top-carousel-navigation">
      <li class="flex-nav-prev">
        <a href="#" class="flex-prev flex-disabled" tabindex="-1"><i class="icon-caret-left"></i></a>
      </li>
      <li class="flex-nav-next">
        <a href="#" class="flex-next"><i class="icon-caret-right"></i></a>
      </li>
    </ul>
    <!-- Maximum tabs should be 5 and each tabs text limitation is 20characters. tab will have ellipsis if more than 20characters -->
    <ul class="resp-tabs-list clearfix hor_1">
      <li><span class="list-label">Chana Dal</span></li>
      <li class="view-all-rail"><span>View all</span></li>
    </ul>
    <div class="resp-tabs-container hor_1">
      <div class="resp-tab-content">
        


        <div class="js-landing-carousel">
          
      <div class="flex-viewport" style="overflow: hidden; position: relative;"><ul class="slides clearfix" style="width: 1400%; transition-duration: 0s; transform: translate3d(0px, 0px, 0px);">
          
            <li class="js-switch-view slide-margin" style="width: 230px; float: left; display: block;">
              
<!-- Add "product-out-of-stock" class to "product-listing-item" if product is not available-->
<div class="product-listing-item single-variant-product plp-grocery">
<div class="product-listing-item__primary">
  <div class="view-list view-list-product-image product-out-of-stock__small-image-wrap">
    <a href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image img-responsive" alt="product image" draggable="false"></a>
    <a class="product-out-of-stock__small-image product-out-of-stock-image-disabled" href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image-out-of-stock img-responsive" alt="product image" draggable="false">
    <span class="product-listing--label-out-of-stock"><span>Out of Stock!</span></span></a>
  </div>
  <div class="product-listing--TnB">
	  <h4 class="product-listing--title"><a href="javascript:;">India Gate Basmati Rice</a></h4>
	  <h5 class="product-listing--brand"><a href="javascript:;">India Gate</a></h5>
  </div>
  <a href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image small view-grid img-responsive" alt="product image" draggable="false">
  </a>
  <a class="product-out-of-stock__big-image product-out-of-stock-image-disabled" href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image-out-of-stock img-responsive" alt="product image" draggable="false">
  <span class="product-listing--label-out-of-stock"><span>Out of Stock!</span></span></a>
  <p class="product-listing__total-items">Total 2 Packs in Cart</p>
  <div class="product-listing-details">
    <div class="product-listing__save">save <span class="product-listing__save--price"><i class="icon-rupees"></i>125</span></div>
    <p class="product-listing--original-price">MRP <span class="strike-diagonal"><i class="icon-rupees"></i>300</span></p>
    <p class="product-listing--discounted-price">DMart <i class="icon-rupees"></i>250</p>
    <div class="product-listing__quantity-secondary clearfix">

      <!-- display '.variant-label' label if one variant available -->
     <!--  <div class="variant-label js-rupee">
        <span>450gm - <i class="icon-rupees"></i>150</span>
      </div> -->
      <div class="md-custom-select js-rupee custom-dropdown">
        <select class="product-listing__quantity--select-weight" tabindex="0">
          <option value="1" selected="selected">2kg - ?250</option>
          <option value="2">5kg - ?500</option>
          <option value="3">10kg - ?1000</option>
        </select>
      </div>
      <div class="md-custom-select custom-dropdown">
        <select class="product-listing__quantity--select-quantity" tabindex="0">
          <option value="1" selected="selected">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="2">4</option>
          <option value="3">5</option>
          <option value="2">6</option>
          <option value="3">7</option>
          <option value="2">8</option>
          <option value="3">9</option>
          <option value="2">10</option>
          <option value="3">11</option>
          <option value="2">12</option>
          <option value="3">13</option>
          <option value="2">14</option>
          <option value="3">15</option>
        </select>
      </div>
    </div>
    <div class="product-listing__cta-container clearfix">
      <a href="javascript:;" class="button-primary product-listing__cta-button"><i class="icon-cart"></i> Add to Cart</a>
      <div class="product-listing__quantity--add">
        <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
      </div>
    </div>
    <div class="add-product-other-quantity">
      <div class="product-added-to-cart__icon-wrap">
        <a class="product-added-to-cart__icon-cta cart-icon" href="javascript:;">
          <i class="product-added-to-cart__icon icon-cart"></i>
          <span class="badge">2</span>
        </a>
      </div>
      <div class="product-price">
        <h4 class="product-price__saving">Total Savings <span><i class="icon-rupees"></i>50</span></h4>
        <h3 class="product-price__total">Total Price <i class="icon-rupees"></i>250</h3>
      </div>
      <div class="md-custom-select js-rupee">
        <select class="product-listing__quantity-other--select" id="js-more-quantity" tabindex="0">
          <option value="" selected="selected" disabled="disabled">Add More ?</option>
          <option value="1">2kg - ?250</option>
          <option value="2">5kg - ?500</option>
          <option value="3">10kg - ?1000</option>
        </select>
      </div>
      <div class="product-listing__quantity--add">
        <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
      </div>
    </div>
  </div>

  <div class="food-type">
    <!-- For Veg type -->
    <span class="veg-food">
      <i class="icon-veg icon-circle"></i>
    </span>

    <!-- <span class="non-veg-food">
      <i class="icon-non-veg icon-circle"></i>
    </span> -->
  </div>
  
  <div class="product-listing-out-of-stock__details">
    <p class="note">This item is not available</p>
    <button class="notify-me-cta button" type="button">ADD TO CART</button>
    <div class="product-listing__quantity--add">
      <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
    </div>
  </div>


</div>
<div class="product-listing-item__secondary js-hide-show">
  <h4 class="product-listing-item__cart-title">Product Added to Cart</h4>
  <div class="cart-icon">
    <i class="product-listing-item__secondary__icon-shopping-cart icon-cart"></i>
    <span class="badge">1</span>
  </div>
  <div class="added-product-wrap">
    <ul class="clearfix">
      <li class="added-product-wrap__list clearfix">
<!--         <div class="variant-label js-rupee">
          <span>450gm - <i class="icon-rupees"></i>150</span>
        </div>
 -->        <div class="md-custom-select added-product__quantity custom-dropdown js-rupee">
          <select>
            <option value="1" selected="selected">20kg - ?2500.00</option>
            <option value="2">50kg - ?5000.00</option>
            <option value="3">10kg - ?1000.00</option>
          </select>
        </div>
        <div class="md-custom-select added-product__quantity-size custom-dropdown">
          <select>
            <option selected="selected">1</option>
            <option>22</option>
            <option>33</option>
            <option>44</option>
            <option>5</option>
          </select>
        </div>
        <div class="added-product__remove">
          <a href="javascript:;"><i class="added-product__remove-icon icon-cross"></i></a>
        </div>
      </li>
    </ul>
  </div>
  <div class="product-price">
    <h4 class="product-price__saving">Your Savings <span><i class="icon-rupees"></i>50</span></h4>
    <h3 class="product-price__total">Total Price <i class="icon-rupees"></i>250</h3>
    <p class="product-listing__total-items--list-view">Total 2 Packs in Cart</p>
  </div>
  <div class="add-product-other-quantity">
  <!-- add '.js-rupee' to '.md-custom-select' wherever rupee symbol comes inside the select option element -->
    <div class="md-custom-select js-rupee custom-dropdown">
      <select class="product-listing__quantity--select" tabindex="0">
        <option value="" selected="selected" disabled="disabled">Add More ?</option>
        <option value="1">2kg - ?250</option>
        <option value="2">5kg - ?500</option>
        <option value="3">10kg - ?1000</option>
      </select>
    </div>
    <div class="product-listing__quantity--add">
      <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
    </div>
  </div>
</div>
<div class="product-listing-item__tertiary">
  <h4 class="product-listing-item__tertiary--title">Add to Shopping List</h4>
  <div class="product-listing-item__tertiary--add-list">
    <form>
      <input class="product-listing-item__tertiary--field input-text-field" name="addShopList" placeholder="Add new list">
      <button class="product-listing-item__tertiary--add-cta button" type="submit">Add</button>
    </form>
  </div>
  <span class="product-listing-item-list-error">List already exists !!</span>
  <div class="product-listing-item__tertiary-lists ps-container ps-theme-default" data-ps-id="5c7ea36a-0ffa-ad10-bf67-c72f50d51b73">
    <ul>
      <li><a href="javascript:;">Monthly List</a></li>
      <li><a href="javascript:;">Party List</a></li>
      <li><a href="javascript:;">Picnic List</a></li>
      <li><a href="javascript:;">Festival List</a></li>
      <li><a href="javascript:;">Travel List</a></li>
      <li><a href="javascript:;">Party List</a></li>
      <li><a href="javascript:;">Picnic List</a></li>
      <li><a href="javascript:;">Festival List</a></li>
      <li><a href="javascript:;">Travel List</a></li>
    </ul>
  <div class="ps-scrollbar-x-rail" style="left: 0px; bottom: 3px;"><div class="ps-scrollbar-x" tabindex="0" style="left: 0px; width: 0px;"></div></div><div class="ps-scrollbar-y-rail" style="top: 0px; right: 3px;"><div class="ps-scrollbar-y" tabindex="0" style="top: 0px; height: 0px;"></div></div></div>
  <button class="add-list-submit-cta button" type="button">Submit</button>
</div>
</div>

            </li>
          
            <li class="js-switch-view slide-margin" style="width: 230px; float: left; display: block;">
              
<!-- Add "product-out-of-stock" class to "product-listing-item" if product is not available-->
<div class="product-listing-item single-variant-product plp-grocery">
<div class="product-listing-item__primary">
  <div class="view-list view-list-product-image product-out-of-stock__small-image-wrap">
    <a href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image img-responsive" alt="product image" draggable="false"></a>
    <a class="product-out-of-stock__small-image product-out-of-stock-image-disabled" href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image-out-of-stock img-responsive" alt="product image" draggable="false">
    <span class="product-listing--label-out-of-stock"><span>Out of Stock!</span></span></a>
  </div>
  <div class="product-listing--TnB">
	  <h4 class="product-listing--title"><a href="javascript:;">India Gate Basmati Rice</a></h4>
	  <h5 class="product-listing--brand"><a href="javascript:;">India Gate</a></h5>
  </div>
  <a href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image small view-grid img-responsive" alt="product image" draggable="false">
  </a>
  <a class="product-out-of-stock__big-image product-out-of-stock-image-disabled" href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image-out-of-stock img-responsive" alt="product image" draggable="false">
  <span class="product-listing--label-out-of-stock"><span>Out of Stock!</span></span></a>
  <p class="product-listing__total-items">Total 2 Packs in Cart</p>
  <div class="product-listing-details">
    <div class="product-listing__save">save <span class="product-listing__save--price"><i class="icon-rupees"></i>125</span></div>
    <p class="product-listing--original-price">MRP <span class="strike-diagonal"><i class="icon-rupees"></i>300</span></p>
    <p class="product-listing--discounted-price">DMart <i class="icon-rupees"></i>250</p>
    <div class="product-listing__quantity-secondary clearfix">

      <!-- display '.variant-label' label if one variant available -->
     <!--  <div class="variant-label js-rupee">
        <span>450gm - <i class="icon-rupees"></i>150</span>
      </div> -->
      <div class="md-custom-select js-rupee custom-dropdown">
        <select class="product-listing__quantity--select-weight" tabindex="0">
          <option value="1" selected="selected">2kg - ?250</option>
          <option value="2">5kg - ?500</option>
          <option value="3">10kg - ?1000</option>
        </select>
      </div>
      <div class="md-custom-select custom-dropdown">
        <select class="product-listing__quantity--select-quantity" tabindex="0">
          <option value="1" selected="selected">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="2">4</option>
          <option value="3">5</option>
          <option value="2">6</option>
          <option value="3">7</option>
          <option value="2">8</option>
          <option value="3">9</option>
          <option value="2">10</option>
          <option value="3">11</option>
          <option value="2">12</option>
          <option value="3">13</option>
          <option value="2">14</option>
          <option value="3">15</option>
        </select>
      </div>
    </div>
    <div class="product-listing__cta-container clearfix">
      <a href="javascript:;" class="button-primary product-listing__cta-button"><i class="icon-cart"></i> Add to Cart</a>
      <div class="product-listing__quantity--add">
        <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
      </div>
    </div>
    <div class="add-product-other-quantity">
      <div class="product-added-to-cart__icon-wrap">
        <a class="product-added-to-cart__icon-cta cart-icon" href="javascript:;">
          <i class="product-added-to-cart__icon icon-cart"></i>
          <span class="badge">2</span>
        </a>
      </div>
      <div class="product-price">
        <h4 class="product-price__saving">Total Savings <span><i class="icon-rupees"></i>50</span></h4>
        <h3 class="product-price__total">Total Price <i class="icon-rupees"></i>250</h3>
      </div>
      <div class="md-custom-select js-rupee">
        <select class="product-listing__quantity-other--select" id="js-more-quantity" tabindex="0">
          <option value="" selected="selected" disabled="disabled">Add More ?</option>
          <option value="1">2kg - ?250</option>
          <option value="2">5kg - ?500</option>
          <option value="3">10kg - ?1000</option>
        </select>
      </div>
      <div class="product-listing__quantity--add">
        <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
      </div>
    </div>
  </div>

  <div class="food-type">
    <!-- For Veg type -->
    <span class="veg-food">
      <i class="icon-veg icon-circle"></i>
    </span>

    <!-- <span class="non-veg-food">
      <i class="icon-non-veg icon-circle"></i>
    </span> -->
  </div>
  
  <div class="product-listing-out-of-stock__details">
    <p class="note">This item is not available</p>
    <button class="notify-me-cta button" type="button">ADD TO CART</button>
    <div class="product-listing__quantity--add">
      <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
    </div>
  </div>


</div>
<div class="product-listing-item__secondary js-hide-show">
  <h4 class="product-listing-item__cart-title">Product Added to Cart</h4>
  <div class="cart-icon">
    <i class="product-listing-item__secondary__icon-shopping-cart icon-cart"></i>
    <span class="badge">1</span>
  </div>
  <div class="added-product-wrap">
    <ul class="clearfix">
      <li class="added-product-wrap__list clearfix">
<!--         <div class="variant-label js-rupee">
          <span>450gm - <i class="icon-rupees"></i>150</span>
        </div>
 -->        <div class="md-custom-select added-product__quantity custom-dropdown js-rupee">
          <select>
            <option value="1" selected="selected">20kg - ?2500.00</option>
            <option value="2">50kg - ?5000.00</option>
            <option value="3">10kg - ?1000.00</option>
          </select>
        </div>
        <div class="md-custom-select added-product__quantity-size custom-dropdown">
          <select>
            <option selected="selected">1</option>
            <option>22</option>
            <option>33</option>
            <option>44</option>
            <option>5</option>
          </select>
        </div>
        <div class="added-product__remove">
          <a href="javascript:;"><i class="added-product__remove-icon icon-cross"></i></a>
        </div>
      </li>
    </ul>
  </div>
  <div class="product-price">
    <h4 class="product-price__saving">Your Savings <span><i class="icon-rupees"></i>50</span></h4>
    <h3 class="product-price__total">Total Price <i class="icon-rupees"></i>250</h3>
    <p class="product-listing__total-items--list-view">Total 2 Packs in Cart</p>
  </div>
  <div class="add-product-other-quantity">
  <!-- add '.js-rupee' to '.md-custom-select' wherever rupee symbol comes inside the select option element -->
    <div class="md-custom-select js-rupee custom-dropdown">
      <select class="product-listing__quantity--select" tabindex="0">
        <option value="" selected="selected" disabled="disabled">Add More ?</option>
        <option value="1">2kg - ?250</option>
        <option value="2">5kg - ?500</option>
        <option value="3">10kg - ?1000</option>
      </select>
    </div>
    <div class="product-listing__quantity--add">
      <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
    </div>
  </div>
</div>
<div class="product-listing-item__tertiary">
  <h4 class="product-listing-item__tertiary--title">Add to Shopping List</h4>
  <div class="product-listing-item__tertiary--add-list">
    <form>
      <input class="product-listing-item__tertiary--field input-text-field" name="addShopList" placeholder="Add new list">
      <button class="product-listing-item__tertiary--add-cta button" type="submit">Add</button>
    </form>
  </div>
  <span class="product-listing-item-list-error">List already exists !!</span>
  <div class="product-listing-item__tertiary-lists ps-container ps-theme-default" data-ps-id="ab0f971d-974b-5d64-df99-97ab71361b15">
    <ul>
      <li><a href="javascript:;">Monthly List</a></li>
      <li><a href="javascript:;">Party List</a></li>
      <li><a href="javascript:;">Picnic List</a></li>
      <li><a href="javascript:;">Festival List</a></li>
      <li><a href="javascript:;">Travel List</a></li>
      <li><a href="javascript:;">Party List</a></li>
      <li><a href="javascript:;">Picnic List</a></li>
      <li><a href="javascript:;">Festival List</a></li>
      <li><a href="javascript:;">Travel List</a></li>
    </ul>
  <div class="ps-scrollbar-x-rail" style="left: 0px; bottom: 3px;"><div class="ps-scrollbar-x" tabindex="0" style="left: 0px; width: 0px;"></div></div><div class="ps-scrollbar-y-rail" style="top: 0px; right: 3px;"><div class="ps-scrollbar-y" tabindex="0" style="top: 0px; height: 0px;"></div></div></div>
  <button class="add-list-submit-cta button" type="button">Submit</button>
</div>
</div>

            </li>
          
            <li class="js-switch-view slide-margin" style="width: 230px; float: left; display: block;">
              
<!-- Add "product-out-of-stock" class to "product-listing-item" if product is not available-->
<div class="product-listing-item single-variant-product plp-grocery">
<div class="product-listing-item__primary">
  <div class="view-list view-list-product-image product-out-of-stock__small-image-wrap">
    <a href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image img-responsive" alt="product image" draggable="false"></a>
    <a class="product-out-of-stock__small-image product-out-of-stock-image-disabled" href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image-out-of-stock img-responsive" alt="product image" draggable="false">
    <span class="product-listing--label-out-of-stock"><span>Out of Stock!</span></span></a>
  </div>
  <div class="product-listing--TnB">
	  <h4 class="product-listing--title"><a href="javascript:;">India Gate Basmati Rice</a></h4>
	  <h5 class="product-listing--brand"><a href="javascript:;">India Gate</a></h5>
  </div>
  <a href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image small view-grid img-responsive" alt="product image" draggable="false">
  </a>
  <a class="product-out-of-stock__big-image product-out-of-stock-image-disabled" href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image-out-of-stock img-responsive" alt="product image" draggable="false">
  <span class="product-listing--label-out-of-stock"><span>Out of Stock!</span></span></a>
  <p class="product-listing__total-items">Total 2 Packs in Cart</p>
  <div class="product-listing-details">
    <div class="product-listing__save">save <span class="product-listing__save--price"><i class="icon-rupees"></i>125</span></div>
    <p class="product-listing--original-price">MRP <span class="strike-diagonal"><i class="icon-rupees"></i>300</span></p>
    <p class="product-listing--discounted-price">DMart <i class="icon-rupees"></i>250</p>
    <div class="product-listing__quantity-secondary clearfix">

      <!-- display '.variant-label' label if one variant available -->
     <!--  <div class="variant-label js-rupee">
        <span>450gm - <i class="icon-rupees"></i>150</span>
      </div> -->
      <div class="md-custom-select js-rupee custom-dropdown">
        <select class="product-listing__quantity--select-weight" tabindex="0">
          <option value="1" selected="selected">2kg - ?250</option>
          <option value="2">5kg - ?500</option>
          <option value="3">10kg - ?1000</option>
        </select>
      </div>
      <div class="md-custom-select custom-dropdown">
        <select class="product-listing__quantity--select-quantity" tabindex="0">
          <option value="1" selected="selected">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="2">4</option>
          <option value="3">5</option>
          <option value="2">6</option>
          <option value="3">7</option>
          <option value="2">8</option>
          <option value="3">9</option>
          <option value="2">10</option>
          <option value="3">11</option>
          <option value="2">12</option>
          <option value="3">13</option>
          <option value="2">14</option>
          <option value="3">15</option>
        </select>
      </div>
    </div>
    <div class="product-listing__cta-container clearfix">
      <a href="javascript:;" class="button-primary product-listing__cta-button"><i class="icon-cart"></i> Add to Cart</a>
      <div class="product-listing__quantity--add">
        <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
      </div>
    </div>
    <div class="add-product-other-quantity">
      <div class="product-added-to-cart__icon-wrap">
        <a class="product-added-to-cart__icon-cta cart-icon" href="javascript:;">
          <i class="product-added-to-cart__icon icon-cart"></i>
          <span class="badge">2</span>
        </a>
      </div>
      <div class="product-price">
        <h4 class="product-price__saving">Total Savings <span><i class="icon-rupees"></i>50</span></h4>
        <h3 class="product-price__total">Total Price <i class="icon-rupees"></i>250</h3>
      </div>
      <div class="md-custom-select js-rupee">
        <select class="product-listing__quantity-other--select" id="js-more-quantity" tabindex="0">
          <option value="" selected="selected" disabled="disabled">Add More ?</option>
          <option value="1">2kg - ?250</option>
          <option value="2">5kg - ?500</option>
          <option value="3">10kg - ?1000</option>
        </select>
      </div>
      <div class="product-listing__quantity--add">
        <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
      </div>
    </div>
  </div>

  <div class="food-type">
    <!-- For Veg type -->
    <span class="veg-food">
      <i class="icon-veg icon-circle"></i>
    </span>

    <!-- <span class="non-veg-food">
      <i class="icon-non-veg icon-circle"></i>
    </span> -->
  </div>
  
  <div class="product-listing-out-of-stock__details">
    <p class="note">This item is not available</p>
    <button class="notify-me-cta button" type="button">ADD TO CART</button>
    <div class="product-listing__quantity--add">
      <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
    </div>
  </div>


</div>
<div class="product-listing-item__secondary js-hide-show">
  <h4 class="product-listing-item__cart-title">Product Added to Cart</h4>
  <div class="cart-icon">
    <i class="product-listing-item__secondary__icon-shopping-cart icon-cart"></i>
    <span class="badge">1</span>
  </div>
  <div class="added-product-wrap">
    <ul class="clearfix">
      <li class="added-product-wrap__list clearfix">
<!--         <div class="variant-label js-rupee">
          <span>450gm - <i class="icon-rupees"></i>150</span>
        </div>
 -->        <div class="md-custom-select added-product__quantity custom-dropdown js-rupee">
          <select>
            <option value="1" selected="selected">20kg - ?2500.00</option>
            <option value="2">50kg - ?5000.00</option>
            <option value="3">10kg - ?1000.00</option>
          </select>
        </div>
        <div class="md-custom-select added-product__quantity-size custom-dropdown">
          <select>
            <option selected="selected">1</option>
            <option>22</option>
            <option>33</option>
            <option>44</option>
            <option>5</option>
          </select>
        </div>
        <div class="added-product__remove">
          <a href="javascript:;"><i class="added-product__remove-icon icon-cross"></i></a>
        </div>
      </li>
    </ul>
  </div>
  <div class="product-price">
    <h4 class="product-price__saving">Your Savings <span><i class="icon-rupees"></i>50</span></h4>
    <h3 class="product-price__total">Total Price <i class="icon-rupees"></i>250</h3>
    <p class="product-listing__total-items--list-view">Total 2 Packs in Cart</p>
  </div>
  <div class="add-product-other-quantity">
  <!-- add '.js-rupee' to '.md-custom-select' wherever rupee symbol comes inside the select option element -->
    <div class="md-custom-select js-rupee custom-dropdown">
      <select class="product-listing__quantity--select" tabindex="0">
        <option value="" selected="selected" disabled="disabled">Add More ?</option>
        <option value="1">2kg - ?250</option>
        <option value="2">5kg - ?500</option>
        <option value="3">10kg - ?1000</option>
      </select>
    </div>
    <div class="product-listing__quantity--add">
      <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
    </div>
  </div>
</div>
<div class="product-listing-item__tertiary">
  <h4 class="product-listing-item__tertiary--title">Add to Shopping List</h4>
  <div class="product-listing-item__tertiary--add-list">
    <form>
      <input class="product-listing-item__tertiary--field input-text-field" name="addShopList" placeholder="Add new list">
      <button class="product-listing-item__tertiary--add-cta button" type="submit">Add</button>
    </form>
  </div>
  <span class="product-listing-item-list-error">List already exists !!</span>
  <div class="product-listing-item__tertiary-lists ps-container ps-theme-default" data-ps-id="00a407e7-78df-6161-7f8a-817b445eea65">
    <ul>
      <li><a href="javascript:;">Monthly List</a></li>
      <li><a href="javascript:;">Party List</a></li>
      <li><a href="javascript:;">Picnic List</a></li>
      <li><a href="javascript:;">Festival List</a></li>
      <li><a href="javascript:;">Travel List</a></li>
      <li><a href="javascript:;">Party List</a></li>
      <li><a href="javascript:;">Picnic List</a></li>
      <li><a href="javascript:;">Festival List</a></li>
      <li><a href="javascript:;">Travel List</a></li>
    </ul>
  <div class="ps-scrollbar-x-rail" style="left: 0px; bottom: 3px;"><div class="ps-scrollbar-x" tabindex="0" style="left: 0px; width: 0px;"></div></div><div class="ps-scrollbar-y-rail" style="top: 0px; right: 3px;"><div class="ps-scrollbar-y" tabindex="0" style="top: 0px; height: 0px;"></div></div></div>
  <button class="add-list-submit-cta button" type="button">Submit</button>
</div>
</div>

            </li>
          
            <li class="js-switch-view slide-margin" style="width: 230px; float: left; display: block;">
              
<!-- Add "product-out-of-stock" class to "product-listing-item" if product is not available-->
<div class="product-listing-item single-variant-product plp-grocery">
<div class="product-listing-item__primary">
  <div class="view-list view-list-product-image product-out-of-stock__small-image-wrap">
    <a href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image img-responsive" alt="product image" draggable="false"></a>
    <a class="product-out-of-stock__small-image product-out-of-stock-image-disabled" href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image-out-of-stock img-responsive" alt="product image" draggable="false">
    <span class="product-listing--label-out-of-stock"><span>Out of Stock!</span></span></a>
  </div>
  <div class="product-listing--TnB">
	  <h4 class="product-listing--title"><a href="javascript:;">India Gate Basmati Rice</a></h4>
	  <h5 class="product-listing--brand"><a href="javascript:;">India Gate</a></h5>
  </div>
  <a href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image small view-grid img-responsive" alt="product image" draggable="false">
  </a>
  <a class="product-out-of-stock__big-image product-out-of-stock-image-disabled" href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image-out-of-stock img-responsive" alt="product image" draggable="false">
  <span class="product-listing--label-out-of-stock"><span>Out of Stock!</span></span></a>
  <p class="product-listing__total-items">Total 2 Packs in Cart</p>
  <div class="product-listing-details">
    <div class="product-listing__save">save <span class="product-listing__save--price"><i class="icon-rupees"></i>125</span></div>
    <p class="product-listing--original-price">MRP <span class="strike-diagonal"><i class="icon-rupees"></i>300</span></p>
    <p class="product-listing--discounted-price">DMart <i class="icon-rupees"></i>250</p>
    <div class="product-listing__quantity-secondary clearfix">

      <!-- display '.variant-label' label if one variant available -->
     <!--  <div class="variant-label js-rupee">
        <span>450gm - <i class="icon-rupees"></i>150</span>
      </div> -->
      <div class="md-custom-select js-rupee custom-dropdown">
        <select class="product-listing__quantity--select-weight" tabindex="0">
          <option value="1" selected="selected">2kg - ?250</option>
          <option value="2">5kg - ?500</option>
          <option value="3">10kg - ?1000</option>
        </select>
      </div>
      <div class="md-custom-select custom-dropdown">
        <select class="product-listing__quantity--select-quantity" tabindex="0">
          <option value="1" selected="selected">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="2">4</option>
          <option value="3">5</option>
          <option value="2">6</option>
          <option value="3">7</option>
          <option value="2">8</option>
          <option value="3">9</option>
          <option value="2">10</option>
          <option value="3">11</option>
          <option value="2">12</option>
          <option value="3">13</option>
          <option value="2">14</option>
          <option value="3">15</option>
        </select>
      </div>
    </div>
    <div class="product-listing__cta-container clearfix">
      <a href="javascript:;" class="button-primary product-listing__cta-button"><i class="icon-cart"></i> Add to Cart</a>
      <div class="product-listing__quantity--add">
        <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
      </div>
    </div>
    <div class="add-product-other-quantity">
      <div class="product-added-to-cart__icon-wrap">
        <a class="product-added-to-cart__icon-cta cart-icon" href="javascript:;">
          <i class="product-added-to-cart__icon icon-cart"></i>
          <span class="badge">2</span>
        </a>
      </div>
      <div class="product-price">
        <h4 class="product-price__saving">Total Savings <span><i class="icon-rupees"></i>50</span></h4>
        <h3 class="product-price__total">Total Price <i class="icon-rupees"></i>250</h3>
      </div>
      <div class="md-custom-select js-rupee">
        <select class="product-listing__quantity-other--select" id="js-more-quantity" tabindex="0">
          <option value="" selected="selected" disabled="disabled">Add More ?</option>
          <option value="1">2kg - ?250</option>
          <option value="2">5kg - ?500</option>
          <option value="3">10kg - ?1000</option>
        </select>
      </div>
      <div class="product-listing__quantity--add">
        <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
      </div>
    </div>
  </div>

  <div class="food-type">
    <!-- For Veg type -->
    <span class="veg-food">
      <i class="icon-veg icon-circle"></i>
    </span>

    <!-- <span class="non-veg-food">
      <i class="icon-non-veg icon-circle"></i>
    </span> -->
  </div>
  
  <div class="product-listing-out-of-stock__details">
    <p class="note">This item is not available</p>
    <button class="notify-me-cta button" type="button">ADD TO CART</button>
    <div class="product-listing__quantity--add">
      <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
    </div>
  </div>


</div>
<div class="product-listing-item__secondary js-hide-show">
  <h4 class="product-listing-item__cart-title">Product Added to Cart</h4>
  <div class="cart-icon">
    <i class="product-listing-item__secondary__icon-shopping-cart icon-cart"></i>
    <span class="badge">1</span>
  </div>
  <div class="added-product-wrap">
    <ul class="clearfix">
      <li class="added-product-wrap__list clearfix">
<!--         <div class="variant-label js-rupee">
          <span>450gm - <i class="icon-rupees"></i>150</span>
        </div>
 -->        <div class="md-custom-select added-product__quantity custom-dropdown js-rupee">
          <select>
            <option value="1" selected="selected">20kg - ?2500.00</option>
            <option value="2">50kg - ?5000.00</option>
            <option value="3">10kg - ?1000.00</option>
          </select>
        </div>
        <div class="md-custom-select added-product__quantity-size custom-dropdown">
          <select>
            <option selected="selected">1</option>
            <option>22</option>
            <option>33</option>
            <option>44</option>
            <option>5</option>
          </select>
        </div>
        <div class="added-product__remove">
          <a href="javascript:;"><i class="added-product__remove-icon icon-cross"></i></a>
        </div>
      </li>
    </ul>
  </div>
  <div class="product-price">
    <h4 class="product-price__saving">Your Savings <span><i class="icon-rupees"></i>50</span></h4>
    <h3 class="product-price__total">Total Price <i class="icon-rupees"></i>250</h3>
    <p class="product-listing__total-items--list-view">Total 2 Packs in Cart</p>
  </div>
  <div class="add-product-other-quantity">
  <!-- add '.js-rupee' to '.md-custom-select' wherever rupee symbol comes inside the select option element -->
    <div class="md-custom-select js-rupee custom-dropdown">
      <select class="product-listing__quantity--select" tabindex="0">
        <option value="" selected="selected" disabled="disabled">Add More ?</option>
        <option value="1">2kg - ?250</option>
        <option value="2">5kg - ?500</option>
        <option value="3">10kg - ?1000</option>
      </select>
    </div>
    <div class="product-listing__quantity--add">
      <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
    </div>
  </div>
</div>
<div class="product-listing-item__tertiary">
  <h4 class="product-listing-item__tertiary--title">Add to Shopping List</h4>
  <div class="product-listing-item__tertiary--add-list">
    <form>
      <input class="product-listing-item__tertiary--field input-text-field" name="addShopList" placeholder="Add new list">
      <button class="product-listing-item__tertiary--add-cta button" type="submit">Add</button>
    </form>
  </div>
  <span class="product-listing-item-list-error">List already exists !!</span>
  <div class="product-listing-item__tertiary-lists ps-container ps-theme-default" data-ps-id="cac5ba8e-b11c-34f3-5011-21a3df04c238">
    <ul>
      <li><a href="javascript:;">Monthly List</a></li>
      <li><a href="javascript:;">Party List</a></li>
      <li><a href="javascript:;">Picnic List</a></li>
      <li><a href="javascript:;">Festival List</a></li>
      <li><a href="javascript:;">Travel List</a></li>
      <li><a href="javascript:;">Party List</a></li>
      <li><a href="javascript:;">Picnic List</a></li>
      <li><a href="javascript:;">Festival List</a></li>
      <li><a href="javascript:;">Travel List</a></li>
    </ul>
  <div class="ps-scrollbar-x-rail" style="left: 0px; bottom: 3px;"><div class="ps-scrollbar-x" tabindex="0" style="left: 0px; width: 0px;"></div></div><div class="ps-scrollbar-y-rail" style="top: 0px; right: 3px;"><div class="ps-scrollbar-y" tabindex="0" style="top: 0px; height: 0px;"></div></div></div>
  <button class="add-list-submit-cta button" type="button">Submit</button>
</div>
</div>

            </li>
          
            <li class="js-switch-view slide-margin" style="width: 230px; float: left; display: block;">
              
<!-- Add "product-out-of-stock" class to "product-listing-item" if product is not available-->
<div class="product-listing-item single-variant-product plp-grocery">
<div class="product-listing-item__primary">
  <div class="view-list view-list-product-image product-out-of-stock__small-image-wrap">
    <a href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image img-responsive" alt="product image" draggable="false"></a>
    <a class="product-out-of-stock__small-image product-out-of-stock-image-disabled" href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image-out-of-stock img-responsive" alt="product image" draggable="false">
    <span class="product-listing--label-out-of-stock"><span>Out of Stock!</span></span></a>
  </div>
  <div class="product-listing--TnB">
	  <h4 class="product-listing--title"><a href="javascript:;">India Gate Basmati Rice</a></h4>
	  <h5 class="product-listing--brand"><a href="javascript:;">India Gate</a></h5>
  </div>
  <a href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image small view-grid img-responsive" alt="product image" draggable="false">
  </a>
  <a class="product-out-of-stock__big-image product-out-of-stock-image-disabled" href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image-out-of-stock img-responsive" alt="product image" draggable="false">
  <span class="product-listing--label-out-of-stock"><span>Out of Stock!</span></span></a>
  <p class="product-listing__total-items">Total 2 Packs in Cart</p>
  <div class="product-listing-details">
    <div class="product-listing__save">save <span class="product-listing__save--price"><i class="icon-rupees"></i>125</span></div>
    <p class="product-listing--original-price">MRP <span class="strike-diagonal"><i class="icon-rupees"></i>300</span></p>
    <p class="product-listing--discounted-price">DMart <i class="icon-rupees"></i>250</p>
    <div class="product-listing__quantity-secondary clearfix">

      <!-- display '.variant-label' label if one variant available -->
     <!--  <div class="variant-label js-rupee">
        <span>450gm - <i class="icon-rupees"></i>150</span>
      </div> -->
      <div class="md-custom-select js-rupee custom-dropdown">
        <select class="product-listing__quantity--select-weight" tabindex="0">
          <option value="1" selected="selected">2kg - ?250</option>
          <option value="2">5kg - ?500</option>
          <option value="3">10kg - ?1000</option>
        </select>
      </div>
      <div class="md-custom-select custom-dropdown">
        <select class="product-listing__quantity--select-quantity" tabindex="0">
          <option value="1" selected="selected">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="2">4</option>
          <option value="3">5</option>
          <option value="2">6</option>
          <option value="3">7</option>
          <option value="2">8</option>
          <option value="3">9</option>
          <option value="2">10</option>
          <option value="3">11</option>
          <option value="2">12</option>
          <option value="3">13</option>
          <option value="2">14</option>
          <option value="3">15</option>
        </select>
      </div>
    </div>
    <div class="product-listing__cta-container clearfix">
      <a href="javascript:;" class="button-primary product-listing__cta-button"><i class="icon-cart"></i> Add to Cart</a>
      <div class="product-listing__quantity--add">
        <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
      </div>
    </div>
    <div class="add-product-other-quantity">
      <div class="product-added-to-cart__icon-wrap">
        <a class="product-added-to-cart__icon-cta cart-icon" href="javascript:;">
          <i class="product-added-to-cart__icon icon-cart"></i>
          <span class="badge">2</span>
        </a>
      </div>
      <div class="product-price">
        <h4 class="product-price__saving">Total Savings <span><i class="icon-rupees"></i>50</span></h4>
        <h3 class="product-price__total">Total Price <i class="icon-rupees"></i>250</h3>
      </div>
      <div class="md-custom-select js-rupee">
        <select class="product-listing__quantity-other--select" id="js-more-quantity" tabindex="0">
          <option value="" selected="selected" disabled="disabled">Add More ?</option>
          <option value="1">2kg - ?250</option>
          <option value="2">5kg - ?500</option>
          <option value="3">10kg - ?1000</option>
        </select>
      </div>
      <div class="product-listing__quantity--add">
        <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
      </div>
    </div>
  </div>

  <div class="food-type">
    <!-- For Veg type -->
    <span class="veg-food">
      <i class="icon-veg icon-circle"></i>
    </span>

    <!-- <span class="non-veg-food">
      <i class="icon-non-veg icon-circle"></i>
    </span> -->
  </div>
  
  <div class="product-listing-out-of-stock__details">
    <p class="note">This item is not available</p>
    <button class="notify-me-cta button" type="button">ADD TO CART</button>
    <div class="product-listing__quantity--add">
      <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
    </div>
  </div>


</div>
<div class="product-listing-item__secondary js-hide-show">
  <h4 class="product-listing-item__cart-title">Product Added to Cart</h4>
  <div class="cart-icon">
    <i class="product-listing-item__secondary__icon-shopping-cart icon-cart"></i>
    <span class="badge">1</span>
  </div>
  <div class="added-product-wrap">
    <ul class="clearfix">
      <li class="added-product-wrap__list clearfix">
<!--         <div class="variant-label js-rupee">
          <span>450gm - <i class="icon-rupees"></i>150</span>
        </div>
 -->        <div class="md-custom-select added-product__quantity custom-dropdown js-rupee">
          <select>
            <option value="1" selected="selected">20kg - ?2500.00</option>
            <option value="2">50kg - ?5000.00</option>
            <option value="3">10kg - ?1000.00</option>
          </select>
        </div>
        <div class="md-custom-select added-product__quantity-size custom-dropdown">
          <select>
            <option selected="selected">1</option>
            <option>22</option>
            <option>33</option>
            <option>44</option>
            <option>5</option>
          </select>
        </div>
        <div class="added-product__remove">
          <a href="javascript:;"><i class="added-product__remove-icon icon-cross"></i></a>
        </div>
      </li>
    </ul>
  </div>
  <div class="product-price">
    <h4 class="product-price__saving">Your Savings <span><i class="icon-rupees"></i>50</span></h4>
    <h3 class="product-price__total">Total Price <i class="icon-rupees"></i>250</h3>
    <p class="product-listing__total-items--list-view">Total 2 Packs in Cart</p>
  </div>
  <div class="add-product-other-quantity">
  <!-- add '.js-rupee' to '.md-custom-select' wherever rupee symbol comes inside the select option element -->
    <div class="md-custom-select js-rupee custom-dropdown">
      <select class="product-listing__quantity--select" tabindex="0">
        <option value="" selected="selected" disabled="disabled">Add More ?</option>
        <option value="1">2kg - ?250</option>
        <option value="2">5kg - ?500</option>
        <option value="3">10kg - ?1000</option>
      </select>
    </div>
    <div class="product-listing__quantity--add">
      <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
    </div>
  </div>
</div>
<div class="product-listing-item__tertiary">
  <h4 class="product-listing-item__tertiary--title">Add to Shopping List</h4>
  <div class="product-listing-item__tertiary--add-list">
    <form>
      <input class="product-listing-item__tertiary--field input-text-field" name="addShopList" placeholder="Add new list">
      <button class="product-listing-item__tertiary--add-cta button" type="submit">Add</button>
    </form>
  </div>
  <span class="product-listing-item-list-error">List already exists !!</span>
  <div class="product-listing-item__tertiary-lists ps-container ps-theme-default" data-ps-id="1ab108e5-634b-6f51-eb86-2f1415edee64">
    <ul>
      <li><a href="javascript:;">Monthly List</a></li>
      <li><a href="javascript:;">Party List</a></li>
      <li><a href="javascript:;">Picnic List</a></li>
      <li><a href="javascript:;">Festival List</a></li>
      <li><a href="javascript:;">Travel List</a></li>
      <li><a href="javascript:;">Party List</a></li>
      <li><a href="javascript:;">Picnic List</a></li>
      <li><a href="javascript:;">Festival List</a></li>
      <li><a href="javascript:;">Travel List</a></li>
    </ul>
  <div class="ps-scrollbar-x-rail" style="left: 0px; bottom: 3px;"><div class="ps-scrollbar-x" tabindex="0" style="left: 0px; width: 0px;"></div></div><div class="ps-scrollbar-y-rail" style="top: 0px; right: 3px;"><div class="ps-scrollbar-y" tabindex="0" style="top: 0px; height: 0px;"></div></div></div>
  <button class="add-list-submit-cta button" type="button">Submit</button>
</div>
</div>

            </li>
          
            <li class="js-switch-view slide-margin" style="width: 230px; float: left; display: block;">
              
<!-- Add "product-out-of-stock" class to "product-listing-item" if product is not available-->
<div class="product-listing-item single-variant-product plp-grocery">
<div class="product-listing-item__primary">
  <div class="view-list view-list-product-image product-out-of-stock__small-image-wrap">
    <a href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image img-responsive" alt="product image" draggable="false"></a>
    <a class="product-out-of-stock__small-image product-out-of-stock-image-disabled" href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image-out-of-stock img-responsive" alt="product image" draggable="false">
    <span class="product-listing--label-out-of-stock"><span>Out of Stock!</span></span></a>
  </div>
  <div class="product-listing--TnB">
	  <h4 class="product-listing--title"><a href="javascript:;">India Gate Basmati Rice</a></h4>
	  <h5 class="product-listing--brand"><a href="javascript:;">India Gate</a></h5>
  </div>
  <a href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image small view-grid img-responsive" alt="product image" draggable="false">
  </a>
  <a class="product-out-of-stock__big-image product-out-of-stock-image-disabled" href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image-out-of-stock img-responsive" alt="product image" draggable="false">
  <span class="product-listing--label-out-of-stock"><span>Out of Stock!</span></span></a>
  <p class="product-listing__total-items">Total 2 Packs in Cart</p>
  <div class="product-listing-details">
    <div class="product-listing__save">save <span class="product-listing__save--price"><i class="icon-rupees"></i>125</span></div>
    <p class="product-listing--original-price">MRP <span class="strike-diagonal"><i class="icon-rupees"></i>300</span></p>
    <p class="product-listing--discounted-price">DMart <i class="icon-rupees"></i>250</p>
    <div class="product-listing__quantity-secondary clearfix">

      <!-- display '.variant-label' label if one variant available -->
     <!--  <div class="variant-label js-rupee">
        <span>450gm - <i class="icon-rupees"></i>150</span>
      </div> -->
      <div class="md-custom-select js-rupee custom-dropdown">
        <select class="product-listing__quantity--select-weight" tabindex="0">
          <option value="1" selected="selected">2kg - ?250</option>
          <option value="2">5kg - ?500</option>
          <option value="3">10kg - ?1000</option>
        </select>
      </div>
      <div class="md-custom-select custom-dropdown">
        <select class="product-listing__quantity--select-quantity" tabindex="0">
          <option value="1" selected="selected">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="2">4</option>
          <option value="3">5</option>
          <option value="2">6</option>
          <option value="3">7</option>
          <option value="2">8</option>
          <option value="3">9</option>
          <option value="2">10</option>
          <option value="3">11</option>
          <option value="2">12</option>
          <option value="3">13</option>
          <option value="2">14</option>
          <option value="3">15</option>
        </select>
      </div>
    </div>
    <div class="product-listing__cta-container clearfix">
      <a href="javascript:;" class="button-primary product-listing__cta-button"><i class="icon-cart"></i> Add to Cart</a>
      <div class="product-listing__quantity--add">
        <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
      </div>
    </div>
    <div class="add-product-other-quantity">
      <div class="product-added-to-cart__icon-wrap">
        <a class="product-added-to-cart__icon-cta cart-icon" href="javascript:;">
          <i class="product-added-to-cart__icon icon-cart"></i>
          <span class="badge">2</span>
        </a>
      </div>
      <div class="product-price">
        <h4 class="product-price__saving">Total Savings <span><i class="icon-rupees"></i>50</span></h4>
        <h3 class="product-price__total">Total Price <i class="icon-rupees"></i>250</h3>
      </div>
      <div class="md-custom-select js-rupee">
        <select class="product-listing__quantity-other--select" id="js-more-quantity" tabindex="0">
          <option value="" selected="selected" disabled="disabled">Add More ?</option>
          <option value="1">2kg - ?250</option>
          <option value="2">5kg - ?500</option>
          <option value="3">10kg - ?1000</option>
        </select>
      </div>
      <div class="product-listing__quantity--add">
        <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
      </div>
    </div>
  </div>

  <div class="food-type">
    <!-- For Veg type -->
    <span class="veg-food">
      <i class="icon-veg icon-circle"></i>
    </span>

    <!-- <span class="non-veg-food">
      <i class="icon-non-veg icon-circle"></i>
    </span> -->
  </div>
  
  <div class="product-listing-out-of-stock__details">
    <p class="note">This item is not available</p>
    <button class="notify-me-cta button" type="button">ADD TO CART</button>
    <div class="product-listing__quantity--add">
      <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
    </div>
  </div>


</div>
<div class="product-listing-item__secondary js-hide-show">
  <h4 class="product-listing-item__cart-title">Product Added to Cart</h4>
  <div class="cart-icon">
    <i class="product-listing-item__secondary__icon-shopping-cart icon-cart"></i>
    <span class="badge">1</span>
  </div>
  <div class="added-product-wrap">
    <ul class="clearfix">
      <li class="added-product-wrap__list clearfix">
<!--         <div class="variant-label js-rupee">
          <span>450gm - <i class="icon-rupees"></i>150</span>
        </div>
 -->        <div class="md-custom-select added-product__quantity custom-dropdown js-rupee">
          <select>
            <option value="1" selected="selected">20kg - ?2500.00</option>
            <option value="2">50kg - ?5000.00</option>
            <option value="3">10kg - ?1000.00</option>
          </select>
        </div>
        <div class="md-custom-select added-product__quantity-size custom-dropdown">
          <select>
            <option selected="selected">1</option>
            <option>22</option>
            <option>33</option>
            <option>44</option>
            <option>5</option>
          </select>
        </div>
        <div class="added-product__remove">
          <a href="javascript:;"><i class="added-product__remove-icon icon-cross"></i></a>
        </div>
      </li>
    </ul>
  </div>
  <div class="product-price">
    <h4 class="product-price__saving">Your Savings <span><i class="icon-rupees"></i>50</span></h4>
    <h3 class="product-price__total">Total Price <i class="icon-rupees"></i>250</h3>
    <p class="product-listing__total-items--list-view">Total 2 Packs in Cart</p>
  </div>
  <div class="add-product-other-quantity">
  <!-- add '.js-rupee' to '.md-custom-select' wherever rupee symbol comes inside the select option element -->
    <div class="md-custom-select js-rupee custom-dropdown">
      <select class="product-listing__quantity--select" tabindex="0">
        <option value="" selected="selected" disabled="disabled">Add More ?</option>
        <option value="1">2kg - ?250</option>
        <option value="2">5kg - ?500</option>
        <option value="3">10kg - ?1000</option>
      </select>
    </div>
    <div class="product-listing__quantity--add">
      <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
    </div>
  </div>
</div>
<div class="product-listing-item__tertiary">
  <h4 class="product-listing-item__tertiary--title">Add to Shopping List</h4>
  <div class="product-listing-item__tertiary--add-list">
    <form>
      <input class="product-listing-item__tertiary--field input-text-field" name="addShopList" placeholder="Add new list">
      <button class="product-listing-item__tertiary--add-cta button" type="submit">Add</button>
    </form>
  </div>
  <span class="product-listing-item-list-error">List already exists !!</span>
  <div class="product-listing-item__tertiary-lists ps-container ps-theme-default" data-ps-id="24d9622a-902a-beac-13e4-2cc833b4c973">
    <ul>
      <li><a href="javascript:;">Monthly List</a></li>
      <li><a href="javascript:;">Party List</a></li>
      <li><a href="javascript:;">Picnic List</a></li>
      <li><a href="javascript:;">Festival List</a></li>
      <li><a href="javascript:;">Travel List</a></li>
      <li><a href="javascript:;">Party List</a></li>
      <li><a href="javascript:;">Picnic List</a></li>
      <li><a href="javascript:;">Festival List</a></li>
      <li><a href="javascript:;">Travel List</a></li>
    </ul>
  <div class="ps-scrollbar-x-rail" style="left: 0px; bottom: 3px;"><div class="ps-scrollbar-x" tabindex="0" style="left: 0px; width: 0px;"></div></div><div class="ps-scrollbar-y-rail" style="top: 0px; right: 3px;"><div class="ps-scrollbar-y" tabindex="0" style="top: 0px; height: 0px;"></div></div></div>
  <button class="add-list-submit-cta button" type="button">Submit</button>
</div>
</div>

            </li>
          
            <li class="js-switch-view slide-margin" style="width: 230px; float: left; display: block;">
              
<!-- Add "product-out-of-stock" class to "product-listing-item" if product is not available-->
<div class="product-listing-item single-variant-product plp-grocery">
<div class="product-listing-item__primary">
  <div class="view-list view-list-product-image product-out-of-stock__small-image-wrap">
    <a href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image img-responsive" alt="product image" draggable="false"></a>
    <a class="product-out-of-stock__small-image product-out-of-stock-image-disabled" href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image-out-of-stock img-responsive" alt="product image" draggable="false">
    <span class="product-listing--label-out-of-stock"><span>Out of Stock!</span></span></a>
  </div>
  <div class="product-listing--TnB">
	  <h4 class="product-listing--title"><a href="javascript:;">India Gate Basmati Rice</a></h4>
	  <h5 class="product-listing--brand"><a href="javascript:;">India Gate</a></h5>
  </div>
  <a href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image small view-grid img-responsive" alt="product image" draggable="false">
  </a>
  <a class="product-out-of-stock__big-image product-out-of-stock-image-disabled" href="javascript:;"><img src="CLP%20-%20DMart_files/product-1.jpg" class="product-listing--image-out-of-stock img-responsive" alt="product image" draggable="false">
  <span class="product-listing--label-out-of-stock"><span>Out of Stock!</span></span></a>
  <p class="product-listing__total-items">Total 2 Packs in Cart</p>
  <div class="product-listing-details">
    <div class="product-listing__save">save <span class="product-listing__save--price"><i class="icon-rupees"></i>125</span></div>
    <p class="product-listing--original-price">MRP <span class="strike-diagonal"><i class="icon-rupees"></i>300</span></p>
    <p class="product-listing--discounted-price">DMart <i class="icon-rupees"></i>250</p>
    <div class="product-listing__quantity-secondary clearfix">

      <!-- display '.variant-label' label if one variant available -->
     <!--  <div class="variant-label js-rupee">
        <span>450gm - <i class="icon-rupees"></i>150</span>
      </div> -->
      <div class="md-custom-select js-rupee custom-dropdown">
        <select class="product-listing__quantity--select-weight" tabindex="0">
          <option value="1" selected="selected">2kg - ?250</option>
          <option value="2">5kg - ?500</option>
          <option value="3">10kg - ?1000</option>
        </select>
      </div>
      <div class="md-custom-select custom-dropdown">
        <select class="product-listing__quantity--select-quantity" tabindex="0">
          <option value="1" selected="selected">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="2">4</option>
          <option value="3">5</option>
          <option value="2">6</option>
          <option value="3">7</option>
          <option value="2">8</option>
          <option value="3">9</option>
          <option value="2">10</option>
          <option value="3">11</option>
          <option value="2">12</option>
          <option value="3">13</option>
          <option value="2">14</option>
          <option value="3">15</option>
        </select>
      </div>
    </div>
    <div class="product-listing__cta-container clearfix">
      <a href="javascript:;" class="button-primary product-listing__cta-button"><i class="icon-cart"></i> Add to Cart</a>
      <div class="product-listing__quantity--add">
        <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
      </div>
    </div>
    <div class="add-product-other-quantity">
      <div class="product-added-to-cart__icon-wrap">
        <a class="product-added-to-cart__icon-cta cart-icon" href="javascript:;">
          <i class="product-added-to-cart__icon icon-cart"></i>
          <span class="badge">2</span>
        </a>
      </div>
      <div class="product-price">
        <h4 class="product-price__saving">Total Savings <span><i class="icon-rupees"></i>50</span></h4>
        <h3 class="product-price__total">Total Price <i class="icon-rupees"></i>250</h3>
      </div>
      <div class="md-custom-select js-rupee">
        <select class="product-listing__quantity-other--select" id="js-more-quantity" tabindex="0">
          <option value="" selected="selected" disabled="disabled">Add More ?</option>
          <option value="1">2kg - ?250</option>
          <option value="2">5kg - ?500</option>
          <option value="3">10kg - ?1000</option>
        </select>
      </div>
      <div class="product-listing__quantity--add">
        <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
      </div>
    </div>
  </div>

  <div class="food-type">
    <!-- For Veg type -->
    <span class="veg-food">
      <i class="icon-veg icon-circle"></i>
    </span>

    <!-- <span class="non-veg-food">
      <i class="icon-non-veg icon-circle"></i>
    </span> -->
  </div>
  
  <div class="product-listing-out-of-stock__details">
    <p class="note">This item is not available</p>
    <button class="notify-me-cta button" type="button">ADD TO CART</button>
    <div class="product-listing__quantity--add">
      <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
    </div>
  </div>


</div>
<div class="product-listing-item__secondary js-hide-show">
  <h4 class="product-listing-item__cart-title">Product Added to Cart</h4>
  <div class="cart-icon">
    <i class="product-listing-item__secondary__icon-shopping-cart icon-cart"></i>
    <span class="badge">1</span>
  </div>
  <div class="added-product-wrap">
    <ul class="clearfix">
      <li class="added-product-wrap__list clearfix">
<!--         <div class="variant-label js-rupee">
          <span>450gm - <i class="icon-rupees"></i>150</span>
        </div>
 -->        <div class="md-custom-select added-product__quantity custom-dropdown js-rupee">
          <select>
            <option value="1" selected="selected">20kg - ?2500.00</option>
            <option value="2">50kg - ?5000.00</option>
            <option value="3">10kg - ?1000.00</option>
          </select>
        </div>
        <div class="md-custom-select added-product__quantity-size custom-dropdown">
          <select>
            <option selected="selected">1</option>
            <option>22</option>
            <option>33</option>
            <option>44</option>
            <option>5</option>
          </select>
        </div>
        <div class="added-product__remove">
          <a href="javascript:;"><i class="added-product__remove-icon icon-cross"></i></a>
        </div>
      </li>
    </ul>
  </div>
  <div class="product-price">
    <h4 class="product-price__saving">Your Savings <span><i class="icon-rupees"></i>50</span></h4>
    <h3 class="product-price__total">Total Price <i class="icon-rupees"></i>250</h3>
    <p class="product-listing__total-items--list-view">Total 2 Packs in Cart</p>
  </div>
  <div class="add-product-other-quantity">
  <!-- add '.js-rupee' to '.md-custom-select' wherever rupee symbol comes inside the select option element -->
    <div class="md-custom-select js-rupee custom-dropdown">
      <select class="product-listing__quantity--select" tabindex="0">
        <option value="" selected="selected" disabled="disabled">Add More ?</option>
        <option value="1">2kg - ?250</option>
        <option value="2">5kg - ?500</option>
        <option value="3">10kg - ?1000</option>
      </select>
    </div>
    <div class="product-listing__quantity--add">
      <a href="javascript:;" class="button-icon-white"><i class="icon-document-add"></i></a>
    </div>
  </div>
</div>
<div class="product-listing-item__tertiary">
  <h4 class="product-listing-item__tertiary--title">Add to Shopping List</h4>
  <div class="product-listing-item__tertiary--add-list">
    <form>
      <input class="product-listing-item__tertiary--field input-text-field" name="addShopList" placeholder="Add new list">
      <button class="product-listing-item__tertiary--add-cta button" type="submit">Add</button>
    </form>
  </div>
  <span class="product-listing-item-list-error">List already exists !!</span>
  <div class="product-listing-item__tertiary-lists ps-container ps-theme-default" data-ps-id="c2b91ceb-78d8-149c-68ad-29df3d738b01">
    <ul>
      <li><a href="javascript:;">Monthly List</a></li>
      <li><a href="javascript:;">Party List</a></li>
      <li><a href="javascript:;">Picnic List</a></li>
      <li><a href="javascript:;">Festival List</a></li>
      <li><a href="javascript:;">Travel List</a></li>
      <li><a href="javascript:;">Party List</a></li>
      <li><a href="javascript:;">Picnic List</a></li>
      <li><a href="javascript:;">Festival List</a></li>
      <li><a href="javascript:;">Travel List</a></li>
    </ul>
  <div class="ps-scrollbar-x-rail" style="left: 0px; bottom: 3px;"><div class="ps-scrollbar-x" tabindex="0" style="left: 0px; width: 0px;"></div></div><div class="ps-scrollbar-y-rail" style="top: 0px; right: 3px;"><div class="ps-scrollbar-y" tabindex="0" style="top: 0px; height: 0px;"></div></div></div>
  <button class="add-list-submit-cta button" type="button">Submit</button>
</div>
</div>

            </li>
          
        </ul></div></div>
      </div>
    </div>
  </div>
</div>

        </section>
      </div>
    </div>
  </div>
  

  
    
    

<div class="container clp-mobile-brandfilter">
  <div class="row">
    <div class="col-xs-12 col-md-3 product-filter-wrapper">
      <div class="show-sm-down product-filter-control">
        <h4 class="product-filter-control__title">
          <a href="javascript:;" class="brand-filter-back js-brand-filter-back"><i class="icon-angle-left"></i></a>
          Filter
        </h4>
      </div>
      <div class="row">

        <div class="col-xs-12">
            <div class="product-filter product-filter--brand">
<h3 class="filter-title js-filter-hide-show">Brand
    <span class="filter__item--title-arrow"><i class="icon-caret-up"></i></span>
  </h3>
  <div class="filter__item-module">
   <!-- <div class="brand-filter">
      <!--<input type="text" placeholder="Search by Brand" class="search-text-input" />
      <div class="icon-holder">
        <i class="icon-search"></i>
      </div>
    </div>-->
    <ul class="filter__item-list-secondary filter__scroll ps-container ps-theme-default" data-ps-id="7605abb0-248a-d670-2f43-fecd9d8f8f7c">
      <li><label><input checked="checked" type="checkbox">Premia</label> </li>
      <li><label><input checked="checked" type="checkbox">Ricebran-fortune</label> </li>
      <li><label><input checked="checked" type="checkbox">Krishna</label> </li>
      <li><label><input checked="checked" type="checkbox">Everest</label> </li>
      
    <div class="ps-scrollbar-x-rail" style="left: 0px; bottom: 3px;"><div class="ps-scrollbar-x" tabindex="0" style="left: 0px; width: 0px;"></div></div><div class="ps-scrollbar-y-rail" style="top: 0px; right: 3px;"><div class="ps-scrollbar-y" tabindex="0" style="top: 0px; height: 0px;"></div></div></ul>
  </div>
</div>

        </div>

      </div>
    </div>
 

  </div>
</div>



<div class="loading-animation-wrapper">
  <div class="loading-animation__panel">
    <img class="img-responsive" src="CLP%20-%20DMart_files/loader.gif" alt="">
  </div>
</div>







<script src="CLP%20-%20DMart_files/main.js"></script>



<div class="autocomplete-suggestions ps-container ps-theme-default" data-ps-id="a3a6fee9-dc09-4e0e-7b14-32b949e85203"><div class="ps-scrollbar-x-rail" style="left: 0px; bottom: 3px;"><div class="ps-scrollbar-x" tabindex="0" style="left: 0px; width: 0px;"></div></div><div class="ps-scrollbar-y-rail" style="top: 0px; right: 3px;"><div class="ps-scrollbar-y" tabindex="0" style="top: 0px; height: 0px;"></div></div></div></div>