<%
  var item = group.goods[0];
%>
<a 
  data-log-mall-click="active-title-click_<%= item.title %>-<%= item.productid %>"
  data-productid="<%= item.productid %>"
  data-group-id="<%= item.groupId %>"
  data-title="<%= item.title %>"
  class="<%= tplUtil.getJsClass(item) %>"
  href="<%= tplUtil.getBlockUrl(item) %>"
  >
  <p class="text-title-area">
    <% if(group.content.number >= 0) {%>
      <span class="item"><%= group.content.number %></span>
    <% } %>
    <%= group.content.desc %>
  </p>
</a>