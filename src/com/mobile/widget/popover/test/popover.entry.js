var Popover = require("com/mobile/widget/popover/popover.js");
var PopModel = require("com/mobile/widget/popover/models/PopModel.js");

var pModel = new PopModel();
/* 
  更新model 只支持修改文案和方法
  暂不支持修改弹窗的类型
*/
pModel.set({
  type: "confirm", // 暂时有 confirm, alert 两种类型 
  title: "标题",
  message: "消息",
  btnText: "确定",  
  cancleText: "取消", // alert类型 此参数无效
  clickBtn: function (){ window.alert("clickBtn")},
  clickCancel: function () { window.alert("clickCancel")} // alert类型 此方法无效
})
var popover = new Popover({
  el: "#popover-box",
  model: pModel
});
popover.show();

popover.model.set({title: "更新标题"});