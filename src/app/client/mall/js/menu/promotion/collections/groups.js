var Backbone      = require("backbone");

var Group = require("app/client/mall/js/menu/promotion/models/group.js");
var GroupList  = Backbone.Collection.extend({
  model: Group
});
module.exports = GroupList;
