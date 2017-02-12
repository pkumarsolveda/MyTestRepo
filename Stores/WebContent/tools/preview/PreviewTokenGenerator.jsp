<%--
 =================================================================
 Custom JSP for retrieving the preview token for 
 CMC preview flow in a workspace enabled environment
 =================================================================
--%>
<%@page import="java.util.Locale"%>
<%@page import="com.ibm.icu.util.TimeZone"%>
<%@page import="com.ibm.commerce.command.CommandContext" %>
<%@page import="com.ibm.commerce.tools.segmentation.SegmentDataBean"%>
<%@page import="com.ibm.commerce.context.content.ContentContext"%>
<%@page import="com.ibm.commerce.context.content.events.WorkspaceData"%>
<%@page import="com.ibm.commerce.context.preview.PreviewContext"%>
<%@page import="com.ibm.commerce.contentmanagement.objects.WorkspaceAccessBean" %>

<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://commerce.ibm.com/foundation" prefix="wcf" %>
<%@ taglib uri="http://commerce.ibm.com/base" prefix="wcbase" %>

<fmt:setLocale value="${WCParam.locale}" />
<%--<fmt:setBundle basename="com.ibm.commerce.stores.preview.properties.StorePreviewer" var="resources" />--%>

<%
	com.ibm.icu.text.SimpleDateFormat dateFormat = new com.ibm.icu.text.SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
	String timeZoneId = request.getParameter("timeZoneId");
	String previewStartTime = request.getParameter("start");
	String timeZoneDisplayName = "";
	String clientDateFormat = request.getParameter("dateFormat");
	String clientTimeFormat = request.getParameter("timeFormat");
	
	String localeStr = request.getParameter("locale");
	Locale locale = null;
	if (localeStr == null) {
		locale = Locale.getDefault();
	}
	else {
		String[] localeInfo = localeStr.split("_");
		if (localeInfo.length == 1) {
			locale = new Locale(localeInfo[0]);
		}
		else{
			locale = new Locale(localeInfo[0], localeInfo[1]);
		}
	}
	
	if (previewStartTime == null) {
	 	long currentMillis = System.currentTimeMillis();
		java.sql.Timestamp previewTime = new java.sql.Timestamp(currentMillis);
		if (timeZoneId !=null && !timeZoneId.equals("")) {
			TimeZone preferredTz = TimeZone.getTimeZone(timeZoneId);
			TimeZone serverTz = TimeZone.getTimeZone(TimeZone.getDefault().getID());
			int offset = preferredTz.getOffset(previewTime.getTime()) - serverTz.getOffset(previewTime.getTime());
			previewTime.setTime(previewTime.getTime() + offset);
		}
		previewStartTime = dateFormat.format(new java.util.Date(previewTime.getTime()));
	}
	
	if (timeZoneId !=null && !timeZoneId.equals("")) {
		timeZoneDisplayName = TimeZone.getTimeZone(timeZoneId).getDisplayName(locale);
	}
	
	String includedMemberGroupIds = request.getParameter("includedMemberGroupIds");
	/* determine member group names */
	String mbrGroupIncludedNames = "";
	CommandContext aCommandContext = (CommandContext)request.getAttribute("CommandContext");
	
	if (includedMemberGroupIds != null && !includedMemberGroupIds.equals("")) {
		int mbGrpIncludedCounter = 0;
		try {
			java.util.StringTokenizer st = new java.util.StringTokenizer(includedMemberGroupIds, ",");
			while (st.hasMoreElements()) {	

					SegmentDataBean segmentDataBean = new SegmentDataBean();
					segmentDataBean.setCommandContext(aCommandContext);
					segmentDataBean.setId(st.nextToken());
					segmentDataBean.populate();

					if (mbGrpIncludedCounter > 0) {
							mbrGroupIncludedNames += ", ";
					}
					String mbrGrpName = segmentDataBean.getSegmentDisplayName();
					if (mbrGrpName == null || mbrGrpName.equals("")) {
							mbrGrpName = segmentDataBean.getSegmentName();
					}
					mbrGroupIncludedNames += mbrGrpName;
					mbGrpIncludedCounter++;

			} // end while
		}catch(Exception e) {}
	}
	
	PreviewContext previewContext = (PreviewContext) aCommandContext.getContext(PreviewContext.CONTEXT_NAME);
	String previewTimestamp = (previewContext == null ? previewStartTime : dateFormat.format(previewContext.getTimestamp()));
	
	WorkspaceData workspaceData = ((ContentContext)aCommandContext.getContext(ContentContext.NAME)).getWorkspaceData();
	if (workspaceData != null) {
		WorkspaceAccessBean abWorkspace = new WorkspaceAccessBean().findByIdentifier(workspaceData.getWorkspaceName());
		pageContext.setAttribute("workspaceId", abWorkspace.getWorkspaceIdInEJBType().toString());
	}

	Integer workspaceStoreId = aCommandContext.getStoreId();
	
	pageContext.setAttribute("previewStartTime", previewStartTime);
	pageContext.setAttribute("previewTimestamp", previewTimestamp);
	pageContext.setAttribute("workspaceStoreId", workspaceStoreId);

%>

<%--<c:set var="dojoDir" value="${staticAssetContextRoot}/dojo18"/>
<c:set var="dojoFile" value="${dojoDir}/dojo/dojo.js"/>
<c:set var="dojolocale" value="${fn:replace(locale, '_' , '-')}" />
<c:set var="dojolocale" value="${fn:toLowerCase(dojolocale)}" />
<c:set var="dojoConfigParams" value="parseOnLoad: false, isDebug: false, useCommentedJson: true,locale: '${dojolocale}' "/>	

<script type="text/javascript" src="${dojoFile}" djConfig="${dojoConfigParams}"></script>--%>

<script type="text/javascript">

var dmartPreviewToken = '';
var workspacePreviewTokenXhrArgs = '';

function fetchPreviewToken() {


	var days = "0";
	var hours = "2";
	var dmartStoreId = "<c:out value='${CommandContext.storeId}'/>";
	var dmartStoreId2 = "<c:out value = '${workspaceStoreId}'/>";
	// Defaulting the value to 120 mins if the properties are not be found
	var token_life = ((((Number(days) * 24) + Number(hours)) * 60) > 0) ? ((Number(days) * 24) + Number(hours)) * 60 : 120;
	console.log("data--->"+dojo.toJson({<c:if test="${workspaceId != null && !empty workspaceId}">workspaceId: "<c:out value='${workspaceId}'/>",</c:if>
          					<c:if test="${!empty WCParam.start}">start: "<c:out value='${WCParam.start}'/>",</c:if>
							timeZoneId: "<c:out value='${WCParam.timeZoneId}'/>",							
							status: "<c:out value='${WCParam.status}'/>",
							invstatus: "<c:out value='${WCParam.invstatus}'/>",
							<c:if test="${!empty WCParam.includedMemberGroupIds}">includedMemberGroupIds: "<c:out value='${WCParam.includedMemberGroupIds}'/>",</c:if>
							tokenLife: token_life
							}));
	//dojo.xhrPost({
	workspacePreviewTokenXhrArgs = {
          url: 'https://'+window.location.hostname+'/wcs/resources/store/{workspaceStoreId}/previewToken',
          postData: dojo.toJson({<c:if test="${workspaceId != null && !empty workspaceId}">workspaceId: "<c:out value='${workspaceId}'/>",</c:if>
          					<c:if test="${!empty WCParam.start}">start: "<c:out value='${WCParam.start}'/>",</c:if>
							timeZoneId: "<c:out value='${WCParam.timeZoneId}'/>",							
							status: "<c:out value='${WCParam.status}'/>",
							invstatus: "<c:out value='${WCParam.invstatus}'/>",
							<c:if test="${!empty WCParam.includedMemberGroupIds}">includedMemberGroupIds: "<c:out value='${WCParam.includedMemberGroupIds}'/>",</c:if>
							tokenLife: token_life
							}),
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Credentials": "true" },
          handleAs: "text",
          method: "POST",
          withCredentials: true,
          load: function(result) {
              console.log(result);
              var data = JSON.parse(result);
              dmartPreviewToken = data.previewToken;
          }
          };
	//});
}
if(!dmartPreviewToken) {
	fetchPreviewToken();
}

</script>