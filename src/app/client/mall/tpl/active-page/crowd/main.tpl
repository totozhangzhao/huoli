<!--
stat  int 状态
0-待开奖（已结束）
1-正常购买中
2-已开奖
3-自己中奖了
4-待开奖（有未支付的）
-->
<div class="snap-banner-bar">
  <img src="<%= data.img %>">
</div>
<div <%= (data.stat === 1 || data.stat === 4) ? "" : "disabled" %> class="snap-status-bar">
  <div class="snap-status-tip clearfix">
    <% var statText = { "0": "待开奖", "1": "进行中", "2": "已结束", "4": "进行中" } %>
    <span class="fl"><%= statText[data.stat] %></span>
    <span class="fl"><%= data.hint %></span>
  </div>
  <div class="snap-status-show">
    <div class="js-bar" style="width: <%=  barWidth %>%;"></div>
  </div>
  <div class="snap-status-total clearfix">
    <span class="fl">总需<%= data.totalcount %>人次</span>
    <span class="fr">剩余<span><%= data.remaincount %></span></span>
  </div>
  <% if (data.stat === 2) { %>
  <div class="snap-winner-area">
    <% data.winner = data.winner || {}; %>
    <div class="snap-winner-son">
      <div class="snap-winner-flex"></div>
      <div class="snap-winner-flex">
      <% if (data.winner.phone) { %>
        <% var phone = data.winner.phone; %>
        <% phone = phone.slice(0, 3) + "****" + phone.slice(7, 11); %>
        <p>获奖者：<span class="snap-winner-tel"><%= phone %></span></p>
        <p>参与次数：<span class="snap-winner-time"><%= data.winner.winnerBuyNum %></span>人次</p>
        <p>揭晓日期：<%= data.winner.time %></p>
      <% } else { %>
        <p>本期没有人中奖</p>
        <p>希望下期中奖者就是您 ^_^</p>
      <% } %>
      </div>
      <a class="js-rules snap-winner-flex">计算规则</a>
    </div>
    <div class="snap-winner-son num-font">幸运号码：<%= data.winner.wincode %></div>
  </div>
  <% } %>
  <div class="snap-status-num">
    <% data.purchased = data.purchased || []; %>
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
    <p class="js-webview snap-join-no">您未参与本期活动<a href="https://dl.rsscc.cn/guanggao/active/what-is-crowd.html">什么是一元夺宝？</a></p>
    <!-- 1.未参与 -->
    <% } %>
  </div>
</div>
<div class="snap-desc-bar">
  <ul class="js-tab-wrapper no-select snap-tab">
    <li data-tab-name="userList" class="js-tab on">最近参与</li>
    <li data-tab-name="goodsDetail" class="js-tab">商品详情</li>
    <li data-tab-name="rules" class="js-tab">获奖规则</li>
  </ul>
  <ul data-for="userList" class="js-tab-content snap-desc-area player-list on">
    <% _.each(data.playerlist, function(player) { %>
    <li data-id="<%= player.orderid %>" class="flex-row">
      <div class="snap-desc-portrait"></div>
      <div class="snap-desc-info num-font">
        <p><%= player.phone %></p>
        <p>参与了<span><%= player.count %></span>人次</p>
      </div>
      <div class="snap-desc-time num-font"><%= player.time %></div>
    </li>
    <% }); %>
  </ul>
  <div data-for="goodsDetail" class="js-tab-content snap-desc-area snap-desc-detail">
    <!-- // -->
  </div>
  <dl data-for="rules" class="js-tab-content snap-desc-area snap-desc-rule text-box"><%= data.rulestpl %></dl>
</div>
<% if (data.stat === 4) { %>
<div class="js-fix-text fix-hint">还有机会，有未完成支付的订单，5分钟内未支付的订单将被取消。</div>
<% } %>
<div class="snap-join-bar">
  <p class="js-model-money"><%= data.showprice %></p>
  <% var buttonText = { "0": "已结束", "1": "立即参与", "2": "已结束", "4": "余量不足" } %>
  <button <%= data.stat === 1 ? "" : "disabled" %> class="js-submit" type="button"
    data-active-text="立即参与"
    data-pay-text="去支付"
  ><%= buttonText[data.stat] %></button>
</div>
<div class="js-pop-shadow common-shadow">
  <div class="js-pop-panel common-buy-box">
    <div class="common-buy-nav">
      <p>购买份数</p>
      <div class="js-hide-panel common-buy-close-btn">
        <i class="common-buy-close-icon"></i>
      </div>
    </div>
    <div class="common-buy-num">
      <div class="common-buy-choice">
        <i data-operator="minus" class="js-change-num unable">-</i><i><input class="js-goods-num" type="number" value="1" min="1" max="99" /></i><i data-operator="add" class="js-change-num">+</i>
      </div>
      <p class="common-buy-tip"><span>多买一份</span><span>，中奖概率就增大一倍</span></p>
    </div>
  </div>
</div>
<!-- 
<div class="js-pop-shadow common-shadow">
  <div class="js-pop-panel snap-buy-box">
    <div class="snap-buy-nav">
      <p>购买份数</p>
      <div class="js-hide-panel snap-buy-close-btn">
        <i class="snap-buy-close-icon"></i>
      </div>
    </div>
    <div class="snap-buy-num">
      <div class="snap-buy-choice">
        <i data-operator="minus" class="js-change-num unable">-</i><i class="js-goods-num">1</i><i data-operator="add" class="js-change-num">+</i>
      </div>
      <p class="snap-buy-tip"><span>多买一份</span><span>，中奖概率就增大一倍</span></p>
    </div>
  </div>
</div> -->
