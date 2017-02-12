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
<%@ include file="../../Common/nocache.jspf" %>
<%@ include file="../../Common/EnvironmentSetup.jspf" %>

<!DOCTYPE HTML>
<html>
<!-- Begin Page -->			
<head	>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Invoice Sample - DMart</title>
	<link rel="stylesheet" href="<c:out value="${jspStoreImgDir}${env_vfileStylesheet}"/>" type="text/css"/>
	
	<%@ include file="../../Common/CommonJSToInclude.jspf"%>
	<c:set var="pageGroup" value="Common" />
	<%@include file="../../Common/DMartCommonJSToInclude.jspf" %>
	<%--
	<%@ include file="../../include/ErrorMessageSetupBrazilExt.jspf" %>
	
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/CommonContextsDeclarations.js"/>"></script>
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/CommonControllersDeclaration.js"/>"></script>
	
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/ServicesDeclaration.js"/>"></script>
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/UserArea/LogonForm.js"/>"></script>
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/UserArea/AddressHelper.js"/>"></script>
	<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/UserArea/MyAccountDisplay.js"/>"></script>
	<c:if test="${isBrazilStore}"> 
		<script type="text/javascript" src="<c:out value="${jsAssetsDir}javascript/UserArea/MyBrazilAccountDisplay.js"/>"></script>
	</c:if>

	<c:if test="${empty B2BLogonFormJSIncluded}">
		<script type="text/javascript" src="<c:out value="${staticAssetContextRoot}${env_siteWidgetsDir}com.ibm.commerce.store.widgets.RegistrationForm/javascript/B2BLogonForm.js"/>"></script>
		<c:set var="B2BLogonFormJSIncluded" value="true" scope="request"/>
	</c:if>
	--%>
		<script type="text/javascript">
		function popupWindow(URL) {
			window.open(URL, "mywindow", "status=1,scrollbars=1,resizable=1");
		}
	</script>  

	<%@ include file="../../Common/CommonJSPFToInclude.jspf"%>
      
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
  <li><a href="javascript:;" title="Home">Home</a></li>
  
  <li><a href="javascript:;"></a></li>
  
  <li> Sitemap </li>
</ul>

		</div>

		
  </div>
</div>

			
<div class="container">
  <div class="row">
    <div class="col-xs-12">
      <div class="invoice-print-copy">
  <style>
    .invoice-print-copy {
      width: 794px;
      font-size: 12px;
      font-family: Arial, sans-serif;
    }

    .invoice-print-copy table tr td {
      vertical-align: top;
    }

    .invoice-print-copy .invoice-table {
      width: 100%;
      border-left: 1px solid #dbdbdb;
      border-right: 1px solid #dbdbdb;
    }

    .invoice-print-copy .invoice-table tr td {
      padding: 2px 5px;
      text-align: center;
    }

    .invoice-print-copy .invoice-table tr td:nth-child(2) {
      text-align: left;
    }

    .invoice-print-copy .invoice-table tr:last-child {
      border-bottom: 1px solid #dbdbdb;
      padding-bottom: 10px;
    }

    .invoice-print-copy .invoice-table .invoice-col-small {
      width: 11%;
    }

    .invoice-print-copy .invoice-table .invoice-col-large {
      width: 50%;
    }

    .invoice-print-copy .invoice-table .invoice-col-tiny {
      width: 6%;
      text-align: center;
    }

    .invoice-print-copy .invoice-table .crate-item {
      font-weight: 600;
      border-top: 1px solid #dbdbdb;
    }

    .invoice-print-copy .invoice-table tr.item-last td {
      border-bottom: 1px solid #dbdbdb;
      padding-bottom: 10px;
    }

    .invoice-print-copy .invoice-table .crate-item td {
      color: #6bb757;
      font-size: 13px;
      font-weight: 300;
    }

    .invoice-print-copy .invoice-total {
      background-color: #f7f7f7;
      width: 100%;
      border-bottom: 1px solid #dbdbdb;
      border-left: 1px solid #dbdbdb;
      border-right: 1px solid #dbdbdb;
    }

    .invoice-print-copy .invoice-total tr {
      text-align: right;
    }

    .invoice-print-copy .invoice-total tr td {
      padding-right: 0;
      padding-top: 5px;
      font-weight: 600;
    }

    .invoice-print-copy .invoice-total tr td:first-child {
      width: 60%;
    }

    .invoice-print-copy .invoice-total tr td:nth-child(2n) {
      width: 25%;
    }

    .invoice-print-copy .invoice-total tr td:last-child {
      padding-right: 30px;
    }

    .invoice-print-copy .invoice-total .discount {
      color: #d35400;
    }

    .invoice-print-copy .invoice-total .total-saving {
      color: #9a8054;
    }

    .invoice-print-copy .invoice-total .you-pay {
      color: #287345;
    }

    .invoice-print-copy .invoice-tax-info {
      background: #fffefa;
      width: 100%;
      border: 1px solid #dbdbdb;
      margin-top: 20px;
    }

    .invoice-print-copy .invoice-tax-info tr {
      font-weight: 600;
      width: 32%;
    }

    .invoice-print-copy .invoice-tax-info tr td {
      padding: 8px 5px;
    }

    .invoice-print-copy .invoice-tax-info tr:first-child {
      border-bottom: 1px solid #dbdbdb;
    }

    .invoice-print-copy .invoice-tax-info td:first-child {
      text-align: left;
    }

    .invoice-print-copy .invoice-tax-info td:last-child {
      text-align: right;
      padding-right: 10px;
    }

    .invoice-print-copy .invoice-tax-info td:nth-child(2) {
      text-align: center;
    }

    .invoice-print-copy .invoice-tax-info .invoice-tax-info-primary {
      color: #c1a36f;
      padding-left: 10px;
      padding-right: 7px;
    }

    .invoice-print-copy .invoice-terms {
      margin-top: 20px;
    }

    .invoice-print-copy .invoice-terms p {
      margin: 0;
      font-size: 10px;
    }

    .invoice-print-copy .invoice-header span {
      margin: 0 80px 10px 20px;
      font-weight: 400;
    }

    .invoice-print-copy .invoice-header td {
      background-color: #fbf7ee;
      color: #c1a36f;
      font-weight: 600;
      border-bottom: 1px solid #dbdbdb;
      padding: 8px 5px !important;
    }

    .invoice-print-copy .invoice-header span:last-child {
      margin-right: 0;
    }

    .invoice-print-copy .invoice-header-logo {
      width: 24%;
      display: inline-block;
    }

    .invoice-print-copy .invoice-header-logo .invoice-logo {
      width: 150px;
      position: absolute;
      top: 2px;
    }

    .invoice-print-copy .invoice-header-info {
      display: inline-block;
      width: 49%;
      text-align: center;
    }

    .invoice-print-copy .invoice-header-info h3 {
      color: #c1a36f;
      margin: 0;
      font-size: 14px;
    }

    .invoice-print-copy .invoice-header-info h4 {
      margin: 0;
      font-size: 12px;
    }

    .invoice-print-copy .invoice-header-number {
      border-left: 2px solid #dbdbdb;
      display: inline-block;
      margin-left: 80px;
      width: 15%;
      text-align: right;
    }

    .invoice-print-copy .invoice-header-number h3 {
      color: #9a8054;
      font-size: 19px;
      margin: 0;
    }

    .invoice-print-copy .invoice-header-number h4 {
      margin: 0;
      font-size: 12px;
    }

    .invoice-print-copy .invoice-details {
      width: 100%;
      margin: 20px 0;
      border: 1px solid #dbdbdb;
      background-color: #fbf7ee;
    }

    .invoice-print-copy .invoice-details .invoice-details-primary {
      display: inline-block;
      width: 48%;
      padding-left: 10px;
      padding-top: 10px;
      border-right: 1px solid #dbdbdb;
      vertical-align: top;
    }

    .invoice-print-copy .invoice-details .invoice-details-secondary {
      display: inline-block;
      width: 48%;
      padding-left: 10px;
      padding-top: 10px;
      vertical-align: top;
    }

    .invoice-print-copy .invoice-details-title-primary {
      font-size: 12px;
      font-weight: 600;
      color: #9a8054;
      width: 50%;
      padding-bottom: 7px;
    }
  </style>
  <div class="invoice-header-logo">
    <img class="logo--small img-responsive invoice-logo" src="/images/dmart-logo.svg" alt="DMart">
  </div>
  <div class="invoice-header-info">
    <h3> Avenue eCommerce Limited </h3>
    <h4 class="invoice-header-address" style="font-weight: normal">
    Ajaneya Co. Op.Hsg Soc. Ltd. Orchard Foundation School, <br>
    Pawai, Mumbai - 400076.
    </h4>
  </div>
  <div class="invoice-header-number">
    <h4>INVOICE NUMBER</h4>
    <h3 style="font-weight: normal">KLD456FG1</h3>
  </div>

  <div class="invoice-details" style="width: 100%">
    <div class="invoice-details-primary">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="font-family: Arial; font-size: 12px" class="invoice-details-title-primary">CUSTOMER NAME</td>
        <td style="font-family: Arial; font-size: 12px">Anup Padmanabha</td>
      </tr>
      <tr>
        <td style="font-family: Arial; font-size: 12px" class="invoice-details-title-primary">MOBILE NUMBER</td>
        <td style="font-family: Arial; font-size: 12px">98763 45546</td>
      </tr>
      <tr>
        <td style="font-family: Arial; font-size: 12px" class="invoice-details-title-primary">ORDER ID</td>
        <td style="font-family: Arial; font-size: 12px">1KLD456FGI</td>
      </tr>
      <tr>
        <td style="font-family: Arial; font-size: 12px" class="invoice-details-title-primary">ORDER PLACED DATE</td>
        <td style="font-family: Arial; font-size: 12px">21 Dec 2015</td>
      </tr>
      <tr>
        <td style="font-family: Arial; font-size: 12px" class="invoice-details-title-primary">MODE OF PAYMENT</td>
        <td style="font-family: Arial; font-size: 12px">Net Banking</td>
      </tr>
      <tr>
        <td style="font-family: Arial; font-size: 12px" class="invoice-details-title-primary">TOTAL ITEMS</td>
        <td style="font-family: Arial; font-size: 12px">20</td>
      </tr>
    </table>
    </div>
    <div class="invoice-details-secondary">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="font-family: Arial; font-size: 12px" class="invoice-details-title-primary">DELIVERY DATE &amp; TIME</td>
          <td style="font-family: Arial; font-size: 12px">1st Jan 2016 at 7:00 PM</td>
        </tr>
        <tr>
          <td style="font-family: Arial; font-size: 12px" class="invoice-details-title-primary">MODE OF DELIVERY</td>
          <td style="font-family: Arial; font-size: 12px">Home Delivery</td>
        </tr>

        <tr>
          <td style="font-family: Arial; font-size: 12px" class="invoice-details-title-primary">DELIVERY ADDRESS</td>
          <td style="font-family: Arial; font-size: 12px">Ajaneya Co. Op.Hsg Soc. Ltd. Orchard Foundation School, Pawai, <br>Mumbai - 400076</td>
        </tr>

      </table>
    </div>
  </div>

  <table cellpadding="0" cellspacing="0" border="0" class="invoice-table" style="border-top: 1px solid #dbdbdb">
    <tr class="invoice-header">
      <td valign="middle" style="font-size: 12px; font-family: Arial; vertical-align: middle" class="invoice-col-tiny">S.NO</td>
      <td valign="middle" style="font-size: 12px; font-family: Arial; vertical-align: middle" class="invoice-col-large">ITEM</td>
      <td valign="middle" style="font-size: 12px; font-family: Arial; vertical-align: middle" class="invoice-col-small">QTY</td>
      <td valign="middle" style="font-size: 12px; font-family: Arial; vertical-align: middle" class="invoice-col-small">PRICE</td>
      <td valign="middle" style="font-size: 12px; font-family: Arial; vertical-align: middle" class="invoice-col-small">NET PRICE</td>
      <td valign="middle" style="font-size: 12px; font-family: Arial; vertical-align: middle" class="invoice-col-small">SAVINGS</td>
    </tr>
    <!-- Start crate-item-1 Block -->
    <tr class="crate-item">
      <td></td>
      <td style="font-family: Arial; font-size: 14px; padding-top: 7px; padding-bottom: 7px">Groceries</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td style="font-family: Arial; font-size: 12px">1</td>
      <td style="font-family: Arial; font-size: 12px">Tidla Basmati Rice(5kg)</td>
      <td style="font-family: Arial; font-size: 12px">1</td>
      <td style="font-family: Arial; font-size: 12px">?250 </td>
      <td style="font-family: Arial; font-size: 12px">?200 </td>
      <td style="font-family: Arial; font-size: 12px">?50</td>
    </tr>
    <tr class="item-last">
      <td style="font-family: Arial; font-size: 12px">2</td>
      <td style="font-family: Arial; font-size: 12px">Ashirawad Atta (1kg)</td>
      <td style="font-family: Arial; font-size: 12px">1</td>
      <td style="font-family: Arial; font-size: 12px">?550 </td>
      <td style="font-family: Arial; font-size: 12px">?500 </td>
      <td style="font-family: Arial; font-size: 12px">?50</td>
    </tr>
    <!-- End crate-item-1 Block -->
    <!-- crate-item-2 Block Start -->
    <tr class="crate-item">
      <td></td>
      <td style="font-family: Arial; font-size: 14px; padding-top: 7px; padding-bottom: 7px">Apparel</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td style="font-family: Arial; font-size: 12px">3</td>
      <td style="font-family: Arial; font-size: 12px">Peter England T-Shirt (Men's Medium)</td>
      <td style="font-family: Arial; font-size: 12px">1</td>
      <td style="font-family: Arial; font-size: 12px">?250</td>
      <td style="font-family: Arial; font-size: 12px">?250</td>
      <td style="font-family: Arial; font-size: 12px">?50</td>
    </tr>
    <tr class="item-last">
      <td style="font-family: Arial; font-size: 12px">4</td>
      <td style="font-family: Arial; font-size: 12px">Peter England T-Shirt (Men's Medium)</td>
      <td style="font-family: Arial; font-size: 12px">1</td>
      <td style="font-family: Arial; font-size: 12px">?550</td>
      <td style="font-family: Arial; font-size: 12px">?500</td>
      <td style="font-family: Arial; font-size: 12px">?50</td>
    </tr>
    <!-- End crate-item-2 Block Start -->
  </table>
  <table class="invoice-total" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td>&nbsp;</td>
      <td style="font-family: Arial; font-size: 12px">Sub Total</td>
      <td style="font-family: Arial; font-size: 12px">?1,600</td>
    </tr>
    <tr class="discount">
      <td>&nbsp;</td>
      <td style="font-family: Arial; font-size: 12px">Discount (-)</td>
      <td style="font-family: Arial; font-size: 12px">?160</td>
    </tr>
    <tr>
      <td>&nbsp;</td>
      <td style="font-family: Arial; font-size: 12px; padding-bottom: 8px">Shipping Charges (+)</td>
      <td style="font-family: Arial; font-size: 12px; padding-bottom: 8px">?100</td>
    </tr>
    </table>
    <table class="invoice-total" border="0" cellpadding="0" cellspacing="0" style="border-top: 1px solid #dbdbdb; margin-top: 10px">
    <tr class="you-pay">
      <td>&nbsp;</td>
      <td style="font-family: Arial; font-size: 12px; padding-top: 8px">You Pay</td>
      <td style="font-family: Arial; font-size: 12px; padding-top: 8px">?1,540</td>
    </tr>
    <tr>
      <td>&nbsp;</td>
      <td style="font-family: Arial; font-size: 12px">Total MRP Value</td>
      <td style="font-family: Arial; font-size: 12px">?2,000</td>
    </tr>
    <tr class="total-saving">
      <td>&nbsp;</td>
      <td style="font-family: Arial; font-size: 12px">Total Savings</td>
      <td style="font-family: Arial; font-size: 12px">?360</td>
    </tr>
    <tr>
      <td>&nbsp;</td>
      <td colspan="2" style="font-family: Arial; font-size: 10px; padding-bottom: 10px; font-weight: 400">VAT of ?1,000 has been included in total amount</td>
    </tr>
  </table>
  <table class="invoice-tax-info">
    <tr>
      <td style="font-family: Arial; font-size: 12px"><span class="invoice-tax-info-primary">FSSAI NO :</span>4567GHIJIL34</td>
      <td style="font-family: Arial; font-size: 12px"><span class="invoice-tax-info-primary">CIN NO :</span> 4567GHIJIL34</td>
      <td style="font-family: Arial; font-size: 12px"><span class="invoice-tax-info-primary">VAT NO :</span> 4567GHIJIL34</td>
    </tr>
    <tr>
      <td style="font-family: Arial; font-size: 12px"><span class="invoice-tax-info-primary">TIN NO :</span> 4567GHIJIL34</td>
      <td style="font-family: Arial; font-size: 12px"><span class="invoice-tax-info-primary">CST NO :</span> 4567GHIJIL34</td>
      <td style="font-family: Arial; font-size: 12px"><span class="invoice-tax-info-primary">SERVICE TAX NO :</span> 4567GHIJIL34</td>
    </tr>
  </table>

  <div class="invoice-terms">
    <p style="font-size: 12px">Customer care number: 180 0484 59484</p>
    <p>For Terms and Conditions as accepted by you while ordering please visit  www.dmartindia.in/terms&conditions</p>
    <p>Detailed invoice will be sent in your registered mail/Available in Your account.</p>
    <p>Above prices are inclusive of all taxes.</p>
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
	


<!-- END ProductDisplay.jsp -->		
</html>