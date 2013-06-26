(function() {
  window.App = {
    views: {},
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
    omni: {
      pageview: function() {
        return TcmOmni.pageview.apply(TcmOmni, arguments);
      },
      event: function(evt_name) {
        this.dps_event(evt_name);
        return TcmOmni.event.apply(TcmOmni, arguments);
      },
      dps_event: function(evt_name, page_name) {
        if (page_name !== undefined) page_name = "store|"+page_name;
        else page_name = TcmOmni.get_pagename();

        App.api.analyticsService.trackCustomEvent("customEvent3", {
          customVariable3: evt_name,
          customVariable4: page_name
        });
      }
    }
  }
  _.extend(App, Backbone.Events);
})();
