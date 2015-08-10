var NativeAPI = require("app/client/common/lib/native/native-api.js");
var shareUtil = require("com/mobile/widget/wechat/util.js");

exports.initNativeShare = function() {
  NativeAPI.invoke("updateHeaderRightBtn", {
    action: "show",
    text: "分享"
  }, function(err) {
    if (err) {

      // 页面有可能被分享出去，不能在外部(如微信)弹出 Internal error
      window.console.log(err.message);
      return;
    }
  });

  NativeAPI.registerHandler("headerRightBtnClick", function() {
    exports.shareFromApp();
  });
};

exports.shareFromApp = function() {
  var shareInfo = shareUtil.getShareInfo();

  NativeAPI.invoke("sharePage", {
    title: shareInfo.title,
    desc: shareInfo.desc,
    link: shareInfo.link,
    imgUrl: shareInfo.imgUrl
  }, function(err) {
    if (err) {
      window.console.log(err.message);
      return;
    }
  });
};
