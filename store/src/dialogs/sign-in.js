
App.dialogs.SignIn = Backbone.View.extend({
  className: "modal-background",
  template: Handlebars.templates['dialog-signin.tmpl'],
  events: {
    "click .close-dialog": "onCancel",
    "click .sign-in-btn": "login",
    "submit form": "login"
  },
  initialize: function(show_on_create) {
    console.log("App.dialogs.SignIn.initialize()");
    if (show_on_create !== false) {
      this.render().$el.appendTo("body");
      this.open();
    }
  },
  render: function() {
    console.log("App.dialogs.SignIn.render()");
    this.$el.html(this.template({
      settings: settings,
      subscriptions: _(App.api.receiptService.availableSubscriptions).values()
    }));
    return this;
  },
  open: function() {
    console.log("App.dialogs.SignIn.open()");
    this.$("#signin-dialog").addClass("pop");

    this.omni_pv = App.omni.pageview("signin", "event1");
  },
  onCancel: function() {
    //App.omni.event("auth_cancel");
    this.remove();
  },
  remove: function() {
    TcmOmni.set_pagename(this.omni_pv.prev);
    Backbone.View.prototype.remove.apply(this, arguments);
  },
  login: function(evt) {
    evt.preventDefault();

    var that = this;
        $err = this.$(".error-msg"),
        $user = this.$(".auth-email"),
        $pass = this.$(".auth-pass");

    $err.hide();
    if (! $user.val().length) {
      return $err.show().text(settings.authErrorNoEmail);
    }
    if (! $pass.val().length) {
      return $err.show().text(settings.authErrorNoPass);
    }

    try {
      var t = App.api.authenticationService.login($user.val(), $pass.val());
    }
    catch (err) {
      $err.show().text(settings.authErrorAuthFailed);
    }

    t.completedSignal.addOnce(function() {
      if (t.state < 0) $err.show().text(settings.authErrorAuthFailed);
      else that.remove();
    });

  }
});
