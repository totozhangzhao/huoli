var Backbone = require("backbone");
var Router   = require("app/client/mall/js/profile/router/router.js");
import * as mallWechat from "app/client/mall/js/lib/wechat.js";

mallWechat.initShare();
new Router();
Backbone.history.start();
