// 微信送礼 领取页面
// import $ from "jquery";
import _ from "lodash";
import * as mallUitl       from "app/client/mall/js/lib/util.js";
import * as mallPromise    from "app/client/mall/js/lib/mall-promise.js";
import logger         from "com/mobile/lib/log/log.js";
import {sendPost}     from "app/client/mall/js/lib/mall-request.js";
import UrlUtil        from "com/mobile/lib/url/url.js";
import ui             from "app/client/mall/js/lib/ui.js";
import pageAction from "app/client/mall/js/lib/page-action.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import * as widget    from "app/client/mall/js/lib/common.js";
// Views
import BaseView       from "app/client/mall/js/common/views/BaseView.js";
import AddressView from "app/client/mall/js/common/views/address/edit.js";

// templates
import template from "app/client/mall/tpl/gift/receive.tpl";
const defaultTitle = "微信送礼-填写地址";
const ReceiveView = BaseView.extend({

  el: "#receive",

  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl",
    "click .js-receive": "receive"
  },

  initialize(commonData) {
    _.extend(this, commonData);
    this.$initial = ui.initial().show();
    this.render();
    logger.track(`${mallUitl.getAppName()}PV`, "View PV", defaultTitle);
  },

  render() {
    this.$initial.hide();
    this.$el.html(template());
    this.addressView = new AddressView({parentDom: "#address-edit"});
    this.addressView.render();
    widget.updateViewTitle(defaultTitle);
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
  },


  // 确认收礼
  receive() {
    if(this.addressView.valid()) {
      const params = {
        orderid: UrlUtil.parseUrlSearch().giftId,
        address: this.addressView.getAddress(),
        wechatKey: this.urlObj.wechatKey
      };
      let promise = new Promise((resolve, reject) => {
        sendPost("createGiftOrder", params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });

      });
      promise.then((data => {
        toast(data.msg, 3000);
        if(data.status === 0) {
          this.router.replaceTo("index");
        } else if(data.status === 1) {
          this.router.replaceTo("success");
        }
      }));
      promise.catch(mallPromise.catchFn);
    }
  }

});

export default ReceiveView;
