
// NOTE: to debug this inside a Webkit-based browser like Chrome, you have to start it in test mode
// with the --disable-web-security flag passed to the command-line version of the app. Otherwise
// we're going to get errors from the ajax calls.
//
var __getLocationData = false;
var __getMyIP = true;
var __latitude, __longitude, __accuracy;
var __jsonData = {};
var __jsonString = "";
var __fingerprintCallback = null;
var __myIPRequest = null;
var __myIPRequestCallback = null;
var __minFlushDelta = 30 * 1000;    // we flush no more than every X seconds

__ema = {}
__ema.cache = {}
__ema.cache.db = {}
__ema.cache.isInit = false;
__ema.cache.haveGeo = false;
__ema.cache.lat = 0;
__ema.cache.lng = 0;
__ema.cache.minFlushDelta = __minFlushDelta;    // we flush no more than every X seconds
__ema.cache.flushTimeout = 30;
__ema.cache.flushTimer = null;
__ema.cache.flushCallback = null;
__ema.cache.eventSuccessCallback = null;
__ema.cache.eventErrorCallback = null;
__ema.cache.flushMaxRec = 100;
__ema.appId = null;
__ema.token = null;
__ema.initialized = false;
__ema.initHandler = null;


__ema.cache.open = function () {
    __ema.cache.db = openDatabase("emacache","1.0","emajs", 20 *1024*1024);
    var database = __ema.cache.db;
    database.transaction(function(d){
        d.executeSql("CREATE TABLE IF NOT EXISTS metadata (dbschemaversion INTEGER PRIMARY KEY, " +
            "highesteventid INTEGER, lastuploadid INTEGER, lastuploadtime INTEGER, appkey CHAR(64), " +
            "token CHAR(64))", []);

        d.executeSql("CREATE TABLE IF NOT EXISTS events (eventid INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "emid CHAR(64) UNIQUE, payload TEXT NOT NULL)", []);

        d.executeSql("INSERT INTO metadata (dbschemaversion, highesteventid, lastuploadid, " +
            "lastuploadtime) VALUES (1, 0, 0, 0.0)", []);
    });
}

function errorCallback() {
    alert("Error creating table");
    return true;
}

__ema.cache.setToken = function (token) {
    var database = __ema.cache.db;
    database.transaction(function(d){
        d.executeSql("UPDATE metadata SET token = ?", [token]);
    });
}

__ema.cache.setAppId = function (appid) {
    var database = __ema.cache.db;
    database.transaction(function(d){
        d.executeSql("UPDATE metadata SET appkey = ?", [appid]);
    });
}
__ema.cache.internalAddEvent = function (action, eventname, data) {
    var localData = {};
    var objtype = Object.prototype.toString.call(data);
    if (objtype == '[object Object]') {
        $.extend(localData, data)
    }
    if (action)
        localData["_ac"] = action;
    if (eventname)
        localData["_en"] = eventname;

    var now = new Date();
    localData["_dt"] = now.toLocaleString();
    localData["_ut"]  =__formatISODate(now);

    var database = __ema.cache.db;
    if (__ema.cache.haveGeo) {
        localData["_la"] = __ema.cache.lat;
        localData["_lo"] = __ema.cache.lng;
    }
    database.transaction(function(d){
        var jsondata = JSON.stringify(localData);
        var emid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });

        d.executeSql("INSERT INTO events (emid, payload) VALUES (?, ?);",
            [emid, jsondata],
            function(d, result){
                d.executeSql("UPDATE metadata SET highesteventid = (SELECT eventid FROM events WHERE rowid = ?)",
                    [result.insertId],
                function(d, result) {
                    if (__ema.cache.eventSuccessCallback) {
                        __ema.cache.eventSuccessCallback(action, eventname, emid);
                    }
                },
                function(d, error) {
                    if (__ema.cache.eventErrorCallback) {
                        __ema.cache.eventErrorCallback(action, eventname, error);
                    }
                })
            },
            function(d, error) {
                if (__ema.cache.eventErrorCallback) {
                    __ema.cache.eventErrorCallback(action, eventname, error);
                }
            }
        );
    });
}

__ema.cache.purgeOne = function (emid) {
    var database = __ema.cache.db;
    database.transaction(function(d){
        d.executeSql("DELETE from events WHERE emid = ?", [emid]);
    });
}

__ema.cache.purgeUploaded = function (data, errcallback, successcallback) {
    var database = __ema.cache.db;
    var status = data["status"];
    if (status == "ok") {
        var emids = data["emids"];
        database.transaction(function(d){
            for (var key in emids) {
                var emid = emids[key];
                d.executeSql("DELETE from events WHERE emid = ?", [emid]);
            }
        },
            function() {
                if (errcallback) {
                    errcallback();
                }
            },
            function() {
                if (successcallback) {
                    successcallback();
                }
            }
        );
    }
}

// We reset the cache. In this version, we reset the appid and token as well. In the native version
// we keep the appid and token so they can't be redone.
//
__ema.cache.resetData = function () {
    var database = __ema.cache.db;
    database.transaction(function(d){
        d.executeSql("DELETE from events");
        d.executeSql("UPDATE metadata SET highesteventid = 0, lastuploadid = 0, lastuploadtime = 0, appkey = NULL, token = NULL");
    });
}

__ema.cache.setUploadTime = function (callback) {
    var database = __ema.cache.db;
    var now = new Date();
    var millinow = Math.floor(now.getTime());
    database.transaction(function(d){
        d.executeSql("UPDATE metadata SET lastuploadtime = ?", [millinow]);
    },
        null,
        function() {        // transaction success callback
            if (callback) {
                callback();
            }
        }
    );
}

__ema.cache.getUploadDelta = function (callback) {
    var database = __ema.cache.db;
    var delta = 0;
    database.transaction(function(d){
        d.executeSql("SELECT lastuploadtime from metadata where rowid=1", [],
            function(d, r) {
                var lastuploadtime = r.rows.item(0).lastuploadtime;
                if (lastuploadtime > 0) {
                    var now = new Date();
                    var millinow = now.getTime();
                    delta = millinow - lastuploadtime;
                }
            })
    }, null,
        function() {    // transaction success callback
            if (callback) {
                callback(delta);
            }
        }
    );
}

__ema.cache.eventCount = function () {
    var database = __ema.cache.db;
    var count = 0;
    database.transaction(function(d){
         d.executeSql("SELECT COUNT(*) as c FROM events", [],
             function(d, r) {
                count = r.rows.item(0).c;
                alert("Row:" + count);
                //$('#count').textContent = count;
                 return count;
             }
         );
    });
}

__ema.cache.startFlushtimer = function () {
    if (__ema.cache.flushTimeout > 1) {
        if (__ema.cache.flushTimer) {
            clearInterval(__ema.cache.flushTimer);
            __ema.cache.flushTimer = null;
        }
        __ema.cache.flushTimer = setInterval('__ema.cache.performFlush()', __ema.cache.flushTimeout * 1000);

    }
}

__ema.cache.performFlush = function () {
    __ema.cache.flushNow(__ema.cache.flushMaxRec, function(result) {
        if (__ema.cache.flushCallback) {
            __ema.cache.flushCallback(result);
        }
    });
}

__ema.cache.setFlushTimeout = function (secs) {
    if (secs > 0) {
        if (__ema.cache.flushTimer) {
            clearInterval(__ema.cache.flushTimer);
        }
        __ema.cache.flushTimeout = secs;
        __ema.cache.startFlushtimer();
    } else {
        if (__ema.cache.flushTimer)
            clearInterval(__ema.cache.flushTimer);
    }
}

__ema.cache.setFlushCallback = function (callback) {
       __ema.cache.flushCallback = callback;
}

__ema.cache.setEventQueueCallback = function (onSuccess, onError) {
    if (onSuccess) {
       __ema.cache.eventSuccessCallback = onSuccess;
    }
    if (onError) {
        __ema.cache.eventErrorCallback = onError;
    }
}


// We asynchronously get the appid and token (which may not be cached), then we send the request
// to the server, wait for the resulting emids and then we purge the database with the event records.
// NOTE: we need to see if this whole things can be done in a worker thread.
//
__ema.cache.flushNow = function (maxrec, successcallback, nothingtodocallback) {
    var appId = null;
    var token = null;
    var didflush = false;
    var flushCallback = successcallback ? successcallback : __ema.cache.flushCallback;

    __ema.cache.getAppId(function (a) {
        appId = a;
        __ema.cache.getToken(function (t) {
            token = t;
            var database = __ema.cache.db;
            var count = 0;
            var delta = 0;
            __ema.cache.getUploadDelta(function (delta) {
                database.transaction(function (d) {
                        d.executeSql("SELECT COUNT(*) as c FROM events", [],
                            function (d, r) {
                                count = r.rows.item(0).c;
                                if (count > maxrec) {
                                    count = maxrec;
                                }
                                if (count > 0) { // we see if there's something to send then we check if we've flushed already
                                    if ((delta >= __ema.cache.minFlushDelta) || (delta == 0)) {
                                        d.executeSql("SELECT emid, payload FROM events order by rowid LIMIT ?", [count],
                                            function (d, r) {
                                                var payload = {};
                                                payload["app_id"] = __ema.appId;
                                                payload["user_token"] = __ema.token;
                                                payload["data"] = [];
                                                var outlist = payload["data"];
                                                for (var i = 0; i < r.rows.length; i++) {
                                                    var one = r.rows.item(i);
                                                    var oneData = {};
                                                    var payloadData = JSON.parse(one.payload);
                                                    oneData['data'] = payloadData;
                                                    oneData['emid'] = one.emid;
                                                    outlist.push(oneData);
                                                }
                                                var payloadJson = JSON.stringify(payload);
                                                $.ajax({
                                                    type: "POST",
                                                    cache: false,
                                                    data: payloadJson,
                                                    contentType: "application/json",
                                                    url: "https://api.emagazines.com/api/insight/upload",
                                                    dataType: "json",
                                                    success: function(data) {
                                                        if (flushCallback) {
                                                          var p = JSON.stringify(payload, undefined, 4);
                                                          flushCallback(p);
                                                        }
                                                        // This is the data returned from the server. It's a status
                                                        // plus a list of emids successfully stored. We run through the
                                                        // server and delete each of those.
                                                        //
                                                        __ema.cache.purgeUploaded(data,
                                                            function() {
                                                                // error handler for purge -- do nothing
                                                            },
                                                            function () {
                                                                didflush = true;
                                                                __ema.cache.setUploadTime();
                                                                if (flushCallback) {
                                                                    var s = JSON.stringify(data, undefined, 4)
                                                                    flushCallback(s);
                                                                }
                                                        });
                                                    }
                                                });
                                            });
                                    }
                                } else {
                                    if (nothingtodocallback)
                                        nothingtodocallback();
                                }
                            });
                    }, null,
                    function () {
                       // if (didflush) {
                       //     __ema.cache.setUploadTime();
                       // }
                    });
                 });
            });
        });
}

// Three level cache. If no token, we generate request and get a token from server then save it in memory
// and in local DB. If found in DB we save it in local memory and return it. If found in memory, we don't
// bother hitting DB and just return it. So accessing it gets progressively faster.

__ema.cache.getToken = function (callback) {
    if (__ema.token != null) {
        if (typeof(callback) === 'function')
            callback(__ema.token);
    } else {
        var result = null;
        var database = __ema.cache.db;
        database.readTransaction(function(d) {
            d.executeSql("SELECT token from metadata where rowid=1", [],
                function(d, r) {
                    result = r.rows.item(0).token;
                    __ema.token = result;
                    if (__ema.token != null) {
                        if (typeof(callback) === 'function')
                            callback(__ema.token);
                    } else {
                        __getTokenFromServer(function(token) {
                            __ema.token = token;
                            if (token != null)
                                __ema.cache.setToken(token);
                            if (typeof(callback) === 'function')
                                callback(__ema.token);
                        });
                    }
                });
        });
    }
}

__ema.cache.getAppId = function(callback) {
    if (__ema.appId) {
        if (typeof(callback) === 'function')
            callback(__ema.appId);
    } else {
        var result = null;
        var database = __ema.cache.db;
        database.readTransaction(function(d) {
            d.executeSql("SELECT appkey from metadata where rowid=1", [],
                function(d, r) {
                    result = r.rows.item(0).appkey;
                    __ema.appId = result;
                    if (typeof(callback) === 'function')
                        callback(result);
                });
        });
    }
}

__ema.cache.getPayload = function (maxrecord) {
    var database = __ema.cache.db;

}

__ema.cache.init = function () {
    if (!__ema.cache.isInit) {
        if(typeof(openDatabase) !== 'undefined') {
            __ema.cache.open();
        }
        __ema.cache.isInit = true;
    }
}

__ema.cache.setLocation = function (lat, lng) {
    __ema.cache.lat = lat;
    __ema.cache.lng = lng;
    __ema.cache.haveGeo = true;
}


// Fingerprint functions. We use globals so async callbacks can load and
// display the same data
//
function __generateFingerprintOutput ()
{
    if (__fingerprintCallback)
        __fingerprintCallback(__jsonData);
}

function __getTokenFromServer (callback)
{
    __makeFingerprint(function (payload) {
        var tokenData;
        var token = null;
        var jsonstr = null;

        var payloadJson = JSON.stringify(payload);
        tokenData = $.ajax({
            type: "POST",
            cache: false,
            data: payloadJson,
            contentType: "application/json",
            url: "https://api.emagazines.com/api/insight/start",
            dataType: "json",
            success: function (data) {
                var status = data['status'];
                token = data['token'];
                if (status == "ok") {
                    if (callback) {
                        callback(token);
                    }
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                var err = xhr.responseText;
                console.log("Error POST to server to get token. " + textStatus + ": " + err);
            }
        });
   });
}

function __hasgeolocation () {
    return 'geolocation' in navigator;
}

function __getLocationSuccess (location) {
    __latitude = location.coords.latitude;
    __longitude = location.coords.longitude;
    __accuracy = location.coords.accuracy;
    __jsonOutput["latitude"] = __latitude;
    __jsonOutput["longitude"] = __longitude;
    __jsonOutput["locationAccuracy"] = __accuracy;

    __generateFingerprintOutput();
}

// Some browsers support geolocation but only when connected a certain way.
// In those cases we just go ahead and generate our output.
//
function __getLocationFailure () {
    __generateFingerprintOutput();
}

// This only works if cross-site checking is disabled.
//
function __loadMyIP (callback) {
    $.getJSON("http://emagazines.com/EmagsAPI/getip.asp", function(data) {
        __jsonData["ip_address"] = data["ip"];
    }).complete(function() {
        if (callback)
            callback();
        });
}

function __formatISODate (d) {
    function __pad(n){ return n < 10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
        + __pad(d.getUTCMonth()+1)+'-'
        + __pad(d.getUTCDate())+'T'
        + __pad(d.getUTCHours())+':'
        + __pad(d.getUTCMinutes())+':'
        + __pad(d.getUTCSeconds())+'Z'
}

function __makeFingerprint (callback) {
    __fingerprintCallback = callback;
    __jsonData = {};
    __jsonString = "";

    // If we need the local IP we call that and ask it to continue there.
    //
    if (__getMyIP)
        __loadMyIP(__makeFingerprintStep2);
    else
        __makeFingerprintStep2();
}

function __makeFingerprintStep2 () {
    var supportgeolocation = __hasgeolocation();
    var navVer = navigator.appVersion;
    var navAgent = navigator.userAgent;
    var browserName  = navigator.appName;
    var fullVersion  = ''+parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion,10);
    var nameOffset;
    var versionOffset;
    var versionIndex;

// Per-browser version numbering
//
    if ((versionOffset=navAgent.indexOf("Opera"))!=-1) {
        browserName = "Opera";
        fullVersion = navAgent.substring(versionOffset+6);
        if ((versionOffset=navAgent.indexOf("Version"))!=-1)
            fullVersion = navAgent.substring(versionOffset+8);
    } else if ((versionOffset=navAgent.indexOf("MSIE"))!=-1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = navAgent.substring(versionOffset+5);
    } else if ((versionOffset=navAgent.indexOf("Chrome"))!=-1) {
        browserName = "Chrome";
        fullVersion = navAgent.substring(versionOffset+7);
    } else if ((versionOffset=navAgent.indexOf("Safari"))!=-1) {
        browserName = "Safari";
        fullVersion = navAgent.substring(versionOffset+7);
        if ((versionOffset=navAgent.indexOf("Version"))!=-1)
            fullVersion = navAgent.substring(versionOffset+8);
    } else if ((versionOffset=navAgent.indexOf("Firefox"))!=-1) {
        browserName = "Firefox";
        fullVersion = navAgent.substring(versionOffset+8);
    } else if ( (nameOffset=navAgent.lastIndexOf(' ')+1) <
        (versionOffset=navAgent.lastIndexOf('/')) ) {
        browserName = navAgent.substring(nameOffset,versionOffset);
        fullVersion = navAgent.substring(versionOffset+1);
        if (browserName.toLowerCase()==browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }

// trim the fullVersion string at semicolon/space if present
    if ((versionIndex = fullVersion.indexOf(";"))!=-1)
        fullVersion = fullVersion.substring(0, versionIndex);
    if ((versionIndex = fullVersion.indexOf(" "))!=-1)
        fullVersion=fullVersion.substring(0, versionIndex);

    majorVersion = parseInt(''+fullVersion,10);
    if (isNaN(majorVersion)) {
        fullVersion  = ''+parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion,10);
    }

    var webkitversion = 0;
    var webkitregexp = /Safari\/([\d.]+)/;
    var webkitresult = webkitregexp.exec(navigator.userAgent);

    if(webkitresult) {
        webkitversion = parseFloat(webkitresult[1]);
    }

// Tablet/Phone sniffing code based on https://github.com/codejoust/session.js
//
    var is_tablet = !!navigator.userAgent.match(/(iPad|SCH-I800|xoom|kindle)/i);
    var is_phone = !is_tablet && !!navigator.userAgent.match(/(iPhone|iPod|blackberry|android 0.5|htc|lg|midp|mmp|mobile|nokia|opera mini|palm|pocket|psp|sgh|smartphone|symbian|treo mini|Playstation Portable|SonyEricsson|Samsung|MobileExplorer|PalmSource|Benq|Windows Phone|Windows Mobile|IEMobile|Windows CE|Nintendo Wii)/i);
    var is_mobile = is_tablet || is_phone;

    var d1 = new Date(), d2 = new Date();
    d1.setMonth(0); d1.setDate(1); d2.setMonth(6); d2.setDate(1);
    var tzoffset = -(new Date().getTimezoneOffset()) / 60;
    var observesdst = (d1.getTimezoneOffset() !== d2.getTimezoneOffset());
    var now = new Date();

    $.extend(__jsonData, {
        app_id: __ema.appId,
        versionString: navigator.appVersion,
        browserName: browserName,
        platform: navigator.platform,
        isTablet: is_tablet,
        isPhone: is_phone,
        isMobile: is_mobile,
        vendor: navigator.vendor,
        fullVersion: fullVersion,
        majorVersion: majorVersion,
        webkitVersion: webkitversion,
        browserCodename: navigator.appCodeName,
        genericBrowserName: navigator.appName,
        cookieEnabled: navigator.cookieEnabled,
        userAgent: navigator.userAgent,
        tzOffset: tzoffset,
        observesDST: observesdst,
        availHeight: window.screen.availHeight,
        availWidth: window.screen.availWidth,
        screenHeight: window.screen.height,
        screenWidth: window.screen.width,
        colorDepth: window.screen.colorDepth,
        pixelDepth: window.screen.pixelDepth,
        language: navigator.language
    });

// We test to see if GeoLocation is supported in this browser. If not we go ahead and
// do the output. Some browsers, even if they support geolocation may not be able to
// get the location. We make sure we generate an output in either case.

    if (__getLocationData && supportgeolocation) {
        navigator.geolocation.getCurrentPosition(__getLocationSuccess,__getLocationFailure);
    } else {
        // No native geolocation support. Let's ignore it
        //
        __generateFingerprintOutput();  // callback returns json fingerprint
    }
}

function __executeFunctionByName (fName) {
    var args = Array.prototype.slice.call(arguments).splice(1);
    var namespaces = fName.split(".");
    var func = namespaces.pop();
    var ns = namespaces.join('.');
    if(ns == '') {
        ns = 'window';
    }
    ns = eval(ns);
    var f = ns[func];
    var result = f.apply(ns, args);
    return result;
}


// We look for a script that has a src attribute containing the ema.js file.
// Unfortunately we have to hardcode the name of the script in it.
//
function __scanForScriptAttributes (em) {
    var appId = null;
    $("script").each(function() {
        var srcAttr = jQuery(this).attr('src');
        if (srcAttr) {
            if (srcAttr.match("ema[0-9-_.a-zA-Z]*.js")) {
                var appId =  jQuery(this).attr('appId');
                if (!appId) {
                    appId =  jQuery(this).attr('appid');
                }
                em.appId = appId;

                var initHandler =  jQuery(this).attr('onInit');
                if (!initHandler) {
                    appId =  jQuery(this).attr('oninit');
                }
                em.initHandler = initHandler;
            }
        }
    })
}

// Returns a singleton instance of the ema object and issues a 'start' event the first time it's used
// We need to double-check that this doesn't get called for each page load
//
function __sharedEMA () {
    __ema.cache.init();
    return __ema;
}

// This gets run at script load time.
//
// By default we check the <script> tag to see if they've provided the AppId as part of
// the attributes. If they have, then we do an EMSetAppId and get the Shared singleton
// so it files a 'start' event.

$(function() {
    __scanForScriptAttributes(__ema);
    if (__ema.appId) {
        EMSetAppId(__ema.appId);
    }
    __sharedEMA();
    __ema.cache.getToken(function() {
        if (__ema.initHandler) {
            __ema.cache.startFlushtimer();
            __executeFunctionByName(__ema.initHandler);
        }
    });
});
// These are exposed global functions meant to be used externally

// We allow only one start event per session.
//

function EMStart ()
{
    return __sharedEMA();
}

function EMRunJSSnippet(callback) {
	__makeFingerprint (callback);
}

function EMEvent (eventname, dict) {
    var __e = __sharedEMA();
    __e.cache.internalAddEvent("event", eventname, dict);
    return __e;
}

function EMUserData (email, phone, name, zipcode, extras) {
    var __e = __sharedEMA();
    var mydata = {};
    if (email)
        mydata["_em"] = email;
    if (phone)
        mydata["_ph"] = phone;
    if (name)
        mydata["_nm"] = name;
    if (zipcode)
        mydata["_zc"] = zipcode;
    // If extras is a dict, we merge it in with this one otherwise we add it in as an item
    if (typeof(extras) === 'object') {
        $.extend(mydata, extras)
    } else {
        mydata["_ex"] = extras;
    }
    __e.cache.internalAddEvent("userdata", null, mydata);
    return __e;
}

function EMPurchase (name, sku, price, currency, count, category, extras) {
    var __e = __sharedEMA();
    var mydata = {};
    if (name)
        mydata["_pn"] = name;
    if (sku)
        mydata["_sk"] = sku;
    if (price)
        mydata["_pp"] = price;
    if (currency)
        mydata["_cu"] = currency;
    if (count)
        mydata["_ct"] = count;
    if (category)
        mydata["_ca"] = category;
    // If extras is a dict, we merge it in with this one otherwise we add it in as an item
    if (typeof(extras) === 'object') {
        $.extend(mydata, extras)
    } else {
        mydata["_ex"] = extras;
    }
    __e.cache.internalAddEvent("purchase", name, mydata);
    return __e;
}

function EMCustomEvent (eventname, extras) {
    var __e = __sharedEMA();
    var mydata = {};
    // If extras is a dict, we merge it in with this one otherwise we add it in as an item
    if (typeof(extras) === 'object') {
        $.extend(mydata, extras)
    } else {
        mydata["_ex"] = extras;
    }
    __e.cache.internalAddEvent("customevent", eventname, mydata);
    return __e;
}

function EMReferrer(referrerid, campaignid, extras) {
    var __e = __sharedEMA();
    var mydata = {};
    if (referrerid)
        mydata["_ri"] = referrerid;
    if (campaignid)
        mydata["_rc"] = campaignid;
    // If extras is a dict, we merge it in with this one otherwise we add it in as an item
    if (typeof(extras) === 'object') {
        $.extend(mydata, extras)
    } else {
        mydata["_ex"] = extras;
    }
    __e.cache.internalAddEvent("referrer", null, mydata);
    return __e;
}

function EMError (error, extras) {
    var __e = __sharedEMA();
    var mydata = {};
    if (error)
        mydata["_er"] = error;
    // If extras is a dict, we merge it in with this one otherwise we add it in as an item
    if (typeof(extras) === 'object') {
        $.extend(mydata, extras)
    } else {
        mydata["_ex"] = extras;
    }
    __e.cache.internalAddEvent("error", null, mydata);
    return __e;
}

function EMSetLocation (lat, lng) {
    var __e = __sharedEMA();
    __e.cache.setLocation(lat, lng);
    return __e;
}

function EMSetFlushTimeout (secs) {
    var __e = __sharedEMA();
    __e.cache.setFlushTimeout(secs);
}

function EMGetFlushTimeout () {
    var result = 0;
    var __e = __sharedEMA();
    result = __e.cache.flushTimeout;
    return result;
}

function EMSetFlushCallback (callback)
{
    var __e = __sharedEMA();
    __e.cache.setFlushCallback(callback);
}

// Call this to set a callback handler that is called when events are queued.
// You can use this to hold off leaving the page until an event is properly saved
// in the local cache.
//
function EMSetEventQueueCallback(onSuccess, onError)
{
    var __e = __sharedEMA();
    __e.cache.setEventQueueCallback(onSuccess, onError);
}

// When forced we turn off the flush throttle timer then turn it back on when the flush action is done
//
function EMForceFlush (maxrec, successcallback, nothingtoflushcallback) {
    var __e = __sharedEMA();
    var maxrecflush = maxrec ? maxrec : __ema.cache.flushMaxRec;
    __e.cache.minFlushDelta = 0;     // Turn off the flush timer

    __e.cache.flushNow(maxrecflush,
        function(result) {
            __e.cache.minFlushDelta = __minFlushDelta;
            if (successcallback)
                successcallback(result);
        },
        function(result) {
            __e.cache.minFlushDelta = __minFlushDelta;
            if (nothingtoflushcallback)
                nothingtoflushcallback();
        }
    );
    return __e;
}

function EMSetToken (token) {
    var __e = __sharedEMA();
    __e.cache.setToken(token);
    return __e;
}

function EMGetToken (callback) {
    var __e = __sharedEMA();
    __e.cache.getToken(callback);
    return __e;
}

function EMSetAppId (appid) {
    var __e = __sharedEMA();
    __e.cache.setAppId(appid);
    return __e;
}

function EMGetAppId (callback) {
    var __e = __sharedEMA();
    __e.cache.getAppId(callback);
    return __e;
}

function EMResetCache () {
    var __e = __sharedEMA();
    __e.cache.resetData();
    return __e;
}
