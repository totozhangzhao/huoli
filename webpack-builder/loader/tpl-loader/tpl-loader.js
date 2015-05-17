module.exports = function(source, map) {
  source = source.replace(/"/g, '\\"')
                     .replace(/[\r\n]/g, '\\n');

  source = 'var _ = require("underscore"); return _.template("' + content + '")';

  this.callback(null, source, map);
};
