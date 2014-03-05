/* global settings, $, adobeDPS */
window.myAccount = (function() {
  // lib is the object that will be stored in window.libBanner
  var lib = {};


  
  /////////////////////////////////////////////////////////////////////////// 
  // Utility Functions
  ///////////////////////////////////////////////////////////////////////////
  
  // Returns a wrapper function that allows fn() to be called exactly once
  function once(fn) {
    var called = false;
    function wrapper() {
      if (called) return;
      called = true;
      return fn.apply(this, arguments);
    }
    return wrapper;
  }



  


  /////////////////////////////////////////////////////////////////////////// 
  // API Support
  ///////////////////////////////////////////////////////////////////////////

  lib.api = (typeof adobeDPS != "undefined") ? adobeDPS : window.MockAPI;

  function wait_for_api(method_name, fn) {
    if (!lib.api) return;

    // end result:  lib[method_name] = fn
    //
    // If the method is called before the API is ready it will set a 
    // timeout and try again.
    //
    lib[method_name] = function() {
      var that = this,
          args = arguments;
      setTimeout(function() {
        lib[method_name].apply(that, args);
      }, 500);
    };
    lib.api.initializationComplete.addOnce(function() {
      lib[method_name] = fn;
    });
  }
  
  wait_for_api("api_ready", function(cb) {
    cb();
  });

 

  

  // Simple wrapper around trackCustomEvent() to wait for the API
  wait_for_api("trackCustomEvent", function(events, vars) {
    lib.api.analyticsService.trackCustomEvent(events, vars);
  });

  lib.track_user_action = function(evt_name, page_name) {
    /* Example values:
    *    evt_name: "banner_taps_subscribe" (subscribe/buyissue/downloadfree/register)
    *    page_name: "Library|Banner|Subscriber" (Subscriber/Nonsubscriber)
    */
    lib.trackCustomEvent("customEvent3", {
      customVariable3: evt_name,
      customVariable4: page_name
    });
  };

  lib.track_page_view = function(evt_name, page_name) {
    /* Example values:
    *    evt_name: "banner_taps_subscribe" (subscribe/buyissue/downloadfree/register)
    *    page_name: "Library|Banner|Subscriber" (Subscriber/Nonsubscriber)
    */
    lib.trackCustomEvent("customEvent3", {
      customVariable3: evt_name,
      customVariable4: page_name
    });
  };
   return lib;

})(); 



  

