<%
  var item = group.goods[0];
%>
<a
	data-log-mall-click="active-bigimage-click_<%= item.title %>-<%= item.productid %>"
  data-productid="<%= item.productid %>"
  data-group-id="<%= item.groupId %>"
  data-title="<%= item.title %>"
  class="<%= tplUtil.getJsClass(item) %>"
  href="<%= tplUtil.getBlockUrl(item) %>">
	<div class="topic-area">
		<img src="<%= item.img %>" class="topic-show-pic" alt="">
		<div class="topic-area-desc">
			<p class="goods-name"><%= item.title %></p>
			<p class="goods-slogan"><%= item.shortdesc %></p>
		</div>
	<div>
</a>