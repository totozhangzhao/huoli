<div id="banner-box">
  <ul class="common-banner-area clearfix">
    <% _.each(dataList, function(item, index) { %>
    <li class="common-banner-pic fl">
      <a 
        data-log-mall-click="index-banner_<%= item.title %>-<%= item.productid %>"
        data-productid="<%= item.productid %>"
        data-group-id="<%= item.groupId %>"
        data-title="<%= item.title %>"
        class="<%= tplUtil.getJsClass(item) %> block"
        href="<%= tplUtil.getBlockUrl(item) %>"
      >
        <img src="<%= item.img %>" >
      </a>
    </li>
    <% }); %>
  </ul>
</div>
<div id="banner-index" class="common-banner-indexs">
  <% _.each(dataList, function(item, index) { %>
    <i class="<%= index === 0 ? "active" : "" %> "></i>
  <% }); %>
</div>