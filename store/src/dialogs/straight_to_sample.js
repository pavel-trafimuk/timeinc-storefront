
/* globals App, TcmOmni, Backbone, Handlebars, settings */
App.dialogs.StraightToSample = Backbone.View.extend({
  className: "modal-background",
  template: Handlebars.templates['dialog-straight-to-sample.tmpl'],
  events: {
    "click .cancel": "onCancel",
    "click .continue-btn": "continueAndBuy",
    "click .subscribe-btn": "subscribe"
  },
  initialize: function(opts) {
    console.log("App.dialogs.StraightToSample.initialize()");
    
    // Bail out when we're not supposed to show it
    if (!settings.straightToSampleEnabled) return;
    if (+localStorage.app_view_count) return;

    this.folio = App.api.libraryService.get_by_productId(settings.preview_issue_product_id);
    if (!this.folio) return;

    var using_wifi = App.api.deviceService.networkType === App.api.deviceService.networkTypes.WIFI;
    if (this.folio.isDownloadable && using_wifi) {
      this.folio.download();
    }

    this.render().$el.appendTo("html");
    this.open();
  },
  render: function() {
    console.log("App.dialogs.StraightToSample.render()");
    this.$el.html(this.template({
      title: settings.straightToSampleTitle,
      text: settings.straightToSampleText,
      coverImg: this.folio.get_cover_img() + (+new Date()),
      continueBtn: settings.straightToSampleContinueBtn,
      cancelBtn: settings.straightToSampleCancelBtn
    }));
    return this;
  },
  open: function() {
    console.log("App.dialogs.StraightToSample.open()");
    this.$(".dialog").addClass("pop");

    this.omni_pv = App.omni.pageview("straightToSampleDialog", "event1");
  },
  continueAndBuy: function(evt) {
    var that = this,
        $dialog = this.$('.dialog');
    
    $dialog.addClass("purchasing");

    this.folio.purchase_and_download({
      complete: function() {
        //that.remove();
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
    App.omni.event("straighttosample_notnow");
    this.remove();
  },
  remove: function() {
    (this.options.onExit || function(){})()
    TcmOmni.set_pagename(this.omni_pv.prev);
    Backbone.View.prototype.remove.apply(this, arguments);
  }
});
