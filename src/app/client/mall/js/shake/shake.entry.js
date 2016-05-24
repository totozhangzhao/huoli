import $                from "jquery";
import Share            from "com/mobile/widget/shake/shake.js";

function h () {
  window.console.log("handler");
}
var s = new Share(h, {});
window.s = s;
setTimeout(function () {
  // s.Config({o:1});
},10000);
window.console.log($);
