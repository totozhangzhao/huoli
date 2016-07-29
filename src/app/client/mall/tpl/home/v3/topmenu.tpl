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
      <div class="home-item-pics">
        <img src="<%= item.img %>" alt="">
      </div>
      <p class="home-item-tips"><%= item.title %></p>
    </a>
  </li>
<% }); %>