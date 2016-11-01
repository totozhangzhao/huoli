import $  from "jquery";
import _        from "lodash";
import * as widget   from "app/client/mall/js/lib/common.js";
// import * as mallUtil from "app/client/mall/js/lib/util.js";
// import tmpl from "app/client/mall/tpl/back-to-top.tpl";

class BackTop {
  
  // 暂停使用
  constructor() {}

  // constructor(options) {
  //   this.config = {
  //     isApp: mallUtil.isAppFunc(),
  //     isHome: false
  //   };
  //   _.extend(this.config, options);
    
  //   this.view = $( tmpl( this.config ) );
  //   this.bindEvents();
  // }

  bindEvents() {
    this.view
      .hide()
      .appendTo('body')
      .on("click", ".js-top", e => {
        e.preventDefault();
        $("html, body")
          .animate({scrollTop: 0}, 333);
      })
      .on("click", ".js-assistance", (e) => {
        widget.createAView(e);
      });
    if(this.config.isHome) {
      const $win = $(window);
      const showBox = _.debounce(() => {
        if ( $win.scrollTop() > 100 ) {
          this.view.fadeIn(333);
        } else {
          this.view.fadeOut(333);
        }
      }, 150);

      $win.on("scroll", showBox);  
    }else {
      this.view.fadeIn(333);
    }
    
  } 
}

export default BackTop;
