(function() {
  
  App.views.Main = Backbone.View.extend({
    el: "body",
    template: Handlebars.templates["main.tmpl"],
    events: {
      "click .goto-store": "goto_store",
      "click .launch-repl": "launch_repl",
      "click .reload-page": "reload_page"
    },
    initialize: function() {
      var that = this;
      this.welcome_view = new App.views.Welcome;
      this.store_view = new App.views.Store;

      if (typeof localStorage.app_view_count == "undefined") {
        localStorage.app_view_count = 0;
      }

      if (localStorage.app_view_count % settings.popupInterval === 0) {
        this.subview = this.welcome_view;
        App.omniture.track_pageview("store|welcome");
      }
      else {
        this.subview = this.store_view;
        App.omniture.track_pageview("store|home page");
      }
      localStorage.app_view_count = +localStorage.app_view_count + 1;
    },
    render: function(cb) {
      this.$el.html(this.template({DEBUG:DEBUG}));
      
      this.subview.render().$el.appendTo(this.el);
      this.subview.animate(cb||$.noop);
    },
    goto_store: function() {
      this.subview = this.store_view;
      this.render();
      App.omniture.track_pageview("store|home page");
    },
    launch_repl: function() {
      App.debug.launch_repl();
    },
    reload_page: function() {
      App.debug.reload();
    }
  });

})();

