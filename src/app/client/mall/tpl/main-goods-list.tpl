<% _.each(goodsList, function(group) { %>
  <% if (group.title === "置顶") { %>
    <% if (group.products.length === 3) { %>
    <div class="home-show-area clearfix">
      <div class="home-recommend home-big-bar border border-r fl">
        <% var item = group.products[0] %>
        <% var jsClass = "js-new-page"; %>
        <% var jsUrl = "javascript:;" %>
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
            <p class="home-common-tit">
              <b class="home-common-tit-icon fl"></b><span class="fl"><%= item.title %></span>
            </p>
            <p class="home-big-pic-detail"><%= item.detail %></p>
            <div class="home-value-common home-value-money">
              <p class="home-value-p num-font fl"><%= item.pprice %></p>
              <b class="home-value-icon fl"></b>
            </div>
          </div>
          <div class="home-big-pic-bar">
            <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= item.img %>" class="home-big-goods-pic" >
          </div>
        </a>
      </div>
      <div class="home-limit home-small-bar border border-l fr">
        <% var item = group.products[1] %>
        <% var jsClass = "js-new-page"; %>
        <% var jsUrl = "javascript:;" %>
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
          <div class="home-show-text-bar fl">
            <p class="home-common-tit">
              <b class="home-common-tit-icon fl"></b><span class="fl"><%= item.title %></span>
            </p>
            <p class="home-small-pic-detail"><%= item.detail %></p>
            <div class="home-value-common home-value-point-money">
              <p class="home-value-p num-font fl"><%= item.pprice %></p>
              <b class="home-value-icon fl"></b>
            </div>
          </div>
          <div class="home-show-pic-bar fl">
            <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= item.img %>" class="home-small-goods-pic" >
          </div>
        </a>
      </div>
      <div class="home-hot home-small-bar border border-l fr">
        <% var item = group.products[2] %>
        <% var jsClass = "js-new-page"; %>
        <% var jsUrl = "javascript:;" %>
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
          <div class="home-show-text-bar fl">
            <p class="home-common-tit">
              <b class="home-common-tit-icon fl"></b><span class="fl"><%= item.title %></span>
            </p>
            <p class="home-small-pic-detail"><%= item.detail %></p>
            <div class="home-value-common home-value-point">
              <p class="home-value-p num-font fl"><%= item.pprice %></p>
              <b class="home-value-icon fl"></b>
            </div>
          </div>
          <div class="home-show-pic-bar fl">
            <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= item.img %>" class="home-small-goods-pic" >
          </div>
        </a>
      </div>
    </div>
    <% } %>
  <% } else { %>
    <dl class="home-goods-area clearfix">
      <dt class="home-goods-dt">
        <fieldset class="home-filed-box">
          <legend>&nbsp;<%= group.title %>&nbsp;</legend>
        </fieldset>
      </dt>
      <% _.each(group.products, function(item) { %>
        <dd class="home-goods-area-son border fl">
        <% var jsClass = "js-new-page"; %>
        <% var jsUrl = "javascript:;" %>
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
              <!--
                1.积分: home-value-point
                2.支付: home-value-money
                3.积分与支付: home-value-point-money
                4.活动结束: home-value-end
              -->
              <div class="home-value-common <%= item.type %> ">
                <p class="home-value-p num-font fl"><%= item.pprice %></p>
                <b class="home-value-icon fl"></b>
              </div>
            </div>
            <div class="home-pic-bar">
              <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= item.img %>" class="home-goods-pic" >
            </div>
          </a>
        </dd>
      <% }) %>
    </dl>
  <% } %>
<% }) %>
