<%
  var data = model.toJSON();
  data.originalPriceText = model.getOriginalPriceText();
  data.unitPriceText = model.getPPriceText(1);
  data.totalPriceText = model.getPPriceText();
%>
<% if(data.visible) { %>
  <% if(data.hasMask) {%>
  <div class="common-shadow" style="display: block;">
  </div>
  <% } %>
  <div class="goods-confirm-content">
    <!-- 展开状态的底部 Panel （规格、数量选择，购买按钮） -->
    <% if(data.type === 1) { %>
      <div class="goods-confirm-contain">
        <div class="goods-confirm-pic">
          <% if ( Array.isArray(data.specList) && data.specList.length > 0 ) { %>
          <% data.specList.forEach(function(elem, index) { %>
          <img src="<%= elem.img %>" class="js-avatar-img" alt="" style="<%= index === data.specIndex ? '' : 'display: none;' %>">
          <% }); %>
          <% } else { %>
          <img src="<%= data.avatar %>" alt="">
          <% } %>
          <div class="goods-confirm-mask"></div>
        </div>
        <div class="goods-confirm-desc">
          <p class="goods-confirm-desc-tit ellipsis"><%= data.title %></p>
          <p class="goods-confirm-desc-price"><span class="js-unit-price"><%= data.unitPriceText %></span><span class="js-original-price origin-price"><%= data.originalPriceText %></span></p>
        </div>
      </div>
      <div class="goods-confirm-choice">
        <% if ( Array.isArray(data.specList) && data.specList.length > 0 ) { %>
        <div class="goods-confirm-choice-color flex-row">
          <div class="color-item"><%= data.specName %></div>
          <div class="color-items">
            <% data.specList.forEach(function(elem, index) { %>
            <%
                var specClass = "";
                if (elem.limit === 0) {
                  specClass = "off";
                } else if (index === data.specIndex) {
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
            <span data-operator="subtract" class="reduce <%= data.number > 1 ? '' : 'off' %>"><b class="reduce-icon"></b></span><span class="num-insert"><input type="text" class="js-goods-num-input" value="<%= data.number %>"></span><span data-operator="add" class="add <%= data.number < data.limitNum ? '' : 'off' %>"><b class="add-icon"></b></span>
          </div>
        </div>
      </div>
      <div class="js-close-panel goods-confirm-close">
        <b class="close-icon"></b>
      </div>
      <% var confirmClass = data.isGift ? "black-btn" : ""; %>
      <div class="goods-buynow-bar">
        <a class="js-goods-pay goods-confirm-btn <%= confirmClass %>">立即购买</a>
      </div>
    <!-- 初始状态的底部 Panel （收藏，送礼按钮，购买按钮） -->
    <% } else { %>
      <%
        var buyContainerClass = "goods-buynow-bar";
        if ( (data.giftType === 3 || data.giftType === 4) && data.canPay ) {
          buyContainerClass = "goods-buygiving-bar";
        }
      %>
      <div class="<%= buyContainerClass %> flex-row">
        <% if(data.showCollect) {%>
        <!-- "已收藏"状态加 .yes | 默认状态无 .yes -->
        <button class="collect-button js-collect <%= data.isCollect === 2 ? "yes" : ""%>">
          <b class="icon"></b>
          <span class="text"><%= data.isCollect === 2 ? "已收藏" : "收藏"%></span>
        </button>
        <% } %>
        <% if (data.giftType === 3 && data.canPay) { %>
        <a class="js-goods-gift-pay give">赠送他人</a>
        <a class="js-goods-pay js-goods-normal-pay buy">买给自己</a>
        <% } else if (data.giftType === 4 && data.canPay) { %>
        <a class="js-goods-gift-pay give">赠送他人</a>
        <% } else { %>
        <a class="js-goods-pay js-goods-normal-pay <%= data.canPay ? '' : 'unable'%>">立即购买</a>
        <% } %>
      </div>
    <% } %>
  </div>
<% } %>
