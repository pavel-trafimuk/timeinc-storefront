(function() {
// THIS FILE CAN NOT HAVE ANY DEPENDENCIES

// Inline AB.js since this file can not have dependencies:
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
    "brandName"                  : "REAL SIMPLE Magazine",
    "brandCode"                  : "SM",
    "schedule"                   : "monthly",
    "popupInterval"              : 0,
    "enable_first_load_popup"    : false,

    "heroHeading"                : "Inside This Issue",
    "subscribeOfferText"         : "Each issue of REAL SIMPLE is packed with smart, beautiful, and practical solutions to make life easier – every single day.  Plus fast and delicious recipes, easy organizing and decorating ideas, great fashion and beauty finds, money-saving tips, and more. Plus, get 1 month free with an annual subscription.",
    "myacctLUCIEText"            : 'Your REAL SIMPLE digital account gives you access to: The digital edition on your tablet or smartphone, the No Time To Cook App with over 900 recipes updated monthly, and Solution Seekers on Realsimple.com where you can save checklists, recipes and more.',
       
    "straightToSampleEnabled"    : AB("straightToSamplePopupEnabled", {
                                        "yes": true,
                                        "no": false
                                    }),

    "iphoneNonsubsBannerAutoDownloadEnabled": AB("iPhoneBannerAutoDownloadEnabled", {
                                        "yes": true,
                                        "no": false
                                    }),

    "welcome_preview": "image",
    "hero_itii_preview": "image",
    "max_back_issues"            : 12,
    "hero_preview": "none",
    "enableHeroCoverTap"         : false,
    "preview_issue_product_id"   : "com.timeinc.realsimple.ipad.inapp.FREESAMPLE",

    "ipad_entbanner_subs"        : "subs/itunes/index.html?t=",
    "ipad_entbanner_lucie_subs"  : "subs/lucie/index.html?t=",

    "eMagsAppId": "RS03042013",

    "omniture_account"           : "timagrealsimplenk",
    "omniture_server"            : "metrics.realsimple.com",
    "omniture_ssl_server"        : "smetrics.realsimple.com",

    "echo_bundle_id"             : "com_timeinc_realsimple_ipad_inapp",
    "echo_token"                 : "0f433063b92b3ae3a2639d01c20e00bd04756ed0",
    
    // found in the adobe URL at http://mageng.it.timeinc.com/twiki/bin/view/Main/DPS-MagazineXML-Urls
    "adobeAppId"                 : "7ea9178b138a416d899803c578036a49",
    "appId"                      : "com.timeinc.realsimple.ipad.inapp",

    "supportPhoneNumber"         : "1-866-642-1266",
    "supportEmail"               : "digital@realsimple.customersvc.com",

    // ************************************************************  
    // App specific URLS
    // ************************************************************  
    "lucieRegistrationURL"       : "https://subscription.realsimple.com/storefront/site/sm-lucie-customer-creation-itunes201306.html",
    "welcomeScreenWesURL"        : "https://secure.customersvc.com/servlet/Show?WESPAGE=am/tablet/sm/login.jsp&MSRSMAG=SM&MSDDMOFF=ABTF&MSDTRACK=IPSP&MSDVNDID=TBLT",
    "WesPageURL"                 : "https://secure.customersvc.com/servlet/Show?WESPAGE=am/tablet/sm/login.jsp&MSRSMAG=SM&MSDDMOFF=ABTF&MSDTRACK=IPAD&MSDVNDID=TBLT",
    "WesPageURLiphone"           : "https://secure.customersvc.com/servlet/Show?WESPAGE=am/tablet/sm/login.jsp&MSRSMAG=SM&MSDDMOFF=ABTF&MSDTRACK=IPHB&MSDVNDID=TBLT",
    
"ihatethelastcomma": true};
})();
