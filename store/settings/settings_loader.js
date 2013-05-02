(function() {
    // the reason for this interface is so we can load settings
    // via ajax like the existing apps
    var default_settings = {
        "omniture_account": null,

    ihatethelastcomma: true};

    window.settings = _.extend({}, default_settings, window.settings);
})();
