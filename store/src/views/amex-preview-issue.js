/* global $, App, _, Backbone, Handlebars, settings, TcmOmni */
(function() {
  App.views.AmexIssuePreview = Backbone.View.extend({
    className: "amex-issue-preview modal-background scrollable",
    template: Handlebars.templates["amex-issue-preview.tmpl"],
    events: {
      "touchmove": "disallow_bad_scrolling",
      "touchstart": "disallow_bad_scrolling_touchstart",
      "tap .buy-issue-button": "buy_issue",
      "tap .close-btn": "close",
      "swipedown .controls": "close"
    },
    initialize: function(folio, get_img_fn) {
      var that = this,
          coverdate = folio.get_coverdate().format("YYYY-MM-DD");

      // Default value for the image is the TOC
      if (!get_img_fn) {
        get_img_fn = folio.get_cover_img();
      }

      // if get_img_fn is a string, wrap it in a getter fn
      if (!_.isFunction(get_img_fn)) {
        get_img_fn = (function(img_url) {
          return function(width, height, is_portrait, cb) {
            cb(img_url);
          }
        })(get_img_fn);
      }
      this.get_img = get_img_fn;

      this.folio = folio;

      // used in the "disallow scrolling" code
      this.xStart = 0;
      this.yStart = 0;

      this.$el.hammer();
      this.render(function() {
        // don't allow multiple image previews at once
        if ($(".issue-preview-image").length) return;

        that.$el.appendTo("html");
        that.omni_pv = App.omni.pageview("previewimage|"+coverdate, "event1");
        that.animate();
      });
    },
    render: function(cb) {
      cb = cb || $.noop;
      var that = this,
          $window = $(window),
          w = $window.width(),
          h = $window.height(),
          is_portrait = h > w;

      this.get_img(w, h, is_portrait, function(img_url) {
          var tcm_imgs = that.folio.get_additional_covers_large(),
              cx = {
                settings: settings,
                folio: _.bindAll(that.folio),
                portrait: is_portrait,
                imgs: tcm_imgs.length ? tcm_imgs : [img_url]
              };
          that.$el.html(that.template(cx));
          (cb || $.noop)();
      });
      return this;
    },
    animate: function(cb) {
      cb = cb || $.noop;
      var h = $(window).height();

      this.$el
        .transition({background: "rgba(0,0,0,0.0)"}, 0)
        .transition({background: "rgba(0,0,0,0.8)"}, 500);
      this.$(".container")
        .transition({y: h}, 0)
        .transition({y: 0}, 500, "snap");

    },
    disallow_bad_scrolling_touchstart: function(evt) {
      var touch = evt.originalEvent.touches[0];
      this.xStart = touch.screenX;
      this.yStart = touch.screenY;
    },
    disallow_bad_scrolling: function(evt) {
      var elem_allows_scrolling = $(evt.target).closest(".horz-scrollable").length;

      if (!elem_allows_scrolling) {
        return evt.preventDefault();
      }

      var touch = evt.originalEvent.touches[0];

      if (this.whitelisted_touch == touch.identifier) return;

      var xMovement = Math.abs(touch.screenX - this.xStart),
          yMovement = Math.abs(touch.screenY - this.yStart),
          scrolling_is_horizontal = (yMovement * 2) < xMovement;

      if (scrolling_is_horizontal) {
        this.whitelisted_touch = touch.identifier;
        return
      };

      evt.preventDefault();
    },
    buy_issue: function(evt) {
      var that = this,
          $this = $(evt.currentTarget);

      App.omni.event("pr_"+$this.data("action")+"_taps");
      
      if (this.folio.isUpdatable) {
        new App.dialogs.UpdateFolio({folio : that.folio});
      }
      
      var folioUpdateInterval = window.setInterval(function() {
        if ($("#updatefolio-dialog").length > 0) {
          // Do nothing while update prompt is on the screen
        } else {
          window.clearInterval(folioUpdateInterval);
          that.complete_buy_issue(evt);
        }
      }, 100);
    },
    complete_buy_issue: function(evt) {
      var $this = $(evt.currentTarget),
          dialog = new App.dialogs.WelcomeDownloading(),
          $progress = dialog.$(".progress");
      
      this.folio.purchase_and_download({
        complete: function() {
          $progress.attr("data-label", "Opening Issue…");
        },
        download_progress: function(progress) {
          $progress.attr("data-label", "Downloading…");
          $(".progress-bar", $progress).css("width", progress+"%");
        },
        error: function(error_code) {
          if (error_code < 0) {
            new App.dialogs.ErrorMsg({error_code: error_code});
          }
          dialog.remove();
        },
        cancelled: function() {
          dialog.remove();
        }
      });
    },
    close: function() {
      var that = this,
          animation_duration = 300;

      TcmOmni.set_pagename(this.omni_pv.prev);
      this.$el
        .transition({background: "rgba(0,0,0,0.0)"}, animation_duration);
      this.$(".container")
        .transition({y: $(window).height()}, animation_duration);


      setTimeout(function() {
        that.remove();
      }, animation_duration);
    }
  });

})();
