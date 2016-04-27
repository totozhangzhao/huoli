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

<% if (Array.isArray(detail) && detail.length > 0) { %>
<a class="js-detail-bar goods-detail-bar bold-tit">图文详情<span>建议在WiFi下查看</span></a>
<% } %>

<% if (Array.isArray(rules) && rules.length > 0) { %>
<div class="js-webview goods-desc-bar">
  <h4 class="bold-tit">说明信息</h4>
  <ul class="goods-info-list">
    <% rules.forEach(function(elem) { %>
      <li>
        <p><span><%= elem.name %></span></p>
        <% elem.content = _.escape(elem.content) %>
        <p><%= elem.content.replace(/\$\$\$\$/g, "<br>") %></p>
      </li>
    <% }); %>
  </ul>
</div>
<% } %>

<div id="copyright" class="copyright-block goods-copyright-fix">
  <!-- // -->
</div>
