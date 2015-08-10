var $          = require("jquery");
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

    // 剩余可刮奖次数
    this.left = null;

    // 本次是否中奖
    this.bonus = null;

    // 用户积分
    this.points = null;

    // 开始、再次……刮奖按钮
    this.$el.$button = this.$el.find(".js-button");

    this.showPointsView();
    this.initCardButton();

    if ( wechatUtil.isWechat() ) {
      if ( shareUtil.hasShareInfo() ) {
        loadScript(window.location.origin + "/fe/com/mobile/widget/wechat/wechat.bundle.js");
      }
    } else {
      if ( shareUtil.hasShareInfo() ) {
        mallWechat.initNativeShare();
      }
    }
  },
  createNewPage: function(e) {
    widget.createAView(e);
  },
  initCardButton: function() {
    this.changeButtonStatus("start");
  },
  changeButtonStatus: function(status) {
    var status = status || "start";

    this.$el.$button
      .hide()
      .filter("[data-type=" + status + "]")
      .show();
  },
  setCard: function(e) {
    var $cur = $(e.currentTarget);

    if ( $cur.data("type") === "off" ) {
      return;
    }

    if ( $cur.data("type") === "start" ) {
      this.changeButtonStatus("off");
      this.initCard();
      return;
    }

    if ( $cur.data("type") === "restart" ) {
      this.changeButtonStatus("off");
      this.resetCard();
      return;
    }
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

        if (self.left === 0) {
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

    if (this.left === 0) {
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

        sendPost("createLottery", params, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        resetCard();
        toast(err.message, 1500);
        return;
      }
    
      self.left = result.left;
      self.bonus = result.bonus;
      self.points = result.points;
      canvas.style.backgroundImage = "url(" + result.result.image + ")";
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
  showPointsView: function() {
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

    if (this.left === 0) {
      this.changeButtonStatus("off");
    } else {
      this.changeButtonStatus("restart");      
    }

    var showCardView = function(bonus) {
      var $cardBlock = self.$el.find(".js-card-block");
      var animateName = bonus ? "tada" : "rubberBand";

      $cardBlock
        .addClass(animateName + " animated");

      setTimeout(function() {
        $cardBlock.removeClass(animateName + " animated");
      }, 2000);
    };

    var showPointsView = function() {
      var $points = self.$el.find(".js-points");

      $points
        .addClass("animaion-blink");

      setTimeout(function() {
        $points.removeClass("animaion-blink");
      }, 2000);
    };

    var showResultView = function(points) {
      self.$el.find(".js-points").text(points);
      showCardView(self.bonus);

      if (self.bonus) {
        showPointsView();
      }
    };

    if ( this.points !== null ) {
      showResultView(this.points);
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
