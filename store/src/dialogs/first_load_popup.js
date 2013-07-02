
// THIS IS TEMPORARY AND SHOULD BE REMOVED FROM THE APP AFTER A FEW WEEKS
App.dialogs.FirstLoadPopup = Backbone.View.extend({
  className: "modal-background",
  template: Handlebars.templates['first-load-popup.tmpl'],
  events: {
    "click .close": "remove"
  },
  initialize: function() {
    console.log("App.dialogs.FirstLoadPopup.initialize()");
    this.render().$el.appendTo("body");
    this.open();
  },
  render: function() {
    console.log("App.dialogs.FirstLoadPopup.render()");
    this.$el.html(this.template({
      settings: settings
    }));
    return this;
  },
  open: function() {
    console.log("App.dialogs.FirstLoadPopup.open()");
    this.$(".dialog").addClass("pop");
  },
});
