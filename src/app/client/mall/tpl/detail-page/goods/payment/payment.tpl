<% if(visible) { %>
  <% if(hasMask) {%>
  <div class="common-shadow" style="display: block;">
  </div>
  <% } %>
  <div class="goods-confirm-content">
    <% if(type === 1) { %>
      <div class="goods-confirm-contain">
        <div class="goods-confirm-pic">
          <% if ( Array.isArray(specList) && specList.length > 0 ) { %>
          <% specList.forEach(function(elem, index) { %>
          <img src="<%= elem.img %>" class="js-avatar-img" alt="" style="<%= index === specIndex ? '' : 'display: none;' %>">
          <% }); %>
          <% } else { %>
          <img src="<%= avatar %>" alt="">
          <% } %>
          <div class="goods-confirm-mask"></div>
        </div>
        <div class="goods-confirm-desc">
          <p class="goods-confirm-desc-tit ellipsis"><%= title %></p>
          <p class="js-unit-price goods-confirm-desc-price"><%= unitPriceText %></p>
        </div>
      </div>
      <div class="goods-confirm-choice">
        <% if ( Array.isArray(specList) && specList.length > 0 ) { %>
        <div class="goods-confirm-choice-color flex-row">
          <div class="color-item"><%= specName %></div>
          <div class="color-items">
            <% specList.forEach(function(elem, index) { %>
            <%
                var specClass = "";
                if (elem.limit === 0) {
                  specClass = "off";
                } else if (index === specIndex) {
                  specClass = "on";
                }
            %>
            <span data-index="<%= index %>" class="js-spec <%= specClass %>"><%= elem.spec %></span>
            <% }); %>
          </div>
        </div>
        <% } %>
        <div class="goods-confirm-choice-num flex-row">
          <div class="num-item">数量</div>
          <div class="num-items flex-row">
            <span data-operator="subtract" class="reduce <%= number > 1 ? '' : 'off' %>"><b class="reduce-icon"></b></span><span class="num-insert"><input type="text" class="js-goods-num-input" value="<%= number %>"></span><span data-operator="add" class="add <%= number < limitNum ? '' : 'off' %>"><b class="add-icon"></b></span>
          </div>
        </div>
      </div>
      <div class="js-close-panel goods-confirm-close">
        <b class="close-icon"></b>
      </div>
      <% var confirmClass = isGift ? "black-btn" : ""; %>
      <div class="goods-buynow-bar">
        <a class="js-goods-pay goods-confirm-btn <%= confirmClass %>">立即购买</a>
      </div>
    <% } else { %>
      <% if(giftType === 3 && canPay) { %>
      <!-- 微信送礼  -->
        <div class="goods-buygiving-bar flex-row">
          <% if(showCollect) {%>
          <!-- "已收藏"状态加 .yes | 默认状态无 .yes -->
          <button class="collect-button js-collect <%= isCollect === 2 ? "yes" : ""%>">
            <b class="icon"></b>
            <span class="text"><%= isCollect === 2 ? "已收藏" : "收藏"%></span>
          </button>
          <% } %>
          <a class="js-goods-gift-pay give">微信送礼</a>
          <a class="js-goods-pay js-goods-normal-pay buy">立即购买</a>
        </div>
      <% } else {%>
        <div class="goods-buynow-bar flex-row">
          <% if(showCollect) {%>
          <!-- "已收藏"状态加 .yes | 默认状态无 .yes -->
          <button class="collect-button js-collect <%= isCollect === 2 ? "yes" : ""%>">
            <b class="icon"></b>
            <span class="text"><%= isCollect === 2 ? "已收藏" : "收藏"%></span>
          </button>
          <% } %>
          <a class="js-goods-pay js-goods-normal-pay <%= canPay ? '' : 'unable'%>">立即购买</a>
        </div>
      <% } %>
    <% } %>
  </div>
<% } %>
