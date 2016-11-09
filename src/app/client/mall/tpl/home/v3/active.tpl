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
        <div class="common-position">
          <div class="posi"></div>
        </div>
        <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= item.img %>" class="op0 goods-img" alt="">
      </a>
    </li>
    <% }); %>
  </ul>
</div>
