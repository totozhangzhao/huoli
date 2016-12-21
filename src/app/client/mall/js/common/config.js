import * as mallUtil from "app/client/mall/js/lib/util.js";

export const config = {
  eruda: {
    name: "____m____",
    token: "cnNzY2NjbmVydWRh",
    closeName: "closedebug",
  },
  mall: {
    cookieOptions: {
      secure: !(mallUtil.isTest || mallUtil.isDev),
      expires: 86400 * 30,
      domain: location.hostname.replace(/^(test|dev)\./, ""),
      path: "/"
    }
  }
};

export const urlMap = {
  "goods-detail": {
    url: "/fe/app/client/mall/html/detail-page/goods-detail.html",
    args: ["productid"]
  },
  "share-page": {
    url: "/fe/app/client/mall/html/share-page/share.html",
    args: ["productid"]
  },
  "scratch-card": {
    url: "/fe/app/client/mall/html/active-page/scratch-card/main.html",
    args: ["productid"]
  },
  "crowd-detail": {
    url: "/fe/app/client/mall/html/active-page/crowd/main.html",
    args: ["productid"]
  },
  "crowd-list": {
    url: "/fe/app/client/mall/html/menu/grab.html",
  },
  "goods-category": {
    url: "/fe/app/client/mall/html/list-page/category/list.html",
    args: ["groupId"]
  },
  "category": {
    url: "/fe/app/client/mall/html/menu/category.html",   // 分类列表页
  },
  "shake-detail": {
    url: "/fe/app/client/mall/html/shake/shake.html",      // 摇一摇
    args: ["productid"]
  },
  "active-list-page": {
    url: "/fe/app/client/mall/html/list-page/active/list.html",   // 活动模版
    args: ["groupId"]
  },
  "test-action": {
    url: "/fe/app/client/mall/html/shake/shake.html",    // 测试用action
    args: ["productid"]
  }
};
