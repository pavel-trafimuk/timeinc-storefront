(function($) {

var $window = $(window),
    scrollTop = 0,
    viewHeight = $window.height();

function is_onscreen($img) {
  var scrollBottom = scrollTop + viewHeight,
      img_top = $img.offset().top,
      img_bottom = img_top + $img.height();

  return img_bottom > scrollTop && img_top < scrollBottom;
}
function show_img($img) {
  var img_url = $img.data("realSrc"),
      real_img;

  if ($img.attr('src') == img_url) return;

  real_img = new Image();
  real_img.src = img_url;
  
  function show_real_img() {
    $img.attr('src', img_url);
  }

  if (real_img.complete) show_real_img();
  else $(real_img).on("load", show_real_img);
}
function hide_img($img) {
  var img_url = $img.data("placeholderSrc");
  if ($img.attr('src') == img_url) return;

  $img.attr('src', img_url);
}

$.fn.imgPlaceholder = function() {
  this.each(function() {
    var $img = $(this),
        real_url = $img.data("realSrc"),
        real_img;

    if (!real_url) return;
    $img.data("placeholderSrc", $img.attr("src"));
    $img.addClass("imgPlaceholder-trackScrolling");
    
    setTimeout(function() {
      if (is_onscreen($img)) {
        show_img($img);
      }
    });
    
  });
  return this;
}

$window.on("scroll", function() {
  scrollTop = $window.scrollTop();
  console.log("SCROLL EVENT");

  $(".imgPlaceholder-trackScrolling").each(function() {
    var $img = $(this),
        img_url = "";
    
    setTimeout(function() {
      if (is_onscreen($img)) {
        show_img($img)
      }
      else {
        hide_img($img);
      }
      console.log("done changing img src");
    });
  });
});

})(jQuery);
