<% if(visible) { %>
  <% if(hasMask) {%>
  <div class="common-shadow" style="display: block;">
  </div>
  <% } %>
  <div class="goods-confirm-content">
    <% if(type === 1) { %>
      <div class="goods-confirm-contain">
        <div class="goods-confirm-pic">
          <% if (specList) { %>
          <% specList.forEach(function(elem, index) { %>
          <img src="<%= elem.img %>" class="js-avatar-img" alt="" style="<%= index === specIndex ? '' : 'display: none;' %>">
          <% }); %>
          <% } else { %>
          <img src="<%= smallimg %>" alt="">
          <% } %>
          <div class="goods-confirm-mask"></div>
        </div>
        <div class="goods-confirm-desc">
          <p class="goods-confirm-desc-tit"><%= title %></p>
          <p class="js-unit-price goods-confirm-desc-price"><%= unitPriceText %></p>
        </div>
      </div>
      <div class="goods-confirm-choice">
        <% if (specList) { %>
        <div class="goods-confirm-choice-color flex-row">
          <div class="color-item"><%= specname %></div>
          <div class="color-items">
            <% specList.forEach(function(elem, index) { %>
            <%
                var specClass = "";
                if (elem.left === 0) {
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
            <span data-operator="subtract" class="reduce off"><b class="reduce-icon"></b></span><span class="num-insert"><input type="text" class="js-goods-num-input" value="<%= number %>"></span><span data-operator="add" class="add"><b class="add-icon"></b></span>
          </div>
        </div>
      </div>
      <div class="js-close-panel goods-confirm-close">
        <b class="close-icon"></b>
      </div>
      <a class="js-goods-pay goods-confirm-btn">确认</a>
    <% } else { %>
    <div class="goods-buynow-bar">
      <a <% if(!canPay) {%>disabled<% } %> class="js-goods-pay">立即购买</a>
    </div>
    <% } %>
  </div>
<% } %>
