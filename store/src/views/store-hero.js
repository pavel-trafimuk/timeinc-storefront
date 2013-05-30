(function() {
  
  App.views.StoreHero = Backbone.View.extend({
    className: "store-hero-view",
    template: Handlebars.templates["store-hero.tmpl"],
    events: {
      "click .buy-issue-button": "buy_issue",
      "click .cover": "goto_preview",
      "click .subscribe-button": "subscribe",
      "click .in-this-issue article": "goto_itii"
    },
    initialize: function() {
      console.log("App.views.StoreHero initializing");
      FastClick.attach(this.el);
    },
    render: function() {
      var folio = App.api.libraryService.get_touted_issue();
      _.bindAll(folio);
      var cx = { 
        settings: settings, 
        folio: folio,
      };
      this.$el.html(this.template(cx));
      this.$(".cover img").imgPlaceholder();

      return this;
    },
    animate: function(cb) {
      var that = this,
          cb = cb || $.noop;
      cb(); 
    },
    buy_issue: function() {
      var $progress = this.$(".issue-cover").addClass("progress");
      $progress.attr("data-label", "Purchasing Issue…");
      this.$(".page-curl").fadeOut();
      App.api.libraryService.get_touted_issue().purchase_and_download({
        complete: function() {
          $progress.attr("data-label", "Opening Issue…");
        },
        download_progress: function(progress) {
          $progress.attr("data-label", "Downloading…");
          $(".progress-bar", $progress).css("width", progress+"%");
        }
      });
    },
    goto_preview: function() {
      var $progress = this.$(".issue-cover").addClass("progress");
      $progress.attr("data-label", "Opening Issue…");
      this.$(".page-curl").fadeOut();
      App.api.libraryService.get_touted_issue().view_or_preview({
        complete: function() {
          $progress.attr("data-label", "Opening Issue…");
        },
        download_progress: function(progress) {
          $progress.attr("data-label", "Downloading…");
          $(".progress-bar", $progress).css("width", progress+"%");
        }
      });
    },
    subscribe: function() {
      new App.dialogs.Subscribe();
    },
    goto_itii: function(evt) {
      var that = this;
          $this = $(evt.currentTarget),
          duration = 500, 
          text_display_duration = 9500;

      $this
        .attr("data-loading-text", "← Opening Article")
        .transition({x: $this.outerWidth(), duration: duration})
        .transition({x: 0, delay: text_display_duration, duration: duration});
      
      setTimeout(function() {
        $this.attr("data-loading-text", "");
      }, text_display_duration+duration*2);
      
      // open issue in a timeout so the UI can respond first
      setTimeout(function() {
        that.goto_preview();
      }, 100);
    }
  });

})();
