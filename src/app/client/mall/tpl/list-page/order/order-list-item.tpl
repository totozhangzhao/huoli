<a href="javascript:;" class="block clearfix js-to-order-detail">
  <div class="num-font order-status-time"><%= createtime %></div>
  <div class="record-info-show flex-row">
    <div class="record-pic-bar">
      <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= img %>" class="record-pic" class="record-pic op0">
      <div class="mask"></div>
    </div>
    <div class="record-text-bar">
      <div class="record-text-tit flex-row">
        <span class="title block"><%= title %></span>
        <span class="price num-font block"><%= money %></span>
      </div>
      <% if(spec) {%>
      <div class="record-standard">
        <span class="standard-tit">规格：</span>
        <span class="standard-desc"><%= spec %></span>
      </div>
      <% } %>
      <% if(orderKind === 2) {%>
      <button class="giving-info-tip">微信送礼</button>
      <% } %>
    </div>
  </div>
  	<%if(status.code === 4) { %>
  		<div class="order-status order-status-succ"></div>
  	<% } else if(status.code === 16) { %>
  		<div class="order-status order-status-abolish"></div>
  	<% } else {%>
      <div class="order-status" style="color: <%= status.color %>"><%= status.message %></div>
    <% } %>
  <div class="order-goods-num num-font"><%= amount %></div>
</a>
<div class="order-control-contain">
<div class="total-price num-font">
  <span>合计：</span>
  <span>￥<b class="big-font"><%= mtotal %></b>.00</span>
</div>
	<% if( operateType === 1 ) { %>
		<button class="control-order js-cancle-order">取消订单</button>
	<% } else if (operateType === 2) {%>
		<button class="control-order js-delete-order">删除订单</button>
	<% } else if (operateType === 3) {%>
		<button class="control-order js-to-express">查看物流</button>
	<% }%>
	
	<% if(action === 1) { %>
		<button class="control-buy red-bg js-purchase-order">去支付</button>
	<% } else if (action === 2) {%>
		<button class="control-buy js-to-goods-detail">再次购买</button>
	<% } %>
</div>