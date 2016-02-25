<a
  data-log-click="<%= appName %>-block_<%= item.productid %>_<%= item.title %>@click@index"
  data-productid="<%= item.productid %>"
  data-title="<%= item.title %>"
  data-classify="<%= item.classify || '' %>"
  class="<%= tplUtil.getJsClass(item) %> block"
  href="<%= tplUtil.getBlockUrl(item) %>">
  <div class="crowd-info-bar">
    <div class="crowd-pic-area">
      <img src="<%= item.img %>" />  
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







