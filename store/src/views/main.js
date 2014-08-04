/* global App, Backbone, Handlebars, $, _, settings, DEBUG */
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
          folio = App.api.libraryService.get_touted_issue(),
          setbanner;

      App.api.authenticationService.updatedSignal.add(function() {
        App.api.libraryService.updateLibrary();
      });

      setbanner = _.bind(this.selectBannerType, this, $.noop);
      setbanner = _.partial(_.delay, setbanner, 50);
      setbanner = _.debounce(setbanner, 200);
      
      App.api.receiptService.newReceiptsAvailableSignal.add(setbanner);
      App.api.authenticationService.userAuthenticationChangedSignal.add(setbanner);
      
      this.$el.hammer();
      if (typeof localStorage.app_view_count == "undefined") {
        localStorage.app_view_count = 0;
      }
      
      if (settings.welcome_once_per_issue) {
        // Show welcome screen once per issue (use local storage)
        if (typeof localStorage.welcome_issue_displayed_last == "undefined" || localStorage.welcome_issue_displayed_last != folio.productId) {
          localStorage.welcome_issue_displayed_last = folio.productId;
          this.subview = new App.views.Welcome();
          App.omni.pageview("splashpage", "event1,event43,event44");
        }
        else {
          this.subview = new App.views.Store();
          App.omni.pageview("main", "event1,event43");
        }
      }
      else if (settings.welcome_time_based_interval) {
        var lastPopup = parseFloat(localStorage.lastWelcomePopup) || 0,
            now = +(new Date()),

            // setting defined in minutes
            interval = settings.popupInterval * 60 * 1000;

        if (now > (lastPopup + interval)) {
          localStorage.lastWelcomePopup = now;
          this.subview = new App.views.Welcome();
          App.omni.pageview("splashpage", "event1,event43,event44");
        }
        else {
          this.subview = new App.views.Store();
          App.omni.pageview("main", "event1,event43");
        }
      }
      else {
        // Show welcome screen using frequency set in settings
        if (localStorage.app_view_count % settings.popupInterval === 0) {
          this.subview = new App.views.Welcome();
          App.omni.pageview("splashpage", "event1,event43,event44");
        }
        else {
          this.subview = new App.views.Store();
          App.omni.pageview("main", "event1,event43");
        }
      }
      localStorage.app_view_count = +localStorage.app_view_count + 1;
      
    },
    render: function(cb) {
      var that = this;
      this.$el.html(this.template({DEBUG:DEBUG}));

      this.selectBannerType();
      
      this.subview.render(function() {
        that.subview.$el.appendTo(that.el);
        that.subview.animate(function() {
          if (!App.dialogs.FirstLoadPopup.shown 
                && settings.enable_first_load_popup
                /*&& localStorage.app_view_count == 1*/) {
            App.api.authenticationService.user_is_subscriber(function(is_subscriber) {
              if (!is_subscriber) {
                new App.dialogs.FirstLoadPopup;
              }
            });
          }
          App.dialogs.FirstLoadPopup.shown = true;
          (cb||$.noop)();
        });
      });
    },
    selectBannerType: function() {
      if (!settings.store_show_banners) {
        return;
      }
      
      var that = this;
      
      this.store_banner = null;

      // APPLE SUBSCRIBERS
      App.api.authenticationService.user_is_subscriber(function(is_subscriber) {
        if (is_subscriber) {
          that.store_banner = "itunes";
          that.$(".store-banner.banner-landscape").addClass("itunes");
          that.$(".store-banner.banner-portrait").addClass("itunes");
          return;
        } else {
          that.store_banner = null;
          that.$(".store-banner.banner-landscape").removeClass("itunes");
          that.$(".store-banner.banner-portrait").removeClass("itunes");
        }
      });
  
      // LUCIE SUBSCRIBERS
      if (App.api.authenticationService.isUserAuthenticated) {
        this.store_banner = "lucie";
        this.$(".store-banner.banner-landscape").addClass("lucie");
        this.$(".store-banner.banner-portrait").addClass("lucie");
      } else {
        this.store_banner = null;
        this.$(".store-banner.banner-landscape").removeClass("lucie");
        this.$(".store-banner.banner-portrait").removeClass("lucie");
      }
      return;
    },
    banner_tap: function() {
      App.omni.event("st_banner_taps");
      
      if (this.store_banner == "itunes") {
        settings.store_banners_type == settings.store_banners_type_itunes;
      } else if (this.store_banner == "lucie") {
        settings.store_banners_type == settings.store_banners_type_lucie;
      }
      
      if (settings.store_banners_type == "subscribe") {
        new App.dialogs.Subscribe();
      } else {
        var folio = App.api.libraryService.get_by_productId(settings.store_banner_productId);
        
        folio.purchase_and_download({
          complete: function() {
            folio.goto_dossier(settings.store_banner_dossierId);
          },
          error: function(error_code) {
            if (error_code < 0) {
              new App.dialogs.ErrorMsg({error_code: error_code});
            }
          }
        });
      }
      return false;
    },
    goto_store: function() {
      this.subview = new App.views.Store();
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

