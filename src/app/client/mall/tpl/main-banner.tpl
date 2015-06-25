<div class="js-banner-box banner-box">
  <ul class="banner-pics">
    <% _.each(bannerList, function(item, index) { %>
    <li class="banner-item">
      <a data-productid="<%= item.productid || "" %>" data-title="<%= item.title || "" %>" class="js-new-page" href="<%= item.url || "" %>">
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
