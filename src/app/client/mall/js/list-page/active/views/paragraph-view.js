import Backbone from "backbone";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import template from "app/client/mall/tpl/list-page/active/ui/paragraph.tpl";

const ParagraphView = Backbone.View.extend({
  tagName: 'div',

  className: 'text-desc-bar',

  initialize() {

  },
  render() {
    this.$el.html(template({
      group: this.model,
      tplUtil
    }))
    .css({
      backgroundColor: this.model.backcolor
    });
    return this;
  }
});
export default ParagraphView;
