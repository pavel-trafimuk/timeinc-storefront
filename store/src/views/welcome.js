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
          App.preload.img(covers[0], function() {
            that.$(".cover-img-only").show();
            cb(null);
          })
        },
        function(cb) { App.preload.img(covers[1], _.partial(cb, null)) }
      ], function() {
          var init_delay = covers[0] ? 1000 : 0;
          that.$(".cover-with-text").transition({duration: 1500, delay: init_delay, opacity: 1.0});
          that.$(".buttons").transition({duration: 600, delay: init_delay+1300, y: 0});
          that.$(".already-have-account").transition({duration: 1000, delay: init_delay+3100, opacity: 1.0});
        
          setTimeout(function() {
            that.$(".curl-text, .curl-obj").addClass("animated");
          }, init_delay+2100);
        
          setTimeout(cb, init_delay+2700);
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
