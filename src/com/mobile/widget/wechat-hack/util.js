var $ = require("jquery");
var Util = require("com/mobile/lib/util/util.js");

exports.setTitle = function(title) {
  var doc = document;
  if (Util.getMobileSystem() === "iOS") {
    doc.title = title;

    var iframeTmp = doc.createElement("iframe");

    iframeTmp.style.display = "none";
    iframeTmp.src = window.domainName + "/0.html";

    iframeTmp.onload = function() {
      setTimeout(function() {
        iframeTmp.onload = null;
        doc.body.removeChild(iframeTmp);
      }, 0);
    };

    doc.body.appendChild(iframeTmp);
  } else {
    doc.title = title;
  }
};

exports.isWechatFunc = function() {
  var ua = window.navigator.userAgent.toLowerCase();
  return /micromessenger/.test(ua);
};

exports.setShareInfo = function(data) {
  var tmpl = require("com/mobile/widget/wechat-hack/tpl/share.tpl");
  $(tmpl({ data: data })).appendTo("body");
};
