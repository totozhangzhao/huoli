var $          = require("jquery");
var Backbone   = require("backbone");
var _          = require("lodash");
var async      = require("async");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var sendPost   = require("app/client/mall/js/lib/mall-request.js").sendPost;
var toast      = require("com/mobile/widget/hint/hint.js").toast;
var parseUrl   = require("com/mobile/lib/url/url.js").parseUrlSearch;
var appInfo    = require("app/client/mall/js/lib/app-info.js");
var widget     = require("app/client/mall/js/lib/common.js");
var loadScript = require("com/mobile/lib/load-script/load-script.js");
var shareUtil  = require("com/mobile/widget/wechat/util.js");
var wechatUtil = require("com/mobile/widget/wechat-hack/util.js");
var mallWechat = require("app/client/mall/js/lib/wechat.js");
var ScratchCard = require("com/mobile/widget/scratch-card/scratch-card.js");
// var Util       = require("com/mobile/lib/util/util.js");
var logger   = require("com/mobile/lib/log/log.js");
var mallUitl = require("app/client/mall/js/lib/util.js");
var ui       = require("app/client/mall/js/lib/ui.js");

var AppView = Backbone.View.extend({
  el: "#lottery-main",
  events: {
    "click .js-button": "setCard",
    "click a": "createNewPage"
  },
  initialize: function() {
    this.$initial = ui.initial().show();

    // 本次中奖结果
    this.lotteryInfo = {};

    this.initPointsView();
    this.initCard();

    if ( wechatUtil.isWechatFunc() ) {
      if ( shareUtil.hasShareInfo() ) {
        loadScript(window.location.origin + "/fe/com/mobile/widget/wechat/wechat.bundle.js");
      }
    } else {
      if ( shareUtil.hasShareInfo() ) {
        mallWechat.initNativeShare(_.bind(this.mallCheckin, this));
      }
    }

    logger.track(mallUitl.getAppName() + "PV", "View PV", document.title);
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
    var $cardBox = this.$el.find(".js-card-block");

    $cardBox
      .html( cardTmpl({
        width : $cardBox.width(),
        height: $cardBox.height()
      }) );

    this.$el.find("canvas")
      .on("getImageURL", function(e, canvas, resetCard) {
        if (self.lotteryInfo.left === 0) {

          // 重置刮刮卡
          resetCard();
        } else {
          self.getResultImage(canvas, resetCard);
        }
      })
      .on("showResult", function(e, resetCard) {
        self.showResult(resetCard);
      });

    new ScratchCard({ el: "#lottery-main canvas" });
    setTimeout(function() {
      self.$initial.hide();
    }, 600);
  },
  getResultImage: function(canvas, resetCard) {
    var self = this;

    if (this.lotteryInfo.left === 0) {
      resetCard();
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
          productid: parseUrl().productid || $("#lottery-main").data("productid")
        });

        sendPost("createOrder", params, function(err, lotteryData) {
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
  showResult: function(resetCard) {
    var self = this;

    var showCardView = function(callback) {
      var lotteryInfo = self.lotteryInfo;
      var bonus = lotteryInfo.bonus;
      var $cardBlock = self.$el.find(".js-card-block").parent();
      var animateName = bonus ? "tada" : "rubberBand";

      $cardBlock
        .addClass(animateName + " animated");

      setTimeout(function() {
        $cardBlock.removeClass(animateName + " animated");

        var winning = function() {
          var $alert = self.$el.find(".js-alert-box");
          var tmpl = require("app/client/mall/tpl/active-page/scratch-card/alert-result.tpl");

          var goFunc = function() {
            var nextUrl;

            // bonus:
            // 0: 没有中奖
            // 1: 普通奖品
            // 2: 转入订单详情
            // 3: 转入商品详情
            // 4: 转入商品详情输入页（金融类）
            switch ( bonus ) {
              case 2:
                nextUrl = window.location.origin +
                  "/fe/app/client/mall/html/detail-page/order-detail.html" +
                  "?orderid=" + lotteryInfo.orderid;
                widget.createNewView({ url: nextUrl });
                break;
              case 3:
                nextUrl = window.location.origin +
                  "/fe/app/client/mall/html/detail-page/goods-detail.html" +
                  "?productid=" + lotteryInfo.productid;
                widget.createNewView({ url: nextUrl });
                break;
              case 4:
                nextUrl = window.location.origin +
                  "/fe/app/client/mall/html/detail-page/goods-detail.html" +
                  "?productid=" + lotteryInfo.productid +
                  "&gotoView=form-phone";
                widget.createNewView({ url: nextUrl });
                break;
            }

            $alert.hide();
            resetCard();
            $alert.off("click");
          };

          $alert
            .html(tmpl({
              alertImage: lotteryInfo.result.alertimage,
              hint      : lotteryInfo.result.text,
              buttonText: lotteryInfo.result.buttonText
            }))
            .show()
            .off("click")
            .one("click", ".js-go", goFunc)
            .one("click", ".js-again", function() {
              $alert.hide();
              resetCard();
              $alert.off("click");
            })
            .one("click", ".js-close", function() {
              $alert.hide();
              $alert.off("click");
            });
        };

        if (bonus !== 0) {
          winning();
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
  createNewPage: function(e) {
    widget.createAView(e);
  },
  mallCheckin: function() {

    // 取消分享奖励
    if (true) {
      return;
    }

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
        .off("click")
        .one("click", ".js-go", function() {
          $alert.hide();
          self.doPointsAnimate();
        })
        .one("click", ".js-close", function() {
          $alert.hide();
          self.doPointsAnimate();
        });

      self.$el
        .find(".js-points")
          .text(result.points);
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
