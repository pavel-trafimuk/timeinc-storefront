/* globals App, Backbone, Handlebars, Hammer, $, _, console, settings */
(function() {
  
  App.views.StoreHero = Backbone.View.extend({
    className: "store-hero-view",
    template: Handlebars.templates["store-hero.tmpl"],
    events: {
      "tap .buy-issue-button": "buy_issue",

      "tap .issue-cover": "goto_preview",

      "touchstart .issue-cover": function(ev) { ev.preventDefault() },
      "drag .issue-cover": "cover_drag",
      "swipeleft .issue-cover": "cover_swipeleft",
      "swiperight .issue-cover": "cover_swiperight",
      "release .issue-cover": "cover_release",
      "release": "release_outside_cover",

      "tap .preview-button": "goto_preview_issue",
      "tap .subscribe-button": "subscribe",
      "tap .in-this-issue article": "goto_itii",
      "tap .print-subscribers": "print_subs_getitfree",
      "tap .prev-cover": "prev_cover",
      "tap .next-cover": "next_cover"
    },
    initialize: function() {
      console.log("App.views.StoreHero initializing");
      var that = this,
          render;

      Hammer.gestures.Drag.defaults.drag_block_horizontal = true;
      Hammer.gestures.Drag.defaults.drag_lock_to_axis = true;
      
      render = _.bind(this.render, this, $.noop);
      render = _.partial(_.delay, render, 50);
      render = _.debounce(render, 200);

      $(window).on("resize orientationchange", function() {
        that.setup_sidescroller();
      });
      App.api.receiptService.newReceiptsAvailableSignal.add(render);
      App.api.authenticationService.userAuthenticationChangedSignal.add(render);
      App.api.libraryService.updatedSignal.add(render);
      App.api.libraryService.get_touted_issue().updatedSignal.add(render);

      this.$el.hammer();
    },
    render: function(cb) {
      console.log("StoreHero.render() called");
      cb = cb || $.noop;
      var that = this,
          folio = App.api.libraryService.get_touted_issue();

      // Buying/downloading an issue will trigger a re-render via
      // updatedSignal, but re-rendering will break the UI feedback. Since the 
      // user is leaving the store, we'll just cancel the re-render in those
      // cases
      if (this.disable_rendering) return;

      _.bindAll(folio);

      
      App.api.authenticationService.user_is_subscriber(function(is_subscriber) {
        var sub_opts = "";
        if (!is_subscriber) {
          sub_opts = App.api.receiptService.get_short_subnames()
            .map(function(s) { return "<span class='sub-price'>" + s + "</span>" })
            .join(settings.storeSubscribeNowPriceOr);
        }
        var cx = {
          settings: settings,
          folio: folio,
          is_subscriber: is_subscriber,
          is_authenticated: is_subscriber || App.api.authenticationService.isUserAuthenticated,
          sub_opts: sub_opts,
          hero_scroll_covers: folio.get_additional_covers()
        };
        that.$el.html(that.template(cx));
        setTimeout(function() {
          that.setup_sidescroller();
        });
        cb();
      });
      return this;
    },
    setup_sidescroller: function() {
      var $issue_cover = this.$(".issue-cover"),
          $container = this.$(".cover-image-container"),
          $covers = this.$(".cover-img"),
          h = $issue_cover.height(),
          w = $issue_cover.width();

      // cache these for later to improve scroll performance
      this.$cover_container = $container;
      this.$covers = $covers;
      this.$scroll_pos = this.$(".cover-scroll-position .pos-dot");
      this.cover_count = $covers.length;
      this.cover_width = w;
      this.current_cover = this.current_cover || 0;

      $covers.css({height: h, width: w});
      $container.css({height: h, width: w * this.cover_count});
      this._setVisibleCover(this.current_cover, false);
    },
    _setCoverContainerOffset: function(distance, animate) {
      var $container = this.$cover_container;
    
      $container.removeClass("animate");
      if (animate) $container.addClass("animate");

      $container.css("transform", "translate3d("+ distance +"px,0,0) scale3d(1,1,1)");
    },
    _setVisibleCover: function(cover_index, animate) {
      if (animate === undefined) animate = true;

      cover_index = Math.max(0, Math.min(this.cover_count-1, cover_index));
      this.current_cover = cover_index;
      this._setCoverContainerOffset(-cover_index*this.cover_width, animate);

      this.$covers.removeClass("active");
      $( this.$covers[cover_index] ).addClass("active");

      this.$scroll_pos.removeClass("active");
      $( this.$scroll_pos[cover_index] ).addClass("active");
    },
    _currentCover: function() {
      return this.current_cover;
    },
    cover_drag: function(evt) {
      evt.gesture.preventDefault();

      var pane_offset = -this.current_cover * this.cover_width,
          drag_offset = evt.gesture.deltaX;

      if ((evt.gesture.direction == Hammer.DIRECTION_RIGHT && this.current_cover === 0) ||
          (evt.gesture.direction == Hammer.DIRECTION_LEFT  && this.current_cover == this.cover_count-1)) {
        drag_offset *= 0.4;
      }

      this._setCoverContainerOffset(pane_offset + drag_offset);
    },
    cover_swipeleft: function(evt) {
      evt.gesture.stopDetect();
      this.next_cover();
    },
    cover_swiperight: function(evt) {
      evt.gesture.stopDetect();
      this.prev_cover();
    },
    prev_cover: function() {
      this._setVisibleCover(this._currentCover() - 1);
    },
    next_cover: function() {
      this._setVisibleCover(this._currentCover() + 1);
    },
    cover_release: function(evt) {
      evt.stopPropagation();
      evt.gesture.preventDefault();
      if (Math.abs(evt.gesture.deltaX) > this.cover_width/2) {
        if (evt.gesture.direction == Hammer.DIRECTION_RIGHT) {
          this._setVisibleCover(this._currentCover() - 1);
        }
        else {
          this._setVisibleCover(this._currentCover() + 1);
        }
      }
      else {
        this._setVisibleCover(this._currentCover());
      }
    },
    release_outside_cover: function() {
      this._setVisibleCover(this._currentCover());
    },
    
    animate: function(cb) {
      cb = cb || $.noop;
      cb();
    },
    print_subs_getitfree: function(evt) {
      App.omni.event("st_getitfree_taps");
      evt.preventDefault();

      // Give omniture a chance to track
      setTimeout(function() {
        location.href = settings.WesPageURL;
      }, 250);
    },
    buy_issue: function(evt) {
      var $this = $(evt.currentTarget),
          $progress = this.$(".issue-cover").addClass("progress"),
          $curl = this.$(".page-curl");

      this.disable_rendering = true;

      App.omni.event("st_"+$this.data("action")+"_taps");

      $curl.hide();
      $progress.attr("data-label", settings.progressStarting);
      
      App.api.libraryService.get_touted_issue().purchase_and_download({
        complete: function() {
          $progress.attr("data-label", settings.progressOpening);
        },
        download_progress: function(progress) {
          $progress.attr("data-label", settings.progressDownloading);
          $(".progress-bar", $progress).css("width", progress+"%");
        },
        error: function(error_code) {
          if (error_code < 0) {
            new App.dialogs.ErrorMsg({error_code: error_code});
          }
          $progress.attr('data-label', '').removeClass("progress");
          $curl.show();
        },
        cancelled: function() {
          $progress.attr('data-label', '').removeClass("progress");
          $curl.show();
        }
      });
    },
    goto_preview_issue: function(evt) {
      App.omni.event("st_hero_sample_issue_taps");
      var $this = $(evt.currentTarget),
          product_id = $this.attr("productId"),
          dossier_id = $this.attr("dossierId"),
          folio = App.api.libraryService.get_by_productId(product_id);
       
      if (folio) {
        folio.is_sample = true;
        this.goto_native_preview(dossier_id, folio);
      }
    },
    goto_preview: function() {
      App.omni.event("st_preview_featured_taps");
      if (settings.hero_preview == "image") {
        return this.goto_image_preview();
      }
      else if (settings.hero_preview == "adobe") {
        var folio = App.api.libraryService.get_touted_issue();
        if (folio.tcm && folio.tcm.link) {
          return this.goto_native_preview(folio.tcm.link);
        }
        else {
          this.goto_native_preview();
        }
      }
    },
    goto_image_preview: function() {
      var folio = App.api.libraryService.get_touted_issue(),
          scroll_cover_index = this.$(".cover-img.active").data("scrollCoverIndex"),
          large_img_url = folio.get_additional_covers_large()[scroll_cover_index];

      new App.views.IssuePreviewImage(folio, large_img_url);
    },
    goto_native_preview: function(link, folio) {
      var $progress = this.$(".issue-cover").addClass("progress"),
          $sampleBtn = this.$(".preview-button");
      
      $progress.attr("data-label", settings.progressStarting);
      this.disable_rendering = true;

      this.$(".page-curl").fadeOut();
      if (!folio) {
        folio = App.api.libraryService.get_touted_issue();
      }
      
      if (folio.is_sample){
        $sampleBtn.html(settings.progressStarting);
      }
      
      if (folio.isUpdatable) {
        new App.dialogs.UpdateFolio({folio : folio});
      }
      
      var folioUpdateInterval = window.setInterval(function() {
      if ($("#").length > 0) { // Do nothing while update prompt is on the screen
      } else {
      folio.view_or_preview({
        complete: function() {
          if (folio.is_sample){
            $sampleBtn.html(settings.progressOpening);
          }
          
          $progress.attr("data-label", settings.progressOpening);
          if (link) {
            setTimeout(function() { folio.goto_dossier(link) }, 150);
            return false;
          }
        },
        download_progress: function(progress) {
          if (folio.is_sample){
            $sampleBtn.html(settings.progressDownloading);
          }
          
          $progress.attr("data-label", settings.progressDownloading);
          $(".progress-bar", $progress).css("width", progress+"%");
        }
      });
      }
      }, 100);
    },
    subscribe: function() {
      App.omni.event("st_subscribe_taps");
      new App.dialogs.Subscribe();
    },
    goto_itii: function(evt) {
      var $this = $(evt.currentTarget);
      App.omni.event("st_inthisissue_"+$.trim($("h3", $this).text()).toLowerCase()+"_taps");
      if (settings.hero_itii_preview == "image") {
        return this.goto_image_preview();
      }
      else if (settings.hero_itii_preview == "adobe") {
        return this.goto_itii_native(evt);
      }
    },
    goto_itii_native: function(evt) {
      var that = this,
          $this = $(evt.currentTarget),
          $msg = $this.find(".opening-issue-text"),
          dossier_id = $this.data("destination");

      $msg.addClass("show-loading");
      setTimeout(function(){$msg.removeClass("show-loading")}, 5000);
      
      that.goto_native_preview(dossier_id);
    }
  });

})();


