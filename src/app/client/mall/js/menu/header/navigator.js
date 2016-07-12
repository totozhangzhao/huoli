import $           from "jquery";
// import _           from "lodash";
import * as mallUitl from "app/client/mall/js/lib/util.js";
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
      $("body").prepend("<div><a href='/fe/app/client/mall/index.html'>首页</a></div>");
    }
  }

}
export default Navigator;
