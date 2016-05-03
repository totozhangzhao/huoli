<div class="my-portrait-area">
  <img src="http://cdn.rsscc.cn/guanggao/img/icon/my-mall-pic.png?a=v" alt="">
  <% if ( level && level > 0 && level < 9 ) { %>
  <b class="my-icon <%= 'v' + level %>"></b>
  <% } %>
</div>
<div class="my-tel-area num-font"><%= phone %></div>
<div class="my-info-area num-font"><span>成长值：--</span><span>积分：<%= points %></span></div>
