(function() {
  
  window.WelcomeView = Backbone.View.extend({
    className: "welcome-view",
    template: Handlebars.templates["welcome.tmpl"],
    render: function() {
      this.$el.html(this.template())
      return this;
    },
    animate: function() {
      var that = this;
      that.$(".cover-with-text").fadeIn(function() {
        that.$(".buttons").fadeIn();
      });
    }
  });

})();
