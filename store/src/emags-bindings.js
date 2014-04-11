/* global Backbone, async, $, App, console, settings, EMPurchase, EMGetCurrentCampaignID */
Backbone.on("ApiReady", function() {
  if (typeof adobeDPS === "undefined") return;

  function emags_receipt_logged(product_id, is_logged) {
    var receipt_key = "eMagsReceiptLoggedFor:" + product_id;

    if (is_logged !== undefined) {
      localStorage[receipt_key] = !!is_logged;
    }

    return localStorage[receipt_key] == "true";
  }

  // tracking for Subscriptions and SingleCopy sales. "FreeSample" not yet implemented
  App.api.receiptService.newReceiptsAvailableSignal.add(function(receipts) {
    var receipt, evt_type, product_id, price, sub, folio;

    console.log("newReceiptsAvailableSignal fired", receipts);
    if (!settings.eMagsAppId) return;

    console.log("tracking " + receipts.length + " new receipts");
    for (var i=receipts.length; i--;) {
      receipt = receipts[i];
      product_id = receipt.productId;

      if (emags_receipt_logged(product_id)) continue;

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
      EMPurchase(evt_type, product_id, price,
          undefined, // currency
          undefined, // count
          undefined, // category
          undefined, // extras
          $.noop, // success cb
          $.noop  // failure cb 
      );

      emags_receipt_logged(product_id, true);
    }
  });

});

async.parallel([
    function(cb) {
      Backbone.on("AppReady", function() { cb(null) });
    },
    function(cb) {
      Backbone.on("eMagsReady", function() { cb(null) });
    }
  ],
  function() {
    //var tracked_campaigns = JSON.parse(localStorage.trackedEmagsCampaignIds || "[]");
    EMGetCurrentCampaignID(
      function(campaign_id) { // Campaign ID Found
        // if (tracked_campaigns.indexOf(campaign_id) >= 0) return;
        // tracked_campaigns.push(campaign_id);
        // localStorage.trackedEmagsCampaignIds = JSON.stringify(tracked_campaigns);

        App.api.analyticsService.trackCustomEvent("customEvent5", {
          customVariable5: campaign_id
        });
      },
      function() { // No Campaign ID found
        console.log("campaignid: [NONE]");
        // do nothing
      },
      function(err) { // Error
        App.error("EMagsError", "GetCurrentCampaignID had error: " + err);
      }
    );
});
