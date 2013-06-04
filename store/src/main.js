console.log("----------  STARTING APP  ----------");

if (DEBUG) {
  settings.asset_root = settings.dev_asset_root;  
}
else {
  settings.asset_root = settings.prod_asset_root;  
  window.console = {log: $.noop}
}


// disable scrolling the body element (which shows the a white background 
// outside the document and just generally feels, not-very-appy
$(document)
  .on("touchmove", function(evt) { evt.preventDefault() })
  .on("touchmove", ".scrollable", function(evt) { evt.stopPropagation() });

App.preload();

$(function() {
  console.log("dom ready");
  App.loading(true);

  // make click events fire at touchstart (https://github.com/ftlabs/fastclick)
  FastClick.attach(document.body);
  
  if (DEBUG && typeof adobeDPS == "undefined") {
    App._raw_api = MockAPI;
    App._using_adobe_api = false;
  }
  else {
    App._raw_api = adobeDPS;
    App._using_adobe_api = true;
  }

  App._raw_api.initializationComplete.addOnce(function() {
    console.log("init complete");
    
    APIWrapper(App._raw_api, function(wrapped_api) {
      App.api = wrapped_api;
      // launch the app
      new App.views.Main().render(function() {
        App.loading(false);
      });
    });
  });

});

