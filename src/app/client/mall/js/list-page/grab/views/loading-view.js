import Backbone from "backbone";

const LoadingView = Backbone.View.extend({

  el: "#loading-more",

  initialize() {
  },

  show() {
    this.$el.show();
  },

  hide() {
    this.$el.hide();
  }
});

export default LoadingView;
