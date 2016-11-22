<!-- 1 立即购买  2 立即兑换 -->
<% 
var hasGoods = false;// true 可以购买 false 不能购买
if(_.inRange( parseInt(productItem.status.code), 1, 3) ) {
  hasGoods = true; 
}
var priceText = tplUtil.getMoneyText({
  payType: productItem.paytype,
  number: 1,
  price: productItem.money,
  points: productItem.point
});
%>
<% if(productItem.visible) { %>
<% if(hasGoods) { %>
  <a
    data-productid="<%= productItem.productid %>"
    data-group-id="<%= productItem.groupId %>"
    data-title="<%= productItem.title %>"
    class="<%= tplUtil.getJsClass(productItem) %> collect-bar block"
    href="<%= tplUtil.getBlockUrl(productItem) %>"
    data-remove-id="<%= productItem.productid %>"
  >
<% } else { %>
  <a class="collect-bar block" data-remove-id="<%= productItem.productid %>">
<% } %>

  <div class="collect-area flex-row">
    <div class="collect-pic">
      <img src="<%= productItem.img %>" alt="">
      <div class="common-mask"></div>
    </div>
    <div class="collect-info">
      <p class="title num-font"><%= productItem.title %></p>
      
      <p class="price num-font"><%= priceText %></p>
      <p class="collect-num num-font"><%= productItem.collectNum || 0 %>人已收藏</p>
    </div>
  </div>
  <button class="charge <%= hasGoods? '': 'off'%>"><%= productItem.status.message %></button>
</a>
<% } %>