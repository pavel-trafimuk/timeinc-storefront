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
      _.bindAll(folio);
      var cx = { 
        settings: settings, 
        folio: folio,
      };
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
