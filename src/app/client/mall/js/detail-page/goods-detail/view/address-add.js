import $ from "jquery";
import Backbone from "backbone";
import _ from "lodash";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import {MultiLevel} from "com/mobile/widget/select/select.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import hint from "com/mobile/widget/hint/hint.js";
import pageAction from "app/client/mall/js/lib/page-action.js";
import validator from "app/client/mall/js/lib/validator.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import * as addressUtil from "app/client/mall/js/lib/address-util.js";
import {getProvince} from "app/client/mall/js/lib/province.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {addressMessage} from "app/client/mall/js/common/message.js";

import "app/client/mall/js/lib/common.js";

let AppView = Backbone.View.extend({
  el: "#address-add",
  events: {
    "click #save-address"       : "saveAddress",
    "click .address-option-area": "selectArea",
    "blur  [name]"              : "blurInput"
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

    let action = this.cache.addressAction;
    let addressList = this.collection.addressList;

    if (action === "add") {
      this.cache.addressAction === null;
      this.curAddress = {};
    } else if (action) {
      this.cache.addressAction === null;
      let selectedId = this.cache.curAddressId;
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
    let addressTpl = require("app/client/mall/tpl/detail-page/address-edit.tpl");

    this.$el.html(addressTpl({
      addressInfo,
      addressMessage
    }));

    this.initSelectWidget();
  },
  initSelectWidget() {
    let initMultiLevel = regionData => {
      MultiLevel.prototype.initSelect = function($select) {
        let self = this;

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
        let params = {
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
    let curAddress = this.curAddress;

    if (!curAddress.province || !curAddress.city || !curAddress.area) {
      return callback(null);
    }

    function setSelected(list, id) {
      for (let i = 0, len = list.length; i < len; i += 1) {
        if (list[i].id === id) {
          list[i].selected = true;
          return list;
        }
      }
      return list;
    }

    let province = setSelected(getProvince(), curAddress.province.id);

    let city = new Promise((resolve, reject) => {
      let params = {
        id: curAddress.province.id
      };
      sendPost("getRegion", params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(setSelected(data, curAddress.city.id));
        }
      });
    });

    let area = new Promise((resolve, reject) => {
      let params = {
        id: curAddress.city.id
      };
      sendPost("getRegion", params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(setSelected(data, curAddress.area.id));
        }
      });
    });

    Promise
      .all([ province, city, area ])
      .then(results => {
        callback({
          province: results[0],
          city    : results[1],
          area    : results[2]
        });
      });
  },
  checkInputs() {
    let $items = this.$el.$inputs;
    let defaultHint = addressMessage.default;

    for (let i = 0, len = $items.length; i < len; i += 1) {
      let $curInput = $items.eq(i);
      let curValue = $curInput.val();
      let method = $curInput.data("checkMethod");

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
    let $target = $(e.target);
    let $cur    = $(e.currentTarget);

    if ( !$target.hasClass("js-select") ) {
      $cur.find(".js-select").trigger("click");
    }
  },
  saveAddress() {
    let inputError = !this.checkInputs();

    if (inputError) {
      return;
    }

    hint.showLoading();
    let addressInfo = this.curAddress;

    mallPromise
      .getAppInfo()
      .then(userData => {
        let $form = this.$el;
        let addressData = {
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
        };
        let params = _.extend({}, userData.userInfo, addressData, {
          p: userData.deviceInfo.p
        });
        let method = "newAddress";

        if (addressInfo.addressid) {
          method = "updateAddress";
          params.addressid = addressInfo.addressid;
        }

        return new Promise((resolve, reject) => {
          sendPost(method, params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              addressData.addressid = data.addressid;
              resolve(addressData);
            }
          });
        });
      })
      .then(addressData => {
        if (this.urlObj.mold !== void 0) {
          this.router.replaceTo("address-list");
          return;
        } else {
          return addressData;
        }
      })
      .then(addressData => {
        if (!addressData) {
          return;
        }
        return new Promise((resolve) => {
          addressUtil.getList(result => {
            this.collection.addressList.reset(result);
            resolve(addressData);
          });
        });
      })
      .then(addressData => {
        if (!addressData) {
          return;
        }
        hint.hideLoading();
        this.cache.curAddressId = addressData.addressid;
        this.router.replaceTo("address-confirm");
      })
      .catch(mallPromise.catchFn);
  }
});

export default AppView;
