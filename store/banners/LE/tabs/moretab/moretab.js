/* global $, Backbone, libBanner, Product, ProductList, HeroView, ProductView */
(function() {

  // hard-reload on gesture event
  document.body.addEventListener("gesturechange", function() {
    location.reload(true);
  }, false);


  libBanner.track_page_view("MoreTab");
  libBanner.echo();
  
  // Check if the user is a subscriber ASAP
  //   when cached data is avilable, use that while checking for fresh data
  window.sub_status = JSON.parse(localStorage.isSubscriberData || "{}");
  libBanner.get_subscription_status(function(status) {
    window.sub_status = status;
    localStorage.isSubscriberData = JSON.stringify(status);
    Backbone.trigger("subscriptionStatusUpdated", status);
  });

  // Setup the store
  $.getJSON("content.json", function(data) {
    var feature = new Product(data.featured),
        products = new ProductList(data.products),

        $products = $(".products");

    new HeroView({
      el: ".hero",
      model: feature
    }).render();

    products.each(function(product) {
      new ProductView({
        model: product,
      }).render().$el.appendTo($products);
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