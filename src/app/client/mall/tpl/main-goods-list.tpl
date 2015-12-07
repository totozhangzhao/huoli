<% if (topList && topList.length === 3) { %>
<section class="home-goods-area clearfix">
  <div class="panel-container flex-row">
    <div class="panel-block-left">
      <% var item = topList[0]; %>
      <a
        data-log-click="<%= appName %>-top_<%= item.productid %>_<%= item.title %>@click@index"
        data-productid="<%= item.productid %>"
        data-title="<%= item.title %>"
        data-classify="<%= item.classify || '' %>"
        class="<%= tplUtil.getJsClass(item) %> block"
        href="<%= tplUtil.getBlockUrl(item) %>"
      >
        <div class="echo-block op0 goods goods-1" data-echo-background="<%= item.img %>"></div>
      </a>
    </div>
    <div class="panel-block-right flex-column">
      <% var item = topList[1]; %>
      <a
        data-log-click="<%= appName %>-top_<%= item.productid %>_<%= item.title %>@click@index"
        data-productid="<%= item.productid %>"
        data-title="<%= item.title %>"
        data-classify="<%= item.classify || '' %>"
        class="<%= tplUtil.getJsClass(item) %> block"
        href="<%= tplUtil.getBlockUrl(item) %>"
      >
        <div class="echo-block op0 goods goods-2" data-echo-background="<%= item.img %>"></div>
      </a>
      <% var item = topList[2]; %>
      <a
        data-log-click="<%= appName %>-top_<%= item.productid %>_<%= item.title %>@click@index"
        data-productid="<%= item.productid %>"
        data-title="<%= item.title %>"
        data-classify="<%= item.classify || '' %>"
        class="<%= tplUtil.getJsClass(item) %> block"
        href="<%= tplUtil.getBlockUrl(item) %>"
      >
        <div class="echo-block op0 goods goods-3" data-echo-background="<%= item.img %>"></div>
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
        <a
          data-log-click="<%= appName %>-block_<%= item.productid %>_<%= item.title %>@click@index"
          data-productid="<%= item.productid %>"
          data-title="<%= item.title %>"
          data-classify="<%= item.classify || '' %>"
          class="<%= tplUtil.getJsClass(item) %> block"
          href="<%= tplUtil.getBlockUrl(item) %>"
        >
          <div class="home-text-bar">
            <p class="home-text-bar-p home-pic-tit"><%= item.title %><span class="state-icon <%= item.stateicon %> "></span></p>
            <p class="home-text-bar-p home-pic-detail"><%= item.detail %></p>
          </div>
          <div class="home-pic-bar">
            <img src="/fe/com/mobile/image/grey.gif" data-echo="<%= item.img %>" class="home-goods-pic op0" >
          </div>
          <div class="home-value-common"><%= item.pprice %></div>
        </a>
      </dd>
    <% }) %>
  </dl>
<% }) %>
