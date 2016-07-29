<% _.each(dataList, function (item, index) { %>

<li>
  <a
      data-log-mall-click="index-promotion_<%= item.title %>-<%= item.productid %>"
      data-productid="<%= item.productid %>"
      data-group-id="<%= item.groupId %>"
      data-title="<%= item.title %>"
      data-info="index-promotion-<%= index %>"
      class="<%= tplUtil.getJsClass(item) %> block"
      href="<%= tplUtil.getBlockUrl(item) %>"
      >
    <img src="<%= item.img %>" />
  </a>
</li>
<% }); %>