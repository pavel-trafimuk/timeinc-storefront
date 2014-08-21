
/* globals App, TcmOmni, Backbone, Handlebars, settings */
App.dialogs.BuyIssue = Backbone.View.extend({
  className: "modal-background",
  template: Handlebars.templates['dialog-buy-issue.tmpl'],
  events: {
    "click .cancel": "onCancel",
    "click .close" : "onCancel",
    "click .continue-btn": "continueAndBuy",
    "click .subscribe-btn": "subscribe"
  },
  initialize: function(opts) {
    console.log("App.dialogs.BuyIssue.initialize()");

    this.folio = opts.folio;
    this.render().$el.appendTo("body");
    this.open();
  },
  render: function() {
    console.log("App.dialogs.Subscribe.render()");
    this.$el.html(this.template({
      title: settings.buyIssueTitle,
      text: this.interpolate(settings.buyIssueText),
      subscribeBtn: settings.buyIssueSubscribe,
      continueBtn: this.interpolate(settings.buyIssueContinue),
      cancelBtn: settings.subscribeCancel
    }));
    return this;
  },
  interpolate: function(msg) {
    msg = msg.replace(/\%price\%/g, this.folio.price);
    msg = msg.replace(/\%discount\%/g, settings.buyIssueSubscribeDiscount);
    return msg;
  },
  open: function() {
    console.log("App.dialogs.BuyIssue.open()");
    this.$(".dialog").addClass("pop");

    this.omni_pv = App.omni.pageview("buyIssueDialog", "event1");
  },
  subscribe: function() {
    App.omni.event("buyissue_subscribetap");
    new App.dialogs.Subscribe();
    this.remove();
  },
  continueAndBuy: function(evt) {
    var that = this,
        $dialog = this.$('.dialog');
    
    $dialog.addClass("purchasing");

    this.folio.purchase_and_download({
      complete: function() {
        that.remove();
      },
      download_progress: function(progress) {},
      error: function(error_code) {
        if (error_code < 0) {
          new App.dialogs.ErrorMsg({error_code: error_code});
        }
        $dialog.removeClass("purchasing");
      },
      cancelled: function() {
        $dialog.removeClass("purchasing");
      }
    });
  },
  onCancel: function() {
    App.omni.event("buyissue_cancel");
    this.remove();
  },
  remove: function() {
    (this.options.onExit || function(){})()
    TcmOmni.set_pagename(this.omni_pv.prev);
    Backbone.View.prototype.remove.apply(this, arguments);
  }
});
