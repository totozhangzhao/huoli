(function(root, factory) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    var cookie = require("com/mobile/lib/cookie/cookie.js");
    factory(root, exports, cookie);
  } else if (typeof define === "function" && define.amd) {
    define(["com/mobile/lib/cookie/cookie.js", "exports"], function(cookie, exports) {
      root.NBridge = factory(root, exports, cookie);
    });
  } else {
    root.NBridge = factory(root, {}, root.cookie);
  }
}(this, function(root, NBridge, cookie) {
  var JSON_RPC_ERROR = {
    PARSE_ERROR: {
      code: -32700,
      message: "Parse error"
    },
    INVALID_REQUEST: {
      code: -32600,
      message: "Invalid Request"
    },
    METHOD_NOT_FOUND: {
      code: -32601,
      message: "Method not found"
    },
    INVALID_PARAMS: {
      code: -32602,
      message: "Invalid params"
    },
    INTERNAL_ERROR: {
      code: -32603,
      message: "Internal error"
    }
  };

  var methods = {};
  var callbacks = {};
  var idCounter = 1;

  var send = function(message) {
    window.console.log("javascript -> native: " + JSON.stringify(message));
    window.NativeAPI.sendToNative(JSON.stringify(message));
  };

  var executeMethod = function(message) {
    var fn = methods[message.method];

    if (!fn) {
      send({
        jsonrpc: "2.0",
        error: JSON_RPC_ERROR.METHOD_NOT_FOUND,
        id: message.id || null
      });
      return;
    }
    setTimeout(function() {
      try {
        fn(message.params, function(err, result) {
          if (!message.id) {
            return;
          }

          if (err) {
            send({
              jsonrpc: "2.0",
              error: {
                code: err.code,
                message: err.message
              },
              id: message.id
            });
          } else {
            send({
              jsonrpc: "2.0",
              result: result,
              id: message.id
            });
          }
        });
      } catch (ex) {
        send({
          jsonrpc: "2.0",
          error: {
            code: ex.code || -32000,
            message: ex.message
          },
          id: message.id
        });
      }
    }, 0);
  };

  var handleCallback = function(message) {
    var callback = callbacks[message.id];
    callbacks[message.id] = null;

    if (!callback) {
      return;
    }
    setTimeout(function() {
      callback(message.error || null, message.result);
    }, 0);
  };

  var handleInternalError = function(message) {
    try {
      message = JSON.parse(message);
    } catch (ex) {
      return;
    }
    if (message.id) {
      handleCallback({
        jsonrpc: "2.0",
        error: JSON_RPC_ERROR.INTERNAL_ERROR,
        id: message.id
      });
    }
  };

  window.NativeAPI = window.NativeAPI || {};

  if (!window.NativeAPI.sendToNative) {
    (function() {
      var buffer = [];

      var timer = setTimeout(function() {
        buffer.forEach(handleInternalError);
        window.NativeAPI.sendToNative = handleInternalError;
      }, 10000);

      document.addEventListener("WebViewJavascriptBridgeReady", function() {
        clearTimeout(timer);
        setTimeout(function() {
          buffer.forEach(window.NativeAPI.sendToNative);
        }, 10);
      }, false);

      window.NativeAPI.sendToNative = function(message) {
        buffer.push(message);
      };

      if (cookie) {
        var appName = cookie.get("appName");

        if ( /hbgj/i.test(appName) ) {
          window.location.href = "openetjs://start?type=nativeapi";
        } else if ( /gtgj/i.test(appName) ) {
          window.location.href = "gtgj://start?type=nativeapi";
        }
      }
    })();
  }

  window.NativeAPI.sendToJavaScript = function(message) {
    window.console.log("native -> javascript: " + message);
    try {
      message = JSON.parse(message);
    } catch (ex) {
      return send({
        jsonrpc: "2.0",
        error: JSON_RPC_ERROR.PARSE_ERROR,
        id: null
      });
    }

    if (message.method) {
      executeMethod(message);
    } else if (message.id) {
      handleCallback(message);
    }
  };

  NBridge.registerHandler = function(name, fn) {
    methods[name] = fn;
  };

  NBridge.invoke = function(method, params, callback) {
    var message = {
      jsonrpc: "2.0",
      method: method,
      params: params
    };
    var id;

    if (callback) {
      id = "jsonp_" + idCounter;
      idCounter++;

      callbacks[id] = callback;
      message.id = id;
    }

    send(message);
  };

  Object.keys(JSON_RPC_ERROR).forEach(function(key) {
    NBridge[key] = JSON_RPC_ERROR[key];
  });

  return NBridge;
}));
