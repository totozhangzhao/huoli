<% _.each(list, function(param, index) { %>
<p class="url-title"><%= param.title %></p>
<textarea class="url-content mall-input common-margin"><%= param.content %></textarea>
<% }); %>
