
App.dialogs.UpdateFolio = Backbone.View.extend({
  className: "modal-background",
  template: Handlebars.templates['dialog-updatefolio.tmpl'],
  events: {
    "click #cancel": "onNotNow",
    "click #ok": "onYes"
  },
  initialize: function(opts) {
    console.log("App.dialogs.UpdateFolio.initialize()");
    this.folio = opts.folio;
    
    if (opts.show_on_create !== false) {
      this.render().$el.appendTo("body");
      this.open();
    }
  },
  render: function() {
    console.log("App.dialogs.UpdateFolio.render()");
    
    var cx = { folio : this.folio };
    
    this.$el.html(this.template(cx));
    
    return this;
  },
  open: function() {
    console.log("App.dialogs.UpdateFolio.open()");
    this.$("#updatefolio-dialog").addClass("pop");

    //this.omni_pv = App.omni.pageview("subscribe", "event1");
  },
  onYes: function() {
    //App.omni.event("error_cancel");
    this.folio.isUpdatable = true;
    this.remove();
  },
  onNotNow: function() {
    //App.omni.event("error_cancel");
    this.folio.isUpdatable = false; //force folio to be non-updatable in order to view old sample (there has to be a better way)
    this.remove();
  },
  remove: function() {
    //TcmOmni.set_pagename(this.omni_pv.prev);
    Backbone.View.prototype.remove.apply(this, arguments);
  }
});
