<div class="<%= orderDetail.needpay === 1 ? "pay-status-bar" : "pay-after-bar" %>">
  <div class="goods-detail">
    <img src="<%= orderDetail.img %>" class="goods-show-pic fl">
    <p class="goods-name"><%= orderDetail.title %></p>
    <p class="goods-desc"><%= orderDetail.shotdesc %></p>
    <p class="goods-price"><%= orderDetail.orderprice %></p>
    <span class="trade-status <%= orderDetail.stattpl %> "><%= orderDetail.statusstr %></span>
    <!-- <span class="trade-status trade-status-fail">交易失败&nbsp;</span> -->
    <!-- <span class="trade-status trade-status-confirm">交易待确认</span> -->
    <!-- <span class="trade-status trade-status-waiting">等待付款..</span> -->
  </div>
  
  <div class="order-detail-bar">
    <p class="order-detail-info">订单编号：<span class="order-detail-num fr"><%= orderDetail.orderid %></span></p>
    <p class="order-detail-info">成交时间：<span class="order-detail-num fr"><%= orderDetail.createtime %></span></p>
  </div>

  <% if ( orderDetail.msg && (String(orderDetail.msgtpl) === "1") ) { %>
  <!-- 兑换码 start -->
  <div class="order-exchange-bar">
    <div class="order-exchange-code show-select">
      <div class="order-exchange-area">
        <%= orderDetail.msg %>
      </div>
      <div class="effective-area">
        <p>有效期至：</p>
        <p><%= orderDetail.expdate %></p>
      </div>
      <b class="arc-border arc-border-left"></b>
      <b class="arc-border arc-border-right"></b>
    </div>
  </div>
  <!-- 兑换码 end -->
  <% } else if ( orderDetail.msg && (String(orderDetail.msgtpl) === "2") ) { %>
  <!-- 文字信息 start -->
  <div class="order-exchange-bar">
    <div class="order-exchange-code show-select">
      <div>
        <%= orderDetail.msg %>
      </div>
      <b class="arc-border arc-border-left"></b>
      <b class="arc-border arc-border-right"></b>
    </div>
  </div>
  <!-- 文字信息 end -->
  <% } else if ( orderDetail.msg && (String(orderDetail.msgtpl) === "3") ) { %>
  <!-- 地址 start -->
  <div class="order-exchange-bar order-address-bar">
    <div class="js-address-box order-exchange-code show-select">
      <div class="order-exchange-area">
        <%= orderDetail.msg %>
      </div>
      <b class="arc-border arc-border-left"></b>
      <b class="arc-border arc-border-right"></b>
      <b class="pic-border pic-border-top"></b>
      <b class="pic-border pic-border-bottom"></b>
    </div>
  </div>
  <!-- 地址 end -->
  <% } %>

  <div class="use-method">
    <h5 class="use-method-tit">使用说明</h5>
    <%= orderDetail.note %>
  </div>

  <div id="copyright" class="copyright-block <%= orderDetail.needpay === 1 ? "goods-copyright-fix" : "" %> ">
    <!-- // -->
  </div>
  
  <% if (orderDetail.needpay === 1) { %>
  <div class="order-pay-bar">
    <div class="order-pay-area clearfix">
      <div class="scoring-bar fl">实付款：<span class="scoring-num num-font"><%= orderDetail.orderprice %></span>
      </div>
      <button id="pay-button" class="order-pay-btn fr">付款</button> 
    </div> 
  </div> 
  <% } %>
</div>
