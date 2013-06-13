/* DEPENDENCIES
 *  - AdobeLibraryAPI.js (note: must wait for initializationComplete)
 *  - s_code.js (-> settings/{title}.js, settings/settings_loader.js)
 *  - moment.js
 *  - underscore.js
 */
(function(root) {

  function cache(key, getter) {
    if (cache[key] === undefined) cache[key] = getter();
    return cache[key];
  };

  var config = {};
  root.setup = function(cfg) {
    _.extend(config, cfg);
  }
  root.set_pagename = function(page_name) {
    var prev_pagename = config.pageName;
    root.setup({
      pageName: page_name,
    });
    return prev_pagename;
  }

  function get_context_data_to_track() {
    var isLoggedOn = adobeDPS.authenticationService.isUserAuthenticated,
        today = moment(), // moment.js
        halfHour = (today.minutes() >= 30) ? "30" : "00",
        orientation = (window.orientation == 0 || window.orientation == 180) ? 'portrait' : 'landscape',
        visitor_id = cache('visitor_id', function() { 
          return md5(adobeDPS.deviceService.deviceId);
        }),
        timestamp = today.format('MM/DD/YYYY-hh:[' + halfHour + ']A'),
        device = adobeDPS.deviceService.deviceName.toLowerCase(),
        subscriber_type = "dsc", // TODO
        subscriber_id = ''; // TODO
      
    return {
      timestamp: today.unix(),
      
      visitorID: visitor_id,
      eVar3: visitor_id,

      prop3: "D=User Agent",
      prop10: device+" dps",

      prop16: "store",
      eVar24: "store",

      prop18: orientation,
      prop19: "online",
        
      prop26: subscriber_type,
      eVar26: subscriber_type,

      prop34: 'ab_test_off',
      eVar34: 'ab_test_off',

      prop29: subscriber_id,
      eVar29: subscriber_id,
      
      prop36: "storefront",
      eVar36: "storefront",

      eVar30: today.format("dddd").toLowerCase(),

      prop7: timestamp,
      eVar31: timestamp,

      eVar32: (today.day() == 0 || today.day() == 6) ? "weekend" : "weekday"
    }
  }

  root._omniture_track = function(data_obj) {
    try {
      var omni = window.Omniture;

      _.extend(omni, get_context_data_to_track());

      omni.prop35 = omni.eVar35 = "pageview";

      _.extend(omni, data_obj);
      omni.t();
    }
    catch (e) {
      console.log('ERROR in app.js::onOmniture', e);
    } 
  }

  root._omniture_track_link = function(data_obj) {
    try {
      var omni = window.Omniture,
          keys = _.keys(data_obj);

      _.extend(omni, get_context_data_to_track());

      cfg.events = !(cfg.events) ? 'event45' : cfg.events; 
        
      omni.linkTrackVars = keys.join(',') + ',prop3,prop7,prop10,prop16,prop18,prop19,prop26,prop29,prop34,prop35,prop36,eVar3,eVar24,eVar26,eVar29,eVar30,eVar31,eVar32,eVar34,eVar35,eVar36,eVar44,events';
      omni.linkTrackEvents = cfg.events;
      omni.prop35 = omni.eVar35 = "user action";
      omni.eVar44 = omni.pageName;

      _.extend(omni, data_obj);
      omni.tl(this, 'o', (omni.events == 'event44') ? 'splash occurences' : 'user action');
        
      _.each(keys, function(key) {
        omni[key] = null; 
      })
    }
    catch (e) {
      console.log('ERROR in app.js::onOmnitureTL', e);
    }
  }

  root.pageview = function(page_name, events, set_name) {
    set_name = (set_name===undefined) ? true : set_name;
    var prev_pagename, ret = {};
    if (set_name) ret.prev = root.set_pagename("store|" + page_name);
    root._omniture_track({
      prop8: page_name,
      eVar28: page_name,
      events: events
    });
    return ret;
  }
  root.lucieflow_pageview = function(page_name, events) {
    root._omniture_track({
      pageName: "store|" + page_name,
      prop8: page_name,
      eVar28: page_name,
      eVar33: page_name,
      events: events
    });
    return {};
  }
  root.event = function(evt_name, evt_meta) {
    data = {
      prop45: evt_name,
      eVar45: evt_name
    }
    if (evt_meta !== undefined) {
      data.eVar1 = data.eVar2 = evt_meta;
    }
    root._omniture_track_link(data);
    return {};
  }

})(window.TcmOmni={});
