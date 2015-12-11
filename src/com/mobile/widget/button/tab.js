var $ = require("jquery");

var Tab = function($tabWrapper, $tabContents) {
  var $tabs = $tabWrapper.find(".js-tab");
  var changeTab = function(tabName) {
    $tabContents
      .removeClass("on")
      .filter("[data-for='" + tabName + "']")
        .addClass("on");
  };

  $tabWrapper
    .on("click", ".js-tab", function(e) {
      $tabs.removeClass("on");
      var $cur = $(e.currentTarget);
      $cur.addClass("on");
      changeTab( $cur.data("tabName") );
    });
};

module.exports = Tab;
