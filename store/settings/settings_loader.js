(function() {
    // the reason for this interface is so we can load settings
    // via ajax like the existing apps
    var default_settings = {
        "omniture_account": null,
        "PRODUCTION_TCM_FEED": "invalid://fill.me.in/todo",
        "DEV_TCM_FEED": "http://ecom-dev01-app.usdlls2.savvis.net:10400/html/v25app/data/" + settings.brandCode + ".json",

    ihatethelastcomma: true};

    window.settings = _.extend({}, default_settings, window.settings);
})();
