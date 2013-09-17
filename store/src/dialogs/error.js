
App.dialogs.ErrorMsg = Backbone.View.extend({
  className: "modal-background",
  template: Handlebars.templates['dialog-error.tmpl'],
  events: {
    "click #cancel": "onOK"
  },
  initialize: function(show_on_create) {
    console.log("App.dialogs.ErrorMsg.initialize()");

    if (show_on_create !== false) {
      this.render().$el.appendTo("body");
      this.open();
    }
  },
  render: function() {
    console.log("App.dialogs.ErrorMsg.render()");
    
    var message1, message2;
    
    switch (settings.error_code) {
      case "-500":
        message1 = "There is not enough space to download this item.";
        message2 = "Please free up space and try again.";
        break;
      default:
        message1 = "Error";
        break;
    }
    
    var cx = { message1: message1, message2: message2 };
    
    this.$el.html(this.template(cx));
    
    return this;
  },
  open: function() {
    console.log("App.dialogs.ErrorMsg.open()");
    this.$("#error-dialog").addClass("pop");

    //this.omni_pv = App.omni.pageview("subscribe", "event1");
  },
  onOK: function() {
    //App.omni.event("error_cancel");
    this.remove();
  },
  remove: function() {
    //TcmOmni.set_pagename(this.omni_pv.prev);
    Backbone.View.prototype.remove.apply(this, arguments);
  }
});