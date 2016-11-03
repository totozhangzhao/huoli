<%
  var priceText = tplUtil.getMoneyText({
    payType: goodsItem.paytype,
    number: 1,
    price: goodsItem.money,
    points: goodsItem.points
  });
%>
<a
  data-log-mall-click="category-list_<%= goodsItem.title %>-<%= goodsItem.productid %>"
  data-productid="<%= goodsItem.productid %>"
  data-group-id="<%= goodsItem.groupId %>"
  data-title="<%= goodsItem.title %>"
  class="<%= tplUtil.getJsClass(goodsItem) %>"
  href="<%= tplUtil.getBlockUrl(goodsItem) %>"
>
  <div class="home-block">
    <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= goodsItem.img %>" class="op0 touch-img" >
    <div class="home-recommend-mask"></div>
    <% if(goodsItem.goodsTag) { %>
      <% if(goodsItem.goodsTag.stockstatus === 101) {%>
        <div class="sold-out-money"></div>
      <% } else if(goodsItem.goodsTag.stockstatus === 102) { %>
        <div class="sold-out-point"></div>
      <% } %>
    <% } %>
  </div>
  <div class="home-recommend-desc">
    <p class="home-recommend-goods"><%= goodsItem.title %></p>
    <p class="home-recommend-price"><%= priceText %></p>
  </div>
</a>