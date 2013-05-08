(function() {
  
  function Signal() {
    this.add = function() {};
    this.addOnce = function(cb) { setTimeout(cb) };
  }

  window.MockAPI = {
    initializationComplete: new Signal(),
    authenticationService: {
      isUserAuthenticated: false,
      logout: function() {}
    },
    receiptService: {
      availableSubscriptions: {}
    },
    libraryService: {
      folioStates: {},
      folioMap: {
        addedSignal: new Signal(),
        sort: function() {}
      }
    },
  };

})();
