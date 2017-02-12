'use strict';
(function(dmUIConfig) {
  var currentIndex = 0,
    totalThumbs, thumbnailHeight;

  function thumbsElement() {
    totalThumbs = $('.product-gallery__thumbnails .slides li').length;
    // thumbnailHeight = $('.page-carousel .carousel__thumbs li a').height();
    thumbnailHeight = 70;
  }

  function changeThumb(index) {
    if (index === 0) {
      $('.product-gallery__thumbnails .slides li a').removeClass('current');
      $('.product-gallery__thumbnails .slides #js-thumb-' + index).addClass('current');
      $('.product-gallery__thumbnails .product-gallery__thumbnails-prev').css('visibility', 'hidden');
    }
    else if (index === (totalThumbs - 5)) {
      $('.product-gallery__thumbnails .product-gallery__thumbnails-prev').css('visibility', 'visible');
      $('.product-gallery__thumbnails .product-gallery__thumbnails-next').css('visibility', 'hidden');
    }
    else {
      $('.product-gallery__thumbnails .slides li a').removeClass('current');
      $('.product-gallery__thumbnails .slides #js-thumb-' + index).addClass('current');
      $('.product-gallery__thumbnails .product-gallery__thumbnails-prev, .product-gallery__thumbnails .product-gallery__thumbnails-next').css('visibility', 'visible');
    }
    index++;
    $('.product-gallery__thumbnails .slides li a').removeClass('current');
    $('.product-gallery__thumbnails .slides #js-thumb-' + index).addClass('current');
    index--;
    $('.product-gallery__thumbnails .slides').animate({
      top: '-' + index * thumbnailHeight + 'px'
    }, 500);
  }


  function prevThumb() {
    var prevThumbPos = $('.product-gallery__thumbnails .slides li .current').parent().prev().length;
    console.log(prevThumbPos);
    if (prevThumbPos === 0) {
      $('.page-carousel .carousel-thumbs-prev').css('visibility', 'hidden');
    }
    return prevThumbPos ? (currentIndex--) + changeThumb(currentIndex) : false;
  }

  function nextThumb() {
    var nextThumbPos = $('.product-gallery__thumbnails .slides li .current').parent().next().length;
    console.log(nextThumbPos);
    // console.log(totalThumbs);
    if (currentIndex < (totalThumbs - 5)) {
      return nextThumbPos ? (currentIndex++) + changeThumb(currentIndex) : false;
    }
  }

  function changeProductImage() {
    var imagePosition = $(this).attr('rel');

    $('.product-gallery__thumbnails .slides a, .product-gallery__viewport .slides li').removeClass('active');
    $('.product-gallery__thumbnails .slides #js-thumb-' + imagePosition).toggleClass('active');
    $('.product-gallery__viewport .slides #js-product-img-' + imagePosition).toggleClass('active');
    $('.product-gallery__viewport .slides li').hide();
    $('.product-gallery__viewport .slides li.active').show();
    if ($('.product-gallery__thumbnails .slides li .current').parent().prev().length === 0) {
      $('.product-gallery__thumbnails .product-gallery__thumbnails-prev').css('visibility', 'hidden');
    }
    else {
      $('.product-gallery__thumbnails .product-gallery__thumbnails-prev').css('visibility', 'visible');
    }
  }

  $(document).ready(function () {
    thumbsElement();
    $('.product-gallery__thumbnails .slides li:first-child a').addClass('current').addClass('active');
    $('.product-gallery__thumbnails-prev a').click(prevThumb);
    $('.product-gallery__thumbnails-next a').click(nextThumb);
    $('.product-gallery__thumbnails .slides li a').click(changeProductImage);
  });
}(DM_UI_CONFIG));
