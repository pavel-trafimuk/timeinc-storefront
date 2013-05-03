(function() {

  window.MockAPI = {
    initializationComplete: {
      addOnce: function(cb) {
        MockAPI.libraryService = {
          folioMap: {
            
          }
        };
        setTimeout(cb);
      }
    },
  };

})();
