(function() {
    
  App.views.Echo = Backbone.View.extend({
    className: "echo",
    template: Handlebars.templates["echo.tmpl"],
    events: {},
    initialize: function() {
      console.log("App.views.Echo initializing");
    },
    render: function() {
      var that = this,
          cx,
          echo_url = settings.echo_stage,
          d_connected = App.api.deviceService.isOnline,
          d_email = App.api.authenticationService.userName,
          d_omni_visitor_id = App.api.deviceService.omnitureVisitorId.toString().replace(/-/g,""),
          d_push_token = App.api.deviceService.pushNotificationToken.toString();
          
      if (settings.echoENV == "prod") { echo_url = settings.echo_prod; }
      
      cx = {
          settings: settings,
          data : { echo_url: echo_url, d_connected: d_connected, d_email: d_email, d_omni_visitor_id: d_omni_visitor_id, d_push_token: d_push_token }
      };
      
      this.$el.html(this.template(cx)).appendTo("body");
      //alert(this.template(cx).toString());
      
      var postEchoInterval = window.setInterval(function() {
          if ($("#echoForm") && $("#echoFrame")) {
              window.clearInterval(postEchoInterval);
              setTimeout(function() { $("#echoForm").submit() }, 1000);
              console.log("Echo: " + $("#echoFrame").contents().find("body").html());
          }
      }, 0);
    }
  });
  
})();