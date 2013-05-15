(function() {
  
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
      var extra_folio_methods = {
        "get_welcome_imgs": function() {
          var img_url = this.get_cover_img();
          return [img_url, img_url];
        },
        "get_cover_img": function() { 
          return this.adb.find("libraryPreviewUrl").text() + "/issue.png" 
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

        folios = _.filter(folios, function(folio) { // remove not-yet-published issues
          return moment(folio.publicationDate).isBefore(now);
        });

        folios = _.map(folios, function(folio) {
          var wrapped = wrap_object(folio, extra_folio_methods);
          wrapped.adb = adobe_feed[folio.productId];
          wrapped.tcm = tcm_feed[folio.productId];
          return wrapped; 
        });

        // remove issues missing from the adobe data feed
        return _(folios).filter(function(folio) { return folio.adb });
      }
      
    } 

    Wrapper.prototype = raw_api;
    
    function load_tcm_feed(cb) {
      function success(data) { cb(null, data) }
      settings.tcmfeed_image_root = settings.prod_tcmfeed_image_root;
      $.getJSON(settings.PRODUCTION_TCM_FEED, success)
        .fail(function() {
          if (DEBUG) {
            settings.tcmfeed_image_root = settings.dev_tcmfeed_image_root;
            $.getJSON(settings.DEV_TCM_FEED, success);
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
