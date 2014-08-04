(function() {
  
  App.views.StoreIssuesAmex = Backbone.View.extend({
    className: "store-issues-amex-view",
    template: Handlebars.templates["store-issues-amex.tmpl"],
    events: {
      "tap .issue": "view_issue",
      "tap .bi-filter": "filter_back_issues",
      "tap .buy-issue-button": "buy_issue"
    },
    initialize: function() {
      console.log("App.views.StoreIssuesAmex initializing");
      this.filter_type = settings.storeIssuesStartingFilter;

      this._debounce_render = _.throttle(_.bind(this.render, this, $.noop), 500);

      App.api.receiptService.newReceiptsAvailableSignal.add(this._debounce_render);
      App.api.authenticationService.userAuthenticationChangedSignal.add(this._debounce_render);
      App.api.authenticationService.updatedSignal.add(this._debounce_render);
      App.api.libraryService.updatedSignal.add(this._debounce_render);
    },
    render: function(cb) {
      var back_issues,
          that = this;
      
      cb = cb || $.noop;

      var cx = {
            this_months_issue: that.get_this_months_issue(),
            featured_issues: that.get_featured_issues(),
            issues: that.get_back_issues(),
            settings: settings 
          };
      that.$el.html(that.template(cx));
      that.$(".cover-img").imgPlaceholder();

      that.$(".bi-filter").removeClass("active");
      that.$('[data-filter="' + that.filter_type + '"]').addClass("active");

      cb();

      return this;
    },
    get_this_months_issue: function() {
      return App.api.libraryService.get_touted_issue();
    },
    get_featured_issues: function() {
      var issues = App.api.libraryService.get_back_issues().slice(0, 3);
      issues.unshift(this.get_this_months_issue());
      return issues;
    },
    get_back_issues: function() {
      var back_issues = App.api.libraryService.get_back_issues().slice(3);
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

      App.views.show_folio_detail(folio);
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
      var that = this,
          $this = $(evt.currentTarget);

      $this.addClass("active");
      this.filter_type = $this.data("filter");

      setTimeout(function() { that.render() }, 50);
    },
    buy_issue: function(evt) {
      var $btn = $(evt.currentTarget),
          $this = $btn.closest(".issue"),
          product_id = $this.data("productId"),
          folio = App.api.libraryService.get_by_productId(product_id),
          $cover = $(".issue-cover", $this);

      $btn.fadeTo(600, 0.35);
      
      folio.purchase_and_download({
        error: function(error_code) {
          if (error_code < 0) {
            new App.dialogs.ErrorMsg({error_code: error_code});
          }
          $btn.fadeTo(100, 1.0);
        },
        cancelled: function() {
          $btn.fadeTo(100, 1.0);
        }
      });
      return false;
    }
  });

})();

