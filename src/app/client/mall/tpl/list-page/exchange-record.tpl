<% _.each(orderList, function(item) { %>
  <li class="js-order-item js-touch-state touch-bg no-select record-area" data-id="<%= item.orderid %>">
    <a class="block clearfix">
      <div class="record-pic-bar">
        <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= item.img %>" class="record-pic chit-pic op0">
      </div>
      <div class="record-text-bar">
        <p class="record-text-tit"><%= item.title %></p>
        <div class="order-bar clearfix">
          <div class="fl">
            <% if ( item.ptotal > 0 && item.mtotal > 0 ) { %>
            <p class="num-font">￥<%= item.mtotal %>+<%= item.ptotal %>积分</p>
            <% } else if ( item.ptotal > 0 ) { %>
            <p class="num-font"><%= item.ptotal %>积分</p>
            <% } else if ( item.mtotal > 0 ) { %>
            <p class="num-font">￥<%= item.mtotal %></p>
            <% } else if ( item.mtotal === 0 ) { %>
            <p class="num-font">￥0</p>
            <% } else if ( item.ptotal === 0 ) { %>
            <p class="num-font">0积分</p>
            <% } else { %>
            <p class="num-color"><%= item.price %></p>
            <% } %>
            <p class="num-font order-status-time"><%= item.createtime %></p>
          </div>
        </div>
      </div>
      <div class="order-status <%= item.color %>"><%= item.status %></div>
    </a>
  </li>
<% }) %>
