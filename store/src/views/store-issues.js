(function() {
  
  App.views.StoreIssues = Backbone.View.extend({
    className: "store-issues-view",
    template: Handlebars.templates["store-issues.tmpl"],
    events: {
      "tap .issue": "view_issue",
      "tap .bi-filter": "filter_back_issues"
    },
    initialize: function() {
      console.log("App.views.StoreIssues initializing");
      this.filter_type = settings.storeIssuesStartingFilter;
    },
    render: function(cb) {
      cb = cb || $.noop;
      var cx = { 
            issues: this.get_issues(),
            settings: settings 
          };
      this.$el.html(this.template(cx)).hammer();
      this.$(".cover-img").imgPlaceholder();
      cb();
      return this;
    },
    get_issues: function() {
      var that = this;
          back_issues = App.api.libraryService.get_back_issues();

      back_issues = _.filter(back_issues, function(issue) {
        if (!that.filter_type) return true;
        
        var negate = false,
            filter_type = that.filter_type,
            has_filter;

        if (filter_type[0] == "!") {
          negate = true;
          filter_type = filter_type.substr(1);
        }

        has_filter = _(issue.get_filters()).contains(filter_type);
        return negate ? !has_filter : has_filter;
      });
      return _.first(back_issues, settings.max_back_issues);
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
    },
    filter_back_issues: function(evt) {
      var $this = $(evt.currentTarget);

      this.$(".bi-filter").removeClass("active");
      $this.addClass("active");

      this.filter_type = $this.data("filter");
      this.render();
    }
  });

})();

