import $           from "jquery";
// import _           from "lodash";
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
  render() {
    if( !mallUitl.isAppFunc() ) {
      // window.console.log(mallUitl.isHangbanFunc());
      $("body")
      .addClass('common-switch-padding')
      .prepend(template({mallUitl:mallUitl}));
    }
  }

}
export default Navigator;
