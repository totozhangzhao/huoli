<div class="<%= orderDetail.needpay === 1 ? "pay-status-bar" : "pay-after-bar" %>">
  <div class="goods-detail flex-row">
    <a
      data-productid="<%= productItem.productid %>"
      data-title="<%= productItem.title %>"
      class="<%= tplUtil.getJsClass(productItem) %> flex-element"
      href="<%= tplUtil.getBlockUrl(productItem) %>"
      >
      <img src="<%= orderDetail.img %>" class="goods-show-pic">
    </a>
    <div class="flex-element">
      <p class="goods-name"><%= orderDetail.title %></p>
      <div class="goods-charge-info-fa">
        <p class="goods-charge-info num-font"><%= orderDetail.spec %></p><em class="goods-charge-count">数量 x <%= orderDetail.num %></em>
      </div>
      <div class="goods-charge-info-fa">
        <p class="goods-charge-info num-font"><span><%= orderDetail.unitPriceText %></span></p>
      </div>
    </div>
    <!-- trade-status-refund-auditing 退款审核中 -->
    <span class="trade-status <%= orderDetail.stattpl %> "><%= orderDetail.statusstr %></span>
  </div>

  <div class="order-detail-bar">
    <p class="order-detail-info">订单总额：<span class="order-detail-num fr"><%= orderDetail.totalPriceText %></span></p>
    <p class="order-detail-info">订单编号：<span class="order-detail-num fr"><%= orderDetail.orderid %></span></p>
    <p class="order-detail-info">成交时间：<span class="order-detail-num fr"><%= orderDetail.createtime %></span></p>
  </div>
  <% if( !orderDetail.giftContent ) { %>
  <!-- 是微信送礼的情况不显示此区域 begin -->
  <div class="show-select-all">
    <% if ( orderDetail.msg && (String(orderDetail.msgtpl) === "1") ) { %>
    <!-- 兑换码 start -->
    <div class="order-exchange-bar">
      <div class="order-exchange-code">
        <div class="js-copy order-exchange-code-area">
          <%= orderDetail.msg %>
          <p class="order-exchange-text bottom-text">有效期至：</p>
          <p class="order-exchange-text"><%= orderDetail.expdate %></p>
        </div>
        <b class="arc-border arc-border-left"></b>
        <b class="arc-border arc-border-right"></b>
      </div>
    </div>
    <!-- 兑换码 end -->
    <% } else if ( orderDetail.msg && (String(orderDetail.msgtpl) === "2") ) { %>
    <!-- 一元夺宝文字信息 start -->
    <div class="order-exchange-bar">
      <div class="order-exchange-code">
        <div>
          <%= orderDetail.msg %>
        </div>
        <b class="arc-border arc-border-left"></b>
        <b class="arc-border arc-border-right"></b>
      </div>
    </div>
    <!-- 一元夺宝文字信息 end -->
    <% } else if ( orderDetail.msg && (String(orderDetail.msgtpl) === "3") ) { %>
    <!-- 地址 start -->
    <div class="order-exchange-bar order-address-bar">
      <div class="js-address-box order-exchange-code">
      <% if(orderDetail.needpay === 1) {%>
        <a href="/fe/app/client/mall/html/detail-page/goods-detail.html?mold=order&orderid=<%= orderDetail.orderid %>#address-list">
      <% } %>
          <div class="order-exchange-code-area">
            <%= orderDetail.msg %>
          </div>
      <% if(orderDetail.needpay === 1) {%>
        </a>
      <% } %>
        <b class="arc-border arc-border-left"></b>
        <b class="arc-border arc-border-right"></b>
        <b class="pic-border pic-border-top"></b>
        <b class="pic-border pic-border-bottom"></b>
      </div>
    </div>
    <!-- 地址 end -->
    <% } else if ( String(orderDetail.msgtpl) === "4" )  { %>
      <!-- 一元夺宝文字信息 start -->
      <div class="order-exchange-bar">
        <div class="js-crowd-page order-exchange-code">
          <div>
            <p>点击查看本期夺宝进度</p>
            <%= orderDetail.texttpl %>
          </div>
          <b class="arc-border arc-border-left"></b>
          <b class="arc-border arc-border-right"></b>
        </div>
      </div>
      <!-- 一元夺宝文字信息 end -->

      <% if ( orderDetail.addresstpl ) { %>
      <!-- 地址 start -->
      <div class="order-exchange-bar order-address-bar">
        <div class="js-address-box order-exchange-code">
          <% if(orderDetail.needpay === 1) {%>
            <a href="/fe/app/client/mall/html/detail-page/goods-detail.html?mold=order&orderid=<%= orderDetail.orderid %>#address-list">
          <% } %>
            <div class="order-exchange-area">
              <%= orderDetail.addresstpl %>
            </div>
          <% if(orderDetail.needpay === 1) {%>
            </a>
          <% } %>
          <b class="arc-border arc-border-left"></b>
          <b class="arc-border arc-border-right"></b>
          <b class="pic-border pic-border-top"></b>
          <b class="pic-border pic-border-bottom"></b>
        </div>
      </div>
      <!-- 地址 end -->
      <% } %>
    <% } %>
  </div>
  <!-- 是微信送礼的情况不显示此区域 end -->
  <% } else { %>
  <!-- 是微信送礼的情况显示此区域 begin -->
  <div id="gift-status-container"></div>
  <!-- 是微信送礼的情况显示此区域 end -->
  <% } %>
  
  <div class="use-method">
    <h5 class="use-method-tit">使用说明</h5>
    <%= orderDetail.note %>
  </div>

  <!-- 取消订单按钮 -->
  <% if( orderDetail.operatetype === 1) {%>
  <div class="apply-refund clearfix">
    <button class="fr btn-cancel-order">取消订单</button>
  </div>
  <% } %>
  <!-- 申请退货按钮 -->
  <% if(orderDetail.operatetype === 20000) {%>
  <div class="apply-refund clearfix">
    <button class="fr btn-refund">退款申请</button>
  </div>
  <% } %>
  <!-- 查看退款进度 -->
  <% if(orderDetail.operatetype === 3) {%>
  <div class="apply-refund clearfix">
    <button class="fr btn-refund-result">查看进度</button>
  </div>
  <% } %>
  <% if( orderDetail.subscribe === 0 && isWechat) { %>
  <!-- 下单成功弹窗（引导用户关注航班管家） -->
  <div class="common-shadow" style="display: block;">
    <div class="goods-success-qrcode">
      <div class="goods-qrcode-top">
        <img src="http://cdn.rsscc.cn/guanggao/img/mall/qrcode-top-pic.png?v=1.0" alt="">
      </div>
      <div class="goods-qrcode-text">及时掌握订单状态</div>
      <button class="goods-qrcode-btn btn-toSubscribe"><span class="goods-qrcode-icon">关注航班管家<b></b></span></button>
    </div>
  </div>
  <% } %>
  <div id="copyright" class="copyright-block">
    <!-- // -->
  </div>
</div>
