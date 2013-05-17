
App.dialogs.Subscribe = Backbone.View.extend({
  className: "modal-background",
  template: Handlebars.templates['dialog-subscribe.tmpl'],
  events: {
    "click #cancel": "remove",
    "click .subscribe-button": "subscribe_clickHandler"
  },
  initialize: function(show_on_create) {
    console.log("App.dialogs.Subscribe.initialize()");
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
    this.$("#subscribe-dialog").addClass("pop");
  },
  subscribe_clickHandler: function(e) {
    e.preventDefault();
    
    var productId = $(e.currentTarget).attr("id");
    var subscription = App.api.receiptService.availableSubscriptions[productId];
    var transaction = subscription.purchase();
    
    transaction.completedSignal.addOnce(function(transaction) {
      if (transaction.state == adobeDPS.transactionManager.transactionStates.FINISHED)
        App.trigger("subscriptionPurchased", subscription);
    });
    
    this.remove();
  }
});