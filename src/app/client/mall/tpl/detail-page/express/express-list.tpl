<% _.each(dataList, function (express, index) { %>
<nav class="delivery-nav clearfix <%= express.tracking === curTracking ? 'open': ''%>" data-express="<%= express.tracking %>">
  <div class="delivery-info fl"><%= express.company %></div>
  <div class="delivery-info num-font fl"><%= express.tracking %></div>
</nav>
<ul class="delivery-status-bar">
  <% if(!express.data || express.data.length === 0 ) { %>
    <li style="text-align: center;">暂无物流信息</li>
  <%}%>
  <% _.each(express.data, function(expressInfo, index) { %>
    <% if ( index === 0 ) { %>
      <li class="delivery-status clearfix">
        <div class="delivery-time-pos">
          <div>
            <p class="num-font"><%= expressInfo.time.split(" ")[0] %></p>
            <p class="num-font"><%= expressInfo.time.split(" ")[1] %></p>
          </div>
        </div>
        <div class="delivery-time-pos fr"><%= expressInfo.context %></div>
        <span class="delivery-line delivery-line-finish"><b class="delivery-bg"></b><b class="delivery-roll"></b></span>
      </li>
    <% } else { %>
      <li class="delivery-status clearfix">
        <div class="delivery-time-pos">
          <div>
            <p class="num-font"><%= expressInfo.time.split(" ")[0] %></p>
            <p class="num-font"><%= expressInfo.time.split(" ")[1] %></p>
          </div>
        </div>
        <div class="delivery-time-pos fr"><%= expressInfo.context %></div>
        <span class="delivery-line"><b class="delivery-bg"></b><b class="delivery-roll"></b></span>
      </li>
    <% } %>
  <% }) %>
</ul>
<%});%>