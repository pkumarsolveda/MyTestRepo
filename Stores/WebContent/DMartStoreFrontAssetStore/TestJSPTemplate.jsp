<?xml version="1.0" encoding="ISO-8859-1" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page import="org.apache.commons.json.JSONObject"%>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<title>DMart - Order Confirmation</title>

<%@ include file="./Common/EnvironmentSetup.jspf"%>

<c:set var="policyUrl"
	value="${env_TopCategoriesDisplayURL}/dmart-privacy-policy" />

<c:set var="orderId" value="689002" />
<c:set var="orderDeliveryTime" value="DMOrderDeliveryTimeSlot" />
<c:set var="orderDeliveryDate" value="DMOrderDeliveryDate" />
<c:set var="orderPlacingDate" value="DMOrderPlacingDate" />


<wcf:rest var="order" url="/store/{storeId}/order/{orderId}"
	scope="request">
	<wcf:var name="storeId" value="${storeId}" encode="true" />
	<wcf:var name="orderId" value="${orderId}" encode="true" />
</wcf:rest>

<%
	StoreConfigurationRegistry scfRegistry = (StoreConfigurationRegistry) RegistryManager
			.singleton().getRegistry("StoreConfigurationRegistry");
	String DMartHomePage = scfRegistry.getSingleton().getValue(0,
			"DMart.Home.Page.URL");
	String FacebookPage = scfRegistry.getSingleton().getValue(0,
			"DMart.FacebookPage.URL");
	String GooglePlusPage = scfRegistry.getSingleton().getValue(0,
			"DMart.GooglePlus.URL");
	String AndroidAppStorePage = scfRegistry.getSingleton().getValue(0,
			"DMart.AppStoreAndroid.URL");
	String AppleStorePage = scfRegistry.getSingleton().getValue(0,
			"DMart.AppStoreiOS.URL");
	String DMartPunchLine = scfRegistry.getSingleton().getValue(0,
			"DMartPunchLine");
	pageContext.setAttribute("DMartHomePage", DMartHomePage);
	pageContext.setAttribute("FacebookPage", FacebookPage);
	pageContext.setAttribute("GooglePlusPage", GooglePlusPage);
	pageContext
			.setAttribute("AndroidAppStorePage", AndroidAppStorePage);
	pageContext.setAttribute("AppleStorePage", AppleStorePage);
	pageContext.setAttribute("DMartPunchLine", DMartPunchLine);
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
								style="font-family: Calibri, Arial, sans-serif; font-size: 30px; color: #b3b3b3; padding: 0; margin: 15px 0">
								Daily Discounts Daily Savings...!!!</p></td>
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
											style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 16px; font-weight: bold; padding: 0; margin: 0">Congratulation!
											Your order has been placed successfully.</h3>
									</td>
									<td align="right"><a href="${DMartHomePage}"> <img
											src="DMartStoreFrontAssetStore/images/dmart-logo.png"
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
										<h3
											style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 16px; font-weight: normal; padding: 0; margin: 30px 0 10px">Hi
											${order.orderItem[0].firstName}
											${order.orderItem[0].lastName},</h3>
										<p
											style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px; font-weight: normal; padding: 0; margin: 10px 0 20px">
											Thank you for shopping with us. Your order <a
												href="javascript:;" title="${orderId}"> ${orderId}</a> will
											be delivered to you on ${order.x_slotDate} between
											${order.x_slotStartTime} - ${order.x_slotEndTime}.
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
								style="margin: 30px 0">
								<tr>
									<td valign="top" width="68%">

										<table width="100%" cellpadding="0" cellspacing="0" border="0">
											<tr>
												<td colspan="6"
													style="font-family: 'Open Sans', 'Calibri', Arial; font-size: 16px; padding-bottom: 10px;"><strong>
														Your Order Summary: </strong>
												</td>
											</tr>
											<tr>
												<td colspan="6"
													style="font-family: 'Open Sans', 'Calibri', Arial; font-size: 12px; padding-bottom: 1px;">Order:
													${orderId}</td>
											</tr>
											<fmt:parseDate parseLocale="${dateLocale}"
												var="orderDateUfmt" value="${order.placedDate}"
												pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'" timeZone="IST" />
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
													type="date" pattern="yyyy-MM-dd HH:mm:ss"
													timeZone="${formattedTimeZone}" dateStyle="long" />
												<td colspan="6"
													style="font-family: ' Open Sans ', ' Calibri ', Arial; font-size: 11px; padding-bottom: 1px;">
													Placed on ${orderDate}</td>


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
													<strong> S. No.</strong></td>

												<td
													style="text-align: center; padding-top: 20px; font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px; width: 115px;">
													<strong> Item Details</strong></td>

												<td
													style="text-align: left; padding-top: 20px; font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px">
													<strong> Qty.</strong></td>
												<td
													style="text-align: left; padding-top: 20px; font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px">
													<strong> Unit Price</strong>
												</td>
												<td
													style="text-align: center; padding-top: 20px; font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px">
													<strong>Sub Total</strong>
												</td>
												<td
													style="text-align: center; padding-top: 20px; font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px">
													<strong>Savings</strong>
												</td>
											</tr>

											<c:set var="cartTotal" value="0" />
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
													<fmt:formatNumber var="subTotal"
														value="${orderItem.orderItemPrice + orderItem.totalAdjustment.value}"
														type="currency" maxFractionDigits="${env_currencyDecimal}"
														currencySymbol="${env_CurrencySymbolToFormat}. " />
													<td
														style="text-align: center; padding-top: 20px; font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px">
														${subTotal}</td>
													<json:parse var="xitemJson"
														json="${orderItem.xitem_field2}" />
													<fmt:formatNumber var="savings"
														value="${((xitemJson.MRP - xitemJson.PP)*itemQuantity) - orderItem.totalAdjustment.value}"
														type="currency" maxFractionDigits="${env_currencyDecimal}"
														currencySymbol="${env_CurrencySymbolToFormat}. " />
													<c:set var="cartTotal"
														value="${cartTotal + orderItem.orderItemPrice + orderItem.totalAdjustment.value}" />
													<td
														style="text-align: center; padding-top: 20px; font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px">
														${savings}</td>
												</tr>



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
														<strong>Payment Method</strong>
													</p>
													<p
														style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 12px; margin: 0; padding: 0">
														<c:set var="rep" scope="page" value="${order.paymentInstruction[0].payMethodId}"/>
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
														<strong>Cart Total</strong>
													</p> <fmt:formatNumber var="totalCartVal" value="${cartTotal}"
														type="currency" maxFractionDigits="${env_currencyDecimal}"
														currencySymbol="${env_CurrencySymbolToFormat}. " />
													<p
														style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 12px; margin: 0; padding: 0">${totalCartVal}</p>
												</td>
											</tr>

											<tr>
												<td>&nbsp;</td>
											</tr>

											<tr>
												<td>
													<p
														style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px; margin: 0; padding: 0; padding-bottom: 8px">
														<strong>Rate Breakup</strong>
													</p> <fmt:formatNumber var="discount"
														value="${-order.orderItem[0].totalAdjustment.value}"
														type="currency" maxFractionDigits="${env_currencyDecimal}"
														currencySymbol="${env_CurrencySymbolToFormat}. " />
													<p
														style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 12px; margin: 0; padding: 0; padding-bottom: 5px">Discount
														(-) - ${discount}</p> <fmt:formatNumber var="CartSubTotal"
														value="${order.totalProductPrice}" type="currency"
														maxFractionDigits="${env_currencyDecimal}"
														currencySymbol="${env_CurrencySymbolToFormat}. " />
													<p
														style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 12px; margin: 0; padding: 0; padding-bottom: 5px">SubTotal
														- ${totalCartVal}</p> <fmt:formatNumber var="shipping"
														value="${order.totalShippingCharge}" type="currency"
														maxFractionDigits="${env_currencyDecimal}"
														currencySymbol="${env_CurrencySymbolToFormat}. " />
													<p
														style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 12px; margin: 0; padding: 0; padding-bottom: 5px">Delivery
														Charges (+) - ${shipping}</p> <fmt:formatNumber
														var="orderTotal" value="${order.grandTotal}"
														type="currency" maxFractionDigits="${env_currencyDecimal}"
														currencySymbol="${env_CurrencySymbolToFormat}. " />
													<p
														style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 12px; margin: 0; padding: 0">Total
														- ${orderTotal}</p>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>


				<table width="100%" cellpadding="0" cellspacing="0" border="0"
					style="margin: 0">
					<tr>
						<td width="600px">
							<table width="100%" cellpadding="0" cellspacing="0" border="0">
								<tr>
									<td>
										<p
											style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px; font-weight: normal; margin: 0 0 20px 0; padding: 0; text-align: left">
											Thank you for shopping with us!</p>
										<p
											style="font-family: 'Open Sans', 'Calibri', Arial, sans-serif; font-size: 14px; font-weight: normal; margin: 0; padding: 0; text-align: left">Team
											DMart.in</p>
									</td>
								</tr>
								<tr>
									<td>
										<p
											style="font-family: ' Open Sans ', ' Calibri ', Arial, sans-serif; font-size: 14px; font-weight: normal; margin: 20px 0 20px 0; padding: 0; text-align: left">
											${DMartPunchLine}</p>
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
														style="font-family: Arial, sans-serif; font-size: 14px; font-weight: normal; margin: 0; padding: 0">Connect
														With Us</h5></td>
												<td><a href="${FacebookPage}"
													style="text-decoration: none"> <img
														src="DMartStoreFrontAssetStore/images/temp/email/facebook.png">
												</a> <a href="${GooglePlusPage}" style="text-decoration: none">
														<img
														src="DMartStoreFrontAssetStore/images/temp/email/google.png">
												</a></td>
											</tr>
										</table></td>
									<td width="50%" colspan="2" valign="middle" align="right">
										<table width="100%" cellpadding="0" cellspacing="0" border="0">
											<tr>
												<td align="right">
													<h3
														style="font-family: Arial, sans-serif; font-size: 14px; font-weight: normal; margin: 0; padding: 0">
														Download Our App Now!</h3></td>
												<td align="right"><a href="${AndroidAppStorePage}"
													title="Download for Android"> <img
														src="DMartStoreFrontAssetStore/images/temp/email/android-app.jpg"
														width="95px" height="31px">
												</a></td>
												<td align="right" width="27%"><a
													href="${AppleStorePage}" title="Download for IOS"> <img
														src="DMartStoreFrontAssetStore/images/temp/email/ios-app.jpg"
														width="95px" height="31px">
												</a></td>
											</tr>
										</table></td>
								</tr>
							</table></td>
					</tr>
				</table></td>
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
								All Rights Reserved. DMart &copy; 2016.</p></td>
						<td valign="top" align="right">

							<p style="margin: 10px 0 0">
								<a
									style="font-family: Arial, sans-serif; font-size: 12px; color: #287345; font-weight: normal; margin: 0; padding: 0; text-decoration: none"
									href="javascript:;" title="Terms and Conditions">Terms
									&amp; Conditions</a> | <a
									style="font-family: Arial, sans-serif; font-size: 12px; color: #287345; font-weight: normal; margin: 0; padding: 0; text-decoration: none"
									href="${policyUrl}" title="Privacy Policy">Privacy Policy</a> |
								<a
									style="font-family: Arial, sans-serif; font-size: 12px; color: #287345; font-weight: normal; margin: 0; padding: 0; text-decoration: none"
									href="javascript:;" title="Unsubscribe"><unsubscribe>Unsubscribe</unsubscribe>
								</a>
							</p></td>
					</tr>
				</table></td>
			<td>&nbsp;</td>
		</tr>
	</table>

</body>

</html>
