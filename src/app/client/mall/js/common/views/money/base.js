import Backbone from "backbone";

const BaseMoneyView = Backbone.View.extend({
  initialize() {
  },

  setRefresh() {
    this.$originalPriceView = this.$el.find(".js-original-price");
    this.$unitPriceView = this.$el.find(".js-unit-price");
    this.$totalPriceView = this.$el.find(".js-total-price");
    this.$totalPriceWithOutDiscountView = this.$el.find(".js-total-without-discount");
  },

  refresh() {
    if (this.$originalPriceView.length > 0) {
      this.$originalPriceView.text(this.model.getOriginalPriceText());
    }

    if (this.$unitPriceView.length > 0) {
      this.$unitPriceView.text(this.model.getPPriceText(1));
    }

    if (this.$totalPriceView.length > 0) {
      this.$totalPriceView.text(this.model.getPPriceText(false, true));
      this.$totalPriceWithOutDiscountView.text(this.model.getPPriceText());
    }
  }
});

module.exports = BaseMoneyView;
