var CrowdDetailView = require("app/client/mall/js/active-page/crowd/view/crowd-detail.js");
var CrowdRulesView  = require("app/client/mall/js/active-page/crowd/view/crowd-rules.js");
var createRouter    = require("app/client/mall/js/common/router/router-factory.js").createRouter;
var viewDic = {
  "crowd-detail": CrowdDetailView,
  "crowd-rules" : CrowdRulesView
};

module.exports = createRouter({
  viewDic: viewDic,
  defaultView: "crowd-detail"
});
