<div class="common-switch-nav">
  <div class="common-switch-bar">
    <span class="common-switch-icon"></span>
    <a class="js-index-page common-mall-index">首页</a>
  </div>

  <div class="common-switch-bar">
    <span class="common-switch-tip">切换至</span>
    <% if(mallUtil.isHangbanFunc()) {%>
      <a class="js-switch common-switch-button">高铁商城</a>
    <% } else {%>
      <a class="js-switch common-switch-button">航班商城</a>
    <% } %>
  </div>
</div>