import Backbone from "backbone";
import Router from "app/client/mall/js/detail-page/goods-detail/router/router.js";
import Navigator from "app/client/mall/js/menu/header/navigator.js";
const nav = new Navigator();
nav.render(300);
new Router();
Backbone.history.start();
