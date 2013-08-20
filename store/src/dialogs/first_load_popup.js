
App.dialogs.FirstLoadPopup = Backbone.View.extend({
  className: "modal-background",
  template: Handlebars.templates['first-load-popup.tmpl'],
  events: {
    "click a": function(evt) { evt.preventDefault(); },
    "click .close": "remove",
    "click .restore-btn": "restore",
    "click .sign-in-btn": "signin"
  },
  initialize: function() {
    var that = this;
    this.render(function() {
      that.$el.appendTo("body"); 
      that.open();
    });
  },
  render: function(cb) {
    cb = cb || $.noop;
    var that = this;

    App.api.authenticationService.user_is_subscriber(function(is_subscriber) {
      that.$el.html(that.template({
        settings: settings,
        is_subscriber: is_subscriber
      }));
      cb();
    });
  },
  open: function() {
    this.$(".dialog").addClass("pop");
  },
  restore: function() {
    App.api.receiptService.restorePurchases();
    this.remove()
  },
  signin: function() {
    new App.dialogs.SignIn()
    this.remove()
  }
});
