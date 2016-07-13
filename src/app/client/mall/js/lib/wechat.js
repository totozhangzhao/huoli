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
  loadScript(`${window.location.origin}/fe/com/mobile/widget/wechat/wechat.bundle.js`);

  if (title) {
    wechatUtil.setTitle(title);
  }
}

export function initShare(opts) {
  let options = opts || {};

  if (options.wechatshare) {
    wechatUtil.setShareInfo(options.wechatshare);
  }

  if ( !shareUtil.hasShareInfo() ) {
    return;
  }

  if ( wechatUtil.isWechatFunc() ) {
    initWeChatShare(options.title);
  }

  if ( mallUitl.isAppFunc() && options.appShare ) {
    initNativeShare();
  }
}
