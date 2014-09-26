/* global settings, $, adobeDPS, libBanner, Backbone */
window.libUI = (function() {
  // Note: if the views in this file look busted, make sure you're
  //   including "_includes/libUI.scss" in your style sheet

  // lib is the object that will be stored in window.libUI
  var lib = {};

  lib.ProgressView = Backbone.View.extend({
    className: "modal-overlay",
    template: _.template("<div class='progress-box modal-box'>Opening…<% for (var i=6; i--;) { %><div class='progress-tick progress-tick-<%= i %>'></div><% } %></div>"),
    events: {
        "tap": function(evt) { evt.preventDefault() },
        "touchmove": function(evt) { evt.preventDefault() },
      "click": function(evt) { evt.preventDefault() }
    },
    initialize: function() {
      var that = this;
      this.render();
      this.$el.appendTo("html");

      setTimeout(function() {
        that.$el.addClass("show");
        that.$(".modal-box").addClass("show");
      });
    },
    render: function() {
      var cx = {};
      return this.$el.html(this.template(cx))
    }
  });

  lib.SubscribeDialog = Backbone.View.extend({
      className: "modal-overlay",
      template: _.template($("#subscribe-dialog-template").html()),
      events: {
        "tap": function(evt) { evt.preventDefault() },
        "touchmove": function(evt) { evt.preventDefault() },
      "click": function(evt) { evt.preventDefault() },
          "tap .sd-close-button": "close",
          "tap .sd-subscribe-button": "onSubscribe"
      },
      initialize: function() {
        var that = this;

        libBanner.api_ready(function() {
          that.render()
          that.$el.appendTo("html");
          setTimeout(function() {
          that.$el.addClass("show");
          that.$(".modal-box").addClass("show");
        });
        });
    },
    render: function() {
      var cx = {
        subscriptions: _(libBanner.api.receiptService.availableSubscriptions).values()
      }
      this.$el.html(this.template(cx));
      return this;
    },
      close: function() {
          this.remove();
      },
      onSubscribe: function(evt) {
          evt.preventDefault();
      
          var productId = $(evt.currentTarget).attr("id");
          var subscription = libBanner.api.receiptService.availableSubscriptions[productId];
          var transaction = subscription.purchase();
      
          transaction.completedSignal.addOnce(function(transaction) {
              var success = (transaction.state == libBanner.api.transactionManager.transactionStates.FINISHED);
              if (success) {
                  sub_status.is_sub = true;
                  sub_status.sub_type = "itunes";
                  Backbone.trigger("subscriptionStatusUpdated", sub_status);
              }
          });
        
        this.remove();

        if (this.options.onclose) this.options.onclose();
      }
  });

  return lib;

})();
