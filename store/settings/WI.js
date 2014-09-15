(function() {
// One of the big benefits of using a js file instead of json for settings
// is the ability to add comments
window.settings = {
    "DPS_VERSION"                : "r30",

    // General settings
    "brandName"                  : "FOOD & WINE",
    "brandCode"                  : "WI",
    "schedule"                   : "monthly",

    "welcome_time_based_interval": true,
    "popupInterval"              : 24 * 60,
    
    "enable_first_load_popup"    : false,
    "store_backissues_view"      : "StoreIssuesAmex",
    "store_hero_view"            : "StoreHeroSlideshow",
    "store_folio_detail_view"    : "AmexIssuePreview",
    
    "heroHeading"                : "Inside This Issue",
    "storeIssuesTapToView"       : "tap any cover for preview",

    "amexBannerSubCTAPrimary"    : "GET 72% OFF",
    "amexBannerSubCTASecondary"  : "THE SINGLE-ISSUE PRICE",
    "storePreviewBtn"            : "Preview the Current Issue",
    "storeSubscribeBtn"          : "Subscribe & Save",

    "storeBuyIssueBtn"           : "%price%",
    
    "subscribeOfferText"         : "Subscribe now to get FOOD & WINE on your iPad.",

    "hero_preview": "none",
    "enableHeroCoverTap"         : false,
    "preview_issue_product_id"   : "FREEFWIOSPREVIEW",
    
    "max_back_issues"            : 99999,

    // http://mageng.it.timeinc.com/twiki/bin/view/Main/DPS-MagazineXML-Urls
    "adobeAppId"                 : "c2d8715688a340bfabafa01d90e6ea98",
    "appId"                      : "com.aexp.ereader.kiosk.fw",

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
    "lucieRegistrationURL"       : "https://subscription.timeinc.com/storefront/site/wi-lucie-customer-creation-itunes201407.html",

    // TODO:
    "WesPageURL"                 : "amex-address-or-acct-number.html",

    "myacctAmexMailingAddressURL": "https://secure.customersvc.com/servlet/Show?WESPAGE=am/ipad/wi/wi_addrss_login.jsp&MSRSMAG=WI&MSDTRACK=IPAD&MSDDMOFF=ABTF&MSDVNDID=TBLT&VERSION=2&APP_REF_URL=foodandwine.com/promo/storefront&APP_REF_PAGE=%23%2Fstore&prevPage=http://www.foodandwine.com/promo/storefront/index.html",
    "myacctAmexAccountNumberURL": "https://secure.customersvc.com/servlet/Show?WESPAGE=am/ipad/wi/wi_accnt_login.jsp&MSRSMAG=WI&MSDTRACK=IPAD&MSDDMOFF=ABTF&MSDVNDID=TBLT&VERSION=2&APP_REF_URL=amexdev.s3-website-us-east-1.amazonaws.com&APP_REF_PAGE=%23%2Fstore&prevPage=http://www.foodandwine.com/promo/storefront/index.html",
    
"ihatethelastcomma": true};
})();
