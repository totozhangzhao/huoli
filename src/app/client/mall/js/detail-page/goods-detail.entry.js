var $          = require("jquery");
var Backbone   = require("backbone");
var _          = require("lodash");
var async      = require("async");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var requestAPI = require("app/client/mall/js/lib/request.js");
var toast      = require("com/mobile/widget/toast/toast.js");
var parseUrl   = require("com/mobile/lib/url/url.js").parseUrlSearch;
var getSystem  = require("com/mobile/lib/util/util.js").getMobileSystem;

// method, params, callback
var sendPost = requestAPI.createSendPost({
  url: "/bmall/rest/"
});

var DEVICE_INFO = {};
var USER_INFO = {
  uid: "",
  userid: "",
  authcode: ""
};

var AppView = Backbone.View.extend({
  el: "body",
  events: {
    "click #goods-desc a": "createNewPage"
  },
  initialize: function() {
    this.$el.$shade          = $(".js-shade");
    this.$el.$loginPrompt    = $(".js-login-prompt");
    this.$el.$exchangeButton = $(".js-exchange-button");
    this.$el.$promptBoard    = $(".js-exchange-prompt");
    this.$el.$promptSuccess  = $(".js-success-prompt");
    this.$el.$promptFail     = $(".js-fail-prompt");
    
    this.mallOrderDetail();
  },
  createNewPage: function(e) {
    e.preventDefault();
    
    var $cur = $(e.currentTarget);
    var url = $cur.prop("href");

    if ( $cur.data() ) {
      url = url.indexOf("?") >= 0 ? url : url + "?";
      url = url + $.param( $cur.data() );
    }

    NativeAPI.invoke("createWebView", {
      url: url,
      controls: [
        {
          type: "title",
          text: $cur.data("title") || ""
        }
      ]
    });
  },
  mallOrderDetail: function() {
    var self = this;

    async.auto({
      deviceInfo: function(next) {
        NativeAPI.invoke("getDeviceInfo", null, function(err, data) {
          if (err) {
            next(null, {
              name: "gtgj"
            });
            return;
          }

          next(null, data);
        });
      },
      userInfo: function(next) {
        NativeAPI.invoke("getUserInfo", null, function(err, data) {
          if ( err && (String(err.code) === "-32001") ) {
            next(null, USER_INFO);
            return;
          } else if (err) {
            next(err);
            return;            
          }

          data.authcode = data.authcode || "";
          data.userid   = data.userid || "";

          next(null, data);
        });
      }
    }, function(err, results) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      DEVICE_INFO = results.deviceInfo;
      USER_INFO   = results.userInfo;

      var params = _.extend({}, USER_INFO, {
        from: DEVICE_INFO.name,
        productid: parseUrl().productid
      });

      sendPost("productDetail", params, function(err, data) {
        if (err) {
          toast(err.message, 1500);
          return;
        }

        self.renderMainPanel(data);
      });
    });
  },
  renderMainPanel: function(data) {
    var self = this;

    this.updateNativeView(data.title);

    $("<img>", {
      src: data.img,
      alt: ""
    })
      .appendTo("#main-img");

    $("#goods-desc").html(data.desc || "");
    $(".js-points").text(data.pprice);

    this.fixTpl();

    var buttonClass = "forbidden-color";

    // 0: 正常兑换;
    // 1: 已结束;
    // 2: 未开始;
    // 3: 已兑完;
    // 4: 今日已兑完。
    if ( String(data.stat) === "0" ) {
      buttonClass = "allow-color";

      this.$el.$exchangeButton.on("click", function() {
        if (USER_INFO.authcode) {
          self.$el.$shade.show();
          self.$el.$promptBoard.show();
        } else {
          self.$el.$shade.show();
          self.$el.$loginPrompt
            .on("click", ".js-confirm", function() {
              window.location.href = "gtgj://?type=gtlogin&bindflag=1&callback=" +
                window.btoa(unescape(encodeURIComponent( window.location.href )));
            })
            .on("click", ".js-cancel", function() {
              self.$el.$loginPrompt.hide();
              self.$el.$shade.hide();
            })
            .show();            
        }
      });

      this.$el.$promptBoard
        .on("click", ".js-confirm", function() {
          self.exchange({
            type: data.type,
            thirdparturl: data.thirdparturl || ""
          });
        })
        .on("click", ".js-cancel", function() {
          self.$el.$promptBoard.hide();
          self.$el.$shade.hide();
        });
    }

    this.$el.$exchangeButton
      .text(data.button)
      .addClass(buttonClass)
      .show();
  },
  fixTpl: function() {
    var crTpl = require("app/client/mall/tpl/copyright.tpl");

    $("#copyright").html(crTpl({
      system: getSystem()
    }));
  },
  exchange: function(options) {

    // type：兑换类型    
    // 1--直接调用创建订单接口      
    // 2--转入输入手机号页面（预留）      
    // 3--转入输入地址页面（预留）   
    // 9--点击跳转第三方链接（ thirdparturl ）
    switch ( String(options.type) ) {
      case "1":
        this.$el.$promptBoard.hide();
        this.mallCreateOrder();
        break;
      case "9":
        window.location.href = options.thirdparturl;
        break;
    }
  },
  mallCreateOrder: function() {
    var self = this;
    var params = _.extend({}, USER_INFO, {
      from: DEVICE_INFO.name,
      productid: parseUrl().productid
    });

    sendPost("createOrder", params, function(err, data) {
      if (err) {
        self.$el.$promptFail
          .one("click", ".js-close", function() {
            self.$el.$promptFail.hide();
            self.$el.$shade.hide();
          })
          .find(".js-message")
            .html(err.message)
          .end()
          .show();
        return;
      }

      self.$el.$promptSuccess
        .one("click", ".js-goto-order-detail", function() {
          window.location.href = "/fe/app/client/mall/html/detail-page/order-detail.html" +
            "?orderid=" + data.orderid;
        })
        .find(".js-message")
          .html(data.message)
        .end()
        .show();
    });
  },
  updateNativeView: function(title) {
    NativeAPI.invoke("updateTitle", {
      text: title
    });

    // NativeAPI.invoke("updateHeaderRightBtn", {
    //   action: "show",
    //   icon: require("app/client/mall/image/share-icon.js"),
    //   text: "分享"
    // }, function(err) {
    //   if (err) {
    //     toast(err.message);
    //     return;
    //   }
    // });

    // NativeAPI.registerHandler("headerRightBtnClick", function() {
    //   window.location.href = "gtgj://start?type=share";
    // });
  }
});

new AppView(); 
