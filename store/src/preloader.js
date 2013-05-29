
App.preload = function(cb) {
  new Image().src = settings.asset_root + "images/mask.gif";
  new Image().src = settings.asset_root + "images/" + settings.brandCode + "/curl.png";
  new Image().src = settings.asset_root + settings.cover_spacer_img;
  (cb||$.noop)();
}
