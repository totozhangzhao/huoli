exports.getJsClass = function(item) {
  var jsClass = "js-new-page";
  if ( String(item.action) === "3" ) {
    jsClass = "js-get-url";
  }
  return jsClass;
};

exports.getBlockUrl = function(item) {
  var jsUrl = "javascript:;";

  if ( String(item.action) === "0" ) {
   jsUrl = "/fe/app/client/mall/html/detail-page/goods-detail.html";
  } else if ( String(item.action) === "1" ) {
   jsUrl = "/fe/app/client/mall/html/share-page/share.html";
  } else if ( String(item.action) === "2" ) {
   jsUrl = item.url;
  } else if ( String(item.action) === "4" ) {
   jsUrl = "/fe/app/client/mall/html/active-page/scratch-card/main.html";
  } else if ( String(item.action) === "5" ) {
   jsUrl = "/fe/app/client/mall/html/menu/category.html";
  }

  return jsUrl;
};
