var wechat = require("com/mobile/widget/wechat/wechat.js");
var wx     = require("com/mobile/lib/wechat/jweixin-1.0.0.js");

var link = "//jp.rsscc.com/promotion/wechat/ticket";
var a    = "wxfd7a32d944c9b3f5";

wechat.getTicket(link).then(function(d) {
  var j = d.ticket,
    n = wechat.randomWord(),
    t = wechat.timeStamp(),
    u = window.location.href,
    s = wechat.string1(j, n, t, u);
  //console.log(j, n, t, u, s);
  wechat.config(a, t, n, s);
  wx.ready(function() {
    wechat.shareQQ();
    wechat.shareTimeline();
    wechat.shareAppMessage();
    wechat.shareWeibo();
  });
});
