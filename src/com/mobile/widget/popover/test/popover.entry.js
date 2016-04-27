var Popover = require("com/mobile/widget/popover/popover.js");

require("app/client/mall/js/lib/common.js");

/* 
  更新model 只支持修改文案和方法
  暂不支持修改弹窗的类型
*/
var alert = new Popover({
  type: "alert",
  title: "标题",
  message: "消息",
  agreeText: "查看订单",  
  agreeFunc: function() {
    window.console.log("alert: agree");
  }
});

var pop = new Popover({
  // el: "#popover-box", // 可选
  type: "confirm", // 暂时有 confirm, alert 两种类型 
  title: "标题",
  message: "消息",
  agreeText: "确定",  
  cancelText: "取消", // alert类型 此参数无效
  agreeFunc: function() { alert.show(); },
  cancelFunc: function() { window.console.log("confirm: cancel"); } // alert类型 此方法无效
});

pop.show();

// popover.model.set({title: "更新标题"});