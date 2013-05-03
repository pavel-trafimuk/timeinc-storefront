(function() {
  
  App.views.Welcome = Backbone.View.extend({
    className: "welcome-view",
    template: Handlebars.templates["welcome.tmpl"],
    events: {
      "click .launch-repl": "launch_repl"
    },
    render: function() {
      var cx = {img_only_cover_url: "", full_cover_url: ""};
      this.$el.html(this.template(cx));
      return this;
    },
    animate: function() {
      var that = this;
      that.$(".cover-with-text").fadeIn(function() {
        that.$(".buttons").fadeIn();
      });
    },
    launch_repl: function() {
      repl(this.options.api); 
    }
  });

})();
