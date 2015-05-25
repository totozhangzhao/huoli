// stateicon 的具体种类
// 新用户 "new-user"
// 老用户 "old-user"
// 抢兑 "state-grab"
// 月卡 "month-card"
// 季卡 "quarter-card"
// {
//   productid: "1000010",
//   title: "高铁红包",
//   detail: "我带红包去旅行",
//   stateicon: "old-user",
//   pprice: 1000,
//   img: ""
// }
<li class="goods-area-son fl">
  <a data-productid="<%= productid %>" data-title="<%= title %>" class="js-new-page block" href="/fe/app/client/mall/html/detail-page/goods-detail.html">
    <div class="text-bar">
      <p class="text-bar-p pic-tit"><%= title %><span class="state-icon <%= stateicon %>"></span></p>
      <p class="text-bar-p pic-detail"><%= detail %></p>
      <p class="text-bar-p pic-value"><span class="exchange-num num-color"><%= pprice %></span>分</p>
    </div>
    <div class="pic-bar">
      <img src="<%= img %>" class="goods-pic" >
    </div>
  </a>
</li>
