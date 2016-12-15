import _ from "lodash";
export const shareInfo = {
  title: "迈出回家第一步，雷凌双擎伙力接送免单活动",
  desc: "管家APP购买春运回家票，雷凌双擎伙力接送免费乘",
  link: `${window.location.origin}/fe/app/client/mall/html/active-page/active/20161215.html`,
  img: "http://cdn.rsscc.cn/guanggao/img/mall/active/leiling/leiling-share.png"
};
let imgBase = "http://cdn.rsscc.cn/guanggao/img/mall/active/leiling/";
let imgVersion = "1.0";
let imgNames = [
  // 人物
  `active-2-1-1.jpg`,
  `active-2-1-2.jpg`,
  `active-2-1-3.jpg`,
  `active-2-2-1.jpg`,
  `active-2-2-2.jpg`,
  `active-2-2-3.jpg`,
  `active-2-3-1.jpg`,
  `active-2-3-2.jpg`,
  `active-2-3-3.jpg`,
  `active-2-4-1.jpg`,
  `active-2-4-2.jpg`,
  `active-2-4-3.jpg`,
  `active-2-5-1.jpg`,

  `active-2-2.png`,
  `active-3-2.png`,
  `active-3-3.png`,
  `active-3-4.png`,
  `active-3-5.png`,
  `active-3-6.png`,
  `active-4-2.png`,
  `active-4-3.png`,
  `active-4-4.png`,
  `active-4-5.png`,
  `active-4-6.png`,
  `active-5-2.png`,
  `active-5-3.png`,
  `active-5-4.png`,
  `active-5-5.png`,
  `active-5-6.png`,
  `active-5-7.png`,
  `active-6-2.png`,
  `active-6-3.png`,
  `active-6-4.png`,
  `active-6-5.png`,
  `active-6-6.png`,
  `active-7-2.png`,
  `active-7-3.png`,
  `active-7-4.png`,
  `active-7-6.png`,
  `active-7-7.png`,
  `active-8-2.png`,
  `active-8-3.jpg`,
  `active-8-4.jpg`,
  `active-8-5.png`,
  `active-8-6.png`,
  `active-8-8.png`,
  `active-9-3.png`


];
let noVersionImgNames = [
  `active-8-arrow.png`,

  `active-3-1.jpg`,
  `active-4-1.jpg`,
  `active-5-1.jpg`,
  `active-6-1.jpg`,
  `active-7-1.jpg`,
  `active-8-1.jpg`
];
let imgs = [];
_.forEach(imgNames, (name) => {
  imgs.push(`${imgBase}${name}?v=${imgVersion}`);
});
_.forEach(noVersionImgNames, (name) => {
  imgs.push(`${imgBase}${name}`);
});
// 预加载图片列表
export const imgList = imgs;
