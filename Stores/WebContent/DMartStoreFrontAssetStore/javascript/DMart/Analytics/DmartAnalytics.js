/*
 * Analytics class for DMart. Uses Google Analytics for Analytics Report.  
 */

var DMAnalytics = {
		
		init: function() {
		$(document).on('click', '.main-menu a', function() {
			DMAnalytics.events( DMAnalytics.Constants.Category.MegaMenu, $(this).html(), document.title, 0, null );
		});
		},
		pageLoad: function(params) {	
			if(typeof GAEnabled != 'undefined' && GAEnabled =='1'){
				ga('send', 'pageview',document.title, params);
			}
		},
		/*
		 * eventCategory - category of the event ( eg: Products, Banners, My Account etc)
		 * eventAction - Action of the event ( Add to trolley, Update trolly etc)
		 * eventLabel- Label of the action ( PLP, Banner, Home page etc)
		 * Params - extra parameters if any  
		 */
		events: function(eventCategory,eventAction,eventLabel,eventValue,Params) {	
			if(typeof GAEnabled != 'undefined' && GAEnabled =='1'){
				ga('send', 'event', eventCategory, eventAction, eventLabel, eventValue, Params);
			}			
		},
		
		ecommerceInit: function(){
			ga('require', 'ecommerce');
		},
		
		startTransaction : function(orderId,store,revenue,shipping,tax){
			ga('ecommerce:addTransaction', {
				  'id': orderId,          // Transaction ID. Required.
				  'affiliation': store,   // Affiliation or store name.
				  'revenue': revenue,     // Grand Total.
				  'shipping': shipping,   // Shipping.
				  'tax': tax,             // Tax.
				  'currency': 'INR'
				});
		},
		ecommerceSend : function(){
			ga('ecommerce:send');
		},
		ecommerceClear : function(){
			ga('ecommerce:clear');
		},
		addItem : function(id,name,partnum,category, price, qty){
			ga('ecommerce:addItem', {
				  'id': id,                      // Transaction ID. Required.
				  'name': name,   				 // Product name. Required.
				  'sku': partnum,                // SKU/code.
				  'category': category,          // Category or variation.
				  'price': price,                // Unit price.
				  'quantity':qty,                // Quantity.
				  'currency': 'INR'
				});
		},
		
		submitRevenueData: function(){
			if(typeof GAEnabled != 'undefined' && GAEnabled =='1'){
				var orderData = DMStorage.getValue('OrderId');
				if(orderData != null){
					this.ecommerceInit();
					this.startTransaction(orderData.orderId,$('#delivery_pin').html(),orderData.total,
							orderData.totalShippingCharge - orderData.shippingAdjustment, orderData.tax);
					$(orderData.orderItems).each(function(i,itmData) {
						DMAnalytics.addItem(itmData.catentryId,itmData.productTitle,itmData.catentryId,
								itmData.topCategory,itmData.price,itmData.quantity);
					});	
					this.ecommerceSend();
				}
			}
		},
		Constants:{
			Category:{
				Products : "Products",
				Search : "Search",
				SignIn: "SignIn",
				SocialSignIn: "Social Signin",
				Pincode:"Pincode",
				Cart: "Cart",
				OTP: "OTP",
				Order: "Order",
				DeliveryMode: "Delivery Mode Click",
				AddressFav: "Address Favourite",
				DeleteAdd: "Address Delete",
				AddressEdit: "Address Edit",
				AddAddress: "Add New Address",
				Slot: "Slots",
				Filter : "Facet/Filter Click",
				PDP : "Product Display Page",
				Checkout: "Checkout",
				MegaMenu: "Shop By Category",
				MiniCart: "MiniCart",
				PLPListing: "PLP product listing",
				PLPPallette: "Color Selection for Apparel - PLP",
				PLPVariant: "Variant Selection - PLP",
				PDPListing: "PDP product listing",
				PDPPallette: "Color Selection for Apparel - PDP",
				PDPVariant: "Variant Selection for All Category - PDP",
				List: "List",
				SlotNext : "Next 7 Days Button",
				PupSelection : "Search/Filter on PUP Selection",
				ClearCart : "Clear Cart Button",
				ShopFromPrevOrd : "Shop from Previous Order",
				ShopFromList : "Shop from List",
				orderStatus : "Order Status",
				ShopNow : "Shop Now button in main category navigation",
				BannerClick : "Home Page Main Banner Click",
				BannerATC : "Home Page Main Banner- Add to Cart",
				BreadcrumNav : "Breadcrum Navigation Hover",
				PLPQtySelection : "Quantity Selection for All Category- PLP",
				SearchAndAdd : "Search and Add",
				PaymentMethod: "Payment Method Tab Selection",
				UncheckEvent : "Product Selection Checkbox- Uncheck event"
			},
			Action:{
				CartAdd : "Add to Cart Button click with Page Source",
				CartRemove : "Product Delete Button",
				CartUpdate : "Change Quantity Dropdown",
				EmptyCart : "Clear Cart",
				ShareCart : "Share Cart",
				PLPLazyLoad: "PLP product listing Lazy Load",
				PLPListing: "PLP product listing",
				SearchTerm: "Search Term",
				ResendOTP: "Resend OTP",
				SelectPincode: "PIN Code Selection with Value",
				PDPTabClick: "Product Details Tabs Click",
				MiniCartClick: "Mini Cart Click",
				SignIn: "Sign In",
				GuestCheckout: "Check out as Guest",
				ForgotPwd: "Forgot Password",
				SlotSelection: "Proceed to Slot Selection Button",
				NextSlot: "Next 7 Days",
				PlaceOrder: "Place Your Order button",
				Logout: "LogOut",
				PDPImage: "Image Click",
				PinCodeSkip: "Skip",
				AutoLocation: "Get My Location",
				FacetBannerClose : "Facet Banner Close Button Click",
				FacetClick : "Facet Banner Click",
				Register: "Register",
				MiniCartClick: "Mini Cart Click",
				AddToList: "Add to List",
				PromoCode: "Promo Code Value:",
				PromoCodeDel: "Remove PromoCode :",
				VerifyEmail : "Verify Email Link Click",
				CancelOrder : "Cancel Order",
				SlotChange : "Time Slot Change Link",
				DeleteList : "Delete List",
				PDPQtySelection : "Quantity Selection for All Category -PDP",
				PDPVariantSelection : "Variant Selection for All Category - PDP",
				PDPColourSelection : "Color Selection for Apparel -PDP",
				PLPVariantSelection : "Variant Selection for All Category -PLP",
				PLPColourSelection : "Color Selection for Apparel -PLP",
				ATCTopCat : "Home Page Category Offer Add to Cart Click"
			},
			Label:{
				PLPPage : "Product Listing Page",
				PDPPage : "Product Display Page",
				Banner : "Banners",
				List : "My List",
				Account : "My Account"
			}
				
		}
};
DMAnalytics.init();