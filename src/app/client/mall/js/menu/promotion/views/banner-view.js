import Backbone from "backbone";
import template from "app/client/mall/tpl/menu/promotion/baner.tpl";
var BannerView  = Backbone.View.extend({

  el: "#banner",

  events: {},

  template: template,

  initialize: function () {
    window.console.log(this.template);
    this.listenTo(this.collection, "add", this.render);
  },

  render: (item, list, option) => {
    // 只有集合add的model是最后一个的时候才执行渲染 set集合元素时需要传入lastIndex值
    if(list.at(option.lastIndex) === item){
      window.console.log(list);
    }
  }
});
module.exports = BannerView;
