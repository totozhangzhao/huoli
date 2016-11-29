import $ from "jquery";
import Backbone from "backbone";

const BaseNumView = Backbone.View.extend({

  events: {
    "touchstart [data-operator]": "beginTouch",
    "keyup .js-goods-num-input": "inputKeyUp",
    "keydown .js-goods-num-input": "inputKeyDown",
    "blur .js-goods-num-input": "inputBlur"
  },

  initialize() {
  },

  fixNum(number = 1) {
    number = Number(number);
    const limitNum = this.model.get("limitNum");
    const minNum = this.model.get("minNum");
    if (number > limitNum) {
      number = limitNum;
    } else if (number < minNum) {
      number = minNum;
    }
    return number;
  },

  validateNum(number) {
    return number === this.fixNum(number);
  },

  setNumber(number) {
    number = this.fixNum(number);
    this.model.set({
      number,
      _t_refresh: Date.now()
    });
  },

  beginTouch(e) {
    const $cur = $(e.currentTarget);
    if ($cur.hasClass("off")) {
      return;
    }
    this.computeMode = $cur.data("operator");
    let number = this.model.get("number");
    if (this.computeMode === "add") {
      number++;
    } else {
      number--;
    }
    if (this.validateNum(number)) {
      this.setNumber(number);
    }
  },

  inputKeyUp(e) {
    // const val = this.$numberInput.val();
    const val = $(e.currentTarget).val();
    if (!val || isNaN(val)) {
      return;
    }
    if (val !== "") {
      return this.setNumber(val);
    }
  },

  inputKeyDown(e) {
    if (e.shiftKey || e.which !== 8 && (e.which < 48 || e.which > 57)) {
      e.preventDefault();
      return;
    }
  },

  inputBlur(e) {
    // const val = this.$numberInput.val();
    const val = $(e.currentTarget).val();
    if (!val || isNaN(val)) {
      return this.setNumber(1);
    }
    return this.setNumber(val);
  }
});

module.exports = BaseNumView;
