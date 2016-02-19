var $        = require("jquery");
var Backbone = require("backbone");

var PopModel = require("com/mobile/widget/popover/models/PopModel.js")

/*
API
  reset，render  根据model重置视图
  show 显示视图
  hide 隐藏视图
*/
var Pop = Backbone.View.extend({
  events: {
    "click .confirm-btn-box>a:first"      : "yes",
    "click .confirm-sure-btn"             : "yes",
    "click .confirm-btn-box>a:last"       : "no",
    "click .confirm-close"                : "hide"
  },
  template: require("com/mobile/widget/popover/tpl/poppannel.tpl"),
  initialize: function(options) {
    this.model = new PopModel(options.options);
    this.listenTo(this.model, "change:title", this.updateTitle);
    this.listenTo(this.model, "change:message", this.updateMessage);
    this.listenTo(this.model, "change:btnText", this.updateBtnText);
    this.listenTo(this.model, "change:cancleText", this.updateCancleText);
    return this.render();
  },
  reset: function () {
    this.render();
    return this;
  },
  render: function () {
    return this.$el.html(this.template({data:this.model.toJSON()}));
  },
  // 显示
  show: function () {
    return $(".common-shadow",this.$el).show();
  },
  // 隐藏
  hide: function () {
    return $(".common-shadow",this.$el).hide();
  },
  // 销毁
  remove: function () {

  },
  // 点击确定按钮
  yes: function () {
    if(typeof this.model.get('clickBtn') === "function"){
      this.model.get('clickBtn')();
    }
    return this.hide();
  },
  // 点击取消按钮
  no: function () {
    if(typeof this.model.get('clickCancel') === "function"){
      this.model.get('clickCancel')();
    }
    return this.hide();
  },
  // 更新标题
  updateTitle: function () {
    return $(".ui-confirm>.ui-confirm-tip>p:first", this.$el).html(this.model.get('title'));
  },
  // 更新消息内容
  updateMessage: function () {
    return $(".ui-confirm>.ui-confirm-tip>p:last", this.$el).html(this.model.get('title'));
  },
  // 更新确定按钮文案
  updateBtnText: function () {
    if(this.model.get("type") === "confirm"){
      return $(".confirm-btn-box>a:first", this.$el).html(this.model.get('btnText'));
    }
    return $(".confirm-sure-btn", this.$el).html(this.model.get('btnText'));
  }, 
  // 取消按钮文案
  updateCancleText: function () {
    if(this.model.get("type") === "confirm"){
      return $(".confirm-btn-box>a:last", this.$el).html(this.model.get('cancleText'));
    }
  }

})

module.exports = Pop