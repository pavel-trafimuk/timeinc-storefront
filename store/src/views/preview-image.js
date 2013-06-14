(function() {
  App.views.IssuePreviewImage = Backbone.View.extend({
    className: "issue-preview-image",
    template: Handlebars.templates["issue-preview-image.tmpl"],
    events: {
      "click .close-btn": "close"
    },
    initialize: function(folio) {
      var that = this;
      this.folio = folio;
      this.render(function() {
        // don't allow multiple image previews at once
        if ($(".issue-preview-image").length) return;

        that.$el.appendTo("body");
        that.animate();
      });
      $(window).on("resize.image-preview", _.bind(this.render, this));
    },
    render: function(cb) {
      cb = cb || $.noop;
      var that = this,
          $window = $(window),
          w = $window.width(),
          h = $window.height(),
          is_portrait = h > w;

      this.get_img(w, h, is_portrait, function(img_url) {
          var cx = {
            settings: settings, 
            folio: _.bindAll(that.folio),
            portrait: is_portrait,
            img: { width: w, height: h, url: img_url }
          };
          that.$el.html(that.template(cx));
          cb();
      });
      return this;
    },
    get_img: function(w, h, p, cb) {
      cb("http://content.dreader.timeinc.net/issues/preview/"+this.folio.productId+"/image_vertical.png")
    },
    animate: function(cb) {
      cb = cb || $.noop;
      var h = $(window).height(),
          $img = this.$(".scrollable img"); 

      $img.hide();
      this.$(".container")
        .transition({y: h}, 0)
        .transition({y: 0}, 500);

      setTimeout(function() {
        $img.show();
        cb();
      }, 550);
    },
    close: function() {
      var that = this,
          animation_duration = 350;

      this.$(".container").transition({y: $(window).height()}, animation_duration);

      setTimeout(function() {
        that.remove();
        $(window).off("resize.image-preview");
      }, animation_duration);
    }
  });

})();