<%--
 =================================================================
  Licensed Materials - Property of IBM

  WebSphere Commerce

  (C) Copyright IBM Corp. 2012, 2014 All Rights Reserved.

  US Government Users Restricted Rights - Use, duplication or
  disclosure restricted by GSA ADP Schedule Contract with
  IBM Corp.
 =================================================================
--%>

<!doctype HTML>

<%-- 
  *****
  * After the customer has provided the necessary information on the Forget Password page, this email will be sent.
  * This email JSP page informs the customer about the newly reset password. 
  * This JSP page is associated with PasswordNotifyView view in the struts-config file.  
  *****
--%>

<%@ include file="../../Common/EnvironmentSetup.jspf" %>
<%@ include file="../../Common/nocache.jspf"%>

<c:set value="${pageContext.request.scheme}://${pageContext.request.serverName}${portUsed}" var="hostPath" />
<c:set value="${jspStoreImgDir}" var="fullJspStoreImgDir" />
<c:if test="${!(fn:contains(fullJspStoreImgDir, '://'))}">
	<c:set value="${hostPath}${jspStoreImgDir}" var="fullJspStoreImgDir" />
</c:if>
<!-- BEGIN PasswordResetNotify.jsp -->
<html xmlns:wairole="http://www.w3.org/2005/01/wai-rdf/GUIRoleTaxonomy#" xmlns:waistate="http://www.w3.org/2005/07/aaa" lang="${shortLocale}" xml:lang="${shortLocale}">
	
	<head>
		<title>
			<fmt:message bundle="${storeText}" key="EMAIL_PAGE_TITLE">
				<fmt:param value="${storeName}"/>
			</fmt:message>
		</title>
	</head>

	<body style="font-size: 12px; font-weight: normal; font-family: Arial,Verdana,Helvetica,sans-serif; margin: 0; padding: 0; background: none repeat scroll 0 0 #EEEEEE; line-height: 1.4em; " role="document">
		<span role="main">
		
		<table style="width: 100%; height: 100%; background-color: #ffffff; padding: 25px 0 50px;" role="presentation">
			
			<tr>
				<td>
					<table style="border-collapse: collapse; border-spacing: 0; margin: 0 auto;" role="presentation">
					
						<tr>
							<td style="margin:0;padding:0;"><img style="vertical-align:bottom" src="${fullJspStoreImgDir}${env_vfileColor}email_template/border_top_left.png" alt="" height="7px" width="7px" /></td>
							<td style="margin:0;padding:0;"><img style="vertical-align:bottom" src="${fullJspStoreImgDir}${env_vfileColor}email_template/border_top_middle.png" alt="" height="7px" width="628px" /></td>
							<td style="margin:0;padding:0;"><img style="vertical-align:bottom" src="${fullJspStoreImgDir}${env_vfileColor}email_template/border_top_right.png" alt="" height="7px" width="7px" /></td>
						</tr>
						<tr>
							<td style="margin: 0; padding: 0; background-image: url('${fullJspStoreImgDir}${env_vfileColor}email_template/border_left.png'); background-repeat: repeat-y; width: 7px;"></td>
								<td style="margin: 0; padding: 0;">
								<table style="border-collapse: collapse; border-spacing: 0;" role="presentation">
									
									<tr>
										<td>
											<table style="border-collapse: collapse; border-spacing: 0; margin: 0 auto; width: 558px; color: #404040; font-size: 12px;" role="presentation">
												<tr>
													<td>
														Hello ${WCParam.firstName} ${WCParam.lastName},
													</td>
												</tr>
												<tr></tr>
												<tr>
												<td>
												Please click the below link to verify the Email ID for your DMart account
												</td>
												</tr>
												<tr></tr>
												<tr>
												<td>
												Verification Link 
												<a id="resetUrl">${WCParam.pwdResetURL}${WCParam.logonPassword}</a>	</td>
												</tr>
												<tr></tr>
												<tr></tr>
												<tr><td>Thanks,</td>	
												</tr>
												<tr>
												<td>Team DMart
													Daily Discounts Savings Daily!</td>
												</tr>
												
											</table>
										</td>
									</tr>
									

								</table>
							</td>
						
						</tr>
						
						<tr>
							<td style="margin:0;padding:0;"><img style="vertical-align:top" src="${fullJspStoreImgDir}${env_vfileColor}email_template/border_bottom_left.png" alt="BottomLeft" height="7px" width="7px" /></td>
							<td style="margin:0;padding:0;"><img style="vertical-align:top" src="${fullJspStoreImgDir}${env_vfileColor}email_template/border_bottom_middle.png" alt="BottomMiddle" height="7px" width="628px" /></td>
							<td style="margin:0;padding:0;"><img style="vertical-align:top" src="${fullJspStoreImgDir}${env_vfileColor}email_template/border_bottom_right.png" alt="BottomRight" height="7px" width="7px" /></td>
						</tr>

					</table>
				</td>
			</tr>
			<tr>
				<td>
					<table style="border-collapse: collapse; border-spacing: 0; text-align: center; font-size: 9px; color: gray; padding: 25px 0 0; margin: 0 auto; width: 628px;" role="presentation">
						<tr>
							<td>
								<!-- Include email footer -->
								<%@ include file="../Common/Footer.jspf"%>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
		</span>
	</body>
</html>