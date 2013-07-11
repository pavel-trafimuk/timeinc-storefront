
// THIS IS TEMPORARY AND SHOULD BE REMOVED FROM THE APP AFTER A FEW WEEKS
App.dialogs.FirstLoadPopup = Backbone.View.extend({
  className: "modal-background",
  template: Handlebars.templates['first-load-popup.tmpl'],
  events: {
    "click .close": "remove",
    "click .download-issue-btn": "download_issue"
  },
  initialize: function() {
    var that = this;
    console.log("App.dialogs.FirstLoadPopup.initialize()");

    this.render(function() {
      that.$el.appendTo("body"); 
      that.open();
    });
  },
  render: function(cb) {
    cb = cb || $.noop;
    var that = this;
    console.log("App.dialogs.FirstLoadPopup.render()");

    App.api.authenticationService.user_is_subscriber(function(is_subscriber) {
      that.$el.html(that.template({
        settings: settings,
        is_subscriber: is_subscriber
      }));
      cb();
    });
    return this;
  },
  open: function() {
    console.log("App.dialogs.FirstLoadPopup.open()");
    this.$(".dialog").addClass("pop");
  },
  download_issue: function() {
    var that = this;

    if (this.$(".download-issue-btn").data("isSubscriber")) {
      var folio = App.api.libraryService.get_latest_issue(),
          dialog = new App.dialogs.WelcomeDownloading(),
          $progress = dialog.$(".progress");

      folio.download_and_view({
        complete: function() {
          $progress.attr("data-label", "Opening Issue…");
        },
        download_progress: function(progress) {
          $progress.attr("data-label", "Downloading…");
          $(".progress-bar", $progress).css("width", progress+"%");
        }
      });
    }
    this.$el.fadeOut(500, function() { that.remove() });
  }
});
