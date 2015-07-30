<div class="js-banner-box banner-box">
  <ul class="banner-pics">
    <% _.each(bannerList, function(item, index) { %>
    <li class="banner-item">
      <% if ( String(item.action) === "0" ) { %>
        <a data-productid="<%= item.productid %>" data-title="<%= item.title %>" class="js-new-page block" href="/fe/app/client/mall/html/detail-page/goods-detail.html">
      <% } else if ( String(item.action) === "1" ) { %>
        <a data-productid="<%= item.productid %>" data-title="<%= item.title %>" class="js-new-page block" href="/fe/app/client/mall/html/share-page/share.html">
      <% } else if ( String(item.action) === "2" ) { %>
        <a data-productid="<%= item.productid %>" data-title="<%= item.title %>" class="js-new-page block" href="<%= item.url %>">
      <% } else if ( String(item.action) === "3" ) { %>
        <a data-productid="<%= item.productid %>" data-title="<%= item.title %>" class="js-get-url block">
      <% } %>
        <img src="<%= item.img || "" %>" alt="">
      </a>
    </li>
    <% }); %>
  </ul>
</div>
<div class="banner-indexs">
<% _.each(bannerList, function(item, index) { %>
  <i class="js-banner-index <%= index === 0 ? "active" : "" %> "></i>
<% }); %>
</div>
