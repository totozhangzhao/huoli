<div class="<%= orderDetail.needpay === 1 ? "pay-status-bar" : "pay-after-bar" %>">
  <div class="goods-detail clearfix">
    <img src="<%= orderDetail.img %>" class="goods-show-pic fl">
    <p class="goods-name"><%= orderDetail.title %></p>
    <div class="goods-charge-info-fa">
      <!-- <p class="goods-charge-info num-font"><span>100</span> 积分 + <span>100</span> 元</p> -->
      <% if ( orderDetail.points > 0 && orderDetail.money > 0 ) { %>
      <p class="goods-charge-info num-font"><span><%= orderDetail.points %></span>积分 + <span><%= orderDetail.money %></span>元</p>
      <% } else if ( orderDetail.points > 0 ) { %>
      <p class="goods-charge-info num-font"><span><%= orderDetail.points %></span>积分</p>
      <% } else if ( orderDetail.money > 0 ) { %>
      <p class="goods-charge-info num-font"><span><%= orderDetail.money %></span>元</p>
      <% } else { %>
      <p class="goods-charge-info num-font"><span>0</span>元</p>
      <% } %>
      <em class="goods-charge-count">数量 x <%= orderDetail.num %></em>
    </div>
    <span class="trade-status <%= orderDetail.stattpl %> "><%= orderDetail.statusstr %></span>
  </div>

  <div class="order-detail-bar">
    <!-- <p class="order-detail-info">订单总额：<span class="order-detail-num fr">200积分+200元</span></p> -->
    <% if ( orderDetail.ptotal > 0 && orderDetail.mtotal > 0 ) { %>
    <p class="order-detail-info">订单总额：<span class="order-detail-num fr"><%= orderDetail.ptotal %>积分 + <%= orderDetail.mtotal %>元</span></p>
    <% } else if ( orderDetail.ptotal > 0 ) { %>
    <p class="order-detail-info">订单总额：<span class="order-detail-num fr"><%= orderDetail.ptotal %>积分</span></p>
    <% } else if ( orderDetail.mtotal > 0 ) { %>
    <p class="order-detail-info">订单总额：<span class="order-detail-num fr"><%= orderDetail.mtotal %>元</span></p>
    <% } else { %>
    <p class="order-detail-info">订单总额：<span class="order-detail-num fr">0元</span></p>
    <% } %>
    <p class="order-detail-info">订单编号：<span class="order-detail-num fr"><%= orderDetail.orderid %></span></p>
    <p class="order-detail-info">成交时间：<span class="order-detail-num fr"><%= orderDetail.createtime %></span></p>
  </div>

  <div class="show-select">
    <% if ( orderDetail.msg && (String(orderDetail.msgtpl) === "1") ) { %>
    <!-- 兑换码 start -->
    <div class="order-exchange-bar">
      <div class="order-exchange-code">
        <div class="js-copy order-exchange-area">
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
          <div class="order-exchange-area">
            <%= orderDetail.addresstpl %>
          </div>
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

  <div class="use-method">
    <h5 class="use-method-tit">使用说明</h5>
    <%= orderDetail.note %>
  </div>

  <div id="copyright" class="copyright-block <%= orderDetail.needpay === 1 ? "goods-copyright-fix" : "" %> ">
    <!-- // -->
  </div>
  
</div>
