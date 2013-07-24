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
    this.addOnce = function(cb) {
      if (auto_fire) setTimeout(cb, 1000);
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
      isUserAuthenticated: true,
      token: "5288e988fc36badd85b1e37f10ede511bfed3e3fe0668e08fa67fb2de6dba51afa409948cbae5069ef56d7930d484929",
      logout: function() {},
      userAuthenticationChangedSignal: new Signal()
    },
    receiptService: {
      availableSubscriptions: subscriptions,
      newReceiptsAvailableSignal: new Signal()
    },
    libraryService: {
      folioStates: {},
      updateLibrary: function() { return new Transaction(2) },
      folioMap: {
        addedSignal: new Signal(),
        sort: function(cb) { return _(folios).sort(cb); }
      }
    },
  };

  
  folios.forEach(function(folio) { 
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
      setTimeout(function() { location.reload(); }, 1500);
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
