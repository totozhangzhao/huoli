import _ from "lodash";
import Promise from "com/mobile/lib/promise/npo.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import ListBaseView from "app/client/mall/js/list-page/grab/views/base-list.js";
import ui from "app/client/mall/js/lib/ui.js";

require("app/client/mall/js/lib/common.js");

const AppView = ListBaseView.extend({

  tagName: "ul",

  className: "crowd-history-bar",

  template: require("app/client/mall/tpl/list-page/grab/record-goods.tpl"),

  initialize() {
    this.$initial = ui.initial().show();

    this.id = UrlUtil.parseUrlSearch().productid;
    this.fetchData();
  },

  fetchData() {
    const self = this;
    mallPromise.getAppInfo()
    .then(userData => {
      const params = _.extend({}, userData.userInfo, {
        productid: self.id
      });
      return new Promise((resolve, reject) => {
        sendPost("crowdWinList", params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    })
    .then(data => {
      self.render(data);
    })
    .catch(mallPromise.catchFn);
  },

  render(data) {
    this.renderGoods(data);
    this.$initial.hide();
    return this;
  }
});
export default AppView;
