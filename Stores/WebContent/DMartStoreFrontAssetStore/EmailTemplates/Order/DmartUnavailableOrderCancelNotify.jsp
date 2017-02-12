<?xml version="1.0" encoding="ISO-8859-1" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ include file="../../Common/EnvironmentSetup.jspf"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<fmt:setBundle basename="/${sdb.jspStoreDir}/emailtext_v2" var="emailText" scope="request"/>
<title><fmt:message bundle="${emailText}" key="EMAIL_TITLE_TEXT"/></title>

<!-- Include imports -->
<%@ include file="../Common/EmailImports.jspf"%>

</head>
<wcf:rest var="order" url="store/{storeId}/order/{orderId}" scope="request">
	<wcf:var name="storeId" value="${WCParam.storeId}" />
	<wcf:var name="orderId" value="${WCParam.orderId}"/>
	<wcf:param name="responseFormat" value="json" />
</wcf:rest>
<fmt:parseNumber var="shippingCharge" integerOnly="false" type="number" value="${order.totalShippingCharge}" />
<fmt:parseNumber var="discountTemp" integerOnly="false" type="number" value="${order.totalAdjustment}" />
<c:set var="discount" value="${discountTemp < 0 ? -discountTemp:discountTemp}" />
<fmt:parseNumber var="grandTotal" integerOnly="false" type="number" value="${order.grandTotal}" />
<fmt:parseNumber var="totalProductPrice" integerOnly="false" type="number" value="${order.totalProductPrice}" />
<fmt:parseNumber var="totalAdjustment" integerOnly="false" type="number" value="${order.totalAdjustment}" />
<c:set var="displaySystemGeneratedText" value="N" scope="page"/>

<wcf:rest var="memberDetails" url="store/{storeId}/person/{memberId}" scope="request">
	<wcf:var name="storeId" value="${WCParam.storeId}" encode="true"/>
	<wcf:var name="memberId" value="${WCParam.memberId}" encode="true"/>
	<wcf:param name="profileName" value="IBM_User_Registration_Details"/>
</wcf:rest>
<c:set var="shipModeCode" value="" scope="page"/>
<c:set var="subTotal"  value="${totalProductPrice+totalAdjustment}" />
<c:choose>
	<c:when test="${fn:length(order.orderItem) <1}">
		<c:set var="shipmentTypeId" value="2" scope="request"/>
	</c:when>
	<c:otherwise>
		<c:remove var="blockMap"/>
		<jsp:useBean id="blockMap" class="java.util.HashMap" scope="request"/>
		<jsp:useBean id="productMap" class="java.util.HashMap" scope="request"/>
		<c:forEach var="orderItem" items="${order.orderItem}" varStatus="status">
			<c:set var="prodId" value="${orderItem.productId}" />
			<c:set var="itemId" value="${orderItem.orderItemId}"/>
			<c:set var="shipModeCode" value="${orderItem.shipModeCode}" scope="page"/>
			<c:set var="addressId" value="${orderItem.addressId}"/>
			<c:set var="shipModeId" value="${orderItem.shipModeId}"/>
			<c:set var="keyVar" value="${addressId}_${shipModeId}"/>
			<c:set var="itemIds" value="${blockMap[keyVar]}"/>
			<c:set var="prodIds" value="${productMap[itemId]}"/>
			<c:choose>
				<c:when test="${empty itemIds}">
					<c:set target="${blockMap}" property="${keyVar}" value="${itemId}"/>
					<c:set target="${productMap}" property="${itemId}" value="${prodId}"/>
				</c:when>
				<c:otherwise>
					<c:set target="${blockMap}" property="${keyVar}" value="${itemIds},${itemId}"/>
					<c:set target="${productMap}" property="${itemId}" value="${prodIds},${prodId}"/>
				</c:otherwise>
			</c:choose>
		</c:forEach>
	</c:otherwise>
</c:choose>
<body bgcolor="#f1f1f1" topmargin="0" leftmargin="0" marginheight="0"
	marginwidth="0">

	<table cellpadding="0" cellspacing="0" border="0" width="100%"
		style="margin-top: 10px">
		<tr>
			<td>&nbsp;</td>
			<td>
				<table cellpadding="0" cellspacing="0" border="0" width="100%">
					<tr>
						<td width="600px" align="center" valign="middle">
							<p
								style="font-family: Calibri, Arial, sans-serif; font-size: 30px; color: #b3b3b3; padding: 0; margin: 15px 0">
								<fmt:message bundle="${emailText}" key="TOP_TAGLINE_TEXT"/></p></td>
					</tr>
				</table></td>
			<td>&nbsp;</td>
		</tr>
	</table>

	<table cellpadding="0" cellspacing="0" border="0" width="100%"
		style="margin-top: 10px">
		<tr>
			<td>&nbsp;</td>
			<td width="600px" align="center" bgcolor="#ffffff"
				style="padding: 20px">
				<!-- HEADER -->
				<table width="100%" cellpadding="0" cellspacing="0" border="0">
					<tr>
						<td width="600px" align="center">
							<table width="100%" cellpadding="0" cellspacing="0" border="0"
								style="margin: 10px 0">
								<tr>
									<td align="left" valign="bottom">
										<h3
											style="font-family: Calibri, Arial, sans-serif; font-size: 20px; font-weight: normal; padding: 0; margin: 0">
											<fmt:message bundle="${emailText}" key="SALUTATION_TEXT"/> ${WCParam.firstName} ${WCParam.lastName},  
										</h3>
									</td>
									<td align="right"><a href="${DMartHomePage}"> <img
											src="${dmartLogoImage}"
											width="150px">
									</a>
									</td>
								</tr>
							</table></td>
					</tr>
				</table> <!-- /HEADER -->

				<table width="100%" cellpadding="0" cellspacing="0" border="0">
					<tr>
						<td width="600px">
							<table width="100%" cellpadding="0" cellspacing="0" border="0">
								<tr>
									<td>
										<p
											style="font-family: Arial, sans-serif; font-size: 14px; font-weight: normal; padding: 0; margin: 30px 0 30px">
											<fmt:message bundle="${emailText}" key="GREETINGS_DMART_TEXT"/>  
											<br/>
											<br/>
											<fmt:message bundle="${emailText}" key="UNAVAILABLE_ORD_CANCELLED_EMAIL_TEXT_1" >
												<fmt:param>${orderId}</fmt:param>
											</fmt:message>
											<br/>
											<br/>
											<c:choose>
												<c:when test="${paymentMode != 'COD'}">
													<fmt:message bundle="${emailText}" key="UNAVAILABLE_ORD_CANCELLED_EMAIL_TEXT_1_1">
														<!-- payment mode -->
														<fmt:param>${refundAmount}</fmt:param>
														<fmt:param>${paymentMode}</fmt:param>
													</fmt:message>
													<br/>
													<br/>
												</c:when>
											</c:choose>
											<fmt:message bundle="${emailText}" key="UNAVAILABLE_ORD_CANCELLED_EMAIL_TEXT_2" />
											<br/>
											<br/>
											<c:choose>
												<c:when test="${paymentMode == 'COD'}">
													<br/>
													<br/>
													<fmt:message bundle="${emailText}" key="UNAVAILABLE_ORD_CANCELLED_EMAIL_TEXT_3_1" />
													<br/>
													<br/>
													<fmt:message bundle="${emailText}" key="UNAVAILABLE_ORD_CANCELLED_EMAIL_TEXT_5" />
												</c:when>
												<c:otherwise>
													<br/>
													<br/>
													<fmt:message bundle="${emailText}" key="UNAVAILABLE_ORD_CANCELLED_EMAIL_TEXT_3" />
												</c:otherwise>
											</c:choose>
											<br/>
											<br/>
									</td>
								</tr>
							</table></td>
					</tr>
				</table>
				
				<!-- Include EmailReachUs.jspf -->
				<%@ include file="../Common/EmailReachUs.jspf"%>
				
				</td>
			<td>&nbsp;</td>
		</tr>
	</table>

	<!-- Include EmailFooter.jspf -->
	<%@ include file="../Common/EmailFooter.jspf"%>
	
</body>
</html>