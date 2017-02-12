<?xml version="1.0" encoding="ISO-8859-1" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%@ include file="../../Common/EnvironmentSetup.jspf"%>
<title><fmt:message bundle="${storeText}"
		key="EMAIL_SHARE_CART_TITLE"></fmt:message>
</title>

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
                                                <fmt:message bundle="${storeText}"key="EMAIL_DAILY_DISC"></fmt:message></p>
                                    </td>
                              </tr>
                        </table>
                  </td>
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
											style="font-family: Calibri, Arial, sans-serif; font-size: 20px; font-weight: normal; padding: 0; margin: 0"><fmt:message bundle="${storeText}"
												key="EMAIL_SHARE_CART_HI">
												</fmt:message>
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
											<fmt:message bundle="${storeText}"
												key="GREETINGS_FROM_DMART"></fmt:message> <br/> <br/>
												
											<fmt:message bundle="${storeText}"
												key="EMAIL_SHARE_CART_MESSAGE_1">
											</fmt:message> <br/> <br/> 
											
											<fmt:message bundle="${storeText}"key="EMAIL_SHARE_CART_MESSAGE_2"> 
													<fmt:param><a href="<c:out value="${cartLink}" escapeXml="true"/>"><fmt:message bundle="${storeText}"key="CLICK_HERE"></fmt:message></a></fmt:param>
											</fmt:message> <br/> <br/> 
											
											<fmt:message bundle="${storeText}"key="EMAIL_SHARE_CART_MESSAGE_3">
												<fmt:param>${fn:escapeXml(CustomerCareNumber)}</fmt:param>
												<fmt:param><span style="text-decoration: underline; font-weight: normal;">${fn:escapeXml(CustomerCareEmail)}</span></fmt:param>
											</fmt:message>
											</p>
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