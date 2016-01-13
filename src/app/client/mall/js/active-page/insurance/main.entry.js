var $         = require("jquery");
var _         = require("lodash");
var Backbone  = require("backbone");
var toast     = require("com/mobile/widget/hint/hint.js").toast;
var hint      = require("com/mobile/widget/hint/hint.js");
var UrlUtil   = require("com/mobile/lib/url/url.js");
var logger    = require("com/mobile/lib/log/log.js");
var mallUitl  = require("app/client/mall/js/lib/util.js");
var hint      = require("com/mobile/widget/hint/hint.js");
var async     = require("async");
var appInfo   = require("app/client/mall/js/lib/app-info.js");
var sendPost  = require("app/client/mall/js/lib/mall-request.js").sendPost;
var base64    = require("com/mobile/lib/base64/base64.js").Base64;
// var NativeAPI = require("app/client/common/lib/native/native-api.js");

var AppView = Backbone.View.extend({
  el: "#main-container",
  events: {
    "click .js-add": "addUserInputs",
    "click .js-user-item-delete": "removeUserInputs",
    "click .js-submit": "submitOrder"
  },
  initialize: function() {

    // real productid
    this.goodsId = null;

    // initial data from url
    this.dataFromUrl = this.parseUrlInputs();
    this.renderTopView();

    logger.track(mallUitl.getAppName() + "PV", "View PV", document.title);
  },
  parseUrlInputs: function() {
    var b64String = UrlUtil.parseUrlSearch().orderinfo;
    var str = "";

    if (b64String) {
      str = base64.decode(b64String);
      str = JSON.parse(str);
    }

    return str;
  },
  renderTopView: function() {
    var self = this;

    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userData) {
          if (err) {
            toast(err.message, 1500);
            return;
          }

          next(null, userData);
        });
      },
      function(userData, next) {
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: $("#main-container").data("productid") || 10000
        });

        sendPost("productDetail", params, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      self.goodsId = result.productid;
      self.renderFormView(result);
    });
  },
  renderFormView: function(productInfo) {
    var userArray = this.fixTicketData(this.dataFromUrl);
    var tmpl = require("app/client/mall/tpl/active-page/insurance/input.tpl");

    this.$el
      .html(tmpl({
        productInfo: productInfo,
        userArray: userArray
      }));
  },
  fixTicketData: function(dataFromUrl) {
    var userArray = dataFromUrl.tickets;

    if ( !Array.isArray(userArray) || userArray.length === 0 ) {
      userArray = [{}];
    } else {

      // 可能没有 account 节点，没有登陆管家账号就没有
      var accountCardno = dataFromUrl.account && dataFromUrl.account.cardno;

      for (var i = 0, len = userArray.length; i < len; i += 1) {
        if ( !/身份证/.test(userArray[i].cardtype) ) {
          userArray[i].cardno = "";
        }

        if ( accountCardno && userArray[i].cardno === accountCardno ) {
          userArray[i].phone = dataFromUrl.account.phone;
        }
      }
    }

    return this.userFilter(userArray);
  },
  userFilter: function(userArray) {
    var data = this.dataFromUrl;
    var appUser;

    // 可能没有 account 节点，没有登陆管家账号就没有
    var accountCardno = data.account && data.account.cardno;

    if (accountCardno) {
      appUser = _.find(userArray, function(user) {
        return user.cardno === accountCardno;
      });
    }

    return [appUser || {}];
  },
  addUserInputs: function() {

    // 禁止多人领取
    return;
    // var tmpl = require("app/client/mall/tpl/active-page/insurance/input.tpl");

    // this.$el
    //   .find(".js-inputs-container")
    //     .append(tmpl({
    //       tickets: [{}]
    //     }));
  },
  removeUserInputs: function(e) {
    var $cur = $(e.currentTarget);

    if ( this.$el.find(".js-user-item").length <= 1 ) {
      return;
    }

    $cur
      .parent(".js-user-item")
      .remove();
  },
  submitOrder: function() {
    var $check = $("#checkAgreement");

    if ( $check.is(":checked") ) {
      this.mallCreateOrder();
    } else {
      toast("勾选\“我同意提交以上信息\”才能提交", 1500);
    }
  },
  mallCreateOrder: function() {
    var self = this;
    var $inputs = this.$el.find("input[name]");

    for (var i = 0, len = $inputs.length; i < len; i += 1) {
      if ( $inputs[i].value.trim() === "" ) {
        toast("请输入完整的信息", 1500);
        return;
      }
    }

    hint.showLoading();

    var formValue = [];

    this.$el.find(".js-user-item").each(function(index, item) {
      var userInfo = {};
      $(item).find("input").each(function(i, elem) {
        userInfo[elem.name] = elem.value.trim();
      });
      formValue.push(userInfo);
    });

    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userData) {
          if (err) {
            toast(err.message, 1500);
            return;
          }

          next(null, userData);
        });
      },
      function(userData, next) {
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: self.goodsId,
          input: formValue
        });

        sendPost("createOrder", params, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      // hint.hideLoading();
      window.location.href = window.location.origin +
        "/fe/app/client/mall/html/detail-page/order-detail.html" +
        "?orderid=" + result.orderid;
    });
  }
});

new AppView();
