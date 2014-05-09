/* globals App, Backbone, Handlebars, Hammer, $, _, console, settings */
(function() {
  
  App.views.StoreHeroSlideshow = Backbone.View.extend({
    className: "store-hero-slideshow-view",
    template: Handlebars.templates["store-hero-slideshow.tmpl"],
    events: {
      "tap .buy-issue-button": "buy_issue",

      "tap .issue-cover": "goto_preview",

      "tap .preview": "goto_preview_issue",
      "tap .subscribe": "subscribe",
      "tap .in-this-issue article": "goto_itii",
      "tap .print-subscribers": "print_subs_getitfree"
    },
    initialize: function() {
      console.log("App.views.StoreHeroSlideshow initializing");
      var that = this,
          render;

      Hammer.gestures.Drag.defaults.drag_block_horizontal = true;
      Hammer.gestures.Drag.defaults.drag_lock_to_axis = true;
      
      render = _.bind(this.render, this, $.noop);
      render = _.partial(_.delay, render, 50);
      render = _.debounce(render, 200);

      $(window).on("resize", function() {
        that.render();
      });
      
      App.api.receiptService.newReceiptsAvailableSignal.add(render);
      App.api.authenticationService.userAuthenticationChangedSignal.add(render);
      App.api.libraryService.updatedSignal.add(render);
      App.api.libraryService.get_touted_issue().updatedSignal.add(render);

      this.$el.hammer();
    },
    render: function(cb) {
      console.log("StoreHeroSlideshow.render() called");
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
            .map(function(s) { return "<span class='sub-price'>" + s + "</span>"; })
            .join(settings.storeSubscribeNowPriceOr);
        }
        
        var slides = "";
        if (App.api.tcm_feed.slideshows.length > 0) {
          //slides = App.api.tcm_feed.slideshows[0].slides
          slides = App.api.libraryService.get_store_hero_slideshow()
            .map(function(s) { return "<div class='slide' style='background-image: url(" + s + ");'><a href='#'></a></div>" });
        }
        
        var cx = {
          settings: settings,
          folio: folio,
          is_subscriber: is_subscriber,
          is_authenticated: is_subscriber || App.api.authenticationService.isUserAuthenticated,
          sub_opts: sub_opts,
          hero_scroll_covers: folio.get_additional_covers(),
          hero_slides: slides
        };
        that.$el.html(that.template(cx));
        setTimeout(function() {
          that.setup_sidescroller("main-gallery");
        });
        cb();
      });
      
      return this;
    },
    setup_sidescroller: function(elementId) {
      var $main_gallery = document.getElementById(elementId);

      gallery = new libBanner.SlideshowGallery($main_gallery);
      gallery.enableTouch().slideEvery(5000);
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
      var that = this,
          $this = $(evt.currentTarget),
          $progress = this.$(".issue-cover"),
          $curl = this.$(".page-curl");

      App.omni.event("st_"+$this.data("action")+"_taps");
      this.disable_rendering = true;

      if (settings.heroBuyIssue_useDialog) {
        new App.dialogs.BuyIssue({
          folio: App.api.libraryService.get_touted_issue(),
          onExit: function() {
            that.disable_rendering = false;
          }
        });
        return;
      }

      $this.addClass("btn-depressed");
      $curl.hide();
      $progress.addClass("progress")
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
          $this.removeClass("btn-depressed");
          $curl.show();
          that.disable_rendering = false;
        },
        cancelled: function() {
          $progress.attr('data-label', '').removeClass("progress");
          $this.removeClass("btn-depressed");
          $curl.show();
          that.disable_rendering = false;
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
      if ($("#updatefolio-dialog").length > 0) {
        // Do nothing while update prompt is on the screen
      } else {
        window.clearInterval(folioUpdateInterval);
        folio.view_or_preview({
          complete: function() {
            if (folio.is_sample){
              $sampleBtn.html(settings.progressOpening);
            }
          
            $progress.attr("data-label", settings.progressOpening);
            if (link) {
              setTimeout(function() { folio.goto_dossier(link); }, 150);
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
    subscribe: function(evt) {
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
      setTimeout(function(){$msg.removeClass("show-loading");}, 5000);
      
      that.goto_native_preview(dossier_id);
    }
  });

})();


