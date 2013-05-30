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
      }
      else {
        this.subview = this.store_view;
      }
      localStorage.app_view_count += 1;
    },
    render: function() {
      this.$el.html(this.template({DEBUG:DEBUG}));
      
      this.subview.render().$el.appendTo(this.el);
      this.subview.animate();
    },
    goto_store: function() {
      this.subview = this.store_view;
      this.render();
    },
    launch_repl: function() {
      App.debug.launch_repl();
    },
    reload_page: function() {
      App.debug.reload();
    }
  });

})();

