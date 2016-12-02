<%
  var getPriceText = tplUtil.getMoneyText;
  var item = group.goods[0];
%>
<a 
  data-log-mall-click="active-goods-click_<%= item.title %>-<%= item.productid %>"
  data-productid="<%= item.productid %>"
  data-group-id="<%= item.groupId %>"
  data-title="<%= item.title %>"
  class="<%= tplUtil.getJsClass(item) %>"
  href="<%= tplUtil.getBlockUrl(item) %>"
  style="background-color: <%= group.frontcolor %>"
  >
  <% if(item.img) { %>
    <img src="<%= item.img %>">
  <% } %>
  <div class="charge-area">
    <div class="charge-contain">
      <p class="now-price">
        <% 
          var priceText = getPriceText({
            payType: item.paytype,
            number: 1, 
            price: item.money,
            points: item.points
            });
        %>
        <span></span>
        <span><%= priceText %></span>
      </p>
      <p class="old-price"><%if(item.oriprice > 0){%>原价：￥<%= item.oriprice %><%}%></p>
    </div>
    <button>立即购买</button>
  </div>
</a>