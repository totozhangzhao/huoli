<% _.each(dataList, function(item) { %>
<li>
<a
  data-log-mall-click="block-<%= item.productid %>-<%= item.title %>"
  data-productid="<%= item.productid %>"
  data-title="<%= item.title %>"
  data-classify="<%= item.classify || '' %>"
  class="<%= tplUtil.getJsClass(item) %> block"
  href="<%= tplUtil.getBlockUrl(item) %>">
  <div class="crowd-info-bar">
    <div class="crowd-pic-area">
      <img class="op0 touch-img" data-echo="<%= item.img %>" src="/fe/com/mobile/image/grey.gif" />  
    </div>
    <div class="crowd-info-show">
      <p class="crowd-goods-name"><%= item.title %></p>
      <p class="crowd-goods-process">开奖进度<span><%= item.progress %>%</span></p>
      <div class="snap-status-show">
        <div style="width:<%= item.progress > 4 ? item.progress : 4 %>%"></div>
      </div>
    </div>
  </div>
</a>
</li>
<% });%>



