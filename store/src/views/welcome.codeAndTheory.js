(function() {
  
  App.views.Welcome = Backbone.View.extend({
    className: "welcome-view",
    template: Handlebars.templates["welcome.tmpl"],
    events: {
      "tap .subscribe": "subscribe",

      "tap .page-curl": "open_preview",
      "swipeleft .page-curl": "open_preview",
      "swipeup .page-curl": "open_preview",
      "dragleft .page-curl": "open_preview",
      "dragup .page-curl": "open_preview",

      "tap .print-subscriber": "open_wes",
      "tap .goto-store": "track_gotostore"
    },
    initialize: function() {
      var that = this,
          transaction;

      this.folio = App.api.libraryService.get_touted_issue();
      $(window).on("resize", _.bind(this.update_covers, this));
    },
    render: function(cb) {
      cb = cb || $.noop;
      var that = this,
          covers = this._get_covers();

      App.api.authenticationService.user_is_subscriber(function(is_subscriber) {
        var cx = {
          settings: settings, 
          img_only_cover_url: covers[0],
          full_cover_url: covers[1],
          is_subscriber: is_subscriber,
          is_logged_in: App.api.authenticationService.isUserAuthenticated
        };
        that.$el.html(that.template(cx)).hammer();
        cb();
      });
      return this;
    },
    _get_covers: function() {
      var $window = $(window),
          is_portrait = $window.height() > $window.width();
      if (is_portrait) return this.folio.get_welcome_imgs().portrait;
      else return this.folio.get_welcome_imgs().landscape;
    },
    update_covers: function() {
      var covers = this._get_covers(),
          $before = this.$(".cover-img-only"),
          $after = this.$(".cover-with-text");
      
      if (covers[0]) $before.attr("src", covers[0]).show();
      else $before.hide();

      if (covers[1]) $after.attr('src', covers[1]).show();
      else $after.hide();
    },
    animate: function(cb) {
      cb = cb || $.noop;
      var that = this,
          covers = this._get_covers(),
          imgs = this.folio.get_welcome_imgs();

      function preloader(img) {
        return function(cb) {
          App.preload.img(img, _.once(_.partial(cb, null)))
        }
      }

      async.parallel([
        function(cb) { 
          App.preload.img(covers[0], function() {
            that.$(".cover-img-only").show();
            cb(null);
          })
        },
        preloader(imgs.portrait[0]),
        preloader(imgs.portrait[1]),
        preloader(imgs.landscape[0]),
        preloader(imgs.landscape[1])
      ], function() {
          var init_delay = covers[0] ? 600 : 0;
          that.$(".cover-with-text").transition({duration: 1800, delay: init_delay, opacity: 1.0});
          that.$(".buttons").transition({duration: 600, delay: init_delay+1800, y: 0});
          if (settings.brandCode != "TK") {
            that.$(".already-have-account").transition({duration: 1000, delay: init_delay+3100, opacity: 1.0});
          }
        
          setTimeout(function() {
            that.$(".curl-text, .curl-obj").addClass("animated");
          }, init_delay+2100);
        
          setTimeout(function () {
            cb();
          }, init_delay+3500);
      });
    },
    subscribe: function() {
      App.omni.event("sp_subscribe_taps");
      new App.dialogs.Subscribe();
    },
    track_gotostore: function() {
      App.omni.event("sp_browse_taps");
    },
    open_preview: function(evt) {
      App.omni.event("sp_see_inside_taps");
      if (settings.welcome_preview == "image") {
        return this.open_preview_image(evt);
      }
      else if (settings.welcome_preview == "adobe") {
        return this.open_native_preview(evt);
      }
    },
    open_native_preview: function() {
      var dialog = new App.dialogs.WelcomeDownloading(),
          $progress = dialog.$(".progress"),
          folio = this.folio;

      this.$(".page-curl").fadeOut();
      
      folio.view_or_preview({
        complete: function() {
          $progress.attr("data-label", "Opening Issue…");
          if (folio.tcm && folio.tcm.link) {
            setTimeout(function(){ folio.goto_dossier(folio.tcm.link) }, 350)
            return false;
          }
        },
        download_progress: function(progress) {
          $progress.attr("data-label", "Downloading…");
          $(".progress-bar", $progress).css("width", progress+"%");
        }
      });
    },
    open_preview_image: function() {
      App.views.show_folio_detail(this.folio);
    },
    open_wes: function() {
      App.omni.event("sp_activate_taps");

      // Give omniture a chance to track
      setTimeout(function() {
        location.href = settings.welcomeScreenWesURL;
      }, 250);
    }
  });

})();
