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
<div class="theme-row-list-son">
  <% _.each(group.goods, function (item) { %>
    <a 
      data-log-mall-click="active-group-single-click_<%= item.title %>-<%= item.productid %>"
      data-productid="<%= item.productid %>"
      data-group-id="<%= item.groupId %>"
      data-title="<%= item.title %>"
      class="<%= tplUtil.getJsClass(item) %> theme-list-area"
      href="<%= tplUtil.getBlockUrl(item) %>"
      style="background-color: <%= group.frontcolor %>"
      >
      <div class="theme-pic-contain">
        <img src="<%= item.img %>" alt="" class="touch-img">
      </div>
      <div class="theme-desc-contain">
        <p class="name"><%= item.title %></p>
        <p class="desc"><%= item.shortdesc %></p>
        <div class="charge">
          <div class="charge-son">
            <p class="now-price">
              <% 
                var priceText = getPriceText({
                  payType: item.paytype,
                  number: 1, 
                  price: item.money,
                  points: item.points,
                  currency: '<span>￥</span>'
                  });
              %>
              <%= priceText %>
            </p>
            <p class="old-price"><%if(item.oriprice > 0){%>￥<%= item.oriprice %><%}%></p>
          </div>
          <% if( !(item.points > 0) ) {%>
          <button>立即购买</button>
          <% } %>
        </div>
      </div>
    </a>
  <% });%>
</div>