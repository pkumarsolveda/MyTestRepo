(function(dmUIConfig) {
  (function($) {
    $.fn.clickToggle = function(func1, func2) {
      var funcs = [func1, func2];
      this.data('toggleclicked', 0);
      this.click(function() {
        var data = $(this).data();
        var tc = data.toggleclicked;
        $.proxy(funcs[tc], this)();
        data.toggleclicked = (tc + 1) % 2;
      });
      return this;
    };
  }(jQuery));

  $(window).load(function () {
    $('.my-dashboard, .product-info-accordion-tabs').css('height', 'auto');
    // focusing on fields when DOM and document ready
    $('#formValidation #mobileNumber').focus();
    $('#formRegisterValidation #firstName').focus();
    $('#formValidation1 #logonId').focus();
    $('#formRegisterValidation1 #firstName').focus();
    $('#formLocationValidationModal #pinNumber').focus();
  });

  $(document).ready(function () {
    // OTP fields auto switch
    $('.otpInput').keyup( function (e) {
      if (this.value.length === 1 ) {
        $(this).next('.otpInput').focus();
      }
      else if (e.which === 8) {
        $(this).prev('.otpInput').focus();
      }
    });

    // Restrict user to enter alpha or other characters except numbers
    $('.form__input[type="tel"]').on('keypress', function (e) {
      if (e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57)) {
        return false;
      }
    });

    // Apply copied OTP number to other otp fields equally
    $(document).on('input', '.js-signin-otp .otpInput[rel^=otpInput]', function(e) {
      var text = $(this).val();
      if (text.length === 6) {
        for (var i=1; i<=text.length; i++) {
          $('.otpInput[rel^=otpInput]').eq(i-1).val(text[i-1]);
        }
      }
      else if (text.length > 1) {
        $(this).val(text[0]);
      }
    });

//    $('.signin__btn-otp').on('click', function (e) {
//      if($(this).parents('.form').find('.form__input').not(':disabled').val() !== '' && (!$(this).parents('.form').find('#mobileNumber').hasClass('error'))) {
//        $(this).parents('.form').find('.form__input.ignore').removeClass('ignore');
//        $('.js-form-btn-signin .button-primary, .js-signin-password, .signin__alternate').css('display', 'none');
//        $('.js-form-btn-signin .signin__btn-submit, .js-signin-otp').css('display', 'block');
//        $(this).parents('.form').find('#mobileNumber').attr('disabled', true);
//        e.preventDefault();
//      }
//    });

    $('.js-signin-alternate').clickToggle( function () {
     
    	$('#'+$(this).parents('form').attr('id')+' .js-signin-password input').attr('disabled', true);
        $(this).parents('form').find('.js-form-btn-signin .button-primary').css('display', 'none');
        $(this).parents('form').find('.js-form-btn-signin .signin__btn-otp').css('display', 'block');
        $(this).parents('.form__signin').find('.js-signin-password, .signin--forgot-password, .signin__register-link').fadeOut();
        $('#0_logonErrorMessage_GL').html('')
      DMAnalytics.events( DMAnalytics.Constants.Action.GuestCheckout,DMAnalytics.Constants.Action.GuestCheckout , document.title, 0,null );
    }, function () {
    	$('#'+$(this).parents('form').attr('id')+' .js-signin-password input').attr('disabled', false);
        $(this).parents('form').find('.js-form-btn-signin .button-primary').css('display', 'none');
        $(this).parents('form').find('.js-form-btn-signin .signin__btn-cta').css('display', 'block');
        $(this).parents('.form__signin').find('.js-signin-password, .signin--forgot-password, .signin__register-link').fadeIn();

    });

    $('.form__input--group .form__input').on('focus', function () {
      if(!$(this).parents('.form-control').hasClass('form__has-error')) {
        $(this).parents('.form__input--group').addClass('form__input--group-focus');
      }
    });

    $('.form__input--group .form__input').on('blur', function () {
      if(!$(this).parents('.form-control').hasClass('form__has-error')) {
        $(this).parents('.form__input--group').removeClass('form__input--group-focus');
      }
    });

    // Show password/Password Strength
    $('.progress-password').html('<ul class="progress-password--strips clearfix"><li class="progress-password--danger"></li><li class="progress-password--warning"></li><li class="progress-password--info"></li><li class="progress-password--success"></li></ul><div class="password-message"><span class="text-left">weak</span><span class="text-right">strong</span></div>');
    $('#showHide').on('click', function() {
      if ($('#showHidePassword').attr('type') === 'password') {
        $('#showHidePassword').attr('type', 'text');
      }
      else {
        $('#showHidePassword').attr('type', 'password');
      }
    });

    /**
     * Added for registration page
     */
    $('#showHide1').click(function() {
        if ($('#showHidePassword1').attr('type') === 'password') {
          $('#showHidePassword1').attr('type', 'text');
        }
        else {
          $('#showHidePassword1').attr('type', 'password');
        }
      });
    
    /**
     * Added for change password page
     */
    $('#showHideChangePwdChkBox').click(function() {
        if ($('#showHideChangePwd').attr('type') === 'password') {
          $('#showHideChangePwd').attr('type', 'text');
        }
        else {
          $('#showHideChangePwd').attr('type', 'password');
        }
      });
    
    
    $('.password-show-hide-field .form__input').on('keyup', function() {
      if($(this).val() !== '') {
        $(this).parent().find('.progress-password').show(100);
      }
      else {
        $(this).parent().find('.progress-password').hide(100);
      }
    });

/*    $('.js-resend-otp, .js-show-resend-otp').on('click', function () {
      $(this).parents('.header-dropdown--signin').find('.js-resend-otp-alert').fadeIn();
      $('html, body').animate({
        scrollTop: 0
      }, 800);
      $('.js-resend-otp-alert').fadeIn('slow');
      $(this).parents('.form').find('#formOtpValidation_error').html("");
    });*/

  });
}(DM_UI_CONFIG));
