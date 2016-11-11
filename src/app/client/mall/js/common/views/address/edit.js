/*
  地址编辑
 */
import $ from "jquery";
import Backbone from "backbone";
import hint from "com/mobile/widget/hint/hint.js";
import template from "app/client/mall/tpl/common/address/edit.tpl";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import {getProvince} from "app/client/mall/js/lib/province.js";
import {MultiLevel} from "com/mobile/widget/select/select.js";
import validator from "app/client/mall/js/lib/validator.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import {addressMessage} from "app/client/mall/js/common/message.js";

const AddressEditView = Backbone.View.extend({

  tagName: "div",

  className: "address-page-box",

  events: {
    "click #save-address"       : "saveAddress",
    "click .address-option-area": "selectArea",
    "blur  [name]"              : "blurInput"
  },

  initialize(options) {
    this.curAddress = options.curAddress || {};
    $(options.parentDom).html(this.$el);
    this.$el.html(template({
      addressInfo: this.curAddress,
      addressMessage
    }));
    this.initSelectWidget();
  },

  render() {
    return this;
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
      window.console.log(list);
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

  valid() {
    let $items = this.$el.find("[name]");
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


  getAddress() {
    let addressData = {
      postcode: "",
      name: this.$el.find("[name=name]").val(),
      pphone: this.$el.find("[name=pphone]").val(),
      address: this.$el.find("[name=address]").val(),
      province: {
        id: this.$el.find("[name=province]").val(),
        name: this.$el.find("[name=province]").find("option:selected").text()
      },
      city: {
        id: this.$el.find("[name=city]").val(),
        name: this.$el.find("[name=city]").find("option:selected").text()
      },
      area: {
        id: this.$el.find("[name=area]").val(),
        name: this.$el.find("[name=area]").find("option:selected").text()
      }
    };
    window.console.log(addressData);
    return addressData;
  }
});

export default AddressEditView;
