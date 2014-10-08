(function() {
// One of the big benefits of using a js file instead of json for settings
// is the ability to add comments
window.settings = {
    // Look at CFBundleVersion
    // http://mageng.it.timeinc.com/twiki/bin/view/Main/AppInformation
    "cfBundleVersion"            : "4.13",
    
    // General settings
    "brandName"                  : "INSTYLE",
    "brandCode"                  : "IN",
    "schedule"                   : "monthly",
    "popupInterval"              : 0,
    "enable_first_load_popup"    : false,
    "max_back_issues"            : 12,

    "subscribeSpecialOfferText"  : "LIMITED TIME OFFER &ndash; 50% OFF AN ANNUAL SUBSCRIPTION<br/><br/>",
    "subscribeOfferText"         : "Subscribe now to get INSTYLE Magazine on your iPad. Featuring the hottest fashion trends, beauty tips, celebrity style secrets, best beauty buys and so much more!",
    
    "storeIssuesStartingFilter"  : "!special",
    "storeIssuesTapToView"       : "<button class='bi-filter active' data-filter='!special'>Monthly Magazine</button> <button class='bi-filter' data-filter='special'>Style Pro Guide</button>",

    "heroHeading"                : "Inside This Issue",
    "heroPostDescriptionHTML"    : "",
    
    "hero_preview": "none",
    "enableHeroCoverTap"         : false,
    "preview_issue_product_id"   : "com.timeinc.instyle.ipad.inapp.FREESAMPLE",
    "preview_issue_product_ids"  : {
        "iPad"  : "com.timeinc.instyle.ipad.inapp.FREESAMPLE",
        "iPhone": "com.timeinc.instyle.ipad.inapp.FREESAMPLEIPHONE"
    },

    "eMagsAppId": "INAURR31232",
    
    "omniture_account"           : "timaginstylenk",
    "omniture_server"            : "timeinc.122.2o7.net",
    "omniture_ssl_server"        : "timeinc.122.2o7.net",

    "echo_bundle_id"             : "com_timeinc_instyle_ipad_inapp",
    "echo_token"                 : "b26c06ef7be7257889b148061f4204ce6d709931",
    
    // http://mageng.it.timeinc.com/twiki/bin/view/Main/DPS-MagazineXML-Urls
    "adobeAppId"                 : "8d7346ec5a504f8d97dea533be3596e1",
    "appId"                      : "com.timeinc.instyle.ipad.inapp",
    
    "supportPhoneNumber"         : "1-866-772-8793",
    "supportEmail"               : "digital@instyle.customersvc.com",

    // ************************************************************  
    // App specific URLS
    // ************************************************************  
    "lucieRegistrationURL"       : "https://subscription.timeinc.com/storefront/site/in-lucie-customer-creation-itunes201307.html",
    
"ihatethelastcomma": true};
})();
