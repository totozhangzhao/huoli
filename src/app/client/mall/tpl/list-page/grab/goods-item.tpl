<% _.each(dataList, function(item) { %>
<li class="crowd-history-area">
<a
  data-log-mall-click="block-<%= item.productid %>-<%= item.title %>"
  data-productid="<%= item.productid %>"
  data-title="<%= item.title %>"
  data-classify="<%= item.classify || '' %>"
  class="<%= tplUtil.getJsClass(item) %> clearfix"
  href="<%= tplUtil.getBlockUrl(item) %>">
  <div class="crowd-history-pic">
    <img class="op0 touch-img" data-echo="<%= item.img %>" src="/fe/com/mobile/image/grey.gif" />
  </div>
  <div class="crowd-history-desc">
    <p><%= item.title %></p>
    <p>获奖者:<span class="crowd-history-tel"><%= item.phone %></span></p>
    <p>幸运号码:<span class="crowd-history-num"><%= item.wincode%></span></p>
    <p>揭晓时间:<span><%= item.time %></span></p>
  </div>
</a>
</li>
<% }); %>