<dl class="home-goods-area clearfix">
  <% _.each(group.products, function(item) { %>
    <dd class="js-touch-state home-goods-area-son fl">
      <a
        data-log-mall-click="block-<%= item.productid %>-<%= item.title %>"
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
