import Backbone from "backbone";
import Router from "app/client/mall/js/profile/router/router.js";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";

mallWechat.initShare();
new Router();
Backbone.history.start();
