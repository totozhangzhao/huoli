var $          = require("jquery");
var Backbone   = require("backbone");
var _          = require("lodash");
var async      = require("async");
var appInfo    = require("app/client/mall/js/lib/app-info.js");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var sendPost   = require("app/client/mall/js/lib/mall-request.js").sendPost;
var MultiLevel = require("com/mobile/widget/select/select.js").MultiLevel;
var province   = require("app/client/mall/data/region.js").province;
var toast      = require("com/mobile/widget/hint/hint.js").toast;
var hint       = require("com/mobile/widget/hint/hint.js");
var pageAction = require("app/client/mall/js/lib/page-action.js");
var addressUtil = require("app/client/mall/js/lib/address-util.js");
// var pageAction = require("app/client/mall/js/lib/page-action.js");

var AppView = Backbone.View.extend({
  el: "#address-add",
  events: {
    "click #save-address": "saveAddress",
    "blur  [name]": "blurInput"
  },
  initialize: function() {
    this.curAddress = {};
  },
  resume: function(options) {
    if (options.previousView === "") {
      this.router.switchTo("goods-detail");
      pageAction.setClose();
      return;
    }

    hint.showLoading();

    var action = this.cache.addressAction;
    var addressList = this.collection.addressList;

    if (action === "add") {
      this.cache.addressAction === null;
      this.curAddress = {};
    } else if (action) {
      this.cache.addressAction === null;
      var selectedId = this.cache.curAddressId;
      this.cache.curAddressId = null;
      this.curAddress = addressList.get(selectedId).toJSON();
    } else if (addressList && addressList.length > 0) {
      this.curAddress = addressList.at(0).toJSON();
    }

    this.initView(this.curAddress);
    this.initSelectWidget();
    this.$el.$inputs = this.$el.find("[name]");
    this.$el.$submit = $("#save-address");
  },
  initView: function(addressInfo) {
    var addressTpl = require("app/client/mall/tpl/detail-page/address-edit.tpl");

    this.$el.html(addressTpl({
      addressInfo: addressInfo
    }));

    hint.hideLoading();
  },
  initSelectWidget: function() {
    MultiLevel.prototype.initSelect = function($select) {
      var self = this;
      $select.each(function(index, item) {
        if (index === 0) {
          self.addOption( $(item), province.slice(0) );
        } else {
          self.addOption( $(item) );
        }
      });
    };

    MultiLevel.prototype.getResult = function(options, callback) {
      var params = {
        id: options.id 
      };
      sendPost("getRegion", params, function(err, data) {
        callback(err, data);
      });
    };

    new MultiLevel({
      el: "#select-widget"
    });
  },
  checkInputs: function() {
    var $items = this.$el.$inputs;

    for (var i = 0, len = $items.length; i < len; i += 1) {
      if ( $items.eq(i).val() === "" ) {
        return false;
      }
    }

    return true;
  },
  saveAddress: function() {
    var self = this;

    var inputError = !this.checkInputs();

    if (inputError) {
      toast("请填写完整的地址信息", 1500);
      return;
    }

    var addressInfo = this.curAddress;

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
        var $form = self.$el;

        // TODO: form.values()
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          postcode: "",
          name: $form.find("[name=name]").val(),
          pphone: $form.find("[name=pphone]").val(),
          address: $form.find("[name=address]").val(),
          province: $form.find("[name=province] :selected").text(),
          city: $form.find("[name=city] :selected").text(),
          area: $form.find("[name=area] :selected").text()
        });

        // userid: 用户id
        // authcode: token
        // uid: 设备id
        // addressid: 地址id
        // province: 省份
        // city: 城市
        // pphone: 电话
        // address: 地址
        // area: 区/县
        // name: 姓名
        // postcode: 邮编

        var method = "newAddress";

        if (addressInfo.addressid) {
          method = "updateAddress";
          params.addressid = addressInfo.addressid;
        }

        sendPost(method, params, function(err, data) {
          next(err, userData, data);
        });
      },
      function(userData, saveData, next) {
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          addressid: saveData.addressid
        });

        sendPost("setDefAddr", params, function(err, data) {
          next(err, data);
        });
      },
      function(setResult, next) {
        addressUtil.getList(function(err, result) {
          if (err) {
            toast(err.message, 1500);
            return;
          }

          self.collection.addressList.reset(result);
          next(null, setResult);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      if (result !== void 0) {
        self.router.switchTo("address-confirm");
      }
    });
  },
  updateNativeView: function(title) {
    NativeAPI.invoke("updateTitle", {
      text: title
    });
  }
});

module.exports = AppView;
