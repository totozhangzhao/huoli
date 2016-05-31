import $ from "jquery";
import Backbone from "backbone";
import _ from "lodash";
import Promise from "com/mobile/lib/promise/npo.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import LoadingView from "app/client/mall/js/list-page/grab/views/loading-view.js";
import ListBaseView from "app/client/mall/js/list-page/grab/views/base-list.js";
import ui from "app/client/mall/js/lib/ui.js";

require("app/client/mall/js/lib/common.js");

const AppView = ListBaseView.extend({

  tagName: "ul",

  className: "crowd-join-bar more-loading-padding",

  template: require("app/client/mall/tpl/list-page/grab/my-record-goods.tpl"),


  initialize() {
    this.$initial = ui.initial().show();
    this.last = null;       // 更多数据起始位置
    this.hasMore = true;    // 有更多数据
    this.isLoading = false; // 正在加载数据
    this.id = UrlUtil.parseUrlSearch().productid;
    this.loadingView = new LoadingView();
    this.fetchData();
    return this.bindEvent();

  },

  fetchData() {
    const self = this;
    if(!this.hasMore || this.isLoading){
      return;
    }
    this.isLoading = true;
    this.loadingView.show();

    mallPromise.getAppInfo()
    .then(userData => {
      const params = {
        userid: userData.userInfo.userid,
        authcode: userData.userInfo.authcode,
        uid: userData.userInfo.uid,
        limit: 10,
        last: self.last
      };
      return new Promise((resolve, reject) => {
        sendPost("userInvolvedCrowd", params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    })
    .then(data => {
      self.loadingView.hide();
      self.isLoading = false;
      if(!data || data.length === 0){
        self.hasMore = false;
        self.$el.removeClass('more-loading-padding');
      }
      return self.render(data);
    })
    .catch(err => {
      if( err.code === -3330) {
        mallPromise.login();
      }else{
        mallPromise.catchFn(err);
      }
    });
  },

  render(data) {

    const isNotFirstPage = !!this.last;

    if(data.length > 0){
      this.last = _.last(data).orderid;
    }

    if(isNotFirstPage){
      this.addMore(data);
    }else{
      this.renderGoods(data);
      this.$initial.hide();
    }
    return this;
  },

  bindEvent() {
    $(window).scroll(((_this => () => {
      if(Backbone.history.getHash() === "my-record"){
        const bottom = $("#main").height() - $(window).scrollTop() - document.body.offsetHeight;
        if(bottom < 100) { // 距离底部200像素时 加载更多数据
          return _this.fetchData();
        }
      }
    }))(this));
  }
});
export default AppView;
