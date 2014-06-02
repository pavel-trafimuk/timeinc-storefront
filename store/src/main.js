console.log("----------  STARTING APP  ----------");

if (DEBUG) {
  settings.asset_root = settings.dev_asset_root;
  //settings.PRODUCTION_TCM_FEED = settings.DEV_TCM_FEED;
  //settings.prod_tcmfeed_image_root = settings.dev_tcmfeed_image_root;
  window.openDatabase = function() {
    return {
      transaction: function(){},
      readTransaction: function(){}
    };
  }
}
else {
  settings.asset_root = settings.prod_asset_root;  
  window.console = {log: $.noop}
}

window.onerror = function(err, lineNo, fileName) {
  if (DEBUG) console.log("window.onerror()", err, lineNo, fileName);
  else App.error("window.onerror", err);
}


App.preload();
Handlebars.registerHelper('setting', function(options) {
  return options.fn(settings);
});
Handlebars.registerHelper('ifequal', function(options) {
  var key, keys = Object.keys(options.hash);
  for (var i=keys.length; i--;) {
    key = keys[i];
    if (this[key] != options.hash[key]) {
      return options.inverse(this);
    }
  }
  return options.fn(this);
});
$(function() {
  console.log("dom ready");
  App.loading(true);

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
      Backbone.trigger("ApiReady");

      new App.dialogs.StraightToSample();

      // launch the app
      new App.views.Main().render(function() {
        App.loading(false);
        Backbone.trigger("AppReady");
      });
      
      // Create echo iframe and form, then submit
      new App.views.Echo().render();

    });
  });
});

