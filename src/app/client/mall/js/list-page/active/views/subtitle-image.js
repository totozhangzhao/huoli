import Backbone from "backbone";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import template from "app/client/mall/tpl/list-page/active/ui/subtitle-image.tpl";

const TitleView = Backbone.View.extend({
  tagName: 'div',

  className: 'topic-bar',

  initialize() {

  },
  render() {
    this.$el.html(template({
      group: this.model,
      tplUtil
    }))
    .find(".topic-area").css({
      backgroundColor: this.model.backcolor
    });
    return this;
  },

  // 设置图片高度
  resizeImg() {
    let img = this.$el.find('.topic-show-pic');
    img.height(img.width()/this.model.goods[0].imgratio);
  }
});
export default TitleView;
