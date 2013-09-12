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
          apiLoad, d_connected, d_email, d_omni_visitor_id, d_push_token, cx;

      //defaults
      this.postMade = false;
      this.echo_url = settings.echo_stage;
      
      apiLoad = window.setInterval(loadEcho(), 2000);
      
      function loadEcho() {
        window.setInterval(function() {
          window.clearInterval(apiLoad);
          d_authenticated = adobeDPS.authenticationService.isUserAuthenticated,
          d_push_token = App.api.deviceService.pushNotificationToken.toString(),          
          d_omni_visitor_id = App.api.deviceService.deviceId;
          
          if (settings.echoENV == "prod") {
            that.echo_url = settings.echo_prod;
          }
            
          //Is user logged in?
          if (d_authenticated) {
            // User logged in : Get email address from API
            d_email = App.api.authenticationService.userName;
              
            if (d_email && (!localStorage.echoEmail || localStorage.echoEmail != d_email)) {
              // Email address is different then last time, or this is the first visit, echo record should be updated
              localStorage.echoEmail = d_email;
              //alert(localStorage.echoEmail);
              that.postMade = false;
            }
          } else {
            //User not logged in : Get email address from localStorage (if available)
            if (localStorage.echoEmail) {
              d_email = localStorage.echoEmail;
            }
          }
            
          //Post has not been made
          if (!that.postMade) {
            // Remove form (if exists)
            if (that.$el.find("#echoForm")) {
              that.$el.find("#echoForm").remove();
            }
              
            // Remove frame (if exists)
            if (that.$el.find("#echoFrame")) {
              that.$el.find("#echoFrame").remove();
            }
              
            // Update cx object
            cx = {
              settings: settings,
              data : { echo_url: that.echo_url, d_email: d_email, d_omni_visitor_id: d_omni_visitor_id, d_push_token: d_push_token }
            };
            //alert(JSON.stringify(cx));
            
            // Redraw form and iframe using cx object to populate form input values
            that.$el.html(that.template(cx)).appendTo("body");
            //alert(that.template(cx));
          }
              
            
          d_connected = App.api.deviceService.isOnline;
          //Continue if connected
          if (d_connected && d_push_token && d_omni_visitor_id && !that.postMade) {
            $("#echoForm").submit();
            that.postMade = true;
          }
        }, 2000);
      }
    }
  });
})();