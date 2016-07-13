import $           from "jquery";
import * as mallUitl from "app/client/mall/js/lib/util.js";
import template from "app/client/mall/tpl/common/header/navigator.tpl";
class Navigator{
  constructor() {
  }
  static isApp() {
    return mallUitl.isAppFunc();
  }
  static isHB() {
    return mallUitl.isHangbanFunc();
  }
  render(delay) {
    if( !mallUitl.isAppFunc() ) {
      setTimeout(() => {
        $("body")
        // .addClass('common-switch-padding')
        .prepend(template({mallUitl:mallUitl}));
      }, delay || 0 );
    }
  }

}
export default Navigator;
