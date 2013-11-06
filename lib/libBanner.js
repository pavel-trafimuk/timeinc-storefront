window.libBanner = new (function() {
  // lib is the object that will be stored in window.libBanner
  var lib = this;

  /////////////////////////////////////////////////////////////////////////// 
  // API Support
  ///////////////////////////////////////////////////////////////////////////

  lib.api = (typeof adobeDPS != "undefined") ? adobeDPS : window.MockAPI;

  function wait_for_api(method_name, fn) {
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
      
  if (lib.api) {
    wait_for_api("buy_issue", function(product_id, dossier_id) {
      var purchase_transaction = lib.api.libraryService.folioMap.getByProductId(product_id).purchase();
      purchase_transaction.stateChangedSignal.add(function() {
        var states = lib.api.transactionManager.transactionStates;
        if (purchase_transaction.state == states.FINISHED) {
          if (dossier_id) {
            var protocol = "dps." + settings.adobeAppId + "://";
            window.location.href = protocol + "v1/folio/" + product_id + "/" + dossier_id;
          }
        }
      });
    });
    wait_for_api("buy_sub", function(product_id) {
      lib.api.receiptService.availableSubscriptions[product_id].purchase();
    });
    wait_for_api("track_user_action", function(evt_name, page_name) {
      /* Example values:
      *    evt_name: "banner_taps_subscribe" (subscribe/buyissue/downloadfree)
      *    page_name: "Library|Banner|Subscriber" (Subscriber/Nonsubscriber)
      */
      lib.api.analyticsService.trackCustomEvent("customEvent3", {
        customVariable3: evt_name,
        customVariable4: page_name
      });
    });
  }

  ///////////////////////////////////////////////////////////////////////////
  // Slider
  ///////////////////////////////////////////////////////////////////////////
  var SlideshowGallery = lib.SlideshowGallery = function() {
    this.currentTranslation = 0;
    this.sliderWidth = document.querySelector('.carousel').offsetWidth;
    this.slidesObject = document.querySelectorAll('.slide');
    
    for (var i = 0; i < this.slidesObject.length; i++){
       this.slidesObject[i].style.width = this.sliderWidth + 'px';
    }
    
    this.slides = document.querySelector('.slides');
    this.numSlides = this.slides.children.length;
    this.slides.style.width = (this.sliderWidth * this.numSlides) + 'px';
  };

  SlideshowGallery.prototype.slideNext = function() {
    this.currentTranslation -= this.sliderWidth;
    
    // Wrap around.
    if (this.currentTranslation == this.numSlides * -this.sliderWidth) {
      this.currentTranslation = 0;
    }

    this.slides.style.webkitTransform = 
      'translate3d(' + this.currentTranslation + 'px, 0 ,0)';
    return this;
  };

  SlideshowGallery.prototype.slidePrev = function() {
    this.currentTranslation += this.sliderWidth;

    // Wrap around.
    if (this.currentTranslation == this.sliderWidth) {
      this.currentTranslation = (this.numSlides - 1) * -this.sliderWidth;
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
      startTime = +new Date;

      startX = ev.changedTouches[0].pageX;

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

      if (newTranslation < minTranslation) {
        newTranslation = minTranslation + ((newTranslation - minTranslation) * 0.4);
      }
      else if (newTranslation > 0) {
        newTranslation *= 0.4;
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
    nearest_slide = Math.max(Math.min(nearest_slide, this.slidesObject.length-1), 0);

    this.currentTranslation = -1 * nearest_slide * this.sliderWidth;
    this.slides.style.webkitTransform =
      'translate3d(' + this.currentTranslation + 'px, 0 ,0)';

    // don't call the callback for 100ms extra to allow for any lag in the animation
    setTimeout(cb, 350);
  }

})();
