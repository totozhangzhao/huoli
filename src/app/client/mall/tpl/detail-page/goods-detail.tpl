<div class="common-banner-bar">
  <div class="common-position">
    <div class="posi"></div>
  </div>
  <div class="js-banner-box common-banner-wrapper">
    <ul class="common-banner-area clearfix">
      <% _.each(goods.img, function(url, index) { %>
      <li class="common-banner-pic fl">
        <a href="javascript:;">
          <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= url %>" class="goods-img op0" alt="">
        </a>
      </li>
      <% }); %>
    </ul>
    <div class="js-banner-index common-banner-indexs">
      <% _.each(goods.img, function(url, index) { %>
      <i class="<%= goods.index === 0 ? 'active' : '' %>"></i>
      <% }); %>
    </div>
  </div>
</div>

<div class="goods-tit-bar">
  <p class="js-goods-title goods-title"><%= getGoodsTitle(goods, model) %></p>
  <p class="goods-describe"><%= goods.desc %></p>
  <div class="js-money-block-container">
  <%=
    require("app/client/mall/tpl/detail-page/goods-detail/money-block.tpl")({ model: model })
  %>
  </div>
</div>

<% if (Array.isArray(goods.tags) && goods.tags.length > 0) { %>
<div class="goods-tip-bar flex-row">
  <% goods.tags.forEach(function(elem) { %>
  <div class="goods-tip-bar-son">
    <div><span>•</span><%= elem %></div>
  </div>
  <% }); %>
</div>
<% } %>

<% if (goods.relevance) { %>
<div
  data-log-mall-click="detail_<%= goods.relevance.title %>"
  data-productid="<%= goods.relevance.productid %>"
  data-group-id="<%= goods.relevance.groupId %>"
  data-title="<%= goods.relevance.title %>"
  data-classify="<%= goods.relevance.classify || '' %>"
  data-hl-mall-href="<%= tplUtil.getBlockUrl(goods.relevance) %>"
  data-hl-mall-page-action="replace"
  class="<%= tplUtil.getJsClass(goods.relevance) %> relevance-bar flex-row"
>
  <div class="relevance-pic">
    <img src="<%= goods.relevance.img %>" alt="">
  </div>
  <div class="relevance-desc">
    <p class="relevance-info"><%= goods.relevance.title %></p>
    <p class="relevance-cost"><%= goods.relevance.unitPriceText %></p>
  </div>
  <strong class="goods-tip-dot"><b></b><b></b><b></b></strong>
</div>
<% } %>

<% if ( goods.userprivilresp.privilid || goods.couponrecords.length > 0 ) { %>
<div class="goods-coupons-bar">
  <% if (goods.userprivilresp && goods.userprivilresp.privilid) { %>
  <a class="js-privilege goods-coupons-bar-son">
    <button>特权</button>可使用一个夺宝币，下单直减1元
    <strong class="goods-tip-dot"><b></b><b></b><b></b></strong>
  </a>
  <% } %>
  <% if (Array.isArray(goods.couponrecords) && goods.couponrecords.length > 0) { %>
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
<% if (goods.detail) { %>
  <% goods.detail.forEach(function(elem) { %>
  <img src="<%= elem.img %>" alt="">
  <% }); %>
<% } %>
</div>
<div data-for="rules" class="js-tab-content js-webview goods-tap-content goods-desc-bar">
<% if (goods.rules) { %>
  <ul class="goods-info-list">
    <% goods.rules.forEach(function(elem) { %>
    <li>
      <p><span><%= elem.name %></span></p>
      <% elem.content = _.escape(elem.content) %>
      <p><%= elem.content.replace(/\$\$\$\$/g, "<br>") %></p>
    </li>
    <% }); %>
  </ul>
<% } %>
</div>
