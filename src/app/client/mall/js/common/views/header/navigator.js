import $           from "jquery";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import template from "app/client/mall/tpl/common/header/navigator.tpl";
import * as widget from "app/client/mall/js/lib/common.js";

class Navigator{
  constructor(options) {
    options = options || {};
    if(options && options.el) {
      this.container = $(options.el);
    }else{
      this.container = $("body");
    }
    this.isRender = false;
    this.el= template({mallUtil:mallUtil});
  }
  static isApp() {
    return mallUtil.isAppFunc();
  }
  static isHB() {
    return mallUtil.isHangbanFunc();
  }
  render(delay) {
    if(this.isRender) {
      return;
    }
    this.isRender = true;

    function initView() {
      this.container
      // .addClass('common-switch-padding')
      .prepend(this.el);

      $(".common-switch-nav")
        .find(".js-index-page")
          .on("click", e => {
            e.preventDefault();
            widget.redirectPage(`/fe/app/client/mall/index.html`);
          })
        .end()
        .find(".js-switch")
          .on("click", e => {
            e.preventDefault();
            let origin = window.location.origin;
            if ( /hbmall/.test(origin) ) {
              origin = origin.replace("hbmall", "mall");
            } else {
              origin = origin.replace("mall", "hbmall");
            }
            widget.redirectPage(`${origin}/fe/app/client/mall/index.html`);
          });
    }

    if( !mallUtil.isAppFunc() ) {
      setTimeout(() => {
        initView.call(this);
      }, delay || 0 );
    }
  }

}
export default Navigator;
