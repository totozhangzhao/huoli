<div class="common-switch-nav" style="margin-top:-45px;">
  <div class="common-switch-bar">
    <span class="common-switch-icon"></span>
    <a href="/fe/app/client/mall/index.html" class="common-mall-index">商城首页</a>
  </div>

  <div class="common-switch-bar">
    <span class="common-switch-tip">切换至</span>
    <% if(mallUitl.isHangbanFunc()) {%>
      <a href="https://mall.rsscc.cn/fe/app/client/mall/index.html" class="common-switch-button">高铁商城</a>
    <% } else {%>
      <a href="https://hbmall.rsscc.cn/fe/app/client/mall/index.html" class="common-switch-button">航班商城</a>
    <% } %>
  </div>
</div>