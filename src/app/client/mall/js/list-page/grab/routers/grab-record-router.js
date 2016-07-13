import Backbone from "backbone";
import App from "app/client/mall/js/list-page/grab/views/record-page.js";

export default Backbone.Router.extend({
  routes: {
    "": "default",
    ":active": "dispatch"
  },
  initialize() {
    this.app = new App();
  },

  default() {
    this.switchTo("record", true, true);
  },

  dispatch(action) {
    this.app.changeView(action);
  },
  switchTo(view, trigger, replace) {
    this.navigate(view, {
      trigger: !!trigger,
      replace: !!replace
    });
  }
});
