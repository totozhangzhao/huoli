<div class="my-top-bar flex-row">
  <div class="my-portrait-area">
    <img src="http://cdn.rsscc.cn/guanggao/img/mall/avatar-1011.png" alt="">
  </div>
  <div class="my-info-area">
    <div class="my-tel-contain num-font"><%= phone || "商城用户" %></div>
    <% if ( level >= 0 && level < 9 ) { %>
    <div class="my-level-contain num-font">
        <span>V<%= level %></span>
    </div>
    <% } %>
  </div>
</div>
<div class="my-point-bar flex-row">
  <div class="my-coupons-num">
    <a href="#coupon-list">
      <div class="flex-son num-font">
        <p class="num coupons-num-box">...</p>
        <p class="item-name">优惠券</p>
      </div>
    </a>
  </div>
  <div class="my-point-num">
    <div class="flex-son num-font">
      <p class="num"><%= mallUtil.formatNumber(points) %></p>
      <p class="item-name">积分</p>
    </div>
  </div>
</div>
<div class="my-mall-bar">
  <div class="my-mall-bar-item js-touch-state touch-bg">
    <a class="my-order-area" href="/fe/app/client/mall/html/list-page/exchange-record.html?style=1">
      <b class="my-show-icon my-mall-icon"></b>
      <p>商城订单</p>
      <span id="order-status"></span>
      <b class="my-enter-icon"></b>
    </a>
  </div>
  <div class="my-mall-bar-item js-touch-state touch-bg">
    <a class="my-order-area none-line" href="/fe/app/client/mall/html/list-page/exchange-record.html?style=2">
      <b class="my-show-icon my-crowd-icon"></b>
      <p>一元夺宝订单</p>
      <span id="crowd-order-status"></span>
      <b class="my-enter-icon"></b>
    </a>
  </div>
</div>
<div class="my-mall-bar">
  <div class="my-mall-bar-item js-touch-state touch-bg">
    <a class="my-order-area" href="/fe/app/client/mall/html/detail-page/goods-detail.html?mold=profile#address-list">
      <b class="my-show-icon my-address-icon"></b>
      <p>地址管理</p>
      <b class="my-enter-icon"></b>
    </a>
  </div>
  <div class="my-mall-bar-item js-touch-state touch-bg">
    <a class="my-order-area none-line"  href="https://dl.rsscc.cn/guanggao/active/contact-us.html">
      <b class="my-show-icon my-help-icon"></b>
      <p>客服与帮助</p>
      <b class="my-enter-icon"></b>
    </a>
  </div>
</div>