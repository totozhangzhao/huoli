import Backbone from "backbone";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import template from "app/client/mall/tpl/list-page/active/ui/group-single.tpl";

const BlankLine = Backbone.View.extend({
  tagName: 'div',

  className: 'theme-row-list-bar',

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
  },

  // 设置图片高度
  resizeImg() {
    let img = this.$el.find('.active-img');
    img.height(img.width()/this.model.imgratio);
  }
});
export default BlankLine;
