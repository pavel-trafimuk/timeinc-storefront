/* Dependencies:
 *   - underscore.js
 */
(function() {
  
  function Signal(auto_fire) {
    // auto_fire causes callbacks passed to add() and addOnce() to 
    // fire immediately, and it isn't part of the real API.
    // It just allows us to mock the Signals more simply
    
    this._bindings = [];
    this.add = function(cb) {
      if (auto_fire) setTimeout(cb);
      else this._bindings.push(cb);
    };
    this.has = function(fn) {
      for (var i=this._bindings.length; i--;) {
        if (fn === this._bindings[i]) return true;
      }
      return false;
    };
    this.addOnce = function(cb) {
      if (auto_fire) setTimeout(cb, 300);
      else this._bindings.push(_.once(cb));
    };
    this.trigger = function() {
      var args = arguments;
      _(this._bindings).each(function(fn) {
        fn.apply(window, args);
      });
    }
  }
  function Transaction(ttl) {
    var transaction = this,
        now = moment().unix();
    
    this.progress = 0;
    this.step = 0; // Initialized
    this.progressSignal = new Signal;
    this.completedSignal = new Signal;
    this.stateChangedSignal = new Signal;

    _(ttl).times(function(t) {
      setTimeout(function() {
        if (transaction.step != 1) transaction.stateChangedSignal.trigger(transaction);
        transaction.step = 1; // Downloading
        transaction.progress = 100 * (t/ttl);
        transaction.progressSignal.trigger(transaction);
      }, t*1000);
    });
    setTimeout(function() {
      if (transaction.step != 2) transaction.stateChangedSignal.trigger(transaction);
      transaction.step = 2; // Installing
      transaction.completedSignal.trigger(transaction);
    }, ttl*1000);
  }

  var folios = [
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "4815d43b-00b7-42fc-8579-c53d52c2ccec",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "Money Magazine",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ipad.emea.05132013",
      "folioNumber": "May 13, 2013",
      "publicationDate": "2013-05-04T04:00:00Z",
      "folioDescription": "Homeland Insecurity. Do Americans need to sacrifice privacy to be safer? By Massimo Calabresi and Michael Crowley",
      "description": "Homeland Insecurity. Do Americans need to sacrifice privacy to be safer? By Massimo Calabresi and Michael Crowley",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "ab97a089-75eb-4bd8-a4dc-fd5debd76063",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "Money Magazine",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.money.ipad.inapp.09012013",
      "folioNumber": "September 01, 2013",
      "publicationDate": "2013-08-13T04:00:00Z",
      "folioDescription": "The Best Places to Live in America",
      "description": "The Best Places to Live in America",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "fe5ffadc-18d2-4675-b027-b421e4d365b3",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "Sports Illustrated Kids",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.sikids.ipad.inapp.09012013",
      "folioNumber": "September 01, 2013",
      "publicationDate": "2013-08-05T05:00:00Z",
      "folioDescription": "Football is here! Read scouting reports on every NFL team and get to know Seattle Seahawks QB Russell Wilson.",
      "description": "Football is here! Read scouting reports on every NFL team and get to know Seattle Seahawks QB Russell Wilson.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "dd61e166-95a5-42b9-9d3c-4dfbe1ab7c06",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "People StyleWatch",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.stylewatch.ipad.inapp.05012012",
      "folioNumber": "May 01, 2012",
      "publicationDate": "2012-04-10T04:00:00Z",
      "folioDescription": "The 50 best beauty tips of all time, plus easy summer outfit ideas, bathing suits for every body and budget, and more!",
      "description": "The 50 best beauty tips of all time, plus easy summer outfit ideas, bathing suits for every body and budget, and more!",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "4e4ef7e0-7cec-481d-9510-8a5b30917203",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "This Old House",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.thisoldhouse.ipad.inapp.07012013",
      "folioNumber": "July 01, 2013",
      "publicationDate": "2013-06-05T04:00:00Z",
      "folioDescription": "Find dozens of inspiring before-and-after remodels, ingenious furniture makeovers, money-saving DIY tricks, and more.",
      "description": "Find dozens of inspiring before-and-after remodels, ingenious furniture makeovers, money-saving DIY tricks, and more.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "4e4ef7e0-7cec-481d-9510-8a5b30917203",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "This Old House",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.thisoldhouse.ipad.inapp.07012013",
      "folioNumber": "July 01, 2013",
      "publicationDate": "2013-06-05T04:00:00Z",
      "folioDescription": "Find dozens of inspiring before-and-after remodels, ingenious furniture makeovers, money-saving DIY tricks, and more.",
      "description": "Find dozens of inspiring before-and-after remodels, ingenious furniture makeovers, money-saving DIY tricks, and more.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "2cd90b62-72fb-495f-82ce-6860827348a5",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "This Old House",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.thisoldhouse.ipad.inapp.08012013",
      "folioNumber": "August 01, 2013",
      "publicationDate": "2013-07-10T04:00:00Z",
      "folioDescription": "Get fresh ideas for your outdoor spaces, inspiring redos for any room in the house, and high-impact DIY projects.",
      "description": "Get fresh ideas for your outdoor spaces, inspiring redos for any room in the house, and high-impact DIY projects.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "70ef960d-a415-497c-bbbc-00521bb5a481",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "This Old House",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.thisoldhouse.ipad.inapp.08012012",
      "folioNumber": "August 01, 2012",
      "publicationDate": "2012-07-10T04:00:00Z",
      "folioDescription": "Get upgrade ideas for the heart of your home, clever kitchen and bath products, and tips for pretty year-round gardens.",
      "description": "Get upgrade ideas for the heart of your home, clever kitchen and bath products, and tips for pretty year-round gardens.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "24dfbde7-35e2-4a2e-b774-9c74e99cf585",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "This Old House",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.thisoldhouse.ipad.inapp.03012013",
      "folioNumber": "March 01, 2013",
      "publicationDate": "2013-01-22T05:00:00Z",
      "folioDescription": "Give your home a springtime wakeup call with curb appeal ideas, get-organized advice, doable DIY projects, and more.",
      "description": "Give your home a springtime wakeup call with curb appeal ideas, get-organized advice, doable DIY projects, and more.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "70ef960d-a415-497c-bbbc-00521bb5a481",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "This Old House",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.thisoldhouse.ipad.inapp.08012012",
      "folioNumber": "August 01, 2012",
      "publicationDate": "2012-07-10T04:00:00Z",
      "folioDescription": "Get upgrade ideas for the heart of your home, clever kitchen and bath products, and tips for pretty year-round gardens.",
      "description": "Get upgrade ideas for the heart of your home, clever kitchen and bath products, and tips for pretty year-round gardens.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "24dfbde7-35e2-4a2e-b774-9c74e99cf585",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "This Old House",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.thisoldhouse.ipad.inapp.03012013",
      "folioNumber": "March 01, 2013",
      "publicationDate": "2013-01-22T05:00:00Z",
      "folioDescription": "Give your home a springtime wakeup call with curb appeal ideas, get-organized advice, doable DIY projects, and more.",
      "description": "Give your home a springtime wakeup call with curb appeal ideas, get-organized advice, doable DIY projects, and more.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "0588fe58-2aaf-484a-a984-06cf4b727e21",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "This Old House",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.thisoldhouse.ipad.inapp.03012012",
      "folioNumber": "March 01, 2012",
      "publicationDate": "2012-01-24T05:00:00Z",
      "folioDescription": "Boost curb appeal with just-right paint colors, foolproof plantings, entry-porch upgrades, and more.",
      "description": "Boost curb appeal with just-right paint colors, foolproof plantings, entry-porch upgrades, and more.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "8e947c0a-0b7c-4f66-939b-0c03b4cf2af2",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "InStyle",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.instyle.ipad.inapp.09012013",
      "folioNumber": "September 01, 2013",
      "publicationDate": "2013-08-16T04:00:00Z",
      "folioDescription": "Our biggest issue ever is packed with all the fall fashions you want and all the styling and beauty tips you need.",
      "description": "Our biggest issue ever is packed with all the fall fashions you want and all the styling and beauty tips you need.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "13ecf094-42d0-4320-8f94-26f2ff94521b",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "InStyle",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.instyle.ipad.inapp.04102013",
      "folioNumber": "Hair Special 2013",
      "publicationDate": "2013-04-05T04:00:00Z",
      "folioDescription": "Your hair dreams can come true! This special issue offers products that really work and hundreds of fun styling ideas.",
      "description": "Your hair dreams can come true! This special issue offers products that really work and hundreds of fun styling ideas.",
      "price": "FREE",
      "broker": "noChargeStore",
      "filter": "Special",
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "8f70bdb3-d74f-4c8e-b553-a42a064f3646",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "People",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.people.ipad.inapp.01142013",
      "folioNumber": "January 14, 2013",
      "publicationDate": "2013-01-04T05:00:00Z",
      "folioDescription": "Half Their Size! Inspiring weight loss stories, recipes, and tips from trainers and doctors. Get fit in the new year!",
      "description": "Half Their Size! Inspiring weight loss stories, recipes, and tips from trainers and doctors. Get fit in the new year!",
      "price": "FREE",
      "broker": "noChargeStore",
      "filter": "Special",
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "6ed84474-f4c2-4bc3-bfe5-2447b172fa67",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "People",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.people.ipad.inapp.10182010",
      "folioNumber": "October 18, 2010",
      "publicationDate": "2010-10-07T04:00:00Z",
      "folioDescription": "Tyler Clementi killed himself after his roommate taped him with a man. His death, as well as Phoebe Prince and more.",
      "description": "Tyler Clementi killed himself after his roommate taped him with a man. His death, as well as Phoebe Prince and more.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "6ed84474-f4c2-4bc3-bfe5-2447b172fa67",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "People",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.people.ipad.inapp.10182010",
      "folioNumber": "October 18, 2010",
      "publicationDate": "2010-10-07T04:00:00Z",
      "folioDescription": "Tyler Clementi killed himself after his roommate taped him with a man. His death, as well as Phoebe Prince and more.",
      "description": "Tyler Clementi killed himself after his roommate taped him with a man. His death, as well as Phoebe Prince and more.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "6ed84474-f4c2-4bc3-bfe5-2447b172fa67",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "People",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.people.ipad.inapp.10182010",
      "folioNumber": "October 18, 2010",
      "publicationDate": "2010-10-07T04:00:00Z",
      "folioDescription": "Tyler Clementi killed himself after his roommate taped him with a man. His death, as well as Phoebe Prince and more.",
      "description": "Tyler Clementi killed himself after his roommate taped him with a man. His death, as well as Phoebe Prince and more.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "6ed84474-f4c2-4bc3-bfe5-2447b172fa67",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "People",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.people.ipad.inapp.10182010",
      "folioNumber": "October 18, 2010",
      "publicationDate": "2010-10-07T04:00:00Z",
      "folioDescription": "Tyler Clementi killed himself after his roommate taped him with a man. His death, as well as Phoebe Prince and more.",
      "description": "Tyler Clementi killed himself after his roommate taped him with a man. His death, as well as Phoebe Prince and more.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "23c10582-5008-4991-92a4-0392893d9900",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "People",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.people.ipad.inapp.05302011",
      "folioNumber": "May 30, 2011",
      "publicationDate": "2011-05-19T04:00:00Z",
      "folioDescription": "Arnold Schwarzenegger reveals that he fathered a child with an employee, Maria Shriver starts to rebuild her life.",
      "description": "Arnold Schwarzenegger reveals that he fathered a child with an employee, Maria Shriver starts to rebuild her life.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "e275e2dc-ce82-4808-b90d-8f80f34b175d",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "Sports Illustrated",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.si.ipad.inapp.09162013",
      "folioNumber": "September 16, 2013",
      "publicationDate": "2013-09-11T04:00:00Z",
      "folioDescription": "An SI investigation into Oklahoma State reveals the measures some schools will take to join the college football elite.",
      "description": "An SI investigation into Oklahoma State reveals the measures some schools will take to join the college football elite.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "e6dea784-b331-49ac-8a5d-5c27c3cfdb79",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "Sports Illustrated",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.si.ipad.inapp.05302011",
      "folioNumber": "May 30, 2011",
      "publicationDate": "2011-05-25T04:00:00Z",
      "folioDescription": "NBA Conference Finals: The West is a good old-fashioned border war; in the East, Miami shows its down-and-dirty side.",
      "description": "NBA Conference Finals: The West is a good old-fashioned border war; in the East, Miami shows its down-and-dirty side.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "72e7ae1c-19a7-40d3-84d4-3ded6cf1f6ed",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "Sports Illustrated",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.si.ipad.inapp.01312011",
      "folioNumber": "January 31, 2011",
      "publicationDate": "2011-01-26T05:00:00Z",
      "folioDescription": "QB Aaron Rodgers and Green Bay are headed to Dallas to face the Steelers, whose D is the key to a 7th Super Bowl title.",
      "description": "QB Aaron Rodgers and Green Bay are headed to Dallas to face the Steelers, whose D is the key to a 7th Super Bowl title.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "2048x1536",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
    "updatedSignal": {
      "_bindings": [],
      "_prevParams": null
    },
    "id": "0085bd80-4db2-4a5d-92fc-3b40d8ec422b",
    "currentTransactions": [],
    "downloadSize": 0,
    "state": 100,
    "previewImageURL": null,
    "title": "People En Espanol",
    "isCompatible": true,
    "isDownloadable": false,
    "isViewable": false,
    "isArchivable": false,
    "isUpdatable": false,
    "productId": "com.timeinc.peopleespanol.ipad.inapp.09012013",
    "folioNumber": "September 01, 2013",
    "publicationDate": "2013-08-09T04:00:00Z",
    "folioDescription": "William Levy y Ximena Navarrete hablan en exclusiva de la pasión que encendió el set de su nueva novela, La Tempestad.",
    "description": "William Levy y Ximena Navarrete hablan en exclusiva de la pasión que encendió el set de su nueva novela, La Tempestad.",
    "price": "$4.99",
    "broker": "appleStore",
    "filter": null,
    "isThirdPartyEntitled": false,
    "targetDimensions": "2048x1536",
    "isPurchasable": true,
    "supportsContentPreview": false,
    "receipt": null,
    "entitlementType": 0,
    "hasSections": false,
    "contentPreviewState": 0,
    "sections": {
      "addedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "removedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "internal": {}
    }
  },
  {
    "updatedSignal": {
      "_bindings": [],
      "_prevParams": null
    },
    "id": "6e524e91-ba10-4705-9a0d-3d2ec4059efa",
    "currentTransactions": [],
    "downloadSize": 0,
    "state": 100,
    "previewImageURL": null,
    "title": "GOLF Magazine",
    "isCompatible": true,
    "isDownloadable": false,
    "isViewable": false,
    "isArchivable": false,
    "isUpdatable": false,
    "productId": "com.timeinc.golf.ipad.inapp.09012013",
    "folioNumber": "September 01, 2013",
    "publicationDate": "2013-08-09T04:00:00Z",
    "folioDescription": "Golf Magazine's Top 100 Courses. PLUS: Ben Crenshaw, Tiger's design, and Charles Howell's short game secrets.",
    "description": "Golf Magazine's Top 100 Courses. PLUS: Ben Crenshaw, Tiger's design, and Charles Howell's short game secrets.",
    "price": "$4.99",
    "broker": "appleStore",
    "filter": null,
    "isThirdPartyEntitled": false,
    "targetDimensions": "2048x1536",
    "isPurchasable": true,
    "supportsContentPreview": false,
    "receipt": null,
    "entitlementType": 0,
    "hasSections": false,
    "contentPreviewState": 0,
    "sections": {
      "addedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "removedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "internal": {}
    }
  },
  {
    "updatedSignal": {
      "_bindings": [],
      "_prevParams": null
    },
    "id": "177b2048-2867-4558-bf65-a9f3465fa567",
    "currentTransactions": [],
    "downloadSize": 0,
    "state": 100,
    "previewImageURL": null,
    "title": "People En Espanol",
    "isCompatible": true,
    "isDownloadable": false,
    "isViewable": false,
    "isArchivable": false,
    "isUpdatable": false,
    "productId": "com.timeinc.peopleespanol.ipad.inapp.05012013",
    "folioNumber": "May 01, 2013",
    "publicationDate": "2013-04-05T04:00:00Z​",
    "folioDescription": "Angélica Vale vuelve a la televisión con su hija a cuestas para continuar el legado de su mamá, Angélica Vale.",
    "description": "Angélica Vale vuelve a la televisión con su hija a cuestas para continuar el legado de su mamá, Angélica Vale.",
    "price": "$4.99",
    "broker": "appleStore",
    "filter": null,
    "isThirdPartyEntitled": false,
    "targetDimensions": "2048x1536",
    "isPurchasable": true,
    "supportsContentPreview": false,
    "receipt": null,
    "entitlementType": 0,
    "hasSections": false,
    "contentPreviewState": 0,
    "sections": {
      "addedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "removedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "internal": {}
    }
  },
  {
    "updatedSignal": {
      "_bindings": [],
      "_prevParams": null
    },
    "id": "192dc4d5-c660-40ad-ae8c-e1a8a1852175",
    "currentTransactions": [],
    "downloadSize": 0,
    "state": 100,
    "previewImageURL": null,
    "title": "EW",
    "isCompatible": true,
    "isDownloadable": false,
    "isViewable": false,
    "isArchivable": false,
    "isUpdatable": false,
    "productId": "com.timeinc.ew.ipad.inapp.05172013",
    "folioNumber": "May 17, 2013",
    "publicationDate": "2013-05-09T04:00:00.000Z",
    "folioDescription": "Download this week's issue to explore the Fast & Furious franchise's wild ride, and what to expect in the sixth film.",
    "description": "This is the May 17, 2013 issue of Entertainment Weekly. ",
    "price": "$4.99",
    "broker": "appleStore",
    "filter": null,
    "isThirdPartyEntitled": false,
    "targetDimensions": "1024x748",
    "isPurchasable": true,
    "supportsContentPreview": false,
    "receipt": null,
    "entitlementType": 0,
    "hasSections": false,
    "contentPreviewState": 0,
    "sections": {
      "addedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "removedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "internal": {}
    }
  },
  {
    "updatedSignal": {
      "_bindings": [],
      "_prevParams": null
    },
    "id": "6ff91b24-3a80-4e96-b9f6-c48541541d54",
    "currentTransactions": [],
    "downloadSize": 0,
    "state": 100,
    "previewImageURL": null,
    "title": "EW",
    "isCompatible": true,
    "isDownloadable": false,
    "isViewable": false,
    "isArchivable": false,
    "isUpdatable": false,
    "productId": "com.timeinc.ew.ipad.inapp.05312013",
    "folioNumber": "May 31, 2013",
    "publicationDate": "2013-05-23T04:00:00.000Z",
    "folioDescription": "Download the Summer Must List issue for our guide to the season's hottest movies, TV, books, music, and more.",
    "description": "This is the May 31, 2013 issue of Entertainment Weekly. ",
    "price": "$4.99",
    "broker": "appleStore",
    "filter": null,
    "isThirdPartyEntitled": false,
    "targetDimensions": "1024x748",
    "isPurchasable": true,
    "supportsContentPreview": false,
    "receipt": null,
    "entitlementType": 0,
    "hasSections": false,
    "contentPreviewState": 0,
    "sections": {
      "addedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "removedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "internal": {}
    }
  },
  {
    "updatedSignal": {
      "_bindings": [],
      "_prevParams": null
    },
    "id": "af2edca7-1374-456b-8882-6e9900ff10f9",
    "currentTransactions": [],
    "downloadSize": 0,
    "state": 100,
    "previewImageURL": null,
    "title": "EW",
    "isCompatible": true,
    "isDownloadable": false,
    "isViewable": false,
    "isArchivable": false,
    "isUpdatable": false,
    "productId": "com.timeinc.ew.ipad.inapp.06142013",
    "folioNumber": "June 14, 2013",
    "publicationDate": "2013-06-06T04:00:00.000Z",
    "folioDescription": "Download the Summer TV Preview issue for your guide to the best new and returning shows, featuring Dexter's final season",
    "description": "This is the June 14, 2013 issue of Entertainment Weekly.",
    "price": "$4.99",
    "broker": "appleStore",
    "filter": null,
    "isThirdPartyEntitled": false,
    "targetDimensions": "1024x748",
    "isPurchasable": true,
    "supportsContentPreview": false,
    "receipt": null,
    "entitlementType": 0,
    "hasSections": false,
    "contentPreviewState": 0,
    "sections": {
      "addedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "removedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "internal": {}
    }
  },
  {
    "updatedSignal": {
      "_bindings": [],
      "_prevParams": null
    },
    "id": "bd298775-5b54-4ed3-9761-d8da3817ef7e",
    "currentTransactions": [],
    "downloadSize": 0,
    "state": 200,
    "previewImageURL": null,
    "title": "EW",
    "isCompatible": true,
    "isDownloadable": true,
    "isViewable": false,
    "isArchivable": false,
    "isUpdatable": false,
    "productId": "com.timeinc.ew.ipad.inapp.06212013",
    "folioNumber": "June 21, 2013",
    "publicationDate": "2013-06-13T04:00:00.000Z",
    "folioDescription": "Download this week's issue to take flight with our obsessive history of 75 years of Superman.",
    "description": "This is the June 21, 2013 issue of Entertainment Weekly. ",
    "price": "$4.99",
    "broker": "appleStore",
    "filter": null,
    "isThirdPartyEntitled": false,
    "targetDimensions": "1024x748",
    "isPurchasable": false,
    "supportsContentPreview": false,
    "receipt": null,
    "entitlementType": 3,
    "hasSections": false,
    "contentPreviewState": 0,
    "sections": {
      "addedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "removedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "internal": {}
    }
  },
  {
    "updatedSignal": {
      "_bindings": [],
      "_prevParams": null
    },
    "id": "ffc4f0d6-5102-4f7d-b14b-d58a3be54ebe",
    "currentTransactions": [],
    "downloadSize": 0,
    "state": 100,
    "previewImageURL": null,
    "title": "EW",
    "isCompatible": true,
    "isDownloadable": false,
    "isViewable": false,
    "isArchivable": false,
    "isUpdatable": false,
    "productId": "com.timeinc.ew.ipad.inapp.05242013",
    "folioNumber": "May 24, 2013",
    "publicationDate": "2013-05-16T04:00:00.000Z",
    "folioDescription": "From Bruno Mars to Kanye, download the Summer Music Preview issue for scoop on the buzziest tours, albums, and more.",
    "description": "This is the May 24, 2013 issue of Entertainment Weekly. ",
    "price": "$4.99",
    "broker": "appleStore",
    "filter": null,
    "isThirdPartyEntitled": false,
    "targetDimensions": "1024x748",
    "isPurchasable": true,
    "supportsContentPreview": false,
    "receipt": null,
    "entitlementType": 0,
    "hasSections": false,
    "contentPreviewState": 0,
    "sections": {
      "addedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "removedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "internal": {}
    }
  },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "0d05227f-607a-4df4-9210-3e101ea72d0f",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 200,
      "previewImageURL": null,
      "title": "EW",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.11302012",
      "folioNumber": "November 30, 2012",
      "publicationDate": "2012-11-21T05:00:00.000Z",
      "folioDescription": "To take a ride with Sons of Anarchy, FX's wild biker drama. Plus, see bonus photos from our cover shoot.",
      "description": "To take a ride with Sons of Anarchy, FX's wild biker drama. Plus, see bonus photos from our cover shoot.",
      "price": "FREE",
      "broker": "noChargeStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": true,
      "supportsContentPreview": true,
      "receipt": null,
      "entitlementType": 1,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "19d3bb2f-8398-4918-b3a8-0d79a3e730d8",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "July 1, 2012",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.realsimple.ipad.inapp.07012012",
      "folioNumber": "April 05, 2013",
      "publicationDate": "2013-03-28T04:00:00.000Z",
      "folioDescription": "The scoop on Brad Pitt's quest to bring the apocalyptic zombie thriller World War Z from page to the screen.",
      "description": "This is the April 05, 2013 issue of Entertainment Weekly.\n",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": true,
      "supportsContentPreview": true,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "2c4a39a5-3fd8-4165-9639-8906109fc588",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "EW",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.03152013",
      "folioNumber": "March 15, 2013",
      "publicationDate": "2013-03-07T05:00:00.000Z",
      "folioDescription": "An exclusive look at Steven Soderbergh's the highly anticipated Liberace biopic starring Michael Douglas and Matt Damon.",
      "description": "This is the March 15, 2013 issue of Entertainment Weekly.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": true,
      "supportsContentPreview": true,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "3c9ba521-5da4-41b5-8ace-fa80ffe2b04d",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 200,
      "previewImageURL": null,
      "title": "Free Issue",
      "isCompatible": true,
      "isDownloadable": true,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.04122013",
      "folioNumber": "April 12, 2013",
      "publicationDate": "2013-04-04T04:00:00.000Z",
      "folioDescription": "An inside look at Shonda Rhimes' sexy political drama, Scandal. Plus, tablet readers get outtakes from our cover shoot.",
      "description": "An inside look at Shonda Rhimes' sexy political drama, Scandal. Plus, tablet readers get outtakes from our cover shoot.",
      "price": "FREE",
      "broker": "noChargeStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": false,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 1,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "436bf8b2-fcc7-4192-8def-5036d610e8b1",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "EW",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.03292013",
      "folioNumber": "March 29, 2013",
      "publicationDate": "2013-03-21T04:00:00.000Z",
      "folioDescription": "Celebrate 50 years of intergalactic time travel with Doctor Who. Plus, tablet readers get bonus images from our shoot.",
      "description": "This is the March 29, 2013 issue of Entertainment Weekly.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "4bf51784-c169-4660-b0ac-d419ad1af121",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "EW",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.11092012",
      "folioNumber": "November 09, 2012",
      "publicationDate": "2012-11-02T04:00:00.000Z",
      "folioDescription": "Our Holiday Movie Preview, with Les Miserables, The Hobbit, and more. Also, Oscar predictions and a complete calendar.",
      "description": "This is the November 09, 2012 issue of EW. ",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "5f134782-9819-4b3f-97d0-5a9499d1bd0f",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "EW",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.10052012",
      "folioNumber": "October 05, 2012",
      "publicationDate": "2012-09-27T04:00:00.000Z",
      "folioDescription": "The EW interview with the multitalented Tina Fey on the eve of 30 Rock's final season. Plus, Emmy Awards highs and lows.",
      "description": "This is the October 05, 2012 issue of EW. ",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "7225da1b-b179-4859-9a92-44511d9b9f76",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "EW",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.01252013",
      "folioNumber": "January 25, 2013",
      "publicationDate": "2013-01-17T05:00:00.000Z",
      "folioDescription": "Are you ready for the Oscars? Download this special double issue of Entertainment Weekly for a complete guide to this",
      "description": "This is the January 25, 2013 issue of Entertainment Weekly.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "8b4c6525-e152-440d-893b-3cb8625a0d64",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "EW",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.03082013",
      "folioNumber": "March 08, 2013",
      "publicationDate": "2013-02-28T05:00:00.000Z",
      "folioDescription": "A look inside the magical world of Disney's Oz the Great and Powerful. Also, bonus content from our Oscar coverage.",
      "description": "This is the March 08, 2013 issue of Entertainment Weekly.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "9d749c08-db79-4170-a67d-194f0d32eaca",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 200,
      "previewImageURL": null,
      "title": "EW",
      "isCompatible": true,
      "isDownloadable": true,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.12142012",
      "folioNumber": "December 14, 2012",
      "publicationDate": "2012-12-06T05:00:00.000Z",
      "folioDescription": "An inside look at the making of The Hobbit, Peter Jackson's highly anticipated Lord of the Rings prequel.",
      "description": "An inside look at the making of The Hobbit, Peter Jackson's highly anticipated Lord of the Rings prequel.",
      "price": "FREE",
      "broker": "noChargeStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": false,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 1,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "a077f105-10b6-48cc-bee8-f5d1c8d88a93",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "EW",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.03012013",
      "folioNumber": "March 01, 2013",
      "publicationDate": "2013-02-21T05:00:00.000Z",
      "folioDescription": "An inside look at Pretty Little Liars, the teen phenom that's changing TV. Also, bonus outtakes from our photo shoot.",
      "description": "This is the March 01, 2013 issue of Entertainment Weekly.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "b54d2ec6-f2ca-41d3-a9ad-2cfb4eae136a",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "EW",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.03222013",
      "folioNumber": "March 22, 2013",
      "publicationDate": "2013-03-14T04:00:00.000Z",
      "folioDescription": "Gear up for the return of HBO's epic fantasy-drama Game of Thrones. Also, see bonus photos from our shoot with the cast.",
      "description": "This is the March 22, 2013 issue of Entertainment Weekly.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "b9816f63-0361-44b4-a069-653e05c3c00c",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "EW",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.10262012",
      "folioNumber": "October 26, 2012",
      "publicationDate": "2012-10-18T04:00:00.000Z",
      "folioDescription": "Inside ABC's fairy-tale mash-up Once Upon a Time; plus, Hollywood Design Report, showcasing talent behind the scenes.",
      "description": "This is the October 26, 2012 issue of EW. ",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "bc17c46a-8726-4114-9c26-1c3c82024e33",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 200,
      "previewImageURL": null,
      "title": "EW",
      "isCompatible": true,
      "isDownloadable": true,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.11232012",
      "folioNumber": "November 23, 2012",
      "publicationDate": "2012-11-15T05:00:00.000Z",
      "folioDescription": "The future of Star Wars: what Disney's surprise acquisition means for the moviegoing galaxy--and what they should do.",
      "description": "The future of Star Wars: what Disney's surprise acquisition means for the moviegoing galaxy--and what they should do.",
      "price": "FREE",
      "broker": "noChargeStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": false,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 1,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "c4c667df-8a38-420d-85c3-48d6f659b2f3",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "EW",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.11022012",
      "folioNumber": "November 02, 2012",
      "publicationDate": "2012-10-25T04:00:00.000Z",
      "folioDescription": "Read how Daniel Craig and director Sam Mendes have reinvented James Bond for the terrific new film Skyfall.",
      "description": "This is the November 02, 2012 issue of EW.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "e396dfa8-5658-4334-a50f-b75e4f45473a",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 200,
      "previewImageURL": null,
      "title": "EW",
      "isCompatible": true,
      "isDownloadable": true,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.12282012",
      "folioNumber": "December 28, 2012",
      "publicationDate": "2012-12-20T05:00:00.000Z",
      "folioDescription": "Our look at the best and worst of 2012, including the big trends and our critics' standout films, TV shows, and more.",
      "description": "Our look at the best and worst of 2012, including the big trends and our critics' standout films, TV shows, and more.",
      "price": "FREE",
      "broker": "noChargeStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": false,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 1,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "e4f139a1-7721-476e-94de-918fa7383c5e",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "EW",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.10122012",
      "folioNumber": "October 12, 2012",
      "publicationDate": "2012-10-04T04:00:00.000Z",
      "folioDescription": "10 amazing cast reunions, from Arrested Development to E.T. to The Larry Sanders Show--plus Clueless and Melrose Place.",
      "description": "This is the October 12, 2012 issue of EW. ",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "e94dc086-426c-4636-9581-23bdcaf9d9f2",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "Sample #1",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.04192013",
      "folioNumber": "April 19, 2013",
      "publicationDate": "2013-04-11T04:00:00.000Z",
      "folioDescription": "EW's Summer Movie Preview: scoop on more than 100 new films, including Man of Steel and Iron Man 3--and exclusive photos",
      "description": "This is the April 19, 2013 issue of Entertainment Weekly.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "f1ec5668-13c7-4e25-8864-a397b1af7ad7",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "Sample #2",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.05032013",
      "folioNumber": "May 03, 2013",
      "publicationDate": "2013-04-25T04:00:00.000Z",
      "folioDescription": "Test Description. CHANGE ME.",
      "description": "This is the May 03, 2013 issue of Entertainment Weekly.",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "4d1bcaa8-2c21-4ad9-9008-5ccc20e6ab22",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "People",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.people.ipad.inapp.06032013",
      "folioNumber": "June 03, 2013",
      "publicationDate": "2013-05-23T04:00:00Z",
      "folioDescription": "His devotion helped Angelina Jolie get through her double mastectomy. Now Brad Pitt is by her side as she recovers",
      "description": "His devotion helped Angelina Jolie get through her double mastectomy. Now Brad Pitt is by her side as she recovers",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "f2b47c4e-4461-495a-8fe2-17a9f9f8e42b",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 100,
      "previewImageURL": null,
      "title": "EW",
      "isCompatible": true,
      "isDownloadable": false,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.12212012",
      "folioNumber": "December 21, 2012",
      "publicationDate": "2012-12-13T05:00:00.000Z",
      "folioDescription": "Go inside Quentin Tarantino's slave drama, Django Unchained. Plus, the 25 films you should see before Oscar night.",
      "description": "This is the December 21, 2012 issue of EW. ",
      "price": "$4.99",
      "broker": "appleStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": true,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 0,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    },
    {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "id": "f5c94518-6faa-4df9-9144-8d30d8027dfa",
      "currentTransactions": [],
      "downloadSize": 0,
      "state": 200,
      "previewImageURL": null,
      "title": "EW",
      "isCompatible": true,
      "isDownloadable": true,
      "isViewable": false,
      "isArchivable": false,
      "isUpdatable": false,
      "productId": "com.timeinc.ew.ipad.inapp.12072012",
      "folioNumber": "December 07, 2012",
      "publicationDate": "2012-11-29T05:00:00.000Z",
      "folioDescription": "In our Entertainers of the Year hear George Clooney on Ben Affleck, Nathan Fillion on Joss Whedon, and many more.",
      "description": "In our Entertainers of the Year hear George Clooney on Ben Affleck, Nathan Fillion on Joss Whedon, and many more.",
      "price": "FREE",
      "broker": "noChargeStore",
      "filter": null,
      "isThirdPartyEntitled": false,
      "targetDimensions": "1024x748",
      "isPurchasable": false,
      "supportsContentPreview": false,
      "receipt": null,
      "entitlementType": 1,
      "hasSections": false,
      "contentPreviewState": 0,
      "sections": {
        "addedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "removedSignal": {
          "_bindings": [],
          "_prevParams": null
        },
        "internal": {}
      }
    }
  ];
  var subscriptions = {
    "com.timeinc.ew.ipad.subs.9": {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "productId": "com.timeinc.ew.ipad.subs.9",
      "title": "ENTERTAINMENT WEEKLY Magazine",
      "duration": "1 Year",
      "price": "$24.99",
      "isOwned": false,
      "receipt": {
        contains: function() { return true; }
      },
    },
    "com.timeinc.ew.ipad.subs.3": {
      "updatedSignal": {
        "_bindings": [],
        "_prevParams": null
      },
      "productId": "com.timeinc.ew.ipad.subs.3",
      "title": "ENTERTAINMENT WEEKLY Magazine",
      "duration": "1 Month",
      "price": "$2.99",
      "isOwned": false,
      "receipt": null
    }
  };    

  window.MockAPI = {
    initializationComplete: new Signal(true),
    analyticsService: {
      trackCustomEvent: function() {}
    },
    authenticationService: {
      isUserAuthenticated: false,
      token: null, // "5288e988fc36badd85b1e37f10ede511bfed3e3fe0668e08fa67fb2de6dba51afa409948cbae5069ef56d7930d484929",
      logout: function() {},
      userAuthenticationChangedSignal: new Signal(),
      updatedSignal: new Signal(),
      userName: 'test@test.com',
    },
    deviceService: {
      isOnline: true,
      omnitureVisitorId: '11111111-22222222-33333333-44444444',
      pushNotificationToken: 'PuShNoTiFiCaTiOn111222333tOkEn'
    },
    receiptService: {
      availableSubscriptions: subscriptions,
      newReceiptsAvailableSignal: new Signal()
    },
    libraryService: {
      folioStates: {},
      updateLibrary: function() { return new Transaction(2) },
      updatedSignal: new Signal(),
      folioMap: {
        addedSignal: new Signal(),
        sort: function(cb) { return _(folios).sort(cb); }
      }
    },
  };

  
  folios.forEach(function(folio) { 
    folio.updatedSignal = new Signal;
    folio.purchase = function() { 
      confirm("Are you sure you want to buy this?");
      setTimeout(function() { folio.isDownloadable = true }, 750);
      return new Transaction(1);
    }
    folio.isFree = function () { return this.broker == "noChargeStore" }
    folio.download = function() {
      var transaction = new Transaction(20);
      setTimeout(function() {
        folio.isViewable = true;
      }, 9000);
      return transaction;
    }
    folio.verifyContentPreviewSupported = function() {
      return new Transaction(1);
    }
    folio.currentStateChangingTransaction = function() { return null }
    folio.canDownloadContentPreview = function() {
      return this.supportsContentPreview &&
        !this.hasSections &&
        this.isPurchasable &&
        this.isCompatible &&
        !this.isArchivable &&
        (this.currentStateChangingTransaction() == null); 
    }
    folio.downloadContentPreview = function() {
      setTimeout(function() {
        folio.isViewable = true;
      }, 6000);
      return new Transaction(15);
    }
    folio.view = function() {
      alert("Viewing folio: " + folio.productId);
      setTimeout(function() { location.reload(); }, 1000);
    }
    folio.getPreviewImage = function(w, h, p) {
      var t = new Transaction(1);
      t.width = w;
      t.height = h;
      t.isPortrait = p;
      t.previewImageURL = "http://thetopsdirectory.com/img/article.jpg";
      return t;
    }
    MockAPI.libraryService.folioMap[folio.id] = folio 
  });
 
  for (var sub_id in subscriptions) (function(sub) {
    sub.isActive = function() {
      return this.isOwned && this.receipt.contains(new Date());
    }
  })(subscriptions[sub_id]);


})();
