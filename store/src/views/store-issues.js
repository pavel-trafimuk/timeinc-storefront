(function() {
  
  App.views.StoreIssues = Backbone.View.extend({
    className: "store-issues-view",
    template: Handlebars.templates["store-issues.tmpl"],
    events: {

    },
    initialize: function() {
      console.log("App.views.StoreIssues initializing");
    },
    render: function() {
      var cx = { issues: App.api.libraryService.get_back_issues() };
      this.$el.html(this.template(cx));
      return this;
    },
    animate: function(cb) {
      var that = this,
          cb = cb || $.noop;
      cb(); 
    }
  });

})();

