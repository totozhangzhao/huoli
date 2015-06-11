<ul class="record-bar">
<% _.each(orderList, function(item) { %>
  <li class="js-order-item record-area" data-id="<%= item.orderid %>">
    <a class="clearfix">
      <div class="record-pic-bar fl">
        <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= item.img %>" class="record-pic chit-pic">
      </div>
      <div class="record-text-bar fl">
        <p class="record-text-tit"><%= item.title %></p>
        <div class="order-bar clearfix">
          <div class="fl">
            <p class="num-color"><%= item.price %></p>
            <p class="num-font order-status-time"><%= item.createtime %></p>
          </div>
        </div>
      </div>
      <div class="order-status <%= item.color %>"><%= item.status %></div>
    </a>
  </li>
<% }) %>
</ul>
