<div id="banner-box">
  <ul class="home-banner-area clearfix">
    <% _.each(dataList, function(item, index) { %>
    <li class="home-banner-pic fl">
      <a
      data-log-mall-click="index-banner_<%= item.title %>"
      data-productid="<%= item.productid %>"
      data-group-id="<%= item.groupId %>"
      data-title="<%= item.title %>"
      data-classify="<%= item.classify || '' %>"
      data-info="index-banner-<%= index %>"
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