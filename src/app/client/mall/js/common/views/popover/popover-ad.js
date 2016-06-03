import Backbone   from "backbone";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import Storage    from "com/mobile/lib/storage/storage.js";

import mallUitl from "app/client/mall/js/lib/util.js";
import Promise from "com/mobile/lib/promise/npo.js";
import tplUtil from "app/client/mall/js/lib/mall-tpl.js";

import "app/client/mall/js/lib/date-util.js";

var storage = new Storage("mallpop");
var nativeStorage    = require("app/client/mall/js/lib/storage.js");
const isApp   = mallUitl.isAppFunc();
const PopoverAd = Backbone.View.extend({
  events: {
    "click .home-active-close": "hide",
    "click .common-shadow": "hide",
    "click": ''
  },

  template: require("app/client/mall/tpl/common/popover/ad.tpl"),

  initialize() {
  },

  fetch(param) {
    this.param = param;
    sendPost("getPopUp", param, (err, data) => {
      if(err){
        return;
      }
      if(data && data.length > 0) {
        this.data = data[0];
        this.render();
      }
    });

  },

  render() {
    const data = this.data;
    this.$el.hide().html(this.template({
      data,
      tplUtil
    }));
    this.show();
    return this;
  },

  show() {
    var now = new Date();
    let key = `popid${this.data.id}`;
    switch(this.data.rule.type) {
      case 1:   // 每天弹n次
        key = `popid_${now.format("yyyy-MM-dd")}_${this.data.id}`;
        break;
      case 2:   // 每次重启弹n次
        break;
    }
    if( isApp ) {
      let promise = new Promise((resolve) => {
        nativeStorage.get(key , data => {
          if(isNaN(data)) {
            data = 0;
          }
          resolve(data);
        });
      });
      promise.then(value => {
        if( value < this.data.rule.count ) {
          nativeStorage.set(key, ++value, ()=>{});
          this.$el.show();
        }
      });
    }else{
      let c = storage.get(key) || 0;
      if( Number(c) < this.data.rule.count ) {
        storage.set(key, ++c );
        this.$el.show();
      }
    }

  },

  hide() {
    this.$el.hide();
  }
});

export default PopoverAd;
