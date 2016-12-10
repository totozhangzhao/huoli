import InfoView from "app/client/mall/js/active-page/active/20161215/views/info.js";
import LuckDrawView from "app/client/mall/js/active-page/active/20161215/views/luck-draw.js";
// import ResultView from "app/client/mall/js/active-page/active/20161215/views/result.js";

import {createRouter} from "app/client/mall/js/common/router/router-factory.js";

var viewDic = {
  "info": InfoView,
  "luck-draw": LuckDrawView
  // "result": ResultView
};

module.exports = createRouter({
  viewDic: viewDic,
  defaultView: "info",
  hideNavigator: true
});
