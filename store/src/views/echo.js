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

      /* defaults */
      this.postMade = false;
      this.echo_url = settings.echo_stage;
      
      apiLoad = window.setInterval(loadEcho(), 2000);
      
      function loadEcho() {
        window.setInterval(function() {
          window.clearInterval(apiLoad);
          d_authenticated = App.api.authenticationService.isUserAuthenticated,
          d_push_token = App.api.deviceService.pushNotificationToken.toString(),          
          d_omni_visitor_id = App.api.deviceService.omnitureVisitorId.toString().replace(/-/g,"");
          
          if (settings.echoENV == "prod") {
            that.echo_url = settings.echo_prod;
          }
            
          /* Is user logged in? */
          if (d_authenticated) {
            /* User logged in : Get email address from API */
            d_email = App.api.authenticationService.userName;
              
            if (d_email && (!localStorage.echoEmail || localStorage.echoEmail != d_email)) {
              /* Email address is different then last time, or this is the first visit, echo record should be updated */
              localStorage.echoEmail = d_email;
              that.postMade = false;
            }
          } else {
            /* User not logged in : Get email address from localStorage (if available) */
            if (localStorage.echoEmail) {
              d_email = localStorage.echoEmail;
            }
          }
            
          /* Post has not been made */
          if (!that.postMade) {
            /* Remove form (if exists) */
            if (that.$el.find("#echoForm")) {
              that.$el.find("#echoForm").remove();
            }
              
            /* Update cx object */
            cx = {
              settings: settings,
              data : { echo_url: that.echo_url, d_email: d_email, d_omni_visitor_id: d_omni_visitor_id, d_push_token: d_push_token }
            };
            //alert(JSON.stringify(cx));
            
            /* Redraw form and iframe using cx object to populate form input values */
            that.$el.html(that.template(cx)).appendTo("body");
            //alert(that.template(cx));
          } else {
            that.$el.find("#echoForm").remove();
          }
              
            
          d_connected = App.api.deviceService.isOnline;
          
          /* Continue if connected */
          if (d_connected && d_push_token && d_omni_visitor_id && !that.postMade) {
            var $form = $("#echoForm"), $inputs, serializedData;
            
            /* Select and cache all the fields */
            $inputs = $form.find("input");
            
            /* Serialize the data in the form */
            serializedData = $form.serialize();
            
            $.ajax({
                type: 'POST',
                url: that.echo_url,
                crossDomain: true,
                data: serializedData,
                success: function(responseData, textStatus, jqXHR) {
                    that.postMade = true;
                    console.log('postmade: ' + that.postMade + '\ntextStatus : ' + textStatus);
                },
                error: function (responseData, textStatus, errorThrown) {
                    console.log("ECHO POST: " + textStatus + ":" + errorThrown);
                }
            });
          }
        }, 2000);
      }
    }
  });
})();
