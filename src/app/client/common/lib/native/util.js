var wechatUtil = require("com/mobile/widget/wechat-hack/util.js");

exports.isApp = function() {
  return !wechatUtil.isWechat();
};
