(function() {
// One of the big benefits of using a js file instead of json for settings
// is the ability to add comments
window.settings = {
    // Look at CFBundleVersion
    // http://mageng.it.timeinc.com/twiki/bin/view/Main/AppInformation
    "cfBundleVersion"            : "4.0.14",
    
    "DPS_VERSION"                : "r30",

    // General settings
    "brandName"                  : "TRAVEL & LEISURE",
    "brandCode"                  : "LE",
    "schedule"                   : "monthly",
    
    "welcome_time_based_interval": true,
    "popupInterval"              : 24 * 60,
    
    "store_slideshow_delay"      : 8000,
    
    "enable_first_load_popup"    : false,
    "store_backissues_view"      : "StoreIssuesAmex",
    "store_hero_view"            : "StoreHeroSlideshow",
    "store_folio_detail_view"    : "AmexIssuePreview",
    
    "heroHeading"                : "Inside This Issue",
    "storeIssuesTapToView"       : "tap any cover for preview",

    "amexBannerSubCTAPrimary"    : "GET 30 DAYS FREE",
    "amexBannerSubCTASecondary"  : "WHEN YOU SUBSCRIBE",
    "storePreviewBtn"            : "Preview the Current Issue",
    "storeSubscribeBtn"          : "Subscribe & Save",

    "storeBuyIssueBtn"           : "%price%",

    "subscribeOfferText"         : "Subscribe now to get Travel + Leisure on your iPad.",
    
    "hero_preview": "none",
    "enableHeroCoverTap"         : false,
    "preview_issue_product_id"   : "TLFreePreview_iPad",
    
    "max_back_issues"            : 20,
    
    "eMagsAppId": "TRVLSRIPAD",
   
    // http://mageng.it.timeinc.com/twiki/bin/view/Main/DPS-MagazineXML-Urls
    "adobeAppId"                 : "073ce43d9b754f2aa77bcdd6f2dff3a0",
    "appId"                      : "com.aexp.ereader.kiosk.tl",

    "supportPhoneNumber"         : "1-866-772-8789",
    "supportEmail"               : "digital@allyou.customersvc.com",

    "omniture_account"           : "",
    "omniture_server"            : "",
    "omniture_ssl_server"        : "",

    "myacctCustomerCareSupport"  : "",
    "myacctAmexMailingAddress"   : "Mailing Address",
    "myacctAmexAccountNumber"    : "Account Number",

    // ************************************************************  
    // App specific URLS
    // ************************************************************  
    "lucieRegistrationURL"       : "https://subscription.timeinc.com/storefront/site/le-lucie-customer-creation-itunes201407.html",
    
    // TODO:
    "WesPageURL"                 : "amex-address-or-acct-number.html",

    "myacctAmexMailingAddressURL": "https://secure.customersvc.com/servlet/Show?WESPAGE=am/ipad/le/le_addrss_login.jsp&MSRSMAG=LE&MSDTRACK=IPAD&MSDDMOFF=ABTF&MSDVNDID=TBLT&VERSION=2&APP_REF_URL=travelandleisure.com/promo/storefront&APP_REF_PAGE=%23%2Fstore&prevPage=http://www.travelandleisure.com/promo/storefront/index.html",
    "myacctAmexAccountNumberURL" : "https://secure.customersvc.com/servlet/Show?WESPAGE=am/ipad/le/le_accnt_login.jsp&MSRSMAG=LE&MSDTRACK=IPAD&MSDDMOFF=ABTF&MSDVNDID=TBLT&VERSION=2&APP_REF_URL=amexdev.s3-website-us-east-1.amazonaws.com&APP_REF_PAGE=%23%2Fstore&prevPage=http://www.travelandleisure.com/promo/storefront/index.html",
    
"ihatethelastcomma": true};
})();
