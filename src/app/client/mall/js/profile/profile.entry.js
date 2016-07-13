var Backbone = require("backbone");
var Router   = require("app/client/mall/js/profile/router/router.js");
import Navigator from "app/client/mall/js/menu/header/navigator.js";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";
mallWechat.initShare();
const nav = new Navigator();
nav.render(300);
new Router();
Backbone.history.start();
