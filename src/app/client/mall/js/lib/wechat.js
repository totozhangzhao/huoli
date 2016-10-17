import NativeAPI from "app/client/common/lib/native/native-api.js";
import shareUtil from "com/mobile/widget/wechat/util.js";
import wechatUtil from "com/mobile/widget/wechat-hack/util.js";
import loadScript from "com/mobile/lib/load-script/load-script.js";
import * as mallUitl from "app/client/mall/js/lib/util.js";

export function shareFromApp(options = {}) {
  const shareInfo = shareUtil.getShareInfo();
  NativeAPI.invoke("sharePage", {
    title: shareInfo.title,
    desc: shareInfo.desc,
    link: shareInfo.link,
    imgUrl: shareInfo.imgUrl,
    shareto: options.type || "weixin,pengyouquan",
    type: options.type || "weixin,pengyouquan"
  }, (err, result) => {
    if (err) {
      window.console.log(err.message);
      return;
    }

    if (options.callback) {
      options.callback(err, result);
    }
  });
}

export function initNativeShare(options = {}) {
  NativeAPI.invoke("updateHeaderRightBtn", {
    action: "show",
    text: "分享"
  }, err => {
    if (err) {

      // 页面有可能被分享出去，不能在外部(如微信)弹出 Internal error
      window.console.log(err.message);
      return;
    }
  });

  NativeAPI.registerHandler("headerRightBtnClick", () => {
    shareFromApp(options);
  });
}

export function initWeChatShare(title) {
  wechatUtil.setTitle(title || document.title);
  loadScript(`${window.location.origin}/fe/com/mobile/widget/wechat/wechat.bundle.js`);
}

/**
 * [initShare 设置分享信息]
 * @param  {Object} options [wechatshare 分享信息]
 *                          [useAppShare 是否在客户端内显示分享按钮 true 显示 ; false 不显示]
 */
export function initShare(options = {}) {
  let shareInfo = options.wechatshare;

  const isShareInfoVaild = Boolean(shareInfo && shareInfo.title);

  if ( isShareInfoVaild ) {
    wechatUtil.setShareInfo(shareInfo);
  } else if ( !isShareInfoVaild && !shareUtil.hasShareHtml() ) {
    const isHangban = mallUitl.isHangbanFunc();
    shareInfo = {
      title: isHangban ? "伙力·航班商城" : "伙力·高铁商城",
      desc : "你的时间非常值钱 这里选货非常省时",
      link : `${window.location.origin}/fe/app/client/mall/index.html`,
      img  : isHangban ? "http://cdn.rsscc.cn/guanggao/mall/wechat/w-hb.jpg" : "http://cdn.rsscc.cn/guanggao/mall/wechat/w-gt.jpg"
    };
    wechatUtil.setShareInfo(shareInfo);
  }

  if ( !shareUtil.hasShareHtml() ) {
    return;
  }

  if ( wechatUtil.isWechatFunc() ) {
    initWeChatShare(options.title);
  }

  if ( mallUitl.isAppFunc() && options.useAppShare ) {
    initNativeShare(options);
  }
}
