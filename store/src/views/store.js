(function() {
  
  App.views.Store = Backbone.View.extend({
    className: "store-view",
    template: Handlebars.templates["store.tmpl"],
    events: {

    },
    initialize: function() {
      console.log("App.views.Store.initialize()");
      this.hero_view = new App.views.StoreHero();
      this.issues_view = new App.views.StoreIssues();
      this.$el.addClass("scrollable");
    },
    render: function() {
      var cx = {};
      this.$el.html(this.template(cx)).hammer();
      this.hero_view.render().$el.appendTo(this.el);
      this.issues_view.render().$el.appendTo(this.el);
      return this;
    },
    animate: function(cb) {
      var that = this,
          cb = cb || $.noop;
      async.parallel([
          function(cb) { that.hero_view.animate(cb) },
          function(cb) { that.issues_view.animate(cb) }
      ], cb);
    }
  });

})();
