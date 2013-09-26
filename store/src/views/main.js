(function() {
  
  App.views.Main = Backbone.View.extend({
    el: "body",
    template: Handlebars.templates["main.tmpl"],
    events: {
      "tap .goto-store": "goto_store",
      "tap .launch-repl": "launch_repl",
      "tap .reload-page": "reload_page",
      "tap .store-banner": "banner_tap",
    },
    initialize: function() {
      var that = this,
          folio = App.api.libraryService.get_touted_issue();
      this.welcome_view = new App.views.Welcome;
      this.store_view = new App.views.Store;

      this.$el.hammer();
      if (typeof localStorage.app_view_count == "undefined") {
        localStorage.app_view_count = 0;
      }
      
      if (settings.welcome_once_per_issue) {
        // Show welcome screen once per issue (use local storage)
        if (typeof localStorage.welcome_issue_displayed_last == "undefined" || localStorage.welcome_issue_displayed_last != folio.productId) {
          localStorage.welcome_issue_displayed_last = folio.productId;
          this.subview = this.welcome_view;
          App.omni.pageview("splashpage", "event1,event43,event44");
        }
        else {
          this.subview = this.store_view;
          App.omni.pageview("main", "event1,event43");
        }
      }
      else {
        // Show welcome screen using frequency set in settings
        if (localStorage.app_view_count % settings.popupInterval === 0) {
          this.subview = this.welcome_view;
          App.omni.pageview("splashpage", "event1,event43,event44");
        }
        else {
          this.subview = this.store_view;
          App.omni.pageview("main", "event1,event43");
        }
      }
      localStorage.app_view_count = +localStorage.app_view_count + 1;
      
    },
    render: function(cb) {
      var that = this;
      this.$el.html(this.template({DEBUG:DEBUG}));

      this.subview.render(function() {
        that.subview.$el.appendTo(that.el);
        that.subview.animate(function() {
          if (!App.dialogs.FirstLoadPopup.shown 
                && settings.enable_first_load_popup 
                && localStorage.app_view_count == 1) {
            new App.dialogs.FirstLoadPopup;
          }
          App.dialogs.FirstLoadPopup.shown = true;
          (cb||$.noop)();
        });
      });
    },
    banner_tap: function() {
      App.omni.event("st_banner_taps");
      new App.dialogs.Subscribe();
      return false;
    },
    goto_store: function() {
      this.subview = this.store_view;
      this.render();
      App.omni.pageview("main", "event1");
    },
    launch_repl: function() {
      App.debug.launch_repl();
    },
    reload_page: function() {
      App.debug.reload();
    }
  });

})();

