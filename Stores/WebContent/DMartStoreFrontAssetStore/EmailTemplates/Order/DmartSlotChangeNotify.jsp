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
											<fmt:message bundle="${emailText}" key="SALUTATION_TEXT"/> ${fn:escapeXml(WCParam.firstName)} ${fn:escapeXml(WCParam.lastName)}
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
											<fmt:message bundle="${emailText}" key="GREETINGS_DMART"/>  
											<br/>
											<br/>
											<%-- There are 3 scenarios for slot change --%>
											<c:if test="${fn:escapeXml(WCParam.isExpiredSlotModified) == 'false'&& fn:escapeXml(WCParam.isSystemModified) == 'false'}" >
												<fmt:message bundle="${emailText}" key="SLOTCHANGE_TEXT_1"  >												
													<fmt:param>${fn:escapeXml(orderId)}</fmt:param>
												</fmt:message><br/><br/>	
											</c:if>
											<c:if test="${fn:escapeXml(WCParam.isExpiredSlotModified) == 'true'&& fn:escapeXml(WCParam.isSystemModified) == 'false'}" >
												<c:set var="displayCustomerCareText" value="Y" scope="request"/>
												<fmt:message bundle="${emailText}" key="SLOTCHANGE_TEXT_EXPIREDSLOT_1"  >												
													<fmt:param>${fn:escapeXml(orderId)}</fmt:param>
												</fmt:message><br/><br/>
											</c:if>
											<%-- The below is the case when automated slot change happens need a new content for the email. --%>
											<c:if test="${fn:escapeXml(WCParam.isExpiredSlotModified) == 'false'&& fn:escapeXml(WCParam.isSystemModified) == 'true'}" >
												<c:set var="displayCustomerCareText" value="Y" scope="request"/>
												<fmt:message bundle="${emailText}" key="SLOTCHANGE_TEXT_EXPIREDSLOT_1"  >												
													<fmt:param>${fn:escapeXml(orderId)}</fmt:param>
												</fmt:message><br/><br/>
											</c:if>
											<%-- There are 3 scenarios for slot change --%>
											
											<c:choose>
												<c:when test="${fn:escapeXml(WCParam.shipMode) == 'Home Delivery'}">
													<fmt:message bundle="${emailText}" key="SLOTCHANGE_TEXT_2_HD"  >												
														<fmt:param>${WCParam.newSlot}</fmt:param>
														<fmt:param>${WCParam.oldSlot}</fmt:param>
													</fmt:message><br/><br/>
												</c:when>
												<c:otherwise>
													<fmt:message bundle="${emailText}" key="SLOTCHANGE_TEXT_2_PUP_CHOSEN"  >												
														<fmt:param>${WCParam.newSlot}</fmt:param>
														<fmt:param>${WCParam.oldSlot}</fmt:param>
													</fmt:message><br/><br/>	
													<fmt:message bundle="${emailText}" key="SLOTCHANGE_TEXT_2_PUP_CHOSEN_1"  >												
													</fmt:message><br/><br/>
													<c:out value="${address}" escapeXml="false"/>	
													<br/>								
												</c:otherwise>
											</c:choose>

											<c:if test="${displayCustomerCareText eq 'Y'}" >
												<fmt:message bundle="${emailText}" key="SLOTCHANGE_TEXT_3"  >
													<fmt:param>${fn:escapeXml(CustomerCareNumber)}</fmt:param>
													<fmt:param>${fn:escapeXml(CustomerCareEmail)}</fmt:param>
												</fmt:message><br/><br/>
											</c:if>
										</td>
								</tr>
							</table></td>
					</tr>
				</table>

				<c:set var="displaySystemGeneratedText" value="N" scope="page"/>
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