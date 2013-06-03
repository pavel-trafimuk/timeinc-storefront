(function() {
  
  // utility function (used to attach extra folio methods)
  function wrap_object(obj, extra_methods) {
    function subclass() {
      _.extend(this, extra_methods);
    }
    subclass.prototype = obj;
    return new subclass();
  }

  window.APIWrapper = function(raw_api, cb) {
    // returns a new APIWrapper object right away, but calls the cb
    // when it's fully ready to go

    function Wrapper(tcm_feed, adobe_feed) {
      var that = this;


      // build dictionaries of the tcm_feed and adobe feed for 
      // easy access
      this.tcm_feed = tcm_feed;
      _(tcm_feed.issues).each(function(issue) {
        tcm_feed[issue.id] = issue;
      });
      this.adobe_feed = adobe_feed;
      $("issue", adobe_feed).each(function($issue) {
        var $issue = $(this),
            product_id = $issue.attr("productId");
        adobe_feed[product_id] = $issue;
      });


      // FOLIO METHODS /////////////////////////////////////////////////

      function transaction_to_deferred(t, d) {
        var d = d || new $.Deferred();
        t.stateChangedSignal.add(function() {
          if (t.state < 0) {
            d.rejectWith(t, t.state, t.error);
          }
          else if (t.state == 100) {
            // paused
            d.rejectWith(t, t.state, null);
          }
          else d.notifyWith(t, t.progress);
        });
        t.progressSignal.add(function() {
          d.notifyWith(t, t.progress);
        });
        t.completedSignal.add(function() {
          d.notifyWith(t, t.progress);
          d.resolveWith(t, t.state);
        });
        return d;
      }

      var extra_folio_methods = {
        "get_welcome_imgs": function() {
          if (this.tcm) {
            return [
              settings.tcmfeed_image_root+this.tcm.intro_img, 
              settings.tcmfeed_image_root+this.tcm.welcome_img
            ];
          }
          else {
            return [this.get_cover_img(), this.get_cover_img()]
          }
        },
        "get_cover_img": function() { 
          return this.adb.find("libraryPreviewUrl").text() + "/issue.png" 
        },
        "_defer": function(method, cancall_attr) {
          var d = new $.Deferred(),
              method = this[method],
              args = Array.prototype.slice.call(arguments, 2);
          if (cancall_attr === undefined || this[cancall_attr]) {
            transaction_to_deferred(method.apply(this, args), d);
          }
          else d.reject();
          return d;
        },
        "view_or_preview": function(opts) {
          opts = opts || {};
          var folio = this;

          function try_to_view(fallback) {
            fallback = fallback || $.noop;
            if (folio.isViewable) {
              (opts.complete||$.noop)();
              setTimeout(function() { folio.view() }, 100);
            }
            else {
              fallback();
            }
          }

          if (folio.isDownloadable) folio.download_and_view(opts);          
          else try_to_view(function() {
            var transaction;
            transaction = folio.verifyContentPreviewSupported();
            transaction.completedSignal.addOnce(function() {
              try_to_view(function() {
                var transaction;
                if (folio.canDownloadContentPreview()) {
                  transaction = folio.downloadContentPreview();
                  transaction.progressSignal.add(function() {
                    (opts.download_progress||$.noop)(transaction.progress);
                    try_to_view();
                  });
                  transaction.stateChangedSignal.add(function() {
                    try_to_view();
                  });
                }
                else {
                  console.log("ERROR: folio has no content preview!! folio: " + folio.productId);
                  alert("Err: NO CONTENT PREVIEW");
                }
              });
            });
          });

        },
        "download_and_view": function(opts) {
          opts = opts || {};
          var folio = this;
          
          function complete() {
            setTimeout(function() { folio.view() });
            (opts.complete || $.noop)();
          }

          if (folio.isDownloadable) {
              dl_transaction = folio.download();
              dl_transaction.progressSignal.add(function() {
                if (folio.isViewable) setTimeout(function() {
                  folio.view();
                }, 500);
                (opts.download_progress || $.noop)(dl_transaction.progress);
              });
              dl_transaction.completedSignal.addOnce(complete);
            }
          else complete();

        },
        "purchase_and_download": function(opts) {
          opts = opts || {};
          var folio = this;
          
          function complete() {
            setTimeout(function() { folio.view() });
            (opts.complete || $.noop)();
          }

          if (folio.isPurchasable) {
            purchase_transaction = this.purchase();
            purchase_transaction.completedSignal.addOnce(download);
            purchase_transaction.stateChangedSignal.add(function() {
              var states = App.api.transactionManager.transactionStates;
              if (purchase_transaction.state == states.CANCELED) {
                purchase_transaction.completedSignal.remove(download);
                (opts.cancelled || $.noop)();
              }
            });
          }
          else download();

          function download() {
            if (folio.isDownloadable) {
              dl_transaction = folio.download();
              dl_transaction.progressSignal.add(function() {
                (opts.download_progress || $.noop)(dl_transaction.progress);
              });
              dl_transaction.completedSignal.addOnce(complete);
            }
            else complete();
          }
        }
      };

      // LIBRARY METHODS ///////////////////////////////////////////////
      that.libraryService.get_touted_issue = function() {
        return _.head(this.get_visible());
      }
      that.libraryService.get_back_issues = function() {
        return _.tail(this.get_visible());
      }
      that.libraryService.get_visible = function() {
        // This is intended to be the primary method of getting the folios
        //    - will eventually take "sort_priority" into account when sorting
        //    - first item is the touted issue (always)
        var now = moment(),
            folios;

        folios = this.folioMap.sort(function(folio1, folio2) {
            return folio2.publicationDate - folio1.publicationDate;
        });

        folios = _.map(folios, function(folio) {
          var wrapped = wrap_object(folio, extra_folio_methods);
          wrapped.adb = adobe_feed[folio.productId];
          wrapped.tcm = tcm_feed[folio.productId];
          return wrapped; 
        });

        // remove folios with no broker (they also don't appear in the
        // library)
        folios = _.filter(folios, function(folio) { return folio.broker });

        // remove issues missing from the adobe data feed
        return _(folios).filter(function(folio) { return folio.adb });
      }
      that.libraryService.get_by_productId = function(product_id) {
        return _.find(this.get_visible(), function(folio) { 
          return folio.productId == product_id; 
        });
      }
      
    } 
    Wrapper.prototype = raw_api;

    var ts = new Date().getTime();
    function load_tcm_feed(cb) {
      function success(data) { cb(null, data) }
      settings.tcmfeed_image_root = settings.prod_tcmfeed_image_root;
      $.getJSON(settings.PRODUCTION_TCM_FEED, {t: ts}, success)
        .fail(function() {
          if (DEBUG) {
            settings.tcmfeed_image_root = settings.dev_tcmfeed_image_root;
            $.getJSON(settings.DEV_TCM_FEED, {t: ts}, success);
          }
        });
    }
    function load_adobe_feed(cb) {
      function success(data) { cb(null, data) }
      $.get(settings.adobeFeedUrl, success, "xml")
        .fail(function() {
          if (DEBUG) $.get(settings.adobeFeedUrl_dev, success, "xml");
        });
    } 

    async.parallel([load_tcm_feed, load_adobe_feed], function(err, results) {
      var api = new Wrapper(results[0], results[1]);
      cb(api);
    });
  }
  
})();
