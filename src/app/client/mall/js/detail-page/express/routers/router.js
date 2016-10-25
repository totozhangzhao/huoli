import Backbone from "backbone";
import ExpressList from "app/client/mall/js/detail-page/express/views/express-list.js";
var ExpressRouter = Backbone.Router.extend({
  routes: {
    "": "default",
    ":action": "dispatch"
  },
  initialize() {
    this.expressList = new ExpressList();
  },
  default() {
  },

  dispatch(tracking) {
    this.expressList.fetch(tracking);
  }
});

export default ExpressRouter;
