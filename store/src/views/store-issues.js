(function() {
  
  App.views.StoreIssues = Backbone.View.extend({
    className: "store-issues-view",
    template: Handlebars.templates["store-issues.tmpl"],
    events: {
      "click .issue": "view_issue"
    },
    initialize: function() {
      console.log("App.views.StoreIssues initializing");
    },
    render: function() {
      var cx = { issues: App.api.libraryService.get_back_issues(), settings: settings };
      this.$el.html(this.template(cx));
      
      this.$(".cover-img").each(function() {
        var img = this; 
        function showme() { $(img).show().siblings(".cover-spacer-img").hide(); }
        if (img.complete) showme();
        else {
          $(img).on("load", showme);
        }
      });

      return this;
    },
    animate: function(cb) {
      var that = this,
          cb = cb || $.noop;
      cb(); 
    },
    view_issue: function(evt) {
      console.log("App.views.StoreIssues.view_issue()");
      var $this = $(evt.currentTarget),
          product_id = $this.data("productId"),
          folio = App.api.libraryService.get_by_productId(product_id);
      console.log("product_id: ", product_id, "folio.productId: ", folio.productId);
      folio.view_or_preview();
    }
  });

})();

