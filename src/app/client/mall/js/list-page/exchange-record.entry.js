import $ from "jquery";
import Backbone from "backbone";
import _ from "lodash";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import storage from "app/client/mall/js/lib/storage.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import ui from "app/client/mall/js/lib/ui.js";
import BackTop from "com/mobile/widget/button/to-top.js";
import logger from "com/mobile/lib/log/log.js";
import Navigator from "app/client/mall/js/common/views/header/navigator.js";
import listTpl from "app/client/mall/tpl/list-page/exchange-record.tpl";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import * as widget from "app/client/mall/js/lib/common.js";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";
mallWechat.initShare();

const orderListLog = widget.initTracker("orderList");

const AppView = Backbone.View.extend({
  el: "#order-list",
  events: {
    "click .js-tab": "switchList",
    "click .js-order-item": "gotoOrderDetail"
  },
  initialize() {
    const nav = new Navigator();
    nav.render();
    new BackTop();
    this.loadingMore = false;
    this.$initial = ui.initial().show();

    // var self = this;
    // this.$el.$emptyHint = $("#empty-record-hint");
    // this.$el.$emptyHint
    //   .on("click", function() {
    //     self.refreshPage();
    //   });

    this.$blank = ui.blank("暂无订单");
    this.mallOrderList();
    this.mallSearchList();
    logger.track(`${mallUtil.getAppName()}PV`, "View PV", document.title);
    orderListLog({
      title: document.title,
      hlfrom: UrlUtil.parseUrlSearch().hlfrom || "--"
    });
  },
  setAppRightButton(text) {
    NativeAPI.invoke("updateHeaderRightBtn", {
      action: "show",
      text
    }, err => {
      if (err) {
        window.console.log(err.message);
        return;
      }
    });
  },
  mallSearchList() {
    const self = this;

    this.setAppRightButton("搜索");

    const SearchPanel = function() {
      this.$panel = $("#search-list");
      const $list = this.$panel.find(".js-container");
      let timerId;

      const renderSearchResults = (result) => {
        if (!Array.isArray(result) || result.length === 0) {
          $list.empty();
          timerId = setTimeout(() => {
            clearTimeout(timerId);
            $list.html( self.$blank );
          }, 3000);
        } else {
          clearTimeout(timerId);
          const tmplData = {
            orderList: result,
            getMoneyText: tplUtil.getMoneyText
          };

          $list.html( listTpl(tmplData) );
          widget.imageDelay();
        }
      };

      const $input = this.$panel.find("[data-name='search']");
      const doSearch = () => {
        const keywords = $input.val();

        if (keywords === "") {
          renderSearchResults(null, []);
          clearTimeout(timerId);
          return;
        }

        const options = {
          listType: 4, // 搜索类型
          keywords
        };

        self.getOrderList(options, renderSearchResults);
      };

      this.$panel
        .on("click", ".js-order-item", self.gotoOrderDetail)
        .on("click", ".js-search-button", doSearch);

      $input
        .on("keypress", e => {
          if (e.which === 13) {
            doSearch();
          }
        });
        // .on("click", ".js-search-button", _.debounce(doSearch, 150));
    };

    _.extend(SearchPanel.prototype, {
      show() {
        self.$el.hide();
        this.$panel.show();
        self.setAppRightButton("取消");
      },
      hide() {
        this.$panel.hide();
        self.$el.show();
        self.setAppRightButton("搜索");
      },
      toggle() {
        if ( this.$panel.is(":visible") ) {
          this.hide();
        } else {
          this.show();
        }
      }
    });

    const panel = new SearchPanel();

    NativeAPI.registerHandler("headerRightBtnClick", () => {
      panel.toggle();
    });
  },
  switchList(e) {
    const $cur = $(e.currentTarget);

    if ( $cur.hasClass("on") ) {
      return;
    }

    this.$el.find(".js-tab").removeClass("on");
    $cur.addClass("on");

    this.listType = this.$el.find(".js-tab.on").data("type");

    this.$el
      .find(".js-container")
        .removeClass("on")
        .eq( $cur.index() )
          .addClass("on");

    this.mallOrderList();
  },
  initLoadingMore() {
    const self = this;
    const screenHeight = $(window).height();
    const edgeHeight = screenHeight * 0.35;

    $(window).on("scroll", () => {
      if (self.loadingMore) {
        return;
      }

      if ( $(window).scrollTop() + screenHeight > $(document).height() - edgeHeight ) {
        self.loadMore();
      }
    });
  },
  refreshPage() {
    window.location.reload();
  },
  loadMore() {
    const $listBox = this.$el.find(".js-container.on");
    const lastOrderId = $listBox
        .find(".js-order-item")
          .last()
          .data("id");

    const renderView = (result) => {
      if (Array.isArray(result) && result.length > 0) {
        const tmplData = {
          orderList: result,
          getMoneyText: tplUtil.getMoneyText
        };

        $listBox.append( listTpl(tmplData) );
      }
    };

    this.getOrderList({
      lastOrderId,
      listType: this.listType
    }, renderView);
  },
  mallOrderList() {
    const self = this;
    const $listBox = this.$el.find(".js-container.on");

    if ( $listBox.data("_cache") ) {
      return;
    }

    const listType = this.listType || this.$el.find(".js-tab.on").data("type");

    const renderView = (result) => {
      self.$el
        .find(".js-ui-hide")
        .addClass("show");

      if (!Array.isArray(result) || result.length === 0) {
        $listBox.html( self.$blank );
      } else {
        const tmplData = {
          orderList: result,
          getMoneyText: tplUtil.getMoneyText
        };

        $listBox
          .html( listTpl(tmplData) )
          .data("_cache", true);
        widget.imageDelay();
        self.setPageResume();
      }

      self.$initial.hide();
      self.initLoadingMore();
    };

    this.getOrderList({ listType }, renderView);
  },
  getOrderList(options = {}, callback) {
    this.loadingMore = true;

    // 全部订单页面也作为一个入口，所以 { reset: true }
    mallPromise
      .checkLogin({ reset: true })
      .then(userData => {

        // style:
        //
        // String 类型
        //
        // 1 商城
        // 2 一元夺宝
        // 3 保险
        // 4 优惠券
        const style = UrlUtil.parseUrlSearch().style || "1";

        const params = _.extend({}, userData.userInfo, {
          p    : userData.deviceInfo.p,
          last : options.lastOrderId || "",
          type : options.listType,
          key  : options.keywords,
          style
        });

        return new Promise((resolve, reject) => {
          sendPost("orderList", params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      })
      .then(result => {
        this.loadingMore = false;
        callback(result);
      })
      .catch(err => {
        this.loadingMore = false;
        mallPromise.catchFn(err);
      });
  },
  setPageResume() {
    NativeAPI.registerHandler("resume", () => {
      new Promise((resolve) => {
        storage.get("mallInfo", data => {
          data = data || {};
          let orderFlag = false;
          if (data.status) {
            orderFlag = data.status.orderChanged;
          }
          resolve({
            orderFlag,
            data
          });
        });
      })
        .then(result => {
          let data = result.data;
          if (data.status) {
            data.status.orderChanged = false;
          }
          return new Promise((resolve) => {
            storage.set("mallInfo", data, () => {
              resolve(resolve.orderFlag);
            });
          });
        })
        .then(() => {
          window.location.reload();
        })
        .catch(mallPromise.catchFn);
    });
  },
  gotoOrderDetail(e) {
    const $cur = $(e.currentTarget);

    widget.createNewView({
      url: `/fe/app/client/mall/html/detail-page/order-detail.html?orderid=${$cur.data("id")}&from=order-list-page`,
      title: "订单详情"
    });
  }
});

new AppView();
