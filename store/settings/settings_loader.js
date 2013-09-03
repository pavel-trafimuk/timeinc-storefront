(function() {
    // THIS FILE CAN NOT HAVE ANY DEPENDENCIES OTHER THAN THE BRAND SETTINGS

    // the reason for this interface is so we can set reasonable defaults
    // when we introduce new settings to the app.
    var default_settings = {
        "omniture_account": null,
        "omniture_server": null,
        "omniture_ssl_server": null,
        
        "echo_stage" : "https://echostage.timeinc.com/devices",
        "echo_prod"  : "https://echo.timeinc.com/devices",
        
        // de facto non-limit
        "max_back_issues": 9999,
        
        // eMags will not track without the App ID
        "eMagsAppId": "",
        

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
        
        // display welcome screen only once per new issue
        "welcome_once_per_issue": false,


        // ************************************************************  
        // All UI Text should be in the settings:
        // ************************************************************  
        "welcomePrintSubsBtn"        : "Print Subscriber",
        "welcomeBrowseBtn"           : "Browse Issues",
        "welcomeSubscribeBtn"        : "Subscribe",
        "welcomeAlreadyHaveAcct"     : "Already have an account?",

        "storeSubscribeBtn"          : "Subscribe",
        "storeBuyIssueBtn"           : "Buy Issue",
        "storeViewIssueBtn"          : "View Issue",
        "storeDownloadIssueBtn"      : "Download",
        "storeUnavailableIssueBtn"   : "Unavailable",
        "storeIssuesTapToView"       : "Tap to View",
        "storeSubscribeNow"          : "Subscribe now for",
        "storeSubscribeNowPriceOr"   : " or ",

        // subscribe dialog
        "subscribeTo"                : "Subscribe to",
        "subscribeYourSubscription"  : "Your Subscription",
        "subscribeCancel"            : "Cancel",

        // app-wide interaction text
        "seeInsideCTA"               : "See Inside",
        "progressStarting"           : "Loading…",
        "progressDownloading"        : "Downloading…",
        "progressOpening"            : "Opening…",

        // Messaging
        //"heroHeading"                : "In This " + (settings.schedule == "weekly" ? "Week" : "Month") + "’s Issue",
        "heroHeading"                : "Preview Editor’s Picks",
        "heroExistingQuestion"       : "Existing Subscriber?",
        "heroExistingLink"           : "Create a Digital Account",
        "heroOpeningItii"            : "Opening Article…",
        
        // First load popup
        "popup_paragraph1"           : "",
        "popup_paragraph2"           : "",
        "popup_restore_text"         : "<i>To restore your back issues follow instructions in the Library</i>",
        "popup_subscribe_text"       : "Download the latest issue now",
        "popup_close_text"           : "Close",

        // my account
        "myacctForgotPassword"       : '<span class="singleLine">FORGOT PASSWORD</span>',
        "myacctPrintSubs"            : '<span class="line1">PRINT SUBSCRIBERS</span><br /><span class="line2">TAP HERE</span>',
        "myacctAcctSetup"            : '<span class="line1">COMPLETE ACCOUNT SETUP</span><br /><span class="line2">FOR IPAD SUBSCRIBERS</span>',
        "myacctRestoreIssues"        : '<span class="singleLine">RESTORE ISSUES</span>',
        "myacctCustService"          : '<span class="singleLine">CUSTOMER SERVICE</span>',

        // Sign-in Dialog
        "authSigninHeader"           : "Sign In",
        "authSigninButton"           : "Sign In",
        "authInstructions"           : "Please sign in to your digital edition account",
        "authPlacehodlerEmail"       : "e-mail address",
        "authPlacehodlerPass"        : "password",
        "authForgotPassword"         : "Forgot Password?",
        "authPrintSubsPrompt"        : "Print Subscribers:",
        "authPrintSubsLinkText"      : "Create a Digital Account",
        "authPrivacyLinkText"        : "Privacy",
        "authLicenseLinkText"        : "License",
        "authTermsLinkText"          : "Terms",
        
        "authErrorNoEmail"           : "Please enter your username",
        "authErrorNoPass"            : "Please enter a valid password",
        "authErrorAuthFailed"        : "Authentication Failed",


        // ************************************************************  
        // URLS
        // ************************************************************
        "privacyPolicyUrl"           : "http://subscription-assets.timeinc.com/prod/assets/themes/magazines/default/template-resources/html/legal/ios/"+settings.brandCode+"/pp.html",
        "termsOfUseUrl"              : "http://subscription-assets.timeinc.com/prod/assets/themes/magazines/default/template-resources/html/legal/ios/"+settings.brandCode+"/tos.html",
        "licenceAgreementUrl"        : "http://subscription-assets.timeinc.com/prod/assets/themes/magazines/default/template-resources/html/legal/ios/"+settings.brandCode+"/la.html",
        "signInForgotPasswordUrl"    : "https://subscription.timeinc.com/storefront/universalForgotPassword.ep?magcode=" + settings.brandCode,

        // Domestic URLs
        "welcomeScreenWesURL"        : "https://secure.customersvc.com/servlet/Show?WESPAGE=am/tablet/template/login.jsp&MSRSMAG="+settings.brandCode+"&MSDDMOFF=ABTF&MSDTRACK=IPSP&MSDVNDID=TBLT",
        "WesPageURL"                 : "https://secure.customersvc.com/servlet/Show?WESPAGE=am/tablet/template/login.jsp&MSRSMAG="+settings.brandCode+"&MSDDMOFF=ABTF&MSDTRACK=IPAD&MSDVNDID=TBLT",
        "WesPageURLiphone"           : "https://secure.customersvc.com/servlet/Show?WESPAGE=am/tablet/template/login.jsp&MSRSMAG="+settings.brandCode+"&MSDDMOFF=ABTF&MSDTRACK=IPHB&MSDVNDID=TBLT",
        "customerServiceUrl"         : "https://secure.customersvc.com/servlet/Show?WESPAGE=home.html&MSRSMAG=" + settings.brandCode + "&app_launch_key=08212099",
        
        // International URLs
        "welcomeScreenWesURL_INTL"   : "https://secure.customersvc.com/wes/servlet/Show?WESPAGE=iam/tablet/allaccess_web_country.jsp&MSRSMAG="+settings.brandCode +"&MSDDMOFF=ABTF&MSDTRACK=IPSP&MSDVNDID=TBLT",
        "WesPageURL_INTL"            : "https://secure.customersvc.com/wes/servlet/Show?WESPAGE=iam/tablet/allaccess_web_country.jsp&MSRSMAG="+settings.brandCode +"&MSDDMOFF=ABTF&MSDTRACK=IPAD&MSDVNDID=TBLT",
        "WesPageURLiphone_INTL"      : "https://secure.customersvc.com/wes/servlet/Show?WESPAGE=iam/tablet/allaccess_web_country.jsp&MSRSMAG="+settings.brandCode +"&MSDDMOFF=ABTF&MSDTRACK=IPHB&MSDVNDID=TBLT",
        "customerServiceUrl_INTL"    : "https://secure.customersvc.com/wes/servlet/Show?WESPAGE=iam/pages/home.jsp&MSRSMAG=" + settings.brandCode,
        
        "myacctRestoreIssuesURL"     : "restoreissues.html",


        // urls cached on our server. canonical versions listed at:  
        // http://mageng.it.timeinc.com/twiki/bin/view/Main/DPS-MagazineXML-Urls
        "adobeFeedUrl"               : "http://subscription-assets.timeinc.com/prod/assets/appstorefronts-jq/adobe-feeds/"+settings.appId+".xml",
        "adobeFeedUrl_dev"           : "http://ecom-dev01-app.usdlls2.savvis.net:10500/assets/appstorefronts-jq/adobe-feeds/"+settings.appId+".xml", 

        "DEV_TCM_FEED": "http://ecom-dev01-app.usdlls2.savvis.net:10400/html/v25app/data/" + settings.brandCode + ".json",
        "PRODUCTION_TCM_FEED": "http://subscription-assets.timeinc.com/prod/assets/appstorefronts-jq/v25data/" + settings.brandCode + ".json",
        
        "dev_tcmfeed_image_root": "http://ecom-dev01-app.usdlls2.savvis.net:10400/html/v25app/data/images/",
        "prod_tcmfeed_image_root": "http://subscription-assets.timeinc.com/prod/assets/appstorefronts-jq/v25data/images/",
        
        "lucie_server_root": "https://lucie.timeinc.com/webservices/adobews/",

        "adbfeed_cover_dimensions": [388, 507],
        "cover_spacer_img": "images/" + settings.brandCode + "/cover_spacer.gif",
        
        "dev_asset_root": "./",
        "prod_asset_root": "./",

    ihatethelastcomma: true};
    

    // BACKWARDS COMPATIBILITY (deprecated settings)
    if (settings.international) {
        default_settings.welcomeScreenWesURL = (settings.welcomeScreenWesURL) ? settings.welcomeScreenWesURL : default_settings.welcomeScreenWesURL_INTL;
        default_settings.WesPageURL = (settings.WesPageURL) ? settings.WesPageURL : default_settings.WesPageURL_INTL;
        default_settings.WesPageURLiphone = (settings.WesPageURLiphone) ? settings.WesPageURLiphone : default_settings.WesPageURLiphone_INTL;
        default_settings.popupActivateButtonUrl = (settings.WesPageURL) ? settings.WesPageURL : default_settings.WesPageURL_INTL;
        default_settings.popupActivateButtonUrlIphone = (settings.WesPageURLiphone) ? settings.WesPageURLiphone : default_settings.WesPageURLiphone_INTL;
        default_settings.upgradeSubscriptionUrl = (settings.wesPageURL) ? settings.WesPageURL : default_settings.WesPageURL_INTL;
        default_settings.customerServiceUrl = (settings.customerServiceUrl) ? settings.customerServiceUrl : default_settings.customerServiceUrl_INTL;
        default_settings.signInForgotPasswordUrl = (settings.signInForgotPasswordUrl) ? settings.signInForgotPasswordUrl : default_settings.signInForgotPasswordUrl;
    } else {
        default_settings.popupActivateButtonUrl = default_settings.WesPageURL;
        default_settings.popupActivateButtonUrlIphone = default_settings.WesPageURLiphone;
        default_settings.upgradeSubscriptionUrl = default_settings.WesPageURL;
    }

    // taken loosely from underscore.js's extend() method because this file
    // can't have any external dependencies
    for (var prop in window.settings) {
      default_settings[prop] = window.settings[prop];
    }
    window.settings = default_settings;
})();
