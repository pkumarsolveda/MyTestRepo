(function(dmUIConfig) {
  $(document).ready(function () {

    $('.cart-details__scroll-secondary').css('max-height', '87px');
    // Make Favorite/Default Address
    $('.dashboard__address-manage-address').on('click', '.js-dashboard-favorite', function () {
      $(this).parents('li').toggleClass('favorite-address').siblings().removeClass('favorite-address');
      $(this).parents('li.favorite-address').find('.js-dashboard-favorite-icon').addClass('icon-heart');
      $(this).parents('li').siblings().find('.js-dashboard-favorite-icon').removeClass('icon-heart');
    });

    // Delete Notification
    $(document).on('click', '.js-notification-delete', function () {
      $(this).parents('li').fadeOut(600, function () {
        $(this).remove();
        if($('.dashboard-notification--list li').length === 0) {
          $('.resp-tab-content-active:visible').find('.dashboard-no-items').removeClass('js-hide-show');
        }
        if($('.dashboard-notification--list li').length <= 3) {
          $('.resp-tab-content-active .dashboard-notification--list').css('height', 'auto');
        }
        $('.resp-tab-content-active .dashboard-notification--list').scrollTop(1).perfectScrollbar('update');
      });
    });

    // Cancel order
    $('.button-order-cancel').on('click', function () {
      $(this).parents('.dashboard-myorder--details').addClass('active');
      $('#cancelOrderModal').show();
    });

    // Cancel order
    $('.js-order-cancel').on('click', function () {
      $('.dashbaord-myorder--undelivered.active .order-status-process').text('Canceled').addClass('canceled-order');
      $('.dashbaord-myorder--undelivered.active .button-order-cancel, .dashbaord-myorder--undelivered.active .my-order-date span').hide();
    });

    // Slot change
    $('.button-slot-change').on('click', function () {
      $('#dashboardSlotChange').show();
    });

    $('.js-amount-input').on('keyup', function () {
      // $(this).parent().addClass('active');
      $(this).parents('.payment-form').find('.total-payment-amount .js-recharge-amount').text($(this).val());
    });

/*    // Copy to Clipboard
    var clipboard = new Clipboard('.dashboard-notification--cta');

    clipboard.on('success', function(e) {
      e.trigger.text='COPIED!';
      e.clearSelection();
    });*/

    $('.js-dashboard-view-statement-cta').on('click', function () {
      $('.dashboard-box--body-content').slideDown(600, function () {
        $('.dashboard-myorder-scroll').scrollTop(0).perfectScrollbar('update');
      });
    });

    $('.js-invoice-print').on('click', function () {
      // var tableData = $('.js-print-invoice-wrap').html();
      // var data = '<button onclick="window.print()">Print this page</button>';
      // data += '<div id="div_print">';
      var data = $('.js-print-invoice-wrap').html();
      // data += '</div>';
      var myWindow = window.open('', '', 'width=800,height=600');
      myWindow.innerWidth = screen.width;
      myWindow.innerHeight = screen.height;
      myWindow.screenX = 0;
      myWindow.screenY = 0;
      myWindow.document.write(data);
      myWindow.focus();
      myWindow.print();
    });

    // loading my order history when user scroll down
    function dashboardMyorder () {
      if($('.dashboard-myorder-list:visible').length) {
        var count = 5; // display next 5 content
        var loadTotal = 15;
        var total = $('.dashboard-myorder-list li').length;
        var windowPos = $(window).scrollTop();
        var myorderHeight = $('.dashboard-myorder-list li').height();
        var loadMore = myorderHeight * total;

        var clone = $('.dashboard-myorder-list li:first-child').html(); // displaying dummy values from first child

        if(windowPos > loadMore) {

          if(total < loadTotal) {
            $('.dashboard-myorder-list').append('<li class="loading-more-text text-center">Loading...</li>');
            $('.dashboard-myorder-list .loading-more-text').fadeOut(1000, function () {
              // this.remove(); // it wont work in IE
              $('.dashboard-myorder-list .loading-more-text').remove();
              $('.dashboard-myorder-list li').animate({
                opacity: 1
              }, 700).css('display', 'table');
            });

            // load the dynamic value here 'clone'
            for(var i = 1; i < count; i++) {
              $('.dashboard-myorder-list').append($('<li class="dashboard-myorder--details dashbaord-myorder--undelivered" style="opacity: 0; display: none;">'+ clone +'</li>'));
            }
          }
          else {
            $('.dashboard-myorder-list .no-more-datas').remove();
            $('.dashboard-myorder-list').append('<li class="no-more-datas">&nbsp;</li><li class="no-more-datas alert alert-danger text-center">No more datas!</li>');
          }
        }
      }
    }

    if($('.my-dashboard').is(':visible')) {
      $(window).scroll( $.throttle( 250, dashboardMyorder ) );
    }

    $('.js-not-verified').on('click', function () {
      $('html, body').animate({
        scrollTop: 0
      }, 800);
      $('.js-not-verified-alert').fadeIn('slow');
    });

  });
}(DM_UI_CONFIG));
