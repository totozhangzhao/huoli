<ul class="home-item-bar flex-row clearfix no-select">
<% _.each(dataList, function (item, index) { %>
  <li>
    <a
    data-log-mall-click="index-entrance_<%= item.title %>-<%= item.productid %>"
    data-productid="<%= item.productid %>"
    data-group-id="<%= item.groupId %>"
    data-title="<%= item.title %>"
    data-classify="<%= item.classify || '' %>"
    data-info="index-entrance-<%= index %>"
    class="<%= tplUtil.getJsClass(item) %> block"
    href="<%= tplUtil.getBlockUrl(item) %>"
    >
      <div style="background-image: url(<%= item.img%>)"></div>
      <p><%= item.title %></p>
    </a>
  </li>
<% }); %>
</ul>