<div class="order-nav clearfix">
  <p class="order-num-bar fl">订单号：<span class="order-num num-font"><%= orderDetail.orderid %></span></p>
  <p class="order-time fr">成交时间：<span class="num-font"><%= orderDetail.createtime %></span></p>
</div>
<div class="order-goods-box">
  <div class="order-goods-bar">
    <img src="<%= orderDetail.img %>" class="chit-pic fl" />
    <p class="order-goods-text pic-tit"><%= orderDetail.title %></p>
    <p class="order-goods-text pic-detail"><%= orderDetail.desc %></p>
    <p class="order-goods-text actually-pay">
      实付：<span class="exchange-num num-color"><%= orderDetail.pprice %></span>分
    </p>
  </div>
  <div class="exchange-code-bar clearfix">
    <p class="exchange-code">
      <span class="exchange-code-word num-font"><%= orderDetail.ecode %></span>
      <p class="copy-code">长按可复制</p>
    </p>
  </div>
  <div class="use-method">
    <h5 class="use-method-tit">如何使用券／码？</h5>
    <div class="use-method-text"><%= orderDetail.note %></div>
  </div>
</div>
<div id="copyright" class="copyright-block"></div>
