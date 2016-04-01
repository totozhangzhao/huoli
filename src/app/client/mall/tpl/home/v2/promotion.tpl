<% _.each(dataList, function (item, index) { %>
<li>
  <a
      data-log-mall-click="index-promotion_<%= item.title %>"
      data-productid="<%= item.productid %>"
      data-group-id="<%= item.groupId %>"
      data-title="<%= item.title %>"
      data-classify="<%= item.classify || '' %>"
      data-info="index-promotion-<%= index %>"
      class="<%= tplUtil.getJsClass(item) %> block"
      href="<%= tplUtil.getBlockUrl(item) %>"
      >
    <img src="<%= item.img %>" />
  </a>
</li>
<% }); %>