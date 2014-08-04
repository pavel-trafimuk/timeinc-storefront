/* global App, Backbone, Handlebars, settings, _, $ */
(function() {
  
  App.views.StoreIssues = Backbone.View.extend({
    className: "store-issues-view",
    template: Handlebars.templates["store-issues.tmpl"],
    events: {
      "tap .issue": "view_issue",
      "tap .bi-filter": "filter_back_issues",
      "tap .buy-issue-button": "buy_issue",
      "scroll": "hide_offscreen_covers"
    },
    initialize: function() {
      console.log("App.views.StoreIssues initializing");
      this.filter_type = settings.storeIssuesStartingFilter;

      this._debounce_render = _.throttle(_.bind(this.render, this, $.noop), 500);

      App.api.receiptService.newReceiptsAvailableSignal.add(this._debounce_render);
      App.api.authenticationService.userAuthenticationChangedSignal.add(this._debounce_render);
      App.api.authenticationService.updatedSignal.add(this._debounce_render);
      App.api.libraryService.updatedSignal.add(this._debounce_render);
    },
    render: function(cb) {
      var that = this;
      cb = cb || $.noop;

        var cx = {
              issues: that.get_issues(),
              settings: settings
            };
        that.$el.html(that.template(cx));
        that.$(".cover-img").imgPlaceholder();

        that.$(".bi-filter").removeClass("active");
        that.$('[data-filter="' + that.filter_type + '"]').addClass("active");

        _.each(cx.issues, function(issue) {
          if (issue.updatedSignal.has(that._debounce_render)) return;
          issue.updatedSignal.add(that._debounce_render);
        });
        cb();
      return this;
    },
    get_issues: function() {
      var that = this,
          back_issues = App.api.libraryService.get_back_issues();

      if (that.filter_type) {
        var negate = false,
            filter_type = that.filter_type;

        if (filter_type[0] == "!") {
          negate = true;
          filter_type = filter_type.substr(1);
        }

        back_issues = _.filter(back_issues, function(issue) {
          var has_filter = _(issue.get_filters()).contains(filter_type);
          return negate ? !has_filter : has_filter;
        });
      }
      return _.first(back_issues, settings.max_back_issues);
    },
    animate: function(cb) {
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

      $btn.fadeTo(600, 0.5);
      $cover.addClass("progress").attr("data-label", settings.progressStarting);
      
      folio.purchase_and_download({
        complete: function() {
          $cover.attr("data-label", settings.progressOpening);
        },
        download_progress: function(progress) {
          $cover.attr("data-label", settings.progressDownloading);
          $(".progress-bar", $this).css("width", progress+"%");
        },
        error: function(error_code) {
          if (error_code < 0) {
            new App.dialogs.ErrorMsg({error_code: error_code});
          }
          $cover.removeClass("progress").attr("data-label", "");
          $btn.fadeTo(100, 1.0);
        },
        cancelled: function() {
          $cover.removeClass("progress").removeAttr("data-label");
          $btn.fadeTo(100, 1.0);
        }
      });
      return false;
    },
    hide_offscreen_covers: function() {
      this.$("")
    }
  });

})();

