import Index from "app/client/mall/js/gift/views/index.js";
import Receive from "app/client/mall/js/gift/views/receive.js";
import Info from "app/client/mall/js/gift/views/info.js";
import Success from "app/client/mall/js/gift/views/success.js";
import {createRouter}     from "app/client/mall/js/common/router/router-factory.js";

const viewDic = {
  "index"          : Index,
  "receive"        : Receive,
  "info"           : Info,
  "success"        : Success
};

export default createRouter({
  viewDic,
  defaultView: "index",
  hideNavigator: true
});
