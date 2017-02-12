<%@include file="../Common/EnvironmentSetup.jspf" %>
<%@taglib uri="http://commerce.ibm.com/pagelayout" prefix="wcpgl"%>
<%--<script type="text/javascript" src="${jsAssetsDir}javascript/Widgets/ProductTab/ProductTab.js"></script> --%>

<div class="container">
	<div class="row">
		<div class="col-xs-12 col-md-6" data-slot-id="1"><wcpgl:widgetImport slotId="1"/></div>
	</div>
	<div class="container" id="error-msg-container">
  <div class="row">
    <div class="col-xs-12">
      <div class="alert alert-warning-bg js-alert-order" style="display:none;">
        <strong><i class="icon-notification"></i><fmt:message bundle="${storeText}" key="MSG_NOTIFCATION"/></strong>
        	<span id="generic-error-section">
        		
        	</span>
        <a class="alert-close-cta js-cart-reject align-right alert-cross-pos" href="javascript:;" title="Close"><i class="icon-cta-close icon-cancel"></i></a>
      </div>
    </div>
  </div>
</div>
	<div class="row">
		<div class="col-xs-12 col-md-7 col-lg-6" data-slot-id="2"><wcpgl:widgetImport slotId="2"/></div>
		<div class="col-xs-12 col-md-5 col-lg-6" data-slot-id="3"><wcpgl:widgetImport slotId="3"/></div>
	</div>
	
	<div class="row">
		<div class="col12" data-slot-id="4"><wcpgl:widgetImport slotId="4"/></div>
	</div>
	
	<div class="row">
		<div class="col-xs-11 col-md-12" id='productInformation' data-slot-id="5"><wcpgl:widgetImport slotId="5"/></div>
	</div>
	
	<div class="row margin-true">
	<div class="col12 acol12 ccol12 right">
    <wcf:useBean var="tabSlotIds" classname="java.util.ArrayList"/>
    <%-- Double loop to get the slots into the array list in proper order. The service does not return the child widgets in any predictable order. --%>
    <c:set var="tabSlotCount" value="0"/>
    <c:forEach var="slotNumber" begin="6" end="7">
      <c:set var="foundCurrentSlot" value="false"/>
      <c:forEach var="childWidget" items="${pageDesign.widget.childWidget}">
        <c:if test="${childWidget.slot.internalSlotId == slotNumber && !foundCurrentSlot}">
          <wcf:set target="${tabSlotIds}" value="${slotNumber}" />
          <c:set var="foundCurrentSlot" value="true"/>
          <c:set var="tabSlotCount" value="${tabSlotCount+1}"/>
        </c:if>
      </c:forEach>
    </c:forEach>  
    
    <div class="tabButtonContainer" role="tablist" style="display:none">
      <div class="tab_header tab_header_double">
        <c:forEach var="tabSlotId" items="${tabSlotIds}" varStatus="status">
          <c:set var="tabSlotName" value="Title${tabSlotId}"/>
          <c:forEach var="childWidget" items="${pageDesign.widget.childWidget}">
            <c:if test="${childWidget.slot.internalSlotId == tabSlotName}">
              <c:set var="tabWidgetDefIdentifier" value="${childWidget.widgetDefinitionIdentifier.uniqueID}"/>
              <c:set var="tabWidgetIdentifier" value="${childWidget.widgetIdentifier.uniqueID}"/>
            </c:if>
          </c:forEach>
          <c:choose>
            <c:when test="${status.first}">
              <c:set var="tabClass" value="tab_container active_tab" />
              <c:set var="tabIndex" value="0" />
            </c:when>
            <c:otherwise>
              <c:set var="tabClass" value="tab_container inactive_tab" />
              <c:set var="tabIndex" value="-1" />
            </c:otherwise>
          </c:choose>
          <c:set var="tabNumber" value="${status.index+1}" scope="request"/>
          <div id="tab${status.count}" tabindex="${tabIndex}" class="tab_container ${tabClass}" 
            aria-labelledby="contentRecommendationWidget_${tabSlotName}_${tabWidgetDefIdentifier}_${tabWidgetIdentifier}" aria-controls="tab${status.count}Widget"
            onfocus="ProductTabJS.focusTab('tab${status.count}');" onblur="ProductTabJS.blurTab('tab${status.count}');" 
            role="tab" aria-setsize="${tabSlotCount}" aria-posinset="${status.count}" aria-selected="${status.first == true ? 'true' : 'false'}" 
            onclick="ProductTabJS.selectTab('tab${status.count}');" 
            onkeydown="ProductTabJS.selectTabWithKeyboard('${status.count}','${tabSlotCount}', event);">
            <wcpgl:widgetImport slotId="${tabSlotName}"/>
          </div>
          <c:remove var="tabNumber"/>
        </c:forEach>
      </div>
    </div>	
    
    <c:forEach var="tabSlotId" items="${tabSlotIds}" varStatus="status">
      <c:set var="tabStyle" value=""/>
      <c:if test="${!status.first}">
        <c:set var="tabStyle" value="style='display:none'" />
      </c:if>
      <div role="tabpanel" class="tab left" data-slot-id="${tabSlotId}" id="tab${status.count}Widget" aria-labelledby="tab${status.count}" ${tabStyle}>
        <div class="content">
          <wcpgl:widgetImport slotId="${tabSlotId}"/>
        </div>
      </div>
      <c:remove var="tabStyle"/>
    </c:forEach>
	</div>
	</div>
	
	<div class="row">
		<div class="col12" data-slot-id="8"><wcpgl:widgetImport slotId="8"/></div>
	</div>
</div>