<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://commerce.ibm.com/base" prefix="wcbase" %>
<%@ taglib uri="http://commerce.ibm.com/foundation" prefix="wcf" %>
<%@ taglib uri="flow.tld" prefix="flow" %>
<%@ include file="Common/EnvironmentSetup.jspf" %>
  
  <%out.flush();%>
  <c:import url="include/WebServiceeMarketingSpotDisplay.jsp">
  	<c:param name="emsName" value="DMartFacetNavOverlay" />
  	<c:param name="catalogId" value="${WCParam.catalogId}" />
  </c:import>
  <%out.flush();%>