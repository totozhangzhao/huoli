<a
  data-log-click="<%= appName %>-block_<%= item.productid %>_<%= item.title %>@click@index"
  data-productid="<%= item.productid %>"
  data-title="<%= item.title %>"
  data-classify="<%= item.classify || '' %>"
  class="<%= tplUtil.getJsClass(item) %> clearfix"
  href="<%= tplUtil.getBlockUrl(item) %>">
  <div class="crowd-history-pic">
    <img src="<%= item.img %>" />
  </div>
  <div class="crowd-history-desc">
    <p><%= item.title %></p>
    <p>获奖者<span class="crowd-history-tel"><%= item.phone %></span></p>
    <p>幸运号码<span class="crowd-history-num"><%= item.wincode%></span></p>
    <p>揭晓时间：<span><%= item.time %></span></p>
  </div>
</a>