(function() {
  
  App.views.StoreHero = Backbone.View.extend({
    className: "store-hero-view",
    template: Handlebars.templates["store-hero.tmpl"],
    events: {

    },
    initialize: function() {
      console.log("App.views.StoreHero initializing");
    },
    render: function() {
      var folio = App.api.libraryService.get_touted_issue();
      var cx = { cover_img: folio.get_cover_img(), in_this_issue: [1,2,3,4] };
      this.$el.html(this.template(cx));
      return this;
    },
    animate: function(cb) {
      var that = this,
          cb = cb || $.noop;
      cb(); 
    }
  });

})();
