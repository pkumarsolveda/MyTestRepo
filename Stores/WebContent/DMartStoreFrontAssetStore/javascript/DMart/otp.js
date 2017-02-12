/**
 * 
 */

(function(dmUIConfig) {
  $(document).ready(function () {
	  
	$('#otp_button').on('click', function() { 
		if($('#formAccountValidation').valid()){
          var otp = $("#otpNumber1").val() + $("#otpNumber2").val() + $("#otpNumber3").val() + $("#otpNumber4").val() + $("#otpNumber5").val() + $("#otpNumber6").val();
          $("#otpCode").val(otp);
          $('#formAccountValidation').submit();
        }
    }); 
	  
	  
  });
}(DM_UI_CONFIG));
  