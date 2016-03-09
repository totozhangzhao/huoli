/*
  首页商品视图
*/
var $         = require("jquery");
var _         = require("lodash");

var mallPromise   = require("app/client/mall/js/lib/mall-promise.js");
var sendPost      = require("app/client/mall/js/lib/mall-request.js").sendPost;
var toast     = require("com/mobile/widget/hint/hint.js").toast;
var hint      = require("com/mobile/widget/hint/hint.js");

var BaseView = require("app/client/mall/js/home/views/view.js");
var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");
var mallUitl = require("app/client/mall/js/lib/util.js");

var imgDelay  = require("app/client/mall/js/lib/common.js").imageDelay;

var PromotionView = BaseView.extend({

  el: "#home-goods",

  template: require("app/client/mall/tpl/home/v2/goods.tpl"),

  initialize: function (){
    this.listenTo(this.model, "change", this.fetch);
    imgDelay();
  },

  render: function (data) {
    this.$el.html(this.template({
      dataList: data,
      appName  : mallUitl.getAppName(),
      tplUtil  : tplUtil
    }));
    return this;
  },

  showMask: function () {
    this.$el.find(".home-goods-shadow").show();
  },

  hideMask: function () {
    this.$el.find(".home-goods-shadow").hide();
  },

  fetch: function (model) {
    if(model.get("status") !== 1){
      return;
    }
    hint.showLoading();
    sendPost("classifyGoods", {classify: model.get("classify")}, function(err, result) {
      hint.hideLoading();
      if (err) {
        toast(err.message, 1500);
        return;
      }
      if (result.length === 0) {
        return;
      }
      this.render(result.goods);
      model.set({
        status: 2,
        classify:""
      });
    }.bind(this));
  }
});

module.exports = PromotionView;