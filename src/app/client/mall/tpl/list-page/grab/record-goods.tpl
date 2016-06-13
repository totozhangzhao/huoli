<% _.each(dataList, function(item) { %>
<li class="crowd-history-area">
  <a
    data-log-mall-click="block_<%= item.title %>"
    data-productid="<%= item.productid %>"
    data-title="<%= item.title %>"
    class="<%= tplUtil.getJsClass(item) %> touch-bg clearfix"
    href="<%= tplUtil.getBlockUrl(item) %>">
    <div class="crowd-history-pic">
      <img class="op0" data-echo="<%= item.img%>" src="/fe/com/mobile/image/grey.gif" />
    </div>
    <div class="crowd-history-desc">
      <p class="crowd-history-title"><%= item.title %></p>
      <p>获奖者:<span class="crowd-history-tel"><%= item.phone %></span><span class="crowd-history-num"><%= item.winnerbuynum %></span>人次</p>
      <p>幸运号码:<span class="crowd-history-num"><%= item.wincode%></span></p>
      <p>揭晓时间:<span><%= item.time %></span></p>
    </div>
  </a>
</li>
<% }); %>


  