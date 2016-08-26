<%
  var item = group.goods[0];
%>
<a 
  data-log-mall-click="active-paragraph-click_<%= item.title %>-<%= item.productid %>"
  data-productid="<%= item.productid %>"
  data-group-id="<%= item.groupId %>"
  data-title="<%= item.title %>"
  class="<%= tplUtil.getJsClass(item) %>"
  href="<%= tplUtil.getBlockUrl(item) %>"
  >
  <p class="text-desc-area"><%= group.content.desc %></p>
</a>