(function() {
  
  App.views.Welcome = Backbone.View.extend({
    className: "welcome-view",
    template: Handlebars.templates["welcome.tmpl"],
    events: {
      "click .subscribe": "subscribe"
    },
    initialize: function() {
      var that = this,
          transaction;

      this.folio = App.api.libraryService.get_touted_issue();
    },
    render: function() {
      var covers = this.folio.get_welcome_imgs();
      var cx = {settings:settings, img_only_cover_url: covers[0], full_cover_url: covers[1]};
      this.$el.html(this.template(cx));
      return this;
    },
    animate: function(cb) {
      var that = this,
          cb = cb || $.noop;
      setTimeout(function() {
        that.$(".cover-with-text").fadeIn(800, function() {
          that.$(".buttons").fadeIn(800, function() {
            that.$(".already-have-account").fadeIn(800, function() {
              cb();
            });
          });
        });
      }, 800);
    },
    subscribe: function() {
      new App.dialogs.Subscribe();
    }
  });

})();
