/* global DEBUG, REPL, Backbone, App, settings, TcmOmni, EMStart, EMSetEventQueueCallback, EMForceFlush */
/* Dependencies:
 *  - tcm_devtools (jquery, backbone -> underscore, settings)
 *  - backbone (underscore, jquery)
 *  - underscore
 *  - settings ({brand}.js -> settings_loader.js)
 *  - tcm_omniture
 *  - ema-*.js
 */
(function() {
  window.App = {
    views: {
      show_folio_detail: function(folio, large_img_url) {
        var View = App.views[settings.store_folio_detail_view];
        return new View(folio, large_img_url);
      }
    },
    dialogs: {},

    debug: {
      launch_repl: function() {
        if (!DEBUG) return;
        var repl = new REPL();
        repl.render().$el.appendTo("body");
        setTimeout(function() { repl.start() }, 200);
      },
      reload: function() {
        window.location.reload(true);
      }
    },

    // Logging/Error-logging into Omniture (for production logging)
    log: function() { return TcmOmni.log.apply(TcmOmni, arguments) },
    error: function() { return TcmOmni.error.apply(TcmOmni, arguments) },

    // Omniture Helper functions
    omni: {
      pageview: function(page_name) {
        this.dps_event("store|pageview|"+page_name, page_name);
        return TcmOmni.pageview.apply(TcmOmni, arguments);
      },
      event: function(evt_name) {
        this.dps_event(evt_name);
        return TcmOmni.event.apply(TcmOmni, arguments);
      },
      dps_event: function(evt_name, page_name) {
        if (page_name !== undefined) page_name = "store|"+page_name;
        else page_name = TcmOmni.get_pagename();

        // get the currently running AB tets if the AB testing
        // framework is loaded
        var ab_tests = window.AB ? AB.omnitureString() : '';

        App.api.analyticsService.trackCustomEvent("customEvent3", {
          customVariable3: evt_name,
          customVariable4: page_name,
          customVariable7: ab_tests
        });
      }
    },

    eMagsInit: function() {
      if (!settings.eMagsAppId || typeof adobeDPS === "undefined") return;

      EMStart();
      Backbone.trigger("eMagsReady");
    },
    waitForEMags: function(cb) {
      if (!settings.eMagsAppId || typeof adobeDPS === "undefined") {
        setTimeout(function() { cb(true) });
      }
      else {
        EMSetEventQueueCallback(
          function() { cb(true); },
          function() { cb(false); }
        );
      }
    }
  }
})();
