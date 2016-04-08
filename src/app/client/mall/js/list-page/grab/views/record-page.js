var $             = require("jquery");
var Backbone      = require("backbone");
var _             = require("lodash");
var Footer        = require("app/client/mall/js/common/views/footer.js");
var app = Backbone.View.extend({

  el:"#main",

  events:{
    "click span[data-route]": "route"
  },

  initialize: function () {
    new Footer().render();
  },

  render: function (dom) {
    this.$el.find("#list-box").html(dom);
  },

  route: function (e) {
    var data = $(e.currentTarget).data("route");
    this.switchTo(data, true, true);
  },

  switchTo: function (view, trigger, replace){
    Backbone.history.navigate(view,{
      trigger: !!trigger,
      replace: !!replace
    });
  }
});
module.exports = app;
