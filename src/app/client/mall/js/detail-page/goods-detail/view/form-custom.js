import $ from "jquery";
import Backbone from "backbone";
import _ from "lodash";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import {parseUrlSearch as parseUrl} from "com/mobile/lib/url/url.js";
import pageAction from "app/client/mall/js/lib/page-action.js";
import validator from "app/client/mall/js/lib/validator.js";
import hint from "com/mobile/widget/hint/hint.js";
import {initTracker} from "app/client/mall/js/lib/common.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";

const detailLog = initTracker("detail");

const AppView = Backbone.View.extend({
  el: "#form-custom",
  events: {
    "click .js-submit"    : "createOrder",
    "input .js-form-input": "inputInput",
    "blur  .js-form-input": "blurInput"
  },
  initialize(commonData) {
    _.extend(this, commonData);
    this.$el.$shade         = this.$el.find(".js-shade");
    this.$el.$successPrompt = this.$el.find(".js-success-prompt");
  },
  resume(opts) {
    if (opts.previousView !== "goods-detail") {
      NativeAPI.invoke("close");
      return;
    }
    this.renderMainPanel();
    pageAction.setClose();
    detailLog({
      title: `${window.document.title}form-custom`,
      productid: parseUrl().productid,
      hlfrom: parseUrl().hlfrom || "--"
    });
  },
  inputInput(e) {
    $(e.currentTarget)
      .parents(".form-block")
      .find(".js-error-tip")
        .removeClass("active");
  },
  blurInput(e) {
    const $input = $(e.currentTarget);
    const val = $input.val();

    // 1.realname-icon:name  : 姓名
    // 2.idcard-icon  :idcard: 身份证号
    // 3.phone-icon   :phone : 手机号
    // 4.psw-icon     :pwd   : 输入密码
    // 5.re-psw-icon  :repwd : 再次输入密码
    // 6.email-icon   :email : 邮箱
    const checkMethods = {
      email: "checkEmail",
      phone: "checkPhoneNum",
      pwd  : "checkPassword",
      captche: "checkCaptche"
    };

    const method = checkMethods[$input.data("validateType")];

    if (
      ( !validator[method] && val !== "" ) ||
      ( validator[method] && validator[method](val) )
    ) {
      $input
        .parents(".form-block")
        .find(".js-error-tip")
          .removeClass("active");
    } else {
      $input
        .parents(".form-block")
        .find(".js-error-tip")
          .addClass("active");
    }
  },
  renderMainPanel() {
    const goods = this.cache.goods;
    const $img = $("<img>", {
      src: goods.img,
      alt: ""
    });

    this.$el.find(".js-top-image").html($img);
    const tmpl = require("app/client/mall/tpl/detail-page/form-custom.tpl");

    // 1.realname-icon:name  : 姓名
    // 2.idcard-icon  :idcard: 身份证号
    // 3.phone-icon   :phone : 手机号
    // 4.psw-icon     :pwd   : 输入密码
    // 5.re-psw-icon  :repwd : 再次输入密码
    // 6.email-icon   :email : 邮箱
    const inputClass = {
      name  : "realname-icon",
      idcard: "idcard-icon",
      phone : "phone-icon",
      pwd   : "psw-icon",
      repwd : "re-psw-icon",
      email : "email-icon"
    };

    this.$el
      .find(".js-input-container")
        .html(tmpl({
          list: goods.input,
          inputClass
        }));

    // set phone number from getUserInfo
    mallPromise
      .getAppInfo()
      .then(userData => {
        const phoneNum = userData.userInfo.phone || "";
        if (phoneNum) {
          this.$el.find(".js-form-input")
            .find("[name=phone]")
            .val(phoneNum)
            .trigger("blur");
        }
      })
      .catch(mallPromise.catchFn);
  },
  createOrder() {
    const $inputs = this.$el.find(".js-form-input");

    $inputs.trigger("blur");

    if (this.$el.find(".error-tip.active").length > 0) {
      toast("请输入正确的信息", 1500);
      return;
    }

    hint.showLoading();

    mallPromise
      .getAppInfo()
      .then(userData => {
        const inputList = {};

        $inputs.each((index, item) => {
          inputList[item.name] = item.value;
        });

        // createPhoneUser
        // uid: 设备id
        // userid: 用户id
        // authcode: token
        // productid: 产品id
        // input {{}, {}, ...}
        // 返回包
        // orderid: 订单id
        // message: 显示信息
        // useurl: 第三方url
        const params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: parseUrl().productid,
          input: inputList
        });

        return new Promise((resolve, reject) => {
          sendPost("createOrder", params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      })
      .then(result => {
        // hint.hideLoading();
        window.location.href = `/fe/app/client/mall/html/detail-page/order-detail.html?orderid=${result.orderid}`;
      })
      .catch(mallPromise.catchFn);
  }
});

export default AppView;
