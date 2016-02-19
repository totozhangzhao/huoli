var Popover = require("com/mobile/widget/popover/popover.js");

/* 
  更新model 只支持修改文案和方法
  暂不支持修改弹窗的类型
*/
var popover = new Popover({
  el: "#popover-box",
  options: {
    type: "confirm", // 暂时有 confirm, alert 两种类型 
    title: "标题",
    message: "消息",
    btnText: "确定",  
    cancleText: "取消", // alert类型 此参数无效
    clickBtn: function (){ window.alert("clickBtn")},
    clickCancel: function () { window.alert("clickCancel")} // alert类型 此方法无效
  }
});
popover.show();

// popover.model.set({title: "更新标题"});