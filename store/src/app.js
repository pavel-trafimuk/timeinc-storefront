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
    }
  }
  _.extend(App, Backbone.Events);
})();
