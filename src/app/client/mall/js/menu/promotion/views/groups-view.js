var $        = require("jquery");
var Backbone = require("backbone");
var _        = require("lodash");

var GroupView  = Backbone.View.extend({

  el: "#group",

  events: {},

  initialize: function () {

    this.listenTo(this.collection, "add", this.render);

  },

  render: function (item, list, option) {
    // 只有集合add的model是最后一个的时候才执行渲染 set集合元素时需要传入lastIndex值
    if(list.at(option.lastIndex) === item){
      window.console.log(list);
    }
  }
});

module.exports = GroupView;
