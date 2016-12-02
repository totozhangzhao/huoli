<%
  var getPriceText = tplUtil.getMoneyText;
%>
<% if(group.topimg) { %>
<div class="pic-theme-bar">
  <a href="javascript: void 0">
    <img class="active-img" src="<%= group.topimg %>">
  </a>
</div>
<% } %>
<div class="theme-col-list-son clearfix">
  <% _.each(group.goods, function (item) { %>
    <a 
      data-log-mall-click="active-group-muti-click_<%= item.title %>-<%= item.productid %>"
      data-productid="<%= item.productid %>"
      data-group-id="<%= item.groupId %>"
      data-title="<%= item.title %>"
      class="<%= tplUtil.getJsClass(item) %> theme-list-area"
      href="<%= tplUtil.getBlockUrl(item) %>"
      style="background-color: <%= group.frontcolor %>"
      >
        <img src="<%= item.img %>" alt="" class="touch-img">
        <div class="desc">
          <p class="name"><%= item.title %></p>
          <p class="price">
            <% 
              var priceText = getPriceText({
                payType: item.paytype,
                number: 1, 
                price: item.money,
                points: item.points
                });
            %>
            <span class="now-price"><%= priceText %></span>
            <span class="old-price"><%if(item.oriprice > 0 && !item.points){%>￥<%= item.oriprice %><%}%></span>
          </p>
        </div>
    </a>
  <% });%>
</div>