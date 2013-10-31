// SlideshowGallery constructor function. This will instantiate a new
// object of type SlideShowGallery.
var SlideshowGallery = function() {
  // The distance the gallery has been translated (slid) so far in pixels. 
  this.currentTranslation = 0;
  
  // The width of a single slide (image) in pixels.
  this.sliderWidth = document.querySelector('.carousel').offsetWidth;
  
    
  this.slidesObject = document.querySelectorAll('.slide');
  
  //loop trough all the slides
  for(var i = 0; i < this.slidesObject.length; i++){
  
     //and make each slide the same width as the parent - carousel 
     this.slidesObject[i].style.width = this.sliderWidth + 'px';
  }
  
  // A reference to the child DIV in the HTML.
  this.slides = document.querySelector('.slides');
  
  // Count the total number of slides
  this.numSlides = this.slides.children.length;
  
  // Make .slides DIV wide enough to contain all the slides 
  this.slides.style.width = (this.sliderWidth * this.numSlides) + 'px';
};

// Slide the gallery next by one image width.
SlideshowGallery.prototype.slideNext = function() {
  // Decrease the current translation by one slide (image) width.
  this.currentTranslation -= this.sliderWidth;
  
  // Wrap around.
  if (this.currentTranslation == this.numSlides * -this.sliderWidth) {
    this.currentTranslation = 0;
  }
  
  // Actually perform the animation by setting CSS transform style.
  this.slides.style.webkitTransform = 'translate3d(' + this.currentTranslation + 'px, 0 ,0)';
};

// Slide the gallery previous by one image width.
SlideshowGallery.prototype.slidePrev = function() {
  this.currentTranslation += this.sliderWidth;

  if (this.currentTranslation == this.sliderWidth) {
    this.currentTranslation = (this.numSlides - 1) * -this.sliderWidth;
  }
  
  this.slides.style.webkitTransform =
      'translate3d(' + this.currentTranslation + 'px, 0 ,0)';
};

SlideshowGallery.prototype.slideEvery = function(ms) {
  var that = this;
  this.slide_every_delay = this.slide_every_delay || ms;
  this.slide_interval = window.setInterval(function(){
    that.slideNext();   
  }, this.slide_every_delay);
};

SlideshowGallery.prototype.cancelAutoSlide = function() {
  window.clearInterval(this.slide_interval);
}

SlideshowGallery.prototype.enableTouch = function() {
  var gallery = this,
      slides = this.slides,
      startX = 0,
      deltaX = 0,
      startTouchID = null;
  
  slides.addEventListener("touchstart", function(ev) { 
    if (ev.changedTouches.length != 1) return;

    console.log("asdf");
    gallery.cancelAutoSlide()
    startTouchID = ev.changedTouches[0].identifier;

    startX = ev.changedTouches[0].pageX;

    console.log(startTouchID);
    console.log(startX);
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

    slides.style.webkitTransform =
      'translate3d(' + (gallery.currentTranslation + deltaX) + 'px, 0 ,0)';
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

//initiate the gallery
var gallery = new SlideshowGallery();
gallery.enableTouch();
gallery.slideEvery(5000);

