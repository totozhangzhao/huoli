var $             = require("jquery");
var Backbone      = require("backbone");
var _             = require("lodash");
var Promise       = require("com/mobile/lib/promise/npo.js");

var mallPromise   = require("app/client/mall/js/lib/mall-promise.js");
var sendPost      = require("app/client/mall/js/lib/mall-request.js").sendPost;
var UrlUtil       = require("com/mobile/lib/url/url.js");
var loginUtil     = require("app/client/mall/js/lib/login-util.js");

var LoadingView   = require("app/client/mall/js/list-page/grab/views/loading-view.js");
var ListBaseView      = require("app/client/mall/js/list-page/grab/views/base-list.js");

var ui            = require("app/client/mall/js/lib/ui.js");

require("app/client/mall/js/lib/common.js");

var AppView = ListBaseView.extend({

  tagName: "ul",

  className: "crowd-join-bar more-loading-padding",

  template: require("app/client/mall/tpl/list-page/grab/my-record-goods.tpl"),


  initialize: function () {
    this.$initial = ui.initial().show();
    this.last = null;       // 更多数据起始位置
    this.hasMore = true;    // 有更多数据
    this.isLoading = false; // 正在加载数据
    this.id = UrlUtil.parseUrlSearch().productid;
    this.loadingView = new LoadingView();
    this.fetchData();
    return this.bindEvent();

  },

  fetchData: function () {
    var self = this;
    if(!this.hasMore || this.isLoading){
      return;
    }
    this.isLoading = true;
    this.loadingView.show();

    mallPromise.getAppInfo()
    .then(function (userData) {
      var params = {
        userid: userData.userInfo.userid,
        authcode: userData.userInfo.authcode,
        uid: userData.userInfo.uid,
        limit: 10,
        last: self.last
      };
      return new Promise(function(resolve, reject) {
        sendPost("userInvolvedCrowd", params, function(err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    })
    .then(function (data) {
      self.loadingView.hide();
      self.isLoading = false;
      if(!data || data.length === 0){
        self.hasMore = false;
        self.$el.removeClass('more-loading-padding');
      }
      return self.render(data);
    })
    .catch(function (err) {
      if( err.code === -3330) {
        loginUtil.login();
      }else{
        mallPromise.catchFn(err);
      }
    });
  },

  render: function (data) {

    var isNotFirstPage = !!this.last;

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

  bindEvent: function () {
    $(window).scroll((function (_this) {
      return function () {
        if(Backbone.history.getHash() === "my-record"){
          var bottom = $("#main").height() - $(window).scrollTop() - document.body.offsetHeight;
          if(bottom < 100) { // 距离底部200像素时 加载更多数据
            return _this.fetchData();
          }
        }
      };
    })(this));
  }
});
module.exports = AppView;
