
App.dialogs.iOS8Popup = Backbone.View.extend({
  className: "modal-background",
  template: Handlebars.templates['ios8-popup.tmpl'],
  events: {
    "click a": function(evt) { evt.preventDefault(); },
    "click .close-btn": "close"
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

    that.$el.html(that.template({ settings: settings }));
    cb();
  },
  open: function() {
    this.$(".dialog").addClass("pop");
  },
  close: function() {
    this.$el.remove();
  }
});
