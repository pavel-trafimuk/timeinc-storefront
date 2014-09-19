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
    // Look at CFBundleVersion
    // http://mageng.it.timeinc.com/twiki/bin/view/Main/AppInformation
    "cfBundleVersion"            : "4.26",
    
    // General settings
    "brandName"                  : "ALL YOU",
    "brandCode"                  : "AY",
    "schedule"                   : "monthly",
    "popupInterval"              : 0,
    "enable_first_load_popup"    : false,
    
    "heroHeading"                : "Inside This Issue",
    "subscribeSpecialOfferText"  : "LIMITED TIME OFFER &ndash; 50% OFF AN ANNUAL SUBSCRIPTION<br/><br/>",
    "subscribeOfferText"         : "Subscribe to ALL YOU and get great tips and valuable advice on how to save everyday!",
    
    "hero_preview"               : "none",
    "hero_preview_button"        : AB("previewButtonAction", {
                                      "adobepreview": "adobe",
                                      "sampleissue": "sampleissue"
                                    }),

    "enableHeroCoverTap"         : false,
    "preview_issue_product_id"   : "com.timeinc.allyou.ipad.inapp.FREESAMPLE",
    
    "max_back_issues"            : 12,

    "eMagsAppId": "ALLYOU9614",
    
    // "ipad_entbanner_alacarte"    : "singlebuyer/index.html?t=",
    // "ipad_entbanner_nonsubs"     : "nonsubs/index.html?t=",

    "omniture_account"           : "timagallyounk",
    "omniture_server"            : "timeinc.122.2o7.net",
    "omniture_ssl_server"        : "timeinc.122.2o7.net",

    "echo_bundle_id"             : "com_timeinc_allyou_ipad_inapp",
    "echo_token"                 : "b75802eb3e4311f5e9b0913c96b45912226c60f3",
    
    // http://mageng.it.timeinc.com/twiki/bin/view/Main/DPS-MagazineXML-Urls
    "adobeAppId"                 : "f11f5bd1d4624fae9a20a16bfd218eb3",
    "appId"                      : "com.timeinc.allyou.ipad.inapp",

    "supportPhoneNumber"         : "1-866-772-8789",
    "supportEmail"               : "digital@allyou.customersvc.com",

    // ************************************************************  
    // App specific URLS
    // ************************************************************  
    "lucieRegistrationURL"       : "https://subscription.timeinc.com/storefront/site/ay-lucie-customer-creation-itunes201307.html",
    
"ihatethelastcomma": true};
})();
