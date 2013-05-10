(function() {
  
  App.views.Main = Backbone.View.extend({
    el: "body",
    events: {
      "click .goto-store": "goto_store"
    },
    initialize: function() {
      this.current_view = "Welcome";
    },
    render: function() {
      this.$el.html('');
      var view = new App.views[this.current_view]();
      view.render().$el.appendTo(this.$el);
      view.animate();
    },
    goto_store: function() {
      this.current_view = "Store";
      this.render();
    }
  });

})();
