import * as mallWechat from "app/client/mall/js/lib/wechat.js";
import Navigator from "app/client/mall/js/common/views/header/navigator.js";
const nav = new Navigator();
export function before() {

}

export function after(action) {
  if ( !/-detail|-desc|get-url/.test(action) ) {
    mallWechat.initShare();
  }

  if ( /get-url/.test(action) ) {
    document.title = "";
  } else {
    nav.render(100);
  }
}
