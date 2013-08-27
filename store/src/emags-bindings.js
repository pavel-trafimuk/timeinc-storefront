
Backbone.on("ApiReady", function() {

  // tracking for Subscriptions and SingleCopy sales. "FreeSample" not yet implemented
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


Backbone.on("AppReady", function() {
  EMGetCurrentCampaignID(
    // Campaign ID Found
    function(campaign_id) {
    
    },
    // No Campaign ID found
    function() {
    
    },
    // Error
    function() {
    
    }
  );
});
