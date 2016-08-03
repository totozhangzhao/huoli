<div class="home-common-tip">
  <div class="home-common-tip-son"></div>
  <!-- <strong class="goods-tip-dot"><b></b><b></b><b></b></strong> -->
</div>
<div class="home-recommend-area">
<% _.some(dataList, function (item, index) {%>
    <!-- <div class="home-recommend-banner">
    <a
      data-log-mall-click="index-block_<%= item.title %>-<%= item.productid %>"
      data-productid="<%= item.productid %>"
      data-group-id="<%= item.groupId %>"
      data-title="<%= item.title %>"
      data-classify="<%= item.classify || '' %>"
      data-info="index-goods-<%= index %>"
      class="<%= tplUtil.getJsClass(item) %>"
      href="<%= tplUtil.getBlockUrl(item) %>"
    >
      <img src="<%= item.img %>" alt="">
    </a>
  </div>   -->
  <% return index === 0;%>
<% }); %>
<ul class="home-recommend-content clearfix">
<% _.each(dataList, function (item, index) {%>
  <% if(index === 0){} %>
  <li>
    <a
      data-log-mall-click="index-block_<%= item.title %>-<%= item.productid %>"
      data-productid="<%= item.productid %>"
      data-group-id="<%= item.groupId %>"
      data-title="<%= item.title %>"
      data-classify="<%= item.classify || '' %>"
      data-info="index-goods-<%= index %>"
      class="<%= tplUtil.getJsClass(item) %>"
      href="<%= tplUtil.getBlockUrl(item) %>"
    >
      <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= item.img %>" class="op0 touch-img" >
      <div class="home-recommend-mask"></div>
      <div class="home-recommend-desc">
        <p class="home-recommend-goods"><%= item.title %></p>
        <p class="home-recommend-price">￥<%= item.money %></p>
      </div>
    </a>
  </li>
<% }); %>
</ul>
</div>