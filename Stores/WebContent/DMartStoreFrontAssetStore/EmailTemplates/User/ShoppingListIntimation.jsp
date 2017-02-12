<?xml version="1.0" encoding="ISO-8859-1" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>

<title>Welcome to DMart</title>
<%@ include file="../../Common/EnvironmentSetup.jspf"%>

<!-- Include imports -->
<%@ include file="../Common/EmailImports.jspf"%>

</head>

<%-- 
<wcf:rest var="list" url="store/${WCParam.storeIdOrder}/wishlist/${WCParam.listId}" scope="request">
	<wcf:var name="storeId" value="${WCParam.storeIdOrder}" />
	<wcf:var name="listId" value="${WCParam.listId}"/>
	
</wcf:rest>
--%>


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
											style="font-family: Calibri, Arial, sans-serif; font-size: 20px; font-weight: normal; padding: 0; margin: 0">
											<fmt:message bundle="${storeText}" key="EMAIL_LIST_INTIMATION_HELLO">
												<fmt:param>${fn:escapeXml(name)}</fmt:param>
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
												key="GREETINGS_FROM_DMART"></fmt:message>  <br/> <br/>
											<fmt:message bundle="${storeText}"
												key="EMAIL_LIST_INTIMATION_MESSAGE_1">
													<fmt:param>${fn:escapeXml(listName)}</fmt:param>
													<fmt:param>${fn:escapeXml(date)}</fmt:param>
												</fmt:message><br/> <br/> 
												
												<%--
											<fmt:message bundle="${storeText}"key="EMAIL_LIST_INTIMATION_MESSAGE_2">
											</fmt:message>
											<br/> <br/>
											<table width="100%" cellpadding="0" cellspacing="0" border="0">
						                    
						                    <tr>
											 <td style="text-align: left; padding-top:20px; font-family: Arial, sans-serif; font-size: 14px">
						                        <strong>Item(s) Name</strong>
						                      </td>
						                      <td style="text-align: center; padding-top:20px; font-family: Arial, sans-serif; font-size: 14px">
						                        <strong>Quantity</strong>
						                      </td>
						                      <td style="text-align: right; padding-top:20px; font-family: Arial, sans-serif; font-size: 14px">
						                        <strong>DMart Price</strong>
						                      </td>
						                      <td style="text-align: right; padding-top:20px; font-family: Arial, sans-serif; font-size: 14px">
						                        <strong>Savings</strong>
						                      </td>
											   
						                    </tr>
						                     
						                    <c:forEach var="listItem" items="${list.GiftList[0].item}" varStatus="status">
						                    	<wcf:rest var="catEntry" url="${searchHostNamePath}${searchContextPath}/store/${WCParam.storeIdOrder}/productview/byIds" >
													<wcf:param name="langId" value="${langId }" />
													<wcf:param name="id" value="${listItem.productId}" />
													<wcf:param name="currency" value="${env_currencyCode}" />
													<wcf:param name="storeId" value="${WCParam.storeIdOrder}" />	
													<wcf:param name="profileName" value="X_findProductByIds_Details_DMART" />									
												</wcf:rest>
										        <wcf:rest var="price" url="${searchHostNamePath}${searchContextPath}/store/${WCParam.storeIdOrder}/productview/byIds" >
													<wcf:param name="langId" value="${langId }" />
													<wcf:param name="id" value="${listItem.productId}" />
													<wcf:param name="currency" value="${env_currencyCode}" />
													<wcf:param name="storeId" value="${WCParam.storeIdOrder}" />	
													<wcf:param name="profileName" value="X_findProductPrices_DMART" />									
												</wcf:rest>
												
						                   		
						                   		<c:set var="salePriceVariableName" value="price_SALE_${WCParam.storeIdOrder}" scope="page"/>
						                   		<c:set var="mrpPriceVariableName" value="price_MRP_${WCParam.storeIdOrder}" scope="page"/>
						                   		<c:forEach var="entryPrice" items="${price.DocumentList[0]}" varStatus="status">        
												      <c:if test="${entryPrice.key == salePriceVariableName}">
												      	<c:set var="salePriceValue" value="${entryPrice.value}" scope="page"/>
												      </c:if>
												      <c:if test="${entryPrice.key == mrpPriceVariableName}">
												      	<c:set var="mrpPriceValue" value="${entryPrice.value}" scope="page"/>
												      </c:if>
												      
												</c:forEach>
						                   		<c:set var="savings" value="${mrpPriceValue - salePriceValue}" />
						                   		
							                    <tr>
							                      <td style="text-align: left; padding-top:20px; font-family: Arial, sans-serif; font-size: 14px">
							                        ${catEntry.catalogEntryView[0].name}
							                      </td>
							                      <td style="text-align: center; padding-top:20px; font-family: Arial, sans-serif; font-size: 14px">
							                        ${listItem.quantityRequested}
							                      </td>
							                      <td style="text-align: right; padding-top:20px; font-family: Arial, sans-serif; font-size: 14px">
							                        Rs. ${salePriceValue * listItem.quantityRequested}
							                      </td>
							                      <td style="text-align: right; padding-top:20px; font-family: Arial, sans-serif; font-size: 14px">
							                        Rs. <fmt:formatNumber type="number" maxIntegerDigits="3" value="${savings * listItem.quantityRequested}" />
							                      </td>
							                    </tr> 
						                    </c:forEach>
						                    
						                    <tr>
						                      <td>&nbsp;</td>
						                    </tr>
						                  </table>
						                  
										<br/><br/>
										 --%>
										 
										<fmt:message bundle="${storeText}"key="EMAIL_LIST_INTIMATION_MESSAGE_3">
										<fmt:param>
											<a href="<c:out value="${cartLink}" escapeXml="true"/>">
												<fmt:message bundle="${storeText}"key="EMAIL_HERE"></fmt:message>
											</a>
										</fmt:param>
										</fmt:message><br/><br/>

											<fmt:message bundle="${storeText}"key="EMAIL_LIST_INTIMATION_MESSAGE_4">
												<fmt:param>${fn:escapeXml(CustomerCareNumber)}</fmt:param>
												<fmt:param>${fn:escapeXml(CustomerCareEmail)}</fmt:param>
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