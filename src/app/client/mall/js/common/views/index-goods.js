/*
  首页商品视图
*/
var $           = require("jquery");
var Backbone    = require("backbone");
var _           = require("lodash");

var mallPromise = require("app/client/mall/js/lib/mall-promise.js");
var sendPost    = require("app/client/mall/js/lib/mall-request.js").sendPost;
var toast       = require("com/mobile/widget/hint/hint.js").toast;
var hint        = require("com/mobile/widget/hint/hint.js");

var tplUtil     = require("app/client/mall/js/lib/mall-tpl.js");
var mallUitl    = require("app/client/mall/js/lib/util.js");

var imageDelay  = require("app/client/mall/js/lib/common.js").imageDelay;

var PromotionView = Backbone.View.extend({

  el: "#home-goods",

  template: require("app/client/mall/tpl/home/v2/goods.tpl"),

  initialize: function (options){
    this.showLoading = options.showLoading || false;
    this.listenTo(this.model, "change:status", this.fetch);
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
    if(this.showLoading){
      hint.showLoading();
    }
    var params = {
      groupId: model.get("groupId")
    };
    if(!params.groupId || params.groupId === ""){
      mallPromise.getAppInfo()
      .then(function(userData) {
        params["logger"] = {
          url: encodeURIComponent(window.location.href),
          userData: userData,
          logger: model.get("logger")
        };
        this.getGoods(model, params);
      }.bind(this));

      return;
    }
    this.getGoods(model, params);
  },

  getGoods: function (model, params) {
    sendPost("classifyGoods", params, function(err, result) {
      if(this.showLoading){
        hint.hideLoading();
      }
      if (err) {
        model.set({
          status: -1,
          groupId: ""
        });
        if(err){
          toast(err.message, 1500);
        }
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
