<div class="js-banner-box banner-box">
  <ul class="banner-pics">
    <% _.each(bannerList, function(item, index) { %>
    <li class="banner-item">
      <% var jsClass = "js-new-page"; %>
      <% var jsUrl = "javascript:;" %>
      <% if ( String(item.action) === "0" ) { %>
        <% jsUrl = "/fe/app/client/mall/html/detail-page/goods-detail.html"; %>
      <% } else if ( String(item.action) === "1" ) { %>
        <% jsUrl = "/fe/app/client/mall/html/share-page/share.html"; %>
      <% } else if ( String(item.action) === "2" ) { %>
        <% jsUrl = item.url; %>
      <% } else if ( String(item.action) === "3" ) { %>
        <% jsClass = "js-get-url"; %>
      <% } else if ( String(item.action) === "4" ) { %>
        <% jsUrl = "/fe/app/client/mall/html/active-page/scratch-card/main.html"; %>
      <% } else if ( String(item.action) === "5" ) { %>
        <% jsUrl = "/fe/app/client/mall/html/menu/category.html"; %>
      <% } %>
      <a
        data-log-click="<%= appName %>-banner|<%= item.productid %>|<%= item.title %>@click@index"
        data-productid="<%= item.productid %>"
        data-title="<%= item.title %>"
        data-classify="<%= item.classify || '' %>"
        class="<%= jsClass %> block"
        href="<%= jsUrl %>"
      >
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
