
App.echo_post = function() {
  var body = document.body,
      echo_url = settings.echo_stage,
      d_connected,
      d_authenticated,
      d_email,
      d_omni_visitor_id,
      d_push_token;

  if (d_bundle_id && d_auth_token) {
    d_connected = App.api.deviceService.isOnline;
    d_authenticated = App.api.authenticationService.isUserAuthenticated;
    d_email = App.api.authenticationService.userName;
    d_omni_visitor_id = App.api.deviceService.omnitureVisitorId.toString().replace(/-/g,"");
    d_push_token = App.api.deviceService.pushNotificationToken.toString();
  }
      
  if (settings.echoENV == "prod") echo_url = settings.echo_prod;
  
  // Continue if online, omniture visitorId exists, push token exists, and post not already made to API
  if (d_connected && d_omni_visitor_id && d_push_token) {
    //iframe
    $("#echoAPI").attr('src', echo_url);
    
    //form
    $("#echoForm").attr('action', echo_url);
    
    //form inputs
    $("#device_token").val(d_push_token);
    $("#device_email").val(d_email);
    $("#device_omniture_id").val(d_omni_visitor_id);
    
    // Post form to ECHO API
    if (!DEBUG) $("#echoForm").submit();
    
    // remove from dom after submit
    //$("#myform").remove();
    //$("#echoAPI").remove();
  }
};