
'use strict';
(function(dmUIConfig) {
  $.validator.addMethod(
    'regex',
    function(value, element, regexp) {
      var re = new RegExp(regexp);
      return this.optional(element) || re.test(value);
    },
    'Check your input!'
  );

  $.validator.addMethod(
  'expiryDateValidate',
  function (value, element) {
    var today = new Date();
    var startDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
    var expDate = value;
    var separatorIndex = expDate.indexOf('/');
    expDate = expDate.substr( 0, separatorIndex ) + '/1' + expDate.substr( separatorIndex );
    return Date.parse(startDate) <= Date.parse(expDate);
  },
  'Must be a valid Expiration Date.'
  );
  $(document).ready(function () {
	  
	  // no space validation for password
	  jQuery.validator.addMethod("noSpace", function(value, element) { 
		    return value.indexOf(" ") < 0 && value != ""; 
		  }, "Space are not allowed");
	  
	  $.validator.addMethod(
			    'pincodeNotServed',
			    function(value, element) {
			      console.log('pincode :'+value);
			      return checkValidPincode(value);
			    },
			    'Selected pin code not serviceable!'
	  );
	  
	  
    $('.js-search-field, .input-text-field, .promo-code-form input').on('keypress', function (key) {
      //console.log(key); // to check the value of charCode which the key is pressed
      if ((key.charCode < 97 || key.charCode > 122) && (key.charCode < 65 || key.charCode > 90) && (key.charCode !== 45) && (key.charCode !== 44) && (key.charCode !== 34) && (key.charCode !== 38) && (key.charCode !== 43) && (key.charCode !== 124) && (key.charCode !== 42) && (key.charCode !== 63) && (key.charCode !== 32) && (key.charCode !== 46) && (key.charCode !== 39) && (key.charCode !== 0) && (key.charCode < 47 || key.charCode > 58)) {
        return false;
      }
    });

    $('#formValidation').validate({
      errorElement: 'span',
      ignore: '.ignore',
      onkeyup: function(element) {
        if ($(element).val() && !($(element).attr('type') === 'email' || $(element).attr('type') === 'tel' || $(element).attr('type') === 'text')) {
          this.element(element);
        }
      },
      onfocusout: function(element) {
        if ($(element).val() || $(element).val() !== '') {
          this.element(element);
        }
      },
      rules: {
        logonId: {
          number: true,
          minlength: 10,
          maxlength: 10,
          regex: /^[7-9]+[0-9]*$/
        },
        otpNumber1: {
          number: true,
          minlength: 1,
          maxlength: 1
        },
        otpNumber2: {
          number: true,
          minlength: 1,
          maxlength: 1
        },
        otpNumber3: {
          number: true,
          minlength: 1,
          maxlength: 1
        },
        otpNumber4: {
          number: true,
          minlength: 1,
          maxlength: 1
        },
        otpNumber5: {
          number: true,
          minlength: 1,
          maxlength: 1
        },
        otpNumber6: {
          number: true,
          minlength: 1,
          maxlength: 1
        },
        email: {
          minlength: 6,
          maxlength: 150,
          regex: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/i
        }
      },
      groups: {
        name: 'otpNumber1 otpNumber2 otpNumber3 otpNumber4 otpNumber5 otpNumber6'
      },
      messages: {
        email: 'Oops! Invalid mail-id!',
        logonId: 'Enter your 10 digit mobile number',
        otpNumber1: 'Enter digits',
        otpNumber2: 'Enter digits',
        otpNumber3: 'Enter digits',
        otpNumber4: 'Enter digits',
        otpNumber5: 'Enter digits',
        otpNumber6: 'Enter digits'
      },
      errorPlacement: function (error, element) {
        if (element.attr('rel') === 'otpInput') {
          error.insertAfter('.otp-group');
        }
        else {
          error.insertAfter(element);
        }
      }
    });

    $('#formAccountValidation').validate({
      errorElement: 'span',
      onkeyup: function(element) {
        if ($(element).val()) {
          this.element(element);
        }
      },
      onfocusout: function(element) {
        if ($(element).val() || $(element).val() !== '') {
          this.element(element);
        }
      },
      rules: {
        mobileNumber: {
          number: true,
          minlength: 10,
          maxlength: 10,
          regex: /^[7-9]+[0-9]*$/
        },
        otpNumber1: {
          number: true,
          minlength: 1,
          maxlength: 1
        },
        otpNumber2: {
          number: true,
          minlength: 1,
          maxlength: 1
        },
        otpNumber3: {
          number: true,
          minlength: 1,
          maxlength: 1
        },
        otpNumber4: {
          number: true,
          minlength: 1,
          maxlength: 1
        },
        otpNumber5: {
          number: true,
          minlength: 1,
          maxlength: 1
        },
        otpNumber6: {
          number: true,
          minlength: 1,
          maxlength: 1
        }
      },
      groups: {
        name: 'otpNumber1 otpNumber2 otpNumber3 otpNumber4 otpNumber5 otpNumber6'
      },
      messages: {
        otpNumber1: 'Enter digits',
        otpNumber2: 'Enter digits',
        otpNumber3: 'Enter digits',
        otpNumber4: 'Enter digits',
        otpNumber5: 'Enter digits',
        otpNumber6: 'Enter digits'
      },
      errorPlacement: function (error, element) {
        if (element.attr('rel') === 'otpInput') {
          error.insertAfter('.otp-group ');
        }
        else {
          error.insertAfter(element);
        }
      }
    });
    
    $('#formUpdatePwdValidation').validate({
        errorElement: 'span',
        onkeyup: function(element) {
             if ($(element).val() && !($(element).attr('type') === 'text' || $(element).attr('type') === 'password')) {
                 this.element(element);
               }
        },
        onfocusout: function(element) {
          if ($(element).val()) {
            this.element(element);
          }
        },
        rules: {
            password: {
                 minlength: 6,
                 maxlength: 60,
                 noSpace: true
          }
        },
        messages: {
        	password: 'Minimum Password Length: 6 characters'
       }
      });


    $('#formRegisterValidation').validate({
      errorElement: 'span',
      onkeyup: function(element) {
        if ($(element).val() && !($(element).attr('type') === 'email' || $(element).attr('type') === 'tel' || $(element).attr('type') === 'password')) {
          this.element(element);
        }
      },
      onfocusout: function(element) {
        if ($(element).val() || $(element).val() !== '') {
          this.element(element);
        }
      },
      rules: {
        logonId: {
          number: true,
          minlength: 10,
          maxlength: 10,
          regex: /^[7-9]+[0-9]*$/
        },
        email1: {
          minlength: 6,
          maxlength: 150,
          regex: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/i
        },
        logonPassword: {
          minlength: 6,
          maxlength: 60,
          noSpace: true
        },
        firstName: {
          required: true,
          minlength: 1,
          maxlength: 128,
          regex: /^[A-Za-z\.\']+[A-Za-z\.\'\s]*$/
        },
        lastName: {
          required: true,
          minlength: 1,
          maxlength: 128,
          regex: /^[A-Za-z\.\']+[A-Za-z\.\'\s]*$/
        },
        tcAgree: {
          required: true
        }
      },
      messages: {
        email1: 'Enter a valid Email ID',
        //firstName: 'Enter only alphabets!',
        firstName: {
        	minlength: 'Enter minimum 3 alphabets!',
        	maxlength: 'Maximum limit exceeded!',
        	regex: 'Enter only alphabets!',
        	required: 'This field should not be empty!',
        },
        //lastName: 'Enter only alphabets!',
        lastName: {
          	minlength: 'Enter minimum 3 alphabets!',
          	maxlength: 'Maximum limit exceeded!',
          	regex: 'Enter only alphabets!',
          	required: 'This field should not be empty!',
        },
        logonId: 'Enter your 10 digit mobile number',
        logonPassword: 'Minimum Password Length: 6 characters',
        tcAgree: 'You must agree to our T&C to register'
      }
    });

    //
    var regformvalidator = $("#formRegisterValidation").data("validator");
    if (regformvalidator) {
    	regformvalidator.settings.onkeyup = false; // disable validation on keyup
    }
    
    $('#formLocationValidation').validate({
      errorElement: 'span',
      onkeyup: function(element) {
        if ($(element).val()) {
          this.element(element);
        }
      },
      onfocusout: function(element) {
        if ($(element).val() || $(element).val() !== '') {
          this.element(element);
        }
      },
      rules: {
        pinNumber: {
          minlength: 1
        }
      },
      messages: {
        pinNumber: 'This field is required!'
      }
    });

    var validator = $('#formLocationValidationModal').validate({
      errorElement: 'span',
      onkeyup: function(element) {
        if ($(element).val()) {
          this.element(element);
        }
      },
      onfocusout: function(element) {
        if ($(element).val() || $(element).val() !== '') {
          this.element(element);
        }
      },
      rules: {
        pinNumberModal: {
          minlength: 1
        }
      },
      messages: {
        pinNumberModal: 'This field is required!'
      }
    });
    $('.auto-detecttext').click(function() {
    	 validator.resetForm();
    });
    $('#forgotValidation').validate({
      errorElement: 'span',
      ignore: '.ignore',
      onkeyup: function(element) {
        if ($(element).val()) {
          this.element(element);
        }
      },
      onfocusout: function(element) {
        if ($(element).val() || $(element).val() !== '') {
          this.element(element);
        }
      },
      rules: {
    	  logonId: {
          number: true,
          minlength: 10,
          maxlength: 10,
          regex: /^[7-9]+[0-9]*$/
        }
      },
      messages: {
    	  logonId: 'Enter your 10 digit mobile number!'
      }
    });

    $('#footerNewsletter').validate({
      errorElement: 'span',
      onkeyup: function(element) {
        if ($(element).val() && !($(element).attr('type') === 'email')) {
          this.element(element);
        }
      },
      onfocusout: function(element) {
        if ($(element).val() || $(element).val() !== '') {
          this.element(element);
        }
      },
      rules: {
        newsletter: {
          minlength: 6,
          maxlength: 150,
          regex: /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i
        }
      },
      messages: {
        newsletter: 'Oops! Invalid mail-id!'
      }
    });

    $('#formReviewValidation').validate({
      errorElement: 'span',
      onkeyup: function(element) {
        if ($(element).val() && $(element).val() === '') {
          this.element(element);
        }
      },
      onfocusout: function(element) {
        if ($(element).val() || $(element).val() !== '') {
          this.element(element);
        }
      },
      rules: {
        writeReviewTitle: {
          minlength: 3,
          maxlength: 150,
          regex: /^[A-Za-z]+[A-Za-z\s]*$/
        },
        writeReviewDescription: {
          minlength: 10,
          maxlength: 320,
          regex: /^[A-Za-z]+[A-Za-z\s]*$/
        }
      },
      messages: {
        writeReviewTitle: 'Fill atleast 3 characters',
        writeReviewDescription: 'Fill atleast 10 characters'
      }
    });

    //moving to displayUserCartHelper.js
//    $('#formCoupon').validate({
//      errorElement: 'span',
//      onkeyup: function(element) {
//        if ($(element).val() && $(element).val() === '') {
//          this.element(element);
//        }
//      },
//      onfocusout: function(element) {
//        if ($(element).val() || $(element).val() !== '') {
//          this.element(element);
//        }
//      },
//      rules: {
//        promeCode: {
//          minlength: 6,
//          maxlength: 10,
//          regex: /^[A-Za-z]+[A-Za-z0-9\s]*$/
//        }
//      },
//      messages: {
//        promeCode: 'Enter min 6 and max 10 alphanumeric!'
//      },
//      submitHandler: function(form) {
//        $(form).find('.input-group').hide();
//        $('.promo-code--title').hide();
//        $('.js-coupon-applied, .js-coupon-code-applied').fadeIn().css('display', 'block');
//        form.resetForm();
//      }
//    });
    $('#formServiceCenter').validate({
      errorElement: 'span',
      ignore: '.ignore',
      onkeyup: function(element) {
        if ($(element).val()) {
          this.element(element);
        }
      },
      onfocusout: function(element) {
        if ($(element).val() || $(element).val() !== '') {
          this.element(element);
        }
      },
      rules: {
        addressPincode: {
          minlength: 1,
          maxlength: 250,
          regex: /^[A-Za-z0-9]+[A-Za-z0-9\s]*$/
        }
      },
      messages: {
        addressPincode: 'Allowed only alphanumeric!'
      }
    });

    //moving to displayUserCartHelper.js
//    $('#formShareCartValidation').validate({
//      errorElement: 'span',
//      ignore: '.ignore',
//      onkeyup: function(element) {
//        if ($(element).val() && !($(element).attr('type') === 'email' || $(element).attr('type') === 'tel')) {
//          this.element(element);
//        }
//      },
//      onfocusout: function(element) {
//        if ($(element).val() || $(element).val() !== '') {
//          this.element(element);
//        }
//      },
//      rules: {
//        mobileNumber: {
//          number: true,
//          minlength: 10,
//          maxlength: 10,
//          regex: /^[7-9]+[0-9]*$/,
//          require_from_group: [1, '.requiredPhoneEmail']
//        },
//        email: {
//          minlength: 6,
//          maxlength: 150,
//          regex: /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
//          require_from_group: [1, '.requiredPhoneEmail']
//        }
//      },
//      groups: {
//        name: 'mobileNumber email'
//      },
//      messages: {
//        mobileNumber: 'Fill anyone field with proper value!',
//        email: 'Fill anyone field with proper value!'
//      },
//      errorPlacement: function (error, element) {
//        if (element.attr('rel') === 'requirePhoneEmail') {
//          error.insertAfter('.share-cart-form .form-control:last-child input');
//        }
//        else {
//          error.insertAfter(element);
//        }
//      },
//      submitHandler: function(form) {
//        //$('#ShareCartModal').fadeIn();
//      }
//    });
    
    /**
     * 
     */
    $('#formRegisterValidation1').validate({
        errorElement: 'span',
        onfocusout: function(element) {
          if ($(element).val()) {
            this.element(element);
          }
        },
        rules: {
        	logonId: {
            number: true,
            minlength: 10,
            maxlength: 10
          },
          email1: {
            minlength: 6,
            maxlength: 150,
            regex: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/i
          },
          logonPassword: {
            minlength: 6,
            maxlength: 60,
            noSpace: true
          },
          firstName: {
            required: true,
            minlength: 1,
            maxlength: 128,
            regex: /^[a-zA-Z\.\'\s]*$/
          },
          lastName: {
            required: true,
            minlength: 1,
            maxlength: 128,
            regex: /^[a-zA-Z\.\'\s]*$/
          },
          tcAgree: {
              required: true
            }
        },
        messages: {
          email1: 'Enter a valid Email ID',
         // firstName: 'Enter only alphabets!',
          firstName: {
          	minlength: 'Enter minimum 3 alphabets!',
          	maxlength: 'Maximum limit exceeded!',
          	regex: 'Enter only alphabets!',
          	required: 'This field should not be empty!',
          },
          //lastName: 'Enter only alphabets!',
          lastName: {
          	minlength: 'Enter minimum 3 alphabets!',
          	maxlength: 'Maximum limit exceeded!',
          	regex: 'Enter only alphabets!',
          	required: 'This field should not be empty!',
          },
          logonId: 'Enter your 10 digit mobile number',
          logonPassword: 'Minimum Password Length: 6 characters',
          tcAgree: 'You must agree to our T&C to register'
        }
      });
    
    //
    var regformvalidator = $("#formRegisterValidation1").data("validator");
    if (regformvalidator) {
    	regformvalidator.settings.onkeyup = false; // disable validation on keyup
    }
    
    
    $('#guestOrderDetails').validate({
      errorElement: 'span',
      onkeyup: function(element) {
        if (!$(element).attr('type') === 'tel') {
          this.element(element);
        }
      },
      onfocusout: function(element) {
        if ($(element).val() || $(element).val() !== '') {
          this.element(element);
        }
      },
      rules: {
        guestMobileNumber: {
          minlength: 10,
          maxlength: 10,
          number: true,
          regex: /^[7-9]+[0-9]*$/
        },
        guestOrderId: {
          required:{
        	  depends:function(){
                  $(this).val($.trim($(this).val()));
                  return true;
              }
          },
          minlength: 5,
          regex: /^[0-9]*$/, //fix for AE-14619
          maxlength: 10,
          number: true
        }
      },
      messages: {
        guestMobileNumber: 'Enter valid mobile number!',
        guestOrderId: 'Order ID should be min 5 or max 10 numeric!'
      }
    });
    
    /* 
     * Changes for integration
     * names changed to logonId,logonPassword
     * 
     * New id #formValidation1 added
     */
    $('#formValidation1').validate({
        errorElement: 'span',
        ignore: '.ignore',
        onkeyup: function(element) {
            if ($(element).val() && !($(element).attr('type') === 'email' || $(element).attr('type') === 'tel' || $(element).attr('type') === 'text')) {
              this.element(element);
            }
          },
          onfocusout: function(element) {
            if ($(element).val() || $(element).val() !== '') {
              this.element(element);
            }
          },
        rules: {
         logonId: {
            number: true,
            minlength: 10,
            maxlength: 10,
            regex: /^[7-9][0-9]{9}$/ //Validation for mob no. starting with 7,8 or 9
          },
          otpNumber1: {
            number: true,
            minlength: 1,
            maxlength: 1
          },
          otpNumber2: {
            number: true,
            minlength: 1,
            maxlength: 1
          },
          otpNumber3: {
            number: true,
            minlength: 1,
            maxlength: 1
          },
          otpNumber4: {
            number: true,
            minlength: 1,
            maxlength: 1
          },
          otpNumber5: {
            number: true,
            minlength: 1,
            maxlength: 1
          },
          otpNumber6: {
            number: true,
            minlength: 1,
            maxlength: 1
          },
          email: {
            minlength: 6,
            maxlength: 150,
            regex: /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i
          }
        },
        groups: {
          name: 'otpNumber1 otpNumber2 otpNumber3 otpNumber4 otpNumber5 otpNumber6'
        },
        messages: {
          email: 'Oops! Invalid mail-id!',
          //logonId: 'Enter 10 digits!', Changes it to a more appropreate msg as per the validation
          logonId: 'Invalid Mobile Number!',
          otpNumber1: 'Enter digits',
          otpNumber2: 'Enter digits',
          otpNumber3: 'Enter digits',
          otpNumber4: 'Enter digits',
          otpNumber5: 'Enter digits',
          otpNumber6: 'Enter digits'
        },
        errorPlacement: function (error, element) {
          if (element.attr('rel') === 'otpInput') {
            error.insertAfter('.otp-group');
          }
          else {
            error.insertAfter(element);
          }
        }
      });
    $('#formNewAddress').validate({
        errorElement: 'span',
        onkeyup: function(element) {
          if ($(element).val() && !($(element).attr('type') === 'tel')) {
            this.element(element);
          }
        },
        onfocusout: function(element) {
          if ($(element).val() || $(element).val() !== '') {
            this.element(element);
          }
        },
        rules: {
          newName: {
          minlength: 1,
            maxlength: 150
          },
          newLandmark: {
          minlength: 1,
            maxlength: 118
          },
          mobileNumber: {
            number: true,
            minlength: 10,
          maxlength: 10,
          regex: /^[7-9]+[0-9]*$/
          },
          newAlternateNumber: {
            number: true,
            minlength: 10,
          maxlength: 10,
          regex: /^[7-9]+[0-9]*$/
          },
          newCity: {
          minlength: 1,
            maxlength: 250,
            regex: /^[A-Za-z]+[A-Za-z\s]*$/
          },
          newState: {
          minlength: 1,
            maxlength: 250,
            regex: /^[A-Za-z]+[A-Za-z\s]*$/
          },
          newPincode: {
            minlength: 6,
            maxlength: 7,
            pincodeNotServed : true
          },
          newAddress: {
          minlength: 1,
            maxlength: 250
          }
        },
        messages: {
          newName: 'Enter only alphabets',
          mobileNumber: 'Please enter a 10 digit mobile number',
          newCity: 'Enter only alphabets',
          newState: 'Enter only alphabets',
          //newPincode: 'Please enter a valid pin code.',
          newPincode:  {
              number: 'Please enter a valid pin code.',
              minlength: 'Please enter a valid pin code.',
              maxlength: 'Please enter a valid pin code.',
              required: 'Please enter a valid pin code.',
              pincodeNotServed : 'Selected pin code not serviceable!'
            },
          newAddress: 'Address cannot be empty'
        }
      });
    $('#formNewAddressModal').validate({
        errorElement: 'span',
        onkeyup: function(element) {
        if (!$(element).attr('type') === 'tel') {
            this.element(element);
          }
        },
        onfocusout: function(element) {
          if ($(element).val() || $(element).val() !== '') {
            this.element(element);
          }
        },
        rules: {
          newName: {
          minlength: 1,
            maxlength: 128
          },
          newLandmark: {
          minlength: 1,
            maxlength: 118
          },
          newMobileNumber: {
            number: true,
            minlength: 10,
          maxlength: 10,
          regex: /^[7-9]+[0-9]*$/
          },
          newAlternateNumber: {
            number: true,
            minlength: 10,
            maxlength: 10
          },
          newCity: {
          minlength: 1,
            maxlength: 250,
            regex: /^[A-Za-z]+[A-Za-z\s]*$/
          },
          newState: {
          minlength: 1,
            maxlength: 250,
            regex: /^[A-Za-z]+[A-Za-z\s]*$/
          },
          newPincode: {
          number: true,
            minlength: 6,
            maxlength: 7,
            pincodeNotServed : true
            
          },
          newAddress: {
          minlength: 1,
            maxlength: 250
          }
        },
        messages: {
          newName: {
        	  minlength: 'Enter minimum 3 alphabets!',
        	  maxlength: 'Maximum limit exceeded!',
          },
          mobileNumber: 'Please enter a 10 digit mobile number',
          newMobileNumber: 'Please enter a 10 digit mobile number',
          newCity: 'Enter only alphabets',
          newState: 'Enter only alphabets',
          newPincode:  {
              number: 'Please enter a valid pin code.',
              minlength: 'Please enter a valid pin code.',
              maxlength: 'Please enter a valid pin code.',
              required: 'Please enter a valid pin code.',
              pincodeNotServed : 'Selected pin code not serviceable!'
            },
          newAddress: 'Address cannot be empty'
        }
      });
    $('#formEditAddress').validate({
        errorElement: 'span',
        onkeyup: function(element) {
        if (!$(element).attr('type') === 'tel') {
            this.element(element);
          }
        },
        onfocusout: function(element) {
          if ($(element).val() || $(element).val() !== '') {
            this.element(element);
          }
        },
        rules: {
          editName: {
            minlength: 1,
            maxlength: 128
          },
          editLandmark: {
            minlength: 1,
            maxlength: 118
          },
          editMobileNumber: {
            number: true,
            minlength: 10,
          maxlength: 10,
          regex: /^[7-9]+[0-9]*$/
          },
          editAlternateNumber: {
            number: true,
            minlength: 10,
            maxlength: 10
          },
          editCity: {
            minlength: 1,
            maxlength: 250,
            regex: /^[A-Za-z]+[A-Za-z\s]*$/
          },
          editState: {
            minlength: 1,
            maxlength: 250,
            regex: /^[A-Za-z]+[A-Za-z\s]*$/
          },
          editPincode: {
          number: true,
            minlength: 6,
            maxlength: 7,
            pincodeNotServed : true
          },
          editAddress: {
            minlength: 1,
            maxlength: 250
          }
        },
        messages: {
          editName: {
        	  minlength: 'Enter minimum 3 alphabets!',
        	  maxlength: 'Maximum limit exceeded!'
          },
          editMobileNumber: 'Enter valid mobile number!',
          editCity: 'Enter proper city name!',
          editState: 'Enter proper state name!',
          //editAddress: 'Enter Address!',
          editAddress:{
          	minlength: 'Enter Address!',
        	maxlength: 'Maximum limit exceeded!', 
          },
          editPincode:  {
                  number: 'Please enter a valid pin code.',
                  minlength: 'Please enter a valid pin code.',
                  maxlength: 'Please enter a valid pin code.',
                  required: 'Enter Pincode',
                  pincodeNotServed : 'Selected pin code not serviceable!'
          }
        }
      });
 // Dashboard - Personal Information
    $('#dashboardPersonalDetailsValidation').validate({
      errorElement: 'span',
      onkeyup: function(element) {
        if ($(element).val() && !($(element).attr('type') === 'email' || $(element).attr('type') === 'tel')) {
          this.element(element);
          if($('#email-error').is(":visible")){
        	  $('#email-error').css('position','static');
          }
        }
      },
      onfocusout: function(element) {
        if ($(element).val() || $(element).val() !== '') {
          this.element(element);
          if($('#email-error').is(":visible")){
        	  $('#email-error').css('position','static');
          }
        }
      },
      rules: {
    	  editMobileNumber: {
          number: true,
          required:true,
          minlength: 10,
          maxlength: 10,
          regex: /^[7-9]+[0-9]*$/
        },
        email: {
          minlength: 6,
          maxlength: 150,
          regex: /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i
        },
        firstName: {
          required:true,
          minlength: 1,
          maxlength: 128,
          regex: /^[A-Za-z\.\']+[A-Za-z\.\'\s]*$/
        },
        lastName: {
          required:true,
          minlength: 1,
          maxlength: 128,
          regex: /^[A-Za-z\.\']+[A-Za-z\.\'\s]*$/
        }
      },
      messages: {
        email: 'This Email ID is invalid',
        //firstName: 'Enter only alphabets!',
        firstName: {
        	minlength: 'Enter minimum 3 alphabets!',
        	maxlength: 'Maximum limit exceeded!',
        	regex: 'Enter only alphabets!',
        	required: 'This field should not be empty',
        },
        //lastName: 'Enter only alphabets!',
        lastName: {
        	minlength: 'Enter minimum 3 alphabets!',
        	maxlength: 'Maximum limit exceeded!',
        	regex: 'Enter only alphabets!',
        	required: 'This field should not be empty',
        },
        editMobileNumber:{
        	required: 'This field should not be empty',
        	editMobileNumber : 'Please enter your 10 digit mobile number',
        	minlength: 'Please enter your 10 digit mobile number',
        	maxlength: 'Please enter your 10 digit mobile number',
        	regex: 'Please enter your 10 digit mobile number',
        } 
      }
    });

    // Contact form
    $('#formContactValidation').validate({
      errorElement: 'span',
      onkeyup: function(element) {
        if (!$(element).attr('type') === 'email') {
          this.element(element);
        }
      },
      onfocusout: function(element) {
        if ($(element).val() || $(element).val() !== '') {
          this.element(element);
        }
      },
      rules: {
        numberContact: {
          number: true,
          minlength: 10,
          maxlength: 10
        },
        emailContact: {
          minlength: 6,
          maxlength: 150,
          regex: /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i
        },
        nameContact: {
          minlength: 1,
          maxlength: 150,
          regex: /^[A-Za-z]+[A-Za-z\s]*$/
        },
        subjectContact: {
          minlength: 1,
          maxlength: 150,
          regex: /^[A-Za-z]+[A-Za-z\s]*$/
        },
        messageContact: {
          minlength: 10,
          maxlength: 250,
          regex: /^[A-Za-z]+[A-Za-z0-9.!()-_?,\s]*$/,
          required: true
        }
      },
      messages: {
        emailContact: 'Oops! Invalid mail-id!',
        nameContact: 'Enter only alphabets!',
        subjectContact: 'Enter only alphabets!',
        numberContact: 'Enter 10 digits!',
        messageContact: 'Enter min 10 or max 250 characters!'
      }
    });
    // Dashboard - Change Password
    $('#dashboardChangePasswordValidation').validate({
      errorElement: 'span',
      onkeyup: function(element) {
        if ($(element).val() && !($(element).attr('type') === 'password')) {
          this.element(element);
        }
      },
      onfocusout: function(element) {
        if ($(element).val() || $(element).val() !== '') {
          this.element(element);
        }
      },
      rules: {
        password: {
          minlength: 6,
          maxlength: 60,
          noSpace: true
        },
        oldPassword: {
            minlength: 6,
            maxlength: 60,
            noSpace: true
          }
      },
      messages: {
    	  password:  {
    		  minlength: 'Minimum Password Length: 6 characters',
    		  maxlength : 'Maximum Password Length: 60 characters',
    		  noSpace : 'Password cannot be all spaces'
  	  	  },
  	  	  oldPassword:  {
  		  minlength: 'Minimum Password Length: 6 characters',
  		  maxlength : 'Maximum Password Length: 60 characters',
  		  noSpace : 'Password cannot be all spaces'
	  	  }
        }
    });

    // My List set alert
    $('#formSetAlert').validate({
      errorElement: 'span',
      onkeyup: function(element) {
        if ($(element).val() && !($(element).attr('type') === 'password')) {
          this.element(element);
        }
      },
      onfocusout: function(element) {
        if ($(element).val() || $(element).val() !== '') {
          this.element(element);
        }
      },
      rules: {
        setAlertDate: {
          required: true,
          date: true
        }
      },
      messages: {
        setAlertDate: 'Enter a valid date!'
      }

    });
    
  //Credit Card Payment validation
   $('#formCCvalidation').validate({
      errorElement: 'span',
      onkeyup: function(element) {
          if ($(element).val() && !($(element).attr('type') === 'tel' || $(element).attr('type') === 'password')) {
          this.element(element);
        }
      },
      onfocusout: function(element) {
        if ($(element).val() || $(element).val() !== '') {
          this.element(element);
        }
      },
      rules: {
        creditCardNumber: {
          required: true,
          creditcard: true
        },
        creditExpiryDate: {
          required: true
        },
        creditCardCvv: {
          required: true,
          number: true,
          minlength: 3,
          maxlength: 4,
          regex: /^(?!0{3})[0-9]*$/
        },
        creditCardName: {
          required: true,
          minlength: 3,
          maxlength: 70,
          regex: /^[a-zA-Z'\s]*$/
        },
        rechargeInput: {
          number: true,
          minlength: 1,
          maxlength: 8
        }
      },
      messages: {
		creditCardNumber: {
			creditcard: 'You have entered an incorrect card number. Please enter a valid card number',
	      	required: 'This field cannot be empty',
	    },
        //creditCardNumber: 'Enter your 14 digit card number',
	    creditExpiryDate: {
	      	required: 'This field cannot be empty',
	    },
	    creditCardCvv: {
	      	required: 'This field cannot be empty',
	        number: 'Invalid Entry',
	        minlength: 'Invalid Entry',
	        maxlength: 'Invalid Entry',
	        regex: 'Invalid Entry'
	    },
        //creditCardCvv: 'Invalid Entry',
	    creditCardName: {
	      	required: 'This field cannot be empty',
	        regex: 'Enter only alphabets'
	    },
        //creditCardName: 'Enter only alphabets',
        rechargeInput: 'Enter atleast 1 digits or max 8 digits!'
      }
    });

    // Debit Card Payment validation
    $('#formDCvalidation').validate({
      errorElement: 'span',
      onkeyup: function(element) {
          if ($(element).val() && !($(element).attr('type') === 'tel' || $(element).attr('type') === 'password')) {
            this.element(element);
          }
        },

      onfocusout: function(element) {
        if ($(element).val() || $(element).val() !== '') {
          this.element(element);
        }
      },
      rules: {
        debitCardNumber: {
          required: true,
          creditcard: true
        },
        debitExpiryDate: {
          required: true
        },
        debitCardCvv: {
          required: true,
          number: true,
          minlength: 3,
          maxlength: 4,
          regex: /^(?!0{3})[0-9]*$/
        },
        debitCardName: {
          required: true,
          minlength: 3,
          maxlength: 70,
          regex: /^[a-zA-Z'\s]*$/
        },
        rechargeInput: {
          number: true,
          minlength: 1,
          maxlength: 8
        }
      },
      messages: {
    	debitCardNumber: {
  			creditcard: 'You have entered an incorrect card number. Please enter a valid card number',
  	      	required: 'This field cannot be empty',
  	    },
  	    // debitCardNumber: 'Something is wrong!',
  	    debitExpiryDate: {
  	      	required: 'This field cannot be empty',
  	    },
  	    debitCardCvv: {
  	      	required: 'This field cannot be empty',
  	        number: 'Invalid Entry',
  	        minlength: 'Invalid Entry',
  	        maxlength: 'Invalid Entry',
  	        regex: 'Invalid Entry'
  	    },
        //debitCardCvv: 'Something is wrong!',
  	    debitCardName: {
  	      	required: 'This field cannot be empty',
  	        regex: 'Enter only alphabets'
  	    },
        //debitCardName: 'Something is wrong!',
        rechargeInput: 'Enter atleast 1 digits or max 8 digits!'
      }
    });


    // Debit ATM Card Payment validation
    $('#formDebitATMvalidation').validate({
      errorElement: 'span',
      onfocusout: function(element) {
        if ($(element).val() || $(element).val() !== '') {
          this.element(element);
        }
      },
      rules: {
        rechargeInput: {
          number: true,
          minlength: 1,
          maxlength: 8
        }
      },
      messages: {
        rechargeInput: 'Enter atleast 1 digits or max 8 digits!'
      }
    });

    // Internet Banking Payment validation
    $('#formNetBankvalidation').validate({
      errorElement: 'span',
      onfocusout: function(element) {
        if ($(element).val() || $(element).val() !== '') {
          this.element(element);
        }
      },
      rules: {
        rechargeInput: {
          number: true,
          minlength: 1,
          maxlength: 8
        }
      },
      messages: {
        rechargeInput: 'Enter atleast 1 digits or max 8 digits!'
      }
    });
    function changeCardType(cardType, thisVal) {
        if (!thisVal.hasClass('valid')) {
          thisVal.parents('.form-control').find('.payment-card-type .dmart-sprite').css({
            opacity: 0,
            top: '35px'
          });
          thisVal.parents('.form-control').find('.payment-card-type .js-' + cardType + '-card').css({
            opacity: 1,
            top: 0
          });
        }
        else {
          thisVal.parents('.form-control').find('.payment-card-type .sprite-card').css({
            opacity: 0,
            top: '35px'
          });
          thisVal.parents('.form-control').find('.payment-card-type .js-' + cardType + '-card').css({
            opacity: 1,
            top: 0
          });
        }
      }
    $.fn.toggleInputError = function(erred) {
        this.toggleClass('error', erred);
        if(erred) {
          this.parent().find('span.error').remove();
          if(this.attr('name')=='creditCardCvv' || this.attr('name')=='debitCardCvv'){
        	  this.parent().append('<span class="error" style="display: inline;">Invalid Entry</span>');
          }else{
        	  this.parent().append('<span class="error" style="display: inline;">Something is wrong!</span>');
          }
        }
        else {
          this.parent().find('span.error').remove();
        }
        return this;
      };


     $(document).on('focus keyup blur', '.payment-form:visible .cc-number', function() {
        var $thisVal = $(this);
        $thisVal.payment('formatCardNumber');
        var cardType = $.payment.cardType($thisVal.val());
        changeCardType(cardType, $thisVal);
      });

      $(document).on('keyup blur', '.payment-form:visible .cc-exp', function() {
        $(this).payment('formatCardExpiry');
      });
      $(document).on('blur', '.payment-form:visible .cc-exp', function() {
          $(this).payment('formatCardExpiry');
          var cardExpiryVal = $(this).payment('cardExpiryVal');
          if(isNaN(cardExpiryVal.year) && isNaN(cardExpiryVal.month)){
        	  //No inputs entered
          }else{
        	  $(this).toggleInputError(!$.payment.validateCardExpiry($(this).payment('cardExpiryVal')));
          }
          
        });

        $(document).on('keyup blur', '.payment-form:visible .cc-cvc', function() {
        $(this).payment('formatCardCVC');
        var cardType = $.payment.cardType($('.cc-number:visible').val()); //new
        if($(this).val() != null && $(this).val() != undefined && $(this).val() != ""){
        	$(this).toggleInputError(!$.payment.validateCardCVC($(this).val(), cardType));
        }
      });

      $('.select-other-banks').on('change', function() {
        $('.bank-list input').removeAttr('checked');
      });

      $('.bank-list input').on('click', function() {
        $('.select-other-banks option').removeAttr('selected');
        $('.select-other-banks option:first').attr('selected', 'selected');
      });
      
	    var originalMargin = $('.landing').css('margin-top');
	  	var originalMarginBody = $('body').css('margin-top');
	  	if($('.emergency-note > *').length > 0){
	  		var emergencyNoteHeight = $('.emergency-note')[0].clientHeight;
	  		var newLandingMargin = parseInt(originalMargin) + parseInt(emergencyNoteHeight);
	  		var newLandingMarginBody = parseInt(originalMarginBody) + parseInt(emergencyNoteHeight);
	  		$('.landing').css('margin-top',newLandingMargin);
	  		$('body').css('margin-top',newLandingMarginBody);
	  	}

    
  });
}(DM_UI_CONFIG));
