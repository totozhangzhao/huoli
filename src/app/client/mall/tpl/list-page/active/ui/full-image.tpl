<%
  var item = group.goods[0];
%>
<a 
  data-log-mall-click="active-bigimage-click_<%= item.title %>-<%= item.productid %>"
  data-productid="<%= item.productid %>"
  data-group-id="<%= item.groupId %>"
  data-title="<%= item.title %>"
  class="<%= tplUtil.getJsClass(item) %>"
  href="<%= tplUtil.getBlockUrl(item) %>"
  style="background-color: <%= group.frontcolor %>"
  >
  <img class="active-img" src="<%= item.img %>" />
</a>