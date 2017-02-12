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
											<fmt:message bundle="${emailText}" key="FULLREJECT_ATDOOR_EMAIL_TEXT_1">
													<fmt:param>${orderId}</fmt:param>
											</fmt:message>
																				
											<%-- <c:choose> --%>
												<c:if test="${paymentMethod != 'COD'}">
													<br/><br/>	
													<fmt:message bundle="${emailText}" key="FULLREJECT_ATDOOR_EMAIL_TEXT_2">
														<fmt:param>${paymentMethod}</fmt:param>
													</fmt:message>
												</c:if>
											<%-- </c:choose> --%>
											<br/><br/>											
											<fmt:message bundle="${emailText}" key="FULLREJECT_ATDOOR_EMAIL_TEXT_3" />
											<br/>
											<fmt:message bundle="${emailText}" key="FULLREJECT_ATDOOR_EMAIL_TEXT_4" />
											<br/><br/>
											<fmt:message bundle="${emailText}" key="FULLREJECT_ATDOOR_EMAIL_TEXT_5" >
												<fmt:param>${contactUs}</fmt:param>
												<fmt:param>${contactUsEmail}</fmt:param>
											</fmt:message>
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