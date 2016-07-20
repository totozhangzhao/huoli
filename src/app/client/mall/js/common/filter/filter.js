import * as mallWechat from "app/client/mall/js/lib/wechat.js";
import Navigator from "app/client/mall/js/menu/header/navigator.js";

export function before() {

}

export function after(action) {
  if ( !/-detail|-desc|get-url/.test(action) ) {
    mallWechat.initShare();
  }

  if ( /get-url/.test(action) ) {
    document.title = "";
  } else {
    const nav = new Navigator();
    nav.render(100);
  }
}
