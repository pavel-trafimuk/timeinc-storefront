(function() {
  
  App.views.Store = Backbone.View.extend({
    className: "store-view",
    template: Handlebars.templates["store.tmpl"],
    events: {

    },
    initialize: function() {
      console.log("App.views.Store.initialize()");
      
      var hero_view = App.views[settings.store_hero_view],
          issues_view = App.views[settings.store_backissues_view];

      this.hero_view = new hero_view();
      this.issues_view = new issues_view();
      //this.$el.addClass("scrollable");

      if (settings.store_show_banners) {
        this.$el.addClass("make-banner-space");
      }
    },
    render: function(cb) {
      cb = cb || $.noop;
      var that = this,
          cx = {};
      this.$el.html(this.template(cx));
      async.parallel([
        function(cb) {
          cb = _.partial(cb, null);
          that.hero_view.render(cb).$el.appendTo(that.el);
        },
        function(cb) {
          cb = _.partial(cb, null);
          that.issues_view.render(cb).$el.appendTo(that.el);
        }
      ], cb);
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
