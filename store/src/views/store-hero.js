(function() {
  
  App.views.StoreHero = Backbone.View.extend({
    className: "store-hero-view",
    template: Handlebars.templates["store-hero.tmpl"],
    events: {
      "click .buy-issue-button": "buy_issue",
      "click .cover": "goto_preview",
      "click .subscribe-button": "subscribe"
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
      this.$(".cover img").imgPlaceholder();

      return this;
    },
    animate: function(cb) {
      var that = this,
          cb = cb || $.noop;
      cb(); 
    },
    buy_issue: function() {
      App.api.libraryService.get_touted_issue().purchase_and_download();
    },
    goto_preview: function() {
      App.api.libraryService.get_touted_issue().view_or_preview();
    },
    subscribe: function() {
      new App.dialogs.Subscribe();
    }
  });

})();
