// var $          = require("jquery");
var Backbone   = require("backbone");
var _          = require("lodash");
var async      = require("async");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var sendPost   = require("app/client/mall/js/lib/mall-request.js").sendPost;
var toast      = require("com/mobile/widget/hint/hint.js").toast;
var parseUrl   = require("com/mobile/lib/url/url.js").parseUrlSearch;
var appInfo    = require("app/client/mall/js/lib/app-info.js");
var widget     = require("app/client/mall/js/lib/widget.js");
var loadScript = require("com/mobile/lib/load-script/load-script.js");
var shareUtil  = require("com/mobile/widget/wechat/util.js");
var wechatUtil = require("com/mobile/widget/wechat-hack/util.js");
var mallWechat = require("app/client/mall/js/lib/wechat.js");
var ScratchCard = require("com/mobile/widget/scratch-card/scratch-card.js");
// var Util       = require("com/mobile/lib/util/util.js");

var AppView = Backbone.View.extend({
  el: "#lottery-main",
  events: {
    "click .js-button": "setCard",
    "click a": "createNewPage"
  },
  initialize: function() {

    // 重置刮刮卡
    this.resetCard = null;

    // 本次中奖结果
    this.lotteryInfo = {};

    this.initPointsView();
    this.initCard();

    if ( wechatUtil.isWechat() ) {
      if ( shareUtil.hasShareInfo() ) {
        loadScript(window.location.origin + "/fe/com/mobile/widget/wechat/wechat.bundle.js");
      }
    } else {
      if ( shareUtil.hasShareInfo() ) {
        mallWechat.initNativeShare(_.bind(this.mallCheckin, this));
      }
    }
  },
  createNewPage: function(e) {
    widget.createAView(e);
  },
  mallCheckin: function() {
    var self = this;
    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userData) {
          if (err) {
            next(err);
            return;
          }

          next(null, userData);
        });
      },
      function(userData, next) {
        if (userData.userInfo && userData.userInfo.userid) {
          var params = _.extend({}, userData.userInfo, {
            p: userData.deviceInfo.p
          });

          sendPost("checkin", params, function(err, data) {
            if (err) {
              next(err);
              return;
            }

            next(null, data);
          });
        } else {
          self.loginApp();
        }
      }
    ], function(err, result) {
      if (err) {
        window.console.log(err.message);
        return;
      }

      var $alert = self.$el.find(".js-alert-box");
      var tmpl = require("app/client/mall/tpl/active-page/scratch-card/alert-result.tpl");

      $alert
        .html(tmpl({
          hint: result.msg,
          buttonText: "确定"
        }))
        .show()
        .on("click", ".js-go", function() {
          $alert.hide();
          self.doPointsAnimate();
        })
        .on("click", ".js-close", function() {
          $alert.hide();
          self.doPointsAnimate();
        });

      self.$el
        .find(".js-points")
          .text(result.points);      
    });
  },
  doPointsAnimate: function() {
    var $points = this.$el.find(".js-points");

    $points
      .addClass("animaion-blink");

    setTimeout(function() {
      $points.removeClass("animaion-blink");
    }, 2000);
  },
  initCard: function() {
    var self = this;
    var cardTmpl = require("app/client/mall/tpl/active-page/scratch-card/main-card.tpl");

    this.$el
      .find(".js-card-block")
        .html( cardTmpl({}) );

    this.$el.find("canvas")
      .on("getImageURL", function(e, canvas, resetCard) {
        self.resetCard = resetCard;

        if (self.lotteryInfo.left === 0) {
          resetCard();
        } else {
          self.getResultImage(canvas, resetCard);
        }
      })
      .on("showResult", function() {
        // (e, resetCard)
        self.showResult();
      });

    new ScratchCard({ el: "#lottery-main canvas" });
  },
  getResultImage: function(canvas, resetCard) {
    var self = this;

    if (this.lotteryInfo.left === 0) {
      this.resetCard();
      return;
    }

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
          productid: parseUrl().productid
        });

        sendPost("createLottery", params, function(err, lotteryData) {
          next(err, lotteryData);
        });
      }
    ], function(err, lotteryData) {
      if (err) {
        resetCard();
        toast(err.message, 1500);
        return;
      }
    
      self.lotteryInfo = lotteryData;
      canvas.style.backgroundImage = "url(" + lotteryData.result.image + ")";
    });
  },
  mallGetUserInfo: function(callback) {
    var self = this;

    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userData) {
          if (err) {
            next(err);
            return;
          }

          next(null, userData);
        });
      },
      function(userData, next) {
        if (userData.userInfo && userData.userInfo.userid) {
          var params = _.extend({}, userData.userInfo, {
            p: userData.deviceInfo.p
          });

          sendPost("getUserInfo", params, function(err, data) {
            if (err) {
              next(err);
              return;
            }

            next(null, data);
          });
        } else {
          self.loginApp();
        }
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      callback(result);
    });
  },
  initPointsView: function() {
    var self = this;

    this.mallGetUserInfo(function(userInfoResult) {
      if (userInfoResult &&
          typeof userInfoResult.points !== "undefined" &&
          userInfoResult.points !== null
      ) {
        self.$el
          .find(".js-points")
            .text(userInfoResult.points);
      }
    });
  },
  showResult: function() {
    var self = this;

    var rdNum = function(from, to) {
      var temp = to - from + 1;
      return Math.floor(Math.random() * temp + from);
    };

    var textList = [
      "你刮中这么大奖，你家人造吗？",
      "哇，人品大爆炸，竟然被你刮中了，赶紧去领奖。",
      "土豪，带我装逼带我刮，刮刮刮~~",
      "领奖姿势要优美哦，收腹提臀，棒棒哒~",
      "中奖了，不分享，你对得起我吗？",
      "中奖也会传染，不信你试试~"
    ];

    var showCardView = function(callback) {
      var bonus = self.lotteryInfo.bonus;
      var $cardBlock = self.$el.find(".js-card-block").parent();
      var animateName = bonus ? "tada" : "rubberBand";

      $cardBlock
        .addClass(animateName + " animated");

      setTimeout(function() {
        $cardBlock.removeClass(animateName + " animated");

        if (bonus === 2) {
          var $alert = self.$el.find(".js-alert-box");
          var tmpl = require("app/client/mall/tpl/active-page/scratch-card/alert-result.tpl");

          $alert
            .html(tmpl({
              hint: self.lotteryInfo.result.text || textList[rdNum(0, textList.length - 1)],
              buttonText: "马上领奖"
            }))
            .show()
            .on("click", ".js-go", function() {
              self.gotoOrderDetail();
              $alert.hide();
            })
            .on("click", ".js-close", function() {
              $alert.hide();
            });
        }

        if (callback) {
          callback();
        }
      }, 2000);
    };

    var showResultView = function(points) {
      self.$el.find(".js-points").text(points);
      showCardView(function() {
        if (self.lotteryInfo.bonus === 1) {
          self.doPointsAnimate();
        }
      });
    };

    if ( this.lotteryInfo.points !== null ) {
      showResultView(this.lotteryInfo.points);
    } else {
      this.mallGetUserInfo(function(userInfoResult) {
        if (userInfoResult &&
            typeof userInfoResult.points !== "undefined" &&
            userInfoResult.points !== null
        ) {
          toast(userInfoResult.msg, 1500);
          showResultView(userInfoResult.points);
        }
      });
    }
  },
  gotoOrderDetail: function() {
    var orderDetailUrl = window.location.origin +
        "/fe/app/client/mall/html/detail-page/order-detail.html" +
        "?orderid=" + this.lotteryInfo.orderid;

    widget.createNewView({
      url: orderDetailUrl
    });
  },
  loginApp: function() {
    async.waterfall([
      function(next) {

        // window.location.href = "gtgj://?type=gtlogin&bindflag=1&callback=" +
        //   window.btoa(unescape(encodeURIComponent( window.location.href )));

        NativeAPI.invoke("login", null, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      if ( String(result.succ) === "1" || result.value === result.SUCC ) {
        window.location.reload();
      } else {
        // hint.hideLoading();
        window.console.log(JSON.stringify(result));
        NativeAPI.invoke("close");
      }
    });
  }
});

new AppView();
