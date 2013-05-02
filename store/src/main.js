$(function() {
  if (typeof adobeDPS == "undefined") {
    var view = new WelcomeView();
    view.render().$el.appendTo("body");
  }
  else {
		adobeDPS.initializationComplete.addOnce(function(){ 
      init(true) 
    });
  }
}); 
