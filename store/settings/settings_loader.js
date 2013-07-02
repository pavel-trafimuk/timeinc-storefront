(function() {
    // THIS FILE CAN NOT HAVE ANY DEPENDENCIES OTHER THAN THE BRAND SETTINGS

    // the reason for this interface is so we can set reasonable defaults
    // when we introduce new settings to the app.
    var default_settings = {
        "omniture_account": null,
        "omniture_server": null,
        "omniture_ssl_server": null,
        
        // de facto non-limit
        "max_back_issues": 9999,

        // ************************************************************  
        // FEATURE FLAGS
        // ************************************************************   

        // "image" for TOC image overlay, "adobe" for native 
        // issue preview, "none" to disable preview
        "welcome_preview": "image",
        "hero_preview": "image",
        "hero_itii_preview": "image",
        "backissue_preview": "image",

        "enable_first_load_popup": false,


        // ************************************************************  
        // All UI Text should be in the settings:
        // ************************************************************  
        // Buttons:
        "welcomePrintSubsBtn"        : "Print Subscriber",
        "welcomeBrowseBtn"           : "Browse Issues",
        "welcomeSubscribeBtn"        : "Subscribe",
        "storeSubscribeBtn"          : "Subscribe",
        "storeBuyIssueBtn"           : "Buy Issue",
        "storeViewIssueBtn"          : "View Issue",
        "storeDownloadIssueBtn"      : "Download",
        "storeUnavailableIssueBtn"   : "Unavailable",
        
        // Messaging
        "heroHeading"                : "In This " + (settings.schedule == "weekly" ? "Week" : "Month") + "’s Issue",
        

        // ************************************************************  
        // URLS
        // ************************************************************  
        "signInForgotPasswordUrl"    : "https://subscription.timeinc.com/storefront/universalForgotPassword.ep?magcode=" + settings.brandCode,
        "customerServiceUrl"         : "https://secure.customersvc.com/servlet/Show?WESPAGE=home.html&MSRSMAG=" + settings.brandCode + "&app_launch_key=08212099",

        "DEV_TCM_FEED": "http://ecom-dev01-app.usdlls2.savvis.net:10400/html/v25app/data/" + settings.brandCode + ".json",
        "PRODUCTION_TCM_FEED": "http://subscription-assets.timeinc.com/prod/assets/appstorefronts-jq/v25data/" + settings.brandCode + ".json",
        
        "dev_tcmfeed_image_root": "http://ecom-dev01-app.usdlls2.savvis.net:10400/html/v25app/data/images/",
        "prod_tcmfeed_image_root": "http://subscription-assets.timeinc.com/prod/assets/appstorefronts-jq/v25data/images/",
        
        "lucie_server_root": "https://lucie.timeinc.com/webservices/adobews/",

        "adbfeed_cover_dimensions": [388, 507],
        "cover_spacer_img": "images/" + settings.brandCode + "/cover_spacer.gif",
        
        "dev_asset_root": "./",
        "prod_asset_root": "./",


        // ************************************************************  
        // BACKWARDS COMPATIBILITY (deprecated settings)
        // ************************************************************  
        "popupActivateButtonUrl": settings.WesPageURL,
        "upgradeSubscriptionUrl": settings.WesPageURL,
        

    ihatethelastcomma: true};

    // taken loosely from underscore.js's extend() method because this file
    // can't have any external dependencies
    for (var prop in window.settings) {
      default_settings[prop] = window.settings[prop];
    }
    window.settings = default_settings;
})();
