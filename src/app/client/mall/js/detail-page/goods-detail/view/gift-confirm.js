import _ from "lodash";
import Backbone from "backbone";

let AppView = Backbone.View.extend({
  el: "#gift-confirm",

  events: {

  },

  initialize(commonData) {
    _.extend(this, commonData);
    this.render();

  },
  resume(options) {
    window.console.log(options);
    this.render();
  },

  render() {
    this.$el.html('111111');
  },

  initView() {

  }

});

export default AppView;
