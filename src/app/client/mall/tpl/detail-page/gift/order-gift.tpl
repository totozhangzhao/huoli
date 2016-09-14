<!-- send: 赠送好友； again: 再来一单; notice: 通知好友 -->
<%
  var statusObj = giftConfig.OrderDetailInfo[giftContent.status];
  var cName = statusObj ? statusObj.className : '';
%>
<div class="order-giving-bar <%= cName %>">
  <div class="order-giving-bar-son">
    <div class="order-giving-area flex-row">
      <div class="order-status-icon">
        <b class="icon"></b>
      </div>
      <div class="order-status-content">
        <p class="order-status-tit"><%= giftContent.title %></p>
        <p class="order-status-msg flex-row"><b class="icon"></b><span><%= giftContent.content %></span></p>
      </div>
    </div>
    <% if(giftContent.status !== 5)  {%>
    <a class="order-giving-btn"><%= giftContent.button %></a>
    <% } %>
  </div>
</div>
