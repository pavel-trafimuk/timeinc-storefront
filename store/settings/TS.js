(function() {
// One of the big benefits of using a js file instead of json for settings
// is the ability to add comments
window.settings = {
    // Look at CFBundleVersion
    // http://mageng.it.timeinc.com/twiki/bin/view/Main/AppInformation
    "cfBundleVersion"            : "7.21",
    
    // General settings
    "brandName"                  : "Time Magazine", // Time SOPAC
    "brandCode"                  : "TS",
    "schedule"                   : "weekly",
    "popupInterval"              : 0,
    "enable_first_load_popup"    : false,
    "international"              : true,
 
    "heroHeading"                : "In This Issue",
    "subscribeOfferText"         : "The digital edition includes all of the stories from the print edition plus extra photos and videos and additional international content. Your subscription also includes commemorative issues from the TIME archive. Plus, get 1 month free with an annual subscription.",
    
    "welcome_preview": "image",
    "hero_preview": "image",
    "hero_itii_preview": "image",
    "max_back_issues"            : 20,

    "omniture_account"           : "timagtimesopac",
    "omniture_server"            : "metrics.time.com",
    "omniture_ssl_server"        : "smetrics.time.com",

    "echo_bundle_id"             : "com_timeinc_ipad_tspl",
    "echo_token"                 : "f1d6524969d4effeee3e6d055ce66caa60946e3c",
    
    // http://mageng.it.timeinc.com/twiki/bin/view/Main/DPS-MagazineXML-Urls
    "adobeAppId"                 : "f04aca261b5b4167bc6623e5e2330361",
    "appId"                      : "com.timeinc.ipad.tspl",

    "supportPhoneNumber"         : "+852 3128 5688",
    "supportEmail"               : "http://www.time.com/pacificmail",

    // ************************************************************  
    // App specific URLS
    // ************************************************************  

    "customerServiceUrl"         : "", // hides button on my account page
    "faqUrl"                     : "http://subscription-assets.timeinc.com/prod/assets/themes/magazines/SUBS/templates/velocity/site/ts-digitaledition-faq/lp.html",
    "lucieRegistrationURL"       : "https://subscription.timeinc.com/storefront/site/ts-lucie-customer-creation-itunes201307.html",
    
"ihatethelastcomma": true};
})();


