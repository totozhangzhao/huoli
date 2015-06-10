var $     = require("jquery");
var jsSHA = require("com/mobile/lib/sha1/sha1.js");
var wx    = require("com/mobile/lib/wechat/jweixin-1.0.0.js");

var Wechat = function() {};

Wechat.prototype = {
  constructor: this,
  getTicket: function(url) {
    var d = $.Deferred(),
      xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          d.resolve(JSON.parse(xhr.responseText));
        } else {
          d.reject();
        }
      }
    };
    xhr.open("get", url);
    xhr.send(null);
    return d.promise();
  },
  randomWord: function(len) {
    var str = "",
      range,
      i = 0,
      o,
      arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    range = (len && typeof len === "number") ? len : (Math.round(Math.random() * (32 - 8)) + 8);
    for (; i < range; i++) {
      o = Math.round(Math.random() * (arr.length - 1));
      str += arr[o];
    }
    return str;
  },
  timeStamp: function() {
    var t = +new Date();
    return parseInt(t / 1000, 10);
  },
  string1: function(j, n, t, u) {
    var o = "jsapi_ticket=" + j + "&noncestr=" + n + "&timestamp=" + t + "&url=" + u,
      e = o.split("#")[0],
      s = new jsSHA(e, "TEXT"),
      h = s.getHash("SHA-1", "HEX");
    return h;
  },
  config: function(a, t, n, s) {
    var d = this.debug();
    wx.config({
      debug: d,
      appId: a,
      timestamp: t,
      nonceStr: n,
      signature: s,
      jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "translateVoice", "startRecord", "stopRecord", "onRecordEnd", "playVoice", "pauseVoice", "stopVoice", "uploadVoice", "downloadVoice", "chooseImage", "previewImage", "uploadImage", "downloadImage", "getNetworkType", "openLocation", "getLocation", "hideOptionMenu", "showOptionMenu", "closeWindow", "scanQRCode", "chooseWXPay", "openProductSpecificView", "addCard", "chooseCard", "openCard"]
    });
  },
  shareData: function() {
    var qs = function(o) {
      return document.querySelector(o);
    };

    var data = {
      title : qs("#__wechat_title") && qs("#__wechat_title").textContent,
      desc  : qs("#__wechat_desc")  && qs("#__wechat_desc").textContent,
      link  : qs("#__wechat_link")  && qs("#__wechat_link").textContent,
      imgUrl: qs("#__wechat_img")   && qs("#__wechat_img").textContent
    };

    return {
      title : data.title  || document.title,
      desc  : data.desc   || "",
      link  : data.link   || window.location.href,
      imgUrl: data.imgUrl || ""
    };
  },
  shareQQ: function() {
    wx.onMenuShareQQ(this.shareData());
  },
  shareTimeline: function() {
    wx.onMenuShareTimeline(this.shareData());
  },
  shareAppMessage: function() {
    wx.onMenuShareAppMessage(this.shareData());
  },
  shareWeibo: function() {
    wx.onMenuShareWeibo(this.shareData());
  },
  debug: function() {
    var urlQ = function(s) {
      var sUrl = window.location.search.substr(1);
      var r = sUrl.match(new RegExp("(^|&)" + s + "=([^&]*)(&|$)"));
      return (r === null ? null : decodeURI(r[2]));
    };
    return urlQ("debug") ? true : false;
  }
};

module.exports = new Wechat();
