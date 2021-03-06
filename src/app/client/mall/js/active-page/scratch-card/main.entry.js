var $           = require("jquery");
var Backbone    = require("backbone");
var _           = require("lodash");
var sendPost    = require("app/client/mall/js/lib/mall-request.js").sendPost;
var toast       = require("com/mobile/widget/hint/hint.js").toast;
var parseUrl    = require("com/mobile/lib/url/url.js").parseUrlSearch;
var widget      = require("app/client/mall/js/lib/common.js");
var loadScript  = require("com/mobile/lib/load-script/load-script.js");
var shareUtil   = require("com/mobile/widget/wechat/util.js");
var wechatUtil  = require("com/mobile/widget/wechat-hack/util.js");
var mallWechat  = require("app/client/mall/js/lib/wechat.js");
var ScratchCard = require("com/mobile/widget/scratch-card/scratch-card.js");
var logger      = require("com/mobile/lib/log/log.js");
var mallUtil    = require("app/client/mall/js/lib/util.js");
var ui          = require("app/client/mall/js/lib/ui.js");
var detailLog   = require("app/client/mall/js/lib/common.js").initTracker("detail");
import Navigator from "app/client/mall/js/common/views/header/navigator.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import BackTop from "com/mobile/widget/button/to-top.js";

var AppView = Backbone.View.extend({
  el: "#lottery-main",
  events: {
    "click .js-button": "setCard",
    "click a": "createNewPage"
  },
  initialize: function() {
    const nav = new Navigator();
    nav.render();
    new BackTop();
    var title = parseUrl().title || document.title;

    widget.updateViewTitle(title);
    this.$initial = ui.initial().show();

    // 本次中奖结果
    this.lotteryInfo = {};

    this.initPointsView();
    this.initCard();

    if ( wechatUtil.isWechatFunc() ) {
      if ( shareUtil.hasShareHtml() ) {
        loadScript(window.location.origin + "/fe/com/mobile/widget/wechat/wechat.bundle.js");
      }
    } else {
      if ( shareUtil.hasShareHtml() ) {
        mallWechat.initNativeShare({
          callback: _.bind(this.mallCheckin, this)
        });
      }
    }

    logger.track(mallUtil.getAppName() + "PV", "View PV", title);
    detailLog({
      title: title,
      productid: parseUrl().productid,
      hlfrom: parseUrl().hlfrom || "--"
    });
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
          toast("您的刮奖机会已用完", 1500);
          return;
        }

        self.getResultImage(canvas, resetCard);
      })
      .on("showResult", function(e, resetCard) {
        self.showResult(resetCard);
      });

    new ScratchCard({ el: "#lottery-main canvas" });

    var isApp = mallUtil.isAppFunc();

    if ( !isApp ) {
      require("app/client/mall/js/lib/download-app.js").init( isApp );
    }

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

    mallPromise
      .checkLogin()
      .then(userData => {
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: parseUrl().productid || $("#lottery-main").data("productid")
        });
        return new Promise((resolve, reject) => {
          sendPost("createOrder", params, function(err, lotteryData) {
            if(err) {
              resetCard();
              reject(err);
            }else{
              resolve(lotteryData);
            }
          });
        });
      })
      .then((lotteryData) => {
        self.lotteryInfo = lotteryData;
        canvas.style.backgroundImage = "url(" + lotteryData.result.image + ")";
      })
      .catch(mallPromise.catchFn);

  },
  mallGetUserInfo: function(callback) {
    mallPromise
      .checkLogin()
      .then(userData => {
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p
        });
        return new Promise((resolve, reject) => {
          sendPost("getUserInfo", params, function(err, data) {
            if (err) {
              reject(err);
            }else{
              resolve(data);
            }
          });
        });
      })
      .then( data => {
        callback(data);
      })
      .catch(mallPromise.catchFn);
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
  doPointsAnimate: function() {
    var $points = this.$el.find(".js-points");

    $points
      .addClass("animaion-blink");

    setTimeout(function() {
      $points.removeClass("animaion-blink");
    }, 2000);
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
        lotteryInfo = self.lotteryInfo;
        bonus = lotteryInfo.bonus;
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

    /*
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
          loginUtil.login();
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
    */
  }
});

new AppView();
