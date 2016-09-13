<% if(visible) { %>
  <% if(hasMask) {%>
  <div class="common-shadow" style="display: block;">
  </div>
  <% } %>
  <div class="common-charge-content">
    <% if(type === 1) { %>
    <div class="common-buy-box">
      <div class="common-buy-nav">
        <p><%= title %></p>
        <div class="js-close-panel common-buy-close-btn">
          <i class="common-buy-close-icon"></i>
        </div>
      </div>
      <div class="common-buy-num">
        <div class="common-buy-choice">
          <i class="unable" data-operator="subtract">-</i><i><input type="number" class="js-goods-num-input" value="<%= number %>"></i><i data-operator="add">+</i>
        </div>
        <% if(showBuyTip) { %>
        <p class="common-buy-tip"><span>多买一份</span><span>，中奖概率就增大一倍</span></p>
        <% } %>
      </div>
    </div>
    <% } %>
    <div class="goods-charge-bar">
      <p class="goods-charge-info num-font"><span class="js-total-price"></span></p>
      <button class="js-goods-pay charge-btn goods-confirm-btn" type="button" <% if(!canPay) {%>disabled<% } %>>立即支付</button>
    </div>
  </div>
<% } %>
