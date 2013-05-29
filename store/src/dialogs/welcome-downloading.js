
App.dialogs.WelcomeDownloading = Backbone.View.extend({
  template: Handlebars.templates['dialog-welcome-downloading.tmpl'],
  events: {
    "click #cancel": "remove",
    "click .subscribe-button": "subscribe_clickHandler"
  },
  initialize: function(show_on_create) {
    console.log("App.dialogs.WelcomeDownloading.initialize()");
    if (show_on_create !== false) {
      this.render().$el.appendTo("body");
      this.open();
    }
  },
  render: function() {
    console.log("App.dialogs.Subscribe.render()");
    this.$el.html(this.template({
      settings: settings,
      subscriptions: _(App.api.receiptService.availableSubscriptions).values()
    }));
    return this;
  },
  open: function() {
    console.log("App.dialogs.Subscribe.open()");
    this.$(".dialog").addClass("pop");
  },
});
