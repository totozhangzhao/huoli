import NativeAPI from "app/client/common/lib/native/native-api.js";
import storage from "app/client/mall/js/lib/storage.js";
import Util from "com/mobile/lib/util/util.js";

let getUserData = (() => {
  const DEVICE_INFO = {
    name: "gtgj"
  };

  const USER_INFO = {
    uid: "",
    userid: "",
    authcode: ""
  };

  // memorization
  let userDataStore = {};

  function checkUserData(userData) {
    if (userData &&
      userData.userInfo &&
      userData.userInfo.uid &&
      userData.userInfo.userid &&
      userData.userInfo.authcode
    ) {
      return true;
    } else {
      return false;
    }
  }

  return (callback, opitons = {}) => {
    let reset = opitons.reset || false;

    if ( checkUserData(userDataStore) && !reset ) {
      // window.alert("from closure - userid: " + userDataStore.userInfo.userid);
      callback(null, userDataStore);
      return;
    }

    let getAppData = () => new Promise((resolve) => {
      NativeAPI.invoke("getDeviceInfo", null, (err, data) => {
        if (err) {
          resolve(DEVICE_INFO);
          return;
        }

        resolve(data);
      });
    })
      .then(deviceInfo => {

        // 兼容 pro 版本
        if ( /pro/.test(deviceInfo.name) ) {
          deviceInfo.__name = deviceInfo.name;
          deviceInfo.name = deviceInfo.name.replace(/pro/, "");
        }

        let params = {
          appName: deviceInfo.name
        };

        return new Promise((resolve) => {
          NativeAPI.invoke("getUserInfo", params, (err, data) => {
            if ( err && (String(err.code) === "-32001") ) {
              resolve({
                deviceInfo,
                userInfo: USER_INFO
              });
              return;
            } else if (err) {
              window.console.log(JSON.stringify(err));
              resolve({
                deviceInfo,
                userInfo: USER_INFO
              });
              return;
            }

            data = Util.isObject(data) ? data : {};
            data.uid      = data.uid      || "";
            data.userid   = data.userid   || "";
            data.authcode = data.authcode || "";

            resolve({
              deviceInfo,
              userInfo: data
            });
          });
        });
      })
      .then(userData => {

        // 兼容 version 3.2
        if (userData.userInfo.hbuserid) {
          return userData;
        } else if (userData.deviceInfo.name === "hbgj") {
          userData.userInfo.hbauthcode = userData.userInfo.authcode;
          userData.userInfo.hbuserid   = userData.userInfo.userid;
          return userData;
        } else {
          return new Promise((resolve) => {
            NativeAPI.invoke("getUserInfo", {
              appName: "hbgj"
            }, (err, data) => {
              if (err) {
                resolve(userData);
                return;
              }

              data = Util.isObject(data) ? data : {};
              userData.userInfo.hbauthcode = data.authcode;
              userData.userInfo.hbuserid   = data.userid;
              resolve(userData);
            });
          });
        }
      })
      .then(userData => {
        if ( checkUserData(userData) ) {
          return new Promise((resolve) => {
            storage.set("userDataStore", userData, () => {
              resolve(userData);
            });
          });
        } else {
          return userData;
        }
      })
      .then(userData => {

        // App 有时会带上 identity
        if (userData.userInfo.identity) {
          delete userData.userInfo.identity;
        }

        if ( checkUserData(userData) ) {
          userDataStore.deviceInfo = userData.deviceInfo;
          userDataStore.userInfo   = userData.userInfo;
        }

        // window.alert("from native api - userid: " + result.userInfo.userid);
        callback(null, userData);
      })
      .catch(err => {
        callback(err);
      });

    if ( !reset ) {
      storage.get("userDataStore", data => {
        data = Util.isObject(data) ? data : {};
        if ( checkUserData(data) ) {
          userDataStore = data;
          // window.alert("from storage - userid: " + data.userInfo.userid);
          callback(null, data);
        } else {
          getAppData();
        }
      });
      return;
    }

    new Promise((resolve) => {
      storage.set("userDataStore", {
        deviceInfo: DEVICE_INFO,
        userInfo: USER_INFO
      }, () => {
        resolve(null);
      });
    })
      .then(() => {
        getAppData();
      });
  };
})();

export default { getUserData };
