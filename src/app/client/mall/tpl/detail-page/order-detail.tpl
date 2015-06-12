<div class="order-goods-box">
  <!-- 
    1.交易成功 pay-status-succ
    2.等待付款 pay-status-unfinished
    3.交易失败 pay-status-fail
    4.交易已取消 pay-status-cancel
  -->
  <div class="pay-status-box <%= orderDetail.stattpl %> clearfix">
    <div class="pay-status-bar fl">
      <p class="pay-status pay-status-text"><%= orderDetail.statusstr %></p>
      <p class="pay-common-text pay-cost">订单金额：<%= orderDetail.orderprice %></p>
      <p class="pay-common-text pay-serial">订单编号：<%= orderDetail.orderid %></p>
      <p class="pay-common-text pay-time">成交时间：<%= orderDetail.createtime %></p>
    </div>
    <div class="pay-status-tip pay-status-show fr"></div>
  </div>
  <% if (orderDetail.msg) { %>
  <div class="exchange-code-bar clearfix">
    <p class="exchange-code">
      <span class="exchange-code-word num-font"><%= orderDetail.msg %></span>
      <p class="copy-code">长按可复制</p>
    </p>
  </div>
  <% } %>
  <div class="order-goods-bar">
    <a class="clearfix">
      <img src="<%= orderDetail.img %>" class="chit-pic fl" />
      <div class="order-text-bar fl">
        <p class="order-goods-text pic-tit"><%= orderDetail.title %></p>
        <p class="order-goods-text pic-detail"><%= orderDetail.shotdesc %></p>
        <p class="order-goods-text actually-pay"><%= orderDetail.price %></p>
      </div>
    </a>
  </div>
  <div class="use-method">
    <h5 class="use-method-tit">如何使用券/码？</h5>
    <%= orderDetail.note %>
  </div>
  <div id="copyright" class="copyright-block <%= orderDetail.needpay ? "goods-copyright-fix" : "" %> ">
    <!-- // -->
  </div>
  <% if (orderDetail.needpay) { %>
  <div class="order-pay-bar">
    <div class="order-pay-area clearfix">
      <div class="scoring-bar fl">实付款：<span class="scoring-num num-font"><%= orderDetail.orderprice %></span>
      </div>
      <button id="pay-button" class="order-pay-btn fr">付款</button> 
    </div> 
  </div> 
  <% } %>
</div>
