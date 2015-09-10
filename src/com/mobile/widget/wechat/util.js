var qs = function(o) {
  return document.querySelector(o);
};

exports.hasShareInfo = function() {
  return !!qs("#__wechat_share");
};

exports.getShareInfo = function() {
  var data = {
    title : qs("#__wechat_title") && qs("#__wechat_title").textContent,
    desc  : qs("#__wechat_desc")  && qs("#__wechat_desc").textContent,
    link  : qs("#__wechat_link")  && qs("#__wechat_link").textContent,
    imgUrl: qs("#__wechat_img")   && qs("#__wechat_img").textContent
  };

  return {
    title : data.title  || document.title,
    desc  : data.desc   || "查看详情",
    link  : data.link   || window.location.href,
    imgUrl: data.imgUrl || ""
  };
};
