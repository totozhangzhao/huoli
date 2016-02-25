
<div class="crowd-nav-tip"><b class="icon"></b>
  <% _.each(dataList, function(item){ %>
  <a
    data-log-click="<%= appName %>-block_<%= item.productid %>_<%= item.title %>@click@index"
    data-productid="<%= item.productid %>"
    data-title="<%= item.title %>"
    data-classify="<%= item.classify || '' %>"
    class="<%= tplUtil.getJsClass(item) %> block marquee-item"
    href="<%= tplUtil.getBlockUrl(item) %>"
  >
    <%= item.phone.slice(0,3) %>****<%= item.phone.slice(7) %>获得<span><%= item.title %></span>
  </a>
  <%})%>
</div>


<a 
  data-productid="<%= pId%>"
  data-title="开奖记录"
  data-classify=""
  class="js-new-page crowd-history"
  href="/fe/app/client/mall/html/list-page/grab/grab-record.html"
  >往期<b class="more"></b></a>