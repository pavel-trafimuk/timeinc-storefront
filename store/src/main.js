$(function() {
  var api, view; 
  
  api = DEBUG ? MockAPI : adobeDPS;

  api.initializationComplete.addOnce(function() {
    new App.views.Main({api: api}).render();
  });

}); 
