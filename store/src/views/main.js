(function() {
  
  App.views.Main = Backbone.View.extend({
    el: "body",
    events: {
      "click .goto-store": "goto_store"
    },
    initialize: function() {
      var that = this;
      this.welcome_view = new App.views.Welcome;
      this.store_view = new App.views.Store;

      this.view = this.welcome_view;
    },
    render: function() {
      var subview = this.view;
      this.$el.empty();
      
      subview.render().$el.appendTo(this.el);
      this.view.animate();
    },
    goto_store: function() {
      this.view = this.store_view;
      this.render();
    }
  });

})();

