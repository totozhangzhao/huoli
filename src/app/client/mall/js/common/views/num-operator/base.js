import $ from "jquery";
import Backbone from "backbone";
import {toast} from "com/mobile/widget/hint/hint.js";

const BaseNumView = Backbone.View.extend({

  events: {
    "touchstart [data-operator]": "beginTouch",
    "keyup .js-goods-num-input": "inputKeyUp",
    "keydown .js-goods-num-input": "inputKeyDown",
    "blur .js-goods-num-input": "inputBlur"
  },

  initialize() {
  },

  setRefresh() {
    this.$numberInput = this.$el.find(".js-goods-num-input");
    this.$add = this.$el.find("[data-operator='add']");
    this.$sub = this.$el.find("[data-operator='subtract']");
  },

  refresh() {
    const model = this.model;

    this.$numberInput.val(model.get("number"));

    if (model.get("number") === 1) {
      this.$sub.addClass("off");
    } else {
      this.$sub.removeClass("off");
    }

    if (model.get("number") < model.get("limitNum")) {
      this.$add.removeClass("off");
    } else {
      if (model.previous("number") < model.get("limitNum")) {
        toast(model.get("limitMessage"), 1500);
      }
      this.$add.addClass("off");
    }

    if (model.has("refresh")) {
      try {
        model.get("refresh")();
      } catch (e) {
        window.console.log(e);
      }
    }
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
