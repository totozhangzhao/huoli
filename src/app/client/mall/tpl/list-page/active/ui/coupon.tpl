<%
  var getPriceText = tplUtil.getMoneyText;
  var item = group.goods[0];
%>
<div 
  data-log-mall-click="active-coupon-click_<%= item.title %>-<%= item.productid %>"
  data-coupon-id="<%= item.productid %>"
  >
  <img class="active-img" src="<%= item.img %>" alt="">
</div>