<a href="javascript:;" class="block clearfix js-to-order-detail">
  <div class="num-font order-status-time"><%= orderData.createtime %></div>
  <div class="record-info-show flex-row">
    <div class="record-pic-bar">
      <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= orderData.img %>" class="record-pic" class="record-pic op0">
      <div class="mask"></div>
    </div>
    <div class="record-text-bar">
      <div class="record-text-tit flex-row">
        <span class="title block"><%= orderData.title %></span>
        <% var unitPrice = tplUtil.getMoneyTpl({
          payType: orderData.paytype,
          number: 1,
          price: orderData.money,
          points: orderData.point
          }); 
        %>
        <span class="price num-font block"><%= unitPrice %></span>
      </div>
      <% if(orderData.spec) {%>
      <div class="record-standard">
        <span class="standard-tit">规格：</span>
        <span class="standard-desc"><%= orderData.spec %></span>
      </div>
      <% } %>
      <% if(orderData.orderKind === 2) {%>
      <button class="giving-info-tip">微信送礼</button>
      <% } %>
    </div>
  </div>
  	<%if(orderData.status.code === 4) { %>
  		<div class="order-status order-status-succ"></div>
  	<% } else if(orderData.status.code === 16) { %>
  		<div class="order-status order-status-abolish"></div>
  	<% } else {%>
      <div class="order-status" style="color: <%= orderData.status.color %>"><%= orderData.status.message %></div>
    <% } %>
  <div class="order-goods-num num-font">x<%= orderData.amount %></div>
</a>
<div class="order-control-contain">
  <div class="total-price num-font">
    <span>合计：</span>
    <% var total = tplUtil.getMoneyTpl({
      payType: orderData.paytype,
      number: 1,
      price: orderData.mtotal,
      points: orderData.ptotal
      });
    %>
    <span><%= total %></span>
  </div>

    <div class="control-contain clearfix">
      <% if( orderData.operateType === 1 ) { %>
        <button class="control-order fl js-cancel-order">取消订单</button>
      <% } else if (orderData.operateType === 2) {%>
        <button class="control-order fl js-delete-order">删除订单</button>
      <% } else if (orderData.operateType === 3) {%>
        <button class="control-order fl js-to-express">查看物流</button>
      <% }%>
      
      <% if(orderData.action === 1) { %>
        <button class="control-buy fr red-bg js-purchase-order">去支付</button>
      <% } else if (orderData.action === 2 && orderData.orderType !== 2) {%>
        <button class="control-buy fr js-to-goods-detail">再次购买</button>
      <% } %>
    </div>
</div>