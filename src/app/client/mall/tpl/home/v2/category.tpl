<div id="categoryScroll" class="home-list-fa">
  <p>
    <% _.each(dataList, function (item, index) {%>
      <span 
        data-log-mall-click="index-category_<%= item.classify %>"
        class="<%= (index == 0 ? 'on' : '') %>" 
        data-scroll-item="true" 
        data-category-item="<%= item.classify %>"
        >
      <%= item.title.slice(0, 4) %>
      </span>
    <% }); %>
  </p>
</div>
<!-- home-rotate-switch 控制箭头方向与菜单的显示隐藏 -->
<div class="home-list-switch">
  <em class="home-switch-icon"></em>
</div>
<div class="home-pull-area clearfix">
  <% _.each(dataList, function (item, index) {%>
    <a 
    data-log-mall-click="index-category-sub_<%= item.classify %>"
    data-category-item="<%= item.classify %>" 
    class="<%= (index == 0 ? 'on' : '') %>"
    ><%= item.title.slice(0,4)%></a>
  <% }); %>
</div>