
App.preload = function(cb) {
  function img(path) {
    var i = new Image;
    i.src = settings.asset_root + path;
    App.preload.imgs.push(i);
  }

  img("images/mask.gif");
  img("images/" + settings.brandCode + "/curl.png");
  img(settings.cover_spacer_img);

  (cb||$.noop)();
}
App.preload.imgs = [];
