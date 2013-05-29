(function() {
  
  App.views.StoreHero = Backbone.View.extend({
    className: "store-hero-view",
    template: Handlebars.templates["store-hero.tmpl"],
    events: {
      "click .buy-issue-button": "buy_issue",
      "click .cover": "goto_preview",
      "click .subscribe-button": "subscribe"
    },
    initialize: function() {
      console.log("App.views.StoreHero initializing");
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
      App.api.libraryService.get_touted_issue().purchase_and_download({
        init: function() {
          $progress.attr("data-label", "Purchasing Issue…");
        },
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
      App.api.libraryService.get_touted_issue().view_or_preview({
        init: function() {
          $progress.attr("data-label", "Opening Issue…");
        },
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
    }
  });

})();
