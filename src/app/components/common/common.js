window.onload = function(){
console.log($('.slick-items'));
  $('.slick-items').slick({
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 3
  });
};