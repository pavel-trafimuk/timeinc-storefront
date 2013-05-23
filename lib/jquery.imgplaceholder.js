(function($) {

$.fn.imgPlaceholder = function() {
  this.each(function() {
    var $img = $(this),
        real_url = $img.data("realSrc"),
        real_img;

    if (!real_url) return;

    real_img = new Image();
    real_img.src = real_url;

    function show_real_img() { 
      $img.attr('src', real_url); 
    }

    if (real_img.complete) show_real_img();
    else $(real_img).on("load", show_real_img);

  });
  return this;
}

})(jQuery);
