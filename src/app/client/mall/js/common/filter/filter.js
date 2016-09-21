import * as mallWechat from "app/client/mall/js/lib/wechat.js";
import Navigator from "app/client/mall/js/common/views/header/navigator.js";
const nav = new Navigator();
export function before() {

}

// hideNavigator 不使用导航条
// notUseShare 不使用统一分享
export function after(action, options) {
  if ( !/-detail|-desc|get-url/.test(action) && !options.notUseShare) {
    mallWechat.initShare();
  }

  if ( /get-url/.test(action) ) {
    document.title = "";
  } else if(!options.hideNavigator) {
    nav.render(100);
  }
}
