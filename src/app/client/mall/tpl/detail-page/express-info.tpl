<nav class="delivery-nav clearfix">
  <div class="delivery-info fl"><%= company %></div>
  <div class="delivery-info num-font fl"><%= tracking %></div>
</nav>
<ul class="delivery-status-bar">
  <% _.each(infoList, function(expressInfo, index) { %>
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
