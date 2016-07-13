var Backbone = require("backbone");
var Router   = require("app/client/mall/js/profile/router/router.js");
import Navigator from "app/client/mall/js/menu/header/navigator.js";
const nav = new Navigator();
nav.render();
new Router();
Backbone.history.start();
