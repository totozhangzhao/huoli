var Backbone = require("backbone");
var Router   = require("app/client/mall/js/active-page/crowd/router/router.js");
import Navigator from "app/client/mall/js/menu/header/navigator.js";
const nav = new Navigator();
nav.render(300);
new Router();
Backbone.history.start();
