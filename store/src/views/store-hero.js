(function() {
  
  App.views.StoreHero = Backbone.View.extend({
    className: "store-hero-view",
    template: Handlebars.templates["store-hero.tmpl"],
    events: {
      "tap .buy-issue-button": "buy_issue",

      "tap .cover": "goto_preview",
      "swipeleft .cover": "goto_preview",

      "tap .subscribe-button": "subscribe",
      "tap .in-this-issue article": "goto_itii",
      "tap .print-subscribers": "print_subs_getitfree"
    },
    initialize: function() {
      console.log("App.views.StoreHero initializing");
      var that = this,
          render;
      
      render = function() {
        setTimeout(function() {
          that.render()
        }, 50);
      }
      render = _.debounce(render, 200);

      App.api.receiptService.newReceiptsAvailableSignal.add(render);
      App.api.authenticationService.userAuthenticationChangedSignal.add(render);
      App.api.libraryService.updatedSignal.add(render);
      App.api.libraryService.get_touted_issue().updatedSignal.add(render);
    },
    render: function(cb) {
      console.log("StoreHero.render() called");
      cb = cb || $.noop;
      var that = this,
          folio = App.api.libraryService.get_touted_issue();

      _.bindAll(folio);

      App.api.authenticationService.user_is_subscriber(function(is_subscriber) {
        var cx = { 
          settings: settings, 
          folio: folio,
          is_subscriber: is_subscriber
        };
        that.$el.html(that.template(cx)).hammer();
        that.$(".cover img").imgPlaceholder();
        cb();
      });
      return this;
    },
    animate: function(cb) {
      var that = this,
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

      App.omni.event("st_"+$this.data("action")+"_taps");

      $curl.hide();
      $progress.attr("data-label", "Loading…");
      
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
    goto_preview: function(evt) {
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
      var folio = App.api.libraryService.get_touted_issue();
      new App.views.IssuePreviewImage(folio);
    },
    goto_native_preview: function(link) {
      var $progress = this.$(".issue-cover").addClass("progress");
      $progress.attr("data-label", "Opening Issue…");

      this.$(".page-curl").fadeOut();
      var folio = App.api.libraryService.get_touted_issue();
      folio.view_or_preview({
        complete: function() {
          $progress.attr("data-label", "Opening Issue…");
          if (link) {
            setTimeout(function() { folio.goto_dossier(link) }, 150);
            return false;
          }
        },
        download_progress: function(progress) {
          $progress.attr("data-label", "Downloading…");
          $(".progress-bar", $progress).css("width", progress+"%");
        }
      });
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
      var that = this;
          $this = $(evt.currentTarget),
          $msg = $this.find(".opening-issue-text"),
          dossier_id = $this.data("destination");

      $msg.addClass("show-loading");
      setTimeout(function(){$msg.removeClass("show-loading")}, 3500);
      
      that.goto_native_preview(dossier_id);
    }
  });

})();


