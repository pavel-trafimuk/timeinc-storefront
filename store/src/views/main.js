(function() {
  
  App.views.Main = Backbone.View.extend({
    el: "body",
    render: function() {
      view = new App.views.Welcome({api: this.options.api});
      view.render().$el.appendTo(this.$el);
      view.animate();
    } 
  });

})();
