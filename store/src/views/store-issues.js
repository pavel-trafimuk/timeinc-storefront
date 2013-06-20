(function() {
  
  App.views.StoreIssues = Backbone.View.extend({
    className: "store-issues-view",
    template: Handlebars.templates["store-issues.tmpl"],
    events: {
      "click .issue": "view_issue"
    },
    initialize: function() {
      console.log("App.views.StoreIssues initializing");
    },
    render: function() {
      var cx = { issues: App.api.libraryService.get_back_issues(), settings: settings };
      this.$el.html(this.template(cx));
      this.$(".cover-img").imgPlaceholder();
      
      return this;
    },
    animate: function(cb) {
      var that = this,
          cb = cb || $.noop;
      cb(); 
    },
    view_issue: function(evt) {
      TcmOmni.event("st_preview_taps");
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

      $cover.addClass("progress").attr("data-label", "Opening Issue…");
      
      folio.view_or_preview({
        complete: function() {
          $cover.attr("data-label", "Opening Issue…");
        },
        download_progress: function(progress) {
          $cover.attr("data-label", "Downloading…");
          $(".progress-bar", $this).css("width", progress+"%");
        }
      });
    }
  });

})();

