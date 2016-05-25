import Promise from "com/mobile/lib/promise/npo.js";
import appInfo from "app/client/mall/js/lib/app-info.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import NativeAPI from "app/client/common/lib/native/native-api.js";

export function getAppInfo(reset) {
  return new Promise((resolve, reject) => {
    appInfo.getUserData((err, userData) => {
      if (err) {
        reject(err);
      } else {
        resolve(userData);
      }
    }, { reset: reset || false });
  });
}

export function catchFn(err) {
  if (err.message) {
    toast(err.message, 1500);
  } else {
    toast(JSON.stringify(err), 1500);
  }

  if (err instanceof Error) {
    window.console.log(`Error Message: \n${err.message}`);
    window.console.log(`Error Stack: \n${err.stack}`);
  }
}

export function login() {
  return new Promise((resolve, reject) => {
    NativeAPI.invoke("login", null, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  })
    .then((result) => {
      if ( String(result.succ) === "1" || result.value === result.SUCC ) {
        window.location.reload();
      } else {
        // hint.hideLoading();
        window.console.log(JSON.stringify(result));
        NativeAPI.invoke("close");
      }
    })
    .catch((err) => {
      if (err.code === -32603) {
        window.console.log("go to login page……");
      } else {
        catchFn(err);
      }
    });
}
