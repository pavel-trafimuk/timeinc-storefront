(function() {
  
  App.views.Welcome = Backbone.View.extend({
    className: "welcome-view",
    template: Handlebars.templates["welcome.tmpl"],
    events: {
      "click .subscribe": "subscribe",
      "click .page-curl": "open_preview",
      "click .print-subscriber": "open_wes",
      "click .goto-store": "track_gotostore"
    },
    initialize: function() {
      var that = this,
          transaction;

      this.folio = App.api.libraryService.get_touted_issue();
      $(window).on("resize", _.bind(this.update_covers, this));
    },
    render: function() {
      var covers = this._get_covers();
      var cx = {
        settings: settings, 
        img_only_cover_url: covers[0],
        full_cover_url: covers[1]
      };
      this.$el.html(this.template(cx));
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

      async.parallel([
        function(cb) { 
          App.preload.img(covers[0], function() {
            that.$(".cover-img-only").show();
            cb(null);
          })
        },
        function(cb) { App.preload.img(imgs.portrait[0], _.partial(cb, null)) },
        function(cb) { App.preload.img(imgs.portrait[1], _.partial(cb, null)) },
        function(cb) { App.preload.img(imgs.landscape[0], _.partial(cb, null)) },
        function(cb) { App.preload.img(imgs.landscape[1], _.partial(cb, null)) }
      ], function() {
          var init_delay = covers[0] ? 600 : 0;
          that.$(".cover-with-text").transition({duration: 1800, delay: init_delay, opacity: 1.0});
          that.$(".buttons").transition({duration: 600, delay: init_delay+1800, y: 0});
          that.$(".already-have-account").transition({duration: 1000, delay: init_delay+3100, opacity: 1.0});
        
          setTimeout(function() {
            that.$(".curl-text, .curl-obj").addClass("animated");
          }, init_delay+2100);
        
          setTimeout(cb, init_delay+2700);
      });
    },
    subscribe: function() {
      TcmOmni.event("sp_subscribe_taps");
      new App.dialogs.Subscribe();
    },
    track_gotostore: function() {
      TcmOmni.event("sp_browse_taps");
    },
    open_preview: function() {
      var dialog = new App.dialogs.WelcomeDownloading(),
          $progress = dialog.$(".progress");

      TcmOmni.event("sp_see_inside_taps");

      this.$(".page-curl").fadeOut();
      
      this.folio.view_or_preview({
        complete: function() {
          $progress.attr("data-label", "Opening Issue…");
        },
        download_progress: function(progress) {
          $progress.attr("data-label", "Downloading…");
          $(".progress-bar", $progress).css("width", progress+"%");
        }
      });
    },
    open_wes: function() {
      TcmOmni.event("sp_activate_taps");

      // Give omniture a chance to track
      setTimeout(function() {
        location.href = settings.welcomeScreenWesURL;
      }, 250);
    }
  });

})();
