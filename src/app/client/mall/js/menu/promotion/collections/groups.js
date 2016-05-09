var $             = require("jquery");
var Backbone      = require("backbone");
var _             = require("lodash");
var Group = require("app/client/mall/js/menu/promotion/models/group.js");
var GroupList  = Backbone.Collection.extend({
  model: Group
});
module.exports = GroupList;
