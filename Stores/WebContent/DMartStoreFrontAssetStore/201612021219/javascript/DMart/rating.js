'use strict';
(function(dmUIConfig) {
  $(document).ready(function () {
    $('.user-review__ratings, .write-review .user-review__ratings').raty({
      starType: 'i',
      starOn: 'icon-star-on',
      starOff: 'icon-star-off'
    });

    $('.user-review .user-review__ratings').raty({
      starType: 'i',
      score: 3,
      starOn: 'icon-star-on',
      starOff: 'icon-star-off',
      readOnly: true
    });
  });
}(DM_UI_CONFIG));
