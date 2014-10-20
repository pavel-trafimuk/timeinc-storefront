/* global settings, $, adobeDPS */
window.libBanner = (function() {
  // lib is the object that will be stored in window.libBanner
  var lib = {};

  var screen_W = window.screen.width,  // get device screen width
      screen_H = window.screen.height, // get device screen height

      deviceType = (navigator.userAgent.match(/iPad/i) != null) ? "iPad" : "iPhone",

      // store all possible issue dimensions in array for device being used;
      dimensionsArrays = {
        "iPad": ["2048x1536", "1024x768", "1024x748", "2048x1496"],
        "iPhone": ["1136x640", "568x320", "960x640", "480x320"]
      },

      // you can set DEV_DEVICE_TYPE as "iPhone" or "iPad" for desktop browser-based development
      dimensionsArray = dimensionsArrays[window.DEV_DEVICE_TYPE || deviceType],
      adobeFeedUrl = settings.baseAdobeFeedUrl + "&targetDimension=" + dimensionsArray.join(",");

  /////////////////////////////////////////////////////////////////////////// 
  // Utility Functions
  ///////////////////////////////////////////////////////////////////////////
  
  // Returns a wrapper function that allows fn() to be called exactly once
  function once(fn) {
    var called = false;
    function wrapper() {
      if (called) return;
      called = true;
      return fn.apply(this, arguments);
    }
    return wrapper;
  }

  // provides persistant caching of async functions
  function cache_async(cache_key, duration_minutes, fn, codec) {
    codec = codec || cache_async.json_codec;

    var now = +(new Date),
        duration_ms = duration_minutes * 60 * 1000,

        expire_key = cache_key + ":expires",
        value_key = cache_key + ":value",

        current_expires = parseInt(localStorage.getItem(expire_key) || "0"),
        current_val = codec.decode(localStorage.getItem(value_key)),

        is_expired = current_expires < now;

    return function(cb) {
      if (!is_expired) {
        cb(current_val);
        return
      }

      fn(function(data) {
        localStorage.setItem(expire_key, now + duration_ms)
        localStorage.setItem(value_key, codec.encode(data))
        
        is_expired = false;
        current_val = data;

        cb(data);
      });
    }
  }
  cache_async.json_codec = {
    encode: function(d) {
      return JSON.stringify(d)
    },
    decode: function(d) {
      return JSON.parse(d || "null");
    }
  };
  cache_async.xml_codec = {
    encode: function(d) {
      return (new XMLSerializer).serializeToString(d);
    },
    decode: function(d) {
      return $(d || "");
    }
  };

  lib.download_has_error = function download_has_error(dl_transaction) {
    return dl_transaction.error && dl_transaction.error.code < 0;
  }
  lib.get_error_from_download = function get_error_from_download(dl_transaction) {
    if (!download_has_error(dl_transaction)) return null;

    switch (dl_transaction.error.code) {
      case -100://Indicates the Library could not connect to the Internet to complete a transaction.
      case -110://Indicates the Library could not connect to the particular server needed to complete a transaction.
      case -150://Indicates the provided credentials were not recognized by the entitlement server.
      case -200://Indicates folio and subscription purchasing is disabled on this device.
      case -210://Indicates a single folio purchase transaction failed because an error occurred communicating with the in-app purchase system.
      case -220://Indicates a subscription purchase transaction failed because an error occurred communicating with the in-app purchase system.
      case -225://Indicates there was an error attempting to resolve the valid date ranges for a subscription.
      case -250://Indicates a restore purchases transaction failed because an error occurred communicating with the in-app purchase system.
      case -300://Indicates the user attempted to purchase or download a folio when the publisher's download quota has been exceeded.
      case -400://Indicates the user attempted to purchase or download a folio that is incompatible with the current Viewer.
      case -510://Indicates there was an error downloading the folio that was not network related.
      case -520://Indicates the folio being downloaded was either corrupted or became unavailable
        return {"type": "generic", "msg": dl_transaction.error.code.toString()}
        break;
      case -530://Indicates there was an error during the the installation of the folio
      case -540://Indicates the preview download failed because there was no preview of the folio available
      case -900://Indicates a transaction failed because of an error that occurred in the LibraryAPI
        // Do not cancel download & do not show error dialog
        break;
      case -500://Indicates the user attempted to download a folio that was larger than the space available on the device.
        return {"type": "out of space", "msg": dl_transaction.error.code.toString()}
        break;
      default:
        break;
    }
    return null;
  }



  /////////////////////////////////////////////////////////////////////////// 
  // Banner View Count
  ///////////////////////////////////////////////////////////////////////////
  var view_count = parseInt(localStorage.bannerViewCount || 0, 10);
  view_count += 1;
  lib.view_count = view_count;
  localStorage.bannerViewCount = view_count;



  /////////////////////////////////////////////////////////////////////////// 
  // iOS Version Matching
  ///////////////////////////////////////////////////////////////////////////
  if (/iP(hone|od|ad)/.test(navigator.platform)) {
    // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    lib.ios_version = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
  }
  else {
    // for testing use 7.0.4
    lib.ios_version = [7, 0, 1];
  }
  
  lib.ios_version.toString = function() { return this.join("."); }

  lib.is_version = function is_version(type, version_expr) {
    /* version_expr looks like:
    *     "7"  same as "=7"
    *     "=7" major version must be 7
    *     "=7.0" major version must be 7, minor must be 0
    *     "<7" major version must less than 7
    *     "<=6" major version must be less than or equal to 6
    *     "!7" major version must be anyhting other than 7
    *     "!7.0.4" full version must be anything other than 7.0.4
    *
    *  Note: a blank version_expr will always return true.
    */

    if (!type) return true;
    if (!version_expr) return true;
    if (!lib.ios_version && !lib.app_version) {
      return true;
    } else {
      lib.version = (type == "os") ? lib.ios_version : lib.app_version;
    }
    
   

    // version looks like [7, 0, 4];
    var version = version_expr.replace(/^[<>=!]*/g, "").split(".").map(function(i) {
          return parseInt(i, 10);
        });

    function eq() {
      for (var i = 0; i < version.length; i++) {
        if (lib.version[i] != version[i]) return false;
      }
      return true;
    }
    function lt() {
      for (var i = 0; i < version.length; i++) {
        if (lib.version[i] > version[i]) return false;
        if (lib.version[i] < version[i]) return true;
      }
      return false;
    }
    function gt() {
      for (var i = 0; i < version.length; i++) {
        if (lib.version[i] < version[i]) return false;
        if (lib.version[i] > version[i]) return true;
      }
      return false;
    }

    if (version_expr.slice(0, 2) == "<=") {
      return lt() || eq();
    }
    else if (version_expr.slice(0, 2) == ">=") {
      return gt() || eq();
    }
    else if (version_expr.slice(0, 1) == "<") {
      return lt();
    }
    else if (version_expr.slice(0, 1) == ">") {
      return gt();
    }
    else if (version_expr.slice(0, 1) == "!") {
      return !eq();
    }
    else {
      return eq();
    }
  }
  


  /////////////////////////////////////////////////////////////////////////// 
  // API Support
  ///////////////////////////////////////////////////////////////////////////

  lib.api = (typeof adobeDPS != "undefined") ? adobeDPS : window.MockAPI;

  function wait_for_api(method_name, fn) {
    if (!lib.api) return;

    // end result:  lib[method_name] = fn
    //
    // If the method is called before the API is ready it will set a 
    // timeout and try again.
    //
    lib[method_name] = function() {
      var that = this,
          args = arguments;
      setTimeout(function() {
        lib[method_name].apply(that, args);
      }, 500);
    };
    lib.api.initializationComplete.addOnce(function() {
      lib[method_name] = fn;
    });
  }
  
  wait_for_api("api_ready", function(cb) {
    cb();
  });
  

  function get_current_folio_transaction(folio, trans_type) {
    var t = folio.currentTransactions.filter(function(t) {
      return (
               t.jsonClassName == trans_type
            && t.state >= 0
            && t.state < 400
      )
    }).sort(function(x, y) {
      return (x.state > y.state) ? -1 : 1;
    })[0];

    if (!t || t == -Infinity) return null;
    return t;
  }
  function download_folio(folio) {
    var t = get_current_folio_transaction(folio, "DownloadTransaction");
    if (!t) {
      t = folio.download();
    }
    if (t.state == 100) { // paused
      t.resume();
    }
    return t;
  }
  
  wait_for_api("restore_purchases", function() {
    lib.api.receiptService.restorePurchases();
  });
  
  wait_for_api("go_to_tab", function(tabName) {
    lib.api.configurationService.gotoState(tabName);
  });
  
  wait_for_api("login", function(user, pass) {
    return lib.api.authenticationService.login(user, pass);
  });
  
  wait_for_api("logout", function(tabName) {
    lib.api.authenticationService.logout();
  });
  
  wait_for_api("buy_issue", function(product_id, dossier_id, opts) {
    if (!opts && (typeof dossier_id) == "object") {
      opts = dossier_id;
      dossier_id = "";
    }
    opts = opts || {};

    var folio = lib.api.libraryService.folioMap.getByProductId(product_id);
    
    var view_folio = once(function() {
      if (dossier_id) {
        var protocol = "dps." + settings.adobeAppId + "://";
        window.location.href = protocol + "v1/folio/" + product_id + "/" + dossier_id;
      }
      else {
        folio.view();
      }
    });

    folio.updatedSignal.add(function self() {
      if (!folio.isViewable) return;
      view_folio();
      folio.updatedSignal.remove(self);
    });

    function on_download_state_changed(dl_transaction) {
      if (lib.download_has_error(dl_transaction)) {
        (opts.error || $.noop)(dl_transaction);
      }
    }

    (function self() {
      if (folio.isViewable) {
        return view_folio();
      }

      var t = folio.currentStateChangingTransaction();
      if (t !== null) {
        var cb = self;

        if (!t.progressSignal.has(cb)) t.progressSignal.add(cb);
        if (!t.stateChangedSignal.has(cb)) t.stateChangedSignal.add(cb);

        // paused
        if (t.state === 100) t.resume();

        return;
      }
      
      if (folio.isPurchasable) {
        var purchase_trans = folio.purchase();
        purchase_trans.stateChangedSignal.add(function() {
          var states = lib.api.transactionManager.transactionStates;
          if (purchase_trans.state == states.CANCELED) {
            (opts.cancelled || $.noop)();
          }
        });
      }
      else if (folio.isDownloadable) {
        var download_trans = download_folio(folio);
        if (!download_trans.stateChangedSignal.has(on_download_state_changed)) {
          download_trans.stateChangedSignal.add(on_download_state_changed);
        }
      }
    })();
  });

  wait_for_api("buy_sub", function(product_id) {
    lib.api.receiptService.availableSubscriptions[product_id].purchase();
  });
  
  wait_for_api("lucie_register", function() {
    $.each(lib.api.receiptService.availableSubscriptions, function(productId, sub) {
      if (sub.isActive()) {
        lib.api.dialogService.displayCustomDialog();
      }
    });
  });
  
  wait_for_api("sign_in", function() {
    lib.api.authenticationService.displaySignIn();
  });

  // Simple wrapper around trackCustomEvent() to wait for the API
  wait_for_api("trackCustomEvent", function(events, vars) {
    // get the currently running AB tets if the AB testing
    // framework is loaded
    if (window.AB && window.AB.omnitureString) {
      vars.customVariable7 = window.AB.omnitureString();
    }
    lib.api.analyticsService.trackCustomEvent(events, vars);
  });

  lib.track_user_action = function(evt_name, page_name) {
    /* Example values:
    *    evt_name: "banner_taps_subscribe" (subscribe/buyissue/downloadfree/register)
    *    page_name: "Library|Banner|Subscriber" (Subscriber/Nonsubscriber)
    */
    lib.trackCustomEvent("customEvent3", {
      customVariable3: evt_name,
      customVariable4: page_name
    });
  };

  lib.track_page_view = function(page_name) {
    /* Example values:
    *    page_name: "Library|Banner|Subscriber" (Subscriber/Nonsubscriber/Allusers)
    */
    lib.trackCustomEvent("customEvent3", {
      customVariable3: "library_banner_pageview",
      customVariable4: page_name
    });
  };


  /*
   * Folio Sorting
   */
  var ts = new Date().getTime();
  
  var get_tcm_data = function(cb) {
    settings.tcmfeed_image_root = settings.prod_tcmfeed_image_root;
    $.getJSON(settings.PRODUCTION_TCM_FEED, {t: ts}).done(cb);
  }
  var get_dps_data = function(cb) {
    $.get(adobeFeedUrl, {t: ts}, cb, "xml");
  }

  get_tcm_data = cache_async("tcmdata", 15, get_tcm_data, cache_async.json_codec);
  get_dps_data = cache_async("dpsdata", 15, get_dps_data, cache_async.xml_codec);

  var dps_data_map = null;
  var get_dps_data_map = function(cb) {
    if (dps_data_map) return cb(dps_data_map);

    get_dps_data(function(data) {
      dps_data_map = {};

      $("issue", data).each(function(i, issue) {
        dps_data_map[$(issue).attr("productId")] = $(issue);
      });
      cb(dps_data_map);
    });
  }
  var tcm_data_map = null;
  var get_tcm_data_map = function(cb) {
    if (tcm_data_map) return cb(tcm_data_map);

    get_tcm_data(function(data) {
      tcm_data_map = {};
      
      data.issues.forEach(function(tcm_data) {
        tcm_data_map[tcm_data.id] = tcm_data;
      });
      cb(tcm_data_map);
    });
  }

  lib.get_dps_data_for_product_id = function(product_id, cb) {
    get_dps_data_map(function(data_map) {
      cb(data_map[product_id]);
    });
  }
  lib.get_tcm_data_for_product_id = function(product_id, cb) {
    get_tcm_data_map(function(data_map) {
      cb(data_map[product_id]);
    });
  }

  function ensure_folios_are_loaded(cb) {
    cb = once(cb);

    if (lib.api.libraryService.folioMap.sort().length === 0) {
      var t = lib.api.libraryService.currentTransaction;
      
      if (!t || t.jsonClassName != "LibraryUpdateTransaction") {
        t = lib.api.libraryService.updateLibrary();
      }
      t.completedSignal.add(cb);
    }
    else cb();
  }
  
  

  lib.get_sorted_issues = function(fn) {
    var counter = 0;
    function done() {
      counter++;
      if (counter < 2) return;

      // do sorting
      get_dps_data_map(function(dps_map) {
        get_tcm_data_map(function(tcm_map) {

          function get_pubdate(folio_id) { 
            var pubdate_text = $("publicationDate", dps_map[folio_id]).text();
            return new Date(pubdate_text);
          }
          function priority(folio_id) {
            var p;
            try { p = tcm_map[folio_id].sort_priority; }
            catch (e) { p = 0; }
            if (folio_id === latest_folio_id && p === 0) return 100;
            return p;
          }
          function cmp(x, y) {
            if (x == y) return 0;
            else return x > y ? 1 : -1;
          }

          var folio_ids = Object.keys(dps_map);

          // Remove preview issues
          folio_ids = folio_ids.filter(function(folio_id) {
            return _.values(settings.preview_issue_product_ids).indexOf(folio_id) < 0
          });
          
          // find latest folio (don't need the hack we use on iPad to demote 
          //   preview issue since it's removed from this list)
          var latest_folio_id = _(folio_ids).max(function(folio_id) {
            return get_pubdate(folio_id);
          });

          folio_ids.sort(function(a, b) {
            var priority_comp = cmp(priority(b), priority(a));
            if (priority_comp === 0) {
              return cmp(get_pubdate(b), get_pubdate(a));
            }
            else return 2*priority_comp;
          });

          var folios = folio_ids.map(function(k) { return dps_map[k] });

          fn(folios);
        })
      });
    }

    get_tcm_data(once(done));
    get_dps_data(once(done));
  }



  lib.filter_issues = function(issues, filter) {
    return issues.filter(function($issue) {
      return $issue.find("filter").text() == filter
    })
  }



  lib.get_cover_url_for_issue = function(issue) {
    return $("libraryPreviewUrl", issue).text() + "/portrait/";
  }


  wait_for_api("get_folio_by_product_id", function(product_id, cb) {
    cb(lib.api.libraryService.folioMap.getByProductId(product_id));
  });


  /*
  *  AUTO DOWNLOAD
  */
  function auto_download__do_download(folio, opts) {
    function check_viewable() {
      if (folio.isViewable) opts.viewable(folio);
    }

    folio.updatedSignal.add(check_viewable);

    if (folio.isDownloadable) {
      opts._downloading = true;
      var t = folio.download();
      t.progressSignal.add(function() {
        check_viewable();
        opts.progress(folio, t.progress);
      });
      t.stateChangedSignal.add(function() {
        check_viewable();

        if (t.state < 0) {
          opts.failure(); // error
          t.stateChangedSignal.removeAll();
          t.progressSignal.removeAll();
        }
        else if (t.state == 100) t.resume(); // paused
        else opts.progress(folio, t.progress);
      });
    }
    else if (folio.isViewable) {
      check_viewable();
    }
    else {
      opts.failure();
    }
  }

  function auto_download__show_ui(folio, opts) {
    var $ui = $([
          '<div class="autodownload-container">',
            '<img src="" class="ad-cover">',
            '<h1 class="ad-heading"></h1>',
            '<p class="ad-body"></p>',
            '<button class="ad-start-downloading-btn"></button>',
            '<button class="ad-start-reading-btn"></button>',
          '</div>'
        ].join('\n')),

        $cover = $(".ad-cover", $ui),
        $heading = $(".ad-heading", $ui),
        $body = $(".ad-body", $ui),
        $download_btn = $(".ad-start-downloading-btn", $ui),
        $read_btn = $(".ad-start-reading-btn", $ui),

        orig_viewable = opts.viewable;

    // SET UI STYLES //////////
    $ui.css({
      background: 'rgba(255,255,255,0.93)',
      position: 'fixed',
      top: 0, right: 0, bottom: 0, left: 0,
      'font-family': 'Helvetica Neue',
    });
    $cover.css({
      width: 52,
      margin: "18px 16px 0px",
      'float': 'left'
    });
    $heading.css({
      'font-weight': 'bold',
      'font-size': '20px',
      'color': '#000000',
      'margin': '15px 0 0 85px',
      'line-height': '1.3em'
    });
    $body.css({
      'font-weight': 'normal',
      'font-size': '12px',
      'color': '#4A4A4A',
      'margin': '6px 0 8px 85px',
      'line-height': '1.3em'
    });
    $("button", $ui).css({
      display: 'block',
      background: 'rgba(255,255,255, 0.0)',
      border: '1px solid #29AEDC',
      color: '#29AEDC',
      'font-weight': 'normal',
      'font-size': '12px',
      'margin': '0 0 0 101px',
      'padding': "0px 40px",
      'height': '25px',
      'border-radius': '3px'
    }).hide();

    // SET UI TEXT //////////
    $cover.attr("src", lib.cover_img_for(folio));
    $download_btn.text(settings.bannerAD_download_button);
    $read_btn.text(settings.bannerAD_read_button);

    if (opts._downloading) {
      $heading.text(settings.bannerAD_header_downloading);
      $body.text(settings.bannerAD_body_downloading);
    }
    else {
      $download_btn.show()
      $heading.text(settings.bannerAD_header_nowifi);
      $body.text(settings.bannerAD_body_nowifi);
    }

    // BIND TO APPROPRIATE EVENTS FOR UPDATING THE UI //////////
    opts.viewable = function on_viewable() {
      orig_viewable.apply(this, arguments);

      $heading.text(settings.bannerAD_header_ready);
      $body.text(settings.bannerAD_body_ready);
      $read_btn.show();
    }

    $download_btn.click(function() {
      $download_btn.hide();
      $heading.text(settings.bannerAD_header_downloading);
      $body.text(settings.bannerAD_body_downloading);
      auto_download__do_download(folio, opts);
    });

    $read_btn.click(function() {
      folio.view();
    });

    $ui.appendTo("body");
  }

  var auto_download_defaults = {
    // called when download progress events occur. use for progress bars, etc
    progress: $.noop,

    // called on any error that bubbles up from the adobe api or if the folio
    // is non-free and therefore can't be auto-downloaded
    failure: $.noop,

    // called if the auto_download function is skipped for any reason
    skipped: $.noop,

    // called after the auto_download has started (the opposite of skipped)
    started: $.noop,

    // called once when the folio becomes viewable - this is the right place
    // to call folio.view() if you are going to do that.
    viewable: $.noop
  };
  wait_for_api("auto_download", function(product_id, opts) {
    opts = $.extend({}, auto_download_defaults, opts || {});

    // only run on first banner load
    if (lib.view_count > 1) return opts.skipped();

    var on_wifi = lib.api.deviceService.networkType == lib.api.deviceService.networkTypes.WIFI,
        folio = lib.api.libraryService.folioMap.getByProductId(product_id);

    // only allow these functions to be called one time
    opts.viewable = once(opts.viewable);
    
    // can't auto-download a folio that isn't free
    if (!folio.isFree()) return opts.failure();

    if (on_wifi) {
      auto_download__do_download(folio, opts);
    }
    auto_download__show_ui(folio, opts);

    opts.started();
  });

  wait_for_api("get_subscription_status", function(cb) {
    // APPLE SUBSCRIBERS
    var st = {
      is_sub: false,
      sub_type: null,
      single_issue_owner: false
    };

    $.each(lib.api.receiptService.receipts, function(i, receipt) {
      if (!receipt.isSubscription) {
        st.single_issue_owner = true;
      }
    });
    $.each(lib.api.receiptService.availableSubscriptions, function(i, receipt) {
      if (receipt.isActive()) {
        st.is_sub = true;
        st.sub_type = "itunes";
      }
    });

    // short circuit for subscribers
    if (st.is_sub) {
      return cb(st);
    }

    // LUCIE SUBSCRIBERS
    if (!lib.api.authenticationService.isUserAuthenticated) {
      cb(st);
    }

    window.lucieApi._default_api_args.authToken = lib.api.authenticationService.token;
    window.lucieApi.entitlements(function(data) {
      if ($("subscriberIsActive", data).text() == "Y") {
        st.is_sub = true;
        st.sub_type = "lucie";
      }
      cb(st);
    });
  });


  ///////////////////////////////////////////////////////////////////////////
  // eMagazines
  ///////////////////////////////////////////////////////////////////////////
  lib.emags_enabled = !!(settings.eMagsAppId && window.EMStart);

  if (lib.emags_enabled && typeof adobeDPS != "undefined") {
    window.__eMagsInitHandlerWrapper = function() {
      EMStart();
      EMGetCurrentCampaignID(function(campaign_id) { // Campaign ID Found
        lib.trackCustomEvent("customEvent5", {
          customVariable5: campaign_id
        });
      });
      
      lib.api_ready(function() {
        function emags_receipt_logged(product_id, is_logged) {
          var receipt_key = "eMagsReceiptLoggedFor:" + product_id;

          if (is_logged !== undefined) {
            localStorage[receipt_key] = !!is_logged;
          }

          return localStorage[receipt_key] == "true";
        }

        lib.api.receiptService.newReceiptsAvailableSignal.add(function(receipts) {
          var receipt, evt_type, product_id, price, sub, folio;

          for (var i=receipts.length; i--;) {
            receipt = receipts[i];
            product_id = receipt.productId;

            if (emags_receipt_logged(product_id)) continue;

            if (receipt.isSubscription) {
              sub = lib.api.receiptService.availableSubscriptions[product_id];
              price = sub.price;
              evt_type = (sub.duration.toLowerCase() == "1 month") ? "MonthlySubscription" : "AnnualSubscription";
            }
            else {
              folio = lib.api.libraryService.get_by_productId(product_id);
              price = folio.price;
              evt_type = "SingleCopySale";
            }
            
            // remove dollar signs and other currecy symbols
            price = price.replace(/[^\d\.]/gi, "");

            EMPurchase(evt_type, product_id, price);
            emags_receipt_logged(product_id, true);
            EMForceFlush();
          }
        });
      });
    }
  }



  ///////////////////////////////////////////////////////////////////////////
  // ECHO (Push notifications)
  ///////////////////////////////////////////////////////////////////////////
  wait_for_api("echo", function() {
    var that = this,
        d_authenticated = lib.api.authenticationService.isUserAuthenticated,
        d_omni_visitor_id = lib.api.deviceService.omnitureVisitorId.toString().replace(/-/g,""),
        d_push_token = lib.api.deviceService.pushNotificationToken.toString(),
        d_email,
        data;
    
    that.postMade = false;
    that.echo_url = settings.echo_stage;
      
    if (settings.echoENV == "prod") {
      that.echo_url = settings.echo_prod;
    }
    console.log(that.echo_url);
      
    if (d_authenticated) { /* User logged in : Get email address from API */
      d_email = lib.api.authenticationService.userName;
      
      if (d_email && (!localStorage.echoEmail || localStorage.echoEmail != d_email)) {
        /* Email address is different then last time
         * or this is the first visit, echo record should be updated */
        localStorage.echoEmail = d_email;
        that.postMade = false;
      }
    } else { /* User not logged in : Get email address from localStorage (if available) */
      if (localStorage.echoEmail) {
        d_email = localStorage.echoEmail;
      }
    }
      
      
    /* Continue if connected */
    if (d_push_token && d_omni_visitor_id && !that.postMade) {
      data = {
          "device[token]"                     : d_push_token,
          "device[email]"                     : d_email,
          "device[bundle]"                    : settings.echo_bundle_id,
          "device[device_authenticity_token]" : settings.echo_token,
          "device[omniture_id]"               : d_omni_visitor_id,
          "device[apps_channel_id]"           : settings.echo_channel_id
      };
      
      console.log("data",data);
      
      $.ajax({
        type: 'POST',
        url: that.echo_url,
        crossDomain: true,
        data: data,
        success: function(responseData, textStatus, jqXHR) {
            that.postMade = true;
            console.log("ECHO - " + textStatus,responseData);
        },
        error: function (responseData, textStatus, errorThrown) {
            that.postMade = false;
            console.log("ECHO - " + textStatus,responseData);
        }
      });
    } else {
        return false;
    }
  });


  ///////////////////////////////////////////////////////////////////////////
  // Slider
  ///////////////////////////////////////////////////////////////////////////
  var SlideshowGallery = lib.SlideshowGallery = function() {
    /*
    *  To remove slides based on ios Version add a data-ios-version 
    *   attribute to the slide (div is "slide" class) which will be passed to
    *   lib.is_version().
    */
    // Before getting started, remove slides that don't match the current version of ios or latest app build
    var av = (lib.api.configurationService.applicationVersion).split(".");
    
    lib.app_version = [parseInt(av[0], 10), parseInt(av[1] || 0, 10), parseInt(av[2] || 0, 10)];
    lib.app_version.toString = function() { return this.join("."); };
    
    [].forEach.call(document.querySelectorAll(".slide"), function(elem) {
      elem.remove = false;
      
      if (!lib.is_version("os", elem.dataset.iosVersion)) {
        elem.remove = true;
      }

      if (elem.dataset.hideOnLatestBuild == "true" && lib.is_version("app", ">=" + settings.cfBundleVersion)) {
        elem.remove = true;
      }
      
      if (elem.remove) {
        elem.parentNode.removeChild(elem);
      } else {
        elem.style.display = "block";
      }
    });
        
    // data-loop-type="" | options: "infinite", "scrollback"
    this.loopType = document.querySelector(".carousel").dataset.loopType || "infinite";

    this.currentTranslation = 0;
    this.sliderWidth = document.querySelector('.carousel').offsetWidth;
    this.slidesObject = document.querySelectorAll('.slide');
    
    for (var i = 0; i < this.slidesObject.length; i++){
       this.slidesObject[i].style.width = this.sliderWidth + 'px';
       this.slidesObject[i].dataset.translation = 0;
    }
    
    this.slides = document.querySelector('.slides');
    this.numSlides = this.slides.children.length;
    this.slides.style.width = (this.sliderWidth * this.numSlides) + 'px';

    this.leftMostSlideIndex = 0;
    this.rightMostSlide = this.slides[this.numSlides - 1];
    this.allSlidesWidth = this.numSlides * this.sliderWidth;
    this._cycle_slides(0);
  };

  SlideshowGallery.prototype._resolve_slide_index = function(i) {
    i = i % this.numSlides;
    if (i < 0) i += this.numSlides;
    return i;
  }

  SlideshowGallery.prototype._cycle_slides = function(direction) {
    if (this.loopType != "infinite") return;

    var i, slide;

    if (direction && direction > 0) {
      // going right
      if (this.currentTranslation <= this.maxTranslation) {
        i = this._resolve_slide_index(this.leftMostSlideIndex);
        slide = this.slidesObject[i];

        slide.dataset.translation = +slide.dataset.translation + this.allSlidesWidth;
        slide.style.webkitTransform = "translate3d(" + slide.dataset.translation + "px,0,0)";
        this.leftMostSlideIndex += 1;
      }
    }
    else if (direction && direction < 0) {
      // going left
      if (this.currentTranslation >= this.minTranslation) {
        i = this._resolve_slide_index(this.leftMostSlideIndex + this.numSlides - 1);
        slide = this.slidesObject[i];

        slide.dataset.translation = +slide.dataset.translation - this.allSlidesWidth;
        slide.style.webkitTransform = "translate3d(" + slide.dataset.translation + "px,0,0)";
        this.leftMostSlideIndex -= 1;
      }
    }

    this.minTranslation = this.leftMostSlideIndex * -this.sliderWidth;
    this.maxTranslation = (this.leftMostSlideIndex + this.numSlides - 1) * -this.sliderWidth;
  };

  SlideshowGallery.prototype.slideNext = function() {
    if (this.numSlides < 2) return this;

    this._cycle_slides(+1);
    this.currentTranslation -= this.sliderWidth;
    
    // Wrap around.
    if (this.loopType != "infinite") {
      if (this.currentTranslation == this.numSlides * -this.sliderWidth) {
        this.currentTranslation = 0;
      }
    }

    this.slides.style.webkitTransform =
      'translate3d(' + this.currentTranslation + 'px, 0 ,0)';
    return this;
  };

  SlideshowGallery.prototype.slidePrev = function() {
    if (this.numSlides < 2) return this;

    this._cycle_slides(-1);
    this.currentTranslation += this.sliderWidth;

    // Wrap around.
    if (this.loopType != "infinite") {
      if (this.currentTranslation == this.sliderWidth) {
        this.currentTranslation = (this.numSlides - 1) * -this.sliderWidth;
      }
    }
    
    this.slides.style.webkitTransform =
      'translate3d(' + this.currentTranslation + 'px, 0 ,0)';
    return this;
  };

  SlideshowGallery.prototype.slideEvery = function(ms) {
    var that = this;
    this.slide_every_delay = this.slide_every_delay || ms;
    this.slide_interval = window.setInterval(function(){
      that.slideNext();
    }, this.slide_every_delay);
    return this;
  };

  SlideshowGallery.prototype.cancelAutoSlide = function() {
    window.clearInterval(this.slide_interval);
    return this;
  }

  SlideshowGallery.prototype.enableTouch = function() {
    if (this.numSlides < 2) return this;

    var gallery = this,
        slides = this.slides,
        startX = 0,
        deltaX = 0,
        startTime = null,
        startTouchID = null;
    
    slides.addEventListener("touchstart", function(ev) {
      if (ev.changedTouches.length != 1) return;

      gallery.cancelAutoSlide();

      startTouchID = ev.changedTouches[0].identifier;
      startTime = +new Date();
      startX = ev.changedTouches[0].pageX;
      deltaX = 0;

      slides.style.webkitTransition = "0s all";
    });

    slides.addEventListener("touchmove", function(ev) {
      ev.preventDefault();

      var touch = null;
      for (var i=ev.changedTouches.length; i--;) {
        if (ev.changedTouches[i].identifier == startTouchID) {
          touch = ev.changedTouches[i];
        }
      }
      if (touch === null) return;

      deltaX = touch.pageX - startX;

      var minTranslation = -gallery.sliderWidth * (gallery.numSlides-1),
          newTranslation = gallery.currentTranslation + deltaX;

      gallery._cycle_slides(-deltaX);

      if (gallery.loopType != "infinite") {
        if (newTranslation < minTranslation) {
          newTranslation = minTranslation + ((newTranslation - minTranslation) * 0.4);
        }
        else if (newTranslation > 0) {
          newTranslation *= 0.4;
        }
      }

      slides.style.webkitTransform =
        'translate3d(' + newTranslation + 'px, 0 ,0)';
    });

    slides.addEventListener("touchend", function(ev) {
      var done = false;
      for (var i=ev.changedTouches.length; i--;) {
        if (ev.changedTouches[i].identifier == startTouchID) done = true;
      }

      if (!done) return;
      
      var duration = new Date() - startTime;
      if (duration < 500 && Math.abs(deltaX) > 80) {
        var direction = (deltaX > 0) ? 1 : -1;
        deltaX = gallery.sliderWidth * direction;
      }
      startTouchID = null;
      gallery.currentTranslation += deltaX;
      gallery.slideToNearest(function() {
        slides.style.webkitTransition = "1s all";
        gallery.cancelAutoSlide().slideEvery();
      });
    });
    return this;
  }

  SlideshowGallery.prototype.slideToNearest = function(cb) {
    this.slides.style.webkitTransition = "0.25s all";
    
    var nearest_slide = Math.round(-1 * this.currentTranslation / this.sliderWidth);
    if (this.loopType != "infinite") {
      nearest_slide = Math.max(Math.min(nearest_slide, this.slidesObject.length-1), 0);
    }

    this.currentTranslation = -1 * nearest_slide * this.sliderWidth;
    this.slides.style.webkitTransform =
      'translate3d(' + this.currentTranslation + 'px, 0 ,0)';

    // don't call the callback for 350ms extra to allow for any lag in the animation
    setTimeout(cb, 350);
  }

  return lib;

})();
