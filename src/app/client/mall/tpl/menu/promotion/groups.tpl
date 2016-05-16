<% _.each(groups, function(group, index) { %>
<div class="group" style="background-color: #<%=group.backcolor %>">
  <div class="mall-active-img">
    <img src="<%= group.topimg %>" alt="">
  </div>
  <div class="mall-active-bar">
    <div class="mall-active-area clearfix">
      <% _.each(group.goods, function(item, index) { %>
      <div class="mall-active-content">
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
          <img src="http://cdn.rsscc.cn/guanggao/img/mall/secondary/h3-10000112-goods-bcard.jpg" alt="">
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
        </a>
      </div>
     <% }); %>
    </div>
  </div>
</div>
<% });%>