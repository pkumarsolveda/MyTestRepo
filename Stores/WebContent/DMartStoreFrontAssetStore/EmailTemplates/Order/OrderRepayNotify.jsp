<?xml version="1.0" encoding="ISO-8859-1" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 

<%@ include file="../../Common/EnvironmentSetup.jspf"%>
<fmt:setBundle basename="/${sdb.jspStoreDir}/emailtext_v2" var="emailText" scope="request"/>
<title><fmt:message bundle="${emailText}" key="EMAIL_TITLE_TEXT"/></title>

<c:set var="policyUrl"	value="${env_TopCategoriesDisplayURL}/dmart-privacy-policy" />

<%
StoreConfigurationRegistry scfRegistry = (StoreConfigurationRegistry) RegistryManager.singleton().getRegistry("StoreConfigurationRegistry");
String DMartHomePage = scfRegistry.getSingleton().getValue(0, "DMart.Home.Page.URL");
String FacebookPage = scfRegistry.getSingleton().getValue(0, "DMart.FacebookPage.URL");
String GooglePlusPage = scfRegistry.getSingleton().getValue(0, "DMart.GooglePlus.URL");
String AndroidAppStorePage = scfRegistry.getSingleton().getValue(0, "DMart.AppStoreAndroid.URL");
String AppleStorePage = scfRegistry.getSingleton().getValue(0, "DMart.AppStoreiOS.URL");
String DMartPunchLine = scfRegistry.getSingleton().getValue(0, "DMartPunchLine");
pageContext.setAttribute("DMartHomePage",		DMartHomePage);
pageContext.setAttribute("FacebookPage", 		FacebookPage);
pageContext.setAttribute("GooglePlusPage", 		GooglePlusPage);
pageContext.setAttribute("AndroidAppStorePage", AndroidAppStorePage);
pageContext.setAttribute("AppleStorePage", 		AppleStorePage);
pageContext.setAttribute("DMartPunchLine",		DMartPunchLine);
%>

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
								style="font-family: Calibri, Arial, sans-serif; font-size: 13px; color: #282828; padding: 0; margin: 0">
								Can't see this Email? View it in your <a href="#"
									style="color: #287345">Browser </a>
							</p>
						</td>
					</tr>
					<tr>
						<td width="600px" align="center" valign="middle">
							<p
								style="font-family: Calibri, Arial, sans-serif; font-size: 30px; color: #b3b3b3; padding: 0; margin: 15px 0">
								<fmt:message bundle="${emailText}" key="TOP_TAGLINE_TEXT"/>
							</p>
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
											style="font-family: Calibri, Arial, sans-serif; font-size: 20px; font-weight: normal; padding: 0; margin: 0">
											<fmt:message bundle="${emailText}" key="SALUTATION_TEXT"/> ${name}
										</h3>
									</td>
									<td align="right"><a href="${DMartHomePage}"> <img
											src="DMartStoreFrontAssetStore/images/dmart-logo.png"
											width="150px"></a>
									</td>
								</tr>
							</table>
						</td>
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
											<fmt:message bundle="${emailText}" key="GREETINGS_TEXT"/>  <br/> <br/>
											<fmt:message bundle="${emailText}" key="PAYMENT_LINK_TEXT"  >												
												<fmt:param>${orderId}</fmt:param>
											</fmt:message>											
											<br/><br/>
											${repayLink}
											<br/> <br/>
											<fmt:message bundle="${emailText}" key="PAYMENT_ACTIVETIME_TEXT"  >												
												<fmt:param>${repayTime}</fmt:param>
												<fmt:param>${repayTime}</fmt:param>
											</fmt:message>											
											<br/><br/>
											<fmt:message bundle="${emailText}" key="HAPPY_SHOPPING_TEXT"/>
										</p>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>


				<table width="100%" cellpadding="0" cellspacing="0" border="0">
					<tr>
						<td width="600px">
							<table width="100%" cellpadding="0" cellspacing="0" border="0"
								style="margin-bottom: 10px">
								<tr>
									<td>
		
										<p
											style="font-family: Arial, sans-serif; font-size: 14px; font-weight: normal; margin: 0; padding: 0; text-align: left">
											<fmt:message bundle="${emailText}" key="THANKYOU_TEXT"/>  <br/> <br/>
											<fmt:message bundle="${emailText}" key="FROM_TEXT"/> <br/> <br/>
											<fmt:message bundle="${emailText}" key="BOTTOM_TAGLINE_1"/> <br/>
											<I></><fmt:message bundle="${emailText}" key="BOTTOM_TAGLINE_2"/></I> 
										</p>
									</td>
								</tr>
							</table></td>
					</tr>
				</table></td>
			<td>&nbsp;</td>
		</tr>
	</table>

	<table cellpadding="0" cellspacing="0" border="0" width="100%">
		<tr>
			<td>&nbsp;</td>
			<td width="600px" align="center" valign="top" bgcolor="#ffffff"
				style="padding: 20px; padding-bottom: 10px; border-bottom: 1px dashed #cccccc">

				<table width="100%" cellpadding="0" cellspacing="0" border="0">
					<tr>
						<td width="100%" align="top">
							<table width="100%" cellpadding="0" cellspacing="0" border="0">
								<tr>
									<td width="30%" valign="middle">
										<table width="100%" cellpadding="0" cellspacing="0" border="0">
											<tr>
												<td width="50%">
													<h5
														style="font-family: Arial, sans-serif; font-size: 14px; font-weight: normal; margin: 0; padding: 0"><fmt:message bundle="${emailText}" key="SOCIAL_TEXT"/></h5>
												</td>
												<td><a href="${FacebookPage}"
													style="text-decoration: none"> <img
														src="DMartStoreFrontAssetStore/images/temp/email/facebook.png">
													</a> <a href="${GooglePlusPage}" style="text-decoration: none"> <img
														src="DMartStoreFrontAssetStore/images/temp/email/google.png">
													</a>
												</td>
											</tr>
										</table>
									</td>
									<td width="50%" colspan="2" valign="middle" align="right">
										<table width="100%" cellpadding="0" cellspacing="0" border="0">
											<tr>
												<td align="right">
													<h3
														style="font-family: Arial, sans-serif; font-size: 14px; font-weight: normal; margin: 0; padding: 0">
														<fmt:message bundle="${emailText}" key="APP_TEXT"/></h3>
												</td>
												<td align="right"><a href="${AndroidAppStorePage}"
													title="Download for Android"> <img
														src="DMartStoreFrontAssetStore/images/temp/email/android-app.jpg"
														width="95px" height="31px">
														</a>
												</td>
												<td align="right" width="27%"><a href="${AppleStorePage}"
													title="Download for IOS"> <img
														src="DMartStoreFrontAssetStore/images/temp/email/ios-app.jpg"
														width="95px" height="31px">
														</a>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</td>
			<td>&nbsp;</td>
		</tr>
	</table>


	<table cellpadding="0" cellspacing="0" border="0" width="100%"
		style="margin-bottom: 30px">
		<tr>
			<td>&nbsp;</td>
			<td width="600px" align="center" valign="top" bgcolor="#ffffff"
				style="padding: 20px; padding-top: 0">
				<table cellpadding="0" width="100%" cellspacing="0" border="0">
					<tr>
						<td valign="top" align="left">
							<p
								style="font-family: Arial, sans-serif; font-size: 12px; margin: 10px 0 0; font-weight: normal; text-align: left">
								<fmt:message bundle="${emailText}" key="COPYRIGHT_TEXT"/>
							</p>
						</td>
						<td valign="top" align="right">
							<p style="margin: 10px 0 0">
								<a
									style="font-family: Arial, sans-serif; font-size: 12px; color: #287345; font-weight: normal; margin: 0; padding: 0; text-decoration: none"
									href="javascript:;" title="Terms and Conditions"><fmt:message bundle="${emailText}" key="TC_TEXT"/></a> | <a
									style="font-family: Arial, sans-serif; font-size: 12px; color: #287345; font-weight: normal; margin: 0; padding: 0; text-decoration: none"
									href="${policyUrl}" title="Privacy Policy"><fmt:message bundle="${emailText}" key="PRIVACY_TEXT"/></a> |
								<a
									style="font-family: Arial, sans-serif; font-size: 12px; color: #287345; font-weight: normal; margin: 0; padding: 0; text-decoration: none"
									href="javascript:;" title="Unsubscribe"><unsubscribe><fmt:message bundle="${emailText}" key="UNSUBSCRIBE_TEXT"/></unsubscribe>
								</a>
							</p>
						</td>
					</tr>
				</table>
			</td>
			<td>&nbsp;</td>
		</tr>
	</table>
	
</body>
</html>