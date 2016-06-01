<ul id="address-entry" class="confirm-order-bar">
  <li>
    <a>
      <div class="confirm-order-info">
        <span><%- addressInfo.name || "" %></span><span class="num-font"><%- addressInfo.pphone || "" %></span>
      </div>
      <div class="confirm-order-address num-font"><%- addressInfo.province.name + " " + addressInfo.city.name + " " + addressInfo.area.name + " " + addressInfo.address || "" %></div>
      <b class="confirm-order-icon"></b>
    </a>
  </li>
</ul>
<div class="confirm-goods-detail clearfix">
  <img src="<%= goods.smallimg || "" %>" class="goods-show-pic fl">
  <p class="goods-name"><%= goods.title || "" %></p>
  <div class="goods-charge-info-fa">
    <% if ( points > 0 && money > 0 ) { %>
    <p class="goods-charge-info num-font"><span><%= points %></span>积分 + <span><%= money %></span>元</p>
    <% } else if ( points > 0 ) { %>
    <p class="goods-charge-info num-font"><span><%= points %></span>积分</p>
    <% } else if ( money > 0 ) { %>
    <p class="goods-charge-info num-font"><span><%= money %></span>元</p>
    <% } else { %>
    <p class="goods-charge-info num-font"><span>0</span>元</p>
    <% } %>
    <div class="common-buy-num">
      <div class="common-buy-choice">
        <!-- 数量小于1时，添加 one class,大于1时去掉 -->
        <i class=""><span></span></i><i><input type="text" value="<%= num %>" /></i><i><span></span></i>
      </div>
    </div>
  </div>
</div>

<div class="goods-charge-bar">
  <!-- <p class="goods-charge-info num-font"><span>200</span> 积分 + <span>200</span> 元</p> -->
  <% if ( ptotal > 0 && mtotal > 0 ) { %>
  <p class="goods-charge-info num-font"><span><%= ptotal %></span>积分 + <span><%= mtotal %></span>元</p>
  <% } else if ( ptotal > 0 ) { %>
  <p class="goods-charge-info num-font"><span><%= ptotal %></span>积分</p>
  <% } else if ( mtotal > 0 ) { %>
  <p class="goods-charge-info num-font"><span><%= mtotal %></span>元</p>
  <% } else { %>
  <p class="goods-charge-info num-font"><span>0</span>元</p>
  <% } %>
  <button id="confirm-order" type="button" class="charge-btn"><%= goods.confirm || "去支付" %></button>
</div>
