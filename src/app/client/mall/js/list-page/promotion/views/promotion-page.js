var $             = require("jquery");
var Backbone      = require("backbone");
var _             = require("lodash");

var logger       = require("com/mobile/lib/log/log.js");
var mallUitl     = require("app/client/mall/js/lib/util.js");

var BaseView = require("app/client/mall/js/common/views/BaseView.js");

var app = BaseView.extend({

  el:"#main",

  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl"
  },

  initialize: function () {
    window.console.log("111");
    this.ViewDic = {

    };
    this.views = {};
  },

  changeView: function (action) {
    window.console.log(action);
    if(action in this.ViewDic) {
      var isLoaded = !!this.views[action];
      if(!isLoaded){
        this.views[action] = new this.ViewDic[action].view();
      }
      this.render(action);
      this.navView.update(action);
      if(isLoaded){

      }
      logger.track(mallUitl.getAppName() + "PV", "View PV", this.ViewDic[action].title);
    } else {
      window.console.log("-- [Backbone View] not found! action: " + action + " --");
      this.switchTo("index", true, true);
    }
  },

  render: function (action) {
    // this.$el.find("#list-box").html(this.views[action].el);
  },

  switchTo: function (view, trigger, replace){
    Backbone.history.navigate(view,{
      trigger: !!trigger,
      replace: !!replace
    });
  }
});
module.exports = app;
