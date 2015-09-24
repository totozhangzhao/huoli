<% if (topList && topList.length === 3) { %>
<section class="home-goods-area clearfix">
  <div class="horizontal-view panel-container">
    <div class="panel-block-left">
      <% var item = topList[0]; %>
      <% var jsClass = "js-new-page"; %>
      <% var jsUrl = "javascript:;"; %>
      <% if ( String(item.action) === "0" ) { %>
        <% jsUrl = "/fe/app/client/mall/html/detail-page/goods-detail.html"; %>
      <% } else if ( String(item.action) === "1" ) { %>
        <% jsUrl = "/fe/app/client/mall/html/share-page/share.html"; %>
      <% } else if ( String(item.action) === "2" ) { %>
        <% jsUrl = item.url; %>
      <% } else if ( String(item.action) === "3" ) { %>
        <% jsClass = "js-get-url"; %>
      <% } else if ( String(item.action) === "4" ) { %>
        <% jsUrl = "/fe/app/client/mall/html/active-page/scratch-card/main.html"; %>
      <% } else if ( String(item.action) === "5" ) { %>
        <% jsUrl = "/fe/app/client/mall/html/menu/category.html"; %>
      <% } %>
      <a
        data-log-click="<%= appName %>-top|<%= item.productid %>|<%= item.title %>@click@index"
        data-productid="<%= item.productid %>"
        data-title="<%= item.title %>"
        data-classify="<%= item.classify || '' %>"
        class="<%= jsClass %> block"
        href="<%= jsUrl %>"
      >
        <div class="goods goods-1" data-echo-background="<%= item.img %>"></div>
      </a>
    </div>
    <div class="vertical-view panel-block-right">
      <% var item = topList[1]; %>
      <% var jsClass = "js-new-page"; %>
      <% var jsUrl = "javascript:;"; %>
      <% if ( String(item.action) === "0" ) { %>
        <% jsUrl = "/fe/app/client/mall/html/detail-page/goods-detail.html"; %>
      <% } else if ( String(item.action) === "1" ) { %>
        <% jsUrl = "/fe/app/client/mall/html/share-page/share.html"; %>
      <% } else if ( String(item.action) === "2" ) { %>
        <% jsUrl = item.url; %>
      <% } else if ( String(item.action) === "3" ) { %>
        <% jsClass = "js-get-url"; %>
      <% } else if ( String(item.action) === "4" ) { %>
        <% jsUrl = "/fe/app/client/mall/html/active-page/scratch-card/main.html"; %>
      <% } else if ( String(item.action) === "5" ) { %>
        <% jsUrl = "/fe/app/client/mall/html/menu/category.html"; %>
      <% } %>
      <a
        data-log-click="<%= appName %>-top|<%= item.productid %>|<%= item.title %>@click@index"
        data-productid="<%= item.productid %>"
        data-title="<%= item.title %>"
        data-classify="<%= item.classify || '' %>"
        class="<%= jsClass %> block"
        href="<%= jsUrl %>"
      >
        <div class="goods goods-2" data-echo-background="<%= item.img %>"></div>
      </a>
      <% var item = topList[2]; %>
      <% var jsClass = "js-new-page"; %>
      <% var jsUrl = "javascript:;"; %>
      <% if ( String(item.action) === "0" ) { %>
        <% jsUrl = "/fe/app/client/mall/html/detail-page/goods-detail.html"; %>
      <% } else if ( String(item.action) === "1" ) { %>
        <% jsUrl = "/fe/app/client/mall/html/share-page/share.html"; %>
      <% } else if ( String(item.action) === "2" ) { %>
        <% jsUrl = item.url; %>
      <% } else if ( String(item.action) === "3" ) { %>
        <% jsClass = "js-get-url"; %>
      <% } else if ( String(item.action) === "4" ) { %>
        <% jsUrl = "/fe/app/client/mall/html/active-page/scratch-card/main.html"; %>
      <% } else if ( String(item.action) === "5" ) { %>
        <% jsUrl = "/fe/app/client/mall/html/menu/category.html"; %>
      <% } %>
      <a
        data-log-click="<%= appName %>-top|<%= item.productid %>|<%= item.title %>@click@index"
        data-productid="<%= item.productid %>"
        data-title="<%= item.title %>"
        data-classify="<%= item.classify || '' %>"
        class="<%= jsClass %> block"
        href="<%= jsUrl %>"
      >
        <div class="goods goods-3" data-echo-background="<%= item.img %>"></div>
      </a>
    </div>
  </div>
</section>
<% } %>
<% _.each(goodsList, function(group) { %>
  <dl class="home-goods-area clearfix">
    <dt class="home-goods-dt"><%= group.title %></dt>
    <% _.each(group.products, function(item) { %>
      <dd class="js-touch-state home-goods-area-son fl">
        <% var jsClass = "js-new-page"; %>
        <% var jsUrl = "javascript:;"; %>
        <% if ( String(item.action) === "0" ) { %>
          <% jsUrl = "/fe/app/client/mall/html/detail-page/goods-detail.html"; %>
        <% } else if ( String(item.action) === "1" ) { %>
          <% jsUrl = "/fe/app/client/mall/html/share-page/share.html"; %>
        <% } else if ( String(item.action) === "2" ) { %>
          <% jsUrl = item.url; %>
        <% } else if ( String(item.action) === "3" ) { %>
          <% jsClass = "js-get-url"; %>
        <% } else if ( String(item.action) === "4" ) { %>
          <% jsUrl = "/fe/app/client/mall/html/active-page/scratch-card/main.html"; %>
        <% } else if ( String(item.action) === "5" ) { %>
          <% jsUrl = "/fe/app/client/mall/html/menu/category.html"; %>
        <% } %>
        <a
          data-log-click="<%= appName %>-block|<%= item.productid %>|<%= item.title %>@click@index"
          data-productid="<%= item.productid %>"
          data-title="<%= item.title %>"
          data-classify="<%= item.classify || '' %>"
          class="<%= jsClass %> block"
          href="<%= jsUrl %>"
        >
          <div class="home-text-bar">
            <p class="home-text-bar-p home-pic-tit"><%= item.title %><span class="state-icon <%= item.stateicon %> "></span></p>
            <p class="home-text-bar-p home-pic-detail"><%= item.detail %></p>
          </div>
          <div class="home-pic-bar">
            <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= item.img %>" class="home-goods-pic" >
          </div>
          <div class="home-value-common"><%= item.pprice %></div>
        </a>
      </dd>
    <% }) %>
  </dl>
<% }) %>
