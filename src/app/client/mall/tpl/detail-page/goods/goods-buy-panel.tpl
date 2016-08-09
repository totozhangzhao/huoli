<% if(visible) { %>
  <% if(hasMask) {%>
  <div class="common-shadow" style="display: block;">
  </div>
  <% } %>
  <div class="common-charge-content">
    <% if(type === 1) { %>
    <div class="goods-confirm-content">
      <div class="goods-confirm-contain">
        <div class="goods-confirm-pic">
          <img src="http://cdn.rsscc.cn/guanggao/img/test/test-0725-5.png" alt="">
          <div class="goods-confirm-mask"></div>
        </div>
        <div class="goods-confirm-desc">
          <p class="goods-confirm-desc-tit"><%= title %></p>
          <p class="goods-confirm-desc-price"><%= unitPriceText %></p>
        </div>
      </div>
      <div class="goods-confirm-choice">
        <% if (specs) { %>
        <div class="goods-confirm-choice-color flex-row">
          <div class="color-item">颜色</div>
          <div class="color-items">
            <span class="on">银色</span><span class="off">金色</span><span>黑色</span>
          </div>
        </div>
        <% } %>
        <div class="goods-confirm-choice-num flex-row">
          <div class="num-item">数量</div>
          <div class="num-items flex-row">
            <!-- 数量为1时，减号不可点击，同时加class .off -->
            <span data-operator="subtract" class="reduce off"><b class="reduce-icon"></b></span><span class="num-insert"><input type="text" class="js-goods-num-input" value="<%= number %>"></span><span data-operator="add" class="add"><b class="add-icon"></b></span>
          </div>
        </div>
      </div>
      <div class="js-close-panel goods-confirm-close">
        <b class="close-icon"></b>
      </div>
      <a class="js-goods-pay goods-confirm-btn">确认</a>
    </div>
    <% } %>
    <div class="goods-buynow-bar">
      <a <% if(!canPay) {%>disabled<% } %> class="js-goods-pay">立即购买</a>
    </div>
  </div>
<% } %>


