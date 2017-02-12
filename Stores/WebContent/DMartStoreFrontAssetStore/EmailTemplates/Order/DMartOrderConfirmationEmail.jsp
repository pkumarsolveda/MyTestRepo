<?xml version="1.0" encoding="ISO-8859-1" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page import="org.apache.commons.json.JSONObject"%>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<%@ include file="../../Common/EnvironmentSetup.jspf"%>

<title><fmt:message bundle="${storeText}"
		key="EMAIL_ORDERCON_TITLE"></fmt:message>
</title>

<wcf:rest var="order" url="/store/{storeId}/order/{orderId}"
	scope="request">
	<wcf:var name="storeId" value="${storeId}" encode="true" />
	<wcf:var name="orderId" value="${orderId}" encode="true" />
</wcf:rest>

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
								<fmt:message bundle="${storeText}" key="EMAIL_DAILY_DISC"></fmt:message>
							</p></td>
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
											style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 16px; font-weight: bold; padding: 0; margin: 0">
<!-- 	<fmt:message bundle="${storeText}" key="EMAIL_ORDERCON_MESSAGE_HEAD"></fmt:message>  -->
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
				<fmt:formatNumber var="orderTotal"
					value="${order.grandTotal}" type="currency"
					maxFractionDigits="${env_currencyDecimal}"
					currencySymbol="${env_CurrencySymbolToFormat}. " />
				<c:set var="payMethod" scope="page"	value="${order.paymentInstruction[0].payMethodId}" />
		<c:choose>
 			<c:when test="${order.x_deliveryMode == 'Home Delivery'}">
				<table width="100%" cellpadding="0" cellspacing="0" border="0">
					<tr>
						<td width="600px">
							<table width="100%" cellpadding="0" cellspacing="0" border="0">
								<tr>
									<td>
										<h3
											style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 16px; font-weight: normal; padding: 0; margin: 30px 0 10px">
											<fmt:message bundle="${storeText}" key="EMAIL_ORDERCON_SAL">
												<fmt:param>${firstName}</fmt:param>
											</fmt:message>
										</h3>
										<p
											style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px; font-weight: normal; padding: 0; margin: 10px 0 20px">
											<fmt:message bundle="${emailText}"
												key="GREETINGS_DMART"></fmt:message>
											<br /> <br />
											<fmt:message bundle="${storeText}" key="EMAIL_ORDERCON_MESSAGE1">
												<fmt:param>${orderId}</fmt:param>
											</fmt:message>
											<br /> <br />
											<fmt:message bundle="${storeText}" key="EMAIL_ORDERCON_MESSAGE2_HD">
												<fmt:param>${order.x_slotDate}</fmt:param>
												<fmt:param>${order.x_slotStartTime}</fmt:param>
												<fmt:param>${order.x_slotEndTime}</fmt:param>
											</fmt:message>
											<br /> <br />
											
											<c:choose>
												<c:when test="${payMethod eq 'COD'}">
													<c:if test="${codRoundedTotal eq ''}">
														<c:set var="totalToDisplay" value="${orderTotal}" />
													</c:if>
													<c:if test="${codRoundedTotal ne ''}">
														<fmt:formatNumber var="totalToDisplay"
																value="${codRoundedTotal}" type="currency"
																maxFractionDigits="${env_currencyDecimal}"
																currencySymbol="${env_CurrencySymbolToFormat}. " />
													</c:if>
													<fmt:message bundle="${storeText}" key="EMAIL_ORDERCON_MESSAGE3_POSTPAID_HD">
														<fmt:param>${totalToDisplay}</fmt:param>
													</fmt:message>
												</c:when>
												<c:otherwise>
													<fmt:message bundle="${storeText}" key="EMAIL_ORDERCON_MESSAGE3_PREPAID">
														<fmt:param>${orderTotal}</fmt:param>
													</fmt:message>
												</c:otherwise>
											</c:choose>
											
										</p>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</c:when>
			<c:otherwise>			
				<table width="100%" cellpadding="0" cellspacing="0" border="0">
					<tr>
						<td width="600px">
							<table width="100%" cellpadding="0" cellspacing="0" border="0">
								<tr>
									<td>
										<h3
											style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 16px; font-weight: normal; padding: 0; margin: 30px 0 10px">
											<fmt:message bundle="${storeText}" key="EMAIL_ORDERCON_SAL">
												<fmt:param>${firstName}</fmt:param>
											</fmt:message>
										</h3>
										<p
											style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px; font-weight: normal; padding: 0; margin: 10px 0 20px">
											<fmt:message bundle="${emailText}"
												key="GREETINGS_DMART"></fmt:message>
											<br /> <br />
											<fmt:message bundle="${storeText}" key="EMAIL_ORDERCON_MESSAGE1">
												<fmt:param>${orderId}</fmt:param>
											</fmt:message>
											<br /> <br />
											<fmt:message bundle="${storeText}" key="EMAIL_ORDERCON_MESSAGE2_PUP">
												<fmt:param>${order.x_slotDate}</fmt:param>
												<fmt:param>${order.x_slotStartTime}</fmt:param>
												<fmt:param>${order.x_slotEndTime}</fmt:param>
											</fmt:message>
											<U><fmt:message bundle="${storeText}" key="EMAIL_ORDERCON_MESSAGE2_PUP_ONTIME"></fmt:message></U>
											<br /> <br />
											<c:choose>
												<c:when test="${payMethod eq 'COD'}">
													<c:if test="${codRoundedTotal eq ''}">
														<c:set var="totalToDisplay" value="${orderTotal}" />
													</c:if>
													<c:if test="${codRoundedTotal ne ''}">
														<fmt:formatNumber var="totalToDisplay"
																value="${codRoundedTotal}" type="currency"
																maxFractionDigits="${env_currencyDecimal}"
																currencySymbol="${env_CurrencySymbolToFormat}. " />
													</c:if>													
													<fmt:message bundle="${storeText}" key="EMAIL_ORDERCON_MESSAGE3_POSTPAID_PUP">
														<fmt:param>${totalToDisplay}</fmt:param>
													</fmt:message>
												</c:when>
												<c:otherwise>
													<fmt:message bundle="${storeText}" key="EMAIL_ORDERCON_MESSAGE3_PREPAID">
														<fmt:param>${orderTotal}</fmt:param>
													</fmt:message>
												</c:otherwise>
											</c:choose>
											<br/><br/>
											<fmt:message bundle="${storeText}"	key="EMAIL_ORDERCON_MESSAGE4_PUP_PHOTOID">
											</fmt:message><br/><br/>
											
										</p>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</c:otherwise>
		</c:choose>

				<table width="100%" cellpadding="0" cellspacing="0" border="0">
					<tr>
						<td width="600px">
							<table width="100%" cellpadding="0" cellspacing="0" border="0"
								style="margin: 30px 0">
								<tr>
									<td valign="top" width="68%">

										<table width="100%" cellpadding="0" cellspacing="0" border="0">
											<tr>
												<td colspan="6"
													style="font-family: 'Open Sans', 'Calibri', Arial; font-size: 16px; padding-bottom: 10px;"><strong>
														<fmt:message bundle="${storeText}"
															key="EMAIL_ORDERCON_SUMMARY"></fmt:message> </strong>
												</td>
											</tr>
											<tr>
												<td colspan="6"
													style="font-family: 'Open Sans', 'Calibri', Arial; font-size: 12px; padding-bottom: 1px;"><fmt:message
														bundle="${storeText}" key="EMAIL_ORDERCON_SUMMARY_ORDER"></fmt:message>
													${orderId}</td>
											</tr>
											<fmt:parseDate parseLocale="${dateLocale}"
												var="orderDateUfmt" value="${order.placedDate}"
												pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'" timeZone="GMT" />
											<fmt:setTimeZone value="IST" />
											<%-- use value from WC_timeoffset to adjust to browser time zone --%>
											<%-- Format the timezone retrieved from cookie since it is in decimal representation --%>
											<%-- Convert the decimals back to the correct timezone format such as :30 and :45 --%>
											<%-- Only .75 and .5 are converted as currently these are the only timezones with decimals --%>
											<c:set var="formattedTimeZone"
												value="${fn:replace(cookie.WC_timeoffset.value, '%2B', '+')}" />
											<c:set var="formattedTimeZone"
												value="${fn:replace(formattedTimeZone, '.75', ':45')}" />
											<c:set var="formattedTimeZone"
												value="${fn:replace(formattedTimeZone, '.5', ':30')}" />
											<tr>
												<fmt:formatDate var="orderDate" value="${orderDateUfmt}"
													type="date" pattern="dd-MMM-yyyy hh:mm a"
													timeZone="${formattedTimeZone}" dateStyle="long" />
												<td colspan="6"
													style="font-family: ' Open Sans ', ' Calibri ', Arial; font-size: 11px; padding-bottom: 1px;">
													<fmt:message bundle="${storeText}"
														key="EMAIL_ORDERCON_PLACED"></fmt:message> ${orderDate}</td>

											</tr>
											<tr>
												<td colspan="6"
													style="font-family: ' Open Sans ', ' Calibri ', Arial; font-size: 11px; padding-bottom: 10px; border-bottom: 1px solid #dbdbdb"
													colspan="6"><c:forEach var="addr"
														items="${order.orderItem[0].addressLine}"
														varStatus="status">${addr} &nbsp;</c:forEach>
												</td>
											</tr>
											<tr>

												<td
													style="text-align: left; padding-top: 20px; font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px; width: 40px;">
													<strong> <fmt:message bundle="${storeText}"
															key="EMAIL_ORDERCON_TAB1"></fmt:message> </strong></td>

												<td
													style="text-align: center; padding-top: 20px; font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px; width: 115px;">
													<strong> <fmt:message bundle="${storeText}"
															key="EMAIL_ORDERCON_TAB2"></fmt:message> </strong></td>

												<td
													style="text-align: left; padding-top: 20px; font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px">
													<strong><fmt:message bundle="${storeText}"
															key="EMAIL_ORDERCON_TAB3"></fmt:message> </strong></td>
												<td
													style="text-align: left; padding-top: 20px; font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px">
													<strong><fmt:message bundle="${storeText}"
															key="EMAIL_ORDERCON_TAB4"></fmt:message> </strong>
												</td>
												<td
													style="text-align: center; padding-top: 20px; font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px">
													<strong><fmt:message bundle="${storeText}"
															key="EMAIL_ORDERCON_TAB5"></fmt:message> </strong>
												</td>
												<td
													style="text-align: center; padding-top: 20px; font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px">
													<strong><fmt:message bundle="${storeText}"
															key="EMAIL_ORDERCON_TAB6"></fmt:message> </strong>
												</td>
											</tr>

											<c:set var="cartTotal" value="0" />
											<c:set var="totalOrderItemSavings" value="0"/>
											<c:forEach var="orderItem" items="${order.orderItem}"
												varStatus="status">
												<fmt:parseNumber var="itemId" value="${orderItem.productId}"
													type="number" />
												<wcf:rest var="catEntry"
													url="/store/{storeId}/productview/byId/${itemId}">
													<wcf:var name="storeId" value="${storeId}" encode="true" />
													<wcf:var name="itemId" value="${itemId}" encode="true" />
													<wcf:param name="langId" value="${langId}" />
													<wcf:param name="currency" value="${env_currencyCode}" />
													<wcf:param name="responseFormat" value="json" />
													<wcf:param name="catalogId" value="${catalogId}" />
													<wcf:param name="profileName"
														value="IBM_findProductByIds_Summary_WithNoEntitlementCheck" />
												</wcf:rest>
												<tr>

													<td
														style="text-align: center; padding-top: 20px; font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px">
														${status.count}</td>

													<td
														style="text-align: center; padding-top: 20px; font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px;">
														${catEntry.CatalogEntryView[0].name }</td>

													<fmt:formatNumber var="itemQuantity"
														value="${orderItem.quantity}" type="number"
														maxFractionDigits="0" />
													<td
														style="text-align: center; padding-top: 20px; font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px">
														${itemQuantity}</td>
													<fmt:formatNumber var="unitPrice"
														value="${orderItem.unitPrice}" type="currency"
														maxFractionDigits="${env_currencyDecimal}"
														currencySymbol="${env_CurrencySymbolToFormat}. " />
													<td
														style="text-align: left; padding-top: 20px; font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px">
														${unitPrice}</td>
														
													<c:set var="orderItemSavings" value="0"/>
													<c:forEach var="orderItemAdj" items="${orderItem.adjustment}">
														<c:if test="${orderItemAdj.displayLevel eq 'OrderItem'}">
															<c:set var="orderItemSavings" value="${orderItemSavings + orderItemAdj.amount}"/>
														</c:if>
													</c:forEach>
													
													<fmt:formatNumber var="subTotal"
														value="${orderItem.orderItemPrice + orderItemSavings}"
														type="currency" maxFractionDigits="${env_currencyDecimal}"
														currencySymbol="${env_CurrencySymbolToFormat}. " />
													<td
														style="text-align: center; padding-top: 20px; font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px">
														${subTotal}</td>
													<json:parse var="xitemJson"
														json="${orderItem.xitem_field2}" />
													<fmt:formatNumber var="savings"
														value="${((xitemJson.MRP - xitemJson.PP)*itemQuantity) - orderItemSavings}"
														type="currency" maxFractionDigits="${env_currencyDecimal}"
														currencySymbol="${env_CurrencySymbolToFormat}. " />
													<c:set var="cartTotal"
														value="${cartTotal + orderItem.orderItemPrice}" />
													<td
														style="text-align: center; padding-top: 20px; font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px">
														${savings}</td>
												</tr>
												<c:set var="totalOrderItemSavings"	value="${totalOrderItemSavings + orderItemSavings}" />

											</c:forEach>

											<tr>
												<td>&nbsp;</td>
											</tr>
										</table>
									</td>

									<td width="2%" valign="top">&nbsp;</td>

									<!-- Payment Details -->
									<td valign="top">
										<table width="100%" bgcolor="#f1f1f1" cellpadding="0"
											cellspacing="0" border="0"
											style="margin: 0; border: 1px dashed #dddddd; text-align: center; padding: 10px">
											<tr>
												<td>
													<p
														style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px; margin: 0; padding: 0; padding-bottom: 8px">
														<strong><fmt:message bundle="${storeText}"
																key="EMAIL_ORDERCON_SIDECART1"></fmt:message>
														</strong>
													</p>
													<p
														style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 12px; margin: 0; padding: 0">

														<c:set var="rep" scope="page"
															value="${order.paymentInstruction[0].payMethodId}" />
														<c:choose>
															<c:when test="${rep eq 'COD'}">
																${rep}
															</c:when>
															<c:otherwise>
																${order.x_field3}
															</c:otherwise>
														</c:choose>

													</p></td>
											</tr>

											<tr>
												<td>&nbsp;</td>
											</tr>
											<tr>
												<td>
													<p
														style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px; margin: 0; padding: 0; padding-bottom: 8px; padding-bottom: 8px">
														<strong>
														<c:choose>
															<c:when test="${payMethod eq 'COD'}">
																<fmt:message bundle="${storeText}"
																		key="EMAIL_ORDERCON_SIDECART2_COD"></fmt:message>
															</c:when>
															<c:otherwise>
																<fmt:message bundle="${storeText}"
																		key="EMAIL_ORDERCON_SIDECART2"></fmt:message>
															</c:otherwise>
														</c:choose>
														</strong>
													</p> <fmt:formatNumber var="totalCartVal" value="${cartTotal}"
														type="currency" maxFractionDigits="${env_currencyDecimal}"
														currencySymbol="${env_CurrencySymbolToFormat}. " />
														
														<fmt:formatNumber var="totalIncludingItemPromos"
															value="${cartTotal + totalOrderItemSavings}" type="currency"
															maxFractionDigits="${env_currencyDecimal}"
															currencySymbol="${env_CurrencySymbolToFormat}. " />
															
														<c:choose>
															<c:when test="${payMethod eq 'COD' && codRoundedTotal ne ''}">
																<fmt:formatNumber var="codYouPay" value="${codRoundedTotal}"
																	type="currency" maxFractionDigits="${env_currencyDecimal}" currencySymbol="${env_CurrencySymbolToFormat}. " />
																<p style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 12px; margin: 0; padding: 0">${codYouPay}</p>
															</c:when>
															<c:otherwise>
																<p style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 12px; margin: 0; padding: 0">${totalCartVal}</p>
															</c:otherwise>
														</c:choose>
												</td>
											</tr>

											<tr>
												<td>&nbsp;</td>
											</tr>

											<tr>
												<td>
													<p
														style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px; margin: 0; padding: 0; padding-bottom: 8px">
														<strong><fmt:message bundle="${storeText}"
																key="EMAIL_ORDERCON_SIDECART3"></fmt:message> </strong>
													</p> 
													
													<c:set var="totalDiscounts" value="0"/>
													<c:set var="totalShippingDiscounts" value="0"/>
													<c:forEach var="orderAdj" items="${order.adjustment}">
														<c:choose>														
															<c:when test="${orderAdj.usage ne 'Shipping Adjustment'}">
																<c:if test="${orderAdj.displayLevel eq 'Order'}">
																	<c:set var="totalDiscounts" value="${totalDiscounts + orderAdj.amount}"/>
																</c:if>
															</c:when>
															<c:otherwise>
																<c:if test="${orderAdj.displayLevel eq 'Order'}">
																	<c:set var="totalShippingDiscounts" value="${totalShippingDiscounts + orderAdj.amount}"/>
																</c:if>
															</c:otherwise>
														</c:choose>
													</c:forEach>
													
													<fmt:formatNumber var="discount"
														value="${-totalDiscounts}"
														type="currency" maxFractionDigits="${env_currencyDecimal}"
														currencySymbol="${env_CurrencySymbolToFormat}. " />
													<c:if test="${discount != '(Rs. 0.00)'}">
														<p
															style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 12px; margin: 0; padding: 0; padding-bottom: 5px">
															<fmt:message bundle="${storeText}"
																key="EMAIL_ORDERCON_SIDECART4"></fmt:message>
															  ${discount}
														</p>
													</c:if>
													<fmt:formatNumber var="CartSubTotal"
														value="${order.totalProductPrice}" type="currency"
														maxFractionDigits="${env_currencyDecimal}"
														currencySymbol="${env_CurrencySymbolToFormat}. " />
													<p
														style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 12px; margin: 0; padding: 0; padding-bottom: 5px">
													<c:choose>
														<c:when test="${payMethod eq 'COD'}">
															<fmt:message bundle="${storeText}"
																key="EMAIL_ORDERCON_SIDECART5_COD"></fmt:message>
														</c:when>
														<c:otherwise>
															<fmt:message bundle="${storeText}"
																key="EMAIL_ORDERCON_SIDECART5"></fmt:message>	
														</c:otherwise>
													</c:choose>
														 ${totalIncludingItemPromos}
													</p> <fmt:formatNumber var="shipping"
														value="${order.totalShippingCharge + totalShippingDiscounts}" type="currency"
														maxFractionDigits="${env_currencyDecimal}"
														currencySymbol="${env_CurrencySymbolToFormat}. " />
													<p
														style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 12px; margin: 0; padding: 0; padding-bottom: 5px">
														<fmt:message bundle="${storeText}"
															key="EMAIL_ORDERCON_SIDECART6"></fmt:message>
														 ${shipping}
													</p> <fmt:formatNumber var="orderTotal"
														value="${order.grandTotal}" type="currency"
														maxFractionDigits="${env_currencyDecimal}"
														currencySymbol="${env_CurrencySymbolToFormat}. " />
													<p
														style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 12px; margin: 0; padding: 0">
														<fmt:message bundle="${storeText}"
															key="EMAIL_ORDERCON_SIDECART7"></fmt:message>
														 ${orderTotal}
													</p>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
				<c:if test="${order.x_deliveryMode == 'Pickup Point'}">

					<table width="100%" cellpadding="0" cellspacing="0" border="0">
					<tr>
						<td width="600px">
							<table width="100%" cellpadding="0" cellspacing="0" border="0">
								<tr>
									<td>
										<p
											style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px; font-weight: normal; padding: 0; margin: 10px 0 20px">
											<fmt:message bundle="${storeText}"
												key="EMAIL_ORDERCON_MESSAGE5_PUP_ADDRESS"></fmt:message>
											<br/> <br/>
											${order.orderItem[0].addressLine[0]},${order.orderItem[0].addressLine[1]},${order.orderItem[0].addressLine[2]}
										</p>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					</table>
				</c:if>
				
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
