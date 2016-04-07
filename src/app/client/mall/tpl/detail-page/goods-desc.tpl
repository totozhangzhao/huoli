<div class="desc-container">
  <% data.forEach(function(elem) { %>
    <% if (elem.name) { %>
    <p><%= elem.name %></p>
    <% } %>
    <% if (elem.img) { %>
    <img src="<%= elem.img %>">
    <% } %>
  <% }); %>
</div>
