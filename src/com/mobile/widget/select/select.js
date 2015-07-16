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
        if ( self.getNextSelect($next) ) {
          $next.trigger("change");
        }
      });
    } else {
      this.addOption($next);
      if ( self.getNextSelect($next) ) {
        $next.trigger("change");
      }
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
    var html = this.createOption(data);

    $select
      .prop("disabled", disabled)
      .html(html);
  },
  createOption: function(data) {
    var html = "";

    $.each(data, function(index, item) {
      html += "<option value='" + item.id + "'>" + item.name + "</option>";
    });

    return html;
  }
});
