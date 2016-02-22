var $        = require("jquery");
var Backbone = require("backbone");
var PopModel = Backbone.Model.extend({
  defaults:{
    title: "提示信息",
    message: "。。。",
    type: "alert",
    btnText:"继续购买",
    cancleText: "查看订单"
  }
});
module.exports = PopModel;