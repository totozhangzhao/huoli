<div class="home-promote-bar">
  <div class="home-common-tip">
    <div class="home-common-tip-son"></div>
    <!-- <strong class="goods-tip-dot"><b></b><b></b><b></b></strong> -->
  </div>
  <div class="home-promote-area">
    <ul class="home-promote-content clearfix">
      <% _.each(dataList, function (item, index) {%>
      <li>
        <a
          data-log-mall-click="index-active_<%= item.title %>-<%= item.productid %>"
          data-productid="<%= item.productid %>"
          data-group-id="<%= item.groupId %>"
          data-title="<%= item.title %>"
          class="<%= tplUtil.getJsClass(item) %>"
          href="<%= tplUtil.getBlockUrl(item) %>"
        >
          <img src="<%= item.img %>" alt="">
        </a>
      </li>
      <% }); %>
    </ul>
  </div>
</div>