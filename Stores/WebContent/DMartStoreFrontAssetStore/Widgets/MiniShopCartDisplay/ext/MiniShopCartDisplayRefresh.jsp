<%--
 =================================================================
  Licensed Materials - Property of IBM

  WebSphere Commerce

  (C) Copyright IBM Corp. 2011, 2014 All Rights Reserved.

  US Government Users Restricted Rights - Use, duplication or
  disclosure restricted by GSA ADP Schedule Contract with
  IBM Corp.
 =================================================================
--%>

<%-- BEGIN MiniShopCartDisplayRefresh.jsp --%>

<%@ include file= "../../../Common/EnvironmentSetup.jspf" %>

<c:set var="ariaMessage">
	<fmt:message bundle="${storeText}" key="ACCE_Status_Shopping_Cart_Content_Updated"/>
</c:set>
<c:set var="miniCartAttributes" value="dojoType='wc.widget.RefreshArea' widgetId='MiniShoppingCart' controllerId='MiniShoppingCartController' ariaMessage='${ariaMessage}' ariaLiveId='${ariaMessageNode}' role='region'"/>
<c:if test="${env_useExternalCart}">
	<c:set var="miniCartAttributes" value=""/>
</c:if>

<c:set var="cookieOrderIdKey" value="WC_CartOrderId_${storeId}"/>


<div class="cart-wrap">
              <div class="cart-icon">
  <i class="icon-cart"></i>
  <span class="badge">10</span>
</div>

              <a title="Cart" href="javascript:;" class="dropdown-minicart">
                <span class="cart-price-label" style="opacity: 1;"><i class="header-icon-rupee icon-rupees"></i>12,453
                  <i class="header-icon-caret-down icon-caret-down"></i>
                </span>
              </a>
              <div class="header-dropdown header-dropdown--minicart" style="display: none;">
                <div class="cart-details__item">
  <div class="minicart-details">
    <div class="row">
      <div class="col-md-6">
        <h3 class="minicart-details--total-items">
        <i class="icon-cart"></i> <span>4</span> items
        </h3>
      </div>
      <div class="col-md-6">
        <h3 class="minicart-minicart-details--total-price">
        <i class="icon-rupees"></i>91,180
        </h3>
      </div>
    </div>
  </div>
  <div class="cart-details__scroll mCustomScrollbar _mCS_2 mCS-autoHide"><div class="mCustomScrollBox mCS-light mCSB_vertical mCSB_inside" id="mCSB_2" style="max-height: 300px;" tabindex="0"><div dir="ltr" style="position:relative; top:0; left:0;" class="mCSB_container mCS_y_hidden mCS_no_scrollbar_y" id="mCSB_2_container">
    <h3 class="cart-details__item--title">
    <a href="javascript:;">
      Apparel <span>(3 items)</span><span class="cart-details__item--title-arrow"><i class="icon-caret-down"></i></span>
    </a>
    </h3>
    <ul class="cart-details__item-list">
      
      

<li class="cart-details__item-lists">
  <div class="row">
    <div class="col-md-2">
      <a href="javascript:;">
        <img alt="" src="/images/temp/plp/product-apparel-1.jpg" class="img-responsive mCS_img_loaded">
        
      </a>
    </div>
    <div class="col-md-10">
      <h3 class="h4 product-name"><a href="javascript:;">Yellow Round Neck T-Shirt</a></h3>
      <h4 class="cart-details__item--price-dmart">DMart <i class="icon-rupees"></i>286</h4>
      <div class="cart-details__qty-wrap">
        <span class="cart-details__qty--label">Qty</span>
        <div class="custom-dropdown">
          <select class="cart-details-dropdown">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
      
      

      <div class="cart-details__item--remove">
        <a href="javascript:;">
          <i class="icon-cross"></i>
        </a>
      </div>
    </div>
  </div>
</li>


      

<li class="cart-details__item-lists">
  <div class="row">
    <div class="col-md-2">
      <a href="javascript:;">
        <img alt="" src="/images/temp/plp/product-apparel-2.jpg" class="img-responsive mCS_img_loaded">
        
      </a>
    </div>
    <div class="col-md-10">
      <h3 class="h4 product-name"><a href="javascript:;">Blue Round Neck T-Shirt</a></h3>
      <h4 class="cart-details__item--price-dmart">DMart <i class="icon-rupees"></i>400</h4>
      <div class="cart-details__qty-wrap">
        <span class="cart-details__qty--label">Qty</span>
        <div class="custom-dropdown">
          <select class="cart-details-dropdown">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
      
      
      <div class="free-item"><span class="label label-secondary label-medium">Free</span> Baseball Cap</div>
      

      <div class="cart-details__item--remove">
        <a href="javascript:;">
          <i class="icon-cross"></i>
        </a>
      </div>
    </div>
  </div>
</li>


      

<li class="cart-details__item-lists">
  <div class="row">
    <div class="col-md-2">
      <a href="javascript:;">
        <img alt="" src="/images/temp/plp/product-apparel-3.jpg" class="img-responsive mCS_img_loaded">
        
      </a>
    </div>
    <div class="col-md-10">
      <h3 class="h4 product-name"><a href="javascript:;">Red Round Neck T-Shirt</a></h3>
      <h4 class="cart-details__item--price-dmart">DMart <i class="icon-rupees"></i>455</h4>
      <div class="cart-details__qty-wrap">
        <span class="cart-details__qty--label">Qty</span>
        <div class="custom-dropdown">
          <select class="cart-details-dropdown">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
      
      <h4 class="price-change"><span class="title">Price Changed:</span> From <span><i class="icon-rupees"></i>450</span> to <span><i class="icon-rupees"></i>500</span></h4>
      
      

      <div class="cart-details__item--remove">
        <a href="javascript:;">
          <i class="icon-cross"></i>
        </a>
      </div>
    </div>
  </div>
</li>



      <li class="cart-no-items">
        <p class="alert alert-danger text-center">No items in this section</p>
      </li>
    </ul>
    <h3 class="cart-details__item--title">
    <a href="javascript:;">
      Grocery <span>(2 items)</span><span class="cart-details__item--title-arrow"><i class="icon-caret-down"></i></span>
    </a>
    </h3>
    <ul class="cart-details__item-list">
      
      

<li class="cart-details__item-lists">
  <div class="row">
    <div class="col-md-2">
      <a href="javascript:;">
        <img alt="" src="/images/temp/plp/product-grocery-1.jpg" class="img-responsive mCS_img_loaded">
        
      </a>
    </div>
    <div class="col-md-10">
      <h3 class="h4 product-name"><a href="javascript:;">India Gate Basmadi Rice</a></h3>
      <h4 class="cart-details__item--price-dmart">DMart <i class="icon-rupees"></i>286</h4>
      <div class="cart-details__qty-wrap">
        <span class="cart-details__qty--label">Qty</span>
        <div class="custom-dropdown">
          <select class="cart-details-dropdown">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
      
      

      <div class="cart-details__item--remove">
        <a href="javascript:;">
          <i class="icon-cross"></i>
        </a>
      </div>
    </div>
  </div>
</li>


      

<li class="cart-details__item-lists product-not-available">
  <div class="row">
    <div class="col-md-2">
      <a href="javascript:;" class="product-not-available-img-disabled">
        <img alt="" src="/images/temp/plp/product-grocery-2.jpg" class="img-responsive mCS_img_loaded">
        
        <span class="cart-details__item-lists--no-stock">
          <span><span>Coming Soon!!</span></span>
        </span>
        
      </a>
    </div>
    <div class="col-md-10">
      <h3 class="h4 product-name"><a href="javascript:;">Deep Chana Daal</a></h3>
      <h4 class="cart-details__item--price-dmart">DMart <i class="icon-rupees"></i>400</h4>
      <div class="cart-details__qty-wrap">
        <span class="cart-details__qty--label">Qty</span>
        <div class="custom-dropdown">
          <select class="cart-details-dropdown">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
      
      

      <div class="cart-details__item--remove">
        <a href="javascript:;">
          <i class="icon-cross"></i>
        </a>
      </div>
    </div>
  </div>
</li>



      <li class="cart-no-items">
        <p class="alert alert-danger text-center">No items in this section</p>
      </li>
    </ul>
  </div><div class="mCSB_scrollTools mCSB_2_scrollbar mCS-light mCSB_scrollTools_vertical" id="mCSB_2_scrollbar_vertical" style="display: none;"><div class="mCSB_draggerContainer"><div oncontextmenu="return false;" style="position: absolute; min-height: 30px; top: 0px;" class="mCSB_dragger" id="mCSB_2_dragger_vertical"><div class="mCSB_dragger_bar" style="line-height: 30px;"></div></div><div class="mCSB_draggerRail"></div></div></div></div></div>
  <div class="add-to-cart-button">
    <div class="cart-summary__price-details">
      <div class="delivery-charges__details js-hide-show">
        <div class="delivery-charges__info">
          <div class="row">
            <div class="col-xs-2"><i class="icon icon-home delivery-charges__info-icon"></i></div>
            <div class="col-xs-10">Home delivery charges <strong><i class="icon icon-rupees"></i>100</strong> or <strong>2%</strong>of the order, which ever is higher</div>
          </div>
        </div>
        <div class="delivery-charges__info">
          <div class="row">
            <div class="col-xs-2"><i class="icon icon-package delivery-charges__info-icon"></i></div>
            <div class="col-xs-10">PUP delivery has no change on order</div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <i class="dmart-sprite sprite-piggy-bank"></i>
    </div>
    <div class="col-md-9">
      <div class="cart-summary__price-details">
        <div class="row">
          <div class="col-xs-7">
            <span>Tax</span>
          </div>
          <div class="col-xs-5">
            <div class="cart-summary--price"><i class="icon-rupees"></i>100</div>
          </div>
        </div>
      </div>
      <div class="cart-summary__price-details">
        <div class="row">
          <div class="col-xs-7">
            <strong>Total</strong>
          </div>
          <div class="col-xs-5">
            <div class="cart-summary--price"><strong><i class="icon-rupees"></i>92,580</strong></div>
          </div>
        </div>
      </div>
      <div class="cart-summary__price-details add-to-cart-button--total-savings spacing-bottom-half">
        <div class="row">
          <div class="col-xs-7">
            <span>Total Savings</span>
          </div>
          <div class="col-xs-5">
            <div class="cart-summary--price"><strong><i class="icon-rupees"></i>8,000</strong></div>
          </div>
        </div>
      </div>
    </div>
    <button class="button-primary button--block" type="submit">View Cart and Checkout</button>
  </div>
</div>

              </div>
            </div>


<%-- END MiniShopCartDisplayRefresh.jsp --%>