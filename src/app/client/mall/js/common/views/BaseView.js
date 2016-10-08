import $ from "jquery";
import Backbone from "backbone";
import _ from "lodash";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import * as widget from "app/client/mall/js/lib/common.js";
import {toast} from "com/mobile/widget/hint/hint.js";

const BaseView = Backbone.View.extend({
  createNewPage(e) {
    widget.createAView(e);
  },

  handleGetUrl(e) {
    const productid = $(e.currentTarget).data("productid");
    this.mallGetUrl(productid);
  },
  mallGetUrl(productid, isReplace) {
    mallPromise
      .getAppInfo()
      .then(userData => {
        const params = _.extend({}, userData.userInfo, userData.deviceInfo, {
          productid: productid
        });

        sendPost("getUrl", params, (err, data) => {
          if (err) {
            toast(err.message, 1500);
            return;
          }

          if (isReplace) {
            widget.replacePage(data.url);
          } else {
            widget.createNewView({
              url: data.url
            });
          }
        });
      })
      .catch(mallPromise.catchFn);
  }
});

module.exports = BaseView;
