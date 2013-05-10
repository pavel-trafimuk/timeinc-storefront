(function() {
  
  function Signal() {
    this.add = function() {};
    this.addOnce = function(cb) { setTimeout(cb) };
  }

  var folios = [{"updatedSignal":{"_bindings":[],"_prevParams":null},"id":"f2b47c4e-4461-495a-8fe2-17a9f9f8e42b","currentTransactions":[],"downloadSize":0,"state":100,"previewImageURL":null,"title":"EW","isCompatible":true,"isDownloadable":false,"isViewable":false,"isArchivable":false,"isUpdatable":false,"productId":"com.timeinc.ew.ipad.inapp.12212012","folioNumber":"December 21, 2012","publicationDate":"2012-12-13T05:00:00.000Z","folioDescription":"Go inside Quentin Tarantino's slave drama, Django Unchained. Plus, the 25 films you should see before Oscar night.","description":"This is the December 21, 2012 issue of EW. ","price":"$4.99","broker":"appleStore","filter":null,"isThirdPartyEntitled":false,"targetDimensions":"1024x748","isPurchasable":true,"supportsContentPreview":false,"receipt":null,"entitlementType":0,"hasSections":false,"contentPreviewState":0,"sections":{"addedSignal":{"_bindings":[],"_prevParams":null},"removedSignal":{"_bindings":[],"_prevParams":null},"internal":{}}},{"updatedSignal":{"_bindings":[],"_prevParams":null},"id":"f5c94518-6faa-4df9-9144-8d30d8027dfa","currentTransactions":[],"downloadSize":0,"state":200,"previewImageURL":null,"title":"EW","isCompatible":true,"isDownloadable":true,"isViewable":false,"isArchivable":false,"isUpdatable":false,"productId":"com.timeinc.ew.ipad.inapp.12072012","folioNumber":"December 07, 2012","publicationDate":"2012-11-29T05:00:00.000Z","folioDescription":"In our Entertainers of the Year hear George Clooney on Ben Affleck, Nathan Fillion on Joss Whedon, and many more.","description":"In our Entertainers of the Year hear George Clooney on Ben Affleck, Nathan Fillion on Joss Whedon, and many more.","price":"FREE","broker":"noChargeStore","filter":null,"isThirdPartyEntitled":false,"targetDimensions":"1024x748","isPurchasable":false,"supportsContentPreview":false,"receipt":null,"entitlementType":1,"hasSections":false,"contentPreviewState":0,"sections":{"addedSignal":{"_bindings":[],"_prevParams":null},"removedSignal":{"_bindings":[],"_prevParams":null},"internal":{}}}];

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
        sort: function(cb) { return _(folios).sort(cb); }
      }
    },
  };

  folios.forEach(function(folio) { MockAPI.libraryService.folioMap[folio.id] = folio });


})();
