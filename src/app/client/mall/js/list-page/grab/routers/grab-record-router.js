var Backbone     = require("backbone");
var App          = require("app/client/mall/js/list-page/grab/views/record-page.js");

module.exports = Backbone.Router.extend({
  routes: {
    "": "default",
    ":active": "dispatch"
  },
  initialize: function() {
    this.app = new App();
  },

  default: function () {
    this.switchTo("record", true, true);
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
