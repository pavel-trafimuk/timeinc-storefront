(function() {

// Inlined since this file cannot have dependencies
(function() {
  var tests = {},
      assignments = JSON.parse(localStorage.ABTestAssignments || "{}");

  function randInt(n) {
    return Math.floor(Math.random()*n);
  }
  function randomSelect(arr) {
    return arr[ randInt(arr.length) ];
  }
  function AB(test_name, variations) {
    if (variations !== undefined) {
      tests[test_name] = variations;
    }
    if (test_name in assignments) {
      return tests[test_name][assignments[test_name]];
    }

    assignments[test_name] = randomSelect(Object.keys(variations));
    AB.save();
    
    return AB(test_name);
  }
  AB.save = function() {
    localStorage.ABTestAssignments = JSON.stringify(assignments);
  }
  AB.omnitureString = function() {
    return Object.keys(tests).map(function(test_name) {
      return test_name + ":" + assignments[test_name];
    }).join("|");
  }
  AB.reset = function() {
    assignments = {};
    Object.keys(tests).forEach(function(test_name) {
      AB(test_name, tests[test_name]);
    });
  }

  window.AB = AB;
})();

// One of the big benefits of using a js file instead of json for settings
// is the ability to add comments
window.settings = {

    // General settings
    "brandName"                  : "ENTERTAINMENT WEEKLY",
    "brandCode"                  : "EW",
    "schedule"                   : "weekly",
    "popupInterval"              : 0,
    "enable_first_load_popup"    : false,
    
    "popup_paragraph1"           : "<b>We heard you!</b><br>The Result: <b><i>Best Entertainment Weekly ever!</i></b>",
    "popup_paragraph2"           : "You wanted support for Retina display &mdash; <b>we've got it.</b><br>You wanted Pinch &amp; Zoom &mdash; <b>we have it.</b><br>You wanted a better App &mdash; <b>we've done it.</b>",
    "popup_restore_text"         : "<i>To restore your back issues follow instructions in the Library</i>",
    "popup_subscribe_text"       : "Download the latest issue now",
    "popup_close_text"           : "Close",
    
    "heroHeading"                : "Inside This Issue",
    "subscribeOfferText"         : "Be the first to know about the best (and worst) in movies, TV, music, books, and more. PLUS: You can watch trailers, sample songs, as well as buy movie tickets, books, and music instantly—without ever leaving your couch.",
    
    "enableHeroCoverTap"         : false,
    
    "hero_preview"               : "none",
    // "hero_preview_button"        : AB("previewButtonAction", {
    //                                   "adobepreview": "adobe",
    //                                   "sampleissue": "sampleissue"
    //                                 }),

    "max_back_issues"            : 100,

    "eMagsAppId": "EW2332",
    "preview_issue_product_id": "com.timeinc.ew.ipad.inapp.FREESAMPLE",

    "omniture_account"           : "timagewmagnk",
    "omniture_server"            : "timeinc.122.2o7.net",
    "omniture_ssl_server"        : "timeinc.122.2o7.net",
    
    "echo_bundle_id"             : "com_timeinc_ew_ipad_inapp",
    "echo_token"                 : "749e1973e9b6f1b940ddf0465da96a22f578a35f",

    // http://mageng.it.timeinc.com/twiki/bin/view/Main/DPS-MagazineXML-Urls
    "adobeAppId"                 : "72c6d01e1eb34f07bf2d2c31643f0646",
    "appId"                      : "com.timeinc.ew.ipad.inapp",

    "supportPhoneNumber"         : "1-866-772-8791",
    "supportEmail"               : "digital@ew.customersvc.com",

    // ************************************************************  
    // App specific URLS
    // ************************************************************  
    "lucieRegistrationURL"       : "https://subscription.timeinc.com/storefront/site/ew-lucie-customer-creation-itunes201302.html",
    
"ihatethelastcomma": true};
})();
