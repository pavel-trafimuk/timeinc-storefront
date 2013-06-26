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
    dps_omniture_event: function(evt_name, page_name) {
      if (page_name !== undefined) page_name = "store|"+page_name;
      else page_name = TcmOmni.get_pagename();

      App.api.analyticsService.trackCustomEvent("customEvent3", {
        customVariable3: evt_name,
        customVariable4: page_name
      });
    }
  }
  _.extend(App, Backbone.Events);
})();
