(function(root) {

  function get_context_data_to_track() {
    var isLoggedOn = false,
        today = moment(), // moment.js
        halfHour = (today.minutes() >= 30) ? "30" : "00",
        orientation = (window.orientation == 0 || window.orientation == 180) ? 'portrait' : 'landscape',
        visitor_id = 0, // TODO
        timestamp = today.format('MM/DD/YYYY-hh:[' + halfHour + ']A'),
        device = "ipad", // TODO
        subscriber_type = "dsc", // TODO
        subscriber_id = ''; // TODO
      
    //Offer banner AB Test tracking when store landing page loaded
    // omni.prop34 = (localStorage.testType == "A") ? 'a_banner_activate' : 'b_banner_subscribe';
    // omni.eVar34 = (localStorage.testType == "A") ? 'a_banner_activate' : 'b_banner_subscribe';

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

  root.omniture_track = function(data_obj) {
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

  root.omniture_track_link = function(data_obj) {
    try {
      var omni = window.Omniture,
          keys = _.keys(data_obj),
          pageName = (Ext.ComponentQuery.query('currentview').length > 0) ? 'store|recent issues' : 'store|special issues';

      _.extend(omni, get_context_data_to_track());

      cfg.events = !(cfg.events) ? 'event45' : cfg.events; 
        
      omni.linkTrackVars = keys.join(',') + ',prop3,prop7,prop10,prop16,prop18,prop19,prop26,prop29,prop34,prop35,prop36,eVar3,eVar24,eVar26,eVar29,eVar30,eVar31,eVar32,eVar34,eVar35,eVar36,eVar44,events';
      omni.linkTrackEvents = cfg.events;
      omni.prop35 = omni.eVar35 = "user action";
      omni.eVar44 = omni.pageName = pageName;
        
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
  
})(window);
