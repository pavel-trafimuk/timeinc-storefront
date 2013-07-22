(function() {
// One of the big benefits of using a js file instead of json for settings
// is the ability to add comments
window.settings = {

    // General settings
    "brandName"                  : "HEALTH Magazine",
    "brandCode"                  : "HA",
    "schedule"                   : "weekly",
    "popupInterval"              : 3,
    "enable_first_load_popup"    : false,
    "subscribeOfferText"         : "Subscribe now to get HEALTH on your iPad. Each issue is packed with smart and fun new ways to stay in great shape, look amazing and discover tasty (and healthy!) things to eat. Plus, get 1 month free with an annual subscription.",
    
    "welcome_preview": "image",
    "hero_preview": "image",
    "hero_itii_preview": "image",
    "max_back_issues"            : 20,

    "omniture_account"           : "timaghealthnk",
    "omniture_server"            : "metrics.health.com",
    "omniture_ssl_server"        : "smetrics.health.com",

    // http://mageng.it.timeinc.com/twiki/bin/view/Main/DPS-MagazineXML-Urls
    "adobeAppId"                 : "0c39db3098364421bf27ed6ab0d5bf25",
    "appId"                      : "com.timeinc.health.ipad.inapp",

    "supportPhoneNumber"         : "1-800-290-9275",
    "supportEmail"               : "digital@health.customersvc.com",

    // ************************************************************  
    // App specific URLS
    // ************************************************************  
    "lucieRegistrationURL"       : "https://subscription.timeinc.com/storefront/site/ha-lucie-customer-creation-itunes201307.html",
    "welcomeScreenWesURL"        : "https://secure.customersvc.com/servlet/Show?WESPAGE=am/tablet/template/login.jsp&MSRSMAG=HA&MSDDMOFF=ABTF&MSDTRACK=IPSP&MSDVNDID=TBLT",
    "WesPageURL"                 : "https://secure.customersvc.com/servlet/Show?WESPAGE=am/tablet/template/login.jsp&MSRSMAG=HA&MSDDMOFF=ABTF&MSDTRACK=IPAD&MSDVNDID=TBLT",
    "licenceAgreementUrl"        : "http://www.timeinc.net/subs/privacy/eula/ha/agreement.html",
    "privacyPolicyUrl"           : "https://subscription.timeinc.com/storefront/privacy/health/generic_privacy_new.html?dnp-source=H",
    "termsOfUseUrl"              : "https://subscription.timeinc.com/storefront/privacy/health/privacy_terms_service.html",

    "adobeFeedUrl"               : "http://subscription-assets.timeinc.com/prod/assets/appstorefronts-jq/adobe-feeds/com.timeinc.health.ipad.inapp.xml",
    "adobeFeedUrl_dev"           : "http://ecom-dev01-app.usdlls2.savvis.net:10500/assets/appstorefronts-jq/adobe-feeds/com.timeinc.health.ipad.inapp.xml",
    
"ihatethelastcomma": true};
})();