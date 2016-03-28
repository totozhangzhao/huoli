<div class="js-banner-box banner-box">
  <ul class="banner-pics">
    <% _.each(bannerList, function(item, index) { %>
    <li class="banner-item">
      <a
        data-log-mall-click="banner_<%= item.title %>"
        data-productid="<%= item.productid %>"
        data-title="<%= item.title %>"
        data-classify="<%= item.classify || '' %>"
        class="<%= tplUtil.getJsClass(item) %> block"
        href="<%= tplUtil.getBlockUrl(item) %>"
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
