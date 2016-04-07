<div class="goods-banner-bar">
  <img src="<%= img %>" alt="">
</div>

<div class="goods-tit-bar">
  <div>
    <p><%= desc %></p>
  </div>
</div>

<% if (Array.isArray(tags) && tags.length > 0) { %>
<div class="goods-tip-bar">
  <% tags.forEach(function(elem) { %>
    <div>
      <div><span></span><%= elem %></div>
    </div>
  <% }); %>
</div>
<% } %>

<% if (relevance) { %>
<div class="goods-buy-bar">
  <div class="goods-buy-price">
    <p><%= relevance.title %></p>
    <% if ( relevance.points > 0 && relevance.money > 0 ) { %>
    <p class="num-font"><%= relevance.points %><span>积分</span> + <%= relevance.money %><span>元</span></p>
    <% } else if ( relevance.points > 0 ) { %>
    <p class="num-font"><%= relevance.points %><span>积分</span></p>
    <% } else if ( relevance.money > 0 ) { %>
    <p class="num-font"><%= relevance.money %><span>元</span></p>
    <% } else { %>
    <p class="num-font">0<span>元</span></p>
    <% } %>
  </div>
  <button
    data-log-mall-click="detail_<%= relevance.title %>"
    data-productid="<%= relevance.productid %>"
    data-group-id="<%= relevance.groupId %>"
    data-title="<%= relevance.title %>"
    data-classify="<%= relevance.classify || '' %>"
    data-href="<%= tplUtil.getBlockUrl(relevance) %>"
    class="<%= tplUtil.getJsClass(relevance) %> goods-buy-btn bold-tit"
    type="button"
  ><%= relevance.button %></button>
</div>
<% } %>

<a class="js-detail-bar goods-detail-bar bold-tit">图文详情<span>建议在WiFi下查看</span></a>

<% if (Array.isArray(rules) && rules.length > 0) { %>
<div class="js-desc goods-desc-bar">
  <h4 class="bold-tit">说明信息</h4>
  <ul class="goods-info-list">
    <% rules.forEach(function(elem) { %>
      <li>
        <p><span><%= elem.name %></span></p>
        <p><%= elem.content %></p>
      </li>
    <% }); %>
  </ul>
</div>
<% } %>

<div id="copyright" class="copyright-block goods-copyright-fix">
  <!-- // -->
</div>

<div class="js-pop-shadow common-shadow">
  <div class="js-pop-panel common-buy-box">
    <div class="common-buy-nav">
      <p>购买数量</p>
      <div class="js-hide-panel common-buy-close-btn">
        <i class="common-buy-close-icon"></i>
      </div>
    </div>
    <div class="common-buy-num">
      <div class="common-buy-choice">
        <i data-operator="minus" class="js-change-num unable">-</i><i><input class="js-goods-num" type="number" value="1" /></i><i data-operator="add" class="js-change-num">+</i>
      </div>
    </div>
  </div>
</div>

<div class="goods-charge-bar">
  <!-- <p class="js-points goods-charge-info num-font"><span>100</span> 积分 + <span>100</span> 元</p> -->
  <% if ( points > 0 && money > 0 ) { %>
  <p class="js-points goods-charge-info num-font"><span class="js-m-points"><%= points %></span>积分 + <span class="js-m-money"><%= money %></span>元</p>
  <% } else if ( points > 0 ) { %>
  <p class="js-points goods-charge-info num-font"><span class="js-m-points"><%= points %></span>积分</p>
  <% } else if ( money > 0 ) { %>
  <p class="js-points goods-charge-info num-font"><span class="js-m-money"><%= money %></span>元</p>
  <% } else { %>
  <p class="js-points goods-charge-info num-font"><span>0</span>元</p>
  <% } %>
  <button type="button" disabled class="js-purchase goods-charge-btn"
    data-pay-text="去支付"
    data-active-text="<%= button %>"
  ><%= button %></button>
</div>
