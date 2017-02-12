<%=request.getParameter("msg") %>
<script type="text/javascript">
	function getMsg(){
		var msg = "<%=request.getParameter("msg") %>";
		AndroidFunction.gotMsg(msg);
	}
	getMsg();
</script>