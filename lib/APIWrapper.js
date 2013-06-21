(function() {
  /* Dependencies:
   *   - underscore.js
   *   - async.js
   *   - jQuery
   *
   */
  
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
        "get_deeplink": function(dossier_id) {
          var protocol = "dps." + settings.adobeAppId + "://";
          return protocol + "v1/folio/" + this.productId + "/" + dossier_id;
        },
        "goto_dossier": function(dossier_id) {
          window.location.href = this.get_deeplink(dossier_id);
        },
        "get_welcome_imgs": function() {
          function tcmimg(path) {
            return path ? settings.tcmfeed_image_root+path : null
          };
          var fallback = [null, this.get_cover_img()],
              imgs = {portrait: [], landscape: []};

          if (this.tcm) {
            imgs.portrait[0] = tcmimg(this.tcm.portrait_intro_img);
            imgs.portrait[1] = tcmimg(this.tcm.portrait_welcome_img);
            imgs.landscape[0] = tcmimg(this.tcm.landscape_intro_img);
            imgs.landscape[1] = tcmimg(this.tcm.landscape_welcome_img);
          }
          if (!_.any(imgs.portrait)) {
            if (_.any(imgs.landscape)) imgs.portrait = imgs.landscape;
            else imgs.portrait = fallback;
          }
          if (!_.any(imgs.landscape)) {
            if (_.any(imgs.portrait)) imgs.landscape = imgs.portrait;
            else imgs.landscape = fallback;
          }
          return imgs;
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
        "_view": function() {
          var folio = this;
          setTimeout(function(){ folio.view() }, 250);
        },
        "view_or_preview": function(opts) {
          opts = opts || {};
          var folio = this;

          function try_to_view(fallback) {
            fallback = fallback || $.noop;
            if (folio.isViewable) {
              (opts.complete||$.noop)();
              folio._view();
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
                  function progress_cb() {
                    (opts.download_progress||$.noop)(transaction.progress);
                    try_to_view();
                  }
                  transaction.progressSignal.add(progress_cb);
                  transaction.stateChangedSignal.add(progress_cb);
                }
                else {
                  console.log("ERROR: folio has no content preview!! folio: " + folio.productId);
                  alert("Err: NO CONTENT PREVIEW");
                }
              });
            });
          });

        },
        "get_coverdate": function() {
          return moment(this.adb.find("coverDate").text());
        },
        "download_and_view": function(opts) {
          opts = opts || {};
          var folio = this;
          
          function complete() {
            (opts.complete || $.noop)();
            folio._view();
          }

          if (folio.isDownloadable) {
              dl_transaction = folio.download();
              dl_transaction.progressSignal.add(function() {
                (opts.download_progress || $.noop)(dl_transaction.progress);
                if (folio.isViewable) {
                  folio._view();
                }
              });
              dl_transaction.completedSignal.addOnce(complete);
            }
          else complete();

        },
        "purchase_and_download": function(opts) {
          opts = opts || {};
          
          // valid values: false, "asap", "done"
          //   asap is opportunistic
          //   done will go to view when download completes
          //   false does not send the user into the folio
          if (opts.goto_view === undefined) opts.goto_view = "asap";

          var folio = this;
          
          function complete() {
            if (opts.goto_view !== false) folio._view();
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
                if (opts.goto_view == "asap" && folio.isViewable) {
                  complete();
                }
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
      that.libraryService._get_latest_issue = function() {
        return _.max(this.folioMap.sort(), function(folio) {
          return moment(folio.publicationDate);
        });
      }
      that.libraryService.get_back_issues = function() {
        return _.tail(this.get_visible());
      }
      that.libraryService.get_visible = function() {
        // This is intended to be the primary method of getting the folios
        //    - will eventually take "sort_priority" into account when sorting
        //    - first item is the touted issue (always)
        var now = moment(),
            folios = this.folioMap.sort(),
            latest_folio = this._get_latest_issue();

        function priority(folio) {
          if (folio.id === latest_folio.id) return 100;
          try { return folio.tcm.sort_priority; }
          catch (e) { return 0; }
        }
        function comp(x, y) { 
          if (x == y) return 0; 
          else return x > y ? 1 : -1;
        }

        folios = _.chain(folios)
          .map(function(folio) {
            var wrapped = wrap_object(folio, extra_folio_methods);
            wrapped.adb = adobe_feed[folio.productId];
            wrapped.tcm = tcm_feed[folio.productId];
            return wrapped; 
          }).filter(function(folio) { 
            // remove issues missing from the adobe data feed
            return folio.broker;
          }).filter(function(folio) { 
            return folio.adb;
          }).value().sort(function(folio1, folio2) {
            var priority_comp = comp(priority(folio2), priority(folio1));
            if (priority_comp === 0) {
              return comp(folio2.get_coverdate(), folio1.get_coverdate());
            }
            else return 2*priority_comp;
          });

        return folios;
      }
      that.libraryService.get_by_productId = function(product_id) {
        return _.find(this.get_visible(), function(folio) { 
          return folio.productId == product_id; 
        });
      }

      // USER METHODS //////////////////////////////////////////////////
      that.authenticationService.user_is_subscriber = function() {
        var is_sub = false,
            latest_issue = that.libraryService._get_latest_issue(),
            entitlementTypes = that.receiptService.entitlementTypes;
        _(that.receiptService.availableSubscriptions).each(function(receipt) {
          if (receipt.isActive()) is_sub = true;
        });
        // TODO: Make this work better:
        //   Currently we only consider logged-in users to be subscribed if
        //   the latest issue is a third-party entitlement (i.e., via lucie).
        //   This completely falls over if the latest issue is free, when
        //   entitlementType will be entitlementTypes.FREE - and it also
        //   can't tell your subscription has expired until the next month's 
        //   issue is released, so there's a window of up to 30 days when the
        //   user is not subscribed anymore but this method still says they are
        if (latest_issue.entitlementType === entitlementTypes.THIRD_PARTY) {
          is_sub = true;
        }
        return is_sub;
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
    function ensure_folios_are_loaded(cb) {
      cb = _.partial(cb, null);
      if (raw_api.libraryService.currentTransaction) {
        raw_api.libraryService.currentTransaction.completeSignal.add(cb);
      }
      else if (_.size(raw_api.libraryService.internal) == 0) {
        transaction = raw_api.libraryService.updateLibrary();
        transaction.completedSignal.add(cb);
      }
      else cb();
    }

    async.parallel([
        load_tcm_feed, load_adobe_feed, ensure_folios_are_loaded
      ], 
      function(err, results) {
        var api = new Wrapper(results[0], results[1]);
        cb(api);
    });
  }
  
})();
