/* global DEVICE, adobeDPS, MockAPI, Date, $, lucieApi, settings */
(function() {
  var api = (typeof adobeDPS == "undefined") ? MockAPI : adobeDPS,
      now = +new Date(),

      subs_banner = settings[DEVICE + "_entbanner_subs"] + now,
      lucie_subs_banner = settings[DEVICE + "_entbanner_lucie_subs"] + now,
      alacarte_banner = settings[DEVICE + "_entbanner_alacarte"] + now,
      nonsubs_banner = settings[DEVICE + "_entbanner_nonsubs"] + now;

  api.initializationComplete.addOnce(function() {
    // APPLE SUBSCRIBERS
    var is_sub = false,
        single_issue_owner = false;

    $.each(api.receiptService.availableSubscriptions, function(i, receipt) {
      if (receipt.isActive()) is_sub = true;
    });

    // short circuit for subscribers
    if (is_sub) {
      location.href = subs_banner;
      return;
    }

    $.each(api.receiptService.receipts, function(i, receipt) {
      if (!receipt.isSubscription) single_issue_owner = true;
    });

    // LUCIE SUBSCRIBERS
    if (api.authenticationService.isUserAuthenticated) {
      lucieApi._default_api_args.authToken = api.authenticationService.token;
      lucieApi.entitlements(function(data) {
        if ($("subscriberIsActive", data).text() == "Y") {
          location.href = lucie_subs_banner;
        }
        else {
          location.href = single_issue_owner ? alacarte_banner : nonsubs_banner;
        }
      });
    }
    else {
      location.href = single_issue_owner ? alacarte_banner : nonsubs_banner;
    }
  });
})();