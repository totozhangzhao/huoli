import Backbone from "backbone";
import ListView from "app/client/mall/js/list-page/order/views/list.js";
var ExpressRouter = Backbone.Router.extend({
  routes: {
    "": "default",
    ":action": "dispatch"
  },
  initialize() {
    this.listView = new ListView();
  },
  default() {
  },

  dispatch(type) {
    this.listView.fetch(type);
  }
});

export default ExpressRouter;
