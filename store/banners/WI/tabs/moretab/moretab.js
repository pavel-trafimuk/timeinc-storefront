/* global $, Backbone, libBanner, Product, ProductList, HeroView, ProductView */
(function() {
  libBanner.track_page_view("MoreTab");
  libBanner.echo();
  
  // Check if the user is a subscriber ASAP
  //   when cached data is avilable, use that while checking for fresh data
  window.sub_status = JSON.parse(localStorage.isSubscriberData || "{}");
  libBanner.get_subscription_status(function(status) {
    window.sub_status = status;
    localStorage.isSubscriberData = JSON.stringify(status);
    Backbone.trigger("subscriptionStatusUpdated", status);

    var $fc = $(".free-content");
    $fc[status.is_sub ? "addClass" : "removeClass"]("disabled");
  });

  // Setup the store
  $.getJSON("content.json", function(data) {
    var feature = new Product(data.featuredProduct[0]),
        products = new ProductList(data.digitalProducts),
        freeContent = new ProductList(data.free),

        $digitalProducts = $(".digital-products"),
        $freeContent = $(".free-content");

    new HeroView({
      el: ".this-months-feature",
      model: feature
    }).render();

    products.each(function(product) {
      new ProductView({
        model: product,
      }).render().$el.appendTo($digitalProducts);
    });

    freeContent.each(function(product) {
      new ProductView({
        model: product,
      }).render().$el.appendTo($freeContent);
    });

  });

  // Disable Scrolling
  var xStart, yStart = 0;
  $(document)
    .on("touchmove", function() {
      return false;
    })
    .on("touchstart", ".cover-block, .dod-images", function(evt) {
      var touch = evt.originalEvent.touches[0];
      xStart = touch.screenX;
      yStart = touch.screenY;
    })
    .on("touchmove", ".cover-block, .dod-images", function(evt) {
      var touch = evt.originalEvent.touches[0],
          xMovement = Math.abs(touch.screenX - xStart),
          yMovement = Math.abs(touch.screenY - yStart);
      
      if((yMovement * 2) < xMovement) {
        evt.stopPropagation();
      }
    });

})();