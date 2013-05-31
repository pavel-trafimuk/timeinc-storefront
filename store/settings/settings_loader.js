(function() {
    // the reason for this interface is so we can load settings
    // via ajax like the existing apps
    var default_settings = {
        "omniture_account": null,

        "DEV_TCM_FEED": "http://ecom-dev01-app.usdlls2.savvis.net:10400/html/v25app/data/" + settings.brandCode + ".json",
        "PRODUCTION_TCM_FEED": "http://subscription-assets.timeinc.com/prod/assets/appstorefronts-jq/v25data/" + settings.brandCode + ".json",
        
        "dev_tcmfeed_image_root": "http://ecom-dev01-app.usdlls2.savvis.net:10400/html/v25app/data/images/",
        "prod_tcmfeed_image_root": "http://subscription-assets.timeinc.com/prod/assets/appstorefronts-jq/v25data/images/",
        "adbfeed_cover_dimensions": [388, 507],
        "cover_spacer_img": "images/" + settings.brandCode + "/cover_spacer.gif",
        
        "dev_asset_root": "http://ecom-dev01-app.usdlls2.savvis.net:10400/appstorefronts-jq/"+settings.brandCode+"/adobe/apple/ipad/v25/",
        "prod_asset_root": "http://subscription-assets.timeinc.com/prod/assets/appstorefronts-jq/"+settings.brandCode+"/adobe/apple/ipad/v25/",

    ihatethelastcomma: true};

    window.settings = _.extend({}, default_settings, window.settings);
})();
