var $          = require("jquery");
var Backbone   = require("backbone");
var _          = require("lodash");
var async      = require("async");
var appInfo    = require("app/client/mall/js/lib/app-info.js");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var sendPost   = require("app/client/mall/js/lib/mall-request.js").sendPost;
var MultiLevel = require("com/mobile/widget/select/select.js").MultiLevel;
var toast      = require("com/mobile/widget/hint/hint.js").toast;
var hint       = require("com/mobile/widget/hint/hint.js");
var pageAction = require("app/client/mall/js/lib/page-action.js");
var validator  = require("app/client/mall/js/lib/validator.js");
var UrlUtil    = require("com/mobile/lib/url/url.js");
var addressUtil = require("app/client/mall/js/lib/address-util.js");
var getProvince = require("app/client/mall/js/lib/province.js").getProvince;
// var pageAction = require("app/client/mall/js/lib/page-action.js");

var AppView = Backbone.View.extend({
  el: "#address-add",
  events: {
    "click #save-address": "saveAddress",
    "click .address-option-area": "selectArea",
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
    this.$el.$inputs = this.$el.find("[name]");
    this.$el.$submit = $("#save-address");
  },
  initView: function(addressInfo) {
    var addressTpl = require("app/client/mall/tpl/detail-page/address-edit.tpl");

    this.$el.html(addressTpl({
      addressInfo: addressInfo
    }));

    this.initSelectWidget();
  },
  initSelectWidget: function() {
    var initMultiLevel = function(regionData) {
      MultiLevel.prototype.initSelect = function($select) {
        var self = this;

        if (regionData) {
          $select.each(function(index, item) {
            self.addOption( $(item), regionData[item.name] );
          });
        } else {        
          $select.each(function(index, item) {
            if (index === 0) {
              self.addOption( $(item), getProvince() );
            } else {
              self.addOption( $(item) );
            }
          });
        }
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

      hint.hideLoading();
    };

    this.initSelectedRegion(initMultiLevel);
  },
  initSelectedRegion: function(callback) {
    var curAddress = this.curAddress;

    if (!curAddress.province || !curAddress.city || !curAddress.area) {
      return callback(null);
    }

    var setSelected = function(list, id) {
      for (var i = 0, len = list.length; i < len; i += 1) {
        if (list[i].id === id) {
          list[i].selected = true;
          return list;
        }
      }
      return list;
    };

    async.auto({
      province: function(next) {
        next(null, setSelected(getProvince(), curAddress.province.id));
      },
      city: function(next) {
        var params = {
          id: curAddress.province.id
        };
        sendPost("getRegion", params, function(err, data) {
          next(err, setSelected(data, curAddress.city.id));
        });
      },
      area: function(next) {
        var params = {
          id: curAddress.city.id
        };
        sendPost("getRegion", params, function(err, data) {
          next(err, setSelected(data, curAddress.area.id));
        });
      }
    }, function(err, results) {
      callback(results);
    });
  },
  checkInputs: function() {
    var $items = this.$el.$inputs;
    var defaultHint = "请填写完整的地址信息";

    for (var i = 0, len = $items.length; i < len; i += 1) {
      var $curInput = $items.eq(i);
      var curValue = $curInput.val();
      var method = $curInput.data("checkMethod");

      if ( method && !validator[method](curValue) ) {
        toast($curInput.data("errorMessage") || defaultHint, 1500);
        return false;
      }

      if ( curValue === "" ) {
        toast(defaultHint, 1500);
        return false;
      }
    }

    return true;
  },
  selectArea: function(e) {
    var $target = $(e.target);
    var $cur    = $(e.currentTarget);

    if ( !$target.hasClass("js-select") ) {
      $cur.find(".js-select").trigger("click");
    }
  },
  saveAddress: function() {
    var self = this;

    var inputError = !this.checkInputs();

    if (inputError) {
      return;
    }

    hint.showLoading();
    
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

        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          postcode: "",
          name: $form.find("[name=name]").val(),
          pphone: $form.find("[name=pphone]").val(),
          address: $form.find("[name=address]").val(),
          province: {
            id: $form.find("[name=province]").val()
          },
          city: {
            id: $form.find("[name=city]").val()
          },
          area: {
            id: $form.find("[name=area]").val()
          }
        });

        var method = "newAddress";

        if (addressInfo.addressid) {
          method = "updateAddress";
          params.addressid = addressInfo.addressid;
        }

        sendPost(method, params, function(err, data) {
          next(err, data);
        });
      },
      function(saveData, next) {
        if (UrlUtil.parseUrlSearch().action === "order") {
          hint.showLoading();

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
                orderid: UrlUtil.parseUrlSearch().orderid,
                addressid: saveData.addressid
              });

              sendPost("addOrderAddr", params, function(err, data) {
                next(err, data);
              });
            }
          ], function(err) {
            if (err) {
              toast(err.message, 1500);
              return;
            }

            // hint.hideLoading();
            var orderDetailUrl = window.location.origin +
                "/fe/app/client/mall/html/detail-page/order-detail.html" +
                "?orderid=" + UrlUtil.parseUrlSearch().orderid;
            window.location.href = orderDetailUrl;
          });
        } else {
          addressUtil.setDefault(saveData.addressid, function(err, data) {
            next(err, data);
          });
        }
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

      hint.hideLoading();

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
