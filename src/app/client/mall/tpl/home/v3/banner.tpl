<div id="banner-box">
  <ul class="common-banner-area clearfix">
    <% _.each(dataList, function(item, index) { window.console.log(index);%>
    <li class="common-banner-pic fl">
      <a 
        data-log-mall-click="index-banner_<%= item.title %>-<%= item.productid %>"
        data-productid="<%= item.productid %>"
        data-group-id="<%= item.groupId %>"
        data-title="<%= item.title %>"
        class="<%= tplUtil.getJsClass(item) %> block"
        href="<%= tplUtil.getBlockUrl(item) %>"
      >
        <img src="http://cdn.rsscc.cn/guanggao/img/test/test-0725-1.png?v=1" >
      </a>
    </li>
    <% }); %>
  </ul>
</div>
<div id="banner-index" class="common-banner-indexs">
  <% _.each(dataList, function(item, index) { %>
    <i class="<%= index === 0 ? "active" : "" %> "></i>
  <% }); %>
</div>