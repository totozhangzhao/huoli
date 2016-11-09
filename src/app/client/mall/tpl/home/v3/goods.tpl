<h5 class="home-title"><span>HOT 热门推荐</span></h5>
<div class="home-recommend-area">
  <ul class="home-recommend-content clearfix">
  <% _.each(dataList, function (item, index) {%>
    <% if(index === 0){} %>
    <li>
      <a
        data-log-mall-click="index-hot_<%= item.title %>-<%= item.productid %>"
        data-productid="<%= item.productid %>"
        data-group-id="<%= item.groupId %>"
        data-title="<%= item.title %>"
        class="<%= tplUtil.getJsClass(item) %>"
        href="<%= tplUtil.getBlockUrl(item) %>"
      >
        <div class="home-block">
          <div class="common-position">
            <div class="posi"></div>
          </div>
          <div class="home-block-son">
            <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= item.img %>" class="op0 goods-img" alt="">
            <div class="home-recommend-mask"></div>
            <% if(item.goodsTag) { %>
              <% if(item.goodsTag.stockstatus === 101) {%>
                <div class="sold-out-money"></div>
              <% } else if(item.goodsTag.stockstatus === 102) { %>
                <div class="sold-out-point"></div>
              <% } %>
            <% } %>
          </div>
        </div>
        <div class="home-recommend-desc">
          <p class="home-recommend-goods"><%= item.title %></p>
          <p class="home-recommend-price">￥<%= item.money %></p>
        </div>
      </a>
    </li>
  <% }); %>
  </ul>
</div>
