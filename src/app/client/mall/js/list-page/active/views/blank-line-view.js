import Backbone from "backbone";
import template from "app/client/mall/tpl/list-page/active/ui/blank-line.tpl";
const BlankLineView = Backbone.View.extend({
  tagName: 'div',

  className: 'space-line',

  initialize() {

  },
  render() {
    this.$el.html(template({
      group: this.model
    }))
    .css({
      backgroundColor: this.model.backcolor
    });
    return this;
  }
});
export default BlankLineView;
