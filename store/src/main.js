(function() {
  console.log("----------  STARTING APP  ----------");

  $(function() {
    console.log("dom ready");

    var api = DEBUG && typeof adobeDPS == "undefined" ? MockAPI : adobeDPS;
    
    console.log("DEBUG: " + DEBUG);
    console.log("adobeDPS: ", window['adobeDPS']);
    console.log("adobeDPS.version: " + (window['adobeDPS'] || {})['version']);

    api.initializationComplete.addOnce(function() {
      console.log("init complete");
      new App.views.Main({api: api}).render();
    });

  });

})();
