<% _.each(dataList, function (item, index) { %>
  <li>
    <a
    data-log-mall-click="index-entrance_<%= item.title %>-<%= item.productid %>"
    data-productid="<%= item.productid %>"
    data-group-id="<%= item.groupId %>"
    data-title="<%= item.title %>"
    class="<%= tplUtil.getJsClass(item) %> block"
    href="<%= tplUtil.getBlockUrl(item) %>"
    >
      <div class="home-item-pics">
        <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= item.img %>" class="op0" alt="">
      </div>
      <p class="home-item-tips"><%= item.title %></p>
    </a>
  </li>
<% }); %>
