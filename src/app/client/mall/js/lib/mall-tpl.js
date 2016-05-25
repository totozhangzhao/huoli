exports.getJsClass = function(item) {
  var jsClass = "js-new-page";

  if ( String(item.action) === "3" ) {
    jsClass = "js-get-url";
  }

  return jsClass;
};

exports.getBlockUrl = function(item) {
  var urlMap = {
    "9": "/fe/app/client/mall/html/detail-page/goods-detail.html?action=9",
    "0": "/fe/app/client/mall/html/detail-page/goods-detail.html",
    "1": "/fe/app/client/mall/html/share-page/share.html",
    "4": "/fe/app/client/mall/html/active-page/scratch-card/main.html",
    "5": "/fe/app/client/mall/html/menu/category.html",
    "6": "/fe/app/client/mall/html/active-page/crowd/main.html",
    "7": "/fe/app/client/mall/html/menu/grab.html",
    "8": "/fe/app/client/mall/html/menu/new-category.html",
    "5006": "/fe/app/client/mall/html/menu/promotion.html"
    // "9": "/fe/app/client/mall/html/shake/shake.html"
  };
  var jsUrl;

  if ( String(item.action) === "2" ) {
    jsUrl = item.url;
  } else {

    /* jshint scripturl: true */
    jsUrl = urlMap[item.action] || "javascript:;";
  }

  return jsUrl;
};
