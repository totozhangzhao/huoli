import $           from "jquery";

export function getWechatAuthUrl(pageUrl) {
  const authUrl = "http://wx.133.cn/hbrobot/wxoauth?" + $.param({
    pid: "602",
    ru: pageUrl || window.location.href
  });

  const wechatUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?" + $.param({
    appid: "wxfd7a32d944c9b3f5",
    redirect_uri: authUrl,
    response_type: "code",
    scope: "snsapi_base",
    state: "STATE",
    connect_redirect: "1"
  }) + "#wechat_redirect";

  return wechatUrl;
}
