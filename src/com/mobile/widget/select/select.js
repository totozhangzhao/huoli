var $        = require("jquery");
var Backbone = require("backbone");
var async    = require("async");

exports.MultiLevel = Backbone.View.extend({
  events: {
    "change .js-select": "selectOption"
  },
  initialize: function() {
    var $select = this.$el.$select = this.$el.find(".js-select");

    if (this.initSelect) {
      this.initSelect($select);
    }
  },
  selectOption: function(e) {
    var self = this;
    var $cur = $(e.currentTarget);
    var $next = this.getNextSelect($cur);

    if ( $next.length === 0 ) {
      return;
    }

    var val = $cur.val().trim();

    if (val) {
      async.waterfall([
        function(next) {
          var options = {
            id: val
          };

          self.getResult(options, function(err, data) {
            next(null, data);
          });
        }
      ], function(err, result) {
        self.addOption($next, result);
        $next.trigger("change");
      });
    } else {
      this.addOption($next);
      $next.trigger("change");
    }
  },
  getNextSelect: function($curSelect) {
    return this.$el.$select.filter("[data-for='" + $curSelect.prop("name") + "']");
  },
  addOption: function($select, data) {
    var defaultObj = {
      id: "",
      name: $select.data("default-text") || "请选择"
    };

    if ( Array.isArray(data) ) {
      data.unshift(defaultObj);
    } else {
      data = [defaultObj];
    }

    var disabled = data.length === 1 ? true : false;

    // 除默认值外，只有一项时，默认选中。如：北京、天津、上海、重庆默认选中
    if (data.length === 2) {
      data[0].selected = false;
      data[1].selected = true;
    }

    var html = this.createOption(data);

    $select
      .prop("disabled", disabled)
      .html(html);
  },
  createOption: function(data) {
    var optionTmpl = require("com/mobile/widget/select/tpl/option.tpl");
    return optionTmpl({
      list: data
    });
  }
});
