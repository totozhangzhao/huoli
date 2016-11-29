<% if(!isGift) {%>
<ul id="address-entry" class="confirm-order-bar">
  <li>
    <a>
      <div class="confirm-order-info">
        <span><%- addressInfo.name || "" %></span><span class="num-font"><%- addressInfo.pphone || "" %></span>
      </div>
      <div class="confirm-order-address num-font"><%- addressInfo.province.name + " " + addressInfo.city.name + " " + addressInfo.area.name + " " + addressInfo.address || "" %></div>
      <b class="confirm-order-icon"></b>
    </a>
  </li>
</ul>
<% } else { %>
<div class="giving-confirm-status">
  <div class="status-bar-fa flex-row">
   <img src="http://cdn.rsscc.cn/guanggao/img/icon/wechat-tip.png?v=2" alt="">
  </div>
  <div class="giving-confirm-tip">
    <span>48小时内礼物未被领取，相应金额原路退回</span>
  </div>
</div>
<% } %>
<div class="giving-confirm-choice flex-row">
  <div class="goods-pic">
    <img src="<%= avatar || "" %>" alt="">
    <div class="mask"></div>
  </div>
  <div class="goods-info">
    <p class="name"><%= title || "　" %></p>
    <p class="items"><%= specValueName || "　" %></p>
    <div class="goods-choice">
      <p class="price"><%= buyNumModel.getPPriceTpl(1) %></p>
      <!---->
      <div class="giving-choice-num flex-row">
        <div class="num-items flex-row">
          <!-- 数量为1时，减号不可点击，同时加class .off -->
          <span class="reduce" data-operator="subtract"><b class="reduce-icon"></b></span><span class="num-insert"><input class="js-goods-num-input address-num-input" type="text" value="<%= number %>"></span><span class="add" data-operator="add"><b class="add-icon"></b></span>
        </div>
      </div>
      <!---->
    </div>
  </div>
</div>
<% if(isGift) { %>
<div id="gift-message-container"></div>
<% } %>

<% if(discount > 0) {%>
  <div class="charge-total-area">
      <div class="charge-total clearfix">
        <p class="fl">订单合计</p>
        <p class="num fr js-total-without-discount"><%= buyNumModel.getPPriceTpl() %></p>
      </div>
      <div class="charge-deduction clearfix">
        <p class="fl">夺宝币抵扣</p>
        <p class="num fr">-￥<%= Number(discount).toFixed(2) %></p>
      </div>
    </div>
<% } %>
<div class="giving-confirm-pay flex-row">
  <div class="price-contain js-total-price">
    <%= buyNumModel.getPPriceTpl(false, true) %>
  </div>
  <a id="confirm-order" class="js-goods-pay charge-btn pay-btn"><%= buttonText || "去支付" %></a>
</div>
