<ul class="record-bar">
<% _.each(orderList, function(item) { %>
    <li class="js-order-item record-area" data-id="<%= item.orderid %>">
      <a href="javascript:;" class="clearfix">
        <div class="record-pic-bar fl">
          <img src="<%= item.img %>" / class="record-pic chit-pic">
        </div>
        <div class="record-text-bar fl">
          <p class="record-text-tit"><%= item.title %></p>
          <p class="record-text-det">成功兑换1份</p>
          <p class="record-text-time num-font clearfix"><span class="fl"><%= item.createtime %></span><span class="fr"><b class="num-color"><%= item.pprice %></b>分</span></p>
        </div>
        <span class="enter-btn fr"></span>
      </a>
    </li>
<% }) %>
</ul>
