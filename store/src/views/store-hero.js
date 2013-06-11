(function() {
  
  App.views.StoreHero = Backbone.View.extend({
    className: "store-hero-view",
    template: Handlebars.templates["store-hero.tmpl"],
    events: {
      "click .buy-issue-button": "buy_issue",
      "click .cover": "goto_preview",
      "click .subscribe-button": "subscribe",
      "click .in-this-issue article": "goto_itii",
      "click .print-subscribers": "print_subs_getitfree"
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
    print_subs_getitfree: function(evt) {
      evt.preventDefault();
      location.href = settings.WesPageURL;
    },
    buy_issue: function() {
      var $progress = this.$(".issue-cover").addClass("progress"),
          $curl = this.$(".page-curl");

      $curl.hide();
      $progress.attr("data-label", "Purchasing Issue…");
      
      App.api.libraryService.get_touted_issue().purchase_and_download({
        complete: function() {
          $progress.attr("data-label", "Opening Issue…");
        },
        download_progress: function(progress) {
          $progress.attr("data-label", "Downloading…");
          $(".progress-bar", $progress).css("width", progress+"%");
        },
        cancelled: function() {
          $progress.attr('data-label', '').removeClass("progress");
          $curl.show();
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
          $msg = $this.find(".opening-issue-text"),
          dossier_id = $this.data("destination");

      $msg.addClass("show-loading");
      setTimeout(function(){$msg.removeClass("show-loading")}, 3500);
      
      // open issue in a timeout so the UI can respond first
      setTimeout(function() {
        App.api.libraryService.get_touted_issue().goto_dossier(dossier_id);
      }, 100);
    }
  });

})();


