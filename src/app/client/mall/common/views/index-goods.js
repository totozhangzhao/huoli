/*
  首页商品视图
*/
var $           = require("jquery");
var _           = require("lodash");

var mallPromise = require("app/client/mall/js/lib/mall-promise.js");
var sendPost    = require("app/client/mall/js/lib/mall-request.js").sendPost;
var toast       = require("com/mobile/widget/hint/hint.js").toast;
var hint        = require("com/mobile/widget/hint/hint.js");

var tplUtil     = require("app/client/mall/js/lib/mall-tpl.js");
var mallUitl    = require("app/client/mall/js/lib/util.js");

var imageDelay  = require("app/client/mall/js/lib/common.js").imageDelay;

var BaseView    = require("app/client/mall/common/views/BaseView.js");

var PromotionView = BaseView.extend({

  el: "#home-goods",

  template: require("app/client/mall/tpl/home/v2/goods.tpl"),

  initialize: function (){
    this.listenTo(this.model, "change", this.fetch);
    imageDelay();
  },

  render: function (data) {
    this.$el.html(this.template({
      dataList: data,
      appName : mallUitl.getAppName(),
      tplUtil : tplUtil
    }));
    imageDelay();
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
    sendPost("classifyGoods", {groupId: model.get("groupId")}, function(err, result) {
      hint.hideLoading();
      if (err) {
        model.set({
          status: -1,
          groupId: ""
        });
        toast(err.message, 1500);
        return;
      }
      this.render(result.goods || []);
      model.set({
        status: 2,
        groupId:""
      });
    }.bind(this));
  }
});

module.exports = PromotionView;