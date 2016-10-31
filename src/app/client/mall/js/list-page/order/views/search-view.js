// import $ from "jquery";
// import _ from "lodash";
import Backbone from "backbone";
const SearchView = Backbone.View.extend({
  el: "#search-container",

  events: {
    "click .js-search-button": "search"

  },

  initialize(options) {
    this.listView = options.listView;
    this.inputView = this.$el.find(".search-input");
    this.inputView.on("keypress", e => {
      if (e.which === 13) {
        this.search();
      }
    });
  },

  render() {
  },

  show() {
    this.$el.show();
  },

  hide() {
    this.$el.hide();
  },

  search() {
    this.listView.clearOrderList();
    this.listView.params.key = this.inputView.val();
    this.listView.fetch();
  }
});

export default SearchView;
