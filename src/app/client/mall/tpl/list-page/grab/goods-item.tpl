<% _.each(dataList, function(item) { %>
<li class="crowd-history-area">
<a
  data-log-click="<%= appName %>-block_<%= item.productid %>_<%= item.title %>@click@index"
  data-productid="<%= item.productid %>"
  data-title="<%= item.title %>"
  data-classify="<%= item.classify || '' %>"
  class="<%= tplUtil.getJsClass(item) %> clearfix"
  href="<%= tplUtil.getBlockUrl(item) %>">
  <div class="crowd-history-pic">
    <img class="op0" data-echo="<%= item.img %>" src="/fe/com/mobile/image/grey.gif" />
  </div>
  <div class="crowd-history-desc">
    <p><%= item.title %></p>
    <% var username; %>
    <% if (item.phone) { %>
      <% var phone = item.phone; %>
      <% username = phone.slice(0, 3) + "****" + phone.slice(7, 11); %>
    <% } else { %>
      <% username = "微信用户****"; %>
    <% } %>
    <p>获奖者:<span class="crowd-history-tel"><%= username %></span></p>
    <p>幸运号码:<span class="crowd-history-num"><%= item.wincode%></span></p>
    <p>揭晓时间:<span><%= item.time %></span></p>
  </div>
</a>
</li>
<% }); %>