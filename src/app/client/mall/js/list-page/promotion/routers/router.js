var $        = require("jquery");
var _        = require("lodash");
var Backbone = require("backbone");
var App = require("app/client/mall/js/list-page/promotion/views/promotion-page.js");

var Router = Backbone.Router.extend({
  routes: {
    "": "default",
    ":active": "dispatch"
  },
  initialize: function() {
    this.app = new App();
  },

  default: function () {
    this.switchTo("index", true, true);
  },

  dispatch: function (action) {
    this.app.changeView(action);
  },
  switchTo: function (view, trigger, replace) {
    this.navigate(view, {
      trigger: !!trigger,
      replace: !!replace
    });
  }
});
module.exports = Router;
