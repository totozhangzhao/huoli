<% _.each(goodsList, function(item) { %>
  <li class="goods-area-son fl">
    <% if (item.url) { %>
    <a data-productid="<%= item.productid %>" data-title="<%= item.title %>" class="js-new-page block" href="<%= item.url %>">
    <% } else { %>
    <a data-productid="<%= item.productid %>" data-title="<%= item.title %>" class="js-new-page block" href="/fe/app/client/mall/html/detail-page/goods-detail.html">
    <% } %>
      <div class="text-bar">
        <p class="text-bar-p pic-tit"><%= item.title %><span class="state-icon <%= item.stateicon %>"></span></p>
        <p class="text-bar-p pic-detail"><%= item.detail %></p>
        <p class="text-bar-p pic-value"><span class="exchange-num num-color"><%= item.pprice %></span>分</p>
      </div>
      <div class="pic-bar">
        <img src="<%= item.img %>" class="goods-pic" >
      </div>
    </a>
  </li>
<% }) %>
