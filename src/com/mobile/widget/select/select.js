import $ from "jquery";
import Backbone from "backbone";
import optionTmpl from "com/mobile/widget/select/tpl/option.tpl";

export var MultiLevel = Backbone.View.extend({
  events: {
    "change .js-select": "selectOption"
  },
  initialize() {
    let $select = this.$el.$select = this.$el.find(".js-select");

    if (this.initSelect) {
      this.initSelect($select);
    }
  },
  selectOption(e) {
    let $cur = $(e.currentTarget);
    let $next = this.getNextSelect($cur);

    if ( $next.length === 0 ) {
      return;
    }

    let val = $cur.val().trim();

    if (val) {
      new Promise((resolve, reject) => {
        let options = {
          id: val
        };
        this.getResult(options, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      })
        .then(result => {
          this.addOption($next, result);
          $next.trigger("change");
        })
        .catch(err => {
          window.console.log(err);
        });
    } else {
      this.addOption($next);
      $next.trigger("change");
    }
  },
  getNextSelect($curSelect) {
    return this.$el.$select.filter(`[data-for='${$curSelect.prop("name")}']`);
  },
  addOption($select, data) {
    let defaultObj = {
      id: "",
      name: $select.data("default-text") || "请选择"
    };

    if ( Array.isArray(data) ) {
      if (data.length === 1) {
        data[0].selected = true;
      }
      data.unshift(defaultObj);
    } else {
      data = [defaultObj];
    }

    let disabled = data.length === 1 ? true : false;
    let html = this.createOption(data);

    $select
      .prop("disabled", disabled)
      .html(html);
  },
  createOption(data) {
    return optionTmpl({
      list: data
    });
  }
});
