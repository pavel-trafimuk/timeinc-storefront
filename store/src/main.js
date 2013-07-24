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

      // eMags tracking for Subscriptions and SingleCopy sales. "FreeSample" not yet implemented
      App.api.receiptService.newReceiptsAvailableSignal.add(function(receipts) {
        var receipt, evt_type, product_id, price, sub, folio;

        console.log("newReceiptsAvailableSignal fired", receipts);
        if (!settings.eMagsAppId) return;

        console.log("tracking " + receipts.length + " new receipts");
        for (var i=receipts.length; i--;) {
          receipt = receipts[i];

          product_id = receipt.productId;
          if (receipt.isSubscription) {
            sub = App.api.receiptService.availableSubscriptions[product_id];
            price = sub.price;
            evt_type = (sub.duration.toLowerCase() == "1 month") ? "MonthlySubscription" : "AnnualSubscription";
          }
          else {
            folio = App.api.libraryService.get_by_productId(product_id);
            price = folio.price;
            evt_type = "SingleCopySale";
          }
          
          // remove dollar signs and other currecy symbols
          price = price.replace(/[^\d\.]/gi, "");

          console.log("tracking eMags Purchase", evt_type, product_id, price);
          EMPurchase(evt_type, product_id, price);
        }
      });
    });
  });
});

