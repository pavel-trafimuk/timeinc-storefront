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
          setbanner,
          appVersion = (App.api.configurationService.applicationVersion).split("."),
          iosVersion = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
          
      this.ios_version = [parseInt(iosVersion[1], 10), parseInt(iosVersion[2], 10), parseInt(iosVersion[3] || 0, 10)];
      this.ios_version.toString = function() {
        return this.join(".");
      };
      
      this.app_version = [parseInt(appVersion[0], 10), parseInt(appVersion[1] || 0, 10), parseInt(appVersion[2] || 0, 10)];
      this.app_version.toString = function() {
        return this.join(".");
      };
      
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

      var show_view = this.viewToShow();

      if (show_view == "welcome") {
        this.subview = new App.views.Welcome();
        App.omni.pageview("splashpage", "event1,event43,event44");
      }
      else if (show_view == "store") {
        this.subview = new App.views.Store();
        App.omni.pageview("main", "event1,event43");
      }

      localStorage.app_view_count = +localStorage.app_view_count + 1;
    },
    render: function(cb) {
      var that = this;
      this.$el.html(this.template({DEBUG:DEBUG}));

      this.selectBannerType();
      
      var checkOS = this.is_version("os", "8"),
          isOnLatestBuild = this.is_version("app", ">=" + settings.cfBundleVersion);
      
      this.subview.render(function() {
        that.subview.$el.appendTo(that.el);
        that.subview.animate(function() {
          if (settings.enable_ios8_popup && !localStorage.ios8popupshown) {
            if (checkOS && !isOnLatestBuild) {
              new App.dialogs.iOS8Popup;
              localStorage.ios8popupshown = true;
            }
          } else {
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
          }
          (cb||$.noop)();
        });
      });
    },
    is_version: function(type, version_expr) {
      /* version_expr looks like:
      *     "7"  same as "=7"
      *     "=7" major version must be 7
      *     "=7.0" major version must be 7, minor must be 0
      *     "<7" major version must less than 7
      *     "<=6" major version must be less than or equal to 6
      *     "!7" major version must be anyhting other than 7
      *     "!7.0.4" full version must be anything other than 7.0.4
      *
      *  Note: a blank version_expr will always return true.
      */
      
      var that = this;
      
      if (!type) return true;
      if (!version_expr) return true;
      if (!this.ios_version && !this.app_version) {
        return true;
      } else {
        this.version = (type == "os") ? this.ios_version : this.app_version;
      }
      
      console.log("this.version", this.version);
  
      // version looks like [7, 0, 4];
      var version = version_expr.replace(/^[<>=!]*/g, "").split(".").map(function(i) {
            return parseInt(i, 10);
          });
  
      function eq() {
        for (var i = 0; i < version.length; i++) {
          if (that.version[i] != version[i]) return false;
        }
        return true;
      }
      function lt() {
        for (var i = 0; i < version.length; i++) {
          if (that.version[i] > version[i]) return false;
          if (that.version[i] < version[i]) return true;
        }
        return false;
      }
      function gt() {
        for (var i = 0; i < version.length; i++) {
          if (that.version[i] < version[i]) return false;
          if (that.version[i] > version[i]) return true;
        }
        return false;
      }
  
      if (version_expr.slice(0, 2) == "<=") {
        return lt() || eq();
      }
      else if (version_expr.slice(0, 2) == ">=") {
        return gt() || eq();
      }
      else if (version_expr.slice(0, 1) == "<") {
        return lt();
      }
      else if (version_expr.slice(0, 1) == ">") {
        return gt();
      }
      else if (version_expr.slice(0, 1) == "!") {
        return !eq();
      }
      else {
        return eq();
      }
    },
    viewToShow: function() {
      // short-circuit: always show Store to subscribers. Doesn't use 
      // App.api.authenticationService.user_is_subscriber() because it takes
      // a callback. This is a "good enough" hack (but it ignores the
      // possibility that someone signed in to lucie is not a subscriber)
      var available_subs = App.api.receiptService.availableSubscriptions;

      for (var i = available_subs.length; i--;) {
        if (available_subs[i].isActive()) return "store";
      }
      if (App.api.authenticationService.isUserAuthenticated) {
        return "store";
      }

      if (settings.welcome_once_per_issue) {
        // Show welcome screen once per issue (use local storage)
        if (typeof localStorage.welcome_issue_displayed_last == "undefined" || localStorage.welcome_issue_displayed_last != folio.productId) {
          localStorage.welcome_issue_displayed_last = folio.productId;
          return "welcome";
        }
        else {
          return "store";
        }
      }
      else if (settings.welcome_time_based_interval) {
        var lastPopup = parseFloat(localStorage.lastWelcomePopup) || 0,
            now = +(new Date()),

            // setting defined in minutes
            interval = settings.popupInterval * 60 * 1000;

        if (now > (lastPopup + interval)) {
          localStorage.lastWelcomePopup = now;
          return "welcome";
        }
        else {
          return "store";
        }
      }
      else {
        // Show welcome screen using frequency set in settings
        if (localStorage.app_view_count % settings.popupInterval === 0) {
          return "welcome";
        }
        else {
          return "store"
        }
      }
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

