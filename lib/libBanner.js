window.libBanner = new (function() {
  // lib is the object that will be stored in window.libBanner
  var lib = this;

  ////////////////////////////////////////////////////////////////////// 
  // API Support
  ////////////////////////////////////////////////////////////////////// 

  lib.api = (typeof adobeDPS == "undefined") ? window.MockAPI : adobeDPS;

  // use
  lib.buy_sub = function(product_id) { 
    setTimeout(function() {
      lib.buy_sub(product_id)
    }, 500);
  };
  lib.api.initializationComplete.addOnce(function() {
    lib.buy_sub = function(product_id) {
      lib.api.receiptService.availableSubscriptions[product_id].purchase();
    }
  });


  ////////////////////////////////////////////////////////////////////// 
  // Slider
  ////////////////////////////////////////////////////////////////////// 
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

    this.slides.style.webkitTransform = 'translate3d(' + this.currentTranslation + 'px, 0 ,0)';
    return this;
  };

  SlideshowGallery.prototype.slidePrev = function() {
    this.currentTranslation += this.sliderWidth;

    // Wrap around.
    if (this.currentTranslation == this.sliderWidth) {
      this.currentTranslation = (this.numSlides - 1) * -this.sliderWidth;
    }
    
    this.slides.style.webkitTransform = 'translate3d(' + this.currentTranslation + 'px, 0 ,0)';
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
        startTouchID = null;
    
    slides.addEventListener("touchstart", function(ev) { 
      if (ev.changedTouches.length != 1) return;

      gallery.cancelAutoSlide()
      startTouchID = ev.changedTouches[0].identifier;

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

      slides.style.webkitTransform = 'translate3d(' + (gallery.currentTranslation + deltaX) + 'px, 0 ,0)';
    });

    slides.addEventListener("touchend", function(ev) { 
      var done = false;
      for (var i=ev.changedTouches.length; i--;) {
        if (ev.changedTouches[i].identifier == startTouchID) done = true;
      }

      if (!done) return;
      
      startTouchID = null;
      gallery.currentTranslation += deltaX;
      gallery.slideToNearest(function() {
        slides.style.webkitTransition = "1s all";
        gallery.slideEvery();
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
    setTimeout(cb, 300);
  }

})();
