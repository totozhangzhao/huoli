<div id="categoryScroll" class="home-list-fa">
  <p>
    <% _.each(dataList, function (item, index) {%>
      <span 
        data-log-mall-click="index-category_<%= item.title %>"
        data-info="index-category-<%= index %>"
        class="<%= (index == 0 ? 'on' : '') %>" 
        data-scroll-item="true" 
        data-group-id="<%= item.groupId %>"
        >
      <%= item.title.slice(0, 4) %>
      </span>
    <% }); %>
  </p>
</div>
<!-- home-rotate-switch 控制箭头方向与菜单的显示隐藏 -->
<% if(dataList.length > 4 ) { %>
<div class="home-list-switch">
  <div class="home-switch-hr"></div>
  <em class="home-switch-icon"></em>
</div>
<% } %>

<div class="home-pull-content">
  <div class="home-pull-area clearfix">
    <% _.each(dataList, function (item, index) {%>
      <a 
      data-log-mall-click="index-category-sub_<%= item.title %>"
      data-group-id="<%= item.groupId %>" 
      data-info="index-subcategory-<%= index %>"
      class="<%= (index == 0 ? 'on' : '') %>"
      ><%= item.title.slice(0,4)%></a>
    <% }); %>
  </div>
</div>
