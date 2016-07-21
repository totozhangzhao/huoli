import _ from "lodash";
import BaseView from "app/client/mall/js/common/views/BaseView.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import * as widget from "app/client/mall/js/lib/common.js";

const detailLog = widget.initTracker("detail");

const AppView = BaseView.extend({
  initialize(commonData) {
    _.extend(this, commonData);

    this.urlObj = UrlUtil.parseUrlSearch();
    this.mallGetUrl(this.urlObj.productid, true);
  },
  resume() {
    detailLog({
      title: "get-url",
      productid: this.urlObj.productid,
      hlfrom: this.urlObj.hlfrom || "--"
    });
  }
});

export default AppView;
