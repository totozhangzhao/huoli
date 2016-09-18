<div class="home-recommend-area">
  <ul class="home-recommend-content clearfix">
  <% 
    _.each(data.goods, function (item, index) {
      var priceText = tplUtil.getMoneyText({
        payType: item.paytype,
        number: 1,
        price: item.money,
        points: item.points
      });
  %>
    <li>
      <a
        data-log-mall-click="category-list_<%= item.title %>-<%= item.productid %>"
        data-productid="<%= item.productid %>"
        data-group-id="<%= item.groupId %>"
        data-title="<%= item.title %>"
        class="<%= tplUtil.getJsClass(item) %>"
        href="<%= tplUtil.getBlockUrl(item) %>"
      >
        <div class="home-block">
          <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= item.img %>" class="op0 touch-img" >
          <div class="home-recommend-mask"></div>
          <% if(item.goodsTag) { %>
            <% if(item.goodsTag.stockstatus === 101) {%>
              <div class="sold-out-money"></div>
            <% } else if(item.goodsTag.stockstatus === 102) { %>
              <div class="sold-out-point"></div>
            <% } %>
          <% } %>
        </div>
        <div class="home-recommend-desc">
          <p class="home-recommend-goods"><%= item.title %></p>
          <p class="home-recommend-price"><%= priceText %></p>
        </div>
      </a>
    </li>
  <% }); %>
  </ul>
</div>