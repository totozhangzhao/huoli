<% _.each(data.menu, function (item, index) { %>
<li class="channel-area">
  <a
    data-log-mall-click="category-list_<%= item.title %>-<%= item.groupId %>"
    data-productid="<%= item.productid %>"
    data-group-id="<%= item.groupId %>"
    data-title="<%= item.title %>"
    class="<%= tplUtil.getJsClass(item) %>"
    href="<%= tplUtil.getBlockUrl(item) %>"
  >
  <img src="<%= item.img %>" class="channel-show-pic" alt="">
  <% if(item.tpl === 2) {%>
  <div class="channel-area-mask"></div>
  <div class="channel-area-desc">
    <p><%= item.title %></p>
    <p><%= item.subtitle %></p>
  </div>
  <% } %>
  </a>
</li>
<% }); %>