import Backbone from "backbone";
import Router from "app/client/mall/js/list-page/grab/routers/grab-record-router.js";
import Navigator from "app/client/mall/js/menu/header/navigator.js";
const nav = new Navigator();
nav.render();
new Router();
Backbone.history.start();
