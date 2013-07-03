/* Dependencies:
 *  - settings ({TITLE}.js -> settings_loader.js)
 *  - jQuery
 */

window.lucieApi = {
  _default_api_args: {
    appVersion: 1,
    uuid: 1,
    appId: settings.appId,

    // Must be set be user of this lib before calling the API
    authToken: undefined
  },
  call: function(endpoint, data, cb) {
    var url = settings.lucie_server_root + endpoint;
    data = $.extend({}, this._default_api_args, data);
    $.get(url, data, cb);
  },
  entitlements: function(cb) {
    this.call("entitlements", {}, cb);
  },
}