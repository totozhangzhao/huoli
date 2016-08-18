import Backbone   from "backbone";
import _ from "lodash";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import Storage    from "com/mobile/lib/storage/storage.js";

import * as mallUitl from "app/client/mall/js/lib/util.js";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
// 日期格式化
// import "app/client/mall/js/lib/date-util.js";

const storage       = new Storage("mallpop");
const nativeStorage = require("app/client/mall/js/lib/storage.js");
const isApp         = mallUitl.isAppFunc();
const PopoverAd     = Backbone.View.extend({
  events: {
    "click .home-active-close": "hide",
    "click .common-shadow": "hide"
  },

  template: require("app/client/mall/tpl/common/popover/ad.tpl"),

  initialize() {
  },

  fetch(param) {
    mallPromise
      .getAppInfo()
      .then(userData => {
        const params = _.extend({}, param, userData.userInfo);
        return new Promise((resovle, reject) => {
          sendPost("getPopUp", params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resovle(data);
            }
          });
        });
      })
      .then(data => {
        if(data && data.length > 0) {
          this.data = data[0];
          this.render();
        }
      })
      .catch(mallPromise.catchFn);


    // this.param = param;
    // sendPost("getPopUp", param, (err, data) => {
    //   if(err){
    //     return;
    //   }
    //   if(data && data.length > 0) {
    //     this.data = data[0];
    //     this.render();
    //   }
    // });

  },

  render() {
    const data = this.data;
    this.$el.hide().html(this.template({
      data,
      tplUtil
    }));
    if(data.rule.type === 1) { // 后台控制
      this.show();
    }else{                     // 前端控制
      this.store();
    }
    return this;
  },

  store() {
    let namespace = "mallpop";
    // var now = new Date();
    let key = `popid_${this.data.id}`;
    switch(this.data.rule.type) {
      // case 1:   // 每天弹n次
        // key = `popid_${now.format("yyyy-MM-dd")}_${this.data.id}`;
        // break;
      case 2:   // 每次重启弹n次
      default:
        key = `popid_${this.data.rule.type}_${this.data.id}`;
        break;
    }
    if( isApp ) {
      let promise = new Promise((resolve) => {
        nativeStorage.get(namespace , data => {
          resolve(data);
        });
      });
      promise.then(data => {
        if(!data) {
          data = {};
        }
        if(!data[key]) {
          data[key] = 0;
        }
        if(data) {
          if ( Number(data[key]) < this.data.rule.count ) {
            data[key] ++;
            nativeStorage.set(namespace, data, () => {
            });
            this.show();
          }
        }
      });
    }else{
      let c = storage.get(key) || 0;
      if( Number(c) < this.data.rule.count ) {
        storage.set(key, ++c );
        this.show();
      }
    }
  },

  show() {
    this.$el.show();
  },

  hide() {
    this.$el.hide();
  }
});

export default PopoverAd;
