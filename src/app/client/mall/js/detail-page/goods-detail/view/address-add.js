import $ from "jquery";
import Backbone from "backbone";
import _ from "lodash";
import async from "async";
import appInfo from "app/client/mall/js/lib/app-info.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import {MultiLevel} from "com/mobile/widget/select/select.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import hint from "com/mobile/widget/hint/hint.js";
import pageAction from "app/client/mall/js/lib/page-action.js";
import validator from "app/client/mall/js/lib/validator.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import * as addressUtil from "app/client/mall/js/lib/address-util.js";
import {getProvince} from "app/client/mall/js/lib/province.js";

require("app/client/mall/js/lib/common.js");

const AppView = Backbone.View.extend({
  el: "#address-add",
  events: {
    "click #save-address": "saveAddress",
    "click .address-option-area": "selectArea",
    "blur  [name]": "blurInput"
  },
  initialize(commonData) {
    _.extend(this, commonData);
    this.curAddress = {};
  },
  resume(options) {
    if (options.previousView === "") {
      setTimeout(() => {
        this.router.replaceTo("goods-detail");
        pageAction.setClose();
      }, 0);
      return;
    }

    this.urlObj = UrlUtil.parseUrlSearch();
    pageAction.hideRightButton();
    hint.showLoading();

    const action = this.cache.addressAction;
    const addressList = this.collection.addressList;

    if (action === "add") {
      this.cache.addressAction === null;
      this.curAddress = {};
    } else if (action) {
      this.cache.addressAction === null;
      const selectedId = this.cache.curAddressId;
      this.cache.curAddressId = null;
      this.curAddress = addressList.get(selectedId).toJSON();
    } else if (addressList && addressList.length > 0) {
      this.curAddress = addressList.at(0).toJSON();
    }

    this.initView(this.curAddress);
    this.$el.$inputs = this.$el.find("[name]");
    this.$el.$submit = $("#save-address");
  },
  initView(addressInfo) {
    const addressTpl = require("app/client/mall/tpl/detail-page/address-edit.tpl");

    this.$el.html(addressTpl({
      addressInfo
    }));

    this.initSelectWidget();
  },
  initSelectWidget() {
    const initMultiLevel = regionData => {
      MultiLevel.prototype.initSelect = function($select) {
        const self = this;

        if (regionData) {
          $select.each((index, item) => {
            self.addOption( $(item), regionData[item.name] );
          });
        } else {
          $select.each((index, item) => {
            if (index === 0) {
              self.addOption( $(item), getProvince() );
            } else {
              self.addOption( $(item) );
            }
          });
        }
      };

      MultiLevel.prototype.getResult = (options, callback) => {
        const params = {
          id: options.id
        };
        sendPost("getRegion", params, (err, data) => {
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
  initSelectedRegion(callback) {
    const curAddress = this.curAddress;

    if (!curAddress.province || !curAddress.city || !curAddress.area) {
      return callback(null);
    }

    const setSelected = (list, id) => {
      for (let i = 0, len = list.length; i < len; i += 1) {
        if (list[i].id === id) {
          list[i].selected = true;
          return list;
        }
      }
      return list;
    };

    async.auto({
      province(next) {
        next(null, setSelected(getProvince(), curAddress.province.id));
      },
      city(next) {
        const params = {
          id: curAddress.province.id
        };
        sendPost("getRegion", params, (err, data) => {
          next(err, setSelected(data, curAddress.city.id));
        });
      },
      area(next) {
        const params = {
          id: curAddress.city.id
        };
        sendPost("getRegion", params, (err, data) => {
          next(err, setSelected(data, curAddress.area.id));
        });
      }
    }, (err, results) => {
      callback(results);
    });
  },
  checkInputs() {
    const $items = this.$el.$inputs;
    const defaultHint = "请填写完整的地址信息";

    for (let i = 0, len = $items.length; i < len; i += 1) {
      const $curInput = $items.eq(i);
      const curValue = $curInput.val();
      const method = $curInput.data("checkMethod");

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
  selectArea(e) {
    const $target = $(e.target);
    const $cur    = $(e.currentTarget);

    if ( !$target.hasClass("js-select") ) {
      $cur.find(".js-select").trigger("click");
    }
  },
  saveAddress() {
    const self = this;
    const inputError = !this.checkInputs();

    if (inputError) {
      return;
    }

    hint.showLoading();

    const addressInfo = this.curAddress;

    async.waterfall([
      next => {
        appInfo.getUserData((err, userData) => {
          if (err) {
            toast(err.message, 1500);
            return;
          }

          next(null, userData);
        });
      },
      (userData, next) => {
        const $form = self.$el;
        const addressData = {
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
          },
          def: 1
        };
        const params = _.extend({}, userData.userInfo, addressData, {
          p: userData.deviceInfo.p
        });
        let method = "newAddress";

        if (addressInfo.addressid) {
          method = "updateAddress";
          params.addressid = addressInfo.addressid;
        }

        sendPost(method, params, (err, data) => {
          if (!err) {
            addressData.addressid = data.addressid;
          }
          next(err, addressData);
        });
      },
      (addressData, next) => {
        if (self.urlObj.mold !== void 0) {
          self.router.replaceTo("address-list");
          return;
        } else {
          next(null, addressData);
        }
      },
      (addressData, next) => {
        addressUtil.getList((err, result) => {
          if (err) {
            toast(err.message, 1500);
            return;
          }

          self.collection.addressList.reset(result);
          next(null, addressData);
        });
      }
    ], err => {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      hint.hideLoading();
      self.router.replaceTo("address-confirm");
    });
  }
});

export default AppView;
