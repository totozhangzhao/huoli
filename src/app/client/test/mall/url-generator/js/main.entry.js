import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
import {urlMap} from "app/client/mall/js/common/config.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import {createUrl} from "app/client/mall/js/lib/common-util.js";

import inputArgsTpl from "app/client/test/mall/url-generator/tpl/input-args.tpl";
import urlItemTpl from "app/client/test/mall/url-generator/tpl/url-item.tpl";

const AppView = Backbone.View.extend({
  el: "body",
  events: {
    "click .js-page-type-radio": "changePageType",
    "click .js-create-url-button": "createEvent"
  },
  initialize() {
    this.$blockPageType = $("#block-page-type");
    this.$blockArgs = $("#block-args");
    this.$result = $("#block-result").find(".js-content");

    const pageType = this.getPageType();
    this.createParamsBoard(pageType);
  },
  changePageType(e) {
    const pageType = $(e.currentTarget).prop("id");
    this.createParamsBoard(pageType);
  },
  createParamsBoard(pageType) {
    const args = urlMap[pageType].args;

    const tmpl = inputArgsTpl({
      list: args
    });

    this.$blockArgs.html(tmpl);
    this.$result.empty();
  },
  getPageType() {
    return this.$blockPageType.find("input:checked").prop("id");
  },
  getArgs(args) {

    // 不需要参数
    if (!args) {
      return {};
    }

    if (args && args.length > 0) {
      let flag = true;
      let queryObj = {};
      args.forEach(item => {
        const $input = this.$blockArgs.find(`input[name=${item}]`);
        const inputVal = $input.val();
        if ( inputVal === "" ) {
          flag = false;
        } else {
          queryObj[item] = inputVal;
        }
      });

      if ( flag === false ) {
        return flag;
      } else {
        return queryObj;
      }
    } else {

      // 不需要参数
      return {};
    }
  },
  showResult(text) {
    const data = [
      {
        title: "航班正式：",
        content: "https://hbmall.rsscc.cn" + text
      },
      {
        title: "高铁正式：",
        content: "https://mall.rsscc.cn" + text
      },
      {
        title: "航班测试：",
        content: "http://test.hbmall.rsscc.cn" + text
      },
      {
        title: "高铁测试：",
        content: "http://test.mall.rsscc.cn" + text
      }
    ];
    this.$result.html(urlItemTpl({
      list: data
    }));
  },
  createEvent() {
    const pageType = this.getPageType();
    const args = urlMap[pageType].args;
    const queryObj = this.getArgs(args);

    if ( queryObj === false ) {
      toast("请填写参数的值", 1500);
      return;
    }

    const $fromInput = this.$blockArgs.find(`input[name=hlfrom]`);

    // 来源
    if ( $fromInput.val() !== "" ) {
      queryObj.hlfrom = $fromInput.val();
    }

    let params = {
      url: urlMap[pageType].url,
      queryObj
    };

    if ( _.isEmpty(queryObj) ) {
      delete params.queryObj;
    }

    const result = createUrl(params);
    this.showResult(result);
  }
});

new AppView();
