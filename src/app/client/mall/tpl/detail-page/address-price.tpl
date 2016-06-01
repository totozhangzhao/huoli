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