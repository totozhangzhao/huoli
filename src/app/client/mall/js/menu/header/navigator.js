import $           from "jquery";
import * as mallUitl from "app/client/mall/js/lib/util.js";
import template from "app/client/mall/tpl/common/header/navigator.tpl";
class Navigator{
  constructor() {
    this.isRender = false;
    this.el= template({mallUitl:mallUitl});
  }
  static isApp() {
    return mallUitl.isAppFunc();
  }
  static isHB() {
    return mallUitl.isHangbanFunc();
  }
  render(delay) {
    if(this.isRender) {
      return;
    }
    this.isRender = true;
    if( !mallUitl.isAppFunc() ) {
      setTimeout(() => {
        $("body")
        // .addClass('common-switch-padding')
        .prepend(this.el);
      }, delay || 0 );
    }
  }

}
export default Navigator;
