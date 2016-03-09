<div id="banner-box">
  <ul class="home-banner-area clearfix">
    <% _.each(dataList, function(item, index) { %>
    <li class="home-banner-pic fl">
      <a
      data-log-mall-click="top_banner_<%= item.title %>"
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
<div>
<div id="banner-index" class="home-banner-indexs">
<% _.each(dataList, function(item, index) { %>
  <i class="<%= index === 0 ? "active" : "" %> "></i>
<% }); %>
</div>