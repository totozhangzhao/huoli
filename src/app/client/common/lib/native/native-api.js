(function(root, factory) {
  /*global define*/
  if (typeof exports === "object" && typeof module !== "undefined") {
    var cookie = require("com/mobile/lib/cookie/cookie.js");
    factory(root, exports, cookie);
  } else if (typeof define === "function" && define.amd) {
    define([
      "com/mobile/lib/cookie/cookie.js",
      "exports"
    ], function(cookie, exports) {
      root.NBridge = factory(root, exports, cookie);
    });
  } else {
    root.NBridge = factory(root, {}, root.cookie);
  }
}(this, function(root, NBridge, cookie) {
  var JSON_RPC_ERROR = {
    PARSE_ERROR: {
      code: -32700,
      message: "NativeAPI: Parse error"
    },
    INVALID_REQUEST: {
      code: -32600,
      message: "NativeAPI: Invalid Request"
    },
    METHOD_NOT_FOUND: {
      code: -32601,
      message: "NativeAPI: Method not found"
    },
    INVALID_PARAMS: {
      code: -32602,
      message: "NativeAPI: Invalid params"
    },
    INTERNAL_ERROR: {
      code: -32603,
      message: "NativeAPI: Internal error"
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
      }, 6000);

      document.addEventListener("WebViewJavascriptBridgeReady", function() {
        clearTimeout(timer);
        setTimeout(function() {
          buffer.forEach(window.NativeAPI.sendToNative);
        }, 10);
      }, false);

      window.NativeAPI.sendToNative = function(message) {

        // standalone supported
        if ( cookie && cookie.get("appVer") ) {
          window.alert("OpenetNativeAPI://" + message);
        } else {
          buffer.push(message);
        }
      };

      // standalone supported
      if (cookie) {
        var appName = cookie.get("appName");

        // 加了 cookie 的版本号
        // 高铁 3.5
        // 航班 5.2
        // 航班上刷新有问题，屏蔽 "openetjs://start?type=nativeapi"
        // window.location.href = "openetjs://start?type=nativeapi";
        // 高铁上面调用这个 scheme url 之后无法执行后续的 script 标签
        // window.location.href = "gtgj://start?type=nativeapi";
        if ( !/gtgj|hbgj/i.test(appName) ) {
          clearTimeout(timer);
          window.NativeAPI.sendToNative = handleInternalError;
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
