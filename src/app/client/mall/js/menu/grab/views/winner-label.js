import $ from "jquery";
import Backbone from "backbone";
import * as widget from "app/client/mall/js/lib/common.js";
import * as mallUitl from "app/client/mall/js/lib/util.js";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import Marquee from "com/mobile/widget/marquee/marquee.js";

const WinnerView = Backbone.View.extend({

  el: "#winner-label",

  template: require("app/client/mall/tpl/menu/grab/grab-winner.tpl"),

  initialize() {
    this.render();
  },

  render() {
    this.$el.html(this.template({
      dataList: this.model,
      pId: UrlUtil.parseUrlSearch().productid,
      appName: mallUitl.getAppName(),
      tplUtil
    }));
    new Marquee({
      box: $("#winner-label .crowd-nav-tip"),
      items: $("#winner-label .crowd-nav-tip .marquee-item"),
      speed: 800,
      interval: 5000,
      direction: 2
    });
    return this.$el;
  },

  createNewPage(e) {
    widget.createAView(e);
  }
});
export default WinnerView;
