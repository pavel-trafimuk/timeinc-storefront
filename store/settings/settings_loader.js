(function() {
    // THIS FILE CAN NOT HAVE ANY DEPENDENCIES OTHER THAN THE BRAND SETTINGS

    // the reason for this interface is so we can set reasonable defaults
    // when we introduce new settings to the app.
    var default_settings = {

        "store_hero_view"            : "StoreHero",
        "store_backissues_view"      : "StoreIssues",
        "store_folio_detail_view"    : "IssuePreviewImage",

        "omniture_account": null,
        "omniture_server": null,
        "omniture_ssl_server": null,
        
        "popup_paragraph1"           : "",
        "popup_paragraph2"           : "",
        "popup_restore_text"         : "<i>To restore your back issues follow instructions in the Library</i>",
        "popup_subscribe_text"       : "Download the latest issue now",
        "popup_close_text"           : "Close",
    
        "echoENV"    : "prod", // set to 'prod' in brand settngs file when going live
        "echo_stage" : "https://echostage.timeinc.com/devices",
        "echo_prod"  : "https://echo.timeinc.com/devices",
        "echo_channel_id" : "1", // Channel Id for iOS is 1
        
        // de facto non-limit
        "max_back_issues": 9999,
        
        // eMags will not track without the App ID
        "eMagsAppId": "",

        // Sample/Preview Issue ID - will override the default behavior
        // of putting the latest issue in the hero (which would be the
        // sample issue without this setting).
        "preview_issue_product_id": "",
        

        // ************************************************************  
        // FEATURE FLAGS
        // ************************************************************   
        
        //Controls tap to 'see inside'
        "enableHeroCoverTap": true,
        
        // "image" for TOC image overlay, "adobe" for native 
        // issue preview, "none" to disable preview
        "welcome_preview": "image",
        "hero_preview": "image",
        "hero_itii_preview": "image",
        "backissue_preview": "image",

        "enable_first_load_popup": false,
        
        // display welcome screen only once per new issue
        "welcome_once_per_issue": false,
        
        // Show Buy/Download buttons below back issues
        "storeIssuesBuyBtns": false,
        "store_show_banners": false,


        // ************************************************************  
        // All UI Text should be in the settings:
        // ************************************************************  
        "welcomePrintSubsBtn"        : "Print Subscriber",
        "welcomeBrowseBtn"           : "Browse Issues",
        "welcomeSubscribeBtn"        : "Subscribe",
        "welcomeAlreadyHaveAcct"     : "Already have an account?",

        "storePreviewBtn"            : "Sample This Issue",
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

        // Buy Issue dialog
        "heroBuyIssue_useDialog"     : false,
        "buyIssueTitle"              : "Buy Issue",
        "buyIssueText"               : "Subscribe now to get this issue and save up to %discount% off the cover price!",
        "buyIssueSubscribe"          : "Subscribe Now",
        "buyIssueContinue"           : "Continue and Buy This Single Issue for %price%",
        "buyIssueSubscribeDiscount"  : "XX%",

        // Straight-to-sample dialog
        "straightToSampleEnabled"    : false,
        "straightToSampleTitle"      : "Free Sample",
        "straightToSampleText"       : "The current issue of " + settings.brandName + " is ready to sample.<br><br>Do you want to start reading it now?",
        "straightToSampleContinueBtn": "Start reading",
        "straightToSampleCancelBtn"  : "Not now",

        // Auto-download banner
        "bannerAD_header_nowifi"     : "FREE SAMPLE",
        "bannerAD_body_nowifi"       : "The current issue is ready to sample",
        "bannerAD_header_downloading": "NOW DOWNLOADING",
        "bannerAD_body_downloading"  : "A free sample of the current issue is now downloading",
        "bannerAD_header_ready"      : "FREE SAMPLE",
        "bannerAD_body_ready"        : "The current issue is ready to sample",
        
        "bannerAD_download_button"   : "Download",
        "bannerAD_read_button"       : "Start Reading",

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
        
        "myacctForgotPassword"       : 'Forgot Password',
        "myacctiTunesSubscriber"     : 'I subscribed through iTunes<sup style="font-size:13px;">&reg;</sup>',
        "myacctNoniTunesSubscriber"  : 'I subscribed elsewhere',
        "myacctNotSureSubscriber"    : 'I\'m not sure how I subscribed',
        "myacctTellUsMore"           : 'TELL US A LITTLE MORE<br>SO WE CAN HELP YOU...',
        "myacctWhatHelp"             : 'WHAT CAN WE HELP YOU WITH?',
        "myacctCustomerCareSupport"  : 'CUSTOMER CARE SUPPORT',
        "myacctPrintSubs"            : 'I have a subscription and want to create my '+settings.brandName+' digital account',
        "myacctSignIn"               : 'I have a '+settings.brandName+' digital account and want to access my issues',
        "myacctAcctSetup"            : 'I want to create my '+settings.brandName+' digital account',
        "myacctLUCIEText"            : 'Your '+settings.brandName+' digital account gives you access to future benefits and other valuable information.',
        "myacctSignInText"           : 'Your digital account is your email address and password',
        "myacctSignOut"              : 'Sign Out',
        "myacctRestoreIssues"        : 'I want to access my issues',
        "myacctCustService"          : 'Contact Customer Care',
        "myacctGoBack"               : 'Go Back',
        "myacctHelpGuide"            : 'Help Guide',
        "myacctFAQ"                  : 'FAQs',
        
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
        // ENTITLEMENT BANNERS
        // ************************************************************
        "ipad_entbanner_subs"        : "subs/index.html?t=",
        "ipad_entbanner_lucie_subs"  : "subs/index.html?t=",
        "ipad_entbanner_alacarte"    : "nonsubs/index.html?t=",
        "ipad_entbanner_nonsubs"     : "nonsubs/index.html?t=",

        "iphone_entbanner_subs"      : "subs/index.html?t=",
        "iphone_entbanner_lucie_subs": "subs/index.html?t=",
        "iphone_entbanner_alacarte"  : "nonsubs/index.html?t=",
        "iphone_entbanner_nonsubs"   : "nonsubs/index.html?t=",


        // ************************************************************  
        // URLS
        // ************************************************************
        "privacyPolicyUrl"           : "http://subscription-assets.timeinc.com/prod/assets/themes/magazines/default/template-resources/html/legal/ios/"+settings.brandCode+"/pp.html",
        "termsOfUseUrl"              : "http://subscription-assets.timeinc.com/prod/assets/themes/magazines/default/template-resources/html/legal/ios/"+settings.brandCode+"/tos.html",
        "licenceAgreementUrl"        : "http://subscription-assets.timeinc.com/prod/assets/themes/magazines/default/template-resources/html/legal/ios/"+settings.brandCode+"/la.html",
        "signInForgotPasswordUrl"    : "https://subscription.timeinc.com/storefront/universalForgotPassword.ep?magcode="+settings.brandCode,

        // Domestic URLs
        "welcomeScreenWesURL"        : "https://secure.customersvc.com/servlet/Show?WESPAGE=am/tablet/template/login.jsp&MSRSMAG="+settings.brandCode+"&MSDDMOFF=ABTF&MSDTRACK=IPSP&MSDVNDID=TBLT&version=2",
        "WesPageURL"                 : "https://secure.customersvc.com/servlet/Show?WESPAGE=am/tablet/template/login.jsp&MSRSMAG="+settings.brandCode+"&MSDDMOFF=ABTF&MSDTRACK=IPAD&MSDVNDID=TBLT&version=2",
        "WesPageURLiphone"           : "https://secure.customersvc.com/servlet/Show?WESPAGE=am/tablet/template/login.jsp&MSRSMAG="+settings.brandCode+"&MSDDMOFF=ABTF&MSDTRACK=IPHB&MSDVNDID=TBLT",
        "customerServiceUrl"         : "https://secure.customersvc.com/servlet/Show?WESPAGE=am/Services/wes_email.jsp&MSRSMAG="+settings.brandCode,
        
        // International URLs
        "welcomeScreenWesURL_INTL"   : "https://secure.customersvc.com/wes/servlet/Show?WESPAGE=iam/tablet/allaccess_web_country.jsp&MSRSMAG="+settings.brandCode +"&MSDDMOFF=ABTF&MSDTRACK=IPSP&MSDVNDID=TBLT",
        "WesPageURL_INTL"            : "https://secure.customersvc.com/wes/servlet/Show?WESPAGE=iam/tablet/allaccess_web_country.jsp&MSRSMAG="+settings.brandCode +"&MSDDMOFF=ABTF&MSDTRACK=IPAD&MSDVNDID=TBLT",
        "WesPageURLiphone_INTL"      : "https://secure.customersvc.com/wes/servlet/Show?WESPAGE=iam/tablet/allaccess_web_country.jsp&MSRSMAG="+settings.brandCode +"&MSDDMOFF=ABTF&MSDTRACK=IPHB&MSDVNDID=TBLT",
        "customerServiceUrl_INTL"    : "https://secure.customersvc.com/wes/servlet/Show?WESPAGE=iam/pages/home.jsp&MSRSMAG=" + settings.brandCode,
        
        "myacctRestoreIssuesURL"     : "restoreissues.html",
        "myacctHelpGuideURL"         : '../helpguides/index.html',
        "myacctFAQURLR27"            : 'http://subscription-assets.timeinc.com/prod/assets/themes/magazines/SUBS/templates/velocity/site/mm-r27ipad-digitaledition-faq/lp.html',
        "myacctFAQURLR28"            : 'http://subscription-assets.timeinc.com/prod/assets/themes/magazines/SUBS/templates/velocity/site/mm-r28ipad-digitaledition-faq/lp.html',
        "myacctFAQURLiphone"         : 'http://subscription-assets.timeinc.com/prod/assets/themes/magazines/SUBS/templates/velocity/site/mm-r28iphone-digitaledition-faq/lp.html',


        // http://mageng.it.timeinc.com/twiki/bin/view/Main/DPS-MagazineXML-Urls
        "adobeFeedUrl"                   : "http://edge.adobe-dcfs.com/ddp/issueServer/issues?accountId="+settings.adobeAppId+"&targetDimension=2048x1536,1024x768,1024x748,2048x1496,1136x640,960x640,480x320",
        "adobeFeedUrl_dev"               : "http://subscription-assets.timeinc.com/prod/assets/appstorefronts-jq/adobe-feeds/"+settings.appId+".xml",

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
        default_settings.welcomeScreenWesURL = (settings.welcomeScreenWesURL) ? settings.welcomeScreenWesURL : default_settings.welcomeScreenWesURL;
        default_settings.WesPageURL = (settings.WesPageURL) ? settings.WesPageURL : default_settings.WesPageURL;
        default_settings.WesPageURLiphone = (settings.WesPageURLiphone) ? settings.WesPageURLiphone : default_settings.WesPageURLiphone;
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
