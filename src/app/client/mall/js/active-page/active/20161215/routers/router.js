import {createRouter} from "app/client/mall/js/common/router/router-factory.js";

// pages
import InfoView from "app/client/mall/js/active-page/active/20161215/views/info.js";
import LuckDrawView from "app/client/mall/js/active-page/active/20161215/views/luck-draw.js";

var viewDic = {
  "info": InfoView,
  "luck-draw": LuckDrawView
};

module.exports = createRouter({
  viewDic: viewDic,
  defaultView: "info",
  hideNavigator: true,
  notUseShare: true
});
