<div id="categoryScroll" class="home-list-fa">
  <p>
    <% _.each(dataList, function (item, index) {%>

      <span class="<%= (index == 0 ? 'on' : '') %>" data-category-item="<%= item.title.slice(0,4) %>">
      <%= item.title %>
      </span>
    <% }); %>
  </p>
</div>
<!-- home-rotate-switch 控制箭头方向与菜单的显示隐藏 -->
<div class="home-list-switch home-rotate-switch">
  <em class="home-switch-icon"></em>
</div>
<div class="home-pull-area clearfix">
  <% _.each(dataList, function (item, index) {%>
    <a data-category-item="<%= item.title %>" class="<%= (index == 0 ? 'on' : '') %>"><%= item.title.slice(0,4)%></a>
  <% }); %>
</div>