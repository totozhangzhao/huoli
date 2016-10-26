// 微信送礼 查看页面
import $ from "jquery";
import _ from "lodash";
import * as mallPromise    from "app/client/mall/js/lib/mall-promise.js";
import * as mallUitl       from "app/client/mall/js/lib/util.js";
import logger         from "com/mobile/lib/log/log.js";
import {sendPost}     from "app/client/mall/js/lib/mall-request.js";
import UrlUtil        from "com/mobile/lib/url/url.js";
import ui             from "app/client/mall/js/lib/ui.js";
import * as widget    from "app/client/mall/js/lib/common.js";
import pageAction from "app/client/mall/js/lib/page-action.js";
// Views
import BaseView       from "app/client/mall/js/common/views/BaseView.js";

// templates
import template from "app/client/mall/tpl/gift/info.tpl";
const defaultTitle = "微信送礼-查看详情";
const ReceiveView = BaseView.extend({

  el: "#info",

  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl",
    "click .js-express": "gotoExpressInfoView",
    "click [data-tracking]"   : "gotoNewExpressInfoView"
  },

  initialize(commonData) {
    _.extend(this, commonData);
    this.$initial = ui.initial();
    logger.track(`${mallUitl.getAppName()}PV`, "View PV", defaultTitle);
  },

  render() {
    this.$initial.hide();
    this.$el.html(template({
      data: this.result.detail
    }));
    widget.updateViewTitle(this.result.title || defaultTitle);
    return this;
  },


  resume(options) {
    this.urlObj = UrlUtil.parseUrlSearch();
    if (options.previousView !== "index") {
      setTimeout(() => {
        this.router.replaceTo("index");
        pageAction.setClose();
      }, 0);
      return;
    }
    this.fetch();
  },

  fetch() {
    this.$initial.show();
    const params = {
      orderid: this.urlObj.giftId
    };
    let promise = new Promise((resolve, reject) => {
      sendPost("giftDetail", params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    promise.then((data) => {
      this.result = data;
      this.render();
    });
    promise.catch(mallPromise);

  },

  gotoExpressInfoView() {
    const expressInfo = this.result.detail.express;

    if (!expressInfo) {
      return;
    }

    // companyid: 快递公司id
    // company：快递公司名称
    // tracking: 快递单号
    const url = `/fe/app/client/mall/html/detail-page/express-info.html?tracking=${expressInfo.tracking}&company=${encodeURIComponent(expressInfo.company)}&companyid=${expressInfo.companyid}`;

    widget.createNewView({ url });
  },

  gotoNewExpressInfoView(e) {
    var tracking = $(e.currentTarget).data("tracking");
    const url = `/fe/app/client/mall/html/detail-page/express/list.html?orderId=${this.urlObj.giftId}#${tracking}`;
    widget.createNewView({ url });
  },

});

export default ReceiveView;
