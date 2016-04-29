var ProfileIndexView = require("app/client/mall/js/profile/view/profile-index.js");
var createRouter     = require("app/client/mall/js/common/router/router-factory.js").createRouter;

var viewDic = {
  "profile-index": ProfileIndexView,
};

module.exports = createRouter({
  viewDic: viewDic,
  defaultView: "profile-index"
});
