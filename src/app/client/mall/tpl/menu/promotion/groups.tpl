<% _.each(groups, function(group, index) { %>
<div class="group" style="background-color: #<%=group.backcolor %>">
  <div class="mall-active-img">
    <img src="<%= group.topimg %>" alt="">
  </div>
  <div class="mall-active-bar">
    <div class="mall-active-area clearfix">
      <% var type = group.goods.length & 1%>
      <% _.each(group.goods, function(item, index) { %>
      <% if(type === 0) {%>
      <div class="mall-active-content">
        <a
          data-log-mall-click="index-block_<%= item.title %>-<%= item.productid %>"
          data-productid="<%= item.productid %>"
          data-group-id="<%= item.groupId %>"
          data-title="<%= item.title %>"
          data-info="index-goods-<%= index %>"
          class="<%= tplUtil.getJsClass(item) %>"
          href="<%= tplUtil.getBlockUrl(item) %>"
        >
          <img src="<%= item.img %>" alt="">
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
      <% }else if(type === 1) {%>
        <div class="mall-active-contain clearfix">
        <a
          data-log-mall-click="index-block_<%= item.title %>-<%= item.productid %>"
          data-productid="<%= item.productid %>"
          data-group-id="<%= item.groupId %>"
          data-title="<%= item.title %>"
          data-info="index-goods-<%= index %>"
          class="<%= tplUtil.getJsClass(item) %>"
          href="<%= tplUtil.getBlockUrl(item) %>"
        >
          <div class="mall-active-contain-son fl">
            <img src="<%= item.img %>" alt="">
          </div>
          <div class="mall-active-contain-son fl">
            <h5 class="mall-active-contain-tip"><%= item.title %></h5>
            <p class="mall-active-contain-desc"><%= item.shortdesc %></p>
            <!-- <p class="mall-active-contain-price num-font">￥108</p> -->
            <p class="home-goods-price" style="padding-left:0;">
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
        </div>
      <%} %>
     <% }); %>
    </div>
  </div>
</div>
<% });%>