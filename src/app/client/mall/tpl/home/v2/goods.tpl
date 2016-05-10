<div class="home-goods-shadow"></div>
<ul class="home-goods-bar clearfix no-select">
  <% _.each(dataList,function (item, index) { %>
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
          <div class="home-info-bar">
            <div class="home-pic-area">
              <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= item.img %>" class="op0 touch-img" >
            </div>
            <div class="home-info-show">
              <p class="hmoe-goods-name"><%= item.title %></p>
            </div>
            <p class="home-goods-price">
              <% if ( item.points > 0 && item.money > 0 ) { %>
                <span><%= item.points %></span> 积分 + <span><%= item.money %></span> 元
              <% } else if ( item.points > 0 ) { %>
                <span><%= item.points %></span> 积分
              <% } else if ( item.money > 0 ) { %>
                <span><%= item.money %></span> 元
              <% } else if ( item.action === 0 || item.action === 9 ) { %>
                <span>0</span> 元
              <% } %>
            </p>
          </div>
        </a>
      </li>
  <% }); %>
</ul>
