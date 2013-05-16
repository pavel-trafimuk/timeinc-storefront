(function() {
  
  App.views.Welcome = Backbone.View.extend({
    className: "welcome-view",
    template: Handlebars.templates["welcome.tmpl"],
    events: {
      "click .launch-repl": "launch_repl",
      "click .open-preview": "open_preview",
      "click .reload-page": "reload_page"
    },
    initialize: function() {
      console.log("App.views.Welcome initializing");
      var that = this,
          transaction;

      this.folio = App.api.libraryService.get_touted_issue();
    },
    render: function() {
      console.log("App.views.Welcome.render()");
      console.log('folio: ' + this.folio);
      var covers = this.folio.get_welcome_imgs();
      console.log("covers: ", covers);
      var cx = {settings:settings, img_only_cover_url: covers[0], full_cover_url: covers[1]};
      this.$el.html(this.template(cx));
      return this;
    },
    animate: function(cb) {
      console.log("App.views.Welcome.animate()");
      var that = this,
          cb = cb || $.noop;
      setTimeout(function() {
        that.$(".cover-with-text").fadeIn(800, function() {
          that.$(".buttons").fadeIn(800, function() {
            that.$(".already-have-account").fadeIn(800, function() {
              cb();
            });
          });
        });
      }, 800);
    },
    load_cover_images: function(cb) {

    },
    reload_page: function() {
      window.location.reload(true);
    },
    open_preview: function() {
      console.log("open_preview called");

      var that = this,
          folio = this.folio,
          transaction;

      if (folio.isViewable) folio.view();
      else { 
        transaction = this.folio.verifyContentPreviewSupported();
        transaction.completedSignal.addOnce(show_preview);
      }

      function show_preview() { 
        var transaction;
        if (folio.isViewable) return folio.view();
        if (folio.canDownloadContentPreview()) {
          transaction = folio.downloadContentPreview();
          transaction.progressSignal.add(function() {
            var progress = transaction.progress.toFixed(1) + "%";
            if (folio.isViewable) folio.view();
          });
          transaction.stateChangedSignal.add(function() {
            if (folio.isViewable) folio.view();
          });
        }
        else {
          console.log("ERROR: folio has no content preview!! folio: " + folio.productId);
          alert("Err: NO CONTENT PREVIEW");
        }
      }
    },
    launch_repl: function() {
      var repl = new REPL();
      repl.render().$el.appendTo(this.$el);
      setTimeout(function() { repl.start() }, 100);
    }
  });

})();
