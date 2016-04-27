/*
  首页推广位视图
*/
var $        = require("jquery");
var Backbone = require("backbone");
var _        = require("lodash");

var mallPromise   = require("app/client/mall/js/lib/mall-promise.js");
var sendPost      = require("app/client/mall/js/lib/mall-request.js").sendPost;

var BaseView    = require("app/client/mall/js/common/views/BaseView.js");

var PointsView = Backbone.View.extend({

  el: "#home-points",

  initialize: function (){},

  render: function (data) {
    $(".num-font", this.$el).html(data.points)
    .end()
    .show();
    return this;
  }
});

module.exports = PointsView;
