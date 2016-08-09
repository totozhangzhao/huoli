<div class="js-banner-box common-banner-bar no-select">
  <ul class="common-banner-area clearfix">
    <% _.each(img, function(url, index) { %>
    <li class="common-banner-pic fl">
      <a href="javascript:;">
        <img src="<%= url %>" >
      </a>
    </li>
    <% }); %>
  </ul>
  <div class="js-banner-index common-banner-indexs">
    <% _.each(img, function(url, index) { %>
    <i class="<%= index === 0 ? 'active' : '' %>"></i>
    <% }); %>
  </div>
</div>

<div class="goods-tit-bar">
  <p class="goods-title"><%= title %></p>
  <p class="goods-describe"><%= desc %></p>
  <% if (paytype === 3) { %>
  <div class="money-points-contain">
    <% if (oriprice) { %>
    <p class="relevance-price">￥<%= Number( oriprice ).toFixed(2) %></p>
    <% } %>
    <p class="goods-price"><%= unitPriceText %></p>
  </div>
  <% } else { %>
  <div class="money-contain">
    <% if (oriprice) { %>
    <p><span class="goods-price"><%= unitPriceText %></span><span class="relevance-price">￥<%= Number( oriprice ).toFixed(2) %></span></p>
    <% } else { %>
    <p><span class="goods-price"><%= unitPriceText %></span></p>
    <% } %>
  </div>
  <% } %>
</div>

<% if (Array.isArray(tags) && tags.length > 0) { %>
<div class="goods-tip-bar flex-row">
  <% tags.forEach(function(elem) { %>
  <div class="goods-tip-bar-son">
    <div><span>•</span><%= elem %></div>
  </div>
  <% }); %>
</div>
<% } %>

<% if (relevance) { %>
<div
  data-log-mall-click="detail_<%= relevance.title %>"
  data-productid="<%= relevance.productid %>"
  data-group-id="<%= relevance.groupId %>"
  data-title="<%= relevance.title %>"
  data-classify="<%= relevance.classify || '' %>"
  data-href="<%= tplUtil.getBlockUrl(relevance) %>"
  class="<%= tplUtil.getJsClass(relevance) %> relevance-bar flex-row"
>
  <div class="relevance-pic">
    <img src="http://cdn.rsscc.cn/guanggao/img/test/test-0725-4.png" alt="">
  </div>
  <div class="relevance-desc">
    <p class="relevance-info"><%= relevance.title %></p>
    <p class="relevance-cost"><%= relevance.unitPriceText %></p>
  </div>
  <strong class="goods-tip-dot"><b></b><b></b><b></b></strong>
</div>
<% } %>

<% if ( userprivilresp.privilid || couponrecords.length > 0 ) { %>
<div class="goods-coupons-bar">
  <% if (userprivilresp && userprivilresp.privilid) { %>
  <a class="js-privilege goods-coupons-bar-son">
    <button>特权</button>可使用一个夺宝币，下单直减1元
    <strong class="goods-tip-dot"><b></b><b></b><b></b></strong>
  </a>
  <% } %>
  <% if (Array.isArray(couponrecords) && couponrecords.length > 0) { %>
  <a class="js-coupon goods-coupons-bar-son">
    <button>优惠券</button>有可用优惠券
    <em class="goods-bg-icon"></em>
    <strong class="goods-tip-dot"><b></b><b></b><b></b></strong>
  </a>
  <% } %>
</div>
<% } %>

<div class="js-tab-wrapper goods-tap-bar flex-row">
  <button data-tab-name="goodsDetail" class="js-tab on goods-tap-bar-son">图文详情</button>
  <button data-tab-name="rules" class="js-tab goods-tap-bar-son">规格参数</button>
</div>
<div data-for="goodsDetail" class="js-tab-content on goods-tap-content goods-graphic-bar">
<% if (detail) { %>
  <% detail.forEach(function(elem) { %>
  <img src="<%= elem.img %>" alt="">
  <% }); %>
<% } %>
</div>
<div data-for="rules" class="js-tab-content js-webview goods-tap-content goods-desc-bar">
<% if (rules) { %>
  <ul class="goods-info-list">
    <% rules.forEach(function(elem) { %>
    <li>
      <p><span><%= elem.name %></span></p>
      <% elem.content = _.escape(elem.content) %>
      <p><%= elem.content.replace(/\$\$\$\$/g, "<br>") %></p>
    </li>
    <% }); %>
  </ul>
<% } %>
</div>
