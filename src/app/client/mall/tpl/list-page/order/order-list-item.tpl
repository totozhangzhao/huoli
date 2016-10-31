<a href="javascript:;" class="block clearfix">
  <div class="num-font order-status-time">2015-12-22 19:48:50</div>
  <div class="record-info-show flex-row">
    <div class="record-pic-bar">
      <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= img %>" class="record-pic" class="record-pic op0">
      <div class="mask"></div>
    </div>
    <div class="record-text-bar">
      <div class="record-text-tit flex-row">
        <span class="title block">悦途价值100元贵宾厅服务悦途价值100元贵宾厅服务</span>
        <span class="price num-font block">￥299.00</span>
      </div>
      <div class="record-standard">
        <span class="standard-tit">规格：</span>
        <span class="standard-desc">默认规格</span>
      </div>
    </div>
  </div>
  	<% if(status === 1) { %>
	  	<div class="order-status focus-color">待付款</div>
  	<% } else if (status === 2) { %>
	  	<div class="order-status focus-color">待收货</div>
  	<% } else if(status === 3) { %>
  		<div class="order-status order-status-succ"></div>
  	<% } else if(status === 5) { %>
  		<div class="order-status order-status-abolish"></div>
  	<% } %>
  <div class="order-goods-num num-font">x1</div>
</a>
<div class="order-control-contain">
<div class="total-price num-font">
  <span>合计：</span>
  <span>￥<b class="big-font">299</b>.00</span>
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