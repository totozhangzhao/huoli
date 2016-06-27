
/*
  首页商品视图
*/
import Backbone from "backbone";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import hint from "com/mobile/widget/hint/hint.js";
import tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import * as mallUitl from "app/client/mall/js/lib/util.js";
import {imageDelay} from "app/client/mall/js/lib/common.js";

const PromotionView = Backbone.View.extend({

  el: "#home-goods",

  template: require("app/client/mall/tpl/home/v2/goods.tpl"),

  initialize(options) {
    this.showLoading = options.showLoading || false;
    this.listenTo(this.model, "change:status", this.fetch);
    imageDelay();
  },

  render(data) {
    this.$el.html(this.template({
      dataList: data,
      appName : mallUitl.getAppName(),
      tplUtil
    }));
    imageDelay();
    return this;
  },

  showMask() {
    this.$el.find(".home-goods-shadow").show();
  },

  hideMask() {
    this.$el.find(".home-goods-shadow").hide();
  },

  fetch(model) {
    if(model.get("status") !== 1){
      return;
    }
    if(this.showLoading){
      hint.showLoading();
    }
    const params = {
      groupId: model.get("groupId")
    };
    if(!params.groupId || params.groupId === ""){
      mallPromise.getAppInfo()
      .then(userData => {
        params["logger"] = {
          url: encodeURIComponent(window.location.href),
          userData,
          logger: model.get("logger")
        };
        this.getGoods(model, params);
      });

      return;
    }
    this.getGoods(model, params);
  },

  getGoods(model, params) {
    sendPost("classifyGoods", params, (err, result) => {
      if(this.showLoading){
        hint.hideLoading();
      }
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
        groupId:"",
        title: result.title
      });
    });
  }
});

module.exports = PromotionView;
