var qs = function(o) {
  return document.querySelector(o);
};

exports.hasShareHtml = function() {
  return !!qs("#__wechat_share");
};

exports.getShareInfo = function() {
  var elemTitle = qs("#__wechat_title");
  var elemDesc  = qs("#__wechat_desc");
  var elemLink  = qs("#__wechat_link");
  var elemImg   = qs("#__wechat_img");
  var data = {
    title : elemTitle && elemTitle.textContent,
    desc  : elemDesc  && elemDesc.textContent,
    link  : elemLink  && elemLink.textContent,
    imgUrl: elemImg   && elemImg.textContent
  };

  return {
    title : data.title  || document.title,
    desc  : data.desc   || "查看详情",
    link  : data.link   || window.location.href,
    imgUrl: data.imgUrl || ""
  };
};
