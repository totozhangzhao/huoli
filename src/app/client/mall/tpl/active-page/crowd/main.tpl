<!--
stat  int 状态
0-待开奖
1-正常购买中
2-已开奖
-->
<div class="snap-banner-bar">
  <img src="<%= data.img %>">
</div>
<div <%= data.stat === 1 ? "" : "disabled" %> class="snap-status-bar">
  <div class="snap-status-tip clearfix">
    <% var statText = { "0": "待开奖", "1": "进行中", "2": "已结束" } %>
    <span class="fl"><%= statText[data.stat] %></span>
    <span class="fl"><%= data.hint %></span>
  </div>
  <div class="snap-status-show">
    <div style="width: <%= (data.totalcount - data.remaincount) / data.totalcount * 100 %>%;"></div>
  </div>
  <div class="snap-status-total clearfix">
    <span class="fl">总需<%= data.totalcount %>人次</span>
    <span class="fr">剩余<span><%= data.remaincount %></span></span>
  </div>
  <% if (data.stat === 2) { %>
  <div class="snap-winner-area">
    <div class="snap-winner-son">
      <div class="snap-winner-flex"></div>
      <div class="snap-winner-flex">
        <% var phone = data.winner.phone; %>
        <% phone = phone.slice(0, 3) + "****" + phone.slice(7, 11); %>
        <p>获奖者：<%= phone %></p>
        <p>揭晓日期：<%= data.winner.time %></p>
      </div>
      <a class="snap-winner-flex" href="snap-winner-rule.html">计算规则</a>
    </div>
    <div class="snap-winner-son num-font">幸运号码：<%= data.winner.wincode %></div>
  </div>
  <% } %>
  <div class="snap-status-num">
    <% if (data.purchased.length > 0) { %>
    <!-- 2.参与 -->
    <p class="snap-join-num">您参与了：<span><%= data.purchased.length %></span>人次</p>
    <div class="snap-status-area">
      <p class="snap-num-flex">您的号码：</p>
      <p class="snap-num-flex verbose num-font">
        <% _.each(data.purchased, function(code) { %>
          <%= code + " " %>
        <% }); %>
      </p>
      <!--
      <span class="snap-num-flex snap-open-icon"></span>
      -->
    </div>
    <!-- 2.参与 -->
    <% } else { %>
    <!-- 1.未参与 -->
    <p class="snap-join-no">您未参与本期活动</p>
    <!-- 1.未参与 -->
    <% } %>
  </div>
</div>
<div class="snap-desc-bar">
  <ul class="js-tab-wrapper no-select snap-tab">
    <li data-tab-name="userList" class="js-tab on">所有参与</li>
    <li data-tab-name="goodsDetail" class="js-tab">商品详情</li>
    <li data-tab-name="rules" class="js-tab">获奖规则</li>
  </ul>
  <ul data-for="userList" class="js-tab-content snap-desc-area on">
    <% _.each(data.playerlist, function(player) { %>
    <li data-id="<%= player.orderid %>" >
      <div class="snap-desc-portrait"></div>
      <div class="snap-desc-info num-font">
        <% var phone = player.phone; %>
        <% phone = phone.slice(0, 3) + "****" + phone.slice(7, 11); %>
        <p><%= phone %></p>
        <p>参与了<span><%= player.count %></span>人次</p>
      </div>
      <div class="snap-desc-time num-font"><%= player.time %></div>
    </li>
    <% }); %>
  </ul>
  <div data-for="goodsDetail" class="js-tab-content snap-desc-area snap-desc-detail">
    <!-- // -->
  </div>
  <dl data-for="rules" class="js-tab-content snap-desc-area snap-desc-rule">
      <dt>幸运号码计算方式</dt>
      <dd>的快速康复的开发快点看来人了来人了两人论坛</dd>
      <dd>的快速康复的开发快点看来人了来人了两人论坛</dd>
      <dd>的快速康复的开发快点看来人了来人了两人论坛</dd>
      <dd>的快速康复的开发快点看来人了来人了两人论坛</dd>
  </dl>
</div>
<div class="snap-join-bar">
  <p class="js-model-money"><%= data.showprice %></p>
  <button <%= data.stat === 1 ? "" : "disabled" %> class="js-submit" type="button"
    data-active-text="立即参与"
    data-inactive-text="已结束"
    data-pay-text="去支付"
  ><%= data.stat === 1 ? "立即参与" : "已结束" %></button>
</div>
<div class="js-panel common-shadow">
  <div class="snap-buy-box">
    <div class="snap-buy-nav">
      <p>购买份数</p><span class="js-hide-panel snap-buy-close"></span>
    </div>
    <div class="snap-buy-num no-select">
      <div class="snap-buy-choice">
        <span data-operator="minus" class="js-change-num unable">-</span><span class="js-goods-num">1</span><span data-operator="add" class="js-change-num">+</span>
      </div>
      <p class="snap-buy-tip"><span>多买一份</span><span>，中奖概率就增大一倍</span></p>
    </div>
  </div>
</div>
