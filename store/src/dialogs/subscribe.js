/* global App, Backbone, _, Handlebars, settings, $, TcmOmni */
App.dialogs.Subscribe = Backbone.View.extend({
  className: "modal-background",
  template: Handlebars.templates['dialog-subscribe.tmpl'],
  events: {
    "click #cancel": "onCancel",
    "click .subscribe-button": "onSubscribe"
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
      subscriptions: _(App.api.receiptService.availableSubscriptions).sortBy(function(sub) {
          return _.last(sub.productId.split("."));
        }).reverse()
    }));
    return this;
  },
  open: function() {
    console.log("App.dialogs.Subscribe.open()");
    this.$("#subscribe-dialog").addClass("pop");

    this.omni_pv = App.omni.pageview("subscribe", "event1");
  },
  onCancel: function() {
    App.omni.event("sub_cancel");
    this.remove();
  },
  onSubscribe: function(e) {
    e.preventDefault();
    
    var productId = $(e.currentTarget).attr("id");
    var subscription = App.api.receiptService.availableSubscriptions[productId];
    var transaction = subscription.purchase();

    App.omni.event(
      'sub_'+subscription.duration.toLowerCase()+'_taps',
      subscription.duration + " for " + subscription.price
    );
    
    transaction.completedSignal.addOnce(function(transaction) {
      if (transaction.state == App.api.transactionManager.transactionStates.FINISHED)
        Backbone.trigger("subscriptionPurchased", subscription);
    });
    
    this.remove();
  },
  remove: function() {
    TcmOmni.set_pagename(this.omni_pv.prev);
    Backbone.View.prototype.remove.apply(this, arguments);
  }
});
