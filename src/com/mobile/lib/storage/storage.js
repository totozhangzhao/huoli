function Storage(namespace) {
  this.namespace = namespace;
}

var LocalStorage = window.localStorage;

Storage.prototype.set = function(key, value) {
  var data = this.dump();

  data[key] = {
    value: value
  };

  data = JSON.stringify(data);

  try {
    LocalStorage.setItem(this.namespace, data);
  } catch (ex) {
    return false;
  }

  return LocalStorage.getItem(this.namespace) === data;
};

Storage.prototype.get = function(key) {
  var data = this.dump();

  if (data[key]) {
    return data[key].value;
  }
};

Storage.prototype.remove = function(key) {
  this.set(key, void 0);
};

Storage.prototype.clear = function() {
  LocalStorage.removeItem(this.namespace);
};

Storage.prototype.dump = function() {
  var data = LocalStorage.getItem(this.namespace) || "{}";

  try {
    data = JSON.parse(data);
  } catch (ex) {
    data = {};
  }
  return data;
};

module.exports = Storage;
