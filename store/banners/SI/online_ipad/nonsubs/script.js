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

//initiate the gallery
var gallery = new SlideshowGallery();

//set the interval
var timer = window.setInterval(function(){
   gallery.slideNext();   
},5000);

