
<script type="text/javascript">
	var JSONOnPage = {};
		
	$(document).ready(function() {
		    
    	$(document).bind(
        'dmart.cache.validator.completed',
        function(e) {
			var userType = ${anonymousUser};
			var JSONdata = {};
			
			//If not in cart page
			if($('#cartDetails').length==0){
				CartHelper.init();		    
			}
			
			if(userType){
					$('.cart-icon .badge').html('0');
					$('.cart-price-label .header-icon-rupee').after('0')
			}
		});
		
	});
</script>

<div class="cart-wrap">
<div class="cart-icon">
  <i class="icon-cart-added"></i>
  <span class="badge"></span>
</div>

<a class="dropdown-minicart" href="#_" title="Cart">
	<span class="cart-price-label"><i class="header-icon-rupee icon-rupees">
		</i><i class="header-icon-caret-down icon-caret-down"></i>
	</span>
</a>
<div class="header-dropdown header-dropdown--minicart" >


</div>

</div>
