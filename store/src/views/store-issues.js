(function() {
  
  App.views.StoreIssues = Backbone.View.extend({
    className: "store-issues-view",
    template: Handlebars.templates["store-issues.tmpl"],
    events: {
      "tap .issue": "view_issue"
    },
    initialize: function() {
      console.log("App.views.StoreIssues initializing");
    },
    render: function(cb) {
      cb = cb || $.noop;
      var back_issues = App.api.libraryService.get_back_issues(),
          cx = { 
            issues: _(back_issues).first(settings.max_back_issues),
            settings: settings 
          };
      this.$el.html(this.template(cx)).hammer();
      this.$(".cover-img").imgPlaceholder();
      cb();
      return this;
    },
    animate: function(cb) {
      var that = this,
          cb = cb || $.noop;
      cb(); 
    },
    view_issue: function(evt) {
      App.omni.event("st_preview_taps");
      if (settings.backissue_preview == "image") {
        return this.view_issue_preview_image(evt);
      }
      else if (settings.backissue_preview == "adobe") {
        return this.view_issue_native_preview(evt);
      }
    },
    view_issue_preview_image: function(evt) {
      var $this = $(evt.currentTarget),
          product_id = $this.data("productId"),
          folio = App.api.libraryService.get_by_productId(product_id);

      new App.views.IssuePreviewImage(folio);
    },
    view_issue_native_preview: function(evt) {
      var $this = $(evt.currentTarget),
          product_id = $this.data("productId"),
          folio = App.api.libraryService.get_by_productId(product_id),
          $cover = $(".issue-cover", $this);

      $cover.addClass("progress").attr("data-label", settings.progressStarting);
      
      folio.view_or_preview({
        complete: function() {
          $cover.attr("data-label", settings.progressOpening);
        },
        download_progress: function(progress) {
          $cover.attr("data-label", settings.progressDownloading);
          $(".progress-bar", $this).css("width", progress+"%");
        }
      });
    }
  });

})();

