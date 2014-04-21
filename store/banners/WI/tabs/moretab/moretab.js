(function() {
  libBanner.track_page_view("MoreTab");
  libBanner.echo();

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

})();