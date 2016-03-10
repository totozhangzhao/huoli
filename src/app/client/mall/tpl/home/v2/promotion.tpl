<% _.each(dataList, function (item, index) { %>
<li>
  <a
      data-log-mall-click="index-promotion_<%= item.title %>"
      data-productid="<%= item.productid %>"
      data-group-id="<%= item.groupId %>"
      data-title="<%= item.title %>"
      data-classify="<%= item.classify || '' %>"
      class="<%= tplUtil.getJsClass(item) %> block"
      href="<%= tplUtil.getBlockUrl(item) %>"
      >
    <img class="touch-img" src="<%= item.img %>" />
  </a>
</li>
<% }); %>