import Backbone from "backbone";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import template from "app/client/mall/tpl/list-page/active/ui/full-image.tpl";
const FullImageView = Backbone.View.extend({
  tagName: 'div',

  className: 'pic-full-bar',

  initialize() {

  },
  render() {
    this.$el.html(template({
      group: this.model,
      tplUtil
    }));
    return this;
  },

  // 设置图片高度
  resizeImg() {
    let img = this.$el.find('.active-img');
    img.height(img.width()/this.model.goods[0].imgratio);
  }
});
export default FullImageView;
