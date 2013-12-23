(function() {
// One of the big benefits of using a js file instead of json for settings
// is the ability to add comments
window.settings = {

    // General settings
    "brandName"                  : "PEOPLE Magazine",
    "brandCode"                  : "PE",
    "schedule"                   : "weekly",
    "popupInterval"              : 0,
    "enable_first_load_popup"    : false,
 
        
    "storeIssuesStartingFilter"  : "!special",
    "storeIssuesTapToView"       : "<button class='bi-filter active' data-filter='!special'>Weekly Issues</button> <button class='bi-filter' data-filter='special'>Special Issues</button>",


    "store_show_banners": true,
    "store_banners_type": "subscribe", // buynow OR deeplink OR subscribe
    //"store_banner_productId": "com.timeinc.people.ipad.inapp.12012013",
    //"store_banner_dossierId": "289468",
    
    "storeIssuesBuyBtns": true,

    "welcome_preview": "image",
    "hero_preview": "image",
    "hero_itii_preview": "image",
    "max_back_issues"            : 8,

    "ipad_entbanner_subs"        : "itunes-subs/index.html?t=",
    "ipad_entbanner_lucie_subs"  : "lucie-subs/index.html?t=",

    "storeBuyIssueBtn"           : "Buy Now",
    "heroHeading"                : "In This Issue",
    "heroPostDescriptionHTML"    : "Already have an account?<br><a href='#' onclick='new App.dialogs.SignIn(); return false;'>SIGN IN</a>",
    "subscribeOfferText"         : "Subscribe now to PEOPLE Magazine on your iPad. The Digital Edition gets you extras like bonus photos, exclusive videos, movie trailers, song samples, story updates from PEOPLE.com, click-to-buy features and so much more! Plus, get 1 month free with a semi-annual subscription.",


    "omniture_account"           : "timagpeoplenk",
    "omniture_server"            : "metrics.people.com",
    "omniture_ssl_server"        : "smetrics.people.com",

    "echo_bundle_id"             : "com_timeinc_people_ipad_inapp",
    "echo_token"                 : "aa42b59482e5836321241326aa2d5320192089e1",
    
    // my account
    "myacctAcctSetup"            : '<span class="line1">COMPLETE ACCOUNT SETUP</span><br /><span class="line2">FOR APPLE SUBSCRIBERS</span>',
        
    // http://mageng.it.timeinc.com/twiki/bin/view/Main/DPS-MagazineXML-Urls
    "adobeAppId"                 : "8632a117e7124ea988555c2dd41aa858",
    "appId"                      : "com.timeinc.people.ipad.inapp",

    "supportPhoneNumber"         : "1-866-769-0199",
    "supportEmail"               : "peopledigital@customersvc.com",

    // ************************************************************  
    // App specific URLS
    // ************************************************************  
    "lucieRegistrationURL"       : "https://subscription.timeinc.com/storefront/site/pe-lucie-customer-creation-itunes201307.html",
    
"ihatethelastcomma": true};
})();
