import NativeAPI from "app/client/common/lib/native/native-api.js";
import shareUtil from "com/mobile/widget/wechat/util.js";
import wechatUtil from "com/mobile/widget/wechat-hack/util.js";
import loadScript from "com/mobile/lib/load-script/load-script.js";
import * as mallUitl from "app/client/mall/js/lib/util.js";

export function shareFromApp(callback) {
  const shareInfo = shareUtil.getShareInfo();

  NativeAPI.invoke("sharePage", {
    title: shareInfo.title,
    desc: shareInfo.desc,
    link: shareInfo.link,
    imgUrl: shareInfo.imgUrl
  }, (err, result) => {
    if (err) {
      window.console.log(err.message);
      return;
    }

    if (callback) {
      callback(err, result);
    }
  });
}

export function initNativeShare(callback) {
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
    shareFromApp(callback);
  });
}

export function initWeChatShare(title) {
  wechatUtil.setTitle(title || document.title);
  loadScript(`${window.location.origin}/fe/com/mobile/widget/wechat/wechat.bundle.js`);
}

export function initShare(opts) {
  let options = opts || {};
  let shareInfo = options.wechatshare;
  const isShareInfoVaild = Boolean(shareInfo && shareInfo.title);

  if ( isShareInfoVaild ) {
    wechatUtil.setShareInfo(shareInfo);
  } else if ( !isShareInfoVaild && !shareUtil.hasShareHtml() ) {
    const isHangban = mallUitl.isHangbanFunc();
    shareInfo = {
      title: isHangban ? "伙力·航班商城" : "伙力·高铁商城",
      desc : "伙力商城 管家定制好货 专注出行场景化电商",
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

  if ( mallUitl.isAppFunc() && options.appShare ) {
    initNativeShare();
  }
}
