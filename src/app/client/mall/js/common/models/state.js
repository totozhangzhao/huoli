var Backbone  = require("backbone");

var StateModel = Backbone.Model.extend({
  defaults:{
    status: 0 // －1 数据返回失败 0 初始状态 1 请求数据 2 数据返回成功
  }
});

module.exports = StateModel;
