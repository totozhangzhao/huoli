/*
  首页视图
*/
var $         = require("jquery");
var Backbone  = require("backbone");
var _         = require("lodash");

var widget    = require("app/client/mall/js/lib/common.js");

var BaseView = Backbone.View.extend({
  createNewPage: function (e) {
    window.console.log(e);
    widget.createAView(e);
  }
});

module.exports = BaseView;