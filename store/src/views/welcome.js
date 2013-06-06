(function() {
  
  App.views.Welcome = Backbone.View.extend({
    className: "welcome-view",
    template: Handlebars.templates["welcome.tmpl"],
    events: {
      "click .subscribe": "subscribe",
      "click .page-curl": "open_preview",
      "click .print-subscriber": "open_wes"
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
      cb = cb || $.noop;
      var that = this,
          covers = this.folio.get_welcome_imgs();
      
      async.parallel([
        function(cb) { 
          App.preload.img(covers[0], _.partial(cb, null)) 
        },
        function(cb) { 
          App.preload.img(covers[1], _.partial(cb, null)) 
        }
      ], function() {
          that.$(".cover-with-text").transition({duration: 1500, delay: 500, opacity: 1.0});
          that.$(".buttons").transition({duration: 600, delay: 1800, y: 0});
          that.$(".already-have-account").transition({duration: 1000, delay: 3600, opacity: 1.0});
        
          setTimeout(function() {
            that.$(".curl-text, .curl-obj").addClass("animated");
          }, 2600);
        
          setTimeout(cb, 3200);
      });
    },
    subscribe: function() {
      new App.dialogs.Subscribe();
    },
    open_preview: function() {
      var dialog = new App.dialogs.WelcomeDownloading(),
          $progress = dialog.$(".progress");

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
      location.href = settings.upgradeSubscriptionUrl;
    }
  });

})();
