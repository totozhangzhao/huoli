/**
 * 抽奖页面
 */
import Backbone from "backbone";

const ResultView = Backbone.View.extend({
  el: "#result",
  initialize: function(commonData) {
    this.util = commonData;

  },

  resume() {

  }
});

export default ResultView;
