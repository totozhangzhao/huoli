import _ from "lodash";
import Backbone from "backbone";
import * as widget from "app/client/mall/js/lib/common.js";

const AppView = Backbone.View.extend({
  el: "#goods-desc",
  initialize(commonData) {
    _.extend(this, commonData);
  },
  resume(opts) {
    if (opts.previousView !== "goods-detail") {

      // 为了维护 router 中 previousView 的状态，使用 setTimeout
      setTimeout(() => {
        this.router.switchTo("goods-detail");
      }, 0);
      return;
    }

    if (this.title) {
      widget.updateViewTitle(this.title);
    }
    this.render();
  },
  render() {
    const tmpl = require("app/client/mall/tpl/detail-page/goods-desc.tpl");

    this.$el.html(tmpl({
      data: this.cache.goods.detail
    }));
  }
});

export default AppView;
